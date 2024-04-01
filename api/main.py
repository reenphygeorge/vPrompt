from logging import basicConfig
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes import chat, footage

app = FastAPI()

# Init Logger
basicConfig(
    filename="./log/error.log",
    filemode="w",
    format="[%(asctime)s] - %(name)s - %(levelname)s - %(message)s",
)


@app.get("/")
def read_root():
    return {"success": True, "message": "API Running Successfully"}


app.mount("/videos", StaticFiles(directory="./core/videos/trimmed"), name="videos")
app.mount("/logs", StaticFiles(directory="./log"), name="logs")
app.include_router(chat.app, prefix="/api/chat", tags=["chat"])
app.include_router(footage.app, prefix="/api/footage", tags=["footage"])
