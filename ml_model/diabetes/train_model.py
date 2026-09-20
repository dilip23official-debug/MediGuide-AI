import pandas as pd
import joblib

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "diabetes.csv"
MODEL_PATH = BASE_DIR / "diabetes_model.joblib"

print("Loading diabetes dataset...")

df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully.")
print("Dataset shape:", df.shape)
print("Columns:", list(df.columns))

X = df.drop("Outcome", axis=1)
y = df["Outcome"]

X_train, X_test, y_train, y_test = train_test_split(
X,
y,
test_size=0.20,
random_state=42,
stratify=y,
)

print("Training data:", X_train.shape)
print("Testing data:", X_test.shape)

model = RandomForestClassifier(
n_estimators=200,
random_state=42,
)

print("Training model...")

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print()
print("===================================")
print("MODEL TRAINING COMPLETED")
print("===================================")
print(f"Accuracy: {accuracy * 100:.2f}%")
print()

print("Classification Report:")
print(classification_report(y_test, y_pred))

joblib.dump(model, MODEL_PATH)

print()
print("Model saved successfully!")
print("Model location:")
print(MODEL_PATH)
