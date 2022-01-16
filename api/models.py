from app import db, ma
from flask_sqlalchemy import SQLAlchemy


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
        fields = ('id', 'forename', 'middle_names', 'surname', 'gender', 'isPrimary')


client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)


class Investment(db.Model):
    __tablename__ = "investment"

    id = db.Column(db.Integer, primary_key=True)
    investment_type = db.Column(db.String)
    provider = db.Column(db.String)
    investment_ref = db.Column(db.String)
    value = db.Column(db.Float)
    owner1_id = db.Column(db.Integer, db.ForeignKey('client.id'))
    owner2_id = db.Column(db.Integer, db.ForeignKey('client.id'))

    def __init__(self, **kwargs):
        super(Investment, self).__init__(**kwargs)


class InvestmentSchema(ma.Schema):
    class Meta:
        model = Investment
        fields = (
            'id',
            'investment_type',
            'provider',
            'investment_ref',
            'value',
            'owner1_id',
            'owner2_id'
            )


investment_schema = InvestmentSchema()
investments_schema = InvestmentSchema(many=True)
