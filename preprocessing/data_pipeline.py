import pandas as pd


class DataPipeline:

    def __init__(self, path):
        self.path = path

    def load_data(self):
        df = pd.read_csv(self.path)
        return df

    def clean_data(self, df):

        # remove missing values
        df = df.dropna()

        # convert date column
        df['date'] = pd.to_datetime(df['date'])

        return df

    def feature_engineering(self, df):

        df['month'] = df['date'].dt.month
        df['day'] = df['date'].dt.day
        df['year'] = df['date'].dt.year

        return df

    def run_pipeline(self):

        df = self.load_data()
        df = self.clean_data(df)
        df = self.feature_engineering(df)

        return df