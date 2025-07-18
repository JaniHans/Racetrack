# Race Track Management System - Technical Documentation

## Overview
A real-time race track management system built with Node.js, Socket.IO, and vanilla JavaScript. The system provides comprehensive race management including session control, driver management, lap timing, and live leaderboards accessible across multiple devices.

## Architecture

### Backend (Node.js + Socket.IO)
- **Express Server**: Serves static files and API endpoints
- **Socket.IO**: Real-time bidirectional communication
- **State Persistence**: JSON file-based data storage
- **Role-based Authentication**: Key-based access control

### Frontend (Vanilla JavaScript)
- **Admin Interfaces**: Race control, driver management, lap tracking
- **Public Displays**: Leaderboards, race status, countdown timers
- **Real-time Updates**: Socket.IO client connections

## Key Components

### 1. Server Core (`backend/server.js`)

#### State Management
```javascript
// Global state variables
let sessions = [];          // Array of race sessions
let drivers = {};          // Session -> drivers mapping
const cars = ['Car A', 'Car B', ...]; // Available cars

// Persistent state storage
function saveState() {
  const data = {
    sessions,
    drivers,
    raceState: global.raceState || {},
  };
  fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
}
```
**Why**: Maintains race data across server restarts, ensuring no data loss.

#### Authentication System
```javascript
const RECEPTIONIST_KEY = process.env.KEY_RECEPTIONIST;
const SAFETY_OFFICIAL_KEY = process.env.KEY_SAFETY;

function checkReceptionistKey(key) {
  return key && key === RECEPTIONIST_KEY;
}
```
**Why**: Role-based access prevents unauthorized race control. Different roles have different permissions.

#### Race State Management
```javascript
global.raceState = {
  currentSession: null,     // Active session
  active: false,           // Race running status
  mode: 'Safe',           // Safe/Danger/Hazard/Finish
  flag: 'GREEN',          // Flag color
  startTime: Date.now(),  // Race start timestamp
  countdown: 600,         // Race duration
  laps: {}               // Car -> lap count mapping
};
```
**Why**: Centralized race state ensures all components stay synchronized.

### 2. Lap Tracking System (`frontend/admin/lap-line-tracker/`)

#### Lap Time Calculation
```javascript
// First lap: time since race start
if (lapTimestamps[car].length === 1 && raceStartTime) {
  lapTime = now - raceStartTime;
}
// Subsequent laps: time between lap completions
else if (lapTimestamps[car].length > 1) {
  const prev = lapTimestamps[car][lapTimestamps[car].length - 2];
  lapTime = now - prev;
}
```
**Why**: Accurate timing for both first lap (from race start) and subsequent laps (interval timing).

#### Fastest Lap Tracking
```javascript
if (!bestLapTimes[car] || lapTime < bestLapTimes[car]) {
  bestLapTimes[car] = lapTime;
}
```
**Why**: Tracks personal best times for competitive analysis.

### 3. Driver Management (`frontend/admin/front-desk/`)

#### Dynamic Car Assignment
```javascript
const assignedCars = drivers[session].map(driver => driver.car);
let assignedCar = car;
if (!assignedCar || assignedCars.includes(assignedCar)) {
  assignedCar = cars.find(c => !assignedCars.includes(c));
}
```
**Why**: Prevents car conflicts and ensures unique car assignments per session.

#### Driver Data Structure
```javascript
{
  name: "Driver Name",
  car: "Car A",
  fastestLap: 45300,    // milliseconds
  currentLap: 47200     // milliseconds
}
```
**Why**: Complete driver profile with timing data for leaderboard generation.

### 4. Real-time Communication

#### Socket Events Architecture
```javascript
// Server -> Client notifications
io.emit('raceStarted', global.raceState);
io.emit('modeChanged', { mode, flag });
io.emit('update:data', { sessions, drivers, cars, raceState });

// Client -> Server actions
socket.on('lap:completed', ({ car, key, lapTime }) => {
  // Process lap completion
});
```
**Why**: Real-time updates ensure all interfaces show current race status immediately.

#### Data Synchronization
```javascript
socket.on('update:data', (data) => {
  sessions = data.sessions;
  drivers = data.drivers;
  raceState = data.raceState;
  updateUI();
});
```
**Why**: Keeps all connected clients synchronized with server state.

### 5. Race Control System (`frontend/admin/race-control/`)

#### Flag Management
```javascript
const flagStates = {
  'Safe': { mode: 'Safe', flag: 'GREEN' },
  'Danger': { mode: 'Danger', flag: 'RED' },
  'Hazard': { mode: 'Hazard', flag: 'YELLOW' },
  'Finish': { mode: 'Finish', flag: 'CHEQUERED' }
};
```
**Why**: Standardized race conditions for safety and race management.

#### Race Lifecycle
```javascript
// Start Race
socket.emit('race:start');  // Initialize race
// Control Race
socket.emit('race:safe');   // Green flag
socket.emit('race:stop');   // Red flag
socket.emit('race:hazard'); // Yellow flag
// End Race
socket.emit('race:finish'); // Checkered flag
socket.emit('race:endSession'); // Complete cleanup
```
**Why**: Clear race state transitions for proper race management.

### 6. Leaderboard System (`frontend/public/leader-board/`)

#### Dynamic Sorting
```javascript
const sortedDrivers = [...sessionDrivers].sort((a, b) => {
  const timeA = bestTimes[a.car] ?? a.fastestLap ?? Infinity;
  const timeB = bestTimes[b.car] ?? b.fastestLap ?? Infinity;
  return timeA - timeB;
});
```
**Why**: Live ranking based on fastest lap times, handles missing data gracefully.

#### Performance Display
```javascript
const bestStr = bestTime !== null && bestTime !== undefined
  ? (bestTime / 1000).toFixed(2) + 's'
  : ' - ';
```
**Why**: User-friendly time formatting (milliseconds to seconds with precision).

### 7. State Persistence (`backend/state.json`)

#### File Structure
```json
{
  "sessions": ["Session1", "Session2"],
  "drivers": {
    "Session1": [
      {
        "name": "Driver",
        "car": "Car A",
        "fastestLap": 45300,
        "currentLap": 47200
      }
    ]
  },
  "raceState": {
    "currentSession": "Session1",
    "active": true,
    "mode": "Safe",
    "flag": "GREEN",
    "startTime": 1752754141068,
    "countdown": 600,
    "laps": { "Car A": 5, "Car B": 3 }
  }
}
```
**Why**: Complete race state preservation enables system recovery after restarts.

## Network Architecture

### Multi-device Access
```javascript
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server accessible from network at http://192.168.0.28:${PORT}`);
});
```
**Why**: Enables mobile devices and multiple computers to access the system simultaneously.

### Static File Serving
```javascript
// Public displays
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Admin interfaces
const adminRoutes = ['front-desk', 'race-control', 'lap-line-tracker'];
adminRoutes.forEach((route) => {
  app.use(`/${route}`, express.static(dir));
});
```
**Why**: Separates public viewing interfaces from admin control interfaces.

## Security Features

### Role-based Access Control
- **Receptionist**: Session and driver management
- **Race Control**: Race start/stop, flag control
- **Lap Line Observer**: Lap timing only
- **Public**: View-only access to displays

### Key Authentication
```javascript
socket.on('auth:receptionist', ({ key }) => {
  const isValid = checkReceptionistKey(key);
  if (isValid) {
    socket.emit('auth:receptionist:result', true);
  } else {
    setTimeout(() => {
      socket.emit('auth:receptionist:result', false);
    }, 500); // Delay for failed attempts
  }
});
```
**Why**: Prevents unauthorized access with rate limiting for security.

## Data Flow

### Race Session Lifecycle
1. **Setup**: Create session, add drivers (Front Desk)
2. **Start**: Initialize race timing (Race Control)
3. **Monitor**: Track laps, manage flags (Lap Tracker + Race Control)
4. **Display**: Show live results (Leaderboard)
5. **Finish**: End race, preserve results (Race Control)

### Real-time Updates
1. **Action**: User performs action (button click)
2. **Validation**: Server validates permissions and data
3. **Update**: Server updates internal state
4. **Persist**: State saved to JSON file
5. **Broadcast**: Changes sent to all connected clients
6. **Render**: Client UIs update automatically

## Error Handling

### State Loading Recovery
```javascript
function loadState() {
  try {
    const fileContent = fs.readFileSync(STATE_FILE, 'utf-8').trim();
    if (fileContent === '') {
      console.log('State file is empty, initializing with default state.');
      global.raceState = {};
      return;
    }
    const data = JSON.parse(fileContent);
    // Load state...
  } catch (e) {
    console.error('Failed to load state:', e);
    console.log('Initializing with default state.');
    global.raceState = {};
  }
}
```
**Why**: Graceful recovery from corrupted or missing state files.

### Connection Handling
```javascript
socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('fetch:data'); // Resync on reconnection
});
```
**Why**: Automatic data resynchronization after network interruptions.

## Performance Considerations

### Efficient State Updates
- Only broadcast changes, not full state
- Use `ignoreReceptionist` flag to prevent unnecessary UI updates
- Batch related updates together

### Memory Management
- JSON file storage keeps memory footprint low
- State cleanup on session end prevents memory leaks
- Efficient data structures for fast lookups

## Browser Compatibility

### Modern JavaScript Features
- Uses ES6+ features (arrow functions, destructuring, template literals)
- Socket.IO provides WebSocket fallbacks
- Vanilla JavaScript for maximum compatibility

### Mobile Responsiveness
- CSS designed for both desktop and mobile displays
- Touch-friendly button sizing
- Responsive layouts for different screen sizes

## Deployment Notes

### Environment Variables
```bash
KEY_RECEPTIONIST=a
KEY_SAFETY=b
KEY_OBSERVER=c
NODE_ENV=production
PORT=3000
```

### Network Requirements
- Server must be accessible on local network
- All devices must be on same network
- Firewall should allow connections on specified port

### File Permissions
- Write access required for `state.json` file
- Read access for all static frontend files

## Future Enhancements

### Potential Improvements
1. **Database Integration**: Replace JSON with proper database
2. **User Management**: Replace keys with proper user accounts
3. **Race History**: Store and analyze historical race data
4. **Advanced Timing**: Integration with timing hardware
5. **Live Streaming**: Real-time race video integration
6. **Mobile Apps**: Dedicated mobile applications
7. **Analytics**: Performance analysis and reporting tools

### Scalability Considerations
- Current system designed for single track operation
- Could be extended for multiple simultaneous races
- Database would be required for larger scale operations

## Conclusion

This race track management system provides a complete solution for managing go-kart or similar racing events. The modular architecture allows for easy maintenance and future enhancements while the real-time capabilities ensure smooth race operations. The state persistence ensures reliability and the multi-device support makes it practical for real-world racing scenarios.
