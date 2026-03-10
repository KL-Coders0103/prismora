import os
import joblib
import pandas as pd
from insights.insight_generator import sales_insight


# Get the base directory (ml-service)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model = joblib.load(os.path.join(BASE_DIR, "models", "sales_model.pkl"))


def forecast_sales(days):

    future = model.make_future_dataframe(periods=days)

    forecast = model.predict(future)

    prediction = forecast["yhat"].iloc[-1]

    insight = sales_insight(prediction)

    return {
        "prediction": float(prediction),
        "insight": insight
    }
