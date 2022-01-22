from app import db, ma
from flask_sqlalchemy import SQLAlchemy

investment_instrument = db.Table('investment_instrument',
                                 db.Column('investment_id', db.Integer,
                                           db.ForeignKey('investment.id')),
                                 db.Column('instrument_id', db.Integer,
                                           db.ForeignKey('instrument.id'))
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


class Investment(db.Model):
    __tablename__ = "investment"

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String)
    investment_type = db.Column(db.String)
    provider = db.Column(db.String)
    investment_ref = db.Column(db.String)
    value = db.Column(db.Numeric)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    instruments = db.relationship('Instrument', secondary=investment_instrument, backref='investments')

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
            'value',
            'owner1_id',
            'owner2_id'
        )


investment_schema = InvestmentSchema()
investments_schema = InvestmentSchema(many=True)


class Instrument(db.Model):
    __tablename__ = "instrument"

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String)
    exchange = db.Column(db.String)
    units = db.Column(db.Float)
    cost = db.Column(db.DECIMAL(asdecimal=False))

    def __init__(self, **kwargs):
        super(Instrument, self).__init__(**kwargs)


class InstrumentSchema(ma.Schema):
    class Meta:
        model = Instrument
        fields = (
            'id',
            'symbol',
            'exchange',
            'units',
            'cost'
        )


instrument_schema = InstrumentSchema()
instruments_schema = InstrumentSchema(many=True)
