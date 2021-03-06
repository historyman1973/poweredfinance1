from models import Client, Investment, investment_schema, investments_schema, \
    Instrument, Holding, holding_schema, holdings_schema, Transaction, transaction_schema, transactions_schema, HoldingHistory, \
    instrument_schema, instruments_schema
from database import db
from flask import Blueprint, request
from flask.json import jsonify
from routes.marketdata import get_latest_data
import csv
from io import TextIOWrapper

investments_blueprint = Blueprint('investments_blueprint', __name__)


@investments_blueprint.route("/get-holding-data/<investment_id>", methods=["GET"])
def get_holding_data(investment_id):
    investment = Investment.query.get(investment_id)
    data = []
    for holding in investment.holdings:
        instrument = Instrument.query.get(holding.instrument_id)
        unit_price = get_latest_data(instrument.symbol).get_json()[0]["close"]
        current_value = holding.units*unit_price

        data.append(
            {"holding_id": holding.id,
             "instrument_id": instrument.id,
             "instrument_name": instrument.name,
             "current_units": holding.units,
             "holding_ticker": instrument.symbol,
             "current_value": current_value}
        )

    return jsonify(data)


@investments_blueprint.route("/get-holdings/<investment_id>", methods=["GET"])
def get_holdings(investment_id):
    investment = Investment.query.get(investment_id)
    if investment:
        holdings = investment.holdings
        result = holdings_schema.dump(holdings)
        return jsonify(result)
    else:
        return("Investment id " + investment_id + " doesn't exist."), 404



@investments_blueprint.route("/get-all-instruments", methods=["GET"])
def get_all_instruments():
    instruments = Instrument.query.all()
    
    result = instruments_schema.dump(instruments)

    return jsonify(result)


@investments_blueprint.route("/get-instrument/<instrument_id>", methods=["GET"])
def get_instrument(instrument_id):
    instrument = Instrument.query.get(instrument_id)
    if instrument:
        result = instrument_schema.dump(instrument)
        return jsonify(result)
    else:
        return("Instrument id " + instrument_id + " doesn't exist."), 404


@investments_blueprint.route("/add-investment", methods=["POST"])
def add_investment():
    # Initialise Owners
    owner1 = None
    owner2 = None

    status = request.json['status']
    category = request.json['category']
    investment_type = request.json['investment_type']
    provider = request.json['provider']
    investment_ref = request.json['investment_ref']
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
        new_investment = Investment(
            status=status,
            category=category,
            investment_type=investment_type,
            provider=provider,
            investment_ref=investment_ref,
            owner1_id=owner1_id,
            owner2_id=owner2_id
        )

        db.session.add(new_investment)
        db.session.commit()

        print(new_investment.owner1_id)

        return investment_schema.jsonify(new_investment), 201


@investments_blueprint.route("/delete-investment/<investment_id>", methods=["DELETE"])
def delete_investment(investment_id):
    linked_holdings = Investment.query.get(investment_id).holdings
    linked_holdings_ids = []
    for linked_holding in linked_holdings:
        linked_holdings_ids.append(linked_holding.id)

    db.session.query(HoldingHistory).filter(HoldingHistory.holding_id.in_(
        linked_holdings_ids)).delete(synchronize_session=False)
    db.session.commit()
    # HoldingHistory.query.filter_by(HoldingHistory.holding_id.in_(linked_holdings_ids).delete())

    db.session.query(Transaction).filter(Transaction.holding_id.in_(
        linked_holdings_ids)).delete(synchronize_session=False)
    db.session.commit()
    # Transaction.query.filter_by(Transaction.holding_id.in_(linked_holdings_ids).delete())

    db.session.query(Holding).filter(Holding.id.in_(
        linked_holdings_ids)).delete(synchronize_session=False)
    db.session.commit()
    # Holding.query.filter_by(Holding.id.in_(linked_holdings_ids).delete())

    # db.session.query(investment_holdings).filter(investment_holdings.investment_id.in_(linked_holdings_ids)).delete(synchronize_session=False)
    # db.session.commit()

    db.session.delete(Investment.query.get(investment_id))
    db.session.commit()

    return("Investment deleted"), 204


@investments_blueprint.route("/get-holding/<holding_id>", methods=["GET"])
def get_holding(holding_id):
    holding = Holding.query.get(holding_id)
    if holding:
        result = holding_schema.dump(holding)
        return jsonify(result)
    else:
        return("Holding id " + holding_id + " doesn't exist."), 404


@investments_blueprint.route("/edit-investment/<investment_id>", methods=["PATCH"])
def edit_investment(investment_id):
    investment = Investment.query.filter_by(id=investment_id).update(request.get_json())
    db.session.commit()

    return investment_schema.jsonify(investment), 204



@investments_blueprint.route("/get-investment/<investment_id>", methods=["GET"])
def get_investment(investment_id):
    investment = Investment.query.get(investment_id)
    if investment:
        result = investment_schema.dump(investment)
        return jsonify(result)
    else:
        return("Investment id " + investment_id + " doesn't exist."), 404


@investments_blueprint.route("/get-investment-value/<investment_id>", methods=["GET"])
def get_investment_value(investment_id):
    # Given an investment ID, return it's total value across all holdings
    investment = Investment.query.get(investment_id)

    total_value = 0

    # Prepare a string which concatenates the relevant symbols into a comma separated string
    instruments = ""
    number_of_instruments = len(investment.holdings)
    for holding in investment.holdings:
        instrument = Instrument.query.get(holding.instrument_id)
        if len(instruments) < number_of_instruments:
            instruments += instrument.symbol + ","
        else:
            instruments += instrument.symbol

    # Make the external API call for all of the symbols at once
    current_unit_prices = get_latest_data(instruments).get_json()

    # From a jsonified version of the API response, create a simple dictionary with the symbol as the key and the price as the value
    lookup = {}
    for entry in current_unit_prices:
        lookup[entry["symbol"]] = entry["close"]

    # Iterate through the values in the simple dictionary, grab the correct price (based on the symbol) and multiply it by the units held
    i = 0
    for holding in investment.holdings:
        instrument = Instrument.query.get(holding.instrument_id)
        holding_current_value = holding.units*lookup[instrument.symbol]
        total_value += holding_current_value
        i += 1

    return jsonify(total_value=total_value)


@investments_blueprint.route("/get-investments/<client_id>", methods=["GET"])
def get_investments(client_id):
    client = Client.query.get(client_id)
    data = []
    if client:
        if client.isPrimary == True:
            investments = db.session.query(
                Investment).filter_by(owner1_id=client_id)
        else:
            investments = db.session.query(
                Investment).filter_by(owner2_id=client_id)

    for investment in investments:
        current_investment = Investment.query.get(investment.id)
        current_value = get_investment_value(
            current_investment.id).get_json()["total_value"]

        data.append(
            {"investment_id": investment.id,
                "investment_type": investment.investment_type,
                "provider": investment.provider,
                "investment_ref": investment.investment_ref,
                "current_value": current_value}
        )

    return jsonify(data)


@investments_blueprint.route("/add-transaction", methods=["POST"])
def add_transaction():
    investment_id = request.json['investment_id']
    instrument_id = request.json['instrument_id']
    investment = Investment.query.get(investment_id)
    instrument = Instrument.query.get(instrument_id)
    if investment and instrument:
        ttype = request.json['ttype']
        tdate = request.json['tdate']
        if ttype == "sell":
            units = float(request.json['units']) * -1
        else:
            units = float(request.json['units'])
        price = request.json['price']
        owner1_id = request.json['owner1_id']
        owner2_id = request.json['owner2_id']

        holding = Holding.query.filter(
            Holding.investment_id == investment_id,
            Holding.instrument_id == instrument_id).scalar()

        if holding:
            # If there's already a holding, add the units to it
            holding.units = holding.units + float(units)
        else:
            # Create the holding and link it to the investment
            holding = Holding(investment_id=investment_id,
                              instrument_id=instrument_id, units=units)
            db.session.add(holding)
            db.session.commit()
            db.session.flush()
            # investment = Investment.query.get(investment_id)
            investment.holdings.append(holding)
            db.session.commit()

        # Add the new transaction
        new_transaction = Transaction(
            ttype=ttype, tdate=tdate, units=units, price=price, owner1_id=owner1_id, owner2_id=owner2_id, investment_id=investment_id)

        # Link the transaction to its holding
        new_transaction.holding_id = holding.id

        db.session.add(new_transaction)
        db.session.commit()
        db.session.flush()

        holding.transactions.append(new_transaction)
        db.session.commit()

        # Update the holding history table
        history_update = HoldingHistory(
            holding_id=holding.id, units=holding.units, updated_date=tdate, transaction_id=new_transaction.id)
        db.session.add(history_update)
        db.session.commit()
        db.session.flush()

        transaction_result = transaction_schema.dump(new_transaction)

        return jsonify(transaction_result), 201
    elif investment is None and instrument:
        return("Investment id " + str(investment_id) + " doesn't exist."), 404
    elif investment and instrument is None:
        return("Instrument id " + str(instrument_id) + " doesn't exist."), 404
    elif investment is None and instrument is None:
        return("Neither investment id " + str(investment_id) + " nor instrument id " + str(instrument_id) + " exists."), 404


@investments_blueprint.route("/delete-transaction/<transaction_id>", methods=["DELETE"])
def delete_transaction(transaction_id):
    transaction_to_delete = Transaction.query.get(transaction_id)
    if transaction_to_delete:

        # Now adjust the current holdings by the number of units for the transaction
        holding_to_amend = Holding.query.filter(
            Holding.id == transaction_to_delete.holding_id).scalar()
        if holding_to_amend:
            holding_to_amend.units -= transaction_to_delete.units

        # Delete the HoldingHistory record to remove the units from the transaction from the history
        holdinghistory_to_delete = HoldingHistory.query.filter(
            HoldingHistory.transaction_id == transaction_to_delete.id).scalar()
        if holdinghistory_to_delete:
            db.session.delete(holdinghistory_to_delete)
            db.session.commit()

        # Delete the transaction
        db.session.delete(transaction_to_delete)
        db.session.commit()
        db.session.flush()

        if holding_to_amend.transactions.count() == 0:
            db.session.delete(holding_to_amend)
            db.session.commit()

        return("Transaction deleted"), 204
    else:
        return("Transaction doesn't exist"), 404


@investments_blueprint.route("/edit-transaction", methods=["PATCH"])
def edit_transaction():

    transaction_id = request.json['transaction_id']
    ttype = request.json['ttype']
    tdate = request.json['tdate']
    units = request.json['units']
    price = request.json['price']

    transaction = Transaction.query.filter_by(id=transaction_id).first()

    # JSON request is 150 units so units difference is +24
    # JSON request is 100 units so units difference is -26

    units_difference = float(units - transaction.units)
    print(units_difference)
    if transaction.ttype != ttype:
        units_difference *= -1
    
    transaction.ttype = ttype
    transaction.tdate = tdate
    transaction.price = price
    if ttype == "sell" and units >= 0:
        transaction.units = units * -1
    elif ttype == "buy" and units < 0:
        transaction.units = units * -1
    else:
        transaction.units = units

    db.session.commit()

    HoldingHistory.query.filter(HoldingHistory.transaction_id==transaction.id).first().units += units_difference

    db.session.commit()

    Holding.query.get(transaction.holding_id).units += units_difference

    db.session.commit()

    return transaction_schema.jsonify(transaction), 204


@investments_blueprint.route("/get-transaction/<transaction_id>", methods=["GET"])
def get_transaction(transaction_id):
    transaction = Transaction.query.get(transaction_id)
    result = transaction_schema.dump(transaction)
    return jsonify(result)


@investments_blueprint.route("/get-transactions/<grouping>/<group_id>", methods=["GET"])
def get_transactions(grouping, group_id):
    if grouping == "account":
        investment = Investment.query.get(group_id)
        if investment:
            holdings = investment.holdings
            target_holdings = []
            # For each holding, add it's ID to a list, ready to be iterated through in the function below.
            for holding in holdings:
                target_holdings.append(holding.id)

            transactions = Transaction.query.filter(Transaction.holding_id.in_(
                target_holdings)).order_by(Transaction.tdate).all()

            result = transactions_schema.dump(transactions)
            return jsonify(result)
        else:
            return("Account id " + group_id + " doesn't exist."), 404

    elif grouping == "holding":
        holding = Holding.query.get(group_id)
        if holding:
            transactions = Transaction.query.filter(
                Transaction.holding_id == group_id).order_by(Transaction.tdate).all()

            result = transactions_schema.dump(transactions)
            return jsonify(result)
        else:
            return("Holding id " + group_id + " doesn't exist."), 404

    elif grouping == "client":
        client = Client.query.get(group_id)
        if client:
            if client.isPrimary == True:
                transactions = Transaction.query.filter(
                    Transaction.owner1_id == group_id).order_by(Transaction.tdate).all()
            elif client.isPrimary == False:
                transactions = Transaction.query.filter(
                    Transaction.owner2_id == group_id).order_by(Transaction.tdate).all()

            result = transactions_schema.dump(transactions)
            return jsonify(result)
        else:
            return ("Client id " + group_id + " doesn't exist."), 404


@investments_blueprint.route("/upload-instruments", methods=["POST"])
def upload_instruments():
    if request.method == 'POST':
        csv_file = request.files['file']
        csv_file = TextIOWrapper(csv_file, encoding='utf-8')
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            new_instrument = Instrument(
                symbol=row[0],
                name=row[1],
                market_cap=row[5],
                country=row[6],
                ipo_year=row[7],
                volume=row[8],
                sector=row[9],
                industry=row[10]
            )
            db.session.add(new_instrument)
            db.session.commit()

    return "Done", 201
