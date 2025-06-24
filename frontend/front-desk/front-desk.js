const socket = io();

let raceSessions = [];
let drivers = {};

socket.emit('fetch:data');

socket.on('update:data', (data) => {
  raceSessions = data.sessions;
  drivers = data.drivers;
  updateUI();
});

function updateUI() {
  const sessionSelect = document.getElementById('sessionSelect');
  const sessionTables = document.getElementById('sessionTables');

  sessionSelect.innerHTML = '';
  sessionTables.innerHTML = '';

  raceSessions.forEach((session) => {
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

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove Session';
    removeButton.className = 'remove';
    removeButton.onclick = () => removeRaceSession(session);

    sessionHeader.appendChild(sessionTitle);
    sessionHeader.appendChild(removeButton);
    sessionContainer.appendChild(sessionHeader);

    // Table
    const table = document.createElement('table');
    table.id = `table-${session}`;
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>Driver Name</th><th style="width: 150px; text-align: right;">Actions</th>`;
    table.appendChild(headerRow);

    if (drivers[session]) {
      drivers[session].forEach((driver) => {
        const row = document.createElement('tr');

        const driverCell = document.createElement('td');
        driverCell.textContent = driver.name;

        const actionsCell = document.createElement('td');
        actionsCell.style.textAlign = 'right';
        actionsCell.style.width = '150px';

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
        editDriverButton.onclick = () => {
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
            updateUI();
          };

          cancelBtn.onclick = () => {
            updateUI();
          };
        };

        actionsContainer.appendChild(removeDriverButton);
        actionsContainer.appendChild(editDriverButton);
        actionsCell.appendChild(actionsContainer);

        row.appendChild(driverCell);
        row.appendChild(actionsCell);

        table.appendChild(row);
      });
    }

    sessionContainer.appendChild(table);
    sessionTables.appendChild(sessionContainer);
  });
}

function addRaceSession() {
  const newSessionName = document.getElementById('newSessionName').value.trim();
  if (newSessionName && !raceSessions.includes(newSessionName)) {
    socket.emit('session:add', newSessionName);
    document.getElementById('newSessionName').value = '';
  } else {
    alert('Session name must be unique.');
  }
}

function removeRaceSession(session) {
  if (session) {
    socket.emit('session:remove', session);
  }
}

function addDriver() {
  let driverName = document.getElementById('driverName').value;
  driverName = typeof driverName === 'string' ? driverName.trim() : String(driverName).trim();
  const selectedSession = document.getElementById('sessionSelect').value;

  if (driverName && selectedSession) {
    socket.emit('driver:add', { session: selectedSession, name: driverName });
    document.getElementById('driverName').value = '';
  } else {
    alert('Driver name and session must be selected.');
  }
}

function removeDriver(session, driverName) {
  if (session && driverName) {
    socket.emit('driver:remove', { session, name: driverName });
  }
}

function editDriver(session, oldName, newName) {
  socket.emit('driver:edit', { session, oldName, newName });
}

// Handle driver limit error
socket.on('error:driverLimit', ({ session, message }) => {
  alert(`Driver limit reached for session "${session}": ${message}`);
});