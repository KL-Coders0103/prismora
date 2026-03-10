import os
import pandas as pd

# Get the base directory (ml-service)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "ecommerce_data.csv")


def recommend_products(product):

    df = pd.read_csv(DATA_PATH)

    category = df[df["product"] == product]["category"].values[0]

    recommendations = df[df["category"] == category]

    return recommendations["product"].unique().tolist()[:5]
