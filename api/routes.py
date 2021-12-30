from database import db
from flask import Blueprint, request
from flask.json import jsonify

api_blueprint = Blueprint('api_blueprint', __name__)

from models import Client, clients_schema, client_schema

@api_blueprint.route("/")
def index():
    return "Server is operational"


@api_blueprint.route("/client-list")
def get_clients():
    all_clients = Client.query.all()
    result = clients_schema.dump(all_clients)
    return jsonify(result)
    # return "Client list active"


@api_blueprint.route("/add-client", methods=['POST'])
def add_client():
    name = request.json['name']

    new_client = Client(name)

    db.session.add(new_client)
    db.session.commit()

    return client_schema.jsonify(new_client)
