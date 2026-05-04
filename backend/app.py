from flask import Flask, request, jsonify
from flask_cors import CORS
from db import connect_db
import requests
from google import genai
from config import GEMINI_API_KEY

# Configure Gemini (new API)
# Configure Gemini (new API)
if GEMINI_API_KEY:
    # Pass the variable, not a hardcoded string
    client = genai.Client(api_key=GEMINI_API_KEY) 
else:
    client = None

STACK_OVERFLOW_API_URL = "https://api.stackexchange.com/2.3/search"

def fetch_stack_overflow_answers(query):
    params = {
        "order": "desc",
        "sort": "relevance",
        "intitle": query,
        "site": "stackoverflow"
    }

    try:
        response = requests.get(STACK_OVERFLOW_API_URL, params=params)
        if response.status_code == 200:
            data = response.json()
            results = data.get("items", [])
            if results:
                return [{"title": item["title"], "link": item["link"]} for item in results[:3]]
    except Exception as e:
        print(f"Error fetching from Stack Overflow: {e}")
    
    return []

def fetch_gemini_response(query):
    if not client:
        return "Gemini API key not configured. Please set it in config.py."

    try:
        prompt = f"You are a helpful tech support bot. Answer this user query concisely: {query}"
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )

        return response.text

    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return f"Error: Could not reach Gemini. {str(e)}"

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Tech Support Bot API is running!"})

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_query = data.get("query")

    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    # Fetch AI response
    ai_response = fetch_gemini_response(user_query)

    # Fetch reference links from Stack Overflow
    stack_overflow_links = fetch_stack_overflow_answers(user_query)

    # Store in database (optional)
    connection = connect_db()
    if connection:
        try:
            with connection.cursor() as cursor:
                sql = "INSERT INTO queries (user_query, bot_response) VALUES (%s, %s)"
                cursor.execute(sql, (user_query, ai_response))
                connection.commit()
        except Exception as e:
            print(f"Database insertion failed: {e}")
        finally:
            connection.close()
    
    return jsonify({
        "message": "Query processed",
        "response": ai_response,
        "references": stack_overflow_links
    })

if __name__ == '__main__':
    app.run(debug=True)