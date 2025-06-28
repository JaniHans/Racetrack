const socket = io();

let cars = [];
let lapCounts = {};
let observerKey = null;
let raceActive = false;

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
  updateLapButtons();
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
      socket.emit('lap:completed', { car, key: observerKey });
    };
    container.appendChild(lapButton);
  });
}

// Counter for laps
function updateLapCounts() {
  const container = document.getElementById('lapCounts');
  container.innerHTML = '<h2>Lap Counts</h2>';
  cars.forEach(car => {
    const count = lapCounts[car] || 0;
    container.innerHTML += `<div>Car ${car}: ${count}</div>`;
  });
}