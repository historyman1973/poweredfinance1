from sqlalchemy import null
from routes.investments import delete_investment, get_investment_value, delete_transaction
from routes.liabilities import delete_liability
from routes.otherassets import delete_property, delete_lifestyleasset
from models import Client, clients_schema, client_schema, Investment, LifestyleAsset, Property, Liability, Transaction, Holding, Instrument
from database import db
from flask import Blueprint, request
from flask.json import jsonify
from faker import Faker
from faker.providers import BaseProvider
import random
import requests
import json
from routes.otherassets import add_lifestyleasset


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


@clients_blueprint.route("/delete-client/<client_id>", methods=['DELETE'])
def delete_client(client_id):
    # Delete all investments where the client is the only owner
    if Client.query.get(client_id).isPrimary == 1:
        client_only_investments = Investment.query.filter(Investment.owner1_id == client_id, Investment.owner2_id == None)
    else:
        client_only_investments = Investment.query.filter(Investment.owner2_id == client_id, Investment.owner1_id == None)
    for client_only_investment in client_only_investments:
        Holding.query.filter(Holding.investment_id == client_only_investment.id).delete()
        db.session.commit()
        delete_investment(client_only_investment.id)
    

    # Update all joint investments to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_investments = Investment.query.filter(Investment.owner1_id == client_id, Investment.owner2_id != None)
        for joint_investment in joint_investments:
            Investment.query.get(joint_investment.id).owner1_id = None
            db.session.commit()
    else:
        joint_investments = Investment.query.filter(Investment.owner2_id == client_id, Investment.owner1_id != None)
        for joint_investment in joint_investments:
            Investment.query.get(joint_investment.id).owner2_id = None
            db.session.commit()


    # Delete all transactions belonging to the client only
    if Client.query.get(client_id).isPrimary == 1:
        client_only_transactions = Transaction.query.filter(Transaction.owner1_id == client_id, Transaction.owner2_id == None)
    else:
        client_only_transactions = Transaction.query.filter(Transaction.owner2_id == client_id, Transaction.owner1_id == None)
    for client_only_transaction in client_only_transactions:
        delete_transaction(client_only_transaction.id)


    # Update all joint transactions to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_transactions = Transaction.query.filter(Transaction.owner1_id == client_id, Transaction.owner2_id != None)
        for joint_transaction in joint_transactions:
            Transaction.query.get(joint_transaction.id).owner1_id = None
            db.session.commit()  
    else:
        joint_transactions = Transaction.query.filter(Transaction.owner2_id == client_id, Transaction.owner1_id != None)
        for joint_transaction in joint_transactions:
            Transaction.query.get(joint_investment.id).owner2_id = None
            db.session.commit()


    # Delete all liabilities where the client is the only owner
    if Client.query.get(client_id).isPrimary == 1:
        client_only_liabilities = Liability.query.filter(Liability.owner1_id == client_id, Liability.owner2_id == None)
    else:
        client_only_liabilities = Liability.query.filter(Liability.owner2_id == client_id, Liability.owner1_id == None)
    for client_only_liability in client_only_liabilities:
        delete_liability(client_only_liability.id)

    # Update all joint liabilities to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_liabilities = Liability.query.filter(Liability.owner1_id == client_id, Liability.owner2_id != None)
        for joint_liability in joint_liabilities:
            Liability.query.get(joint_liability.id).owner1_id = None
            db.session.commit()
    else:
        joint_liabilities = Liability.query.filter(Liability.owner2_id == client_id, Liability.owner1_id != None)
        for joint_liability in joint_liabilities:
            Liability.query.get(joint_liability.id).owner2_id = None
            db.session.commit()


    # Same for properties
    if Client.query.get(client_id).isPrimary == 1:
        client_only_properties = Property.query.filter(Property.owner1_id == client_id, Property.owner2_id == None)
    else:
        client_only_properties = Property.query.filter(Property.owner2_id == client_id, Property.owner1_id == None)
    for client_only_property in client_only_properties:
        delete_property(client_only_property.id)

    # Update all joint properties to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_properties = Property.query.filter(Property.owner1_id == client_id, Property.owner2_id != None)
        for joint_property in joint_properties:
            Property.query.get(joint_property.id).owner1_id = None
            db.session.commit()
    else:
        joint_properties = Property.query.filter(Property.owner2_id == client_id, Property.owner1_id != None)
        for joint_property in joint_properties:
            Property.query.get(joint_property.id).owner2_id = None
            db.session.commit()


    # Same for lifestyle assets
    if Client.query.get(client_id).isPrimary == 1:
        client_only_lifestyleassets = LifestyleAsset.query.filter(LifestyleAsset.owner1_id == client_id, LifestyleAsset.owner2_id == None)
    else:
        client_only_lifestyleassets = LifestyleAsset.query.filter(LifestyleAsset.owner2_id == client_id, LifestyleAsset.owner1_id == None)
    for client_only_lifestyleasset in client_only_lifestyleassets:
        delete_lifestyleasset(client_only_lifestyleasset.id)

    # Update all joint properties to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_lifestyleassets = LifestyleAsset.query.filter(LifestyleAsset.owner1_id == client_id, LifestyleAsset.owner2_id != None)
        for joint_lifestyleasset in joint_lifestyleassets:
            LifestyleAsset.query.get(joint_lifestyleasset.id).owner1_id = None
            db.session.commit()
    else:
        joint_lifestyleassets = LifestyleAsset.query.filter(LifestyleAsset.owner2_id == client_id, LifestyleAsset.owner1_id != None)
        for joint_lifestyleasset in joint_lifestyleassets:
            LifestyleAsset.query.get(joint_lifestyleasset.id).owner2_id = None
            db.session.commit()
    

    # Finally, delete the client
    db.session.delete(Client.query.get(client_id))
    db.session.commit()

    return("Client deleted"), 204


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


@clients_blueprint.route("/add-test-client", methods=["POST"])
def add_test_client():
    fake = Faker()

    ################################################################
    # Create a pair of test clients.

    # Create gender randomiser
    class Gender(BaseProvider):
        def gender(self):
            result = random.randint(0,1)
            if result == 0:
                gender = "Male"
            else:
                gender = "Female"
            
            return gender

    
    fake.add_provider(Gender)

    random_name_client = fake.name()
    random_name_partner = fake.name()

    gender = fake.gender()

    first = True
    ids = []


    for person_name in [random_name_client, random_name_partner]:
        
        if first:
            first = False
            isPrimary = 1
        else:
            isPrimary = 0
                
        new_test_client = Client(
            forename=person_name.split()[0],
            preferred_name=person_name.split()[0],
            middle_names="Shirley",
            surname=person_name.split()[1],
            gender=gender,
            isPrimary=isPrimary)

        db.session.add(new_test_client)
        db.session.commit()
        if first:
            clientid = new_test_client.id
            ids.append(clientid)
        else:
            partnerid = new_test_client.id
            ids.append(partnerid)
        

    ##############################################################################################################
    # Create a set of investments - client, partner and joint owned

    client_investment = requests.post('http://localhost:5000/add-investment', json={
        "category": "Retirement",
        "investment_type": "Stakeholder pension",
        "provider": fake.word().title(),
        "investment_ref": random.randint(10000000, 99999999),
        "owner1_id": ids[0],
        "owner2_id": None
    })

    new_client_investment_id = client_investment.json()['id']
    new_client_investment = Investment.query.get(new_client_investment_id)
    print("New client investment object is " + str(new_client_investment))


    partner_investment = requests.post('http://localhost:5000/add-investment', json={
        "category": "Non-retirement",
        "investment_type": "Stocks and Shares ISA",
        "provider": fake.word().title(),
        "investment_ref": random.randint(10000000, 99999999),
        "owner1_id": None,
        "owner2_id": ids[1]
    })

    new_partner_investment_id = partner_investment.json()['id']
    new_partner_investment = Investment.query.get(new_partner_investment_id)



    joint_investment = requests.post('http://localhost:5000/add-investment', json={
        "category": "Non-retirement",
        "investment_type": "General Investment Account",
        "provider": fake.word().title(),
        "investment_ref": random.randint(10000000, 99999999),
        "owner1_id": ids[0],
        "owner2_id": ids[1]
    })

    new_joint_investment_id = joint_investment.json()['id']
    new_joint_investment = Investment.query.get(new_joint_investment_id)


    ##########################################################################################
    # Create a series of transactions for each investment    

    number_of_existing_instruments = len(Instrument.query.all())

    for investment in [new_client_investment, new_joint_investment, new_partner_investment]:

        random_instrument_id_1 = random.randint(1, number_of_existing_instruments)
        random_instrument_id_2 = random.randint(1, number_of_existing_instruments)


        transaction1 = requests.post('http://localhost:5000/add-transaction', json={
            "investment_id": investment.id,
            "instrument_id": random_instrument_id_1,
            "tdate": fake.iso8601(),
            "ttype": "Purchase",
            "units": random.uniform(1.0, 2000.0),
            "price": random.uniform(1.0, 2000.0),
            "owner1_id": investment.owner1_id,
            "owner2_id": investment.owner2_id,
        })

        transaction2 = requests.post('http://localhost:5000/add-transaction', json={
            "investment_id": investment.id,
            "instrument_id": random_instrument_id_2,
            "tdate": fake.iso8601(),
            "ttype": "Purchase",
            "units": random.uniform(1.0, 2000.0),
            "price": random.uniform(1.0, 2000.0),
            "owner1_id": investment.owner1_id,
            "owner2_id": investment.owner2_id,
        })


    client_property = requests.post('http://localhost:5000/add-property', json={
        "property_type": "Main residence",
        "address": fake.address(),
        "cost": random.randint(100000, 1000000),
        "value": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": None,
        "liability_id": None
    })

    new_client_property_id = client_property.json()['id']

    db.session.commit()
    print("New property ID is " + str(new_client_property_id))


    partner_property = requests.post('http://localhost:5000/add-property', json={
        "property_type": "Second home",
        "address": fake.address(),
        "cost": random.randint(100000, 1000000),
        "value": random.randint(100000, 1000000),
        "owner1_id": None,
        "owner2_id": ids[1],
        "liability_id": None
    })

    new_partner_property_id = partner_property.json()['id']

    db.session.commit()
    print("New property ID is " + str(new_partner_property_id))


    joint_property = requests.post('http://localhost:5000/add-property', json={
        "property_type": "Buy to let",
        "address": fake.address(),
        "cost": random.randint(100000, 1000000),
        "value": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": ids[1],
        "liability_id": None
    })

    new_joint_property_id = joint_property.json()['id']

    db.session.commit()
    print("New property ID is " + str(new_joint_property_id))


    # Create a set of liabilities and linked them to

    client_liability = requests.post('http://localhost:5000/add-liability', json={
        "category": "Long term",
        "liability_type": "Main residence",
        "description": fake.word().title(),
        "amount_borrowed": random.randint(100000, 1000000),
        "amount_outstanding": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": None,
        "property_id": None
    })

    new_client_liability_id = client_liability.json()['id']
    Liability.query.get(new_client_liability_id).property = Property.query.get(new_client_property_id)
    client_property.liability = Liability.query.get(int(new_client_liability_id))
    db.session.commit()
    print("New liability ID is " + str(new_client_liability_id))

    partner_liability = requests.post('http://localhost:5000/add-liability', json={
        "category": "Long term",
        "liability_type": "Second home",
        "description": fake.word().title(),
        "amount_borrowed": random.randint(100000, 1000000),
        "amount_outstanding": random.randint(100000, 1000000),
        "owner1_id": None,
        "owner2_id": ids[1],
        "property_id": None
    })

    new_partner_liability_id = partner_liability.json()['id']
    Liability.query.get(new_partner_liability_id).property = Property.query.get(new_partner_property_id)
    partner_property.liability = Liability.query.get(int(new_partner_liability_id))
    db.session.commit()
    print("New liability ID is " + str(new_partner_liability_id))    
    
    joint_liability = requests.post('http://localhost:5000/add-liability', json={
        "category": "Long term",
        "liability_type": "Buy to let",
        "description": fake.word().title(),
        "amount_borrowed": random.randint(100000, 1000000),
        "amount_outstanding": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": ids[1],
        "property_id": None
    })

    new_joint_liability_id = joint_liability.json()['id']    
    Liability.query.get(new_joint_liability_id).property = Property.query.get(new_joint_property_id)
    joint_property.liability = Liability.query.get(int(new_joint_liability_id))
    db.session.commit()
    print("New liability ID is " + str(new_joint_liability_id))

    
    # Create a set of lifestyle assets - client, partner and joint

    requests.post('http://localhost:5000/add-lifestyleasset', json={
        "asset_type": "Lifestyle",
        "description": fake.word().title(),
        "value": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": None
    })


    requests.post('http://localhost:5000/add-lifestyleasset', json={
        "asset_type": "Lifestyle",
        "description": fake.word().title(),
        "value": random.randint(100000, 1000000),
        "owner1_id": None,
        "owner2_id": ids[1]
    })


    requests.post('http://localhost:5000/add-lifestyleasset', json={
        "asset_type": "Lifestyle",
        "description": fake.word().title(),
        "value": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": ids[1]
    })


    return("Clients " + str(random_name_client) + " (" + str(ids[0]) + ") and " + str(random_name_partner) + " (" + str(ids[1]) + ") and sample data created."), 201


@clients_blueprint.route("/delete-all-clients", methods=["POST"])
def delete_all_clients():
    all_clients = Client.query.all()

    for client in all_clients:
        delete_client(client.id)
    
    return "Done", 200