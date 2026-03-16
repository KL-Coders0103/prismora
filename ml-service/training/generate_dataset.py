import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

DATA_PATH = os.path.join(PROJECT_ROOT, "data", "ecommerce_data.csv")


def generate_dataset(num_rows=2000):

    rows = []

    products = ["Laptop", "Mouse", "Keyboard", "Shoes", "Phone", "Headphones"]

    categories = {
        "Laptop": "Electronics",
        "Mouse": "Electronics",
        "Keyboard": "Electronics",
        "Phone": "Electronics",
        "Headphones": "Electronics",
        "Shoes": "Fashion"
    }

    regions = ["North", "South", "East", "West"]

    start = datetime(2023, 1, 1)

    for i in range(num_rows):

        date = start + timedelta(days=i % 365)

        product = random.choice(products)

        if product == "Laptop":
            price = random.randint(50000, 150000)

        elif product == "Phone":
            price = random.randint(10000, 80000)

        elif product == "Shoes":
            price = random.randint(500, 5000)

        else:
            price = random.randint(200, 5000)

        quantity = random.randint(1, 5)

        revenue = price * quantity

        churn = random.choice([0, 1])

        rows.append([
            date,
            random.randint(100, 500),
            product,
            categories[product],
            price,
            quantity,
            revenue,
            random.choice(regions),
            churn
        ])

    df = pd.DataFrame(rows, columns=[
        "date", "customer_id", "product", "category",
        "price", "quantity", "revenue", "region", "churn"
    ])

    df = df.sort_values("date").reset_index(drop=True)

    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)

    df.to_csv(DATA_PATH, index=False)

    print("Dataset generated successfully")

    print("Records:", len(df))

    print("Saved at:", DATA_PATH)

    return df


if __name__ == "__main__":

    generate_dataset()