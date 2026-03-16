from flask import Blueprint, request, jsonify

from services.sales_service import forecast_sales
from services.churn_service import predict_churn
from services.anomaly_service import detect_anomaly
from services.recommendation_service import recommend_products

routes = Blueprint("routes", __name__)


@routes.route("/forecast-sales", methods=["POST"])
def sales_forecast():
    try:
        data = request.get_json(force=True)
        days = data.get("days", 30)

        result = forecast_sales(days)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@routes.route("/predict-churn", methods=["POST"])
def churn():
    try:
        data = request.get_json(force=True)

        result = predict_churn(data)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@routes.route("/detect-anomaly", methods=["POST"])
def anomaly():
    try:
        data = request.get_json(force=True)

        result = detect_anomaly(data)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@routes.route("/recommend-products", methods=["POST"])
def recommend():
    try:
        data = request.get_json(force=True)

        product = data.get("product")

        result = recommend_products(product)

        return jsonify({
            "recommendations": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500