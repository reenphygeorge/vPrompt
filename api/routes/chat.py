from logging import exception
from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from services.chat import (
    get_all_chats,
    get_chat_by_id,
    create_new_chat,
    delete_chat_by_id,
    create_new_message,
)
from dotenv import load_dotenv
from os import environ

load_dotenv()
api_host_url = environ["API_HOST_URL"]

app = APIRouter()


class CreateMessage(BaseModel):
    chat_id: str
    prompt: str


@app.get("/")
async def get_chat(id: str = None, page: int = 1, limit: int = 10):
    try:
        if id is not None:
            return await get_chat_by_id(id, page, limit)
        else:
            return await get_all_chats(page, limit)
    except Exception as e:
        exception(e)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Something Went Wrong!",
                "log": f"{api_host_url}/logs/error.log",
            },
        )


@app.post("/")
async def create_chat():
    try:
        return await create_new_chat()
    except Exception as e:
        exception(e)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Something Went Wrong!",
                "log": f"{api_host_url}/logs/error.log",
            },
        )


@app.delete("/")
async def delete_chat(id: str = Form(...)):
    try:
        return await delete_chat_by_id(id)
    except Exception as e:
        exception(e)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Something Went Wrong!",
                "log": f"{api_host_url}/logs/error.log",
            },
        )


@app.post("/message")
async def new_message(data: CreateMessage):
    try:
        response = await create_new_message(data)
        if response["success"] == False:
            return JSONResponse(status_code=400, content=response)
        return {"success": True, "content": response["data"]}
    except Exception as e:
        exception(e)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Something Went Wrong!",
                "log": f"{api_host_url}/logs/error.log",
            },
        )
