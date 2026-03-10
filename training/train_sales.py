import pandas as pd
from prophet import Prophet
import joblib
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

# Correct path to data folder (absolute path)
DATA_PATH = os.path.join(PROJECT_ROOT, "data", "ecommerce_data.csv")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "sales_model.pkl")

def load_data():
    """Load the e-commerce dataset"""
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Data loaded successfully! Shape: {df.shape}")
        return df
    except FileNotFoundError:
        print(f"Error: Could not find data file at {DATA_PATH}")
        raise

def train_sales_model():
    """Train the sales forecasting model using Prophet"""
    # Load data
    df = load_data()
    
    # Check if required columns exist
    if 'date' not in df.columns or 'revenue' not in df.columns:
        print("Error: Required columns 'date' and 'revenue' not found")
        print("Available columns:", df.columns.tolist())
        return None
    
    # Convert date column to datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # Group revenue by date
    daily_sales = df.groupby("date")["revenue"].sum().reset_index()
    daily_sales.columns = ["ds", "y"]
    
    print(f"Training data: {len(daily_sales)} days of sales data")
    print(f"Date range: {daily_sales['ds'].min()} to {daily_sales['ds'].max()}")
    
    # Initialize and train Prophet model
    model = Prophet(
        daily_seasonality=True,
        weekly_seasonality=True,
        yearly_seasonality=True
    )
    
    model.fit(daily_sales)
    
    # Save model
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"\nSales forecasting model saved to {MODEL_PATH}")
    
    return model

if __name__ == "__main__":
    train_sales_model()
