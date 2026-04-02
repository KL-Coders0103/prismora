import os
import joblib
import numpy as np
from insights.insight_generator import anomaly_insight

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "anomaly_model.pkl")

model = joblib.load(MODEL_PATH)

def detect_anomaly(data):
    try:
        # Robust feature extraction with fallbacks to 0.0
        features = np.array([[
            float(data.get("price", 0) or 0),
            float(data.get("quantity", 0) or 0),
            float(data.get("revenue", 0) or 0)
        ]])

        # IsolationForest: -1 is anomaly, 1 is normal
        result = model.predict(features)[0]
        
        # Standardize: 1 for anomaly, 0 for normal for frontend logic
        is_anomaly = 1 if result == -1 else 0
        
        insight = anomaly_insight(is_anomaly)

        return {
            "anomaly": is_anomaly,
            "score": float(model.decision_function(features)[0]),
            "insight": insight
        }
    except Exception as e:
        return {"anomaly": 0, "insight": f"Analysis failed: {str(e)}"}