from routes.investments import get_investment_value
from models import Client, clients_schema, client_schema, Investment, LifestyleAsset, Property, Liability
from database import db
from flask import Blueprint, request
from flask.json import jsonify


clients_blueprint = Blueprint('clients_blueprint', __name__)


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

    return client_schema.jsonify(new_client), 201


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


@clients_blueprint.route("/get-networth/<client_id>", methods=["GET"])
def get_networth(client_id):
    if Client.query.get(client_id).isPrimary == 1:
        client_type = "Client"
    else:
        client_type = "Partner"

    if client_type == "Client":
        sole_investments = Investment.query.filter(
            Investment.owner1_id == client_id,
            Investment.owner2_id == None).all()

        joint_investments = Investment.query.filter(
            Investment.owner1_id == client_id,
            Investment.owner2_id != None).all()

        sole_lifestyle_assets = LifestyleAsset.query.filter(
            LifestyleAsset.owner1_id == client_id,
            LifestyleAsset.owner2_id == None).all()

        joint_lifestyle_assets = LifestyleAsset.query.filter(
            LifestyleAsset.owner1_id == client_id,
            LifestyleAsset.owner2_id != None).all()

        sole_properties = Property.query.filter(
            Property.owner1_id == client_id,
            Property.owner2_id == None).all()

        joint_properties = Property.query.filter(
            Property.owner1_id == client_id,
            Property.owner2_id != None).all()

        sole_liabilities = Liability.query.filter(
            Liability.owner1_id == client_id,
            Liability.owner2_id == None).all()

        joint_liabilities = Liability.query.filter(
            Liability.owner1_id == client_id,
            Liability.owner2_id != None).all()

    elif client_type == "Partner":
        sole_investments = Investment.query.filter(
            Investment.owner1_id == None,
            Investment.owner2_id == client_id).all()

        joint_investments = Investment.query.filter(
            Investment.owner1_id != None,
            Investment.owner2_id == client_id).all()

        sole_lifestyle_assets = LifestyleAsset.query.filter(
            LifestyleAsset.owner1_id == None,
            LifestyleAsset.owner2_id == client_id).all()

        joint_lifestyle_assets = LifestyleAsset.query.filter(
            LifestyleAsset.owner1_id != None,
            LifestyleAsset.owner2_id == client_id).all()

        sole_properties = Property.query.filter(
            Property.owner1_id == None,
            Property.owner2_id == client_id).all()

        joint_properties = Property.query.filter(
            Property.owner1_id != None,
            Property.owner2_id == client_id).all()

        sole_liabilities = Liability.query.filter(
            Liability.owner1_id == None,
            Liability.owner2_id == client_id).all()

        joint_liabilities = Liability.query.filter(
            Liability.owner1_id != None,
            Liability.owner2_id == client_id).all()


    total_sole_investments = 0
    for investment in sole_investments:
        value = get_investment_value(investment.id).get_json()["total_value"]
        total_sole_investments += value

    total_joint_investments = 0
    for investment in joint_investments:
        value = get_investment_value(investment.id).get_json()["total_value"]
        total_joint_investments += (value * 0.5)

    total_sole_lifestyle_assets = 0
    for lifestyle_asset in sole_lifestyle_assets:
        value = float(lifestyle_asset.value)
        total_sole_lifestyle_assets += value

    total_joint_lifestyle_assets = 0
    for lifestyle_asset in joint_lifestyle_assets:
        value = float(lifestyle_asset.value)
        total_joint_lifestyle_assets += (value * 0.5)

    total_sole_properties = 0
    for property in sole_properties:
        value = float(property.value)
        total_sole_properties += value

    total_joint_properties = 0
    for property in joint_properties:
        value = float(property.value)
        total_joint_properties += (value * 0.5)

    total_sole_liabilities = 0
    for liability in sole_liabilities:
        value = float(liability.outstanding)
        total_sole_liabilities += value

    total_joint_liabilities = 0
    for liability in joint_liabilities:
        value = float(liability.amount_outstanding)
        total_joint_liabilities += (value * 0.5)

    networth = total_sole_investments + total_joint_investments + total_sole_lifestyle_assets + total_joint_lifestyle_assets + \
        total_sole_properties + total_joint_properties - \
        total_sole_liabilities - total_joint_liabilities

    return jsonify(
        total_sole_investments=total_sole_investments,
        total_joint_investments=total_joint_investments,
        total_sole_lifestyle_assets=total_sole_lifestyle_assets,
        total_joint_lifestyle_assets=total_joint_lifestyle_assets,
        total_sole_properties=total_sole_properties,
        total_joint_properties=total_joint_properties,
        total_sole_liabilities=total_sole_liabilities,
        total_joint_liabilities=total_joint_liabilities,
        networth = networth
    )

    # return jsonify(
    # total_sole_investments = 100000,
    # total_joint_investments = 17500,
    # total_sole_properties = 450000,
    # total_joint_properties = 780000,
    # total_sole_assets = 100000,
    # total_joint_assets = 77000,
    # total_sole_liabilities = 165000,
    # total_joint_liabilities = 96000,
    # networth = 897900
    # )

    result = investments_schema.dump(investments_client_only)

    return jsonify(result)
