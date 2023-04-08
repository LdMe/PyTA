from flask import Flask, jsonify, request
from flask import render_template, redirect, url_for
from pyTA2 import Pyta
from markdown import markdown


app = Flask(__name__)
pyta = Pyta()
app.jinja_env.globals.update(markdown=markdown)

@app.route("/")
def index():
    conversations = pyta.get_chat_names()
    return render_template('index.html', conversations=conversations)

@app.route("/chat/<chat_name>",methods=['GET'])
def chat(chat_name):
    return render_template('conversation.html', name=chat_name,chat=chat)

@app.route("/api/chats/<chat_name>",methods=['GET'])
def chat_api(chat_name):
    pyta.load_chat_file(chat_name)
    chat = pyta.get_chat()
    return jsonify(chat)

@app.route("/api/chats/<chat_name>",methods=['POST'])
def ask_api(chat_name):
    chat = request.get_json()
    if chat[-1]["content"].strip() == "":
        return jsonify(chat)
    
    pyta.add_message(chat[-1]["content"],chat[-1]["role"])
    if pyta.get_last_role() == "user":
        response = pyta.get_response()
        pyta.save_chat(chat_name)
        chat = pyta.get_chat()
        return jsonify(chat)
    pyta.save_chat(chat_name)
    chat = pyta.get_chat()
    return jsonify(chat)

@app.route("/api/chats/<chat_name>",methods=['PUT'])
def save_api(chat_name):
    chat = request.get_json()
    pyta.load_chat(chat)
    pyta.save_chat(chat_name)
    chat = pyta.get_chat()
    return jsonify(chat)
@app.route("/api/chats/<chat_name>/delete/<position>",methods=['DELETE'])
def delete_view_message(chat_name,position):
    pyta.delete_message(chat_name,int(position))
    return jsonify(pyta.get_chat())

@app.route("/api/chats/<chat_name>",methods=['DELETE'])
def delete_api(chat_name):
    pyta.delete_chat(chat_name)
    return jsonify({"status":"ok"})
@app.route("/chats/<chat_name>/delete",methods=['GET'])
def delete_view(chat_name):
    pyta.delete_chat(chat_name)
    return redirect(url_for('index'))

@app.route("/chat/<chat_name>",methods=['POST'])
def chat_post(chat_name):
    pyta.load_chat(chat_name)
    message = request.form["message"]
    pyta.add_message(message)
    response = pyta.get_response()
    return chat(chat_name)

@app.route("/new_chat", methods=['POST'])
def new_chat():
    chat_name = request.form["chat_name"]
    pyta.new_chat(chat_name)
    return redirect(url_for('chat', chat_name=chat_name))

def format_md_to_html(md):
    return markdown(md, extensions=['fenced_code'])

def format_messages(chat):
    for message in chat:
        message["content"] = format_md_to_html(message["content"])
    return chat

# run app in 0.0.0.0:5000
app.run(host='0.0.0.0', port=5000,debug=True)