// =========================
// CONSTANTS
// =========================

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

function getNightLength(night = state.selectedNight) {
  // Night 1 is 4 min (240s), others are 6 min (360s). 1 min = 1 hour game time.
  return night === 1 ? 240000 : 360000;
}

const NIGHT_LENGTH_MS = 360000; // default for non-Night-1 (will be overridden in resetState)
const LURE_COOLDOWN_MS = 8000;
const MAX_LURES_PER_CAMERA = 2;
const MAX_TOTAL_LURES_BEFORE_FAILURE = 6;

const CAMERA_POSES = [
  "willem-cam-1.png",
  "willem-cam-2.png",
  "willem-cam-3.png",
  "willem-cam-4.png",
  "willem-cam-5.png",
  "willem-cam-6.png",
  "willem-cam-7.png"
];

const JUMPSCARE_FRAMES = [
  { src: "willem-jump-1.png", scale: 0.72 },
  { src: "willem-jump-2.png", scale: 0.84 },
  { src: "willem-jump-3.png", scale: 0.98 },
  { src: "willem-jump-4.png", scale: 1.12 },
  { src: "willem-jump-5.png", scale: 1.28 },
  { src: "willem-jump-6.png", scale: 1.42 },
  { src: "willem-jump-7.png", scale: 1.58 },
  { src: "willem-jump-8.png", scale: 1.74 },
  { src: "willem-jump-7.png", scale: 1.64 },
  { src: "willem-jump-8.png", scale: 1.86 }
];

const DIFFICULTY = {
  normal: 1,
  hard: 1.18,
  nightmare: 1.42
};

const NIGHT_CONFIGS = {
  1: {
    mainAi: 5,
    mainSpawnDelay: 30000,
    mainInterval: [18000, 23000],
    mainResistance: 0,
    requiredLures: 1,
    ventAi: 0,
    ventInterval: [16000, 20000],
    failureDelay: 65000
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

// =========================
// ELEMENT REFERENCES
// =========================

const els = {
  gameFrame:        document.querySelector("#gameFrame"),
  startOverlay:     document.querySelector("#startOverlay"),
  endOverlay:       document.querySelector("#endOverlay"),
  endTitle:         document.querySelector("#endTitle"),
  endText:          document.querySelector("#endText"),
  endImage:         document.querySelector("#endImage"),
  jumpscareOverlay: document.querySelector("#jumpscareOverlay"),
  jumpscareSprite:  document.querySelector("#jumpscareSprite"),
  startButton:      document.querySelector("#startButton"),
  continueButton:   document.querySelector("#continueButton"),
  restartButton:    document.querySelector("#restartButton"),
  nextButton:       document.querySelector("#nextButton"),
  menuButton:       document.querySelector("#menuButton"),
  nightSelect:      document.querySelector("#nightSelect"),
  threatSelect:     document.querySelector("#threatSelect"),
  progressNote:     document.querySelector("#progressNote"),
  tabletToggle:     document.querySelector("#tabletToggle"),
  exitArrow:        document.querySelector("#exitArrow"),
  cameraPanel:      document.querySelector("#cameraPanel"),
  cameraMap:        document.querySelector("#cameraMap"),
  cameraImage:      document.querySelector("#cameraImage"),
  cameraName:       document.querySelector("#cameraName"),
  cameraStatus:     document.querySelector("#cameraStatus"),
  cameraThreat:     document.querySelector("#cameraThreat"),
  ventThreat:       document.querySelector("#ventThreat"),
  cameraStatic:     document.querySelector("#cameraStatic"),
  feedMeta:         document.querySelector("#feedMeta"),
  officeThreat:     document.querySelector("#officeThreat"),
  ventOfficeThreat: document.querySelector("#ventOfficeThreat"),
  hallWarning:      document.querySelector("#hallWarning"),
  alertBar:         document.querySelector("#alertBar"),
  taskPopup:        document.querySelector("#taskPopup"),
  nightLabel:       document.querySelector("#nightLabel"),
  timeLabel:        document.querySelector("#timeLabel"),
  signalLabel:      document.querySelector("#signalLabel"),
  ventLabel:        document.querySelector("#ventLabel"),
  audioMeter:       document.querySelector("#audioMeter"),
  videoMeter:       document.querySelector("#videoMeter"),
  airMeter:         document.querySelector("#airMeter"),
  audioButton:      document.querySelector("#audioButton"),
  ventButton:       document.querySelector("#ventButton"),
  cameraModeButton: document.querySelector("#cameraModeButton"),
  rebootButton:     document.querySelector("#rebootButton")
};

// =========================
// SOUNDS
// =========================

const sounds = {
  lure:      new Audio("dolphin sound lure.mp3"),
  ventSeal:  new Audio("seal vent.mp3"),
  jumpscare: new Audio("jumpscare audio.mp3")
};

let taskAmbience = null;

// =========================
// STORYBOARD ATLASES
// =========================

const STORYBOARD_ATLAS_CONFIGS = {
  hallway: {
    src: "hallway images.png",
    fallbackGrid: [4, 3]
  },
  dolphins: {
    src: "dolphin tasks.png",
    forceFallback: true,
    fallbackRects: [
      [0.005, 0.66, 0.195, 0.33],
      [0.202, 0.66, 0.195, 0.33],
      [0.4,   0.66, 0.195, 0.33],
      [0.598, 0.66, 0.195, 0.33],
      [0.795, 0.66, 0.2,   0.33]
    ]
  },
  gates: {
    src: "crank task.png",
    fallbackGrid: [4, 3]
  },
  generator: {
    src: "restet the backup generator task.png",
    fallbackGrid: [4, 3]
  },
  vents: {
    src: "seal vent task.png",
    fallbackGrid: [4, 3]
  },
  cameras_repair: {
    src: "repair broken security camera's task.png",
    fallbackGrid: [4, 3]
  },
  drain_task: {
    src: "Drain flooded maintenance tunnels task.png",
    fallbackGrid: [4, 3]
  },
  audio_task: {
    src: "restarting the PA system task.png",
    fallbackGrid: [4, 3]
  },
  tasks: {
    src: "tasks.png",
    fallbackGrid: [5, 5]
  },
  minimaps: {
    src: "the minimaps for the camera's.png",
    fallbackGrid: [2, 1]
  }
};

const storyboardAtlases = {};

// =========================
// STATE
// =========================

const state = {
  tasks: {
    active: false,
    current: null,
    progress: 0,
    cooldown: 0,
    phase: "idle",
    effectApplied: false,
    required: null,
    requiredSince: 0,
    nextRequiredAt: 0,
    lastRequired: null,
    completionMessage: ""
  },
  taskEffects: {
    splashNoise: 0,
    powerFlicker: 0,
    ventRush: 0,
    cameraBlackout: 0,
    disabledCamera: null,
    disabledCameraMode: "main",
    lensObscured: 0,
    gateFailure: 0,
    tunnelFlood: 0
  },
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
  sealedVent: null,
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
    lureTarget: null,
    totalLures: 0,
    lureCounts: {},
    lureProgress: {}
  },
  ventEnemy: {
    active: false,
    location: 4,
    crawling: false,
    crawlStartedAt: null,
    warningPlayed: false,
    nextMoveAt: 0
  },
  jumpscareTimer: null,
  jumpscareFrameTimer: null,
  autoAdvanceTimer: null
};

// =========================
// PRELOAD IMAGES
// =========================

[
  ...CAMERAS.map((c) => c.image),
  ...VENT_CAMERAS.map((c) => c.image),
  ...CAMERA_POSES,
  ...JUMPSCARE_FRAMES.map((f) => f.src)
].forEach((src) => {
  const img = new Image();
  img.src = src;
});

// =========================
// UTILITIES
// =========================

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween([min, max]) {
  return min + Math.random() * (max - min);
}

function threatRoll(ai) {
  return Math.random() * 20 < ai;
}

function difficultyScale() {
  return DIFFICULTY[state.selectedDifficulty] || 1;
}

function currentConfig() {
  return NIGHT_CONFIGS[state.selectedNight] || NIGHT_CONFIGS[1];
}

function nightSpeed(now) {
  const elapsed = now - state.startedAt;
  const nightLen = getNightLength(state.selectedNight);
  return 1 + (elapsed / nightLen) * 0.42;
}

function weightedDirection(config, now) {
  const r = Math.random();
  if (config.rushAfter4 && now - state.startedAt > 240000) {
    return r < 0.78 ? "forward" : r < 0.9 ? "lateral" : "backward";
  }
  return r < 0.6 ? "forward" : r < 0.82 ? "lateral" : "backward";
}

function playSound(key) {
  const s = sounds[key];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
}

function setThreatImage(element, src) {
  if (element.getAttribute("src") !== src) {
    element.src = src;
  }
}

function hourLabel(now) {
  const elapsed = now - state.startedAt;
  const nightLen = getNightLength(state.selectedNight);
  const fraction = elapsed / nightLen;
  const hour = Math.floor(fraction * (state.selectedNight === 1 ? 4 : 6));
  const labels = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM"];
  return labels[Math.min(hour, 6)];
}

function cameraLabel(location) {
  if (!Number.isInteger(location)) return "UNKNOWN";
  if (location === -1) return "OFFICE";
  return CAMERAS[location]?.id || "UNKNOWN";
}

function ventCameraLabel(location) {
  if (!Number.isInteger(location)) return "UNKNOWN";
  return VENT_CAMERAS[location]?.id || "UNKNOWN";
}

function setAlert(message) {
  if (els.alertBar) {
    els.alertBar.textContent = message;
  }
}

// =========================
// STORYBOARD SYSTEM
// =========================

function initStoryboardAtlases() {
  Object.entries(STORYBOARD_ATLAS_CONFIGS).forEach(([key, config]) => {
    storyboardAtlases[key] = {
      src: config.src,
      frames: [],
      ready: false,
      error: null
    };
    loadStoryboardAtlas(key, config);
  });
}

function loadStoryboardAtlas(key, config) {
  const img = new Image();
  img.onload = () => {
    const atlas = storyboardAtlases[key];
    if (!atlas) return;
    try {
      atlas.frames = sliceStoryboardImage(img, config);
      atlas.ready  = atlas.frames.length > 0;
      atlas.error  = atlas.ready ? null : "No panels detected";
    } catch (error) {
      atlas.frames = [];
      atlas.ready  = false;
      atlas.error  = error.message;
    }
    if (state.running || key === "minimaps") {
      buildMap();
      render();
      renderTasks();
    }
  };
  img.onerror = () => {
    const atlas = storyboardAtlases[key];
    if (!atlas) return;
    atlas.ready = false;
    atlas.error = `Could not load ${config.src}`;
  };
  img.src = config.src;
}

function sliceStoryboardImage(img, config) {
  const sourceCanvas = document.createElement("canvas");
  const sourceCtx = sourceCanvas.getContext && sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sourceCtx) return [];

  sourceCanvas.width  = img.naturalWidth  || img.width;
  sourceCanvas.height = img.naturalHeight || img.height;
  sourceCtx.drawImage(img, 0, 0);

  const width  = sourceCanvas.width;
  const height = sourceCanvas.height;
  let rects = config.forceFallback
    ? configuredFallbackPanelRects(width, height, config)
    : detectStoryboardPanels(sourceCtx, width, height, config);

  if (rects.length < 2 && (config.fallbackGrid || config.fallbackRects)) {
    rects = configuredFallbackPanelRects(width, height, config);
  }

  return rects.map((rect) => {
    const panelCanvas = document.createElement("canvas");
    const panelCtx    = panelCanvas.getContext && panelCanvas.getContext("2d");
    if (!panelCtx) return null;
    panelCanvas.width  = rect.width;
    panelCanvas.height = rect.height;
    panelCtx.drawImage(sourceCanvas, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
    return { src: panelCanvas.toDataURL("image/png"), rect };
  }).filter(Boolean);
}

function detectStoryboardPanels(ctx, width, height, config) {
  let rects = [];
  try {
    const data     = ctx.getImageData(0, 0, width, height).data;
    const vertical   = detectBorderLines(data, width, height, "x");
    const horizontal = detectBorderLines(data, width, height, "y");
    rects = panelRectsFromLines(vertical, horizontal, width, height);
  } catch (error) {
    rects = [];
  }
  const fallbackCount = config.fallbackGrid ? config.fallbackGrid[0] * config.fallbackGrid[1] : 0;
  const tooMany = fallbackCount > 0 && rects.length > fallbackCount * 2;
  const tooFew  = rects.length < 2;
  if ((tooFew || tooMany) && (config.fallbackGrid || config.fallbackRects)) {
    return configuredFallbackPanelRects(width, height, config);
  }
  return rects;
}

function configuredFallbackPanelRects(width, height, config) {
  if (config.fallbackRects) {
    return config.fallbackRects.map(([x, y, rw, rh]) => ({
      x:      Math.round(x  <= 1 ? x  * width  : x),
      y:      Math.round(y  <= 1 ? y  * height : y),
      width:  Math.round(rw <= 1 ? rw * width  : rw),
      height: Math.round(rh <= 1 ? rh * height : rh)
    }));
  }
  if (config.fallbackGrid) {
    return fallbackPanelRects(width, height, config.fallbackGrid);
  }
  return [];
}

function detectBorderLines(data, width, height, axis) {
  const length     = axis === "x" ? width : height;
  const span       = axis === "x" ? height : width;
  const sampleStep = Math.max(1, Math.floor(span / 340));
  const scores     = [];
  for (let i = 0; i < length; i++) {
    let hits = 0; let total = 0;
    for (let j = 0; j < span; j += sampleStep) {
      const x = axis === "x" ? i : j;
      const y = axis === "x" ? j : i;
      const offset = (y * width + x) * 4;
      const r = data[offset]; const g = data[offset + 1]; const b = data[offset + 2];
      const brightness  = (r + g + b) / 3;
      const saturation  = Math.max(r, g, b) - Math.min(r, g, b);
      if ((brightness > 135 && saturation < 90) || brightness > 215) hits++;
      total++;
    }
    scores.push(hits / total);
  }
  const average   = scores.reduce((s, v) => s + v, 0) / scores.length;
  const variance  = scores.reduce((s, v) => s + (v - average) ** 2, 0) / scores.length;
  const threshold = Math.max(0.11, average + Math.sqrt(variance) * 1.55);
  const candidates = scores.map((score, index) => score >= threshold ? index : -1).filter(i => i >= 0);
  const groups = groupIndexes(candidates, 3);
  const lines  = groups
    .map(g => Math.round(g.reduce((s, i) => s + i, 0) / g.length))
    .filter(l => l > 6 && l < length - 6);
  return uniqueSorted([0, ...lines, length], 8);
}

function groupIndexes(indexes, maxGap) {
  const groups = [];
  indexes.forEach((index) => {
    const cur = groups[groups.length - 1];
    if (!cur || index - cur[cur.length - 1] > maxGap) groups.push([index]);
    else cur.push(index);
  });
  return groups;
}

function uniqueSorted(values, minDistance = 1) {
  return values.slice().sort((a, b) => a - b).reduce((result, value) => {
    if (!result.length || value - result[result.length - 1] >= minDistance) result.push(value);
    return result;
  }, []);
}

function panelRectsFromLines(vertical, horizontal, width, height) {
  const rects = [];
  const inset = 2;
  for (let row = 0; row < horizontal.length - 1; row++) {
    for (let col = 0; col < vertical.length - 1; col++) {
      const left = vertical[col] + inset;
      const top  = horizontal[row] + inset;
      const right  = vertical[col + 1] - inset;
      const bottom = horizontal[row + 1] - inset;
      const pw = right - left; const ph = bottom - top;
      if (pw >= 90 && ph >= 90) {
        rects.push({
          x:      clamp(left, 0, width),
          y:      clamp(top, 0, height),
          width:  clamp(pw, 1, width),
          height: clamp(ph, 1, height)
        });
      }
    }
  }
  return rects.sort((a, b) => (a.y - b.y) || (a.x - b.x));
}

function fallbackPanelRects(width, height, [cols, rows]) {
  const rects = [];
  const cw = width / cols; const ch = height / rows;
  const inset = 2;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rects.push({
        x:      Math.round(col * cw + inset),
        y:      Math.round(row * ch + inset),
        width:  Math.round(cw - inset * 2),
        height: Math.round(ch - inset * 2)
      });
    }
  }
  return rects;
}

function getStoryboardFrames(key, start = 0, count = null) {
  const atlas = storyboardAtlases[key];
  if (!atlas || !atlas.ready) return [];
  const first = clamp(start || 0, 0, atlas.frames.length);
  const last  = count ? clamp(first + count, first, atlas.frames.length) : atlas.frames.length;
  return atlas.frames.slice(first, last);
}

function getStoryboardPlayback(key, progress, duration, options = {}) {
  const frames = getStoryboardFrames(key, options.start || 0, options.count || null);
  if (!frames.length) {
    return { ready: false, src: "", index: 0, total: 0, isCutting: false, bob: 0, zoom: 1 };
  }
  const playbackDuration = Math.max(duration, 1);
  const frameTime        = playbackDuration / frames.length;
  const adjustedProgress = clamp(progress, 0, playbackDuration - 1);
  const index            = clamp(Math.floor(adjustedProgress / frameTime), 0, frames.length - 1);
  const local            = (adjustedProgress - index * frameTime) / frameTime;
  return {
    ready: true,
    src:   frames[index].src,
    index,
    total: frames.length,
    isCutting: local < 0.1 || local > 0.92,
    bob:   Math.sin(progress / 430) * (options.bob || 4),
    zoom:  1.025 + Math.sin(progress / 900) * 0.012
  };
}

function getTaskStoryboardPlayback(taskId, progress, duration) {
  const task = TASKS[taskId];
  if (!task || !task.atlas) {
    return getStoryboardPlayback("tasks", progress, duration, { minFrameTime: 700 });
  }
  return getStoryboardPlayback(task.atlas, progress, duration, {
    start: task.panelStart || 0,
    count: task.panelCount || null,
    minFrameTime: task.minPanelTime || 680,
    bob: 2.6
  });
}

function renderStoryboardFrame(playback, label = "") {
  if (!playback.ready) {
    return `<div class="story-frame-wrap is-loading"><div class="story-frame-fallback">TUNING FRAME...</div></div>`;
  }
  return `
    <div class="story-frame-wrap ${playback.isCutting ? "is-cutting" : ""}">
      <img class="story-frame" src="${playback.src}" alt=""
           style="--frame-bob:${playback.bob}px; --frame-zoom:${playback.zoom};">
      ${label ? `<div class="story-frame-label">${label}</div>` : ""}
      <div class="story-static-burst"></div>
    </div>
  `;
}

// =========================
// TASK CONSTANTS
// =========================

const DOLPHIN_WALK_DURATION       = 10500;
const DOLPHIN_TOTAL_TIME          = 15000;
const TASK_IGNORE_TIME            = 42000;
const TASK_COMPLETE_CONFIRM_TIME  = 1400;
const TASK_DEFAULT_TRAVEL_TIME    = 7600;

const HALLWAY_CAPTIONS = [
  "You exit the security office.",
  "You walk through the staff hallway.",
  "You continue through the service corridor.",
  "You reach the aquarium tunnel entrance.",
  "You walk through the aquarium tunnel.",
  "You exit the tunnel into Shark Bay hallway.",
  "You enter the central plaza.",
  "You head down the Dolphin Stadium hallway.",
  "You reach the service access door.",
  "You go through the backstage corridor.",
  "You arrive at the back hall of Dolphin Stadium.",
  "You are at your destination."
];

const DOLPHIN_STEPS = [
  { label: "1. OPEN HATCH",  desc: "Pull the hatch open." },
  { label: "2. POUR FEED",   desc: "Pour the feed into the hopper." },
  { label: "3. CLOSE HATCH", desc: "Close the hatch." },
  { label: "4. PULL HANDLE", desc: "Pull the handle down to dispense." },
  { label: "5. CONFIRM",     desc: "Feed dispensed. Task complete." }
];

const FACILITY_PATH = [
  "Leave the office and enter the wet service hall.",
  "Pass the pipe junction.",
  "Cross the dark maintenance corridor.",
  "Follow the low emergency lights.",
  "Move past the dripping vent shaft.",
  "Reach the task access door."
];

// =========================
// TASKS
// =========================

const TASKS = {
  dolphins: {
    name: "Feed the Dolphins",
    time: DOLPHIN_TOTAL_TIME,
    effect: () => {
      state.systems.oxygen = clamp(state.systems.oxygen + 15, 0, 100);
      state.taskEffects.splashNoise = 0;
    },
    consequence: (now) => {
      applyTaskEffect("splashNoise", 34000);
      state.systems.audio = clamp(state.systems.audio - 12, 0, 100);
      state.audioCooldown = Math.max(state.audioCooldown, 2600);
      setAlert("Dolphin splashing is masking audio cues");
    },
    image: "dolphin tasks.png",
    atlas: "dolphins",
    panelStart: 0,
    panelCount: 5,
    location: "Dolphin Stadium",
    travelTime: DOLPHIN_WALK_DURATION,
    steps: DOLPHIN_STEPS,
    path: HALLWAY_CAPTIONS,
    failureText: "The feeding system was ignored. Loud splashing masks audio feedback.",
    completionText: "Dolphin feed system confirmed"
  },
  gates: {
    name: "Crank Marine Gates Shut",
    time: 6000,
    effect: () => {
      state.systems.video = clamp(state.systems.video + 10, 0, 100);
      state.taskEffects.gateFailure = 0;
    },
    consequence: (now) => {
      applyTaskEffect("gateFailure", 36000);
      if (state.mainEnemy.active && !state.ventEnemy.active) {
        state.mainEnemy.nextMoveAt = Math.min(state.mainEnemy.nextMoveAt || now, now + 1200);
      }
      setAlert("Marine gates left open. Willem can advance faster.");
    },
    image: "crank task.png",
    atlas: "gates",
    panelStart: 1,
    panelCount: 10,
    location: "Marine Gate Controls",
    travelTime: 8200,
    steps: [
      { label: "1. GRIP WHEEL", desc: "Lock both hands on the rusted crank." },
      { label: "2. TURN GATE",  desc: "Force the gate mechanism shut." },
      { label: "3. LOCK PIN",   desc: "Drop the safety pin into place." }
    ],
    failureText: "The marine gate stayed open and gave Willem a faster route.",
    completionText: "Marine gate lock engaged"
  },
  generator: {
    name: "Reset Backup Generator",
    time: 7000,
    effect: () => {
      state.systems.audio = 100;
      state.systems.video = 100;
      state.taskEffects.powerFlicker = 0;
    },
    consequence: (now) => {
      applyTaskEffect("powerFlicker", 36000);
      state.systems.audio = clamp(state.systems.audio - 16, 0, 100);
      state.systems.video = clamp(state.systems.video - 22, 0, 100);
      setAlert("Backup generator fault. Power is flickering.");
    },
    image: "restet the backup generator task.png",
    atlas: "generator",
    panelStart: 1,
    panelCount: 11,
    location: "Backup Generator Room",
    travelTime: 9000,
    steps: [
      { label: "1. OPEN PANEL",    desc: "Pull the wet access panel free." },
      { label: "2. PRIME LINE",    desc: "Hold the primer until the dial steadies." },
      { label: "3. RESET BREAKER", desc: "Snap the breaker back into the green zone." },
      { label: "4. VERIFY OUTPUT", desc: "Wait for stable power output." }
    ],
    failureText: "The backup generator fault spread through the facility.",
    completionText: "Backup generator stable"
  },
  vents: {
    name: "Seal Malfunctioning Vents",
    time: 6500,
    effect: () => {
      state.sealedVent = null;
      state.taskEffects.ventRush = 0;
    },
    consequence: (now) => {
      applyTaskEffect("ventRush", 42000);
      if (state.ventEnemy.active) {
        state.ventEnemy.nextMoveAt = Math.min(state.ventEnemy.nextMoveAt || now, now + 1000);
      }
      setAlert("Vent seals malfunctioning. Vent movement accelerated.");
    },
    image: "seal vent task.png",
    atlas: "vents",
    panelStart: 1,
    panelCount: 10,
    location: "Vent Control Closet",
    travelTime: 7800,
    steps: [
      { label: "1. LOCATE SEAL",  desc: "Find the leaking vent actuator." },
      { label: "2. CUT PRESSURE", desc: "Bleed air from the stuck line." },
      { label: "3. RESEAT VALVE", desc: "Push the valve back into position." }
    ],
    failureText: "The vent seals failed and movement in the ducts sped up.",
    completionText: "Vent seals responding"
  },
  cameras: {
    name: "Repair Security Cameras",
    time: 5500,
    effect: () => {
      state.cameraFailed = false;
      state.systems.video = 100;
      state.taskEffects.cameraBlackout = 0;
      state.taskEffects.disabledCamera = null;
    },
    consequence: (now) => {
      applyTaskEffect("cameraBlackout", 26000);
      state.taskEffects.disabledCameraMode = "main";
      state.taskEffects.disabledCamera = Math.floor(Math.random() * CAMERAS.length);
      state.cameraSwitching = 700;
      state.systems.video = clamp(state.systems.video - 18, 0, 100);
      setAlert(`${CAMERAS[state.taskEffects.disabledCamera].id} relay disabled`);
    },
    image: "repair broken security camera's task.png",
    atlas: "cameras_repair",
    panelStart: 0,
    panelCount: 10,
    location: "Camera Relay Rack",
    travelTime: 7400,
    steps: [
      { label: "1. PULL CABLE",   desc: "Trace the bad camera line." },
      { label: "2. CLEAN CONTACT",desc: "Scrape corrosion from the relay." },
      { label: "3. RESEAT PLUG",  desc: "Lock the cable back into the rack." }
    ],
    failureText: "A camera relay failed and one camera went dark.",
    completionText: "Camera relays repaired"
  },
  drain: {
    name: "Drain Flooded Tunnels",
    time: 8000,
    effect: () => {
      state.systems.oxygen = clamp(state.systems.oxygen + 25, 0, 100);
      state.taskEffects.tunnelFlood = 0;
    },
    consequence: (now) => {
      applyTaskEffect("tunnelFlood", 40000);
      state.systems.oxygen = clamp(state.systems.oxygen - 18, 0, 100);
      setAlert("Maintenance tunnels flooding. Airflow is unstable.");
    },
    image: "Drain flooded_ aintenance tunnels task.png",
    atlas: "drain_task",
    panelStart: 0,
    panelCount: 10,
    location: "Lower Maintenance Tunnels",
    travelTime: 8800,
    steps: [
      { label: "1. FIND PUMP",   desc: "Move through ankle-deep water." },
      { label: "2. CLEAR FILTER",desc: "Pull debris from the intake." },
      { label: "3. OPEN DRAIN",  desc: "Turn the drain lever until it locks." },
      { label: "4. WATCH LEVEL", desc: "Wait for water to start falling." }
    ],
    failureText: "Floodwater rose and made the ventilation system unstable.",
    completionText: "Maintenance tunnel drain opened"
  },
  audio: {
    name: "Restart Audio Lure System",
    time: 6000,
    effect: () => {
      state.systems.audio = 100;
      state.audioCooldown = 0;
      state.taskEffects.splashNoise = 0;
    },
    consequence: (now) => {
      state.systems.audio = 0;
      state.audioCooldown = Math.max(state.audioCooldown, 7000);
      setAlert("PA audio lure system crashed");
    },
    image: "restarting the PA system_task.png",
    atlas: "audio_task",
    panelStart: 0,
    panelCount: 10,
    location: "PA Amplifier Cabinet",
    travelTime: 7200,
    steps: [
      { label: "1. OPEN CABINET", desc: "Find the amplifier reset panel." },
      { label: "2. DRAIN SIGNAL", desc: "Hold the discharge switch." },
      { label: "3. RESTART PA",   desc: "Cycle the lure amplifier back online." }
    ],
    failureText: "The PA audio lure system crashed and needs rebooting.",
    completionText: "PA audio lure system online"
  },
  lenses: {
    name: "Clean Camera Lenses",
    time: 5000,
    effect: () => {
      state.systems.video = 100;
      state.cameraFailed = false;
      state.taskEffects.lensObscured = 0;
    },
    consequence: (now) => {
      applyTaskEffect("lensObscured", 36000);
      state.systems.video = clamp(state.systems.video - 16, 0, 100);
      setAlert("Camera lenses obscured by condensation");
    },
    image: "tasks.png",
    atlas: "tasks",
    panelStart: 21,
    panelCount: 4,
    location: "Camera Lens Access",
    travelTime: 7200,
    steps: [
      { label: "1. WIPE GLASS",    desc: "Clear condensation from the lens cover." },
      { label: "2. CHECK FOCUS",   desc: "Hold the calibration switch." },
      { label: "3. LOCK HOUSING",  desc: "Seal the camera housing shut." }
    ],
    failureText: "Condensation spread across camera lenses.",
    completionText: "Camera lenses cleaned"
  }
};

// =========================
// TASK FUNCTIONS
// =========================

function toggleTaskMode() {
  try {
    if (!state.running || state.rebooting > 0) return;

    if (state.tasks.current) {
      setAlert("Complete the current task before returning");
      return;
    }

    state.tasks.active = !state.tasks.active;

    if (state.tasks.active) {
      // Going outside — close cameras
      state.cameraOpen = false;
      if (els.cameraPanel) els.cameraPanel.classList.remove("is-open");
      if (els.tabletToggle) els.tabletToggle.textContent = "CAMERAS";
      setAlert("Leaving security office...");
      // show corridor helpers
      startTabletGuide();
    } else {
      // Returning inside
      stopTaskAmbience();
      stopTabletGuide();
      setAlert("Returned to security office");
    }

    render();
    renderTasks();
  } catch (err) {
    console.error('toggleTaskMode error', err);
  }
}

function startTask(taskId) {
  try {
    const task = TASKS[taskId];
    if (!task) { console.warn('startTask: unknown task', taskId); return; }
    if (state.tasks.cooldown > 0 && state.tasks.required !== taskId) return;
    if (state.tasks.current) return;

    state.tasks.active       = true;
    state.tasks.current      = taskId;
    state.tasks.progress     = 0;
    state.tasks.phase        = "travel";
    state.tasks.effectApplied    = false;
    state.tasks.completionMessage = "";
    state.cameraOpen = false;
    if (els.cameraPanel) els.cameraPanel.classList.remove("is-open");
    if (els.tabletToggle) els.tabletToggle.textContent = "CAMERAS";
    startTaskAmbience();
    setAlert(`Heading out: ${task.name}`);

    render();
    renderTasks();
  } catch (err) {
    console.error('startTask error', err, taskId);
  }
}

function updateTasks(delta, now = performance.now()) {
  if (state.tasks.cooldown > 0) {
    state.tasks.cooldown = Math.max(0, state.tasks.cooldown - delta);
  }

  if (!state.tasks.nextRequiredAt) {
    scheduleNextTask(now, true);
  }

  if (!state.tasks.current && state.tasks.required && now - state.tasks.requiredSince >= TASK_IGNORE_TIME) {
    failRequiredTask(now);
  }

  if (!state.tasks.current && !state.tasks.required && now >= state.tasks.nextRequiredAt && state.rebooting <= 0) {
    triggerRequiredTask(now);
  }

  if (!state.tasks.current) return;

  const task       = TASKS[state.tasks.current];
  const travelTime = task.travelTime || TASK_DEFAULT_TRAVEL_TIME;
  const workEnd    = travelTime + task.time;
  const totalTime  = workEnd + TASK_COMPLETE_CONFIRM_TIME;

  state.tasks.progress += delta;

  if (state.tasks.progress < travelTime) {
    state.tasks.phase = "travel";
  } else if (state.tasks.progress < workEnd) {
    state.tasks.phase = "work";
  } else {
    if (!state.tasks.effectApplied) {
      completeCurrentTask(now);
    }
    state.tasks.phase = "complete";
  }

  if (state.tasks.progress >= totalTime) {
    finishTaskTrip();
  }
}

function applyTaskEffect(key, duration) {
  state.taskEffects[key] = Math.max(state.taskEffects[key] || 0, duration);
}

function updateTaskEffectTimers(delta) {
  Object.keys(state.taskEffects).forEach((key) => {
    if (typeof state.taskEffects[key] !== "number") return;
    state.taskEffects[key] = Math.max(0, state.taskEffects[key] - delta);
  });
  if (state.taskEffects.cameraBlackout <= 0) {
    state.taskEffects.disabledCamera = null;
  }
}

function taskDelayRange(now) {
  const nightLen = getNightLength(state.selectedNight);
  const progress     = clamp((now - state.startedAt) / nightLen, 0, 1);
  const nightPressure = Math.max(0, state.selectedNight - 1);
  const min = clamp(36000 - progress * 21000 - nightPressure * 1800, 11000, 42000);
  const max = clamp(56000 - progress * 28000 - nightPressure * 2400, 18000, 62000);
  return [min, Math.max(min + 5000, max)];
}

function scheduleNextTask(now, initial = false) {
  const range = initial ? [26000, 46000] : taskDelayRange(now);
  state.tasks.nextRequiredAt = now + randomBetween(range) / difficultyScale();
}

function chooseRequiredTask() {
  const ids = Object.keys(TASKS).filter((id) => id !== state.tasks.lastRequired);
  return ids[Math.floor(Math.random() * ids.length)] || "generator";
}

function triggerRequiredTask(now) {
  const taskId = chooseRequiredTask();
  state.tasks.required      = taskId;
  state.tasks.requiredSince = now;
  state.tasks.lastRequired  = taskId;
  setAlert(`Urgent maintenance: ${TASKS[taskId].name}`);
  renderTaskPopup();
}

function failRequiredTask(now) {
  const taskId = state.tasks.required;
  const task   = TASKS[taskId];
  if (!task) return;
  if (typeof task.consequence === "function") task.consequence(now);
  state.tasks.required      = null;
  state.tasks.requiredSince = 0;
  state.tasks.cooldown      = Math.max(state.tasks.cooldown, 2500);
  scheduleNextTask(now);
  renderTaskPopup();
}

function completeCurrentTask(now) {
  const taskId = state.tasks.current;
  const task   = TASKS[taskId];
  if (!task) return;
  task.effect(now);
  state.tasks.effectApplied    = true;
  state.tasks.completionMessage = task.completionText || `${task.name} completed`;
  if (state.tasks.required === taskId) {
    state.tasks.required      = null;
    state.tasks.requiredSince = 0;
    scheduleNextTask(now);
  }
  state.tasks.cooldown = 2500;
  setAlert(state.tasks.completionMessage);
  renderTaskPopup();
}

function finishTaskTrip() {
  state.tasks.current           = null;
  state.tasks.progress          = 0;
  state.tasks.phase             = "idle";
  state.tasks.effectApplied     = false;
  state.tasks.completionMessage = "";
  state.tasks.active            = false;   // ← returns player to office
  stopTaskAmbience();
  setAlert("Returned to security office");
  render();
  renderTasks();
}

function taskWorkProgress(task) {
  const travelTime = task.travelTime || TASK_DEFAULT_TRAVEL_TIME;
  return clamp(state.tasks.progress - travelTime, 0, task.time);
}

function isCameraTemporarilyDisabled(index, mode) {
  return (
    state.taskEffects.cameraBlackout > 0 &&
    state.taskEffects.disabledCameraMode === mode &&
    state.taskEffects.disabledCamera === index
  );
}

function isCurrentCameraDisabled() {
  const index = state.cameraMode === "vent" ? state.currentVentCam : state.currentCam;
  return isCameraTemporarilyDisabled(index, state.cameraMode);
}

// =========================
// CORNER TRACKER  (replaces old popup)
// =========================

function renderTaskPopup() {
  if (!els.taskPopup) return;

  // Show in-progress tracker while doing a task (any phase)
  if (state.running && state.tasks.current) {
    const task = TASKS[state.tasks.current];
    if (task) {
      let pct = 0;
      let phaseLabel = "TRAVELLING";
      if (state.tasks.phase === "work") {
        const progress = taskWorkProgress(task);
        pct = clamp((progress / task.time) * 100, 0, 100);
        phaseLabel = "IN PROGRESS";
      } else if (state.tasks.phase === "complete") {
        pct = 100;
        phaseLabel = "COMPLETE";
      }
      els.taskPopup.classList.remove("is-hidden", "is-critical");
      els.taskPopup.innerHTML = `
        <div class="task-popup-title">${phaseLabel}</div>
        <div class="task-popup-name">${task.name}</div>
        <div class="task-popup-meter"><span style="width:${pct}%; background:var(--green);"></span></div>
        <div class="task-popup-note">${task.location}</div>
      `;
      return;
    }
  }

  // Show required-task warning (when idle in office)
  if (state.running && state.tasks.required && !state.tasks.current) {
    const task    = TASKS[state.tasks.required];
    const elapsed   = performance.now() - state.tasks.requiredSince;
    const remaining = Math.max(0, TASK_IGNORE_TIME - elapsed);
    const pct       = clamp((remaining / TASK_IGNORE_TIME) * 100, 0, 100);
    els.taskPopup.classList.remove("is-hidden");
    els.taskPopup.classList.toggle("is-critical", remaining <= 10000);
    els.taskPopup.innerHTML = `
      <div class="task-popup-title">MAINTENANCE REQUIRED</div>
      <div class="task-popup-name">${task ? task.name : "Unknown"}</div>
      <div class="task-popup-meter"><span style="width:${pct}%"></span></div>
      <div class="task-popup-note">Exit office → ${Math.ceil(remaining / 1000)}s</div>
    `;
    return;
  }

  els.taskPopup.classList.add("is-hidden");
  els.taskPopup.innerHTML = "";
}

// =========================
// CORRIDOR + TABLET VIEW
// =========================

function renderCorridorWithTablet(panel) {
  const cooldownSecs = state.tasks.cooldown > 0 ? Math.ceil(state.tasks.cooldown / 1000) : 0;

  // Use first hallway frame as corridor background if available
  const hallwayFrames = getStoryboardFrames("hallway", 0, 1);
  const bgStyle = hallwayFrames.length
    ? `background-image:url("${hallwayFrames[0].src}"); background-size:cover; background-position:center;`
    : "";

  const taskButtons = Object.keys(TASKS).map((id) => {
    const task   = TASKS[id];
    const urgent  = state.tasks.required === id;
    const disabled = state.tasks.cooldown > 0 && !urgent;
    return `
      <button class="tablet-task-btn ${urgent ? "is-urgent-task" : ""}"
              onclick="startTask('${id}')" ${disabled ? "disabled" : ""}>
        <span class="tablet-task-name">${task.name}</span>
        <span class="tablet-task-loc">${task.location}</span>
        ${urgent ? '<span class="tablet-urgent-badge">URGENT</span>' : ""}
      </button>
    `;
  }).join("");

  panel.innerHTML = `
    <div class="task-screen corridor-view" style="${bgStyle}">
      <div class="corridor-overlay"></div>
      <div class="corridor-crt"></div>

      <!-- Return to office button -->
      <button class="corridor-return-btn" data-action="return">
        ◀ RETURN TO OFFICE
      </button>

      <!-- Tablet device -->
      <div class="tablet-device">
        <div class="tablet-header">
          <span class="tablet-title">⚙ MAINTENANCE TABLET</span>
          <span class="tablet-night">NIGHT ${state.selectedNight}</span>
        </div>
        ${state.tasks.required ? `
          <div class="tablet-urgent-banner">
            ▲ URGENT: ${TASKS[state.tasks.required]?.name || "MAINTENANCE NEEDED"}
          </div>
        ` : ""}
        ${cooldownSecs > 0
          ? `<div class="tablet-cooldown">System cooldown: ${cooldownSecs}s</div>`
          : ""}
        <div class="tablet-task-list">
          ${taskButtons}
        </div>
        <div class="tablet-footer">Find your way — the facility has no guides</div>
      </div>

      <!-- Big flat wide white arrow for stepping through hallway frames -->
      <button class="corridor-next-arrow" data-action="advance">CONTINUE ▶</button>

      <!-- Tablet guide popup (bottom-right) -->
      <div id="tabletGuide" class="tablet-guide" aria-hidden="true">▶</div>
    </div>
  `;
  
  // Attach listeners with event delegation
  const taskPanelEl = document.querySelector("#taskPanel");
  if (taskPanelEl) {
    taskPanelEl.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "return") {
        try { toggleTaskMode(); } catch (err) { console.error("toggleTaskMode error", err); }
      } else if (action === "advance") {
        try { advanceWalkStep(); } catch (err) { console.error("advanceWalkStep error", err); }
      }
    });
  }
}

// Helper: tablet guide timer and walk advance
let tabletGuideTimer = null;
function startTabletGuide() {
  stopTabletGuide();
  tabletGuideTimer = setInterval(() => {
    const el = document.getElementById("tabletGuide");
    if (!el) return;
    el.classList.add("is-visible");
    setTimeout(() => el.classList.remove("is-visible"), 1200);
  }, 5000);
}
function stopTabletGuide() {
  if (tabletGuideTimer) { clearInterval(tabletGuideTimer); tabletGuideTimer = null; }
}
function advanceWalkStep() {
  if (!state.tasks.current) return;
  const task = TASKS[state.tasks.current];
  if (!task) return;
  const travelTime = task.travelTime || TASK_DEFAULT_TRAVEL_TIME;
  const path = task.path || FACILITY_PATH;
  const step = travelTime / Math.max(1, path.length);
  state.tasks.progress = Math.min(state.tasks.progress + step, travelTime - 1);
  renderTasks();
}

// =========================
// TASK RENDER FUNCTIONS
// =========================

function renderTaskThreatGlimpse() {
  const mainNear =
    state.mainEnemy.active &&
    !state.ventEnemy.active &&
    Number.isInteger(state.mainEnemy.location) &&
    state.mainEnemy.location <= 2;
  const ventNear =
    state.ventEnemy.active &&
    (state.ventEnemy.crawling ||
      (Number.isInteger(state.ventEnemy.location) && state.ventEnemy.location <= 1));

  if (!mainNear && !ventNear) return "";
  const label    = ventNear ? "VENT MOVEMENT" : "DISTANT MOVEMENT";
  const ventClass = ventNear ? " is-vent" : "";
  return `
    <div class="task-threat-alert">${label}</div>
    <img class="task-threat-glimpse${ventClass}" src="willem fnaf1.png" alt="">
  `;
}

function renderTaskTravel(panel, taskId) {
  const task       = TASKS[taskId];
  const path       = task.path || FACILITY_PATH;
  const travelTime = task.travelTime || TASK_DEFAULT_TRAVEL_TIME;
  const playback   = getStoryboardPlayback("hallway", state.tasks.progress, travelTime, { minFrameTime: 820, bob: 5 });
  const frameMs    = travelTime / path.length;
  const frameIdx   = Math.min(Math.floor(state.tasks.progress / frameMs), path.length - 1);
  const caption    = path[frameIdx];
  const frameNum   = frameIdx + 1;

  panel.innerHTML = `
    <div class="task-screen task-walk-screen task-environment">
      ${renderStoryboardFrame(playback, `${playback.ready ? playback.index + 1 : frameNum} / ${playback.ready ? playback.total : path.length}`)}
      ${renderTaskThreatGlimpse()}
      <div class="task-drips"></div>
      <div class="task-light-flicker"></div>
      <div class="walk-caption">
        <span class="walk-step-num">${frameNum} / ${path.length}</span>
        <span class="walk-caption-text">${caption}</span>
      </div>
    </div>
  `;
}

function renderDolphinTask(panel) {
  const task         = TASKS.dolphins;
  const taskProgress = taskWorkProgress(task);
  const taskDuration = task.time;
  const bounded      = Math.min(taskProgress, taskDuration);
  const stepDuration = taskDuration / DOLPHIN_STEPS.length;
  const currentStep  = Math.min(Math.floor(bounded / stepDuration), DOLPHIN_STEPS.length - 1);
  const stepProgress = Math.min(1, (bounded - currentStep * stepDuration) / stepDuration);
  const overall      = Math.min(100, Math.floor((taskProgress / taskDuration) * 100));
  const storyboard   = getTaskStoryboardPlayback("dolphins", taskProgress, taskDuration);

  const stepsHtml = DOLPHIN_STEPS.map((step, index) => {
    const done   = index < currentStep;
    const active = index === currentStep;
    return `
      <div class="dolphin-step ${done ? "is-done" : ""} ${active ? "is-active" : ""}">
        <div class="dolphin-step-label">${step.label}</div>
        <div class="dolphin-step-desc">${step.desc}</div>
        ${active ? `<div class="dolphin-step-bar"><div class="dolphin-step-fill" style="width:${Math.round(stepProgress * 100)}%"></div></div>` : ""}
      </div>
    `;
  }).join("");

  panel.innerHTML = `
    <div class="task-screen task-dolphin-screen task-environment">
      <div class="dolphin-layout">
        <div class="dolphin-header">
          <span class="dolphin-title">TASK: FEED THE DOLPHINS</span>
          <span class="dolphin-overall">${overall}%</span>
        </div>
        <div class="dolphin-body">
          <div class="dolphin-location-view">
            ${renderStoryboardFrame(storyboard, `${storyboard.ready ? storyboard.index + 1 : currentStep + 1} / ${storyboard.ready ? storyboard.total : DOLPHIN_STEPS.length}`)}
            <div class="dolphin-location-label">LOCATION VIEW: DOLPHIN STADIUM</div>
          </div>
          <div class="dolphin-steps-panel">
            <div class="dolphin-steps-title">ANIMATION: FEED THE DOLPHINS</div>
            <div class="dolphin-steps">${stepsHtml}</div>
          </div>
        </div>
      </div>
      ${renderTaskThreatGlimpse()}
      <div class="task-light-flicker"></div>
    </div>
  `;
}

function renderGenericTask(panel, taskId) {
  const task       = TASKS[taskId];
  const progress   = taskWorkProgress(task);
  const pct        = Math.min(100, Math.floor((progress / task.time) * 100));
  const storyboard = getTaskStoryboardPlayback(taskId, progress, task.time);
  const steps      = task.steps || [{ label: task.name, desc: "Hold position until the task completes." }];
  const stepDuration = task.time / steps.length;
  const activeStep   = Math.min(Math.floor(progress / stepDuration), steps.length - 1);

  const stepsHtml = steps.map((step, index) => `
    <div class="maintenance-step ${index < activeStep ? "is-done" : ""} ${index === activeStep ? "is-active" : ""}">
      <div class="maintenance-step-label">${step.label}</div>
      <div class="maintenance-step-desc">${step.desc}</div>
    </div>
  `).join("");

  panel.innerHTML = `
    <div class="task-screen task-work-screen task-environment">
      ${renderStoryboardFrame(storyboard, `${storyboard.ready ? storyboard.index + 1 : activeStep + 1} / ${storyboard.ready ? storyboard.total : steps.length}`)}
      <div class="task-work-panel">
        <div class="task-title">${task.name}</div>
        <div class="task-location">${task.location}</div>
        <div class="task-progress-bar">
          <div class="task-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="task-progress">${pct}%</div>
        <div class="maintenance-steps">${stepsHtml}</div>
      </div>
      ${renderTaskThreatGlimpse()}
      <div class="task-drips"></div>
      <div class="task-light-flicker"></div>
    </div>
  `;
}

function renderTaskComplete(panel) {
  const task       = TASKS[state.tasks.current];
  const storyboard = task ? getTaskStoryboardPlayback(state.tasks.current, task.time - 1, task.time) : null;

  panel.innerHTML = `
    <div class="task-screen task-complete-screen task-environment">
      ${storyboard ? renderStoryboardFrame(storyboard, "COMPLETE") : ""}
      <div class="task-complete-box">
        <div class="task-complete-title">TASK COMPLETE</div>
        <div class="task-complete-message">${state.tasks.completionMessage}</div>
        <div class="task-complete-note">Returning to security office...</div>
      </div>
      <div class="task-light-flicker"></div>
    </div>
  `;
}

// =========================
// MAIN RENDER TASKS
// =========================

function renderTasks() {
  const panel = document.querySelector("#taskPanel");
  if (!panel) return;

  renderTaskPopup(); // Always update corner tracker

  if (!state.tasks.active) {
    panel.innerHTML = "";
    return;
  }

  // Full-screen animations for travel
  if (state.tasks.current && state.tasks.phase === "travel") {
    renderTaskTravel(panel, state.tasks.current);
    return;
  }

  // Task complete transition
  if (state.tasks.current && state.tasks.phase === "complete") {
    renderTaskComplete(panel);
    return;
  }

  // Dolphin task (special layout)
  if (state.tasks.current === "dolphins") {
    renderDolphinTask(panel);
    return;
  }

  // Generic task work screen
  if (state.tasks.current) {
    renderGenericTask(panel, state.tasks.current);
    return;
  }

  // No task selected — corridor + tablet
  renderCorridorWithTablet(panel);
}

// =========================
// TASK AMBIENCE
// =========================

function startTaskAmbience() {
  stopTaskAmbience();
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  try {
    const context = new AudioCtor();
    const hum     = context.createOscillator();
    const humGain = context.createGain();
    hum.type             = "sawtooth";
    hum.frequency.value  = 46;
    humGain.gain.value   = 0.025;
    hum.connect(humGain);
    humGain.connect(context.destination);
    hum.start();

    const dripGain   = context.createGain();
    dripGain.gain.value = 0.035;
    dripGain.connect(context.destination);
    const dripTimer = setInterval(() => {
      const drip = context.createOscillator();
      drip.type            = "sine";
      drip.frequency.value = 520 + Math.random() * 320;
      drip.connect(dripGain);
      drip.start();
      drip.stop(context.currentTime + 0.045);
    }, 900 + Math.random() * 900);

    taskAmbience = { context, hum, dripTimer };
  } catch (error) {
    taskAmbience = null;
  }
}

function stopTaskAmbience() {
  if (!taskAmbience) return;
  clearInterval(taskAmbience.dripTimer);
  try { taskAmbience.hum.stop(); } catch (e) {}
  if (typeof taskAmbience.context.close === "function") taskAmbience.context.close();
  taskAmbience = null;
}

// =========================
// ENEMY SEPARATION
// =========================

function enforceEnemySeparation() {
  if (state.ventEnemy.active) {
    state.mainEnemy.active       = false;
    state.mainEnemy.location     = null;
    state.mainEnemy.enteredOfficeAt = null;
  }
  if (state.mainEnemy.location === -1 || state.mainEnemy.enteredOfficeAt) {
    if (state.ventEnemy.active) state.ventEnemy.crawling = false;
  }
}

// =========================
// CAMERA SYSTEM
// =========================

function updateCamera() {
  const cam = state.cameraMode === "vent"
    ? VENT_CAMERAS[state.currentVentCam]
    : CAMERAS[state.currentCam];
  if (!cam) return;
  els.cameraImage.src     = cam.image || "";
  els.cameraName.textContent = `${cam.id} - ${cam.name}`;
}

function toggleCameras() {
  if (!state.running || state.rebooting > 0) return;
  if (state.tasks.active) { setAlert("Cannot access cameras while outside office"); return; }
  state.cameraOpen = !state.cameraOpen;
  els.cameraPanel.classList.toggle("is-open", state.cameraOpen);
  els.tabletToggle.textContent = state.cameraOpen ? "LOWER" : "CAMERAS";
  setAlert(state.cameraOpen ? "Camera monitor raised" : "Office view restored");
  render();
}

function toggleCameraMode() {
  if (!state.running || state.rebooting > 0) return;
  if (state.tasks.active) { setAlert("Cannot access cameras while outside office"); return; }
  state.cameraMode    = state.cameraMode === "main" ? "vent" : "main";
  state.cameraSwitching = 700;
  buildMap();
  updateCamera();
  setAlert(state.cameraMode === "vent" ? "Vent cameras online" : "Main cameras online");
  render();
  renderTasks();
}

function selectCamera(index) {
  if (!state.running || state.rebooting > 0) return;
  if (state.tasks.active) { setAlert("Cannot access cameras while outside office"); return; }
  if (state.cameraFailed) { setAlert("Video system offline"); render(); return; }
  if (state.cameraMode === "vent") state.currentVentCam = index;
  else state.currentCam = index;
  state.cameraSwitching = 700;
  state.systems.video   = clamp(state.systems.video - 0.9, 0, 100);
  updateCamera();
  render();
}

// =========================
// JUMPSCARE
// =========================

function setJumpscareFrame(frame) {
  if (els.jumpscareSprite.getAttribute("src") !== frame.src) els.jumpscareSprite.src = frame.src;
  els.jumpscareSprite.style.setProperty("--jump-scale", frame.scale);
}

// =========================
// GAME LOOP
// =========================

function tick(now) {
  if (!state.running) return;
  const delta   = now - state.lastTick;
  state.lastTick = now;

  updateTasks(delta, now);
  updateSystems(delta);
  maybeSpawnEnemies(now);
  moveMainEnemy(now);
  if (!state.running) return;
  moveVentEnemy(now);
  if (!state.running) return;
  enforceEnemySeparation();
  randomSystemFailure(now);
  checkEnd(now);
  if (!state.running) return;

  // Died while outside
  if (state.tasks.active && state.mainEnemy.enteredOfficeAt && now - state.mainEnemy.enteredOfficeAt > 3000) {
    endGame(false, "Willem entered the office while you were away.");
    return;
  }

  els.timeLabel.textContent = hourLabel(now);
  render();
  renderTasks();
  if (state.running) requestAnimationFrame(tick);
}

// =========================
// ENEMY MOVEMENT
// =========================

function chooseLocation(location, direction) {
  if (location === 0 && direction === "forward") return -1;
  const cam     = CAMERAS[location];
  if (!cam) return location;
  const forward  = cam.adjacent.filter(i => CAMERAS[i].depth < cam.depth);
  const lateral  = cam.adjacent.filter(i => CAMERAS[i].depth === cam.depth);
  const backward = cam.adjacent.filter(i => CAMERAS[i].depth > cam.depth);
  const fallback = forward.length ? forward : cam.adjacent;
  const pools = {
    forward:  forward.length  ? forward  : fallback,
    lateral:  lateral.length  ? lateral  : fallback,
    backward: backward.length ? backward : fallback
  };
  const pool = pools[direction] || fallback;
  return pool[Math.floor(Math.random() * pool.length)];
}

function chooseVentLocation(location, direction) {
  if (!Number.isInteger(location)) return 4;
  if (direction === "backward") return clamp(location + 1, 0, VENT_CAMERAS.length - 1);
  if (direction === "lateral")  return clamp(location + (Math.random() < 0.5 ? -1 : 1), 0, VENT_CAMERAS.length - 1);
  return clamp(location - 1, 0, VENT_CAMERAS.length - 1);
}

function stepTowardLocation(from, target) {
  if (!Number.isInteger(target)) return from;
  if (from === -1) return 0;
  if (!Number.isInteger(from) || from === target) return target;
  const queue    = [from];
  const previous = new Map([[from, null]]);
  while (queue.length) {
    const current = queue.shift();
    if (current === target) break;
    CAMERAS[current].adjacent.forEach(next => {
      if (!previous.has(next)) { previous.set(next, current); queue.push(next); }
    });
  }
  if (!previous.has(target)) return from;
  let step = target;
  while (previous.get(step) !== from && previous.get(step) !== null) step = previous.get(step);
  return step;
}

function scheduleMainMove(now) {
  const pressure = state.taskEffects.gateFailure > 0 ? 1.45 : 1;
  const interval = randomBetween(currentConfig().mainInterval) / (difficultyScale() * nightSpeed(now) * pressure);
  state.mainEnemy.nextMoveAt = now + interval;
}

function scheduleVentMove(now) {
  const pressure = state.taskEffects.ventRush > 0 ? 1.6 : 1;
  const interval = randomBetween(currentConfig().ventInterval) / (difficultyScale() * nightSpeed(now) * pressure);
  state.ventEnemy.nextMoveAt = now + interval;
}

function maybeSpawnEnemies(now) {
  const config = currentConfig();
  // Night 1: no enemy spawning at all
  if (state.selectedNight === 1) return;
  if (!state.ventEnemy.active && !state.mainEnemy.active && now - state.startedAt >= config.mainSpawnDelay) {
    state.mainEnemy.active   = true;
    state.mainEnemy.location = 6;
    scheduleMainMove(now);
    setAlert("Motion detected at CAM 07");
  }
}

function enterVentRoute(now) {
  state.mainEnemy.active         = false;
  state.mainEnemy.location       = null;
  state.mainEnemy.enteredOfficeAt = null;
  state.mainEnemy.lureTarget     = null;
  state.ventEnemy.active         = true;
  state.ventEnemy.location       = 4;
  state.ventEnemy.crawling       = false;
  state.ventEnemy.crawlStartedAt = null;
  state.ventEnemy.warningPlayed  = false;
  scheduleVentMove(now);
  setAlert("Willem entered the vent system");
}

function moveMainEnemy(now) {
  const enemy  = state.mainEnemy;
  const config = currentConfig();
  if (state.ventEnemy.active) return;
  if (!enemy.active || enemy.enteredOfficeAt || now < enemy.nextMoveAt || state.rebooting > 0) return;

  if (!Number.isInteger(enemy.lureTarget) && !threatRoll(config.mainAi)) {
    scheduleMainMove(now);
    return;
  }

  let next;
  if (Number.isInteger(enemy.lureTarget)) {
    next = stepTowardLocation(enemy.location, enemy.lureTarget);
    if (next === enemy.lureTarget) enemy.lureTarget = null;
  } else {
    next = chooseLocation(enemy.location, weightedDirection(config, now));
  }

  if (next !== undefined && next !== null) enemy.location = next;
  enemy.lureCounts = {};

  if (next === -1) {
    if (config.ventAi > 0) { enterVentRoute(now); return; }
    enemy.enteredOfficeAt = now;
    setAlert("Movement in the office doorway");
  } else {
    setAlert(`Motion detected: ${CAMERAS[next].id}`);
  }

  if (Number.isInteger(enemy.lureTarget)) enemy.nextMoveAt = now + 2600 / difficultyScale();
  else scheduleMainMove(now);
}

function startVentCrawl(now) {
  state.ventEnemy.crawling       = true;
  state.ventEnemy.crawlStartedAt = now;
  state.ventEnemy.warningPlayed  = false;
  state.ventEnemy.location       = null;
  setAlert("Vent sensor tripped");
  if (Number.isInteger(state.sealedVent)) repelVentEnemy(now);
}

function moveVentEnemy(now) {
  const enemy  = state.ventEnemy;
  const config = currentConfig();
  if (!enemy.active || state.rebooting > 0) return;

  if (Number.isInteger(state.sealedVent) && state.sealedVent === enemy.location) {
    repelVentEnemy(now); return;
  }

  if (enemy.crawling) {
    const crawlElapsed = now - enemy.crawlStartedAt;
    const warningDelay = state.taskEffects.ventRush > 0 ? 3200 : 5000;
    const crawlLimit   = state.taskEffects.ventRush > 0 ? 12500 : 20000;
    if (Number.isInteger(state.sealedVent)) { repelVentEnemy(now); return; }
    if (!enemy.warningPlayed && crawlElapsed >= warningDelay) {
      enemy.warningPlayed = true;
      setAlert("Vent movement heard");
    }
    if (crawlElapsed >= crawlLimit) endGame(false, "The vent path was left open.");
    return;
  }

  if (now < enemy.nextMoveAt) return;
  if (!threatRoll(config.ventAi)) { scheduleVentMove(now); return; }

  if ((enemy.location === 0 || enemy.location === 1) && Math.random() < (enemy.location === 0 ? 1 : 0.55)) {
    startVentCrawl(now); return;
  }

  enemy.location = chooseVentLocation(enemy.location, Math.random() < 0.9 ? "forward" : "lateral");
  scheduleVentMove(now);
}

function repelVentEnemy(now) {
  const retreatLocations = [2, 3, 4];
  state.ventEnemy.crawling       = false;
  state.ventEnemy.crawlStartedAt = null;
  state.ventEnemy.warningPlayed  = false;
  state.ventEnemy.active         = false;
  state.ventEnemy.location       = 4;
  state.mainEnemy.active         = true;
  state.mainEnemy.location       = retreatLocations[Math.floor(Math.random() * retreatLocations.length)];
  state.mainEnemy.enteredOfficeAt = null;
  state.mainEnemy.lureTarget     = null;
  scheduleMainMove(now);
  setAlert("Vent movement retreated");
}

// =========================
// SYSTEMS
// =========================

function updateSystems(delta) {
  if (!state.running) return;
  updateTaskEffectTimers(delta);
  state.audioCooldown  = Math.max(0, state.audioCooldown - delta);
  state.cameraSwitching = Math.max(0, state.cameraSwitching - delta);

  if (state.rebooting > 0) {
    state.rebooting = Math.max(0, state.rebooting - delta);
    if (state.rebooting === 0) {
      state.cameraFailed   = false;
      state.systems.audio  = 100;
      state.systems.video  = 100;
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
  if (state.taskEffects.powerFlicker > 0) {
    state.systems.video = clamp(state.systems.video - delta * 0.00034, 0, 100);
    state.systems.audio = clamp(state.systems.audio - delta * 0.0002, 0, 100);
  }
  if (state.taskEffects.tunnelFlood > 0) {
    state.systems.oxygen = clamp(state.systems.oxygen - delta * 0.00075, 0, 100);
  }
  if (Number.isInteger(state.sealedVent)) {
    state.systems.oxygen = clamp(state.systems.oxygen - delta * 0.00135, 0, 100);
  } else {
    state.systems.oxygen = clamp(state.systems.oxygen + delta * 0.00072, 0, 100);
  }
  if (state.systems.video <= 0 && !state.cameraFailed) {
    triggerCameraFailure("Video system failure");
  }
}

function randomSystemFailure(now) {
  if (now < state.nextFailureAt || state.rebooting > 0) return;
  const damage = 10 + Math.random() * (8 + state.selectedNight * 2);
  const roll   = Math.random();
  if (roll < 0.45) {
    state.systems.video = clamp(state.systems.video - damage, 0, 100);
    setAlert("Video disturbance detected");
    if (state.systems.video <= 0) triggerCameraFailure("Video system failure");
  } else if (roll < 0.78) {
    state.systems.audio = clamp(state.systems.audio - damage, 0, 100);
    setAlert("Audio disturbance detected");
  } else {
    state.systems.oxygen = clamp(state.systems.oxygen - damage * 0.65, 0, 100);
    setAlert("Airflow disturbance detected");
  }
  state.nextFailureAt = now + randomBetween([16000, currentConfig().failureDelay]) / difficultyScale();
}

function checkEnd(now) {
  const nightLen = getNightLength(state.selectedNight);
  const elapsed = now - state.startedAt;
  if (elapsed >= nightLen) { 
    // Night 1: just pass to Night 2. Other nights: must complete all tasks
    if (state.selectedNight === 1) {
      endGame(true, "Night 1 complete. Tutorial finished.");
    } else {
      // Count incomplete tasks
      const allComplete = Object.keys(TASKS).every(id => !state.tasks.lastRequired || state.tasks.lastRequired !== id);
      if (allComplete) {
        endGame(true);
      } else {
        endGame(false, "Night ended before all tasks completed.");
      }
    }
    return;
  }
  if (state.mainEnemy.enteredOfficeAt && now - state.mainEnemy.enteredOfficeAt > 7200) {
    endGame(false, "The office doorway was left unchecked."); return;
  }
  if (state.systems.oxygen <= 0) endGame(false, "The vent stayed closed too long.");
}

function triggerCameraFailure(message) {
  if (state.cameraFailed) return;
  state.cameraFailed  = true;
  state.systems.video = 0;
  state.cameraSwitching = 0;
  setAlert(message);
}

function isAdjacent(a, b) {
  return Number.isInteger(a) && Number.isInteger(b) && CAMERAS[a] && CAMERAS[a].adjacent.includes(b);
}

// =========================
// PLAYER ACTIONS
// =========================

function playAudio() {
  if (!state.running || state.rebooting > 0 || state.audioCooldown > 0) return;
  if (state.tasks.active)     { setAlert("Cannot use audio while outside office"); return; }
  if (!state.cameraOpen)      { setAlert("Raise cameras before playing audio"); return; }
  if (state.cameraMode !== "main") { setAlert("Audio lure uses the main cameras"); return; }
  if (state.cameraFailed || isCurrentCameraDisabled()) { setAlert("Video system offline"); return; }
  if (state.systems.audio < 14) { setAlert("Audio system error. Reboot required."); return; }

  const target     = state.currentCam;
  playSound("lure");
  const splashMask = state.taskEffects.splashNoise > 0 && Math.random() < 0.45;
  const count      = (state.mainEnemy.lureCounts[target] || 0) + 1;
  state.mainEnemy.lureCounts[target] = count;
  state.mainEnemy.totalLures += 1;
  state.systems.audio  = clamp(state.systems.audio - 12, 0, 100);
  state.audioCooldown  = LURE_COOLDOWN_MS;

  if (count > MAX_LURES_PER_CAMERA || state.mainEnemy.totalLures > MAX_TOTAL_LURES_BEFORE_FAILURE) {
    triggerCameraFailure("Audio feedback overloaded the camera system");
    render(); renderTasks(); return;
  }

  let moved = false; let partialLure = false;
  const mainLocation = state.mainEnemy.location;
  const mainCanHear  =
    state.mainEnemy.active &&
    (mainLocation === target ||
      isAdjacent(mainLocation, target) ||
      (mainLocation === -1 && (target === 0 || target === 1)));

  if (mainCanHear && !splashMask && Math.random() >= currentConfig().mainResistance) {
    const requiredLures = currentConfig().requiredLures || 1;
    const progress      = (state.mainEnemy.lureProgress[target] || 0) + 1;
    state.mainEnemy.lureProgress[target] = progress;
    if (progress >= requiredLures) {
      state.mainEnemy.enteredOfficeAt = null;
      state.mainEnemy.lureTarget  = target;
      state.mainEnemy.lureProgress = {};
      state.mainEnemy.nextMoveAt   = performance.now() + 1200;
      moved = true;
    } else {
      partialLure = true;
      setAlert(`Audio echoed at ${CAMERAS[target].id} (${progress}/${requiredLures})`);
    }
  }

  if (!partialLure) {
    setAlert(splashMask
      ? "Audio played, but splashing masks the response."
      : moved
        ? `Willem is moving toward ${CAMERAS[target].id}`
        : "Audio played. No confirmed movement.");
  }
  render(); renderTasks();
}

function toggleVent() {
  if (!state.running || state.rebooting > 0) return;
  if (state.tasks.active)          { setAlert("Cannot seal vents while outside office"); return; }
  if (state.cameraMode !== "vent") { setAlert("Switch to vent cameras first"); return; }

  const targetVent = state.currentVentCam;
  if (state.sealedVent === targetVent) {
    state.sealedVent = null;
    setAlert(`${VENT_CAMERAS[targetVent].id} opened`);
    render(); return;
  }
  state.sealedVent = targetVent;
  if (Number.isInteger(state.sealedVent)) playSound("ventSeal");
  setAlert(`${VENT_CAMERAS[targetVent].id} sealed`);
  if (state.ventEnemy.active && (state.ventEnemy.crawling || state.ventEnemy.location === targetVent)) {
    repelVentEnemy(performance.now());
  }
  render(); renderTasks();
}

function rebootAll() {
  if (!state.running || state.rebooting > 0) return;
  if (state.tasks.active) { setAlert("Cannot reboot systems while outside office"); return; }
  state.rebooting  = 4800;
  state.cameraOpen = false;
  els.cameraPanel.classList.remove("is-open");
  els.tabletToggle.textContent = "CAMERAS";
  setAlert("Rebooting systems...");
  render();
}

// =========================
// RENDERING
// =========================

function renderThreatImage(element, cameraIndex, visible, offsetX = 0, offsetY = 0, scale = 1, cameraSet = CAMERAS) {
  const cam    = cameraSet[cameraIndex] || cameraSet[0];
  const source = CAMERA_POSES[cameraIndex % CAMERA_POSES.length];
  setThreatImage(element, source);
  element.classList.toggle("is-visible", Boolean(visible));
  element.style.left      = `${cam.threat[0] + offsetX}%`;
  element.style.top       = `${cam.threat[1] + offsetY}%`;
  element.style.transform = `translate(-50%, -50%) scale(${cam.threat[2] * scale})`;
}

function render() {
  const videoOffline       = state.cameraFailed || state.rebooting > 0;
  const currentFeedDisabled = isCurrentCameraDisabled();
  const feedOffline        = videoOffline || currentFeedDisabled;
  const mainLocation       = state.mainEnemy.location;
  const ventLocation       = state.ventEnemy.location;
  const ventCrawlElapsed   = state.ventEnemy.crawling ? performance.now() - state.ventEnemy.crawlStartedAt : 0;

  els.gameFrame.classList.toggle("has-power-flicker",  state.taskEffects.powerFlicker > 0);
  els.gameFrame.classList.toggle("has-splash-noise",   state.taskEffects.splashNoise > 0);
  els.gameFrame.classList.toggle("has-tunnel-flood",   state.taskEffects.tunnelFlood > 0);
  els.nightLabel.textContent  = String(state.selectedNight);
  els.signalLabel.textContent = state.cameraFailed ? "ERR" : `${Math.round(state.systems.video)}%`;
  els.ventLabel.textContent   = Number.isInteger(state.sealedVent) ? VENT_CAMERAS[state.sealedVent].id : "OPEN";
  els.audioMeter.value = Math.round(state.systems.audio);
  els.videoMeter.value = Math.round(state.systems.video);
  els.airMeter.value   = Math.round(state.systems.oxygen);

  els.cameraPanel.classList.toggle("is-failed",        videoOffline);
  els.cameraPanel.classList.toggle("is-feed-disabled", currentFeedDisabled);
  els.cameraPanel.classList.toggle("is-vent-mode",     state.cameraMode === "vent");
  els.cameraPanel.classList.toggle("has-lens-obscured",state.taskEffects.lensObscured > 0);
  els.cameraStatic.classList.toggle("is-heavy",     feedOffline || state.taskEffects.lensObscured > 0);
  els.cameraStatic.classList.toggle("is-switching", state.cameraSwitching > 0);

  if (state.rebooting > 0)         els.cameraStatus.textContent = "REBOOTING";
  else if (state.cameraFailed)     els.cameraStatus.textContent = "ERROR";
  else if (currentFeedDisabled)    els.cameraStatus.textContent = "NO SIGNAL";
  else if (state.cameraSwitching > 0) els.cameraStatus.textContent = "TUNING";
  else                              els.cameraStatus.textContent = "ONLINE";

  const canUsePanel = state.running && state.rebooting <= 0;
  els.audioButton.disabled     = !canUsePanel || state.tasks.active || !state.cameraOpen || state.cameraMode !== "main" || state.cameraFailed || currentFeedDisabled || state.audioCooldown > 0 || state.systems.audio < 14;
  els.ventButton.disabled      = !canUsePanel || state.tasks.active || state.cameraMode !== "vent";
  els.cameraModeButton.disabled = !canUsePanel || state.cameraFailed;
  els.rebootButton.disabled    = !state.running || state.tasks.active || state.rebooting > 0;

  els.audioButton.textContent     = state.audioCooldown > 0 ? `Audio ${Math.ceil(state.audioCooldown / 1000)}s` : state.systems.audio < 14 ? "Audio Error" : "Play Audio";
  els.ventButton.textContent      = state.cameraMode !== "vent" ? "Use Vent Cams" : state.sealedVent === state.currentVentCam ? "Open Vent" : "Seal Vent";
  els.cameraModeButton.textContent = state.cameraMode === "vent" ? "Main Cams" : "Vent Cams";
  els.rebootButton.textContent    = state.rebooting > 0 ? `Reboot ${Math.ceil(state.rebooting / 1000)}s` : "Reboot All";

  // Exit arrow visibility
  if (els.exitArrow) {
    const canExit = state.running && !state.tasks.active && state.rebooting <= 0;
    els.exitArrow.disabled = !canExit;
    els.exitArrow.classList.toggle("is-active", canExit);
  }

  const viewingMain = state.cameraMode === "main";
  const viewingVent = state.cameraMode === "vent";
  const showMainThreat = viewingMain && state.mainEnemy.active && !state.ventEnemy.active && mainLocation === state.currentCam && !feedOffline;
  const showVentThreat = viewingVent && state.ventEnemy.active && !state.ventEnemy.crawling && ventLocation === state.currentVentCam && !feedOffline && state.cameraSwitching <= 0;

  renderThreatImage(els.cameraThreat, state.currentCam,    showMainThreat);
  renderThreatImage(els.ventThreat,   state.currentVentCam, showVentThreat, 0, 0, 0.88, VENT_CAMERAS);

  const mainAtOffice = state.mainEnemy.enteredOfficeAt !== null;
  const ventAtOffice = state.ventEnemy.crawling && !Number.isInteger(state.sealedVent) && ventCrawlElapsed > 15000;
  els.officeThreat.classList.toggle("is-visible",    mainAtOffice);
  els.ventOfficeThreat.classList.toggle("is-visible", ventAtOffice);
  els.hallWarning.classList.toggle("is-active",      mainAtOffice || ventAtOffice || state.systems.oxygen <= 25);

  if (currentFeedDisabled)          els.feedMeta.textContent = "Camera relay disabled. Complete camera repairs.";
  else if (state.cameraFailed)      els.feedMeta.textContent = "Video offline. Reboot required.";
  else if (state.cameraSwitching > 0) els.feedMeta.textContent = "Switching camera feed...";
  else if (state.taskEffects.lensObscured > 0) els.feedMeta.textContent = "Lens condensation detected. Visibility reduced.";
  else {
    const sealed = Number.isInteger(state.sealedVent) ? ` | Sealed ${VENT_CAMERAS[state.sealedVent].id}` : "";
    els.feedMeta.textContent = `Main ${cameraLabel(mainLocation)} | Vent ${state.ventEnemy.crawling ? "CRAWLING" : ventCameraLabel(ventLocation)}${sealed}`;
  }

  document.querySelectorAll(".cam-button").forEach((button) => {
    const camIndex   = Number(button.dataset.cam);
    const mode       = button.dataset.mode;
    const disabledCam = isCameraTemporarilyDisabled(camIndex, mode);
    const hasMain    = mode === "main" && state.mainEnemy.active && mainLocation === camIndex && !state.cameraFailed && !disabledCam;
    const hasVent    = mode === "vent" && state.ventEnemy.active && !state.ventEnemy.crawling && ventLocation === camIndex && !state.cameraFailed && !disabledCam;
    const isSealed   = mode === "vent" && state.sealedVent === camIndex;
    button.classList.toggle("is-active",       camIndex === (mode === "vent" ? state.currentVentCam : state.currentCam));
    button.classList.toggle("has-main-threat", hasMain);
    button.classList.toggle("has-vent-threat", hasVent);
    button.classList.toggle("is-sealed",       isSealed);
    button.classList.toggle("is-disabled-feed",disabledCam);
  });
}

// =========================
// JUMPSCARE & END GAME
// =========================

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

function endGame(won, reason = "") {
  if (!state.running) return;
  state.running     = false;
  state.won         = won;
  state.cameraOpen  = false;
  state.tasks.active  = false;
  state.tasks.current = null;
  stopTaskAmbience();
  els.cameraPanel.classList.remove("is-open");
  els.tabletToggle.textContent = "CAMERAS";
  els.endOverlay.classList.remove("is-hidden");
  els.gameFrame.classList.toggle("is-shaking", !won);

  if (won) {
    const nextNight  = clamp(state.selectedNight + 1, 1, 5);
    const unlocked   = Number(localStorage.getItem("fnsw_unlocked_night") || "1");
    localStorage.setItem("fnsw_unlocked_night", String(Math.max(unlocked, nextNight)));
    els.endTitle.textContent = "6 AM";
    els.endText.textContent  = state.selectedNight < 5 ? `Starting Night ${nextNight}...` : "All five prototype nights are cleared.";
    els.endImage.src = "fna willem security room.png";
    els.nextButton.classList.add("is-hidden");
    clearTimeout(state.autoAdvanceTimer);
    if (state.selectedNight < 5) {
      state.autoAdvanceTimer = setTimeout(() => resetState(nextNight, state.selectedDifficulty), 2600);
    }
  } else {
    els.endTitle.textContent = "Shift Failed";
    els.endText.textContent  = reason || "The night guard did not complete the shift.";
    els.endImage.src = "fna willem security room.png";
    els.nextButton.classList.add("is-hidden");
    playJumpscare();
  }

  syncMenu();
  renderTasks();
}

// =========================
// MAP & MENU
// =========================

function buildMap() {
  els.cameraMap.innerHTML = "";
  els.cameraMap.classList.toggle("is-vent-map", state.cameraMode === "vent");
  const mapFrames = getStoryboardFrames("minimaps");
  const mapFrame  = mapFrames[state.cameraMode === "vent" ? 1 : 0];
  els.cameraMap.classList.toggle("has-map-image", Boolean(mapFrame));
  els.cameraMap.style.backgroundImage = mapFrame ? `url("${mapFrame.src}")` : "";

  const marker = document.createElement("div");
  marker.className   = "player-marker";
  marker.textContent = "YOU";
  marker.style.left  = state.cameraMode === "vent" ? "64%" : "47%";
  marker.style.top   = state.cameraMode === "vent" ? "86%" : "88%";
  els.cameraMap.appendChild(marker);

  // Create clickable overlay with camera positions instead of separate buttons
  const cameras = state.cameraMode === "vent" ? VENT_CAMERAS : CAMERAS;
  cameras.forEach((cam, index) => {
    const hotspot = document.createElement("button");
    hotspot.type       = "button";
    hotspot.className  = "cam-button";
    hotspot.title      = cam.id;
    hotspot.dataset.cam  = String(index);
    hotspot.dataset.mode = state.cameraMode;
    // Position as overlay hotspot
    hotspot.style.left     = `${cam.map[0]}%`;
    hotspot.style.top      = `${cam.map[1]}%`;
    hotspot.style.width    = "64px";
    hotspot.style.height   = "64px";
    hotspot.style.position = "absolute";
    hotspot.style.transform = "translate(-50%, -50%)";
    hotspot.style.borderRadius = "50%";
    hotspot.style.opacity = "0"; // Invisible but clickable
    hotspot.style.cursor = "pointer";
    hotspot.style.border = "2px solid transparent";
    // Show label on hover
    hotspot.innerHTML = `<span style="position:absolute; opacity:0; transition:opacity 0.2s; pointer-events:none; white-space:nowrap; background:#000; color:#4ff0a3; padding:2px 6px; border-radius:3px; font-size:10px; top:-20px; left:50%; transform:translateX(-50%);">${cam.id}</span>`;
    hotspot.addEventListener("mouseenter", (e) => {
      const label = hotspot.querySelector("span");
      if (label) label.style.opacity = "1";
    });
    hotspot.addEventListener("mouseleave", (e) => {
      const label = hotspot.querySelector("span");
      if (label) label.style.opacity = "0";
    });
    hotspot.addEventListener("click", () => {
      try { selectCamera(index); } catch (err) { console.error('selectCamera error', err); }
    });
    els.cameraMap.appendChild(hotspot);
  });

  // Update render() to apply active styling to hotspots
  document.querySelectorAll(".cam-button").forEach((button) => {
    const camIndex   = Number(button.dataset.cam);
    const mode       = button.dataset.mode;
    const disabledCam = isCameraTemporarilyDisabled(camIndex, mode);
    const hasMain    = mode === "main" && state.mainEnemy.active && state.mainEnemy.location === camIndex && !state.cameraFailed && !disabledCam;
    const hasVent    = mode === "vent" && state.ventEnemy.active && !state.ventEnemy.crawling && state.ventEnemy.location === camIndex && !state.cameraFailed && !disabledCam;
    const isSealed   = mode === "vent" && state.sealedVent === camIndex;
    const isActive   = camIndex === (mode === "vent" ? state.currentVentCam : state.currentCam);
    
    button.classList.toggle("is-active",       isActive);
    button.classList.toggle("has-main-threat", hasMain);
    button.classList.toggle("has-vent-threat", hasVent);
    button.classList.toggle("is-sealed",       isSealed);
    button.classList.toggle("is-disabled-feed",disabledCam);
    
    // Visual feedback for active hotspot
    if (isActive) {
      button.style.opacity = "0.4";
      button.style.border = "2px solid rgba(116,240,163,0.8)";
    } else {
      button.style.opacity = "0";
      button.style.border = "2px solid transparent";
    }
  });
}

function syncMenu() {
  const unlockedNight     = Number(localStorage.getItem("fnsw_unlocked_night") || "1");
  const safeUnlockedNight = clamp(unlockedNight, 1, 5);
  els.progressNote.textContent   = safeUnlockedNight > 1 ? `Continue from Night ${safeUnlockedNight}` : "New game starts on Night 1";
  els.continueButton.disabled = safeUnlockedNight <= 1;
}

// =========================
// GAME FLOW
// =========================

function resetState(night = state.selectedNight, difficulty = state.selectedDifficulty) {
  const now = performance.now();
  clearTimeout(state.jumpscareTimer);
  clearInterval(state.jumpscareFrameTimer);
  clearTimeout(state.autoAdvanceTimer);
  stopTaskAmbience();
  state.running           = true;
  state.won               = false;
  state.selectedNight     = clamp(Number(night) || 1, 1, 5);
  state.selectedDifficulty = difficulty || "normal";
  state.cameraMode        = "main";
  state.currentCam        = 0;
  state.currentVentCam    = 0;
  state.cameraOpen        = false;
  state.cameraFailed      = false;
  state.cameraSwitching   = 0;
  state.startedAt         = now;
  state.lastTick          = now;
  state.nextFailureAt     = now + currentConfig().failureDelay;
  state.audioCooldown     = 0;
  state.rebooting         = 0;
  state.sealedVent        = null;
  state.systems.audio     = 100;
  state.systems.video     = 100;
  state.systems.oxygen    = 100;
  state.tasks.active          = false;
  state.tasks.current         = null;
  state.tasks.progress        = 0;
  state.tasks.cooldown        = 0;
  state.tasks.phase           = "idle";
  state.tasks.effectApplied   = false;
  state.tasks.required        = null;
  state.tasks.requiredSince   = 0;
  state.tasks.lastRequired    = null;
  state.tasks.completionMessage = "";
  state.taskEffects.splashNoise     = 0;
  state.taskEffects.powerFlicker    = 0;
  state.taskEffects.ventRush        = 0;
  state.taskEffects.cameraBlackout  = 0;
  state.taskEffects.disabledCamera  = null;
  state.taskEffects.disabledCameraMode = "main";
  state.taskEffects.lensObscured    = 0;
  state.taskEffects.gateFailure     = 0;
  state.taskEffects.tunnelFlood     = 0;
  
  // Night 1: no tasks, no enemy. Other nights: schedule task
  if (state.selectedNight > 1) {
    scheduleNextTask(now, true);
  } else {
    state.tasks.nextRequiredAt = Infinity; // Night 1 has no required tasks
  }
  
  state.mainEnemy.active         = false;
  state.mainEnemy.location       = 6;
  state.mainEnemy.enteredOfficeAt = null;
  state.mainEnemy.nextMoveAt     = now + currentConfig().mainSpawnDelay;
  state.mainEnemy.lureTarget     = null;
  state.mainEnemy.totalLures     = 0;
  state.mainEnemy.lureCounts     = {};
  state.mainEnemy.lureProgress   = {};
  state.ventEnemy.active         = false;
  state.ventEnemy.location       = 4;
  state.ventEnemy.crawling       = false;
  state.ventEnemy.crawlStartedAt = null;
  state.ventEnemy.warningPlayed  = false;
  state.ventEnemy.nextMoveAt     = now + 12000;

  els.nightSelect.value  = String(state.selectedNight);
  els.threatSelect.value = state.selectedDifficulty;
  els.startOverlay.classList.add("is-hidden");
  els.endOverlay.classList.add("is-hidden");
  els.jumpscareOverlay.classList.add("is-hidden");
  els.jumpscareOverlay.classList.remove("is-playing");
  els.gameFrame.classList.remove("is-shaking");
  els.cameraPanel.classList.remove("is-open");
  els.tabletToggle.textContent = "CAMERAS";
  els.timeLabel.textContent    = "12 AM";
  const nightMsg = state.selectedNight === 1 
    ? "Night 1 — Tutorial night. Familiarize yourself with the cameras."
    : "Exit the office to perform maintenance tasks";
  setAlert(`Night ${state.selectedNight} — ${nightMsg}`);
  buildMap();
  updateCamera();
  render();
  renderTasks();
  requestAnimationFrame(tick);
}

function startSelectedNight() {
  localStorage.setItem("fnsw_unlocked_night", "1");
  resetState(1, "normal");
}

function continueNight() {
  const unlockedNight = clamp(Number(localStorage.getItem("fnsw_unlocked_night") || "1"), 1, 5);
  resetState(unlockedNight, "normal");
}

function nextNight() {
  resetState(clamp(state.selectedNight + 1, 1, 5), state.selectedDifficulty);
}

function showMenu() {
  clearTimeout(state.jumpscareTimer);
  clearInterval(state.jumpscareFrameTimer);
  clearTimeout(state.autoAdvanceTimer);
  stopTaskAmbience();
  state.running     = false;
  state.cameraOpen  = false;
  state.tasks.active  = false;
  state.tasks.current = null;
  els.endOverlay.classList.add("is-hidden");
  els.jumpscareOverlay.classList.add("is-hidden");
  els.jumpscareOverlay.classList.remove("is-playing");
  els.startOverlay.classList.remove("is-hidden");
  els.cameraPanel.classList.remove("is-open");
  els.gameFrame.classList.remove("is-shaking");
  els.tabletToggle.textContent = "CAMERAS";
  syncMenu();
  render();
  renderTasks();
}

// =========================
// EVENT LISTENERS
// =========================

document.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  const key = event.key.toLowerCase();
  if (key === "c" || event.code === "Space") toggleCameras();
  if (key === "a") playAudio();
  if (key === "v") toggleVent();
  if (key === "m" || key === "x") toggleCameraMode();
  if (key === "r") rebootAll();
  if (key === "e" || key === "t") toggleTaskMode();  // E = exit/enter office
});

els.startButton.addEventListener("click",   startSelectedNight);
els.continueButton.addEventListener("click", continueNight);
els.restartButton.addEventListener("click",  () => resetState(state.selectedNight, state.selectedDifficulty));
els.nextButton.addEventListener("click",     nextNight);
els.menuButton.addEventListener("click",     showMenu);
els.tabletToggle.addEventListener("click",   toggleCameras);
els.audioButton.addEventListener("click",    playAudio);
els.ventButton.addEventListener("click",     toggleVent);
els.cameraModeButton.addEventListener("click", toggleCameraMode);
els.rebootButton.addEventListener("click",   rebootAll);

if (els.exitArrow) {
  els.exitArrow.addEventListener("click", toggleTaskMode);
}

// =========================
// ASSET SAFETY
// =========================

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    img.style.background  = "#000";
    img.style.objectFit   = "contain";
    img.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  });
});

Object.values(sounds).forEach((sound) => {
  sound.addEventListener("error", () => {
    console.warn("Missing audio:", sound.src);
  });
});

// =========================
// STARTUP
// =========================
console.log("Exiting task mode");
console.log("Overlay visibility:", els.startOverlay && els.startOverlay.classList.contains("is-hidden"));

// Global error hooks to surface runtime exceptions in the alert bar
window.addEventListener('error', (e) => {
  try {
    console.error('Uncaught error', e.error || e.message || e);
    if (els.alertBar) els.alertBar.textContent = `ERROR: ${e.message || (e.error && e.error.message) || 'Unknown'}`;
  } catch (err) { console.error(err); }
});
window.addEventListener('unhandledrejection', (ev) => {
  try {
    console.error('Unhandled promise rejection', ev.reason);
    if (els.alertBar) els.alertBar.textContent = `ERROR: ${ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)}`;
  } catch (err) { console.error(err); }
});

initStoryboardAtlases();
buildMap();
updateCamera();
syncMenu();
render();
renderTasks();

// Do NOT auto-start the game here — show the start/menu first
// resetState(1, "normal"); // removed auto-start
// Tablet guide will start when the player leaves the office

