from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes import chat, footage

app = FastAPI()

@app.get("/")
def read_root():
    return {"success": True, "message": "API Running Successfully"}

app.mount("/static", StaticFiles(directory="./core/videos/trimmed"), name="static")
app.include_router(chat.app, prefix="/api/chat", tags=["chat"])
app.include_router(footage.app, prefix="/api/footage", tags=["footage"])
