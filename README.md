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


### BUGS

Timer on finished, it takes from racestate wrong starttime[]
On starting the server last race stays in front desk[] - 
if lapline tracker page is not loaded before race start pressed then lap line buttons dont enable[]
race control after all races finished does not display "no upcoming session" + start button is available[]
if raceActive adding new races from front desk will dissapear the table in the leaderboard and disables buttons in lap line[]
timer not refreshing with new racec starts from 8 min + []