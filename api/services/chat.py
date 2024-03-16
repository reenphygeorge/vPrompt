from prisma import Prisma
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from llm.licence_plate import extract_prompt_data
from core.licence_plate.db import search_footage
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
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": "Invalid Chat"},
        )

    footage_id = result["data"].footageId
    try:
        extracted_data = extract_prompt_data(data.prompt)
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": "No plate numbers found"},
        )

    search_datas = await search_footage(db, extracted_data[0], footage_id)
    search_datas.sort(key=lambda videodata: videodata.timestamp, reverse=False)

    footage_data = await get_footage(footage_id)

    if len(search_datas) == 0:
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": "No vehicle data found"},
        )

    timestamps = []

    for search_data in search_datas:
        timestamps.append(search_data.timestamp)

    timestamps = no_repeat_list(timestamps)

    trim_filename = video_trimmer(timestamps, footage_data.filename)

    response = await db.message.create(
        {
            "prompt": data.prompt,
            "response": timestamps,
            "chat": {"connect": {"id": data.chatId}},
        }
    )
    await db.disconnect()
    return response, trim_filename
