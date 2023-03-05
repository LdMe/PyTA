import os
from openai_api import Openai_api


def separate_extension(filename):
    return os.path.splitext(filename)

def read_file(filename):
    with open("input/"+filename, "r") as file:
        return file.read()
    
def ls(ruta = '.'):
    return os.listdir(ruta)
    
def save_output(filename, output,append=False):
    name_array = separate_extension(filename)
    name = name_array[0].split("/")[-1]
    extension = name_array[1]
    output_filename = "output/" + name + extension
    if append:
        output = "\n" + output
        with open(output_filename, "a") as file:
            file.write(output)
    else:
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
    context = "Eres un profesor del bootcamp de full stack developer con Javascript (ES6). Las respuestas deben ir en formato markdown y el código en formato javascript."
    #text = "Planifica la semana de clases sobre los siguientes temas: Tipos de funciones en javascript, asincronía, promesas, fetch, web storage, asnyc/await. La semana consta de 5 días de clase, de lunes a jueves el día consta de 7 horas divididas en 3 secciones. La primera es de teoría y dura unas 2 horas y media, la segunda es de pair programming de 2 horas, y al última es de ejercicios individuales de 2 horas y media. Los viernes son días de repaso de 4 horas y media, con un descanso de media hora después de las primeras 2 horas y media. Organízalas en el orden que consideres más adecuado. Si se puede concentrar la teoría en pocos días para poder hacer más ejercicios a lo largo de la semana, mejor."
    text = "Crea ejercicios para practicar con métodos de arrays (map, filter, reduce, find, forEach, some ). Los ejercicios deben ser sencillos, ya que se busca la comprensión de los conceptos, no la memorización."
    output = api.get_response(context,text)
    print(output)
    save_output("array_methods_ejercicios.md", output,append=False)


if __name__ == "__main__":

    main()