import os
import joblib
from insights.insight_generator import sales_insight

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "sales_model.pkl")

model = joblib.load(MODEL_PATH)


def forecast_sales(days):

    future = model.make_future_dataframe(periods=days)

    forecast = model.predict(future)

    prediction = forecast["yhat"].iloc[-1]

    insight = sales_insight(prediction)

    return {
        "prediction": float(prediction),
        "insight": insight
    }