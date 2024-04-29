from moviepy.editor import VideoFileClip
from shutil import copy


def video_trimmer(timestamps, filename, temp_path, prefix, footage_id):
    # video_path = "./core/videos/uploads/" + filename
    start_time = (
        float(timestamps[0].split(":")[0]) * 3600
        + float(timestamps[0].split(":")[1]) * 60
        + float(timestamps[0].split(":")[2])
    )
    end_time = (
        float(timestamps[-1].split(":")[0]) * 3600
        + float(timestamps[-1].split(":")[1]) * 60
        + float(timestamps[-1].split(":")[2])
    )

    if start_time > 2:
        start_time -= 2
    else:
        end_time += 2

    clip = VideoFileClip(temp_path)

    trimmed_clip = clip.subclip(start_time, end_time)

    output_filename = f"{prefix}_{filename}"

    trimmed_clip.write_videofile(
        f"./core/videos/trimmed/{footage_id}/{output_filename}", fps=clip.fps
    )

    clip.close()

    trimmed_clip.close()

    return output_filename
