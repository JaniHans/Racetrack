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
1. Start the Backend Server in your terminal<br>
```npm start```
2. Start the Ngrok Tunnel from ngrok.exe.<br>
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


1. On starting the server last race stays in front desk[]
2. if lapline tracker page is not loaded before race start pressed then lap line buttons dont enable[]
3. race control after all races finished does not display "no upcoming session" + start button is available[]
4. if raceActive adding new races from front desk will dissapear the table in the leaderboard and disables buttons in lap line[]
5. leaderboard if not opened before the start of the race does not display leaderboard[]

🏁 User guide
## Interfaces

# Admin Panels
### Front Desk
#### Persona - Receptionist 
##### Route - /front-desk
Enter password to unlock interface
Enter session name and click add Session
Manage Race Drivers 
# enter driver name and choose race from the dropdown menu.
Option 1 to add car or let program auto assign the car.
Driver name has to be unique
Red buttons : Logout and remove session
In the table below you can remove driver from the race, edit driver name and edit car. Press save to apply changes

### Race Control
#### Persona - Safety Official
##### Route - /race-control
Enter password to unlock interface
Start race will start the race and set race mode to safe. Four buttons will be available after:
 1. Safe - drivers continue to drive
 2. Stop race - red flag is waved for danger , drivers should stop driving
 3. Report hazard - caution for drivers , orange flag continue driving
 4. Finish race - chequered flag is waved , drivers have to return to the pitlane.
 5. After finish race is clicked end session will appear, that will remove the leaderboard stats. 

### Lap-line Tracker
#### Persona-Lap-line Observer
##### Route - /lap-line-tracker
Enter password to unlock interface
Click Car A buttons to record lap times and laps simultaneously.

# Public Panels
### Leaderboard
#### Persona-Guest
##### Route - /leader-board
Guest are being displayed race mode with race flags and timer. Leaderboard is sorted through ranking of fastest laps

# Public Panels
### Next Race
#### Persona—Race Driver
##### Route - /next-race

# Public Panels
### Race Countdown
#### Persona—Race Driver
##### Route - /race-countdown

Timer shows time left for the race to finish

# Public Panels
### Race Flag
#### Persona—Race Driver
##### Route - /race-flags

Shows the race mode in flags
Green - safe to drive
Orange - drive with caution, hazard at the road
Red - stop driving, return to the pitlane
Chequered - race finish, return to the pitlane