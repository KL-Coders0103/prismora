import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

# Resolve paths relative to the trainer script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

DATA_PATH = os.path.join(PROJECT_ROOT, "data", "ecommerce_data.csv")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "anomaly_model.pkl")

def load_data():
    """Loads and sanitizes dataset for anomaly detection."""
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Data file missing at {DATA_PATH}")
    
    df = pd.read_csv(DATA_PATH)
    # Drop rows with missing features to prevent model failure
    df = df.dropna(subset=["price", "quantity", "revenue"])
    return df

def train_anomaly_model(contamination=0.02):
    """
    Trains an Isolation Forest model to detect outliers in transaction data.
    Contamination: Expected proportion of outliers in the data (default 2%).
    """
    df = load_data()
    X = df[["price", "quantity", "revenue"]]

    print(f"🚀 Training Anomaly Detection Engine...")
    print(f"📊 Dataset size: {len(X)} samples")

    # Isolation Forest isolates observations by randomly selecting a feature 
    # and then randomly selecting a split value.
    model = IsolationForest(
        n_estimators=100,
        contamination=contamination,
        random_state=42,
        bootstrap=True
    )

    model.fit(X)

    # Internal verification
    predictions = model.predict(X)
    # Sklearn returns -1 for outliers and 1 for inliers
    anomalies_found = (predictions == -1).sum()
    
    print(f"✅ Training Complete.")
    print(f"🔍 Anomalies detected in training set: {anomalies_found} ({anomalies_found/len(X)*100:.2f}%)")

    # Ensure model directory exists
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    
    # Save the model
    joblib.dump(model, MODEL_PATH)
    print(f"💾 Model persisted at: {MODEL_PATH}")

    return model

if __name__ == "__main__":
    # We use a lower contamination (2%) for more realistic business anomaly detection
    train_anomaly_model(contamination=0.02)