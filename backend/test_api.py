import requests
import numpy as np

# Flask app URL (updated to port 5001)
url = "http://127.0.0.1:5001/predict"

# Model parameters
num_features = 21  # From your output: Expected features: 21
time_steps = 24

# Generate sample input data: 24 timesteps, 21 features
# Using random values between 0 and 1 (since scaler_x normalizes input)
sample_input = np.random.rand(time_steps, num_features).tolist()

# Prepare the JSON payload
payload = {
    "input_data": sample_input
}

# Send POST request to Flask app
try:
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("Success! Response:")
        print(response.json())
    else:
        print(f"Error: {response.status_code}")
        print(response.json())
except requests.exceptions.ConnectionError:
    print("Connection error: Is the Flask app running?")
except Exception as e:
    print(f"An error occurred: {str(e)}")