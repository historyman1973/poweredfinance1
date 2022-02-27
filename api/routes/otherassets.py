from database import db
from flask import Blueprint, request
from flask.json import jsonify


otherassets_blueprint = Blueprint('otherassets_blueprint', __name__)

from models import Client, LifestyleAsset, lifestyleasset_schema, lifestyleassets_schema, Property, property_schema, properties_schema


@otherassets_blueprint.route("/add-lifestyleasset", methods=["POST"])
def add_lifestyleasset():
    asset_type = request.json['asset_type']
    description = request.json['description']
    value = request.json['value']
    owner1_id = request.json['owner1_id']
    owner2_id = request.json['owner2_id']


    new_lifestyleasset = LifestyleAsset(
        asset_type=asset_type,
        description=description,
        value=value,
        owner1_id=owner1_id,
        owner2_id=owner2_id
    )

    db.session.add(new_lifestyleasset)
    db.session.commit()

    return lifestyleasset_schema.jsonify(new_lifestyleasset)


@otherassets_blueprint.route("/get-lifestyle-asset/<lifestyle_asset_id>", methods=["GET"])
def get_lifestyle_asset(lifestyle_asset_id):
    lifestyleasset = LifestyleAsset.query.get(lifestyle_asset_id)
    result = lifestyleasset_schema.dump(lifestyleasset)
    return jsonify(result)


@otherassets_blueprint.route("/get-lifestyle-assets/<client_id>", methods=["GET"])
def get_lifestyleassets(client_id):
    client = Client.query.get(client_id)
    if client.isPrimary == True:
        lifestyleassets = db.session.query(
            LifestyleAsset).filter_by(owner1_id=client_id)
    else:
        lifestyleassets = db.session.query(
            LifestyleAsset).filter_by(owner2_id=client_id)

    return lifestyleassets_schema.jsonify(lifestyleassets)


@otherassets_blueprint.route("/add-property", methods=["POST"])
def add_property():
    property_type = request.json['property_type']
    address = request.json['address']
    cost = request.json['cost']
    value = request.json['value']
    owner1_id = request.json['owner1_id']
    owner2_id = request.json['owner2_id']


    new_property = Property(
        property_type=property_type,
        address=address,
        cost=cost,
        value=value,
        owner1_id=owner1_id,
        owner2_id=owner2_id
    )

    db.session.add(new_property)
    db.session.commit()

    return property_schema.jsonify(new_property)


@otherassets_blueprint.route("/get-property/<property_id>", methods=["GET"])
def get_property(property_id):
    property = Property.query.get(property_id)
    result = property_schema.dump(property)
    return jsonify(result)


@otherassets_blueprint.route("/get-properties/<client_id>", methods=["GET"])
def get_properties(client_id):
    client = Client.query.get(client_id)
    if client.isPrimary == True:
        properties = db.session.query(
            Property).filter_by(owner1_id=client_id)
    else:
        properties = db.session.query(
            Property).filter_by(owner2_id=client_id)

    return properties_schema.jsonify(properties)