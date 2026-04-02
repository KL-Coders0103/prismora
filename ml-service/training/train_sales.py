import pandas as pd
from prophet import Prophet
import joblib
import os
import logging

# Setup Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "ecommerce_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "sales_model.pkl")

def train_sales_model():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Training data not found at {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    df["date"] = pd.to_datetime(df["date"])

    # Aggregate to daily revenue
    daily_sales = df.groupby("date")["revenue"].sum().reset_index()
    daily_sales.columns = ["ds", "y"]

    # Initialize Prophet with robust seasonality
    model = Prophet(
        growth="linear",
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False # Set to false for daily aggregated data
    )
    
    print("🚀 Training Sales Forecast Model (Prophet)...")
    model.fit(daily_sales)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"✅ Sales model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_sales_model()