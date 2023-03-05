import os
from openai_api import Openai_api


def separate_extension(filename):
    return os.path.splitext(filename)

def read_file(filename):
    with open("input/"+filename, "r") as file:
        return file.read()
    
def ls(ruta = '.'):
    return os.listdir(ruta)
    
def save_output(filename, output):
    name_array = separate_extension(filename)
    name = name_array[0].split("/")[-1]
    extension = name_array[1]
    output_filename = "output/" + name + extension
    with open(output_filename, "w") as file:
        file.write(output)

def correct_files():
    api = Openai_api()
    context = "Eres un profesor del bootcamp de full stack developer con Javascript"
    for filename in ls("input"):
        text = read_file(filename)
        text = "Teniendo en cuenta el enunciado, corrige los errores del código, mostrando solo los errores y explicando cómo resolver cada uno de ellos. Si la función no hace lo que se pide, propón una alternativa.\n"+text
        output = api.get_response(text)
        print(output)
        save_output(filename, output)

def main():
    api = Openai_api()
    context = "Eres un profesor del bootcamp de full stack developer con Javascript"
    text = "Describe ES6 y explica sus ventajas, novedades y ejemplos de uso"
    output = api.get_response(context,text)
    print(output)
    save_output("funciones", output)


if __name__ == "__main__":

    main()