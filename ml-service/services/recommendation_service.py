import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "ecommerce_data.csv")

# SINGLETON: Load data into memory once on startup
try:
    df_global = pd.read_csv(DATA_PATH)
    # Clean column names just in case
    df_global.columns = df_global.columns.str.strip().str.lower()
except Exception as e:
    print(f"CRITICAL: Failed to load recommendation dataset: {e}")
    df_global = pd.DataFrame()

def recommend_products(product_name):
    if df_global.empty:
        return []

    product_name = str(product_name).strip()
    
    # Find the target product
    product_row = df_global[df_global["product"] == product_name]

    if product_row.empty:
        return []

    target_category = product_row["category"].values[0]

    # Filter by category, exclude the current product, and get top 5 unique results
    recommendations = df_global[
        (df_global["category"] == target_category) & 
        (df_global["product"] != product_name)
    ]

    return recommendations["product"].unique().tolist()[:5]