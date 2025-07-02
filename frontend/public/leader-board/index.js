const socket = io();

let currentSession = null;
let raceActive = false;
let raceSessions = [];
let drivers = {};
let cars = [];
let currentRaceDrivers = {};
let bestTimes = {};
let metaData = null;


const tableContainer = document.getElementById('driverTable');

socket.on('connect', () => {
    console.log('Connected to server');

});
// only update table if first session not true or if sessionEnded
socket.on('raceStarted', (state) => {
    console.log('Race has started:', state);
    raceActive = state.active;
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
    raceActive = state.active;

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
    metaData = data;
    if (raceActive) {
        updateStats()
    } else {
        updateDriverTable()
    }


    console.log("current race drivers " + currentRaceDrivers);
    console.log("METADATA " + metaData);
});
socket.on('lap:done', (bestLapTimes) => {
    console.log("RECEIVING CAR AND BEST TIME BELOW")
    console.log(bestLapTimes.value);
    bestTimes = bestLapTimes.value;
    updateStats();
})

function updateDriverTable() {

    if (!raceActive) {

        console.log("CREATING TABLE")
        tableContainer.innerHTML = "";

        const session = raceSessions[0]
        // Show only the first session (current/upcoming)

        currentSession = session;


        const table = document.createElement('table');
        table.innerHTML = `<tr><th>Driver Name</th><th>Assigned Car</th><th>Fastest Lap</th><th>Current Lap</th></tr>`;

        currentRaceDrivers = drivers;

        if (drivers[session]) {
            drivers[session].forEach(({ name, car, fastestLap, currentLap }) => {
                const row = document.createElement('tr');

                row.innerHTML = `<td>${name}</td><td>${car}</td><td>${fastestLap}</td><td>${currentLap}</td>`;
                table.appendChild(row);
            });
        }

        tableContainer.appendChild(table);
    }
}
function updateStats() {
    if (raceActive) {
        console.log("UPDATING TABLE")
        tableContainer.innerHTML = "";

        // sort times
        const newBestTimes = sortTimes(bestTimes);
        console.log("NEW SORTED OBJECGT " + newBestTimes)
        // Show only the first session (current/upcoming)

        const table = document.createElement('table');
        table.innerHTML = `<tr><th>Driver Name</th><th>Assigned Car</th><th>Fastest Lap</th><th>Current Lap</th></tr>`;

        if (currentRaceDrivers[currentSession]) {
            currentRaceDrivers[currentSession].forEach(({ name, car, fastestLap, currentLap }) => {


                const row = document.createElement('tr');

                if (newBestTimes[car]) {
                    let bestStr = newBestTimes[car] ? (newBestTimes[car] / 1000).toFixed(2) + ' s' : ' - ';
                    row.innerHTML = `<td>${name}</td><td>${car}</td><td>${bestStr}</td><td>${metaData.raceState.laps[car]}</td>`;
                    table.appendChild(row);
                } else {
                    row.innerHTML = `<td>${name}</td><td>${car}</td><td>${fastestLap}</td><td>${metaData.raceState.laps[car]}</td>`;
                    table.appendChild(row);
                }

            });
        }

        tableContainer.appendChild(table);
    }

}

function sortTimes(object) {
    const sortedCars = Object.entries(object)
        .sort(([, a], [,b]) => a - b);

    const sortedObject = Object.fromEntries(sortedCars);
    return sortedObject;
}
// Call updateDriverTable on page load in case data arrives late