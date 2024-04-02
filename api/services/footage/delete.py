from prisma import Prisma
from os import path, remove
from shutil import rmtree


async def delete_footage(footage_id):
    db = Prisma()
    await db.connect()
    footage_result = await db.footage.delete(where={"id": footage_id})
    dir_path = f"./core/videos/trimmed/{footage_id}"
    file_path = f"./core/videos/uploads/{footage_result.filename}"
    if path.exists(dir_path):
        rmtree(dir_path)
    if path.exists(file_path):
        remove(file_path)
    await db.disconnect()
