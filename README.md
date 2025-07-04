🏁 RaceTrack Interface System
This project provides real-time race management interfaces (admin and public) using a Node.js + Socket.IO backend and Ngrok for remote access.

🚀 Getting Started
1. Install Dependencies
```npm install```

2. Install & Authenticate Ngrok
   1. Download Ngrok: https://ngrok.com/download
   2. Run this command to authenticate your Ngrok client:
   ```ngrok config add-authtoken YOUR_AUTH_TOKEN```


▶️ Running the App
1. Start the Backend Server<br>
```npm start```
2. Start the Ngrok Tunnel<br>
```ngrok http 3000```
3. Ngrok will print a public URL like:<br>
 ```https://abc12345.ngrok-free.app```

| Interface        | Route                |
| ---------------- | -------------------- |
| Front Desk       | `/front-desk/`       |
| Race Control     | `/race-control/`     |
| Lap Line Tracker | `/lap-line-tracker/` |


| Interface       | Route              |
| --------------- | ------------------ |
| Leaderboard     | `/leader-board/`   |
| Next Race       | `/next-race/`      |
| Countdown Timer | `/race-countdown/` |
| Race Flags      | `/race-flags/`     |

<br>
If Ngrok gives you this base URL:
https://abc12345.ngrok-free.app<br>
Then you can access:

https://abc12345.ngrok-free.app/front-desk/

https://abc12345.ngrok-free.app/race-control/

https://abc12345.ngrok-free.app/next-race/

<br>
🛑 Notes
Ngrok URLs are temporary unless you're using a paid account.

Every user must authenticate Ngrok with their own token.

Do not hardcode or publish your token in the repo.

Keep .env and state.json files private.


### BUGS

sessions dont dissappear in front - desk when race started [x]
you can remove already running session in front desk which creates bugs [x]
if all sessions finished race control does not reload and start button does not appear again [x]
Race Control updates upcoming sessions in all situations [x]
On starting the server last race stays in front desk[]
if lapline tracker page is not loaded before race start pressed then lap line buttons dont enable[]
race control after all races finished does not display "no upcoming session" + start button is available[]
if raceActive adding new races from front desk will dissapear the table in the leaderboard and disables buttons in lap line[]