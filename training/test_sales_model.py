import joblib
import pandas as pd
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# Correct path to model folder (absolute path)
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "sales_model.pkl")

def test_sales_model():
    """Test the sales forecasting model"""
    # Load the trained model
    try:
        model = joblib.load(MODEL_PATH)
        print(f"Model loaded successfully from: {MODEL_PATH}")
    except FileNotFoundError:
        print(f"Error: Could not find model file at {MODEL_PATH}")
        print("Please run train_sales.py first to train the model.")
        return None
    
    # Create future dataframe for predictions
    future = model.make_future_dataframe(periods=30)
    
    # Make predictions
    forecast = model.predict(future)
    
    # Display the forecast for next 30 days
    print("\nSales Forecast for next 30 days:")
    print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(30))
    
    return forecast

if __name__ == "__main__":
    test_sales_model()
