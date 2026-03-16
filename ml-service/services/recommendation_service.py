import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.path.join(BASE_DIR, "data", "ecommerce_data.csv")


def recommend_products(product):

    df = pd.read_csv(DATA_PATH)

    product_row = df[df["product"] == product]

    if product_row.empty:
        return []

    category = product_row["category"].values[0]

    recommendations = df[df["category"] == category]

    return recommendations["product"].unique().tolist()[:5]