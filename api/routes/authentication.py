from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from flask import Blueprint, request, g, jsonify
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
import time
import jwt
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="./.env.local")

SECRET_KEY = os.environ.get("SECRET_KEY", "")

token_serializer = Serializer(SECRET_KEY, expires_in=3600)

auth = HTTPBasicAuth()

authentication_blueprint = Blueprint('authentication_blueprint', __name__)

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password_hash = db.Column(db.String)
    forename = db.Column(db.String)
    surname = db.Column(db.String)

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
    

    def hash_password(self, password):
            self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self, expires_in=600):
        return jwt.encode(
            {'id': self.id, 'exp': time.time() + expires_in},
            SECRET_KEY, algorithm='HS256')

    @staticmethod
    def verify_auth_token(token):
        try:
            data = jwt.decode(token, SECRET_KEY,
                              algorithms=['HS256'])
        except:
            return
        return User.query.get(data['id'])


@authentication_blueprint.route("/add-user", methods=["POST"])
def add_user():
    
    username = request.json['username']
    password = request.json['password']
    forename = request.json['forename']
    surname = request.json['surname']

    password_hash = generate_password_hash(password)

    new_user = User(
        username=username,
        password_hash=password_hash,
        forename=forename,
        surname=surname
    )

    db.session.add(new_user)
    db.session.commit()

    return "User added", 201


@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # # try to authenticate with username/password
        # user = User.query.filter_by(username=username_or_token).first()
        # if not user or not user.verify_password(password):
        #     return False
        return False    
    g.user = user
    print(g.user)
    return True


@authentication_blueprint.route('/get-token')
@auth.login_required
def get_token():
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token, 'duration': 600})


@authentication_blueprint.route("/testlogin", methods=["POST"])
@auth.login_required
def test_login():
    print(auth.current_user())
    return "Success", 200