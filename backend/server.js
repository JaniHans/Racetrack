import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { EVENTS } from '../shared/events.js';
import { initSocketHandlers } from './socketHandlers.js';
import fs from 'fs';

// Define __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Now load .env from the backend folder
config({ path: path.join(__dirname, '.env') });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;
const RECEPTIONIST_KEY = process.env.KEY_RECEPTIONIST;
const SAFETY_OFFICIAL_KEY = process.env.KEY_SAFETY;
const isDev = process.env.NODE_ENV === "development";

// Data storage for sessions and drivers
let sessions = [];
let drivers = {};

// Predefined list of cars
const cars = ['Car A', 'Car B', 'Car C', 'Car D', 'Car E', 'Car F', 'Car G', 'Car H'];

// File to persist state
const STATE_FILE = path.join(__dirname, 'state.json');

// Load initial state from file if it exists
function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      const fileContent = fs.readFileSync(STATE_FILE, 'utf-8').trim();
      if (fileContent === '') {
        // File is empty, initialize with default state
        console.log('State file is empty, initializing with default state.');
        global.raceState = {};
        return;
      }
      
      const data = JSON.parse(fileContent);
      sessions = data.sessions || [];
      drivers = data.drivers || {};
      // If you have raceState or other state, load it here as well
      global.raceState = data.raceState || {};
      console.log('State loaded from disk.');
    } catch (e) {
      console.error('Failed to load state:', e);
      console.log('Initializing with default state.');
      global.raceState = {};
    }

  } else {
    fs.writeFile(
        STATE_FILE,
        JSON.stringify({}, null, 2),
        err => {
          // Checking for errors
          if (err) throw err;

          // Success
          console.log("State file created with empty object.");
        });
  }
}
loadState();

// Save state to file
function saveState() {
  const data = {
    sessions,
    drivers,
    raceState: global.raceState || {},
  };
  fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
}

// app.use(express.static(path.join(__dirname, '../frontend')));

// Serve public display screens from /public/
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Serve all admin static assets dynamically
const adminRoutes = ['front-desk', 'race-control', 'lap-line-tracker'];

adminRoutes.forEach((route) => {
  const dir = path.join(__dirname, `../frontend/admin/${route}`);
  app.use(`/${route}`, express.static(dir));
  app.get(`/${route}`, (req, res) => {
    res.sendFile(path.join(dir, 'index.html'));
  });
});

// Simple API for health check or race info
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', raceActive: (global.raceState && global.raceState.active) || false });
});
// for timer to be used everywhere
app.use(express.static(path.join(__dirname,'../frontend/public/race-countdown')));


// Serve the Front Desk admin page at /front-desk/admin
app.get('/front-desk', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/front-desk/index.html'));
});

app.get('/lap-line-tracker', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/lap-line-tracker/index.html'));
});
app.get('/race-control', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin/race-control/index.html'));
});

app.get('/leader-board', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/leader-board/index.html'));
});

// Serve the Next Race page at /next-race
app.get('/next-race', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/next-race/index.html'));
});

app.get('/race-countdown', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/race-countdown/index.html'));
});

app.get('/race-flags', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/race-flags/index.html'));
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected');

  // Send initial data to the client
  socket.emit('update:data', { sessions, drivers, cars, raceState: global.raceState });

  // Helper function to check receptionist key
  function checkReceptionistKey(key) {
    return key && key === RECEPTIONIST_KEY;
  }
  // Helper function to check safety key
  function checkSafetyKey(key) {
    return key && key === SAFETY_OFFICIAL_KEY;
  }
  // Helper function to check observer key
  function checkObserverKey(key) {
    return key && key === process.env.KEY_OBSERVER;
  }

  // Handle receptionist authentication
  socket.on('auth:receptionist', ({ key }) => {
    const isValid = checkReceptionistKey(key);
    if (isValid) {
      socket.emit('auth:receptionist:result', true);
    } else {
      // Add 500ms delay for incorrect key
      setTimeout(() => {
        socket.emit('auth:receptionist:result', false);
      }, 500);
    }
  });
// Handle safety official authentication
  socket.on('auth:race-control', ({ key }) => {
    const isValid = checkSafetyKey(key);
    if (isValid) {
      socket.emit('auth:race-control:result', true);
    } else {
      // Add 500ms delay for incorrect key
      setTimeout(() => {
        socket.emit('auth:race-control:result', false);
      }, 500);
    }
  });
// Handle lap line observer authentication
  socket.on('auth:observer', ({ key }) => {
    const isValid = checkObserverKey(key);
    if (isValid) {
      socket.emit('auth:observer:result', true);
    } else {
      // Add 500ms delay for incorrect key
      setTimeout(() => {
        socket.emit('auth:observer:result', false);
      }, 500);
    }
  });

  // Handle adding a new session
  socket.on('session:add', ({ newSessionName, key,  }) => {
    if (!checkReceptionistKey(key)) return;

    if (!sessions.includes(newSessionName)) {
      sessions.push(newSessionName);
      drivers[newSessionName] = []; // Initialize an empty driver list for the session
      io.emit('update:data', { sessions, drivers, cars, raceState: global.raceState });
      saveState();
      console.log(`Session added: ${newSessionName}`);
    } else {
      console.log(`Session already exists: ${newSessionName}`);
    }
  });

  // Handle adding a new driver
  socket.on('driver:add', ({ session, name, car, key }) => {
    if (!checkReceptionistKey(key)) return;

    if (sessions.includes(session)) {
      if (drivers[session].length >= cars.length) {
        socket.emit('error:driverLimit', { session, message: 'This session already has the maximum number of drivers.' });
        return;
      }
      if (drivers[session].find((driver) => driver.name === name)) {
        socket.emit('error:driverExists', { session, message: 'Driver already exists in this session.' });
        return;
      }

      // Find the first available car
      const assignedCars = drivers[session].map(driver => driver.car);
      let assignedCar = car;
      if (!assignedCar || assignedCars.includes(assignedCar)) {
        assignedCar = cars.find(c => !assignedCars.includes(c));
      }

      if (!assignedCar) {
        socket.emit('error:noAvailableCar', { session, message: 'No available cars.' });
        return;
      }
      let fastestLap = null;
      let currentLap = 0;

      drivers[session].push({ name, car: assignedCar, fastestLap, currentLap});
      console.log(drivers[session]);
      io.emit('update:data', { sessions, drivers, cars, fastestLap, currentLap, raceState: global.raceState });
      saveState();
      console.log(`Driver added: ${name} to session: ${session}, assigned car: ${assignedCar}, fastest lap time ${fastestLap} and current lap time ${currentLap}`);
    } else {
      console.log(`Session not found: ${session}`);
    }
  });

  // Handle removing a session
  socket.on('session:remove', ({ session, key }) => {
    if (!checkReceptionistKey(key)) return;

    if (sessions.includes(session)) {
      sessions = sessions.filter((s) => s !== session);
      delete drivers[session];
      io.emit('update:data', { sessions, drivers, raceState: global.raceState });
      saveState();
      console.log(`Session removed: ${session}`);
    } else {
      console.log(`Session not found: ${session}`);
    }
  });

  // Handle removing a driver
  socket.on('driver:remove', ({ session, name, key }) => {
    if (!checkReceptionistKey(key)) return;

    const safeName = typeof name === 'string' ? name.trim() : String(name).trim();

    if (sessions.includes(session) && drivers[session] && drivers[session].find((driver) => driver.name === safeName)) {
      drivers[session] = drivers[session].filter((driver) => driver.name !== safeName);
      io.emit('update:data', { sessions, drivers, raceState: global.raceState });
      saveState();
      console.log(`Driver removed: ${safeName} from session: ${session}`);
    } else {
      console.log(`Driver not found or session not found: ${safeName}`);
    }
  });

  // Handle editing a driver
  socket.on('driver:edit', ({ session, oldName, newName, key }) => {
    if (!checkReceptionistKey(key)) return;

    const safeOldName = typeof oldName === 'string' ? oldName.trim() : String(oldName).trim();
    const safeNewName = typeof newName === 'string' ? newName.trim() : String(newName).trim();

    if (
      sessions.includes(session) &&
      drivers[session] && drivers[session].find((driver) => driver.name === safeOldName) &&
      drivers[session] && !drivers[session].find((driver) => driver.name === safeNewName)
    ) {
      drivers[session] = drivers[session].map((driver) =>
        driver.name === safeOldName ? { ...driver, name: safeNewName } : driver
      );
      io.emit('update:data', { sessions, drivers, raceState: global.raceState });
      saveState();
      console.log(`Driver edited: ${safeOldName} to ${safeNewName} in session: ${session}`);
    } else {
      console.log(`Driver edit failed: ${safeOldName} to ${safeNewName}`);
    }
  });

  // Handle editing a driver's car
  socket.on('driver:editCar', ({ session, name, car, key }) => {
    if (!checkReceptionistKey(key)) return;

    if (!sessions.includes(session)) {
      console.log(`Session not found: ${session}`);
      return;
    }
    const driverList = drivers[session];
    const driver = driverList.find(d => d.name === name);
    if (!driver) {
      console.log(`Driver not found: ${name} in session: ${session}`);
      return;
    }
    // Check if the car is already assigned to another driver in this session
    if (driverList.some(d => d.car === car && d.name !== name)) {
      socket.emit('error:carAssigned', { session, message: `Car ${car} is already assigned.` });
      return;
    }
    driver.car = car;
    io.emit('update:data', { sessions, drivers, cars, raceState: global.raceState });
    saveState();
    console.log(`Driver car updated: ${name} in session: ${session}, new car: ${car}`);
  });

  // Add this to your fetch:data handler
  socket.on('fetch:data', () => {
    socket.emit('update:data', { sessions, drivers, cars, raceState: global.raceState, raceActive: (global.raceState && global.raceState.active) || false });

  });
// safety control , start race
  socket.on('race:start', () => {
    // Move first session to raceState.currentSession
    const startedSession = sessions[0] || null;
    if (startedSession) {
      global.raceState.currentSession = startedSession;
      global.raceState.active = true;
      global.raceState.mode = 'Safe';
      global.raceState.flag = 'GREEN';
      global.raceState.startTime = Date.now();
      global.raceState.countdown = isDev ? 60 : 600;
      if (!global.raceState.currentLaps) global.raceState.currentLaps = {};
      for (const driver of drivers[startedSession]) {
        console.log(driver.currentLap)
        driver.currentLap = 1;
        console.log(driver.currentLap);
      }
      // let fastestLap = null;
      // let currentLap = 0;
      //
      // drivers[session].push({ name, car: assignedCar, fastestLap, currentLap});
      // console.log(drivers[session]);
      // io.emit('update:data', { sessions, drivers, cars, fastestLap, currentLap, raceState: global.raceState });

      saveState();

      const ignoreReceptionist = true;
      console.log(drivers);
      console.log(drivers[startedSession])

      io.emit('raceStarted', { sessions, drivers, cars, ignoreReceptionist, raceState: global.raceState, currentSession: global.raceState.currentSession});
      io.emit('modeChanged', { mode: global.raceState.mode, flag: global.raceState.flag });
      io.emit('update:data', { sessions, drivers, cars, ignoreReceptionist, raceState: global.raceState, currentSession: global.raceState.currentSession });
    }
    // ADDED TIMEOUT
    setTimeout(() => {
      if (global.raceState.active) {
        global.raceState.mode = 'Finish';
        global.raceState.flag = 'CHEQUERED';
        global.raceState.active = false;
        io.emit('raceFinished', global.raceState);
        saveState();
      }


    }, global.raceState.countdown * 1000);


  });
  socket.on('race:safe', () => {
    global.raceState.mode = 'Safe';
    global.raceState.flag = 'GREEN';
    io.emit('modeChanged', { mode: global.raceState.mode, flag: global.raceState.flag });
    saveState();
  })
  socket.on('race:stop', () => {
    console.log('STOP RACE RECEIVED'); //
    global.raceState.mode = 'Danger';
    global.raceState.flag = 'RED';
    io.emit('modeChanged', { mode: global.raceState.mode, flag: global.raceState.flag });
    saveState();

  });
  socket.on('race:hazard', () => {
    console.log('Hazard RACE RECEIVED'); //
    global.raceState.mode = 'Hazard';
    global.raceState.flag = 'YELLOW';
    io.emit('modeChanged', { mode: global.raceState.mode, flag: global.raceState.flag });
    saveState();

  });
  socket.on('race:finish', () => {
    console.log('FINISH RACE RECEIVED'); //
    global.raceState.mode = 'Danger';
    global.raceState.flag = 'CHEQUERED';
    global.raceState.active = false;
    io.emit('modeChanged', { mode: global.raceState.mode, flag: global.raceState.flag });
    io.emit('raceFinished', global.raceState);
    saveState();
  });
  socket.on('race:endSession', () => {
    const endedSession = global.raceState.currentSession;
    if (endedSession) {
      // Remove from sessions array
      sessions = sessions.filter(s => s !== endedSession);
      delete drivers[endedSession];
      global.raceState.currentSession = null;
      global.raceState.active = false;
      global.raceState.mode = 'Danger';
      global.raceState.flag = 'RED';
      global.raceState.laps = {};
      saveState();
      io.emit('update:data', { sessions, drivers, cars, raceState: global.raceState });
      io.emit('modeChanged', { mode: global.raceState.mode, flag: global.raceState.flag });
      io.emit('sessionEnded', global.raceState);
    }
  });

socket.on('fetch:current-session', () => {
  const currentSession = sessions[0] || null;
  //const currentSession = sessions.shift() || null;
  io.emit('receive:current-session', currentSession);
});
socket.on('session:lockin', ({ session, key }) => {
  if (!checkReceptionistKey(key)) return;
  io.emit('session:lockedin', { session });
  console.log(`Session locked in: ${session}`);
});
// lap done event
  socket.on('lap:done', (data) => {
    socket.broadcast.emit('lap:done', data); // Sends to all clients except sender
  });
  socket.on('request:lap-times', (data) => {

    const session = sessions[0] || null;
    const sessionDrivers = global.drivers?.[session];

    const bestLapTimes = {};

    if (sessionDrivers) {
      sessionDrivers.forEach(driver => {
        if (driver.fastestLap !== null && driver.fastestLap !== undefined) {
          bestLapTimes[driver.car] = driver.fastestLap;
        }
      });
    }

    socket.emit('response:lap-times', { value: bestLapTimes });
  });


  // Lap completed event
  socket.on('lap:completed', ({ car, key, lapTime }) => {
    if (key !== process.env.KEY_OBSERVER) return;
    
    // Initialize race state laps if not exists
    if (!global.raceState.laps) global.raceState.laps = {};



    // Increment lap count
    global.raceState.laps[car] = (global.raceState.laps[car] || 0) + 1;

    
    // Update fastest lap time if lapTime is provided
    if (lapTime && global.raceState.currentSession) {
      const currentSession = global.raceState.currentSession;
      const sessionDrivers = drivers[currentSession];
      const driver = sessionDrivers && sessionDrivers.find(d => d.car === car);
      
      if (driver) {
        // Update fastest lap if this is faster or if no fastest lap exists
        if (!driver.fastestLap || lapTime < driver.fastestLap) {
          driver.fastestLap = lapTime;
          console.log(`New fastest lap for ${driver.name} (${car}): ${lapTime}ms`);
        }
        
        // Update current lap time
        driver.currentLap += 1;
        console.log(`Current lap for ${driver.name} (${car}): ${lapTime}ms`);
      }
    }

    const ignoreReceptionist = true;
    console.log("LAP COUNTER " + global.raceState.laps[car]);
    io.emit('update:data', { sessions, drivers, cars, ignoreReceptionist, raceState: global.raceState });
    saveState(); // Save state after lap completion
  });
});
// Start
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}/index.html`);
  console.log(`Server accessible from network at http://192.168.0.28:${PORT}/index.html`);
  console.log(`Mobile devices can access at: http://192.168.0.28:${PORT}`);
  console.log('Receptionist key:', process.env.KEY_RECEPTIONIST);
  console.log('Race-Control key:', process.env.KEY_SAFETY);
  console.log('Lap-Line-Tracker key:', process.env.KEY_OBSERVER);
});
