import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI not set in .env file")

client = MongoClient(MONGODB_URI, connect=False, serverSelectionTimeoutMS=5000)
db = client["EchoID"]
users_collection = db["users"]
