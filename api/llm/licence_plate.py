from langchain_together import Together
from kor.extraction import create_extraction_chain
from kor.nodes import Object, Text, Number
from langchain_community.chat_models import ChatOpenAI

schema = Object(
    id="vehicle",
    description="Vehicle information",
    attributes=[
        Text(
            id="plateNumber",
            description="The age of the person in years.",
            examples=[
                (
                    "Find the time between 12AM and 3PM when a blue truck with the plate number MH09X4587 entered the parking area.",
                    ["MH09X4587"],
                ),
                (
                    "Retrieve the duration between 5PM and 7PM during which a red motorcycle without a plate was present in the parking lot.",
                    [""],
                ),
                (
                    "Find the time between 12AM and 3PM when a blue SUV and a red motorcycle, both without plates, entered the parking area.",
                    ["", ""],
                ),
                (
                    "Retrieve the duration between 5PM and 7PM during which a silver van with the plate TN27G7896 and a black sedan without a plate were present in the parking lot.",
                    ["TN27G7896", ""],
                ),
                (
                    "Find the time when a blue SUV and a red motorcycle, both without plates, entered the parking area.",
                    ["", ""],
                ),
                (
                    "Provide me with timestamps for a green truck with the plate AP14Y6210 and a white motorcycle with plate WB05Z1234 entering and exiting the parking premises.",
                    ["AP14Y6210", "WB05Z1234"],
                ),
                (
                    "Identify the time range for a green sedan with no visible plate and a purple SUV with plate KA08P5678 being present in the parking zone.",
                    ["", "KA08P5678"],
                ),
                (
                    "Retrieve the time range for a white pickup truck without a plate and a black convertible car with plate GJ12Q7890 entering and leaving the parking area.",
                    ["", "GJ12Q7890"],
                ),
                (
                    "Find the moments when a blue pickup truck without a visible plate and a silver hatchback with tinted windows were present in the parking zone.",
                    ["", ""],
                ),
                (
                    "Identify the time range for a brown SUV without a plate and a yellow convertible car with a convertible top down being present in the parking zone.",
                    ["", ""],
                ),
                (
                    "Find the time between 12PM and 3PM when a blue SUV with plate ABC123 and a red motorcycle without a plate entered the parking area.",
                    ["ABC123", ""],
                ),
                (
                    "Find the time between 1PM and 3PM when a blue SUV with plate ABC123, a red motorcycle without a plate, and a silver sedan with plate XYZ789 were present in the parking area.",
                    ["ABC123", "", "XYZ789"],
                ),
                (
                    "When did a black convertible car without a plate, a green pickup truck with plate MNO456, and a yellow sedan with plate STU789 access the parking facility between 5PM and 7PM?",
                    ["", "MNO456", "STU789"],
                ),
                (
                    "Provide timestamps between 10PM and 12AM for when a blue SUV without a plate, a white motorcycle with plate TUV456, and a black pickup truck without a plate were present in the parking space.",
                    ["", "TUV456", ""],
                ),
                (
                    "Find the moments when a blue hatchback with plate PQR567, a yellow minivan without a plate, and a green convertible car with plate STU789 were present in the parking zone between 4AM and 6AM.",
                    ["PQR567", "", "STU789"],
                ),
                (
                    "Tell me between 6AM and 8AM when a green sedan without a plate, a red SUV with plate XYZ789, and a brown convertible car without a plate were present in the parking premises.",
                    ["", "XYZ789", ""],
                ),
                (
                    "Find the time between 9AM and 11AM when a blue sedan with plate ABC123, a red convertible car without a plate, a white pickup truck with plate DEF456, and a black SUV without a plate were present in the parking area.",
                    [
                        "ABC123",
                        "",
                        "DEF456",
                        "",
                    ],
                ),
            ],
        ),
    ],
    many=True,
)

llm = Together(
    model="mistralai/Mistral-7B-Instruct-v0.2",
    temperature=0.7,
    max_tokens=128,
    top_k=1,
    together_api_key="08c120887806e6ff4fcfc3516b208d9cf1e241008a6c95ba30940b0b1884a250",
)


def extract_prompt_data(prompt: str):
    chain = create_extraction_chain(llm, schema, encoder_or_encoder_class="json")
    data = chain.invoke((prompt))["text"]["data"]["vehicle"][0]["plateNumber"]
    return data
