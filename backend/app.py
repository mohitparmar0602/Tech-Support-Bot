from flask import Flask, request, jsonify
from flask_cors import CORS
from db import connect_db
import requests

STACK_OVERFLOW_API_URL = "https://api.stackexchange.com/2.3/search"

def fetch_stack_overflow_answers(query):
    params = {
        "order": "desc",
        "sort": "relevance",
        "intitle": query,
        "site": "stackoverflow"
    }

    response = requests.get(STACK_OVERFLOW_API_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        results = data.get("items", [])

        if results:
            # Get top 3 answers
            answers = [{"title": item["title"], "link": item["link"]} for item in results[:3]]
            return answers
        else:
            return [{"title": "No relevant answers found", "link": ""}]
    else:
        return [{"title": "Error fetching data from Stack Overflow", "link": ""}]


app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Test route
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Tech Support Bot API is running!"})

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_query = data.get("query")

    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    # Fetch answers from Stack Overflow
    stack_overflow_answers = fetch_stack_overflow_answers(user_query)

    # Store in database
    connection = connect_db()
    if connection:
        try:
            with connection.cursor() as cursor:
                sql = "INSERT INTO queries (user_query, bot_response) VALUES (%s, %s)"
                bot_response = f"Check these links: {stack_overflow_answers}"
                cursor.execute(sql, (user_query, bot_response))
                connection.commit()
            return jsonify({"message": "Query processed", "response": stack_overflow_answers})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            connection.close()
    else:
        return jsonify({"error": "Database connection failed"}), 500

# Run the server
if __name__ == '__main__':
    app.run(debug=True)
