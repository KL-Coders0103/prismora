import os
import joblib
from insights.insight_generator import churn_insight

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "churn_model.pkl")

model = joblib.load(MODEL_PATH)


def predict_churn(data):

    features = [[
        data.get("price"),
        data.get("quantity"),
        data.get("revenue")
    ]]

    prediction = model.predict(features)[0]

    insight = churn_insight(prediction)

    return {
        "prediction": int(prediction),
        "insight": insight
    }