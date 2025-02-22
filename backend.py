import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
from tkinter import Tk, filedialog

# Function to select files
def select_file(title):
    root = Tk()
    root.withdraw()  # Hide the root window
    file_path = filedialog.askopenfilename(title=title, filetypes=[("CSV files", "*.csv")])
    return file_path

# Select targeted station CSV
target_station_file = select_file("Select Targeted Station CSV")
target_df = pd.read_csv(target_station_file)

# Select selected stations CSV
selected_stations_file = select_file("Select Selected Stations CSV")
input_df = pd.read_csv(selected_stations_file)

# Sort data by date
target_df = target_df.sort_values(by="Date")
input_df = input_df.sort_values(by="Date")

# Normalize features
scaler = MinMaxScaler()
target_df.iloc[:, 1:] = scaler.fit_transform(target_df.iloc[:, 1:])  # Assuming features start from column 1
input_df.iloc[:, 1:] = scaler.transform(input_df.iloc[:, 1:])

# Convert to NumPy arrays
X = input_df.iloc[:, 1:].values  # Input features
Y = target_df.iloc[:, 1:].values  # Output features

# Function to create sequences
def create_sequences(X, Y, time_steps=7):
    X_seq, Y_seq = [], []
    for i in range(len(X) - time_steps):
        X_seq.append(X[i : i + time_steps])
        Y_seq.append(Y[i + time_steps])  # Predicting next day after sequence
    return np.array(X_seq), np.array(Y_seq)

time_steps = 7  # Predicting next 7 days
X_train, Y_train = create_sequences(X, Y, time_steps)

# Define RNN model
model = Sequential([
    LSTM(50, activation='relu', return_sequences=True, input_shape=(time_steps, X_train.shape[2])),
    LSTM(50, activation='relu'),
    Dense(Y_train.shape[1])  # Output layer for multi-feature prediction
])

# Compile model
model.compile(optimizer="adam", loss="mse")

# Train model (you can increase epochs for better performance)
model.fit(X_train, Y_train, epochs=50, batch_size=16, verbose=1)

# Predict next 7 days
test_input = X_train[-1].reshape(1, time_steps, X_train.shape[2])  # Take the last sequence
predicted_weather = model.predict(test_input)

# Display Predictions
print("Predicted Weather for Next 7 Days:", predicted_weather)