from app import db, ma
from flask_sqlalchemy import SQLAlchemy


class Client(db.Model):
    __tablename__ = "client"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def __init__(self, name):
        self.name = name

class ClientSchema(ma.Schema):
    class Meta:
        model = Client
        fields = ('id', 'name') 

client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)
