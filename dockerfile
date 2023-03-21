FROM python:3.10

# Copiar el código en la imagen
COPY . /app

# Establecer el directorio de trabajo como /app
WORKDIR /app

# Instalar las librerías necesarias
RUN pip install -r requirements.txt

# Crear las carpetas input y output si no existen
RUN mkdir -p /app/input && \
    mkdir -p /app/output
    
# Ejecutar el archivo main.py
CMD ["python", "main.py"]

