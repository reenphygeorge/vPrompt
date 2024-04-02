async def update_footage(db, timestamp, text_data, footage_id, class_name):
    video_data_result = await db.videodata.find_many(
        where={
            "timestamp": timestamp,
            "text_data": text_data,
            "footage_id": footage_id,
        }
    )

    if len(video_data_result) == 0:
        await db.videodata.create(
            {
                "timestamp": timestamp,
                "text_data": text_data,
                "class_name": class_name,
                "footage": {"connect": {"id": footage_id}},
            }
        )


async def search_footage(db, plate_number, footage_id):
    return await db.videodata.find_many(
        where={
            "text_data": plate_number,
            "footage_id": footage_id,
        }
    )
