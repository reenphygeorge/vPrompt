async def update_footage(db, timestamp, plate_number, footage_id, vehicle_type):
    video_data_result = await db.videodata.find_many(
        where={
            "timestamp": timestamp,
            "plateNumber": plate_number,
            "vehicleType": vehicle_type,
            "footageId": footage_id,
        }
    )

    if len(video_data_result) == 0:
        await db.videodata.create(
            {
                "timestamp": timestamp,
                "plateNumber": plate_number,
                "vehicleType": vehicle_type,
                "footage": {"connect": {"id": footage_id}},
            }
        )


async def search_footage(db, plate_number, footage_id):
    return await db.videodata.find_many(
        where={
            "plateNumber": plate_number,
            "footageId": footage_id,
        }
    )
