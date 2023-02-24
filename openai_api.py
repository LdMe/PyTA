import os
import openai
import sys
import dotenv


class Openai_api:
    def __init__(self):
        dotenv.load_dotenv()
        openai.organization = "org-uhKzEYzMFJtrozvGrNhXRzgP"
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def get_response(self,input):
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt= input,
            temperature=0.9,
            max_tokens=2000,
            top_p=1,
            
        )
        return response["choices"][0]["text"]
