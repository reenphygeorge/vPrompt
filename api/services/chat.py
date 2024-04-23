from json import dumps, loads
from os import path, makedirs, environ
from prisma import Prisma
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from llm.person_detect import extract_prompt_data as person_extract
from llm.licence_plate import extract_prompt_data as plate_extract
from services.footage.videodata import search_by_class, search_by_text_data
from utils.cache import add_cache, get_cache
from utils.list import no_repeat_list
from utils.video_fetcher import video_trimmer
from utils.plotter import plotter
from services.footage.delete import delete_footage
from dotenv import load_dotenv

load_dotenv()
api_host_url = environ["API_HOST_URL"]


class CreateMessage(BaseModel):
    chat_id: str
    prompt: str


async def get_all_chats(page: int, limit: int):
    db = Prisma()
    await db.connect()
    result = await db.chat.find_many(skip=(page - 1) * limit, take=limit)
    result.sort(key=lambda user: user.created_at, reverse=True)
    await db.disconnect()
    data = {"success": True, "data": result}
    return data


async def get_chat_by_id(chat_id: str, page: int, limit: int):
    db = Prisma()
    await db.connect()
    result = await db.message.find_many(
        where={"chat_id": chat_id}, skip=(page - 1) * limit, take=limit
    )
    await db.disconnect()
    if result:
        return {"success": True, "data": result}
    return {"success": False, "data": result}


async def get_chat_info(chat_id: str):
    db = Prisma()
    await db.connect()
    result = await db.chat.find_first(
        where={"id": chat_id},
        include={"message": False, "footage": True},
    )
    await db.disconnect()
    if result:
        return {"success": True, "data": result}
    return {"success": False, "data": result}


async def create_new_chat(usecase: str):
    if usecase not in ("person_detect", "licence_plate"):
        return JSONResponse(
            status_code=400, content={"success": False, "message": "Invalid usecase"}
        )
    db = Prisma()
    await db.connect()
    result = await db.chat.create({"title": "New chat", "usecase": usecase})
    await db.disconnect()
    data = {"success": True, "data": result, "message": "New Chat Created"}
    return data


async def delete_chat_by_id(chat_id: str):
    db = Prisma()
    await db.connect()
    result = await get_chat_info(chat_id)
    if result["success"]:
        chat_result = await db.chat.delete(where={"id": chat_id})
        await delete_footage(chat_result.footage_id)
        return {"success": True, "data": chat_result, "message": "Chat Deleted"}
    await db.disconnect()
    return JSONResponse(
        status_code=400, content={"success": False, "message": "Invalid Chat"}
    )


async def create_new_message(data: CreateMessage):
    db = Prisma()
    await db.connect()

    # Checking if chat is valid
    result = await get_chat_info(data.chat_id)

    if result["success"] == False:
        return {"success": False, "message": "Invalid Chat"}
    usecase = result["data"].usecase

    footage_id = result["data"].footage.id
    filename = result["data"].footage.filename

    try:
        if result["data"].usecase == "person_detect":
            extracted_datas = person_extract(data.prompt)
        elif result["data"].usecase == "licence_plate":
            extracted_datas = plate_extract(data.prompt)
    except Exception as e:
        return {"success": False, "message": "No data found in prompt"}

    response = []
    json_response = []
    trim_filenames = []

    for extracted_data in extracted_datas:
        output_filename = f"{extracted_data}_{filename}"
        dir_path = f"./core/videos/trimmed/{footage_id}"

        # Create footage directory if not exist
        if path.exists(dir_path) == False:
            makedirs(dir_path)

        file_path = f"{dir_path}/{output_filename}"
        # Check in redis
        # cache_data = get_cache(output_filename)
        # if cache_data != None and path.exists(file_path) == True:
        #     response.append(loads(cache_data))
        #     json_response.append(cache_data.decode("utf-8"))
        #     continue

        # Fetch from db
        if usecase == "person_detect":
            search_datas = await search_by_class(db, extracted_data, footage_id)
        elif usecase == "licence_plate":
            search_datas = await search_by_text_data(db, extracted_data, footage_id)
        search_datas.sort(key=lambda videodata: videodata.timestamp, reverse=False)

        if len(search_datas) == 0:
            response_data = {
                "prompt_data": extracted_data,
                "message": "No data found",
            }
            response.append(response_data)
            json_response.append(dumps(response_data))
            continue

        timestamps = []
        plot_data = []

        for search_data in search_datas:
            timestamps.append(search_data.timestamp)
            plot_data.append([search_data.timestamp,*search_data.object_box])

        timestamps = no_repeat_list(timestamps)
        
        print(plot_data)

        # No re-trimming if trimmed video already present
        if path.exists(file_path) == False:
            output_filename = video_trimmer(
                timestamps, filename, extracted_data, footage_id
            )

        plotter(output_filename,plot_data,output_filename)

        url = f"{api_host_url}/videos/{footage_id}/{output_filename}"

        trim_filenames.append(output_filename)

        response_data = {
            "prompt_data": extracted_data,
            "timestamps": timestamps,
            "url": url,
        }

        add_cache(output_filename, response_data, True)

        response.append(response_data)

        json_response.append(dumps(response_data))

    await db.chat.update(
        where={"id": data.chat_id},
        data={
            "title": data.prompt,
        },
    )

    await db.message.create(
        {
            "prompt": data.prompt,
            "response": json_response,
            "chat": {"connect": {"id": data.chat_id}},
        }
    )
    await db.disconnect()
    return {"success": True, "data": response}
