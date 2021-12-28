import os
from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)

app.config["SECRET_KEY"] = "mysecretkey"
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+os.path.join(basedir,"data.sqlite")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'sqlalchemy'

db = SQLAlchemy(app)
ma = Marshmallow(app)

Migrate(app, db, render_as_batch=True)



class Client(db.Model):
    __tablename__ = "client"

    client_id = db.Column(db.Integer, primary_key=True)
    forename = db.Column(db.Text)
    preferred_name = db.Column(db.Text)
    middle_names = db.Column(db.Text)
    surname = db.Column(db.Text)
    gender = db.Column(db.Text)
    dob = db.Column(db.Date)

    def __init__(self, **kwargs):
        super(Client, self).__init__(**kwargs)


class ClientSchema(ma.Schema):
    class Meta:
        fields = (
        'id', 
        'forename', 
        'preferred_name',
        'middle_names',
        'surname',
        'gender',
        'dob')

client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)
