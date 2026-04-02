from flask import Blueprint, request, jsonify
import logging

# Import services
from services.sales_service import forecast_sales
from services.churn_service import predict_churn
from services.anomaly_service import detect_anomaly
from services.recommendation_service import recommend_products

# Configure logging for ML monitoring
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Note: No 'api' prefix here because it's handled by url_prefix in app.py
routes = Blueprint("routes", __name__)

@routes.route("/forecast-sales", methods=["POST"])
def sales_forecast():
    try:
        data = request.get_json(silent=True) or {}
        # Ensure 'days' is a valid integer between 1 and 365
        days = data.get("days", 30)
        
        try:
            days = int(days)
            if days <= 0 or days > 365:
                raise ValueError
        except ValueError:
            return jsonify({"error": "Invalid range for forecast days (1-365)"}), 400

        logger.info(f"🔮 Generating forecast for {days} days")
        result = forecast_sales(days)
        return jsonify(result)

    except Exception as e:
        logger.error(f"❌ Forecast Error: {str(e)}")
        return jsonify({"error": "Inference failed for sales forecasting model"}), 500


@routes.route("/predict-churn", methods=["POST"])
def churn():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Missing input data for churn prediction"}), 400

        result = predict_churn(data)
        return jsonify(result)

    except Exception as e:
        logger.error(f"❌ Churn Error: {str(e)}")
        return jsonify({"error": "Churn prediction model encountered an error"}), 500


@routes.route("/detect-anomaly", methods=["POST"])
def anomaly():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "No transaction data provided"}), 400

        result = detect_anomaly(data)
        return jsonify(result)

    except Exception as e:
        logger.error(f"❌ Anomaly Error: {str(e)}")
        return jsonify({"error": "Anomaly detection engine failure"}), 500


@routes.route("/recommend-products", methods=["POST"])
def recommend():
    try:
        data = request.get_json(silent=True) or {}
        product = data.get("product")

        if not product:
            return jsonify({"error": "Product name is required for recommendations"}), 400

        result = recommend_products(product)
        
        # Consistent response wrapper
        return jsonify({
            "status": "success",
            "recommendations": result
        })

    except Exception as e:
        logger.error(f"❌ Recommendation Error: {str(e)}")
        return jsonify({"error": "Recommendation engine timed out"}), 500