from flask import Flask, request

app = Flask(__name__)

@app.route("/client-list")
def client_list():
    
    return "Hello World"