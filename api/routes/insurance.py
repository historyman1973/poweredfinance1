from flask import Blueprint, request
from flask.json import jsonify
from database import db
from models import Client, Insurance, insurance_schema, insurances_schema

insurance_blueprint = Blueprint('insurance_blueprint', __name__)

@insurance_blueprint.route("/add-insurance", methods=["POST"])
def add_insurance():
    # Initialise owners

    owner1 = None
    owner2 = None

    status=request.json['status']
    category=request.json['category']
    insurance_type=request.json['insurance_type']
    provider=request.json['provider']
    policy_ref=request.json['policy_ref']
    sum_assured=request.json['sum_assured']
    monthly_premium=float(request.json['monthly_premium'])
    owner1_id=request.json['owner1_id']
    owner2_id=request.json['owner2_id']
    lifeassured1_id=request.json['lifeassured1_id']
    lifeassured2_id=request.json['lifeassured2_id'] 

    # Check if there's a value for owner1 in the request
    if owner1_id:
        # If there is an owner1 then check it exists in the database
        check_owner1 = Client.query.get(owner1_id)
        # If it does exist in the database, set owner1 to the resulting CLient object
        if check_owner1:
            owner1 = check_owner1
        else:
            return("Client id " + str(owner1_id) + " doesn't exist."), 404

    # Check if there's a value for owner2 in the request
    if owner2_id:
        # If there is an owner2 then check it exists in the database
        check_owner2 = Client.query.get(owner2_id)
        # If it does exist in the database, set owner2 to the resulting Client object
        if check_owner2:
            owner2 = check_owner2
        else:
            return("Client id " + str(owner2_id) + " doesn't exist."), 404

    if owner1 or owner2:
        new_insurance = Insurance(
            status=status,
            category=category,
            insurance_type=insurance_type,
            provider=provider,
            policy_ref=policy_ref,
            sum_assured=sum_assured,
            monthly_premium=monthly_premium,
            owner1_id=owner1_id,
            owner2_id=owner2_id,
            lifeassured1_id=lifeassured1_id,
            lifeassured2_id=lifeassured2_id            
        )

        db.session.add(new_insurance)
        db.session.commit()

        return insurance_schema.jsonify(new_insurance), 201


@insurance_blueprint.route("/delete-insurance/<insurance_id>", methods=["DELETE"])
def delete_insurance(insurance_id):
    if Insurance.query.get(insurance_id):
        db.session.delete(Insurance.query.get(insurance_id))
        db.session.commit()

        return("Insurance deleted"), 204
    else:
        return("Insurance doesn't exist"), 404


@insurance_blueprint.route("/get-insurance/<insurance_id>", methods=["GET"])
def get_insurance(insurance_id):
    insurance = Insurance.query.get(insurance_id)
    result = insurance_schema.dump(insurance)
    if result:
        return jsonify(result)
    else:
        return("Insurance id " + insurance_id + " doesn't exist."), 404


@insurance_blueprint.route("/get-insurances/<client_id>", methods=["GET"])
def get_insurances(client_id):
    client = Client.query.get(client_id)
    if client:
        if client.isPrimary == True:
            insurances = db.session.query(
                Insurance).filter_by(owner1_id=client_id)
        else:
            insurances = db.session.query(
                Insurance).filter_by(owner2_id=client_id)

        return insurances_schema.jsonify(insurances)
    else:
        return("Client " + client_id + " doesn't exist."), 404