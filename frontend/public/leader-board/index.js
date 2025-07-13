
const socket = io();

let currentSession = null;
let raceActive;
let raceSessions = [];
let drivers = {};
let cars = [];
let currentRaceDrivers = {};
let bestTimes = {};
let metaData = null;

const tableContainer = document.getElementById('driverTable');
const thisRace = document.getElementById('this-race');

socket.on('connect', () => {
    console.log('Connected to server');

});

socket.emit('fetch:data');
// only update table if first session not true or if sessionEnded
socket.on('raceStarted', (state) => {
    console.log('Race has started:', state);
    raceActive = state?.active ?? false;
    console.log(raceActive)
    // Optionally update UI based on state
    // Update upcoming race
});
socket.on('raceFinished', (state) => {
    console.log('Race has finished:', state);
    // Optionally update UI based on state
    // Reload the page
    raceActive = state.raceState?.active ?? false;
    console.log(raceActive)
});

socket.on('sessionEnded', (state) => {
    console.log("Session ended")
    raceActive = state.active;
    console.log(raceActive)

})

socket.on('modeChanged', ({ mode, flag }) => {
    console.log(`Mode changed to ${mode}, flag: ${flag}`);
    // Optionally update button text or flag screen
});

socket.on('receive:current-session', (currentRace) => {
    currentSession = currentRace;

})


socket.on('update:data', (data) => {
    console.log("What is the order of your calls")
    raceSessions = data.sessions;
    drivers = data.drivers;
    cars = data.cars || cars;
    metaData = data;
    console.log(data);

    raceActive = data.raceState?.active ?? false;
    console.log(raceActive)
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

        let session = raceSessions[0]
        // Show only the first session (current/upcoming)

        currentSession = session;



        // Show next session as main heading if no current race
        if (!currentSession) {
            thisRace.innerHTML = session
                ? `<b>Upcoming Race:</b> ${session}`
                : 'No upcoming races';
        } else {
            if (raceActive) {
                thisRace.innerHTML = "Current Race : " + currentSession;
            }
            thisRace.innerHTML = "Upcoming Race : " + currentSession;
        }
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
        thisRace.innerHTML = "Current Race : " + currentSession;
        // sort times

        const sortedTimes = Object.entries(bestTimes).sort((a, b ) => a[1] - b[1]);
        console.log(sortedTimes)
        // Show only the first session (current/upcoming)

        const table = document.createElement('table');
        table.innerHTML = `<tr><th>Driver Name</th><th>Assigned Car</th><th>Fastest Lap</th><th>Current Lap</th></tr>`;

        // get the list of drivers for current session
        const sessionDrivers = currentRaceDrivers[currentSession];

        if (!sessionDrivers) return ; // Exit if there are no drivers in the session

        // sort drivers by best lap time (lowest first)
        // use besttimes[car] if available , fallback to drivers own fastestlap
        // use infinity for missing/null values to push them to the bottom


        const sortedDrivers = [...sessionDrivers].sort((a, b) => {  // <- safe copy, original stays intact
            const timeA = bestTimes[a.car] ?? a.fastestLap ?? Infinity; // ?? returns the first value(bestTimes[a.car]) second (a.fastestlap= that is not null or undefined.
            const timeB = bestTimes[b.car] ?? b.fastestLap ?? Infinity;
            return timeA - timeB;
        });
        // loop through each driver in sorted order
        sortedDrivers.forEach(driver => {
            const row = document.createElement('tr');
            // get the best lap time from bestTimes if present, otherwise from driver object
            const bestTime = bestTimes[driver.car] ?? driver.fastestLap;

            // format lap time in seconds or show if no time available

            const bestStr = bestTime !== null && bestTime !== undefined
            ? (bestTime / 1000).toFixed(2) + 's'
                : ' - ';
            const currentLap = metaData?.raceState?.laps?.[driver.car] ?? '-';

            // fill in the table row with driver data
            row.innerHTML = `<td>${driver.name}</td><td>${driver.car}</td><td>${bestStr}</td><td>${currentLap}</td>`;
            table.appendChild(row);
        })

        tableContainer.appendChild(table);
    }

}

