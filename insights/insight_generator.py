def sales_insight(prediction):

    if prediction > 100000:
        return "Revenue expected to grow significantly next period."

    elif prediction > 50000:
        return "Sales expected to remain stable."

    else:
        return "Sales may decline. Consider marketing campaigns."


def churn_insight(prediction):

    if prediction == 1:
        return "Customer likely to churn. Retention strategy recommended."

    return "Customer likely to stay active."


def anomaly_insight(result):

    if result == -1:
        return "Anomalous transaction detected."

    return "Transaction appears normal."