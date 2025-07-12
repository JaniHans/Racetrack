# 🏁 RaceTrack Interface System
This project provides real-time race management interfaces (admin and public) using a Node.js + Socket.IO backend, Javascript for frontend and Ngrok for remote access.

🚀 Getting Started
1. Install Dependencies
```npm install```

2. Install & Authenticate Ngrok
   1. Download Ngrok: https://ngrok.com/download
   2. Run this command to authenticate your Ngrok client in the Ngrok tunnel (terminal):
   ```ngrok config add-authtoken YOUR_AUTH_TOKEN```


▶️ Running the App
1. Start the Backend Server in your terminal
```npm start``` for 600 seconds race time OR ```npm run dev``` for 60 seconds race time  
2. Start the Ngrok Tunnel (terminal) from ngrok.exe.  
```ngrok http 3000```
3. Ngrok will print a public URL like:  
 ```https://abc12345.ngrok-free.app```
4. Click on the link to access main page  
5. Concatenate the below found routes to your ngrok website or use the main menu site  

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
If Ngrok provides you with the following URL:
https://abc12345.ngrok-free.app<br>
Then you can access:

https://abc12345.ngrok-free.app/front-desk/

https://abc12345.ngrok-free.app/race-control/

https://abc12345.ngrok-free.app/next-race/

<br>

# 🏁 User guide
## Interfaces

# Admin Panels
## Front Desk
#### Persona - Receptionist 
##### Route - /front-desk
Enter password to unlock interface
<br>
Type session name and click add Session button
<br>
### Manage Race Drivers 
Type driver name and choose race from the dropdown menu.
<br>
Option 1: add car or let program auto assign the car.
1. Driver name has to be unique
2. Red buttons : Logout and remove session
3. In the table below you can remove driver from the race, edit driver name and edit car. 
4. Press save to apply changes

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
<br>
### Next Race
#### Persona—Race Driver
##### Route - /next-race
<br>
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