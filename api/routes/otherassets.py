from models import Client, OtherAsset, otherasset_schema, otherassets_schema, Property, property_schema, properties_schema, Liability
from database import db
from flask import Blueprint, request
from flask.json import jsonify


otherassets_blueprint = Blueprint('otherassets_blueprint', __name__)


@otherassets_blueprint.route("/add-otherasset", methods=["POST"])
def add_otherasset():
    # Initialise owners

    owner1 = None
    owner2 = None

    asset_type = request.json['asset_type']
    description = request.json['description']
    value = request.json['value']
    owner1_id = request.json['owner1_id']
    owner2_id = request.json['owner2_id']

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
        new_otherasset = OtherAsset(
            asset_type=asset_type,
            description=description,
            value=value,
            owner1_id=owner1_id,
            owner2_id=owner2_id
        )

        db.session.add(new_otherasset)
        db.session.commit()

        return otherasset_schema.jsonify(new_otherasset), 201


@otherassets_blueprint.route("/delete-otherasset/<otherasset_id>", methods=["DELETE"])
def delete_otherasset(otherasset_id):
    if OtherAsset.query.get(otherasset_id):
        db.session.delete(OtherAsset.query.get(otherasset_id))
        db.session.commit()

        return("Asset deleted"), 204
    else:
        return("Asset doesn't exist"), 404


@otherassets_blueprint.route("/get-otherasset/<otherasset_id>", methods=["GET"])
def get_otherasset(otherasset_id):
    otherasset = OtherAsset.query.get(otherasset_id)
    if otherasset:
        result = otherasset_schema.dump(otherasset_id)
        return jsonify(result)
    else:
        return("Asset id " + otherasset_id + " doesn't exist."), 404


@otherassets_blueprint.route("/get-otherassets/<client_id>", methods=["GET"])
def get_otherassets(client_id):
    client = Client.query.get(client_id)
    if client:
        if client.isPrimary == True:
            otherassets = db.session.query(
                OtherAsset).filter_by(owner1_id=client_id)
        else:
            otherassets = db.session.query(
                OtherAsset).filter_by(owner2_id=client_id)

        return otherassets_schema.jsonify(otherassets)
    else:
        return("Client " + client_id + " doesn't exist."), 404


@otherassets_blueprint.route("/add-property", methods=["POST"])
def add_property():
    # Initialise owners

    owner1 = None
    owner2 = None

    property_type = request.json['property_type']
    address = request.json['address']
    cost = request.json['cost']
    value = request.json['value']
    owner1_id = request.json['owner1_id']
    owner2_id = request.json['owner2_id']
    liability_id = request.json['liability_id']

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
        liability = None
        if liability_id:
            liability = Liability.query.get(int(liability_id))

        new_property = Property(
            property_type=property_type,
            address=address,
            cost=cost,
            value=value,
            owner1_id=owner1_id,
            owner2_id=owner2_id,
            liability=liability
        )

        db.session.add(new_property)
        db.session.commit()

        print(new_property.liability)

        return property_schema.jsonify(new_property), 201


@otherassets_blueprint.route("/delete-property/<property_id>", methods=["DELETE"])
def delete_property(property_id):
    if Property.query.get(property_id):
        db.session.delete(Property.query.get(property_id))
        db.session.commit()

        return("Property deleted"), 204
    else:
        return("Property doesn't exist"), 404


@otherassets_blueprint.route("/get-property/<property_id>", methods=["GET"])
def get_property(property_id):
    property = Property.query.get(property_id)
    result = property_schema.dump(property)
    if result:
        return jsonify(result)
    else:
        return("Property id " + property_id + " doesn't exist."), 404


@otherassets_blueprint.route("/get-properties/<client_id>", methods=["GET"])
def get_properties(client_id):
    client = Client.query.get(client_id)
    if client:
        if client.isPrimary == True:
            properties = db.session.query(
                Property).filter_by(owner1_id=client_id)
        else:
            properties = db.session.query(
                Property).filter_by(owner2_id=client_id)

        return properties_schema.jsonify(properties)
    else:
        return("Client id " + client_id + " doesn't exist."), 404
