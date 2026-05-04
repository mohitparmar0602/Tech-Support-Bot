# Tech Support Bot

An AI-powered Tech Support Chatbot built using React, Flask, and the Gemini API. This project provides intelligent, conversational tech support answers combined with top Stack Overflow reference links for deeper context.

## Features

- **Gemini AI Integration**: Uses Google's Gemini 2.5 Flash model for fast and accurate technical assistance.
- **Stack Overflow References**: Automatically fetches relevant Stack Overflow threads based on your queries to provide trusted community resources.
- **Modern User Interface**: A clean, premium glassmorphism-based design built with React and custom CSS.
- **Persistent Database Logging**: Logs queries and responses to a MySQL database for auditing and continuous improvement.

## Project Structure

This is a monorepo consisting of:
- `frontend/`: The React client application.
- `backend/`: The Flask REST API that interfaces with Gemini and Stack Overflow.

---

## Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **MySQL Server** (running locally or remotely)
- **Gemini API Key**: You can obtain one from Google AI Studio.

---

## Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the `backend` directory (there is an example structure below) to configure your database connection and API keys:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=tech_support_bot
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Set up the Database**:
   Log into your MySQL server and run the following commands to create the database and table:
   ```sql
   CREATE DATABASE tech_support_bot;
   USE tech_support_bot;
   CREATE TABLE queries (
       id INT AUTO_INCREMENT PRIMARY KEY,
       user_query TEXT NOT NULL,
       bot_response TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

6. **Start the Flask Server**:
   ```bash
   python app.py
   ```
   The backend will run at `http://127.0.0.1:5000/`.

---

## Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the React Development Server**:
   ```bash
   npm start
   ```
   The frontend will run at `http://localhost:3000/`.

---

## Usage

1. Start both the backend API and the frontend client.
2. Visit `http://localhost:3000/` in your browser.
3. Type any technical question (e.g., "How do I fix a CORS error in Flask?") and receive an AI-generated answer along with Stack Overflow references!
