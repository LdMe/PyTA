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
        filename = filename + ".json"
        if not os.path.exists("chat/"+filename):
            self.chat = []
            self.save_chat()
            return
        with open("chat/"+ filename, "r") as file:
            self.chat = json.load(file)

    def save_chat(self,chat_file=None):
        filename = chat_file if chat_file else self.chat_file
        if not self.save:
            return
        with open("chat/"+filename+".json", "w") as file:
            json.dump(self.chat,file)
            
    def get_chat_names(self):
        return [chat.split(".")[0] for chat in os.listdir("chat") if not chat.startswith(".git") and chat.endswith(".json")]
    
    def save_as_format(self,format=None,only_responses=False,filename=None):
        filenameToSave = filename if filename else self.chat_file
        if not format:
            format = filenameToSave.split(".")[-1]
        with open("output/"+filenameToSave+"."+format, "w") as file:
            for message in self.chat:
                if only_responses and message["role"] != "assistant":
                    continue
                file.write(f"{message['content']}\n\n---\n\n")
    def save_as_md(self,only_responses=False,filename=None):
        self.save_as_format(format="md",only_responses=only_responses,filename=filename)
    def load_message_from_file(self,message_file):
        try:
            filename = "input/"+message_file
            # if file does not have extension then add .md
            if "." not in filename.split("/")[-1]:
                filename += ".md"
            with open("input/"+message_file, "r") as file:
                message = file.read()
            self.add_message("user",message)
            self.save_chat()
        except Exception as e:
            print("No se ha podido cargar el archivo")

    def delete_last_message(self):
        self.delete_last_messages(1)

    def delete_last_messages(self,n=5):
        self.chat = self.chat[:-n]
        self.save_chat()

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