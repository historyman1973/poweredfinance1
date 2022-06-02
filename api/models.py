from database import db, ma

investment_holdings = db.Table('investment_holdings', db.Column('investment_id', db.Integer, db.ForeignKey('investment.id')),
                               db.Column('holding_id', db.Integer, db.ForeignKey('holding.id')))


holdings_transactions = db.Table('holdings_transactions',
                                 db.Column('holding_id', db.Integer,
                                           db.ForeignKey('holding.id')),
                                 db.Column('transaction_id', db.Integer,
                                           db.ForeignKey('transaction.id'))
                                 )


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
                  'surname', 'gender', 'isPrimary')


client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)


class Holding(db.Model):
    __tablename__ = "holding"

    id = db.Column(db.Integer, primary_key=True)
    investment_id = db.Column(db.Integer, db.ForeignKey('investment.id'))
    instrument_id = db.Column(db.Integer, db.ForeignKey('instrument.id'))
    units = db.Column(db.Float)

    transactions = db.relationship(
        'Transaction', secondary=holdings_transactions, backref='holding', lazy='dynamic')

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


class Investment(db.Model):
    __tablename__ = "investment"

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String)
    investment_type = db.Column(db.String)
    provider = db.Column(db.String)
    investment_ref = db.Column(db.String)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    holdings = db.relationship(
        'Holding', secondary=investment_holdings, backref='investments')

    def __init__(self, **kwargs):
        super(Investment, self).__init__(**kwargs)


class InvestmentSchema(ma.Schema):
    class Meta:
        model = Investment
        fields = (
            'id',
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


class LifestyleAsset(db.Model):
    __tablename__ = "lifestyle_asset"

    id = db.Column(db.Integer, primary_key=True)
    asset_type = db.Column(db.String)
    description = db.Column(db.String)
    value = db.Column(db.Numeric)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    def __init__(self, **kwargs):
        super(LifestyleAsset, self).__init__(**kwargs)


class LifestyleAssetSchema(ma.Schema):
    class Meta:
        model = LifestyleAsset
        fields = (
            'id',
            'asset_type',
            'description',
            'value',
            'owner1_id',
            'owner2_id'
        )


lifestyleasset_schema = LifestyleAssetSchema()
lifestyleassets_schema = LifestyleAssetSchema(many=True)


class Property(db.Model):
    __tablename__ = "property"

    id = db.Column(db.Integer, primary_key=True)
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
        fields = ('ttype', 'tdate', 'units', 'price',
                  'owner1_id', 'owner2_id', 'holding_id')


transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)
