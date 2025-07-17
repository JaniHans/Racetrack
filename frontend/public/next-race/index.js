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
  
  // If a race is active, show only the NEXT session (the one after current)
  if (raceActive && currentSession) {
    const currentIndex = raceSessions.indexOf(currentSession);
    if (currentIndex !== -1 && currentIndex < raceSessions.length - 1) {
      // Show only the next session (the one immediately after current)
      const nextSession = raceSessions[currentIndex + 1];
      raceSessions = [nextSession];
      // Keep only the drivers for the next session
      drivers = { [nextSession]: drivers[nextSession] || [] };
    } else {
      // No next session available
      raceSessions = [];
      drivers = {};
    }
  } else if (!raceActive) {
    // When no race is active, show only the first session (next to start)
    if (raceSessions.length > 0) {
      const nextSession = raceSessions[0];
      raceSessions = [nextSession];
      drivers = { [nextSession]: drivers[nextSession] || [] };
    }
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
    
    // Show paddock message if no race is active and session has drivers
    if (!raceActive && drivers[session] && drivers[session].length > 0) {
      const paddockMessage = document.createElement('div');
      paddockMessage.style.color = 'red';
      paddockMessage.style.fontWeight = 'bold';
      paddockMessage.style.fontSize = '1.5rem';
      paddockMessage.style.marginTop = '1rem';
      paddockMessage.innerHTML = "DRIVERS PROCEED TO THE PADDOCK";
      
      sessionContainer.appendChild(paddockMessage);
    }
  });
  if (raceSessions.length === 0 ) {
    console.log("From update")
    console.log(noUpcoming)
    noUpcoming.innerHTML = "No upcoming sessions";
    document.body.append(noUpcoming);

  } else {
    noUpcoming.innerHTML = "";
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