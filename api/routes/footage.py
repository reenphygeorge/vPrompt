from logging import exception
from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
from services.footage.upload import model_service
from dotenv import load_dotenv
from os import path, remove, environ

load_dotenv()
api_host_url = environ["API_HOST_URL"]

app = APIRouter()


@app.post("/upload")
async def model_execute(usecase: str, file: UploadFile = File(...)):
    try:
        # Save video and run model
        return await model_service(file, usecase)
    except Exception as e:
        # Delete video file if processing failed, to allow retry with same file
        UPLOAD_DIR = "./core/videos/uploads"
        file_path = path.join(UPLOAD_DIR, file.filename)
        if path.exists(file_path):
            remove(file_path)
        exception(e)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Something Went Wrong!",
                "log": f"{api_host_url}/logs/error.log",
            },
        )
