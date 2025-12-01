from pymongo import MongoClient

def get_database():
    client = MongoClient("mongodb+srv://abhishekrawatworks1:PkacPYkq7C5d5Jex@cluster0.9jkbbor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")  # or your Atlas URI
    return client["ecommerce"]  # your DB name
