import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import os
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "ecommerce_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "models", "churn_model.pkl")

def train_churn_model():
    df = pd.read_csv(DATA_PATH)

    # Heuristic: Churn 1 if revenue and quantity are below median
    df["churn"] = np.where(
        (df["revenue"] < df["revenue"].median()) & 
        (df["quantity"] < df["quantity"].median()), 
        1, 0
    )

    X = df[["price", "quantity", "revenue"]]
    y = df["churn"]

    # Stratified split ensures equal churn representation in train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    # Log performance
    print("📊 Churn Model Report:")
    print(classification_report(y_test, model.predict(X_test)))

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"✅ Churn model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_churn_model()