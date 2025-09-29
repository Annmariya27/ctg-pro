from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
from flask_cors import CORS
import shap
import os

# ===========================
# Initialize Flask app
# ===========================
app = Flask(__name__)
CORS(app)  # Enable CORS for all origins (safe in dev)

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

# --- Improved File Loading ---
# Load the SHAP background data created by the one-time script
SHAP_BACKGROUND_PATH = "shap_background.joblib"
if not os.path.exists(SHAP_BACKGROUND_PATH):
    raise FileNotFoundError(
        f"Error: The SHAP background file '{SHAP_BACKGROUND_PATH}' was not found. "
        "Please run the 'create_shap_background.py' script first to generate it."
    )
shap_background = joblib.load(SHAP_BACKGROUND_PATH)

# ===========================
# Define the 22 features
# ===========================
FEATURES_21 = [
    'LB', 'AC', 'FM', 'UC', 'ASTV', 'MSTV', 'ALTV', 'MLTV',
    'DL', 'DS', 'DP', 'Width', 'Min', 'Max', 'Nmax',
    'Nzeros', 'Mode', 'Mean', 'Median', 'Variance', 'Tendency'
]

# ===========================
# Routes
# ===========================
@app.route('/')
def home():
    return "Fetal Health Prediction API is running!"

# ✅ Updated route with /api prefix
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        json_data = request.get_json()
        if not json_data or 'features' not in json_data:
            return jsonify({'error': 'Missing "features" key in request body'}), 400

        features = json_data['features']
        if not isinstance(features, list) or len(features) != len(FEATURES_21):
            return jsonify({'error': f'Expected a list of {len(FEATURES_21)} feature values'}), 400

        # Create a DataFrame from the feature array
        input_df = pd.DataFrame([features], columns=FEATURES_21)

        # Scale input features
        X_scaled = scaler.transform(input_df[FEATURES_21])

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
        pred_probs = bnn_meta.predict(X_meta)
        pred_class_index = int(np.argmax(pred_probs, axis=1)[0])
        pred_probability = float(np.max(pred_probs))

        # ===========================
        # SHAP Value Calculation
        # ===========================
        # Initialize the explainer with the pre-calculated background data summary
        explainer = shap.KernelExplainer(bnn_meta.predict, shap_background)
        shap_values = explainer.shap_values(X_meta, nsamples=50) # nsamples=50 for performance

        # Get feature names (original + base learner predictions)
        base_learner_names = [f"{name}_p{i}" for name in base_learners.keys() for i in range(3)]
        all_feature_names = FEATURES_21 + base_learner_names

        # For a single-output model, shap_values is a single array, not a list of arrays.
        # We take the absolute values from the first (and only) sample's explanation.
        # The shape of shap_values is (num_samples, num_features).
        mean_abs_shap = np.abs(shap_values[0]).flatten().tolist()
        shap_data = [{'feature': name, 'value': val} for name, val in zip(all_feature_names, mean_abs_shap)]

        return jsonify({
            'class_index': pred_class_index + 1,  # 1=Normal, 2=Suspect, 3=Pathological
            'probability': pred_probability,
            'shap_values': shap_data # Add SHAP data to the response
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ✅ Test endpoint with /api prefix
@app.route("/api/ping")
def ping():
    return jsonify({"message": "Backend is alive!"})

# ===========================
# Run Flask app
# ===========================
if __name__ == "__main__":
    app.run(debug=True)
