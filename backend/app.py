from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import MeanSquaredError
import numpy as np
import pickle
import os

app = Flask(__name__)

# Paths to model and scalers
MODEL_PATH = "model.h5"
SCALER_X_PATH = "scaler_x.pkl"
SCALER_Y_PATH = "scaler_y.pkl"

# Global variables for model and scalers
model = None
scaler_x = None
scaler_y = None
time_steps = 24  # Must match training
num_features = None  # Will be set after loading model

def load_trained_model():
    """Loads the trained LSTM model and scalers."""
    global model, scaler_x, scaler_y, num_features
    try:
        # Load model with custom loss function
        custom_objects = {"mse": MeanSquaredError()}
        model = load_model(MODEL_PATH, custom_objects=custom_objects)

        # Load scalers
        with open(SCALER_X_PATH, "rb") as f:
            scaler_x = pickle.load(f)
        with open(SCALER_Y_PATH, "rb") as f:
            scaler_y = pickle.load(f)

        # Infer number of features from scaler_x
        num_features = scaler_x.n_features_in_
        print(f"Model and scalers loaded successfully. Expected features: {num_features}")
    except FileNotFoundError as e:
        raise Exception(f"Missing file: {str(e)}")
    except Exception as e:
        raise Exception(f"Error loading model or scalers: {str(e)}")

# Load model and scalers when the app starts
try:
    load_trained_model()
except Exception as e:
    print(f"Failed to initialize app: {str(e)}")
    exit(1)

@app.route("/predict", methods=["POST"])
def predict():
    """Receives JSON input, preprocesses it, and returns predictions."""
    try:
        # Parse input JSON
        data = request.get_json()
        if "input_data" not in data:
            return jsonify({"status": "error", "message": "Missing 'input_data' in JSON"}), 400
        
        input_data = np.array(data["input_data"])  # Convert input to NumPy array

        # Validate input shape
        if input_data.ndim != 2 or input_data.shape[0] != time_steps or input_data.shape[1] != num_features:
            return jsonify({
                "status": "error",
                "message": f"Invalid input shape: expected ({time_steps}, {num_features}) but got {input_data.shape}"
            }), 400

        # Normalize input
        input_scaled = scaler_x.transform(input_data)
        input_reshaped = input_scaled.reshape(1, time_steps, num_features)  # Batch size of 1

        # Make prediction
        predicted_scaled = model.predict(input_reshaped)
        predicted_scaled = predicted_scaled.reshape(time_steps, 3)  # 24 timesteps, 3 outputs

        # Inverse transform predictions
        predicted_values = scaler_y.inverse_transform(predicted_scaled)

        return jsonify({
            "status": "success",
            "predictions": predicted_values.tolist()
        })

    except ValueError as e:
        return jsonify({"status": "error", "message": f"Invalid input data: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": f"Prediction failed: {str(e)}"}), 500

if __name__ == "__main__":
    # Set debug=False for production
    app.run(host="0.0.0.0", port=5001, debug=False)