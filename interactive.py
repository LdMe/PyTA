from pyTA import PyTA

class Interactive:
    def __init__(self,pyta=PyTA()):
        self.pyta = pyta
        self.boolean_choices = {
            's': True,
            'n': False
        }
        self.activities = {
            '1': "Crear clases",
            '2': "Corregir ejercicios",
            '3': "Escribir libremente",
            '4': "Cambiar contexto",
            '5': "Salir"
        }
        self.functions = {
            '1': self.create_classes,
            '2': self.correct_files,
            '3': self.free_prompt,
            '4': self.change_context,
            '5': exit
        }

    def interactive(self,last_choices = {}):
        print("\nSoy PyTA, tu asistente de aprendizaje automático")
        print(self.load_symbol_image("assets/pyta.md"))
        while True:
            
            print("\n-------------\n¿Qué quieres hacer?")
            self.print_choices(self.activities)
            try:
                option = input("Elige una opción: ")
                print("\n-------------\n")
                if option in self.functions:
                    self.functions[option](last_choices)
                    print(last_choices)
                else:
                    print("Opción no válida")
            except Exception as e:
                print("Ocurrió un error: "+str(e))
    
    def change_context(self,choices):
        context = self.pyta.context
        print("El contexto actual es el siguiente:\n---------\n"+context+ "\n---------\nEscribe el nuevo contexto (presiona enter para mantener el anterior): ")
        choices["context"] = self.input_text("¿Qué contexto quieres añadir? ",choices.get('context',''))
        self.pyta.context = choices["context"]

    def create_classes(self,choices):
        
        choices["theme"] = self.input_text("¿Qué tema quieres tratar? ",choices.get('theme',''))
        choices["is_exercise"] = self.translate_choice_to_bool(self.input_text("¿Es un ejercicio? (s/n) ",choices.get('is_exercise','')),self.boolean_choices)
        self.name_file(choices)
        self.pyta.create_classes(choices["theme"],choices["filename"],choices["is_exercise"],choices["append"])
    
    def correct_files(self,choices):
        self.pyta.correct_files()

    def free_prompt(self,choices):
        if "text" in choices:
            print("El texto actual es el siguiente:\n---------\n"+choices["text"]+ "\n---------\nEscribe el nuevo texto (presiona enter para mantener el anterior): ")
        else:
            choices["text"] = ""
        choices["text"] = self.input_text("Escribe lo que quieras: ",choices["text"])
        self.name_file(choices)
        self.pyta.prompt_and_save(choices["text"],choices["filename"],append=choices.get("append",False))
        
    def name_file(self,choices):
        choices["filename"] = self.input_text("¿Cómo quieres llamar al archivo? ",choices.get('filename',''))
        choices["append"] = self.translate_choice_to_bool(self.input_text("¿Quieres añadirlo al final del archivo si este ya existe? (s/n) ",choices.get('append','')),self.boolean_choices)
    
    def load_symbol_image(self,filename="symbol.md"):
        with open(filename,"r") as f:
            symbol = f.read()
        return symbol


    def print_choices(self,choices):
        for key, value in choices.items():
                print(key + ": " + value)
    
    def translate_choice_to_bool(self,choice,choices):
        return choices.get(choice,False)
    
    def translate_choice_from_bool(self,choice,choices):
        for key, value in choices.items():
            if value == choice:
                return key
        return choice
    
    def input_text(self,prompt,last_choice=""):
        if last_choice != "":
            last_choice = self.translate_choice_from_bool(last_choice,self.boolean_choices)
            prompt += "[{}]: ".format(last_choice)
        text = input(prompt + " ")
        if text == "":
            text = last_choice
        return text


if __name__ == "__main__":
    interactive = Interactive()
    interactive.interactive()
        