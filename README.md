# 🏁 RaceTrack Interface System
This project provides real-time race management interfaces (admin and public) using a Node.js + Socket.IO backend, Javascript for frontend and Ngrok for remote access.

🚀 Getting Started
1. Install Dependencies
   ```npm install```


2.▶️ Running the App
<br></br>
    1. Start the Backend Server in your terminal  
       ```npm start``` - 600 seconds race time OR  ```npm run dev``` - for 60 seconds race time
<br></br>
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
       }```

<br></br>
    3. Click on the link to access the main menu

Main menu interface

| Interface        | Route              |
| ---------------- | ------------------ |
| Front Desk       | `/front-desk`      |
| Race Control     | `/race-control`    |
| Lap Line Tracker | `/lap-line-tracker` |


| Interface       | Route           |
| --------------- | --------------- |
| Leaderboard     | `/leader-board` |
| Next Race       | `/next-race`    |
| Countdown Timer | `/race-countdown` |
| Race Flags      | `/race-flags`   |

<br></br>

# 🏁 User guide
## Interfaces

### Admin Panels
## <span style="color: green">Front Desk</span>
#### Persona—Receptionist
Enter password to unlock interface
<br>
### ADD/REMOVE Sessions
1. Type session name(must be unique) and click **Add Session** button
    - follow to update driver details.
2. Remove session using the red button.

### ADD/EDIT/REMOVE Drivers
Type driver name and choose race from the dropdown menu.

1. Add car or let program auto assign the car.
2. Driver name has to be unique.
3. In the session table you can edit the car and drivers and remove drivers.
4. Press save to apply changes.

## <span style="color: green">Race Control</span>
#### Persona—Safety Official

Enter password to unlock interface  
Start race will start the race and set race mode to safe. Four buttons will be available after:
1. <span style="color: green">Safe</span>-drivers continue to drive, safe mode with green flag.
2. <span style="color: red">Stop Race</span>-drivers should stop driving, red flag is waved for danger.
3. <span style="color: orange">Report Hazard</span>-hazard on the road, orange flag, drivers continue driving.
4. <span style="color: red">Finish Race</span>-race finished, chequered flag is waved.
5. End Session—after the race finished, safety officials must end the session to proceed to the next race.


## <span style="color: green">Lap Line Tracker</span>
#### Persona-Lap-line Observer

Enter password to unlock interface.  
Clicking on the assigned Car button to record the lap completed with lap time.  
Another click increments lap count and records new lap time.  
Only best lap times are displayed in the leaderboard.

# Public Panels
## <span style="color: green">Leaderboard</span>
#### Persona-Guest

Leaderboard with time left, race flag and ranking.

## <span style="color: green">Next Race</span>
#### Persona—Race Driver
Display shows the drivers names, and the cars they're assigned to.  
When the race session is ended, Next Race display alerts upcoming session drivers to return to the paddock.
## <span style="color: green">Race Countdown</span>
#### Persona—Race Driver

The Timer shows the duration of the race.  
Race finished status is set when timer runs out.   
Safety officials must end the session after the race has finished.

## <span style="color: green">Race Flags</span>
#### Persona—Race Driver


<span style="color: green">Green</span>  - safe to drive  
<span style="color: orange">Orange</span>  - drive with caution, hazard at the road  
<span style="color: red">Red</span>  - stop driving, return to the pitlane  
Chequered - race finish, return to the pitlane  
</br>
After race has finished and safety official ends the session red flag is waved. New session drivers must return to the paddock.