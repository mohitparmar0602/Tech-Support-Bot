from google import genai

# Replace with your actual fresh API key
client = genai.Client(api_key="AIzaSyBXm6m46MfzbnJrttyktKQH7459vBXlH-Y")

print("Available Models:")
for model in client.models.list():
    # Filter to only show models that support text generation
    if 'generateContent' in model.supported_actions:
        print(model.name)