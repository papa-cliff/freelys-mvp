#!/env/bin/python3
# -*- coding: utf-8 -*-
import sqlite3

# Created by cliff at 7/18/23 1:22 PM

import os
import time
from datetime import timedelta, datetime

from webapp.models.source import Source

try:
    from flask import Flask, Response, request, jsonify
except ImportError:
    print("Flask not installed. Please run \'pip install -f requirements.txt\' in app directory")
    exit(1)



try:
    from flask_jwt_extended import create_access_token
    from flask_jwt_extended import get_jti
    from flask_jwt_extended import get_jwt_identity
    from flask_jwt_extended import jwt_required
    from flask_jwt_extended import JWTManager
except ImportError:
    print("Flask-jwt-extended not installed. Please run \'pip install -f requirements.txt\' in app directory")
    exit(1)



try:
    from flask_sqlalchemy import SQLAlchemy
except ImportError:
    print("Flask sqlAlchemy not installed. Please run \'pip install -f requirements.txt\' in app directory")
    exit(1)


try:
    from flask_cors import CORS
except ImportError:
    print("Flask-cors not installed. Please run \'pip install -f requirements.txt\' in app directory")
    exit(1)



app = Flask("Freelys Rest server")

app.config["JWT_SECRET_KEY"] = "ofeeY3aeNg0yo6UChiemaenah8ahpeij"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt = JWTManager(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///base.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
CORS(app)



class User(db.Model):
    __tablename__ = "user_account"
    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(250), unique=True, index=True)
    password      = db.Column(db.String(250), nullable=False)
    token         = db.Column(db.String(36), index=True)
    token_created = db.Column(db.DateTime)


def get_file(filename):  # pragma: no cover
    try:
        src = os.path.join(root_dir(), filename)
        return open(src).read()
    except IOError as exc:
        return str(exc)


def root_dir():  # pragma: no cover
    return os.path.abspath(os.path.dirname(__file__)) + "/freelys-fe/build"

@app.get('/')
def getRoot():
    return serveStatic("index.html")


@app.get('/<path:path>')
def serveStatic(path):
    mimetypes = {
        ".css": "text/css",
        ".html": "text/html",
        ".js": "application/javascript",
    }
    complete_path = os.path.join(root_dir(), path)
    ext = os.path.splitext(path)[1]
    mimetype = mimetypes.get(ext, "text/html")
    content = get_file(complete_path)
    return Response(content, mimetype=mimetype)


@app.post("/api/auth/login")
def doLogin():
    username = request.json["username"]
    password = request.json["password"]


    if not username or not password:
        return jsonify({"result": "ERROR", "msg": "Invalid credentials"}), 401

    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        token = create_access_token(identity=username)
        user.token = get_jti(token)
        user.token_created = datetime.now()
        db.session.commit()
        return jsonify({"user": username, "access_token": token}), 200
    else:
        return jsonify({"msg": "Invalid credentials"}), 401


@app.post("/api/auth/verify")
@jwt_required()
def verifyUser():
    current_user = get_jwt_identity()
    return jsonify({"username": current_user})


@app.post("/api/auth/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    #TODO: update jti in database
    return jsonify(access_token=access_token)


@jwt.token_in_blocklist_loader
def checkTokenValidity(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    user = User.query.filter_by(token=jti).first()
    return not user.token  \
        or not user.token_created + timedelta(hours=24) > datetime.now()


def create_admin():
    admin = User(username="admin", password="P@ssw0rd")
    db.session.add(admin)


def migrate_data():
    with app.app_context():
        source = Source(app, db)

        db.drop_all()
        db.create_all()

        create_admin()
        source.createSampleSource()

        db.session.commit()

def start():
    source = Source(app, db)

    app.run(
        host = "0.0.0.0",
        port = 8000,
        debug= True,
        threaded = True
    )

