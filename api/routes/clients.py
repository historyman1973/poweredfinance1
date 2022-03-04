from database import db
from flask import Blueprint, request
from flask.json import jsonify


clients_blueprint = Blueprint('clients_blueprint', __name__)

from models import Client, clients_schema, client_schema


@clients_blueprint.route("/")
def index():
    return "Server is operational"


@clients_blueprint.route("/add-client", methods=['POST'])
def add_client():
    forename = request.json['forename']
    preferred_name = request.json['preferred_name']
    middle_names = request.json['middle_names']
    surname = request.json['surname']
    gender = request.json['gender']
    isPrimary = request.json['isPrimary']

    new_client = Client(
        forename=forename,
        preferred_name=preferred_name,
        middle_names=middle_names,
        surname=surname,
        gender=gender,
        isPrimary=isPrimary
    )

    db.session.add(new_client)
    db.session.commit()

    return client_schema.jsonify(new_client)


@clients_blueprint.route("/get-client/<client_id>", methods=["GET"])
def get_client(client_id):
    client = Client.query.get(client_id)
    if client:
        result = client_schema.dump(client)
        return jsonify(result)
    else:
        return("Client id " + client_id + " doesn't exist."), 404


@clients_blueprint.route("/client-list", methods=["GET"])
def get_clients():
    all_clients = Client.query.all()
    result = clients_schema.dump(all_clients)
    return jsonify(result)