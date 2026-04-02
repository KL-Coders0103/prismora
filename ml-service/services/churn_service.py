import os
import joblib
import numpy as np
import logging
from insights.insight_generator import churn_insight

# Configure logging
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "churn_model.pkl")

# Load model into memory at startup
try:
    model = joblib.load(MODEL_PATH)
    logger.info("✅ Churn Prediction model loaded successfully.")
except Exception as e:
    logger.error(f"❌ Failed to load Churn model: {e}")
    model = None

def predict_churn(data):
    """
    Predicts if a customer is likely to churn based on transaction behavior.
    Expects: price, quantity, revenue
    """
    if model is None:
        return {"error": "Model not initialized", "prediction": 0, "insight": "Service unavailable."}

    try:
        # 1. Clean and Sanitize Input Features
        # We use .get() with a default of 0.0 and force float conversion
        price = float(data.get("price", 0) or 0)
        quantity = float(data.get("quantity", 0) or 0)
        revenue = float(data.get("revenue", 0) or 0)

        # 2. Vectorize for Sklearn
        features = np.array([[price, quantity, revenue]])

        # 3. Model Inference
        # prediction: 1 (churn), 0 (stay)
        prediction = int(model.predict(features)[0])
        
        # Optional: Get confidence score if model supports it
        probability = None
        if hasattr(model, "predict_proba"):
            # Probability of class 1 (churn)
            probability = float(model.predict_proba(features)[0][1])

        # 4. Generate Business Insight
        # Pass the probability if available for more nuanced insights
        insight = churn_insight(prediction, probability)

        return {
            "prediction": prediction,
            "confidence": round(probability, 4) if probability is not None else 0.75,
            "insight": insight
        }

    except (ValueError, TypeError) as e:
        logger.warning(f"⚠️ Invalid data types sent to Churn Service: {e}")
        return {
            "prediction": 0,
            "insight": "Prediction failed due to invalid numeric input format."
        }
    except Exception as e:
        logger.error(f"❌ Unexpected error in Churn Inference: {e}")
        return {
            "prediction": 0,
            "insight": "An internal error occurred during churn analysis."
        }