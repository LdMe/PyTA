"""
Archivo que carga y guarda consersaciones con el chatbot en la carpeta chat

Las conversaciones se guardan en formato json indicando el rol de cada mensaje:

- user: mensaje del usuario
- system: mensaje del sistema
- assistant: mensaje del asistente

"""
import json
import os

import bson
from utils.mongo_connection import mongo, templates
import bson.json_util as json_util

class Chat:
    def __init__(self,chat_name=None):
        self.chat_name = chat_name
        self.messages = []
        self.load_chat()

    def load_chat(self):
        if not self.chat_name:
            return
        collection = mongo.db[self.chat_name]
        messages = list(collection.find({},
            {
            "_id": 1,
            "role":1,
            "content":1
             })) 
        messages = json.loads(json.dumps(messages, default=json_util.default))
        self.messages = messages

    def get_messages(self):
        return self.messages
    
    def get_clean_messages(self,num_words=1500):
        return [{"content":message["content"],"role":message["role"]} for message in self.get_last_messages_by_words(num_words)]   

    def delete_chat(self,chat_name=None):
        name = chat_name if chat_name else self.chat_name
        mongo.db[name].drop()
    
    def clear_chat(self):
        mongo.db[self.chat_name].delete_many({})

    def save_chat(self,content):
        print("saving chat",flush=True)
        print(content,flush=True)

        self.clear_chat()
        for message in content:
            new_message = {"role":message["role"],"content":message["content"]}
            mongo.db[self.chat_name].insert_one(new_message)
        self.load_chat()

    def swap_messages(self,chat_name,idfrom, idto):
        self.chat_name = chat_name
        self.load_chat()
        messages = self.get_messages()
        print(messages[0],flush=True)
        messagefrom = [message for message in messages if message["_id"]["$oid"] == idfrom][0]
        messageto = [message for message in messages if message["_id"]["$oid"] == idto][0]
        # insert messagefrom before mesageTo in the array and save it in the database replacing the original ones
        messages.insert(messages.index(messageto),messages.pop(messages.index(messagefrom)))
        self.save_chat(messages)

        
        self.load_chat()

    def get_chat_names():
        return [chat for chat in mongo.db.list_collection_names()]  
    
    def delete_last_message(self):
        self.delete_last_messages(1)

    def delete_last_messages(self,n=5):
        for i in range(n):
            self.delete_message(self.get_last_message()["_id"])

    def delete_message(self,id):
        id = bson.ObjectId(id)
        mongo.db[self.chat_name].delete_one({"_id":id})
        self.load_chat()

    def update_message(self,id,message,role = None):
        id = bson.ObjectId(id)
        if role:
            mongo.db[self.chat_name].update_one({"_id":id},{"$set":{"content":message,"role":role}})
        else:
            mongo.db[self.chat_name].update_one({"_id":id},{"$set":{"content":message}})
        self.load_chat()

    def count_words(self):
        words = 0
        for message in self.messages:
            words += len(message["content"].split(" "))
        return words
    
    def get_last_messages_by_words(self,n=3500):
        words = 0
        messages = []
        for message in reversed(self.messages):
            words += len(message["content"].split(" "))
            messages.append(message)
            if words >= n:
                return reversed(messages)
        
        return reversed(messages)
    
    def add_message(self,role,message):
        if not message or message == "":
            return 
        mongo.db[self.chat_name].insert_one({"role":role,"content":message})
        self.load_chat()

    def get_chat(self):
        return self.messages

    def get_last_messages(self,n=5):
        if len(self.messages) == 0:
            return []
        if len(self.messages) < n:
            return self.messages
        return self.messages[-n:]

    def get_last_message(self):
        return self.get_last_messages(1)[0]

    def get_last_role(self):
        return self.get_last_message()["role"]

    def get_last_message_by_role(self,role):
        for message in reversed(self.get_chat()):
            if message["role"] == role:
                return message
        return None

    def get_last_message_user(self):
        return self.get_last_message_by_role("user")

    def get_last_message_system(self):
        return self.get_last_message_by_role("system")
        
    def get_last_message_assistant(self):
        return self.get_last_message_by_role("assistant")

    def get_template_names():
        return [template for template in templates.db.list_collection_names()]

    def get_template(template_name):
        collection = templates.db[template_name]
        template = collection.find_one({},
            {
            "_id": 1,
            "replace_word":1,
            "content":1
             })
        return template
    
    def create_template(template_name, content, replace_word):
        templates.db[template_name].insert_one({"replace_word":replace_word,"content":content})

    def delete_template(template_name):
        templates.db[template_name].drop()

    def update_template(template_name, content, replace_word):
        templates.db[template_name].update_one({"_id":template_name},{"$set":{"replace_word":replace_word,"content":content}})

    def fill_template(template_name, text):
        template = Chat.get_template(template_name)
        return template["content"].replace(template["replace_word"],text)