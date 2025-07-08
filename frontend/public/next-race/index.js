const socket = io();

let raceSessions = [];
let drivers = {};

socket.emit('fetch:data');

socket.on('update:data', (data) => {
  raceSessions = data.sessions;
  drivers = data.drivers;
  updateUI();
});

socket.on('sessionEnded', (raceState) => {
  console.log(raceState.active)
  if (!raceState.active) {
   proceedToThePaddock();
  }
});



function updateUI() {
  const sessionTables = document.getElementById('sessionTables');
  sessionTables.innerHTML = '';

  raceSessions.forEach((session) => {
    const sessionContainer = document.createElement('div');
    sessionContainer.style.marginBottom = '2rem';

    const sessionHeader = document.createElement('div');
    sessionHeader.style.display = 'flex';
    sessionHeader.style.alignItems = 'center';
    sessionHeader.style.justifyContent = 'space-between';
    sessionHeader.style.marginBottom = '1rem';

    const sessionTitle = document.createElement('h3');
    sessionTitle.textContent = `Session: ${session}`;
    sessionTitle.style.margin = '0';

    sessionHeader.appendChild(sessionTitle);
    sessionContainer.appendChild(sessionHeader);

    const table = document.createElement('table');
    table.id = `table-${session}`;
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Driver Name</th><th>Assigned Car</th>`;
    table.appendChild(headerRow);

    if (drivers[session]) {
      drivers[session].forEach(({ name, car }) => {
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
    sessionTables.appendChild(sessionContainer);
  });
}

function proceedToThePaddock() {
  alert("DRIVERS PROCEED TO THE PADDOCK");
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