from pyTA import PyTA
import traceback
class Interactive:
    def __init__(self,pyta=PyTA()):
        self.pyta = pyta
        self.boolean_choices = {
            's': True,
            'n': False
        }
        self.exit_choices = [
            'q',
            'quit',
            'exit',
            'salir'
        ]
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
            '5': exit,
        }
        self.choices = {
            "theme": "",
            "filename": "",
            "is_exercise": False,
            "append": True,
            "text": "",
            "context": ""
        }

    def interactive(self,last_choices = {}):
        print("\nSoy PyTA, tu asistente de aprendizaje automático")
        print(self.load_symbol_image("assets/pyta.md"))
        while True:
            
            print("\n-------------\n¿Qué quieres hacer?")
            print("(si te equivocas puedes escribir q, quit, exit o salir para volver al menú principal, los cambios hechos hasta el momento se mantendrán)")
            self.print_choices(self.activities)
            try:
                option = input("Elige una opción: ")
                print("\n-------------\n")
                if option in self.functions:
                    if option == '5':
                        print(self.choices)
                        exit()
                    self.functions[option]()
                    print(self.choices)
                else:
                    print("Opción no válida")
            except Exception as e:
                print(traceback.format_exc())


    def change_context(self):
        context = self.pyta.context
        print("El contexto actual es el siguiente:\n---------\n"+context+ "\n---------\nEscribe el nuevo contexto (presiona enter para mantener el anterior): ")
        if not self.update_choice("context", self.input_text("¿Qué contexto quieres añadir? ",self.choices.get('context',''))) : return
        self.pyta.context = self.choices["context"]

    def create_classes(self):
        
        if not self.update_choice("theme" ,self.input_text("¿Qué tema quieres tratar? ",self.choices.get('theme',''))) : return
        if not self.update_choice("is_exercise" , self.translate_choice_to_bool(self.input_text("¿Es un ejercicio? (s/n) ",self.choices.get('is_exercise','')),self.boolean_choices)) : return
        if not self.name_file(): return
        self.pyta.create_classes(self.choices["theme"],self.choices["filename"],self.choices["is_exercise"],self.choices["append"])
    
    def update_choice(self,choice,result):
        if result in self.exit_choices:
            return False
        self.choices[choice] = result
        return True

    def correct_files(self):
        self.pyta.correct_files()

    def free_prompt(self):
        if "text" in self.choices:
            print("El texto actual es el siguiente:\n---------\n"+self.choices["text"]+ "\n---------\nEscribe el nuevo texto (presiona enter para mantener el anterior): ")
        else:
            self.choices["text"] = ""
        if not self.update_choice("text", self.input_text("Escribe lo que quieras: ",self.choices["text"])) : return
        if not self.name_file(): return
        self.pyta.prompt_and_save(self.choices["text"],self.choices["filename"],append=self.choices.get("append",False))
        
    def name_file(self):
        if not self.update_choice("filename", self.input_text("¿Cómo quieres llamar al archivo? ",self.choices.get('filename',''))) : return False
        if not self.update_choice("append", self.translate_choice_to_bool(self.input_text("¿Quieres añadirlo al final del archivo si este ya existe? (s/n) ",self.choices.get('append','')),self.boolean_choices)) : return False
        return True
    
    def load_symbol_image(self,filename="symbol.md"):
        with open(filename,"r") as f:
            symbol = f.read()
        return symbol


    def print_choices(self,choices):
        for key, value in choices.items():
                print(key + ": " + value)
    
    def translate_choice_to_bool(self,choice,choices):
        if choice in self.exit_choices:
            return choice
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
        