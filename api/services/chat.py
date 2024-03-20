from json import dumps, loads
from os import path
from prisma import Prisma
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from llm.licence_plate import extract_prompt_data
from services.footage.videodata import search_footage
from utils.list import no_repeat_list
from utils.video_fetcher import video_trimmer
from services.footage.get_footage import get_footage
from utils.cache import add_cache, get_cache


class CreateMessage(BaseModel):
    chatId: str
    prompt: str


async def get_all_chats():
    db = Prisma()
    await db.connect()
    result = await db.chat.find_many()
    result.sort(key=lambda user: user.createdAt, reverse=True)
    await db.disconnect()
    data = {"success": True, "data": result}
    return data


async def get_chat_by_id(chatId: str):
    db = Prisma()
    await db.connect()
    result = await db.chat.find_unique(where={"id": chatId}, include={"message": True})
    await db.disconnect()
    if result:
        return {"success": True, "data": result}
    return {"success": False, "data": result}


async def get_chat_info(chatId: str):
    db = Prisma()
    await db.connect()
    result = await db.chat.find_first(
        where={"id": chatId}, include={"message": False, "footage": True}
    )
    await db.disconnect()
    if result:
        return {"success": True, "data": result}
    return {"success": False, "data": result}


async def create_new_chat():
    db = Prisma()
    await db.connect()
    result = await db.chat.create(data={})
    await db.disconnect()
    data = {"success": True, "data": result, "message": "New Chat Created"}
    return data


async def delete_chat_by_id(chatId: str):
    db = Prisma()
    await db.connect()
    result = await get_chat_by_id(chatId)
    if result["success"]:
        result = await db.chat.delete(where={"id": chatId})
        return {"success": True, "data": result, "message": "Chat Deleted"}
    await db.disconnect()
    return JSONResponse(
        status_code=400, content={"success": False, "message": "Invalid Chat"}
    )


async def create_new_message(data: CreateMessage):
    db = Prisma()
    await db.connect()

    result = await get_chat_info(data.chatId)
    footage_id = result["data"].footage.id
    filename = result["data"].footage.filename

    if result["success"] == False:
        return {"success": False, "message": "Invalid Chat"}

    try:
        extracted_plate_numbers = extract_prompt_data(data.prompt)
    except Exception as e:
        return {"success": False, "message": "No plate numbers found"}

    response = []
    json_response = []
    trim_filenames = []

    for plate_number in extracted_plate_numbers:
        output_filename = f"{plate_number}_{filename}"
        file_path = f"./core/videos/trimmed/{output_filename}"

        # Check in redis
        cache_data = get_cache(output_filename)
        if cache_data != None:
            response.append(loads(cache_data))
            json_response.append(cache_data.decode("utf-8"))
            continue

        # Fetch from db and add to redis
        search_datas = await search_footage(db, plate_number, footage_id)
        search_datas.sort(key=lambda videodata: videodata.timestamp, reverse=False)

        if len(search_datas) == 0:
            return {"success": False, "message": "No vehicle data found"}

        timestamps = []

        for search_data in search_datas:
            timestamps.append(search_data.timestamp)

        timestamps = no_repeat_list(timestamps)

        # No re-trimming if trimmed video already present
        if path.exists(file_path) == False:
            output_filename = video_trimmer(timestamps, filename, plate_number)

        url = f"http://localhost:8000/static/{output_filename}"

        trim_filenames.append(output_filename)

        response_data = {
            "plate_number": plate_number,
            "timestamps": timestamps,
            "url": url,
        }

        add_cache(output_filename, response_data, True)

        response.append(response_data)

        json_response.append(dumps(response_data))

    await db.message.create(
        {
            "prompt": data.prompt,
            "response": json_response,
            "chat": {"connect": {"id": data.chatId}},
        }
    )
    await db.disconnect()
    return {"success": True, "data": response}
