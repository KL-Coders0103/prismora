import os
import joblib
import pandas as pd
from insights.insight_generator import sales_insight

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "sales_model.pkl")

# Lazy load model
model = None

def get_model():
    global model
    if model is None:
        model = joblib.load(MODEL_PATH)
    return model

def forecast_sales(days):
    m = get_model()
    # periods=days, freq='D' (Daily)
    future = m.make_future_dataframe(periods=int(days))
    forecast = m.predict(future)

    # Extract only the newly predicted rows
    predictions = forecast.tail(int(days))
    
    # Get the final point for the summary card
    latest_prediction = predictions["yhat"].iloc[-1]
    
    # Generate human-readable insight
    insight = sales_insight(latest_prediction)

    return {
        "prediction": round(float(latest_prediction), 2),
        "forecast_data": predictions[['ds', 'yhat']].rename(columns={'ds': 'date', 'yhat': 'value'}).to_dict('records'),
        "insight": insight
    }