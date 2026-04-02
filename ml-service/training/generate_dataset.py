import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "ecommerce_data.csv")

def generate_dataset(num_rows=3000):
    products = {
        "Laptop": {"cat": "Electronics", "price": (50000, 150000)},
        "Phone": {"cat": "Electronics", "price": (15000, 80000)},
        "Headphones": {"cat": "Electronics", "price": (2000, 15000)},
        "Shoes": {"cat": "Fashion", "price": (1000, 8000)},
        "Watch": {"cat": "Fashion", "price": (2000, 20000)}
    }
    regions = ["North", "South", "East", "West"]
    
    rows = []
    start_date = datetime(2024, 1, 1)

    for i in range(num_rows):
        # Create a time-series trend (slight increase over time)
        date = start_date + timedelta(days=random.randint(0, 730))
        prod_name = random.choice(list(products.keys()))
        
        price = random.randint(*products[prod_name]["price"])
        quantity = random.randint(1, 10)
        
        rows.append({
            "date": date.strftime('%Y-%m-%d'),
            "product": prod_name,
            "category": products[prod_name]["cat"],
            "price": price,
            "quantity": quantity,
            "revenue": price * quantity,
            "region": random.choice(regions)
        })

    df = pd.DataFrame(rows).sort_values("date")
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    df.to_csv(DATA_PATH, index=False)
    print(f"✅ Synthetic Dataset generated with {len(df)} records at {DATA_PATH}")

if __name__ == "__main__":
    generate_dataset()