from flask_login import login_user, logout_user, login_required, UserMixin, current_user
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

authentication_blueprint = Blueprint('authentication_blueprint', __name__)

class User(UserMixin, db.Model):
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


@authentication_blueprint.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']

    user = User.query.filter_by(username=username).first()

    if user:
        user.verify_password(password)
        login_user(user)

    return "You are logged in, " + current_user.username.title(), 200


@authentication_blueprint.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()

    return "Logged out", 200


@authentication_blueprint.route("/testlogin", methods=["GET"])
@login_required
def test_login():
    print(current_user.username)
    return "Welcome " + current_user.username.title(), 200