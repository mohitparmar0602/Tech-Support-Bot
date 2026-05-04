import pymysql
from config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

def connect_db():
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            cursorclass=pymysql.cursors.DictCursor
        )
        print("Database connected successfully!")
        return connection
    except Exception as e:
        print(f"Database connection failed: {e}")
        return None
