import requests

url = "http://127.0.0.1:5000/ask"  # Your Flask API endpoint
data = {"query": "How to use Flask with MySQL?"}  # Query to send

# Send the POST request
response = requests.post(url, json=data)

# Print the response from the server
print("Status Code:", response.status_code)
print("Response:", response.json())
