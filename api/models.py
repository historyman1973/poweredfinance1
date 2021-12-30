from app import db, ma
from flask_sqlalchemy import SQLAlchemy


class Client(db.Model):
    __tablename__ = "client"

    id = db.Column(db.Integer, primary_key=True)
    forename = db.Column(db.String)
    preferred_name = db.Column(db.String)
    middle_names = db.Column(db.String)
    surname = db.Column(db.String)
    dob = db.Column(db.Date)

    def __init__(self, **kwargs):
        super(Client, self).__init__(**kwargs)

class ClientSchema(ma.Schema):
    class Meta:
        model = Client
        fields = ('id', 'forename') 

client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)