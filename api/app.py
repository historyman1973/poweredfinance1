from flask import Flask, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_migrate import Migrate
from database import db, ma
from routes import api_blueprint
import os

app = Flask(__name__)
app.register_blueprint(api_blueprint)
CORS(app)

app.config["SECRET_KEY"] = "mysecretkey"
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+os.path.join(basedir,"data.sqlite")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'sqlalchemy'



db.init_app(app)
ma.init_app(app)

Migrate(app, db, render_as_batch=True)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)