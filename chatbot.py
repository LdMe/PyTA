"""
Archivo que carga y guarda consersaciones con el chatbot en la carpeta chat

Las conversaciones se guardan en formato json indicando el rol de cada mensaje:

- user: mensaje del usuario
- system: mensaje del sistema
- assistant: mensaje del asistente

"""
import json
import os
from mongo_connection import mongo

class Chat:
    def __init__(self,chat_file="chat",save=True):
        self.chat_file = chat_file
        self.chat = []
        self.save = save
        if  self.save:
            self.load_chat_file()
    def clear(self):
        self.chat = []
        self.save_chat()

    def load_chat(self,chat):
        self.chat = chat

    def load_chat_file(self,chat_file=None):
        filename = chat_file if chat_file else self.chat_file
        collection = mongo.db[filename]
        chats = list(collection.find({},
            {
            "_id": 0,
            "role":1,
            "content":1
             })) 
        self.chat = chats

    def save_chat(self,chat_file=None):
        filename = chat_file if chat_file else self.chat_file
        if not self.save:
            return
        coll = mongo.db[filename]
        coll.delete_many({})
        for chat in self.chat:
            coll.insert_one(json.loads(json.dumps(chat)))
    def delete_chat(self,chat_file=None):
        filename = chat_file if chat_file else self.chat_file
        mongo.db[filename].drop()

    def get_chat_names(self):
        return [chat for chat in mongo.db.list_collection_names()]  
    
    def delete_last_message(self):
        self.delete_last_messages(1)

    def delete_last_messages(self,n=5):
        self.chat = self.chat[:-n]
        self.save_chat()
    def delete_message(self,chat_name,position):
        self.chat.pop(position)
        self.save_chat(chat_file=chat_name)
    def count_words(self):
        words = 0
        for message in self.chat:
            words += len(message["content"].split(" "))
        return words
    
    def get_last_messages_by_words(self,n=3500):
        words = 0
        messages = []
        for message in reversed(self.chat):
            words += len(message["content"].split(" "))
            messages.append(message)
            if words >= n:
                return messages
        return messages
    
    def add_message(self,role,message):
        if not message or message == "":
            return 
        self.chat.append({
            "role": role,
            "content": message
        })
        self.save_chat()

    def get_chat(self):
        return self.chat

    def get_last_messages(self,n=5):
        return self.chat[-n:]

    def get_last_message(self):
        if len(self.chat) == 0:
            return []
        return self.chat[-1]

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

