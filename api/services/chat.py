from json import dumps
from os import path
from prisma import Prisma
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from llm.licence_plate import extract_prompt_data
from services.footage.videodata import search_footage
from utils.list import no_repeat_list
from utils.video_fetcher import video_trimmer
from services.footage.get_footage import get_footage


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
    result = await get_chat_by_id(data.chatId)
    if result["success"] == False:
        return {"success": False, "message": "Invalid Chat"}

    footage_id = result["data"].footageId
    try:
        extracted_datas = extract_prompt_data(data.prompt)
    except Exception as e:
        return {"success": False, "message": "No plate numbers found"}

    response = []
    json_response = []
    trim_filenames = []

    for extracted_data in extracted_datas:
        search_datas = await search_footage(db, extracted_data, footage_id)
        search_datas.sort(key=lambda videodata: videodata.timestamp, reverse=False)

        footage_data = await get_footage(footage_id)

        if len(search_datas) == 0:
            return {"success": False, "message": "No vehicle data found"}

        timestamps = []

        for search_data in search_datas:
            timestamps.append(search_data.timestamp)

        timestamps = no_repeat_list(timestamps)

        output_filename = f"{extracted_data}_{footage_data.filename}"
        file_path = f"./core/videos/trimmed/{output_filename}"

        # No re-trimming if trimmed video already present
        if path.exists(file_path) == False:
            output_filename = video_trimmer(
                timestamps, footage_data.filename, extracted_data
            )

        url = f"http://localhost:8000/static/{output_filename}"

        trim_filenames.append(output_filename)

        response.append(
            {
                "plate_number": extracted_data,
                "timestamps": timestamps,
                "url": url,
            }
        )

        json_response.append(
            dumps(
                {
                    "plate_number": extracted_data,
                    "timestamps": timestamps,
                    "url": url,
                }
            )
        )

    await db.message.create(
        {
            "prompt": data.prompt,
            "response": json_response,
            "chat": {"connect": {"id": data.chatId}},
        }
    )
    await db.disconnect()
    return {"success": True, "data": response}
