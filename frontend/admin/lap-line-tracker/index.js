const socket = io();

let cars = [];
let lapCounts = {};
let observerKey = null;
let raceActive = false;
let lapTimestamps = {}; // car -> [timestamps]
let bestLapTimes = {};  // car -> ms
let raceStartTime = null;

window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('keyModal');
  const input = document.getElementById('observerKeyInput');
  const submitKeyButton = document.getElementById('submitKeyBtn');
  const error = document.getElementById('keyError');

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
socket.on('update:data', (data) => {
  cars = data.cars || [];
  lapCounts = {};
  if (data.raceState && data.raceState.laps) {
    lapCounts = data.raceState.laps;
  }
  updateLapButtons();
  updateLapCounts();
});

// Race state
socket.on('raceStarted', (state) => {
  raceActive = true;
  raceStartTime = state.startTime || Date.now();
  lapTimestamps = {};
  bestLapTimes = {};
  updateLapButtons();
  updateLapCounts();
});
socket.on('raceFinished', (state) => {
  raceActive = false;
  updateLapButtons();
});

// Lap buttons
function updateLapButtons() {
  const container = document.getElementById('lapButtons');
  container.innerHTML = '';
  cars.forEach(car => {
    const lapButton = document.createElement('button');
    lapButton.className = 'lap-btn';
    lapButton.textContent = car;
    lapButton.disabled = !raceActive;
    lapButton.onclick = () => {
      const now = Date.now();
      if (!lapTimestamps[car]) lapTimestamps[car] = [];
      lapTimestamps[car].push(now);

      // Calculate lap time if not the first lap
      if (lapTimestamps[car].length > 1) {
        const prev = lapTimestamps[car][lapTimestamps[car].length - 2];
        const lapTime = now - prev;
        if (!bestLapTimes[car] || lapTime < bestLapTimes[car]) {
          bestLapTimes[car] = lapTime;
        }
      } else if (raceStartTime) {
        // First lap: time since race start
        const lapTime = now - raceStartTime;
        bestLapTimes[car] = lapTime;
      }

      socket.emit('lap:completed', { car, key: observerKey });
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
    container.innerHTML += `<div>Car ${car}: ${count} laps | Best Lap: ${bestStr}</div>`;
  });
}