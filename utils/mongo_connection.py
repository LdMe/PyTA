import pymongo
import os

# get host from environment variable
host = os.environ.get("MONGO_HOST", "localhost")
mongo = pymongo.MongoClient(host=host, port=27017)
mongo.db = mongo["pyta"]

templates_db = pymongo.MongoClient(host=host, port=27017)
templates_db.db = templates_db["templates"]