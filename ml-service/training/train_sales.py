import pandas as pd
from prophet import Prophet
import joblib
import os


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

DATA_PATH = os.path.join(PROJECT_ROOT, "data", "ecommerce_data.csv")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "sales_model.pkl")


def load_data():

    df = pd.read_csv(DATA_PATH)

    df["date"] = pd.to_datetime(df["date"])

    return df


def train_sales_model():

    df = load_data()

    if "date" not in df.columns or "revenue" not in df.columns:
        raise Exception("Dataset must contain date and revenue columns")

    daily_sales = df.groupby("date")["revenue"].sum().reset_index()

    daily_sales.columns = ["ds", "y"]

    model = Prophet(
        growth="linear",
        daily_seasonality=True,
        weekly_seasonality=True,
        yearly_seasonality=True
    )

    model.fit(daily_sales)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    print("Sales forecasting model trained and saved.")

    return model


if __name__ == "__main__":

    train_sales_model()