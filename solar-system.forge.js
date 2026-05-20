const SUN_RADIUS_KM = 696340;
const SUN_RADIUS_UNITS = 38;

const bodyScale = Param.number("Left / Body scale", 1, { min: 0.45, max: 3.5, step: 0.01, unit: "x" });
const orbitScale = Param.number("Left / Orbit spacing", 1, { min: 0.35, max: 2.2, step: 0.01, unit: "x" });
const distancePower = Param.number("Left / Distance compression", 0.55, { min: 0.32, max: 1, step: 0.01 });
const inclinationScale = Param.number("Left / Orbit inclination", 1, { min: 0, max: 2, step: 0.01, unit: "x" });
const day = Param.number("Right / Day", 120, { min: 0, max: 900, step: 1, unit: "d" });
const showOrbits = Param.bool("Right / Show orbit rings", true);
const showPlanetRings = Param.bool("Right / Show Saturn and Uranus rings", true);
const showPluto = Param.bool("Right / Show Pluto", true);
const orbitLineRadius = Param.number("Right / Orbit line thickness", 0.08, { min: 0.02, max: 0.35, step: 0.01, unit: "mm" });

const bodies = [
  { key: "sun", name: "Sun", radiusKm: SUN_RADIUS_KM, au: 0, periodDays: 0, inclination: 0, phase: 0, color: "#ffc85a" },
  { key: "mercury", name: "Mercury", radiusKm: 2439.7, au: 0.387, periodDays: 87.969, inclination: 7.005, phase: 34, color: "#8f8274" },
  { key: "venus", name: "Venus", radiusKm: 6051.8, au: 0.723, periodDays: 224.701, inclination: 3.395, phase: 114, color: "#d8b56f" },
  { key: "earth", name: "Earth", radiusKm: 6371, au: 1, periodDays: 365.256, inclination: 0, phase: 204, color: "#2f79c5" },
  { key: "mars", name: "Mars", radiusKm: 3389.5, au: 1.524, periodDays: 686.98, inclination: 1.85, phase: 289, color: "#bd5f42" },
  { key: "jupiter", name: "Jupiter", radiusKm: 69911, au: 5.203, periodDays: 4332.59, inclination: 1.304, phase: 58, color: "#c99f73" },
  {
    key: "saturn",
    name: "Saturn",
    radiusKm: 58232,
    au: 9.537,
    periodDays: 10759.22,
    inclination: 2.485,
    phase: 146,
    color: "#d9c48b",
    ring: { inner: 1.18, outer: 2.42, tilt: 26.7, color: "#d9c18c" },
  },
  {
    key: "uranus",
    name: "Uranus",
    radiusKm: 25362,
    au: 19.191,
    periodDays: 30688.5,
    inclination: 0.773,
    phase: 236,
    color: "#86d8d2",
    ring: { inner: 1.6, outer: 2, tilt: 97.8, color: "#bfe4e2" },
  },
  { key: "neptune", name: "Neptune", radiusKm: 24622, au: 30.07, periodDays: 60182, inclination: 1.77, phase: 318, color: "#3156d4" },
  { key: "pluto", name: "Pluto", radiusKm: 1188.3, au: 39.482, periodDays: 90560, inclination: 17.16, phase: 12, color: "#a78f7b" },
];

function radiusUnits(body) {
  return (body.radiusKm / SUN_RADIUS_KM) * SUN_RADIUS_UNITS * bodyScale;
}

function orbitRadius(body) {
  if (body.au === 0) return 0;
  return 95 * Math.pow(body.au, distancePower) * orbitScale;
}

function positionFor(body) {
  if (body.au === 0) return [0, 0, 0];
  const r = orbitRadius(body);
  const angle = (body.phase + (day / body.periodDays) * 360) * Math.PI / 180;
  const inc = body.inclination * inclinationScale * Math.PI / 180;
  return [
    Math.cos(angle) * r,
    Math.sin(angle) * r * Math.cos(inc),
    Math.sin(angle) * r * Math.sin(inc),
  ];
}

function bodyShape(body) {
  const r = radiusUnits(body);
  const [x, y, z] = positionFor(body);
  const planet = sphere(r, body.key === "sun" ? 96 : 48).color(body.color).translate(x, y, z);

  if (!body.ring || !showPlanetRings) return planet;

  const ring = torus(r * ((body.ring.inner + body.ring.outer) / 2), r * ((body.ring.outer - body.ring.inner) / 2), 128)
    .color(body.ring.color)
    .rotateX(body.ring.tilt)
    .translate(x, y, z);

  return group(
    { name: body.name, shape: planet },
    { name: `${body.name} ring`, shape: ring },
  );
}

function orbitShape(body) {
  const r = orbitRadius(body);
  const inc = body.inclination * inclinationScale;
  return torus(r, orbitLineRadius, 180).color("#5e5a51").rotateX(inc);
}

const parts = [];

for (const body of bodies) {
  if (body.key === "pluto" && !showPluto) continue;
  parts.push({ name: body.name, shape: bodyShape(body) });
  if (showOrbits && body.au > 0) {
    parts.push({ name: `${body.name} orbit`, shape: orbitShape(body) });
  }
}

return {
  model: group(...parts),
  sizeRatioLocked: true,
  note: "Every sphere radius is computed from real radiusKm / solar radiusKm. Orbit distances are compressed for viewing only.",
};
