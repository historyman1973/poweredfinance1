from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_bootstrap import Bootstrap
from database import db, ma
import os

app = Flask(__name__)

app.config["SECRET_KEY"] = "mysecretkey"
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
    os.path.join(basedir, "data.sqlite")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'sqlalchemy'

db.init_app(app)
ma.init_app(app)

Bootstrap(app)

Migrate(app, db, render_as_batch=True)

from routes.clients import clients_blueprint
from routes.otherassets import otherassets_blueprint
from routes.liabilities import liability_blueprint
from routes.marketdata import marketdata_blueprint
from routes.lookups import lookups_blueprint
from routes.investments import investments_blueprint
from routes.insurance import insurance_blueprint
from routes.reports import reports_blueprint
from routes.authentication import authentication_blueprint

app.register_blueprint(clients_blueprint)
app.register_blueprint(otherassets_blueprint)
app.register_blueprint(liability_blueprint)
app.register_blueprint(marketdata_blueprint)
app.register_blueprint(lookups_blueprint)
app.register_blueprint(investments_blueprint)
app.register_blueprint(insurance_blueprint)
app.register_blueprint(reports_blueprint)
app.register_blueprint(authentication_blueprint)
CORS(app)


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
