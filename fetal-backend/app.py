# app.py
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS
# CORS(app, origins=["http://localhost:3000"])

# ===========================
# Load saved models and scaler
# ===========================
scaler = joblib.load("scaler.pkl")

base_learners = {
    'SVM': joblib.load("SVM.pkl"),
    'RandomForest': joblib.load("RandomForest.pkl"),
    'XGBoost': joblib.load("XGBoost.pkl"),
    'CatBoost': joblib.load("CatBoost.pkl")
}

bnn_meta = load_model("bnn_meta_model.keras")

# ===========================
# Define the 21 features
# ===========================
FEATURES_22 = [
    'LB', 'AC', 'FM', 'UC', 'ASTV', 'MSTV', 'ALTV', 'MLTV',
    'DL', 'DS', 'DP', 'Width', 'Min', 'Max', 'Nmax',
    'Nzeros', 'Mode', 'Mean', 'Median', 'Variance', 'Tendency'
]

# ===========================
# Initialize Flask app
# ===========================
app = Flask(__name__)

@app.route('/')
def home():
    return "Fetal Health Prediction API is running!"

# ===========================
# Predict endpoint
# ===========================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        input_df = pd.DataFrame([data])

        # Ensure all features exist
        missing = [f for f in FEATURES_22 if f not in input_df.columns]
        if missing:
            return jsonify({'error': f'Missing features: {missing}'}), 400

        # Scale input features
        X_scaled = scaler.transform(input_df[FEATURES_22])

        # Generate meta-features
        meta_features_list = []
        for name, model in base_learners.items():
            try:
                probs = model.predict_proba(X_scaled)
            except Exception as e:
                return jsonify({'error': f'Base learner {name} prediction failed: {str(e)}'}), 500
            meta_features_list.append(probs)

        meta_features = np.hstack(meta_features_list)

        # Combine original + meta features
        X_meta = np.hstack([X_scaled, meta_features])

        # Predict with BNN meta-learner
        try:
            pred_probs = bnn_meta.predict(X_meta)
        except Exception as e:
            return jsonify({'error': f'BNN prediction failed: {str(e)}'}), 500

        pred_class = int(np.argmax(pred_probs, axis=1)[0])

        return jsonify({'prediction': pred_class})

    except Exception as e:
        # Print full exception for debugging
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    

# ✅ Add this ping route for testing frontend-backend connection
@app.route("/ping")
def ping():
    return jsonify({"message": "Backend is alive!"})
# ===========================
# Run Flask app
# ===========================
if __name__ == "__main__":
    app.run(debug=True)
