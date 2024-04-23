import cv2

# Function to draw bounding box on frame
def draw_bounding_box(frame, coordinates):
    # Draw bounding box on frame
    cv2.rectangle(frame, coordinates[0], coordinates[1], (0, 255, 0), 2)

# Function to convert timestamp string to seconds
def timestamp_to_seconds(timestamp_with_coordinates):
    h, m, s = map(int, timestamp_with_coordinates.split(':'))
    return h * 3600 + m * 60 + s

def plotter(input_video_path,timestamp_with_coordinates,output_video_path):
    
    cap = cv2.VideoCapture(input_video_path)

    # Get video properties
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Get frame timestamp in milliseconds
    frame_timestamp = cap.get(cv2.CAP_PROP_POS_MSEC)

        # Convert timestamp to seconds
    timestamp_sec = frame_timestamp / 1000

        # Calculate hours, minutes, and seconds
    hours = int(timestamp_sec // 3600)
    minutes = int((timestamp_sec % 3600) // 60)
    seconds = int((timestamp_sec % 3600) % 60)
    print(hours)
        # Format the timestamp string
    timestamp = f"{hours:02}:{minutes:02}:{seconds:02}"
    print(timestamp)
    
    # Initialize VideoWriter object to save output video
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (frame_width, frame_height))

    # Timestamp array
    # timestamp_with_coordinates = [
    #     ["00:00:13", 100, 100, 300, 300],
    #     ["00:00:15", 105, 100, 300, 300],
    #     ["00:00:16", 110, 110, 300, 300],
    #     ["00:00:17", 115, 115, 300, 300],
    #     ["00:00:18", 120, 120, 300, 300],
    #     ["00:00:19", 125, 125, 300, 300],
    # ]

    # Define bounding box coordinates per second
    bounding_boxes = {}
    for entry in timestamp_with_coordinates:
        time_str = entry[0]
        seconds = timestamp_to_seconds(time_str)
        coordinates = [(int(entry[1]), int(entry[2])), (int(entry[3]), int(entry[4]))]
        bounding_boxes[seconds] = coordinates

    # Iterate through each frame of the input video
    for frame_index in range(total_frames):
        # Read frame
        ret, frame = cap.read()
        if not ret:
            break

        # Get current second
        current_second = int(frame_index / fps)

        # Draw bounding box if coordinates are available for the current second
        if current_second in bounding_boxes:
            coordinates = bounding_boxes[current_second]
            draw_bounding_box(frame, coordinates)

        # Write frame to output video
        out.write(frame)

    # Release VideoWriter and input video
    out.release()
    cap.release()
