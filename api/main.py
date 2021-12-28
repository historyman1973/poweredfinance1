from flask import Flask, request, jsonify
from models import app, Clients



@app.route("/client-list", methods=["GET"])
def client_list():
    if request.method == "GET":
        data = Clients.query.all()
        result = [d.__dict__ for d in data]
        return jsonify(result=result)

if __name__ == "__main__":
    app.run(debug=True)