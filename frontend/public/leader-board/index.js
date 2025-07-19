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
socket.on('raceStarted', (data) => {
    console.log('Race has started:', data);
    console.log(data.drivers)
    raceSessions = data.sessions;
    drivers = data.drivers;
    cars = data.cars || cars;
    raceActive = data.raceState?.active ?? false;
    console.log(raceActive)
    updateDriverTable();
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
    updateUpcomingRace();
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
    updateUpcomingRace();
    if (raceActive) {
        socket.emit('request:lap-times'); // ask for full lap data
    }

});
socket.on('lap:done', (bestLapTimes) => {
    console.log("RECEIVING CAR AND BEST TIME BELOW")
    console.log(bestLapTimes)
    bestTimes = bestLapTimes.value;

    updateStats();
})
socket.on('response:lap-times', (bestLapTimes) => {
    console.log("AFTER RELOADING")

    bestTimes = bestLapTimes.value || {};
    console.log("BESTLAP TIMES OBJECT " , bestLapTimes)
    if (Object.keys(bestTimes).length > 0) {
        console.log("true it is empty")
        updateStats();
    } else {
        updateDriverTable();
    }
})

function updateUpcomingRace() {

    currentSession = raceSessions[0];

    if (!raceActive) {
        thisRace.innerHTML = currentSession
            ? `<b>Upcoming Race:</b> ${currentSession}`
            : 'No upcoming races';
    }
}

function updateDriverTable() {

    if (raceActive) {

        console.log("CREATING TABLE")
        tableContainer.innerHTML = "";

        let session = raceSessions[0]
        // Show only the first session (current/upcoming)
        currentSession = session;

        thisRace.innerHTML = "Current Race : " + currentSession;

        const table = document.createElement('table');
        table.innerHTML = `<tr><th>Driver Name</th><th>Assigned Car</th><th>Fastest Lap</th><th>Current Lap</th></tr>`;

        currentRaceDrivers = drivers;

        if (drivers[session]) {
            drivers[session].forEach(({ name, car, fastestLap, currentLap }) => {
                const row = document.createElement('tr');
                const lapTime = fastestLap !== null && fastestLap !== undefined ?
                    (fastestLap / 1000).toFixed(2) + 's' : ' - ';
                // let lapTime = fastestLap? fastestLap : "-"


                row.innerHTML = `<td>${name}</td><td>${car}</td><td>${lapTime}</td><td>${currentLap}</td>`;
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

        // Show only the first session (current/upcoming)

        const table = document.createElement('table');
        table.innerHTML = `<tr><th>Driver Name</th><th>Assigned Car</th><th>Fastest Lap</th><th>Current Lap</th></tr>`;

        // get the list of drivers for current session
        const sessionDrivers = drivers[currentSession];

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
            // first 0 {name: 'a', car: 'Car A', fastestLap: 8070, currentLap: 2}
            // 1 {name: 'b', car: 'Car B', fastestLap: null, currentLap: 1}
            let currentLap;
            const sessionData = drivers[currentSession];
            if (Array.isArray(sessionData)) {
                sessionData.forEach(metaDriver => {
                    if (metaDriver.name === driver.name) {
                        currentLap = metaDriver.currentLap;
                    }
                });
            } else {
                console.warn("No valid session found for:", currentSession, sessionData);
            }


            // fill in the table row with driver data
            row.innerHTML = `<td>${driver.name}</td><td>${driver.car}</td><td>${bestStr}</td><td>${currentLap}</td>`;
            table.appendChild(row);
        })

        tableContainer.appendChild(table);
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
    updateUpcomingRace();
});