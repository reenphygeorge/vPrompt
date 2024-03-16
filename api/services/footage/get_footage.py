from prisma import Prisma


async def get_footage(footage_id: str):
    db = Prisma()
    await db.connect()
    result = await db.footage.find_unique(where={"id": footage_id})
    await db.disconnect()
    return result
