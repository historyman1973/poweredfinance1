from database import db
from flask import Blueprint, request
from flask.json import jsonify

api_blueprint = Blueprint('api_blueprint', __name__)

from models import Client, clients_schema, client_schema, Investment, investment_schema, investments_schema

@api_blueprint.route("/")
def index():
    return "Server is operational"


@api_blueprint.route("/add-client", methods=['POST'])
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


@api_blueprint.route("/get-client/<client_id>", methods=["GET"])
def get_client(client_id):
    client = Client.query.get(client_id)
    result = client_schema.dump(client)
    return jsonify(result)


@api_blueprint.route("/client-list", methods=["GET"])
def get_clients():
    all_clients = Client.query.all()
    result = clients_schema.dump(all_clients)
    return jsonify(result)


@api_blueprint.route("/add-investment", methods=["POST"])
def add_investment():
    investment_type = request.json['investment_type']
    provider = request.json['provider']
    investment_ref = request.json['investment_ref']
    value = request.json['value']
    owner1_id = request.json['owner1_id']
    owner2_id = request.json['owner2_id']

    # owners = create_owners(owner1_id=owner1_id, owner2_id=owner2_id)

    new_investment = Investment(
        investment_type=investment_type,
        provider=provider,
        investment_ref=investment_ref,
        value=value,
        owner1_id=owner1_id,
        owner2_id=owner2_id
    )

    db.session.add(new_investment)
    db.session
    db.session.commit()

    return investment_schema.jsonify(new_investment)


@api_blueprint.route("/get-investment/<investment_id>", methods=["GET"])
def get_investment(investment_id):
    investment = Investment.query.get(investment_id)
    result = investment_schema.dump(investment)
    return jsonify(result)


@api_blueprint.route("/get-investments/<client_id>", methods=["GET"])
def get_investments(client_id):
    client = Client.query.get(client_id)
    if client.isPrimary == True:
        investments = db.session.query(
            Investment).filter_by(owner1_id=client_id)
    else:
        investments = db.session.query(
            Investment).filter_by(owner2_id=client_id)

    return investments_schema.jsonify(investments)


