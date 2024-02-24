async def update_footage(db, timestamp, plate_number, footage_id):
    video_data_result = await db.videodata.find_many(
        where={"timestamp": timestamp, "plateNumber": plate_number}
    )

    if len(video_data_result) == 0:
        await db.videodata.create(
            {
                "timestamp": timestamp,
                "plateNumber": plate_number,
                "footage": {"connect": {"id": footage_id}},
            }
        )
