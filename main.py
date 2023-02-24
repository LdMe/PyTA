import sys
import os
from openai_api import Openai_api


def separate_extension(filename):
    return os.path.splitext(filename)

def read_file(filename):
    with open("input/"+filename, "r") as file:
        return file.read()
    
def save_output(filename, output):
    name_array = separate_extension(filename)
    print(name_array)
    name = name_array[0].split("/")[-1]
    extension = name_array[1]
    output_filename = "output/" + name + extension
    with open(output_filename, "w") as file:
        file.write(output)

def main(argv):
    api = Openai_api()
    filename = argv[1] if len(argv) > 1 else "prueba.js"
    input = read_file(filename)
    input = "Teniendo en cuenta el enunciado, corrige los errores del código, mostrando solo los errores y explicando cómo resolver cada uno de ellos. Si la función no hace lo que se pide, propón una alternativa.\n"+input
    output = api.get_response(input)
    print(output)
    save_output(filename, output)

if __name__ == "__main__":

    main(sys.argv)