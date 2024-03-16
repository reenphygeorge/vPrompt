from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import shutil
import os
from services.footage.upload import model_service

app = APIRouter()


class FootageSearch(BaseModel):
    plateNumber: str


@app.post("/upload")
async def model_execute(file: UploadFile = File(...), chatId: str = Form(...)):
    try:
        return await model_service(file, chatId)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Something Went Wrong!"},
        )


@app.get("/search")
async def get_footage(data: FootageSearch):
    try:
        return {"success": True, "message": "Footage Timestamps"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Something Went Wrong!"},
        )
