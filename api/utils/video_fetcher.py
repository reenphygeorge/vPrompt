from moviepy.editor import VideoFileClip


def video_trimmer(timestamps, filename):
    video_path = "./core/videos/" + filename
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

    clip = VideoFileClip(video_path)

    trimmed_clip = clip.subclip(start_time - 2, end_time + 2)

    output_filename = f"trimmed_{filename}"

    trimmed_clip.write_videofile("./core/videos/" + output_filename)

    clip.close()

    trimmed_clip.close()

    return output_filename
