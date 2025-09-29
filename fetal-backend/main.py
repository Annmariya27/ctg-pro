# main.py
import os
import numpy as np
import pandas as pd
from collections import Counter

from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import balanced_accuracy_score
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from catboost import CatBoostClassifier
from imblearn.over_sampling import SMOTE
import joblib

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout

# ===========================
# Load dataset
# ===========================
DATA_FILE_PATH = 'CTG.xlsx'  # change path accordingly
df = pd.read_excel(DATA_FILE_PATH, sheet_name=2, skipfooter=3, engine='openpyxl')

# Clean column names
df.columns = df.columns.str.strip()          # remove leading/trailing spaces
df.columns = df.columns.str.replace('\n','') # remove newlines
df.columns = df.columns.str.replace('\r','') # remove carriage returns

# Check columns
print("Columns in dataset:", df.columns.tolist())

df.dropna(axis=0, thresh=10, inplace=True)

# ===========================
# Use only the 21 required features
# ===========================
FEATURES_21 = [
    'LB', 'AC', 'FM', 'UC', 'ASTV', 'MSTV', 'ALTV', 'MLTV',
    'DL', 'DS', 'DP', 'Width', 'Min', 'Max', 'Nmax',
    'Nzeros', 'Mode', 'Mean', 'Median', 'Variance', 'Tendency'
]

# Make sure all features exist in the dataset
missing_features = [f for f in FEATURES_22 if f not in df.columns]
if missing_features:
    raise KeyError(f"The following features are missing from the dataset: {missing_features}")

TARGET_COLUMN = 'NSP'
X = df[FEATURES_22]
y = df[TARGET_COLUMN].map({1.0: 0, 2.0: 1, 3.0: 2})

# ===========================
# Train/test split & scaling
# ===========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, stratify=y, random_state=42
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save scaler
joblib.dump(scaler, "scaler.pkl")

# ===========================
# Base learners
# ===========================
base_learners = {
    'SVM': SVC(probability=True, kernel='rbf', random_state=42),
    'RandomForest': RandomForestClassifier(n_estimators=500, random_state=42),
    'XGBoost': XGBClassifier(n_estimators=500, max_depth=6, learning_rate=0.05, use_label_encoder=False, eval_metric='mlogloss', random_state=42),
    'CatBoost': CatBoostClassifier(iterations=500, depth=6, learning_rate=0.05, verbose=0, random_state=42)
}

# ===========================
# Generate meta-features
# ===========================
N_CLASSES = 3
n_folds = 5
skf = StratifiedKFold(n_splits=n_folds, shuffle=True, random_state=42)

meta_train = np.zeros((X_train.shape[0], len(base_learners) * N_CLASSES))
meta_test = np.zeros((X_test.shape[0], len(base_learners) * N_CLASSES))

for i, (name, model) in enumerate(base_learners.items()):
    test_fold_preds = []
    for train_idx, val_idx in skf.split(X_train_scaled, y_train):
        X_tr, y_tr = X_train_scaled[train_idx], y_train.iloc[train_idx]
        X_val = X_train_scaled[val_idx]

        # Oversampling
        X_tr_res, y_tr_res = SMOTE(random_state=42).fit_resample(X_tr, y_tr)
        model.fit(X_tr_res, y_tr_res)

        meta_train[val_idx, i*N_CLASSES:(i+1)*N_CLASSES] = model.predict_proba(X_val)
        test_fold_preds.append(model.predict_proba(X_test_scaled))

    meta_test[:, i*N_CLASSES:(i+1)*N_CLASSES] = np.mean(test_fold_preds, axis=0)

# Save base learners
for name, model in base_learners.items():
    joblib.dump(model, f"{name}.pkl")

# ===========================
# Combine meta + original features
# ===========================
X_train_meta = np.hstack([X_train_scaled, meta_train])
X_test_meta = np.hstack([X_test_scaled, meta_test])
input_dim = X_train_meta.shape[1]

# ===========================
# Build BNN meta-learner
# ===========================
def build_mc_dropout_bnn(input_dim, n_classes, dropout_rate=0.3):
    model = Sequential([
        Dense(64, activation='relu', input_shape=(input_dim,)),
        Dropout(dropout_rate),
        Dense(32, activation='relu'),
        Dropout(dropout_rate),
        Dense(n_classes, activation='softmax')
    ])
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

bnn_meta = build_mc_dropout_bnn(input_dim, N_CLASSES)

early_stop = tf.keras.callbacks.EarlyStopping(monitor='loss', patience=20, restore_best_weights=True)
bnn_meta.fit(X_train_meta, y_train, epochs=200, batch_size=32, verbose=2, callbacks=[early_stop])

# Save BNN meta-learner
bnn_meta.save("bnn_meta_model.keras")

print("Training complete and models saved!")
