from flask import Blueprint, request, jsonify

from services.sales_service import forecast_sales
from services.churn_service import predict_churn
from services.anomaly_service import detect_anomaly
from services.recommendation_service import recommend_products

routes = Blueprint("routes", __name__)


@routes.route("/forecast-sales", methods=["POST"])
def sales_forecast():

    data = request.json

    days = data.get("days", 30)

    result = forecast_sales(days)

    return jsonify(result)


@routes.route("/predict-churn", methods=["POST"])
def churn():

    data = request.json

    result = predict_churn(data)

    return jsonify(result)


@routes.route("/detect-anomaly", methods=["POST"])
def anomaly():

    data = request.json

    result = detect_anomaly(data)

    return jsonify(result)


@routes.route("/recommend-products", methods=["POST"])
def recommend():

    product = request.json["product"]

    result = recommend_products(product)

    return jsonify({
        "recommendations": result
    })