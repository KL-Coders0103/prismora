import os
import joblib
from insights.insight_generator import churn_insight


# Get the base directory (ml-service)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model = joblib.load(os.path.join(BASE_DIR, "models", "churn_model.pkl"))


def predict_churn(data):

    features = [[
        data["price"],
        data["quantity"],
        data["revenue"]
    ]]

    prediction = model.predict(features)[0]

    insight = churn_insight(prediction)

    return {
        "prediction": int(prediction),
        "insight": insight
    }
