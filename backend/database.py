from pymongo import MongoClient
from config import Config

# Connect to MongoDB
client = MongoClient(Config.MONGODB_URI)
db = client["ecommerce"]
users = db["users"]
products = db["products"]  # Add products collection