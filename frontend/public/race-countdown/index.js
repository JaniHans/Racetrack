const socket = io();

let timerInterval = null;

socket.emit('fetch:data')
const timerContainer = document.getElementById('time');

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('raceStarted', (state) => {
    console.log('Race has started:', state);
    // Optionally update UI based on state
    // Start the timer
    let startTime = state.raceState.startTime;
    let countdown = state.raceState.countdown;
    startTimer(startTime, countdown)
});
socket.on('raceFinished', (state) => {
    console.log('Race has finished:', state);

    // Optionally update UI based on state
    // Reload the timer
    finishRace(state)
});
socket.on('update:data', (state) => {
    console.log(state)
    let startTime = state.raceState.startTime;
    let countdown = state.raceState.countdown;
    startTimer(startTime, countdown)
});

function startTimer(startTime, countdown) {

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(function () {
       const now = Date.now();

       let difference = now - startTime;
       let timer = (countdown * 1000) - difference;
       let minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
       let seconds = Math.floor((timer % (1000 * 60)) / 1000);

       timerContainer.innerHTML = minutes + "m " + seconds + "s"

       if (timer < 0) {
           clearInterval(timerInterval);
           timerContainer.innerHTML = "RACE FINISHED";
       }
   }, 1000);

}

function finishRace(startTime) {
    console.log(startTime)
    console.log(startTime.startTime)
    console.log("timer interval" + timerInterval)
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (!startTime) {
     timerContainer.innerHTML = "RACE FINISHED";
 }
}
