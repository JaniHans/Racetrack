const socket = io();

let raceSessions = [];
let drivers = {};
let cars = [];

socket.on('connect', () => {
    console.log('Connected to server');

});
// only update table if first session not true or if sessionEnded
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

socket.on('sessionEnded', (state) => {
    console.log("Session ended")
})

socket.on('modeChanged', ({ mode, flag }) => {
    console.log(`Mode changed to ${mode}, flag: ${flag}`);
    // Optionally update button text or flag screen
});

socket.on('update:data', (data) => {
    console.log("What is the order of your calls")
    raceSessions = data.sessions;
    drivers = data.drivers;
    cars = data.cars || cars;
    updateDriverTable()
});

function updateDriverTable() {

    const tableContainer = document.getElementById('driverTable');
    console.log("DELETING THE ENTIRE TABLE")
    tableContainer.innerHTML = "";


    // Show only the first session (current/upcoming)
    const session = raceSessions[0];

    const table = document.createElement('table');
    table.innerHTML = `<tr><th>Driver Name</th><th>Assigned Car</th><th>Fastest Lap</th><th>Current Lap</th></tr>`;


    if (drivers[session]) {
        drivers[session].forEach(({ name, car, fastestLap, currentLap }) => {
            const row = document.createElement('tr');
            console.log(name + car + fastestLap + currentLap)
            row.innerHTML = `<td>${name}</td><td>${car}</td><td>${fastestLap}</td><td>${currentLap}</td>`;
            table.appendChild(row);
        });
    }

    tableContainer.appendChild(table);
}


// Call updateDriverTable on page load in case data arrives late
