(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
* Creates a canvas element in the DOM to test for browser support
* to selected element to match size dimensions.
* @param {string} contextType - ( '2d' | 'webgl' | 'experimental-webgl' | 'webgl2', | 'bitmaprenderer'  )
* The type of canvas and context engine to check support for
* @returns {boolean} - true if both canvas and the context engine are supported by the browser
*/
function checkCanvasSupport(contextType) {
  let ctx = contextType || '2d';
  let elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext(ctx));
}

module.exports = checkCanvasSupport;

},{}],2:[function(require,module,exports){
require('./lightningTestInclude.js');

},{"./lightningTestInclude.js":3}],3:[function(require,module,exports){
let checkCanvasSupport = require('./checkCanvasSupport.js');

require('./utils/rafPolyfill.js');

require('./utils/canvasApiAugmentation.js');

let easing = require('./utils/easing.js').easingEquations;

let easeFn = easing.easeOutSine;

let trig = require('./utils/trigonomicUtils.js').trigonomicUtils;

let pointOnPath = trig.getPointOnPath;
let calcD = trig.dist;
let calcA = trig.angle;

let mathUtils = require('./utils/mathUtils.js');

let rnd = mathUtils.random;
let rndInt = mathUtils.randomInteger;

let ligntningMgr = require('./lightning/lightningManager/lightningUtilities.js'); // housekeeping


let canvas = document.querySelector('#lightningDrawingTest');
let cW = canvas.width = window.innerWidth;
let cH = canvas.height = window.innerHeight;
let c = canvas.getContext('2d');
ligntningMgr.setCanvasCfg('#lightningDrawingTest');
c.lineCap = 'round';
let counter = 0;
let showDebugInfo = false; // test Vector path

let testVec = {
  startX: cW / 2,
  startY: 50,
  endX: cW / 2,
  endY: cH - 50
};

function drawLine(debug) {
  if (debug === true) {
    c.strokeStyle = 'red';
    c.setLineDash([5, 15]);
    c.line(testVec.startX, testVec.startY, testVec.endX, testVec.endY);
    c.setLineDash([]);
  }
} // let iterations = rndInt( 10, 50 );


let iterations = 1;
let baseTheme = {
  canvasW: cW,
  canvasH: cH,
  startX: testVec.startX,
  startY: testVec.startY,
  endX: testVec.endX,
  endY: testVec.endY,
  subdivisions: mathUtils.randomInteger(3, 6),
  speedModRate: 0.9,
  willConnect: true
};

function createTheme(event) {
  return {
    canvasW: cW,
    canvasH: cH,
    startX: event.clientX,
    startY: event.clientY,
    endX: testVec.endX,
    endY: testVec.endY,
    subdivisions: mathUtils.randomInteger(3, 6)
  };
}

ligntningMgr.createLightning(baseTheme); ////////////////////////////////////////////////////////////////////////////////////////
// Button handlers
////////////////////////////////////////////////////////////////////////////////////////

$('.js-run').click(function (event) {
  ligntningMgr.createLightning(baseTheme);
});
$('.js-clear-mgr').click(function (event) {
  ligntningMgr.clearMemberArray();
});
$('.js-clear-mgr-run').click(function (event) {
  ligntningMgr.clearMemberArray();
  ligntningMgr.createLightning(baseTheme);
});
$('canvas').click(function (event) {
  ligntningMgr.createLightning(createTheme(event));
});
$('.js-button-toggle').click(function (event) {
  let thisItem = $(this);

  if (thisItem.hasClass('js-isActive')) {
    thisItem.removeClass('js-isActive');
  } else {
    thisItem.addClass('js-isActive');
  }

  if (typeof $(this).attr('data-linked-toggle') !== "undefined") {
    $(this).parent().find('.' + $(this).attr('data-linked-toggle')).removeClass('js-isActive');
  }
});
$('.js-show-debug-overlay').click(function (event) {
  if ($(this).hasClass('active')) {
    $(this).removeClass('active');
    showDebugInfo = false;
  } else {
    $(this).addClass('active');
    showDebugInfo = true;
  }
}); /////////////////////////////////////////////////////////////////////////////////////
// App start
////////////////////////////////////////////////////////////////////////////////////////

function drawTest() {
  ligntningMgr.update(c);
  drawLine(showDebugInfo);
}

function clearScreen() {
  c.fillStyle = 'black';
  c.fillRect(0, 0, cW, cH);
}

function rafLoop() {
  // flush screen buffer
  clearScreen(); // Do whatever

  drawTest(); //loop

  requestAnimationFrame(rafLoop);
}

function initialise() {
  // setup
  // do setup things here
  //looper
  rafLoop();
}

initialise();

},{"./checkCanvasSupport.js":1,"./lightning/lightningManager/lightningUtilities.js":13,"./utils/canvasApiAugmentation.js":38,"./utils/easing.js":40,"./utils/mathUtils.js":72,"./utils/rafPolyfill.js":73,"./utils/trigonomicUtils.js":75}],4:[function(require,module,exports){
function clearMemberArray() {
  this.members.length = 0;
}

module.exports = clearMemberArray;

},{}],5:[function(require,module,exports){
let easing = require('../../utils/easing.js').easingEquations;
/**
* @name createBlurArray
* @description Given a count, minimum and maximum blur distances, return an array of numbers intopolating from the minimum to maxaximum biased according to the specified ease function
* @param {number} blurCount - the number of required blurs.
* @param {number} minBlurDist - the minimum blur size distance.
* @param {number} maxBlurDist - the maxaximum blur size distance.
* @param {string} ease - Name of the easing function to intopolate between the minimum and maximum
* @returns {Array<number>} the calculated array of blur distances.
 */


function createBlurArray(blurCount, minBlurDist, maxBlurDist, ease) {
  let tmp = [];
  let easeFn = easing[ease];
  let changeDelta = maxBlurDist - minBlurDist;

  for (let i = 0; i < blurCount; i++) {
    tmp.push(Math.floor(easeFn(i, minBlurDist, changeDelta, blurCount)));
  }

  return tmp;
}

;
module.exports = createBlurArray;

},{"../../utils/easing.js":40}],6:[function(require,module,exports){
const mathUtils = require('../../utils/mathUtils.js');

const trig = require('../../utils/trigonomicUtils.js').trigonomicUtils;

const lmgrUtils = require('./lightningManagerUtilities.js');

const createLightningParent = lmgrUtils.createLightningParent;

const mainPathAnimSequence = require(`../sequencer/mainPathAnimSequence.js`);

const childPathAnimSequence = require(`../sequencer/childPathAnimSequence.js`);

const createPathFromOptions = require('../path/createPathFromOptions.js');

const createPathConfig = require('../path/createPathConfig.js');

const calculateSubDRate = require('../path/calculateSubDRate.js'); // store subdivision level segment count as a look up table/array


const subDSegmentCountLookUp = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

function createLightning(options) {
  const lMgr = this;
  const opts = options;
  const creationConfig = this.creationConfig;
  const branchCfg = creationConfig.branches;
  lMgr.canvasW = opts.canvasW;
  lMgr.canvasH = opts.canvasH;
  const maxCanvasDist = trig.dist(0, 0, opts.canvasW, opts.canvasH);
  branchCfg.depth.curr = 1;
  const subD = 6; // let subDivs = opts.subdivisions || mathUtils.randomInteger( branchCfg.subD.min, branchCfg.subD.max);

  const d = trig.dist(opts.startX, opts.startY, opts.endX, opts.endY);
  const subDRate = calculateSubDRate(d, maxCanvasDist, subD);
  const speed = d / subDSegmentCountLookUp[subDRate];
  const speedModRate = opts.speedModRate || 0.6;
  const speedMod = speed * speedModRate; // calculate draw speed based on bolt length / 

  let tempPaths = []; // 1. create intial/main path

  tempPaths.push(createPathFromOptions({
    isChild: false,
    isActive: true,
    isRendering: true,
    sequenceStartIndex: 1,
    sequences: mainPathAnimSequence,
    startX: opts.startX,
    startY: opts.startY,
    endX: opts.endX,
    endY: opts.endY,
    pathColR: 155,
    pathColG: 155,
    pathColB: 255,
    pathColA: 1,
    glowColR: 150,
    glowColG: 150,
    glowColB: 255,
    glowColA: 1,
    lineWidth: 1,
    subDRate: subDRate,
    subdivisions: subD,
    dRange: d / 2
  }));
  let branchPointsCount = 6;
  let branchSubDFactor = 6; // cycle through branch depth levels starting with 0

  for (let branchCurrNum = 0; branchCurrNum <= branchCfg.depth.curr; branchCurrNum++) {
    // cycle through current paths in tempPath array
    for (let currPathNum = 0; currPathNum < tempPaths.length; currPathNum++) {
      // get path object instance
      let thisPathCfg = tempPaths[currPathNum];

      if (thisPathCfg.branchDepth !== branchCurrNum) {
        continue;
      } // get the path point array


      let p = thisPathCfg.path;
      let pLen = p.length; // for each of the generated branch count

      for (let k = 0; k < branchPointsCount; k++) {
        let pCfg = createPathConfig(thisPathCfg, {
          parentPathDist: d,
          branchDepth: branchCurrNum + 1
        });
        tempPaths.push(createPathFromOptions({
          isChild: true,
          isActive: true,
          isRendering: true,
          branchDepth: pCfg.branchDepth,
          renderOffset: pCfg.renderOffset,
          sequenceStartIndex: 1,
          sequences: childPathAnimSequence,
          pathColR: 155,
          pathColG: 155,
          pathColB: 255,
          glowColR: 150,
          glowColG: 150,
          glowColB: 255,
          glowColA: 1,
          startX: pCfg.startX,
          startY: pCfg.startY,
          endX: pCfg.endX,
          endY: pCfg.endY,
          lineWidth: 1,
          subdivisions: calculateSubDRate(pCfg.dVar, maxCanvasDist, subD),
          dRange: pCfg.dVar
        }));
      }
    } // end current paths loop


    if (branchPointsCount > 0) {
      branchPointsCount = Math.floor(branchPointsCount / 16);
    }

    if (branchSubDFactor > 1) {
      branchSubDFactor--;
    }
  } // end branch depth loop
  // create parent lightning instance


  createLightningParent({
    speed: speedMod,
    tempPaths: tempPaths
  }, this.members);
}

module.exports = createLightning;

},{"../../utils/mathUtils.js":72,"../../utils/trigonomicUtils.js":75,"../path/calculateSubDRate.js":20,"../path/createPathConfig.js":21,"../path/createPathFromOptions.js":22,"../sequencer/childPathAnimSequence.js":28,"../sequencer/mainPathAnimSequence.js":29,"./lightningManagerUtilities.js":12}],7:[function(require,module,exports){
const creationConfig = {
  branches: {
    subD: {
      min: 3,
      max: 6
    },
    depth: {
      min: 1,
      max: 2,
      curr: 0
    },
    spawnRate: {
      min: 5,
      max: 10
    }
  }
};
module.exports = creationConfig;

},{}],8:[function(require,module,exports){
function drawDebugLines(c) {
  let members = this.members;
  let membersLen = members.length;

  for (let i = 0; i < membersLen; i++) {
    let thisMember = this.members[i];
    let thisPaths = thisMember.paths;
    let thisPathsLen = thisPaths.length;

    for (let j = 0; j < thisPathsLen; j++) {
      let path = thisPaths[j].path;
      c.lineWidth = 5;
      c.strokeStyle = 'red';
      c.setLineDash([5, 15]);
      c.line(path[0].x, path[0].y, path[path.length - 1].x, path[path.length - 1].y);
      c.setLineDash([]);
    }
  }
}

module.exports = drawDebugLines;

},{}],9:[function(require,module,exports){
let trig = require('../../utils/trigonomicUtils.js').trigonomicUtils;

function drawDebugRadialTest(c) {
  let PI = Math.PI;
  PISQ = PI * 2;
  let cX = 150,
      cY = 150,
      cR = 100;
  let zeroRotPoint = trig.radialDistribution(cX, cY, cR, PISQ);
  let qRotPoint = trig.radialDistribution(cX, cY, cR, PISQ * 0.25);
  let halfRotPoint = trig.radialDistribution(cX, cY, cR, PISQ * 0.5);
  let threeQRotPoint = trig.radialDistribution(cX, cY, cR, PISQ * 0.75); // start point

  let testP1Point = trig.radialDistribution(cX, cY, cR, PISQ * 0.125); // end point

  let testP2Point = trig.radialDistribution(cX, cY, cR, PISQ * 0.625); // curvePoint

  let testP3Point = trig.radialDistribution(cX, cY, cR, PISQ * 0.875);
  let testNormalPoint = trig.projectNormalAtDistance(testP1Point, testP3Point, testP2Point, 0.5, cR * 1.1); // reference points render

  c.strokeStyle = '#880000';
  c.fillStyle = 'red';
  c.lineWidth = 2;
  c.strokeCircle(cX, cY, cR);
  c.fillCircle(cX, cY, 5);
  c.fillCircle(zeroRotPoint.x, zeroRotPoint.y, 5);
  c.fillCircle(qRotPoint.x, qRotPoint.y, 5);
  c.fillCircle(halfRotPoint.x, halfRotPoint.y, 5);
  c.fillCircle(threeQRotPoint.x, threeQRotPoint.y, 5); // refence shape triangle points render

  c.fillStyle = '#0088ee';
  c.fillCircle(testP1Point.x, testP1Point.y, 5);
  c.fillCircle(testP2Point.x, testP2Point.y, 5);
  c.fillCircle(testP3Point.x, testP3Point.y, 5); // refence shape edge render

  c.strokeStyle = '#002266';
  c.setLineDash([3, 6]);
  c.line(testP1Point.x, testP1Point.y, testP2Point.x, testP2Point.y);
  c.line(testP1Point.x, testP1Point.y, testP3Point.x, testP3Point.y);
  c.line(testP2Point.x, testP2Point.y, testP3Point.x, testP3Point.y); // projected NORMAL reference point

  c.fillStyle = '#00aaff';
  c.fillCircle(testNormalPoint.x, testNormalPoint.y, 5); // normal line render
  // inner

  c.setLineDash([3, 6]);
  c.strokeStyle = '#005500';
  c.line(cX, cY, testP3Point.x, testP3Point.y); // outer

  c.strokeStyle = '#00ff00';
  c.line(testP3Point.x, testP3Point.y, testNormalPoint.x, testNormalPoint.y);
  c.setLineDash([]); // calculate normal angle back from test shape for testing

  let testAngle = trig.getAngleOfNormal(testP1Point, testP3Point, testP2Point, 0.5); // project nomal point from calculation

  let testAnglePoint = trig.radialDistribution(cX, cY + 200, 100, Math.atan2(testNormalPoint.y - cY, testNormalPoint.x - cX)); // draw line for test reference

  c.strokeStyle = '#000099';
  c.fillStyle = '#0066dd';
  c.strokeCircle(cX, cY + 200, 75);
  c.line(cX, cY + 200, testAnglePoint.x, testAnglePoint.y);
  c.fillCircle(cX, cY + 200, 5);
  c.fillCircle(testAnglePoint.x, testAnglePoint.y, 5);
}

module.exports = drawDebugRadialTest;

},{"../../utils/trigonomicUtils.js":75}],10:[function(require,module,exports){
const globalConfig = {
  intervalMin: 0,
  intervalMax: 0,
  intervalCurrent: 0
};
module.exports = globalConfig;

},{}],11:[function(require,module,exports){
const lMgrClock = {
  global: {
    isRunning: false,
    currentTick: 0
  },
  local: {
    isRunning: false,
    currentTick: 0,
    target: 0
  }
};
module.exports = lMgrClock;

},{}],12:[function(require,module,exports){
let createBlurArray = require('./createBlurArray.js');

let mathUtils = require('../../utils/mathUtils.js'); // state list declarations


const IS_UNINITIALISED = 'isUninitialised';
const IS_INITIALISED = 'isInitialised';
const IS_ACTIVE = 'isActive';
const IS_DRAWING = 'isDrawing';
const IS_DRAWN = 'isDrawn';
const IS_CONNECTED = 'isConnected';
const IS_REDRAWING = 'isRedrawing';
const IS_ANIMATED = 'isAnimating';
const IS_FIELDEFFECT = 'isFieldEffect';
const IS_COUNTDOWN = 'isCountdown';
const IS_COMPLETE = 'isComplete';
const IS_COUNTDOWNCOMPLETE = 'isCountdownComplete';

function setState(stateName) {
  let states = this.state.states;
  const entries = Object.entries(states);
  const entriesLen = entries.length;

  for (let i = 0; i < entriesLen; i++) {
    let thisEntry = entries[i];
    let thisEntryName = thisEntry[0];

    if (thisEntryName === stateName) {
      states[stateName] = true;
      this.state.current = thisEntryName;
    }
  }
}

;

function getCurrentState() {
  return this.state.current;
}

function updateRenderConfig() {
  this.renderConfig.currHead += this.renderConfig.segmentsPerFrame;
  return this;
}

function createLightningParent(opts, arr) {
  let lInstance = {
    speed: opts.speed || 1,
    isDrawn: false,
    isAnimated: opts.isAnimated || false,
    willConnect: opts.willConnect || false,
    skyFlashAlpha: opts.skyFlashAlpha || 0.2,
    originFlashAlpha: opts.originFlashAlpha || 1,
    glowBlurIterations: createBlurArray(mathUtils.randomInteger(2, 6), 30, 100, 'linearEase'),
    clock: 0,
    totalClock: opts.willConnect ? mathUtils.randomInteger(10, 60) : 0,
    state: {
      current: 'isUninitialised',
      states: {
        isUninitialised: true,
        isInitialised: false,
        isActive: false,
        isDrawing: false,
        isDrawn: false,
        isConnected: false,
        isRedrawing: false,
        isAnimating: false,
        isFieldEffect: false,
        isCountdown: false,
        isCountdownComplete: false,
        isComplete: false
      }
    },
    actions: {},
    stateActions: {
      isConnected: {}
    },
    setState: setState,
    getCurrentState: getCurrentState,
    renderConfig: {
      currHead: 0,
      segmentsPerFrame: opts.speed || 1
    },
    updateRenderConfig: updateRenderConfig,
    paths: opts.tempPaths || []
  };
  arr.push(lInstance);
}

module.exports.createLightningParent = createLightningParent;

},{"../../utils/mathUtils.js":72,"./createBlurArray.js":5}],13:[function(require,module,exports){
let globalConfig = require('./globalConfig.js');

let creationConfig = require('./creationConfig.js');

let renderConfig = require('./renderConfig.js');

let lMgrClock = require('./lMgrClock.js');

let setGlobalInterval = require('./setGlobalInterval.js');

let setLocalClockTarget = require('./setLocalClockTarget.js');

let createLightning = require('./createLightning.js');

let clearMemberArray = require('./clearMemberArray.js');

let setCanvasDetails = require('./setCanvasDetails.js');

let update = require('./updateArr.js');

let updateRenderCfg = require('./updateRenderCfg.js');

let drawDebugRadialTest = require('./drawDebugRadialTest.js');

let drawDebugLines = require('./drawDebugLines.js');

let SimplexNoise = require('../../utils/simplex-noise-new.js');

let ligntningMgr = {
  members: [],
  debugMembers: [],
  canvasCfg: {},
  noiseField: new SimplexNoise(),
  noiseClock: 0,
  setCanvasCfg: setCanvasDetails,
  globalConfig: globalConfig,
  creationConfig: creationConfig,
  renderConfig: renderConfig,
  clock: lMgrClock,
  clearMemberArray: clearMemberArray,
  setLocalClockTarget: setLocalClockTarget,
  setGlobalInterval: setGlobalInterval,
  createLightning: createLightning,
  update: update,
  updateRenderCfg: updateRenderCfg,
  drawDebugRadialTest: drawDebugRadialTest,
  drawDebugLines: drawDebugLines
};
module.exports = ligntningMgr;

},{"../../utils/simplex-noise-new.js":74,"./clearMemberArray.js":4,"./createLightning.js":6,"./creationConfig.js":7,"./drawDebugLines.js":8,"./drawDebugRadialTest.js":9,"./globalConfig.js":10,"./lMgrClock.js":11,"./renderConfig.js":14,"./setCanvasDetails.js":15,"./setGlobalInterval.js":16,"./setLocalClockTarget.js":17,"./updateArr.js":18,"./updateRenderCfg.js":19}],14:[function(require,module,exports){
let mathUtils = require('../../utils/mathUtils.js');

let lightningStrikeTimeMax = 300;
let strikeDrawTime = lightningStrikeTimeMax / 2;
let strikeFireTime = lightningStrikeTimeMax / 6;
let strikeCoolTime = lightningStrikeTimeMax / 3;
const renderConfig = {
  blurIterations: mathUtils.randomInteger(5, 8),
  blurRenderOffset: 10000,
  currHead: 0,
  timing: {
    max: lightningStrikeTimeMax,
    draw: strikeDrawTime,
    fire: strikeFireTime,
    cool: strikeCoolTime,
    segmentsPerFrame: 1
  }
};
module.exports = renderConfig;

},{"../../utils/mathUtils.js":72}],15:[function(require,module,exports){
function setCanvasDetails(canvasId) {
  let canvasInstance = document.querySelector(canvasId);
  let ctx = canvasInstance.getContext('2d');
  let cW = canvasInstance.width = window.innerWidth;
  let cH = canvasInstance.height = window.innerHeight;
  this.canvasCfg.canvas = canvasInstance;
  this.canvasCfg.c = ctx;
  this.canvasCfg.cW = cW;
  this.canvasCfg.cH = cH;
}

module.exports = setCanvasDetails;

},{}],16:[function(require,module,exports){
let mathUtils = require('../../utils/mathUtils.js');

function setGlobalInterval() {
  this.globalConfig.intervalCurrent = mathUtils.random(this.globalConfig, intervalMin, this.globalConfig, intervalMax);
}

module.exports = setGlobalInterval;

},{"../../utils/mathUtils.js":72}],17:[function(require,module,exports){
function setLocalClockTarget(target) {
  if (target) {
    this.clock.local.target = target;
  } else {
    this.clock.local.target = this.globalConfig.intervalCurrent;
  }
}

module.exports = setLocalClockTarget;

},{}],18:[function(require,module,exports){
let mathUtils = require('../../utils/mathUtils.js');

function update(c) {
  let renderCfg = this.renderConfig;
  let mLen = this.members.length;
  c.globalCompositeOperation = 'lighter';

  for (let i = 0; i < mLen; i++) {
    let m = this.members[i];

    if (m !== undefined) {
      let mState = m.state.states;
      let currState = m.getCurrentState();

      if (currState === 'isCountdown') {
        let mClock = m.clock;
        let mTotalClock = m.totalClock;

        if (mClock < mTotalClock) {
          m.clock++;
        } else {
          m.clock = 0;

          if (mState.isComplete === false) {
            m.totalClock = mathUtils.randomInteger(10, 50);
            m.setState('isCountdown');
          } else {
            m.setState('isCountdownComplete');
          }
        }
      }

      if (mState.isDrawn === true && m.willConnect === true) {
        if (mState.isConnected === false) {
          m.setState('isConnected');
          m.setState('isFieldEffect');
          m.setState('isCountdown');
          m.totalClock = mathUtils.randomInteger(10, 50);
        }
      }

      m.updateRenderConfig();

      for (let j = 0; j < m.paths.length; j++) {
        let thisPathCfg = m.paths[j];

        if (thisPathCfg.isChild === false && thisPathCfg.isActive === false) {
          this.members.splice(i, 1);
          i--;
          break;
        }

        thisPathCfg.render(c, m, this).update(m, this);
      }
    } else {
      continue;
    }
  }

  c.globalCompositeOperation = 'source-over';
}

module.exports = update;

},{"../../utils/mathUtils.js":72}],19:[function(require,module,exports){
function updateRenderCfg() {
  let members = this.members;
  let memLen = members.length;

  for (let i = 0; i <= memLen - 1; i++) {
    members[i].updateRenderConfig();
  }
}

module.exports = updateRenderCfg;

},{}],20:[function(require,module,exports){
/**
* @name calculateSubDRate
* @description Given a {length} distance of a path, a maximum allowed distance {targetLength} and a maximum subdivision level {subDRate} return a subdivision level for the distance length of the path.
* @param {number} length - the length of the path.
* @param {number} targetLength - the maximum (clamped) value a path can be.
* @param {number} subDRate - the maximum subdivion levels at the targetLength.
* @returns {number} the calculated subdivision levels for the path.
 */
function calculateSubDRate(length, targetLength, subDRate) {
  let lDiv = targetLength / length;
  let lDivCalc = subDRate - Math.floor(lDiv);
  if (lDivCalc <= 1) return 1;
  if (lDiv > 2) return lDivCalc;
  return subDRate;
}

module.exports = calculateSubDRate;

},{}],21:[function(require,module,exports){
let mathUtils = require('../../utils/mathUtils.js');

let easing = require('../../utils/easing.js').easingEquations;

let trig = require('../../utils/trigonomicUtils.js').trigonomicUtils;

function checkPointIndex(i, len) {
  return i === 0 ? 1 : i === len - 1 ? len - 2 : i;
}

function createPathConfig(thisPath, options) {
  let thisPathCfg = thisPath;
  let p = thisPathCfg.path;
  let pLen = p.length;
  let opts = options;
  let pathIndex = opts.pathIndex;
  let pathAngleSpread = opts.pathAngleSpread || 0.2;
  let branchDepth = opts.branchDepth || 0; // setup some vars to play with

  let pIndex, p1, p2, p3, p4, theta, rOffset; // angle variation randomiser

  let v = 2 * Math.PI * pathAngleSpread; // if path is only start/end points

  if (pLen === 2) {
    console.log(`pLen === 2`);
    p1 = p[0];
    p3 = p[1];
    p2 = trig.subdivide(p1.x, p1.y, p3.x, p3.y, 0.5);
    rOffset = thisPathCfg.renderOffset + 1;
  }

  if (pLen > 2) {
    pIndex = checkPointIndex(mathUtils.randomInteger(0, pLen - 1), pLen);
    p1 = p[pIndex - 1];
    p2 = p[pIndex];
    p3 = p[pIndex + 1];
    rOffset = thisPathCfg.renderOffset + pIndex;
  }

  theta = thisPathCfg.baseAngle + mathUtils.random(-v, v);
  let maxD = trig.dist(p2.x, p2.y, p[pLen - 1].x, p[pLen - 1].y);
  let dVar = mathUtils.random(0, maxD); // console.log( 'randTheta: ', randTheta );

  let branchEndpoint = trig.radialDistribution(p2.x, p2.y, dVar, theta);
  return {
    branchDepth: branchDepth,
    renderOffset: rOffset,
    startX: p2.x,
    startY: p2.y,
    endX: branchEndpoint.x,
    endY: branchEndpoint.y,
    dRange: dVar
  };
}

module.exports = createPathConfig;

},{"../../utils/easing.js":40,"../../utils/mathUtils.js":72,"../../utils/trigonomicUtils.js":75}],22:[function(require,module,exports){
require('../../typeDefs');
/**
@typedef {import("../../typeDefs").pathObject} pathObject
@typedef {import("../../typeDefs").createPathOptions} createPathOptions
@typedef {import("../../typeDefs").Point} Point
*/


const trig = require('../../utils/trigonomicUtils.js').trigonomicUtils;

const plotPathPoints = require('./plotPathPoints.js');

const drawPaths = require('./drawPath.js');

const redrawPath = require('./redrawPaths.js');

const updatePath = require('./updatePath.js');

const renderPath = require('./renderPath.js');

const mainPathAnimSequence = require(`../sequencer/mainPathAnimSequence.js`);

const startSequence = require(`../sequencer/startSequence.js`);

const updateSequenceClock = require(`../sequencer/updateSequenceClock.js`);

const updateSequence = require(`../sequencer/updateSequence.js`);

const setupSequences = require(`../sequencer/setupSequences.js`);
/**
* createPathFromOptions
* @description create path object from provide options {opts}.
* @see {@link createPathOptions} for constructor options
* @see {@link pathObject} for function return object members
* @param {...createPathOptions} opts - the constructor options and paremeters for the path.
* @returns {pathObject} - the calculated path object containing parameters, flags, path coordinate arrays and constructed path2d() primitives.
*/


function createPathFromOptions(opts) {
  /**
   * @name newPath
   * @memberof createPathFromOptions
   * @type {Array<Point>}
   * @static
   * @description Array of {@link Point|Points} created by the {@link plotPathPoints} function from options supplied in the parent function's {opts} parameters
  */
  let _newPath = plotPathPoints({
    startX: opts.startX,
    startY: opts.startY,
    endX: opts.endX,
    endY: opts.endY,
    subdivisions: opts.subdivisions,
    isChild: opts.isChild
  });

  let chosenSequence = opts.sequences || mainPathAnimSequence;
  let thisSequences = setupSequences(chosenSequence);
  return {
    // flags
    isChild: opts.isChild || false,
    isActive: opts.isActive || false,
    isRendering: opts.isRendering || false,
    willStrike: opts.willStrike || false,
    // config
    branchDepth: opts.branchDepth || 0,
    // computed config
    baseAngle: trig.angle(opts.startX, opts.startY, opts.endX, opts.endY),
    baseDist: trig.dist(opts.startX, opts.startY, opts.endX, opts.endY),
    // colors
    colR: opts.pathColR || 255,
    colG: opts.pathColG || 255,
    colB: opts.pathColB || 255,
    colA: opts.isChild ? 0.5 : opts.pathColA ? opts.pathColA : 1,
    glowColR: opts.glowColR || 255,
    glowColG: opts.glowColG || 255,
    glowColB: opts.glowColB || 255,
    glowColA: opts.glowColA || 1,
    lineWidth: 1,
    // clocks
    clock: opts.clock || 0,
    sequenceClock: opts.sequenceClock || 0,
    totalClock: opts.totalClock || 0,
    // anim sequences
    // main draw sequence
    drawPathSequence: opts.isChild ? false : true,
    // additional sequences
    sequences: thisSequences,
    sequenceStartIndex: opts.sequenceStartIndex || 0,
    sequenceIndex: opts.sequenceIndex || 0,
    playSequence: false,
    currSequence: false,
    startSequence: startSequence,
    updateSequence: updateSequence,
    updateSequenceClock: updateSequenceClock,
    drawPaths: drawPaths,
    redrawPath: redrawPath,
    update: updatePath,
    render: renderPath,
    // path rendering flags
    renderOffset: opts.renderOffset || 0,
    currHeadPoint: 0,
    // the actual path
    path: _newPath,
    // saved paths
    savedPaths: {
      main: new Path2D(),
      offset: new Path2D(),
      originShort: new Path2D(),
      originLong: new Path2D()
    }
  };
}

module.exports = createPathFromOptions;

},{"../../typeDefs":37,"../../utils/trigonomicUtils.js":75,"../sequencer/mainPathAnimSequence.js":29,"../sequencer/setupSequences.js":33,"../sequencer/startSequence.js":34,"../sequencer/updateSequence.js":35,"../sequencer/updateSequenceClock.js":36,"./drawPath.js":23,"./plotPathPoints.js":24,"./redrawPaths.js":25,"./renderPath.js":26,"./updatePath.js":27}],23:[function(require,module,exports){
// wrap in condition to check if drawing is required
const cl = require('../../utils/cl.js');

function drawPaths(renderCfg, parent) {
  // pointers
  let thisCfg = this;
  let {
    currHead: masterHeadPoint,
    segmentsPerFrame
  } = renderCfg;
  let {
    path: pathArr,
    savedPaths,
    renderOffset: pathStartPoint,
    currHeadPoint: currentHeadPoint
  } = thisCfg;
  let pathArrLen = pathArr.length;
  let startPointIndex = 0;
  let endPointIndex = 0; // early return out of function if we haven't reached the path start point yet OR the currentHeadPoint is greater than the pathArrayLength

  if (pathStartPoint > masterHeadPoint) return;

  if (currentHeadPoint >= pathArrLen) {
    if (thisCfg.isChild === false) {
      parent.isDrawn = true;
      parent.setState('isDrawn');
    }

    return;
  }

  startPointIndex = currentHeadPoint === 0 ? currentHeadPoint : currentHeadPoint;
  endPointIndex = Math.floor(currentHeadPoint + segmentsPerFrame > pathArrLen ? pathArrLen : currentHeadPoint + segmentsPerFrame);

  for (let i = startPointIndex; i < endPointIndex; i++) {
    let p = pathArr[i];

    if (i === 0) {
      savedPaths.main.moveTo(p.x, p.y);
      savedPaths.offset.moveTo(p.x, p.y - 10000);
      savedPaths.originLong.moveTo(p.x, p.y - 10000);
      continue;
    }

    savedPaths.main.lineTo(p.x, p.y);
    savedPaths.offset.lineTo(p.x, p.y - 10000);

    if (i < 20) {
      savedPaths.originLong.lineTo(p.x, p.y - 10000);
    }
  }

  this.currHeadPoint = endPointIndex;
}

module.exports = drawPaths;

},{"../../utils/cl.js":39}],24:[function(require,module,exports){
const cl = require('../../utils/cl.js');

let mathUtils = require('../../utils/mathUtils.js');

let easing = require('../../utils/easing.js').easingEquations;

let trig = require('../../utils/trigonomicUtils.js').trigonomicUtils; // lightning path constructor

/**
* @name plotPathPoints
* @description Given an origin plot a path, randomised and subdivided, to a target. Used, primarily, by the {@link createPathFromOptions|createPathFromOptions} function 
* @param {object} options - the constructor configuration object.
* @param {number} options.startX - the X coordinate of the path start point.
* @param {number} options.startY - the XYcoordinate of the path start point.
* @param {number} options.endX - the X coordinate of the path end point.
* @param {number} options.endY - the Y coordinate of the path end point.
* @param {boolean} options.isChild - is this path instance a child/subpath of a parent?.
* @param {number} options.subdivisions - the level of path subdivisions.
* @returns {array} the path as a vector coordinate set.
 */


function plotPathPoints(options) {
  let opts = options;
  let subD = opts.subdivisions;
  let temp = [];
  temp.push({
    x: opts.startX,
    y: opts.startY
  });
  temp.push({
    x: opts.endX,
    y: opts.endY
  });
  let tRange = opts.tRange || 0.35;
  let isChild = opts.isChild || true;
  let vChild = isChild ? 8 : 2; // set up some vars to play with

  let minD, maxD, calcD;

  for (let i = 0; i <= subD - 1; i++) {
    let arrLen = temp.length;
    let damper = i === 0 ? 1 : i;

    for (let j = arrLen - 1; j > 0; j--) {
      if (j === 0) {
        return;
      }

      let p = temp[j];
      let prevP = temp[j - 1]; // set up some numbers for making the path
      // distance between the 2 points

      let vD = trig.dist(p.x, p.y, prevP.x, prevP.y) / 2; // random positive/negative multiplier

      let vFlip = mathUtils.randomInteger(1, 10) <= 5 ? 1 : -1; // get the mid point beween the two points (p & prevP)

      let nP = trig.subdivide(prevP.x, prevP.y, p.x, p.y, 0.5); // calculate some numbers for random distance

      if (isChild === false) {
        minD = easing.easeInQuint(i, vD / 2, -(vD / 2), subD);
        maxD = easing.easeInQuint(i, vD, -vD, subD);
      } else {
        minD = vD / 2;
        maxD = vD / vChild;
      }

      calcD = mathUtils.random(minD, maxD) * vFlip; // using the 2 points (p & prevP), and the generated midpoint as a pseudo curve point

      let offsetPoint = trig.projectNormalAtDistance( // - project a new point at the normal of the path created by p/nP/prevP
      prevP, nP, p, // at a random point along the curve (between 0.25/0.75)
      mathUtils.random(0.25, 0.75), // - - projected at a proportion of the distance (vD)
      // - - - calculated through the vChild variable (damped through a switch generated through the isChild flag) 
      calcD); // splice in the new point to the point array

      temp.splice(j, 0, {
        x: offsetPoint.x,
        y: offsetPoint.y
      }); // recurse the loop by the number given by "subD", to subdivinde and randomise the line
    }
  }

  ; // console.log( `${cl.dim}${cl.y}path.length: ${cl.bld}${cl.b}${temp.length}${cl.rst}` );

  return temp;
}

;
module.exports = plotPathPoints;

},{"../../utils/cl.js":39,"../../utils/easing.js":40,"../../utils/mathUtils.js":72,"../../utils/trigonomicUtils.js":75}],25:[function(require,module,exports){
function redrawPath(renderCfg, parent, globalConfig) {
  let thisCfg = this;
  let {
    path: pathArr,
    savedPaths,
    renderOffset: pathStartPoint,
    isChild
  } = thisCfg;
  let pathArrLen = pathArr.length;
  let noiseField = globalConfig.noiseField;
  let newMainPath = new Path2D();
  let newOffsetPath = new Path2D();
  let newOriginLongPath = new Path2D();

  for (let i = 0; i < pathArrLen; i++) {
    let p = pathArr[i];
    let t = 0; // modify corrdinates with field effect:

    let fieldModVal = noiseField.noise3D(p.x, p.y, t);
    let x = p.x * fieldModVal;
    let y = p.y * fieldModVal;

    if (i === 0) {
      newMainPath.moveTo(x, y);
      newOffsetPath.moveTo(x, y - 10000);
      newOriginLongPath.moveTo(x, y - 10000);
      continue;
    }

    newMainPath.lineTo(x, y);
    newOffsetPath.lineTo(x, y - 10000);

    if (i < 20) {
      newOriginLongPath.lineTo(x, y - 10000);
    }
  }

  thisCfg.savedPaths.main = newMainPath;
  thisCfg.savedPaths.offset = newOffsetPath;
  thisCfg.savedPaths.originLong = newOriginLongPath;
}

module.exports = redrawPath;

},{}],26:[function(require,module,exports){
function pathGlow(c, pathCfg, savedPath, glowOpts) {
  let blurs = glowOpts.blurs || [100, 70, 50, 30, 10];
  let blurColor = glowOpts.blurColor || 'white';
  let blurShapeOffset = glowOpts.blurShapeOffset || 10000; // c.lineWidth = pathCfg.lineWidth;

  c.strokeStyle = "red";
  c.fillSbtyle = 'white';
  c.shadowOffsetY = blurShapeOffset;
  c.shadowColor = blurColor;

  for (let i = 0; i < blurs.length - 1; i++) {
    c.shadowBlur = blurs[i];
    c.lineWidth = pathCfg.lineWidth * 2;
    c.stroke(savedPath);
  }

  c.shadowBlur = 0;
} // path rendering function


function renderPath(c, parent, globalConfig) {
  let thisCfg = this;
  let renderCfg = parent.renderConfig;
  let currRenderPoint = 0;
  let currRenderHead = 0;
  let currRenderTail = 0;
  const {
    isChild,
    isRendering,
    renderOffset,
    savedPaths,
    path: thisPath,
    lineWidth,
    colR,
    colG,
    colB,
    colA,
    glowColR,
    glowColG,
    glowColB,
    glowColA,
    currHeadPoint
  } = thisCfg;
  let pathLen = thisPath.length - 1;
  const computedPathColor = `rgba(${colR}, ${colG}, ${colB}, ${colA})`;
  const pathGlowRGB = `${glowColR}, ${glowColG}, ${glowColB}`;
  const pathGlowComputedColor = `rgba( ${pathGlowRGB}, ${colA} )`;
  const headGlowBlurArr = [20, 10];
  const pathGlowOpts = {
    blurs: parent.glowBlurIterations,
    blurColor: pathGlowComputedColor
  };
  const pathGlowShortOpts = {
    blurs: [120, 80, 60, 40, 30, 20, 15, 10, 5],
    blurColor: pathGlowComputedColor
  };
  const headGlowOpts = {
    blurs: headGlowBlurArr,
    blurColor: pathGlowComputedColor
  }; // shadow render offset

  const sRO = globalConfig.renderConfig.blurRenderOffset;
  const origin = thisCfg.path[0];
  const {
    x: oX,
    y: oY
  } = origin;

  if (parent.isDrawn === false) {
    this.drawPaths(renderCfg, parent);
  }

  c.lineWidth = lineWidth;
  c.strokeStyle = computedPathColor;
  c.stroke(savedPaths.main);
  pathGlow(c, thisCfg, savedPaths.offset, pathGlowOpts); // if the main path has "connected" and is "discharging"

  if (thisCfg.isChild === false) {
    pathGlow(c, thisCfg, savedPaths.originLong, pathGlowOpts);
    pathGlow(c, thisCfg, savedPaths.originShort, pathGlowShortOpts);

    if (parent.isDrawn === true) {
      // origin glow gradients
      let origin = thisCfg.path[0];
      let grd = c.createRadialGradient(oX, oY, 0, oX, oY, 1024);
      grd.addColorStop(0, pathGlowComputedColor);
      grd.addColorStop(1, `rgba( ${pathGlowRGB}, 0 )`);
      c.fillStyle = grd;
      c.fillCircle(oX, oY, 1024);
    }
  }

  if (pathLen > 4) {
    let glowHeadPathL = new Path2D();
    let glowHeadPathS = new Path2D();
    glowHeadPathL.moveTo(thisPath[pathLen - 2].x, thisPath[pathLen - 2].y - sRO);
    glowHeadPathL.lineTo(thisPath[pathLen - 1].x, thisPath[pathLen - 1].y - sRO);
    glowHeadPathL.lineTo(thisPath[pathLen].x, thisPath[pathLen].y - sRO);
    pathGlow(c, thisCfg, glowHeadPathL, headGlowOpts);
    glowHeadPathS.moveTo(thisPath[pathLen - 1].x, thisPath[pathLen - 1].y - sRO);
    glowHeadPathS.lineTo(thisPath[pathLen].x, thisPath[pathLen].y - sRO);
    pathGlow(c, thisCfg, glowHeadPathS, headGlowOpts);
  }

  return this;
}

module.exports = renderPath;

},{}],27:[function(require,module,exports){
let mathUtils = require('../../utils/mathUtils.js');

let easing = require('../../utils/easing.js').easingEquations;

let trig = require('../../utils/trigonomicUtils.js').trigonomicUtils; // path update function


function updatePath(parentConfig, globalConfig) {
  let rCfg = globalConfig.renderConfig;
  let p = parentConfig;
  let pState = p.state.states;
  let pathCfg = this;
  let pathLen = pathCfg.path.length;
  let rndOffset = pathCfg.renderOffset;

  if (pState.isDrawn === true) {
    if (p.willConnect === false) {
      if (pathCfg.playSequence === false) {
        pathCfg.playSequence = true;
        pathCfg.startSequence({
          index: 0
        });
      }
    }
  }

  if (pathLen + rndOffset < p.renderConfig.currHead) {
    pathCfg.isRendering = false;
  }

  pathCfg.updateSequence();
  return this;
}

module.exports = updatePath;

},{"../../utils/easing.js":40,"../../utils/mathUtils.js":72,"../../utils/trigonomicUtils.js":75}],28:[function(require,module,exports){
const alphaFadeOut = require('./sequenceItems/alphaFadeOut.js');

let childPathAnimSequence = [{
  name: 'lPathCool',
  time: 30,
  linkedSeq: '',
  loop: false,
  loopBack: false,
  final: true,
  items: alphaFadeOut
}];
module.exports = childPathAnimSequence;

},{"./sequenceItems/alphaFadeOut.js":30}],29:[function(require,module,exports){
const fadeToRedAndFadeOut = require('./sequenceItems/fadeToRedAndFadeOut.js');

const lineWidthTo10 = require('./sequenceItems/lineWidthTo10.js');

let mainPathAnimSequence = [{
  name: 'lPathFire',
  time: 1,
  linkedSeq: '1',
  loop: false,
  loopBack: false,
  items: lineWidthTo10
}, {
  name: 'lPathCool',
  time: 30,
  linkedSeq: '',
  loop: false,
  loopBack: false,
  final: true,
  items: fadeToRedAndFadeOut
}];
module.exports = mainPathAnimSequence;

},{"./sequenceItems/fadeToRedAndFadeOut.js":31,"./sequenceItems/lineWidthTo10.js":32}],30:[function(require,module,exports){
const alphaFadeOut = [{
  param: 'colA',
  target: 0,
  easefN: 'easeOutQuint'
}];
module.exports = alphaFadeOut;

},{}],31:[function(require,module,exports){
const fadeToRedAndFadeOut = [{
  param: 'lineWidth',
  start: 0,
  target: 1,
  easefN: 'easeOutQuint'
}, {
  param: 'colG',
  start: 0,
  target: 0,
  easefN: 'easeOutQuint'
}, {
  param: 'colR',
  start: 0,
  target: 0,
  easefN: 'easeOutQuint'
}, {
  param: 'colA',
  start: 0,
  target: 0,
  easefN: 'easeOutSine'
}];
module.exports = fadeToRedAndFadeOut;

},{}],32:[function(require,module,exports){
const lineWidthTo10 = [{
  param: 'lineWidth',
  start: 0,
  target: 10,
  easefN: 'linearEase'
}];
module.exports = lineWidthTo10;

},{}],33:[function(require,module,exports){
function setupSequences(sequences) {
  let sequenceLen = sequences.length;
  let seqArray = [];

  for (let i = 0; i < sequenceLen; i++) {
    let seq = sequences[i];
    let tmpSeq = {
      active: false,
      clock: 0,
      totalClock: seq.time,
      linkedSeq: seq.linkedSeq,
      name: seq.name,
      final: seq.final,
      items: []
    };

    for (let i = 0; i < seq.items.length; i++) {
      let item = seq.items[i];
      tmpSeq.items.push({
        param: item.param,
        start: 0,
        target: item.target,
        easefN: item.easefN
      });
    }

    seqArray.push(tmpSeq);
  }

  return seqArray;
}

module.exports = setupSequences;

},{}],34:[function(require,module,exports){
function startSequence(opts) {
  // console.log( `startSequence` );
  let t = this;
  let seqIndex = opts.index || 0; // set current values to start sequence with

  let seq = t.sequences[seqIndex];

  for (let i = 0; i < seq.items.length; i++) {
    let item = seq.items[i];
    let currItemVal = t[item.param];
    item.start = currItemVal;
    item.target -= currItemVal;
  }

  seq.active = true;
}

module.exports = startSequence;

},{}],35:[function(require,module,exports){
let easing = require('../../utils/easing.js').easingEquations;

function updateSequence(opts) {
  let t = opts || this; // console.log( 'update this: ', this );

  let cS = t.sequences;
  let cSLen = t.sequences.length;

  for (let i = 0; i < cSLen; i++) {
    let thisSeq = cS[i];

    if (thisSeq.active === false) {
      continue;
    }

    let {
      items,
      linkedSeq,
      clock,
      totalClock,
      final
    } = thisSeq;
    let itemLen = items.length;

    for (let i = 0; i < itemLen; i++) {
      let s = items[i];
      t[s.param] = easing[s.easefN](clock, s.start, s.target, totalClock);
    }

    if (clock >= totalClock) {
      thisSeq.active = false;
      thisSeq.clock = 0;

      if (linkedSeq !== '') {
        t.startSequence({
          index: linkedSeq
        });
        continue;
      }

      if (!t.isChild && final) {
        t.isActive = false;
      }
    }

    thisSeq.clock++;
  }
}

module.exports = updateSequence;

},{"../../utils/easing.js":40}],36:[function(require,module,exports){
function updateSequenceClock() {
  let t = this;

  if (t.playSequence === true) {
    if (t.sequenceClock < t.currSequence.time) {
      t.sequenceClock++;
    }

    ;
  }
}

module.exports = updateSequenceClock;

},{}],37:[function(require,module,exports){
/**
 * jQuery object
 * @external jQuery
 * @see {@link http://api.jquery.com/jQuery/}
 */

/**
 * @typedef {Object} Dimensions
 * @description values describing the length of sides X (horizontal) and Y (vertical) in 2d (cartesean) space
 * @property {number} w - width
 * @property {number} h - height
 */

/**
* @typedef {Object} Point - A point in space on a 2d (cartesean) plane
* @description A point in a 2d (cartesean) space plane, as an x/y coordinate pair
* @property {number} x - The X Coordinate
* @property {number} y - The Y Coordinate
*/

/** 
*  @typedef {Object} VelocityVector - The change delta for cartesean x/y, or 2d coordinate systems
*  @property {number} xVel The X delta change value.
*  @property {number} yVel The Y delta change value.
*/

/**
* @typedef {Object} vectorCalculation
* @property {number} distance The distance between vectors
* @property {number} angle The angle between vectors
*/

/**
* @typedef {object} createPathOptions
* @description The options available when creating a new path from the {@link createPathFromOptions} constructor function
* @property {boolean} [isChild=false] - is the path spawned from the original seed path or the main path?.
* @property {boolean} [isActive=false] - is the path active?.
* @property {boolean} [isRendering=false] - is the path rendering.
* @property {boolean} [willStrike=false] - will the path connect with a target.
* @property {number} startX - x value for the path start.
* @property {number} startY - y value for the path start.
* @property {number} endX - x value for the path end.
* @property {number} endY - y value for the path end.
* @property {number} subdivisions - number of subdivion passes made when plotting the path points from start to end.
* @property {object} sequences - object containing an animation sequence information.
* @property {number} [pathColR=255] - path stroke color RED (0-255).
* @property {number} [pathColG=255] - path stroke color GREEN (0-255).
* @property {number} [pathColB=255] - path stroke color BLUE (0-255).
* @property {number} [pathColA=1] - path stroke color ALPHA (transparency) (0-1).
* @property {number} [glowColR=255] - path glow color RED (0-255).
* @property {number} [glowColG=255] - path glow color GREEN (0-255).
* @property {number} [glowColB=255] - path glow color BLUE (0-255).
* @property {number} [glowColA=1] - path glow color ALPHA (transparency) (0-1).
* @property {number} [lineWidth=1] - line width of the path at creation (default: 1).
* @property {number} [renderOffset=0] - if isChild is true, this reperesents the array index on the main path point array which this path will regard as it's start point. During rendering where the paths are drawn along their length, this is used as the offset before starting the child paths rendering.
* @property {number} [branchDepth=0] - the branch level that this path has been spawned at (main path is level 0).
* @property {number} [clock=0] - clock incrementer for the path.
* @property {number} [totalClock] - total time before event.
* @property {number} [sequenceClock] - total length of sequence.sequenceStartIndex
* @property {number} [sequenceStartIndex=0] - given the path may have more than one sequence attached this will be the array index of the sequence to start with.
* @property {number} [sequenceIndex=0] - the array index of the current active sequence.
*/

/**
* @typedef {object} pathObject
* @description The return object created by the {@link createPathFromOptions} function
* @property {boolean} isChild is this the main path or a sub(child) path?
* @property {boolean} isActive is this path active?
* @property {boolean} isRendering is the path to be rendered onscreen?
* @property {boolean} willStrike will the path connect to a target?
* @property {number} branchDepth what level of the recursive path creation function is this path? Main path = branchDepth = 0.
* @property {number} baseAngle the angle in radians between the path start and end points.
* @property {number} baseDist the distance between the path start and end points.
* @property {number} colR - path stroke color RED (0-255).
* @property {number} colG - path stroke color GREEN (0-255).
* @property {number} colB - path stroke color BLUE (0-255).
* @property {number} colA - path stroke color ALPHA (transparency) (0-1).
* @property {number} glowColR - path glow color RED (0-255).
* @property {number} glowColG - path glow color GREEN (0-255).
* @property {number} glowColB - path glow color BLUE (0-255).
* @property {number} glowColA - path glow color ALPHA (transparency) (0-1).
* @property {number} lineWidth - line width of the path at creation (default: 1)
* @property {number} clock - the main clock timer for the path
* @property {number} sequenceClock - the sequence clock for current active sequence
* @property {number} totalClock - total clock timing for the path
* @property {boolean} drawPathSequence - is the path in drawing mode
* @property {array} sequences - array of sequence definition objects
* @property {number} sequenceStartIndex - array index of the first sequence to run when active
* @property {number} sequenceIndex - array index of the currently active sequence
* @property {boolean} playSequence - are the sequences playing
* @property {object} currSequence - the current active sequence
* @property {function} startSequence - utility method to start a sequence
* @property {function} updateSequence - utility method to update active sequence
* @property {function} updateSequenceClock - utility method to update the sequence clock
* @property {function} drawPaths - utility method to draw the path
* @property {function} redrawPath - utility method to re-draw the path with possible variances
* @property {function} update - utility method to update the path
* @property {function} render - utility method to render the path
* @property {number} renderOffset - if isChild = true the array index on the main path coordinate list where this child path starts.  
* @property {number} currHeadPoint - when rendering the current array index of path to render.
* @property {array<Point>} path - the created path as an array of x/y coordinate pair objects
* @property {object} savedPaths - object containing named saved paths stored after plotting the path points
* @property {Path2D} savedPaths.main - Path2D primitive containing the main path
* @property {Path2D} savedPaths.offset - Path2D primitive containing the main path duplicate for outer glow rendering
* @property {Path2D} savedPaths.originShort - Path2D primitive containing path for rendering the glow at path start (main path, i.e. isChild = false) 
* @property {Path2D} savedPaths.originLong - Path2D primitive containing path for rendering the additional glow at path start (main path, i.e. isChild = false)
*/
module.exports = {};

},{}],38:[function(require,module,exports){
/**
* @description extends Canvas prototype with useful drawing mixins
* @kind constant
*/
var canvasDrawingApi = CanvasRenderingContext2D.prototype;
/**
* @augments canvasDrawingApi
* @description draw circle API
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/

canvasDrawingApi.circle = function (x, y, r) {
  this.beginPath();
  this.arc(x, y, r, 0, Math.PI * 2, true);
};
/**
* @augments canvasDrawingApi
* @description API to draw filled circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/


canvasDrawingApi.fillCircle = function (x, y, r, context) {
  this.circle(x, y, r, context);
  this.fill();
  this.beginPath();
};
/**
* @augments canvasDrawingApi
* @description API to draw stroked circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/


canvasDrawingApi.strokeCircle = function (x, y, r) {
  this.circle(x, y, r);
  this.stroke();
  this.beginPath();
};
/**
* @augments canvasDrawingApi
* @description API to draw ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - origin Y of ellipse.
* @param {number} w - width of ellipse.
* @param {number} h - height of ellipse.
*/


canvasDrawingApi.ellipse = function (x, y, w, h) {
  this.beginPath();

  for (var i = 0; i < Math.PI * 2; i += Math.PI / 16) {
    this.lineTo(x + Math.cos(i) * w / 2, y + Math.sin(i) * h / 2);
  }

  this.closePath();
};
/**
* @augments canvasDrawingApi
* @description API to draw filled ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - origin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} h - height of ellipse.
*/


canvasDrawingApi.fillEllipse = function (x, y, w, h) {
  this.ellipse(x, y, w, h, context);
  this.fill();
  this.beginPath();
};
/**
* @augments canvasDrawingApi
* @description API to draw stroked ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - origin Y of ellipse.
* @param {number} w - width of ellipse.
* @param {number} h - height of ellipse.
*/


canvasDrawingApi.strokeEllipse = function (x, y, w, h) {
  this.ellipse(x, y, w, h);
  this.stroke();
  this.beginPath();
};
/**
* @augments canvasDrawingApi
* @description API to draw line between 2 vector coordinates.
* @param {number} x1 - X coordinate of vector 1.
* @param {number} y1 - Y coordinate of vector 1.
* @param {number} x2 - X coordinate of vector 2.
* @param {number} y2 - Y coordinate of vector 2.
*/


canvasDrawingApi.line = function (x1, y1, x2, y2) {
  this.beginPath();
  this.moveTo(x1, y1);
  this.lineTo(x2, y2);
  this.stroke();
  this.beginPath();
};
/**
* @augments canvasDrawingApi
* @description API to draw stroked regular polygon shape.
* @param {number} x - X coordinate of the polygon origin.
* @param {number} y - Y coordinate of the polygon origin.
* @param {number} r - Radius of the polygon.
* @param {number} s - Number of sides.
*/


canvasDrawingApi.strokePoly = function (x, y, r, s) {
  var sides = s;
  var radius = r;
  var cx = x;
  var cy = y;
  var angle = 2 * Math.PI / sides;
  this.beginPath();
  this.translate(cx, cy);
  this.moveTo(radius, 0);

  for (var i = 1; i <= sides; i++) {
    this.lineTo(radius * Math.cos(i * angle), radius * Math.sin(i * angle));
  }

  this.stroke();
  this.translate(-cx, -cy);
};
/**
* @augments canvasDrawingApi
* @description API to draw filled regular polygon shape.
* @param {number} x - X coordinate of the polygon origin.
* @param {number} y - Y coordinate of the polygon origin.
* @param {number} r - Radius of the polygon.
* @param {number} s - Number of sides.
*/


canvasDrawingApi.fillPoly = function (x, y, r, s) {
  var sides = s;
  var radius = r;
  var cx = x;
  var cy = y;
  var angle = 2 * Math.PI / sides;
  this.beginPath();
  this.translate(cx, cy);
  this.moveTo(radius, 0);

  for (var i = 1; i <= sides; i++) {
    this.lineTo(radius * Math.cos(i * angle), radius * Math.sin(i * angle));
  }

  this.fill();
  this.translate(-cx, -cy);
};

},{}],39:[function(require,module,exports){
let prefix = '\x1b[';
const cl = {
  // red
  r: `${prefix}31m`,
  bgr: `${prefix}40m`,
  // green
  g: `${prefix}32m`,
  bgg: `${prefix}42m`,
  //yellow
  y: `${prefix}33m`,
  bgy: `${prefix}43m`,
  // blue
  b: `${prefix}36m`,
  bgb: `${prefix}46m`,
  // magenta
  m: `${prefix}35m`,
  bgm: `${prefix}45m`,
  // white
  w: `${prefix}37m`,
  bgw: `${prefix}47m`,
  // reset
  rst: `${prefix}0m`,
  // bold/bright
  bld: `${prefix}1m`,
  // dim
  dim: `${prefix}2m`
};
module.exports = cl;

},{}],40:[function(require,module,exports){
//#region Licence information 

/*
	* This is a near-direct port of Robert Penner's easing equations. Please shower Robert with
	* praise and all of your admiration. His license is provided below.
	*
	* For information on how to use these functions in your animations, check out my following tutorial: 
	* http://bit.ly/18iHHKq
	*
	* -Kirupa
	*/

/*
* @author Robert Penner
* @license 
* TERMS OF USE - EASING EQUATIONS
* 
* Open source under the BSD License. 
* 
* Copyright © 2001 Robert Penner
* All rights reserved.
* 
* Redistribution and use in source and binary forms, with or without modification, 
* are permitted provided that the following conditions are met:
* 
* Redistributions of source code must retain the above copyright notice, this list of 
* conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list 
* of conditions and the following disclaimer in the documentation and/or other materials 
* provided with the distribution.
* 
* Neither the name of the author nor the names of contributors may be used to endorse 
* or promote products derived from this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
* COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
* EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
* GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
* NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
* OF THE POSSIBILITY OF SUCH DAMAGE. 
*
*/
//#endregion

/**
* Provides easing calculation methods.
* @name easingEquations
* @description {@link https://easings.net/en|See the Easing cheat sheet} for a visual representation for each curve formula. Originally developed by {@link http://robertpenner.com/easing/|Robert Penner}
*/
var easingEquations = {
  linearEase: require('./easing/linearEase.js'),
  easeInQuad: require('./easing/easeInQuad.js'),
  easeOutQuad: require('./easing/easeOutQuad.js'),
  easeInOutQuad: require('./easing/easeInOutQuad.js'),
  easeInCubic: require('./easing/easeInCubic.js'),
  easeOutCubic: require('./easing/easeOutCubic.js'),
  easeInOutCubic: require('./easing/easeInOutCubic.js'),
  easeInQuart: require('./easing/easeInQuart.js'),
  easeOutQuart: require('./easing/easeOutQuart.js'),
  easeInOutQuart: require('./easing/easeInOutQuart.js'),
  easeInQuint: require('./easing/easeInQuint.js'),
  easeOutQuint: require('./easing/easeOutQuint.js'),
  easeInOutQuint: require('./easing/easeInOutQuint.js'),
  easeInSine: require('./easing/easeInSine.js'),
  easeOutSine: require('./easing/easeOutSine.js'),
  easeInOutSine: require('./easing/easeInOutSine.js'),
  easeInExpo: require('./easing/easeInExpo.js'),
  easeOutExpo: require('./easing/easeOutExpo.js'),
  easeInOutExpo: require('./easing/easeInOutExpo.js'),
  easeInCirc: require('./easing/easeInCirc.js'),
  easeOutCirc: require('./easing/easeOutCirc.js'),
  easeInOutCirc: require('./easing/easeInOutCirc.js'),
  easeInElastic: require('./easing/easeInElastic.js'),
  easeOutElastic: require('./easing/easeOutElastic.js'),
  easeInOutElastic: require('./easing/easeInOutElastic.js'),
  easeOutBack: require('./easing/easeOutBack.js'),
  easeInBack: require('./easing/easeInBack.js'),
  easeInOutBack: require('./easing/easeInOutBack.js'),
  easeOutBounce: require('./easing/easeOutBounce.js'),
  easeInBounce: require('./easing/easeInBounce.js'),
  easeInOutBounce: require('./easing/easeInOutBounce.js')
};
module.exports.easingEquations = easingEquations;

},{"./easing/easeInBack.js":41,"./easing/easeInBounce.js":42,"./easing/easeInCirc.js":43,"./easing/easeInCubic.js":44,"./easing/easeInElastic.js":45,"./easing/easeInExpo.js":46,"./easing/easeInOutBack.js":47,"./easing/easeInOutBounce.js":48,"./easing/easeInOutCirc.js":49,"./easing/easeInOutCubic.js":50,"./easing/easeInOutElastic.js":51,"./easing/easeInOutExpo.js":52,"./easing/easeInOutQuad.js":53,"./easing/easeInOutQuart.js":54,"./easing/easeInOutQuint.js":55,"./easing/easeInOutSine.js":56,"./easing/easeInQuad.js":57,"./easing/easeInQuart.js":58,"./easing/easeInQuint.js":59,"./easing/easeInSine.js":60,"./easing/easeOutBack.js":61,"./easing/easeOutBounce.js":62,"./easing/easeOutCirc.js":63,"./easing/easeOutCubic.js":64,"./easing/easeOutElastic.js":65,"./easing/easeOutExpo.js":66,"./easing/easeOutQuad.js":67,"./easing/easeOutQuart.js":68,"./easing/easeOutQuint.js":69,"./easing/easeOutSine.js":70,"./easing/linearEase.js":71}],41:[function(require,module,exports){
/**
* @description <p>Function signature for easeInBack.</p> <p>See <a href=" https://easings.net/#easeInQuad">easeInQuad</a> for a visual representation of the curve and further information.</p><p>Note the {startValue} should <strong>not</strong> change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially.</p>
* @memberof easingEquations
* @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @param {number} [overshoot=1.70158] - a ratio of the {startValue} and {changeInValue} to give the effect of "overshooting" the initial {startValue} (easeIn), "overshooting" final value {startValue + changeInValue} (easeOut) or both (easeInOut).
* @returns {number} - The calculated (absolute) value along the easing curve
*/
function easeInBack(currentIteration, startValue, changeInValue, totalIterations, overshoot) {
  if (overshoot == undefined) overshoot = 1.70158;
  return changeInValue * (currentIteration /= totalIterations) * currentIteration * ((overshoot + 1) * currentIteration - overshoot) + startValue;
}

module.exports = easeInBack;

},{}],42:[function(require,module,exports){
const easeOutBounce = require('./easeOutBounce.js');
/**
* @description function signature for easeInBounce. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/


function easeInBounce(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue - easeOutBounce(totalIterations - currentIteration, 0, changeInValue, totalIterations) + startValue;
}

module.exports = easeInBounce;

},{"./easeOutBounce.js":62}],43:[function(require,module,exports){
/**
* @description function signature for easeInCirc. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInCirc(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
}

module.exports = easeInCirc;

},{}],44:[function(require,module,exports){
/**
* @description function signature for easeInCubic. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInCubic(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
}

module.exports = easeInCubic;

},{}],45:[function(require,module,exports){
/**
* @description function signature for easeInElastic. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInElastic(currentIteration, startValue, changeInValue, totalIterations) {
  var s = 1.70158;
  var p = 0;
  var a = changeInValue;
  if (currentIteration == 0) return startValue;
  if ((currentIteration /= totalIterations) == 1) return startValue + changeInValue;
  if (!p) p = totalIterations * .3;

  if (a < Math.abs(changeInValue)) {
    a = changeInValue;
    var s = p / 4;
  } else {
    var s = p / (2 * Math.PI) * Math.asin(changeInValue / a);
  }

  ;
  return -(a * Math.pow(2, 10 * (currentIteration -= 1)) * Math.sin((currentIteration * totalIterations - s) * (2 * Math.PI) / p)) + startValue;
}

module.exports = easeInElastic;

},{}],46:[function(require,module,exports){
/**
* @description function signature for easeInExpo. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInExpo(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
}

module.exports = easeInExpo;

},{}],47:[function(require,module,exports){
/**
* @description function signature for easeInOutBack. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @param {number} [overshoot=1.70158] - a ratio of the {startValue} and {changeInValue} to give the effect of "overshooting" the initial {startValue} (easeIn*), "overshooting" final value {startValue + changeInValue} (easeOut*) or both (easeInOut*).
* @returns {number} - The calculated (absolute) value along the easing curve
*/
function easeInOutBack(currentIteration, startValue, changeInValue, totalIterations, overshoot) {
  if (overshoot == undefined) overshoot = 1.70158;

  if ((currentIteration /= totalIterations / 2) < 1) {
    return changeInValue / 2 * (currentIteration * currentIteration * (((overshoot *= 1.525) + 1) * currentIteration - overshoot)) + startValue;
  }

  return changeInValue / 2 * ((currentIteration -= 2) * currentIteration * (((overshoot *= 1.525) + 1) * currentIteration + overshoot) + 2) + startValue;
}

module.exports = easeInOutBack;

},{}],48:[function(require,module,exports){
const easeInBounce = require('./easeInBounce.js');

const easeOutBounce = require('./easeOutBounce.js');
/**
* @description function signature for easeInOutBounce. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/


function easeInOutBounce(currentIteration, startValue, changeInValue, totalIterations) {
  if (currentIteration < totalIterations / 2) {
    return easeInBounce(currentIteration * 2, 0, changeInValue, totalIterations) * .5 + startValue;
  }

  return easeOutBounce(currentIteration * 2 - totalIterations, 0, changeInValue, totalIterations) * .5 + changeInValue * .5 + startValue;
}

module.exports = easeInOutBounce;

},{"./easeInBounce.js":42,"./easeOutBounce.js":62}],49:[function(require,module,exports){
/**
* @description function signature for easeInOutCirc. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
  }

  return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
}

module.exports = easeInOutCirc;

},{}],50:[function(require,module,exports){
/**
* @description function signature for easeInOutCubic. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
  }

  return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
}

module.exports = easeInOutCubic;

},{}],51:[function(require,module,exports){
/**
* @description function signature for easeInOutElastic. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInOutElastic(currentIteration, startValue, changeInValue, totalIterations) {
  var s = 1.70158;
  var p = 0;
  var a = changeInValue;
  if (currentIteration == 0) return startValue;
  if ((currentIteration /= totalIterations / 2) == 2) return startValue + changeInValue;
  if (!p) p = totalIterations * (.3 * 1.5);

  if (a < Math.abs(changeInValue)) {
    a = changeInValue;
    var s = p / 4;
  } else {
    var s = p / (2 * Math.PI) * Math.asin(changeInValue / a);
  }

  ;

  if (currentIteration < 1) {
    return -.5 * (a * Math.pow(2, 10 * (currentIteration -= 1)) * Math.sin((currentIteration * totalIterations - s) * (2 * Math.PI) / p)) + startValue;
  }

  return a * Math.pow(2, -10 * (currentIteration -= 1)) * Math.sin((currentIteration * totalIterations - s) * (2 * Math.PI) / p) * .5 + changeInValue + startValue;
}

module.exports = easeInOutElastic;

},{}],52:[function(require,module,exports){
/**
* @description function signature for easeInOutExpo. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
  }

  return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
}

module.exports = easeInOutExpo;

},{}],53:[function(require,module,exports){
/**
* @summary function signature for easeInOutQuad. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations  
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return changeInValue / 2 * currentIteration * currentIteration + startValue;
  }

  return -changeInValue / 2 * (--currentIteration * (currentIteration - 2) - 1) + startValue;
}

module.exports = easeInOutQuad;

},{}],54:[function(require,module,exports){
/**
* @description function signature for easeInOutQuart. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter. 
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
  }

  return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
}

module.exports = easeInOutQuart;

},{}],55:[function(require,module,exports){
/**
* @description function signature for easeInOutQuint. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations / 2) < 1) {
    return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
  }

  return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
}

module.exports = easeInOutQuint;

},{}],56:[function(require,module,exports){
/**
* @description function signature for easeInOutSine. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInOutSine(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
}

module.exports = easeInOutSine;

},{}],57:[function(require,module,exports){
/**
* @summary function signature for easeInQuad. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially. See {@link https://easings.net/#easeInQuad easeInQuad} for a visual representation of the curve and further information.
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInQuad(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
}

module.exports = easeInQuad;

},{}],58:[function(require,module,exports){
/**
* @description function signature for easeInQuart. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInQuart(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
}

module.exports = easeInQuart;

},{}],59:[function(require,module,exports){
/**
* @description function signature for easeInQuint. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
}

module.exports = easeInQuint;

},{}],60:[function(require,module,exports){
/**
* @description function signature for easeInSine. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially. See {@link https://easings.net/#easeInSine easeInSine} for a visual representation of the curve and further information.  
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeInSine(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
}

module.exports = easeInSine;

},{}],61:[function(require,module,exports){
/**
* @description function signature for easeOutBack. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @param {number} [overshoot=1.70158] - a ratio of the {startValue} and {changeInValue} to give the effect of "overshooting" the initial {startValue} (easeIn*), "overshooting" final value {startValue + changeInValue} (easeOut*) or both (easeInOut*).
* @returns {number} - The calculated (absolute) value along the easing curve
*/
function easeOutBack(currentIteration, startValue, changeInValue, totalIterations, overshoot) {
  if (overshoot == undefined) overshoot = 1.70158;
  return changeInValue * ((currentIteration = currentIteration / totalIterations - 1) * currentIteration * ((overshoot + 1) * currentIteration + overshoot) + 1) + startValue;
}

module.exports = easeOutBack;

},{}],62:[function(require,module,exports){
/**
* @description function signature for easeOutBounce. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeOutBounce(currentIteration, startValue, changeInValue, totalIterations) {
  if ((currentIteration /= totalIterations) < 1 / 2.75) {
    return changeInValue * (7.5625 * currentIteration * currentIteration) + startValue;
  } else if (currentIteration < 2 / 2.75) {
    return changeInValue * (7.5625 * (currentIteration -= 1.5 / 2.75) * currentIteration + .75) + startValue;
  } else if (currentIteration < 2.5 / 2.75) {
    return changeInValue * (7.5625 * (currentIteration -= 2.25 / 2.75) * currentIteration + .9375) + startValue;
  } else {
    return changeInValue * (7.5625 * (currentIteration -= 2.625 / 2.75) * currentIteration + .984375) + startValue;
  }
}

module.exports = easeOutBounce;

},{}],63:[function(require,module,exports){
/**
* @description function signature for easeOutCirc. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
}

module.exports = easeOutCirc;

},{}],64:[function(require,module,exports){
/**
* @description function signature for easeOutCubic. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
}

module.exports = easeOutCubic;

},{}],65:[function(require,module,exports){
/**
* @description function signature for easeOutElastic. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeOutElastic(currentIteration, startValue, changeInValue, totalIterations) {
  var s = 1.70158;
  var p = 0;
  var a = changeInValue;
  if (currentIteration == 0) return startValue;
  if ((currentIteration /= totalIterations) == 1) return startValue + changeInValue;
  if (!p) p = totalIterations * .3;

  if (a < Math.abs(changeInValue)) {
    a = changeInValue;
    var s = p / 4;
  } else {
    var s = p / (2 * Math.PI) * Math.asin(changeInValue / a);
  }

  return a * Math.pow(2, -10 * currentIteration) * Math.sin((currentIteration * totalIterations - s) * (2 * Math.PI) / p) + changeInValue + startValue;
}

module.exports = easeOutElastic;

},{}],66:[function(require,module,exports){
/**
* @description function signature for easeOutExpo. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
}

module.exports = easeOutExpo;

},{}],67:[function(require,module,exports){
/**
* @summary function signature for easeOutQuad. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially. See {@link https://easings.net/#easeOutQuad easeOutQuad} for a visual representation of the curve and further information.
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
  return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
}

module.exports = easeOutQuad;

},{}],68:[function(require,module,exports){
/**
* @description function signature for easeOutQuart. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
  return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
}

module.exports = easeOutQuart;

},{}],69:[function(require,module,exports){
/**
* @description function signature for easeOutQuint. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
}

module.exports = easeOutQuint;

},{}],70:[function(require,module,exports){
/**
* @description function signature for easeOutSine. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function easeOutSine(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
}

module.exports = easeOutSine;

},{}],71:[function(require,module,exports){
/**
* @summary function signature for linearEase. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially.
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/
function linearEase(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * currentIteration / totalIterations + startValue;
}

module.exports = linearEase;

},{}],72:[function(require,module,exports){
/**
* provides maths utilility methods and helpers.
*
* @module mathUtils
*/
var mathUtils = {
  /**
  * @description Generate random integer between 2 values.
  * @param {number} min - minimum value.
  * @param {number} max - maximum value.
  * @returns {number} result.
  */
  randomInteger: function randomInteger(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  },

  /**
  * @description Generate random float between 2 values.
  * @param {number} min - minimum value.
  * @param {number} max - maximum value.
  * @returns {number} result.
  */
  random: function random(min, max) {
    if (min === undefined) {
      min = 0;
      max = 1;
    } else if (max === undefined) {
      max = min;
      min = 0;
    }

    return Math.random() * (max - min) + min;
  },
  getRandomArbitrary: function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  },

  /**
  * @description Transforms value proportionately between input range and output range.
  * @param {number} value - the value in the origin range ( min1/max1 ).
  * @param {number} min1 - minimum value in origin range.
  * @param {number} max1 - maximum value in origin range.
  * @param {number} min2 - minimum value in destination range.
  * @param {number} max2 - maximum value in destination range.
  * @param {number} clampResult - clamp result between destination range boundarys.
  * @returns {number} result.
  */
  map: function map(value, min1, max1, min2, max2, clampResult) {
    var self = this;
    var returnvalue = (value - min1) / (max1 - min1) * (max2 - min2) + min2;
    if (clampResult) return self.clamp(returnvalue, min2, max2);else return returnvalue;
  },

  /**
  * @description Clamp value between range values.
  * @param {number} value - the value in the range { min|max }.
  * @param {number} min - minimum value in the range.
  * @param {number} max - maximum value in the range.
  * @param {number} clampResult - clamp result between range boundarys.
  */
  clamp: function clamp(value, min, max) {
    if (max < min) {
      var temp = min;
      min = max;
      max = temp;
    }

    return Math.max(min, Math.min(value, max));
  }
};
module.exports = mathUtils;

},{}],73:[function(require,module,exports){
// requestAnimationFrame() shim by Paul Irish
window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFramec || function (callback, element) {
    window.setTimeout(callback, 1000 / 60);
  };
}();
/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance
 * @param {function} fn The callback function
 * @param {number} delay The delay in milliseconds
 */


window.requestTimeout = function (fn, delay) {
  if (!window.requestAnimationFrame && !window.webkitRequestAnimationFrame && !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && !window.oRequestAnimationFrame && !window.msRequestAnimationFrame) {
    return window.setTimeout(fn, delay);
  }

  var start = new Date().getTime(),
      handle = new Object();

  function loop() {
    var current = new Date().getTime(),
        delta = current - start;
    delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
  }

  ;
  handle.value = requestAnimFrame(loop);
  return handle;
};
/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance
 * @param {int|object} fn The callback function
 */


window.clearRequestTimeout = function (handle) {
  window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) : window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) : window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) :
  /* Support for legacy API */
  window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) : window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) : window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) : clearTimeout(handle);
};

},{}],74:[function(require,module,exports){
/*
 * A fast javascript implementation of simplex noise by Jonas Wagner
Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
Better rank ordering method by Stefan Gustavson in 2012.

Copyright (c) 2018 Jonas Wagner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function () {
  'use strict';

  var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  var F3 = 1.0 / 3.0;
  var G3 = 1.0 / 6.0;
  var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
  var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

  function SimplexNoise(randomOrSeed) {
    var random;

    if (typeof randomOrSeed == 'function') {
      random = randomOrSeed;
    } else if (randomOrSeed) {
      random = alea(randomOrSeed);
    } else {
      random = Math.random;
    }

    this.p = buildPermutationTable(random);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);

    for (var i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  SimplexNoise.prototype = {
    grad3: new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]),
    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
    noise2D: function (xin, yin) {
      var permMod12 = this.permMod12;
      var perm = this.perm;
      var grad3 = this.grad3;
      var n0 = 0; // Noise contributions from the three corners

      var n1 = 0;
      var n2 = 0; // Skew the input space to determine which simplex cell we're in

      var s = (xin + yin) * F2; // Hairy factor for 2D

      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var t = (i + j) * G2;
      var X0 = i - t; // Unskew the cell origin back to (x,y) space

      var Y0 = j - t;
      var x0 = xin - X0; // The x,y distances from the cell origin

      var y0 = yin - Y0; // For the 2D case, the simplex shape is an equilateral triangle.
      // Determine which simplex we are in.

      var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords

      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      else {
          i1 = 0;
          j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
      // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
      // c = (3-sqrt(3))/6


      var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords

      var y1 = y0 - j1 + G2;
      var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords

      var y2 = y0 - 1.0 + 2.0 * G2; // Work out the hashed gradient indices of the three simplex corners

      var ii = i & 255;
      var jj = j & 255; // Calculate the contribution from the three corners

      var t0 = 0.5 - x0 * x0 - y0 * y0;

      if (t0 >= 0) {
        var gi0 = permMod12[ii + perm[jj]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
      }

      var t1 = 0.5 - x1 * x1 - y1 * y1;

      if (t1 >= 0) {
        var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
      }

      var t2 = 0.5 - x2 * x2 - y2 * y2;

      if (t2 >= 0) {
        var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
      } // Add contributions from each corner to get the final noise value.
      // The result is scaled to return values in the interval [-1,1].


      return 70.0 * (n0 + n1 + n2);
    },
    // 3D simplex noise
    noise3D: function (xin, yin, zin) {
      var permMod12 = this.permMod12;
      var perm = this.perm;
      var grad3 = this.grad3;
      var n0, n1, n2, n3; // Noise contributions from the four corners
      // Skew the input space to determine which simplex cell we're in

      var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D

      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var k = Math.floor(zin + s);
      var t = (i + j + k) * G3;
      var X0 = i - t; // Unskew the cell origin back to (x,y,z) space

      var Y0 = j - t;
      var Z0 = k - t;
      var x0 = xin - X0; // The x,y,z distances from the cell origin

      var y0 = yin - Y0;
      var z0 = zin - Z0; // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
      // Determine which simplex we are in.

      var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords

      var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords

      if (x0 >= y0) {
        if (y0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } // X Y Z order
        else if (x0 >= z0) {
            i1 = 1;
            j1 = 0;
            k1 = 0;
            i2 = 1;
            j2 = 0;
            k2 = 1;
          } // X Z Y order
          else {
              i1 = 0;
              j1 = 0;
              k1 = 1;
              i2 = 1;
              j2 = 0;
              k2 = 1;
            } // Z X Y order

      } else {
        // x0<y0
        if (y0 < z0) {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Z Y X order
        else if (x0 < z0) {
            i1 = 0;
            j1 = 1;
            k1 = 0;
            i2 = 0;
            j2 = 1;
            k2 = 1;
          } // Y Z X order
          else {
              i1 = 0;
              j1 = 1;
              k1 = 0;
              i2 = 1;
              j2 = 1;
              k2 = 0;
            } // Y X Z order

      } // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
      // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
      // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
      // c = 1/6.


      var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords

      var y1 = y0 - j1 + G3;
      var z1 = z0 - k1 + G3;
      var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords

      var y2 = y0 - j2 + 2.0 * G3;
      var z2 = z0 - k2 + 2.0 * G3;
      var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords

      var y3 = y0 - 1.0 + 3.0 * G3;
      var z3 = z0 - 1.0 + 3.0 * G3; // Work out the hashed gradient indices of the four simplex corners

      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255; // Calculate the contribution from the four corners

      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0) n0 = 0.0;else {
        var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0) n1 = 0.0;else {
        var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0) n2 = 0.0;else {
        var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0) n3 = 0.0;else {
        var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
        t3 *= t3;
        n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
      } // Add contributions from each corner to get the final noise value.
      // The result is scaled to stay just inside [-1,1]

      return 32.0 * (n0 + n1 + n2 + n3);
    },
    // 4D simplex noise, better simplex rank ordering method 2012-03-09
    noise4D: function (x, y, z, w) {
      var perm = this.perm;
      var grad4 = this.grad4;
      var n0, n1, n2, n3, n4; // Noise contributions from the five corners
      // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in

      var s = (x + y + z + w) * F4; // Factor for 4D skewing

      var i = Math.floor(x + s);
      var j = Math.floor(y + s);
      var k = Math.floor(z + s);
      var l = Math.floor(w + s);
      var t = (i + j + k + l) * G4; // Factor for 4D unskewing

      var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space

      var Y0 = j - t;
      var Z0 = k - t;
      var W0 = l - t;
      var x0 = x - X0; // The x,y,z,w distances from the cell origin

      var y0 = y - Y0;
      var z0 = z - Z0;
      var w0 = w - W0; // For the 4D case, the simplex is a 4D shape I won't even try to describe.
      // To find out which of the 24 possible simplices we're in, we need to
      // determine the magnitude ordering of x0, y0, z0 and w0.
      // Six pair-wise comparisons are performed between each possible pair
      // of the four coordinates, and the results are used to rank the numbers.

      var rankx = 0;
      var ranky = 0;
      var rankz = 0;
      var rankw = 0;
      if (x0 > y0) rankx++;else ranky++;
      if (x0 > z0) rankx++;else rankz++;
      if (x0 > w0) rankx++;else rankw++;
      if (y0 > z0) ranky++;else rankz++;
      if (y0 > w0) ranky++;else rankw++;
      if (z0 > w0) rankz++;else rankw++;
      var i1, j1, k1, l1; // The integer offsets for the second simplex corner

      var i2, j2, k2, l2; // The integer offsets for the third simplex corner

      var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
      // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
      // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
      // impossible. Only the 24 indices which have non-zero entries make any sense.
      // We use a thresholding to set the coordinates in turn from the largest magnitude.
      // Rank 3 denotes the largest coordinate.

      i1 = rankx >= 3 ? 1 : 0;
      j1 = ranky >= 3 ? 1 : 0;
      k1 = rankz >= 3 ? 1 : 0;
      l1 = rankw >= 3 ? 1 : 0; // Rank 2 denotes the second largest coordinate.

      i2 = rankx >= 2 ? 1 : 0;
      j2 = ranky >= 2 ? 1 : 0;
      k2 = rankz >= 2 ? 1 : 0;
      l2 = rankw >= 2 ? 1 : 0; // Rank 1 denotes the second smallest coordinate.

      i3 = rankx >= 1 ? 1 : 0;
      j3 = ranky >= 1 ? 1 : 0;
      k3 = rankz >= 1 ? 1 : 0;
      l3 = rankw >= 1 ? 1 : 0; // The fifth corner has all coordinate offsets = 1, so no need to compute that.

      var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords

      var y1 = y0 - j1 + G4;
      var z1 = z0 - k1 + G4;
      var w1 = w0 - l1 + G4;
      var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords

      var y2 = y0 - j2 + 2.0 * G4;
      var z2 = z0 - k2 + 2.0 * G4;
      var w2 = w0 - l2 + 2.0 * G4;
      var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords

      var y3 = y0 - j3 + 3.0 * G4;
      var z3 = z0 - k3 + 3.0 * G4;
      var w3 = w0 - l3 + 3.0 * G4;
      var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords

      var y4 = y0 - 1.0 + 4.0 * G4;
      var z4 = z0 - 1.0 + 4.0 * G4;
      var w4 = w0 - 1.0 + 4.0 * G4; // Work out the hashed gradient indices of the five simplex corners

      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      var ll = l & 255; // Calculate the contribution from the five corners

      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
      if (t0 < 0) n0 = 0.0;else {
        var gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32 * 4;
        t0 *= t0;
        n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
      if (t1 < 0) n1 = 0.0;else {
        var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32 * 4;
        t1 *= t1;
        n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
      if (t2 < 0) n2 = 0.0;else {
        var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32 * 4;
        t2 *= t2;
        n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
      if (t3 < 0) n3 = 0.0;else {
        var gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32 * 4;
        t3 *= t3;
        n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
      }
      var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
      if (t4 < 0) n4 = 0.0;else {
        var gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32 * 4;
        t4 *= t4;
        n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
      } // Sum up and scale the result to cover the range [-1,1]

      return 27.0 * (n0 + n1 + n2 + n3 + n4);
    }
  };

  function buildPermutationTable(random) {
    var i;
    var p = new Uint8Array(256);

    for (i = 0; i < 256; i++) {
      p[i] = i;
    }

    for (i = 0; i < 255; i++) {
      var r = i + ~~(random() * (256 - i));
      var aux = p[i];
      p[i] = p[r];
      p[r] = aux;
    }

    return p;
  }

  SimplexNoise._buildPermutationTable = buildPermutationTable;
  /*
  The ALEA PRNG and masher code used by simplex-noise.js
  is based on code by Johannes Baagøe, modified by Jonas Wagner.
  See alea.md for the full license.
  */

  function alea() {
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;
    var mash = masher();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < arguments.length; i++) {
      s0 -= mash(arguments[i]);

      if (s0 < 0) {
        s0 += 1;
      }

      s1 -= mash(arguments[i]);

      if (s1 < 0) {
        s1 += 1;
      }

      s2 -= mash(arguments[i]);

      if (s2 < 0) {
        s2 += 1;
      }
    }

    mash = null;
    return function () {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32

      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
  }

  function masher() {
    var n = 0xefc8249d;
    return function (data) {
      data = data.toString();

      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }

      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };
  } // amd


  if (typeof define !== 'undefined' && define.amd) define(function () {
    return SimplexNoise;
  }); // common js

  if (typeof exports !== 'undefined') exports.SimplexNoise = SimplexNoise; // browser
  else if (typeof window !== 'undefined') window.SimplexNoise = SimplexNoise; // nodejs

  if (typeof module !== 'undefined') {
    module.exports = SimplexNoise;
  }
})();

},{}],75:[function(require,module,exports){
require('../typeDefs');
/**
* cached values
*/


const piByHalf = Math.PI / 180;
const halfByPi = 180 / Math.PI;
/**
* provides trigonomic utility methods and helpers.
* @module
* @typedef {import("../typeDefs").Point} Point
* @typedef {import("../typeDefs").Dimensions} Dimensions
* @typedef {import("../typeDefs").VelocityVector} VelocityVector
* @typedef {import("../typeDefs").vectorCalculation} vectorCalculation
*/

let trigonomicUtils = {
  /**
  * @name angle
   * @description calculate angle in radians between to vector points.
   * @memberof trigonomicUtils
   * @param {number} x1 - X coordinate of vector 1.
   * @param {number} y1 - Y coordinate of vector 1.
   * @param {number} x2 - X coordinate of vector 2.
   * @param {number} y2 - Y coordinate of vector 2.
   * @returns {number} the angle in radians.
   */
  angle: function (x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var theta = Math.atan2(-dy, -dx);
    return theta;
  },
  getRadianAngleBetween2Vectors: function (x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  },

  /**
  * @name dist
  * @description calculate distance between 2 vector coordinates.
  * @memberof trigonomicUtils
  * @param {number} x1 - X coordinate of vector 1.
  * @param {number} y1 - Y coordinate of vector 1.
  * @param {number} x2 - X coordinate of vector 2.
  * @param {number} y2 - Y coordinate of vector 2.
  * @returns {number} the distance between the 2 points.
  */
  dist: function dist(x1, y1, x2, y2) {
    x2 -= x1;
    y2 -= y1;
    return Math.sqrt(x2 * x2 + y2 * y2);
  },

  /**
  * @name degreesToRadians
  * @description convert degrees to radians.
  * @memberof trigonomicUtils
  * @param {number} degrees - the degree value to convert.
  * @returns {number} result as radians.
  */
  degreesToRadians: function (degrees) {
    return degrees * piByHalf;
  },

  /**
  * @name radiansToDegrees
  * @description convert radians to degrees.
  * @memberof trigonomicUtils
  * @param {number} radians - the degree value to convert.
  * @returns {number} result as degrees.
  */
  radiansToDegrees: function (radians) {
    return radians * halfByPi;
  },

  /**
  * @name getAngleAndDistance
  	* @description calculate trigomomic values between 2 vector coordinates.
  	* @memberof trigonomicUtils
  * @param {number} x1 - X coordinate of vector 1.
  * @param {number} y1 - Y coordinate of vector 1.
  * @param {number} x2 - X coordinate of vector 2.
  * @param {number} y2 - Y coordinate of vector 2.
  * @returns {vectorCalculation} the calculated angle and distance between vectors
  */
  getAngleAndDistance: function (x1, y1, x2, y2) {
    // set up base values
    var dX = x2 - x1;
    var dY = y2 - y1; // get the distance between the points

    var d = Math.sqrt(dX * dX + dY * dY); // angle in radians
    // var radians = Math.atan2(yDist, xDist) * 180 / Math.PI;
    // angle in radians

    var r = Math.atan2(dY, dX);
    return {
      distance: d,
      angle: r
    };
  },

  /**
  * @name getAdjacentLength
  * @description get length of the Adjacent side of a right-angled triangle.
  * @memberof trigonomicUtils
  * @param {number} radians - the angle or the triangle.
  * @param {number} hypotonuse - the length of the hypotenuse.
  * @returns {number} result - the length of the Adjacent side.
  */
  getAdjacentLength: function getAdjacentLength(radians, hypotonuse) {
    return Math.cos(radians) * hypotonuse;
  },

  /**
  * @name getOppositeLength
  * @description get length of the Opposite side of a right-angled triangle.
  * @memberof trigonomicUtils
  * @param {number} radians - the angle or the triangle.
  * @param {number} hypotonuse - the length of the hypotenuse.
  * @returns {number} result - the length of the Opposite side.
  */
  getOppositeLength: function (radians, hypotonuse) {
    return Math.sin(radians) * hypotonuse;
  },

  /**
  * @name calculateVelocities
  * @description given an origin (x/y), angle and impulse (absolute velocity) calculate relative x/y velocities.
  * @memberof trigonomicUtils
  * @param {number} x - the coordinate X value of the origin.
  * @param {number} y - the coordinate Y value of the origin.
  * @param {number} angle - the angle in radians.
  * @param {number} impulse - the delta change value.
  * @returns {VelocityVector} result - relative delta change velocity for X/Y.
  */
  calculateVelocities: function (x, y, angle, impulse) {
    var a2 = Math.atan2(Math.sin(angle) * impulse + y - y, Math.cos(angle) * impulse + x - x);
    return {
      xVel: Math.cos(a2) * impulse,
      yVel: Math.sin(a2) * impulse
    };
  },

  /**
  * @name radialDistribution
  * @description Returns a new Point vector (x/y) at the given distance (r) from the origin at the angle (a) .
  * @memberof trigonomicUtils
  * @param {number} x - the coordinate X value of the origin.
  * @param {number} y - the coordinate Y value of the origin.
  * @param {number} d - the absolute delta change value.
  * @param {number} a - the angle in radians.
  * @returns {Point} - the coordinates of the new point.
  */
  radialDistribution: function (x, y, d, a) {
    return {
      x: x + d * Math.cos(a),
      y: y + d * Math.sin(a)
    };
  },

  /**
  * @name findNewPoint
  * @description Returns a new Point vector (x/y) at the given distance (r) from the origin at the angle (a) .
  * @memberof trigonomicUtils
  * @param {number} x - the coordinate X value of the origin.
  * @param {number} y - the coordinate Y value of the origin.
  * @param {number} angle - the angle in radians.
  * @param {number} distance - the absolute delta change value.
  * @returns {Point} - the coordinates of the new point.
  */
  findNewPoint: function (x, y, angle, distance) {
    return {
      x: Math.cos(angle) * distance + x,
      y: Math.sin(angle) * distance + y
    };
  },

  /**
  * @name getPointOnPath
  * @description Returns a new Point vector (x/y) at the given distance (distance) along a path defined by x1/y1, x2/y2.
  * @memberof trigonomicUtils
  * @param {number} x1 - the coordinate X value of the path start.
  * @param {number} y1 - the coordinate Y value of the path start.
  * @param {number} x2 - the coordinate X value of the path end.
  * @param {number} y2 - the coordinate Y value of the path end.
  * @param {number} distance - a number between 0 and 1 where 0 is the path start, 1 is the path end, and 0.5 is the path midpoint.
  */
  getPointOnPath: function (x1, y1, x2, y2, distance) {
    return {
      x: x1 + (x2 - x1) * distance,
      y: y1 + (y2 - y1) * distance
    };
  },

  /**
  * @name computeNormals
  * @description https://stackoverflow.com/questions/1243614/how-do-i-calculate-the-normal-vector-of-a-line-segment
  * if we define dx=x2-x1 and dy=y2-y1
  * @memberof trigonomicUtils
  * @param {number} x1 - the coordinate X value of the path start.
  * @param {number} y1 - the coordinate Y value of the path start.
  * @param {number} x2 - the coordinate X value of the path end.
  * @param {number} y2 - the coordinate Y value of the path end.
  * @returns {object} - The 2 normal vectors from the defined path as points
  */
  computeNormals: function (x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return {
      n1: {
        x: -dy,
        y: dx
      },
      n2: {
        x: dy,
        y: -dx
      }
    };
  },

  /**
  * @name subdivide
  * @description subdivides a vector path (x1, y1, x2, y2) proportionate to the bias
  * @memberof trigonomicUtils
  * @param {number} x1 - the coordinate X value of the path start.
  * @param {number} y1 - the coordinate Y value of the path start.
  * @param {number} x2 - the coordinate X value of the path end.
  * @param {number} y2 - the coordinate Y value of the path end.
  * @param {number} bias - offset of the subdivision between the sbdivision: i.e. 0 - the start vector, 0.5 - midpoint between the 2 vectors, 1 - the end vector.
  * @returns {Point} - The coordinates of the subdivision point
  */
  subdivide: function (x1, y1, x2, y2, bias) {
    return this.getPointOnPath(x1, y1, x2, y2, bias);
  },
  // Curve fuctions

  /**
  * @name getPointAt
  * @description given 3 vector {point}s of a quadratic curve, return the point on the curve at t
  * @memberof trigonomicUtils
  * @param {Point} p1 - {x,y} of the curve's start point.
  * @param {Point} pc - {x,y} of the curve's control point.
  * @param {Point} p2 - {x,y} of the curve's end point.
  * @param {number} bias - the point along the curve's path as a ratio (0-1).
  * @returns {Point} - {x,y} of the point on the curve at {bias}
  */
  getPointAt: function (p1, pc, p2, bias) {
    const x = (1 - bias) * (1 - bias) * p1.x + 2 * (1 - bias) * bias * pc.x + bias * bias * p2.x;
    const y = (1 - bias) * (1 - bias) * p1.y + 2 * (1 - bias) * bias * pc.y + bias * bias * p2.y;
    return {
      x,
      y
    };
  },

  /**
  * @name getDerivativeAt
  * @description Given 3 vector {point}s of a quadratic curve, returns the derivative (tanget) of the curve at point of bias.
  (The derivative measures the steepness of the curve of a function at some particular point on the curve (slope or ratio of change in the value of the function to change in the independent variable).
  * @memberof trigonomicUtils
  * @param {Point} p1 - {x,y} of the curve's start point.
  * @param {Point} pc - {x,y} of the curve's control point.
  * @param {Point} p2 - {x,y} of the curve's end point.
  * @param {number} bias - the point along the curve's path as a ratio (0-1).
  * @returns {Point} - {x,y} of the point on the curve at {bias}
  */
  getDerivativeAt: function (p1, pc, p2, bias) {
    const d1 = {
      x: 2 * (pc.x - p1.x),
      y: 2 * (pc.y - p1.y)
    };
    const d2 = {
      x: 2 * (p2.x - pc.x),
      y: 2 * (p2.y - pc.y)
    };
    const x = (1 - bias) * d1.x + bias * d2.x;
    const y = (1 - bias) * d1.y + bias * d2.y;
    return {
      x,
      y
    };
  },

  /**
  * @name getNormalAt
  * @description given 3 vector {point}s of a quadratic curve returns the normal vector of the curve at the ratio point along the curve {bias}.
  * @memberof trigonomicUtils
  * @param {Point} p1 - {x,y} of the curve's start point.
  * @param {Point} pc - {x,y} of the curve's control point.
  * @param {Point} p2 - {x,y} of the curve's end point.
  * @param {number} bias - the point along the curve's path as a ratio (0-1).
  * @returns {Point} - {x,y} of the point on the curve at {bias}
  */
  getNormalAt: function (p1, pc, p2, bias) {
    const d = this.getDerivativeAt(p1, pc, p2, bias);
    const q = Math.sqrt(d.x * d.x + d.y * d.y);
    const x = -d.y / q;
    const y = d.x / q;
    return {
      x,
      y
    };
  },

  /**
  * @name projectNormalAtDistance
  * @description given 3 vector {point}s of a quadratic curve returns the normal vector of the curve at the ratio point along the curve {bias} at the required {distance}.
  * @memberof trigonomicUtils
  * @param {Point} p1 - {x,y} of the curve's start point.
  * @param {Point} pc - {x,y} of the curve's control point.
  * @param {Point} p2 - {x,y} of the curve's end point.
  * @param {number} bias - the point along the curve's path as a ratio (0-1).
  * @param {number} distance - the distance to project the normal.
  * @returns {Point} - {x,y} of the point projected from the normal on the curve at {bias}
  */
  projectNormalAtDistance: function (p1, pc, p2, bias, distance) {
    const p = this.getPointAt(p1, pc, p2, bias);
    const n = this.getNormalAt(p1, pc, p2, bias);
    const x = p.x + n.x * distance;
    const y = p.y + n.y * distance;
    return {
      x,
      y
    };
  },

  /**
  * @name getAngleOfNormal
  * @description given 3 vector {point}s of a quadratic curve returns the angle of the normal vector of the curve at the ratio point along the curve {bias}.
  * @memberof trigonomicUtils
  * @param {Point} p1 - {x,y} of the curve's start point.
  * @param {Point} pc - {x,y} of the curve's control point.
  * @param {Point} p2 - {x,y} of the curve's end point.
  * @param {number} bias - the point along the curve's path as a ratio (0-1).
  * @returns {number} - the angle of the normal of the curve at {bias}
  */
  getAngleOfNormal: function (p1, pc, p2, bias) {
    const p = this.getPointAt(p1, pc, p2, bias);
    const n = this.getNormalAt(p1, pc, p2, bias);
    return this.getRadianAngleBetween2Vectors(p.x, p.y, n.x, n.y);
  }
};
module.exports.trigonomicUtils = trigonomicUtils;

},{"../typeDefs":37}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY2hlY2tDYW52YXNTdXBwb3J0LmpzIiwic3JjL2pzL2xpZ2h0bmluZ1Rlc3QuanMiLCJzcmMvanMvbGlnaHRuaW5nVGVzdEluY2x1ZGUuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvY2xlYXJNZW1iZXJBcnJheS5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9jcmVhdGVCbHVyQXJyYXkuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvY3JlYXRlTGlnaHRuaW5nLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2NyZWF0aW9uQ29uZmlnLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2RyYXdEZWJ1Z0xpbmVzLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2RyYXdEZWJ1Z1JhZGlhbFRlc3QuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvZ2xvYmFsQ29uZmlnLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2xNZ3JDbG9jay5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9saWdodG5pbmdNYW5hZ2VyVXRpbGl0aWVzLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2xpZ2h0bmluZ1V0aWxpdGllcy5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9yZW5kZXJDb25maWcuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvc2V0Q2FudmFzRGV0YWlscy5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9zZXRHbG9iYWxJbnRlcnZhbC5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9zZXRMb2NhbENsb2NrVGFyZ2V0LmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL3VwZGF0ZUFyci5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci91cGRhdGVSZW5kZXJDZmcuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvY2FsY3VsYXRlU3ViRFJhdGUuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvY3JlYXRlUGF0aENvbmZpZy5qcyIsInNyYy9qcy9saWdodG5pbmcvcGF0aC9jcmVhdGVQYXRoRnJvbU9wdGlvbnMuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvZHJhd1BhdGguanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvcGxvdFBhdGhQb2ludHMuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvcmVkcmF3UGF0aHMuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvcmVuZGVyUGF0aC5qcyIsInNyYy9qcy9saWdodG5pbmcvcGF0aC91cGRhdGVQYXRoLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvY2hpbGRQYXRoQW5pbVNlcXVlbmNlLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvbWFpblBhdGhBbmltU2VxdWVuY2UuanMiLCJzcmMvanMvbGlnaHRuaW5nL3NlcXVlbmNlci9zZXF1ZW5jZUl0ZW1zL2FscGhhRmFkZU91dC5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3NlcXVlbmNlSXRlbXMvZmFkZVRvUmVkQW5kRmFkZU91dC5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3NlcXVlbmNlSXRlbXMvbGluZVdpZHRoVG8xMC5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3NldHVwU2VxdWVuY2VzLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvc3RhcnRTZXF1ZW5jZS5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3VwZGF0ZVNlcXVlbmNlLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvdXBkYXRlU2VxdWVuY2VDbG9jay5qcyIsInNyYy9qcy90eXBlRGVmcy5qcyIsInNyYy9qcy91dGlscy9jYW52YXNBcGlBdWdtZW50YXRpb24uanMiLCJzcmMvanMvdXRpbHMvY2wuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5CYWNrLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5Cb3VuY2UuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJbkNpcmMuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJbkN1YmljLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5FbGFzdGljLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5FeHBvLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRCYWNrLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRCb3VuY2UuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJbk91dENpcmMuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJbk91dEN1YmljLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRFbGFzdGljLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRFeHBvLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRRdWFkLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRRdWFydC5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZUluT3V0UXVpbnQuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJbk91dFNpbmUuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJblF1YWQuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJblF1YXJ0LmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5RdWludC5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZUluU2luZS5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZU91dEJhY2suanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VPdXRCb3VuY2UuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VPdXRDaXJjLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlT3V0Q3ViaWMuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VPdXRFbGFzdGljLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlT3V0RXhwby5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZU91dFF1YWQuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VPdXRRdWFydC5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZU91dFF1aW50LmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlT3V0U2luZS5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvbGluZWFyRWFzZS5qcyIsInNyYy9qcy91dGlscy9tYXRoVXRpbHMuanMiLCJzcmMvanMvdXRpbHMvcmFmUG9seWZpbGwuanMiLCJzcmMvanMvdXRpbHMvc2ltcGxleC1ub2lzZS1uZXcuanMiLCJzcmMvanMvdXRpbHMvdHJpZ29ub21pY1V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7QUFRQSxTQUFTLGtCQUFULENBQTZCLFdBQTdCLEVBQTJDO0FBQ3ZDLE1BQUksR0FBRyxHQUFHLFdBQVcsSUFBSSxJQUF6QjtBQUNBLE1BQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFULENBQXdCLFFBQXhCLENBQVg7QUFDQSxTQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBTCxJQUFtQixJQUFJLENBQUMsVUFBTCxDQUFpQixHQUFqQixDQUFyQixDQUFSO0FBQ0g7O0FBRUQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsa0JBQWpCOzs7QUNkQSxPQUFPLENBQUUsMkJBQUYsQ0FBUDs7O0FDQUEsSUFBSSxrQkFBa0IsR0FB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QixFQUE0QixJQUE1QixDQUFWO0FBQ0ssVUFBTSxDQUFDLEdBQUcsS0FBSyxXQUFMLENBQWlCLEVBQWpCLEVBQXFCLEVBQXJCLEVBQXlCLEVBQXpCLEVBQTZCLElBQTdCLENBQVY7QUFDQSxXQUFPLEtBQUssNkJBQUwsQ0FBb0MsQ0FBQyxDQUFDLENBQXRDLEVBQXlDLENBQUMsQ0FBQyxDQUEzQyxFQUE4QyxDQUFDLENBQUMsQ0FBaEQsRUFBbUQsQ0FBQyxDQUFDLENBQXJELENBQVA7QUFDTDtBQTNTb0IsQ0FBdEI7QUFnVEEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxlQUFmLEdBQWlDLGVBQWpDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXHJcbiogQ3JlYXRlcyBhIGNhbnZhcyBlbGVtZW50IGluIHRoZSBET00gdG8gdGVzdCBmb3IgYnJvd3NlciBzdXBwb3J0XHJcbiogdG8gc2VsZWN0ZWQgZWxlbWVudCB0byBtYXRjaCBzaXplIGRpbWVuc2lvbnMuXHJcbiogQHBhcmFtIHtzdHJpbmd9IGNvbnRleHRUeXBlIC0gKCAnMmQnIHwgJ3dlYmdsJyB8ICdleHBlcmltZW50YWwtd2ViZ2wnIHwgJ3dlYmdsMicsIHwgJ2JpdG1hcHJlbmRlcmVyJyAgKVxyXG4qIFRoZSB0eXBlIG9mIGNhbnZhcyBhbmQgY29udGV4dCBlbmdpbmUgdG8gY2hlY2sgc3VwcG9ydCBmb3JcclxuKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGJvdGggY2FudmFzIGFuZCB0aGUgY29udGV4dCBlbmdpbmUgYXJlIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlclxyXG4qL1xyXG5cclxuZnVuY3Rpb24gY2hlY2tDYW52YXNTdXBwb3J0KCBjb250ZXh0VHlwZSApIHtcclxuICAgIGxldCBjdHggPSBjb250ZXh0VHlwZSB8fCAnMmQnO1xyXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApO1xyXG4gICAgcmV0dXJuICEhKGVsZW0uZ2V0Q29udGV4dCAmJiBlbGVtLmdldENvbnRleHQoIGN0eCApICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hlY2tDYW52YXNTdXBwb3J0OyIsInJlcXVpcmUoICcuL2xpZ2h0bmluZ1Rlc3RJbmNsdWRlLmpzJyApO1xyXG4iLCJsZXQgY2hlY2tDYW52YXNTdXBwb3J0ID0gcmVxdWlyZSggJy4vY2hlY2tDYW52YXNTdXBwb3J0LmpzJyApO1xyXG5yZXF1aXJlKCAnLi91dGlscy9yYWZQb2x5ZmlsbC5qcycpO1xyXG5yZXF1aXJlKCAnLi91dGlscy9jYW52YXNBcGlBdWdtZW50YXRpb24uanMnKTtcclxuXHJcbmxldCBlYXNpbmcgPSByZXF1aXJlKCAnLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5sZXQgZWFzZUZuID0gZWFzaW5nLmVhc2VPdXRTaW5lO1xyXG5cclxubGV0IHRyaWcgPSByZXF1aXJlKCAnLi91dGlscy90cmlnb25vbWljVXRpbHMuanMnICkudHJpZ29ub21pY1V0aWxzO1xyXG5sZXQgcG9pbnRPblBhdGggPSB0cmlnLmdldFBvaW50T25QYXRoO1xyXG5sZXQgY2FsY0QgPSB0cmlnLmRpc3Q7XHJcbmxldCBjYWxjQSA9IHRyaWcuYW5nbGU7XHJcblxyXG5sZXQgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5sZXQgcm5kID0gbWF0aFV0aWxzLnJhbmRvbTtcclxubGV0IHJuZEludCA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyO1xyXG5cclxubGV0IGxpZ250bmluZ01nciA9IHJlcXVpcmUoICcuL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2xpZ2h0bmluZ1V0aWxpdGllcy5qcycpO1xyXG5cclxuXHJcbi8vIGhvdXNla2VlcGluZ1xyXG5sZXQgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJyNsaWdodG5pbmdEcmF3aW5nVGVzdCcgKTtcclxubGV0IGNXID0gY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbmxldCBjSCA9IGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbmxldCBjID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5saWdudG5pbmdNZ3Iuc2V0Q2FudmFzQ2ZnKCAnI2xpZ2h0bmluZ0RyYXdpbmdUZXN0JyApO1xyXG5cclxuYy5saW5lQ2FwID0gJ3JvdW5kJztcclxubGV0IGNvdW50ZXIgPSAwO1xyXG5cclxubGV0IHNob3dEZWJ1Z0luZm8gPSBmYWxzZTtcclxuXHJcbi8vIHRlc3QgVmVjdG9yIHBhdGhcclxubGV0IHRlc3RWZWMgPSB7XHJcblx0c3RhcnRYOiBjVyAvIDIsXHJcblx0c3RhcnRZOiA1MCxcclxuXHRlbmRYOiAoY1cgLyAyKSxcclxuXHRlbmRZOiBjSCAtIDUwXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdMaW5lKCBkZWJ1ZyApIHtcclxuXHRpZiAoIGRlYnVnID09PSB0cnVlICkge1xyXG5cdFx0Yy5zdHJva2VTdHlsZSA9ICdyZWQnO1xyXG5cdFx0Yy5zZXRMaW5lRGFzaCggWzUsIDE1XSApO1xyXG5cdFx0Yy5saW5lKCB0ZXN0VmVjLnN0YXJ0WCwgdGVzdFZlYy5zdGFydFksIHRlc3RWZWMuZW5kWCwgdGVzdFZlYy5lbmRZICk7XHJcblx0XHRjLnNldExpbmVEYXNoKCBbXSApO1xyXG5cdH1cclxufVxyXG5cclxuLy8gbGV0IGl0ZXJhdGlvbnMgPSBybmRJbnQoIDEwLCA1MCApO1xyXG5sZXQgaXRlcmF0aW9ucyA9IDE7XHJcblxyXG5sZXQgYmFzZVRoZW1lID0ge1xyXG5cdGNhbnZhc1c6IGNXLFxyXG5cdGNhbnZhc0g6IGNILFxyXG5cdHN0YXJ0WDogdGVzdFZlYy5zdGFydFgsXHJcblx0c3RhcnRZOiB0ZXN0VmVjLnN0YXJ0WSxcclxuXHRlbmRYOiB0ZXN0VmVjLmVuZFgsXHJcblx0ZW5kWTogdGVzdFZlYy5lbmRZLFxyXG5cdHN1YmRpdmlzaW9uczogbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoIDMsIDYgKSxcclxuXHRzcGVlZE1vZFJhdGU6IDAuOSxcclxuXHR3aWxsQ29ubmVjdDogdHJ1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVUaGVtZSggZXZlbnQgKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdGNhbnZhc1c6IGNXLFxyXG5cdFx0Y2FudmFzSDogY0gsXHJcblx0XHRzdGFydFg6IGV2ZW50LmNsaWVudFgsXHJcblx0XHRzdGFydFk6IGV2ZW50LmNsaWVudFksXHJcblx0XHRlbmRYOiB0ZXN0VmVjLmVuZFgsXHJcblx0XHRlbmRZOiB0ZXN0VmVjLmVuZFksXHJcblx0XHRzdWJkaXZpc2lvbnM6IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCAzLCA2IClcclxuXHR9XHJcbn1cclxuXHJcblxyXG5saWdudG5pbmdNZ3IuY3JlYXRlTGlnaHRuaW5nKCBiYXNlVGhlbWUgKTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQnV0dG9uIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiQoICcuanMtcnVuJyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKXtcclxuXHRsaWdudG5pbmdNZ3IuY3JlYXRlTGlnaHRuaW5nKCBiYXNlVGhlbWUgKTtcclxufSApO1xyXG5cclxuJCggJy5qcy1jbGVhci1tZ3InICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApe1xyXG5cdGxpZ250bmluZ01nci5jbGVhck1lbWJlckFycmF5KCk7XHJcbn0gKTtcclxuXHJcbiQoICcuanMtY2xlYXItbWdyLXJ1bicgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICl7XHJcblx0bGlnbnRuaW5nTWdyLmNsZWFyTWVtYmVyQXJyYXkoKTtcclxuXHRsaWdudG5pbmdNZ3IuY3JlYXRlTGlnaHRuaW5nKCBiYXNlVGhlbWUgKTtcclxufSApO1xyXG5cclxuJCggJ2NhbnZhcycgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICl7XHJcblx0bGlnbnRuaW5nTWdyLmNyZWF0ZUxpZ2h0bmluZyggY3JlYXRlVGhlbWUoIGV2ZW50ICkgKTtcclxufSApO1xyXG5cclxuJCggJy5qcy1idXR0b24tdG9nZ2xlJyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKSB7XHJcblx0bGV0IHRoaXNJdGVtID0gJCggdGhpcyApO1xyXG5cdGlmICggdGhpc0l0ZW0uaGFzQ2xhc3MoICdqcy1pc0FjdGl2ZScpICkge1xyXG5cdFx0dGhpc0l0ZW0ucmVtb3ZlQ2xhc3MoICdqcy1pc0FjdGl2ZScpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aGlzSXRlbS5hZGRDbGFzcyggJ2pzLWlzQWN0aXZlJyk7XHJcblx0fVxyXG5cclxuXHRpZiAoIHR5cGVvZiAkKCB0aGlzICkuYXR0ciggJ2RhdGEtbGlua2VkLXRvZ2dsZScgKSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcclxuXHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5maW5kKCAnLicrJCggdGhpcyApLmF0dHIoICdkYXRhLWxpbmtlZC10b2dnbGUnICkgKS5yZW1vdmVDbGFzcyggJ2pzLWlzQWN0aXZlJyApO1xyXG5cdH1cclxuXHJcbn0gKTtcclxuXHJcbiQoICcuanMtc2hvdy1kZWJ1Zy1vdmVybGF5JyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKXtcclxuXHRpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ2FjdGl2ZScgKSApIHtcclxuXHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcclxuXHRcdHNob3dEZWJ1Z0luZm8gPSBmYWxzZTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0JCggdGhpcyApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xyXG5cdFx0c2hvd0RlYnVnSW5mbyA9IHRydWU7XHJcblx0fVxyXG59ICk7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEFwcCBzdGFydFxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBkcmF3VGVzdCgpIHtcclxuXHRsaWdudG5pbmdNZ3IudXBkYXRlKCBjICk7XHJcblx0ZHJhd0xpbmUoIHNob3dEZWJ1Z0luZm8gKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJTY3JlZW4oKSB7XHJcblx0Yy5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG5cdGMuZmlsbFJlY3QoIDAsIDAsIGNXLCBjSCApO1xyXG59XHJcblxyXG5mdW5jdGlvbiByYWZMb29wKCkge1xyXG5cdC8vIGZsdXNoIHNjcmVlbiBidWZmZXJcclxuXHRjbGVhclNjcmVlbigpO1xyXG5cdC8vIERvIHdoYXRldmVyXHJcblx0ZHJhd1Rlc3QoKTtcclxuXHQvL2xvb3BcclxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHJhZkxvb3AgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdGlhbGlzZSgpIHtcclxuXHQvLyBzZXR1cFxyXG5cdFx0Ly8gZG8gc2V0dXAgdGhpbmdzIGhlcmVcclxuXHQvL2xvb3BlclxyXG5cdHJhZkxvb3AoKTtcclxufVxyXG5cclxuaW5pdGlhbGlzZSgpO1xyXG4iLCJmdW5jdGlvbiBjbGVhck1lbWJlckFycmF5KCkge1xyXG5cdHRoaXMubWVtYmVycy5sZW5ndGggPSAwO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsZWFyTWVtYmVyQXJyYXk7IiwibGV0IGVhc2luZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5cclxuLyoqXHJcbiogQG5hbWUgY3JlYXRlQmx1ckFycmF5XHJcbiogQGRlc2NyaXB0aW9uIEdpdmVuIGEgY291bnQsIG1pbmltdW0gYW5kIG1heGltdW0gYmx1ciBkaXN0YW5jZXMsIHJldHVybiBhbiBhcnJheSBvZiBudW1iZXJzIGludG9wb2xhdGluZyBmcm9tIHRoZSBtaW5pbXVtIHRvIG1heGF4aW11bSBiaWFzZWQgYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpZWQgZWFzZSBmdW5jdGlvblxyXG4qIEBwYXJhbSB7bnVtYmVyfSBibHVyQ291bnQgLSB0aGUgbnVtYmVyIG9mIHJlcXVpcmVkIGJsdXJzLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBtaW5CbHVyRGlzdCAtIHRoZSBtaW5pbXVtIGJsdXIgc2l6ZSBkaXN0YW5jZS5cclxuKiBAcGFyYW0ge251bWJlcn0gbWF4Qmx1ckRpc3QgLSB0aGUgbWF4YXhpbXVtIGJsdXIgc2l6ZSBkaXN0YW5jZS5cclxuKiBAcGFyYW0ge3N0cmluZ30gZWFzZSAtIE5hbWUgb2YgdGhlIGVhc2luZyBmdW5jdGlvbiB0byBpbnRvcG9sYXRlIGJldHdlZW4gdGhlIG1pbmltdW0gYW5kIG1heGltdW1cclxuKiBAcmV0dXJucyB7QXJyYXk8bnVtYmVyPn0gdGhlIGNhbGN1bGF0ZWQgYXJyYXkgb2YgYmx1ciBkaXN0YW5jZXMuXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQmx1ckFycmF5KCBibHVyQ291bnQsIG1pbkJsdXJEaXN0LCBtYXhCbHVyRGlzdCwgZWFzZSApe1xyXG5cdGxldCB0bXAgPSBbXTtcclxuXHRsZXQgZWFzZUZuID0gZWFzaW5nWyBlYXNlIF07XHJcblx0bGV0IGNoYW5nZURlbHRhID0gbWF4Qmx1ckRpc3QgLSBtaW5CbHVyRGlzdDtcclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IGJsdXJDb3VudDsgaSsrICkge1xyXG5cdFx0dG1wLnB1c2goXHJcblx0XHRcdE1hdGguZmxvb3IoIGVhc2VGbiggaSwgbWluQmx1ckRpc3QsIGNoYW5nZURlbHRhLCBibHVyQ291bnQgKSApXHJcblx0XHQpO1xyXG5cdH1cclxuXHRyZXR1cm4gdG1wO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCbHVyQXJyYXk7IiwiY29uc3QgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL21hdGhVdGlscy5qcycgKTtcclxuY29uc3QgdHJpZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy90cmlnb25vbWljVXRpbHMuanMnICkudHJpZ29ub21pY1V0aWxzO1xyXG5jb25zdCBsbWdyVXRpbHMgPSByZXF1aXJlKCAnLi9saWdodG5pbmdNYW5hZ2VyVXRpbGl0aWVzLmpzJyApO1xyXG5jb25zdCBjcmVhdGVMaWdodG5pbmdQYXJlbnQgPSBsbWdyVXRpbHMuY3JlYXRlTGlnaHRuaW5nUGFyZW50O1xyXG5jb25zdCBtYWluUGF0aEFuaW1TZXF1ZW5jZSA9IHJlcXVpcmUoIGAuLi9zZXF1ZW5jZXIvbWFpblBhdGhBbmltU2VxdWVuY2UuanNgICk7XHJcbmNvbnN0IGNoaWxkUGF0aEFuaW1TZXF1ZW5jZSA9IHJlcXVpcmUoIGAuLi9zZXF1ZW5jZXIvY2hpbGRQYXRoQW5pbVNlcXVlbmNlLmpzYCApO1xyXG5jb25zdCBjcmVhdGVQYXRoRnJvbU9wdGlvbnMgPSByZXF1aXJlKCAnLi4vcGF0aC9jcmVhdGVQYXRoRnJvbU9wdGlvbnMuanMnICk7XHJcbmNvbnN0IGNyZWF0ZVBhdGhDb25maWcgPSByZXF1aXJlKCAnLi4vcGF0aC9jcmVhdGVQYXRoQ29uZmlnLmpzJyApO1xyXG5jb25zdCBjYWxjdWxhdGVTdWJEUmF0ZSA9IHJlcXVpcmUoICcuLi9wYXRoL2NhbGN1bGF0ZVN1YkRSYXRlLmpzJyApO1xyXG5cclxuLy8gc3RvcmUgc3ViZGl2aXNpb24gbGV2ZWwgc2VnbWVudCBjb3VudCBhcyBhIGxvb2sgdXAgdGFibGUvYXJyYXlcclxuY29uc3Qgc3ViRFNlZ21lbnRDb3VudExvb2tVcCA9IFsgMSwgMiwgNCwgOCwgMTYsIDMyLCA2NCwgMTI4LCAyNTYsIDUxMiwgMTAyNCBdO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlnaHRuaW5nKCBvcHRpb25zICkge1xyXG5cclxuXHRjb25zdCBsTWdyID0gdGhpcztcclxuXHRjb25zdCBvcHRzID0gb3B0aW9ucztcclxuXHRjb25zdCBjcmVhdGlvbkNvbmZpZyA9IHRoaXMuY3JlYXRpb25Db25maWc7XHJcblx0Y29uc3QgYnJhbmNoQ2ZnID0gY3JlYXRpb25Db25maWcuYnJhbmNoZXM7XHJcblx0bE1nci5jYW52YXNXID0gb3B0cy5jYW52YXNXO1xyXG5cdGxNZ3IuY2FudmFzSCA9IG9wdHMuY2FudmFzSDtcclxuXHRjb25zdCBtYXhDYW52YXNEaXN0ID0gdHJpZy5kaXN0KCAwLCAwLCBvcHRzLmNhbnZhc1csIG9wdHMuY2FudmFzSCApO1xyXG5cdFxyXG5cdGJyYW5jaENmZy5kZXB0aC5jdXJyID0gMTtcclxuXHJcblx0Y29uc3Qgc3ViRCA9IDY7XHJcblx0Ly8gbGV0IHN1YkRpdnMgPSBvcHRzLnN1YmRpdmlzaW9ucyB8fCBtYXRoVXRpbHMucmFuZG9tSW50ZWdlciggYnJhbmNoQ2ZnLnN1YkQubWluLCBicmFuY2hDZmcuc3ViRC5tYXgpO1xyXG5cdFxyXG5cdGNvbnN0IGQgPSB0cmlnLmRpc3QoIG9wdHMuc3RhcnRYLCBvcHRzLnN0YXJ0WSwgb3B0cy5lbmRYLCBvcHRzLmVuZFkgKTtcclxuXHRjb25zdCBzdWJEUmF0ZSA9IGNhbGN1bGF0ZVN1YkRSYXRlKCBkLCBtYXhDYW52YXNEaXN0LCBzdWJEICk7XHJcblx0XHJcblx0Y29uc3Qgc3BlZWQgPSAoIGQgLyBzdWJEU2VnbWVudENvdW50TG9va1VwWyBzdWJEUmF0ZSBdICk7XHJcblx0Y29uc3Qgc3BlZWRNb2RSYXRlID0gb3B0cy5zcGVlZE1vZFJhdGUgfHwgMC42O1xyXG5cdGNvbnN0IHNwZWVkTW9kID0gc3BlZWQgKiBzcGVlZE1vZFJhdGU7XHJcblx0Ly8gY2FsY3VsYXRlIGRyYXcgc3BlZWQgYmFzZWQgb24gYm9sdCBsZW5ndGggLyBcclxuXHJcblx0bGV0IHRlbXBQYXRocyA9IFtdO1xyXG5cclxuXHQvLyAxLiBjcmVhdGUgaW50aWFsL21haW4gcGF0aFxyXG5cdHRlbXBQYXRocy5wdXNoKFxyXG5cdFx0Y3JlYXRlUGF0aEZyb21PcHRpb25zKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aXNDaGlsZDogZmFsc2UsXHJcblx0XHRcdFx0aXNBY3RpdmU6IHRydWUsXHJcblx0XHRcdFx0aXNSZW5kZXJpbmc6IHRydWUsXHJcblx0XHRcdFx0c2VxdWVuY2VTdGFydEluZGV4OiAxLFxyXG5cdFx0XHRcdHNlcXVlbmNlczogbWFpblBhdGhBbmltU2VxdWVuY2UsXHJcblx0XHRcdFx0c3RhcnRYOiBvcHRzLnN0YXJ0WCxcclxuXHRcdFx0XHRzdGFydFk6IG9wdHMuc3RhcnRZLFxyXG5cdFx0XHRcdGVuZFg6IG9wdHMuZW5kWCxcclxuXHRcdFx0XHRlbmRZOiBvcHRzLmVuZFksXHJcblx0XHRcdFx0cGF0aENvbFI6IDE1NSxcclxuXHRcdFx0XHRwYXRoQ29sRzogMTU1LFxyXG5cdFx0XHRcdHBhdGhDb2xCOiAyNTUsXHJcblx0XHRcdFx0cGF0aENvbEE6IDEsXHJcblx0XHRcdFx0Z2xvd0NvbFI6IDE1MCxcclxuXHRcdFx0XHRnbG93Q29sRzogMTUwLFxyXG5cdFx0XHRcdGdsb3dDb2xCOiAyNTUsXHJcblx0XHRcdFx0Z2xvd0NvbEE6IDEsXHJcblx0XHRcdFx0bGluZVdpZHRoOiAxLFxyXG5cdFx0XHRcdHN1YkRSYXRlOiBzdWJEUmF0ZSxcclxuXHRcdFx0XHRzdWJkaXZpc2lvbnM6IHN1YkQsXHJcblx0XHRcdFx0ZFJhbmdlOiBkIC8gMlxyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0KTtcclxuXHJcblx0bGV0IGJyYW5jaFBvaW50c0NvdW50ID0gNjtcclxuXHRsZXQgYnJhbmNoU3ViREZhY3RvciA9IDY7XHJcblx0Ly8gY3ljbGUgdGhyb3VnaCBicmFuY2ggZGVwdGggbGV2ZWxzIHN0YXJ0aW5nIHdpdGggMFxyXG5cdGZvciggbGV0IGJyYW5jaEN1cnJOdW0gPSAwOyBicmFuY2hDdXJyTnVtIDw9IGJyYW5jaENmZy5kZXB0aC5jdXJyOyBicmFuY2hDdXJyTnVtKyspe1xyXG5cdFx0Ly8gY3ljbGUgdGhyb3VnaCBjdXJyZW50IHBhdGhzIGluIHRlbXBQYXRoIGFycmF5XHJcblx0XHRmb3IoIGxldCBjdXJyUGF0aE51bSA9IDA7IGN1cnJQYXRoTnVtIDwgdGVtcFBhdGhzLmxlbmd0aDsgY3VyclBhdGhOdW0rKyApIHtcclxuXHRcdFx0Ly8gZ2V0IHBhdGggb2JqZWN0IGluc3RhbmNlXHJcblx0XHRcdGxldCB0aGlzUGF0aENmZyA9IHRlbXBQYXRoc1sgY3VyclBhdGhOdW0gXTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICggdGhpc1BhdGhDZmcuYnJhbmNoRGVwdGggIT09IGJyYW5jaEN1cnJOdW0gKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGdldCB0aGUgcGF0aCBwb2ludCBhcnJheVxyXG5cdFx0XHRsZXQgcCA9IHRoaXNQYXRoQ2ZnLnBhdGg7XHJcblx0XHRcdGxldCBwTGVuID0gcC5sZW5ndGg7XHJcblxyXG5cdFx0XHQvLyBmb3IgZWFjaCBvZiB0aGUgZ2VuZXJhdGVkIGJyYW5jaCBjb3VudFxyXG5cdFx0XHRmb3IoIGxldCBrID0gMDsgayA8IGJyYW5jaFBvaW50c0NvdW50OyBrKysgKSB7XHJcblxyXG5cdFx0XHRcdGxldCBwQ2ZnID0gY3JlYXRlUGF0aENvbmZpZyhcclxuXHRcdFx0XHRcdHRoaXNQYXRoQ2ZnLFxyXG5cdFx0XHRcdFx0e1x0XHJcblx0XHRcdFx0XHRcdHBhcmVudFBhdGhEaXN0OiBkLFxyXG5cdFx0XHRcdFx0XHRicmFuY2hEZXB0aDogYnJhbmNoQ3Vyck51bSArIDFcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHR0ZW1wUGF0aHMucHVzaChcclxuXHRcdFx0XHRcdGNyZWF0ZVBhdGhGcm9tT3B0aW9ucyhcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdGlzQ2hpbGQ6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0aXNBY3RpdmU6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0aXNSZW5kZXJpbmc6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0YnJhbmNoRGVwdGg6IHBDZmcuYnJhbmNoRGVwdGgsXHJcblx0XHRcdFx0XHRcdFx0cmVuZGVyT2Zmc2V0OiBwQ2ZnLnJlbmRlck9mZnNldCxcclxuXHRcdFx0XHRcdFx0XHRzZXF1ZW5jZVN0YXJ0SW5kZXg6IDEsXHJcblx0XHRcdFx0XHRcdFx0c2VxdWVuY2VzOiBjaGlsZFBhdGhBbmltU2VxdWVuY2UsXHJcblx0XHRcdFx0XHRcdFx0cGF0aENvbFI6IDE1NSxcclxuXHRcdFx0XHRcdFx0XHRwYXRoQ29sRzogMTU1LFxyXG5cdFx0XHRcdFx0XHRcdHBhdGhDb2xCOiAyNTUsXHJcblx0XHRcdFx0XHRcdFx0Z2xvd0NvbFI6IDE1MCxcclxuXHRcdFx0XHRcdFx0XHRnbG93Q29sRzogMTUwLFxyXG5cdFx0XHRcdFx0XHRcdGdsb3dDb2xCOiAyNTUsXHJcblx0XHRcdFx0XHRcdFx0Z2xvd0NvbEE6IDEsXHJcblx0XHRcdFx0XHRcdFx0c3RhcnRYOiBwQ2ZnLnN0YXJ0WCxcclxuXHRcdFx0XHRcdFx0XHRzdGFydFk6IHBDZmcuc3RhcnRZLFxyXG5cdFx0XHRcdFx0XHRcdGVuZFg6IHBDZmcuZW5kWCxcclxuXHRcdFx0XHRcdFx0XHRlbmRZOiBwQ2ZnLmVuZFksXHJcblx0XHRcdFx0XHRcdFx0bGluZVdpZHRoOiAxLFxyXG5cdFx0XHRcdFx0XHRcdHN1YmRpdmlzaW9uczogY2FsY3VsYXRlU3ViRFJhdGUoIHBDZmcuZFZhciwgbWF4Q2FudmFzRGlzdCwgc3ViRCApLFxyXG5cdFx0XHRcdFx0XHRcdGRSYW5nZTogcENmZy5kVmFyXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9IC8vIGVuZCBjdXJyZW50IHBhdGhzIGxvb3BcclxuXHJcblx0XHRpZiAoIGJyYW5jaFBvaW50c0NvdW50ID4gMCApIHtcclxuXHRcdFx0YnJhbmNoUG9pbnRzQ291bnQgPSBNYXRoLmZsb29yKCBicmFuY2hQb2ludHNDb3VudCAvIDE2ICk7XHJcblx0XHR9XHJcblx0XHRpZiAoIGJyYW5jaFN1YkRGYWN0b3IgPiAxICkge1xyXG5cdFx0XHRicmFuY2hTdWJERmFjdG9yLS07XHJcblx0XHR9XHJcblx0fSAvLyBlbmQgYnJhbmNoIGRlcHRoIGxvb3BcclxuXHJcblx0Ly8gY3JlYXRlIHBhcmVudCBsaWdodG5pbmcgaW5zdGFuY2VcclxuXHRjcmVhdGVMaWdodG5pbmdQYXJlbnQoXHJcblx0XHR7IHNwZWVkOiBzcGVlZE1vZCwgdGVtcFBhdGhzOiB0ZW1wUGF0aHMgfSxcclxuXHRcdHRoaXMubWVtYmVyc1xyXG5cdCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlTGlnaHRuaW5nOyIsImNvbnN0IGNyZWF0aW9uQ29uZmlnID0gIHtcclxuXHRicmFuY2hlczoge1xyXG5cdFx0c3ViRDoge1xyXG5cdFx0XHRtaW46IDMsXHJcblx0XHRcdG1heDogNlxyXG5cdFx0fSxcclxuXHRcdGRlcHRoOiB7XHJcblx0XHRcdG1pbjogMSxcclxuXHRcdFx0bWF4OiAyLFxyXG5cdFx0XHRjdXJyOiAwXHJcblx0XHR9LFxyXG5cdFx0c3Bhd25SYXRlOiB7XHJcblx0XHRcdG1pbjogNSxcclxuXHRcdFx0bWF4OiAxMFxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRpb25Db25maWc7IiwiZnVuY3Rpb24gZHJhd0RlYnVnTGluZXMoIGMgKSB7XHJcblx0bGV0IG1lbWJlcnMgPSB0aGlzLm1lbWJlcnM7XHJcblx0bGV0IG1lbWJlcnNMZW4gPSBtZW1iZXJzLmxlbmd0aDtcclxuXHJcblx0Zm9yKCBsZXQgaSA9IDA7IGkgPCBtZW1iZXJzTGVuOyBpKysgKSB7XHJcblx0XHRsZXQgdGhpc01lbWJlciA9IHRoaXMubWVtYmVyc1sgaSBdO1xyXG5cclxuXHRcdGxldCB0aGlzUGF0aHMgPSB0aGlzTWVtYmVyLnBhdGhzO1xyXG5cdFx0bGV0IHRoaXNQYXRoc0xlbiA9IHRoaXNQYXRocy5sZW5ndGg7XHJcblxyXG5cdFx0Zm9yKCBsZXQgaiA9IDA7IGogPCB0aGlzUGF0aHNMZW47IGorKyApIHtcclxuXHRcdFx0bGV0IHBhdGggPSB0aGlzUGF0aHNbIGogXS5wYXRoO1xyXG5cdFx0XHRjLmxpbmVXaWR0aCA9IDU7XHJcblx0XHRcdGMuc3Ryb2tlU3R5bGUgPSAncmVkJztcclxuXHRcdFx0Yy5zZXRMaW5lRGFzaCggWzUsIDE1XSApO1xyXG5cdFx0XHRjLmxpbmUoIHBhdGhbMF0ueCwgcGF0aFswXS55LCBwYXRoW3BhdGgubGVuZ3RoIC0gMV0ueCwgcGF0aFtwYXRoLmxlbmd0aCAtIDFdLnkgKTtcclxuXHRcdFx0Yy5zZXRMaW5lRGFzaCggW10gKTtcdFxyXG5cdFx0fVxyXG5cclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZHJhd0RlYnVnTGluZXM7IiwibGV0IHRyaWcgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvdHJpZ29ub21pY1V0aWxzLmpzJyApLnRyaWdvbm9taWNVdGlscztcclxuXHJcbmZ1bmN0aW9uIGRyYXdEZWJ1Z1JhZGlhbFRlc3QoIGMgKSB7XHJcblx0bGV0IFBJID0gTWF0aC5QSTtcclxuXHRQSVNRID0gUEkgKiAyO1xyXG5cdGxldCBjWCA9IDE1MCwgY1kgPSAxNTAsIGNSID0gMTAwO1xyXG5cdGxldCB6ZXJvUm90UG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbiggY1gsIGNZLCBjUiwgUElTUSApO1xyXG5cdGxldCBxUm90UG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbiggY1gsIGNZLCBjUiwgUElTUSAqIDAuMjUgKTtcclxuXHRsZXQgaGFsZlJvdFBvaW50ID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oIGNYLCBjWSwgY1IsIFBJU1EgKiAwLjUgKTtcclxuXHRsZXQgdGhyZWVRUm90UG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbiggY1gsIGNZLCBjUiwgUElTUSAqIDAuNzUgKTtcclxuXHJcblx0Ly8gc3RhcnQgcG9pbnRcclxuXHRsZXQgdGVzdFAxUG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbiggY1gsIGNZLCBjUiwgUElTUSAqIDAuMTI1ICk7XHJcblx0Ly8gZW5kIHBvaW50XHJcblx0bGV0IHRlc3RQMlBvaW50ID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oIGNYLCBjWSwgY1IsIFBJU1EgKiAwLjYyNSApO1xyXG5cdC8vIGN1cnZlUG9pbnRcclxuXHRsZXQgdGVzdFAzUG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbiggY1gsIGNZLCBjUiwgUElTUSAqIDAuODc1ICk7XHJcblx0bGV0IHRlc3ROb3JtYWxQb2ludCA9IHRyaWcucHJvamVjdE5vcm1hbEF0RGlzdGFuY2UoXHJcblx0XHR0ZXN0UDFQb2ludCwgdGVzdFAzUG9pbnQsIHRlc3RQMlBvaW50LCAwLjUsIGNSICogMS4xXHJcblx0KTtcclxuXHQvLyByZWZlcmVuY2UgcG9pbnRzIHJlbmRlclxyXG5cdGMuc3Ryb2tlU3R5bGUgPSAnIzg4MDAwMCc7XHJcblx0Yy5maWxsU3R5bGUgPSAncmVkJztcclxuXHRjLmxpbmVXaWR0aCA9IDI7XHJcblx0Yy5zdHJva2VDaXJjbGUoIGNYLCBjWSwgY1IgKTtcclxuXHRjLmZpbGxDaXJjbGUoIGNYLCBjWSwgNSApO1xyXG5cdGMuZmlsbENpcmNsZSggemVyb1JvdFBvaW50LngsIHplcm9Sb3RQb2ludC55LCA1ICk7XHJcblx0Yy5maWxsQ2lyY2xlKCBxUm90UG9pbnQueCwgcVJvdFBvaW50LnksIDUgKTtcclxuXHRjLmZpbGxDaXJjbGUoIGhhbGZSb3RQb2ludC54LCBoYWxmUm90UG9pbnQueSwgNSApO1xyXG5cdGMuZmlsbENpcmNsZSggdGhyZWVRUm90UG9pbnQueCwgdGhyZWVRUm90UG9pbnQueSwgNSApO1xyXG5cclxuXHQvLyByZWZlbmNlIHNoYXBlIHRyaWFuZ2xlIHBvaW50cyByZW5kZXJcclxuXHRjLmZpbGxTdHlsZSA9ICcjMDA4OGVlJztcclxuXHRjLmZpbGxDaXJjbGUoIHRlc3RQMVBvaW50LngsIHRlc3RQMVBvaW50LnksIDUgKTtcclxuXHRjLmZpbGxDaXJjbGUoIHRlc3RQMlBvaW50LngsIHRlc3RQMlBvaW50LnksIDUgKTtcclxuXHRjLmZpbGxDaXJjbGUoIHRlc3RQM1BvaW50LngsIHRlc3RQM1BvaW50LnksIDUgKTtcclxuXHJcblx0Ly8gcmVmZW5jZSBzaGFwZSBlZGdlIHJlbmRlclxyXG5cdGMuc3Ryb2tlU3R5bGUgPSAnIzAwMjI2Nic7XHJcblx0Yy5zZXRMaW5lRGFzaCggWzMsIDZdICk7XHJcblx0Yy5saW5lKCB0ZXN0UDFQb2ludC54LCB0ZXN0UDFQb2ludC55LCB0ZXN0UDJQb2ludC54LCB0ZXN0UDJQb2ludC55ICk7XHJcblx0Yy5saW5lKCB0ZXN0UDFQb2ludC54LCB0ZXN0UDFQb2ludC55LCB0ZXN0UDNQb2ludC54LCB0ZXN0UDNQb2ludC55ICk7XHJcblx0Yy5saW5lKCB0ZXN0UDJQb2ludC54LCB0ZXN0UDJQb2ludC55LCB0ZXN0UDNQb2ludC54LCB0ZXN0UDNQb2ludC55ICk7XHJcblxyXG5cdC8vIHByb2plY3RlZCBOT1JNQUwgcmVmZXJlbmNlIHBvaW50XHJcblx0Yy5maWxsU3R5bGUgPSAnIzAwYWFmZic7XHJcblx0Yy5maWxsQ2lyY2xlKCB0ZXN0Tm9ybWFsUG9pbnQueCwgdGVzdE5vcm1hbFBvaW50LnksIDUgKTtcclxuXHJcblx0Ly8gbm9ybWFsIGxpbmUgcmVuZGVyXHJcblx0Ly8gaW5uZXJcclxuXHRjLnNldExpbmVEYXNoKCBbMywgNl0gKTtcclxuXHRjLnN0cm9rZVN0eWxlID0gJyMwMDU1MDAnO1xyXG5cdGMubGluZSggY1gsIGNZLCB0ZXN0UDNQb2ludC54LCB0ZXN0UDNQb2ludC55ICk7XHJcblx0Ly8gb3V0ZXJcclxuXHRjLnN0cm9rZVN0eWxlID0gJyMwMGZmMDAnO1xyXG5cdGMubGluZSggdGVzdFAzUG9pbnQueCwgdGVzdFAzUG9pbnQueSwgdGVzdE5vcm1hbFBvaW50LngsIHRlc3ROb3JtYWxQb2ludC55ICk7XHJcblx0Yy5zZXRMaW5lRGFzaChbXSk7XHJcblxyXG5cdC8vIGNhbGN1bGF0ZSBub3JtYWwgYW5nbGUgYmFjayBmcm9tIHRlc3Qgc2hhcGUgZm9yIHRlc3RpbmdcclxuXHRsZXQgdGVzdEFuZ2xlID0gdHJpZy5nZXRBbmdsZU9mTm9ybWFsKCB0ZXN0UDFQb2ludCwgdGVzdFAzUG9pbnQsIHRlc3RQMlBvaW50LDAuNSk7XHJcblx0Ly8gcHJvamVjdCBub21hbCBwb2ludCBmcm9tIGNhbGN1bGF0aW9uXHJcblx0bGV0IHRlc3RBbmdsZVBvaW50ID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oXHJcblx0XHRjWCwgY1kgKyAyMDAsIDEwMCxcclxuXHRcdE1hdGguYXRhbjIodGVzdE5vcm1hbFBvaW50LnkgLSBjWSwgdGVzdE5vcm1hbFBvaW50LnggLSBjWClcclxuXHRcdCk7XHJcblxyXG5cdC8vIGRyYXcgbGluZSBmb3IgdGVzdCByZWZlcmVuY2VcclxuXHRjLnN0cm9rZVN0eWxlID0gJyMwMDAwOTknO1xyXG5cdGMuZmlsbFN0eWxlID0gJyMwMDY2ZGQnO1xyXG5cdGMuc3Ryb2tlQ2lyY2xlKCBjWCwgY1kgKyAyMDAsIDc1ICk7XHJcblx0Yy5saW5lKCBjWCwgY1kgKyAyMDAsIHRlc3RBbmdsZVBvaW50LngsIHRlc3RBbmdsZVBvaW50LnkgKTtcclxuXHRjLmZpbGxDaXJjbGUoIGNYLCBjWSArIDIwMCwgNSApO1xyXG5cdGMuZmlsbENpcmNsZSggdGVzdEFuZ2xlUG9pbnQueCwgdGVzdEFuZ2xlUG9pbnQueSwgNSApO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRyYXdEZWJ1Z1JhZGlhbFRlc3Q7IiwiY29uc3QgZ2xvYmFsQ29uZmlnID0ge1xyXG5cdGludGVydmFsTWluOiAwLFxyXG5cdGludGVydmFsTWF4OiAwLFxyXG5cdGludGVydmFsQ3VycmVudDogMFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbENvbmZpZzsiLCJjb25zdCBsTWdyQ2xvY2sgPSB7XHJcblx0Z2xvYmFsOiB7XHJcblx0XHRpc1J1bm5pbmc6IGZhbHNlLFxyXG5cdFx0Y3VycmVudFRpY2s6IDBcclxuXHR9LFxyXG5cdGxvY2FsOiB7XHJcblx0XHRpc1J1bm5pbmc6IGZhbHNlLFxyXG5cdFx0Y3VycmVudFRpY2s6IDAsXHJcblx0XHR0YXJnZXQ6IDBcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbE1nckNsb2NrOyIsImxldCBjcmVhdGVCbHVyQXJyYXkgPSByZXF1aXJlKCAnLi9jcmVhdGVCbHVyQXJyYXkuanMnICk7XHJcbmxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5cclxuLy8gc3RhdGUgbGlzdCBkZWNsYXJhdGlvbnNcclxuY29uc3QgSVNfVU5JTklUSUFMSVNFRCA9ICdpc1VuaW5pdGlhbGlzZWQnO1xyXG5jb25zdCBJU19JTklUSUFMSVNFRCA9ICdpc0luaXRpYWxpc2VkJztcclxuY29uc3QgSVNfQUNUSVZFID0gJ2lzQWN0aXZlJztcclxuY29uc3QgSVNfRFJBV0lORyA9ICdpc0RyYXdpbmcnO1xyXG5jb25zdCBJU19EUkFXTiA9ICdpc0RyYXduJztcclxuY29uc3QgSVNfQ09OTkVDVEVEID0gJ2lzQ29ubmVjdGVkJztcclxuY29uc3QgSVNfUkVEUkFXSU5HID0gJ2lzUmVkcmF3aW5nJztcclxuY29uc3QgSVNfQU5JTUFURUQgPSAnaXNBbmltYXRpbmcnO1xyXG5jb25zdCBJU19GSUVMREVGRkVDVCA9ICdpc0ZpZWxkRWZmZWN0JztcclxuY29uc3QgSVNfQ09VTlRET1dOID0gJ2lzQ291bnRkb3duJztcclxuY29uc3QgSVNfQ09NUExFVEUgPSAnaXNDb21wbGV0ZSc7XHJcbmNvbnN0IElTX0NPVU5URE9XTkNPTVBMRVRFID0gJ2lzQ291bnRkb3duQ29tcGxldGUnO1xyXG5cclxuZnVuY3Rpb24gc2V0U3RhdGUoIHN0YXRlTmFtZSApIHtcclxuXHRsZXQgc3RhdGVzID0gdGhpcy5zdGF0ZS5zdGF0ZXM7XHJcblx0Y29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKCBzdGF0ZXMgKTtcclxuXHRjb25zdCBlbnRyaWVzTGVuID0gZW50cmllcy5sZW5ndGg7XHJcblx0Zm9yKCBsZXQgaSA9IDA7IGkgPCBlbnRyaWVzTGVuOyBpKysgKSB7XHJcblx0XHRsZXQgdGhpc0VudHJ5ID0gZW50cmllc1sgaSBdO1xyXG5cdFx0bGV0IHRoaXNFbnRyeU5hbWUgPSB0aGlzRW50cnlbIDAgXTtcclxuXHRcdGlmKCB0aGlzRW50cnlOYW1lID09PSBzdGF0ZU5hbWUgKSB7XHJcblx0XHRcdHN0YXRlc1sgc3RhdGVOYW1lIF0gPSB0cnVlO1xyXG5cdFx0XHR0aGlzLnN0YXRlLmN1cnJlbnQgPSB0aGlzRW50cnlOYW1lO1xyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGdldEN1cnJlbnRTdGF0ZSgpIHtcclxuXHRyZXR1cm4gdGhpcy5zdGF0ZS5jdXJyZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVSZW5kZXJDb25maWcoKSB7XHJcblx0dGhpcy5yZW5kZXJDb25maWcuY3VyckhlYWQgKz0gdGhpcy5yZW5kZXJDb25maWcuc2VnbWVudHNQZXJGcmFtZTtcclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlnaHRuaW5nUGFyZW50KCBvcHRzLCBhcnIgKSB7XHJcblxyXG5cdGxldCBsSW5zdGFuY2UgPSB7XHJcblx0XHRzcGVlZDogb3B0cy5zcGVlZCB8fCAxLFxyXG5cdFx0aXNEcmF3bjogZmFsc2UsXHJcblx0XHRpc0FuaW1hdGVkOiBvcHRzLmlzQW5pbWF0ZWQgfHwgZmFsc2UsXHJcblx0XHR3aWxsQ29ubmVjdDogb3B0cy53aWxsQ29ubmVjdCB8fCBmYWxzZSxcclxuXHRcdHNreUZsYXNoQWxwaGE6IG9wdHMuc2t5Rmxhc2hBbHBoYSB8fCAwLjIsXHJcblx0XHRvcmlnaW5GbGFzaEFscGhhOiBvcHRzLm9yaWdpbkZsYXNoQWxwaGEgfHwgMSxcclxuXHRcdGdsb3dCbHVySXRlcmF0aW9uczogY3JlYXRlQmx1ckFycmF5KFxyXG5cdFx0XHRtYXRoVXRpbHMucmFuZG9tSW50ZWdlciggMiwgNiApLFxyXG5cdFx0XHQzMCxcclxuXHRcdFx0MTAwLFxyXG5cdFx0XHQnbGluZWFyRWFzZSdcclxuXHRcdCksXHJcblx0XHRjbG9jazogMCxcclxuXHRcdHRvdGFsQ2xvY2s6IG9wdHMud2lsbENvbm5lY3QgPyBtYXRoVXRpbHMucmFuZG9tSW50ZWdlciggMTAsIDYwICkgOiAwLFxyXG5cdFx0c3RhdGU6IHtcclxuXHRcdFx0Y3VycmVudDogJ2lzVW5pbml0aWFsaXNlZCcsXHJcblx0XHRcdHN0YXRlczoge1xyXG5cdFx0XHRcdGlzVW5pbml0aWFsaXNlZDogdHJ1ZSxcclxuXHRcdFx0XHRpc0luaXRpYWxpc2VkOiBmYWxzZSxcclxuXHRcdFx0XHRpc0FjdGl2ZTogZmFsc2UsXHJcblx0XHRcdFx0aXNEcmF3aW5nOiBmYWxzZSxcclxuXHRcdFx0XHRpc0RyYXduOiBmYWxzZSxcclxuXHRcdFx0XHRpc0Nvbm5lY3RlZDogZmFsc2UsXHJcblx0XHRcdFx0aXNSZWRyYXdpbmc6IGZhbHNlLFxyXG5cdFx0XHRcdGlzQW5pbWF0aW5nOiBmYWxzZSxcclxuXHRcdFx0XHRpc0ZpZWxkRWZmZWN0OiBmYWxzZSxcclxuXHRcdFx0XHRpc0NvdW50ZG93bjogZmFsc2UsXHJcblx0XHRcdFx0aXNDb3VudGRvd25Db21wbGV0ZTogZmFsc2UsXHJcblx0XHRcdFx0aXNDb21wbGV0ZTogZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGFjdGlvbnM6IHtcclxuXHJcblx0XHR9LFxyXG5cdFx0c3RhdGVBY3Rpb25zOiB7XHJcblx0XHRcdGlzQ29ubmVjdGVkOiB7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRzZXRTdGF0ZTogc2V0U3RhdGUsXHJcblx0XHRnZXRDdXJyZW50U3RhdGU6IGdldEN1cnJlbnRTdGF0ZSxcclxuXHRcdHJlbmRlckNvbmZpZzoge1xyXG5cdFx0XHRjdXJySGVhZDogMCxcclxuXHRcdFx0c2VnbWVudHNQZXJGcmFtZTogb3B0cy5zcGVlZCB8fCAxXHJcblx0XHR9LFxyXG5cdFx0dXBkYXRlUmVuZGVyQ29uZmlnOiB1cGRhdGVSZW5kZXJDb25maWcsXHJcblx0XHRwYXRoczogb3B0cy50ZW1wUGF0aHMgfHwgW11cclxuXHR9O1xyXG5cclxuXHRhcnIucHVzaCggbEluc3RhbmNlICk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVMaWdodG5pbmdQYXJlbnQgPSBjcmVhdGVMaWdodG5pbmdQYXJlbnQ7XHJcbiIsImxldCBnbG9iYWxDb25maWcgPSByZXF1aXJlKCAnLi9nbG9iYWxDb25maWcuanMnICk7XHJcbmxldCBjcmVhdGlvbkNvbmZpZyA9IHJlcXVpcmUoICcuL2NyZWF0aW9uQ29uZmlnLmpzJyApO1xyXG5sZXQgcmVuZGVyQ29uZmlnID0gcmVxdWlyZSggJy4vcmVuZGVyQ29uZmlnLmpzJyApO1xyXG5sZXQgbE1nckNsb2NrID0gcmVxdWlyZSggJy4vbE1nckNsb2NrLmpzJyApO1xyXG5sZXQgc2V0R2xvYmFsSW50ZXJ2YWwgPSByZXF1aXJlKCAnLi9zZXRHbG9iYWxJbnRlcnZhbC5qcycgKTtcclxubGV0IHNldExvY2FsQ2xvY2tUYXJnZXQgPSByZXF1aXJlKCAnLi9zZXRMb2NhbENsb2NrVGFyZ2V0LmpzJyApO1xyXG5sZXQgY3JlYXRlTGlnaHRuaW5nID0gcmVxdWlyZSggJy4vY3JlYXRlTGlnaHRuaW5nLmpzJyApO1xyXG5sZXQgY2xlYXJNZW1iZXJBcnJheSA9IHJlcXVpcmUoICcuL2NsZWFyTWVtYmVyQXJyYXkuanMnICk7XHJcbmxldCBzZXRDYW52YXNEZXRhaWxzID0gcmVxdWlyZSggJy4vc2V0Q2FudmFzRGV0YWlscy5qcycgKTtcclxubGV0IHVwZGF0ZSA9IHJlcXVpcmUoICcuL3VwZGF0ZUFyci5qcycgKTtcclxubGV0IHVwZGF0ZVJlbmRlckNmZyA9IHJlcXVpcmUoICcuL3VwZGF0ZVJlbmRlckNmZy5qcycgKTtcclxubGV0IGRyYXdEZWJ1Z1JhZGlhbFRlc3QgPSByZXF1aXJlKCAnLi9kcmF3RGVidWdSYWRpYWxUZXN0LmpzJyApO1xyXG5sZXQgZHJhd0RlYnVnTGluZXMgPSByZXF1aXJlKCAnLi9kcmF3RGVidWdMaW5lcy5qcycgKTtcclxubGV0IFNpbXBsZXhOb2lzZSA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9zaW1wbGV4LW5vaXNlLW5ldy5qcycgKTtcclxuXHJcbmxldCBsaWdudG5pbmdNZ3IgPSB7XHJcblx0bWVtYmVyczogW10sXHJcblx0ZGVidWdNZW1iZXJzOiBbXSxcclxuXHRjYW52YXNDZmc6IHt9LFxyXG5cdG5vaXNlRmllbGQ6IG5ldyBTaW1wbGV4Tm9pc2UoKSxcclxuXHRub2lzZUNsb2NrOiAwLFxyXG5cdHNldENhbnZhc0NmZzogc2V0Q2FudmFzRGV0YWlscyxcclxuXHRnbG9iYWxDb25maWc6Z2xvYmFsQ29uZmlnLFxyXG5cdGNyZWF0aW9uQ29uZmlnOiBjcmVhdGlvbkNvbmZpZyxcclxuXHRyZW5kZXJDb25maWc6IHJlbmRlckNvbmZpZyxcclxuXHRjbG9jazogbE1nckNsb2NrLFxyXG5cdGNsZWFyTWVtYmVyQXJyYXk6IGNsZWFyTWVtYmVyQXJyYXksXHJcblx0c2V0TG9jYWxDbG9ja1RhcmdldDogc2V0TG9jYWxDbG9ja1RhcmdldCxcclxuXHRzZXRHbG9iYWxJbnRlcnZhbDogc2V0R2xvYmFsSW50ZXJ2YWwsXHJcblx0Y3JlYXRlTGlnaHRuaW5nOiBjcmVhdGVMaWdodG5pbmcsXHJcblx0dXBkYXRlOiB1cGRhdGUsXHJcblx0dXBkYXRlUmVuZGVyQ2ZnOiB1cGRhdGVSZW5kZXJDZmcsXHJcblx0ZHJhd0RlYnVnUmFkaWFsVGVzdDogZHJhd0RlYnVnUmFkaWFsVGVzdCxcclxuXHRkcmF3RGVidWdMaW5lczogZHJhd0RlYnVnTGluZXNcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaWdudG5pbmdNZ3I7IiwibGV0IG1hdGhVdGlscyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9tYXRoVXRpbHMuanMnICk7XHJcbmxldCBsaWdodG5pbmdTdHJpa2VUaW1lTWF4ID0gMzAwO1xyXG5sZXQgc3RyaWtlRHJhd1RpbWUgPSBsaWdodG5pbmdTdHJpa2VUaW1lTWF4IC8gMjtcclxubGV0IHN0cmlrZUZpcmVUaW1lID0gbGlnaHRuaW5nU3RyaWtlVGltZU1heCAvIDY7XHJcbmxldCBzdHJpa2VDb29sVGltZSA9IGxpZ2h0bmluZ1N0cmlrZVRpbWVNYXggLyAzO1xyXG5cclxuY29uc3QgcmVuZGVyQ29uZmlnID0ge1xyXG5cdGJsdXJJdGVyYXRpb25zOiBtYXRoVXRpbHMucmFuZG9tSW50ZWdlciggNSwgOCApLFxyXG5cdGJsdXJSZW5kZXJPZmZzZXQ6IDEwMDAwLFxyXG5cdGN1cnJIZWFkOiAwLFxyXG5cdHRpbWluZzoge1xyXG5cdFx0bWF4OiBsaWdodG5pbmdTdHJpa2VUaW1lTWF4LFxyXG5cdFx0ZHJhdzogc3RyaWtlRHJhd1RpbWUsXHJcblx0XHRmaXJlOiBzdHJpa2VGaXJlVGltZSxcclxuXHRcdGNvb2w6IHN0cmlrZUNvb2xUaW1lLFxyXG5cdFx0c2VnbWVudHNQZXJGcmFtZTogMVxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJDb25maWc7IiwiZnVuY3Rpb24gc2V0Q2FudmFzRGV0YWlscyggY2FudmFzSWQgKSB7XHJcblx0bGV0IGNhbnZhc0luc3RhbmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggY2FudmFzSWQgKTtcclxuXHRsZXQgY3R4ID0gY2FudmFzSW5zdGFuY2UuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHRsZXQgY1cgPSBjYW52YXNJbnN0YW5jZS53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cdGxldCBjSCA9IGNhbnZhc0luc3RhbmNlLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcblx0dGhpcy5jYW52YXNDZmcuY2FudmFzID0gY2FudmFzSW5zdGFuY2U7XHJcblx0dGhpcy5jYW52YXNDZmcuYyA9IGN0eDtcclxuXHR0aGlzLmNhbnZhc0NmZy5jVyA9IGNXO1xyXG5cdHRoaXMuY2FudmFzQ2ZnLmNIID0gY0g7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2V0Q2FudmFzRGV0YWlsczsiLCJsZXQgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL21hdGhVdGlscy5qcycgKTtcclxuXHJcbmZ1bmN0aW9uIHNldEdsb2JhbEludGVydmFsKCkge1xyXG5cdHRoaXMuZ2xvYmFsQ29uZmlnLmludGVydmFsQ3VycmVudCA9IG1hdGhVdGlscy5yYW5kb20oXHJcblx0XHR0aGlzLmdsb2JhbENvbmZpZyxpbnRlcnZhbE1pbixcclxuXHRcdHRoaXMuZ2xvYmFsQ29uZmlnLGludGVydmFsTWF4XHJcblx0XHQpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNldEdsb2JhbEludGVydmFsOyIsImZ1bmN0aW9uIHNldExvY2FsQ2xvY2tUYXJnZXQoIHRhcmdldCApIHtcclxuXHRcdGlmKCB0YXJnZXQgKSB7XHJcblx0XHRcdHRoaXMuY2xvY2subG9jYWwudGFyZ2V0ID0gdGFyZ2V0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5jbG9jay5sb2NhbC50YXJnZXQgPSB0aGlzLmdsb2JhbENvbmZpZy5pbnRlcnZhbEN1cnJlbnQ7XHJcblx0XHR9XHJcblx0fVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXRMb2NhbENsb2NrVGFyZ2V0OyIsImxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlKCBjICl7XHJcblx0bGV0IHJlbmRlckNmZyA9IHRoaXMucmVuZGVyQ29uZmlnO1xyXG5cdGxldCBtTGVuID0gdGhpcy5tZW1iZXJzLmxlbmd0aDtcclxuXHRjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdsaWdodGVyJztcclxuXHJcblx0Zm9yKCBsZXQgaSA9IDA7IGkgPCBtTGVuOyBpKysgKSB7XHJcblx0XHRsZXQgbSA9IHRoaXMubWVtYmVyc1sgaSBdO1xyXG5cclxuXHRcdGlmICggbSAhPT0gdW5kZWZpbmVkICkge1xyXG5cclxuXHRcdFx0bGV0IG1TdGF0ZSA9IG0uc3RhdGUuc3RhdGVzO1xyXG5cdFx0XHRsZXQgY3VyclN0YXRlID0gbS5nZXRDdXJyZW50U3RhdGUoKTtcclxuXHJcblx0XHRcdGlmKCBjdXJyU3RhdGUgPT09ICdpc0NvdW50ZG93bicgKSB7XHJcblx0XHRcdFx0bGV0IG1DbG9jayA9IG0uY2xvY2s7XHJcblx0XHRcdFx0bGV0IG1Ub3RhbENsb2NrID0gbS50b3RhbENsb2NrO1xyXG5cdFx0XHRcdGlmICggbUNsb2NrIDwgbVRvdGFsQ2xvY2sgKSB7XHJcblx0XHRcdFx0XHRtLmNsb2NrKys7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG0uY2xvY2sgPSAwO1xyXG5cdFx0XHRcdFx0aWYgKCBtU3RhdGUuaXNDb21wbGV0ZSA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHRcdG0udG90YWxDbG9jayA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCAxMCwgNTAgKTtcclxuXHRcdFx0XHRcdFx0bS5zZXRTdGF0ZSggJ2lzQ291bnRkb3duJyApO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bS5zZXRTdGF0ZSggJ2lzQ291bnRkb3duQ29tcGxldGUnICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIG1TdGF0ZS5pc0RyYXduID09PSB0cnVlICYmIG0ud2lsbENvbm5lY3QgPT09IHRydWUgKSB7XHJcblx0XHRcdFx0aWYgKCBtU3RhdGUuaXNDb25uZWN0ZWQgPT09IGZhbHNlICkge1xyXG5cdFx0XHRcdFx0bS5zZXRTdGF0ZSggJ2lzQ29ubmVjdGVkJyApO1xyXG5cdFx0XHRcdFx0bS5zZXRTdGF0ZSggJ2lzRmllbGRFZmZlY3QnICk7XHJcblx0XHRcdFx0XHRtLnNldFN0YXRlKCAnaXNDb3VudGRvd24nICk7XHJcblx0XHRcdFx0XHRtLnRvdGFsQ2xvY2sgPSBtYXRoVXRpbHMucmFuZG9tSW50ZWdlciggMTAsIDUwICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtLnVwZGF0ZVJlbmRlckNvbmZpZygpO1xyXG5cdFx0XHRmb3IoIGxldCBqID0gMDsgaiA8IG0ucGF0aHMubGVuZ3RoOyBqKysgKSB7XHJcblx0XHRcdFx0bGV0IHRoaXNQYXRoQ2ZnID0gbS5wYXRoc1sgaiBdO1xyXG5cdFx0XHRcdGlmICggdGhpc1BhdGhDZmcuaXNDaGlsZCA9PT0gZmFsc2UgJiYgdGhpc1BhdGhDZmcuaXNBY3RpdmUgPT09IGZhbHNlICkge1xyXG5cdFx0XHRcdFx0dGhpcy5tZW1iZXJzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRcdGktLTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzUGF0aENmZy5yZW5kZXIoIGMsIG0sIHRoaXMgKS51cGRhdGUoIG0sIHRoaXMgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR9XHJcblx0fVxyXG5cdGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGU7IiwiZnVuY3Rpb24gdXBkYXRlUmVuZGVyQ2ZnKCkge1xyXG5cdFx0bGV0IG1lbWJlcnMgPSB0aGlzLm1lbWJlcnM7XHJcblx0XHRsZXQgbWVtTGVuID0gbWVtYmVycy5sZW5ndGg7XHJcblx0XHRmb3IoIGxldCBpID0gMDsgaSA8PSBtZW1MZW4gLSAxOyBpKysgKSB7XHJcblx0XHRcdG1lbWJlcnNbIGkgXS51cGRhdGVSZW5kZXJDb25maWcoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVwZGF0ZVJlbmRlckNmZzsiLCIvKipcclxuKiBAbmFtZSBjYWxjdWxhdGVTdWJEUmF0ZVxyXG4qIEBkZXNjcmlwdGlvbiBHaXZlbiBhIHtsZW5ndGh9IGRpc3RhbmNlIG9mIGEgcGF0aCwgYSBtYXhpbXVtIGFsbG93ZWQgZGlzdGFuY2Uge3RhcmdldExlbmd0aH0gYW5kIGEgbWF4aW11bSBzdWJkaXZpc2lvbiBsZXZlbCB7c3ViRFJhdGV9IHJldHVybiBhIHN1YmRpdmlzaW9uIGxldmVsIGZvciB0aGUgZGlzdGFuY2UgbGVuZ3RoIG9mIHRoZSBwYXRoLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSB0aGUgbGVuZ3RoIG9mIHRoZSBwYXRoLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0YXJnZXRMZW5ndGggLSB0aGUgbWF4aW11bSAoY2xhbXBlZCkgdmFsdWUgYSBwYXRoIGNhbiBiZS5cclxuKiBAcGFyYW0ge251bWJlcn0gc3ViRFJhdGUgLSB0aGUgbWF4aW11bSBzdWJkaXZpb24gbGV2ZWxzIGF0IHRoZSB0YXJnZXRMZW5ndGguXHJcbiogQHJldHVybnMge251bWJlcn0gdGhlIGNhbGN1bGF0ZWQgc3ViZGl2aXNpb24gbGV2ZWxzIGZvciB0aGUgcGF0aC5cclxuICovXHJcblxyXG5mdW5jdGlvbiBjYWxjdWxhdGVTdWJEUmF0ZSggbGVuZ3RoLCB0YXJnZXRMZW5ndGgsIHN1YkRSYXRlICkge1xyXG5cdGxldCBsRGl2ID0gdGFyZ2V0TGVuZ3RoIC8gbGVuZ3RoO1xyXG5cdGxldCBsRGl2Q2FsYyA9IHN1YkRSYXRlIC0gTWF0aC5mbG9vciggbERpdiApO1xyXG5cdGlmICggbERpdkNhbGMgPD0gMSApIHJldHVybiAxO1xyXG5cdGlmICggbERpdiA+IDIgKSByZXR1cm4gbERpdkNhbGM7XHJcblx0cmV0dXJuIHN1YkRSYXRlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNhbGN1bGF0ZVN1YkRSYXRlOyIsImxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5sZXQgZWFzaW5nID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL2Vhc2luZy5qcycgKS5lYXNpbmdFcXVhdGlvbnM7XHJcbmxldCB0cmlnID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL3RyaWdvbm9taWNVdGlscy5qcycgKS50cmlnb25vbWljVXRpbHM7XHJcblxyXG5mdW5jdGlvbiBjaGVja1BvaW50SW5kZXgoIGksIGxlbiApIHtcclxuXHRyZXR1cm4gaSA9PT0gMCA/IDEgOiBpID09PSBsZW4gLSAxID8gbGVuIC0gMiA6IGk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVBhdGhDb25maWcoIHRoaXNQYXRoLCBvcHRpb25zICkge1xyXG5cdGxldCB0aGlzUGF0aENmZyA9IHRoaXNQYXRoO1xyXG5cdGxldCBwID0gdGhpc1BhdGhDZmcucGF0aDtcclxuXHRsZXQgcExlbiA9IHAubGVuZ3RoO1xyXG5cclxuXHRsZXQgb3B0cyA9IG9wdGlvbnM7XHJcblx0bGV0IHBhdGhJbmRleCA9IG9wdHMucGF0aEluZGV4O1xyXG5cdGxldCBwYXRoQW5nbGVTcHJlYWQgPSBvcHRzLnBhdGhBbmdsZVNwcmVhZCB8fCAwLjI7XHJcblx0bGV0IGJyYW5jaERlcHRoID0gb3B0cy5icmFuY2hEZXB0aCB8fCAwO1xyXG5cclxuXHQvLyBzZXR1cCBzb21lIHZhcnMgdG8gcGxheSB3aXRoXHJcblx0bGV0IHBJbmRleCwgcDEsIHAyLCBwMywgcDQsIHRoZXRhLCByT2Zmc2V0O1xyXG5cdC8vIGFuZ2xlIHZhcmlhdGlvbiByYW5kb21pc2VyXHJcblx0bGV0IHYgPSAoIDIgKiBNYXRoLlBJICkgKiBwYXRoQW5nbGVTcHJlYWQ7XHJcblxyXG5cdC8vIGlmIHBhdGggaXMgb25seSBzdGFydC9lbmQgcG9pbnRzXHJcblx0aWYgKCBwTGVuID09PSAyICkge1xyXG5cdFx0Y29uc29sZS5sb2coIGBwTGVuID09PSAyYCApO1xyXG5cdFx0cDEgPSBwWyAwIF07XHJcblx0XHRwMyA9IHBbIDEgXTtcclxuXHRcdHAyID0gdHJpZy5zdWJkaXZpZGUocDEueCwgcDEueSwgcDMueCwgcDMueSwgMC41KTtcclxuXHRcdHJPZmZzZXQgPSB0aGlzUGF0aENmZy5yZW5kZXJPZmZzZXQgKyAxO1xyXG5cdH1cclxuXHRpZiAoIHBMZW4gPiAyICkge1xyXG5cdFx0cEluZGV4ID0gY2hlY2tQb2ludEluZGV4KCBtYXRoVXRpbHMucmFuZG9tSW50ZWdlciggMCwgcExlbiAtIDEgKSwgcExlbiApO1xyXG5cdFx0cDEgPSBwWyBwSW5kZXggLSAxIF07XHJcblx0XHRwMiA9IHBbIHBJbmRleCBdO1xyXG5cdFx0cDMgPSBwWyBwSW5kZXggKyAxIF07XHJcblx0XHRyT2Zmc2V0ID0gdGhpc1BhdGhDZmcucmVuZGVyT2Zmc2V0ICsgcEluZGV4O1xyXG5cdH1cclxuXHJcblx0dGhldGEgPSB0aGlzUGF0aENmZy5iYXNlQW5nbGUgKyBtYXRoVXRpbHMucmFuZG9tKCAtdiwgdiApO1xyXG5cdGxldCBtYXhEID0gdHJpZy5kaXN0KCBwMi54LCBwMi55LCBwWyBwTGVuIC0gMV0ueCwgcFsgcExlbiAtIDEgXS55KTtcclxuXHRcclxuXHRsZXQgZFZhciA9IG1hdGhVdGlscy5yYW5kb20oIDAsIG1heEQgKTtcclxuXHQvLyBjb25zb2xlLmxvZyggJ3JhbmRUaGV0YTogJywgcmFuZFRoZXRhICk7XHJcblx0bGV0IGJyYW5jaEVuZHBvaW50ID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oIHAyLngsIHAyLnksIGRWYXIsIHRoZXRhICk7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRicmFuY2hEZXB0aDogYnJhbmNoRGVwdGgsXHJcblx0XHRyZW5kZXJPZmZzZXQ6IHJPZmZzZXQsXHJcblx0XHRzdGFydFg6IHAyLngsXHJcblx0XHRzdGFydFk6IHAyLnksXHJcblx0XHRlbmRYOiBicmFuY2hFbmRwb2ludC54LFxyXG5cdFx0ZW5kWTogYnJhbmNoRW5kcG9pbnQueSxcclxuXHRcdGRSYW5nZTogZFZhclxyXG5cdH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUGF0aENvbmZpZzsiLCJyZXF1aXJlKCcuLi8uLi90eXBlRGVmcycpO1xyXG4vKipcclxuQHR5cGVkZWYge2ltcG9ydChcIi4uLy4uL3R5cGVEZWZzXCIpLnBhdGhPYmplY3R9IHBhdGhPYmplY3RcclxuQHR5cGVkZWYge2ltcG9ydChcIi4uLy4uL3R5cGVEZWZzXCIpLmNyZWF0ZVBhdGhPcHRpb25zfSBjcmVhdGVQYXRoT3B0aW9uc1xyXG5AdHlwZWRlZiB7aW1wb3J0KFwiLi4vLi4vdHlwZURlZnNcIikuUG9pbnR9IFBvaW50XHJcbiovXHJcblxyXG5jb25zdCB0cmlnID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL3RyaWdvbm9taWNVdGlscy5qcycgKS50cmlnb25vbWljVXRpbHM7XHJcbmNvbnN0IHBsb3RQYXRoUG9pbnRzID0gcmVxdWlyZSggJy4vcGxvdFBhdGhQb2ludHMuanMnICk7XHJcbmNvbnN0IGRyYXdQYXRocyA9IHJlcXVpcmUoICcuL2RyYXdQYXRoLmpzJyApO1xyXG5jb25zdCByZWRyYXdQYXRoID0gcmVxdWlyZSggJy4vcmVkcmF3UGF0aHMuanMnICk7XHJcbmNvbnN0IHVwZGF0ZVBhdGggPSByZXF1aXJlKCAnLi91cGRhdGVQYXRoLmpzJyApO1xyXG5jb25zdCByZW5kZXJQYXRoID0gcmVxdWlyZSggJy4vcmVuZGVyUGF0aC5qcycgKTtcclxuY29uc3QgbWFpblBhdGhBbmltU2VxdWVuY2UgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL21haW5QYXRoQW5pbVNlcXVlbmNlLmpzYCApO1xyXG5jb25zdCBzdGFydFNlcXVlbmNlID0gcmVxdWlyZSggYC4uL3NlcXVlbmNlci9zdGFydFNlcXVlbmNlLmpzYCApO1xyXG5jb25zdCB1cGRhdGVTZXF1ZW5jZUNsb2NrID0gcmVxdWlyZSggYC4uL3NlcXVlbmNlci91cGRhdGVTZXF1ZW5jZUNsb2NrLmpzYCApO1xyXG5jb25zdCB1cGRhdGVTZXF1ZW5jZSA9IHJlcXVpcmUoIGAuLi9zZXF1ZW5jZXIvdXBkYXRlU2VxdWVuY2UuanNgICk7XHJcbmNvbnN0IHNldHVwU2VxdWVuY2VzID0gcmVxdWlyZSggYC4uL3NlcXVlbmNlci9zZXR1cFNlcXVlbmNlcy5qc2AgKTtcclxuXHJcbi8qKlxyXG4qIGNyZWF0ZVBhdGhGcm9tT3B0aW9uc1xyXG4qIEBkZXNjcmlwdGlvbiBjcmVhdGUgcGF0aCBvYmplY3QgZnJvbSBwcm92aWRlIG9wdGlvbnMge29wdHN9LlxyXG4qIEBzZWUge0BsaW5rIGNyZWF0ZVBhdGhPcHRpb25zfSBmb3IgY29uc3RydWN0b3Igb3B0aW9uc1xyXG4qIEBzZWUge0BsaW5rIHBhdGhPYmplY3R9IGZvciBmdW5jdGlvbiByZXR1cm4gb2JqZWN0IG1lbWJlcnNcclxuKiBAcGFyYW0gey4uLmNyZWF0ZVBhdGhPcHRpb25zfSBvcHRzIC0gdGhlIGNvbnN0cnVjdG9yIG9wdGlvbnMgYW5kIHBhcmVtZXRlcnMgZm9yIHRoZSBwYXRoLlxyXG4qIEByZXR1cm5zIHtwYXRoT2JqZWN0fSAtIHRoZSBjYWxjdWxhdGVkIHBhdGggb2JqZWN0IGNvbnRhaW5pbmcgcGFyYW1ldGVycywgZmxhZ3MsIHBhdGggY29vcmRpbmF0ZSBhcnJheXMgYW5kIGNvbnN0cnVjdGVkIHBhdGgyZCgpIHByaW1pdGl2ZXMuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQYXRoRnJvbU9wdGlvbnMoIG9wdHMgKSB7XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBuYW1lIG5ld1BhdGhcclxuXHQgKiBAbWVtYmVyb2YgY3JlYXRlUGF0aEZyb21PcHRpb25zXHJcblx0ICogQHR5cGUge0FycmF5PFBvaW50Pn1cclxuXHQgKiBAc3RhdGljXHJcblx0ICogQGRlc2NyaXB0aW9uIEFycmF5IG9mIHtAbGluayBQb2ludHxQb2ludHN9IGNyZWF0ZWQgYnkgdGhlIHtAbGluayBwbG90UGF0aFBvaW50c30gZnVuY3Rpb24gZnJvbSBvcHRpb25zIHN1cHBsaWVkIGluIHRoZSBwYXJlbnQgZnVuY3Rpb24ncyB7b3B0c30gcGFyYW1ldGVyc1xyXG5cdCovXHJcblxyXG5cdGxldCBfbmV3UGF0aCA9IHBsb3RQYXRoUG9pbnRzKHtcclxuXHRcdHN0YXJ0WDogb3B0cy5zdGFydFgsXHJcblx0XHRzdGFydFk6IG9wdHMuc3RhcnRZLFxyXG5cdFx0ZW5kWDogb3B0cy5lbmRYLFxyXG5cdFx0ZW5kWTogb3B0cy5lbmRZLFxyXG5cdFx0c3ViZGl2aXNpb25zOiBvcHRzLnN1YmRpdmlzaW9ucywgXHJcblx0XHRpc0NoaWxkOiBvcHRzLmlzQ2hpbGRcclxuXHR9KTtcclxuXHJcblx0bGV0IGNob3NlblNlcXVlbmNlID0gb3B0cy5zZXF1ZW5jZXMgfHwgbWFpblBhdGhBbmltU2VxdWVuY2U7XHJcblx0bGV0IHRoaXNTZXF1ZW5jZXMgPSBzZXR1cFNlcXVlbmNlcyggY2hvc2VuU2VxdWVuY2UgKTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdC8vIGZsYWdzXHJcblx0XHRpc0NoaWxkOiBvcHRzLmlzQ2hpbGQgfHwgZmFsc2UsXHJcblx0XHRpc0FjdGl2ZTogb3B0cy5pc0FjdGl2ZSB8fCBmYWxzZSxcclxuXHRcdGlzUmVuZGVyaW5nOiBvcHRzLmlzUmVuZGVyaW5nIHx8IGZhbHNlLFxyXG5cdFx0d2lsbFN0cmlrZTogb3B0cy53aWxsU3RyaWtlIHx8IGZhbHNlLFxyXG5cdFx0Ly8gY29uZmlnXHJcblx0XHRicmFuY2hEZXB0aDogb3B0cy5icmFuY2hEZXB0aCB8fCAwLFxyXG5cdFx0Ly8gY29tcHV0ZWQgY29uZmlnXHJcblx0XHRiYXNlQW5nbGU6IHRyaWcuYW5nbGUoIG9wdHMuc3RhcnRYLCBvcHRzLnN0YXJ0WSwgb3B0cy5lbmRYLCBvcHRzLmVuZFkgKSxcclxuXHRcdGJhc2VEaXN0OiB0cmlnLmRpc3QoIG9wdHMuc3RhcnRYLCBvcHRzLnN0YXJ0WSwgb3B0cy5lbmRYLCBvcHRzLmVuZFkgKSxcclxuXHRcdC8vIGNvbG9yc1xyXG5cdFx0Y29sUjogb3B0cy5wYXRoQ29sUiB8fCAyNTUsXHJcblx0XHRjb2xHOiBvcHRzLnBhdGhDb2xHIHx8IDI1NSxcclxuXHRcdGNvbEI6IG9wdHMucGF0aENvbEIgfHwgMjU1LFxyXG5cdFx0Y29sQTogb3B0cy5pc0NoaWxkID8gMC41IDogb3B0cy5wYXRoQ29sQSA/IG9wdHMucGF0aENvbEEgOiAxLFxyXG5cdFx0Z2xvd0NvbFI6ICBvcHRzLmdsb3dDb2xSIHx8IDI1NSxcclxuXHRcdGdsb3dDb2xHOiAgb3B0cy5nbG93Q29sRyB8fCAyNTUsXHJcblx0XHRnbG93Q29sQjogIG9wdHMuZ2xvd0NvbEIgfHwgMjU1LFxyXG5cdFx0Z2xvd0NvbEE6ICBvcHRzLmdsb3dDb2xBIHx8IDEsXHJcblx0XHRsaW5lV2lkdGg6IDEsXHJcblx0XHQvLyBjbG9ja3NcclxuXHRcdGNsb2NrOiBvcHRzLmNsb2NrIHx8IDAsXHJcblx0XHRzZXF1ZW5jZUNsb2NrOiBvcHRzLnNlcXVlbmNlQ2xvY2sgfHwgMCxcclxuXHRcdHRvdGFsQ2xvY2s6IG9wdHMudG90YWxDbG9jayB8fCAwLFxyXG5cdFx0Ly8gYW5pbSBzZXF1ZW5jZXNcclxuXHRcdC8vIG1haW4gZHJhdyBzZXF1ZW5jZVxyXG5cdFx0ZHJhd1BhdGhTZXF1ZW5jZTogb3B0cy5pc0NoaWxkID8gZmFsc2UgOiB0cnVlLFxyXG5cdFx0Ly8gYWRkaXRpb25hbCBzZXF1ZW5jZXNcclxuXHRcdHNlcXVlbmNlczogdGhpc1NlcXVlbmNlcyxcclxuXHRcdHNlcXVlbmNlU3RhcnRJbmRleDogb3B0cy5zZXF1ZW5jZVN0YXJ0SW5kZXggfHwgMCxcclxuXHRcdHNlcXVlbmNlSW5kZXg6IG9wdHMuc2VxdWVuY2VJbmRleCB8fCAwLFxyXG5cdFx0cGxheVNlcXVlbmNlOiBmYWxzZSxcclxuXHRcdGN1cnJTZXF1ZW5jZTogZmFsc2UsXHJcblx0XHRzdGFydFNlcXVlbmNlOiBzdGFydFNlcXVlbmNlLFxyXG5cdFx0dXBkYXRlU2VxdWVuY2U6IHVwZGF0ZVNlcXVlbmNlLFxyXG5cdFx0dXBkYXRlU2VxdWVuY2VDbG9jazogdXBkYXRlU2VxdWVuY2VDbG9jayxcclxuXHRcdGRyYXdQYXRoczogZHJhd1BhdGhzLFxyXG5cdFx0cmVkcmF3UGF0aDogcmVkcmF3UGF0aCxcclxuXHRcdHVwZGF0ZTogdXBkYXRlUGF0aCxcclxuXHRcdHJlbmRlcjogcmVuZGVyUGF0aCxcclxuXHRcdC8vIHBhdGggcmVuZGVyaW5nIGZsYWdzXHJcblx0XHRyZW5kZXJPZmZzZXQ6IG9wdHMucmVuZGVyT2Zmc2V0IHx8IDAsXHJcblx0XHRjdXJySGVhZFBvaW50OiAwLFxyXG5cdFx0Ly8gdGhlIGFjdHVhbCBwYXRoXHJcblx0XHRwYXRoOiBfbmV3UGF0aCxcclxuXHRcdC8vIHNhdmVkIHBhdGhzXHJcblx0XHRzYXZlZFBhdGhzOiB7XHJcblx0XHRcdG1haW46IG5ldyBQYXRoMkQoKSxcclxuXHRcdFx0b2Zmc2V0OiBuZXcgUGF0aDJEKCksXHJcblx0XHRcdG9yaWdpblNob3J0OiBuZXcgUGF0aDJEKCksXHJcblx0XHRcdG9yaWdpbkxvbmc6IG5ldyBQYXRoMkQoKVxyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlUGF0aEZyb21PcHRpb25zOyIsIi8vIHdyYXAgaW4gY29uZGl0aW9uIHRvIGNoZWNrIGlmIGRyYXdpbmcgaXMgcmVxdWlyZWRcclxuY29uc3QgY2wgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvY2wuanMnICk7XHJcblxyXG5mdW5jdGlvbiBkcmF3UGF0aHMoIHJlbmRlckNmZywgcGFyZW50ICkge1xyXG5cdC8vIHBvaW50ZXJzXHJcblx0bGV0IHRoaXNDZmcgPSB0aGlzO1xyXG5cdGxldCB7IGN1cnJIZWFkOiBtYXN0ZXJIZWFkUG9pbnQsIHNlZ21lbnRzUGVyRnJhbWUgfSA9IHJlbmRlckNmZztcclxuXHRsZXQgeyBwYXRoOiBwYXRoQXJyLCBzYXZlZFBhdGhzLCByZW5kZXJPZmZzZXQ6IHBhdGhTdGFydFBvaW50LCBjdXJySGVhZFBvaW50OiBjdXJyZW50SGVhZFBvaW50IH0gPSB0aGlzQ2ZnO1xyXG5cdGxldCBwYXRoQXJyTGVuID0gcGF0aEFyci5sZW5ndGg7XHJcblx0bGV0IHN0YXJ0UG9pbnRJbmRleCA9IDA7XHJcblx0bGV0IGVuZFBvaW50SW5kZXggPSAwO1xyXG5cclxuXHQvLyBlYXJseSByZXR1cm4gb3V0IG9mIGZ1bmN0aW9uIGlmIHdlIGhhdmVuJ3QgcmVhY2hlZCB0aGUgcGF0aCBzdGFydCBwb2ludCB5ZXQgT1IgdGhlIGN1cnJlbnRIZWFkUG9pbnQgaXMgZ3JlYXRlciB0aGFuIHRoZSBwYXRoQXJyYXlMZW5ndGhcclxuXHRpZiAoIHBhdGhTdGFydFBvaW50ID4gbWFzdGVySGVhZFBvaW50ICkgcmV0dXJuO1xyXG5cclxuXHRpZiAoIGN1cnJlbnRIZWFkUG9pbnQgPj0gcGF0aEFyckxlbiApIHtcclxuXHRcdGlmICggdGhpc0NmZy5pc0NoaWxkID09PSBmYWxzZSApIHtcclxuXHRcdFx0cGFyZW50LmlzRHJhd24gPSB0cnVlO1xyXG5cdFx0XHRwYXJlbnQuc2V0U3RhdGUoICdpc0RyYXduJyApO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuOyBcclxuXHR9XHJcblxyXG5cdHN0YXJ0UG9pbnRJbmRleCA9IGN1cnJlbnRIZWFkUG9pbnQgPT09IDAgPyBjdXJyZW50SGVhZFBvaW50IDogY3VycmVudEhlYWRQb2ludDtcclxuXHRlbmRQb2ludEluZGV4ID0gTWF0aC5mbG9vciggY3VycmVudEhlYWRQb2ludCArIHNlZ21lbnRzUGVyRnJhbWUgPiBwYXRoQXJyTGVuID8gcGF0aEFyckxlbiA6IGN1cnJlbnRIZWFkUG9pbnQgKyBzZWdtZW50c1BlckZyYW1lICk7XHJcblxyXG5cdGZvciggbGV0IGkgPSBzdGFydFBvaW50SW5kZXg7IGkgPCBlbmRQb2ludEluZGV4OyBpKysgKSB7XHJcblx0XHRsZXQgcCA9IHBhdGhBcnJbIGkgXTtcclxuXHRcdGlmICggaSA9PT0gMCApIHtcclxuXHRcdFx0c2F2ZWRQYXRocy5tYWluLm1vdmVUbyggcC54LCBwLnkgKTtcclxuXHRcdFx0c2F2ZWRQYXRocy5vZmZzZXQubW92ZVRvKCBwLngsIHAueSAtIDEwMDAwICk7XHJcblx0XHRcdHNhdmVkUGF0aHMub3JpZ2luTG9uZy5tb3ZlVG8oIHAueCwgcC55IC0gMTAwMDAgKTtcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR9XHJcblx0XHRzYXZlZFBhdGhzLm1haW4ubGluZVRvKCBwLngsIHAueSApO1xyXG5cdFx0c2F2ZWRQYXRocy5vZmZzZXQubGluZVRvKCBwLngsIHAueSAtIDEwMDAwICk7XHJcblxyXG5cdFx0aWYgKCBpIDwgMjAgKSB7XHJcblx0XHRcdHNhdmVkUGF0aHMub3JpZ2luTG9uZy5saW5lVG8oIHAueCwgcC55IC0gMTAwMDAgKTtcclxuXHRcdH1cclxuXHR9XHJcblx0dGhpcy5jdXJySGVhZFBvaW50ID0gZW5kUG9pbnRJbmRleDtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZHJhd1BhdGhzOyIsImNvbnN0IGNsID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL2NsLmpzJyApO1xyXG5cclxubGV0IG1hdGhVdGlscyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9tYXRoVXRpbHMuanMnICk7XHJcbmxldCBlYXNpbmcgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvZWFzaW5nLmpzJyApLmVhc2luZ0VxdWF0aW9ucztcclxubGV0IHRyaWcgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvdHJpZ29ub21pY1V0aWxzLmpzJyApLnRyaWdvbm9taWNVdGlscztcclxuXHJcbi8vIGxpZ2h0bmluZyBwYXRoIGNvbnN0cnVjdG9yXHJcblxyXG5cclxuLyoqXHJcbiogQG5hbWUgcGxvdFBhdGhQb2ludHNcclxuKiBAZGVzY3JpcHRpb24gR2l2ZW4gYW4gb3JpZ2luIHBsb3QgYSBwYXRoLCByYW5kb21pc2VkIGFuZCBzdWJkaXZpZGVkLCB0byBhIHRhcmdldC4gVXNlZCwgcHJpbWFyaWx5LCBieSB0aGUge0BsaW5rIGNyZWF0ZVBhdGhGcm9tT3B0aW9uc3xjcmVhdGVQYXRoRnJvbU9wdGlvbnN9IGZ1bmN0aW9uIFxyXG4qIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gdGhlIGNvbnN0cnVjdG9yIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBvcHRpb25zLnN0YXJ0WCAtIHRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBhdGggc3RhcnQgcG9pbnQuXHJcbiogQHBhcmFtIHtudW1iZXJ9IG9wdGlvbnMuc3RhcnRZIC0gdGhlIFhZY29vcmRpbmF0ZSBvZiB0aGUgcGF0aCBzdGFydCBwb2ludC5cclxuKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5lbmRYIC0gdGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgcGF0aCBlbmQgcG9pbnQuXHJcbiogQHBhcmFtIHtudW1iZXJ9IG9wdGlvbnMuZW5kWSAtIHRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBhdGggZW5kIHBvaW50LlxyXG4qIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9ucy5pc0NoaWxkIC0gaXMgdGhpcyBwYXRoIGluc3RhbmNlIGEgY2hpbGQvc3VicGF0aCBvZiBhIHBhcmVudD8uXHJcbiogQHBhcmFtIHtudW1iZXJ9IG9wdGlvbnMuc3ViZGl2aXNpb25zIC0gdGhlIGxldmVsIG9mIHBhdGggc3ViZGl2aXNpb25zLlxyXG4qIEByZXR1cm5zIHthcnJheX0gdGhlIHBhdGggYXMgYSB2ZWN0b3IgY29vcmRpbmF0ZSBzZXQuXHJcbiAqL1xyXG5mdW5jdGlvbiBwbG90UGF0aFBvaW50cyggb3B0aW9ucyApIHtcclxuXHRcdFxyXG5cdGxldCBvcHRzID0gb3B0aW9ucztcclxuXHRsZXQgc3ViRCA9IG9wdHMuc3ViZGl2aXNpb25zO1xyXG5cdGxldCB0ZW1wID0gW107XHJcblxyXG5cdHRlbXAucHVzaCggeyB4OiBvcHRzLnN0YXJ0WCwgeTogb3B0cy5zdGFydFkgfSApO1xyXG5cdHRlbXAucHVzaCggeyB4OiBvcHRzLmVuZFgsIHk6IG9wdHMuZW5kWSB9ICk7XHJcblxyXG5cdGxldCB0UmFuZ2UgPSBvcHRzLnRSYW5nZSB8fCAwLjM1O1xyXG5cdGxldCBpc0NoaWxkID0gb3B0cy5pc0NoaWxkIHx8IHRydWU7XHJcblx0bGV0IHZDaGlsZCA9IGlzQ2hpbGQgPyA4IDogMjtcclxuXHJcblx0Ly8gc2V0IHVwIHNvbWUgdmFycyB0byBwbGF5IHdpdGhcclxuXHRsZXQgbWluRCwgbWF4RCwgY2FsY0Q7XHJcblxyXG5cdGZvciAoIGxldCBpID0gMDsgaSA8PSBzdWJEIC0gMTsgaSsrICkge1xyXG5cdFx0bGV0IGFyckxlbiA9IHRlbXAubGVuZ3RoO1xyXG5cdFx0bGV0IGRhbXBlciA9IGkgPT09IDAgPyAxIDogaTtcclxuXHRcdGZvciAoIGxldCBqID0gYXJyTGVuIC0gMTsgaiA+IDA7IGotLSApIHtcclxuXHRcdFx0aWYgKCBqID09PSAwICkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgcCA9IHRlbXBbIGogXTtcclxuXHRcdFx0bGV0IHByZXZQID0gdGVtcFsgaiAtIDEgXTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIHNldCB1cCBzb21lIG51bWJlcnMgZm9yIG1ha2luZyB0aGUgcGF0aFxyXG5cdFx0XHQvLyBkaXN0YW5jZSBiZXR3ZWVuIHRoZSAyIHBvaW50c1xyXG5cdFx0XHRsZXQgdkQgPSB0cmlnLmRpc3QoIHAueCwgcC55LCBwcmV2UC54LCBwcmV2UC55ICkgLyAyO1xyXG5cdFx0XHQvLyByYW5kb20gcG9zaXRpdmUvbmVnYXRpdmUgbXVsdGlwbGllclxyXG5cdFx0XHRsZXQgdkZsaXAgPSAgbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoIDEsIDEwICkgPD0gNSA/IDEgOiAtMTtcclxuXHRcdFx0Ly8gZ2V0IHRoZSBtaWQgcG9pbnQgYmV3ZWVuIHRoZSB0d28gcG9pbnRzIChwICYgcHJldlApXHJcblx0XHRcdGxldCBuUCA9IHRyaWcuc3ViZGl2aWRlKCBwcmV2UC54LCBwcmV2UC55LCBwLngsIHAueSwgMC41ICk7XHJcblxyXG5cdFx0XHQvLyBjYWxjdWxhdGUgc29tZSBudW1iZXJzIGZvciByYW5kb20gZGlzdGFuY2VcclxuXHRcdFx0aWYgKCBpc0NoaWxkID09PSBmYWxzZSApIHtcclxuXHRcdFx0XHRtaW5EID0gZWFzaW5nLmVhc2VJblF1aW50KCBpLCB2RCAvIDIsIC0oIHZEIC8gMiApLCBzdWJEICk7XHJcblx0XHRcdFx0bWF4RCA9IGVhc2luZy5lYXNlSW5RdWludCggaSwgdkQsIC12RCwgc3ViRCApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG1pbkQgPSB2RCAvIDI7XHJcblx0XHRcdFx0bWF4RCA9IHZEIC8gdkNoaWxkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjYWxjRCA9IG1hdGhVdGlscy5yYW5kb20oIG1pbkQsIG1heEQgKSAqIHZGbGlwO1xyXG5cclxuXHRcdFx0Ly8gdXNpbmcgdGhlIDIgcG9pbnRzIChwICYgcHJldlApLCBhbmQgdGhlIGdlbmVyYXRlZCBtaWRwb2ludCBhcyBhIHBzZXVkbyBjdXJ2ZSBwb2ludFxyXG5cdFx0XHRsZXQgb2Zmc2V0UG9pbnQgPSB0cmlnLnByb2plY3ROb3JtYWxBdERpc3RhbmNlKFxyXG5cdFx0XHRcdC8vIC0gcHJvamVjdCBhIG5ldyBwb2ludCBhdCB0aGUgbm9ybWFsIG9mIHRoZSBwYXRoIGNyZWF0ZWQgYnkgcC9uUC9wcmV2UFxyXG5cdFx0XHRcdHByZXZQLCBuUCwgcCxcclxuXHRcdFx0XHQvLyBhdCBhIHJhbmRvbSBwb2ludCBhbG9uZyB0aGUgY3VydmUgKGJldHdlZW4gMC4yNS8wLjc1KVxyXG5cdFx0XHRcdG1hdGhVdGlscy5yYW5kb20oIDAuMjUsIDAuNzUgKSxcclxuXHRcdFx0XHQvLyAtIC0gcHJvamVjdGVkIGF0IGEgcHJvcG9ydGlvbiBvZiB0aGUgZGlzdGFuY2UgKHZEKVxyXG5cdFx0XHRcdC8vIC0gLSAtIGNhbGN1bGF0ZWQgdGhyb3VnaCB0aGUgdkNoaWxkIHZhcmlhYmxlIChkYW1wZWQgdGhyb3VnaCBhIHN3aXRjaCBnZW5lcmF0ZWQgdGhyb3VnaCB0aGUgaXNDaGlsZCBmbGFnKSBcclxuXHRcdFx0XHRjYWxjRFxyXG5cdFx0XHQpO1xyXG5cdFx0XHQvLyBzcGxpY2UgaW4gdGhlIG5ldyBwb2ludCB0byB0aGUgcG9pbnQgYXJyYXlcclxuXHRcdFx0dGVtcC5zcGxpY2UoIGosIDAsIHsgeDogb2Zmc2V0UG9pbnQueCwgeTogb2Zmc2V0UG9pbnQueSB9ICk7XHJcblx0XHRcdC8vIHJlY3Vyc2UgdGhlIGxvb3AgYnkgdGhlIG51bWJlciBnaXZlbiBieSBcInN1YkRcIiwgdG8gc3ViZGl2aW5kZSBhbmQgcmFuZG9taXNlIHRoZSBsaW5lXHJcblx0XHR9XHJcblx0fTtcclxuXHQvLyBjb25zb2xlLmxvZyggYCR7Y2wuZGltfSR7Y2wueX1wYXRoLmxlbmd0aDogJHtjbC5ibGR9JHtjbC5ifSR7dGVtcC5sZW5ndGh9JHtjbC5yc3R9YCApO1xyXG5cdHJldHVybiB0ZW1wO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwbG90UGF0aFBvaW50czsiLCJmdW5jdGlvbiByZWRyYXdQYXRoKCByZW5kZXJDZmcsIHBhcmVudCwgZ2xvYmFsQ29uZmlnICkge1xyXG5cclxuXHRsZXQgdGhpc0NmZyA9IHRoaXM7XHJcblx0bGV0IHsgcGF0aDogcGF0aEFyciwgc2F2ZWRQYXRocywgcmVuZGVyT2Zmc2V0OiBwYXRoU3RhcnRQb2ludCwgaXNDaGlsZCB9ID0gdGhpc0NmZztcclxuXHRsZXQgcGF0aEFyckxlbiA9IHBhdGhBcnIubGVuZ3RoO1xyXG5cdGxldCBub2lzZUZpZWxkID0gZ2xvYmFsQ29uZmlnLm5vaXNlRmllbGQ7XHJcblx0bGV0IG5ld01haW5QYXRoID0gbmV3IFBhdGgyRCgpO1xyXG5cdGxldCBuZXdPZmZzZXRQYXRoID0gbmV3IFBhdGgyRCgpO1xyXG5cdGxldCBuZXdPcmlnaW5Mb25nUGF0aCA9IG5ldyBQYXRoMkQoKTtcclxuXHJcblx0Zm9yKCBsZXQgaSA9IDA7IGkgPCBwYXRoQXJyTGVuOyBpKysgKSB7XHJcblx0XHRsZXQgcCA9IHBhdGhBcnJbIGkgXTtcclxuXHRcdFxyXG5cdFx0bGV0IHQgPSAwO1xyXG5cdFx0XHJcblx0XHQvLyBtb2RpZnkgY29ycmRpbmF0ZXMgd2l0aCBmaWVsZCBlZmZlY3Q6XHJcblx0XHRsZXQgZmllbGRNb2RWYWwgPSBub2lzZUZpZWxkLm5vaXNlM0QoIHAueCwgcC55LCB0ICk7XHJcblx0XHRsZXQgeCA9IHAueCAqIGZpZWxkTW9kVmFsO1xyXG5cdFx0bGV0IHkgPSBwLnkgKiBmaWVsZE1vZFZhbDtcclxuXHJcblx0XHRpZiAoIGkgPT09IDAgKSB7XHJcblx0XHRcdG5ld01haW5QYXRoLm1vdmVUbyggeCwgeSApO1xyXG5cdFx0XHRuZXdPZmZzZXRQYXRoLm1vdmVUbyggeCwgeSAtIDEwMDAwICk7XHJcblx0XHRcdG5ld09yaWdpbkxvbmdQYXRoLm1vdmVUbyggeCwgeSAtIDEwMDAwICk7XHJcblx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0fVxyXG5cdFx0bmV3TWFpblBhdGgubGluZVRvKCB4LCB5ICk7XHJcblx0XHRuZXdPZmZzZXRQYXRoLmxpbmVUbyggeCwgeSAtIDEwMDAwICk7XHJcblxyXG5cdFx0aWYgKCBpIDwgMjAgKSB7XHJcblx0XHRcdG5ld09yaWdpbkxvbmdQYXRoLmxpbmVUbyggeCwgeSAtIDEwMDAwICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0aGlzQ2ZnLnNhdmVkUGF0aHMubWFpbiA9IG5ld01haW5QYXRoO1xyXG5cdHRoaXNDZmcuc2F2ZWRQYXRocy5vZmZzZXQgPSBuZXdPZmZzZXRQYXRoO1xyXG5cdHRoaXNDZmcuc2F2ZWRQYXRocy5vcmlnaW5Mb25nID0gbmV3T3JpZ2luTG9uZ1BhdGg7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlZHJhd1BhdGg7IiwiZnVuY3Rpb24gcGF0aEdsb3coIGMsIHBhdGhDZmcsIHNhdmVkUGF0aCwgZ2xvd09wdHMgKSB7XHJcblx0bGV0IGJsdXJzID0gZ2xvd09wdHMuYmx1cnMgfHwgIFsgMTAwLCA3MCwgNTAsIDMwLCAxMCBdO1xyXG5cdGxldCBibHVyQ29sb3IgPSBnbG93T3B0cy5ibHVyQ29sb3IgfHwgJ3doaXRlJztcclxuXHRsZXQgYmx1clNoYXBlT2Zmc2V0ID0gZ2xvd09wdHMuYmx1clNoYXBlT2Zmc2V0IHx8IDEwMDAwO1xyXG5cdC8vIGMubGluZVdpZHRoID0gcGF0aENmZy5saW5lV2lkdGg7XHJcblx0Yy5zdHJva2VTdHlsZSA9IFwicmVkXCI7XHJcblx0Yy5maWxsU2J0eWxlID0gJ3doaXRlJztcclxuXHRjLnNoYWRvd09mZnNldFkgPSBibHVyU2hhcGVPZmZzZXQ7XHJcblx0Yy5zaGFkb3dDb2xvciA9IGJsdXJDb2xvcjtcclxuXHJcblx0Zm9yKCBsZXQgaSA9IDA7IGkgPCBibHVycy5sZW5ndGggLSAxOyBpKysgKSB7XHJcblx0XHRjLnNoYWRvd0JsdXIgPSBibHVyc1sgaSBdO1xyXG5cdFx0Yy5saW5lV2lkdGggPSBwYXRoQ2ZnLmxpbmVXaWR0aCAqIDI7XHJcblx0XHRjLnN0cm9rZSggc2F2ZWRQYXRoICk7XHJcblx0fVxyXG5cdGMuc2hhZG93Qmx1ciA9IDA7XHJcbn1cclxuXHJcbi8vIHBhdGggcmVuZGVyaW5nIGZ1bmN0aW9uXHJcbmZ1bmN0aW9uIHJlbmRlclBhdGgoIGMsIHBhcmVudCwgZ2xvYmFsQ29uZmlnICkge1xyXG5cdFxyXG5cdGxldCB0aGlzQ2ZnID0gdGhpcztcclxuXHRsZXQgcmVuZGVyQ2ZnID0gcGFyZW50LnJlbmRlckNvbmZpZztcclxuXHRsZXQgY3VyclJlbmRlclBvaW50ID0gMDtcclxuXHRsZXQgY3VyclJlbmRlckhlYWQgPSAwO1xyXG5cdGxldCBjdXJyUmVuZGVyVGFpbCA9IDA7XHJcblx0XHJcblx0Y29uc3QgeyBpc0NoaWxkLCBpc1JlbmRlcmluZywgcmVuZGVyT2Zmc2V0LCBzYXZlZFBhdGhzLCBwYXRoOiB0aGlzUGF0aCwgbGluZVdpZHRoLCBjb2xSLCBjb2xHLCBjb2xCLCBjb2xBLCBnbG93Q29sUiwgZ2xvd0NvbEcsIGdsb3dDb2xCLCBnbG93Q29sQSwgY3VyckhlYWRQb2ludCB9ID0gdGhpc0NmZztcclxuXHRsZXQgcGF0aExlbiA9IHRoaXNQYXRoLmxlbmd0aCAtIDE7XHJcblxyXG5cdGNvbnN0IGNvbXB1dGVkUGF0aENvbG9yID0gYHJnYmEoJHtjb2xSfSwgJHtjb2xHfSwgJHtjb2xCfSwgJHtjb2xBfSlgO1xyXG5cdGNvbnN0IHBhdGhHbG93UkdCID0gYCR7Z2xvd0NvbFJ9LCAke2dsb3dDb2xHfSwgJHtnbG93Q29sQn1gO1xyXG5cdGNvbnN0IHBhdGhHbG93Q29tcHV0ZWRDb2xvciA9IGByZ2JhKCAke3BhdGhHbG93UkdCfSwgJHtjb2xBfSApYDtcclxuXHRjb25zdCBoZWFkR2xvd0JsdXJBcnIgPSBbIDIwLCAxMCBdO1xyXG5cdGNvbnN0IHBhdGhHbG93T3B0cyA9IHsgYmx1cnM6IHBhcmVudC5nbG93Qmx1ckl0ZXJhdGlvbnMsIGJsdXJDb2xvcjogcGF0aEdsb3dDb21wdXRlZENvbG9yIH07XHJcblx0Y29uc3QgcGF0aEdsb3dTaG9ydE9wdHMgPSB7IGJsdXJzOiBbMTIwLCA4MCwgNjAsIDQwLCAzMCwgMjAsIDE1LCAxMCwgNV0sIGJsdXJDb2xvcjogcGF0aEdsb3dDb21wdXRlZENvbG9yIH07XHJcblx0Y29uc3QgaGVhZEdsb3dPcHRzID0geyBibHVyczogaGVhZEdsb3dCbHVyQXJyLCBibHVyQ29sb3I6IHBhdGhHbG93Q29tcHV0ZWRDb2xvciB9O1xyXG5cdC8vIHNoYWRvdyByZW5kZXIgb2Zmc2V0XHJcblx0Y29uc3Qgc1JPID0gZ2xvYmFsQ29uZmlnLnJlbmRlckNvbmZpZy5ibHVyUmVuZGVyT2Zmc2V0O1xyXG5cdGNvbnN0IG9yaWdpbiA9IHRoaXNDZmcucGF0aFswXTtcclxuXHRjb25zdCB7IHg6IG9YLCB5OiBvWSB9ID0gb3JpZ2luO1xyXG5cclxuXHRpZiAoIHBhcmVudC5pc0RyYXduID09PSBmYWxzZSApIHsgdGhpcy5kcmF3UGF0aHMoIHJlbmRlckNmZywgcGFyZW50ICk7IH1cclxuXHRcclxuXHRjLmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcclxuXHRjLnN0cm9rZVN0eWxlID0gY29tcHV0ZWRQYXRoQ29sb3I7XHJcblx0Yy5zdHJva2UoIHNhdmVkUGF0aHMubWFpbiApO1xyXG5cdHBhdGhHbG93KCBjLCB0aGlzQ2ZnLCBzYXZlZFBhdGhzLm9mZnNldCwgcGF0aEdsb3dPcHRzICk7XHJcblxyXG5cdC8vIGlmIHRoZSBtYWluIHBhdGggaGFzIFwiY29ubmVjdGVkXCIgYW5kIGlzIFwiZGlzY2hhcmdpbmdcIlxyXG5cdGlmICh0aGlzQ2ZnLmlzQ2hpbGQgPT09IGZhbHNlKSB7XHJcblxyXG5cdFx0cGF0aEdsb3coIGMsIHRoaXNDZmcsIHNhdmVkUGF0aHMub3JpZ2luTG9uZywgcGF0aEdsb3dPcHRzICk7XHJcblx0XHRwYXRoR2xvdyggYywgdGhpc0NmZywgc2F2ZWRQYXRocy5vcmlnaW5TaG9ydCwgcGF0aEdsb3dTaG9ydE9wdHMgKTtcclxuXHJcblx0XHRpZiAoIHBhcmVudC5pc0RyYXduID09PSB0cnVlICkge1xyXG5cdFx0XHQvLyBvcmlnaW4gZ2xvdyBncmFkaWVudHNcclxuXHRcdFx0bGV0IG9yaWdpbiA9IHRoaXNDZmcucGF0aFswXTtcclxuXHRcdFx0bGV0IGdyZCA9IGMuY3JlYXRlUmFkaWFsR3JhZGllbnQoIG9YLCBvWSwgMCwgb1gsIG9ZLCAxMDI0ICk7XHJcblx0XHRcdGdyZC5hZGRDb2xvclN0b3AoIDAsIHBhdGhHbG93Q29tcHV0ZWRDb2xvciApO1xyXG5cdFx0XHRncmQuYWRkQ29sb3JTdG9wKCAxLCBgcmdiYSggJHtwYXRoR2xvd1JHQn0sIDAgKWAgKTtcclxuXHJcblx0XHRcdGMuZmlsbFN0eWxlID0gZ3JkO1xyXG5cdFx0XHRjLmZpbGxDaXJjbGUoIG9YLCBvWSwgMTAyNCApO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0fVxyXG5cclxuXHRpZiAoIHBhdGhMZW4gPiA0ICkge1xyXG5cdFx0bGV0IGdsb3dIZWFkUGF0aEwgPSBuZXcgUGF0aDJEKCk7XHJcblx0XHRsZXQgZ2xvd0hlYWRQYXRoUyA9IG5ldyBQYXRoMkQoKTtcclxuXHJcblx0XHRnbG93SGVhZFBhdGhMLm1vdmVUbyggdGhpc1BhdGhbIHBhdGhMZW4gLSAyIF0ueCwgdGhpc1BhdGhbIHBhdGhMZW4gLSAyIF0ueSAtIHNSTyApO1xyXG5cdFx0Z2xvd0hlYWRQYXRoTC5saW5lVG8oIHRoaXNQYXRoWyBwYXRoTGVuIC0gMSBdLngsIHRoaXNQYXRoWyBwYXRoTGVuIC0gMSBdLnkgLSBzUk8gKTtcclxuXHRcdGdsb3dIZWFkUGF0aEwubGluZVRvKCB0aGlzUGF0aFsgcGF0aExlbiBdLngsIHRoaXNQYXRoWyBwYXRoTGVuIF0ueSAtIHNSTyApO1xyXG5cdFx0cGF0aEdsb3coIGMsIHRoaXNDZmcsIGdsb3dIZWFkUGF0aEwsIGhlYWRHbG93T3B0cyApO1xyXG5cdFx0XHJcblx0XHRnbG93SGVhZFBhdGhTLm1vdmVUbyggdGhpc1BhdGhbIHBhdGhMZW4gLSAxIF0ueCwgdGhpc1BhdGhbIHBhdGhMZW4gLSAxIF0ueSAtIHNSTyApO1xyXG5cdFx0Z2xvd0hlYWRQYXRoUy5saW5lVG8oIHRoaXNQYXRoWyBwYXRoTGVuIF0ueCwgdGhpc1BhdGhbIHBhdGhMZW4gXS55IC0gc1JPICk7XHJcblx0XHRwYXRoR2xvdyggYywgdGhpc0NmZywgZ2xvd0hlYWRQYXRoUywgaGVhZEdsb3dPcHRzICk7XHJcblxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyUGF0aDsiLCJsZXQgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL21hdGhVdGlscy5qcycgKTtcclxubGV0IGVhc2luZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5sZXQgdHJpZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy90cmlnb25vbWljVXRpbHMuanMnICkudHJpZ29ub21pY1V0aWxzO1xyXG5cclxuLy8gcGF0aCB1cGRhdGUgZnVuY3Rpb25cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVBhdGgoIHBhcmVudENvbmZpZywgZ2xvYmFsQ29uZmlnICkge1xyXG5cclxuXHRsZXQgckNmZyA9IGdsb2JhbENvbmZpZy5yZW5kZXJDb25maWdcclxuXHRsZXQgcCA9IHBhcmVudENvbmZpZztcclxuXHRsZXQgcFN0YXRlID0gcC5zdGF0ZS5zdGF0ZXM7XHJcblx0bGV0IHBhdGhDZmcgPSB0aGlzO1xyXG5cdGxldCBwYXRoTGVuID0gcGF0aENmZy5wYXRoLmxlbmd0aDtcclxuXHRsZXQgcm5kT2Zmc2V0ID0gcGF0aENmZy5yZW5kZXJPZmZzZXQ7XHJcblxyXG5cdGlmICggcFN0YXRlLmlzRHJhd24gPT09IHRydWUgKSB7XHJcblxyXG5cdFx0aWYgKCBwLndpbGxDb25uZWN0ID09PSBmYWxzZSApIHtcclxuXHRcdFx0aWYgKCBwYXRoQ2ZnLnBsYXlTZXF1ZW5jZSA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0cGF0aENmZy5wbGF5U2VxdWVuY2UgPSB0cnVlOyBcclxuXHRcdFx0XHRwYXRoQ2ZnLnN0YXJ0U2VxdWVuY2UoIHtpbmRleDogMH0gKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKCBwYXRoTGVuICsgcm5kT2Zmc2V0IDwgcC5yZW5kZXJDb25maWcuY3VyckhlYWQpIHtcclxuXHRcdHBhdGhDZmcuaXNSZW5kZXJpbmcgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHBhdGhDZmcudXBkYXRlU2VxdWVuY2UoKTtcclxuXHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlUGF0aDsiLCJjb25zdCBhbHBoYUZhZGVPdXQgPSByZXF1aXJlKCAnLi9zZXF1ZW5jZUl0ZW1zL2FscGhhRmFkZU91dC5qcycgKTtcclxuXHJcbmxldCBjaGlsZFBhdGhBbmltU2VxdWVuY2UgPSBbXHJcblx0e1xyXG5cdFx0bmFtZTogJ2xQYXRoQ29vbCcsXHJcblx0XHR0aW1lOiAzMCxcclxuXHRcdGxpbmtlZFNlcTogJycsXHJcblx0XHRsb29wOiBmYWxzZSxcclxuXHRcdGxvb3BCYWNrOiBmYWxzZSxcclxuXHRcdGZpbmFsOiB0cnVlLFxyXG5cdFx0aXRlbXM6IGFscGhhRmFkZU91dFxyXG5cdH1cclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hpbGRQYXRoQW5pbVNlcXVlbmNlOyIsImNvbnN0IGZhZGVUb1JlZEFuZEZhZGVPdXQgPSByZXF1aXJlKCAnLi9zZXF1ZW5jZUl0ZW1zL2ZhZGVUb1JlZEFuZEZhZGVPdXQuanMnICk7XHJcbmNvbnN0IGxpbmVXaWR0aFRvMTAgPSByZXF1aXJlKCAnLi9zZXF1ZW5jZUl0ZW1zL2xpbmVXaWR0aFRvMTAuanMnICk7XHJcblxyXG5sZXQgbWFpblBhdGhBbmltU2VxdWVuY2UgPSBbXHJcblx0e1xyXG5cdFx0bmFtZTogJ2xQYXRoRmlyZScsXHJcblx0XHR0aW1lOiAxLFxyXG5cdFx0bGlua2VkU2VxOiAnMScsXHJcblx0XHRsb29wOiBmYWxzZSxcclxuXHRcdGxvb3BCYWNrOiBmYWxzZSxcclxuXHRcdGl0ZW1zOiBsaW5lV2lkdGhUbzEwXHJcblx0fSxcclxuXHR7XHJcblx0XHRuYW1lOiAnbFBhdGhDb29sJyxcclxuXHRcdHRpbWU6IDMwLFxyXG5cdFx0bGlua2VkU2VxOiAnJyxcclxuXHRcdGxvb3A6IGZhbHNlLFxyXG5cdFx0bG9vcEJhY2s6IGZhbHNlLFxyXG5cdFx0ZmluYWw6IHRydWUsXHJcblx0XHRpdGVtczogZmFkZVRvUmVkQW5kRmFkZU91dFxyXG5cdH1cclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpblBhdGhBbmltU2VxdWVuY2U7IiwiY29uc3QgYWxwaGFGYWRlT3V0ID0gW1xyXG5cdHsgcGFyYW06ICdjb2xBJywgdGFyZ2V0OiAwLCBlYXNlZk46ICdlYXNlT3V0UXVpbnQnIH1cclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYWxwaGFGYWRlT3V0OyIsImNvbnN0IGZhZGVUb1JlZEFuZEZhZGVPdXQgPSBbXHJcblx0eyBwYXJhbTogJ2xpbmVXaWR0aCcsIHN0YXJ0OiAwLCB0YXJnZXQ6IDEsIGVhc2VmTjogJ2Vhc2VPdXRRdWludCcgfSxcclxuXHR7IHBhcmFtOiAnY29sRycsIHN0YXJ0OiAwLCB0YXJnZXQ6IDAsIGVhc2VmTjogJ2Vhc2VPdXRRdWludCcgfSxcclxuXHR7IHBhcmFtOiAnY29sUicsIHN0YXJ0OiAwLCB0YXJnZXQ6IDAsIGVhc2VmTjogJ2Vhc2VPdXRRdWludCcgfSxcclxuXHR7IHBhcmFtOiAnY29sQScsIHN0YXJ0OiAwLCB0YXJnZXQ6IDAsIGVhc2VmTjogJ2Vhc2VPdXRTaW5lJyB9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZhZGVUb1JlZEFuZEZhZGVPdXQ7IiwiY29uc3QgbGluZVdpZHRoVG8xMCA9IFtcclxuXHR7IHBhcmFtOiAnbGluZVdpZHRoJywgc3RhcnQ6IDAsIHRhcmdldDogMTAsIGVhc2VmTjogJ2xpbmVhckVhc2UnIH1cclxuXTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGluZVdpZHRoVG8xMDsiLCJmdW5jdGlvbiBzZXR1cFNlcXVlbmNlcyggc2VxdWVuY2VzICkge1xyXG5cdGxldCBzZXF1ZW5jZUxlbiA9IHNlcXVlbmNlcy5sZW5ndGg7XHJcblx0bGV0IHNlcUFycmF5ID0gW107XHJcblx0Zm9yKCBsZXQgaSA9IDA7IGkgPCBzZXF1ZW5jZUxlbjsgaSsrKSB7XHJcblx0XHRsZXQgc2VxID0gc2VxdWVuY2VzWyBpIF07XHJcblx0XHRsZXQgdG1wU2VxID0ge1xyXG5cdFx0XHRhY3RpdmU6IGZhbHNlLFxyXG5cdFx0XHRjbG9jazogMCxcclxuXHRcdFx0dG90YWxDbG9jazogc2VxLnRpbWUsXHJcblx0XHRcdGxpbmtlZFNlcTogc2VxLmxpbmtlZFNlcSxcclxuXHRcdFx0bmFtZTogc2VxLm5hbWUsXHJcblx0XHRcdGZpbmFsOiBzZXEuZmluYWwsXHJcblx0XHRcdGl0ZW1zOiBbXVxyXG5cdFx0fTtcclxuXHRcdGZvciggbGV0IGkgPSAwOyBpIDwgc2VxLml0ZW1zLmxlbmd0aDsgaSsrICl7XHJcblx0XHRcdGxldCBpdGVtID0gc2VxLml0ZW1zWyBpIF07XHJcblx0XHRcdHRtcFNlcS5pdGVtcy5wdXNoKFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHBhcmFtOiBpdGVtLnBhcmFtLFxyXG5cdFx0XHRcdFx0c3RhcnQ6IDAsXHJcblx0XHRcdFx0XHR0YXJnZXQ6IGl0ZW0udGFyZ2V0LFxyXG5cdFx0XHRcdFx0ZWFzZWZOOiBpdGVtLmVhc2VmTlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdHNlcUFycmF5LnB1c2goIHRtcFNlcSApO1xyXG5cdH1cclxuXHRyZXR1cm4gc2VxQXJyYXk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2V0dXBTZXF1ZW5jZXM7ICIsImZ1bmN0aW9uIHN0YXJ0U2VxdWVuY2UoIG9wdHMgKSB7XHJcblx0Ly8gY29uc29sZS5sb2coIGBzdGFydFNlcXVlbmNlYCApO1xyXG5cdGxldCB0ID0gdGhpcztcclxuXHRsZXQgc2VxSW5kZXggPSBvcHRzLmluZGV4IHx8IDA7XHJcblx0Ly8gc2V0IGN1cnJlbnQgdmFsdWVzIHRvIHN0YXJ0IHNlcXVlbmNlIHdpdGhcclxuXHRsZXQgc2VxID0gdC5zZXF1ZW5jZXNbIHNlcUluZGV4IF07XHJcblx0Zm9yKCBsZXQgaSA9IDA7IGkgPCBzZXEuaXRlbXMubGVuZ3RoOyBpKysgKXtcclxuXHRcdGxldCBpdGVtID0gc2VxLml0ZW1zWyBpIF07XHJcblx0XHRsZXQgY3Vyckl0ZW1WYWwgPSB0WyBpdGVtLnBhcmFtIF07XHJcblx0XHRpdGVtLnN0YXJ0ID0gY3Vyckl0ZW1WYWw7XHJcblx0XHRpdGVtLnRhcmdldCAtPSBjdXJySXRlbVZhbDtcclxuXHR9XHJcblx0c2VxLmFjdGl2ZSA9IHRydWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc3RhcnRTZXF1ZW5jZTsiLCJsZXQgZWFzaW5nID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL2Vhc2luZy5qcycgKS5lYXNpbmdFcXVhdGlvbnM7XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVTZXF1ZW5jZSggb3B0cyApe1xyXG5cdGxldCB0ID0gb3B0cyB8fCB0aGlzO1xyXG5cdC8vIGNvbnNvbGUubG9nKCAndXBkYXRlIHRoaXM6ICcsIHRoaXMgKTtcclxuXHRsZXQgY1MgPSB0LnNlcXVlbmNlcztcclxuXHRsZXQgY1NMZW4gPSB0LnNlcXVlbmNlcy5sZW5ndGg7XHJcblxyXG5cdGZvciggbGV0IGkgPSAwOyBpIDwgY1NMZW47IGkrKyApe1xyXG5cdFx0bGV0IHRoaXNTZXEgPSBjU1sgaSBdO1xyXG5cdFx0aWYgKCB0aGlzU2VxLmFjdGl2ZSA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCB7IGl0ZW1zLCBsaW5rZWRTZXEsIGNsb2NrLCB0b3RhbENsb2NrLCBmaW5hbCB9ID0gdGhpc1NlcTtcclxuXHRcdGxldCBpdGVtTGVuID0gaXRlbXMubGVuZ3RoO1xyXG5cdFx0Zm9yKCBsZXQgaSA9IDA7IGkgPCBpdGVtTGVuOyBpKysgKXtcclxuXHRcdFx0bGV0IHMgPSBpdGVtc1sgaSBdO1xyXG5cdFx0XHR0WyBzLnBhcmFtIF0gPSBlYXNpbmdbIHMuZWFzZWZOIF0oXHJcblx0XHRcdFx0Y2xvY2ssIHMuc3RhcnQsIHMudGFyZ2V0LCB0b3RhbENsb2NrXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIGNsb2NrID49IHRvdGFsQ2xvY2sgKSB7XHJcblx0XHRcdHRoaXNTZXEuYWN0aXZlID0gZmFsc2VcclxuXHRcdFx0dGhpc1NlcS5jbG9jayA9IDA7XHJcblx0XHRcdGlmKCBsaW5rZWRTZXEgIT09ICcnICkge1xyXG5cdFx0XHRcdHQuc3RhcnRTZXF1ZW5jZSggeyBpbmRleDogbGlua2VkU2VxIH0gKTtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiggIXQuaXNDaGlsZCAmJiBmaW5hbCApIHtcclxuXHRcdFx0XHR0LmlzQWN0aXZlID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0XHR0aGlzU2VxLmNsb2NrKys7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVwZGF0ZVNlcXVlbmNlOyIsImZ1bmN0aW9uIHVwZGF0ZVNlcXVlbmNlQ2xvY2soKXtcclxuXHRsZXQgdCA9IHRoaXM7XHJcblx0aWYgKCB0LnBsYXlTZXF1ZW5jZSA9PT0gdHJ1ZSApIHtcclxuXHRcdGlmICggdC5zZXF1ZW5jZUNsb2NrIDwgdC5jdXJyU2VxdWVuY2UudGltZSApIHtcclxuXHRcdFx0dC5zZXF1ZW5jZUNsb2NrKys7XHJcblx0XHR9O1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGVTZXF1ZW5jZUNsb2NrOyIsIi8qKlxyXG4gKiBqUXVlcnkgb2JqZWN0XHJcbiAqIEBleHRlcm5hbCBqUXVlcnlcclxuICogQHNlZSB7QGxpbmsgaHR0cDovL2FwaS5qcXVlcnkuY29tL2pRdWVyeS99XHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IERpbWVuc2lvbnNcclxuICogQGRlc2NyaXB0aW9uIHZhbHVlcyBkZXNjcmliaW5nIHRoZSBsZW5ndGggb2Ygc2lkZXMgWCAoaG9yaXpvbnRhbCkgYW5kIFkgKHZlcnRpY2FsKSBpbiAyZCAoY2FydGVzZWFuKSBzcGFjZVxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gdyAtIHdpZHRoXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBoIC0gaGVpZ2h0XHJcbiAqL1xyXG5cclxuLyoqXHJcbiogQHR5cGVkZWYge09iamVjdH0gUG9pbnQgLSBBIHBvaW50IGluIHNwYWNlIG9uIGEgMmQgKGNhcnRlc2VhbikgcGxhbmVcclxuKiBAZGVzY3JpcHRpb24gQSBwb2ludCBpbiBhIDJkIChjYXJ0ZXNlYW4pIHNwYWNlIHBsYW5lLCBhcyBhbiB4L3kgY29vcmRpbmF0ZSBwYWlyXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IHggLSBUaGUgWCBDb29yZGluYXRlXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IHkgLSBUaGUgWSBDb29yZGluYXRlXHJcbiovXHJcblxyXG4vKiogXHJcbiogIEB0eXBlZGVmIHtPYmplY3R9IFZlbG9jaXR5VmVjdG9yIC0gVGhlIGNoYW5nZSBkZWx0YSBmb3IgY2FydGVzZWFuIHgveSwgb3IgMmQgY29vcmRpbmF0ZSBzeXN0ZW1zXHJcbiogIEBwcm9wZXJ0eSB7bnVtYmVyfSB4VmVsIFRoZSBYIGRlbHRhIGNoYW5nZSB2YWx1ZS5cclxuKiAgQHByb3BlcnR5IHtudW1iZXJ9IHlWZWwgVGhlIFkgZGVsdGEgY2hhbmdlIHZhbHVlLlxyXG4qL1xyXG5cclxuLyoqXHJcbiogQHR5cGVkZWYge09iamVjdH0gdmVjdG9yQ2FsY3VsYXRpb25cclxuKiBAcHJvcGVydHkge251bWJlcn0gZGlzdGFuY2UgVGhlIGRpc3RhbmNlIGJldHdlZW4gdmVjdG9yc1xyXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBhbmdsZSBUaGUgYW5nbGUgYmV0d2VlbiB2ZWN0b3JzXHJcbiovXHJcblxyXG4vKipcclxuKiBAdHlwZWRlZiB7b2JqZWN0fSBjcmVhdGVQYXRoT3B0aW9uc1xyXG4qIEBkZXNjcmlwdGlvbiBUaGUgb3B0aW9ucyBhdmFpbGFibGUgd2hlbiBjcmVhdGluZyBhIG5ldyBwYXRoIGZyb20gdGhlIHtAbGluayBjcmVhdGVQYXRoRnJvbU9wdGlvbnN9IGNvbnN0cnVjdG9yIGZ1bmN0aW9uXHJcbiogQHByb3BlcnR5IHtib29sZWFufSBbaXNDaGlsZD1mYWxzZV0gLSBpcyB0aGUgcGF0aCBzcGF3bmVkIGZyb20gdGhlIG9yaWdpbmFsIHNlZWQgcGF0aCBvciB0aGUgbWFpbiBwYXRoPy5cclxuKiBAcHJvcGVydHkge2Jvb2xlYW59IFtpc0FjdGl2ZT1mYWxzZV0gLSBpcyB0aGUgcGF0aCBhY3RpdmU/LlxyXG4qIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2lzUmVuZGVyaW5nPWZhbHNlXSAtIGlzIHRoZSBwYXRoIHJlbmRlcmluZy5cclxuKiBAcHJvcGVydHkge2Jvb2xlYW59IFt3aWxsU3RyaWtlPWZhbHNlXSAtIHdpbGwgdGhlIHBhdGggY29ubmVjdCB3aXRoIGEgdGFyZ2V0LlxyXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBzdGFydFggLSB4IHZhbHVlIGZvciB0aGUgcGF0aCBzdGFydC5cclxuKiBAcHJvcGVydHkge251bWJlcn0gc3RhcnRZIC0geSB2YWx1ZSBmb3IgdGhlIHBhdGggc3RhcnQuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGVuZFggLSB4IHZhbHVlIGZvciB0aGUgcGF0aCBlbmQuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGVuZFkgLSB5IHZhbHVlIGZvciB0aGUgcGF0aCBlbmQuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IHN1YmRpdmlzaW9ucyAtIG51bWJlciBvZiBzdWJkaXZpb24gcGFzc2VzIG1hZGUgd2hlbiBwbG90dGluZyB0aGUgcGF0aCBwb2ludHMgZnJvbSBzdGFydCB0byBlbmQuXHJcbiogQHByb3BlcnR5IHtvYmplY3R9IHNlcXVlbmNlcyAtIG9iamVjdCBjb250YWluaW5nIGFuIGFuaW1hdGlvbiBzZXF1ZW5jZSBpbmZvcm1hdGlvbi5cclxuKiBAcHJvcGVydHkge251bWJlcn0gW3BhdGhDb2xSPTI1NV0gLSBwYXRoIHN0cm9rZSBjb2xvciBSRUQgKDAtMjU1KS5cclxuKiBAcHJvcGVydHkge251bWJlcn0gW3BhdGhDb2xHPTI1NV0gLSBwYXRoIHN0cm9rZSBjb2xvciBHUkVFTiAoMC0yNTUpLlxyXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBbcGF0aENvbEI9MjU1XSAtIHBhdGggc3Ryb2tlIGNvbG9yIEJMVUUgKDAtMjU1KS5cclxuKiBAcHJvcGVydHkge251bWJlcn0gW3BhdGhDb2xBPTFdIC0gcGF0aCBzdHJva2UgY29sb3IgQUxQSEEgKHRyYW5zcGFyZW5jeSkgKDAtMSkuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IFtnbG93Q29sUj0yNTVdIC0gcGF0aCBnbG93IGNvbG9yIFJFRCAoMC0yNTUpLlxyXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBbZ2xvd0NvbEc9MjU1XSAtIHBhdGggZ2xvdyBjb2xvciBHUkVFTiAoMC0yNTUpLlxyXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBbZ2xvd0NvbEI9MjU1XSAtIHBhdGggZ2xvdyBjb2xvciBCTFVFICgwLTI1NSkuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IFtnbG93Q29sQT0xXSAtIHBhdGggZ2xvdyBjb2xvciBBTFBIQSAodHJhbnNwYXJlbmN5KSAoMC0xKS5cclxuKiBAcHJvcGVydHkge251bWJlcn0gW2xpbmVXaWR0aD0xXSAtIGxpbmUgd2lkdGggb2YgdGhlIHBhdGggYXQgY3JlYXRpb24gKGRlZmF1bHQ6IDEpLlxyXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBbcmVuZGVyT2Zmc2V0PTBdIC0gaWYgaXNDaGlsZCBpcyB0cnVlLCB0aGlzIHJlcGVyZXNlbnRzIHRoZSBhcnJheSBpbmRleCBvbiB0aGUgbWFpbiBwYXRoIHBvaW50IGFycmF5IHdoaWNoIHRoaXMgcGF0aCB3aWxsIHJlZ2FyZCBhcyBpdCdzIHN0YXJ0IHBvaW50LiBEdXJpbmcgcmVuZGVyaW5nIHdoZXJlIHRoZSBwYXRocyBhcmUgZHJhd24gYWxvbmcgdGhlaXIgbGVuZ3RoLCB0aGlzIGlzIHVzZWQgYXMgdGhlIG9mZnNldCBiZWZvcmUgc3RhcnRpbmcgdGhlIGNoaWxkIHBhdGhzIHJlbmRlcmluZy5cclxuKiBAcHJvcGVydHkge251bWJlcn0gW2JyYW5jaERlcHRoPTBdIC0gdGhlIGJyYW5jaCBsZXZlbCB0aGF0IHRoaXMgcGF0aCBoYXMgYmVlbiBzcGF3bmVkIGF0IChtYWluIHBhdGggaXMgbGV2ZWwgMCkuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IFtjbG9jaz0wXSAtIGNsb2NrIGluY3JlbWVudGVyIGZvciB0aGUgcGF0aC5cclxuKiBAcHJvcGVydHkge251bWJlcn0gW3RvdGFsQ2xvY2tdIC0gdG90YWwgdGltZSBiZWZvcmUgZXZlbnQuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IFtzZXF1ZW5jZUNsb2NrXSAtIHRvdGFsIGxlbmd0aCBvZiBzZXF1ZW5jZS5zZXF1ZW5jZVN0YXJ0SW5kZXhcclxuKiBAcHJvcGVydHkge251bWJlcn0gW3NlcXVlbmNlU3RhcnRJbmRleD0wXSAtIGdpdmVuIHRoZSBwYXRoIG1heSBoYXZlIG1vcmUgdGhhbiBvbmUgc2VxdWVuY2UgYXR0YWNoZWQgdGhpcyB3aWxsIGJlIHRoZSBhcnJheSBpbmRleCBvZiB0aGUgc2VxdWVuY2UgdG8gc3RhcnQgd2l0aC5cclxuKiBAcHJvcGVydHkge251bWJlcn0gW3NlcXVlbmNlSW5kZXg9MF0gLSB0aGUgYXJyYXkgaW5kZXggb2YgdGhlIGN1cnJlbnQgYWN0aXZlIHNlcXVlbmNlLlxyXG4qL1xyXG5cclxuXHJcbi8qKlxyXG4qIEB0eXBlZGVmIHtvYmplY3R9IHBhdGhPYmplY3RcclxuKiBAZGVzY3JpcHRpb24gVGhlIHJldHVybiBvYmplY3QgY3JlYXRlZCBieSB0aGUge0BsaW5rIGNyZWF0ZVBhdGhGcm9tT3B0aW9uc30gZnVuY3Rpb25cclxuKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzQ2hpbGQgaXMgdGhpcyB0aGUgbWFpbiBwYXRoIG9yIGEgc3ViKGNoaWxkKSBwYXRoP1xyXG4qIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNBY3RpdmUgaXMgdGhpcyBwYXRoIGFjdGl2ZT9cclxuKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzUmVuZGVyaW5nIGlzIHRoZSBwYXRoIHRvIGJlIHJlbmRlcmVkIG9uc2NyZWVuP1xyXG4qIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gd2lsbFN0cmlrZSB3aWxsIHRoZSBwYXRoIGNvbm5lY3QgdG8gYSB0YXJnZXQ/XHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGJyYW5jaERlcHRoIHdoYXQgbGV2ZWwgb2YgdGhlIHJlY3Vyc2l2ZSBwYXRoIGNyZWF0aW9uIGZ1bmN0aW9uIGlzIHRoaXMgcGF0aD8gTWFpbiBwYXRoID0gYnJhbmNoRGVwdGggPSAwLlxyXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBiYXNlQW5nbGUgdGhlIGFuZ2xlIGluIHJhZGlhbnMgYmV0d2VlbiB0aGUgcGF0aCBzdGFydCBhbmQgZW5kIHBvaW50cy5cclxuKiBAcHJvcGVydHkge251bWJlcn0gYmFzZURpc3QgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHBhdGggc3RhcnQgYW5kIGVuZCBwb2ludHMuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGNvbFIgLSBwYXRoIHN0cm9rZSBjb2xvciBSRUQgKDAtMjU1KS5cclxuKiBAcHJvcGVydHkge251bWJlcn0gY29sRyAtIHBhdGggc3Ryb2tlIGNvbG9yIEdSRUVOICgwLTI1NSkuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGNvbEIgLSBwYXRoIHN0cm9rZSBjb2xvciBCTFVFICgwLTI1NSkuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGNvbEEgLSBwYXRoIHN0cm9rZSBjb2xvciBBTFBIQSAodHJhbnNwYXJlbmN5KSAoMC0xKS5cclxuKiBAcHJvcGVydHkge251bWJlcn0gZ2xvd0NvbFIgLSBwYXRoIGdsb3cgY29sb3IgUkVEICgwLTI1NSkuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGdsb3dDb2xHIC0gcGF0aCBnbG93IGNvbG9yIEdSRUVOICgwLTI1NSkuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGdsb3dDb2xCIC0gcGF0aCBnbG93IGNvbG9yIEJMVUUgKDAtMjU1KS5cclxuKiBAcHJvcGVydHkge251bWJlcn0gZ2xvd0NvbEEgLSBwYXRoIGdsb3cgY29sb3IgQUxQSEEgKHRyYW5zcGFyZW5jeSkgKDAtMSkuXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGxpbmVXaWR0aCAtIGxpbmUgd2lkdGggb2YgdGhlIHBhdGggYXQgY3JlYXRpb24gKGRlZmF1bHQ6IDEpXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGNsb2NrIC0gdGhlIG1haW4gY2xvY2sgdGltZXIgZm9yIHRoZSBwYXRoXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IHNlcXVlbmNlQ2xvY2sgLSB0aGUgc2VxdWVuY2UgY2xvY2sgZm9yIGN1cnJlbnQgYWN0aXZlIHNlcXVlbmNlXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IHRvdGFsQ2xvY2sgLSB0b3RhbCBjbG9jayB0aW1pbmcgZm9yIHRoZSBwYXRoXHJcbiogQHByb3BlcnR5IHtib29sZWFufSBkcmF3UGF0aFNlcXVlbmNlIC0gaXMgdGhlIHBhdGggaW4gZHJhd2luZyBtb2RlXHJcbiogQHByb3BlcnR5IHthcnJheX0gc2VxdWVuY2VzIC0gYXJyYXkgb2Ygc2VxdWVuY2UgZGVmaW5pdGlvbiBvYmplY3RzXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IHNlcXVlbmNlU3RhcnRJbmRleCAtIGFycmF5IGluZGV4IG9mIHRoZSBmaXJzdCBzZXF1ZW5jZSB0byBydW4gd2hlbiBhY3RpdmVcclxuKiBAcHJvcGVydHkge251bWJlcn0gc2VxdWVuY2VJbmRleCAtIGFycmF5IGluZGV4IG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIHNlcXVlbmNlXHJcbiogQHByb3BlcnR5IHtib29sZWFufSBwbGF5U2VxdWVuY2UgLSBhcmUgdGhlIHNlcXVlbmNlcyBwbGF5aW5nXHJcbiogQHByb3BlcnR5IHtvYmplY3R9IGN1cnJTZXF1ZW5jZSAtIHRoZSBjdXJyZW50IGFjdGl2ZSBzZXF1ZW5jZVxyXG4qIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IHN0YXJ0U2VxdWVuY2UgLSB1dGlsaXR5IG1ldGhvZCB0byBzdGFydCBhIHNlcXVlbmNlXHJcbiogQHByb3BlcnR5IHtmdW5jdGlvbn0gdXBkYXRlU2VxdWVuY2UgLSB1dGlsaXR5IG1ldGhvZCB0byB1cGRhdGUgYWN0aXZlIHNlcXVlbmNlXHJcbiogQHByb3BlcnR5IHtmdW5jdGlvbn0gdXBkYXRlU2VxdWVuY2VDbG9jayAtIHV0aWxpdHkgbWV0aG9kIHRvIHVwZGF0ZSB0aGUgc2VxdWVuY2UgY2xvY2tcclxuKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBkcmF3UGF0aHMgLSB1dGlsaXR5IG1ldGhvZCB0byBkcmF3IHRoZSBwYXRoXHJcbiogQHByb3BlcnR5IHtmdW5jdGlvbn0gcmVkcmF3UGF0aCAtIHV0aWxpdHkgbWV0aG9kIHRvIHJlLWRyYXcgdGhlIHBhdGggd2l0aCBwb3NzaWJsZSB2YXJpYW5jZXNcclxuKiBAcHJvcGVydHkge2Z1bmN0aW9ufSB1cGRhdGUgLSB1dGlsaXR5IG1ldGhvZCB0byB1cGRhdGUgdGhlIHBhdGhcclxuKiBAcHJvcGVydHkge2Z1bmN0aW9ufSByZW5kZXIgLSB1dGlsaXR5IG1ldGhvZCB0byByZW5kZXIgdGhlIHBhdGhcclxuKiBAcHJvcGVydHkge251bWJlcn0gcmVuZGVyT2Zmc2V0IC0gaWYgaXNDaGlsZCA9IHRydWUgdGhlIGFycmF5IGluZGV4IG9uIHRoZSBtYWluIHBhdGggY29vcmRpbmF0ZSBsaXN0IHdoZXJlIHRoaXMgY2hpbGQgcGF0aCBzdGFydHMuICBcclxuKiBAcHJvcGVydHkge251bWJlcn0gY3VyckhlYWRQb2ludCAtIHdoZW4gcmVuZGVyaW5nIHRoZSBjdXJyZW50IGFycmF5IGluZGV4IG9mIHBhdGggdG8gcmVuZGVyLlxyXG4qIEBwcm9wZXJ0eSB7YXJyYXk8UG9pbnQ+fSBwYXRoIC0gdGhlIGNyZWF0ZWQgcGF0aCBhcyBhbiBhcnJheSBvZiB4L3kgY29vcmRpbmF0ZSBwYWlyIG9iamVjdHNcclxuKiBAcHJvcGVydHkge29iamVjdH0gc2F2ZWRQYXRocyAtIG9iamVjdCBjb250YWluaW5nIG5hbWVkIHNhdmVkIHBhdGhzIHN0b3JlZCBhZnRlciBwbG90dGluZyB0aGUgcGF0aCBwb2ludHNcclxuKiBAcHJvcGVydHkge1BhdGgyRH0gc2F2ZWRQYXRocy5tYWluIC0gUGF0aDJEIHByaW1pdGl2ZSBjb250YWluaW5nIHRoZSBtYWluIHBhdGhcclxuKiBAcHJvcGVydHkge1BhdGgyRH0gc2F2ZWRQYXRocy5vZmZzZXQgLSBQYXRoMkQgcHJpbWl0aXZlIGNvbnRhaW5pbmcgdGhlIG1haW4gcGF0aCBkdXBsaWNhdGUgZm9yIG91dGVyIGdsb3cgcmVuZGVyaW5nXHJcbiogQHByb3BlcnR5IHtQYXRoMkR9IHNhdmVkUGF0aHMub3JpZ2luU2hvcnQgLSBQYXRoMkQgcHJpbWl0aXZlIGNvbnRhaW5pbmcgcGF0aCBmb3IgcmVuZGVyaW5nIHRoZSBnbG93IGF0IHBhdGggc3RhcnQgKG1haW4gcGF0aCwgaS5lLiBpc0NoaWxkID0gZmFsc2UpIFxyXG4qIEBwcm9wZXJ0eSB7UGF0aDJEfSBzYXZlZFBhdGhzLm9yaWdpbkxvbmcgLSBQYXRoMkQgcHJpbWl0aXZlIGNvbnRhaW5pbmcgcGF0aCBmb3IgcmVuZGVyaW5nIHRoZSBhZGRpdGlvbmFsIGdsb3cgYXQgcGF0aCBzdGFydCAobWFpbiBwYXRoLCBpLmUuIGlzQ2hpbGQgPSBmYWxzZSlcclxuKi9cclxuXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge307IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGV4dGVuZHMgQ2FudmFzIHByb3RvdHlwZSB3aXRoIHVzZWZ1bCBkcmF3aW5nIG1peGluc1xyXG4qIEBraW5kIGNvbnN0YW50XHJcbiovXHJcbnZhciBjYW52YXNEcmF3aW5nQXBpID0gQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIGRyYXcgY2lyY2xlIEFQSVxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gcmFkaXVzIG9mIGNpcmNsZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5jaXJjbGUgPSBmdW5jdGlvbiAoeCwgeSwgcikge1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcblx0dGhpcy5hcmMoeCwgeSwgciwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZmlsbGVkIGNpcmNsZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gcmFkaXVzIG9mIGNpcmNsZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5maWxsQ2lyY2xlID0gZnVuY3Rpb24gKHgsIHksIHIsIGNvbnRleHQpIHtcclxuXHR0aGlzLmNpcmNsZSh4LCB5LCByLCBjb250ZXh0KTtcclxuXHR0aGlzLmZpbGwoKTtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgc3Ryb2tlZCBjaXJjbGVcclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIHJhZGl1cyBvZiBjaXJjbGUuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuc3Ryb2tlQ2lyY2xlID0gZnVuY3Rpb24gKHgsIHksIHIpIHtcclxuXHR0aGlzLmNpcmNsZSh4LCB5LCByKTtcclxuXHR0aGlzLnN0cm9rZSgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSB3aWR0aCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBoIC0gaGVpZ2h0IG9mIGVsbGlwc2UuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuZWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoKSB7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IE1hdGguUEkgKiAyOyBpICs9IE1hdGguUEkgLyAxNikge1xyXG5cdFx0dGhpcy5saW5lVG8oeCArIE1hdGguY29zKGkpICogdyAvIDIsIHkgKyBNYXRoLnNpbihpKSAqIGggLyAyKTtcclxuXHR9XHJcblx0dGhpcy5jbG9zZVBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGZpbGxlZCBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9yIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSB3aWR0aCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBoIC0gaGVpZ2h0IG9mIGVsbGlwc2UuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuZmlsbEVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgdywgaCkge1xyXG5cdHRoaXMuZWxsaXBzZSh4LCB5LCB3LCBoLCBjb250ZXh0KTtcclxuXHR0aGlzLmZpbGwoKTtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgc3Ryb2tlZCBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHcgLSB3aWR0aCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBoIC0gaGVpZ2h0IG9mIGVsbGlwc2UuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuc3Ryb2tlRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoKSB7XHJcblx0dGhpcy5lbGxpcHNlKHgsIHksIHcsIGgpO1xyXG5cdHRoaXMuc3Ryb2tlKCk7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGxpbmUgYmV0d2VlbiAyIHZlY3RvciBjb29yZGluYXRlcy5cclxuKiBAcGFyYW0ge251bWJlcn0geDEgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkxIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4MiAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuKiBAcGFyYW0ge251bWJlcn0geTIgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkubGluZSA9IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5Mikge1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcblx0dGhpcy5tb3ZlVG8oeDEsIHkxKTtcclxuXHR0aGlzLmxpbmVUbyh4MiwgeTIpO1xyXG5cdHRoaXMuc3Ryb2tlKCk7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IHN0cm9rZWQgcmVndWxhciBwb2x5Z29uIHNoYXBlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gWCBjb29yZGluYXRlIG9mIHRoZSBwb2x5Z29uIG9yaWdpbi5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIFkgY29vcmRpbmF0ZSBvZiB0aGUgcG9seWdvbiBvcmlnaW4uXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSBSYWRpdXMgb2YgdGhlIHBvbHlnb24uXHJcbiogQHBhcmFtIHtudW1iZXJ9IHMgLSBOdW1iZXIgb2Ygc2lkZXMuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuc3Ryb2tlUG9seSA9IGZ1bmN0aW9uICggeCwgeSwgciwgcyApIHtcclxuXHRcclxuXHR2YXIgc2lkZXMgPSBzO1xyXG5cdHZhciByYWRpdXMgPSByO1xyXG5cdHZhciBjeCA9IHg7XHJcblx0dmFyIGN5ID0geTtcclxuXHR2YXIgYW5nbGUgPSAyICogTWF0aC5QSSAvIHNpZGVzO1xyXG5cdFxyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcblx0dGhpcy50cmFuc2xhdGUoIGN4LCBjeSApO1xyXG5cdHRoaXMubW92ZVRvKCByYWRpdXMsIDAgKTsgICAgICAgICAgXHJcblx0Zm9yICggdmFyIGkgPSAxOyBpIDw9IHNpZGVzOyBpKysgKSB7XHJcblx0XHR0aGlzLmxpbmVUbyhcclxuXHRcdFx0cmFkaXVzICogTWF0aC5jb3MoIGkgKiBhbmdsZSApLFxyXG5cdFx0XHRyYWRpdXMgKiBNYXRoLnNpbiggaSAqIGFuZ2xlIClcclxuXHRcdCk7XHJcblx0fVxyXG5cdHRoaXMuc3Ryb2tlKCk7XHJcblx0dGhpcy50cmFuc2xhdGUoIC1jeCwgLWN5ICk7XHJcbn1cclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGZpbGxlZCByZWd1bGFyIHBvbHlnb24gc2hhcGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvbHlnb24gb3JpZ2luLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gWSBjb29yZGluYXRlIG9mIHRoZSBwb2x5Z29uIG9yaWdpbi5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIFJhZGl1cyBvZiB0aGUgcG9seWdvbi5cclxuKiBAcGFyYW0ge251bWJlcn0gcyAtIE51bWJlciBvZiBzaWRlcy5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5maWxsUG9seSA9IGZ1bmN0aW9uICggeCwgeSwgciwgcyApIHtcclxuXHRcclxuXHR2YXIgc2lkZXMgPSBzO1xyXG5cdHZhciByYWRpdXMgPSByO1xyXG5cdHZhciBjeCA9IHg7XHJcblx0dmFyIGN5ID0geTtcclxuXHR2YXIgYW5nbGUgPSAyICogTWF0aC5QSSAvIHNpZGVzO1xyXG5cdFxyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcblx0dGhpcy50cmFuc2xhdGUoIGN4LCBjeSApO1xyXG5cdHRoaXMubW92ZVRvKCByYWRpdXMsIDAgKTsgICAgICAgICAgXHJcblx0Zm9yICggdmFyIGkgPSAxOyBpIDw9IHNpZGVzOyBpKysgKSB7XHJcblx0XHR0aGlzLmxpbmVUbyhcclxuXHRcdFx0cmFkaXVzICogTWF0aC5jb3MoIGkgKiBhbmdsZSApLFxyXG5cdFx0XHRyYWRpdXMgKiBNYXRoLnNpbiggaSAqIGFuZ2xlIClcclxuXHRcdCk7XHJcblx0fVxyXG5cdHRoaXMuZmlsbCgpO1xyXG5cdHRoaXMudHJhbnNsYXRlKCAtY3gsIC1jeSApO1xyXG5cdFxyXG59IiwibGV0IHByZWZpeCA9ICdcXHgxYlsnO1xyXG5cclxuY29uc3QgY2wgPSB7XHJcblx0Ly8gcmVkXHJcblx0cjogYCR7cHJlZml4fTMxbWAsXHJcblx0YmdyOiBgJHtwcmVmaXh9NDBtYCxcclxuXHQvLyBncmVlblxyXG5cdGc6IGAke3ByZWZpeH0zMm1gLFxyXG5cdGJnZzogYCR7cHJlZml4fTQybWAsXHJcblx0Ly95ZWxsb3dcclxuXHR5OiBgJHtwcmVmaXh9MzNtYCxcclxuXHRiZ3k6IGAke3ByZWZpeH00M21gLFxyXG5cdC8vIGJsdWVcclxuXHRiOiBgJHtwcmVmaXh9MzZtYCxcclxuXHRiZ2I6IGAke3ByZWZpeH00Nm1gLFxyXG5cdC8vIG1hZ2VudGFcclxuXHRtOiBgJHtwcmVmaXh9MzVtYCxcclxuXHRiZ206IGAke3ByZWZpeH00NW1gLFxyXG5cdC8vIHdoaXRlXHJcblx0dzogYCR7cHJlZml4fTM3bWAsXHJcblx0Ymd3OiBgJHtwcmVmaXh9NDdtYCxcclxuXHQvLyByZXNldFxyXG5cdHJzdDogYCR7cHJlZml4fTBtYCxcclxuXHQvLyBib2xkL2JyaWdodFxyXG5cdGJsZDogYCR7cHJlZml4fTFtYCxcclxuXHQvLyBkaW1cclxuXHRkaW06IGAke3ByZWZpeH0ybWBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbDsiLCIvLyNyZWdpb24gTGljZW5jZSBpbmZvcm1hdGlvbiBcclxuLypcclxuXHQqIFRoaXMgaXMgYSBuZWFyLWRpcmVjdCBwb3J0IG9mIFJvYmVydCBQZW5uZXIncyBlYXNpbmcgZXF1YXRpb25zLiBQbGVhc2Ugc2hvd2VyIFJvYmVydCB3aXRoXHJcblx0KiBwcmFpc2UgYW5kIGFsbCBvZiB5b3VyIGFkbWlyYXRpb24uIEhpcyBsaWNlbnNlIGlzIHByb3ZpZGVkIGJlbG93LlxyXG5cdCpcclxuXHQqIEZvciBpbmZvcm1hdGlvbiBvbiBob3cgdG8gdXNlIHRoZXNlIGZ1bmN0aW9ucyBpbiB5b3VyIGFuaW1hdGlvbnMsIGNoZWNrIG91dCBteSBmb2xsb3dpbmcgdHV0b3JpYWw6IFxyXG5cdCogaHR0cDovL2JpdC5seS8xOGlISEtxXHJcblx0KlxyXG5cdCogLUtpcnVwYVxyXG5cdCovXHJcblxyXG5cdC8qXHJcblx0KiBAYXV0aG9yIFJvYmVydCBQZW5uZXJcclxuXHQqIEBsaWNlbnNlIFxyXG5cdCogVEVSTVMgT0YgVVNFIC0gRUFTSU5HIEVRVUFUSU9OU1xyXG5cdCogXHJcblx0KiBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuIFxyXG5cdCogXHJcblx0KiBDb3B5cmlnaHQgwqkgMjAwMSBSb2JlcnQgUGVubmVyXHJcblx0KiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5cdCogXHJcblx0KiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLCBcclxuXHQqIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuXHQqIFxyXG5cdCogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgXHJcblx0KiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcblx0KiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBcclxuXHQqIG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIFxyXG5cdCogcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG5cdCogXHJcblx0KiBOZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBhdXRob3Igbm9yIHRoZSBuYW1lcyBvZiBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBcclxuXHQqIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcblx0KiBcclxuXHQqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgXHJcblx0KiBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0ZcclxuXHQqIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG5cdCogQ09QWVJJR0hUIE9XTkVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxyXG5cdCogRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFXHJcblx0KiBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgXHJcblx0KiBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xyXG5cdCogTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgXHJcblx0KiBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuIFxyXG5cdCpcclxuKi9cclxuLy8jZW5kcmVnaW9uXHJcblxyXG4vKipcclxuKiBQcm92aWRlcyBlYXNpbmcgY2FsY3VsYXRpb24gbWV0aG9kcy5cclxuKiBAbmFtZSBlYXNpbmdFcXVhdGlvbnNcclxuKiBAZGVzY3JpcHRpb24ge0BsaW5rIGh0dHBzOi8vZWFzaW5ncy5uZXQvZW58U2VlIHRoZSBFYXNpbmcgY2hlYXQgc2hlZXR9IGZvciBhIHZpc3VhbCByZXByZXNlbnRhdGlvbiBmb3IgZWFjaCBjdXJ2ZSBmb3JtdWxhLiBPcmlnaW5hbGx5IGRldmVsb3BlZCBieSB7QGxpbmsgaHR0cDovL3JvYmVydHBlbm5lci5jb20vZWFzaW5nL3xSb2JlcnQgUGVubmVyfVxyXG4qL1xyXG52YXIgZWFzaW5nRXF1YXRpb25zID0ge1xyXG5cdGxpbmVhckVhc2U6IHJlcXVpcmUoICcuL2Vhc2luZy9saW5lYXJFYXNlLmpzJyApLFxyXG5cdGVhc2VJblF1YWQ6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5RdWFkLmpzJyApLFxyXG5cdGVhc2VPdXRRdWFkOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZU91dFF1YWQuanMnICksXHJcblx0ZWFzZUluT3V0UXVhZDogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbk91dFF1YWQuanMnICksXHJcblx0ZWFzZUluQ3ViaWM6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5DdWJpYy5qcycgKSxcclxuXHRlYXNlT3V0Q3ViaWM6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlT3V0Q3ViaWMuanMnICksXHJcblx0ZWFzZUluT3V0Q3ViaWM6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5PdXRDdWJpYy5qcycgKSxcclxuXHRlYXNlSW5RdWFydDogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJblF1YXJ0LmpzJyApLFxyXG5cdGVhc2VPdXRRdWFydDogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VPdXRRdWFydC5qcycgKSxcclxuXHRlYXNlSW5PdXRRdWFydDogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbk91dFF1YXJ0LmpzJyApLFxyXG5cdGVhc2VJblF1aW50OiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluUXVpbnQuanMnICksXHJcblx0ZWFzZU91dFF1aW50OiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZU91dFF1aW50LmpzJyApLFxyXG5cdGVhc2VJbk91dFF1aW50OiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluT3V0UXVpbnQuanMnICksXHJcblx0ZWFzZUluU2luZTogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJblNpbmUuanMnICksXHJcblx0ZWFzZU91dFNpbmU6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlT3V0U2luZS5qcycgKSxcclxuXHRlYXNlSW5PdXRTaW5lOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluT3V0U2luZS5qcycgKSxcclxuXHRlYXNlSW5FeHBvOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluRXhwby5qcycgKSxcclxuXHRlYXNlT3V0RXhwbzogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VPdXRFeHBvLmpzJyApLFxyXG5cdGVhc2VJbk91dEV4cG86IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5PdXRFeHBvLmpzJyApLFxyXG5cdGVhc2VJbkNpcmM6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5DaXJjLmpzJyApLFxyXG5cdGVhc2VPdXRDaXJjOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZU91dENpcmMuanMnICksXHJcblx0ZWFzZUluT3V0Q2lyYzogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbk91dENpcmMuanMnICksXHJcblx0ZWFzZUluRWxhc3RpYzogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbkVsYXN0aWMuanMnICksXHJcblx0ZWFzZU91dEVsYXN0aWM6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlT3V0RWxhc3RpYy5qcycgKSxcclxuXHRlYXNlSW5PdXRFbGFzdGljOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluT3V0RWxhc3RpYy5qcycgKSxcclxuXHRlYXNlT3V0QmFjazogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VPdXRCYWNrLmpzJyApLFxyXG5cdGVhc2VJbkJhY2s6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5CYWNrLmpzJyApLFxyXG5cdGVhc2VJbk91dEJhY2s6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5PdXRCYWNrLmpzJyApLFxyXG5cdGVhc2VPdXRCb3VuY2U6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlT3V0Qm91bmNlLmpzJyApLFxyXG5cdGVhc2VJbkJvdW5jZTogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbkJvdW5jZS5qcycgKSxcclxuXHRlYXNlSW5PdXRCb3VuY2U6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5PdXRCb3VuY2UuanMnIClcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmVhc2luZ0VxdWF0aW9ucyA9IGVhc2luZ0VxdWF0aW9uczsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gPHA+RnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlSW5CYWNrLjwvcD4gPHA+U2VlIDxhIGhyZWY9XCIgaHR0cHM6Ly9lYXNpbmdzLm5ldC8jZWFzZUluUXVhZFwiPmVhc2VJblF1YWQ8L2E+IGZvciBhIHZpc3VhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgY3VydmUgYW5kIGZ1cnRoZXIgaW5mb3JtYXRpb24uPC9wPjxwPk5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgPHN0cm9uZz5ub3Q8L3N0cm9uZz4gY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseS48L3A+XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IFtvdmVyc2hvb3Q9MS43MDE1OF0gLSBhIHJhdGlvIG9mIHRoZSB7c3RhcnRWYWx1ZX0gYW5kIHtjaGFuZ2VJblZhbHVlfSB0byBnaXZlIHRoZSBlZmZlY3Qgb2YgXCJvdmVyc2hvb3RpbmdcIiB0aGUgaW5pdGlhbCB7c3RhcnRWYWx1ZX0gKGVhc2VJbiksIFwib3ZlcnNob290aW5nXCIgZmluYWwgdmFsdWUge3N0YXJ0VmFsdWUgKyBjaGFuZ2VJblZhbHVlfSAoZWFzZU91dCkgb3IgYm90aCAoZWFzZUluT3V0KS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluQmFjayhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9ucyxcclxuICAgIG92ZXJzaG9vdFxyXG4pIHtcclxuICAgIGlmICggb3ZlcnNob290ID09IHVuZGVmaW5lZCApIG92ZXJzaG9vdCA9IDEuNzAxNTg7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyApICogY3VycmVudEl0ZXJhdGlvbiAqICggKCBvdmVyc2hvb3QgKyAxKSAqIGN1cnJlbnRJdGVyYXRpb24gLSBvdmVyc2hvb3QgKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluQmFjazsiLCJjb25zdCBlYXNlT3V0Qm91bmNlID0gcmVxdWlyZSggJy4vZWFzZU91dEJvdW5jZS5qcycgKVxyXG5cclxuLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluQm91bmNlLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5Cb3VuY2UoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAtIGVhc2VPdXRCb3VuY2UoIHRvdGFsSXRlcmF0aW9ucyAtIGN1cnJlbnRJdGVyYXRpb24sIDAsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucyApICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5Cb3VuY2U7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluQ2lyYy4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluQ2lyYyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogKDEgLSBNYXRoLnNxcnQoMSAtIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiBjdXJyZW50SXRlcmF0aW9uKSkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJbkNpcmM7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluQ3ViaWMuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbkN1YmljKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCAzKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluQ3ViaWM7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluRWxhc3RpYy4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluRWxhc3RpYyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHZhciBzID0gMS43MDE1ODtcclxuXHRcdHZhciBwID0gMDtcclxuXHRcdHZhciBhID0gY2hhbmdlSW5WYWx1ZTtcclxuXHRcdGlmIChjdXJyZW50SXRlcmF0aW9uID09IDApIHJldHVybiBzdGFydFZhbHVlO1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgPT0gMSkgcmV0dXJuIHN0YXJ0VmFsdWUgKyBjaGFuZ2VJblZhbHVlO1xyXG5cdFx0aWYgKCFwKSBwID0gdG90YWxJdGVyYXRpb25zICogLjM7XHJcblx0XHRpZiAoYSA8IE1hdGguYWJzKGNoYW5nZUluVmFsdWUpKSB7XHJcblx0XHRcdGEgPSBjaGFuZ2VJblZhbHVlO1xyXG5cdFx0XHR2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjaGFuZ2VJblZhbHVlIC8gYSlcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gLShhICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAtPSAxKSkgKiBNYXRoLnNpbigoY3VycmVudEl0ZXJhdGlvbiAqIHRvdGFsSXRlcmF0aW9ucyAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluRWxhc3RpYzsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlSW5FeHBvLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5FeHBvKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdygyLCAxMCAqIChjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSkpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5FeHBvOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbk91dEJhY2suIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gW292ZXJzaG9vdD0xLjcwMTU4XSAtIGEgcmF0aW8gb2YgdGhlIHtzdGFydFZhbHVlfSBhbmQge2NoYW5nZUluVmFsdWV9IHRvIGdpdmUgdGhlIGVmZmVjdCBvZiBcIm92ZXJzaG9vdGluZ1wiIHRoZSBpbml0aWFsIHtzdGFydFZhbHVlfSAoZWFzZUluKiksIFwib3ZlcnNob290aW5nXCIgZmluYWwgdmFsdWUge3N0YXJ0VmFsdWUgKyBjaGFuZ2VJblZhbHVlfSAoZWFzZU91dCopIG9yIGJvdGggKGVhc2VJbk91dCopLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5PdXRCYWNrKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zLFxyXG4gICAgb3ZlcnNob290XHJcbikge1xyXG4gICAgaWYgKCBvdmVyc2hvb3QgPT0gdW5kZWZpbmVkICkgb3ZlcnNob290ID0gMS43MDE1ODtcclxuICAgIGlmICggKCBjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIgKSA8IDEgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKCBjdXJyZW50SXRlcmF0aW9uICogY3VycmVudEl0ZXJhdGlvbiAqICgoICggb3ZlcnNob290ICo9IDEuNTI1ICkgKyAxICkgKiBjdXJyZW50SXRlcmF0aW9uIC0gb3ZlcnNob290ICkgKSArIHN0YXJ0VmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoICggY3VycmVudEl0ZXJhdGlvbiAtPSAyICkgKiBjdXJyZW50SXRlcmF0aW9uICogKCAoICggb3ZlcnNob290ICo9IDEuNTI1ICkgKyAxICkgKiBjdXJyZW50SXRlcmF0aW9uICsgb3ZlcnNob290ICkgKyAyICkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJbk91dEJhY2s7IiwiY29uc3QgZWFzZUluQm91bmNlID0gcmVxdWlyZSggJy4vZWFzZUluQm91bmNlLmpzJyApO1xyXG5jb25zdCBlYXNlT3V0Qm91bmNlID0gcmVxdWlyZSggJy4vZWFzZU91dEJvdW5jZS5qcycgKTtcclxuXHJcbi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbk91dEJvdW5jZS4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluT3V0Qm91bmNlKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgaWYgKCBjdXJyZW50SXRlcmF0aW9uIDwgdG90YWxJdGVyYXRpb25zIC8gMiApIHtcclxuICAgICAgICByZXR1cm4gZWFzZUluQm91bmNlKCBjdXJyZW50SXRlcmF0aW9uICogMiwgMCwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zICkgKiAuNSArIHN0YXJ0VmFsdWU7XHJcbiAgICB9XHJcblx0cmV0dXJuIGVhc2VPdXRCb3VuY2UoIGN1cnJlbnRJdGVyYXRpb24gKiAyIC0gdG90YWxJdGVyYXRpb25zLCAwLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMgKSAqIC41ICsgY2hhbmdlSW5WYWx1ZSAqIC41ICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5PdXRCb3VuY2U7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluT3V0Q2lyYy4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluT3V0Q2lyYyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuICAgICAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoMSAtIE1hdGguc3FydCgxIC0gY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiAtPSAyKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgMSkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJbk91dENpcmM7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluT3V0Q3ViaWMuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbk91dEN1YmljKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgaWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDMpICsgc3RhcnRWYWx1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC0gMiwgMykgKyAyKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluT3V0Q3ViaWM7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluT3V0RWxhc3RpYy4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluT3V0RWxhc3RpYyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHZhciBzID0gMS43MDE1ODtcclxuICAgIHZhciBwID0gMDtcclxuICAgIHZhciBhID0gY2hhbmdlSW5WYWx1ZTtcclxuICAgIGlmICggY3VycmVudEl0ZXJhdGlvbiA9PSAwICkgcmV0dXJuIHN0YXJ0VmFsdWU7XHJcbiAgICBpZiAoICggY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyICkgPT0gMiApIHJldHVybiBzdGFydFZhbHVlICsgY2hhbmdlSW5WYWx1ZTtcclxuICAgIGlmICggIXAgKSBwID0gdG90YWxJdGVyYXRpb25zICogKCAuMyAqIDEuNSApO1xyXG4gICAgaWYgKCBhIDwgTWF0aC5hYnMoIGNoYW5nZUluVmFsdWUgKSApIHtcclxuICAgICAgICBhID0gY2hhbmdlSW5WYWx1ZTtcclxuICAgICAgICB2YXIgcyA9IHAgLyA0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgcyA9IHAgLyAoIDIgKiBNYXRoLlBJICkgKiBNYXRoLmFzaW4oIGNoYW5nZUluVmFsdWUgIC8gYSApO1xyXG4gICAgfTtcclxuICAgIGlmICggY3VycmVudEl0ZXJhdGlvbiA8IDEgKSB7XHJcbiAgICAgICAgcmV0dXJuIC0uNSAqICggYSAqIE1hdGgucG93KCAyLCAxMCAqICggY3VycmVudEl0ZXJhdGlvbiAtPSAxICkgKSAqIE1hdGguc2luKCAoIGN1cnJlbnRJdGVyYXRpb24gKiB0b3RhbEl0ZXJhdGlvbnMgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKSArIHN0YXJ0VmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYSAqIE1hdGgucG93KCAyLCAtMTAgKiAoIGN1cnJlbnRJdGVyYXRpb24gLT0gMSApICkgKiBNYXRoLnNpbiggKCBjdXJyZW50SXRlcmF0aW9uICogdG90YWxJdGVyYXRpb25zIC0gcyApICogKCAyICogTWF0aC5QSSkgLyBwICkgKiAuNSArIGNoYW5nZUluVmFsdWUgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJbk91dEVsYXN0aWM7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluT3V0RXhwby4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluT3V0RXhwbyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuICAgICAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdygyLCAxMCAqIChjdXJyZW50SXRlcmF0aW9uIC0gMSkpICsgc3RhcnRWYWx1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqICgtTWF0aC5wb3coMiwgLTEwICogLS1jdXJyZW50SXRlcmF0aW9uKSArIDIpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5PdXRFeHBvOyIsIi8qKlxyXG4qIEBzdW1tYXJ5IGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluT3V0UXVhZC4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh3aGVyZSB7Y3VycmVudEl0ZXJhdGlvbiBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9ucyAgXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbk91dFF1YWQoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICBpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24gKyBzdGFydFZhbHVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIC1jaGFuZ2VJblZhbHVlIC8gMiAqICgtLWN1cnJlbnRJdGVyYXRpb24gKiAoY3VycmVudEl0ZXJhdGlvbiAtIDIpIC0gMSkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJbk91dFF1YWQ7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluT3V0UXVhcnQuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuIFxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5PdXRRdWFydChcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuICAgICAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCA0KSArIHN0YXJ0VmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCA0KSAtIDIpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5PdXRRdWFydDsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlSW5PdXRRdWludC4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluT3V0UXVpbnQoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICBpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgNSkgKyBzdGFydFZhbHVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCA1KSArIDIpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5PdXRRdWludDsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlSW5PdXRTaW5lLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5PdXRTaW5lKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKDEgLSBNYXRoLmNvcyhNYXRoLlBJICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5PdXRTaW5lOyIsIi8qKlxyXG4qIEBzdW1tYXJ5IGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluUXVhZC4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh3aGVyZSB7Y3VycmVudEl0ZXJhdGlvbiBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5LiBTZWUge0BsaW5rIGh0dHBzOi8vZWFzaW5ncy5uZXQvI2Vhc2VJblF1YWQgZWFzZUluUXVhZH0gZm9yIGEgdmlzdWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjdXJ2ZSBhbmQgZnVydGhlciBpbmZvcm1hdGlvbi5cclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJblF1YWQoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiBjdXJyZW50SXRlcmF0aW9uICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5RdWFkOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJblF1YXJ0LiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5RdWFydChcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgNCkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJblF1YXJ0OyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJblF1aW50LiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5RdWludChcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgNSkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJblF1aW50OyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJblNpbmUuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHkuIFNlZSB7QGxpbmsgaHR0cHM6Ly9lYXNpbmdzLm5ldC8jZWFzZUluU2luZSBlYXNlSW5TaW5lfSBmb3IgYSB2aXN1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGN1cnZlIGFuZCBmdXJ0aGVyIGluZm9ybWF0aW9uLiAgXHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5TaW5lKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoIDEgLSBNYXRoLmNvcyggY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAqICggTWF0aC5QSSAvIDIgKSApICkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJblNpbmU7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZU91dEJhY2suIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gW292ZXJzaG9vdD0xLjcwMTU4XSAtIGEgcmF0aW8gb2YgdGhlIHtzdGFydFZhbHVlfSBhbmQge2NoYW5nZUluVmFsdWV9IHRvIGdpdmUgdGhlIGVmZmVjdCBvZiBcIm92ZXJzaG9vdGluZ1wiIHRoZSBpbml0aWFsIHtzdGFydFZhbHVlfSAoZWFzZUluKiksIFwib3ZlcnNob290aW5nXCIgZmluYWwgdmFsdWUge3N0YXJ0VmFsdWUgKyBjaGFuZ2VJblZhbHVlfSAoZWFzZU91dCopIG9yIGJvdGggKGVhc2VJbk91dCopLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlT3V0QmFjayhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9ucyxcclxuICAgIG92ZXJzaG9vdFxyXG4pIHtcclxuICAgIGlmICggb3ZlcnNob290ID09IHVuZGVmaW5lZCApIG92ZXJzaG9vdCA9IDEuNzAxNTg7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICggKCBjdXJyZW50SXRlcmF0aW9uID0gY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEgKSAqIGN1cnJlbnRJdGVyYXRpb24gKiAoICggb3ZlcnNob290ICsgMSApICogY3VycmVudEl0ZXJhdGlvbiArIG92ZXJzaG9vdCApICsgMSApICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlT3V0QmFjazsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlT3V0Qm91bmNlLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlT3V0Qm91bmNlKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgaWYgKCAoIGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zICkgPCAxIC8gMi43NSApIHtcclxuICAgICAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICggNy41NjI1ICogY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24gKSArIHN0YXJ0VmFsdWU7XHJcbiAgICB9IGVsc2UgaWYgKCBjdXJyZW50SXRlcmF0aW9uIDwgMiAvIDIuNzUgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoIDcuNTYyNSAqICggY3VycmVudEl0ZXJhdGlvbiAtPSAxLjUgLyAyLjc1ICkgKiBjdXJyZW50SXRlcmF0aW9uICsgLjc1ICkgKyBzdGFydFZhbHVlO1xyXG4gICAgfSBlbHNlIGlmICggY3VycmVudEl0ZXJhdGlvbiA8IDIuNSAvIDIuNzUgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoIDcuNTYyNSAqICggY3VycmVudEl0ZXJhdGlvbiAtPSAyLjI1IC8gMi43NSApICogY3VycmVudEl0ZXJhdGlvbiArIC45Mzc1ICkgKyBzdGFydFZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICggNy41NjI1ICogKCBjdXJyZW50SXRlcmF0aW9uIC09IDIuNjI1IC8gMi43NSApICogY3VycmVudEl0ZXJhdGlvbiArIC45ODQzNzUgKSArIHN0YXJ0VmFsdWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZU91dEJvdW5jZTsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlT3V0Q2lyYy4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZU91dENpcmMoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gPSBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSkgKiBjdXJyZW50SXRlcmF0aW9uKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZU91dENpcmM7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZU91dEN1YmljLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlT3V0Q3ViaWMoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgMykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZU91dEN1YmljOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VPdXRFbGFzdGljLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlT3V0RWxhc3RpYyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHZhciBzID0gMS43MDE1ODtcclxuICAgIHZhciBwID0gMDtcclxuICAgIHZhciBhID0gY2hhbmdlSW5WYWx1ZTtcclxuICAgIGlmICggY3VycmVudEl0ZXJhdGlvbiA9PSAwICkgcmV0dXJuIHN0YXJ0VmFsdWU7XHJcbiAgICBpZiAoICggY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgKSA9PSAxICkgcmV0dXJuIHN0YXJ0VmFsdWUgKyBjaGFuZ2VJblZhbHVlO1xyXG4gICAgaWYgKCAhcCApIHAgPSB0b3RhbEl0ZXJhdGlvbnMgKiAuMztcclxuICAgIGlmICggYSA8IE1hdGguYWJzKCBjaGFuZ2VJblZhbHVlICkgKSB7XHJcbiAgICAgICAgYSA9IGNoYW5nZUluVmFsdWU7XHJcbiAgICAgICAgdmFyIHMgPSBwIC8gNDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIHMgPSBwIC8gKCAyICogTWF0aC5QSSApICogTWF0aC5hc2luKCBjaGFuZ2VJblZhbHVlIC8gYSApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGEgKiBNYXRoLnBvdyggMiwgLTEwICogY3VycmVudEl0ZXJhdGlvbiApICogTWF0aC5zaW4oICggY3VycmVudEl0ZXJhdGlvbiAqIHRvdGFsSXRlcmF0aW9ucyAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSArIGNoYW5nZUluVmFsdWUgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VPdXRFbGFzdGljOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VPdXRFeHBvLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlT3V0RXhwbyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogKC1NYXRoLnBvdygyLCAtMTAgKiBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zKSArIDEpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlT3V0RXhwbzsiLCIvKipcclxuKiBAc3VtbWFyeSBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VPdXRRdWFkLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHdoZXJlIHtjdXJyZW50SXRlcmF0aW9uIGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHkuIFNlZSB7QGxpbmsgaHR0cHM6Ly9lYXNpbmdzLm5ldC8jZWFzZU91dFF1YWQgZWFzZU91dFF1YWR9IGZvciBhIHZpc3VhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgY3VydmUgYW5kIGZ1cnRoZXIgaW5mb3JtYXRpb24uXHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlT3V0UXVhZChcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiAtY2hhbmdlSW5WYWx1ZSAqIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiAoY3VycmVudEl0ZXJhdGlvbiAtIDIpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlT3V0UXVhZDsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlT3V0UXVhcnQuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VPdXRRdWFydChcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiAtY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgNCkgLSAxKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZU91dFF1YXJ0OyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VPdXRRdWludC4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZU91dFF1aW50KFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDUpICsgMSkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VPdXRRdWludDsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlT3V0U2luZS4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZU91dFNpbmUoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGguc2luKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKiAoTWF0aC5QSSAvIDIpKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZU91dFNpbmU7IiwiLyoqXHJcbiogQHN1bW1hcnkgZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBsaW5lYXJFYXNlLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHdoZXJlIHtjdXJyZW50SXRlcmF0aW9uIGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHkuXHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBsaW5lYXJFYXNlKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaW5lYXJFYXNlOyIsIi8qKlxyXG4qIHByb3ZpZGVzIG1hdGhzIHV0aWxpbGl0eSBtZXRob2RzIGFuZCBoZWxwZXJzLlxyXG4qXHJcbiogQG1vZHVsZSBtYXRoVXRpbHNcclxuKi9cclxuXHJcbnZhciBtYXRoVXRpbHMgPSB7XHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tSW50ZWdlcjogZnVuY3Rpb24gcmFuZG9tSW50ZWdlcihtaW4sIG1heCkge1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggKyAxIC0gbWluKSApICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2VuZXJhdGUgcmFuZG9tIGZsb2F0IGJldHdlZW4gMiB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IC0gbWF4aW11bSB2YWx1ZS5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRyYW5kb206IGZ1bmN0aW9uIHJhbmRvbShtaW4sIG1heCkge1xyXG5cdFx0aWYgKG1pbiA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdG1pbiA9IDA7XHJcblx0XHRcdG1heCA9IDE7XHJcblx0XHR9IGVsc2UgaWYgKG1heCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdG1heCA9IG1pbjtcclxuXHRcdFx0bWluID0gMDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcblx0fSxcclxuXHJcblx0Z2V0UmFuZG9tQXJiaXRyYXJ5OiBmdW5jdGlvbiBnZXRSYW5kb21BcmJpdHJhcnkobWluLCBtYXgpIHtcclxuXHRcdHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcblx0fSxcclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIFRyYW5zZm9ybXMgdmFsdWUgcHJvcG9ydGlvbmF0ZWx5IGJldHdlZW4gaW5wdXQgcmFuZ2UgYW5kIG91dHB1dCByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gdGhlIHZhbHVlIGluIHRoZSBvcmlnaW4gcmFuZ2UgKCBtaW4xL21heDEgKS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbjEgLSBtaW5pbXVtIHZhbHVlIGluIG9yaWdpbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heDEgLSBtYXhpbXVtIHZhbHVlIGluIG9yaWdpbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbjIgLSBtaW5pbXVtIHZhbHVlIGluIGRlc3RpbmF0aW9uIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4MiAtIG1heGltdW0gdmFsdWUgaW4gZGVzdGluYXRpb24gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjbGFtcFJlc3VsdCAtIGNsYW1wIHJlc3VsdCBiZXR3ZWVuIGRlc3RpbmF0aW9uIHJhbmdlIGJvdW5kYXJ5cy5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRtYXA6IGZ1bmN0aW9uIG1hcCh2YWx1ZSwgbWluMSwgbWF4MSwgbWluMiwgbWF4MiwgY2xhbXBSZXN1bHQpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHZhciByZXR1cm52YWx1ZSA9ICh2YWx1ZSAtIG1pbjEpIC8gKG1heDEgLSBtaW4xKSAqIChtYXgyIC0gbWluMikgKyBtaW4yO1xyXG5cdFx0aWYgKGNsYW1wUmVzdWx0KSByZXR1cm4gc2VsZi5jbGFtcChyZXR1cm52YWx1ZSwgbWluMiwgbWF4Mik7ZWxzZSByZXR1cm4gcmV0dXJudmFsdWU7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBDbGFtcCB2YWx1ZSBiZXR3ZWVuIHJhbmdlIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gdGhlIHZhbHVlIGluIHRoZSByYW5nZSB7IG1pbnxtYXggfS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUgaW4gdGhlIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IC0gbWF4aW11bSB2YWx1ZSBpbiB0aGUgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjbGFtcFJlc3VsdCAtIGNsYW1wIHJlc3VsdCBiZXR3ZWVuIHJhbmdlIGJvdW5kYXJ5cy5cclxuICovXHJcblx0Y2xhbXA6IGZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW4sIG1heCkge1xyXG5cdFx0aWYgKG1heCA8IG1pbikge1xyXG5cdFx0XHR2YXIgdGVtcCA9IG1pbjtcclxuXHRcdFx0bWluID0gbWF4O1xyXG5cdFx0XHRtYXggPSB0ZW1wO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4odmFsdWUsIG1heCkpO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWF0aFV0aWxzOyIsIi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHNoaW0gYnkgUGF1bCBJcmlzaFxyXG53aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHR3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZWMgfHxcclxuXHRcdFx0ZnVuY3Rpb24oIGNhbGxiYWNrLCBlbGVtZW50ICkge1xyXG5cdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xyXG5cdFx0XHR9O1xyXG59KSgpO1xyXG5cclxuLyoqXHJcbiAqIEJlaGF2ZXMgdGhlIHNhbWUgYXMgc2V0VGltZW91dCBleGNlcHQgdXNlcyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKSB3aGVyZSBwb3NzaWJsZSBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGVsYXkgVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kc1xyXG4gKi9cclxuXHJcbndpbmRvdy5yZXF1ZXN0VGltZW91dCA9IGZ1bmN0aW9uKGZuLCBkZWxheSkge1xyXG5cdGlmICggIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgIXdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgISggd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSAmJiB3aW5kb3cubW96Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKSAmJiAhd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgIXdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSApIHtcclxuXHRcdHJldHVybiB3aW5kb3cuc2V0VGltZW91dChmbiwgZGVsYXkpO1xyXG5cdH1cclxuXHRcdFx0XHJcblx0dmFyIHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCksXHJcblx0XHRoYW5kbGUgPSBuZXcgT2JqZWN0KCk7XHJcblx0XHRcclxuXHRmdW5jdGlvbiBsb29wKCl7XHJcblx0XHR2YXIgY3VycmVudCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxyXG5cdFx0XHRkZWx0YSA9IGN1cnJlbnQgLSBzdGFydDtcclxuXHRcdGRlbHRhID49IGRlbGF5ID8gZm4uY2FsbCgpIDogaGFuZGxlLnZhbHVlID0gcmVxdWVzdEFuaW1GcmFtZShsb29wKTtcclxuXHR9O1xyXG5cdFxyXG5cdGhhbmRsZS52YWx1ZSA9IHJlcXVlc3RBbmltRnJhbWUobG9vcCk7XHJcblx0cmV0dXJuIGhhbmRsZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBCZWhhdmVzIHRoZSBzYW1lIGFzIGNsZWFyVGltZW91dCBleGNlcHQgdXNlcyBjYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKSB3aGVyZSBwb3NzaWJsZSBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXHJcbiAqIEBwYXJhbSB7aW50fG9iamVjdH0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAqL1xyXG53aW5kb3cuY2xlYXJSZXF1ZXN0VGltZW91dCA9IGZ1bmN0aW9uKCBoYW5kbGUgKSB7XHJcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPyB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoIGhhbmRsZS52YWx1ZSApIDpcclxuICAgIHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSA/IHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSggaGFuZGxlLnZhbHVlICkgOlxyXG4gICAgd2luZG93LndlYmtpdENhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSA/IHdpbmRvdy53ZWJraXRDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGhhbmRsZS52YWx1ZSApIDogLyogU3VwcG9ydCBmb3IgbGVnYWN5IEFQSSAqL1xyXG4gICAgd2luZG93Lm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSA/IHdpbmRvdy5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGhhbmRsZS52YWx1ZSApIDpcclxuICAgIHdpbmRvdy5vQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHQ/IHdpbmRvdy5vQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBoYW5kbGUudmFsdWUgKSA6XHJcbiAgICB3aW5kb3cubXNDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPyB3aW5kb3cubXNDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIGhhbmRsZS52YWx1ZSApIDpcclxuICAgIGNsZWFyVGltZW91dCggaGFuZGxlICk7XHJcbn07IiwiLypcclxuICogQSBmYXN0IGphdmFzY3JpcHQgaW1wbGVtZW50YXRpb24gb2Ygc2ltcGxleCBub2lzZSBieSBKb25hcyBXYWduZXJcclxuQmFzZWQgb24gYSBzcGVlZC1pbXByb3ZlZCBzaW1wbGV4IG5vaXNlIGFsZ29yaXRobSBmb3IgMkQsIDNEIGFuZCA0RCBpbiBKYXZhLlxyXG5XaGljaCBpcyBiYXNlZCBvbiBleGFtcGxlIGNvZGUgYnkgU3RlZmFuIEd1c3RhdnNvbiAoc3RlZ3VAaXRuLmxpdS5zZSkuXHJcbldpdGggT3B0aW1pc2F0aW9ucyBieSBQZXRlciBFYXN0bWFuIChwZWFzdG1hbkBkcml6emxlLnN0YW5mb3JkLmVkdSkuXHJcbkJldHRlciByYW5rIG9yZGVyaW5nIG1ldGhvZCBieSBTdGVmYW4gR3VzdGF2c29uIGluIDIwMTIuXHJcblxyXG5Db3B5cmlnaHQgKGMpIDIwMTggSm9uYXMgV2FnbmVyXHJcblxyXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcclxuY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcclxuU09GVFdBUkUuXHJcbiovXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICB2YXIgRjIgPSAwLjUgKiAoTWF0aC5zcXJ0KDMuMCkgLSAxLjApO1xyXG4gIHZhciBHMiA9ICgzLjAgLSBNYXRoLnNxcnQoMy4wKSkgLyA2LjA7XHJcbiAgdmFyIEYzID0gMS4wIC8gMy4wO1xyXG4gIHZhciBHMyA9IDEuMCAvIDYuMDtcclxuICB2YXIgRjQgPSAoTWF0aC5zcXJ0KDUuMCkgLSAxLjApIC8gNC4wO1xyXG4gIHZhciBHNCA9ICg1LjAgLSBNYXRoLnNxcnQoNS4wKSkgLyAyMC4wO1xyXG5cclxuICBmdW5jdGlvbiBTaW1wbGV4Tm9pc2UocmFuZG9tT3JTZWVkKSB7XHJcbiAgICB2YXIgcmFuZG9tO1xyXG4gICAgaWYgKHR5cGVvZiByYW5kb21PclNlZWQgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByYW5kb20gPSByYW5kb21PclNlZWQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChyYW5kb21PclNlZWQpIHtcclxuICAgICAgcmFuZG9tID0gYWxlYShyYW5kb21PclNlZWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmFuZG9tID0gTWF0aC5yYW5kb207XHJcbiAgICB9XHJcbiAgICB0aGlzLnAgPSBidWlsZFBlcm11dGF0aW9uVGFibGUocmFuZG9tKTtcclxuICAgIHRoaXMucGVybSA9IG5ldyBVaW50OEFycmF5KDUxMik7XHJcbiAgICB0aGlzLnBlcm1Nb2QxMiA9IG5ldyBVaW50OEFycmF5KDUxMik7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDUxMjsgaSsrKSB7XHJcbiAgICAgIHRoaXMucGVybVtpXSA9IHRoaXMucFtpICYgMjU1XTtcclxuICAgICAgdGhpcy5wZXJtTW9kMTJbaV0gPSB0aGlzLnBlcm1baV0gJSAxMjtcclxuICAgIH1cclxuXHJcbiAgfVxyXG4gIFNpbXBsZXhOb2lzZS5wcm90b3R5cGUgPSB7XHJcbiAgICBncmFkMzogbmV3IEZsb2F0MzJBcnJheShbMSwgMSwgMCxcclxuICAgICAgLTEsIDEsIDAsXHJcbiAgICAgIDEsIC0xLCAwLFxyXG5cclxuICAgICAgLTEsIC0xLCAwLFxyXG4gICAgICAxLCAwLCAxLFxyXG4gICAgICAtMSwgMCwgMSxcclxuXHJcbiAgICAgIDEsIDAsIC0xLFxyXG4gICAgICAtMSwgMCwgLTEsXHJcbiAgICAgIDAsIDEsIDEsXHJcblxyXG4gICAgICAwLCAtMSwgMSxcclxuICAgICAgMCwgMSwgLTEsXHJcbiAgICAgIDAsIC0xLCAtMV0pLFxyXG4gICAgZ3JhZDQ6IG5ldyBGbG9hdDMyQXJyYXkoWzAsIDEsIDEsIDEsIDAsIDEsIDEsIC0xLCAwLCAxLCAtMSwgMSwgMCwgMSwgLTEsIC0xLFxyXG4gICAgICAwLCAtMSwgMSwgMSwgMCwgLTEsIDEsIC0xLCAwLCAtMSwgLTEsIDEsIDAsIC0xLCAtMSwgLTEsXHJcbiAgICAgIDEsIDAsIDEsIDEsIDEsIDAsIDEsIC0xLCAxLCAwLCAtMSwgMSwgMSwgMCwgLTEsIC0xLFxyXG4gICAgICAtMSwgMCwgMSwgMSwgLTEsIDAsIDEsIC0xLCAtMSwgMCwgLTEsIDEsIC0xLCAwLCAtMSwgLTEsXHJcbiAgICAgIDEsIDEsIDAsIDEsIDEsIDEsIDAsIC0xLCAxLCAtMSwgMCwgMSwgMSwgLTEsIDAsIC0xLFxyXG4gICAgICAtMSwgMSwgMCwgMSwgLTEsIDEsIDAsIC0xLCAtMSwgLTEsIDAsIDEsIC0xLCAtMSwgMCwgLTEsXHJcbiAgICAgIDEsIDEsIDEsIDAsIDEsIDEsIC0xLCAwLCAxLCAtMSwgMSwgMCwgMSwgLTEsIC0xLCAwLFxyXG4gICAgICAtMSwgMSwgMSwgMCwgLTEsIDEsIC0xLCAwLCAtMSwgLTEsIDEsIDAsIC0xLCAtMSwgLTEsIDBdKSxcclxuICAgIG5vaXNlMkQ6IGZ1bmN0aW9uKHhpbiwgeWluKSB7XHJcbiAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMjtcclxuICAgICAgdmFyIHBlcm0gPSB0aGlzLnBlcm07XHJcbiAgICAgIHZhciBncmFkMyA9IHRoaXMuZ3JhZDM7XHJcbiAgICAgIHZhciBuMCA9IDA7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xyXG4gICAgICB2YXIgbjEgPSAwO1xyXG4gICAgICB2YXIgbjIgPSAwO1xyXG4gICAgICAvLyBTa2V3IHRoZSBpbnB1dCBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggc2ltcGxleCBjZWxsIHdlJ3JlIGluXHJcbiAgICAgIHZhciBzID0gKHhpbiArIHlpbikgKiBGMjsgLy8gSGFpcnkgZmFjdG9yIGZvciAyRFxyXG4gICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XHJcbiAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5aW4gKyBzKTtcclxuICAgICAgdmFyIHQgPSAoaSArIGopICogRzI7XHJcbiAgICAgIHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSkgc3BhY2VcclxuICAgICAgdmFyIFkwID0gaiAtIHQ7XHJcbiAgICAgIHZhciB4MCA9IHhpbiAtIFgwOyAvLyBUaGUgeCx5IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxyXG4gICAgICB2YXIgeTAgPSB5aW4gLSBZMDtcclxuICAgICAgLy8gRm9yIHRoZSAyRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhbiBlcXVpbGF0ZXJhbCB0cmlhbmdsZS5cclxuICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxyXG4gICAgICB2YXIgaTEsIGoxOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgKG1pZGRsZSkgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaikgY29vcmRzXHJcbiAgICAgIGlmICh4MCA+IHkwKSB7XHJcbiAgICAgICAgaTEgPSAxO1xyXG4gICAgICAgIGoxID0gMDtcclxuICAgICAgfSAvLyBsb3dlciB0cmlhbmdsZSwgWFkgb3JkZXI6ICgwLDApLT4oMSwwKS0+KDEsMSlcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgaTEgPSAwO1xyXG4gICAgICAgIGoxID0gMTtcclxuICAgICAgfSAvLyB1cHBlciB0cmlhbmdsZSwgWVggb3JkZXI6ICgwLDApLT4oMCwxKS0+KDEsMSlcclxuICAgICAgLy8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXHJcbiAgICAgIC8vIGEgc3RlcCBvZiAoMCwxKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYykgaW4gKHgseSksIHdoZXJlXHJcbiAgICAgIC8vIGMgPSAoMy1zcXJ0KDMpKS82XHJcbiAgICAgIHZhciB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcclxuICAgICAgdmFyIHkxID0geTAgLSBqMSArIEcyO1xyXG4gICAgICB2YXIgeDIgPSB4MCAtIDEuMCArIDIuMCAqIEcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcclxuICAgICAgdmFyIHkyID0geTAgLSAxLjAgKyAyLjAgKiBHMjtcclxuICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSB0aHJlZSBzaW1wbGV4IGNvcm5lcnNcclxuICAgICAgdmFyIGlpID0gaSAmIDI1NTtcclxuICAgICAgdmFyIGpqID0gaiAmIDI1NTtcclxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xyXG4gICAgICB2YXIgdDAgPSAwLjUgLSB4MCAqIHgwIC0geTAgKiB5MDtcclxuICAgICAgaWYgKHQwID49IDApIHtcclxuICAgICAgICB2YXIgZ2kwID0gcGVybU1vZDEyW2lpICsgcGVybVtqal1dICogMztcclxuICAgICAgICB0MCAqPSB0MDtcclxuICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDNbZ2kwXSAqIHgwICsgZ3JhZDNbZ2kwICsgMV0gKiB5MCk7IC8vICh4LHkpIG9mIGdyYWQzIHVzZWQgZm9yIDJEIGdyYWRpZW50XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHQxID0gMC41IC0geDEgKiB4MSAtIHkxICogeTE7XHJcbiAgICAgIGlmICh0MSA+PSAwKSB7XHJcbiAgICAgICAgdmFyIGdpMSA9IHBlcm1Nb2QxMltpaSArIGkxICsgcGVybVtqaiArIGoxXV0gKiAzO1xyXG4gICAgICAgIHQxICo9IHQxO1xyXG4gICAgICAgIG4xID0gdDEgKiB0MSAqIChncmFkM1tnaTFdICogeDEgKyBncmFkM1tnaTEgKyAxXSAqIHkxKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDIgPSAwLjUgLSB4MiAqIHgyIC0geTIgKiB5MjtcclxuICAgICAgaWYgKHQyID49IDApIHtcclxuICAgICAgICB2YXIgZ2kyID0gcGVybU1vZDEyW2lpICsgMSArIHBlcm1bamogKyAxXV0gKiAzO1xyXG4gICAgICAgIHQyICo9IHQyO1xyXG4gICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkM1tnaTJdICogeDIgKyBncmFkM1tnaTIgKyAxXSAqIHkyKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXHJcbiAgICAgIC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHJldHVybiB2YWx1ZXMgaW4gdGhlIGludGVydmFsIFstMSwxXS5cclxuICAgICAgcmV0dXJuIDcwLjAgKiAobjAgKyBuMSArIG4yKTtcclxuICAgIH0sXHJcbiAgICAvLyAzRCBzaW1wbGV4IG5vaXNlXHJcbiAgICBub2lzZTNEOiBmdW5jdGlvbih4aW4sIHlpbiwgemluKSB7XHJcbiAgICAgIHZhciBwZXJtTW9kMTIgPSB0aGlzLnBlcm1Nb2QxMjtcclxuICAgICAgdmFyIHBlcm0gPSB0aGlzLnBlcm07XHJcbiAgICAgIHZhciBncmFkMyA9IHRoaXMuZ3JhZDM7XHJcbiAgICAgIHZhciBuMCwgbjEsIG4yLCBuMzsgLy8gTm9pc2UgY29udHJpYnV0aW9ucyBmcm9tIHRoZSBmb3VyIGNvcm5lcnNcclxuICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxyXG4gICAgICB2YXIgcyA9ICh4aW4gKyB5aW4gKyB6aW4pICogRjM7IC8vIFZlcnkgbmljZSBhbmQgc2ltcGxlIHNrZXcgZmFjdG9yIGZvciAzRFxyXG4gICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XHJcbiAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5aW4gKyBzKTtcclxuICAgICAgdmFyIGsgPSBNYXRoLmZsb29yKHppbiArIHMpO1xyXG4gICAgICB2YXIgdCA9IChpICsgaiArIGspICogRzM7XHJcbiAgICAgIHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSx6KSBzcGFjZVxyXG4gICAgICB2YXIgWTAgPSBqIC0gdDtcclxuICAgICAgdmFyIFowID0gayAtIHQ7XHJcbiAgICAgIHZhciB4MCA9IHhpbiAtIFgwOyAvLyBUaGUgeCx5LHogZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXHJcbiAgICAgIHZhciB5MCA9IHlpbiAtIFkwO1xyXG4gICAgICB2YXIgejAgPSB6aW4gLSBaMDtcclxuICAgICAgLy8gRm9yIHRoZSAzRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhIHNsaWdodGx5IGlycmVndWxhciB0ZXRyYWhlZHJvbi5cclxuICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxyXG4gICAgICB2YXIgaTEsIGoxLCBrMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGosaykgY29vcmRzXHJcbiAgICAgIHZhciBpMiwgajIsIGsyOyAvLyBPZmZzZXRzIGZvciB0aGlyZCBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqLGspIGNvb3Jkc1xyXG4gICAgICBpZiAoeDAgPj0geTApIHtcclxuICAgICAgICBpZiAoeTAgPj0gejApIHtcclxuICAgICAgICAgIGkxID0gMTtcclxuICAgICAgICAgIGoxID0gMDtcclxuICAgICAgICAgIGsxID0gMDtcclxuICAgICAgICAgIGkyID0gMTtcclxuICAgICAgICAgIGoyID0gMTtcclxuICAgICAgICAgIGsyID0gMDtcclxuICAgICAgICB9IC8vIFggWSBaIG9yZGVyXHJcbiAgICAgICAgZWxzZSBpZiAoeDAgPj0gejApIHtcclxuICAgICAgICAgIGkxID0gMTtcclxuICAgICAgICAgIGoxID0gMDtcclxuICAgICAgICAgIGsxID0gMDtcclxuICAgICAgICAgIGkyID0gMTtcclxuICAgICAgICAgIGoyID0gMDtcclxuICAgICAgICAgIGsyID0gMTtcclxuICAgICAgICB9IC8vIFggWiBZIG9yZGVyXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBpMSA9IDA7XHJcbiAgICAgICAgICBqMSA9IDA7XHJcbiAgICAgICAgICBrMSA9IDE7XHJcbiAgICAgICAgICBpMiA9IDE7XHJcbiAgICAgICAgICBqMiA9IDA7XHJcbiAgICAgICAgICBrMiA9IDE7XHJcbiAgICAgICAgfSAvLyBaIFggWSBvcmRlclxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgeyAvLyB4MDx5MFxyXG4gICAgICAgIGlmICh5MCA8IHowKSB7XHJcbiAgICAgICAgICBpMSA9IDA7XHJcbiAgICAgICAgICBqMSA9IDA7XHJcbiAgICAgICAgICBrMSA9IDE7XHJcbiAgICAgICAgICBpMiA9IDA7XHJcbiAgICAgICAgICBqMiA9IDE7XHJcbiAgICAgICAgICBrMiA9IDE7XHJcbiAgICAgICAgfSAvLyBaIFkgWCBvcmRlclxyXG4gICAgICAgIGVsc2UgaWYgKHgwIDwgejApIHtcclxuICAgICAgICAgIGkxID0gMDtcclxuICAgICAgICAgIGoxID0gMTtcclxuICAgICAgICAgIGsxID0gMDtcclxuICAgICAgICAgIGkyID0gMDtcclxuICAgICAgICAgIGoyID0gMTtcclxuICAgICAgICAgIGsyID0gMTtcclxuICAgICAgICB9IC8vIFkgWiBYIG9yZGVyXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBpMSA9IDA7XHJcbiAgICAgICAgICBqMSA9IDE7XHJcbiAgICAgICAgICBrMSA9IDA7XHJcbiAgICAgICAgICBpMiA9IDE7XHJcbiAgICAgICAgICBqMiA9IDE7XHJcbiAgICAgICAgICBrMiA9IDA7XHJcbiAgICAgICAgfSAvLyBZIFggWiBvcmRlclxyXG4gICAgICB9XHJcbiAgICAgIC8vIEEgc3RlcCBvZiAoMSwwLDApIGluIChpLGosaykgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMsLWMpIGluICh4LHkseiksXHJcbiAgICAgIC8vIGEgc3RlcCBvZiAoMCwxLDApIGluIChpLGosaykgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMsLWMpIGluICh4LHkseiksIGFuZFxyXG4gICAgICAvLyBhIHN0ZXAgb2YgKDAsMCwxKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoLWMsLWMsMS1jKSBpbiAoeCx5LHopLCB3aGVyZVxyXG4gICAgICAvLyBjID0gMS82LlxyXG4gICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzM7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcclxuICAgICAgdmFyIHkxID0geTAgLSBqMSArIEczO1xyXG4gICAgICB2YXIgejEgPSB6MCAtIGsxICsgRzM7XHJcbiAgICAgIHZhciB4MiA9IHgwIC0gaTIgKyAyLjAgKiBHMzsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIGluICh4LHkseikgY29vcmRzXHJcbiAgICAgIHZhciB5MiA9IHkwIC0gajIgKyAyLjAgKiBHMztcclxuICAgICAgdmFyIHoyID0gejAgLSBrMiArIDIuMCAqIEczO1xyXG4gICAgICB2YXIgeDMgPSB4MCAtIDEuMCArIDMuMCAqIEczOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xyXG4gICAgICB2YXIgeTMgPSB5MCAtIDEuMCArIDMuMCAqIEczO1xyXG4gICAgICB2YXIgejMgPSB6MCAtIDEuMCArIDMuMCAqIEczO1xyXG4gICAgICAvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIGZvdXIgc2ltcGxleCBjb3JuZXJzXHJcbiAgICAgIHZhciBpaSA9IGkgJiAyNTU7XHJcbiAgICAgIHZhciBqaiA9IGogJiAyNTU7XHJcbiAgICAgIHZhciBrayA9IGsgJiAyNTU7XHJcbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIGZvdXIgY29ybmVyc1xyXG4gICAgICB2YXIgdDAgPSAwLjYgLSB4MCAqIHgwIC0geTAgKiB5MCAtIHowICogejA7XHJcbiAgICAgIGlmICh0MCA8IDApIG4wID0gMC4wO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZ2kwID0gcGVybU1vZDEyW2lpICsgcGVybVtqaiArIHBlcm1ba2tdXV0gKiAzO1xyXG4gICAgICAgIHQwICo9IHQwO1xyXG4gICAgICAgIG4wID0gdDAgKiB0MCAqIChncmFkM1tnaTBdICogeDAgKyBncmFkM1tnaTAgKyAxXSAqIHkwICsgZ3JhZDNbZ2kwICsgMl0gKiB6MCk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHQxID0gMC42IC0geDEgKiB4MSAtIHkxICogeTEgLSB6MSAqIHoxO1xyXG4gICAgICBpZiAodDEgPCAwKSBuMSA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMSA9IHBlcm1Nb2QxMltpaSArIGkxICsgcGVybVtqaiArIGoxICsgcGVybVtrayArIGsxXV1dICogMztcclxuICAgICAgICB0MSAqPSB0MTtcclxuICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDNbZ2kxXSAqIHgxICsgZ3JhZDNbZ2kxICsgMV0gKiB5MSArIGdyYWQzW2dpMSArIDJdICogejEpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciB0MiA9IDAuNiAtIHgyICogeDIgLSB5MiAqIHkyIC0gejIgKiB6MjtcclxuICAgICAgaWYgKHQyIDwgMCkgbjIgPSAwLjA7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBnaTIgPSBwZXJtTW9kMTJbaWkgKyBpMiArIHBlcm1bamogKyBqMiArIHBlcm1ba2sgKyBrMl1dXSAqIDM7XHJcbiAgICAgICAgdDIgKj0gdDI7XHJcbiAgICAgICAgbjIgPSB0MiAqIHQyICogKGdyYWQzW2dpMl0gKiB4MiArIGdyYWQzW2dpMiArIDFdICogeTIgKyBncmFkM1tnaTIgKyAyXSAqIHoyKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDMgPSAwLjYgLSB4MyAqIHgzIC0geTMgKiB5MyAtIHozICogejM7XHJcbiAgICAgIGlmICh0MyA8IDApIG4zID0gMC4wO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZ2kzID0gcGVybU1vZDEyW2lpICsgMSArIHBlcm1bamogKyAxICsgcGVybVtrayArIDFdXV0gKiAzO1xyXG4gICAgICAgIHQzICo9IHQzO1xyXG4gICAgICAgIG4zID0gdDMgKiB0MyAqIChncmFkM1tnaTNdICogeDMgKyBncmFkM1tnaTMgKyAxXSAqIHkzICsgZ3JhZDNbZ2kzICsgMl0gKiB6Myk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxyXG4gICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byBzdGF5IGp1c3QgaW5zaWRlIFstMSwxXVxyXG4gICAgICByZXR1cm4gMzIuMCAqIChuMCArIG4xICsgbjIgKyBuMyk7XHJcbiAgICB9LFxyXG4gICAgLy8gNEQgc2ltcGxleCBub2lzZSwgYmV0dGVyIHNpbXBsZXggcmFuayBvcmRlcmluZyBtZXRob2QgMjAxMi0wMy0wOVxyXG4gICAgbm9pc2U0RDogZnVuY3Rpb24oeCwgeSwgeiwgdykge1xyXG4gICAgICB2YXIgcGVybSA9IHRoaXMucGVybTtcclxuICAgICAgdmFyIGdyYWQ0ID0gdGhpcy5ncmFkNDtcclxuXHJcbiAgICAgIHZhciBuMCwgbjEsIG4yLCBuMywgbjQ7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgZml2ZSBjb3JuZXJzXHJcbiAgICAgIC8vIFNrZXcgdGhlICh4LHkseix3KSBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggY2VsbCBvZiAyNCBzaW1wbGljZXMgd2UncmUgaW5cclxuICAgICAgdmFyIHMgPSAoeCArIHkgKyB6ICsgdykgKiBGNDsgLy8gRmFjdG9yIGZvciA0RCBza2V3aW5nXHJcbiAgICAgIHZhciBpID0gTWF0aC5mbG9vcih4ICsgcyk7XHJcbiAgICAgIHZhciBqID0gTWF0aC5mbG9vcih5ICsgcyk7XHJcbiAgICAgIHZhciBrID0gTWF0aC5mbG9vcih6ICsgcyk7XHJcbiAgICAgIHZhciBsID0gTWF0aC5mbG9vcih3ICsgcyk7XHJcbiAgICAgIHZhciB0ID0gKGkgKyBqICsgayArIGwpICogRzQ7IC8vIEZhY3RvciBmb3IgNEQgdW5za2V3aW5nXHJcbiAgICAgIHZhciBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSx6LHcpIHNwYWNlXHJcbiAgICAgIHZhciBZMCA9IGogLSB0O1xyXG4gICAgICB2YXIgWjAgPSBrIC0gdDtcclxuICAgICAgdmFyIFcwID0gbCAtIHQ7XHJcbiAgICAgIHZhciB4MCA9IHggLSBYMDsgLy8gVGhlIHgseSx6LHcgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXHJcbiAgICAgIHZhciB5MCA9IHkgLSBZMDtcclxuICAgICAgdmFyIHowID0geiAtIFowO1xyXG4gICAgICB2YXIgdzAgPSB3IC0gVzA7XHJcbiAgICAgIC8vIEZvciB0aGUgNEQgY2FzZSwgdGhlIHNpbXBsZXggaXMgYSA0RCBzaGFwZSBJIHdvbid0IGV2ZW4gdHJ5IHRvIGRlc2NyaWJlLlxyXG4gICAgICAvLyBUbyBmaW5kIG91dCB3aGljaCBvZiB0aGUgMjQgcG9zc2libGUgc2ltcGxpY2VzIHdlJ3JlIGluLCB3ZSBuZWVkIHRvXHJcbiAgICAgIC8vIGRldGVybWluZSB0aGUgbWFnbml0dWRlIG9yZGVyaW5nIG9mIHgwLCB5MCwgejAgYW5kIHcwLlxyXG4gICAgICAvLyBTaXggcGFpci13aXNlIGNvbXBhcmlzb25zIGFyZSBwZXJmb3JtZWQgYmV0d2VlbiBlYWNoIHBvc3NpYmxlIHBhaXJcclxuICAgICAgLy8gb2YgdGhlIGZvdXIgY29vcmRpbmF0ZXMsIGFuZCB0aGUgcmVzdWx0cyBhcmUgdXNlZCB0byByYW5rIHRoZSBudW1iZXJzLlxyXG4gICAgICB2YXIgcmFua3ggPSAwO1xyXG4gICAgICB2YXIgcmFua3kgPSAwO1xyXG4gICAgICB2YXIgcmFua3ogPSAwO1xyXG4gICAgICB2YXIgcmFua3cgPSAwO1xyXG4gICAgICBpZiAoeDAgPiB5MCkgcmFua3grKztcclxuICAgICAgZWxzZSByYW5reSsrO1xyXG4gICAgICBpZiAoeDAgPiB6MCkgcmFua3grKztcclxuICAgICAgZWxzZSByYW5reisrO1xyXG4gICAgICBpZiAoeDAgPiB3MCkgcmFua3grKztcclxuICAgICAgZWxzZSByYW5rdysrO1xyXG4gICAgICBpZiAoeTAgPiB6MCkgcmFua3krKztcclxuICAgICAgZWxzZSByYW5reisrO1xyXG4gICAgICBpZiAoeTAgPiB3MCkgcmFua3krKztcclxuICAgICAgZWxzZSByYW5rdysrO1xyXG4gICAgICBpZiAoejAgPiB3MCkgcmFua3orKztcclxuICAgICAgZWxzZSByYW5rdysrO1xyXG4gICAgICB2YXIgaTEsIGoxLCBrMSwgbDE7IC8vIFRoZSBpbnRlZ2VyIG9mZnNldHMgZm9yIHRoZSBzZWNvbmQgc2ltcGxleCBjb3JuZXJcclxuICAgICAgdmFyIGkyLCBqMiwgazIsIGwyOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgdGhpcmQgc2ltcGxleCBjb3JuZXJcclxuICAgICAgdmFyIGkzLCBqMywgazMsIGwzOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgZm91cnRoIHNpbXBsZXggY29ybmVyXHJcbiAgICAgIC8vIHNpbXBsZXhbY10gaXMgYSA0LXZlY3RvciB3aXRoIHRoZSBudW1iZXJzIDAsIDEsIDIgYW5kIDMgaW4gc29tZSBvcmRlci5cclxuICAgICAgLy8gTWFueSB2YWx1ZXMgb2YgYyB3aWxsIG5ldmVyIG9jY3VyLCBzaW5jZSBlLmcuIHg+eT56PncgbWFrZXMgeDx6LCB5PHcgYW5kIHg8d1xyXG4gICAgICAvLyBpbXBvc3NpYmxlLiBPbmx5IHRoZSAyNCBpbmRpY2VzIHdoaWNoIGhhdmUgbm9uLXplcm8gZW50cmllcyBtYWtlIGFueSBzZW5zZS5cclxuICAgICAgLy8gV2UgdXNlIGEgdGhyZXNob2xkaW5nIHRvIHNldCB0aGUgY29vcmRpbmF0ZXMgaW4gdHVybiBmcm9tIHRoZSBsYXJnZXN0IG1hZ25pdHVkZS5cclxuICAgICAgLy8gUmFuayAzIGRlbm90ZXMgdGhlIGxhcmdlc3QgY29vcmRpbmF0ZS5cclxuICAgICAgaTEgPSByYW5reCA+PSAzID8gMSA6IDA7XHJcbiAgICAgIGoxID0gcmFua3kgPj0gMyA/IDEgOiAwO1xyXG4gICAgICBrMSA9IHJhbmt6ID49IDMgPyAxIDogMDtcclxuICAgICAgbDEgPSByYW5rdyA+PSAzID8gMSA6IDA7XHJcbiAgICAgIC8vIFJhbmsgMiBkZW5vdGVzIHRoZSBzZWNvbmQgbGFyZ2VzdCBjb29yZGluYXRlLlxyXG4gICAgICBpMiA9IHJhbmt4ID49IDIgPyAxIDogMDtcclxuICAgICAgajIgPSByYW5reSA+PSAyID8gMSA6IDA7XHJcbiAgICAgIGsyID0gcmFua3ogPj0gMiA/IDEgOiAwO1xyXG4gICAgICBsMiA9IHJhbmt3ID49IDIgPyAxIDogMDtcclxuICAgICAgLy8gUmFuayAxIGRlbm90ZXMgdGhlIHNlY29uZCBzbWFsbGVzdCBjb29yZGluYXRlLlxyXG4gICAgICBpMyA9IHJhbmt4ID49IDEgPyAxIDogMDtcclxuICAgICAgajMgPSByYW5reSA+PSAxID8gMSA6IDA7XHJcbiAgICAgIGszID0gcmFua3ogPj0gMSA/IDEgOiAwO1xyXG4gICAgICBsMyA9IHJhbmt3ID49IDEgPyAxIDogMDtcclxuICAgICAgLy8gVGhlIGZpZnRoIGNvcm5lciBoYXMgYWxsIGNvb3JkaW5hdGUgb2Zmc2V0cyA9IDEsIHNvIG5vIG5lZWQgdG8gY29tcHV0ZSB0aGF0LlxyXG4gICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzQ7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xyXG4gICAgICB2YXIgeTEgPSB5MCAtIGoxICsgRzQ7XHJcbiAgICAgIHZhciB6MSA9IHowIC0gazEgKyBHNDtcclxuICAgICAgdmFyIHcxID0gdzAgLSBsMSArIEc0O1xyXG4gICAgICB2YXIgeDIgPSB4MCAtIGkyICsgMi4wICogRzQ7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXHJcbiAgICAgIHZhciB5MiA9IHkwIC0gajIgKyAyLjAgKiBHNDtcclxuICAgICAgdmFyIHoyID0gejAgLSBrMiArIDIuMCAqIEc0O1xyXG4gICAgICB2YXIgdzIgPSB3MCAtIGwyICsgMi4wICogRzQ7XHJcbiAgICAgIHZhciB4MyA9IHgwIC0gaTMgKyAzLjAgKiBHNDsgLy8gT2Zmc2V0cyBmb3IgZm91cnRoIGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXHJcbiAgICAgIHZhciB5MyA9IHkwIC0gajMgKyAzLjAgKiBHNDtcclxuICAgICAgdmFyIHozID0gejAgLSBrMyArIDMuMCAqIEc0O1xyXG4gICAgICB2YXIgdzMgPSB3MCAtIGwzICsgMy4wICogRzQ7XHJcbiAgICAgIHZhciB4NCA9IHgwIC0gMS4wICsgNC4wICogRzQ7IC8vIE9mZnNldHMgZm9yIGxhc3QgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcclxuICAgICAgdmFyIHk0ID0geTAgLSAxLjAgKyA0LjAgKiBHNDtcclxuICAgICAgdmFyIHo0ID0gejAgLSAxLjAgKyA0LjAgKiBHNDtcclxuICAgICAgdmFyIHc0ID0gdzAgLSAxLjAgKyA0LjAgKiBHNDtcclxuICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSBmaXZlIHNpbXBsZXggY29ybmVyc1xyXG4gICAgICB2YXIgaWkgPSBpICYgMjU1O1xyXG4gICAgICB2YXIgamogPSBqICYgMjU1O1xyXG4gICAgICB2YXIga2sgPSBrICYgMjU1O1xyXG4gICAgICB2YXIgbGwgPSBsICYgMjU1O1xyXG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSBmaXZlIGNvcm5lcnNcclxuICAgICAgdmFyIHQwID0gMC42IC0geDAgKiB4MCAtIHkwICogeTAgLSB6MCAqIHowIC0gdzAgKiB3MDtcclxuICAgICAgaWYgKHQwIDwgMCkgbjAgPSAwLjA7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBnaTAgPSAocGVybVtpaSArIHBlcm1bamogKyBwZXJtW2trICsgcGVybVtsbF1dXV0gJSAzMikgKiA0O1xyXG4gICAgICAgIHQwICo9IHQwO1xyXG4gICAgICAgIG4wID0gdDAgKiB0MCAqIChncmFkNFtnaTBdICogeDAgKyBncmFkNFtnaTAgKyAxXSAqIHkwICsgZ3JhZDRbZ2kwICsgMl0gKiB6MCArIGdyYWQ0W2dpMCArIDNdICogdzApO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciB0MSA9IDAuNiAtIHgxICogeDEgLSB5MSAqIHkxIC0gejEgKiB6MSAtIHcxICogdzE7XHJcbiAgICAgIGlmICh0MSA8IDApIG4xID0gMC4wO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZ2kxID0gKHBlcm1baWkgKyBpMSArIHBlcm1bamogKyBqMSArIHBlcm1ba2sgKyBrMSArIHBlcm1bbGwgKyBsMV1dXV0gJSAzMikgKiA0O1xyXG4gICAgICAgIHQxICo9IHQxO1xyXG4gICAgICAgIG4xID0gdDEgKiB0MSAqIChncmFkNFtnaTFdICogeDEgKyBncmFkNFtnaTEgKyAxXSAqIHkxICsgZ3JhZDRbZ2kxICsgMl0gKiB6MSArIGdyYWQ0W2dpMSArIDNdICogdzEpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciB0MiA9IDAuNiAtIHgyICogeDIgLSB5MiAqIHkyIC0gejIgKiB6MiAtIHcyICogdzI7XHJcbiAgICAgIGlmICh0MiA8IDApIG4yID0gMC4wO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZ2kyID0gKHBlcm1baWkgKyBpMiArIHBlcm1bamogKyBqMiArIHBlcm1ba2sgKyBrMiArIHBlcm1bbGwgKyBsMl1dXV0gJSAzMikgKiA0O1xyXG4gICAgICAgIHQyICo9IHQyO1xyXG4gICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkNFtnaTJdICogeDIgKyBncmFkNFtnaTIgKyAxXSAqIHkyICsgZ3JhZDRbZ2kyICsgMl0gKiB6MiArIGdyYWQ0W2dpMiArIDNdICogdzIpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciB0MyA9IDAuNiAtIHgzICogeDMgLSB5MyAqIHkzIC0gejMgKiB6MyAtIHczICogdzM7XHJcbiAgICAgIGlmICh0MyA8IDApIG4zID0gMC4wO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZ2kzID0gKHBlcm1baWkgKyBpMyArIHBlcm1bamogKyBqMyArIHBlcm1ba2sgKyBrMyArIHBlcm1bbGwgKyBsM11dXV0gJSAzMikgKiA0O1xyXG4gICAgICAgIHQzICo9IHQzO1xyXG4gICAgICAgIG4zID0gdDMgKiB0MyAqIChncmFkNFtnaTNdICogeDMgKyBncmFkNFtnaTMgKyAxXSAqIHkzICsgZ3JhZDRbZ2kzICsgMl0gKiB6MyArIGdyYWQ0W2dpMyArIDNdICogdzMpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciB0NCA9IDAuNiAtIHg0ICogeDQgLSB5NCAqIHk0IC0gejQgKiB6NCAtIHc0ICogdzQ7XHJcbiAgICAgIGlmICh0NCA8IDApIG40ID0gMC4wO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZ2k0ID0gKHBlcm1baWkgKyAxICsgcGVybVtqaiArIDEgKyBwZXJtW2trICsgMSArIHBlcm1bbGwgKyAxXV1dXSAlIDMyKSAqIDQ7XHJcbiAgICAgICAgdDQgKj0gdDQ7XHJcbiAgICAgICAgbjQgPSB0NCAqIHQ0ICogKGdyYWQ0W2dpNF0gKiB4NCArIGdyYWQ0W2dpNCArIDFdICogeTQgKyBncmFkNFtnaTQgKyAyXSAqIHo0ICsgZ3JhZDRbZ2k0ICsgM10gKiB3NCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gU3VtIHVwIGFuZCBzY2FsZSB0aGUgcmVzdWx0IHRvIGNvdmVyIHRoZSByYW5nZSBbLTEsMV1cclxuICAgICAgcmV0dXJuIDI3LjAgKiAobjAgKyBuMSArIG4yICsgbjMgKyBuNCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gYnVpbGRQZXJtdXRhdGlvblRhYmxlKHJhbmRvbSkge1xyXG4gICAgdmFyIGk7XHJcbiAgICB2YXIgcCA9IG5ldyBVaW50OEFycmF5KDI1Nik7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcclxuICAgICAgcFtpXSA9IGk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgMjU1OyBpKyspIHtcclxuICAgICAgdmFyIHIgPSBpICsgfn4ocmFuZG9tKCkgKiAoMjU2IC0gaSkpO1xyXG4gICAgICB2YXIgYXV4ID0gcFtpXTtcclxuICAgICAgcFtpXSA9IHBbcl07XHJcbiAgICAgIHBbcl0gPSBhdXg7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcDtcclxuICB9XHJcbiAgU2ltcGxleE5vaXNlLl9idWlsZFBlcm11dGF0aW9uVGFibGUgPSBidWlsZFBlcm11dGF0aW9uVGFibGU7XHJcblxyXG4gIC8qXHJcbiAgVGhlIEFMRUEgUFJORyBhbmQgbWFzaGVyIGNvZGUgdXNlZCBieSBzaW1wbGV4LW5vaXNlLmpzXHJcbiAgaXMgYmFzZWQgb24gY29kZSBieSBKb2hhbm5lcyBCYWFnw7hlLCBtb2RpZmllZCBieSBKb25hcyBXYWduZXIuXHJcbiAgU2VlIGFsZWEubWQgZm9yIHRoZSBmdWxsIGxpY2Vuc2UuXHJcbiAgKi9cclxuICBmdW5jdGlvbiBhbGVhKCkge1xyXG4gICAgdmFyIHMwID0gMDtcclxuICAgIHZhciBzMSA9IDA7XHJcbiAgICB2YXIgczIgPSAwO1xyXG4gICAgdmFyIGMgPSAxO1xyXG5cclxuICAgIHZhciBtYXNoID0gbWFzaGVyKCk7XHJcbiAgICBzMCA9IG1hc2goJyAnKTtcclxuICAgIHMxID0gbWFzaCgnICcpO1xyXG4gICAgczIgPSBtYXNoKCcgJyk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgczAgLT0gbWFzaChhcmd1bWVudHNbaV0pO1xyXG4gICAgICBpZiAoczAgPCAwKSB7XHJcbiAgICAgICAgczAgKz0gMTtcclxuICAgICAgfVxyXG4gICAgICBzMSAtPSBtYXNoKGFyZ3VtZW50c1tpXSk7XHJcbiAgICAgIGlmIChzMSA8IDApIHtcclxuICAgICAgICBzMSArPSAxO1xyXG4gICAgICB9XHJcbiAgICAgIHMyIC09IG1hc2goYXJndW1lbnRzW2ldKTtcclxuICAgICAgaWYgKHMyIDwgMCkge1xyXG4gICAgICAgIHMyICs9IDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG1hc2ggPSBudWxsO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgdCA9IDIwOTE2MzkgKiBzMCArIGMgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxyXG4gICAgICBzMCA9IHMxO1xyXG4gICAgICBzMSA9IHMyO1xyXG4gICAgICByZXR1cm4gczIgPSB0IC0gKGMgPSB0IHwgMCk7XHJcbiAgICB9O1xyXG4gIH1cclxuICBmdW5jdGlvbiBtYXNoZXIoKSB7XHJcbiAgICB2YXIgbiA9IDB4ZWZjODI0OWQ7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBuICs9IGRhdGEuY2hhckNvZGVBdChpKTtcclxuICAgICAgICB2YXIgaCA9IDAuMDI1MTk2MDMyODI0MTY5MzggKiBuO1xyXG4gICAgICAgIG4gPSBoID4+PiAwO1xyXG4gICAgICAgIGggLT0gbjtcclxuICAgICAgICBoICo9IG47XHJcbiAgICAgICAgbiA9IGggPj4+IDA7XHJcbiAgICAgICAgaCAtPSBuO1xyXG4gICAgICAgIG4gKz0gaCAqIDB4MTAwMDAwMDAwOyAvLyAyXjMyXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIChuID4+PiAwKSAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy8gYW1kXHJcbiAgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIGRlZmluZS5hbWQpIGRlZmluZShmdW5jdGlvbigpIHtyZXR1cm4gU2ltcGxleE5vaXNlO30pO1xyXG4gIC8vIGNvbW1vbiBqc1xyXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIGV4cG9ydHMuU2ltcGxleE5vaXNlID0gU2ltcGxleE5vaXNlO1xyXG4gIC8vIGJyb3dzZXJcclxuICBlbHNlIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgd2luZG93LlNpbXBsZXhOb2lzZSA9IFNpbXBsZXhOb2lzZTtcclxuICAvLyBub2RlanNcclxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gU2ltcGxleE5vaXNlO1xyXG4gIH1cclxuXHJcbn0pKCk7XHJcbiIsInJlcXVpcmUoJy4uL3R5cGVEZWZzJyk7XHJcblxyXG4vKipcclxuKiBjYWNoZWQgdmFsdWVzXHJcbiovXHJcbmNvbnN0IHBpQnlIYWxmID0gTWF0aC5QSSAvIDE4MDtcclxuY29uc3QgaGFsZkJ5UGkgPSAxODAgLyBNYXRoLlBJO1xyXG5cclxuLyoqXHJcbiogcHJvdmlkZXMgdHJpZ29ub21pYyB1dGlsaXR5IG1ldGhvZHMgYW5kIGhlbHBlcnMuXHJcbiogQG1vZHVsZVxyXG4qIEB0eXBlZGVmIHtpbXBvcnQoXCIuLi90eXBlRGVmc1wiKS5Qb2ludH0gUG9pbnRcclxuKiBAdHlwZWRlZiB7aW1wb3J0KFwiLi4vdHlwZURlZnNcIikuRGltZW5zaW9uc30gRGltZW5zaW9uc1xyXG4qIEB0eXBlZGVmIHtpbXBvcnQoXCIuLi90eXBlRGVmc1wiKS5WZWxvY2l0eVZlY3Rvcn0gVmVsb2NpdHlWZWN0b3JcclxuKiBAdHlwZWRlZiB7aW1wb3J0KFwiLi4vdHlwZURlZnNcIikudmVjdG9yQ2FsY3VsYXRpb259IHZlY3RvckNhbGN1bGF0aW9uXHJcbiovXHJcbmxldCB0cmlnb25vbWljVXRpbHMgPSB7XHJcblx0LyoqXHJcblx0KiBAbmFtZSBhbmdsZVxyXG5cdCAqIEBkZXNjcmlwdGlvbiBjYWxjdWxhdGUgYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHRvIHZlY3RvciBwb2ludHMuXHJcblx0ICogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuXHQgKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgYW5nbGUgaW4gcmFkaWFucy5cclxuXHQgKi9cclxuXHRhbmdsZTogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIpIHtcclxuICAgICAgICB2YXIgZHggPSB4MSAtIHgyO1xyXG4gICAgICAgIHZhciBkeSA9IHkxIC0geTI7XHJcbiAgICAgICAgdmFyIHRoZXRhID0gTWF0aC5hdGFuMigtZHksIC1keCk7XHJcbiAgICAgICAgcmV0dXJuIHRoZXRhO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRSYWRpYW5BbmdsZUJldHdlZW4yVmVjdG9yczogZnVuY3Rpb24oIHgxLCB5MSwgeDIsIHkyICkge1xyXG4gICAgXHRyZXR1cm4gTWF0aC5hdGFuMih5MiAtIHkxLCB4MiAtIHgxKTtcclxuICAgIH0sXHJcblx0LyoqXHJcblx0KiBAbmFtZSBkaXN0XHJcblx0KiBAZGVzY3JpcHRpb24gY2FsY3VsYXRlIGRpc3RhbmNlIGJldHdlZW4gMiB2ZWN0b3IgY29vcmRpbmF0ZXMuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0geDEgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geDIgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geTIgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcblx0KiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgMiBwb2ludHMuXHJcblx0Ki9cclxuXHRkaXN0OiBmdW5jdGlvbiBkaXN0KHgxLCB5MSwgeDIsIHkyKSB7XHJcblx0XHR4MiAtPSB4MTt5MiAtPSB5MTtcclxuXHRcdHJldHVybiBNYXRoLnNxcnQoeDIgKiB4MiArIHkyICogeTIpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZGVncmVlc1RvUmFkaWFuc1xyXG5cdCogQGRlc2NyaXB0aW9uIGNvbnZlcnQgZGVncmVlcyB0byByYWRpYW5zLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGRlZ3JlZXMgLSB0aGUgZGVncmVlIHZhbHVlIHRvIGNvbnZlcnQuXHJcblx0KiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQgYXMgcmFkaWFucy5cclxuXHQqL1xyXG5cdGRlZ3JlZXNUb1JhZGlhbnM6IGZ1bmN0aW9uKGRlZ3JlZXMpIHtcclxuXHRcdHJldHVybiBkZWdyZWVzICogcGlCeUhhbGY7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSByYWRpYW5zVG9EZWdyZWVzXHJcblx0KiBAZGVzY3JpcHRpb24gY29udmVydCByYWRpYW5zIHRvIGRlZ3JlZXMuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIHRoZSBkZWdyZWUgdmFsdWUgdG8gY29udmVydC5cclxuXHQqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdCBhcyBkZWdyZWVzLlxyXG5cdCovXHJcblx0cmFkaWFuc1RvRGVncmVlczogZnVuY3Rpb24ocmFkaWFucykge1xyXG5cdFx0cmV0dXJuIHJhZGlhbnMgKiBoYWxmQnlQaTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQqIEBuYW1lIGdldEFuZ2xlQW5kRGlzdGFuY2VcclxuIFx0KiBAZGVzY3JpcHRpb24gY2FsY3VsYXRlIHRyaWdvbW9taWMgdmFsdWVzIGJldHdlZW4gMiB2ZWN0b3IgY29vcmRpbmF0ZXMuXHJcbiBcdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgxIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkxIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkyIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG5cdCogQHJldHVybnMge3ZlY3RvckNhbGN1bGF0aW9ufSB0aGUgY2FsY3VsYXRlZCBhbmdsZSBhbmQgZGlzdGFuY2UgYmV0d2VlbiB2ZWN0b3JzXHJcblx0Ki9cclxuXHRnZXRBbmdsZUFuZERpc3RhbmNlOiBmdW5jdGlvbih4MSwgeTEsIHgyLCB5Mikge1xyXG5cclxuXHRcdC8vIHNldCB1cCBiYXNlIHZhbHVlc1xyXG5cdFx0dmFyIGRYID0geDIgLSB4MTtcclxuXHRcdHZhciBkWSA9IHkyIC0geTE7XHJcblx0XHQvLyBnZXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHBvaW50c1xyXG5cdFx0dmFyIGQgPSBNYXRoLnNxcnQoZFggKiBkWCArIGRZICogZFkpO1xyXG5cdFx0Ly8gYW5nbGUgaW4gcmFkaWFuc1xyXG5cdFx0Ly8gdmFyIHJhZGlhbnMgPSBNYXRoLmF0YW4yKHlEaXN0LCB4RGlzdCkgKiAxODAgLyBNYXRoLlBJO1xyXG5cdFx0Ly8gYW5nbGUgaW4gcmFkaWFuc1xyXG5cdFx0dmFyIHIgPSBNYXRoLmF0YW4yKGRZLCBkWCk7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRkaXN0YW5jZTogZCxcclxuXHRcdFx0YW5nbGU6IHJcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBnZXRBZGphY2VudExlbmd0aFxyXG5cdCogQGRlc2NyaXB0aW9uIGdldCBsZW5ndGggb2YgdGhlIEFkamFjZW50IHNpZGUgb2YgYSByaWdodC1hbmdsZWQgdHJpYW5nbGUuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIHRoZSBhbmdsZSBvciB0aGUgdHJpYW5nbGUuXHJcblx0KiBAcGFyYW0ge251bWJlcn0gaHlwb3RvbnVzZSAtIHRoZSBsZW5ndGggb2YgdGhlIGh5cG90ZW51c2UuXHJcblx0KiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQgLSB0aGUgbGVuZ3RoIG9mIHRoZSBBZGphY2VudCBzaWRlLlxyXG5cdCovXHJcblx0Z2V0QWRqYWNlbnRMZW5ndGg6IGZ1bmN0aW9uIGdldEFkamFjZW50TGVuZ3RoKHJhZGlhbnMsIGh5cG90b251c2UpIHtcclxuXHRcdHJldHVybiBNYXRoLmNvcyhyYWRpYW5zKSAqIGh5cG90b251c2U7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBnZXRPcHBvc2l0ZUxlbmd0aFxyXG5cdCogQGRlc2NyaXB0aW9uIGdldCBsZW5ndGggb2YgdGhlIE9wcG9zaXRlIHNpZGUgb2YgYSByaWdodC1hbmdsZWQgdHJpYW5nbGUuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIHRoZSBhbmdsZSBvciB0aGUgdHJpYW5nbGUuXHJcblx0KiBAcGFyYW0ge251bWJlcn0gaHlwb3RvbnVzZSAtIHRoZSBsZW5ndGggb2YgdGhlIGh5cG90ZW51c2UuXHJcblx0KiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQgLSB0aGUgbGVuZ3RoIG9mIHRoZSBPcHBvc2l0ZSBzaWRlLlxyXG5cdCovXHJcblx0Z2V0T3Bwb3NpdGVMZW5ndGg6IGZ1bmN0aW9uKHJhZGlhbnMsIGh5cG90b251c2UpIHtcclxuXHRcdHJldHVybiBNYXRoLnNpbihyYWRpYW5zKSAqIGh5cG90b251c2U7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBjYWxjdWxhdGVWZWxvY2l0aWVzXHJcblx0KiBAZGVzY3JpcHRpb24gZ2l2ZW4gYW4gb3JpZ2luICh4L3kpLCBhbmdsZSBhbmQgaW1wdWxzZSAoYWJzb2x1dGUgdmVsb2NpdHkpIGNhbGN1bGF0ZSByZWxhdGl2ZSB4L3kgdmVsb2NpdGllcy5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4IC0gdGhlIGNvb3JkaW5hdGUgWCB2YWx1ZSBvZiB0aGUgb3JpZ2luLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkgLSB0aGUgY29vcmRpbmF0ZSBZIHZhbHVlIG9mIHRoZSBvcmlnaW4uXHJcblx0KiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSB0aGUgYW5nbGUgaW4gcmFkaWFucy5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBpbXB1bHNlIC0gdGhlIGRlbHRhIGNoYW5nZSB2YWx1ZS5cclxuXHQqIEByZXR1cm5zIHtWZWxvY2l0eVZlY3Rvcn0gcmVzdWx0IC0gcmVsYXRpdmUgZGVsdGEgY2hhbmdlIHZlbG9jaXR5IGZvciBYL1kuXHJcblx0Ki9cclxuXHRjYWxjdWxhdGVWZWxvY2l0aWVzOiBmdW5jdGlvbih4LCB5LCBhbmdsZSwgaW1wdWxzZSkge1xyXG5cdFx0dmFyIGEyID0gTWF0aC5hdGFuMihNYXRoLnNpbihhbmdsZSkgKiBpbXB1bHNlICsgeSAtIHksIE1hdGguY29zKGFuZ2xlKSAqIGltcHVsc2UgKyB4IC0geCk7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR4VmVsOiBNYXRoLmNvcyhhMikgKiBpbXB1bHNlLFxyXG5cdFx0XHR5VmVsOiBNYXRoLnNpbihhMikgKiBpbXB1bHNlXHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSByYWRpYWxEaXN0cmlidXRpb25cclxuXHQqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIGEgbmV3IFBvaW50IHZlY3RvciAoeC95KSBhdCB0aGUgZ2l2ZW4gZGlzdGFuY2UgKHIpIGZyb20gdGhlIG9yaWdpbiBhdCB0aGUgYW5nbGUgKGEpIC5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4IC0gdGhlIGNvb3JkaW5hdGUgWCB2YWx1ZSBvZiB0aGUgb3JpZ2luLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkgLSB0aGUgY29vcmRpbmF0ZSBZIHZhbHVlIG9mIHRoZSBvcmlnaW4uXHJcblx0KiBAcGFyYW0ge251bWJlcn0gZCAtIHRoZSBhYnNvbHV0ZSBkZWx0YSBjaGFuZ2UgdmFsdWUuXHJcblx0KiBAcGFyYW0ge251bWJlcn0gYSAtIHRoZSBhbmdsZSBpbiByYWRpYW5zLlxyXG5cdCogQHJldHVybnMge1BvaW50fSAtIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgbmV3IHBvaW50LlxyXG5cdCovXHJcblx0cmFkaWFsRGlzdHJpYnV0aW9uOiBmdW5jdGlvbih4LCB5LCBkLCBhKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR4OiB4ICsgZCAqIE1hdGguY29zKGEpLFxyXG5cdFx0XHR5OiB5ICsgZCAqIE1hdGguc2luKGEpXHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBmaW5kTmV3UG9pbnRcclxuXHQqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIGEgbmV3IFBvaW50IHZlY3RvciAoeC95KSBhdCB0aGUgZ2l2ZW4gZGlzdGFuY2UgKHIpIGZyb20gdGhlIG9yaWdpbiBhdCB0aGUgYW5nbGUgKGEpIC5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4IC0gdGhlIGNvb3JkaW5hdGUgWCB2YWx1ZSBvZiB0aGUgb3JpZ2luLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkgLSB0aGUgY29vcmRpbmF0ZSBZIHZhbHVlIG9mIHRoZSBvcmlnaW4uXHJcblx0KiBAcGFyYW0ge251bWJlcn0gYW5nbGUgLSB0aGUgYW5nbGUgaW4gcmFkaWFucy5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIHRoZSBhYnNvbHV0ZSBkZWx0YSBjaGFuZ2UgdmFsdWUuXHJcblx0KiBAcmV0dXJucyB7UG9pbnR9IC0gdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBuZXcgcG9pbnQuXHJcblx0Ki9cclxuXHRmaW5kTmV3UG9pbnQ6IGZ1bmN0aW9uKHgsIHksIGFuZ2xlLCBkaXN0YW5jZSkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0eDogTWF0aC5jb3MoYW5nbGUpICogZGlzdGFuY2UgKyB4LFxyXG5cdFx0XHR5OiBNYXRoLnNpbihhbmdsZSkgKiBkaXN0YW5jZSArIHlcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQqIEBuYW1lIGdldFBvaW50T25QYXRoXHJcblx0KiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIG5ldyBQb2ludCB2ZWN0b3IgKHgveSkgYXQgdGhlIGdpdmVuIGRpc3RhbmNlIChkaXN0YW5jZSkgYWxvbmcgYSBwYXRoIGRlZmluZWQgYnkgeDEveTEsIHgyL3kyLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgxIC0gdGhlIGNvb3JkaW5hdGUgWCB2YWx1ZSBvZiB0aGUgcGF0aCBzdGFydC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIHRoZSBjb29yZGluYXRlIFkgdmFsdWUgb2YgdGhlIHBhdGggc3RhcnQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geDIgLSB0aGUgY29vcmRpbmF0ZSBYIHZhbHVlIG9mIHRoZSBwYXRoIGVuZC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIHRoZSBjb29yZGluYXRlIFkgdmFsdWUgb2YgdGhlIHBhdGggZW5kLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gYSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxIHdoZXJlIDAgaXMgdGhlIHBhdGggc3RhcnQsIDEgaXMgdGhlIHBhdGggZW5kLCBhbmQgMC41IGlzIHRoZSBwYXRoIG1pZHBvaW50LlxyXG5cdCovXHJcblx0Z2V0UG9pbnRPblBhdGg6IGZ1bmN0aW9uKCB4MSwgeTEsIHgyLCB5MiwgZGlzdGFuY2UgKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR4OiB4MSArICggeDIgLSB4MSApICogZGlzdGFuY2UsXHJcblx0XHRcdHk6IHkxICsgKCB5MiAtIHkxICkgKiBkaXN0YW5jZVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0LyoqXHJcblx0KiBAbmFtZSBjb21wdXRlTm9ybWFsc1xyXG5cdCogQGRlc2NyaXB0aW9uIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyNDM2MTQvaG93LWRvLWktY2FsY3VsYXRlLXRoZS1ub3JtYWwtdmVjdG9yLW9mLWEtbGluZS1zZWdtZW50XHJcblx0KiBpZiB3ZSBkZWZpbmUgZHg9eDIteDEgYW5kIGR5PXkyLXkxXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0geDEgLSB0aGUgY29vcmRpbmF0ZSBYIHZhbHVlIG9mIHRoZSBwYXRoIHN0YXJ0LlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkxIC0gdGhlIGNvb3JkaW5hdGUgWSB2YWx1ZSBvZiB0aGUgcGF0aCBzdGFydC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4MiAtIHRoZSBjb29yZGluYXRlIFggdmFsdWUgb2YgdGhlIHBhdGggZW5kLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkyIC0gdGhlIGNvb3JkaW5hdGUgWSB2YWx1ZSBvZiB0aGUgcGF0aCBlbmQuXHJcblx0KiBAcmV0dXJucyB7b2JqZWN0fSAtIFRoZSAyIG5vcm1hbCB2ZWN0b3JzIGZyb20gdGhlIGRlZmluZWQgcGF0aCBhcyBwb2ludHNcclxuXHQqL1xyXG5cdGNvbXB1dGVOb3JtYWxzOiBmdW5jdGlvbiggeDEsIHkxLCB4MiwgeTIgKSB7XHJcblx0XHRsZXQgZHggPSB4MiAtIHgxO1xyXG5cdFx0bGV0IGR5ID0geTIgLSB5MTtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG4xOiB7IHg6IC1keSwgeTogZHggfSxcclxuXHRcdFx0bjI6IHsgeDogZHksIHk6IC1keCB9LFxyXG5cdFx0fVxyXG5cdH0sXHJcblx0LyoqXHJcblx0KiBAbmFtZSBzdWJkaXZpZGVcclxuXHQqIEBkZXNjcmlwdGlvbiBzdWJkaXZpZGVzIGEgdmVjdG9yIHBhdGggKHgxLCB5MSwgeDIsIHkyKSBwcm9wb3J0aW9uYXRlIHRvIHRoZSBiaWFzXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0geDEgLSB0aGUgY29vcmRpbmF0ZSBYIHZhbHVlIG9mIHRoZSBwYXRoIHN0YXJ0LlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkxIC0gdGhlIGNvb3JkaW5hdGUgWSB2YWx1ZSBvZiB0aGUgcGF0aCBzdGFydC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4MiAtIHRoZSBjb29yZGluYXRlIFggdmFsdWUgb2YgdGhlIHBhdGggZW5kLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkyIC0gdGhlIGNvb3JkaW5hdGUgWSB2YWx1ZSBvZiB0aGUgcGF0aCBlbmQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0gYmlhcyAtIG9mZnNldCBvZiB0aGUgc3ViZGl2aXNpb24gYmV0d2VlbiB0aGUgc2JkaXZpc2lvbjogaS5lLiAwIC0gdGhlIHN0YXJ0IHZlY3RvciwgMC41IC0gbWlkcG9pbnQgYmV0d2VlbiB0aGUgMiB2ZWN0b3JzLCAxIC0gdGhlIGVuZCB2ZWN0b3IuXHJcblx0KiBAcmV0dXJucyB7UG9pbnR9IC0gVGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzdWJkaXZpc2lvbiBwb2ludFxyXG5cdCovXHJcblx0c3ViZGl2aWRlOiBmdW5jdGlvbiggeDEsIHkxLCB4MiwgeTIsIGJpYXMgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRQb2ludE9uUGF0aCggeDEsIHkxLCB4MiwgeTIsIGJpYXMgKTtcclxuXHR9LFxyXG5cclxuXHQvLyBDdXJ2ZSBmdWN0aW9uc1xyXG5cclxuXHQvKipcclxuXHQqIEBuYW1lIGdldFBvaW50QXRcclxuXHQqIEBkZXNjcmlwdGlvbiBnaXZlbiAzIHZlY3RvciB7cG9pbnR9cyBvZiBhIHF1YWRyYXRpYyBjdXJ2ZSwgcmV0dXJuIHRoZSBwb2ludCBvbiB0aGUgY3VydmUgYXQgdFxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtQb2ludH0gcDEgLSB7eCx5fSBvZiB0aGUgY3VydmUncyBzdGFydCBwb2ludC5cclxuXHQqIEBwYXJhbSB7UG9pbnR9IHBjIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgY29udHJvbCBwb2ludC5cclxuXHQqIEBwYXJhbSB7UG9pbnR9IHAyIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgZW5kIHBvaW50LlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGJpYXMgLSB0aGUgcG9pbnQgYWxvbmcgdGhlIGN1cnZlJ3MgcGF0aCBhcyBhIHJhdGlvICgwLTEpLlxyXG5cdCogQHJldHVybnMge1BvaW50fSAtIHt4LHl9IG9mIHRoZSBwb2ludCBvbiB0aGUgY3VydmUgYXQge2JpYXN9XHJcblx0Ki9cclxuXHRnZXRQb2ludEF0OiBmdW5jdGlvbiggcDEsIHBjLCBwMiwgYmlhcyApIHtcclxuXHQgICAgY29uc3QgeCA9ICgxIC0gYmlhcykgKiAoMSAtIGJpYXMpICogcDEueCArIDIgKiAoMSAtIGJpYXMpICogYmlhcyAqIHBjLnggKyBiaWFzICogYmlhcyAqIHAyLnhcclxuXHQgICAgY29uc3QgeSA9ICgxIC0gYmlhcykgKiAoMSAtIGJpYXMpICogcDEueSArIDIgKiAoMSAtIGJpYXMpICogYmlhcyAqIHBjLnkgKyBiaWFzICogYmlhcyAqIHAyLnlcclxuXHQgICAgcmV0dXJuIHsgeCwgeSB9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZ2V0RGVyaXZhdGl2ZUF0XHJcblx0KiBAZGVzY3JpcHRpb24gR2l2ZW4gMyB2ZWN0b3Ige3BvaW50fXMgb2YgYSBxdWFkcmF0aWMgY3VydmUsIHJldHVybnMgdGhlIGRlcml2YXRpdmUgKHRhbmdldCkgb2YgdGhlIGN1cnZlIGF0IHBvaW50IG9mIGJpYXMuXHJcblx0KFRoZSBkZXJpdmF0aXZlIG1lYXN1cmVzIHRoZSBzdGVlcG5lc3Mgb2YgdGhlIGN1cnZlIG9mIGEgZnVuY3Rpb24gYXQgc29tZSBwYXJ0aWN1bGFyIHBvaW50IG9uIHRoZSBjdXJ2ZSAoc2xvcGUgb3IgcmF0aW8gb2YgY2hhbmdlIGluIHRoZSB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdG8gY2hhbmdlIGluIHRoZSBpbmRlcGVuZGVudCB2YXJpYWJsZSkuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge1BvaW50fSBwMSAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIHN0YXJ0IHBvaW50LlxyXG5cdCogQHBhcmFtIHtQb2ludH0gcGMgLSB7eCx5fSBvZiB0aGUgY3VydmUncyBjb250cm9sIHBvaW50LlxyXG5cdCogQHBhcmFtIHtQb2ludH0gcDIgLSB7eCx5fSBvZiB0aGUgY3VydmUncyBlbmQgcG9pbnQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0gYmlhcyAtIHRoZSBwb2ludCBhbG9uZyB0aGUgY3VydmUncyBwYXRoIGFzIGEgcmF0aW8gKDAtMSkuXHJcblx0KiBAcmV0dXJucyB7UG9pbnR9IC0ge3gseX0gb2YgdGhlIHBvaW50IG9uIHRoZSBjdXJ2ZSBhdCB7Ymlhc31cclxuXHQqL1xyXG5cdGdldERlcml2YXRpdmVBdDogZnVuY3Rpb24ocDEsIHBjLCBwMiwgYmlhcykge1xyXG5cdCAgICBjb25zdCBkMSA9IHsgeDogMiAqIChwYy54IC0gcDEueCksIHk6IDIgKiAocGMueSAtIHAxLnkpIH07XHJcblx0ICAgIGNvbnN0IGQyID0geyB4OiAyICogKHAyLnggLSBwYy54KSwgeTogMiAqIChwMi55IC0gcGMueSkgfTtcclxuXHQgICAgY29uc3QgeCA9ICgxIC0gYmlhcykgKiBkMS54ICsgYmlhcyAqIGQyLng7XHJcblx0ICAgIGNvbnN0IHkgPSAoMSAtIGJpYXMpICogZDEueSArIGJpYXMgKiBkMi55O1xyXG5cdCAgICByZXR1cm4geyB4LCB5IH07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBnZXROb3JtYWxBdFxyXG5cdCogQGRlc2NyaXB0aW9uIGdpdmVuIDMgdmVjdG9yIHtwb2ludH1zIG9mIGEgcXVhZHJhdGljIGN1cnZlIHJldHVybnMgdGhlIG5vcm1hbCB2ZWN0b3Igb2YgdGhlIGN1cnZlIGF0IHRoZSByYXRpbyBwb2ludCBhbG9uZyB0aGUgY3VydmUge2JpYXN9LlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtQb2ludH0gcDEgLSB7eCx5fSBvZiB0aGUgY3VydmUncyBzdGFydCBwb2ludC5cclxuXHQqIEBwYXJhbSB7UG9pbnR9IHBjIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgY29udHJvbCBwb2ludC5cclxuXHQqIEBwYXJhbSB7UG9pbnR9IHAyIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgZW5kIHBvaW50LlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGJpYXMgLSB0aGUgcG9pbnQgYWxvbmcgdGhlIGN1cnZlJ3MgcGF0aCBhcyBhIHJhdGlvICgwLTEpLlxyXG5cdCogQHJldHVybnMge1BvaW50fSAtIHt4LHl9IG9mIHRoZSBwb2ludCBvbiB0aGUgY3VydmUgYXQge2JpYXN9XHJcblx0Ki9cclxuXHRnZXROb3JtYWxBdDogZnVuY3Rpb24ocDEsIHBjLCBwMiwgYmlhcykge1xyXG5cdCAgICBjb25zdCBkID0gdGhpcy5nZXREZXJpdmF0aXZlQXQoIHAxLCBwYywgcDIsIGJpYXMgKTtcclxuXHQgICAgY29uc3QgcSA9IE1hdGguc3FydChkLnggKiBkLnggKyBkLnkgKiBkLnkpO1xyXG5cdCAgICBjb25zdCB4ID0gLWQueSAvIHE7XHJcblx0ICAgIGNvbnN0IHkgPSBkLnggLyBxO1xyXG5cdCAgICByZXR1cm4geyB4LCB5IH07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBwcm9qZWN0Tm9ybWFsQXREaXN0YW5jZVxyXG5cdCogQGRlc2NyaXB0aW9uIGdpdmVuIDMgdmVjdG9yIHtwb2ludH1zIG9mIGEgcXVhZHJhdGljIGN1cnZlIHJldHVybnMgdGhlIG5vcm1hbCB2ZWN0b3Igb2YgdGhlIGN1cnZlIGF0IHRoZSByYXRpbyBwb2ludCBhbG9uZyB0aGUgY3VydmUge2JpYXN9IGF0IHRoZSByZXF1aXJlZCB7ZGlzdGFuY2V9LlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtQb2ludH0gcDEgLSB7eCx5fSBvZiB0aGUgY3VydmUncyBzdGFydCBwb2ludC5cclxuXHQqIEBwYXJhbSB7UG9pbnR9IHBjIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgY29udHJvbCBwb2ludC5cclxuXHQqIEBwYXJhbSB7UG9pbnR9IHAyIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgZW5kIHBvaW50LlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGJpYXMgLSB0aGUgcG9pbnQgYWxvbmcgdGhlIGN1cnZlJ3MgcGF0aCBhcyBhIHJhdGlvICgwLTEpLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gdGhlIGRpc3RhbmNlIHRvIHByb2plY3QgdGhlIG5vcm1hbC5cclxuXHQqIEByZXR1cm5zIHtQb2ludH0gLSB7eCx5fSBvZiB0aGUgcG9pbnQgcHJvamVjdGVkIGZyb20gdGhlIG5vcm1hbCBvbiB0aGUgY3VydmUgYXQge2JpYXN9XHJcblx0Ki9cclxuXHRwcm9qZWN0Tm9ybWFsQXREaXN0YW5jZTogZnVuY3Rpb24ocDEsIHBjLCBwMiwgYmlhcywgZGlzdGFuY2UpIHtcclxuXHRcdGNvbnN0IHAgPSB0aGlzLmdldFBvaW50QXQocDEsIHBjLCBwMiwgYmlhcyk7XHJcbiAgICAgIFx0Y29uc3QgbiA9IHRoaXMuZ2V0Tm9ybWFsQXQocDEsIHBjLCBwMiwgYmlhcyk7XHJcbiAgICAgIFx0Y29uc3QgeCA9IHAueCArIG4ueCAqIGRpc3RhbmNlO1xyXG4gICAgICBcdGNvbnN0IHkgPSBwLnkgKyBuLnkgKiBkaXN0YW5jZTtcclxuICAgICAgXHRyZXR1cm4geyB4LCB5IH07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBnZXRBbmdsZU9mTm9ybWFsXHJcblx0KiBAZGVzY3JpcHRpb24gZ2l2ZW4gMyB2ZWN0b3Ige3BvaW50fXMgb2YgYSBxdWFkcmF0aWMgY3VydmUgcmV0dXJucyB0aGUgYW5nbGUgb2YgdGhlIG5vcm1hbCB2ZWN0b3Igb2YgdGhlIGN1cnZlIGF0IHRoZSByYXRpbyBwb2ludCBhbG9uZyB0aGUgY3VydmUge2JpYXN9LlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtQb2ludH0gcDEgLSB7eCx5fSBvZiB0aGUgY3VydmUncyBzdGFydCBwb2ludC5cclxuXHQqIEBwYXJhbSB7UG9pbnR9IHBjIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgY29udHJvbCBwb2ludC5cclxuXHQqIEBwYXJhbSB7UG9pbnR9IHAyIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgZW5kIHBvaW50LlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGJpYXMgLSB0aGUgcG9pbnQgYWxvbmcgdGhlIGN1cnZlJ3MgcGF0aCBhcyBhIHJhdGlvICgwLTEpLlxyXG5cdCogQHJldHVybnMge251bWJlcn0gLSB0aGUgYW5nbGUgb2YgdGhlIG5vcm1hbCBvZiB0aGUgY3VydmUgYXQge2JpYXN9XHJcblx0Ki9cclxuXHRnZXRBbmdsZU9mTm9ybWFsOiBmdW5jdGlvbiggcDEsIHBjLCBwMiwgYmlhcyApIHtcclxuXHRcdGNvbnN0IHAgPSB0aGlzLmdldFBvaW50QXQocDEsIHBjLCBwMiwgYmlhcyk7XHJcbiAgICAgIFx0Y29uc3QgbiA9IHRoaXMuZ2V0Tm9ybWFsQXQocDEsIHBjLCBwMiwgYmlhcyk7XHJcbiAgICAgIFx0cmV0dXJuIHRoaXMuZ2V0UmFkaWFuQW5nbGVCZXR3ZWVuMlZlY3RvcnMoIHAueCwgcC55LCBuLngsIG4ueSApO1xyXG5cdH1cclxuXHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMudHJpZ29ub21pY1V0aWxzID0gdHJpZ29ub21pY1V0aWxzOyJdfQ==
