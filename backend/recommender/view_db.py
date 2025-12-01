from pymongo import MongoClient

# # 1. Connect to MongoDB
client = MongoClient("mongodb+srv://abhishektgt5:abhi1234@cluster0.nlido0m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")  # For local MongoDB
# # Example for cloud: "mongodb+srv://username:password@cluster.mongodb.net/"

# # 2. Choose the database
db = client["recommender"]

# print(db.list_collection_names())

# # 3. Choose the collection
# collection = db["users"]
collection = db["products"]

#result = collection.delete_many({})

 #print(f"{result.deleted_count} documents deleted.")

#4. Fetch and print all documents
for document in collection.find():
    print(document)
