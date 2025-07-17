const socket = io();

let currentSession = null;
let raceActive;
let raceSessions = [];
let drivers = {};
let cars = [];
let automaticFinish = false;

const start = document.getElementById('start-race');
const safe = document.getElementById('safe-race');
const stop = document.getElementById('stop-race');
const hazard = document.getElementById('hazard-race');
const finish = document.getElementById('finish-race');
const end = document.getElementById('end-session');

const thisRace = document.getElementById('this-race');
const header = document.createElement("h2");
const upcomingRace = document.getElementById('upcoming-race');
const upcomingRaceContainer = document.createElement('upcoming-race-container')

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('raceStarted', (state) => {
    console.log('Race has started:', state);
    raceActive = state.active;
    console.log(state);
    console.log(raceActive + " Race has started")
    // Optionally update UI based on state
    // Update upcoming race
});
socket.on('raceFinished', (state) => {
    console.log('Race has finished:', state);
    console.log(state);
    raceActive = state.active;
    console.log(raceActive)
    // Optionally update UI based on state
    // Reload the page
    finishRaceButtonsProcedure();
});

socket.on('modeChanged', ({ mode, flag }) => {
    console.log(`Mode changed to ${mode}, flag: ${flag}`);
    // Optionally update button text or flag screen
});
socket.on('receive:current-session', (currentRace) => {
    currentSession = currentRace;

})

socket.on('update:data', (data) => {
    raceSessions = data.sessions;
    drivers = data.drivers;
    cars = data.cars || cars;
    if (data.raceState) {
        raceActive = !!data.raceState.active;
        currentSession = data.raceState.currentSession || null;
    }
    updateDriverTable();
});

function updateDriverTable() {
    const tableContainer = document.getElementById('driverTable');
    tableContainer.innerHTML = '';

    let nextSession = raceSessions[0];
    // Show next session as main heading if no current race
    if (!currentSession) {
        thisRace.innerHTML = nextSession
            ? `<b>Upcoming Race:</b> ${nextSession}`
            : 'No upcoming races';

        // Check if the next session has drivers
        const hasDrivers = nextSession && drivers[nextSession] && drivers[nextSession].length > 0;
        
        // Show Start button if there is a session, but disable if no drivers
        if (raceSessions.length) {
            start.style.display = 'inline-block';
            start.disabled = !hasDrivers;
            start.style.opacity = hasDrivers ? '1' : '0.5';
            start.style.cursor = hasDrivers ? 'pointer' : 'not-allowed';
        } else {
            start.style.display = 'none';
        }
        
        safe.style.display = 'none';
        stop.style.display = 'none';
        hazard.style.display = 'none';
        finish.style.display = 'none';
        end.style.display = 'none';

        // Show table of drivers for the upcoming session
        if (nextSession && drivers[nextSession]) {
            const table = document.createElement('table');
            table.innerHTML = `<tr><th>Driver Name</th><th>Assigned Car</th></tr>`;
            drivers[nextSession].forEach(({ name, car }) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${name}</td><td>${car}</td>`;
                table.appendChild(row);
            });
            tableContainer.appendChild(table);
        }
        return;
    } else {
        thisRace.innerHTML = "Current Race : " + currentSession;
        upcomingRace.innerHTML = raceSessions[0] === currentSession ? (raceSessions[1] || 'No upcoming races') : (raceSessions[0] || 'No upcoming races');
        upcomingRace.style.display = 'block';
    }

    // Show/hide buttons based on raceActive
    if (raceActive && currentSession) {
        start.style.display = 'none';
        safe.style.display = 'inline-block';
        stop.style.display = 'inline-block';
        hazard.style.display = 'inline-block';
        finish.style.display = 'inline-block';
        end.style.display = 'none';
    } else if (!raceActive && currentSession) {
        start.style.display = 'none';
        safe.style.display = 'inline-block';
        stop.style.display = 'inline-block';
        hazard.style.display = 'inline-block';
        finish.style.display = 'inline-block';
        end.style.display = 'none';
    } else {
        // Check if the next session has drivers
        const nextSession = raceSessions[0];
        const hasDrivers = nextSession && drivers[nextSession] && drivers[nextSession].length > 0;
        
        if (raceSessions.length) {
            start.style.display = 'inline-block';
            start.disabled = !hasDrivers;
            start.style.opacity = hasDrivers ? '1' : '0.5';
            start.style.cursor = hasDrivers ? 'pointer' : 'not-allowed';
        } else {
            start.style.display = 'none';
        }
        
        safe.style.display = 'none';
        stop.style.display = 'none';
        hazard.style.display = 'none';
        finish.style.display = 'none';
        end.style.display = 'none';
    }

    // Show driver table for current session
    const table = document.createElement('table');
    table.innerHTML = `<tr><th>Driver Name</th><th>Assigned Car</th></tr>`;

    if (drivers[currentSession]) {
        drivers[currentSession].forEach(({ name, car }) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${name}</td><td>${car}</td>`;
            table.appendChild(row);
        });
    }

    tableContainer.appendChild(table);
}

// Call updateDriverTable on page load in case data arrives late
document.addEventListener('DOMContentLoaded', updateDriverTable);

let raceControlKey = null;


function startRace() {
    socket.emit('race:start');
}

function safeRace() {
    socket.emit('race:safe');
}

function stopRace() {
    socket.emit('race:stop');

}

function reportHazard() {
    socket.emit('race:hazard');
}

function finishRace() {

    socket.emit('race:finish');
    finishRaceButtonsProcedure();

}
function endSession() {
    socket.emit('race:endSession')
    end.style.display = 'none';
    upcomingRaceContainer.style.display = 'block';

    if (raceSessions.length !== 0) {
        console.log(raceSessions)
        console.log("START BUTTON AVAILABLE")
        
        // Check if the next session has drivers
        const nextSession = raceSessions[0];
        const hasDrivers = nextSession && drivers[nextSession] && drivers[nextSession].length > 0;
        
        start.style.display = 'inline-block';
        start.disabled = !hasDrivers;
        start.style.opacity = hasDrivers ? '1' : '0.5';
        start.style.cursor = hasDrivers ? 'pointer' : 'not-allowed';
    }
}
function finishRaceButtonsProcedure() {
    safe.style.display = 'none';
    stop.style.display = 'none';
    hazard.style.display = 'none';
    finish.style.display = 'none';
    end.style.display = 'inline-block';
    thisRace.removeChild(header);
    header.innerHTML = currentSession + " race finished"
    thisRace.appendChild(header);
}

function logout() {
    document.location.reload();
}

socket.on('connect', () => {
    console.log('Connected to server');
});

// Show modal and handle key entry
window.addEventListener('DOMContentLoaded', () => {
    console.log('------------------LOADING PAGE');
    console.log(raceActive);
    const modal = document.getElementById('keyModal');
    const input = document.getElementById('raceControlKeyInput');
    const btn = document.getElementById('submitKeyBtn');
    const error = document.getElementById('keyError');

    function tryKey() {
        const key = input.value.trim();
        socket.emit('auth:race-control', { key });
    }

    btn.onclick = tryKey;
    input.onkeydown = (e) => { if (e.key === 'Enter') tryKey(); };

    socket.on('auth:race-control:result', (ok) => {
        if (ok) {
            raceControlKey = input.value.trim();
            modal.style.display = 'none';
            error.style.display = 'none';

            start.onclick = startRace;
            safe.onclick = safeRace;
            stop.onclick = stopRace;
            hazard.onclick = reportHazard;
            finish.onclick = finishRace;
            end.onclick = endSession;
            logoutBtn.onclick = logout;

            updateDriverTable();

        } else {
            error.style.display = 'block';
            input.value = '';
        }
    });

    // Add logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = logoutSafety;
    }
});

// Add this function to show the key modal and clear the key
function logoutSafety() {
    raceControlKey = null;
    // Show the modal again
    const modal = document.getElementById('keyModal');
    const input = document.getElementById('raceControlKeyInput');
    const error = document.getElementById('keyError');
    modal.style.display = '';
    error.style.display = 'none';
    input.value = '';
}

socket.on('session:lockedin', ({ session }) => {
    const currentRace = document.getElementById('this-race');
    if (currentRace) {
        currentRace.innerHTML = `<span style="color:#4caf50;font-weight:bold;">Ready: ${session}</span>`;
    }
});