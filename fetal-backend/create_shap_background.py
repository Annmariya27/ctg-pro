import pandas as pd
import numpy as np
import joblib
import shap
import os

print("Starting background data creation...")

# ===========================
# Configuration
# ===========================
TRAINING_DATA_PATH = "CTG.xlsx"  # IMPORTANT: Update with the actual path to your training CSV
N_SAMPLES = 100  # Number of summary data points to create
OUTPUT_PATH = "shap_background.joblib"

# ===========================
# Load Models and Data
# ===========================
print(f"Loading training data from {TRAINING_DATA_PATH}...")
# Use pd.read_excel for .xlsx files.
# The CTG.xlsx dataset often has data on a specific sheet and may have header/footer rows to skip.
# We'll target the 'Data' sheet and skip the first row.
df = pd.read_excel(TRAINING_DATA_PATH, sheet_name='Data', header=1)

# Define the exact 21 features the model was trained on
FEATURES_21 = [
    'LB', 'AC', 'FM', 'UC', 'ASTV', 'MSTV', 'ALTV', 'MLTV',
    'DL', 'DS', 'DP', 'Width', 'Min', 'Max', 'Nmax',
    'Nzeros', 'Mode', 'Mean', 'Median', 'Variance', 'Tendency'
]

# Select only the required feature columns from the DataFrame.
# This ensures the column names and order match what the scaler expects.
# We also drop any rows with missing values in these columns and create a clean DataFrame.
X_train = df[FEATURES_21].dropna()

print("Loading scaler and base learners...")
# Add a check to ensure the scaler is loaded correctly
assert 'scaler.pkl' in os.listdir('.'), "scaler.pkl not found. Make sure it's in the fetal-backend directory."
scaler = joblib.load("scaler.pkl")
base_learners = {
    'SVM': joblib.load("SVM.pkl"),
    'RandomForest': joblib.load("RandomForest.pkl"),
    'XGBoost': joblib.load("XGBoost.pkl"),
    'CatBoost': joblib.load("CatBoost.pkl")
}

# ===========================
# Preprocess and Create Meta-Features
# ===========================
print("Preprocessing data and creating meta-features...")
X_train_scaled = scaler.transform(X_train)

meta_features_list = [model.predict_proba(X_train_scaled) for model in base_learners.values()]
meta_features_train = np.hstack(meta_features_list)

X_meta_train = np.hstack([X_train_scaled, meta_features_train])

print(f"Summarizing data into {N_SAMPLES} samples using k-means...")
background_data = shap.kmeans(X_meta_train, N_SAMPLES)

print(f"Saving background data to {OUTPUT_PATH}...")
joblib.dump(background_data, OUTPUT_PATH)

print("Background data created successfully!")