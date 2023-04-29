from flask import Flask, jsonify, request
from flask import render_template, redirect, url_for
from flask_cors import CORS
from chat.pyTA2 import Pyta
from markdown import markdown


app = Flask(__name__)
cors = CORS(app, origins="*")
pyta = Pyta()


# web routes
@app.route("/")
def index():
    conversations = pyta.get_chat_names()
    print(conversations,flush=True)
    return render_template('index.html', conversations=conversations)

@app.route("/chat/<chat_name>",methods=['GET'])
def chat(chat_name):
    return render_template('conversation.html', name=chat_name)

@app.route("/templates")
def templates():
    return render_template('templates.html')

@app.route("/chats/<chat_name>/delete",methods=['GET'])
def delete_chat_view(chat_name):
    pyta.delete_chat(chat_name)
    return redirect(url_for('index'))

@app.route("/new_chat", methods=['POST'])
def new_chat():
    chat_name = request.form["chat_name"]
    pyta.new_chat(chat_name)
    return redirect(url_for('chat', chat_name=chat_name))

# api routes


# Chat

@app.route("/api/chats",methods=['GET'])
def get_chats():
    """
    Devuelve la lista de nombres de los chats
    """
    chats = pyta.get_chat_names()
    return jsonify(chats)

@app.route("/api/chat/<chat_name>",methods=['GET'])
def chat_api(chat_name):
    pyta.load_chat(chat_name)
    chat = pyta.get_chat()
    return jsonify(chat)

@app.route("/api/chat/<chat_name>",methods=['DELETE'])
def delete_chat(chat_name):
    pyta.delete_chat(chat_name)
    return jsonify({"status":"ok"})

@app.route("/api/chat/<chat_name>/add",methods=['POST'])
def add_message(chat_name):
    message = request.get_json()
    if "content" not in message or message["content"] == "" and message["template"] == "":
        chat = pyta.get_chat()
        return jsonify(chat)
    template = message["template"] if ("template" in message and message["template"]!= "default") else None
    pyta.add_message(message["content"],message["role"],template)
    chat = pyta.get_chat()
    return jsonify(chat)

@app.route("/api/chat/<chat_name>",methods=['POST'])
def get_response(chat_name):
    data = request.get_json()
    print("data:",data,flush=True)
    num_words = 1000
    if "numWords" in data.keys():
        print("yesss")
        num_words = int(data["numWords"])
    pyta.load_chat(chat_name)
    print("numWords:",num_words,flush=True)
    pyta.get_response(num_words=num_words)
    return jsonify(pyta.get_chat())

@app.route("/api/chat/<chat_name>/save",methods=['POST'])
def save_messages(chat_name):
    data = request.get_json()
    content = data["content"]
    pyta.save_chat(chat_name,content)
    return jsonify(pyta.get_chat())

@app.route("/api/chat/<chat_name>/delete/<id>",methods=['DELETE'])
def delete_message(chat_name,id):
    pyta.delete_message(chat_name,id)
    return jsonify(pyta.get_chat())

@app.route("/api/chat/<chat_name>/update/<id>",methods=['PUT'])
def update_message(chat_name,id):
    data = request.get_json()
    content = data["content"]
    role = data["role"]
    pyta.update_message(chat_name,id,content,role)
    return jsonify(pyta.get_chat())

@app.route("/api/chat/<chat_name>/swap/<idfrom>/<idto>",methods=['PUT'])
def swap_messages(chat_name,idfrom,idto):
    pyta.swap_messages(chat_name,idfrom,idto)
    return jsonify(pyta.get_chat())


# Templates

@app.route("/api/templates",methods=['GET'])
def get_templates():
    templates = pyta.get_templates()
    templates = sorted(templates, key=lambda k: k['name'])
    return jsonify(templates)

@app.route("/api/templates",methods=['POST'])
def add_template():
    data = request.get_json()
    template_name = data["name"]
    template = data["content"]
    replace_word = data["replaceWord"]
    pyta.add_template(template_name,template,replace_word)
    templates = pyta.get_templates()
    templates = sorted(templates, key=lambda k: k['name'])
    return jsonify(templates)

@app.route("/api/templates/<template_name>",methods=['DELETE'])
def delete_template(template_name):
    pyta.delete_template(template_name)
    templates = pyta.get_templates()
    templates = sorted(templates, key=lambda k: k['name'])
    return jsonify(templates)

# run app in 0.0.0.0:5000
app.run(host='0.0.0.0', port=5500,debug=True)
