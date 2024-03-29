import os
import re
from openai_api import Openai_api

CONTEXT = "Eres un profesor del bootcamp de full stack developer con Javascript (ES6). Las respuestas deben ir en formato markdown y el código en el formato correspondiente."
THEORY = "Explica detalladamente <tema>. Muestra ejemplos de código y casos de uso."
EXERCISES = "Crea ejercicios sobre <tema>. Los ejercicios deben ser sencillos y se deben presentar como una solución a un problema real."
CORRECTION = "Teniendo en cuenta el enunciado, corrige los errores del código, mostrando solo los errores y explicando cómo resolver cada uno de ellos. Si la función no hace lo que se pide, propón una alternativa.\n"


class PyTA:
    def __init__(self,context = CONTEXT):
        self.context = context
        self.api = Openai_api()

    def get_response(self,text):
        return self.api.get_response(self.context,text)
    
    def prompt_and_save(self,text,filename,suffix="",append=False):
        output = self.get_response(text)
        print(output)
        self.save_output(filename, output,suffix,append)
        return output

    def save_output(self,filename, output,suffix="",append=False,markdown=True):
        name_array = self.separate_extension(filename)
        name = name_array[0].split("/")[-1]
        extension = name_array[1]
        if markdown:
            extension = ".md"
        output_filename = "output/" + name + suffix+ extension
        if append:
            output = "\n" + output
            with open(output_filename, "a") as file:
                file.write(output)
        else:
            with open(output_filename, "w") as file:
                file.write(output)
    def save_unsolved_exercises(self,filename, output,append=False):
        output_solved = re.sub(r'\`{3}([^\`]*\`{3})',"",output)
        self.save_output(filename, output_solved,suffix="_sin_resolver", append=append, markdown=True)

    def separate_extension(self,filename):
        return os.path.splitext(filename)
    
    def input_text(self,prompt,last_choice=""):
        if last_choice != "":
            prompt += "[{}]: ".format(last_choice)
        text = input(prompt + " ")
        if text == "":
            text = last_choice
        return text
    
    def read_file(self,filename):
        with open("input/"+filename, "r") as file:
            return file.read()
    def ls(self,ruta = '.'):
        return os.listdir(ruta)
    
    def correct_files(self,markdown=True):
        for filename in self.ls("input"):
            text = self.read_file(filename)
            text = CORRECTION + text
            output = self.get_response(text)
            print(output)
            self.save_output(filename, output,markdown=markdown)
            
    def create_classes(self,theme,filename,is_exercise=False, append=False):
        suffix = "_ejercicios" if is_exercise else ""
        if is_exercise:
            text = EXERCISES.replace("<tema>",theme)
        else:
            text = THEORY.replace("<tema>",theme)
        output = self.prompt_and_save(text,filename,suffix,append)
        if is_exercise:
            self.save_unsolved_exercises(filename, output,append)
        return output
      