def sales_insight(prediction):

    if prediction >= 100000:
        return "Strong revenue growth expected."

    elif prediction >= 50000:
        return "Sales expected to stay stable."

    return "Potential sales decline detected. Consider marketing campaigns."


def churn_insight(prediction):

    if int(prediction) == 1:
        return "Customer likely to churn. Start retention campaign."

    return "Customer expected to remain active."


def anomaly_insight(result):

    if int(result) == -1:
        return "Anomaly detected in transaction."

    return "Transaction behavior normal."