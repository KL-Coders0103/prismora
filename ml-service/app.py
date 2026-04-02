import sys
import os
from flask import Flask, jsonify
from flask_cors import CORS

# Ensure internal modules are discoverable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api.routes import routes

def create_app():
    app = Flask(__name__)
    
    # SECURITY: Match the CORS policy of our Node.js Gateway
    # Only allow the Node.js backend to talk to the ML service in production
    CORS(app, resources={r"/*": {"origins": "*"}}) 

    # Optimization: Prevent Flask from alphabetical sorting of JSON keys
    # Essential for maintaining Time-Series order in Forecasts
    app.config['JSON_SORT_KEYS'] = False

    # Register ML Model Routes
    app.register_blueprint(routes, url_prefix='/api')

    @app.route("/health", methods=['GET'])
    def health():
        """Health check for the Node.js gateway and Monitoring tools"""
        return jsonify({
            "status": "online",
            "service": "PRISMORA_ML_ENGINE",
            "version": "1.0.0"
        }), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "ML endpoint not found"}), 404

    return app

app = create_app()

if __name__ == "__main__":
    # In production, this would be served by Gunicorn
    # Threaded=True allows handling multiple ML inference requests
    app.run(host="0.0.0.0", port=5001, debug=True, threaded=True)