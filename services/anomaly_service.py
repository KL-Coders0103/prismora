import os
import joblib
from insights.insight_generator import anomaly_insight


# Get the base directory (ml-service)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model = joblib.load(os.path.join(BASE_DIR, "models", "anomaly_model.pkl"))


def detect_anomaly(data):

    features = [[
        data["price"],
        data["quantity"],
        data["revenue"]
    ]]

    result = model.predict(features)[0]

    insight = anomaly_insight(result)

    return {
        "anomaly": int(result),
        "insight": insight
    }
