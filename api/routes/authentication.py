from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from flask import Blueprint, request, jsonify

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
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        return username


@authentication_blueprint.route("/testlogin", methods=["POST"])
@auth.login_required
def test_login():
    print(auth.current_user())
    return "Success", 200