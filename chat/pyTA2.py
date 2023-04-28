from utils.openai_api import Openai_api
from chat.chatbot import Chat
import dotenv
import os


class Pyta:
    def __init__(self):
        self.api = Openai_api()
        self.chatbot = Chat()

    def new_chat(self,chat_name):
        self.chatbot = Chat(chat_name)
    
    def get_response(self,chat=None,num_words=1500):
        if not chat:
            chat = self.chatbot.get_clean_messages(num_words=num_words)
        try:
            response = self.api.get_response_multi(chat)
        except Exception as e:
            return "Ha ocurrido un error:\n"+str(e)
        self.add_response(response)
        return response
    
    def add_context(self,context):
        last_context = self.chatbot.get_last_message_by_role("system")
        if last_context != context:
            self.chatbot.add_message(role="system",message=context)
            self.context = context

    def load_chat(self,chat_name):
        self.chatbot = Chat(chat_name)
    def get_chat(self):
        return self.chatbot.get_chat()
    
    def get_chat_names(self):
        return Chat.get_chat_names()

    def delete_chat(self,chat_name):
        self.chatbot.delete_chat(chat_name)
    
    def save_chat(self,chat_name,content):
        self.chatbot = Chat(chat_name)
        self.chatbot.save_chat(content)
        
    def add_message(self,message,role="user",template = None):
        if template:
            message = self.fill_template(template,message)
            print("message",message,flush=True)
        self.chatbot.add_message(role=role,message=message)
    
    def delete_message(self,chat_name,message_id):
        self.load_chat(chat_name)
        self.chatbot.delete_message(message_id)
    
    def update_message(self,chat_name,message_id,message,role=None):
        self.load_chat(chat_name)
        self.chatbot.update_message(message_id,message,role)
    
    def add_response(self,response):
        self.chatbot.add_message(role="assistant",message=response)
    
    def get_last_role(self):
        return self.chatbot.get_last_role()
    
    #Templates
    #-------------------------------------
    def get_templates(self):
        templates= Chat.get_templates()
        return templates
    
    def get_template(self,template_name):
        return Chat.get_template(template_name)
    
    def delete_template(self,template_name):
        Chat.delete_template(template_name)
    
    def add_template(self,template_name,template,replace_word):
        Chat.create_template(template_name,template,replace_word)

    def swap_messages(self,chat_name,message1,message2):
        self.chatbot.swap_messages(chat_name,message1,message2)
    
    def fill_template(self,template_name,text):
        return Chat.fill_template(template_name,text)
    