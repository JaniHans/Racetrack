const socket = io();

let raceSessions = [];
let drivers = {};
let cars = [];
let raceActive = null;

// Add at the top
let receptionistKey = null;

socket.emit('fetch:data');

socket.on('update:data', (data) => {
  raceSessions = data.sessions;
  drivers = data.drivers;
  cars = data.cars || cars; // fallback if not sent
  console.log("UPDATING DATA")
  console.log(data)
  raceActive = data.raceState.active;
  console.log(raceActive)
  let ignoreUpdateFromLapLineTracker= data?.ignoreReceptionist ?? false;
  console.log("Ignore lapline " + ignoreUpdateFromLapLineTracker);
  if (!ignoreUpdateFromLapLineTracker) {
    updateUI();
  }

});

socket.on('raceStarted', (state) => {
  console.log('Race has started:', state);
  removeRunningRace();
  // Optionally update UI based on state
  // Update upcoming race
});

function removeRunningRace() {
  const container = document.getElementById("sessionTables");
  console.log(container)

  const firstChildDiv = container.querySelector("div");
  console.log(firstChildDiv)
  if (firstChildDiv) {
    console.log("Removing current session")
    container.removeChild(firstChildDiv);
  }
}

function updateUI() {
  const sessionSelect = document.getElementById('sessionSelect');
  const sessionTables = document.getElementById('sessionTables');

  sessionSelect.innerHTML = '';
  sessionTables.innerHTML = '';
  console.log(raceSessions)

  if (raceActive) {
    raceSessions.shift();
  }

  raceSessions.forEach((session) => {

    // counter++;
    // if (raceActive && counter === 1) {
    //   return;
    // }

    // Populate session select dropdown
    const option = document.createElement('option');
    option.value = session;
    option.textContent = session;
    sessionSelect.appendChild(option);

    // Session container
    const sessionContainer = document.createElement('div');
    sessionContainer.style.marginBottom = '2rem';

    // Session header
    const sessionHeader = document.createElement('div');
    sessionHeader.style.display = 'flex';
    sessionHeader.style.alignItems = 'center';
    sessionHeader.style.justifyContent = 'space-between';
    sessionHeader.style.marginBottom = '1rem';

    const sessionTitle = document.createElement('h3');
    sessionTitle.textContent = `Session: ${session}`;
    sessionTitle.style.margin = '0';

    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.gap = '1rem';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove Session';
    removeButton.className = 'remove';
    removeButton.onclick = () => removeRaceSession(session);

    const lockInButton = document.createElement('button');
    lockInButton.textContent = 'Lock In';
    lockInButton.className = 'add';
    lockInButton.onclick = () => lockInSession(session);

    buttonGroup.appendChild(removeButton);
    buttonGroup.appendChild(lockInButton);

    sessionHeader.appendChild(sessionTitle);
    sessionHeader.appendChild(buttonGroup);
    sessionContainer.appendChild(sessionHeader);

    // Table
    const table = document.createElement('table');
    table.id = `table-${session}`;
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Driver Name</th><th>Assigned Car</th><th style="width: 220px; text-align: right;">Actions</th>`;
    table.appendChild(headerRow);

    if (drivers[session]) {
      drivers[session].forEach((driver) => {
        let editing = false; // Track if this row is in edit mode

        const row = document.createElement('tr');

        const driverCell = document.createElement('td');
        driverCell.textContent = driver.name;

        const carCell = document.createElement('td');
        carCell.textContent = driver.car || '';

        const actionsCell = document.createElement('td');
        actionsCell.style.textAlign = 'right';
        actionsCell.style.width = '220px';

        const actionsContainer = document.createElement('div');
        actionsContainer.style.display = 'flex';
        actionsContainer.style.gap = '0.5rem';

        const removeDriverButton = document.createElement('button');
        removeDriverButton.textContent = 'Remove Driver';
        removeDriverButton.className = 'remove';
        removeDriverButton.onclick = () => removeDriver(session, driver.name);

        const editDriverButton = document.createElement('button');
        editDriverButton.textContent = 'Edit Driver';
        editDriverButton.className = 'edit';

        const editCarButton = document.createElement('button');
        editCarButton.textContent = 'Edit Car';
        editCarButton.className = 'edit';

        // --- Edit Driver Logic ---
        editDriverButton.onclick = () => {
          // Hide Edit Car button
          editCarButton.style.display = 'none';

          // Inline editing with Save/Cancel
          const input = document.createElement('input');
          input.type = 'text';
          input.value = driver.name;
          input.style.background = '#fff';
          input.style.color = '#000';
          input.style.width = '80%';
          input.style.borderRadius = '4px';
          input.style.border = '1px solid #ccc';
          input.style.padding = '0.25rem';

          editDriverButton.textContent = 'Save';
          editDriverButton.className = 'add';

          let cancelBtn = actionsContainer.querySelector('.cancel-edit');
          if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.className = 'remove cancel-edit';
            cancelBtn.style.marginLeft = '0.5rem';
            actionsContainer.appendChild(cancelBtn);
          }

          driverCell.innerHTML = '';
          driverCell.appendChild(input);
          input.focus();

          editDriverButton.onclick = () => {
            const newDriverName = input.value.trim();
            if (newDriverName && newDriverName !== driver.name) {
              editDriver(session, driver.name, newDriverName);
            }
            // Restore buttons
            editDriverButton.textContent = 'Edit Driver';
            editDriverButton.className = 'edit';
            editCarButton.style.display = '';
            cancelBtn.remove();
            updateUI();
          };

          cancelBtn.onclick = () => {
            // Restore buttons
            editDriverButton.textContent = 'Edit Driver';
            editDriverButton.className = 'edit';
            editCarButton.style.display = '';
            cancelBtn.remove();
            updateUI();
          };
        };

        // --- Edit Car Logic ---
        editCarButton.onclick = () => {
          // Hide Edit Driver button
          editDriverButton.style.display = 'none';

          // Create a dropdown for car selection
          const carSelect = document.createElement('select');
          cars.forEach(car => {
            const option = document.createElement('option');
            option.value = car;
            option.textContent = car;
            if (car === driver.car) option.selected = true;
            carSelect.appendChild(option);
          });

          editCarButton.textContent = 'Save';
          editCarButton.className = 'add';

          let cancelCarBtn = actionsContainer.querySelector('.cancel-edit-car');
          if (!cancelCarBtn) {
            cancelCarBtn = document.createElement('button');
            cancelCarBtn.textContent = 'Cancel';
            cancelCarBtn.className = 'remove cancel-edit-car';
            cancelCarBtn.style.marginLeft = '0.5rem';
            actionsContainer.appendChild(cancelCarBtn);
          }

          carCell.innerHTML = '';
          carCell.appendChild(carSelect);
          carSelect.focus();

          editCarButton.onclick = () => {
            const newCar = carSelect.value;
            if (newCar && newCar !== driver.car) {
              editCar(session, driver.name, newCar);
            }
            // Restore buttons
            editCarButton.textContent = 'Edit Car';
            editCarButton.className = 'edit';
            editDriverButton.style.display = '';
            cancelCarBtn.remove();
            updateUI();
          };

          cancelCarBtn.onclick = () => {
            // Restore buttons
            editCarButton.textContent = 'Edit Car';
            editCarButton.className = 'edit';
            editDriverButton.style.display = '';
            cancelCarBtn.remove();
            updateUI();
          };
        };

        actionsContainer.appendChild(removeDriverButton);
        actionsContainer.appendChild(editDriverButton);
        actionsContainer.appendChild(editCarButton);
        actionsCell.appendChild(actionsContainer);

        row.appendChild(driverCell);
        row.appendChild(carCell);
        row.appendChild(actionsCell);

        table.appendChild(row);
      });
    }

    sessionContainer.appendChild(table);
    sessionTables.appendChild(sessionContainer);
  });

  // Populate car dropdown
  const carSelect = document.getElementById('carSelect');
  if (carSelect) {
    carSelect.innerHTML = '<option value="">Auto-assign car</option>';
    cars.forEach(car => {
      const option = document.createElement('option');
      option.value = car;
      option.textContent = car;
      carSelect.appendChild(option);
    });
  }
}

function addRaceSession() {
  const newSessionName = document.getElementById('newSessionName').value.trim();
  if (newSessionName && !raceSessions.includes(newSessionName)) {
    socket.emit('session:add', { newSessionName, key: receptionistKey });
    document.getElementById('newSessionName').value = '';
  } else {
    alert('Session name must be unique.');
  }
}

function removeRaceSession(session) {
  if (session) {

    socket.emit('session:remove', { session, key: receptionistKey });
  }
}

function addDriver() {
  let driverName = document.getElementById('driverName').value;
  driverName = typeof driverName === 'string' ? driverName.trim() : String(driverName).trim();
  const selectedSession = document.getElementById('sessionSelect').value;
  const selectedCar = document.getElementById('carSelect').value;

  if (driverName && selectedSession) {
    socket.emit('driver:add', { session: selectedSession, name: driverName, car: selectedCar || null, key: receptionistKey });
    document.getElementById('driverName').value = '';
    document.getElementById('carSelect').value = '';
  } else {
    alert('Driver name and session must be selected.');
  }
}

function removeDriver(session, driverName) {
  if (session && driverName) {
    socket.emit('driver:remove', { session, name: driverName, key: receptionistKey });
  }
}

function editDriver(session, oldName, newName) {
  socket.emit('driver:edit', { session, oldName, newName, key: receptionistKey });
}

function editCar(session, driverName, newCar) {
  socket.emit('driver:editCar', { session, name: driverName, car: newCar, key: receptionistKey });
}

function lockInSession(session) {
  socket.emit('session:lockin', { session, key: receptionistKey });
}

// Handle driver limit error
socket.on('error:driverLimit', ({ session, message }) => {
  alert(`Driver limit reached for session "${session}": ${message}`);
});

// Handle driver exists error
socket.on('error:driverExists', ({ session, message }) => {
  alert(`Driver already exists in session "${session}": ${message}`);
});

// Show modal and handle key entry
window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('keyModal');
  const input = document.getElementById('receptionistKeyInput');
  const btn = document.getElementById('submitKeyBtn');
  const error = document.getElementById('keyError');

  function tryKey() {
    const key = input.value.trim();
    socket.emit('auth:receptionist', { key });
  }

  btn.onclick = tryKey;
  input.onkeydown = (e) => { if (e.key === 'Enter') tryKey(); };

  socket.on('auth:receptionist:result', (ok) => {
    if (ok) {
      receptionistKey = input.value.trim();
      modal.style.display = 'none';
      error.style.display = 'none'; // Hide error on success
    } else {
      error.style.display = 'block'; // <-- This will show the error!
      input.value = '';
    }
  });

  // Add logout button handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = logoutReceptionist;
  }
});

// Add this function to show the key modal and clear the key
function logoutReceptionist() {
  receptionistKey = null;
  // Show the modal again
  const modal = document.getElementById('keyModal');
  const input = document.getElementById('receptionistKeyInput');
  const error = document.getElementById('keyError');
  modal.style.display = '';
  error.style.display = 'none';
  input.value = '';
}