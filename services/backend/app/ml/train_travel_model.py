"""
Standalone Training Script for Travel Time ML Model
===================================================
Run this script to train or re-train the scikit-learn GradientBoosting
travel time regression model on the latest schedule dataset.

Usage:
    python app/ml/train_travel_model.py
"""

import sys
import os

# Set UTF-8 encoding for standard output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Add services/backend to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.ml.travel_time_model import travel_time_predictor
from app.services.route_parser import get_all_schedules_dataframe


def main():
    print("=" * 60)
    print("[AI/ML] Synexis Transit AI - Machine Learning Model Trainer")
    print("=" * 60)

    print("\n1. Extracting and parsing schedules from documents.py...")
    df = get_all_schedules_dataframe()
    print(f"   [OK] Extracted {len(df)} schedule trips with geographic distances.")
    print(f"   [OK] Dataset Summary:\n{df.head(3)}")

    print("\n2. Training GradientBoosting Regression Pipeline...")
    metrics = travel_time_predictor.train()

    print("\n" + "=" * 60)
    print("[SUCCESS] MODEL TRAINING COMPLETE!")
    print("=" * 60)
    print(f"   * Total Samples Used: {metrics.get('samples_count')}")
    print(f"   * Mean Absolute Error (MAE): {metrics.get('mae_minutes')} minutes")
    print(f"   * Coefficient of Determination (R2 Score): {metrics.get('r2_score')}")
    print("   * Model artifact saved to: app/ml/models/travel_time_model.pkl")
    print("=" * 60)

    # Test Sample Predictions
    print("\n[TEST] Sample Inference Tests:")
    sample_tests = [
        ("Colombo", "Kandy", "bus", "Luxury", 6.0),
        ("Colombo", "Kandy", "bus", "Normal", 8.5),
        ("Colombo", "Badulla", "train", "Express", 5.9),
        ("Galle", "Matara", "bus", "Normal", 14.0),
        ("Colombo", "Jaffna", "train", "Intercity", 5.5),
    ]

    for orig, dest, mode, serv, hr in sample_tests:
        pred_mins = travel_time_predictor.predict_duration(orig, dest, mode, serv, hr)
        hrs = pred_mins // 60
        mins = pred_mins % 60
        print(f"   --> {orig} to {dest} ({mode.upper()}, {serv}, {int(hr)}:00) -> Predicted: {pred_mins} mins ({hrs}h {mins}m)")


if __name__ == "__main__":
    main()
