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

sessions dont dissappear in front - desk when race started [x]
you can remove already running session in front desk which creates bugs [x]
if all sessions finished race control does not reload and start button does not appear again [x]