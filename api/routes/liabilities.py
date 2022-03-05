from database import db
from flask import Blueprint, request
from flask.json import jsonify


liability_blueprint = Blueprint('liability_blueprint', __name__)

from models import Client, Property, Liability, liability_schema, liabilities_schema

@liability_blueprint.route("/add-liability", methods=["POST"])
def add_liability():
    category = request.json['category']
    liability_type = request.json['liability_type']
    amount_borrowed = request.json['amount_borrowed']
    amount_outstanding = request.json['amount_outstanding']
    owner1_id = request.json['owner1_id']
    owner2_id = request.json['owner2_id']


    new_liability = Liability(
        category=category,
        liability_type=liability_type,
        amount_borrowed=amount_borrowed,
        amount_outstanding=amount_outstanding,
        owner1_id=owner1_id,
        owner2_id=owner2_id
    )

    db.session.add(new_liability)
    db.session.commit()

    return liability_schema.jsonify(new_liability)


@liability_blueprint.route("/get-liability/<liability_id>", methods=["GET"])
def get_liability(liability_id):
    liability = Liability.query.get(liability_id)
    if liability:
        result = liability_schema.dump(liability)
        return jsonify(result)
    else:
        return("Liability id " + liability_id + " doesn't exist."), 404


@liability_blueprint.route("/get-liabilities/<client_id>", methods=["GET"])
def get_liabilities(client_id):
    client = Client.query.get(client_id)
    if client:
        if client.isPrimary == True:
            liabilities = db.session.query(
                Liability).filter_by(owner1_id=client_id)
        else:
            liabilities = db.session.query(
                Liability).filter_by(owner2_id=client_id)

        return liabilities_schema.jsonify(liabilities)
    else:
        return("Client id " + client_id + " doesn't exist."), 404


@liability_blueprint.route("/mortgage-to-property", methods=["POST"])
def link_mortgage_to_property():
    liability_id = request.json['liability_id']
    property_id = request.json['property_id']
    liability = Liability.query.get(liability_id)
    property = Property.query.get(property_id)
    if liability and property:
        liability.property_id = property.id
        db.session.commit()
        return("Linked mortgage id " + liability.id + " to property id " + property.id + "."), 200
    elif liability is None and property:
        return("Liability id doesn't exist."), 404
    elif liability and property is None:
        return("Property id doesn't exist."), 404
    elif liability is None and property is None:
        return("Neither liability id " + str(request.json['liability_id']) + " nor property id " + str(request.json['property_id']) + " exist."), 404
