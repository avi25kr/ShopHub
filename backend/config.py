import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'yoursecret'
    MONGODB_URI = os.environ.get('MONGODB_URI') or "mongodb+srv://abhishekrawatworks1:PkacPYkq7C5d5Jex@cluster0.9jkbbor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    DEBUG = True