import sys
import os

# Add current directory to path so we can import services, insights, api, etc.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from api.routes import routes


def create_app():

    app = Flask(__name__)

    app.register_blueprint(routes)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(port=5001, debug=True)

