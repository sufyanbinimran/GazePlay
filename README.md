GazePlay – Setup & Requirements Guide
🧠 Project Overview
GazePlay is an AI-powered mobile app for children with cerebral palsy (CP) and similar impairments. It enables communication through head movements and eye blinking using OpenCV and CNN. Built using React Native (frontend) and Python Flask (backend), it includes:

🗣️ Icon-based communication

📚 Learning activities

😊 Mood-based story generation

📞 Quick contacts

🧑‍👩‍ Guardian & Admin panels
A free and accessible alternative to costly assistive devices like Tobii Dynavox.

📲 How to Use the App
Step 1: Install Expo Go
You can either:

Use an Android emulator via Android Studio, OR

Download Expo Go on your Android phone.

⚙️ React Native Setup (Frontend)
🔧 Update Your IP
In config.js, replace the placeholder IP with your actual local IP address.

bash
Copy
Edit
# To get your IP:
ipconfig
Then, open PowerShell as Administrator and run:

bash
Copy
Edit
setx /M REACT_NATIVE_PACKAGER_HOSTNAME 192.168.0.104
Replace 192.168.0.104 with your actual IP.

♻️ Restart your IDE (e.g., VS Code) before proceeding.
📂 Open Two Terminals
Terminal 1: Start Frontend
bash
Copy
Edit
cd code/
cd src/
npm start
Terminal 2: Start Backend (MongoDB Connection)
bash
Copy
Edit
cd code/
cd Backend/
npm start
🛠️ Accessing Admin Panel
Open the admin panel HTML file in your browser (Live Server or double-click to open in browser).

🧠 Head Tracking & Mood Detection (Python Side)
💡 Use a Separate IDE (e.g., PyCharm)
Step 1: Create and Activate Virtual Environment
bash
Copy
Edit
python -m venv venv
.\venv\Scripts\activate  # For Windows
Step 2: Install Python Dependencies
bash
Copy
Edit
pip install -r requirements.txt
Step 3: Mood Detection Model
Place the FER_model.h5 file (CNN model for mood detection) in the same directory.

Step 4: Run Flask Server
bash
Copy
Edit
python "Head Tracking Flask Server.py"
This will launch the server and connect with the React Native frontend.
