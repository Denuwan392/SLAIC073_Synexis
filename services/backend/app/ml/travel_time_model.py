"""
Travel Time Prediction Model (Supervised Machine Learning Regression)
=====================================================================
This module builds, serializes, and serves a scikit-learn GradientBoosting /
RandomForest Regression model to predict transit duration in minutes.

Features Extracted:
1. `distance_km`: Haversine geographic distance between stations
2. `mode`: Transport mode ('bus' or 'train')
3. `service_type`: Service tier ('Normal', 'Express', 'Luxury', 'AC')
4. `departs_hour`: Continuous hour of day (0.0 - 23.99)
5. `departure_time_period`: Rush hour / night / afternoon categorical indicator
6. `origin` & `destination`: Categorical station identifiers (One-Hot Encoded)

Target:
- `duration_minutes`: Total travel time in minutes
"""

import os
import joblib
from typing import Dict, Any, Optional, Tuple
import numpy as np
import pandas as pd

from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score

from app.data.stations import get_station_coordinates, calculate_haversine_distance
from app.services.route_parser import get_all_schedules_dataframe


# Path to saved model artifact
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "travel_time_model.pkl")


class TravelTimePredictor:
    """
    Production wrapper for the scikit-learn Travel Time ML Pipeline.
    Supports continuous online inference and fallback heuristic calculations.
    """
    def __init__(self):
        self.model_pipeline: Optional[Pipeline] = None
        self.is_trained: bool = False
        self.metrics: Dict[str, float] = {}
        self.load_model()

    def build_pipeline(self) -> Pipeline:
        """Construct the preprocessing transformer and GradientBoosting Regressor pipeline."""
        categorical_features = ["origin", "destination", "mode", "service_type", "departure_time_period"]
        numeric_features = ["departs_hour", "distance_km"]

        preprocessor = ColumnTransformer(
            transformers=[
                ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
                ("num", "passthrough", numeric_features)
            ]
        )

        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("regressor", GradientBoostingRegressor(
                n_estimators=120,
                learning_rate=0.08,
                max_depth=4,
                random_state=42
            ))
        ])
        return pipeline

    def train(self) -> Dict[str, float]:
        """
        Train the regression model on the entire parsed schedule dataset from documents.py.
        Saves the trained pipeline to disk as a `.pkl` file.
        """
        df = get_all_schedules_dataframe()
        if df.empty or len(df) < 10:
            raise ValueError("Insufficient schedule data available to train Machine Learning model.")

        # Features (X) and Target (y)
        feature_cols = ["origin", "destination", "mode", "service_type", "departs_hour", "departure_time_period", "distance_km"]
        X = df[feature_cols]
        y = df["duration_minutes"]

        pipeline = self.build_pipeline()
        pipeline.fit(X, y)

        # Compute Training Evaluation Metrics
        y_pred = pipeline.predict(X)
        mae = mean_absolute_error(y, y_pred)
        r2 = r2_score(y, y_pred)

        self.model_pipeline = pipeline
        self.is_trained = True
        self.metrics = {
            "mae_minutes": round(float(mae), 2),
            "r2_score": round(float(r2), 4),
            "samples_count": len(df)
        }

        # Save to disk
        os.makedirs(MODEL_DIR, exist_ok=True)
        joblib.dump({
            "pipeline": self.model_pipeline,
            "metrics": self.metrics
        }, MODEL_PATH)

        return self.metrics

    def load_model(self) -> bool:
        """Load trained pipeline from disk if available."""
        if os.path.exists(MODEL_PATH):
            try:
                data = joblib.load(MODEL_PATH)
                if isinstance(data, dict) and "pipeline" in data:
                    self.model_pipeline = data["pipeline"]
                    self.metrics = data.get("metrics", {})
                else:
                    self.model_pipeline = data
                self.is_trained = True
                return True
            except Exception as e:
                self.is_trained = False
        return False

    def predict_duration(
        self,
        origin: str,
        destination: str,
        mode: str = "bus",
        service_type: str = "Normal",
        departs_hour: float = 8.0
    ) -> int:
        """
        Predict journey duration in minutes for any arbitrary origin, destination, time, and service.
        Falls back to Haversine physics heuristic if model is not loaded.
        """
        coords_orig = get_station_coordinates(origin)
        coords_dest = get_station_coordinates(destination)
        if coords_orig and coords_dest:
            distance_km = calculate_haversine_distance(coords_orig[0], coords_orig[1], coords_dest[0], coords_dest[1])
        else:
            distance_km = 80.0  # Fallback average distance

        # Period calculation
        if 4.0 <= departs_hour < 7.0:
            period = "early_morning"
        elif 7.0 <= departs_hour < 10.0:
            period = "morning_rush"
        elif 10.0 <= departs_hour < 16.0:
            period = "afternoon"
        elif 16.0 <= departs_hour < 20.0:
            period = "evening_rush"
        else:
            period = "night"

        if self.is_trained and self.model_pipeline is not None:
            input_df = pd.DataFrame([{
                "origin": origin,
                "destination": destination,
                "mode": mode.lower(),
                "service_type": service_type.capitalize(),
                "departs_hour": departs_hour,
                "departure_time_period": period,
                "distance_km": distance_km
            }])
            try:
                pred = self.model_pipeline.predict(input_df)[0]
                return max(15, int(round(pred)))
            except Exception:
                pass

        # Heuristic fallback: Speed ~40 km/h for normal bus, 50 km/h for luxury/express, 35 km/h for train
        avg_speed = 40.0
        if "luxury" in service_type.lower() or "express" in service_type.lower():
            avg_speed = 52.0
        elif mode.lower() == "train":
            avg_speed = 38.0

        estimated_minutes = int((distance_km / avg_speed) * 60) + 15  # +15 mins buffer
        return max(15, estimated_minutes)


# Global Singleton instance
travel_time_predictor = TravelTimePredictor()
