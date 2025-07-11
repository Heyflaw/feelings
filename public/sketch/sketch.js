// By Heyflaw
// Feelings 2025
// V1.2 refactored: scaling at init and regenerate on resize
// P5.Brush library by Alejandro Campos Uribe

/***********************************
 * CONFIGURATION DES STYLES DE TRAITS
 ***********************************/
const strokeStyles = [
  //{ name: "pen", probability: 15 },
  { name: "charcoal", probability: 15 },
  //{ name: "2B", probability: 10 },
  //{ name: "HB", probability: 10 },
  //{ name: "2H", probability: 10 },
  { name: "marker", probability: 10 },
];

/***********************************
 * PALETTES DE COULEURS
 ***********************************/
const palettes = {
  palette1: {
    name: "Palette1",
    colors: ["#F1A7F2", "#3BBF44", "#37A63E", "#034001", "#F25D07"],
    probability: 10,
  },
  palette2: {
    name: "Palette2",
    colors: ["#0687F5", "#F5D40B", "#F55901", "#1D1D1B", "#EEE6D3"],
    probability: 10,
  },
  palette3: {
    name: "Palette3",
    colors: ["#F55B03", "#68A204", "#F5A099", "#EFE5D4", "#1D1D1B"],
    probability: 10,
  },
  palette4: {
    name: "Palette4",
    colors: ["#0082F5", "#04BC01", "#F5CE03", "#F50002", "#F69891"],
    probability: 10,
  },
  palette5: {
    name: "Palette5",
    colors: ["#000000", "#F263A6", "#097306", "#0D590B", "#F50404"],
    probability: 10,
  },
  palette6: {
    name: "Palette6",
    colors: ["#0B630B", "#0139BF", "#000B4B", "#0D0D0D"],
    probability: 10,
  },
  palette7: {
    name: "Palette7",
    colors: ["#F28DC4", "#44A64A", "#F2BB16", "#D5CBD6", "#ECE6A7"],
    probability: 10,
  },
  palette8: {
    name: "Palette8",
    colors: ["#FDC3D9", "#040404", "#735C17", "#000000", "#0D0D0D"],
    probability: 10,
  },
  palette9: {
    name: "Palette9",
    colors: ["#212626", "#D9D3C7", "#A6855D", "#F23827", "#A2A594"],
    probability: 10,
  },
  palette10: {
    name: "Palette10",
    colors: ["#F279B2", "#FF2592", "#090673", "#1F1BA6", "#1BA63D"],
    probability: 10,
  },
};

const colorPalettes = Object.values(palettes);

/***********************************
 * CONFIGURATION DU NOMBRE DE COUCHES
 ***********************************/
const layerOptions = [
  { numLayers: 1, probability: 10 },
  { numLayers: 2, probability: 40 },
  { numLayers: 3, probability: 50 },
];

/***********************************
 * CONFIGURATION GLOBALE
 ***********************************/
const globalConfig = {
  general: {
    canvasWidth: 600,
    canvasHeight: 600,
    margin: 50,
    numCols: 5,
    numRows: 5,
    gridStrokeWeight: 0,
    gridStrokeColor: 200,
    circleRadiusRatio: 0.4,
  },
  unusedCircles: {
    strokeBrush: "pen",
    strokeColor: "#3D3D3D",
    strokeWeightMin: 1,
    strokeWeightMax: 1,
    hatchEnabled: false,
    hatchBrush: "charcoal",
    hatchDistance: 5,
    hatchAngle: 45,
  },
};

const BASE_CANVAS_SIZE = globalConfig.general.canvasWidth; // 600
const BASE_MARGIN_RATIO = globalConfig.general.margin / BASE_CANVAS_SIZE; // 50/600 ≈ 0.0833

/***********************************
 * VARIABLES GLOBALES
 ***********************************/
let gridSize;
let layers = [];
let selectedBrush;
let selectedPalette;
let numActiveLayers;

/***********************************
 * FONCTIONS UTILITAIRES
 ***********************************/
function scaleParameter(baseValue, ratio, factor = 0.3) {
  return baseValue * (1 - factor + factor * ratio);
}

function constrainStrokeWeight(weight, minWeight, maxWeight) {
  return constrain(weight, minWeight, maxWeight);
}

function constrainHatchDistance(distance, minDistance, maxDistance) {
  return constrain(distance, minDistance, maxDistance);
}

function constrainHatchRand(rand, minRand, maxRand) {
  return constrain(rand, minRand, maxRand);
}

function selectBasedOnProbability(options) {
  let totalProbability = options.reduce(
    (acc, option) => acc + option.probability,
    0
  );
  let randomNum = random(totalProbability);
  let cumulativeProbability = 0;
  for (let option of options) {
    cumulativeProbability += option.probability;
    if (randomNum <= cumulativeProbability) return option.name;
  }
  return options[0].name;
}

function selectPalette(options) {
  let totalProbability = options.reduce(
    (acc, option) => acc + option.probability,
    0
  );
  let randomNum = random(totalProbability);
  let cumulativeProbability = 0;
  for (let option of options) {
    cumulativeProbability += option.probability;
    if (randomNum <= cumulativeProbability) return option;
  }
  return options[0];
}

function selectNumLayers(options) {
  let totalProbability = options.reduce(
    (acc, option) => acc + option.probability,
    0
  );
  let randomNum = random(totalProbability);
  let cumulativeProbability = 0;
  for (let option of options) {
    cumulativeProbability += option.probability;
    if (randomNum <= cumulativeProbability) return option.numLayers;
  }
  return options[0].numLayers;
}

function toWebGLCoords(x, y) {
  return { x: x - width / 2, y: -y + height / 2 };
}

function pointLineDistance(pt, v, w) {
  let l2 = sq(w.x - v.x) + sq(w.y - v.y);
  if (l2 === 0) return dist(pt.x, pt.y, v.x, v.y);
  let t = max(
    0,
    min(1, ((pt.x - v.x) * (w.x - v.x) + (pt.y - v.y) * (w.y - v.y)) / l2)
  );
  return dist(pt.x, pt.y, v.x + t * (w.x - v.x), v.y + t * (w.y - v.y));
}

function drawBrushCircle(
  x,
  y,
  radius,
  strokeBrush,
  strokeColor,
  strokeWeight,
  hatchEnabled,
  hatchBrush,
  hatchDistance,
  hatchRand,
  hatchAngle
) {
  brush.noHatch();
  brush.noFill();
  brush.set(strokeBrush, strokeColor, strokeWeight);
  brush.circle(x, y, radius);
  if (hatchEnabled && hatchBrush && hatchDistance && hatchAngle) {
    brush.setHatch(hatchBrush, strokeColor);
    brush.hatch(hatchDistance, hatchAngle, {
      brush: hatchBrush,
      rand: hatchRand,
    });
    brush.noFill();
    brush.circle(x, y, radius);
  }
  brush.reDraw();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getAllPermutations(array) {
  if (array.length <= 1) return [array];
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let current = array[i];
    let remaining = array.slice(0, i).concat(array.slice(i + 1));
    let perms = getAllPermutations(remaining);
    for (let perm of perms) {
      result.push([current].concat(perm));
    }
  }
  return result;
}

function isPermutationValid(perm, originalCircles) {
  let n = perm.length;
  for (let i = 0; i < n; i++) {
    let c1 = originalCircles[perm[i]];
    let c2 = originalCircles[perm[(i + 1) % n]];
    let c3 = originalCircles[perm[(i + 2) % n]];
    if (
      (abs(c1.y - c2.y) < 1 && abs(c2.y - c3.y) < 1) ||
      (abs(c1.x - c2.x) < 1 && abs(c2.x - c3.x) < 1)
    )
      return false;
  }
  return true;
}

/***********************************
 * CONFIGURATION DES COUCHES
 ***********************************/
const layerConfigs = [
  {
    circles: {
      numCircles: null,
      circleStrokeWeightMin: null,
      circleStrokeWeightMax: null,
    },
    usedCircles: {
      strokeBrush: null,
      strokeColor: null,
      strokeWeightMin: null,
      strokeWeightMax: null,
      hatchEnabled: null,
      hatchBrush: null,
      hatchDistance: null,
      hatchRand: null,
      hatchAngle: null,
    },
    path: {
      strokeBrush: null,
      strokeColor: null,
      strokeWeightMin: null,
      strokeWeightMax: null,
      hatchEnabled: null,
      hatchBrush: null,
      hatchDistance: null,
      hatchRand: null,
      hatchAngle: null,
    },
    pathGeneration: { degenerateThreshold: 1, arcSteps: 50, maxAdjust: 20 },
  },
  {
    circles: {
      numCircles: null,
      circleStrokeWeightMin: null,
      circleStrokeWeightMax: null,
    },
    usedCircles: {
      strokeBrush: null,
      strokeColor: null,
      strokeWeightMin: null,
      strokeWeightMax: null,
      hatchEnabled: null,
      hatchBrush: null,
      hatchDistance: null,
      hatchRand: null,
      hatchAngle: null,
    },
    path: {
      strokeBrush: null,
      strokeColor: null,
      strokeWeightMin: null,
      strokeWeightMax: null,
      hatchEnabled: null,
      hatchBrush: null,
      hatchDistance: null,
      hatchRand: null,
      hatchAngle: null,
    },
    pathGeneration: { degenerateThreshold: 1, arcSteps: 50, maxAdjust: 20 },
  },
  {
    circles: {
      numCircles: null,
      circleStrokeWeightMin: null,
      circleStrokeWeightMax: null,
    },
    usedCircles: {
      strokeBrush: null,
      strokeColor: null,
      strokeWeightMin: null,
      strokeWeightMax: null,
      hatchEnabled: null,
      hatchBrush: null,
      hatchDistance: null,
      hatchRand: null,
      hatchAngle: null,
    },
    path: {
      strokeBrush: null,
      strokeColor: null,
      strokeWeightMin: null,
      strokeWeightMax: null,
      hatchEnabled: null,
      hatchBrush: null,
      hatchDistance: null,
      hatchRand: null,
      hatchAngle: null,
    },
    pathGeneration: { degenerateThreshold: 1, arcSteps: 50, maxAdjust: 20 },
  },
];

/***********************************
 * INIT ET SCALING DES LAYERS
 ***********************************/
function initLayers() {
  const cont = document.getElementById("p5-container");
  const size = cont ? cont.offsetWidth : globalConfig.general.canvasWidth;
  const ratio = size / BASE_CANVAS_SIZE;
  globalConfig.general.margin = size * BASE_MARGIN_RATIO;
  gridSize =
    (size - 2 * globalConfig.general.margin) / globalConfig.general.numCols;

  numActiveLayers = selectNumLayers(layerOptions);
  selectedBrush = selectBasedOnProbability(strokeStyles);
  selectedPalette = selectPalette(colorPalettes);

  // Stroke weight ranges based on brush
  let cSWmin,
    cSWmax,
    pSWmin,
    pSWmax,
    cSWminScaled,
    cSWmaxScaled,
    pSWminScaled,
    pSWmaxScaled;
  switch (selectedBrush) {
    case "pen":
      cSWmin = 2;
      cSWmax = 2.5;
      pSWmin = 2;
      pSWmax = 2.5;
      cSWminScaled = 1.5;
      cSWmaxScaled = 3;
      pSWminScaled = 1.5;
      pSWmaxScaled = 3;
      break;
    case "charcoal":
      cSWmin = 0.5;
      cSWmax = 1.2;
      pSWmin = 0.5;
      pSWmax = 1.2;
      cSWminScaled = 0.8;
      cSWmaxScaled = 1.5;
      pSWminScaled = 0.8;
      pSWmaxScaled = 1.5;
      break;
    case "2B":
      cSWmin = 1.5;
      cSWmax = 2;
      pSWmin = 1.5;
      pSWmax = 2;
      cSWminScaled = 1;
      cSWmaxScaled = 2.5;
      pSWminScaled = 1;
      pSWmaxScaled = 2.5;
      break;
    case "HB":
      cSWmin = 1.5;
      cSWmax = 2;
      pSWmin = 1.5;
      pSWmax = 2;
      cSWminScaled = 1;
      cSWmaxScaled = 2.5;
      pSWminScaled = 1;
      pSWmaxScaled = 2.5;
      break;
    case "2H":
      cSWmin = 1.5;
      cSWmax = 2.5;
      pSWmin = 1.5;
      pSWmax = 2.5;
      cSWminScaled = 1;
      cSWmaxScaled = 3;
      pSWminScaled = 1;
      pSWmaxScaled = 3;
      break;
    case "marker":
      cSWmin = 0.5;
      cSWmax = 1;
      pSWmin = 0.5;
      pSWmax = 1;
      cSWminScaled = 0.5;
      cSWmaxScaled = 1.5;
      pSWminScaled = 0.5;
      pSWmaxScaled = 1.5;
      break;
    default:
      cSWmin = 0.5;
      cSWmax = 1.5;
      pSWmin = 0.3;
      pSWmax = 1;
      cSWminScaled = 0.5;
      cSWmaxScaled = 2;
      pSWminScaled = 0.5;
      pSWmaxScaled = 2;
  }

  if (
    numActiveLayers === 1 &&
    ["pen", "HB", "2B", "2H"].includes(selectedBrush)
  ) {
    cSWmin = 2;
    cSWmax = 2.5;
    pSWmin = 2;
    pSWmax = 2.5;
    cSWminScaled = 1.5;
    cSWmaxScaled = 3;
    pSWminScaled = 1.5;
    pSWmaxScaled = 3;
  }

  globalConfig.unusedCircles.baseStrokeWeight = random(
    globalConfig.unusedCircles.strokeWeightMin,
    globalConfig.unusedCircles.strokeWeightMax
  );
  globalConfig.unusedCircles.strokeWeight = constrainStrokeWeight(
    scaleParameter(globalConfig.unusedCircles.baseStrokeWeight, ratio),
    0.8,
    3.5
  );

  layers = [];
  for (let i = 0; i < numActiveLayers; i++) {
    let cfg = layerConfigs[i];
    if (numActiveLayers === 1) {
      cfg.circles.numCircles = floor(random(6, 10));
    } else if (numActiveLayers === 2) {
      let idx8 = floor(random(2));
      cfg.circles.numCircles = i === idx8 ? 8 : floor(random(5, 9));
    } else {
      let idx8 = floor(random(3));
      cfg.circles.numCircles = i === idx8 ? 8 : floor(random(5, 7));
    }

    cfg.usedCircles.strokeBrush = selectedBrush;
    cfg.usedCircles.strokeColor = random(selectedPalette.colors);
    cfg.usedCircles.baseStrokeWeight = random(cSWmin, cSWmax);
    cfg.usedCircles.strokeWeight = constrainStrokeWeight(
      scaleParameter(cfg.usedCircles.baseStrokeWeight, ratio),
      cSWminScaled,
      cSWmaxScaled
    );
    cfg.usedCircles.hatchEnabled = random() > 0.5;
    if (cfg.usedCircles.hatchEnabled) {
      cfg.usedCircles.hatchBrush =
        strokeStyles[floor(random(strokeStyles.length))].name;
      cfg.usedCircles.baseHatchRand = random(0.1, 0.3);
      cfg.usedCircles.hatchRand = constrainHatchRand(
        scaleParameter(cfg.usedCircles.baseHatchRand, ratio, 0.3),
        0.1,
        0.35
      );
      cfg.usedCircles.baseHatchDistance = random(1, 5);
      cfg.usedCircles.hatchDistance = constrainHatchDistance(
        scaleParameter(cfg.usedCircles.baseHatchDistance, ratio, 0.3),
        0.5,
        4
      );
      cfg.usedCircles.hatchAngle = random(0, 180);
    }

    cfg.path.strokeBrush = selectedBrush;
    cfg.path.strokeColor = random(selectedPalette.colors);
    cfg.path.baseStrokeWeight = random(pSWmin, pSWmax);
    cfg.path.strokeWeight = constrainStrokeWeight(
      scaleParameter(cfg.path.baseStrokeWeight, ratio),
      pSWminScaled,
      pSWmaxScaled
    );
    cfg.path.hatchEnabled = random() > 0.5;
    if (cfg.path.hatchEnabled) {
      cfg.path.hatchBrush =
        strokeStyles[floor(random(strokeStyles.length))].name;
      cfg.path.baseHatchRand = random(0.1, 0.3);
      cfg.path.hatchRand = constrainHatchRand(
        scaleParameter(cfg.path.baseHatchRand, ratio, 0.3),
        0.1,
        0.35
      );
      cfg.path.baseHatchDistance = random(1, 4);
      cfg.path.hatchDistance = constrainHatchDistance(
        scaleParameter(cfg.path.baseHatchDistance, ratio, 0.3),
        0.5,
        3.5
      );
      cfg.path.hatchAngle = random(0, 180);
    }

    let layer = {
      config: cfg,
      circles: [],
      selectedPath: null,
      initialRotation: null,
    };
    generateCirclesForLayer(layer);
    let res = indefiniteFindValidPathForLayer(layer);
    if (res) layer.selectedPath = res.path;
    layers.push(layer);
  }

  // Logs pour débogage
  console.log(`Canvas size: ${size}, Ratio: ${ratio.toFixed(3)}`);
  layers.forEach((layer, i) => {
    console.log(`Layer ${i + 1}:`);
    console.log(
      `  usedCircles - strokeWeight: ${layer.config.usedCircles.strokeWeight.toFixed(
        2
      )}, hatchDistance: ${
        layer.config.usedCircles.hatchDistance?.toFixed(2) || "N/A"
      }, hatchRand: ${layer.config.usedCircles.hatchRand?.toFixed(2) || "N/A"}`
    );
    console.log(
      `  path - strokeWeight: ${layer.config.path.strokeWeight.toFixed(
        2
      )}, hatchDistance: ${
        layer.config.path.hatchDistance?.toFixed(2) || "N/A"
      }, hatchRand: ${layer.config.path.hatchRand?.toFixed(2) || "N/A"}`
    );
  });
}

/***********************************
 * SETUP & RESIZE
 ***********************************/
function setup() {
  pixelDensity(2);
  const cont = document.getElementById("p5-container");
  const size = cont ? cont.offsetWidth : globalConfig.general.canvasWidth;
  createCanvas(size, size, WEBGL).parent("p5-container");
  background("rgb(244,245,239)");
  brush.load();
  initLayers();
  drawGrid();
  drawAllLayers();
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

function windowResized() {
  const cont = document.getElementById("p5-container");
  const size = cont ? cont.offsetWidth : globalConfig.general.canvasWidth;
  resizeCanvas(size, size);
  background("rgb(244,245,239)");
  brush.load();
  initLayers();
  drawGrid();
  drawAllLayers();
}

/***********************************
 * FONCTIONS DE DESSIN
 ***********************************/
function drawGrid() {
  stroke(globalConfig.general.gridStrokeColor);
  strokeWeight(globalConfig.general.gridStrokeWeight);
  for (let i = 0; i <= globalConfig.general.numCols; i++) {
    let x = globalConfig.general.margin + i * gridSize;
    let webGLX = toWebGLCoords(x, 0).x;
    line(
      webGLX,
      toWebGLCoords(0, globalConfig.general.margin).y,
      webGLX,
      toWebGLCoords(0, height - globalConfig.general.margin).y
    );
  }
  for (let j = 0; j <= globalConfig.general.numRows; j++) {
    let y = globalConfig.general.margin + j * gridSize;
    let webGLY = toWebGLCoords(0, y).y;
    line(
      toWebGLCoords(globalConfig.general.margin, 0).x,
      webGLY,
      toWebGLCoords(width - globalConfig.general.margin, 0).x,
      webGLY
    );
  }
}

function drawAllLayers() {
  drawUnusedCircles(globalConfig);
  for (let i = 0; i < layers.length; i++) {
    drawCirclesAndNumbersForLayer(layers[i]);
    if (layers[i].selectedPath) drawCompletePathWithBrushForLayer(layers[i]);
  }
}

function drawUnusedCircles(config) {
  let allUsedPositions = layers.flatMap((l) => l.circles);
  for (let col = 0; col < globalConfig.general.numCols; col++) {
    for (let row = 0; row < globalConfig.general.numRows; row++) {
      let x = globalConfig.general.margin + col * gridSize + gridSize / 2;
      let y = globalConfig.general.margin + row * gridSize + gridSize / 2;
      let pos = toWebGLCoords(x, y);
      if (!allUsedPositions.some((p) => dist(p.x, p.y, pos.x, pos.y) < 1)) {
        drawBrushCircle(
          pos.x,
          pos.y,
          gridSize * globalConfig.general.circleRadiusRatio -
            config.unusedCircles.strokeWeight / 2,
          config.unusedCircles.strokeBrush,
          config.unusedCircles.strokeColor,
          config.unusedCircles.strokeWeight,
          config.unusedCircles.hatchEnabled,
          config.unusedCircles.hatchBrush,
          config.unusedCircles.hatchDistance,
          config.unusedCircles.hatchRand,
          config.unusedCircles.hatchAngle
        );
      }
    }
  }
}

function drawCirclesAndNumbersForLayer(layer) {
  let radius =
    gridSize * globalConfig.general.circleRadiusRatio -
    layer.config.usedCircles.strokeWeight / 2;
  for (let i = 0; i < layer.circles.length; i++) {
    let c = layer.circles[i];
    drawBrushCircle(
      c.x,
      c.y,
      radius,
      layer.config.usedCircles.strokeBrush,
      layer.config.usedCircles.strokeColor,
      layer.config.usedCircles.strokeWeight,
      layer.config.usedCircles.hatchEnabled,
      layer.config.usedCircles.hatchBrush,
      layer.config.usedCircles.hatchDistance,
      layer.config.usedCircles.hatchRand,
      layer.config.usedCircles.hatchAngle
    );
  }
}

function drawCompletePathWithBrushForLayer(layer) {
  brush.noHatch();
  brush.noFill();
  brush.set(
    layer.config.path.strokeBrush,
    layer.config.path.strokeColor,
    layer.config.path.strokeWeight
  );
  if (
    layer.config.path.hatchEnabled &&
    layer.config.path.hatchDistance &&
    layer.config.path.hatchAngle
  ) {
    brush.setHatch(layer.config.path.hatchBrush, layer.config.path.strokeColor);
    brush.hatch(layer.config.path.hatchDistance, layer.config.path.hatchAngle, {
      brush: layer.config.path.hatchBrush,
      rand: layer.config.path.hatchRand || 0,
    });
  }

  brush.beginShape();
  for (let i = 0; i < layer.selectedPath.length; i++) {
    let tangent = layer.selectedPath[i];
    brush.vertex(tangent.p1.x, tangent.p1.y);
    brush.vertex(tangent.p2.x, tangent.p2.y);

    let arcPoints = computeArcForConnection(i, layer.selectedPath, layer);
    arcPoints.forEach((p) => {
      brush.vertex(p.x, p.y);
    });
  }
  brush.endShape(CLOSE);
  brush.reDraw();
}

/***********************************
 * GÉNÉRATION DES CERCLES ET CHEMINS
 ***********************************/
function generateCirclesForLayer(layer) {
  let positions = [];
  for (let col = 0; col < globalConfig.general.numCols; col++) {
    for (let row = 0; row < globalConfig.general.numRows; row++) {
      let x = globalConfig.general.margin + col * gridSize + gridSize / 2;
      let y = globalConfig.general.margin + row * gridSize + gridSize / 2;
      positions.push(
        createVector(toWebGLCoords(x, y).x, toWebGLCoords(x, y).y)
      );
    }
  }
  shuffleArray(positions);
  layer.circles = positions.slice(0, layer.config.circles.numCircles);
}

function indefiniteFindValidPathForLayer(layer) {
  let localAttempts = 0;
  while (localAttempts < 100) {
    let result = findValidPathWithPermutationForLayer(layer);
    if (result) return result;
    localAttempts++;
    if (localAttempts % 10 === 0) {
      generateCirclesForLayer(layer);
    }
  }
  return null;
}

function findValidPathWithPermutationForLayer(layer) {
  let indices = [];
  for (let i = 0; i < layer.circles.length; i++) indices.push(i);
  let perms = getAllPermutations(indices);
  shuffleArray(perms);
  let originalCircles = layer.circles.slice();
  for (let perm of perms) {
    if (!isPermutationValid(perm, originalCircles)) continue;
    let permutedCircles = [];
    for (let index of perm) permutedCircles.push(originalCircles[index]);
    layer.circles = permutedCircles;
    layer.initialRotation = null;
    let path = findValidPathForLayer(layer);
    if (path !== null) return { path: path, perm: perm };
    layer.circles = originalCircles.slice();
  }
  return null;
}

function findValidPathForLayer(layer) {
  let path = [];
  layer.initialRotation = null;

  function backtrack(i, currentDir) {
    if (i === layer.config.circles.numCircles) {
      if (!checkDegenerateArcs(path, layer.config)) return false;
      if (checkArcTangentCrossings(path, layer).length > 0) return false;
      return true;
    }

    let fromIndex = i;
    let toIndex = (i + 1) % layer.config.circles.numCircles;
    let c1 = layer.circles[fromIndex];
    let c2 = layer.circles[toIndex];
    let circleRadius =
      gridSize * globalConfig.general.circleRadiusRatio -
      layer.config.usedCircles.strokeWeight / 2;
    let tangents = getTangents(c1, c2, circleRadius);

    let allowedTypes = [];
    if (i === 0) {
      allowedTypes = tangents.map((t) => t.type);
    } else if (i < layer.config.circles.numCircles - 1) {
      allowedTypes =
        currentDir === "clockwise"
          ? ["external_lower", "internal_lower"]
          : ["external_upper", "internal_upper"];
    } else {
      allowedTypes =
        layer.initialRotation === "clockwise"
          ? currentDir === "clockwise"
            ? ["external_lower"]
            : ["internal_upper"]
          : currentDir === "counterclockwise"
          ? ["external_upper"]
          : ["internal_lower"];
    }

    let candidateTangents = tangents
      .filter((t) => allowedTypes.includes(t.type))
      .filter((candidate) => {
        for (let seg of path) {
          if (doLinesCross(candidate.p1, candidate.p2, seg.p1, seg.p2))
            return false;
        }
        for (let j = 0; j < layer.circles.length; j++) {
          if (j === fromIndex || j === toIndex) continue;
          let d = pointLineDistance(
            layer.circles[j],
            candidate.p1,
            candidate.p2
          );
          if (d < gridSize * globalConfig.general.circleRadiusRatio * 0.95)
            return false;
        }
        return true;
      });

    shuffleArray(candidateTangents);

    for (let candidate of candidateTangents) {
      let candidateArcDir;
      if (i === 0) {
        if (candidate.type === "external_lower") {
          layer.initialRotation = "clockwise";
          candidateArcDir = "clockwise";
        } else if (candidate.type === "external_upper") {
          layer.initialRotation = "counterclockwise";
          candidateArcDir = "counterclockwise";
        } else if (candidate.type === "internal_lower") {
          layer.initialRotation = "clockwise";
          candidateArcDir = "counterclockwise";
        } else if (candidate.type === "internal_upper") {
          layer.initialRotation = "counterclockwise";
          candidateArcDir = "clockwise";
        }
      } else {
        candidateArcDir = candidate.type.startsWith("external")
          ? currentDir
          : currentDir === "clockwise"
          ? "counterclockwise"
          : "clockwise";
      }

      path.push({
        from: fromIndex,
        to: toIndex,
        p1: candidate.p1,
        p2: candidate.p2,
        type: candidate.type,
        arcDir: candidateArcDir,
      });

      if (backtrack(i + 1, candidateArcDir)) return true;

      path.pop();
      if (i === 0) layer.initialRotation = null;
    }
    return false;
  }

  return backtrack(0, null) ? path : null;
}

function checkDegenerateArcs(path, config) {
  let n = path.length;
  for (let i = 0; i < n; i++) {
    let pA = path[i].p2;
    let pB = path[(i + 1) % n].p1;
    if (
      dist(pA.x, pA.y, pB.x, pB.y) < config.pathGeneration.degenerateThreshold
    )
      return false;
  }
  return true;
}

function checkArcTangentCrossings(path, layer) {
  let crosses = [];
  let n = path.length;
  for (let i = 0; i < n; i++) {
    let arcPoints = computeArcForConnection(i, path, layer);
    for (let j = 0; j < n; j++) {
      if (j === i || j === (i + 1) % n) continue;
      let tangent = path[j];
      for (let k = 0; k < arcPoints.length - 1; k++) {
        let arcSegStart = arcPoints[k];
        let arcSegEnd = arcPoints[k + 1];
        if (doLinesCross(arcSegStart, arcSegEnd, tangent.p1, tangent.p2)) {
          crosses.push({ arc: i + 1, tangent: j + 1 });
          break;
        }
      }
    }
  }
  return crosses;
}

function computeArcForConnection(i, path, layer) {
  let n = path.length;
  let current = path[i];
  let next = path[(i + 1) % n];
  let circleCenter = layer.circles[current.to];
  let startAngle =
    (atan2(current.p2.y - circleCenter.y, current.p2.x - circleCenter.x) +
      TWO_PI) %
    TWO_PI;
  let endAngle =
    (atan2(next.p1.y - circleCenter.y, next.p1.x - circleCenter.x) + TWO_PI) %
    TWO_PI;
  let isCW = current.arcDir === "clockwise";
  let arcRadius =
    gridSize * globalConfig.general.circleRadiusRatio -
    layer.config.usedCircles.strokeWeight / 2;
  return sampleArc(
    circleCenter,
    arcRadius,
    startAngle,
    endAngle,
    isCW,
    layer.config.pathGeneration.arcSteps
  );
}

function sampleArc(circleCenter, radius, startAngle, endAngle, isCW, steps) {
  let points = [];
  if (isCW) {
    if (endAngle <= startAngle) endAngle += TWO_PI;
    let delta = (endAngle - startAngle) / steps;
    for (let i = 0; i <= steps; i++) {
      let theta = startAngle + i * delta;
      let x = circleCenter.x + radius * cos(theta);
      let y = circleCenter.y + radius * sin(theta);
      points.push(createVector(x, y));
    }
  } else {
    if (startAngle <= endAngle) startAngle += TWO_PI;
    let delta = (startAngle - endAngle) / steps;
    for (let i = 0; i <= steps; i++) {
      let theta = startAngle - i * delta;
      let x = circleCenter.x + radius * cos(theta);
      let y = circleCenter.y + radius * sin(theta);
      points.push(createVector(x, y));
    }
  }
  return points;
}

function getTangents(c1, c2, r) {
  let dx = c2.x - c1.x,
    dy = c2.y - c1.y,
    dist = sqrt(dx * dx + dy * dy);
  if (dist === 0) return [];
  let angle = atan2(dy, dx),
    tangents = [];
  [-1, 1].forEach((sign) => {
    let angle1 = angle + (sign * PI) / 2;
    tangents.push({
      p1: createVector(c1.x + r * cos(angle1), c1.y + r * sin(angle1)),
      p2: createVector(c2.x + r * cos(angle1), c2.y + r * sin(angle1)),
      type: sign === 1 ? "external_upper" : "external_lower",
    });
    if (dist > 2 * r) {
      let thetaInt = acos((2 * r) / dist);
      let angle2 = angle + sign * thetaInt;
      tangents.push({
        p1: createVector(c1.x + r * cos(angle2), c1.y + r * sin(angle2)),
        p2: createVector(c2.x - r * cos(angle2), c2.y - r * sin(angle2)),
        type: sign === 1 ? "internal_upper" : "internal_lower",
      });
    }
  });
  return tangents;
}

function doLinesCross(p1, p2, p3, p4) {
  const o = (a, b, c) =>
    Math.sign((b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y));
  return o(p1, p2, p3) !== o(p1, p2, p4) && o(p3, p4, p1) !== o(p3, p4, p2);
}

function createNoiseFilter() {
  let noiseFilter = createGraphics(width, height);
  noiseFilter.pixelDensity(1);
  noiseFilter.background(244, 245, 239, 0);
  for (let x = 0; x < width; x += 2) {
    for (let y = 0; y < height; y += 2) {
      let noiseVal = noise(x * 0.01, y * 0.01) * 255;
      noiseFilter.stroke(noiseVal, noiseVal / 2, noiseVal / 3, 25);
      noiseFilter.point(x, y);
    }
  }
  image(noiseFilter, -width / 2, -height / 2);
}

/***********************************
 * INITIALISATION
 ***********************************/
new p5();
