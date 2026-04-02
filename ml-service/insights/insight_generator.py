def sales_insight(prediction):
    """
    Translates Prophet forecast values into business trends.
    """
    try:
        val = float(prediction)
        
        if val >= 150000:
            return "Exceptional growth trend detected. Ensure inventory levels can meet high demand."
        elif val >= 80000:
            return "Strong revenue performance expected. Market conditions remain favorable."
        elif val >= 40000:
            return "Sales volume is stabilizing. Focus on maintaining current customer conversion rates."
        else:
            return "Potential sales contraction detected. We recommend launching a targeted promotion or discount campaign."
    except (ValueError, TypeError):
        return "Insufficient data to generate a reliable sales insight."


def churn_insight(prediction, probability=None):
    """
    Translates Random Forest churn predictions into retention strategies.
    """
    is_churn = int(prediction) == 1
    
    if is_churn:
        # If we have a high probability, increase the urgency
        if probability and probability > 0.8:
            return "CRITICAL: High churn risk detected. Immediate retention intervention required."
        return "Moderate churn risk. We recommend sending a re-engagement email or loyalty offer."
    
    if probability and probability > 0.4:
        return "Customer behavior is shifting. Monitor closely for signs of declining engagement."
    
    return "Customer behavior remains healthy. Engagement levels are within normal parameters."


def anomaly_insight(result):
    """
    Translates Isolation Forest results into security/operational alerts.
    Note: Standardized to 1 for Anomaly, 0 for Normal.
    """
    try:
        status = int(result)
        
        if status == 1:
            return "🚨 ANOMALY DETECTED: This transaction deviates significantly from historical patterns. Manual review recommended."
        
        return "Transaction behavior is consistent with standard operational benchmarks."
    except (ValueError, TypeError):
        return "Anomaly detection engine could not verify this transaction."