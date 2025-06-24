import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { EVENTS } from '../shared/events.js';
import { initSocketHandlers } from './socketHandlers.js';

config();

// Define __dirname for ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;

// Data storage for sessions and drivers
let sessions = [];
let drivers = {};

// Predefined list of cars
const cars = ['Car A', 'Car B', 'Car C', 'Car D', 'Car E', 'Car F', 'Car G', 'Car H'];

// Serve all files in the 'frontend' folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the receptionist HTML file
app.get('/front-desk', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/front-desk/front-desk.html'));
});

// Serve the Next Race page at /next-race
app.get('/next-race', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/next-race/next-race.html'));
});

// Simple API for health check or race info
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', raceActive: global.raceState?.active || false });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected');

  // Send initial data to the client
  socket.emit('update:data', { sessions, drivers });

  // Handle adding a new session
  socket.on('session:add', (newSessionName) => {
    if (!sessions.includes(newSessionName)) {
      sessions.push(newSessionName);
      drivers[newSessionName] = []; // Initialize an empty driver list for the session
      io.emit('update:data', { sessions, drivers });
      console.log(`Session added: ${newSessionName}`);
    } else {
      console.log(`Session already exists: ${newSessionName}`);
    }
  });

  // Handle adding a new driver
  socket.on('driver:add', ({ session, name }) => {
    const safeName = typeof name === 'string' ? name.trim() : String(name).trim();

    if (sessions.includes(session)) {
      if (drivers[session].length >= 8) {
        console.log(`Cannot add driver: ${safeName}. Session ${session} already has 8 drivers.`);
        socket.emit('error:driverLimit', { session, message: 'This session already has 8 drivers.' });
      } else if (!drivers[session].find((driver) => driver.name === safeName)) {
        const assignedCar = cars[drivers[session].length];
        drivers[session].push({ name: safeName, car: assignedCar });
        io.emit('update:data', { sessions, drivers });
        console.log(`Driver added: ${safeName} to session: ${session}, assigned car: ${assignedCar}`);
      } else {
        console.log(`Driver already exists: ${safeName} in session: ${session}`);
      }
    } else {
      console.log(`Session not found: ${session}`);
    }
  });

  // Handle removing a session
  socket.on('session:remove', (sessionName) => {
    if (sessions.includes(sessionName)) {
      sessions = sessions.filter((session) => session !== sessionName);
      delete drivers[sessionName];
      io.emit('update:data', { sessions, drivers });
      console.log(`Session removed: ${sessionName}`);
    } else {
      console.log(`Session not found: ${sessionName}`);
    }
  });

  // Handle removing a driver
  socket.on('driver:remove', ({ session, name }) => {
    const safeName = typeof name === 'string' ? name.trim() : String(name).trim();

    if (sessions.includes(session) && drivers[session]?.find((driver) => driver.name === safeName)) {
      drivers[session] = drivers[session].filter((driver) => driver.name !== safeName);
      io.emit('update:data', { sessions, drivers });
      console.log(`Driver removed: ${safeName} from session: ${session}`);
    } else {
      console.log(`Driver not found or session not found: ${safeName}`);
    }
  });

  // Handle editing a driver
  socket.on('driver:edit', ({ session, oldName, newName }) => {
    const safeOldName = typeof oldName === 'string' ? oldName.trim() : String(oldName).trim();
    const safeNewName = typeof newName === 'string' ? newName.trim() : String(newName).trim();

    if (
      sessions.includes(session) &&
      drivers[session]?.find((driver) => driver.name === safeOldName) &&
      !drivers[session]?.find((driver) => driver.name === safeNewName)
    ) {
      drivers[session] = drivers[session].map((driver) =>
        driver.name === safeOldName ? { ...driver, name: safeNewName } : driver
      );
      io.emit('update:data', { sessions, drivers });
      console.log(`Driver edited: ${safeOldName} to ${safeNewName} in session: ${session}`);
    } else {
      console.log(`Driver edit failed: ${safeOldName} to ${safeNewName}`);
    }
  });
});

// Start
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/receptionist.html`);
  console.log(`Server running on http://localhost:${PORT}/public/nextrace.html`);
});
