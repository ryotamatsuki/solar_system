import "./styles.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createIcons, icons } from "lucide";

const SUN_RADIUS_KM = 696_340;
const SUN_RADIUS_UNITS = 38;
const EARTH_RADIUS_KM = 6_371;
const DEG = Math.PI / 180;
const NASA_SOLAR_SYSTEM_URL = "https://science.nasa.gov/solar-system/";
const IAU_PLUTO_URL = "https://iauarchive.eso.org/public/themes/pluto/";

const bodies = [
  {
    key: "sun",
    name: "太陽",
    type: "恒星",
    radiusKm: SUN_RADIUS_KM,
    au: 0,
    periodDays: 0,
    rotationHours: 609.1,
    axialTilt: 7.25,
    inclination: 0,
    phase: 0,
    color: "#ffc85a",
    secondary: "#f37b36",
    description:
      "太陽は約45億年前に形成された水素とヘリウム主体の恒星です。固い表面はなく、重力で惑星・小天体を太陽系に束ね、地球の生命を支える主要なエネルギー源になっています。",
    refs: [
      ["NASA Science: Our Sun Facts", "https://science.nasa.gov/sun/facts/"],
      ["NASA Science: Solar System Exploration", NASA_SOLAR_SYSTEM_URL],
    ],
  },
  {
    key: "mercury",
    name: "水星",
    type: "惑星",
    radiusKm: 2_439.7,
    au: 0.387,
    periodDays: 87.969,
    rotationHours: 1_407.6,
    axialTilt: 0.03,
    inclination: 7.005,
    phase: 34,
    color: "#8f8274",
    secondary: "#c8b8a3",
    description:
      "水星は太陽に最も近く、太陽系で最小の惑星です。ほぼ大気を持たず薄い外気圏だけがあるため、昼夜の温度差が非常に大きく、月のように多数のクレーターが残ります。",
    refs: [["NASA Science: Mercury Facts", "https://science.nasa.gov/mercury/facts/"]],
  },
  {
    key: "venus",
    name: "金星",
    type: "惑星",
    radiusKm: 6_051.8,
    au: 0.723,
    periodDays: 224.701,
    rotationHours: -5_832.5,
    axialTilt: 177.4,
    inclination: 3.395,
    phase: 114,
    color: "#d8b56f",
    secondary: "#f2d897",
    description:
      "金星は地球に近い大きさの岩石惑星ですが、厚い二酸化炭素大気と強い温室効果により太陽系で最も高温の惑星です。自転は非常に遅く、地球とは逆向きに回転します。",
    refs: [["NASA Science: Venus Facts", "https://science.nasa.gov/venus/venus-facts/"]],
  },
  {
    key: "earth",
    name: "地球",
    type: "惑星",
    radiusKm: EARTH_RADIUS_KM,
    au: 1,
    periodDays: 365.256,
    rotationHours: 23.934,
    axialTilt: 23.44,
    inclination: 0,
    phase: 204,
    color: "#2f79c5",
    secondary: "#71c587",
    description:
      "地球は液体の水が表面に安定して存在し、現在のところ生命が確認されている唯一の天体です。窒素と酸素を主成分とする大気、磁場、月との相互作用が環境を形作っています。",
    refs: [["NASA Science: Earth Facts", "https://science.nasa.gov/earth/facts/"]],
  },
  {
    key: "mars",
    name: "火星",
    type: "惑星",
    radiusKm: 3_389.5,
    au: 1.524,
    periodDays: 686.98,
    rotationHours: 24.623,
    axialTilt: 25.19,
    inclination: 1.85,
    phase: 289,
    color: "#bd5f42",
    secondary: "#e6a06c",
    description:
      "火星は鉄酸化物を含む赤い表面を持つ岩石惑星です。現在の大気は薄い二酸化炭素主体ですが、地形や鉱物の証拠から、過去には水がより活発に存在した時期があったと考えられています。",
    refs: [["NASA Science: Mars Facts", "https://science.nasa.gov/mars/facts/"]],
  },
  {
    key: "jupiter",
    name: "木星",
    type: "惑星",
    radiusKm: 69_911,
    au: 5.203,
    periodDays: 4_332.59,
    rotationHours: 9.925,
    axialTilt: 3.13,
    inclination: 1.304,
    phase: 58,
    color: "#c99f73",
    secondary: "#f1d0a0",
    description:
      "木星は太陽系最大の惑星で、水素とヘリウムを主成分とするガス巨大惑星です。縞模様の雲、長寿命の大気渦である大赤斑、多数の衛星と淡い環を持ちます。",
    refs: [["NASA Science: Jupiter Facts", "https://science.nasa.gov/jupiter/jupiter-facts/"]],
  },
  {
    key: "saturn",
    name: "土星",
    type: "惑星",
    radiusKm: 58_232,
    au: 9.537,
    periodDays: 10_759.22,
    rotationHours: 10.656,
    axialTilt: 26.73,
    inclination: 2.485,
    phase: 146,
    color: "#d9c48b",
    secondary: "#f5e1ad",
    ring: { inner: 1.18, outer: 2.42, tilt: 26.7, color: "#d9c18c" },
    description:
      "土星は太陽系で2番目に大きいガス巨大惑星で、氷と岩片からなる明るく広い環が際立ちます。衛星タイタンなど多様な衛星系も、惑星科学の重要な研究対象です。",
    refs: [["NASA Science: Saturn Facts", "https://science.nasa.gov/saturn/facts/"]],
  },
  {
    key: "uranus",
    name: "天王星",
    type: "惑星",
    radiusKm: 25_362,
    au: 19.191,
    periodDays: 30_688.5,
    rotationHours: -17.24,
    axialTilt: 97.77,
    inclination: 0.773,
    phase: 236,
    color: "#86d8d2",
    secondary: "#c6f0ed",
    ring: { inner: 1.6, outer: 2.0, tilt: 97.8, color: "#bfe4e2" },
    description:
      "天王星はメタンを含む大気で青緑色に見える氷巨大惑星です。自転軸が約98度傾き、横倒しに近い姿勢で太陽を回るため、季節変化も極端になります。",
    refs: [["NASA Science: Uranus Facts", "https://science.nasa.gov/uranus/facts/"]],
  },
  {
    key: "neptune",
    name: "海王星",
    type: "惑星",
    radiusKm: 24_622,
    au: 30.07,
    periodDays: 60_182,
    rotationHours: 16.11,
    axialTilt: 28.32,
    inclination: 1.77,
    phase: 318,
    color: "#3156d4",
    secondary: "#6d8dff",
    description:
      "海王星は太陽から最も遠い惑星で、天王星と同じ氷巨大惑星に分類されます。太陽から遠いにもかかわらず大気活動は活発で、非常に速い風や暗い嵐が観測されています。",
    refs: [["NASA Science: Neptune Facts", "https://science.nasa.gov/neptune/neptune-facts/"]],
  },
  {
    key: "pluto",
    name: "冥王星",
    type: "準惑星",
    radiusKm: 1_188.3,
    au: 39.482,
    periodDays: 90_560,
    rotationHours: -153.29,
    axialTilt: 122.5,
    inclination: 17.16,
    phase: 12,
    color: "#a78f7b",
    secondary: "#d9c8b7",
    description:
      "冥王星はカイパーベルトにある準惑星です。2006年のIAU定義で惑星から準惑星に再分類され、NASAのニュー・ホライズンズ探査では氷の平原、山地、薄い大気など複雑な世界であることが示されました。",
    refs: [
      ["NASA Science: Pluto Facts", "https://science.nasa.gov/dwarf-planets/pluto/facts/"],
      ["IAU: Pluto and the Solar System", IAU_PLUTO_URL],
    ],
  },
];

const state = {
  bodyScale: 1,
  orbitScale: 1,
  distancePower: 0.55,
  inclinationScale: 1,
  sceneTilt: 24,
  starDensity: 1,
  sunGlow: 1,
  day: 120,
  speed: 0.55,
  showLabels: true,
  showOrbits: true,
  showRings: true,
  showPluto: true,
  paused: false,
  selected: "earth",
};

const leftControls = [
  ["bodyScale", "天体スケール", 0.45, 3.5, 0.01, "x"],
  ["orbitScale", "軌道間隔", 0.35, 2.2, 0.01, "x"],
  ["distancePower", "距離圧縮", 0.32, 1, 0.01, ""],
  ["inclinationScale", "軌道傾斜", 0, 2, 0.01, "x"],
  ["sceneTilt", "ビュー傾き", 0, 70, 1, "°"],
  ["sunGlow", "太陽光", 0.35, 2, 0.01, "x"],
  ["starDensity", "星密度", 0.2, 1.8, 0.05, "x"],
];

const timeControls = [
  ["day", "基準日", 0, 900, 1, "日"],
  ["speed", "公転速度", 0, 3, 0.01, "x"],
];

const rightControls = [
  ["showLabels", "ラベル", "checkbox"],
  ["showOrbits", "軌道線", "checkbox"],
  ["showRings", "リング", "checkbox"],
  ["showPluto", "冥王星", "checkbox"],
];

const canvas = document.querySelector("#scene");
const labelLayer = document.querySelector("#label-layer");
const bodySelect = document.querySelector("#body-select");
const bodyFacts = document.querySelector("#body-facts");
const bodyBrief = document.querySelector("#body-brief");
const bodyReferences = document.querySelector("#body-references");
const selectedName = document.querySelector("#selected-name");
const selectedRatio = document.querySelector("#selected-ratio");
const selectedDistance = document.querySelector("#selected-distance");
const playToggle = document.querySelector("#play-toggle");
const resetViewButton = document.querySelector("#reset-view");
const focusButton = document.querySelector("#focus-selected");
const cameraStepButtons = document.querySelectorAll("[data-camera-step]");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#030302");

const solarGroup = new THREE.Group();
scene.add(solarGroup);

const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 12_000);
camera.position.set(0, -780, 430);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0, 0);

const ambient = new THREE.AmbientLight("#9a9080", 0.18);
scene.add(ambient);

const sunLight = new THREE.PointLight("#ffd891", 3.8, 3000, 1.2);
scene.add(sunLight);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const clock = new THREE.Clock();
const bodyObjects = new Map();
const labels = new Map();
const orbitLines = new Map();
let starField = null;
let sunGlow = null;
let maxOrbitRadius = 620;
let lastOrbitSignature = "";
let starSignature = "";
let pointerStart = null;
let cameraTween = null;

function seededRandom(seedText) {
  let seed = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) {
    seed ^= seedText.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeBodyTexture(body) {
  const size = 512;
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = size;
  textureCanvas.height = size;
  const ctx = textureCanvas.getContext("2d");
  const rand = seededRandom(body.key);

  ctx.fillStyle = body.color;
  ctx.fillRect(0, 0, size, size);

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, body.secondary);
  gradient.addColorStop(0.48, body.color);
  gradient.addColorStop(1, "#11100e");
  ctx.globalAlpha = body.key === "sun" ? 0.38 : 0.28;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const bandCount = body.key === "jupiter" ? 24 : body.key === "sun" ? 34 : 10;
  for (let i = 0; i < bandCount; i += 1) {
    const y = Math.floor(rand() * size);
    const h = Math.max(2, Math.floor(rand() * (body.key === "jupiter" ? 20 : 12)));
    ctx.globalAlpha = 0.08 + rand() * 0.18;
    ctx.fillStyle = rand() > 0.5 ? body.secondary : "#ffffff";
    ctx.fillRect(0, y, size, h);
  }

  const flecks = body.key === "sun" ? 600 : 280;
  for (let i = 0; i < flecks; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 0.6 + rand() * (body.key === "sun" ? 3.6 : 2.1);
    ctx.globalAlpha = body.key === "sun" ? 0.08 + rand() * 0.16 : 0.05 + rand() * 0.12;
    ctx.fillStyle = rand() > 0.5 ? body.secondary : "#120f0a";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  if (body.key === "earth") {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#70c98d";
    for (let i = 0; i < 18; i += 1) {
      const x = rand() * size;
      const y = rand() * size;
      ctx.beginPath();
      ctx.ellipse(x, y, 18 + rand() * 28, 5 + rand() * 12, rand() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function makeGlowTexture() {
  const size = 256;
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = size;
  glowCanvas.height = size;
  const ctx = glowCanvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255, 218, 120, 0.9)");
  g.addColorStop(0.32, "rgba(238, 137, 52, 0.36)");
  g.addColorStop(1, "rgba(238, 137, 52, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(glowCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function radiusUnits(body) {
  return (body.radiusKm / SUN_RADIUS_KM) * SUN_RADIUS_UNITS * state.bodyScale;
}

function orbitRadius(body) {
  if (body.au === 0) return 0;
  return 95 * Math.pow(body.au, state.distancePower) * state.orbitScale;
}

function createBodies() {
  const baseSphere = new THREE.SphereGeometry(1, 64, 32);
  const hitSphere = new THREE.SphereGeometry(1, 24, 12);
  const hitMaterial = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });

  bodies.forEach((body) => {
    const pivot = new THREE.Group();
    pivot.userData.body = body;

    const material =
      body.key === "sun"
        ? new THREE.MeshBasicMaterial({ map: makeBodyTexture(body), color: body.color })
        : new THREE.MeshStandardMaterial({
            map: makeBodyTexture(body),
            color: body.color,
            roughness: 0.88,
            metalness: 0.02,
          });

    const mesh = new THREE.Mesh(baseSphere, material);
    mesh.userData.bodyKey = body.key;
    mesh.rotation.z = body.axialTilt * DEG;
    pivot.add(mesh);

    const hitMesh = new THREE.Mesh(hitSphere, hitMaterial);
    hitMesh.name = "hit-target";
    hitMesh.userData.bodyKey = body.key;
    pivot.add(hitMesh);

    if (body.ring) {
      const ringGeometry = new THREE.RingGeometry(body.ring.inner, body.ring.outer, 160, 6);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: body.ring.color,
        transparent: true,
        opacity: 0.58,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.name = "ring";
      ring.rotation.x = body.ring.tilt * DEG;
      pivot.add(ring);
    }

    solarGroup.add(pivot);
    bodyObjects.set(body.key, { pivot, mesh, hitMesh });

    const label = document.createElement("span");
    label.className = "body-label";
    label.textContent = body.name;
    labelLayer.appendChild(label);
    labels.set(body.key, label);
  });

  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeGlowTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(glow);
  sunGlow = glow;
}

function createStars() {
  const signature = `${Math.round(state.starDensity * 100)}`;
  if (signature === starSignature) return;
  starSignature = signature;
  if (starField) {
    scene.remove(starField);
    starField.geometry.dispose();
    starField.material.dispose();
  }

  const count = Math.round(900 * state.starDensity);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const rand = seededRandom(`stars-${signature}`);
  const palette = [
    new THREE.Color("#f4efe6"),
    new THREE.Color("#e9b95f"),
    new THREE.Color("#77c6bd"),
    new THREE.Color("#d46a6a"),
  ];

  for (let i = 0; i < count; i += 1) {
    const radius = 2800 + rand() * 5200;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    const color = palette[Math.floor(rand() * palette.length)].clone().multiplyScalar(0.62 + rand() * 0.38);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 4,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
  });
  starField = new THREE.Points(geometry, material);
  scene.add(starField);
}

function rebuildOrbits() {
  const signature = `${state.orbitScale.toFixed(3)}-${state.distancePower.toFixed(3)}-${state.inclinationScale.toFixed(3)}-${state.showPluto}`;
  if (signature === lastOrbitSignature) return;
  lastOrbitSignature = signature;

  orbitLines.forEach((line) => {
    solarGroup.remove(line);
    line.geometry.dispose();
    line.material.dispose();
  });
  orbitLines.clear();

  maxOrbitRadius = 0;
  bodies
    .filter((body) => body.au > 0 && (body.key !== "pluto" || state.showPluto))
    .forEach((body) => {
      const r = orbitRadius(body);
      maxOrbitRadius = Math.max(maxOrbitRadius, r);
      const inc = body.inclination * state.inclinationScale * DEG;
      const points = [];
      const steps = 240;
      for (let i = 0; i <= steps; i += 1) {
        const a = (i / steps) * Math.PI * 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * Math.cos(inc);
        const z = Math.sin(a) * r * Math.sin(inc);
        points.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: body.key === state.selected ? "#e9b95f" : "#5e5a51",
        transparent: true,
        opacity: body.key === state.selected ? 0.56 : 0.24,
      });
      const line = new THREE.Line(geometry, material);
      line.visible = state.showOrbits;
      orbitLines.set(body.key, line);
      solarGroup.add(line);
    });

  maxOrbitRadius = Math.max(maxOrbitRadius, 180);
}

function updateBodyScales() {
  bodies.forEach((body) => {
    const object = bodyObjects.get(body.key);
    if (!object) return;
    const r = radiusUnits(body);
    object.mesh.scale.setScalar(r);
    object.pivot.visible = body.key !== "pluto" || state.showPluto;
    object.hitMesh.scale.setScalar(Math.max(r, body.key === "sun" ? r : 4.8));
    const ring = object.pivot.getObjectByName("ring");
    if (ring) {
      ring.visible = state.showRings;
      ring.scale.setScalar(r);
    }
  });
  if (sunGlow) {
    const sunRadius = radiusUnits(bodies[0]);
    sunGlow.scale.setScalar(sunRadius * 6.7 * state.sunGlow);
  }
}

function positionBodies(delta) {
  if (!state.paused) {
    state.day += delta * state.speed * 48;
    const dayInput = document.querySelector('[data-control="day"]');
    if (dayInput) {
      dayInput.value = state.day;
      dayInput.parentElement.querySelector(".value-readout").textContent = formatValue(state.day, "日");
    }
  }

  bodies.forEach((body) => {
    const object = bodyObjects.get(body.key);
    if (!object) return;
    if (body.au === 0) {
      object.pivot.position.set(0, 0, 0);
    } else {
      const r = orbitRadius(body);
      const angle = (body.phase + (state.day / body.periodDays) * 360) * DEG;
      const inc = body.inclination * state.inclinationScale * DEG;
      object.pivot.position.set(
        Math.cos(angle) * r,
        Math.sin(angle) * r * Math.cos(inc),
        Math.sin(angle) * r * Math.sin(inc),
      );
    }

    const rotationDays = Math.abs(body.rotationHours) / 24;
    if (rotationDays > 0) {
      const sign = body.rotationHours < 0 ? -1 : 1;
      object.mesh.rotation.y += sign * delta * state.speed * (Math.PI * 2) / Math.max(rotationDays, 0.4);
    }
  });

  const sunObject = bodyObjects.get("sun");
  if (sunGlow && sunObject) {
    sunGlow.position.copy(sunObject.pivot.position);
  }
}

function updateOrbitVisibility() {
  orbitLines.forEach((line, key) => {
    line.visible = state.showOrbits && (key !== "pluto" || state.showPluto);
    line.material.color.set(key === state.selected ? "#e9b95f" : "#5e5a51");
    line.material.opacity = key === state.selected ? 0.56 : 0.24;
  });
}

function updateLabels() {
  const width = renderer.domElement.clientWidth;
  const height = renderer.domElement.clientHeight;
  const selected = state.selected;

  bodies.forEach((body) => {
    const label = labels.get(body.key);
    const object = bodyObjects.get(body.key);
    if (!label || !object) return;
    const visible = state.showLabels && object.pivot.visible;
    label.classList.toggle("selected", body.key === selected);
    if (!visible) {
      label.style.display = "none";
      return;
    }
    const world = new THREE.Vector3();
    object.pivot.getWorldPosition(world);
    const projected = world.project(camera);
    if (projected.z < -1 || projected.z > 1) {
      label.style.display = "none";
      return;
    }
    label.style.display = "block";
    label.style.left = `${(projected.x * 0.5 + 0.5) * width}px`;
    label.style.top = `${(-projected.y * 0.5 + 0.5) * height}px`;
  });
}

function formatValue(value, unit) {
  const rounded = Math.abs(value) >= 10 ? value.toFixed(unit === "日" || unit === "°" ? 0 : 2) : value.toFixed(2);
  return `${rounded}${unit}`;
}

function createSlider(container, [key, label, min, max, step, unit]) {
  const wrapper = document.createElement("div");
  wrapper.className = "control";
  const id = `control-${key}`;
  wrapper.innerHTML = `
    <div class="control-head">
      <label for="${id}">${label}</label>
      <span class="value-readout">${formatValue(state[key], unit)}</span>
    </div>
    <input id="${id}" data-control="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}" />
  `;
  const input = wrapper.querySelector("input");
  input.addEventListener("input", () => {
    state[key] = Number(input.value);
    wrapper.querySelector(".value-readout").textContent = formatValue(state[key], unit);
    if (["orbitScale", "distancePower", "inclinationScale", "showPluto"].includes(key)) {
      rebuildOrbits();
      updateOrbitVisibility();
    }
    if (["bodyScale", "sunGlow"].includes(key)) updateBodyScales();
    if (key === "sceneTilt") solarGroup.rotation.x = state.sceneTilt * DEG;
    if (key === "starDensity") createStars();
  });
  container.appendChild(wrapper);
}

function createToggle(container, [key, label]) {
  const wrapper = document.createElement("label");
  wrapper.className = "toggle";
  wrapper.innerHTML = `
    <span>${label}</span>
    <input data-control="${key}" type="checkbox" ${state[key] ? "checked" : ""} />
  `;
  const input = wrapper.querySelector("input");
  input.addEventListener("change", () => {
    state[key] = input.checked;
    if (key === "showPluto") {
      rebuildOrbits();
      updateBodyScales();
      if (state.selected === "pluto" && !state.showPluto) selectBody("neptune");
    }
    if (key === "showOrbits") updateOrbitVisibility();
    if (key === "showRings") updateBodyScales();
  });
  container.appendChild(wrapper);
}

function buildControls() {
  leftControls.forEach((control) => createSlider(document.querySelector("#left-controls"), control));
  timeControls.forEach((control) => createSlider(document.querySelector("#time-controls"), control));
  rightControls.forEach((control) => createToggle(document.querySelector("#right-controls"), control));

  bodies.forEach((body) => {
    const option = document.createElement("option");
    option.value = body.key;
    option.textContent = `${body.name} / ${body.type}`;
    bodySelect.appendChild(option);
  });
  bodySelect.value = state.selected;
  bodySelect.addEventListener("change", () => selectBody(bodySelect.value, { focus: true }));
}

function buildRatioList() {
  const container = document.querySelector("#ratio-list");
  container.innerHTML = "";
  bodies.forEach((body) => {
    const row = document.createElement("div");
    row.className = "ratio-row";
    const ratio = body.radiusKm / SUN_RADIUS_KM;
    const percent = body.key === "sun" ? 100 : Math.max(0.25, Math.log10(1 + ratio * 120) * 42);
    row.innerHTML = `
      <span>${body.name}</span>
      <span class="ratio-track"><span class="ratio-fill" style="width:${Math.min(percent, 100)}%"></span></span>
      <span>${ratio.toFixed(body.key === "sun" ? 0 : 4)}</span>
    `;
    container.appendChild(row);
  });
}

function updateFacts() {
  const body = bodies.find((item) => item.key === state.selected) || bodies[0];
  const radiusRatio = body.radiusKm / SUN_RADIUS_KM;
  const earthRatio = body.radiusKm / EARTH_RADIUS_KM;
  bodyFacts.innerHTML = `
    <dt>種類</dt><dd>${body.type}</dd>
    <dt>半径</dt><dd>${Math.round(body.radiusKm).toLocaleString()} km</dd>
    <dt>太陽半径比</dt><dd>${radiusRatio.toFixed(body.key === "sun" ? 0 : 5)}</dd>
    <dt>地球半径比</dt><dd>${earthRatio.toFixed(2)}</dd>
    <dt>平均距離</dt><dd>${body.au ? `${body.au.toFixed(3)} AU` : "0 AU"}</dd>
    <dt>公転周期</dt><dd>${body.periodDays ? `${Math.round(body.periodDays).toLocaleString()}日` : "-"}</dd>
  `;
  selectedName.textContent = body.name;
  selectedRatio.textContent = `太陽半径比 ${radiusRatio.toFixed(body.key === "sun" ? 0 : 4)}`;
  selectedDistance.textContent = body.au ? `${body.au.toFixed(3)} AU` : "中心";
  bodyBrief.textContent = body.description;
  bodyReferences.innerHTML = body.refs
    .map(([title, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${title}</a>`)
    .join("");
}

function selectBody(key, options = {}) {
  state.selected = key;
  bodySelect.value = key;
  updateFacts();
  updateOrbitVisibility();
  if (options.focus) {
    state.paused = true;
    updatePlayIcon();
    focusBody(key);
  }
}

function getBodyWorldPosition(key) {
  const object = bodyObjects.get(key);
  if (!object) return;
  const world = new THREE.Vector3();
  object.pivot.getWorldPosition(world);
  return world;
}

function visualRadiusUnits(body) {
  const radius = radiusUnits(body);
  if (body.ring && state.showRings) return radius * body.ring.outer;
  return radius;
}

function setCameraClip(distance) {
  camera.near = Math.max(0.01, Math.min(0.1, distance / 900));
  camera.far = Math.max(12_000, maxOrbitRadius * 10, distance * 20);
  camera.updateProjectionMatrix();
}

function animateCameraTo(target, position, duration = 520) {
  cameraTween = {
    startTime: performance.now(),
    duration,
    startTarget: controls.target.clone(),
    endTarget: target.clone(),
    startPosition: camera.position.clone(),
    endPosition: position.clone(),
  };
}

function updateCameraTween() {
  if (!cameraTween) return;
  const elapsed = performance.now() - cameraTween.startTime;
  const t = Math.min(elapsed / cameraTween.duration, 1);
  const eased = 1 - Math.pow(1 - t, 3);
  controls.target.lerpVectors(cameraTween.startTarget, cameraTween.endTarget, eased);
  camera.position.lerpVectors(cameraTween.startPosition, cameraTween.endPosition, eased);
  if (t >= 1) cameraTween = null;
}

function focusBody(key) {
  const world = getBodyWorldPosition(key);
  if (!world) return;
  const body = bodies.find((item) => item.key === key) || bodies[0];
  const fitDistance = (visualRadiusUnits(body) / Math.tan((camera.fov * DEG) / 2)) * 1.65;
  const distance = Math.max(fitDistance, body.key === "sun" ? 150 : 0.42);
  const direction = camera.position.clone().sub(controls.target).normalize();
  if (!Number.isFinite(direction.lengthSq()) || direction.lengthSq() === 0) {
    direction.set(0.44, -0.78, 0.45).normalize();
  }
  setCameraClip(distance);
  animateCameraTo(world, world.clone().add(direction.multiplyScalar(distance)));
}

function focusSelected() {
  focusBody(state.selected);
}

function orbitCamera(direction) {
  const offset = camera.position.clone().sub(controls.target);
  const spherical = new THREE.Spherical().setFromVector3(offset);
  const thetaStep = 10 * DEG;
  const phiStep = 8 * DEG;

  if (direction === "left") spherical.theta += thetaStep;
  if (direction === "right") spherical.theta -= thetaStep;
  if (direction === "up") spherical.phi = Math.max(0.14, spherical.phi - phiStep);
  if (direction === "down") spherical.phi = Math.min(Math.PI - 0.14, spherical.phi + phiStep);

  const nextPosition = controls.target.clone().add(new THREE.Vector3().setFromSpherical(spherical));
  animateCameraTo(controls.target, nextPosition, 260);
}

function resetInitialView() {
  state.paused = false;
  updatePlayIcon();
  selectBody("earth");
  resetView();
}

function resetView(animate = true) {
  const target = new THREE.Vector3(0, 0, 0);
  const distance = Math.max(maxOrbitRadius * 1.55, 360);
  const position = new THREE.Vector3(0, -distance, distance * 0.56);
  setCameraClip(distance);
  if (animate) {
    animateCameraTo(target, position, 520);
    return;
  }
  controls.target.copy(target);
  camera.position.copy(position);
  controls.update();
}

function onPointerDown(event) {
  if (event.button !== 0) return;
  cameraTween = null;
  pointerStart = { x: event.clientX, y: event.clientY, time: performance.now() };
}

function onPointerUp(event) {
  if (!pointerStart) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  const elapsed = performance.now() - pointerStart.time;
  pointerStart = null;
  if (Math.hypot(dx, dy) > 5 || elapsed > 650) return;

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const meshes = [...bodyObjects.values()].map((entry) => entry.hitMesh);
  const hits = raycaster.intersectObjects(meshes, false);
  if (!hits.length) return;
  const key = hits[0].object.userData.bodyKey;
  if (key) selectBody(key, { focus: true });
}

function resize() {
  const { clientWidth, clientHeight } = canvas.parentElement;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / Math.max(clientHeight, 1);
  camera.updateProjectionMatrix();
}

function updatePlayIcon() {
  playToggle.innerHTML = state.paused
    ? '<i data-lucide="play" aria-hidden="true"></i>'
    : '<i data-lucide="pause" aria-hidden="true"></i>';
  playToggle.setAttribute("aria-label", state.paused ? "再生" : "一時停止");
  createIcons({ icons });
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.08);
  createStars();
  rebuildOrbits();
  solarGroup.rotation.x = state.sceneTilt * DEG;
  updateBodyScales();
  positionBodies(delta);
  updateCameraTween();
  controls.update();
  renderer.render(scene, camera);
  updateLabels();
  requestAnimationFrame(animate);
}

buildControls();
buildRatioList();
createBodies();
createStars();
rebuildOrbits();
updateBodyScales();
updateFacts();
updateOrbitVisibility();
resize();
resetView(false);
createIcons({ icons });

renderer.domElement.addEventListener("pointerdown", onPointerDown);
renderer.domElement.addEventListener("pointerup", onPointerUp);
window.addEventListener("resize", resize);
playToggle.addEventListener("click", () => {
  state.paused = !state.paused;
  updatePlayIcon();
});
resetViewButton.addEventListener("click", resetInitialView);
focusButton.addEventListener("click", focusSelected);
cameraStepButtons.forEach((button) => {
  button.addEventListener("click", () => orbitCamera(button.dataset.cameraStep));
});

animate();
window.__solarSystemReady = true;
