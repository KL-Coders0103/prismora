import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS
from api.routes import routes


def create_app():

    app = Flask(__name__)

    CORS(app)

    app.register_blueprint(routes)

    @app.route("/health")
    def health():
        return {"status":"ML service running"}

    return app


app = create_app()


if __name__ == "__main__":
    app.run(port=5001, debug=True)