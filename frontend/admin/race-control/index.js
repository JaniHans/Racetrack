const socket = io();

function startRace() {
    socket.emit('race:start');
}

function stopRace() {
    socket.emit('race:stop');
}

function reportHazard() {
    socket.emit('race:hazard');
}

function resetRace() {
    socket.emit('race:reset');
}

socket.on('connect', () => {
    console.log('Connected to server');
});