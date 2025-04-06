from app.routes import userApp, favApp, bApp
from flask import Flask
from flask_cors import CORS


def create_app() -> Flask:
    app = Flask(__name__)
    app.register_blueprint(userApp)
    app.register_blueprint(favApp)
    app.register_blueprint(bApp)
    CORS(app, supports_credentials=True)
    return app
