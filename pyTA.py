import os
from openai_api import Openai_api

CONTEXT = "Eres un profesor del bootcamp de full stack developer con Javascript (ES6). Las respuestas deben ir en formato markdown y el código en el formato correspondiente."
THEORY = "Explica detalladamente <tema>. Muestra ejemplos de código y casos de uso."
EXERCISES = "Crea ejercicios sobre <tema>. Los ejercicios deben ser sencillos y se deben presentar como una solución a un problema real."
CORRECT = "Teniendo en cuenta el enunciado, corrige los errores del código, mostrando solo los errores y explicando cómo resolver cada uno de ellos. Si la función no hace lo que se pide, propón una alternativa.\n"
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
            text = CORRECT + text
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
        return output
        
    def interactive(self,last_choices = {}):
        theme = ""
        filename = ""
        is_exercise = False
        append = False
        
        class_or_correct = self.input_text("¿Quieres crear clases o corregir ejercicios? (clases/corregir) ",last_choices.get('class_or_correct',''))
        if class_or_correct == "clases":
            theme = self.input_text("¿Qué tema quieres tratar? ",last_choices.get('theme',''))
            filename = self.input_text("¿Cómo quieres llamar al archivo? ",last_choices.get('filename',''))
            is_exercise = self.input_text("¿Es un ejercicio? (s/n) ",last_choices.get('is_exercise',''))
            if is_exercise == "s":
                is_exercise = True
            else:
                is_exercise = False
            append = self.input_text("¿Quieres añadir al final del archivo? (s/n) ",last_choices.get('append',''))
            if append == "s":
                append = True
            else:
                append = False
            self.create_classes(theme,filename,is_exercise,append)
        elif class_or_correct == "corregir":
            self.correct_files()
        else:
            print("Opción no válida")
            self.interactive(last_choices)
        again = self.input_text("\n\n¿Quieres hacer otra cosa? (s/n) ")
        if again == "s":
            last_choices = {
                'class_or_correct': class_or_correct,
                'theme': theme,
                'filename': filename,
                'is_exercise': "s" if is_exercise else "n",
                'append': "s" if append else "n"
            }
            self.interactive(last_choices)
        else:
            print("¡Hasta pronto!")

        
