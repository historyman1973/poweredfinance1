from models import Client, Income, income_schema, incomes_schema, Expense, expense_schema, expenses_schema
from database import db
from flask.json import jsonify
from flask import Blueprint, request
import datetime
import random

cashflow_blueprint = Blueprint('cashflow_blueprint', __name__)

##########################################################
# INCOME
##########################################################

@cashflow_blueprint.route("/add-income", methods=['POST'])
def add_income():
    # Initialise owners

    owner1 = None
    owner2 = None
    
    fixed_or_variable = request.json['fixed_or_variable']
    income_type = request.json['income_type']
    amount = request.json['amount']
    frequency = request.json['frequency']
    start_date = request.json['start_date']
    end_date = request.json['end_date']
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


    if start_date:
        start_date=datetime.datetime.strptime(start_date, '%Y-%m-%d')
    else:
        start_date=None

    if end_date:
        end_date=datetime.datetime.strptime(end_date, '%Y-%m-%d')
    else:
        end_date=None


    if owner1 or owner2:
        new_income = Income(
        fixed_or_variable=fixed_or_variable,
        income_type=income_type,
        amount=amount,
        frequency=frequency,
        start_date=start_date,
        end_date=end_date,
        owner1_id=owner1_id,
        owner2_id=owner2_id
        )

    db.session.add(new_income)
    db.session.commit()

    return income_schema.jsonify(new_income), 201


@cashflow_blueprint.route("/delete-income/<income_id>", methods=["DELETE"])
def delete_income(income_id):
    if Income.query.get(income_id):
        db.session.delete(Income.query.get(income_id))
        db.session.commit()

        return("Income deleted"), 204
    else:
        return("Income doesn't exist"), 404


@cashflow_blueprint.route("/edit-income/<income_id>", methods=["PATCH"])
def edit_income(income_id):
    income = Income.query.filter_by(id=income_id).update(request.get_json())
    db.session.commit()

    return income_schema.jsonify(income), 204


@cashflow_blueprint.route("/get-income/<income_id>", methods=["GET"])
def get_income(income_id):
    income = Income.query.get(income_id)
    result = income_schema.dump(income)
    if result:
        return jsonify(result)
    else:
        return("Income id " + income_id + " doesn't exist."), 404


@cashflow_blueprint.route("/get-incomes/<client_id>", methods=["GET"])
# @auth.login_required
def get_incomes(client_id):
    client = Client.query.get(client_id)
    if client:
        if client.isPrimary == True:
            incomes = db.session.query(
                Income).filter_by(owner1_id=client_id)
        else:
            incomes = db.session.query(
                Income).filter_by(owner2_id=client_id)

        return incomes_schema.jsonify(incomes)
    else:
        return("Client " + client_id + " doesn't exist."), 404


##########################################################
# EXPENSES
##########################################################

@cashflow_blueprint.route("/add-expense", methods=['POST'])
def add_expense():
    # Initialise owners

    owner1 = None
    owner2 = None    
    
    fixed_or_variable = request.json['fixed_or_variable']
    expense_type = request.json['expense_type']
    amount = request.json['amount']
    frequency = request.json['frequency']
    start_date = request.json['start_date']
    end_date = request.json['end_date']
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

    if start_date:
        start_date=datetime.datetime.strptime(start_date, '%Y-%m-%d')
    else:
        start_date=None

    if end_date:
        end_date=datetime.datetime.strptime(start_date, '%Y-%m-%d')
    else:
        end_date=None


    if owner1 or owner2:
        new_expense = Expense(
        fixed_or_variable=fixed_or_variable,
        expense_type=expense_type,
        amount=amount,
        frequency=frequency,
        start_date=start_date,
        end_date=end_date,
        owner1_id=owner1_id,
        owner2_id=owner2_id
        )

    db.session.add(new_expense)
    db.session.commit()

    return expense_schema.jsonify(new_expense), 201


@cashflow_blueprint.route("/delete-expense/<expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    if Expense.query.get(expense_id):
        db.session.delete(Expense.query.get(expense_id))
        db.session.commit()

        return("Income deleted"), 204
    else:
        return("Income doesn't exist"), 404


@cashflow_blueprint.route("/edit-expense/<expense_id>", methods=["PATCH"])
def edit_expense(expense_id):
    expense = Expense.query.filter_by(id=expense_id).update(request.get_json())
    db.session.commit()

    return expense_schema.jsonify(expense), 204


@cashflow_blueprint.route("/get-expense/<expensen_id>", methods=["GET"])
def get_expense(expense_id):
    expense = Expense.query.get(expense_id)
    result = expense_schema.dump(expense)
    if result:
        return jsonify(result)
    else:
        return("Expense id " + expense_id + " doesn't exist."), 404


@cashflow_blueprint.route("/get-incomes/<client_id>", methods=["GET"])
# @auth.login_required
def get_expenses(client_id):
    client = Client.query.get(client_id)
    if client:
        if client.isPrimary == True:
            expenses = db.session.query(
                Expense).filter_by(owner1_id=client_id)
        else:
            expenses = db.session.query(
                Expense).filter_by(owner2_id=client_id)

        return expenses_schema.jsonify(expenses)
    else:
        return("Client " + client_id + " doesn't exist."), 404