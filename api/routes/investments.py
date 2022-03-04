from database import db
from flask import Blueprint, request
from flask.json import jsonify


investments_blueprint = Blueprint('investments_blueprint', __name__)

from models import Client, Investment, investment_schema, investments_schema, \
    Instrument, Holding, Transaction, transaction_schema, transactions_schema, HoldingHistory


@investments_blueprint.route("/add-investment", methods=["POST"])
def add_investment():
    investment_type = request.json['investment_type']
    provider = request.json['provider']
    investment_ref = request.json['investment_ref']
    value = request.json['value']
    owner1_id = request.json['owner1_id']
    owner2_id = request.json['owner2_id']


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


@investments_blueprint.route("/get-investment/<investment_id>", methods=["GET"])
def get_investment(investment_id):
    investment = Investment.query.get(investment_id)
    if investment:
        result = investment_schema.dump(investment)
        return jsonify(result)
    else:
        return("Investment id " + investment_id + " doesn't exist."), 404


@investments_blueprint.route("/get-investments/<client_id>", methods=["GET"])
def get_investments(client_id):
    client = Client.query.get(client_id)
    if client:
        if client.isPrimary == True:
            investments = db.session.query(
                Investment).filter_by(owner1_id=client_id)
        else:
            investments = db.session.query(
                Investment).filter_by(owner2_id=client_id)

        return investments_schema.jsonify(investments)
    else:
        return("Client id " + client_id + " doesn't exist."), 404


@investments_blueprint.route("/add-transaction", methods=["POST"])
def add_transaction():
    investment_id = request.json['investment_id']
    instrument_id = request.json['instrument_id']
    ttype = request.json['ttype']
    tdate = request.json['tdate']
    units = request.json['units']
    price = request.json['price']
    owner1_id = request.json['owner1_id']
    owner2_id = request.json['owner2_id']

    holding = Holding.query.filter(
            Holding.investment_id == investment_id,
            Holding.instrument_id == instrument_id).scalar()

    if holding:
        # If there's already a holding, add the units to it
        holding.units = holding.units + units
    else:
        # Create the holding and link it to the investment
        holding = Holding(investment_id = investment_id, instrument_id = instrument_id, units = units)
        db.session.add(holding)
        db.session.commit()
        db.session.flush()
        investment = Investment.query.get(investment_id)
        investment.holdings.append(holding)
        db.session.commit()

    # Add the new transaction
    new_transaction = Transaction(ttype=ttype, tdate=tdate, units=units, price=price, owner1_id=owner1_id, owner2_id=owner2_id)

    # Link the transaction to its holding
    new_transaction.holding_id = holding.id

    db.session.add(new_transaction)
    db.session.commit()
    db.session.flush()

    holding.transactions.append(new_transaction)
    db.session.commit()

    # Update the holding history table
    history_update = HoldingHistory(holding_id=holding.id, units=holding.units, updated_date=tdate)
    db.session.add(history_update)
    db.session.commit()
    db.session.flush()    

    transaction_result = transaction_schema.dump(new_transaction)

    return jsonify(transaction_result)


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

            transactions = Transaction.query.filter(Transaction.holding_id.in_(target_holdings)).order_by(Transaction.tdate).all()
            
            result = transactions_schema.dump(transactions)
            return jsonify(result)
        else:
            return("Account id " + group_id + " doesn't exist."), 404

    elif grouping == "holding":
        holding = Holding.query.get(group_id)
        if holding:
            transactions = Transaction.query.filter(Transaction.holding_id == group_id).order_by(Transaction.tdate).all()

            result = transactions_schema.dump(transactions)
            return jsonify(result)
        else:
            return("Holding id " + group_id + " doesn't exist."), 404

    elif grouping == "client":
        client = Client.query.get(group_id)
        if client:
            if client.isPrimary == True:
                transactions = Transaction.query.filter(Transaction.owner1_id == group_id).order_by(Transaction.tdate).all()
            elif client.isPrimary == False:
                transactions = Transaction.query.filter(Transaction.owner2_id == group_id).order_by(Transaction.tdate).all()
            
            result = transactions_schema.dump(transactions)
            return jsonify(result)
        else:
            return ("Client id " + group_id + " doesn't exist."), 404