export let raceState = {
  active: false,
  mode : null, // "Safe", "Hazard", "Danger", "Finish"
  flag: 'GREEN', // This should be auto-synced with mode, derived from mode, for flag displays
  currentSession : null, // // e.g., { id, name, type }
  nextSession : null, // // used by Safety Official + screens
  countdown: null,
  laps: {}, // driverId -> lap count
  currentLaps: {} // driverId > current lap
};
