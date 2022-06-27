import datetime
import json
import simplejson as json
from sqlalchemy import desc
from database import db
from flask import Blueprint, request
from flask.json import jsonify
import requests
from dotenv import load_dotenv
import os
import pandas_market_calendars as mcal
import pandas as pd


marketdata_blueprint = Blueprint('marketdata_blueprint', __name__)

from models import Investment, Instrument, HoldingHistory

load_dotenv(dotenv_path="./.env.local")

MY_ACCESS_KEY = os.environ.get("MY_ACCESS_KEY", "")


@marketdata_blueprint.route("/add-instruments", methods=["POST"])
def add_instruments():
    req = request.get_json()
    instruments_added = []
    for i in range(0, len(req)):
        if Instrument.query.filter(Instrument.symbol == request.json[i]['symbol'], Instrument.exchange == request.json[i]['exchange']).scalar() is None:
            symbol = request.json[i]['symbol']
            exchange = request.json[i]['exchange']

            # name_call = str(get_ticker(symbol))
            name_call_result = get_ticker(symbol).get_json()[i]['name']

            new_instrument = Instrument(
                symbol=symbol,
                exchange=exchange,
                name=name_call_result
            )


            instruments_added.append(symbol)

            db.session.add(new_instrument)
            db.session.commit()

    return {"added": instruments_added}


@marketdata_blueprint.route("/get-eod-timeseries/<symbol>", methods=["GET"])
def get_eod_timeseries(symbol):
    params = {
        'access_key': MY_ACCESS_KEY,
        'symbols': symbol
    }
    result = requests.get('http://api.marketstack.com/v1/eod', params)

    data = result.json()

    return jsonify(data["data"])


@marketdata_blueprint.route("/get-latest-data/<symbol>", methods=["GET"])
def get_latest_data(symbol):
    params = {
        'access_key': MY_ACCESS_KEY,
        'symbols': symbol
    }
    result = requests.get('http://api.marketstack.com/v1/eod/latest', params)

    data = result.json()

    ###### Use below if you want to avoid the market data API call, or use above if you want real prices.
    
    # data = {
    #     "data": [
    #         {
    #             "close": 1
    #         }
    #     ]
    # }

    return jsonify(data["data"])


@marketdata_blueprint.route("/get-ticker/<symbol>", methods=["GET"])
def get_ticker(symbol):
    params = {
        'access_key': MY_ACCESS_KEY,
        'symbols': symbol
    }
    result = requests.get('http://api.marketstack.com/v1/tickers', params)

    data = result.json()

    return jsonify(data["data"])


@marketdata_blueprint.route("/get-price-as-at-date/<symbols>", methods=["GET"])
def price_as_at_date(symbols):

    ###############################################################

    # This section uses the MarketStack external API so comment it out to save credits.

    nyse = mcal.get_calendar('NYSE')

    transaction_date = pd.to_datetime(request.json["transaction_date"])


    def next_trading_day(start_day):
        temp_day = start_day.date()
        next_day_found = False
        while next_day_found == False:
            if temp_day.weekday() in [5,6]:
                temp_day += datetime.timedelta(days=1)
            else:
                next_day_found = True
        return temp_day
    
    params = {
        'access_key': MY_ACCESS_KEY,
        'symbols': symbols,
        'date_from': next_trading_day(transaction_date),
        'date_to': next_trading_day(transaction_date + datetime.timedelta(days=1))
    }

    result = requests.get('http://api.marketstack.com/v1/eod', params)

    data = result.json()

    ###############################################################

    # Uncommenting this section will bypass the API where you want to limit the calls

    # data = {
    #     "data": [
    #         {
    #             "close": 1
    #         }
    #     ]
    # }

    ###############################################################

    return jsonify(data['data'])


@marketdata_blueprint.route("/get-units-as-at-date", methods=["GET"])
def units_as_at_date():
    investment_id = request.json['investment_id']
    as_at_date = request.json['as_at_date']

    # Get all of the holding links from the investment
    holdings = Investment.query.get(investment_id).holdings
    # Prepare an empty list, ready to hold the holdings ID linked to the investment of interest.
    target_holdings = []
    # For each holding, add it's ID to a list, ready to be iterated through in the function below.
    for holding in holdings:
        target_holdings.append(holding.id)
    # Create an empty list to hold the results you'll return in the API response
    units_as_at_date = []

    for item in target_holdings:
        # Try and detect how many units each holding had on the as_at_date, but don't error if the holding didn't exist on that date
        try:
            last_updated_date = HoldingHistory.query.filter(HoldingHistory.holding_id == int(
                item), HoldingHistory.updated_date <= as_at_date).order_by(desc(HoldingHistory.updated_date)).first()
        except:
            pass
        # If the holding was in place on the as_at_date, then create a dictionary of the holding's id and the number of units, adding it to the results list
        if last_updated_date:
            data = {int(item): last_updated_date.units}
            units_as_at_date.append(data)

    return json.dumps(units_as_at_date)


@marketdata_blueprint.route("/search-ticker/<search_term>", methods=["GET"])
def search_ticker(search_term):
    params = {
        'access_key': MY_ACCESS_KEY,
        'search': search_term
    }
    result = requests.get('http://api.marketstack.com/v1/tickers', params)

    data = result.json()

    return jsonify(data["data"])