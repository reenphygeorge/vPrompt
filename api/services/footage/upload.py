from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from prisma import Prisma
from pydantic import BaseModel
import shutil
import os
from services.chat import get_chat_by_id
from core.main import run_model


async def model_service(file: UploadFile, chat_id: str):

    db = Prisma()
    await db.connect()

    # Checking if chat is valid
    result = await get_chat_by_id(chat_id)
    await db.disconnect()
    if result["success"] == False:
        return JSONResponse(
            status_code=400, content={"success": False, "message": "Invalid Chat"}
        )

    result = upload_footage(file)
    if result["success"] == False:
        return JSONResponse(status_code=400, content=result)
    else:
        result = await update_db(file.filename, chat_id)
        await run_model(file.filename, result.id)
        return {"success": True, "message": "Video Processed Successfully"}


def upload_footage(file: UploadFile):
    UPLOAD_DIR = "./core/videos/uploads"
    # Ensure the upload directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    # Check if the uploaded file is an MP4 video
    if not file.filename.endswith(".mp4"):
        return {"success": False, "message": "File Not Supported"}

    # Save the uploaded file to the server
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # To avoid file overwrite
    if os.path.exists(file_path):
        return {"success": False, "message": "Change file name"}

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Return the file name and additional metadata
    return {"success": True, "message": "Upload Success"}


async def update_db(filename: str, chat_id: str):
    db = Prisma()
    await db.connect()
    result = await db.footage.create(
        {
            "filename": filename,
            "chat": {"connect": {"id": chat_id}},
        }
    )
    await db.disconnect()
    return result
