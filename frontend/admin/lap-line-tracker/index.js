const socket = io();

let cars = [];
let lapCounts = {};
let observerKey = null;
let raceActive = false;
let lapTimestamps = {}; // car -> [timestamps]
let bestLapTimes = {};  // car -> ms
let raceStartTime = null;

socket.emit('best:LapTimes', {bestLapTimes});

window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('keyModal');
  const input = document.getElementById('observerKeyInput');
  const submitKeyButton = document.getElementById('submitKeyBtn');
  const error = document.getElementById('keyError');
  socket.emit('fetch:data');

  function tryKey() {
    const key = input.value.trim();
    socket.emit('auth:observer', { key });
  }

  submitKeyButton.onclick = tryKey;
  input.onkeydown = (e) => { if (e.key === 'Enter') tryKey(); };

  socket.on('auth:observer:result', (ok) => {
    if (ok) {
      observerKey = input.value.trim();
      modal.style.display = 'none';
      error.style.display = 'none';
      socket.emit('fetch:data');
    } else {
      error.style.display = 'block';
      input.value = '';
    }
  });
});

// Listen for car data
// Listen for car data
socket.on('update:data', (data) => {
  cars = data.cars || [];
  lapCounts = {};
  console.log(data)
  console.log(data.raceState)
  console.log(data.raceState.laps)
  
  if (data.raceState && data.raceState.laps) {
    lapCounts = data.raceState.laps;
  }
  
  // Load fastest lap times from driver data
  if (data.drivers && data.raceState && data.raceState.currentSession) {
    const currentSession = data.raceState.currentSession;
    const sessionDrivers = data.drivers[currentSession] || [];
    sessionDrivers.forEach(driver => {
      if (driver.fastestLap) {
        bestLapTimes[driver.car] = driver.fastestLap;
      }
    });
  }
  
  // Set race start time if race is active but we don't have it yet
  if (data.raceState && data.raceState.active && data.raceState.startTime && !raceStartTime) {
    raceStartTime = data.raceState.startTime;
    console.log("Race start time set from loaded data:", raceStartTime);
  }
  
  if (data.raceState && data.raceState.lapTimestamps) {
    lapTimestamps = { ...data.raceState.lapTimestamps };
  }
  raceActive = !!(data.raceState && data.raceState.active);
  console.log("From data center" + raceActive)
  updateLapButtons();
  updateLapCounts();
});


// Race state
socket.on('raceStarted', (state) => {
  console.log("RACE STARTED")
  console.log(state);
  raceActive = true;
  raceStartTime = state.startTime || Date.now();
  // Load best lap times from backend
  if (state.bestLaps) {
    bestLapTimes = { ...state.bestLaps };
  } else {
    bestLapTimes = {};
  }
  if (state.lapTimestamps) {
    lapTimestamps = { ...state.lapTimestamps };
  } else {
    lapTimestamps = {};
  }
  updateLapButtons();
  updateLapCounts();
  console.log("Status of the race :  " + raceActive)
});
socket.on('raceFinished', (state) => {
  raceActive = false;
  updateLapButtons();
});
socket.on('sessionEnded', () => {
  lapCounts = {};
  bestLapTimes = {};
  lapTimestamps = {};
  raceActive = false;
  raceStartTime = null;
  updateLapButtons();
  updateLapCounts();
});

// Lap buttons
function updateLapButtons() {
  const container = document.getElementById('lapButtons');
  container.innerHTML = '';
  console.log(cars);
  if (cars.length === 0) {
    return;
  }
  cars.forEach(car => {
    const lapButton = document.createElement('button');
    lapButton.className = 'lap-btn';
    lapButton.textContent = car;
    console.log(!raceActive)
    lapButton.disabled = !raceActive;
    lapButton.onclick = () => {
      const now = Date.now();
      if (!lapTimestamps[car]) lapTimestamps[car] = [];
      lapTimestamps[car].push(now);

      let lapTime = null;
      
      // Calculate lap time if not the first lap
      if (lapTimestamps[car].length > 1) {
        const prev = lapTimestamps[car][lapTimestamps[car].length - 2];
        lapTime = now - prev;
        console.log(`Lap ${lapTimestamps[car].length} for ${car}: ${lapTime}ms (previous lap to current)`);
        if (!bestLapTimes[car] || lapTime < bestLapTimes[car]) {
          bestLapTimes[car] = lapTime;
        }
      } else if (raceStartTime) {
        // First lap: time since race start
        lapTime = now - raceStartTime;
        console.log(`First lap for ${car}: ${lapTime}ms (race start to now)`);
        console.log(`Race started at: ${raceStartTime}, Current time: ${now}`);
        bestLapTimes[car] = lapTime;
      } else {
        console.log(`No lap time calculated for ${car} - no race start time available`);
      }

      console.log(bestLapTimes)
      console.log(bestLapTimes["Car A"])
      console.log(bestLapTimes["Car B"])
      
      // Send lap completion with lap time to backend
      socket.emit('lap:completed', { car, key: observerKey, lapTime });
      socket.emit('lap:done' , {
      value : bestLapTimes
      });
      console.log("Lap completed with time:", lapTime);
      updateLapCounts();
    };
    container.appendChild(lapButton);
  });
}

// Counter for laps and best lap times
function updateLapCounts() {
  const container = document.getElementById('lapCounts');
  container.innerHTML = '<h2>Lap Counts & Best Lap</h2>';
  cars.forEach(car => {
    const count = lapCounts[car] || 0;
    let best = bestLapTimes[car];
    let bestStr = best ? (best / 1000).toFixed(2) + ' s' : '-';
    container.innerHTML += `<div>${car}: ${count} laps | Best Lap: ${bestStr}</div>`;

  });
}