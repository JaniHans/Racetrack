# 🏁 RaceTrack Interface System
This project provides real-time race management interfaces (admin and public) using a Node.js + Socket.IO backend, Javascript for frontend and Ngrok for remote access.

🚀 Getting Started
1. Install Dependencies
   ```npm install```


2.▶️ Running the App
   1. Start the Backend Server in your terminal  
   ```npm start``` - 600 seconds race time OR  ```npm run dev``` - for 60 seconds race time   
   2. Before you open all the interfaces, please paste the following to your state.json(<span style="color: red">backend folder</span>) file
      ```
      {
      "sessions": [],
      "drivers": {},
      "raceState": {
      "active": false,
      "mode": null,
      "flag": null,
      "startTime": 1752328206371,
      "countdown": 60,
      "laps": {},
      "currentSession": null
      }
      } 
