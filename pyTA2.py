from openai_api import Openai_api
from chatbot import Chat
import dotenv
import os

CONTEXT =  dotenv.get_key(".env","CONTEXT") if dotenv.get_key(".env","CONTEXT") else "Eres un profesor del bootcamp de full stack developer con Javascript (ES6). Las respuestas deben ir en formato markdown y el código en el formato correspondiente."
THEORY = dotenv.get_key(".env","THEORY") if dotenv.get_key(".env","THEORY") else "Explica detalladamente <tema>. Muestra ejemplos de código y casos de uso."
EXERCISES = dotenv.get_key(".env","EXERCISES") if dotenv.get_key(".env","EXERCISES") else "Crea ejercicios sobre <tema>. Los ejercicios deben ser sencillos y se deben presentar como una solución a un problema real."
CORRECTION = dotenv.get_key(".env","CORRECTION") if dotenv.get_key(".env","CORRECTION") else "Teniendo en cuenta el enunciado, corrige los errores del código, mostrando solo los errores y explicando cómo resolver cada uno de ellos. Si la función no hace lo que se pide, propón una alternativa.\n"


class Pyta:
    def __init__(self,context = CONTEXT):
        self.context = context
        self.api = Openai_api()
        self.chatbot = Chat(save=True)

    def clear_chat(self):
        self.chatbot.clear()
    def new_chat(self,chat_name):
        self.chatbot = Chat(chat_name,save=True)
    
    def get_response(self):
        chat = self.chatbot.chat
        print(chat)
        try:
            response = self.api.get_response_multi(chat)
        except Exception as e:
            print(e)
            return "Ha ocurrido un error:\n"+str(e)

        self.add_response(response)
        print(response)
        return response
    
    def add_context(self,context):
        last_context = self.chatbot.get_last_message_by_role("system")
        if last_context != context:
            self.chatbot.add_message(role="system",message=context)
            self.context = context

    def get_chat(self):
        return self.chatbot.chat
    
    def get_chat_names(self):
        return self.chatbot.get_chat_names()
    
    def load_chat(self,chat):
        self.chatbot.load_chat(chat)

    def load_chat_file(self,chat_name):
        self.chatbot.load_chat_file(chat_name)
    def save_chat(self,chat_name):
        self.chatbot.save_chat(chat_name)
    def delete_chat(self,chat_name):
        self.chatbot.delete_chat(chat_name)
    def add_message(self,message,role="user"):
        self.chatbot.add_message(role=role,message=message)
    def delete_message(self,chat_name,message_id):
        self.chatbot.delete_message(chat_name,message_id)
    def add_response(self,response):
        self.chatbot.add_message(role="assistant",message=response)
    def create_exercise(self,topic):
        message = EXERCISES.replace("<tema>",topic)
        self.add_message(message)
        return self.get_response()
    def get_last_role(self):
        return self.chatbot.get_last_role()
    def save_responses(self):
        self.chatbot.save_as_md(filename="output",only_responses=True)
    def create_correction(self,filename=None,clear_chat=True):
        message = CORRECTION
        if filename:
            message = self.chatbot.load_message_from_file(filename)
            self.add_message(message)
            self.get_response()
            self.chatbot.save_as_format(filename=filename,only_responses=True)
        # if no filename is provided, all the input directory is loaded
        else:
            for filename in os.listdir("input"):
                if filename.startswith(".git"):
                    continue
                message = self.chatbot.load_message_from_file(filename)
                self.add_message(message)
                self.get_response()
                self.chatbot.save_as_format(filename=filename,only_responses=True)
                if clear_chat:
                    self.clear_chat()
    def create_theory(self,topic):
        message = THEORY.replace("<tema>",topic)
        self.add_message(message)
        return self.get_response()
    def free_text(self,message):
        self.add_message(message)
        return self.get_response()

if __name__ == "__main__":
    pyta = Pyta()
    pyta.add_context(CONTEXT)
    pyta.create_theory("Socket.io")
    pyta.free_text("muestra un ejemplo de código de un problema de la vida real")
    pyta.save_responses()