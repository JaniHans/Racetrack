const socket = io();

let raceSessions = [];
let drivers = {};
let raceEnded = false;

socket.emit('fetch:data');

socket.on('update:data', (data) => {
  raceSessions = data.sessions;
  drivers = data.drivers;
  updateUI();
});

socket.on('sessionEnded', (raceState) => {
  if (!raceState.active) {
    raceEnded = true;
    updateUI();
  }
});

socket.on('raceStarted', () => {
  raceEnded = false;
  updateUI();
});

function updateUI() {
  const sessionTables = document.getElementById('sessionTables');
  sessionTables.innerHTML = '';

  const firstSession = raceSessions[0];
  if (!firstSession) return;

  const sessionContainer = document.createElement('div');
  sessionContainer.style.marginBottom = '2rem';

  const sessionHeader = document.createElement('div');
  sessionHeader.style.display = 'flex';
  sessionHeader.style.alignItems = 'center';
  sessionHeader.style.justifyContent = 'space-between';
  sessionHeader.style.marginBottom = '1rem';

  const sessionTitle = document.createElement('h3');
  sessionTitle.textContent = `Session: ${firstSession}`;
  sessionTitle.style.margin = '0';

  sessionHeader.appendChild(sessionTitle);
  sessionContainer.appendChild(sessionHeader);

  const table = document.createElement('table');
  table.id = `table-${firstSession}`;
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `<th>Driver Name</th><th>Assigned Car</th>`;
  table.appendChild(headerRow);

  if (drivers[firstSession]) {
    drivers[firstSession].forEach(({ name, car }) => {
      const row = document.createElement('tr');

      const driverCell = document.createElement('td');
      driverCell.textContent = name;

      const carCell = document.createElement('td');
      carCell.textContent = car;

      row.appendChild(driverCell);
      row.appendChild(carCell);

      table.appendChild(row);
    });
  }

  sessionContainer.appendChild(table);

  if (raceEnded) {
    const paddockMsg = document.createElement('div');
    paddockMsg.style.fontSize = '2rem';
    paddockMsg.style.color = '#4caf50';
    paddockMsg.style.marginTop = '2rem';
    paddockMsg.textContent = 'DRIVERS PROCEED TO THE PADDOCK';
    sessionContainer.appendChild(paddockMsg);
  }

  sessionTables.appendChild(sessionContainer);
}


document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('fullscreen');
  if (btn) {
    btn.onclick = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    };
  }
});
