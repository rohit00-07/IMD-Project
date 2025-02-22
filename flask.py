from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import io

app = Flask(__name__)

# Load trained model
model = load_model("weather_prediction_model.h5")

@app.route('/predict', methods=['POST'])
def predict():
    if 'target_file' not in request.files or 'selected_files' not in request.files:
        return jsonify({"error": "Missing files"}), 400
    
    target_file = request.files['target_file']
    selected_files = request.files.getlist('selected_files')
    
    # Read CSV files
    target_df = pd.read_csv(io.BytesIO(target_file.read()))
    input_dfs = [pd.read_csv(io.BytesIO(file.read())) for file in selected_files]
    input_df = pd.concat(input_dfs, ignore_index=True)
    
    # Sort data by date
    target_df = target_df.sort_values(by=target_df.columns[0])
    input_df = input_df.sort_values(by=input_df.columns[0])
    
    # Normalize features
    scaler_x = MinMaxScaler()
    scaler_y = MinMaxScaler()
    
    numerical_cols_input = input_df.select_dtypes(include=np.number).columns[1:]
    numerical_cols_target = target_df.select_dtypes(include=np.number).columns[1:]
    
    X = scaler_x.fit_transform(input_df[numerical_cols_input].values)
    Y = scaler_y.fit_transform(target_df[numerical_cols_target].values)
    
    # Create sequences
    def create_sequences(X, Y, time_steps=7):
        X_seq, Y_seq = [], []
        num_sequences = min(len(X), len(Y)) - time_steps
        for i in range(num_sequences):
            X_seq.append(X[i : i + time_steps])
            Y_seq.append(Y[i + time_steps])
        return np.array(X_seq), np.array(Y_seq)
    
    time_steps = 7
    X_test, Y_test = create_sequences(X, Y, time_steps)
    
    # Predict
    test_input = X_test[-1].reshape(1, time_steps, X_test.shape[2])
    predicted_weather = model.predict(test_input)
    real_predictions = scaler_y.inverse_transform(predicted_weather)
    
    return jsonify({"predictions": real_predictions.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
