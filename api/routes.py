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
    forename = request.json['forename']
    preferred_name = request.json['preferred_name']
    middle_names = request.json['middle_names']
    surname = request.json['surname']
    gender = request.json['gender']

    new_client = Client(
        forename=forename,
        preferred_name=preferred_name,
        middle_names=middle_names,
        surname=surname,
        gender=gender)

    db.session.add(new_client)
    db.session.commit()

    return client_schema.jsonify(new_client)
