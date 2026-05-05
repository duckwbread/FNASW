const CAMERAS = [
  {
    id: "CAM 01",
    name: "Docks",
    image: "five nights at willem backround image 1.jpg",
    map: [66, 78],
    threat: [60, 58, 0.95],
    depth: 1,
    adjacent: [1, 2]
  },
  {
    id: "CAM 02",
    name: "Main Tank",
    image: "five nights at willem backround image 2.jpg",
    map: [43, 74],
    threat: [48, 56, 0.9],
    depth: 2,
    adjacent: [0, 2, 3]
  },
  {
    id: "CAM 03",
    name: "Rescue Hall",
    image: "five nights at willem backround image 3.jpg",
    map: [22, 62],
    threat: [38, 55, 0.82],
    depth: 2,
    adjacent: [0, 1, 3]
  },
  {
    id: "CAM 04",
    name: "Tunnel",
    image: "fnaf camera 1.png",
    map: [23, 36],
    threat: [50, 58, 0.78],
    depth: 3,
    adjacent: [1, 2, 4, 5]
  },
  {
    id: "CAM 05",
    name: "Penguin Walk",
    image: "five nights at willem backround image 5.jpg",
    map: [45, 25],
    threat: [64, 55, 0.82],
    depth: 4,
    adjacent: [3, 5, 6]
  },
  {
    id: "CAM 06",
    name: "Service Tunnel",
    image: "five nights at willem backround image 6.jpg",
    map: [68, 30],
    threat: [55, 57, 0.76],
    depth: 4,
    adjacent: [3, 4, 6]
  },
  {
    id: "CAM 07",
    name: "Back Gate",
    image: "five nights at willem backround image 7.jpg",
    map: [73, 52],
    threat: [46, 58, 0.72],
    depth: 5,
    adjacent: [4, 5]
  }
];

const VENT_CAMERAS = [
  {
    id: "VENT 01",
    name: "Office Intake",
    image: "vent1.jpeg",
    map: [42, 78],
    threat: [55, 58, 0.78]
  },
  {
    id: "VENT 02",
    name: "Lower Crawl",
    image: "vent2.webp",
    map: [42, 62],
    threat: [52, 58, 0.82]
  },
  {
    id: "VENT 03",
    name: "Filter Junction",
    image: "vent3.webp",
    map: [42, 46],
    threat: [54, 58, 0.88]
  },
  {
    id: "VENT 04",
    name: "Upper Bend",
    image: "vent4.webp",
    map: [42, 30],
    threat: [58, 58, 0.92]
  },
  {
    id: "VENT 05",
    name: "Back Intake",
    image: "vent5.webp",
    map: [42, 14],
    threat: [55, 58, 0.95]
  }
];

const NIGHT_LENGTH_MS = 180000;
const LURE_COOLDOWN_MS = 8000;
const MAX_LURES_PER_CAMERA = 2;
const MAX_TOTAL_LURES_BEFORE_FAILURE = 6;

const CAMERA_POSES = [
  "assets/generated/willem-cam-1.png",
  "assets/generated/willem-cam-2.png",
  "assets/generated/willem-cam-3.png",
  "assets/generated/willem-cam-4.png",
  "assets/generated/willem-cam-5.png",
  "assets/generated/willem-cam-6.png",
  "assets/generated/willem-cam-7.png"
];

const JUMPSCARE_FRAMES = [
  { src: "assets/generated/willem-jump-1.png", scale: 0.72 },
  { src: "assets/generated/willem-jump-2.png", scale: 0.84 },
  { src: "assets/generated/willem-jump-3.png", scale: 0.98 },
  { src: "assets/generated/willem-jump-4.png", scale: 1.12 },
  { src: "assets/generated/willem-jump-5.png", scale: 1.28 },
  { src: "assets/generated/willem-jump-6.png", scale: 1.42 },
  { src: "assets/generated/willem-jump-7.png", scale: 1.58 },
  { src: "assets/generated/willem-jump-8.png", scale: 1.74 },
  { src: "assets/generated/willem-jump-7.png", scale: 1.64 },
  { src: "assets/generated/willem-jump-8.png", scale: 1.86 }
];

const DIFFICULTY = {
  normal: 1,
  hard: 1.18,
  nightmare: 1.42
};

const NIGHT_CONFIGS = {
  1: {
    mainAi: 8,
    mainSpawnDelay: 18000,
    mainInterval: [11800, 13800],
    mainResistance: 0,
    requiredLures: 1,
    ventAi: 0,
    ventInterval: [16000, 20000],
    failureDelay: 36000
  },
  2: {
    mainAi: 10,
    mainSpawnDelay: 8000,
    mainInterval: [10200, 12400],
    mainResistance: 0.08,
    requiredLures: 1,
    ventAi: 7,
    ventInterval: [13500, 17000],
    failureDelay: 30000
  },
  3: {
    mainAi: 12,
    mainSpawnDelay: 5000,
    mainInterval: [9000, 10800],
    mainResistance: 0.12,
    requiredLures: 2,
    ventAi: 9,
    ventInterval: [11500, 15000],
    failureDelay: 25000
  },
  4: {
    mainAi: 14,
    mainSpawnDelay: 3000,
    mainInterval: [7600, 9600],
    mainResistance: 0.16,
    requiredLures: 2,
    ventAi: 11,
    ventInterval: [9800, 13200],
    failureDelay: 22000,
    rushAfter4: true
  },
  5: {
    mainAi: 16,
    mainSpawnDelay: 1000,
    mainInterval: [6500, 8500],
    mainResistance: 0.18,
    requiredLures: 2,
    ventAi: 13,
    ventInterval: [8200, 11600],
    failureDelay: 18000,
    rushAfter4: true
  }
};

const els = {
  gameFrame: document.querySelector("#gameFrame"),
  startOverlay: document.querySelector("#startOverlay"),
  endOverlay: document.querySelector("#endOverlay"),
  endTitle: document.querySelector("#endTitle"),
  endText: document.querySelector("#endText"),
  endImage: document.querySelector("#endImage"),
  jumpscareOverlay: document.querySelector("#jumpscareOverlay"),
  jumpscareSprite: document.querySelector("#jumpscareSprite"),
  startButton: document.querySelector("#startButton"),
  continueButton: document.querySelector("#continueButton"),
  restartButton: document.querySelector("#restartButton"),
  nextButton: document.querySelector("#nextButton"),
  menuButton: document.querySelector("#menuButton"),
  nightSelect: document.querySelector("#nightSelect"),
  threatSelect: document.querySelector("#threatSelect"),
  progressNote: document.querySelector("#progressNote"),
  tabletToggle: document.querySelector("#tabletToggle"),
  cameraPanel: document.querySelector("#cameraPanel"),
  cameraMap: document.querySelector("#cameraMap"),
  cameraImage: document.querySelector("#cameraImage"),
  cameraName: document.querySelector("#cameraName"),
  cameraStatus: document.querySelector("#cameraStatus"),
  cameraThreat: document.querySelector("#cameraThreat"),
  ventThreat: document.querySelector("#ventThreat"),
  cameraStatic: document.querySelector("#cameraStatic"),
  feedMeta: document.querySelector("#feedMeta"),
  officeThreat: document.querySelector("#officeThreat"),
  ventOfficeThreat: document.querySelector("#ventOfficeThreat"),
  hallWarning: document.querySelector("#hallWarning"),
  alertBar: document.querySelector("#alertBar"),
  nightLabel: document.querySelector("#nightLabel"),
  timeLabel: document.querySelector("#timeLabel"),
  signalLabel: document.querySelector("#signalLabel"),
  ventLabel: document.querySelector("#ventLabel"),
  audioMeter: document.querySelector("#audioMeter"),
  videoMeter: document.querySelector("#videoMeter"),
  airMeter: document.querySelector("#airMeter"),
  audioButton: document.querySelector("#audioButton"),
  ventButton: document.querySelector("#ventButton"),
  cameraModeButton: document.querySelector("#cameraModeButton"),
  rebootButton: document.querySelector("#rebootButton")
};

const sounds = {
  lure: new Audio("dolphin%20sound%20lure.mp3"),
  ventSeal: new Audio("seal%20vent.mp3"),
  jumpscare: new Audio("jumpscare%20audio.mp3")
};

const state = {
  running: false,
  won: false,
  selectedNight: 1,
  selectedDifficulty: "normal",
  cameraMode: "main",
  currentCam: 0,
  currentVentCam: 0,
  cameraOpen: false,
  cameraFailed: false,
  cameraSwitching: 0,
  startedAt: 0,
  lastTick: 0,
  nextFailureAt: 0,
  audioCooldown: 0,
  rebooting: 0,
  ventClosed: false,
  systems: {
    audio: 100,
    video: 100,
    oxygen: 100
  },
  mainEnemy: {
    active: false,
    location: 6,
    enteredOfficeAt: null,
    nextMoveAt: 0,
    totalLures: 0,
    lureCounts: {},
    lureProgress: {}
  },
  ventEnemy: {
    active: false,
    location: 6,
    crawling: false,
    crawlStartedAt: null,
    warningPlayed: false,
    nextMoveAt: 0
  },
  jumpscareTimer: null,
  jumpscareFrameTimer: null,
  autoAdvanceTimer: null
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(range) {
  const [min, max] = range;
  return min + Math.random() * (max - min);
}

function difficultyScale() {
  return DIFFICULTY[state.selectedDifficulty] || 1;
}

function currentConfig() {
  return NIGHT_CONFIGS[state.selectedNight] || NIGHT_CONFIGS[1];
}

function nightSpeed(now) {
  const hourPressure = state.running ? elapsedHour(now) * 0.07 : 0;
  const nightPressure = (state.selectedNight - 1) * 0.12;
  return 1 + nightPressure + hourPressure;
}

function setAlert(message) {
  els.alertBar.textContent = message;
}

function playSound(name) {
  const sound = sounds[name];
  if (!sound) return;
  sound.pause();
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function setThreatImage(element, source) {
  if (element.getAttribute("src") !== source) {
    element.src = source;
  }
}

function setJumpscareFrame(frame) {
  if (els.jumpscareSprite.getAttribute("src") !== frame.src) {
    els.jumpscareSprite.src = frame.src;
  }
  els.jumpscareSprite.style.setProperty("--jump-scale", frame.scale);
}

function cameraLabel(location) {
  if (location === -1) return "OFFICE";
  if (location === null || location === undefined) return "UNKNOWN";
  return CAMERAS[location].id;
}

function ventCameraLabel(location) {
  if (location === null || location === undefined) return "CRAWLING";
  return VENT_CAMERAS[location].id;
}

function threatRoll(aiLevel) {
  return Math.random() * 20 < clamp(aiLevel * difficultyScale(), 0, 20);
}

function elapsedHour(now) {
  const elapsed = clamp(now - state.startedAt, 0, NIGHT_LENGTH_MS);
  return Math.floor((elapsed / NIGHT_LENGTH_MS) * 6);
}

function hourLabel(now) {
  const hour = elapsedHour(now);
  return hour === 0 ? "12 AM" : `${hour} AM`;
}

function weightedDirection(config, now) {
  if (config.rushAfter4 && elapsedHour(now) >= 4) {
    return "forward";
  }

  const roll = Math.random();
  if (roll < 0.78) return "forward";
  if (roll < 0.92) return "lateral";
  return "backward";
}

function chooseLocation(location, direction) {
  if (location === 0 && direction === "forward") {
    return -1;
  }

  const cam = CAMERAS[location];
  if (!cam) return location;

  const forward = cam.adjacent.filter((index) => CAMERAS[index].depth < cam.depth);
  const lateral = cam.adjacent.filter((index) => CAMERAS[index].depth === cam.depth);
  const backward = cam.adjacent.filter((index) => CAMERAS[index].depth > cam.depth);
  const fallback = forward.length ? forward : cam.adjacent;
  const pools = {
    forward: forward.length ? forward : fallback,
    lateral: lateral.length ? lateral : fallback,
    backward: backward.length ? backward : fallback
  };
  const pool = pools[direction] || fallback;
  return pool[Math.floor(Math.random() * pool.length)];
}

function chooseVentLocation(location, direction) {
  if (!Number.isInteger(location)) return 4;
  if (direction === "backward") return clamp(location + 1, 0, VENT_CAMERAS.length - 1);
  if (direction === "lateral") return clamp(location + (Math.random() < 0.5 ? -1 : 1), 0, VENT_CAMERAS.length - 1);
  return clamp(location - 1, 0, VENT_CAMERAS.length - 1);
}

function scheduleMainMove(now) {
  const interval = randomBetween(currentConfig().mainInterval) / (difficultyScale() * nightSpeed(now));
  state.mainEnemy.nextMoveAt = now + interval;
}

function scheduleVentMove(now) {
  const interval = randomBetween(currentConfig().ventInterval) / (difficultyScale() * nightSpeed(now));
  state.ventEnemy.nextMoveAt = now + interval;
}

function buildMap() {
  els.cameraMap.innerHTML = "";
  els.cameraMap.classList.toggle("is-vent-map", state.cameraMode === "vent");

  const marker = document.createElement("div");
  marker.className = "player-marker";
  marker.textContent = "YOU";
  marker.style.left = state.cameraMode === "vent" ? "64%" : "47%";
  marker.style.top = state.cameraMode === "vent" ? "86%" : "88%";
  els.cameraMap.appendChild(marker);

  const cameras = state.cameraMode === "vent" ? VENT_CAMERAS : CAMERAS;
  cameras.forEach((cam, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cam-button";
    button.textContent = cam.id;
    button.style.left = `${cam.map[0]}%`;
    button.style.top = `${cam.map[1]}%`;
    button.dataset.cam = String(index);
    button.dataset.mode = state.cameraMode;
    button.addEventListener("click", () => selectCamera(index));
    els.cameraMap.appendChild(button);
  });
}

function syncMenu() {
  const unlockedNight = Number(localStorage.getItem("fnsw_unlocked_night") || "1");
  const safeUnlockedNight = clamp(unlockedNight, 1, 5);
  els.progressNote.textContent = safeUnlockedNight > 1 ? `Continue from Night ${safeUnlockedNight}` : "New game starts on Night 1";
  els.continueButton.disabled = safeUnlockedNight <= 1;
}

function selectCamera(index) {
  if (!state.running || state.rebooting > 0) return;

  if (state.cameraFailed) {
    setAlert("Video system offline");
    render();
    return;
  }

  if (state.cameraMode === "vent") {
    state.currentVentCam = index;
  } else {
    state.currentCam = index;
  }
  state.cameraSwitching = 700;
  state.systems.video = clamp(state.systems.video - 0.9, 0, 100);
  updateCamera();
  render();
}

function updateCamera() {
  const cam = state.cameraMode === "vent" ? VENT_CAMERAS[state.currentVentCam] : CAMERAS[state.currentCam];
  els.cameraImage.src = cam.image;
  els.cameraName.textContent = `${cam.id} - ${cam.name}`;
}

function toggleCameras() {
  if (!state.running || state.rebooting > 0) return;
  state.cameraOpen = !state.cameraOpen;
  els.cameraPanel.classList.toggle("is-open", state.cameraOpen);
  els.tabletToggle.textContent = state.cameraOpen ? "LOWER" : "CAMERAS";
  setAlert(state.cameraOpen ? "Camera monitor raised" : "Office view restored");
  render();
}

function toggleCameraMode() {
  if (!state.running || state.rebooting > 0) return;
  state.cameraMode = state.cameraMode === "main" ? "vent" : "main";
  state.cameraSwitching = 700;
  buildMap();
  updateCamera();
  setAlert(state.cameraMode === "vent" ? "Vent cameras online" : "Main cameras online");
  render();
}

function isAdjacent(a, b) {
  return Number.isInteger(a) && Number.isInteger(b) && CAMERAS[a] && CAMERAS[a].adjacent.includes(b);
}

function triggerCameraFailure(message) {
  if (state.cameraFailed) return;
  state.cameraFailed = true;
  state.systems.video = 0;
  state.cameraSwitching = 0;
  setAlert(message);
}

function playAudio() {
  if (!state.running || state.rebooting > 0 || state.audioCooldown > 0) return;
  if (!state.cameraOpen) {
    setAlert("Raise cameras before playing audio");
    return;
  }
  if (state.cameraMode !== "main") {
    setAlert("Audio lure uses the main cameras");
    return;
  }
  if (state.cameraFailed) {
    setAlert("Video system offline");
    return;
  }
  if (state.systems.audio < 14) {
    setAlert("Audio system error. Reboot required.");
    return;
  }

  const target = state.currentCam;
  playSound("lure");
  const count = (state.mainEnemy.lureCounts[target] || 0) + 1;
  state.mainEnemy.lureCounts[target] = count;
  state.mainEnemy.totalLures += 1;
  state.systems.audio = clamp(state.systems.audio - 12, 0, 100);
  state.audioCooldown = LURE_COOLDOWN_MS;

  if (count > MAX_LURES_PER_CAMERA || state.mainEnemy.totalLures > MAX_TOTAL_LURES_BEFORE_FAILURE) {
    triggerCameraFailure("Audio feedback overloaded the camera system");
    render();
    return;
  }

  let moved = false;
  let partialLure = false;
  const mainLocation = state.mainEnemy.location;
  const mainCanHear = state.mainEnemy.active && (
    mainLocation === target ||
    isAdjacent(mainLocation, target) ||
    (mainLocation === -1 && (target === 0 || target === 1))
  );

  if (mainCanHear && Math.random() >= currentConfig().mainResistance) {
    const requiredLures = currentConfig().requiredLures || 1;
    const progress = (state.mainEnemy.lureProgress[target] || 0) + 1;
    state.mainEnemy.lureProgress[target] = progress;

    if (progress >= requiredLures) {
      state.mainEnemy.location = target;
      state.mainEnemy.enteredOfficeAt = null;
      state.mainEnemy.lureProgress = {};
      scheduleMainMove(performance.now());
      moved = true;
    } else {
      partialLure = true;
      setAlert(`Audio echoed at ${CAMERAS[target].id} (${progress}/${requiredLures})`);
    }
  }

  if (!partialLure) {
    setAlert(moved ? `Audio lure played at ${CAMERAS[target].id}` : "Audio played. No confirmed movement.");
  }
  render();
}

function repelVentEnemy(now) {
  const retreatLocations = [2, 3, 4];
  state.ventEnemy.crawling = false;
  state.ventEnemy.crawlStartedAt = null;
  state.ventEnemy.warningPlayed = false;
  state.ventEnemy.location = retreatLocations[Math.floor(Math.random() * retreatLocations.length)];
  scheduleVentMove(now);
  setAlert("Vent movement retreated");
}

function toggleVent() {
  if (!state.running || state.rebooting > 0) return;
  state.ventClosed = !state.ventClosed;
  if (state.ventClosed) {
    playSound("ventSeal");
  }
  setAlert(state.ventClosed ? "Vent closed" : "Vent opened");

  if (state.ventClosed && state.ventEnemy.crawling) {
    repelVentEnemy(performance.now());
  }

  render();
}

function rebootAll() {
  if (!state.running || state.rebooting > 0) return;
  state.rebooting = 4800;
  state.cameraOpen = false;
  els.cameraPanel.classList.remove("is-open");
  els.tabletToggle.textContent = "CAMERAS";
  setAlert("Rebooting systems...");
  render();
}

function maybeSpawnEnemies(now) {
  const config = currentConfig();

  if (!state.mainEnemy.active && now - state.startedAt >= config.mainSpawnDelay) {
    state.mainEnemy.active = true;
    state.mainEnemy.location = 6;
    scheduleMainMove(now);
    setAlert("Motion detected at CAM 07");
  }

  if (config.ventAi > 0 && !state.ventEnemy.active && now - state.startedAt >= 12000) {
    state.ventEnemy.active = true;
    state.ventEnemy.location = 4;
    scheduleVentMove(now);
  }
}

function moveMainEnemy(now) {
  const enemy = state.mainEnemy;
  const config = currentConfig();

  if (!enemy.active || enemy.enteredOfficeAt || now < enemy.nextMoveAt || state.rebooting > 0) return;

  if (!threatRoll(config.mainAi)) {
    scheduleMainMove(now);
    return;
  }

  const next = chooseLocation(enemy.location, weightedDirection(config, now));
  enemy.location = next;
  enemy.lureCounts = {};

  if (next === -1) {
    enemy.enteredOfficeAt = now;
    setAlert("Movement in the office doorway");
  } else {
    setAlert(`Motion detected: ${CAMERAS[next].id}`);
  }

  scheduleMainMove(now);
}

function startVentCrawl(now) {
  state.ventEnemy.crawling = true;
  state.ventEnemy.crawlStartedAt = now;
  state.ventEnemy.warningPlayed = false;
  state.ventEnemy.location = null;
  setAlert("Vent sensor tripped");

  if (state.ventClosed) {
    repelVentEnemy(now);
  }
}

function moveVentEnemy(now) {
  const enemy = state.ventEnemy;
  const config = currentConfig();

  if (!enemy.active || state.rebooting > 0) return;

  if (enemy.crawling) {
    const crawlElapsed = now - enemy.crawlStartedAt;

    if (state.ventClosed) {
      repelVentEnemy(now);
      return;
    }

    if (!enemy.warningPlayed && crawlElapsed >= 5000) {
      enemy.warningPlayed = true;
      setAlert("Vent movement heard");
    }

    if (crawlElapsed >= 20000) {
      endGame(false, "The vent path was left open.");
    }

    return;
  }

  if (now < enemy.nextMoveAt) return;

  if (!threatRoll(config.ventAi)) {
    scheduleVentMove(now);
    return;
  }

  if ((enemy.location === 0 || enemy.location === 1) && Math.random() < (enemy.location === 0 ? 1 : 0.55)) {
    startVentCrawl(now);
    return;
  }

  enemy.location = chooseVentLocation(enemy.location, Math.random() < 0.9 ? "forward" : "lateral");
  scheduleVentMove(now);
}

function randomSystemFailure(now) {
  if (now < state.nextFailureAt || state.rebooting > 0) return;

  const damage = 10 + Math.random() * (8 + state.selectedNight * 2);
  const roll = Math.random();

  if (roll < 0.45) {
    state.systems.video = clamp(state.systems.video - damage, 0, 100);
    setAlert("Video disturbance detected");
    if (state.systems.video <= 0) {
      triggerCameraFailure("Video system failure");
    }
  } else if (roll < 0.78) {
    state.systems.audio = clamp(state.systems.audio - damage, 0, 100);
    setAlert("Audio disturbance detected");
  } else {
    state.systems.oxygen = clamp(state.systems.oxygen - damage * 0.65, 0, 100);
    setAlert("Airflow disturbance detected");
  }

  state.nextFailureAt = now + randomBetween([16000, currentConfig().failureDelay]) / difficultyScale();
}

function updateSystems(delta) {
  if (!state.running) return;

  state.audioCooldown = Math.max(0, state.audioCooldown - delta);
  state.cameraSwitching = Math.max(0, state.cameraSwitching - delta);

  if (state.rebooting > 0) {
    state.rebooting = Math.max(0, state.rebooting - delta);

    if (state.rebooting === 0) {
      state.cameraFailed = false;
      state.systems.audio = 100;
      state.systems.video = 100;
      state.systems.oxygen = clamp(state.systems.oxygen + 28, 0, 100);
      state.mainEnemy.totalLures = 0;
      state.mainEnemy.lureCounts = {};
      setAlert("Systems restored");
    }

    return;
  }

  if (state.cameraOpen && !state.cameraFailed) {
    state.systems.video = clamp(state.systems.video - delta * 0.00028, 0, 100);
  }

  if (state.ventClosed) {
    state.systems.oxygen = clamp(state.systems.oxygen - delta * 0.00135, 0, 100);
  } else {
    state.systems.oxygen = clamp(state.systems.oxygen + delta * 0.00072, 0, 100);
  }

  if (state.systems.video <= 0 && !state.cameraFailed) {
    triggerCameraFailure("Video system failure");
  }
}

function checkEnd(now) {
  const elapsed = now - state.startedAt;

  if (elapsed >= NIGHT_LENGTH_MS) {
    endGame(true);
    return;
  }

  if (state.mainEnemy.enteredOfficeAt && now - state.mainEnemy.enteredOfficeAt > 7200) {
    endGame(false, "The office doorway was left unchecked.");
    return;
  }

  if (state.systems.oxygen <= 0) {
    endGame(false, "The vent stayed closed too long.");
  }
}

function endGame(won, reason = "") {
  if (!state.running) return;

  state.running = false;
  state.won = won;
  state.cameraOpen = false;
  els.cameraPanel.classList.remove("is-open");
  els.tabletToggle.textContent = "CAMERAS";
  els.endOverlay.classList.remove("is-hidden");
  els.gameFrame.classList.toggle("is-shaking", !won);

  if (won) {
    const nextNight = clamp(state.selectedNight + 1, 1, 5);
    const unlocked = Number(localStorage.getItem("fnsw_unlocked_night") || "1");
    localStorage.setItem("fnsw_unlocked_night", String(Math.max(unlocked, nextNight)));
    els.endTitle.textContent = "6 AM";
    els.endText.textContent = state.selectedNight < 5 ? `Night ${nextNight} is available.` : "All five prototype nights are cleared.";
    els.endImage.src = "fna willem security room.png";
    els.nextButton.classList.toggle("is-hidden", state.selectedNight >= 5);
  } else {
    els.endTitle.textContent = "Shift failed";
    els.endText.textContent = reason || "The night guard did not complete the shift.";
    els.endImage.src = "fnaf willem lore.png";
    els.nextButton.classList.add("is-hidden");
    playJumpscare();
  }

  syncMenu();
}

function renderThreatImage(element, cameraIndex, visible, offsetX = 0, offsetY = 0, scale = 1, cameraSet = CAMERAS) {
  const cam = cameraSet[cameraIndex] || cameraSet[0];
  const source = CAMERA_POSES[cameraIndex % CAMERA_POSES.length];
  setThreatImage(element, source);
  element.classList.toggle("is-visible", Boolean(visible));
  element.style.left = `${cam.threat[0] + offsetX}%`;
  element.style.top = `${cam.threat[1] + offsetY}%`;
  element.style.transform = `translate(-50%, -50%) scale(${cam.threat[2] * scale})`;
}

function playJumpscare() {
  clearTimeout(state.jumpscareTimer);
  clearInterval(state.jumpscareFrameTimer);

  els.endOverlay.classList.add("is-hidden");
  els.jumpscareOverlay.classList.remove("is-hidden");
  els.jumpscareOverlay.classList.add("is-playing");
  playSound("jumpscare");

  let index = 0;
  setJumpscareFrame(JUMPSCARE_FRAMES[index]);
  state.jumpscareFrameTimer = setInterval(() => {
    index = Math.min(index + 1, JUMPSCARE_FRAMES.length - 1);
    setJumpscareFrame(JUMPSCARE_FRAMES[index]);
  }, 70);

  state.jumpscareTimer = setTimeout(() => {
    clearInterval(state.jumpscareFrameTimer);
    els.jumpscareOverlay.classList.add("is-hidden");
    els.jumpscareOverlay.classList.remove("is-playing");
    els.endOverlay.classList.remove("is-hidden");
  }, 1250);
}

function render() {
  const videoOffline = state.cameraFailed || state.rebooting > 0;
  const mainLocation = state.mainEnemy.location;
  const ventLocation = state.ventEnemy.location;
  const ventCrawlElapsed = state.ventEnemy.crawling ? performance.now() - state.ventEnemy.crawlStartedAt : 0;

  els.nightLabel.textContent = String(state.selectedNight);
  els.signalLabel.textContent = state.cameraFailed ? "ERR" : `${Math.round(state.systems.video)}%`;
  els.ventLabel.textContent = state.ventClosed ? "SEALED" : "OPEN";
  els.audioMeter.value = Math.round(state.systems.audio);
  els.videoMeter.value = Math.round(state.systems.video);
  els.airMeter.value = Math.round(state.systems.oxygen);

  els.cameraPanel.classList.toggle("is-failed", videoOffline);
  els.cameraStatic.classList.toggle("is-heavy", videoOffline);
  els.cameraStatic.classList.toggle("is-switching", state.cameraSwitching > 0);

  if (state.rebooting > 0) {
    els.cameraStatus.textContent = "REBOOTING";
  } else if (state.cameraFailed) {
    els.cameraStatus.textContent = "ERROR";
  } else if (state.cameraSwitching > 0) {
    els.cameraStatus.textContent = "TUNING";
  } else {
    els.cameraStatus.textContent = "ONLINE";
  }

  const canUsePanel = state.running && state.rebooting <= 0;
  els.audioButton.disabled = !canUsePanel || !state.cameraOpen || state.cameraFailed || state.audioCooldown > 0 || state.systems.audio < 14;
  els.ventButton.disabled = !canUsePanel;
  els.rebootButton.disabled = !state.running || state.rebooting > 0;

  if (state.audioCooldown > 0) {
    els.audioButton.textContent = `Audio ${Math.ceil(state.audioCooldown / 1000)}s`;
  } else {
    els.audioButton.textContent = state.systems.audio < 14 ? "Audio Error" : "Play Audio";
  }

  els.ventButton.textContent = state.ventClosed ? "Open Vent" : "Close Vent";
  els.rebootButton.textContent = state.rebooting > 0 ? `Reboot ${Math.ceil(state.rebooting / 1000)}s` : "Reboot All";

  const showMainThreat = state.mainEnemy.active && mainLocation === state.currentCam && !videoOffline && state.cameraSwitching <= 0;
  const showVentThreat = state.ventEnemy.active && !state.ventEnemy.crawling && ventLocation === state.currentCam && !videoOffline && state.cameraSwitching <= 0;
  renderThreatImage(els.cameraThreat, state.currentCam, showMainThreat);
  renderThreatImage(els.ventThreat, state.currentCam, showVentThreat, -16, 5, 0.74);

  const mainAtOffice = state.mainEnemy.enteredOfficeAt !== null;
  const ventAtOffice = state.ventEnemy.crawling && !state.ventClosed && ventCrawlElapsed > 15000;
  els.officeThreat.classList.toggle("is-visible", mainAtOffice);
  els.ventOfficeThreat.classList.toggle("is-visible", ventAtOffice);
  els.hallWarning.classList.toggle("is-active", mainAtOffice || ventAtOffice || state.systems.oxygen <= 25);

  if (state.cameraFailed) {
    els.feedMeta.textContent = "Video offline. Reboot required.";
  } else if (state.cameraSwitching > 0) {
    els.feedMeta.textContent = "Switching camera feed...";
  } else {
    els.feedMeta.textContent = `Main ${cameraLabel(mainLocation)} | Vent ${state.ventEnemy.crawling ? "CRAWLING" : cameraLabel(ventLocation)}`;
  }

  document.querySelectorAll(".cam-button").forEach((button) => {
    const camIndex = Number(button.dataset.cam);
    const hasMain = state.mainEnemy.active && mainLocation === camIndex && !state.cameraFailed;
    const hasVent = state.ventEnemy.active && !state.ventEnemy.crawling && ventLocation === camIndex && !state.cameraFailed;
    button.classList.toggle("is-active", camIndex === state.currentCam);
    button.classList.toggle("has-main-threat", hasMain);
    button.classList.toggle("has-vent-threat", hasVent);
    button.classList.toggle("has-both-threats", hasMain && hasVent);
  });
}

function tick(now) {
  if (!state.running) return;

  const delta = now - state.lastTick;
  state.lastTick = now;

  updateSystems(delta);
  maybeSpawnEnemies(now);
  randomSystemFailure(now);
  moveMainEnemy(now);
  moveVentEnemy(now);
  checkEnd(now);

  els.timeLabel.textContent = hourLabel(now);
  render();

  if (state.running) {
    requestAnimationFrame(tick);
  }
}

function resetState(night = state.selectedNight, difficulty = state.selectedDifficulty) {
  const now = performance.now();
  clearTimeout(state.jumpscareTimer);
  clearInterval(state.jumpscareFrameTimer);
  state.running = true;
  state.won = false;
  state.selectedNight = clamp(Number(night) || 1, 1, 5);
  state.selectedDifficulty = difficulty || "normal";
  state.currentCam = 0;
  state.cameraOpen = false;
  state.cameraFailed = false;
  state.cameraSwitching = 0;
  state.startedAt = now;
  state.lastTick = now;
  state.nextFailureAt = now + currentConfig().failureDelay;
  state.audioCooldown = 0;
  state.rebooting = 0;
  state.ventClosed = false;
  state.systems.audio = 100;
  state.systems.video = 100;
  state.systems.oxygen = 100;
  state.mainEnemy.active = false;
  state.mainEnemy.location = 6;
  state.mainEnemy.enteredOfficeAt = null;
  state.mainEnemy.nextMoveAt = now + currentConfig().mainSpawnDelay;
  state.mainEnemy.totalLures = 0;
  state.mainEnemy.lureCounts = {};
  state.ventEnemy.active = false;
  state.ventEnemy.location = 6;
  state.ventEnemy.crawling = false;
  state.ventEnemy.crawlStartedAt = null;
  state.ventEnemy.warningPlayed = false;
  state.ventEnemy.nextMoveAt = now + 12000;

  els.nightSelect.value = String(state.selectedNight);
  els.threatSelect.value = state.selectedDifficulty;
  els.startOverlay.classList.add("is-hidden");
  els.endOverlay.classList.add("is-hidden");
  els.jumpscareOverlay.classList.add("is-hidden");
  els.jumpscareOverlay.classList.remove("is-playing");
  els.gameFrame.classList.remove("is-shaking");
  els.cameraPanel.classList.remove("is-open");
  els.tabletToggle.textContent = "CAMERAS";
  els.timeLabel.textContent = "12 AM";
  setAlert(`Night ${state.selectedNight} started`);
  updateCamera();
  render();
  requestAnimationFrame(tick);
}

function startSelectedNight() {
  resetState(Number(els.nightSelect.value), els.threatSelect.value);
}

function continueNight() {
  const unlockedNight = clamp(Number(localStorage.getItem("fnsw_unlocked_night") || "1"), 1, 5);
  resetState(unlockedNight, els.threatSelect.value);
}

function nextNight() {
  resetState(clamp(state.selectedNight + 1, 1, 5), state.selectedDifficulty);
}

function showMenu() {
  clearTimeout(state.jumpscareTimer);
  clearInterval(state.jumpscareFrameTimer);
  state.running = false;
  state.cameraOpen = false;
  els.endOverlay.classList.add("is-hidden");
  els.jumpscareOverlay.classList.add("is-hidden");
  els.jumpscareOverlay.classList.remove("is-playing");
  els.startOverlay.classList.remove("is-hidden");
  els.cameraPanel.classList.remove("is-open");
  els.gameFrame.classList.remove("is-shaking");
  els.tabletToggle.textContent = "CAMERAS";
  syncMenu();
  render();
}

document.addEventListener("keydown", (event) => {
  if (event.repeat) return;

  const key = event.key.toLowerCase();
  if (key === "c" || event.code === "Space") {
    toggleCameras();
  }
  if (key === "a") {
    playAudio();
  }
  if (key === "v") {
    toggleVent();
  }
  if (key === "r") {
    rebootAll();
  }
});

els.startButton.addEventListener("click", startSelectedNight);
els.continueButton.addEventListener("click", continueNight);
els.restartButton.addEventListener("click", () => resetState(state.selectedNight, state.selectedDifficulty));
els.nextButton.addEventListener("click", nextNight);
els.menuButton.addEventListener("click", showMenu);
els.tabletToggle.addEventListener("click", toggleCameras);
els.audioButton.addEventListener("click", playAudio);
els.ventButton.addEventListener("click", toggleVent);
els.rebootButton.addEventListener("click", rebootAll);

buildMap();
updateCamera();
syncMenu();
render();
