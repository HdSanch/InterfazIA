from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("MODELOS DISPONIBLES:\n")

for m in client.models.list():
    print("NAME:", m.name)
    print("DICT:", m.model_dump())
    print("-" * 40)
