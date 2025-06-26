const socket = io();

let nextSession = null;


socket.emit('fetch:current-session');

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('raceStarted', (state) => {
    console.log('Race has started:', state);
    // Optionally update UI based on state
    // Update upcoming race
});
socket.on('raceFinished', (state) => {
    console.log('Race has finished:', state);
    // Optionally update UI based on state
    // Reload the page
});

socket.on('modeChanged', ({ mode, flag }) => {
    console.log(`Mode changed to ${mode}, flag: ${flag}`);
    // Optionally update button text or flag screen
});
socket.on('receive:current-session', (currentSession) => {
    nextSession = currentSession;

})


let raceControlKey = null;

const start = document.getElementById('start-race');
const safe = document.getElementById('safe-race');
const stop = document.getElementById('stop-race');
const hazard = document.getElementById('hazard-race');
const finish = document.getElementById('finish-race');
const end = document.getElementById('end-session');
const newRace = document.getElementById('start-new-race');
const logoutBtn = document.getElementById('logoutBtn');
const currentRace = document.getElementById('current-race');
const nextRace = document.getElementById('upcoming-race');



function startRace() {


if (nextSession !== null) {
    currentRace.style.display = 'inline-block';
    currentRace.innerHTML = nextSession;
    nextRace.style.display = 'none';
    socket.emit('race:start');
    document.querySelector('h2').innerHTML = "Current Race";
    start.style.display = 'none';
    safe.style.display = 'inline-block';
    stop.style.display = 'inline-block';
    hazard.style.display = 'inline-block';
    finish.style.display = 'inline-block';
    logoutBtn.style.display = 'none';

} else {
    currentRace.innerHTML = "No races scheduled";
}
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
    start.style.display = 'none';
    safe.style.display = 'none';
    stop.style.display = 'none';
    hazard.style.display = 'none';
    finish.style.display = 'none';
    end.style.display = 'inline-block';

}

function endSession() {
    socket.emit('race:endSession');
    end.style.display = 'none';
    logoutBtn.style.display = 'block';
    socket.emit('fetch:current-session');
    currentRace.style.display = 'none';

    socket.on('receive:current-session', (session) => {
        nextSession = session;
        if (nextSession) {
            console.log(nextSession + "The race exists")
            document.querySelector('h2').innerHTML = "Upcoming race";
            nextRace.style.display = 'block';
            nextRace.innerHTML = nextSession;
            newRace.style.display = 'block';
        } else {
            console.log("No race exists with: " + currentRace)
            document.getElementById('no-races').style.display = 'block';
            nextRace.innerHTML = "";

        }
    })
}



function proceedToTheNewRace() {
    newRace.style.display = 'none';
    startRace();
}

function logout() {
    document.location.reload();
}

socket.on('connect', () => {
    console.log('Connected to server');
});

// Show modal and handle key entry
window.addEventListener('DOMContentLoaded', () => {
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
            error.style.display = 'none'; // Hide error on success
            currentRace.innerHTML = nextSession;
            start.style.display = 'inline-block';

            start.onclick = startRace;
            safe.onclick = safeRace;
            stop.onclick = stopRace;
            hazard.onclick = reportHazard;
            finish.onclick = finishRace;
            end.onclick = endSession;
            newRace.onclick = proceedToTheNewRace;
            logoutBtn.onclick = logout;

        } else {
            error.style.display = 'block'; // <-- This will show the error!
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