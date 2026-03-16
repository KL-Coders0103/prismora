import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

DATA_PATH = os.path.join(PROJECT_ROOT, "data", "ecommerce_data.csv")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "anomaly_model.pkl")


def load_data():

    df = pd.read_csv(DATA_PATH)

    df = df.dropna()

    return df


def train_anomaly_model():

    df = load_data()

    X = df[["price", "quantity", "revenue"]]

    print("Training samples:", len(X))

    model = IsolationForest(
        n_estimators=100,
        contamination=0.1,
        random_state=42
    )

    model.fit(X)

    predictions = model.predict(X)

    anomalies = (predictions == -1).sum()

    print("Anomalies detected:", anomalies)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    print("Anomaly model saved.")

    return model


if __name__ == "__main__":

    train_anomaly_model()