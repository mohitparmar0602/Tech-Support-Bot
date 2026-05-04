import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

print("Available Models:")
for model in client.models.list():
    # Filter to only show models that support text generation
    if 'generateContent' in model.supported_actions:
        print(model.name)