const socket = io();
let previousFlag = null;

socket.on('raceStarted', (state) => {
    updateFlagScreen(state.flag); // should be 'GREEN' initially
});

socket.on('modeChanged', ({ mode, flag }) => {
    console.log(`Mode changed to ${mode}, flag: ${flag}`);
    updateFlagScreen(flag);
});
socket.on('raceFinished', (state) => {
    updateFlagScreen(state.flag); // should be 'GREEN' initially
});

function updateFlagScreen(flag) {

    if (previousFlag) {
        const previous = document.getElementById(previousFlag.toLowerCase());
        if (previous) {
            previous.style.display = 'none';
        }
    }
    const target = document.getElementById(flag.toLowerCase());
    if (target) {
        console.log('target exists', flag);
        target.style.display = 'inline-block';
        previousFlag = flag;
    } else {
        console.log('target does not exist', flag);
    }
}