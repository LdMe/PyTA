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

def main():
    api = Openai_api()
    for filename in ls("input"):
        input = read_file(filename)
        input = "Teniendo en cuenta el enunciado, corrige los errores del código, mostrando solo los errores y explicando cómo resolver cada uno de ellos. Si la función no hace lo que se pide, propón una alternativa.\n"+input
        output = api.get_response(input)
        print(output)
        save_output(filename, output)

if __name__ == "__main__":

    main()