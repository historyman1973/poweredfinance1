import json
from database import db
from flask import Blueprint, request
from flask.json import jsonify
import requests
from dotenv import load_dotenv
import os


api_blueprint = Blueprint('api_blueprint', __name__)

from models import Client, clients_schema, client_schema, Investment, investment_schema, investments_schema, Instrument, instrument_schema, instruments_schema

load_dotenv(dotenv_path="./.env.local")

MY_ACCESS_KEY = os.environ.get("MY_ACCESS_KEY", "")

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


@api_blueprint.route("/add-instruments", methods=["POST"])
def add_instruments():
    req = request.get_json()
    instruments_added = []
    for i in range(0,len(req)):
        if Instrument.query.filter(Instrument.symbol == request.json[i]['symbol'], Instrument.exchange == request.json[i]['exchange']).scalar() is None:
            symbol = request.json[i]['symbol']
            exchange = request.json[i]['exchange']
            units = request.json[i]['units']
            cost = request.json[i]['cost']
        
            new_instrument = Instrument(
                symbol=symbol,
                exchange=exchange,
                units=units,
                cost=cost
            )

            instruments_added.append(symbol)

            db.session.add(new_instrument)
            db.session.commit()

    return {"added": instruments_added}


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
    db.session.commit()

    return investment_schema.jsonify(new_investment)


@api_blueprint.route("/instrument-to-investment/<instrument_id>/<investment_id>", methods=["POST"])
def link_instrument_to_investment(instrument_id, investment_id):
    investment = Investment.query.get(investment_id)
    instrument = Instrument.query.get(instrument_id)
    investment.instruments.append(instrument)
    db.session.commit()

    return "Linked " + instrument.symbol + " to " + investment.investment_type


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


@api_blueprint.route("/get-eod-timeseries/<symbol>", methods=["GET"])
def get_eod_timeseries(symbol):
    params = {
        'access_key': MY_ACCESS_KEY,
        'symbols': symbol
    }
    result = requests.get('http://api.marketstack.com/v1/eod', params)

    data = result.json()

    return data


@api_blueprint.route("/get-latest-data/<symbol>", methods=["GET"])
def get_latest_data(symbol):
    params = {
        'access_key': MY_ACCESS_KEY,
        'symbols': symbol
    }
    result = requests.get('http://api.marketstack.com/v1/eod/latest', params)

    data = result.json()

    return data


@api_blueprint.route("/get-ticker/<symbol>", methods=["GET"])
def get_ticker(symbol):
    params = {
        'access_key': MY_ACCESS_KEY,
        'symbols': symbol
    }
    result = requests.get('http://api.marketstack.com/v1/tickers', params)

    data = result.json()

    return data


@api_blueprint.route("/search-ticker/<search_term>", methods=["GET"])
def search_ticker(search_term):
    params = {
        'access_key': MY_ACCESS_KEY,
        'search': search_term
    }
    result = requests.get('http://api.marketstack.com/v1/tickers', params)

    data = result.json()

    return data