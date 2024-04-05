import cv2
from prisma import Prisma
from core.person_detect.detect import detect as person_detect
from core.licence_plate.detect import detect as plate_detect


async def run_model(filename, footage_id, usecase):
    cap = cv2.VideoCapture("./core/videos/uploads/" + filename)
    db = Prisma()

    await db.connect()

    assert cap.isOpened(), "Error reading video file"

    skip_frame = False

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        if skip_frame:
            skip_frame = False
            continue

        skip_frame = True

        # Get frame timestamp in milliseconds
        frame_timestamp = cap.get(cv2.CAP_PROP_POS_MSEC)

        # Convert timestamp to seconds
        timestamp_sec = frame_timestamp / 1000

        # Calculate hours, minutes, and seconds
        hours = int(timestamp_sec // 3600)
        minutes = int((timestamp_sec % 3600) // 60)
        seconds = int((timestamp_sec % 3600) % 60)

        # Format the timestamp string
        timestamp = f"{hours:02}:{minutes:02}:{seconds:02}"

        if usecase == "person_detect":
            await person_detect(frame, timestamp, footage_id, db)
        elif usecase == "licence_plate":
            await plate_detect(frame, timestamp, footage_id, db)
    await db.disconnect()
