from ultralytics import YOLO
from ultralytics.utils.plotting import Annotator, colors
from core.licence_plate.ocr import read_license_plate
from services.footage.videodata import update_footage

coco = YOLO("./core/models/yolov8n.pt")
license_plate = YOLO("./core/models/license_plate_detector.pt")

names = coco.names


def detect_vehicles(frame):
    results = coco(frame, show=False, verbose=False)
    boxes = results[0].boxes.xyxy.cpu().tolist()
    clss = results[0].boxes.cls.cpu().tolist()
    annotator = Annotator(frame, line_width=2, example=names)
    return boxes, clss, annotator


def detect_plate(vehicle_frame):
    results = license_plate.predict(vehicle_frame, show=False, verbose=False)
    boxes = results[0].boxes.xyxy.cpu().tolist()
    clss = results[0].boxes.cls.cpu().tolist()
    return boxes, clss


async def detect(frame, timestamp, footage_id, db):
    vehicle_boxes, vehicle_clss, vehicle_annotator = detect_vehicles(frame)
    if vehicle_boxes is not None:
        for vehicle_box, vehicle_cls in zip(vehicle_boxes, vehicle_clss):
            vehicle_annotator.box_label(
                vehicle_box,
                color=colors(int(vehicle_cls), True),
                label=names[int(vehicle_cls)],
            )

            vehicle_frame = frame[
                int(vehicle_box[1]) : int(vehicle_box[3]),
                int(vehicle_box[0]) : int(vehicle_box[2]),
            ]

            plate_boxes, plate_clss = detect_plate(vehicle_frame)

            if plate_boxes is not None:
                idx = 0
                for plate_box, plate_cls in zip(plate_boxes, plate_clss):
                    idx += 1
                    plate_frame = vehicle_frame[
                        int(plate_box[1]) : int(plate_box[3]),
                        int(plate_box[0]) : int(plate_box[2]),
                    ]

                    plate_number, score = read_license_plate(plate_frame)
                    if (plate_number != None or score != None) and (score >= 0.35):
                        await update_footage(
                            db,
                            timestamp,
                            footage_id,
                            names[int(vehicle_cls)],
                            plate_number,
                        )
