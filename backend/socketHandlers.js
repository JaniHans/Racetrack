<<<<<<< HEAD
import { EVENTS } from '../shared/events.js';
import { raceState } from './state.js';

export const initSocketHandlers = (socket, io) => {
  socket.emit(EVENTS.RACE_STATE, raceState);

  socket.on(EVENTS.START_RACE, () => {
    raceState.active = true;
    io.emit(EVENTS.RACE_STATE, raceState);
  });

  socket.on(EVENTS.UPDATE_FLAG, (flag) => {
    raceState.flag = flag;
    io.emit(EVENTS.RACE_STATE, raceState);
  });

  socket.on(EVENTS.LAP_COMPLETED, (driverId) => {
    raceState.laps[driverId] = (raceState.laps[driverId] || 0) + 1;
    io.emit(EVENTS.RACE_STATE, raceState);
  });
};
=======
import { EVENTS } from '../shared/events.js';
import { raceState } from './state.js';

export const initSocketHandlers = (socket, io) => {
  socket.emit(EVENTS.RACE_STATE, raceState);

  socket.on(EVENTS.START_RACE, () => {
    raceState.active = true;
    io.emit(EVENTS.RACE_STATE, raceState);
  });

  socket.on(EVENTS.UPDATE_FLAG, (flag) => {
    raceState.flag = flag;
    io.emit(EVENTS.RACE_STATE, raceState);
  });

  socket.on(EVENTS.LAP_COMPLETED, (driverId) => {
    raceState.laps[driverId] = (raceState.laps[driverId] || 0) + 1;
    io.emit(EVENTS.RACE_STATE, raceState);
  });
};
>>>>>>> 2fae8f1b053de707e420aad8eab9c6da3678f312
