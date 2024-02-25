from prisma import Prisma
from pydantic import BaseModel
from fastapi.responses import JSONResponse

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
    if result["success"]:
        return await db.message.create(
            {
                "prompt": data.prompt,
                "response": "",
                "chat": {"connect": {"id": data.chatId}},
            }
        )
        # Call llm
    await db.disconnect()
    return JSONResponse(
        status_code=400, content={"success": False, "message": "Invalid Chat"}
    )
