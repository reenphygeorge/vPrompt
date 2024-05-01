from ultralytics import YOLO
from ultralytics.utils.plotting import Annotator, colors
from services.footage.videodata import update_footage

person_detect = YOLO("./core/models/person_detect.pt")

names = person_detect.names


def clip_boxes(boxes, image_shape):
    height, width = image_shape
    clipped_boxes = []
    for box in boxes:
        xmin, ymin, xmax, ymax = box
        # Clip x-coordinates
        xmin = max(0, min(xmin, width - 1))
        xmax = max(0, min(xmax, width - 1))
        # Clip y-coordinates
        ymin = max(0, min(ymin, height - 1))
        ymax = max(0, min(ymax, height - 1))
        clipped_boxes.append((xmin, ymin, xmax, ymax))
    return clipped_boxes


def detect_person(frame):
    results = person_detect(frame, show=False, verbose=False)
    boxes = results[0].boxes.xyxy.cpu().tolist()
    clipped_boxes = clip_boxes(boxes, results[0].orig_shape)
    clss = results[0].boxes.cls.cpu().tolist()
    annotator = Annotator(frame, line_width=2, example=names)
    return clipped_boxes, clss, annotator


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
                db, timestamp, footage_id, names[int(person_clss)], person_boxes
            )
