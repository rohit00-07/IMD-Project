from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import pickle
from tensorflow.keras.losses import MeanSquaredError

app = Flask(__name__)
CORS(app)

# Load the trained model and scalers with custom_objects
model = load_model("model.h5", custom_objects={"mse": MeanSquaredError()})
with open("scaler_x.pkl", "rb") as f:
    scaler_x = pickle.load(f)
with open("scaler_y.pkl", "rb") as f:
    scaler_y = pickle.load(f)

# Function to create sequences (same as in notebook)
def create_sequences(X, time_steps=24):
    X_seq = []
    for i in range(len(X) - time_steps + 1):
        X_seq.append(X[i : i + time_steps])
    return np.array(X_seq)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get data from frontend
        data = request.get_json()
        selected_stations = data.get("selectedStations", [])
        target_station = data.get("targetStation", "")

        # Load your station data (replace with actual file paths or DB queries)
        target_df = pd.read_csv(f"data/{target_station}.csv")
        selected_dfs = [pd.read_csv(f"data/{station}.csv") for station in selected_stations]
        
        # Preprocess data
        target_df['DATETIME'] = pd.to_datetime(target_df['DATETIME'], errors='coerce')
        target_df = target_df.sort_values(by='DATETIME').reset_index(drop=True)
        target_df.ffill(inplace=True)

        for df in selected_dfs:
            df['DATETIME'] = pd.to_datetime(df['DATETIME'], errors='coerce')
            df = df.sort_values(by='DATETIME').reset_index(drop=True)
            df.ffill(inplace=True)

        # Combine selected stations data
        input_df = pd.concat(selected_dfs, axis=1, join="inner")
        input_df = input_df.loc[:, ~input_df.columns.duplicated()]

        # Align with target station data
        merged_df = pd.merge(input_df, target_df, on="DATETIME", how="inner")

        # Define input and output columns
        output_cols = ["RAIN_DAILY(mm)_0", "TEMP(C)_0", "RH(%)_0"]
        input_cols = [col for col in merged_df.columns if col not in output_cols and col != 'DATETIME']

        # Normalize data
        X = scaler_x.transform(merged_df[input_cols].values)
        
        # Create sequences
        time_steps = 24
        X_seq = create_sequences(X, time_steps)
        
        # Predict next 24 hours
        test_input = X_seq[-1].reshape(1, time_steps, X.shape[1])
        predicted_scaled = model.predict(test_input).reshape(time_steps, 3)
        real_predictions = scaler_y.inverse_transform(predicted_scaled)

        # Format predictions
        predictions = {
            "hours": list(range(1, 25)),
            "rainfall": real_predictions[:, 0].tolist(),
            "temperature": real_predictions[:, 1].tolist(),
            "humidity": real_predictions[:, 2].tolist()
        }

        return jsonify({"status": "success", "predictions": predictions})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)