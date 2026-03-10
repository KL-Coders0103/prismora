import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# Correct path to data folder (absolute path)
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "ecommerce_data.csv")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "churn_model.pkl")

def load_data():
    """Load the e-commerce dataset"""
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Data loaded successfully! Shape: {df.shape}")
        return df
    except FileNotFoundError:
        print(f"Error: Could not find data file at {DATA_PATH}")
        raise

def train_churn_model():
    """Train the customer churn prediction model"""
    # Load data
    df = load_data()
    
    # Check if 'churn' column exists
    if 'churn' not in df.columns:
        print("Error: 'churn' column not found in dataset")
        print("Available columns:", df.columns.tolist())
        return None
    
    # Features and target
    X = df[['price', 'quantity', 'revenue']]
    y = df['churn']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"\nChurn model saved to {MODEL_PATH}")
    
    return model

if __name__ == "__main__":
    train_churn_model()
