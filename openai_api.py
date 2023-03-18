import os
import openai
import sys
import dotenv

#engine = "text-davinci-003"
#engine = "code-davinci-002"
engine = "gpt-3.5-turbo"
class Openai_api:
    def __init__(self):
        dotenv.load_dotenv()
        openai.organization = os.getenv("OPENAI_ORGANIZATION")
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def get_response(self,context,text):
        try:
            response = openai.ChatCompletion.create(
                model=engine,
                
                messages = [
                    {'role':"system","content": context},
                    {"role":"user","content": text}
                ]
                
            )
            
            return response["choices"][0]["message"]["content"]
        except Exception as e:
            return "Ups, algo salió mal.\n"+str(e)
