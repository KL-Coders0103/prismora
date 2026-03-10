import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import silhouette_score
import joblib
import os
import numpy as np

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# Correct path to data folder (absolute path)
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "ecommerce_data.csv")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "anomaly_model.pkl")

def load_data():
    """Load the e-commerce dataset"""
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Data loaded successfully! Shape: {df.shape}")
        return df
    except FileNotFoundError:
        print(f"Error: Could not find data file at {DATA_PATH}")
        raise

def train_anomaly_model():
    """Train the anomaly detection model"""
    # Load data
    df = load_data()
    
    # Features for anomaly detection
    X = df[['price', 'quantity', 'revenue']]
    
    print(f"Training set size: {len(X)}")
    
    # Train model with parameters
    model = IsolationForest(
        n_estimators=100,
        contamination=0.1,
        random_state=42
    )
    
    model.fit(X)
    
    # Predict anomalies
    predictions = model.predict(X)
    anomalies = predictions[predictions == -1]
    
    print(f"\nNumber of anomalies detected: {len(anomalies)}")
    print(f"Percentage of anomalies: {len(anomalies)/len(predictions)*100:.2f}%")
    
    # Save model
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"\nAnomaly model saved to {MODEL_PATH}")
    
    return model

if __name__ == "__main__":
    train_anomaly_model()
