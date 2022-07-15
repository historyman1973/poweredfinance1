from email.policy import default
from database import db, ma
from sqlalchemy import Enum


class Client(db.Model):
    __tablename__ = "client"

    id = db.Column(db.Integer, primary_key=True)
    forename = db.Column(db.String)
    preferred_name = db.Column(db.String)
    middle_names = db.Column(db.String)
    surname = db.Column(db.String)
    gender = db.Column(db.String)
    isPrimary = db.Column(db.Boolean)

    def __init__(self, **kwargs):
        super(Client, self).__init__(**kwargs)


class ClientSchema(ma.Schema):
    class Meta:
        model = Client
        fields = ('id', 'forename', 'middle_names',
                  'preferred_name', 'surname', 'gender', 'isPrimary')


client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)


class Expense(db.Model):
    __tablename__ = "expense"

    id = db.Column(db.Integer, primary_key=True)
    fixed_or_variable = db.Column(db.String)
    expense_type = db.Column(db.String)
    amount = db.Column(db.Float)
    frequency = db.Column(db.Integer)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    def __init__(self, **kwargs):
        super(Expense, self).__init__(**kwargs)

class ExpenseSchema(ma.Schema):
    class Meta:
        model = Expense
        fields = (
            'id',
            'fixed_or_variable',
            'expense_type',
            'amount',
            'frequency',
            'start_date',
            'end_date',
            'owner1_id',
            'owner2_id'
        )

expense_schema = ExpenseSchema()
expenses_schema = ExpenseSchema(many=True)



class Holding(db.Model):
    __tablename__ = "holding"

    id = db.Column(db.Integer, primary_key=True)
    investment_id = db.Column(db.Integer, db.ForeignKey('investment.id'))
    instrument_id = db.Column(db.Integer, db.ForeignKey('instrument.id'))
    units = db.Column(db.Float)

    transactions = db.relationship(
        'Transaction', backref='holding', lazy='dynamic')

    def __init__(self, **kwargs):
        super(Holding, self).__init__(**kwargs)


class HoldingSchema(ma.Schema):
    class Meta:
        model = Holding
        fields = ('id', 'investment_id', 'instrument_id', 'units')


holding_schema = HoldingSchema()
holdings_schema = HoldingSchema(many=True)


class HoldingHistory(db.Model):
    __tablename__ = "holdinghistory"

    id = db.Column(db.Integer, primary_key=True)
    holding_id = db.Column(db.Integer, db.ForeignKey('holding.id'))
    units = db.Column(db.Float)
    updated_date = db.Column(db.String)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transaction.id'))

    def __init__(self, **kwargs):
        super(HoldingHistory, self).__init__(**kwargs)


class HoldingHistorySchema(ma.Schema):
    class Meta:
        model = HoldingHistory
        fields = (
            'id',
            'holding_id',
            'units',
            'updated_date',
            'transaction_id'
        )


holdinghistory_schema = HoldingHistorySchema()
holdinghistories_schema = HoldingHistorySchema(many=True)


class Income(db.Model):
    __tablename__ = "income"

    id = db.Column(db.Integer, primary_key=True)
    fixed_or_variable = db.Column(db.String)
    income_type = db.Column(db.String)
    amount = db.Column(db.Float)
    frequency = db.Column(db.Integer)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    def __init__(self, **kwargs):
        super(Income, self).__init__(**kwargs)

class IncomeSchema(ma.Schema):
    class Meta:
        model = Income
        fields = (
            'id',
            'fixed_or_variable',
            'income_type',
            'amount',
            'frequency',
            'start_date',
            'end_date',
            'owner1_id',
            'owner2_id'
        )

income_schema = IncomeSchema()
incomes_schema = IncomeSchema(many=True)


class Instrument(db.Model):
    __tablename__ = "instrument"

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String)
    exchange = db.Column(db.String)
    name = db.Column(db.String)
    market_cap = db.Column(db.Integer)
    country = db.Column(db.String)
    ipo_year = db.Column(db.Integer)
    volume = db.Column(db.Integer)
    sector = db.Column(db.String)
    industry = db.Column(db.String)

    def __init__(self, **kwargs):
        super(Instrument, self).__init__(**kwargs)


class InstrumentSchema(ma.Schema):
    class Meta:
        model = Instrument
        fields = (
            'id',
            'symbol',
            'exchange',
            'name'
        )


instrument_schema = InstrumentSchema()
instruments_schema = InstrumentSchema(many=True)


class Insurance(db.Model):
    __tablename__ = "insurance"

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(Enum('Active', 'Lapsed', 'Cancelled',
                       'Recommended', name='policy_status'))
    category = db.Column(db.String)
    insurance_type = db.Column(db.String)
    provider = db.Column(db.String)
    policy_ref = db.Column(db.String)
    sum_assured = db.Column(db.Integer)
    monthly_premium = db.Column(db.Float)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    lifeassured1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    lifeassured2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    def __init__(self, **kwargs):
        super(Insurance, self).__init__(**kwargs)


class InsuranceSchema(ma.Schema):
    class Meta:
        model = Insurance
        fields = (
            'id',
            'status',
            'category',
            'insurance_type',
            'provider',
            'policy_ref',
            'sum_assured',
            'monthly_premium',
            'owner1_id',
            'owner2_id',
            'lifeassured1_id',
            'lifeassured2_id'
        )


insurance_schema = InsuranceSchema()
insurances_schema = InsuranceSchema(many=True)


class Investment(db.Model):
    __tablename__ = "investment"

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(Enum('Active', 'Transferred out',
                       'Matured', 'Recommended', name='policy_status'))
    category = db.Column(db.String)
    investment_type = db.Column(db.String)
    provider = db.Column(db.String)
    investment_ref = db.Column(db.String)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    holdings = db.relationship('Holding', backref='investments')

    def __init__(self, **kwargs):
        super(Investment, self).__init__(**kwargs)


class InvestmentSchema(ma.Schema):
    class Meta:
        model = Investment
        fields = (
            'id',
            'status',
            'category',
            'investment_type',
            'provider',
            'investment_ref',
            'owner1_id',
            'owner2_id'
        )


investment_schema = InvestmentSchema()
investments_schema = InvestmentSchema(many=True)


class Liability(db.Model):
    __tablename__ = "liability"

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(
        Enum('Active', 'Redeemed', 'Recommended', name='policy_status'))
    category = db.Column(db.String)
    liability_type = db.Column(db.String)
    description = db.Column(db.String)
    amount_borrowed = db.Column(db.Numeric)
    amount_outstanding = db.Column(db.Numeric)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'))

    property = db.relationship("Property", back_populates="liability")

    def __init__(self, **kwargs):
        super(Liability, self).__init__(**kwargs)


class LiabilitySchema(ma.Schema):
    class Meta:
        model = Liability
        fields = (
            'id',
            'status',
            'category',
            'liability_type',
            'description',
            'amount_borrowed',
            'amount_outstanding',
            'owner1_id',
            'owner2_id',
            'property_id'
        )


liability_schema = LiabilitySchema()
liabilities_schema = LiabilitySchema(many=True)


class OtherAsset(db.Model):
    __tablename__ = "otherasset"

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(
        Enum('Active', 'Sold', 'Recommended', name='policy_status'))
    asset_type = db.Column(db.String)
    description = db.Column(db.String)
    value = db.Column(db.Numeric)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    def __init__(self, **kwargs):
        super(OtherAsset, self).__init__(**kwargs)


class OtherAssetSchema(ma.Schema):
    class Meta:
        model = OtherAsset
        fields = (
            'id',
            'status',
            'asset_type',
            'description',
            'value',
            'owner1_id',
            'owner2_id'
        )


otherasset_schema = OtherAssetSchema()
otherassets_schema = OtherAssetSchema(many=True)


class Property(db.Model):
    __tablename__ = "property"

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(Enum('Active', 'Sold', name='policy_status'))
    property_type = db.Column(db.String)
    address = db.Column(db.String)
    cost = db.Column(db.Numeric)
    value = db.Column(db.Numeric)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    liability = db.relationship(
        "Liability", back_populates="property", uselist=False)

    def __init__(self, **kwargs):
        super(Property, self).__init__(**kwargs)


class PropertySchema(ma.Schema):
    class Meta:
        model = Property
        fields = (
            'id',
            'status',
            'property_type',
            'address',
            'cost',
            'value',
            'owner1_id',
            'owner2_id'
        )


property_schema = PropertySchema()
properties_schema = PropertySchema(many=True)


class Transaction(db.Model):
    __tablename__ = "transaction"

    id = db.Column(db.Integer, primary_key=True)
    ttype = db.Column(db.String)
    tdate = db.Column(db.String)
    units = db.Column(db.Float)
    price = db.Column(db.DECIMAL(asdecimal=False))
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    holding_id = db.Column(db.Integer, db.ForeignKey('holding.id'))

    def __init__(self, **kwargs):
        super(Transaction, self).__init__(**kwargs)


class TransactionSchema(ma.Schema):
    class Meta:
        model = Transaction
        fields = ('id', 'ttype', 'tdate', 'units', 'price',
                  'owner1_id', 'owner2_id', 'holding_id')


transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)
