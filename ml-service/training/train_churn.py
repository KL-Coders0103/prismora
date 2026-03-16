import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

DATA_PATH = os.path.join(PROJECT_ROOT, "data", "ecommerce_data.csv")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "churn_model.pkl")


def load_data():

    df = pd.read_csv(DATA_PATH)

    return df


def generate_churn(df):

    df["churn"] = np.where(
        (df["revenue"] < df["revenue"].median()) &
        (df["quantity"] < df["quantity"].median()),
        1,
        0
    )

    return df


def train_churn_model():

    df = load_data()

    df = generate_churn(df)

    X = df[["price", "quantity", "revenue"]]

    y = df["churn"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42
    )

    model.fit(X_train, y_train)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

    joblib.dump(model, MODEL_PATH)

    print("Churn model trained and saved.")

    return model


if __name__ == "__main__":

    train_churn_model()