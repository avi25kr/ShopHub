import ssl
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# MongoDB Atlas connection URI
URI = "mongodb+srv://abhishektgt5:abhi1234@cluster0.nlido0m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Default database name
DB_NAME = "recommender"

def create_client():
    """
    Create and return a MongoDB client using the correct CA file to avoid SSL errors.
    """
    return MongoClient(
        URI,
        server_api=ServerApi('1'),
        tlsCAFile=ssl.get_default_verify_paths().cafile
    )

def test_connection():
    """
    Ping the MongoDB server to confirm the connection works.
    """
    client = create_client()
    try:
        client.admin.command("ping")
        print("✅ Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print("❌ Connection failed:", e)

def get_database():
    """
    Get a reference to the recommender database.
    """
    client = create_client()
    return client[DB_NAME]

if __name__ == "__main__":
    # Test connection when running this file directly
    test_connection()
