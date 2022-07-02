from routes.investments import delete_investment, get_investment_value, delete_transaction
from routes.liabilities import delete_liability
from routes.otherassets import delete_property, delete_otherasset
from routes.insurance import delete_insurance
from models import Client, clients_schema, client_schema, Investment, OtherAsset, Property, Liability, Transaction, Insurance, Holding, Instrument
from database import db
from flask import Blueprint, request, make_response
from flask.json import jsonify
from faker import Faker
from faker.providers import BaseProvider
import random
import requests

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
        client_only_investments = Investment.query.filter(
            Investment.owner1_id == client_id, Investment.owner2_id == None)
    else:
        client_only_investments = Investment.query.filter(
            Investment.owner2_id == client_id, Investment.owner1_id == None)
    for client_only_investment in client_only_investments:
        Holding.query.filter(Holding.investment_id ==
                             client_only_investment.id).delete()
        db.session.commit()
        delete_investment(client_only_investment.id)

    # Update all joint investments to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_investments = Investment.query.filter(
            Investment.owner1_id == client_id, Investment.owner2_id != None)
        for joint_investment in joint_investments:
            Investment.query.get(joint_investment.id).owner1_id = None
            db.session.commit()
    else:
        joint_investments = Investment.query.filter(
            Investment.owner2_id == client_id, Investment.owner1_id != None)
        for joint_investment in joint_investments:
            Investment.query.get(joint_investment.id).owner2_id = None
            db.session.commit()

    # Delete all transactions belonging to the client only
    if Client.query.get(client_id).isPrimary == 1:
        client_only_transactions = Transaction.query.filter(
            Transaction.owner1_id == client_id, Transaction.owner2_id == None)
    else:
        client_only_transactions = Transaction.query.filter(
            Transaction.owner2_id == client_id, Transaction.owner1_id == None)
    for client_only_transaction in client_only_transactions:
        delete_transaction(client_only_transaction.id)

    # Update all joint transactions to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_transactions = Transaction.query.filter(
            Transaction.owner1_id == client_id, Transaction.owner2_id != None)
        for joint_transaction in joint_transactions:
            Transaction.query.get(joint_transaction.id).owner1_id = None
            db.session.commit()
    else:
        joint_transactions = Transaction.query.filter(
            Transaction.owner2_id == client_id, Transaction.owner1_id != None)
        for joint_transaction in joint_transactions:
            Transaction.query.get(joint_transaction.id).owner2_id = None
            db.session.commit()

    # Delete all liabilities where the client is the only owner
    if Client.query.get(client_id).isPrimary == 1:
        client_only_liabilities = Liability.query.filter(
            Liability.owner1_id == client_id, Liability.owner2_id == None)
    else:
        client_only_liabilities = Liability.query.filter(
            Liability.owner2_id == client_id, Liability.owner1_id == None)
    for client_only_liability in client_only_liabilities:
        delete_liability(client_only_liability.id)

    # Update all joint liabilities to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_liabilities = Liability.query.filter(
            Liability.owner1_id == client_id, Liability.owner2_id != None)
        for joint_liability in joint_liabilities:
            Liability.query.get(joint_liability.id).owner1_id = None
            db.session.commit()
    else:
        joint_liabilities = Liability.query.filter(
            Liability.owner2_id == client_id, Liability.owner1_id != None)
        for joint_liability in joint_liabilities:
            Liability.query.get(joint_liability.id).owner2_id = None
            db.session.commit()

    # Same for properties
    if Client.query.get(client_id).isPrimary == 1:
        client_only_properties = Property.query.filter(
            Property.owner1_id == client_id, Property.owner2_id == None)
    else:
        client_only_properties = Property.query.filter(
            Property.owner2_id == client_id, Property.owner1_id == None)
    for client_only_property in client_only_properties:
        delete_property(client_only_property.id)

    # Update all joint properties to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_properties = Property.query.filter(
            Property.owner1_id == client_id, Property.owner2_id != None)
        for joint_property in joint_properties:
            Property.query.get(joint_property.id).owner1_id = None
            db.session.commit()
    else:
        joint_properties = Property.query.filter(
            Property.owner2_id == client_id, Property.owner1_id != None)
        for joint_property in joint_properties:
            Property.query.get(joint_property.id).owner2_id = None
            db.session.commit()

    # Same for other assets
    if Client.query.get(client_id).isPrimary == 1:
        client_only_otherassets = OtherAsset.query.filter(
            OtherAsset.owner1_id == client_id, OtherAsset.owner2_id == None)
    else:
        client_only_otherassets = OtherAsset.query.filter(
            OtherAsset.owner2_id == client_id, OtherAsset.owner1_id == None)
    for client_only_otherasset in client_only_otherassets:
        delete_otherasset(client_only_otherasset.id)

    # Update all joint other assets to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_otherassets = OtherAsset.query.filter(
            OtherAsset.owner1_id == client_id, OtherAsset.owner2_id != None)
        for joint_otherasset in joint_otherassets:
            OtherAsset.query.get(joint_otherasset.id).owner1_id = None
            db.session.commit()
    else:
        joint_otherAssets = OtherAsset.query.filter(
            OtherAsset.owner2_id == client_id, OtherAsset.owner1_id != None)
        for joint_otherAsset in joint_otherAssets:
            OtherAsset.query.get(joint_otherAsset.id).owner2_id = None
            db.session.commit()


    # Same for insurances owned by the client to be deleted
    if Client.query.get(client_id).isPrimary == 1:
        client_only_insurances = Insurance.query.filter(
            Insurance.owner1_id == client_id, Insurance.owner2_id == None)
    else:
        client_only_insurances = Insurance.query.filter(
            Insurance.owner2_id == client_id, Insurance.owner1_id == None)
    for client_only_insurance in client_only_insurances:
        delete_insurance(client_only_insurance.id)    

    # Same for insurances which have some element of cover for the client to be deleted
    if Client.query.get(client_id).isPrimary == 1:
        client_life_assureds = Insurance.query.filter(Insurance.lifeassured1_id == client_id)
    else:
        client_life_assureds = Insurance.query.filter(Insurance.lifeassured2_id == client_id)
    for client_life_assured in client_life_assureds:
        delete_insurance(client_life_assured.id)   

    # Update all joint insurances to show they are only owned by the partner
    if Client.query.get(client_id).isPrimary == 1:
        joint_insurances = Insurance.query.filter(
            Insurance.owner1_id == client_id, Insurance.owner2_id != None)
        for joint_insurance in joint_insurances:
            Insurance.query.get(joint_insurances.id).owner1_id = None
            db.session.commit()
    else:
        joint_insurances = Insurance.query.filter(
            Insurance.owner2_id == client_id, Insurance.owner1_id != None)
        for joint_insurance in joint_insurances:
            Insurance.query.get(joint_insurance.id).owner2_id = None
            db.session.commit()


    # Finally, delete the client
    db.session.delete(Client.query.get(client_id))
    db.session.commit()

    return("Client deleted"), 204


@clients_blueprint.route("/edit-client/<client_id>", methods=["PATCH"])
def edit_client(client_id):
    Client.query.filter_by(id=client_id).update(request.get_json())
    db.session.commit()

    return client_schema.jsonify(client_updated=client_id), 204


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

        sole_otherassets = OtherAsset.query.filter(
            OtherAsset.owner1_id == client_id,
            OtherAsset.owner2_id == None).all()

        joint_otherassets = OtherAsset.query.filter(
            OtherAsset.owner1_id == client_id,
            OtherAsset.owner2_id != None).all()

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

        sole_otherassets = OtherAsset.query.filter(
            OtherAsset.owner1_id == None,
            OtherAsset.owner2_id == client_id).all()

        joint_otherassets = OtherAsset.query.filter(
            OtherAsset.owner1_id != None,
            OtherAsset.owner2_id == client_id).all()

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

    total_sole_otherassets = 0
    for otherasset in sole_otherassets:
        value = float(otherasset.value)
        total_sole_otherassets += value

    total_joint_otherassets = 0
    for otherasset in joint_otherassets:
        value = float(otherasset.value)
        total_joint_otherassets += (value * 0.5)

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
        value = float(liability.amount_outstanding)
        total_sole_liabilities += value

    total_joint_liabilities = 0
    for liability in joint_liabilities:
        value = float(liability.amount_outstanding)
        total_joint_liabilities += (value * 0.5)

    networth = total_sole_investments + total_joint_investments + total_sole_otherassets + total_joint_otherassets + \
        total_sole_properties + total_joint_properties - \
        total_sole_liabilities - total_joint_liabilities

    # grouped_liabilities = db.session.query(Liability.liability_type, db.func.sum(Liability.amount_outstanding)).group_by(Liability.liability_type).all()

    liability_breakdown = {}
    for sole_liability in sole_liabilities:
        if str(sole_liability.liability_type) not in liability_breakdown.keys():
            keyname = str(sole_liability.liability_type)
            liability_breakdown[keyname.replace("-", "_")] = float(
                sole_liability.amount_outstanding)
        else:
            liability_breakdown[keyname.replace("-", "_")] += float(
                sole_liability.amount_outstanding)

    for joint_liability in joint_liabilities:
        if str(joint_liability.liability_type) not in liability_breakdown.keys():
            keyname = str(joint_liability.liability_type)
            liability_breakdown[keyname.replace("-", "_")] = float(
                joint_liability.amount_outstanding) * 0.5
        else:
            liability_breakdown[keyname.replace("-", "_")] += float(
                joint_liability.amount_outstanding) * 0.5

    return jsonify(
        total_sole_investments=total_sole_investments,
        total_joint_investments=total_joint_investments,
        total_sole_otherassets=total_sole_otherassets,
        total_joint_otherassets=total_joint_otherassets,
        total_sole_properties=total_sole_properties,
        total_joint_properties=total_joint_properties,
        total_sole_liabilities=total_sole_liabilities,
        total_joint_liabilities=total_joint_liabilities,
        networth=networth,
        liability_breakdown=liability_breakdown
    )


@clients_blueprint.route("/add-test-client", methods=["POST"])
def add_test_client():
    fake = Faker()

    ################################################################
    # Create a pair of test clients.

    # Create gender randomiser
    class Gender(BaseProvider):
        def gender(self):
            result = random.randint(0, 1)
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

        random_instrument_id_1 = random.randint(
            1, number_of_existing_instruments)
        random_instrument_id_2 = random.randint(
            1, number_of_existing_instruments)

        requests.post('http://localhost:5000/add-transaction', json={
            "investment_id": investment.id,
            "instrument_id": random_instrument_id_1,
            "tdate": fake.iso8601(),
            "ttype": "buy",
            "units": random.uniform(1.0, 2000.0),
            "price": random.uniform(1.0, 2000.0),
            "owner1_id": investment.owner1_id,
            "owner2_id": investment.owner2_id,
        })

        requests.post('http://localhost:5000/add-transaction', json={
            "investment_id": investment.id,
            "instrument_id": random_instrument_id_2,
            "tdate": fake.iso8601(),
            "ttype": "buy",
            "units": random.uniform(1.0, 2000.0),
            "price": random.uniform(1.0, 2000.0),
            "owner1_id": investment.owner1_id,
            "owner2_id": investment.owner2_id,
        })

    client_property = requests.post('http://localhost:5000/add-property', json={
        "property_type": "main-residence",
        "address": fake.address(),
        "cost": random.randint(100000, 1000000),
        "value": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": None,
        "liability_id": None
    })

    new_client_property_id = client_property.json()['id']

    db.session.commit()

    partner_property = requests.post('http://localhost:5000/add-property', json={
        "property_type": "holiday-home",
        "address": fake.address(),
        "cost": random.randint(100000, 1000000),
        "value": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": ids[1],
        "liability_id": None
    })

    new_partner_property_id = partner_property.json()['id']

    db.session.commit()

    joint_property = requests.post('http://localhost:5000/add-property', json={
        "property_type": "buy-to-let",
        "address": fake.address(),
        "cost": random.randint(100000, 1000000),
        "value": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": ids[1],
        "liability_id": None
    })

    new_joint_property_id = joint_property.json()['id']

    db.session.commit()

    # Create a set of liabilities and link them to an owner

    client_liability_secured = requests.post('http://localhost:5000/add-liability', json={
        "category": "Long term",
        "liability_type": "main-residence-mortgage",
        "description": fake.word().title(),
        "amount_borrowed": random.randint(100000, 1000000),
        "amount_outstanding": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": None,
        "property_id": None
    })

    new_client_liability_id = client_liability_secured.json()['id']
    Liability.query.get(new_client_liability_id).property = Property.query.get(
        new_client_property_id)
    client_property.liability = Liability.query.get(
        int(new_client_liability_id))
    db.session.commit()

    requests.post('http://localhost:5000/add-liability', json={
        "category": "short-term",
        "liability_type": "credit-card",
        "description": fake.word().title(),
        "amount_borrowed": random.randint(1000, 10000),
        "amount_outstanding": random.randint(1000, 10000),
        "owner1_id": ids[0],
        "owner2_id": None,
        "property_id": None
    })

    new_client_liability_id = client_liability_secured.json()['id']
    Liability.query.get(new_client_liability_id).property = Property.query.get(
        new_client_property_id)
    client_property.liability = Liability.query.get(
        int(new_client_liability_id))
    db.session.commit()

    partner_liability_secured = requests.post('http://localhost:5000/add-liability', json={
        "category": "long-term",
        "liability_type": "holiday-home-mortgage",
        "description": fake.word().title(),
        "amount_borrowed": random.randint(100000, 1000000),
        "amount_outstanding": random.randint(100000, 1000000),
        "owner1_id": None,
        "owner2_id": ids[1],
        "property_id": None
    })

    new_partner_liability_id = partner_liability_secured.json()['id']
    Liability.query.get(new_partner_liability_id).property = Property.query.get(
        new_partner_property_id)
    partner_property.liability = Liability.query.get(
        int(new_partner_liability_id))
    db.session.commit()

    requests.post('http://localhost:5000/add-liability', json={
        "category": "short-term",
        "liability_type": "personal-loan",
        "description": fake.word().title(),
        "amount_borrowed": random.randint(1000, 10000),
        "amount_outstanding": random.randint(1000, 10000),
        "owner1_id": None,
        "owner2_id": ids[1],
        "property_id": None
    })

    joint_liability_secured = requests.post('http://localhost:5000/add-liability', json={
        "category": "long-term",
        "liability_type": "buy-to-let-mortgage",
        "description": fake.word().title(),
        "amount_borrowed": random.randint(100000, 1000000),
        "amount_outstanding": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": ids[1],
        "property_id": None
    })

    new_joint_liability_id = joint_liability_secured.json()['id']
    Liability.query.get(new_joint_liability_id).property = Property.query.get(
        new_joint_property_id)
    joint_property.liability = Liability.query.get(int(new_joint_liability_id))
    db.session.commit()

    requests.post('http://localhost:5000/add-liability', json={
        "category": "short-term",
        "liability_type": "miscellaneous",
        "description": fake.word().title(),
        "amount_borrowed": random.randint(1000, 10000),
        "amount_outstanding": random.randint(1000, 10000),
        "owner1_id": ids[0],
        "owner2_id": ids[1],
        "property_id": None
    })

    # Create a set of non-investment assets - client, partner and joint

    requests.post('http://localhost:5000/add-otherasset', json={
        "asset_type": "Lifestyle",
        "description": fake.word().title(),
        "value": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": None
    })

    requests.post('http://localhost:5000/add-otherasset', json={
        "asset_type": "Lifestyle",
        "description": fake.word().title(),
        "value": random.randint(100000, 1000000),
        "owner1_id": None,
        "owner2_id": ids[1]
    })

    requests.post('http://localhost:5000/add-otherasset', json={
        "asset_type": "Lifestyle",
        "description": fake.word().title(),
        "value": random.randint(100000, 1000000),
        "owner1_id": ids[0],
        "owner2_id": ids[1]
    })

    requests.post('http://localhost:5000/add-insurance', json={
            "category": "Life",
            "insurance_type": "Level Term",
            "provider": "Aegon",
            "policy_ref": "123654/8A",
            "sum_assured": 250000,
            "monthly_premium": 64.98,
            "owner1_id": ids[0],
            "owner2_id": None,
            "lifeassured1_id": ids[0],
            "lifeassured2_id": ids[1]  
    })

    requests.post('http://localhost:5000/add-insurance', json={
            "category": "Life",
            "insurance_type": "Decreasing Term",
            "provider": "AIG",
            "policy_ref": "125254/9X",
            "sum_assured": 200000,
            "monthly_premium": 53.88,
            "owner1_id": None,
            "owner2_id": ids[1],
            "lifeassured1_id": ids[0],
            "lifeassured2_id": ids[1]  
    })

    requests.post('http://localhost:5000/add-insurance', json={
            "category": "General",
            "insurance_type": "Buildings Insurance",
            "provider": "Direct Line",
            "policy_ref": "98123156",
            "sum_assured": 1000000,
            "monthly_premium": 23.74,
            "owner1_id": ids[0],
            "owner2_id": ids[1],
            "lifeassured1_id": ids[0],
            "lifeassured2_id": ids[1]  
    })




    return("Clients " + str(random_name_client) + " (" + str(ids[0]) + ") and " + str(random_name_partner) + " (" + str(ids[1]) + ") and sample data created."), 201


@clients_blueprint.route("/delete-all-clients", methods=["POST"])
def delete_all_clients():
    all_clients = Client.query.all()

    for client in all_clients:
        delete_client(client.id)

    return "Done", 200
