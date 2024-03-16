import os


def iter_video(video_path: str):
    with open(video_path, "rb") as video_file:
        while chunk := video_file.read(1024):
            yield chunk
