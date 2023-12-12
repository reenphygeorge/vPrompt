import openai
import psycopg2

# Set your OpenAI GPT-3 API key
openai.api_key = '<OPENAI-API-KEY>'

# Connect to the PostgreSQL database
conn = psycopg2.connect(
    host="localhost", 
    database="db", 
    user="user", 
    password="pass"
)

# Open a cursor
cursor = conn.cursor()

def query_database(plate_number):
    # Example database query to retrieve timestamps
    database_query = f"SELECT timestamp FROM footage_data WHERE plate_number = '{plate_number}';"
    
    # Execute the database query
    cursor.execute(database_query)
    timestamps = cursor.fetchall()

    return timestamps


def identify_timestamp_ranges(timestamps):
    if not timestamps:
        return None

    # Extract integer values from tuples
    timestamps = [t[0] for t in timestamps]

    # Sort timestamps in ascending order
    timestamps.sort()

    # Initialize variables
    start_time = timestamps[0]
    end_time = timestamps[0]
    time_ranges = []

    # Iterate through timestamps to find consecutive ranges
    for time in timestamps[1:]:
        if time == end_time or time == end_time + 1:
            end_time = time
        else:
            # Add the current range to the list
            time_ranges.append(f"{start_time} - {end_time}")
            # Start a new range
            start_time = time
            end_time = time
    # Add the last range to the list
    time_ranges.append(f"{start_time} - {end_time}")
    return ', '.join(time_ranges)

# Example user prompt
user_prompt = "Find timestamps for plate number NA13NRU"

# Extract plate number from the user prompt (you may need a more sophisticated method)
plate_number = "NA13NRU"

# Query the database for timestamps
timestamps = query_database(plate_number)

# Format input for ChatGPT
chatgpt_input = "give the continuous range in the below timestamps. Also if the difference between two consecutive time stamps is more than 00:00:05 then split the range at that point. You should give the answer in the following format: The vehicles where found at the follwoing time stamps: [range1] [range2] ".join(str(timestamps))

# Call the OpenAI API
response = openai.chat.completions.create(
model="gpt-3.5-turbo",
messages=[
    {
    "role": "system",
    "content": chatgpt_input
    }
],
temperature=0.8,
max_tokens=64,
top_p=1
)

# Extract the generated response from ChatGPT
chatgpt_response = response.choices[0].message.content.strip()

# Combine database result and ChatGPT response
final_output = f"Plate number {plate_number} was found at timestamps{chatgpt_response}"

# Print the final result
print(final_output)

# Close the cursor and connection
cursor.close()
conn.close()
