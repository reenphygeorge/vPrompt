from langchain_together import Together
from kor.extraction import create_extraction_chain
from kor.nodes import Object, Text, Number
from langchain_community.chat_models import ChatOpenAI
from dotenv import load_dotenv
from os import environ

load_dotenv()
together_api_key = environ["TOGETHER_API_KEY"]
schema = Object(
    id="person",
    description="individual person face",
    attributes=[
        Text(
            id="name",
            description="The names of the person",
            examples=[
                (
                    "Locate Sarah Smith.",
                    ["Sarah Smith"],
                ),
                (
                    "Identify the whereabouts of John Doe.",
                    ["John Doe"],
                ),
                (
                    "Find the current location of Emily Johnson.",
                    ["Emily Johnson"],
                ),
                (
                    "Detect the presence of Michael Brown.",
                    ["Michael Brown"],
                ),
                (
                    "Locate Jennifer Garcia.",
                    ["Jennifer Garcia"],
                ),
                (
                    "Identify the position of David Wilson.",
                    ["David Wilson"],
                ),
                (
                    "Find Olivia Martinez.",
                    ["Olivia Martinez"],
                ),
                (
                    "Detect the whereabouts of Daniel Taylor.",
                    [ "Daniel Taylor"],
                ),
                (
                    "Locate Jessica Lee.",
                    ["Jessica Lee"],
                ),
                (
                    "Identify the current location of Christopher Davis.",
                    ["Christopher Davis"],
                ),
                (
                    "Locate Sarah Smith and John Doe.",
                    ["Sarah Smith", "John Doe"],
                ),
                (
                    "Locate Sarah Smith, John Doe, and Emily Johnson.",
                    ["Sarah Smith", "John Doe", "Emily Johnson"],
                ),
                (
                    "Identify the whereabouts of Michael Brown, Jennifer Garcia, and David Wilson",
                    ["Michael Brown", "Jennifer Garcia", "David Wilson"],
                ),
                (
                    "Find Olivia Martinez, Daniel Taylor, and Jessica Lee.",
                    ["Olivia Martinez", "Daniel Taylor", "Jessica Lee"],
                ),
                (
                    "Detect the presence of Christopher Davis, Maria Rodriguez, and Matthew Thompson.",
                    ["Christopher Davis", "Maria Rodriguez", "Matthew Thompson"],
                ),
                (
                    "Locate Samantha White, Andrew Clark, and Ashley Hall.",
                    ["Samantha White", "Andrew Clark", "Ashley Hall"],
                ),
                (
                    "locate sarah smith.",
                    ["sarah smith"],
                ),
                (
                    "identify the whereabouts of john doe.",
                    ["john doe"],
                ),
                (
                    "find the current location of emily johnson.",
                    ["emily johnson"],
                ),
                (
                    "find jack",
                    ["jack"]
                ),
                (
                    "find  Emily johnson",
                    ["Emily johnson"]
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
    together_api_key=together_api_key,
)


def extract_prompt_data(prompt: str):
    chain = create_extraction_chain(llm, schema, encoder_or_encoder_class="json")
    data = chain.invoke((prompt))["text"]["data"]["person"][0]["name"]
    return data
