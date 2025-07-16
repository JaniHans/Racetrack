const socket = io();

let timerInterval = null;


const timerContainer = document.getElementById('time');

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('raceStarted', (state) => {
    console.log('Race has started:', state);
    // Optionally update UI based on state
    // Start the timer
    startTimer(state)
});
socket.on('raceFinished', (state) => {
    console.log('Race has finished:', state);

    // Optionally update UI based on state
    // Reload the timer
    finishRace(state)
});

function startTimer(state) {

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(function () {
       const now = Date.now();

       let difference = now - state.startTime;
       let timer = (state.countdown * 1000) - difference;
       let minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
       let seconds = Math.floor((timer % (1000 * 60)) / 1000);

       timerContainer.innerHTML = minutes + "m " + seconds + "s"

       if (timer < 0) {
           clearInterval(timerInterval);
           timerContainer.innerHTML = "RACE FINISHED";
       }
   }, 1000);

}

function finishRace(state) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (!state.active) {
     timerContainer.innerHTML = "RACE FINISHED";
 }
}
