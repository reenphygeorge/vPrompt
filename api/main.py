from fastapi import FastAPI
from routes import chat, footage

app = FastAPI()


@app.get("/")
def read_root():
    return {"success": True, "message": "API Running Successfully"}


app.include_router(chat.app, prefix="/api/chat", tags=["chat"])
app.include_router(footage.app, prefix="/api/footage", tags=["footage"])
