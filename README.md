# 🏁 RaceTrack Interface System  
This project provides real-time race management interfaces (admin and public) using a Node.js + Socket.IO backend, Javascript for frontend and Ngrok for remote access.

🚀 Getting Started
1. Install Dependencies
```npm install```

2. Install & Authenticate Ngrok
   1. Download Ngrok: https://ngrok.com/download
   2. Run this command to authenticate your Ngrok client in the Ngrok tunnel (terminal):
   ```ngrok config add-authtoken YOUR_AUTH_TOKEN```
<br></br>
3. ▶️ Running the App
   1. Start the Backend Server in your terminal  
   ```npm start``` - 600 seconds race time  
   2. ```npm run dev``` - for 60 seconds race time  
   3. Start the Ngrok Tunnel (terminal) from ngrok.exe.  
   ```ngrok http 3000```  
   4. Ngrok will print a public URL like:  
    ```https://abc12345.ngrok-free.app```    
   5. Click on the link to access main page  

Concatenate the below found routes to your ngrok website or use the main menu site  

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

<br></br>
## Example
If Ngrok provides you with the following URL:
https://abc12345.ngrok-free.app<br>
Then you can access:

https://abc12345.ngrok-free.app/front-desk/

https://abc12345.ngrok-free.app/race-control/

https://abc12345.ngrok-free.app/next-race/

# 🏁 User guide
## Interfaces

### Admin Panels
### Front Desk
#### Persona - Receptionist 
##### Route - /front-desk
Enter password to unlock interface
<br>
Type session name and click **Add Session** session button
<br></br>
### ADD/EDIT/REMOVE Drivers
Type driver name and choose race from the dropdown menu.

1. Add car or let program auto assign the car.
2. Driver name has to be unique
3. In the session table you can edit car and drivers and remove drivers. 
4. Press save to apply changes

### Race Control
#### Persona—Safety Official

Enter password to unlock interface
Start race will start the race and set race mode to safe. Four buttons will be available after:
 1. <span style="color: green">Safe</span> - drivers continue to drive, safe mode with green flag
 2. <span style="color: red">Stop Race</span> - drivers should stop driving, red flag is waved for danger
 3. <span style="color: orange">Report Hazard</span>  - caution hazard on the road, orange flag, drivers continue driving
 4. <span style="color: red">Finish Race</span> - race finished, chequered flag is waved
 5. <span style="color: red">End Session</span> after race finished end session will appear, that will remove the leaderboard stats. 

### Lap-line Tracker
#### Persona-Lap-line Observer

Enter password to unlock interface   
Clicking on the assigned Car button to record lap completed with lap time.

# Public Panels
### Leaderboard
#### Persona-Guest

Guests are being displayed in race mode with race flags and timer. Leaderboard is sorted through ranking of fastest laps

### Next Race
#### Persona—Race Driver

### Race Countdown
#### Persona—Race Driver

Timer shows time left for the race to finish

# Public Panels
### Race Flags
#### Persona—Race Driver

Shows the race mode in flags  
Green - safe to drive  
Orange - drive with caution, hazard at the road  
Red - stop driving, return to the pitlane  
Chequered - race finish, return to the pitlane  