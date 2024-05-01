from fastapi import UploadFile
from fastapi.responses import JSONResponse
from prisma import Prisma
from shutil import copyfileobj
from services.chat import get_chat_info
from os import makedirs, path, environ
from dotenv import load_dotenv
from core.main import run_model
from services.footage.videodata import search_by_footage
from utils.list import no_repeat_list
from utils.suggestions import get_suggestions

load_dotenv()
api_host_url = environ["API_HOST_URL"]


async def model_service(file: UploadFile, chat_id: str):
    db = Prisma()
    await db.connect()

    # Checking if chat is valid
    result = await get_chat_info(chat_id)
    usecase = result["data"].usecase
    await db.disconnect()
    if result["success"] == False:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Invalid Chat",
                "log:": f"{api_host_url}/logs/error.log",
            },
        )

    result = upload_footage(file)
    if result["success"] == False:
        return JSONResponse(status_code=400, content=result)
    else:
        result = await update_db(file.filename, chat_id)
        await run_model(file.filename, result.id, usecase)

        # Suggested prompts
        await db.connect()
        suggestions = await get_suggestions(db, usecase, result.id)

        return {
            "success": True,
            "data": {"id": chat_id},
            "message": "Video Processed Successfully",
            "suggestions": suggestions,
        }


def upload_footage(file: UploadFile):
    UPLOAD_DIR = "./core/videos/uploads"
    # Ensure the upload directory exists
    makedirs(UPLOAD_DIR, exist_ok=True)
    # Check if the uploaded file is an MP4 video
    if not file.filename.endswith(".mp4"):
        return {
            "success": False,
            "message": "File Not Supported",
            "log": f"{api_host_url}/logs/error.log",
        }

    # Save the uploaded file to the server
    file_path = path.join(UPLOAD_DIR, file.filename)

    # To avoid file overwrite
    if path.exists(file_path):
        return {
            "success": False,
            "message": "Change file name",
            "log:": f"{api_host_url}/logs/error.log",
        }

    with open(file_path, "wb") as buffer:
        copyfileobj(file.file, buffer)

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
