// By Heyflaw
// Rubber's Theory 2025
// V1.13 - Arcs fluides avec p5.brush sans curveVertex
// P5.Brush library by Alejandro Campos Uribe

/***********************************
 * CONFIGURATION DES STYLES DE TRAITS
 ***********************************/
const strokeStyles = [
  { name: "pen", probability: 15 },
  { name: "charcoal", probability: 15 },
  { name: "2B", probability: 10 },
  { name: "HB", probability: 10 },
  { name: "2H", probability: 10 }, // Crayon dur, trait fin
  { name: "cpencil", probability: 10 }, // Crayon de couleur
  { name: "rotring", probability: 10 }, // Stylo technique, trait précis
  { name: "marker", probability: 10 }, // Marqueur
  //{ name: "marker2", probability: 10 }  // Variante de marqueur
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
 * VARIABLES GLOBALES
 ***********************************/
let gridSize;
let layers = [];
let tangentColors;
let selectedBrush;
let selectedPalette;
let numActiveLayers;

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

function setup() {
  // 1) on crée le canvas et on le récupère
  const cnv = createCanvas(
    globalConfig.general.canvasWidth,
    globalConfig.general.canvasHeight,
    WEBGL
  );
  // 2) on l’attache à NOTRE div dedans l’iframe
  cnv.parent("p5-container");

  // 3) ensuite le reste
  background("rgb(244,245,239)");
  brush.load();

  // … tout ton code de génération …

  numActiveLayers = selectNumLayers(layerOptions);
  selectedBrush = selectBasedOnProbability(strokeStyles);
  selectedPalette = selectPalette(colorPalettes);

  // Définir le nombre de cercles en fonction du nombre de couches
  if (numActiveLayers === 1) {
    layerConfigs[0].circles.numCircles = floor(random(7, 10));
  } else if (numActiveLayers === 2) {
    let eightCircleLayer = floor(random(2));
    layerConfigs[eightCircleLayer].circles.numCircles = 8;
    layerConfigs[1 - eightCircleLayer].circles.numCircles = floor(random(5, 9));
  } else if (numActiveLayers === 3) {
    let eightCircleLayer = floor(random(3));
    layerConfigs[eightCircleLayer].circles.numCircles = 8;
    for (let i = 0; i < 3; i++) {
      if (i !== eightCircleLayer) {
        layerConfigs[i].circles.numCircles = floor(random(5, 9));
      }
    }
  }

  let circleStrokeWeightMin,
    circleStrokeWeightMax,
    pathStrokeWeightMin,
    pathStrokeWeightMax;
  switch (selectedBrush) {
    case "pen":
      circleStrokeWeightMin = 1.5;
      circleStrokeWeightMax = 2.5;
      pathStrokeWeightMin = 1.5;
      pathStrokeWeightMax = 2.5;
      break;
    case "charcoal":
      circleStrokeWeightMin = 0.5;
      circleStrokeWeightMax = 1;
      pathStrokeWeightMin = 0.5;
      pathStrokeWeightMax = 1;
      break;
    case "2B":
      circleStrokeWeightMin = 1;
      circleStrokeWeightMax = 2;
      pathStrokeWeightMin = 1;
      pathStrokeWeightMax = 2;
      break;
    case "HB":
      circleStrokeWeightMin = 1;
      circleStrokeWeightMax = 2;
      pathStrokeWeightMin = 1;
      pathStrokeWeightMax = 2;
      break;
    case "2H":
      circleStrokeWeightMin = 1;
      circleStrokeWeightMax = 2.5;
      pathStrokeWeightMin = 1;
      pathStrokeWeightMax = 2.5;
      break;
    case "cpencil":
      circleStrokeWeightMin = 1;
      circleStrokeWeightMax = 2;
      pathStrokeWeightMin = 1;
      pathStrokeWeightMax = 2;
      break;
    case "rotring":
      circleStrokeWeightMin = 1;
      circleStrokeWeightMax = 3;
      pathStrokeWeightMin = 1;
      pathStrokeWeightMax = 3;
      break;
    case "marker":
      circleStrokeWeightMin = 0.5;
      circleStrokeWeightMax = 1;
      pathStrokeWeightMin = 0.5;
      pathStrokeWeightMax = 1;
      break;
    case "marker2":
      circleStrokeWeightMin = 0.5;
      circleStrokeWeightMax = 1;
      pathStrokeWeightMin = 0.5;
      pathStrokeWeightMax = 1;
      break;
    default:
      circleStrokeWeightMin = 0.5;
      circleStrokeWeightMax = 1.5;
      pathStrokeWeightMin = 0.3;
      pathStrokeWeightMax = 1;
  }

  // Condition spéciale : si une seule couche et brush dans {pen, HB, 2B, 2H, cpencil}, épaisseur minimale de 2
  const thickBrushes = ["pen", "HB", "2B", "2H", "cpencil"];
  if (numActiveLayers === 1 && thickBrushes.includes(selectedBrush)) {
    circleStrokeWeightMin = 2;
    circleStrokeWeightMax = Math.max(circleStrokeWeightMax, 2.5); // Assurer que max >= 2
    pathStrokeWeightMin = 2;
    pathStrokeWeightMax = Math.max(pathStrokeWeightMax, 2.5); // Assurer que max >= 2
  }

  globalConfig.unusedCircles.strokeWeight = random(
    globalConfig.unusedCircles.strokeWeightMin,
    globalConfig.unusedCircles.strokeWeightMax
  );

  for (let i = 0; i < numActiveLayers; i++) {
    let layer = layerConfigs[i];
    layer.usedCircles.strokeBrush = selectedBrush;
    layer.usedCircles.strokeColor = random(selectedPalette.colors);
    layer.usedCircles.strokeWeight = random(
      circleStrokeWeightMin,
      circleStrokeWeightMax
    );
    layer.usedCircles.hatchEnabled = random() > 0.5;
    if (layer.usedCircles.hatchEnabled) {
      layer.usedCircles.hatchBrush =
        layer.usedCircles.hatchBrush ||
        strokeStyles[floor(random(strokeStyles.length))].name;
      layer.usedCircles.hatchRand = random(0, 0.3);
      layer.usedCircles.hatchDistance = random(1, 8);
    }
    layer.usedCircles.hatchAngle = random(0, 180);

    layer.path.strokeBrush = selectedBrush;
    layer.path.strokeColor = random(selectedPalette.colors);
    layer.path.strokeWeight = random(pathStrokeWeightMin, pathStrokeWeightMax);
    layer.path.hatchEnabled = random() > 0.5;
    if (layer.path.hatchEnabled) {
      layer.path.hatchBrush =
        layer.path.hatchBrush ||
        strokeStyles[floor(random(strokeStyles.length))].name;
      layer.path.hatchRand = random(0, 0.3);
      layer.path.hatchDistance = random(1, 6);
    }
    layer.path.hatchAngle = random(0, 180);
  }

  gridSize =
    (width - 2 * globalConfig.general.margin) / globalConfig.general.numCols;

  console.log("=== Détails de l'œuvre ===");
  console.log(
    `Palette sélectionnée : ${
      selectedPalette.name
    } (${selectedPalette.colors.join(", ")})`
  );
  console.log(
    `Grille : ${globalConfig.general.numCols} x ${globalConfig.general.numRows}`
  );
  console.log(`Nombre de couches : ${numActiveLayers}`);
  for (let i = 0; i < numActiveLayers; i++) {
    let layer = layerConfigs[i];
    console.log(`Couche ${i + 1} :`);
    console.log(`  Nombre de cercles : ${layer.circles.numCircles}`);
    console.log(
      `  Cercles utilisés - Brosse: ${
        layer.usedCircles.strokeBrush
      }, Couleur: ${
        layer.usedCircles.strokeColor
      }, Épaisseur: ${layer.usedCircles.strokeWeight.toFixed(2)}`
    );
    console.log(
      `    Hachurage: ${layer.usedCircles.hatchEnabled ? "Oui" : "Non"}${
        layer.usedCircles.hatchEnabled
          ? ` (Brosse: ${
              layer.usedCircles.hatchBrush
            }, Distance: ${layer.usedCircles.hatchDistance.toFixed(
              2
            )}, Angle: ${layer.usedCircles.hatchAngle.toFixed(
              2
            )}, Random: ${layer.usedCircles.hatchRand.toFixed(2)})`
          : ""
      }`
    );
    console.log(
      `  Chemin - Brosse: ${layer.path.strokeBrush}, Couleur: ${
        layer.path.strokeColor
      }, Épaisseur: ${layer.path.strokeWeight.toFixed(2)}`
    );
    console.log(
      `    Hachurage: ${layer.path.hatchEnabled ? "Oui" : "Non"}${
        layer.path.hatchEnabled
          ? ` (Brosse: ${
              layer.path.hatchBrush
            }, Distance: ${layer.path.hatchDistance.toFixed(
              2
            )}, Angle: ${layer.path.hatchAngle.toFixed(
              2
            )}, Random: ${layer.path.hatchRand.toFixed(2)})`
          : ""
      }`
    );
  }

  drawGrid();

  for (let i = 0; i < numActiveLayers; i++) {
    let layer = {
      config: layerConfigs[i],
      circles: [],
      selectedPath: null,
      initialRotation: null,
    };
    generateCirclesForLayer(layer);
    let result = indefiniteFindValidPathForLayer(layer);
    if (result) {
      layer.selectedPath = result.path;
    } else {
      console.error(`Couche ${i + 1} - Aucun chemin valide trouvé !`);
    }
    layers.push(layer);
  }

  drawAllLayers();
  //createNoiseFilter();
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

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
    let tangents = getTangents(
      c1,
      c2,
      gridSize * globalConfig.general.circleRadiusRatio
    );

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
  return sampleArc(
    circleCenter,
    gridSize * globalConfig.general.circleRadiusRatio,
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
          gridSize * globalConfig.general.circleRadiusRatio,
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
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
new p5();
