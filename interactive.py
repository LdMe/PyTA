from pyTA import PyTA

class Interactive:
    def __init__(self,pyta=PyTA()):
        self.pyta = pyta
        self.boolean_choices = {
            's': True,
            'n': False
        }

    def interactive(self,last_choices = {}):
        activities = {
            '1': "Crear clases",
            '2': "Corregir ejercicios",
            '3': "Escribir libremente",
            '4': "Salir"
        }
        functions = {
            '1': self.create_classes,
            '2': self.correct_files,
            '3': self.free_prompt,
            '4': exit
        }
        print("\nSoy PyTA, tu asistente de aprendizaje automático")
        while True:
            
            print("\n-------------\n¿Qué quieres hacer?")
            self.print_choices(activities)
            option = input("Elige una opción: ")
            if option in functions:
                functions[option](last_choices)
            else:
                print("Opción no válida")
        print("¡Hasta pronto!")

    

    
    
    def create_classes(self,choices):
        
        choices["theme"] = self.input_text("¿Qué tema quieres tratar? ",choices.get('theme',''))
        choices["filename"] = self.input_text("¿Cómo quieres llamar al archivo? ",choices.get('filename',''))
        choices["is_exercise"] = self.translate_choice_to_bool(self.input_text("¿Es un ejercicio? (s/n) ",choices.get('is_exercise','')),self.boolean_choices)
        choices["append"] = self.translate_choice_to_bool(self.input_text("¿Quieres añadirlo al final del archivo si este ya existe? (s/n) ",choices.get('append','')),self.boolean_choices)
        self.pyta.create_classes(choices["theme"],choices["filename"],choices["is_exercise"],choices["append"])
    
    def correct_files(self,choices):
        self.pyta.correct_files()
    
    def free_prompt(self,choices):
        if(self.translate_choice_to_bool(self.input_text("¿Quieres añadir contexto? (s/n) ","s"),self.boolean_choices)):
            context = choices.get('context',None)
            context = context if context != None else self.pyta.context
            choices["context"] = self.input_text("El contexto actual es el siguiente:\n---------\n"+context+ "\n---------\nEscribe el nuevo contexto (presiona enter para mantener el anterior): ","")
        choices["text"] = self.input_text("Escribe lo que quieras: ")
        choices["filename"] = self.input_text("¿Cómo quieres llamar al archivo? ",choices.get('filename',''))
        choices["append"] = self.translate_choice_to_bool(self.input_text("¿Quieres añadirlo al final del archivo si este ya existe? (s/n) ",choices.get('append','')),self.boolean_choices)
        self.pyta.prompt_and_save(choices["text"],choices["filename"],append=choices.get("append",False),context=choices.get('context',None))
        

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
        