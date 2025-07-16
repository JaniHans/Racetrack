const socket = io();

let raceSessions = [];
let drivers = {};
let currentSession;
let raceActive;

socket.emit('fetch:data');

socket.on('update:data', (data) => {
  console.log(data)
  console.log("UPDATE UI")
  raceSessions = data.sessions;
  drivers = data.drivers;
  raceActive = data?.raceState.active ?? false;
  currentSession = data?.raceState.currentSession ?? null;
  if (raceActive && currentSession) {
    raceSessions.shift();
    delete drivers[currentSession];
    updateUI();
  }

  updateUI();
});

socket.on('sessionEnded', (raceState) => {
  console.log("PROCEED TO THE PADDOCK")
  console.log(raceState.active)
  if (!raceState.active) {
   proceedToThePaddock();
  }
});

const noUpcoming = document.createElement('div');
// noUpcoming.innerHTML = "No upcoming sessions";


function updateUI() {
  const sessionTables = document.getElementById('sessionTables');
  sessionTables.innerHTML = '';
  console.log(raceSessions.length);

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
    sessionTables.appendChild(sessionContainer);

  if (raceSessions.length === 0 ) {
    console.log("From update")
    console.log(noUpcoming)
    noUpcoming.innerHTML = "No upcoming sessions";
    document.body.append(noUpcoming);

  } else {
    noUpcoming.innerHTML = "";
  }
}


function proceedToThePaddock() {
  if (raceSessions.length !== 0) {
    alert("DRIVERS PROCEED TO THE PADDOCK");
  } else {
    console.log("From proceed to paddock end session")
    noUpcoming.innerHTML = "";
    noUpcoming.innerHTML = "No upcoming sessions";
  }
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
