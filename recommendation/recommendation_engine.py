import pandas as pd


def recommend_products(product):

    df = pd.read_csv("../data/ecommerce_data.csv")

    category = df[df['product'] == product]['category'].values[0]

    recommendations = df[df['category'] == category]

    return recommendations['product'].unique().tolist()[:5]