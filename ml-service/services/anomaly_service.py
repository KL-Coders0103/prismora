import os
import joblib
from insights.insight_generator import anomaly_insight

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "anomaly_model.pkl")

model = joblib.load(MODEL_PATH)


def detect_anomaly(data):

    features = [[
        data.get("price"),
        data.get("quantity"),
        data.get("revenue")
    ]]

    result = model.predict(features)[0]

    insight = anomaly_insight(result)

    return {
        "anomaly": int(result),
        "insight": insight
    }