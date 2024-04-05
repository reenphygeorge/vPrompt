from ultralytics import YOLO
from ultralytics.utils.plotting import Annotator, colors
from services.footage.videodata import update_footage

person_detect = YOLO("./core/models/person_detect.pt")

names = person_detect.names

def detect_person(frame):
    results = person_detect(frame, show=False, verbose=True)
    boxes = results[0].boxes.xyxy.cpu().tolist()
    clss = results[0].boxes.cls.cpu().tolist()
    annotator = Annotator(frame, line_width=2, example=names)
    return boxes, clss, annotator


async def detect(frame, timestamp, footage_id, db):
    person_boxes, person_clss, person_annotator = detect_person(frame)
    if person_boxes is not None:
        for person_box, person_clss in zip(person_boxes, person_clss):
            person_annotator.box_label(
                person_box,
                color=colors(int(person_clss), True),
                label=names[int(person_clss)],
            )
            await update_footage(
                db,
                timestamp,
                footage_id,
                names[int(person_clss)],
            )
