"""
Archivo que carga y guarda consersaciones con el chatbot en la carpeta chat

Las conversaciones se guardan en formato json indicando el rol de cada mensaje:

- user: mensaje del usuario
- system: mensaje del sistema
- assistant: mensaje del asistente

"""
import json
import os

class Chat:
    def __init__(self,chat_file="chat"):
        self.chat_file = chat_file
        
        self.load_chat()

    def load_chat(self):
        if not os.path.exists("chat/"+self.chat_file+".json"):
            self.chat = []
            self.save_chat()
            return
        with open("chat/"+self.chat_file+".json", "r") as file:
            self.chat = json.load(file)

    def save_chat(self):
        with open("chat/"+self.chat_file+".json", "w") as file:
            json.dump(self.chat,file)
    def save_as_md(self):
        with open("output/"+self.chat_file+".md", "w") as file:
            for message in self.chat:
                file.write(f"**{message['role']}**: {message['content']}\n\n")

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


if __name__=="__main__":
    chat = Chat("chat")
    chat.add_message("user","Hola")
    chat.add_message("system","Hola")
    chat.add_message("assistant","Hola")
    print(chat.get_chat())
    print(chat.get_last_messages())
    print(chat.get_last_message())
    print(chat.get_last_role())
    print(chat.get_last_message_user())
    print(chat.get_last_message_system())
    print(chat.get_last_message_assistant())