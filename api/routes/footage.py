from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import shutil
import os
from services.footage.upload import model_service

app = APIRouter()


@app.post("/upload")
async def model_execute(file: UploadFile = File(...), chatId: str = Form(...)):
    try:
        return await model_service(file, chatId)
    except Exception as e:
        # Delete video file if processing failed, to allow retry with same file
        UPLOAD_DIR = "./core/videos/uploads"
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        if os.path.exists(file_path):
            os.remove(file_path)
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Something Went Wrong!"},
        )