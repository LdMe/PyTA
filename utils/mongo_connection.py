import pymongo
import os

# get host from environment variable
host = os.environ.get("MONGO_HOST", "localhost")
mongo = pymongo.MongoClient(host=host, port=27017)
mongo.db = mongo["pyta"]

templates = pymongo.MongoClient(host=host, port=27017)
templates.db = templates["templates"]