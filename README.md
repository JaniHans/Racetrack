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


ngrok config add-authtoken 2zPgeXzTWIK34tAOXkkuQBv2QxS_djRnWgts3YFSbLDbEA51
### ADMIN NGROK ROUTES
https://7c8c-2a00-807-d9-bf6e-c18e-4c79-d794-cfd6.ngrok-free.app - Landing page
https://7c8c-2a00-807-d9-bf6e-c18e-4c79-d794-cfd6.ngrok-free.app/race-control/ - RACE CONTROL
https://7c8c-2a00-807-d9-bf6e-c18e-4c79-d794-cfd6.ngrok-free.app/front-desk/ - FRONT DESK
https://7c8c-2a00-807-d9-bf6e-c18e-4c79-d794-cfd6.ngrok-free.app/lap-line-tracker/ - Lap line tracker

### PUBLIC NGROK Routes

https://7c8c-2a00-807-d9-bf6e-c18e-4c79-d794-cfd6.ngrok-free.app/leader-board/ - Leaderboard
https://7c8c-2a00-807-d9-bf6e-c18e-4c79-d794-cfd6.ngrok-free.app/next-race/ - Next Race
https://7c8c-2a00-807-d9-bf6e-c18e-4c79-d794-cfd6.ngrok-free.app/race-countdown/ - Timer
https://7c8c-2a00-807-d9-bf6e-c18e-4c79-d794-cfd6.ngrok-free.app/race-flags/ - Race Flags



### BUGS

sessions dont dissappear in front - desk when race started [x]
you can remove already running session in front desk which creates bugs [x]
if all sessions finished race control does not reload and start button does not appear again [x]
Race Control updates upcoming sessions in all situations [x]
On starting the server last race stays in front desk[]
if lapline tracker page is not loaded before race start pressed then lap line buttons dont enable[]
race control after all races finished does not display "no upcoming session" + start button is available[]
if raceActive adding new races from front desk will dissapear the table in the leaderboard and disables buttons in lap line[]