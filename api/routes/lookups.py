from flask import Blueprint
from flask.json import jsonify
import requests
from dotenv import load_dotenv
import os


lookups_blueprint = Blueprint('lookups_blueprint', __name__, static_url_path='routes')

load_dotenv(dotenv_path="./.env.local")

ADDRESSIO_KEY = os.environ.get("ADDRESSIO_KEY", "")


@lookups_blueprint.route("/address-autocomplete/<term>", methods=["GET"])
def address_autocomplete(term):
    params = {
        'api-key': ADDRESSIO_KEY
    }
    result = requests.get("https://api.getAddress.io/autocomplete/" + term, params)

    data = result.json()

    return jsonify(data["suggestions"])