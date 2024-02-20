from ultralytics import YOLO
import cv2
from prisma import Prisma
import core.util
from core.sort.sort import *
from core.util import get_car, read_license_plate


async def run_model(filename: str, footageId: str):
    mot_tracker = Sort()

    # load models
    coco_model = YOLO("./core/models/yolov8n.pt")
    license_plate_detector = YOLO("./core/models/license_plate_detector.pt")

    # load video
    cap = cv2.VideoCapture("./core/video/" + filename)

    vehicles = [2, 3, 5, 7]

    # read frames
    frame_nmr = -1
    ret = True
    db = Prisma()
    await db.connect()
    while ret:
        frame_nmr += 1
        ret, frame = cap.read()
        if ret:
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

            # detect vehicles
            detections = coco_model(frame)[0]
            detections_ = []
            for detection in detections.boxes.data.tolist():
                x1, y1, x2, y2, score, class_id = detection
                if int(class_id) in vehicles:
                    detections_.append([x1, y1, x2, y2, score])

            # track vehicles
            track_ids = mot_tracker.update(np.asarray(detections_))

            # detect license plates
            license_plates = license_plate_detector(frame)[0]
            for license_plate in license_plates.boxes.data.tolist():
                x1, y1, x2, y2, score, class_id = license_plate

                # assign license plate to car
                xcar1, ycar1, xcar2, ycar2, car_id = get_car(license_plate, track_ids)

                if car_id != -1:

                    # crop license plate
                    license_plate_crop = frame[int(y1) : int(y2), int(x1) : int(x2), :]

                    # process license plate
                    license_plate_crop_gray = cv2.cvtColor(
                        license_plate_crop, cv2.COLOR_BGR2GRAY
                    )
                    _, license_plate_crop_thresh = cv2.threshold(
                        license_plate_crop_gray, 64, 255, cv2.THRESH_BINARY_INV
                    )

                    # read license plate number
                    license_plate_text, license_plate_text_score = read_license_plate(
                        license_plate_crop_thresh
                    )

                    if license_plate_text is not None:
                        # Data insertion
                        # data_to_insert = (
                        #     timestamp,
                        #     license_plate_text,
                        #     license_plate_text_score,
                        # )
                        await db.videodata.create(
                            {
                                "timestamp": timestamp,
                                "plateNumber": license_plate_text,
                                "footage": {"connect": {"id": footageId}},
                            }
                        )
