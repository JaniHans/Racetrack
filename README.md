beachside-race-control/
├── backend/
│   ├── server.js                 # Express + Socket.IO backend
│   ├── state.js                  # Global race state management
│   ├── socketHandlers.js         # All socket event logic
│   ├── .env                      # Role keys and port
│   └── roles.js                  # Optional role-based access keys
├── frontend/
│   ├── public/                   # Public access display screens
│   │   ├── index.html            # Welcome screen or global summary
│   │   ├── flag.html             # Displays current flag (public)
│   │   ├── leaderboard.html      # Displays live rankings (public)
│   │   ├── countdown.html        # Race countdown timer (public)
│   ├── receptionist.html         # Controls for scheduling and managing races
│   ├── safety.html               # Controls for flag updates (safety officials)
│   └── observer.html             # Lap line observer for marking laps
├── shared/
│   └── events.js                 # Shared constants between frontend and backend
├── package.json
├── README.md


2. Install & Authenticate Ngrok
   Download Ngrok: https://ngrok.com/download

Run this command to authenticate your Ngrok client:

bash
Copy
Edit
ngrok config add-authtoken YOUR_AUTH_TOKEN
Get your token from https://dashboard.ngrok.com/get-started/setup

▶️ Running the App
Step 1: Start the Backend Server
bash
Copy
Edit
npm start
Step 2: Start the Ngrok Tunnel
bash
Copy
Edit
ngrok http 3000
Ngrok will print a public URL like:

arduino
Copy
Edit
https://abc12345.ngrok-free.app
Use this as your base URL for accessing all interfaces.

🌐 Accessing Interfaces
🔹 Admin Interfaces
Interface	Route
Front Desk	/front-desk/
Race Control	/race-control/
Lap Line Tracker	/lap-line-tracker/

🔸 Public Interfaces
Interface	Route
Leaderboard	/leader-board/
Next Race	/next-race/
Countdown Timer	/race-countdown/
Race Flags	/race-flags/

Example
If Ngrok gives you this base URL:

arduino

https://abc12345.ngrok-free.app
Then you can access:

https://abc12345.ngrok-free.app/front-desk/

https://abc12345.ngrok-free.app/next-race/

etc.

🛑 Notes
Ngrok URLs are temporary unless you're using a paid account.

Every user must authenticate Ngrok with their own token.




### BUGS

sessions dont dissappear in front - desk when race started [x]
you can remove already running session in front desk which creates bugs [x]
if all sessions finished race control does not reload and start button does not appear again [x]
Race Control updates upcoming sessions in all situations [x]
On starting the server last race stays in front desk[]
if lapline tracker page is not loaded before race start pressed then lap line buttons dont enable[]
race control after all races finished does not display "no upcoming session" + start button is available[]
if raceActive adding new races from front desk will dissapear the table in the leaderboard and disables buttons in lap line[]