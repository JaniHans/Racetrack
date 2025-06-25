const socket = io();

socket.on('raceStarted', (state) => {
    updateFlagScreen(state.flag); // should be 'GREEN' initially
});

socket.on('modeChanged', ({ flag }) => {
    updateFlagScreen(flag);
});

function updateFlagScreen(flag) {
    document.querySelector('.fullDiv').style.display = 'inline-block';

    const target = document.getElementById(flag.toLowerCase());
    if (target) {
        console.log("target exists")
    } else {
        console.log("target does not exist")
    }
    target.style.display = 'inline-block';
}