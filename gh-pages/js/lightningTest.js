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

},{"./checkCanvasSupport.js":1,"./lightning/lightningManager/lightningUtilities.js":13,"./utils/canvasApiAugmentation.js":38,"./utils/easing.js":40,"./utils/mathUtils.js":41,"./utils/rafPolyfill.js":42,"./utils/trigonomicUtils.js":44}],4:[function(require,module,exports){
function clearMemberArray() {
  this.members.length = 0;
}

module.exports = clearMemberArray;

},{}],5:[function(require,module,exports){
let easing = require('../../utils/easing.js').easingEquations;

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
let mathUtils = require('../../utils/mathUtils.js');

let easing = require('../../utils/easing.js').easingEquations;

let trig = require('../../utils/trigonomicUtils.js').trigonomicUtils;

let lmgrUtils = require('./lightningManagerUtilities.js');

let createLightningParent = lmgrUtils.createLightningParent;

let renderConfig = require('./renderConfig.js');

let mainPathAnimSequence = require(`../sequencer/mainPathAnimSequence.js`);

let childPathAnimSequence = require(`../sequencer/childPathAnimSequence.js`);

let createPathFromOptions = require('../path/createPathFromOptions.js');

let createPathConfig = require('../path/createPathConfig.js');

let calculateSubDRate = require('../path/calculateSubDRate.js'); // store subdivision level segment count as a look up table/array


let subDSegmentCountLookUp = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

function createLightning(options) {
  let lMgr = this;
  let opts = options;
  let creationConfig = this.creationConfig;
  let branchCfg = creationConfig.branches;
  lMgr.canvasW = opts.canvasW;
  lMgr.canvasH = opts.canvasH;
  let maxCanvasDist = trig.dist(0, 0, opts.canvasW, opts.canvasH);
  branchCfg.depth.curr = 1; // let maxSubD = 8;

  let subD = 6;
  let subDivs = opts.subdivisions || mathUtils.randomInteger(branchCfg.subD.min, branchCfg.subD.max);
  let d = trig.dist(opts.startX, opts.startY, opts.endX, opts.endY);
  let subDRate = calculateSubDRate(d, maxCanvasDist, subD);
  let parentPathDist = d;
  let speed = d / subDSegmentCountLookUp[subDRate];
  let speedModRate = opts.speedModRate || 0.6;
  let speedMod = speed * speedModRate; // calculate draw speed based on bolt length / 

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
    parentPathDist: 0,
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
          parentPathDist: d,
          lineWidth: 1,
          subdivisions: calculateSubDRate(pCfg.dVar, maxCanvasDist, subD),
          dRange: pCfg.dVar,
          sequenceStartIndex: 1
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

},{"../../utils/easing.js":40,"../../utils/mathUtils.js":41,"../../utils/trigonomicUtils.js":44,"../path/calculateSubDRate.js":20,"../path/createPathConfig.js":21,"../path/createPathFromOptions.js":22,"../sequencer/childPathAnimSequence.js":28,"../sequencer/mainPathAnimSequence.js":29,"./lightningManagerUtilities.js":12,"./renderConfig.js":14}],7:[function(require,module,exports){
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

},{"../../utils/trigonomicUtils.js":44}],10:[function(require,module,exports){
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

},{"../../utils/mathUtils.js":41,"./createBlurArray.js":5}],13:[function(require,module,exports){
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

},{"../../utils/simplex-noise-new.js":43,"./clearMemberArray.js":4,"./createLightning.js":6,"./creationConfig.js":7,"./drawDebugLines.js":8,"./drawDebugRadialTest.js":9,"./globalConfig.js":10,"./lMgrClock.js":11,"./renderConfig.js":14,"./setCanvasDetails.js":15,"./setGlobalInterval.js":16,"./setLocalClockTarget.js":17,"./updateArr.js":18,"./updateRenderCfg.js":19}],14:[function(require,module,exports){
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

},{"../../utils/mathUtils.js":41}],15:[function(require,module,exports){
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

},{"../../utils/mathUtils.js":41}],17:[function(require,module,exports){
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

},{"../../utils/mathUtils.js":41}],19:[function(require,module,exports){
function updateRenderCfg() {
  let members = this.members;
  let memLen = members.length;

  for (let i = 0; i <= memLen - 1; i++) {
    members[i].updateRenderConfig();
  }
}

module.exports = updateRenderCfg;

},{}],20:[function(require,module,exports){
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

},{"../../utils/easing.js":40,"../../utils/mathUtils.js":41,"../../utils/trigonomicUtils.js":44}],22:[function(require,module,exports){
let mathUtils = require('../../utils/mathUtils.js');

let easing = require('../../utils/easing.js').easingEquations;

let trig = require('../../utils/trigonomicUtils.js').trigonomicUtils;

let plotPoints = require('./plotPathPoints.js');

let drawPaths = require('./drawPath.js');

let redrawPath = require('./redrawPaths.js');

let updatePath = require('./updatePath.js');

let renderPath = require('./renderPath.js');

let childPathAnimSequence = require(`../sequencer/childPathAnimSequence.js`);

let mainPathAnimSequence = require(`../sequencer/mainPathAnimSequence.js`);

let startSequence = require(`../sequencer/startSequence.js`);

let updateSequenceClock = require(`../sequencer/updateSequenceClock.js`);

let updateSequence = require(`../sequencer/updateSequence.js`);

let setupSequences = require(`../sequencer/setupSequences.js`); // lightning path constructor
// let drawPathSequence = {
// 	isActive: false,
// 	time: 100
// }


function createPathFromOptions(opts) {
  let newPath = plotPoints({
    startX: opts.startX,
    startY: opts.startY,
    endX: opts.endX,
    endY: opts.endY,
    subdivisions: opts.subdivisions,
    dRange: opts.dRange,
    isChild: opts.isChild
  }); // console.log( 'newPathLen: ', opts.isChild === false ? newPath.length : false );

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
    path: newPath,
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

},{"../../utils/easing.js":40,"../../utils/mathUtils.js":41,"../../utils/trigonomicUtils.js":44,"../sequencer/childPathAnimSequence.js":28,"../sequencer/mainPathAnimSequence.js":29,"../sequencer/setupSequences.js":33,"../sequencer/startSequence.js":34,"../sequencer/updateSequence.js":35,"../sequencer/updateSequenceClock.js":36,"./drawPath.js":23,"./plotPathPoints.js":24,"./redrawPaths.js":25,"./renderPath.js":26,"./updatePath.js":27}],23:[function(require,module,exports){
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
* @description given an origin plot a path, randomised and subdivided, to a target.
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

},{"../../utils/cl.js":39,"../../utils/easing.js":40,"../../utils/mathUtils.js":41,"../../utils/trigonomicUtils.js":44}],25:[function(require,module,exports){
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
      newMainPath.moveTo(p.x, p.y);
      newOffsetPath.moveTo(p.x, p.y - 10000);
      newOriginLongPath.moveTo(p.x, p.y - 10000);
      continue;
    }

    newMainPath.lineTo(p.x, p.y);
    newOffsetPath.lineTo(p.x, p.y - 10000);

    if (i < 20) {
      newOriginLongPath.lineTo(p.x, p.y - 10000);
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
    } else {}
  }

  if (pathLen + rndOffset < p.renderConfig.currHead) {
    pathCfg.isRendering = false;
  }

  pathCfg.updateSequence();
  return this;
}

module.exports = updatePath;

},{"../../utils/easing.js":40,"../../utils/mathUtils.js":41,"../../utils/trigonomicUtils.js":44}],28:[function(require,module,exports){
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
 * @property {number} w - width
 * @property {number} h - height
 */

/**
* @typedef {Object} Point - A point in space on a 2d (cartesean) plane, usually X/Y
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

/**
* Provides easing calculation methods.
* @name easingEquations
*
* @see {@link "http://robertpenner.com/easing/"}
* @see {@link https://easings.net/en|Easing cheat sheet}
*/
var easingEquations = {
  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  linearEase: function linearEase(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * currentIteration / totalIterations + startValue;
  },

  /**
  * @function
  * @description Interface for easing functions.
  * @memberof easingEquations
  * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
  * @param {number} startValue - The starting value
  * @param {number} changeInValue - The change value relative to the start value.
  * @param {number} totalIterations - The total iterations of the easing curve to calculate.
  * @returns {number} - The calculated (absolute) value along the easing curve
  */
  easeInQuad: function easeInQuad(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeOutQuad: function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInOutQuad: function easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * currentIteration * currentIteration + startValue;
    }

    return -changeInValue / 2 * (--currentIteration * (currentIteration - 2) - 1) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInCubic: function easeInCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeOutCubic: function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInOutCubic: function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
    }

    return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInQuart: function easeInQuart(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeOutQuart: function easeOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInOutQuart: function easeInOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
    }

    return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInQuint: function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeOutQuint: function easeOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInOutQuint: function easeInOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
    }

    return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInSine: function easeInSine(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeOutSine: function easeOutSine(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInOutSine: function easeInOutSine(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInExpo: function easeInExpo(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeOutExpo: function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInOutExpo: function easeInOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
    }

    return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInCirc: function easeInCirc(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeOutCirc: function easeOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInOutCirc: function easeInOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
    }

    return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInElastic: function easeInElastic(t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;

    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = p / (2 * Math.PI) * Math.asin(c / a);

    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },

  /**
  * @function
  * @description Interface for easing functions.
  * @memberof easingEquations
  * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
  * @param {number} startValue - The starting value
  * @param {number} changeInValue - The change value relative to the start value.
  * @param {number} totalIterations - The total iterations of the easing curve to calculate.
  * @returns {number} - The calculated (absolute) value along the easing curve
  */
  easeOutElastic: function easeOutElastic(t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;

    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = p / (2 * Math.PI) * Math.asin(c / a);

    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInOutElastic: function easeInOutElastic(t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d / 2) == 2) return b + c;
    if (!p) p = d * (.3 * 1.5);

    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = p / (2 * Math.PI) * Math.asin(c / a);

    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeInBack: function easeInBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeOutBack: function easeOutBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  easeInOutBack: function easeInOutBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  },

  /**
   * @function
   * @description Interface for easing functions.
   * @memberof easingEquations
   * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
   * @param {number} startValue - The starting value
   * @param {number} changeInValue - The change value relative to the start value.
   * @param {number} totalIterations - The total iterations of the easing curve to calculate.
   * @returns {number} - The calculated (absolute) value along the easing curve
   */
  easeOutBounce: function easeOutBounce(t, b, c, d) {
    if ((t /= d) < 1 / 2.75) {
      return c * (7.5625 * t * t) + b;
    } else if (t < 2 / 2.75) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
    } else if (t < 2.5 / 2.75) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
    } else {
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
    }
  }
};
/**
 * @function
 * @description Interface for easing functions.
 * @memberof easingEquations
 * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
 * @param {number} startValue - The starting value
 * @param {number} changeInValue - The change value relative to the start value.
 * @param {number} totalIterations - The total iterations of the easing curve to calculate.
 * @returns {number} - The calculated (absolute) value along the easing curve
 */

easingEquations.easeInBounce = function (t, b, c, d) {
  return c - easingEquations.easeOutBounce(d - t, 0, c, d) + b;
};
/**
 * @function
 * @description Interface for easing functions.
 * @memberof easingEquations
 * @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
 * @param {number} startValue - The starting value
 * @param {number} changeInValue - The change value relative to the start value.
 * @param {number} totalIterations - The total iterations of the easing curve to calculate.
 * @returns {number} - The calculated (absolute) value along the easing curve
 */


easingEquations.easeInOutBounce = function (t, b, c, d) {
  if (t < d / 2) return easingEquations.easeInBounce(t * 2, 0, c, d) * .5 + b;
  return easingEquations.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
};

module.exports.easingEquations = easingEquations;

},{}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
require('../typeDefs');
/**
* cached values
*/


const piByHalf = Math.Pi / 180;
const halfByPi = 180 / Math.PI;
/**
* provides trigonomic utility methods and helpers.
* @module
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
  angle: function (originX, originY, targetX, targetY) {
    var dx = originX - targetX;
    var dy = originY - targetY;
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
  d2R: this.degreesToRadians,

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
  r2D: this.radiansToDegrees,

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
  * @returns {point} - The coordinates of the subdivision point
  */
  subdivide: function (x1, y1, x2, y2, bias) {
    return this.getPointOnPath(x1, y1, x2, y2, bias);
  },
  // Curve fuctions

  /**
  * @name getPointAt
  * @description given 3 vector {point}s of a quadratic curve, return the point on the curve at t
  * @memberof trigonomicUtils
  * @param {point} p1 - {x,y} of the curve's start point.
  * @param {point} pc - {x,y} of the curve's control point.
  * @param {point} p2 - {x,y} of the curve's end point.
  * @param {number} bias - the point along the curve's path as a ratio (0-1).
  * @returns {point} - {x,y} of the point on the curve at {bias}
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
  * @param {point} p1 - {x,y} of the curve's start point.
  * @param {point} pc - {x,y} of the curve's control point.
  * @param {point} p2 - {x,y} of the curve's end point.
  * @param {number} bias - the point along the curve's path as a ratio (0-1).
  * @returns {point} - {x,y} of the point on the curve at {bias}
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
  * @param {point} p1 - {x,y} of the curve's start point.
  * @param {point} pc - {x,y} of the curve's control point.
  * @param {point} p2 - {x,y} of the curve's end point.
  * @param {number} bias - the point along the curve's path as a ratio (0-1).
  * @returns {point} - {x,y} of the point on the curve at {bias}
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
  * @param {point} p1 - {x,y} of the curve's start point.
  * @param {point} pc - {x,y} of the curve's control point.
  * @param {point} p2 - {x,y} of the curve's end point.
  * @param {number} bias - the point along the curve's path as a ratio (0-1).
  * @param {number} distance - the distance to project the normal.
  * @returns {point} - {x,y} of the point projected from the normal on the curve at {bias}
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
  * @param {point} p1 - {x,y} of the curve's start point.
  * @param {point} pc - {x,y} of the curve's control point.
  * @param {point} p2 - {x,y} of the curve's end point.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY2hlY2tDYW52YXNTdXBwb3J0LmpzIiwic3JjL2pzL2xpZ2h0bmluZ1Rlc3QuanMiLCJzcmMvanMvbGlnaHRuaW5nVGVzdEluY2x1ZGUuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvY2xlYXJNZW1iZXJBcnJheS5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9jcmVhdGVCbHVyQXJyYXkuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvY3JlYXRlTGlnaHRuaW5nLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2NyZWF0aW9uQ29uZmlnLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2RyYXdEZWJ1Z0xpbmVzLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2RyYXdEZWJ1Z1JhZGlhbFRlc3QuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvZ2xvYmFsQ29uZmlnLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2xNZ3JDbG9jay5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9saWdodG5pbmdNYW5hZ2VyVXRpbGl0aWVzLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2xpZ2h0bmluZ1V0aWxpdGllcy5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9yZW5kZXJDb25maWcuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvc2V0Q2FudmFzRGV0YWlscy5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9zZXRHbG9iYWxJbnRlcnZhbC5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9zZXRMb2NhbENsb2NrVGFyZ2V0LmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL3VwZGF0ZUFyci5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci91cGRhdGVSZW5kZXJDZmcuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvY2FsY3VsYXRlU3ViRFJhdGUuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvY3JlYXRlUGF0aENvbmZpZy5qcyIsInNyYy9qcy9saWdodG5pbmcvcGF0aC9jcmVhdGVQYXRoRnJvbU9wdGlvbnMuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvZHJhd1BhdGguanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvcGxvdFBhdGhQb2ludHMuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvcmVkcmF3UGF0aHMuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvcmVuZGVyUGF0aC5qcyIsInNyYy9qcy9saWdodG5pbmcvcGF0aC91cGRhdGVQYXRoLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvY2hpbGRQYXRoQW5pbVNlcXVlbmNlLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvbWFpblBhdGhBbmltU2VxdWVuY2UuanMiLCJzcmMvanMvbGlnaHRuaW5nL3NlcXVlbmNlci9zZXF1ZW5jZUl0ZW1zL2FscGhhRmFkZU91dC5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3NlcXVlbmNlSXRlbXMvZmFkZVRvUmVkQW5kRmFkZU91dC5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3NlcXVlbmNlSXRlbXMvbGluZVdpZHRoVG8xMC5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3NldHVwU2VxdWVuY2VzLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvc3RhcnRTZXF1ZW5jZS5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3VwZGF0ZVNlcXVlbmNlLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvdXBkYXRlU2VxdWVuY2VDbG9jay5qcyIsInNyYy9qcy90eXBlRGVmcy5qcyIsInNyYy9qcy91dGlscy9jYW52YXNBcGlBdWdtZW50YXRpb24uanMiLCJzcmMvanMvdXRpbHMvY2wuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nLmpzIiwic3JjL2pzL3V0aWxzL21hdGhVdGlscy5qcyIsInNyYy9qcy91dGlscy9yYWZQb2x5ZmlsbC5qcyIsInNyYy9qcy91dGlscy9zaW1wbGV4LW5vaXNlLW5ldy5qcyIsInNyYy9qcy91dGlscy90cmlnb25vbWljVXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7OztBQVFBLFNBQVMsa0JBQVQsQ0FBNkIsV0FBN0IsRUFBMkM7QUFDdkMsTUFBSSxHQUFHLEdBQUcsV0FBVyxJQUFJLElBQXpCO0FBQ0EsTUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBd0IsUUFBeEIsQ0FBWDtBQUNBLFNBQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFMLElBQW1CLElBQUksQ0FBQyxVQUFMLENBQWlCLEdBQWpCLENBQXJCLENBQVI7QUFDSDs7QUFFRCxNQUFNLENBQUMsT0FBUCxHQUFpQixrQkFBakI7OztBQ2RBLE9BQU8sQ0FBRSwyQkFBRixDQUFQOzs7QUNBQSxJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBRSx5QkFBRixDQUFoQzs7QUFDQSxPQUFPLENBQUUsd0JBQUYsQ0FBUDs7QUFDQSxPQUFPLENBQUUsa0NBQUYsQ0FBUDs7QUFFQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUUsbUJBQUYsQ0FBUCxDQUErQixlQUE1Qzs7QUFDQSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBcEI7O0FBRUEsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFFLDRCQUFGLENBQVAsQ0FBd0MsZUFBbkQ7O0FBQ0EsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQXZCO0FBQ0EsSUFBSSxLQUFLLEdBQUcs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LENBQUYsR0FBTSxDQUFDLENBQUMsQ0FBRixHQUFNLFFBQXRCO0FBQ0EsVUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUYsR0FBTSxDQUFDLENBQUMsQ0FBRixHQUFNLFFBQXRCO0FBQ0EsV0FBTztBQUFFLE1BQUEsQ0FBRjtBQUFLLE1BQUE7QUFBTCxLQUFQO0FBQ0wsR0E5Um9COztBQWdTckI7Ozs7Ozs7Ozs7QUFVQSxFQUFBLGdCQUFnQixFQUFFLFVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsRUFBbEIsRUFBc0IsSUFBdEIsRUFBNkI7QUFDOUMsVUFBTSxDQUFDLEdBQUcsS0FBSyxVQUFMLENBQWdCLEVBQWhCLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLElBQTVCLENBQVY7QUFDSyxVQUFNLENBQUMsR0FBRyxLQUFLLFdBQUwsQ0FBaUIsRUFBakIsRUFBcUIsRUFBckIsRUFBeUIsRUFBekIsRUFBNkIsSUFBN0IsQ0FBVjtBQUNBLFdBQU8sS0FBSyw2QkFBTCxDQUFvQyxDQUFDLENBQUMsQ0FBdEMsRUFBeUMsQ0FBQyxDQUFDLENBQTNDLEVBQThDLENBQUMsQ0FBQyxDQUFoRCxFQUFtRCxDQUFDLENBQUMsQ0FBckQsQ0FBUDtBQUNMO0FBOVNvQixDQUF0QjtBQW1UQSxNQUFNLENBQUMsT0FBUCxDQUFlLGVBQWYsR0FBaUMsZUFBakMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcclxuKiBDcmVhdGVzIGEgY2FudmFzIGVsZW1lbnQgaW4gdGhlIERPTSB0byB0ZXN0IGZvciBicm93c2VyIHN1cHBvcnRcclxuKiB0byBzZWxlY3RlZCBlbGVtZW50IHRvIG1hdGNoIHNpemUgZGltZW5zaW9ucy5cclxuKiBAcGFyYW0ge3N0cmluZ30gY29udGV4dFR5cGUgLSAoICcyZCcgfCAnd2ViZ2wnIHwgJ2V4cGVyaW1lbnRhbC13ZWJnbCcgfCAnd2ViZ2wyJywgfCAnYml0bWFwcmVuZGVyZXInICApXHJcbiogVGhlIHR5cGUgb2YgY2FudmFzIGFuZCBjb250ZXh0IGVuZ2luZSB0byBjaGVjayBzdXBwb3J0IGZvclxyXG4qIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgYm90aCBjYW52YXMgYW5kIHRoZSBjb250ZXh0IGVuZ2luZSBhcmUgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyXHJcbiovXHJcblxyXG5mdW5jdGlvbiBjaGVja0NhbnZhc1N1cHBvcnQoIGNvbnRleHRUeXBlICkge1xyXG4gICAgbGV0IGN0eCA9IGNvbnRleHRUeXBlIHx8ICcyZCc7XHJcbiAgICBsZXQgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdjYW52YXMnICk7XHJcbiAgICByZXR1cm4gISEoZWxlbS5nZXRDb250ZXh0ICYmIGVsZW0uZ2V0Q29udGV4dCggY3R4ICkgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjaGVja0NhbnZhc1N1cHBvcnQ7IiwicmVxdWlyZSggJy4vbGlnaHRuaW5nVGVzdEluY2x1ZGUuanMnICk7XHJcbiIsImxldCBjaGVja0NhbnZhc1N1cHBvcnQgPSByZXF1aXJlKCAnLi9jaGVja0NhbnZhc1N1cHBvcnQuanMnICk7XHJcbnJlcXVpcmUoICcuL3V0aWxzL3JhZlBvbHlmaWxsLmpzJyk7XHJcbnJlcXVpcmUoICcuL3V0aWxzL2NhbnZhc0FwaUF1Z21lbnRhdGlvbi5qcycpO1xyXG5cclxubGV0IGVhc2luZyA9IHJlcXVpcmUoICcuL3V0aWxzL2Vhc2luZy5qcycgKS5lYXNpbmdFcXVhdGlvbnM7XHJcbmxldCBlYXNlRm4gPSBlYXNpbmcuZWFzZU91dFNpbmU7XHJcblxyXG5sZXQgdHJpZyA9IHJlcXVpcmUoICcuL3V0aWxzL3RyaWdvbm9taWNVdGlscy5qcycgKS50cmlnb25vbWljVXRpbHM7XHJcbmxldCBwb2ludE9uUGF0aCA9IHRyaWcuZ2V0UG9pbnRPblBhdGg7XHJcbmxldCBjYWxjRCA9IHRyaWcuZGlzdDtcclxubGV0IGNhbGNBID0gdHJpZy5hbmdsZTtcclxuXHJcbmxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCAnLi91dGlscy9tYXRoVXRpbHMuanMnICk7XHJcbmxldCBybmQgPSBtYXRoVXRpbHMucmFuZG9tO1xyXG5sZXQgcm5kSW50ID0gbWF0aFV0aWxzLnJhbmRvbUludGVnZXI7XHJcblxyXG5sZXQgbGlnbnRuaW5nTWdyID0gcmVxdWlyZSggJy4vbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvbGlnaHRuaW5nVXRpbGl0aWVzLmpzJyk7XHJcblxyXG5cclxuLy8gaG91c2VrZWVwaW5nXHJcbmxldCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2xpZ2h0bmluZ0RyYXdpbmdUZXN0JyApO1xyXG5sZXQgY1cgPSBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxubGV0IGNIID0gY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxubGV0IGMgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbmxpZ250bmluZ01nci5zZXRDYW52YXNDZmcoICcjbGlnaHRuaW5nRHJhd2luZ1Rlc3QnICk7XHJcblxyXG5jLmxpbmVDYXAgPSAncm91bmQnO1xyXG5sZXQgY291bnRlciA9IDA7XHJcblxyXG5sZXQgc2hvd0RlYnVnSW5mbyA9IGZhbHNlO1xyXG5cclxuLy8gdGVzdCBWZWN0b3IgcGF0aFxyXG5sZXQgdGVzdFZlYyA9IHtcclxuXHRzdGFydFg6IGNXIC8gMixcclxuXHRzdGFydFk6IDUwLFxyXG5cdGVuZFg6IChjVyAvIDIpLFxyXG5cdGVuZFk6IGNIIC0gNTBcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd0xpbmUoIGRlYnVnICkge1xyXG5cdGlmICggZGVidWcgPT09IHRydWUgKSB7XHJcblx0XHRjLnN0cm9rZVN0eWxlID0gJ3JlZCc7XHJcblx0XHRjLnNldExpbmVEYXNoKCBbNSwgMTVdICk7XHJcblx0XHRjLmxpbmUoIHRlc3RWZWMuc3RhcnRYLCB0ZXN0VmVjLnN0YXJ0WSwgdGVzdFZlYy5lbmRYLCB0ZXN0VmVjLmVuZFkgKTtcclxuXHRcdGMuc2V0TGluZURhc2goIFtdICk7XHJcblx0fVxyXG59XHJcblxyXG4vLyBsZXQgaXRlcmF0aW9ucyA9IHJuZEludCggMTAsIDUwICk7XHJcbmxldCBpdGVyYXRpb25zID0gMTtcclxuXHJcbmxldCBiYXNlVGhlbWUgPSB7XHJcblx0Y2FudmFzVzogY1csXHJcblx0Y2FudmFzSDogY0gsXHJcblx0c3RhcnRYOiB0ZXN0VmVjLnN0YXJ0WCxcclxuXHRzdGFydFk6IHRlc3RWZWMuc3RhcnRZLFxyXG5cdGVuZFg6IHRlc3RWZWMuZW5kWCxcclxuXHRlbmRZOiB0ZXN0VmVjLmVuZFksXHJcblx0c3ViZGl2aXNpb25zOiBtYXRoVXRpbHMucmFuZG9tSW50ZWdlciggMywgNiApLFxyXG5cdHNwZWVkTW9kUmF0ZTogMC45LFxyXG5cdHdpbGxDb25uZWN0OiB0cnVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVRoZW1lKCBldmVudCApIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0Y2FudmFzVzogY1csXHJcblx0XHRjYW52YXNIOiBjSCxcclxuXHRcdHN0YXJ0WDogZXZlbnQuY2xpZW50WCxcclxuXHRcdHN0YXJ0WTogZXZlbnQuY2xpZW50WSxcclxuXHRcdGVuZFg6IHRlc3RWZWMuZW5kWCxcclxuXHRcdGVuZFk6IHRlc3RWZWMuZW5kWSxcclxuXHRcdHN1YmRpdmlzaW9uczogbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoIDMsIDYgKVxyXG5cdH1cclxufVxyXG5cclxuXHJcbmxpZ250bmluZ01nci5jcmVhdGVMaWdodG5pbmcoIGJhc2VUaGVtZSApO1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBCdXR0b24gaGFuZGxlcnNcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuJCggJy5qcy1ydW4nICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApe1xyXG5cdGxpZ250bmluZ01nci5jcmVhdGVMaWdodG5pbmcoIGJhc2VUaGVtZSApO1xyXG59ICk7XHJcblxyXG4kKCAnLmpzLWNsZWFyLW1ncicgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICl7XHJcblx0bGlnbnRuaW5nTWdyLmNsZWFyTWVtYmVyQXJyYXkoKTtcclxufSApO1xyXG5cclxuJCggJy5qcy1jbGVhci1tZ3ItcnVuJyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKXtcclxuXHRsaWdudG5pbmdNZ3IuY2xlYXJNZW1iZXJBcnJheSgpO1xyXG5cdGxpZ250bmluZ01nci5jcmVhdGVMaWdodG5pbmcoIGJhc2VUaGVtZSApO1xyXG59ICk7XHJcblxyXG4kKCAnY2FudmFzJyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKXtcclxuXHRsaWdudG5pbmdNZ3IuY3JlYXRlTGlnaHRuaW5nKCBjcmVhdGVUaGVtZSggZXZlbnQgKSApO1xyXG59ICk7XHJcblxyXG4kKCAnLmpzLWJ1dHRvbi10b2dnbGUnICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApIHtcclxuXHRsZXQgdGhpc0l0ZW0gPSAkKCB0aGlzICk7XHJcblx0aWYgKCB0aGlzSXRlbS5oYXNDbGFzcyggJ2pzLWlzQWN0aXZlJykgKSB7XHJcblx0XHR0aGlzSXRlbS5yZW1vdmVDbGFzcyggJ2pzLWlzQWN0aXZlJyk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHRoaXNJdGVtLmFkZENsYXNzKCAnanMtaXNBY3RpdmUnKTtcclxuXHR9XHJcblxyXG5cdGlmICggdHlwZW9mICQoIHRoaXMgKS5hdHRyKCAnZGF0YS1saW5rZWQtdG9nZ2xlJyApICE9PSBcInVuZGVmaW5lZFwiICkge1xyXG5cdFx0JCggdGhpcyApLnBhcmVudCgpLmZpbmQoICcuJyskKCB0aGlzICkuYXR0ciggJ2RhdGEtbGlua2VkLXRvZ2dsZScgKSApLnJlbW92ZUNsYXNzKCAnanMtaXNBY3RpdmUnICk7XHJcblx0fVxyXG5cclxufSApO1xyXG5cclxuJCggJy5qcy1zaG93LWRlYnVnLW92ZXJsYXknICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApe1xyXG5cdGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnYWN0aXZlJyApICkge1xyXG5cdFx0JCggdGhpcyApLnJlbW92ZUNsYXNzKCAnYWN0aXZlJyApO1xyXG5cdFx0c2hvd0RlYnVnSW5mbyA9IGZhbHNlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHQkKCB0aGlzICkuYWRkQ2xhc3MoICdhY3RpdmUnICk7XHJcblx0XHRzaG93RGVidWdJbmZvID0gdHJ1ZTtcclxuXHR9XHJcbn0gKTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQXBwIHN0YXJ0XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGRyYXdUZXN0KCkge1xyXG5cdGxpZ250bmluZ01nci51cGRhdGUoIGMgKTtcclxuXHRkcmF3TGluZSggc2hvd0RlYnVnSW5mbyApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhclNjcmVlbigpIHtcclxuXHRjLmZpbGxTdHlsZSA9ICdibGFjayc7XHJcblx0Yy5maWxsUmVjdCggMCwgMCwgY1csIGNIICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhZkxvb3AoKSB7XHJcblx0Ly8gZmx1c2ggc2NyZWVuIGJ1ZmZlclxyXG5cdGNsZWFyU2NyZWVuKCk7XHJcblx0Ly8gRG8gd2hhdGV2ZXJcclxuXHRkcmF3VGVzdCgpO1xyXG5cdC8vbG9vcFxyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSggcmFmTG9vcCApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0aWFsaXNlKCkge1xyXG5cdC8vIHNldHVwXHJcblx0XHQvLyBkbyBzZXR1cCB0aGluZ3MgaGVyZVxyXG5cdC8vbG9vcGVyXHJcblx0cmFmTG9vcCgpO1xyXG59XHJcblxyXG5pbml0aWFsaXNlKCk7XHJcbiIsImZ1bmN0aW9uIGNsZWFyTWVtYmVyQXJyYXkoKSB7XHJcblx0dGhpcy5tZW1iZXJzLmxlbmd0aCA9IDA7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xlYXJNZW1iZXJBcnJheTsiLCJsZXQgZWFzaW5nID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL2Vhc2luZy5qcycgKS5lYXNpbmdFcXVhdGlvbnM7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVCbHVyQXJyYXkoIGJsdXJDb3VudCwgbWluQmx1ckRpc3QsIG1heEJsdXJEaXN0LCBlYXNlICl7XHJcblx0bGV0IHRtcCA9IFtdO1xyXG5cdGxldCBlYXNlRm4gPSBlYXNpbmdbIGVhc2UgXTtcclxuXHRsZXQgY2hhbmdlRGVsdGEgPSBtYXhCbHVyRGlzdCAtIG1pbkJsdXJEaXN0O1xyXG5cdGZvciggbGV0IGkgPSAwOyBpIDwgYmx1ckNvdW50OyBpKysgKSB7XHJcblx0XHR0bXAucHVzaChcclxuXHRcdFx0TWF0aC5mbG9vciggZWFzZUZuKCBpLCBtaW5CbHVyRGlzdCwgY2hhbmdlRGVsdGEsIGJsdXJDb3VudCApIClcclxuXHRcdCk7XHJcblx0fVxyXG5cdHJldHVybiB0bXA7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJsdXJBcnJheTsiLCJsZXQgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL21hdGhVdGlscy5qcycgKTtcclxubGV0IGVhc2luZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5sZXQgdHJpZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy90cmlnb25vbWljVXRpbHMuanMnICkudHJpZ29ub21pY1V0aWxzO1xyXG5cclxubGV0IGxtZ3JVdGlscyA9IHJlcXVpcmUoICcuL2xpZ2h0bmluZ01hbmFnZXJVdGlsaXRpZXMuanMnICk7XHJcbmxldCBjcmVhdGVMaWdodG5pbmdQYXJlbnQgPSBsbWdyVXRpbHMuY3JlYXRlTGlnaHRuaW5nUGFyZW50O1xyXG5cclxubGV0IHJlbmRlckNvbmZpZyA9IHJlcXVpcmUoICcuL3JlbmRlckNvbmZpZy5qcycgKTtcclxuXHJcbmxldCBtYWluUGF0aEFuaW1TZXF1ZW5jZSA9IHJlcXVpcmUoIGAuLi9zZXF1ZW5jZXIvbWFpblBhdGhBbmltU2VxdWVuY2UuanNgICk7XHJcbmxldCBjaGlsZFBhdGhBbmltU2VxdWVuY2UgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL2NoaWxkUGF0aEFuaW1TZXF1ZW5jZS5qc2AgKTtcclxuXHJcbmxldCBjcmVhdGVQYXRoRnJvbU9wdGlvbnMgPSByZXF1aXJlKCAnLi4vcGF0aC9jcmVhdGVQYXRoRnJvbU9wdGlvbnMuanMnICk7XHJcbmxldCBjcmVhdGVQYXRoQ29uZmlnID0gcmVxdWlyZSggJy4uL3BhdGgvY3JlYXRlUGF0aENvbmZpZy5qcycgKTtcclxubGV0IGNhbGN1bGF0ZVN1YkRSYXRlID0gcmVxdWlyZSggJy4uL3BhdGgvY2FsY3VsYXRlU3ViRFJhdGUuanMnICk7XHJcblxyXG4vLyBzdG9yZSBzdWJkaXZpc2lvbiBsZXZlbCBzZWdtZW50IGNvdW50IGFzIGEgbG9vayB1cCB0YWJsZS9hcnJheVxyXG5sZXQgc3ViRFNlZ21lbnRDb3VudExvb2tVcCA9IFsgMSwgMiwgNCwgOCwgMTYsIDMyLCA2NCwgMTI4LCAyNTYsIDUxMiwgMTAyNCBdO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTGlnaHRuaW5nKCBvcHRpb25zICkge1xyXG5cclxuXHRsZXQgbE1nciA9IHRoaXM7XHJcblx0bGV0IG9wdHMgPSBvcHRpb25zO1xyXG5cdGxldCBjcmVhdGlvbkNvbmZpZyA9IHRoaXMuY3JlYXRpb25Db25maWc7XHJcblx0bGV0IGJyYW5jaENmZyA9IGNyZWF0aW9uQ29uZmlnLmJyYW5jaGVzO1xyXG5cdGxNZ3IuY2FudmFzVyA9IG9wdHMuY2FudmFzVztcclxuXHRsTWdyLmNhbnZhc0ggPSBvcHRzLmNhbnZhc0g7XHJcblx0bGV0IG1heENhbnZhc0Rpc3QgPSB0cmlnLmRpc3QoIDAsIDAsIG9wdHMuY2FudmFzVywgb3B0cy5jYW52YXNIICk7XHJcblx0XHJcblx0YnJhbmNoQ2ZnLmRlcHRoLmN1cnIgPSAxO1xyXG5cclxuXHQvLyBsZXQgbWF4U3ViRCA9IDg7XHJcblx0bGV0IHN1YkQgPSA2O1xyXG5cdGxldCBzdWJEaXZzID0gb3B0cy5zdWJkaXZpc2lvbnMgfHwgbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoIGJyYW5jaENmZy5zdWJELm1pbiwgYnJhbmNoQ2ZnLnN1YkQubWF4KTtcclxuXHRcclxuXHRsZXQgZCA9IHRyaWcuZGlzdCggb3B0cy5zdGFydFgsIG9wdHMuc3RhcnRZLCBvcHRzLmVuZFgsIG9wdHMuZW5kWSApO1xyXG5cdGxldCBzdWJEUmF0ZSA9IGNhbGN1bGF0ZVN1YkRSYXRlKCBkLCBtYXhDYW52YXNEaXN0LCBzdWJEICk7XHJcblx0bGV0IHBhcmVudFBhdGhEaXN0ID0gZDtcclxuXHRcclxuXHRsZXQgc3BlZWQgPSAgKCBkIC8gc3ViRFNlZ21lbnRDb3VudExvb2tVcFsgc3ViRFJhdGUgXSApO1xyXG5cdGxldCBzcGVlZE1vZFJhdGUgPSBvcHRzLnNwZWVkTW9kUmF0ZSB8fCAwLjY7XHJcblx0bGV0IHNwZWVkTW9kID0gc3BlZWQgKiBzcGVlZE1vZFJhdGU7XHJcblx0Ly8gY2FsY3VsYXRlIGRyYXcgc3BlZWQgYmFzZWQgb24gYm9sdCBsZW5ndGggLyBcclxuXHJcblx0bGV0IHRlbXBQYXRocyA9IFtdO1xyXG5cclxuXHQvLyAxLiBjcmVhdGUgaW50aWFsL21haW4gcGF0aFxyXG5cdHRlbXBQYXRocy5wdXNoKFxyXG5cdFx0Y3JlYXRlUGF0aEZyb21PcHRpb25zKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aXNDaGlsZDogZmFsc2UsXHJcblx0XHRcdFx0aXNBY3RpdmU6IHRydWUsXHJcblx0XHRcdFx0aXNSZW5kZXJpbmc6IHRydWUsXHJcblx0XHRcdFx0c2VxdWVuY2VTdGFydEluZGV4OiAxLFxyXG5cdFx0XHRcdHNlcXVlbmNlczogbWFpblBhdGhBbmltU2VxdWVuY2UsXHJcblx0XHRcdFx0c3RhcnRYOiBvcHRzLnN0YXJ0WCxcclxuXHRcdFx0XHRzdGFydFk6IG9wdHMuc3RhcnRZLFxyXG5cdFx0XHRcdGVuZFg6IG9wdHMuZW5kWCxcclxuXHRcdFx0XHRlbmRZOiBvcHRzLmVuZFksXHJcblx0XHRcdFx0cGF0aENvbFI6IDE1NSxcclxuXHRcdFx0XHRwYXRoQ29sRzogMTU1LFxyXG5cdFx0XHRcdHBhdGhDb2xCOiAyNTUsXHJcblx0XHRcdFx0cGF0aENvbEE6IDEsXHJcblx0XHRcdFx0Z2xvd0NvbFI6IDE1MCxcclxuXHRcdFx0XHRnbG93Q29sRzogMTUwLFxyXG5cdFx0XHRcdGdsb3dDb2xCOiAyNTUsXHJcblx0XHRcdFx0Z2xvd0NvbEE6IDEsXHJcblx0XHRcdFx0cGFyZW50UGF0aERpc3Q6IDAsXHJcblx0XHRcdFx0bGluZVdpZHRoOiAxLFxyXG5cdFx0XHRcdHN1YkRSYXRlOiBzdWJEUmF0ZSxcclxuXHRcdFx0XHRzdWJkaXZpc2lvbnM6IHN1YkQsXHJcblx0XHRcdFx0ZFJhbmdlOiBkIC8gMlxyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0KTtcclxuXHJcblx0bGV0IGJyYW5jaFBvaW50c0NvdW50ID0gNjtcclxuXHRsZXQgYnJhbmNoU3ViREZhY3RvciA9IDY7XHJcblx0Ly8gY3ljbGUgdGhyb3VnaCBicmFuY2ggZGVwdGggbGV2ZWxzIHN0YXJ0aW5nIHdpdGggMFxyXG5cdGZvciggbGV0IGJyYW5jaEN1cnJOdW0gPSAwOyBicmFuY2hDdXJyTnVtIDw9IGJyYW5jaENmZy5kZXB0aC5jdXJyOyBicmFuY2hDdXJyTnVtKyspe1xyXG5cdFx0Ly8gY3ljbGUgdGhyb3VnaCBjdXJyZW50IHBhdGhzIGluIHRlbXBQYXRoIGFycmF5XHJcblx0XHRmb3IoIGxldCBjdXJyUGF0aE51bSA9IDA7IGN1cnJQYXRoTnVtIDwgdGVtcFBhdGhzLmxlbmd0aDsgY3VyclBhdGhOdW0rKyApIHtcclxuXHRcdFx0Ly8gZ2V0IHBhdGggb2JqZWN0IGluc3RhbmNlXHJcblx0XHRcdGxldCB0aGlzUGF0aENmZyA9IHRlbXBQYXRoc1sgY3VyclBhdGhOdW0gXTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICggdGhpc1BhdGhDZmcuYnJhbmNoRGVwdGggIT09IGJyYW5jaEN1cnJOdW0gKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGdldCB0aGUgcGF0aCBwb2ludCBhcnJheVxyXG5cdFx0XHRsZXQgcCA9IHRoaXNQYXRoQ2ZnLnBhdGg7XHJcblx0XHRcdGxldCBwTGVuID0gcC5sZW5ndGg7XHJcblxyXG5cdFx0XHQvLyBmb3IgZWFjaCBvZiB0aGUgZ2VuZXJhdGVkIGJyYW5jaCBjb3VudFxyXG5cdFx0XHRmb3IoIGxldCBrID0gMDsgayA8IGJyYW5jaFBvaW50c0NvdW50OyBrKysgKSB7XHJcblxyXG5cdFx0XHRcdGxldCBwQ2ZnID0gY3JlYXRlUGF0aENvbmZpZyhcclxuXHRcdFx0XHRcdHRoaXNQYXRoQ2ZnLFxyXG5cdFx0XHRcdFx0e1x0XHJcblx0XHRcdFx0XHRcdHBhcmVudFBhdGhEaXN0OiBkLFxyXG5cdFx0XHRcdFx0XHRicmFuY2hEZXB0aDogYnJhbmNoQ3Vyck51bSArIDFcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHQpO1xyXG5cclxuXHRcdFx0XHR0ZW1wUGF0aHMucHVzaChcclxuXHRcdFx0XHRcdGNyZWF0ZVBhdGhGcm9tT3B0aW9ucyhcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdGlzQ2hpbGQ6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0aXNBY3RpdmU6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0aXNSZW5kZXJpbmc6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0YnJhbmNoRGVwdGg6IHBDZmcuYnJhbmNoRGVwdGgsXHJcblx0XHRcdFx0XHRcdFx0cmVuZGVyT2Zmc2V0OiBwQ2ZnLnJlbmRlck9mZnNldCxcclxuXHRcdFx0XHRcdFx0XHRzZXF1ZW5jZVN0YXJ0SW5kZXg6IDEsXHJcblx0XHRcdFx0XHRcdFx0c2VxdWVuY2VzOiBjaGlsZFBhdGhBbmltU2VxdWVuY2UsXHJcblx0XHRcdFx0XHRcdFx0cGF0aENvbFI6IDE1NSxcclxuXHRcdFx0XHRcdFx0XHRwYXRoQ29sRzogMTU1LFxyXG5cdFx0XHRcdFx0XHRcdHBhdGhDb2xCOiAyNTUsXHJcblx0XHRcdFx0XHRcdFx0Z2xvd0NvbFI6IDE1MCxcclxuXHRcdFx0XHRcdFx0XHRnbG93Q29sRzogMTUwLFxyXG5cdFx0XHRcdFx0XHRcdGdsb3dDb2xCOiAyNTUsXHJcblx0XHRcdFx0XHRcdFx0Z2xvd0NvbEE6IDEsXHJcblx0XHRcdFx0XHRcdFx0c3RhcnRYOiBwQ2ZnLnN0YXJ0WCxcclxuXHRcdFx0XHRcdFx0XHRzdGFydFk6IHBDZmcuc3RhcnRZLFxyXG5cdFx0XHRcdFx0XHRcdGVuZFg6IHBDZmcuZW5kWCxcclxuXHRcdFx0XHRcdFx0XHRlbmRZOiBwQ2ZnLmVuZFksXHJcblx0XHRcdFx0XHRcdFx0cGFyZW50UGF0aERpc3Q6IGQsXHJcblx0XHRcdFx0XHRcdFx0bGluZVdpZHRoOiAxLFxyXG5cdFx0XHRcdFx0XHRcdHN1YmRpdmlzaW9uczogY2FsY3VsYXRlU3ViRFJhdGUoIHBDZmcuZFZhciwgbWF4Q2FudmFzRGlzdCwgc3ViRCApLFxyXG5cdFx0XHRcdFx0XHRcdGRSYW5nZTogcENmZy5kVmFyLFxyXG5cdFx0XHRcdFx0XHRcdHNlcXVlbmNlU3RhcnRJbmRleDogMVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQpXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fSAvLyBlbmQgY3VycmVudCBwYXRocyBsb29wXHJcblxyXG5cdFx0aWYgKCBicmFuY2hQb2ludHNDb3VudCA+IDAgKSB7XHJcblx0XHRcdGJyYW5jaFBvaW50c0NvdW50ID0gTWF0aC5mbG9vciggYnJhbmNoUG9pbnRzQ291bnQgLyAxNiApO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCBicmFuY2hTdWJERmFjdG9yID4gMSApIHtcclxuXHRcdFx0YnJhbmNoU3ViREZhY3Rvci0tO1xyXG5cdFx0fVxyXG5cdH0gLy8gZW5kIGJyYW5jaCBkZXB0aCBsb29wXHJcblxyXG5cdC8vIGNyZWF0ZSBwYXJlbnQgbGlnaHRuaW5nIGluc3RhbmNlXHJcblx0Y3JlYXRlTGlnaHRuaW5nUGFyZW50KFxyXG5cdFx0eyBzcGVlZDogc3BlZWRNb2QsIHRlbXBQYXRoczogdGVtcFBhdGhzIH0sXHJcblx0XHR0aGlzLm1lbWJlcnNcclxuXHQpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUxpZ2h0bmluZzsiLCJjb25zdCBjcmVhdGlvbkNvbmZpZyA9ICB7XHJcblx0YnJhbmNoZXM6IHtcclxuXHRcdHN1YkQ6IHtcclxuXHRcdFx0bWluOiAzLFxyXG5cdFx0XHRtYXg6IDZcclxuXHRcdH0sXHJcblx0XHRkZXB0aDoge1xyXG5cdFx0XHRtaW46IDEsXHJcblx0XHRcdG1heDogMixcclxuXHRcdFx0Y3VycjogMFxyXG5cdFx0fSxcclxuXHRcdHNwYXduUmF0ZToge1xyXG5cdFx0XHRtaW46IDUsXHJcblx0XHRcdG1heDogMTBcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0aW9uQ29uZmlnOyIsImZ1bmN0aW9uIGRyYXdEZWJ1Z0xpbmVzKCBjICkge1xyXG5cdGxldCBtZW1iZXJzID0gdGhpcy5tZW1iZXJzO1xyXG5cdGxldCBtZW1iZXJzTGVuID0gbWVtYmVycy5sZW5ndGg7XHJcblxyXG5cdGZvciggbGV0IGkgPSAwOyBpIDwgbWVtYmVyc0xlbjsgaSsrICkge1xyXG5cdFx0bGV0IHRoaXNNZW1iZXIgPSB0aGlzLm1lbWJlcnNbIGkgXTtcclxuXHJcblx0XHRsZXQgdGhpc1BhdGhzID0gdGhpc01lbWJlci5wYXRocztcclxuXHRcdGxldCB0aGlzUGF0aHNMZW4gPSB0aGlzUGF0aHMubGVuZ3RoO1xyXG5cclxuXHRcdGZvciggbGV0IGogPSAwOyBqIDwgdGhpc1BhdGhzTGVuOyBqKysgKSB7XHJcblx0XHRcdGxldCBwYXRoID0gdGhpc1BhdGhzWyBqIF0ucGF0aDtcclxuXHRcdFx0Yy5saW5lV2lkdGggPSA1O1xyXG5cdFx0XHRjLnN0cm9rZVN0eWxlID0gJ3JlZCc7XHJcblx0XHRcdGMuc2V0TGluZURhc2goIFs1LCAxNV0gKTtcclxuXHRcdFx0Yy5saW5lKCBwYXRoWzBdLngsIHBhdGhbMF0ueSwgcGF0aFtwYXRoLmxlbmd0aCAtIDFdLngsIHBhdGhbcGF0aC5sZW5ndGggLSAxXS55ICk7XHJcblx0XHRcdGMuc2V0TGluZURhc2goIFtdICk7XHRcclxuXHRcdH1cclxuXHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRyYXdEZWJ1Z0xpbmVzOyIsImxldCB0cmlnID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL3RyaWdvbm9taWNVdGlscy5qcycgKS50cmlnb25vbWljVXRpbHM7XHJcblxyXG5mdW5jdGlvbiBkcmF3RGVidWdSYWRpYWxUZXN0KCBjICkge1xyXG5cdGxldCBQSSA9IE1hdGguUEk7XHJcblx0UElTUSA9IFBJICogMjtcclxuXHRsZXQgY1ggPSAxNTAsIGNZID0gMTUwLCBjUiA9IDEwMDtcclxuXHRsZXQgemVyb1JvdFBvaW50ID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oIGNYLCBjWSwgY1IsIFBJU1EgKTtcclxuXHRsZXQgcVJvdFBvaW50ID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oIGNYLCBjWSwgY1IsIFBJU1EgKiAwLjI1ICk7XHJcblx0bGV0IGhhbGZSb3RQb2ludCA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBjWCwgY1ksIGNSLCBQSVNRICogMC41ICk7XHJcblx0bGV0IHRocmVlUVJvdFBvaW50ID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oIGNYLCBjWSwgY1IsIFBJU1EgKiAwLjc1ICk7XHJcblxyXG5cdC8vIHN0YXJ0IHBvaW50XHJcblx0bGV0IHRlc3RQMVBvaW50ID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oIGNYLCBjWSwgY1IsIFBJU1EgKiAwLjEyNSApO1xyXG5cdC8vIGVuZCBwb2ludFxyXG5cdGxldCB0ZXN0UDJQb2ludCA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBjWCwgY1ksIGNSLCBQSVNRICogMC42MjUgKTtcclxuXHQvLyBjdXJ2ZVBvaW50XHJcblx0bGV0IHRlc3RQM1BvaW50ID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oIGNYLCBjWSwgY1IsIFBJU1EgKiAwLjg3NSApO1xyXG5cdGxldCB0ZXN0Tm9ybWFsUG9pbnQgPSB0cmlnLnByb2plY3ROb3JtYWxBdERpc3RhbmNlKFxyXG5cdFx0dGVzdFAxUG9pbnQsIHRlc3RQM1BvaW50LCB0ZXN0UDJQb2ludCwgMC41LCBjUiAqIDEuMVxyXG5cdCk7XHJcblx0Ly8gcmVmZXJlbmNlIHBvaW50cyByZW5kZXJcclxuXHRjLnN0cm9rZVN0eWxlID0gJyM4ODAwMDAnO1xyXG5cdGMuZmlsbFN0eWxlID0gJ3JlZCc7XHJcblx0Yy5saW5lV2lkdGggPSAyO1xyXG5cdGMuc3Ryb2tlQ2lyY2xlKCBjWCwgY1ksIGNSICk7XHJcblx0Yy5maWxsQ2lyY2xlKCBjWCwgY1ksIDUgKTtcclxuXHRjLmZpbGxDaXJjbGUoIHplcm9Sb3RQb2ludC54LCB6ZXJvUm90UG9pbnQueSwgNSApO1xyXG5cdGMuZmlsbENpcmNsZSggcVJvdFBvaW50LngsIHFSb3RQb2ludC55LCA1ICk7XHJcblx0Yy5maWxsQ2lyY2xlKCBoYWxmUm90UG9pbnQueCwgaGFsZlJvdFBvaW50LnksIDUgKTtcclxuXHRjLmZpbGxDaXJjbGUoIHRocmVlUVJvdFBvaW50LngsIHRocmVlUVJvdFBvaW50LnksIDUgKTtcclxuXHJcblx0Ly8gcmVmZW5jZSBzaGFwZSB0cmlhbmdsZSBwb2ludHMgcmVuZGVyXHJcblx0Yy5maWxsU3R5bGUgPSAnIzAwODhlZSc7XHJcblx0Yy5maWxsQ2lyY2xlKCB0ZXN0UDFQb2ludC54LCB0ZXN0UDFQb2ludC55LCA1ICk7XHJcblx0Yy5maWxsQ2lyY2xlKCB0ZXN0UDJQb2ludC54LCB0ZXN0UDJQb2ludC55LCA1ICk7XHJcblx0Yy5maWxsQ2lyY2xlKCB0ZXN0UDNQb2ludC54LCB0ZXN0UDNQb2ludC55LCA1ICk7XHJcblxyXG5cdC8vIHJlZmVuY2Ugc2hhcGUgZWRnZSByZW5kZXJcclxuXHRjLnN0cm9rZVN0eWxlID0gJyMwMDIyNjYnO1xyXG5cdGMuc2V0TGluZURhc2goIFszLCA2XSApO1xyXG5cdGMubGluZSggdGVzdFAxUG9pbnQueCwgdGVzdFAxUG9pbnQueSwgdGVzdFAyUG9pbnQueCwgdGVzdFAyUG9pbnQueSApO1xyXG5cdGMubGluZSggdGVzdFAxUG9pbnQueCwgdGVzdFAxUG9pbnQueSwgdGVzdFAzUG9pbnQueCwgdGVzdFAzUG9pbnQueSApO1xyXG5cdGMubGluZSggdGVzdFAyUG9pbnQueCwgdGVzdFAyUG9pbnQueSwgdGVzdFAzUG9pbnQueCwgdGVzdFAzUG9pbnQueSApO1xyXG5cclxuXHQvLyBwcm9qZWN0ZWQgTk9STUFMIHJlZmVyZW5jZSBwb2ludFxyXG5cdGMuZmlsbFN0eWxlID0gJyMwMGFhZmYnO1xyXG5cdGMuZmlsbENpcmNsZSggdGVzdE5vcm1hbFBvaW50LngsIHRlc3ROb3JtYWxQb2ludC55LCA1ICk7XHJcblxyXG5cdC8vIG5vcm1hbCBsaW5lIHJlbmRlclxyXG5cdC8vIGlubmVyXHJcblx0Yy5zZXRMaW5lRGFzaCggWzMsIDZdICk7XHJcblx0Yy5zdHJva2VTdHlsZSA9ICcjMDA1NTAwJztcclxuXHRjLmxpbmUoIGNYLCBjWSwgdGVzdFAzUG9pbnQueCwgdGVzdFAzUG9pbnQueSApO1xyXG5cdC8vIG91dGVyXHJcblx0Yy5zdHJva2VTdHlsZSA9ICcjMDBmZjAwJztcclxuXHRjLmxpbmUoIHRlc3RQM1BvaW50LngsIHRlc3RQM1BvaW50LnksIHRlc3ROb3JtYWxQb2ludC54LCB0ZXN0Tm9ybWFsUG9pbnQueSApO1xyXG5cdGMuc2V0TGluZURhc2goW10pO1xyXG5cclxuXHQvLyBjYWxjdWxhdGUgbm9ybWFsIGFuZ2xlIGJhY2sgZnJvbSB0ZXN0IHNoYXBlIGZvciB0ZXN0aW5nXHJcblx0bGV0IHRlc3RBbmdsZSA9IHRyaWcuZ2V0QW5nbGVPZk5vcm1hbCggdGVzdFAxUG9pbnQsIHRlc3RQM1BvaW50LCB0ZXN0UDJQb2ludCwwLjUpO1xyXG5cdC8vIHByb2plY3Qgbm9tYWwgcG9pbnQgZnJvbSBjYWxjdWxhdGlvblxyXG5cdGxldCB0ZXN0QW5nbGVQb2ludCA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKFxyXG5cdFx0Y1gsIGNZICsgMjAwLCAxMDAsXHJcblx0XHRNYXRoLmF0YW4yKHRlc3ROb3JtYWxQb2ludC55IC0gY1ksIHRlc3ROb3JtYWxQb2ludC54IC0gY1gpXHJcblx0XHQpO1xyXG5cclxuXHQvLyBkcmF3IGxpbmUgZm9yIHRlc3QgcmVmZXJlbmNlXHJcblx0Yy5zdHJva2VTdHlsZSA9ICcjMDAwMDk5JztcclxuXHRjLmZpbGxTdHlsZSA9ICcjMDA2NmRkJztcclxuXHRjLnN0cm9rZUNpcmNsZSggY1gsIGNZICsgMjAwLCA3NSApO1xyXG5cdGMubGluZSggY1gsIGNZICsgMjAwLCB0ZXN0QW5nbGVQb2ludC54LCB0ZXN0QW5nbGVQb2ludC55ICk7XHJcblx0Yy5maWxsQ2lyY2xlKCBjWCwgY1kgKyAyMDAsIDUgKTtcclxuXHRjLmZpbGxDaXJjbGUoIHRlc3RBbmdsZVBvaW50LngsIHRlc3RBbmdsZVBvaW50LnksIDUgKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkcmF3RGVidWdSYWRpYWxUZXN0OyIsImNvbnN0IGdsb2JhbENvbmZpZyA9IHtcclxuXHRpbnRlcnZhbE1pbjogMCxcclxuXHRpbnRlcnZhbE1heDogMCxcclxuXHRpbnRlcnZhbEN1cnJlbnQ6IDBcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxDb25maWc7IiwiY29uc3QgbE1nckNsb2NrID0ge1xyXG5cdGdsb2JhbDoge1xyXG5cdFx0aXNSdW5uaW5nOiBmYWxzZSxcclxuXHRcdGN1cnJlbnRUaWNrOiAwXHJcblx0fSxcclxuXHRsb2NhbDoge1xyXG5cdFx0aXNSdW5uaW5nOiBmYWxzZSxcclxuXHRcdGN1cnJlbnRUaWNrOiAwLFxyXG5cdFx0dGFyZ2V0OiAwXHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxNZ3JDbG9jazsiLCJsZXQgY3JlYXRlQmx1ckFycmF5ID0gcmVxdWlyZSggJy4vY3JlYXRlQmx1ckFycmF5LmpzJyApO1xyXG5sZXQgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL21hdGhVdGlscy5qcycgKTtcclxuXHJcbi8vIHN0YXRlIGxpc3QgZGVjbGFyYXRpb25zXHJcbmNvbnN0IElTX1VOSU5JVElBTElTRUQgPSAnaXNVbmluaXRpYWxpc2VkJztcclxuY29uc3QgSVNfSU5JVElBTElTRUQgPSAnaXNJbml0aWFsaXNlZCc7XHJcbmNvbnN0IElTX0FDVElWRSA9ICdpc0FjdGl2ZSc7XHJcbmNvbnN0IElTX0RSQVdJTkcgPSAnaXNEcmF3aW5nJztcclxuY29uc3QgSVNfRFJBV04gPSAnaXNEcmF3bic7XHJcbmNvbnN0IElTX0NPTk5FQ1RFRCA9ICdpc0Nvbm5lY3RlZCc7XHJcbmNvbnN0IElTX1JFRFJBV0lORyA9ICdpc1JlZHJhd2luZyc7XHJcbmNvbnN0IElTX0FOSU1BVEVEID0gJ2lzQW5pbWF0aW5nJztcclxuY29uc3QgSVNfRklFTERFRkZFQ1QgPSAnaXNGaWVsZEVmZmVjdCc7XHJcbmNvbnN0IElTX0NPVU5URE9XTiA9ICdpc0NvdW50ZG93bic7XHJcbmNvbnN0IElTX0NPTVBMRVRFID0gJ2lzQ29tcGxldGUnO1xyXG5jb25zdCBJU19DT1VOVERPV05DT01QTEVURSA9ICdpc0NvdW50ZG93bkNvbXBsZXRlJztcclxuXHJcbmZ1bmN0aW9uIHNldFN0YXRlKCBzdGF0ZU5hbWUgKSB7XHJcblx0bGV0IHN0YXRlcyA9IHRoaXMuc3RhdGUuc3RhdGVzO1xyXG5cdGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyggc3RhdGVzICk7XHJcblx0Y29uc3QgZW50cmllc0xlbiA9IGVudHJpZXMubGVuZ3RoO1xyXG5cdGZvciggbGV0IGkgPSAwOyBpIDwgZW50cmllc0xlbjsgaSsrICkge1xyXG5cdFx0bGV0IHRoaXNFbnRyeSA9IGVudHJpZXNbIGkgXTtcclxuXHRcdGxldCB0aGlzRW50cnlOYW1lID0gdGhpc0VudHJ5WyAwIF07XHJcblx0XHRpZiggdGhpc0VudHJ5TmFtZSA9PT0gc3RhdGVOYW1lICkge1xyXG5cdFx0XHRzdGF0ZXNbIHN0YXRlTmFtZSBdID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5zdGF0ZS5jdXJyZW50ID0gdGhpc0VudHJ5TmFtZTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBnZXRDdXJyZW50U3RhdGUoKSB7XHJcblx0cmV0dXJuIHRoaXMuc3RhdGUuY3VycmVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUmVuZGVyQ29uZmlnKCkge1xyXG5cdHRoaXMucmVuZGVyQ29uZmlnLmN1cnJIZWFkICs9IHRoaXMucmVuZGVyQ29uZmlnLnNlZ21lbnRzUGVyRnJhbWU7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpZ2h0bmluZ1BhcmVudCggb3B0cywgYXJyICkge1xyXG5cclxuXHRsZXQgbEluc3RhbmNlID0ge1xyXG5cdFx0c3BlZWQ6IG9wdHMuc3BlZWQgfHwgMSxcclxuXHRcdGlzRHJhd246IGZhbHNlLFxyXG5cdFx0aXNBbmltYXRlZDogb3B0cy5pc0FuaW1hdGVkIHx8IGZhbHNlLFxyXG5cdFx0d2lsbENvbm5lY3Q6IG9wdHMud2lsbENvbm5lY3QgfHwgZmFsc2UsXHJcblx0XHRza3lGbGFzaEFscGhhOiBvcHRzLnNreUZsYXNoQWxwaGEgfHwgMC4yLFxyXG5cdFx0b3JpZ2luRmxhc2hBbHBoYTogb3B0cy5vcmlnaW5GbGFzaEFscGhhIHx8IDEsXHJcblx0XHRnbG93Qmx1ckl0ZXJhdGlvbnM6IGNyZWF0ZUJsdXJBcnJheShcclxuXHRcdFx0bWF0aFV0aWxzLnJhbmRvbUludGVnZXIoIDIsIDYgKSxcclxuXHRcdFx0MzAsXHJcblx0XHRcdDEwMCxcclxuXHRcdFx0J2xpbmVhckVhc2UnXHJcblx0XHQpLFxyXG5cdFx0Y2xvY2s6IDAsXHJcblx0XHR0b3RhbENsb2NrOiBvcHRzLndpbGxDb25uZWN0ID8gbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoIDEwLCA2MCApIDogMCxcclxuXHRcdHN0YXRlOiB7XHJcblx0XHRcdGN1cnJlbnQ6ICdpc1VuaW5pdGlhbGlzZWQnLFxyXG5cdFx0XHRzdGF0ZXM6IHtcclxuXHRcdFx0XHRpc1VuaW5pdGlhbGlzZWQ6IHRydWUsXHJcblx0XHRcdFx0aXNJbml0aWFsaXNlZDogZmFsc2UsXHJcblx0XHRcdFx0aXNBY3RpdmU6IGZhbHNlLFxyXG5cdFx0XHRcdGlzRHJhd2luZzogZmFsc2UsXHJcblx0XHRcdFx0aXNEcmF3bjogZmFsc2UsXHJcblx0XHRcdFx0aXNDb25uZWN0ZWQ6IGZhbHNlLFxyXG5cdFx0XHRcdGlzUmVkcmF3aW5nOiBmYWxzZSxcclxuXHRcdFx0XHRpc0FuaW1hdGluZzogZmFsc2UsXHJcblx0XHRcdFx0aXNGaWVsZEVmZmVjdDogZmFsc2UsXHJcblx0XHRcdFx0aXNDb3VudGRvd246IGZhbHNlLFxyXG5cdFx0XHRcdGlzQ291bnRkb3duQ29tcGxldGU6IGZhbHNlLFxyXG5cdFx0XHRcdGlzQ29tcGxldGU6IGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRhY3Rpb25zOiB7XHJcblxyXG5cdFx0fSxcclxuXHRcdHN0YXRlQWN0aW9uczoge1xyXG5cdFx0XHRpc0Nvbm5lY3RlZDoge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0c2V0U3RhdGU6IHNldFN0YXRlLFxyXG5cdFx0Z2V0Q3VycmVudFN0YXRlOiBnZXRDdXJyZW50U3RhdGUsXHJcblx0XHRyZW5kZXJDb25maWc6IHtcclxuXHRcdFx0Y3VyckhlYWQ6IDAsXHJcblx0XHRcdHNlZ21lbnRzUGVyRnJhbWU6IG9wdHMuc3BlZWQgfHwgMVxyXG5cdFx0fSxcclxuXHRcdHVwZGF0ZVJlbmRlckNvbmZpZzogdXBkYXRlUmVuZGVyQ29uZmlnLFxyXG5cdFx0cGF0aHM6IG9wdHMudGVtcFBhdGhzIHx8IFtdXHJcblx0fTtcclxuXHJcblx0YXJyLnB1c2goIGxJbnN0YW5jZSApO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlTGlnaHRuaW5nUGFyZW50ID0gY3JlYXRlTGlnaHRuaW5nUGFyZW50O1xyXG4iLCJsZXQgZ2xvYmFsQ29uZmlnID0gcmVxdWlyZSggJy4vZ2xvYmFsQ29uZmlnLmpzJyApO1xyXG5sZXQgY3JlYXRpb25Db25maWcgPSByZXF1aXJlKCAnLi9jcmVhdGlvbkNvbmZpZy5qcycgKTtcclxubGV0IHJlbmRlckNvbmZpZyA9IHJlcXVpcmUoICcuL3JlbmRlckNvbmZpZy5qcycgKTtcclxubGV0IGxNZ3JDbG9jayA9IHJlcXVpcmUoICcuL2xNZ3JDbG9jay5qcycgKTtcclxubGV0IHNldEdsb2JhbEludGVydmFsID0gcmVxdWlyZSggJy4vc2V0R2xvYmFsSW50ZXJ2YWwuanMnICk7XHJcbmxldCBzZXRMb2NhbENsb2NrVGFyZ2V0ID0gcmVxdWlyZSggJy4vc2V0TG9jYWxDbG9ja1RhcmdldC5qcycgKTtcclxubGV0IGNyZWF0ZUxpZ2h0bmluZyA9IHJlcXVpcmUoICcuL2NyZWF0ZUxpZ2h0bmluZy5qcycgKTtcclxubGV0IGNsZWFyTWVtYmVyQXJyYXkgPSByZXF1aXJlKCAnLi9jbGVhck1lbWJlckFycmF5LmpzJyApO1xyXG5sZXQgc2V0Q2FudmFzRGV0YWlscyA9IHJlcXVpcmUoICcuL3NldENhbnZhc0RldGFpbHMuanMnICk7XHJcbmxldCB1cGRhdGUgPSByZXF1aXJlKCAnLi91cGRhdGVBcnIuanMnICk7XHJcbmxldCB1cGRhdGVSZW5kZXJDZmcgPSByZXF1aXJlKCAnLi91cGRhdGVSZW5kZXJDZmcuanMnICk7XHJcbmxldCBkcmF3RGVidWdSYWRpYWxUZXN0ID0gcmVxdWlyZSggJy4vZHJhd0RlYnVnUmFkaWFsVGVzdC5qcycgKTtcclxubGV0IGRyYXdEZWJ1Z0xpbmVzID0gcmVxdWlyZSggJy4vZHJhd0RlYnVnTGluZXMuanMnICk7XHJcbmxldCBTaW1wbGV4Tm9pc2UgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvc2ltcGxleC1ub2lzZS1uZXcuanMnICk7XHJcblxyXG5sZXQgbGlnbnRuaW5nTWdyID0ge1xyXG5cdG1lbWJlcnM6IFtdLFxyXG5cdGRlYnVnTWVtYmVyczogW10sXHJcblx0Y2FudmFzQ2ZnOiB7fSxcclxuXHRub2lzZUZpZWxkOiBuZXcgU2ltcGxleE5vaXNlKCksXHJcblx0c2V0Q2FudmFzQ2ZnOiBzZXRDYW52YXNEZXRhaWxzLFxyXG5cdGdsb2JhbENvbmZpZzpnbG9iYWxDb25maWcsXHJcblx0Y3JlYXRpb25Db25maWc6IGNyZWF0aW9uQ29uZmlnLFxyXG5cdHJlbmRlckNvbmZpZzogcmVuZGVyQ29uZmlnLFxyXG5cdGNsb2NrOiBsTWdyQ2xvY2ssXHJcblx0Y2xlYXJNZW1iZXJBcnJheTogY2xlYXJNZW1iZXJBcnJheSxcclxuXHRzZXRMb2NhbENsb2NrVGFyZ2V0OiBzZXRMb2NhbENsb2NrVGFyZ2V0LFxyXG5cdHNldEdsb2JhbEludGVydmFsOiBzZXRHbG9iYWxJbnRlcnZhbCxcclxuXHRjcmVhdGVMaWdodG5pbmc6IGNyZWF0ZUxpZ2h0bmluZyxcclxuXHR1cGRhdGU6IHVwZGF0ZSxcclxuXHR1cGRhdGVSZW5kZXJDZmc6IHVwZGF0ZVJlbmRlckNmZyxcclxuXHRkcmF3RGVidWdSYWRpYWxUZXN0OiBkcmF3RGVidWdSYWRpYWxUZXN0LFxyXG5cdGRyYXdEZWJ1Z0xpbmVzOiBkcmF3RGVidWdMaW5lc1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpZ250bmluZ01ncjsiLCJsZXQgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL21hdGhVdGlscy5qcycgKTtcclxubGV0IGxpZ2h0bmluZ1N0cmlrZVRpbWVNYXggPSAzMDA7XHJcbmxldCBzdHJpa2VEcmF3VGltZSA9IGxpZ2h0bmluZ1N0cmlrZVRpbWVNYXggLyAyO1xyXG5sZXQgc3RyaWtlRmlyZVRpbWUgPSBsaWdodG5pbmdTdHJpa2VUaW1lTWF4IC8gNjtcclxubGV0IHN0cmlrZUNvb2xUaW1lID0gbGlnaHRuaW5nU3RyaWtlVGltZU1heCAvIDM7XHJcblxyXG5jb25zdCByZW5kZXJDb25maWcgPSB7XHJcblx0Ymx1ckl0ZXJhdGlvbnM6IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCA1LCA4ICksXHJcblx0Ymx1clJlbmRlck9mZnNldDogMTAwMDAsXHJcblx0Y3VyckhlYWQ6IDAsXHJcblx0dGltaW5nOiB7XHJcblx0XHRtYXg6IGxpZ2h0bmluZ1N0cmlrZVRpbWVNYXgsXHJcblx0XHRkcmF3OiBzdHJpa2VEcmF3VGltZSxcclxuXHRcdGZpcmU6IHN0cmlrZUZpcmVUaW1lLFxyXG5cdFx0Y29vbDogc3RyaWtlQ29vbFRpbWUsXHJcblx0XHRzZWdtZW50c1BlckZyYW1lOiAxXHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlckNvbmZpZzsiLCJmdW5jdGlvbiBzZXRDYW52YXNEZXRhaWxzKCBjYW52YXNJZCApIHtcclxuXHRsZXQgY2FudmFzSW5zdGFuY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBjYW52YXNJZCApO1xyXG5cdGxldCBjdHggPSBjYW52YXNJbnN0YW5jZS5nZXRDb250ZXh0KCcyZCcpO1xyXG5cdGxldCBjVyA9IGNhbnZhc0luc3RhbmNlLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblx0bGV0IGNIID0gY2FudmFzSW5zdGFuY2UuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuXHR0aGlzLmNhbnZhc0NmZy5jYW52YXMgPSBjYW52YXNJbnN0YW5jZTtcclxuXHR0aGlzLmNhbnZhc0NmZy5jID0gY3R4O1xyXG5cdHRoaXMuY2FudmFzQ2ZnLmNXID0gY1c7XHJcblx0dGhpcy5jYW52YXNDZmcuY0ggPSBjSDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYW52YXNEZXRhaWxzOyIsImxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5cclxuZnVuY3Rpb24gc2V0R2xvYmFsSW50ZXJ2YWwoKSB7XHJcblx0dGhpcy5nbG9iYWxDb25maWcuaW50ZXJ2YWxDdXJyZW50ID0gbWF0aFV0aWxzLnJhbmRvbShcclxuXHRcdHRoaXMuZ2xvYmFsQ29uZmlnLGludGVydmFsTWluLFxyXG5cdFx0dGhpcy5nbG9iYWxDb25maWcsaW50ZXJ2YWxNYXhcclxuXHRcdCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2V0R2xvYmFsSW50ZXJ2YWw7IiwiZnVuY3Rpb24gc2V0TG9jYWxDbG9ja1RhcmdldCggdGFyZ2V0ICkge1xyXG5cdFx0aWYoIHRhcmdldCApIHtcclxuXHRcdFx0dGhpcy5jbG9jay5sb2NhbC50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmNsb2NrLmxvY2FsLnRhcmdldCA9IHRoaXMuZ2xvYmFsQ29uZmlnLmludGVydmFsQ3VycmVudDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNldExvY2FsQ2xvY2tUYXJnZXQ7IiwibGV0IG1hdGhVdGlscyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9tYXRoVXRpbHMuanMnICk7XHJcblxyXG5mdW5jdGlvbiB1cGRhdGUoIGMgKXtcclxuXHRsZXQgcmVuZGVyQ2ZnID0gdGhpcy5yZW5kZXJDb25maWc7XHJcblx0bGV0IG1MZW4gPSB0aGlzLm1lbWJlcnMubGVuZ3RoO1xyXG5cdGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2xpZ2h0ZXInO1xyXG5cclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IG1MZW47IGkrKyApIHtcclxuXHRcdGxldCBtID0gdGhpcy5tZW1iZXJzWyBpIF07XHJcblxyXG5cdFx0aWYgKCBtICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG5cdFx0XHRsZXQgbVN0YXRlID0gbS5zdGF0ZS5zdGF0ZXM7XHJcblx0XHRcdGxldCBjdXJyU3RhdGUgPSBtLmdldEN1cnJlbnRTdGF0ZSgpO1xyXG5cclxuXHRcdFx0aWYoIGN1cnJTdGF0ZSA9PT0gJ2lzQ291bnRkb3duJyApIHtcclxuXHRcdFx0XHRsZXQgbUNsb2NrID0gbS5jbG9jaztcclxuXHRcdFx0XHRsZXQgbVRvdGFsQ2xvY2sgPSBtLnRvdGFsQ2xvY2s7XHJcblx0XHRcdFx0aWYgKCBtQ2xvY2sgPCBtVG90YWxDbG9jayApIHtcclxuXHRcdFx0XHRcdG0uY2xvY2srKztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bS5jbG9jayA9IDA7XHJcblx0XHRcdFx0XHRpZiAoIG1TdGF0ZS5pc0NvbXBsZXRlID09PSBmYWxzZSApIHtcclxuXHRcdFx0XHRcdFx0bS50b3RhbENsb2NrID0gbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoIDEwLCA1MCApO1xyXG5cdFx0XHRcdFx0XHRtLnNldFN0YXRlKCAnaXNDb3VudGRvd24nICk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRtLnNldFN0YXRlKCAnaXNDb3VudGRvd25Db21wbGV0ZScgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggbVN0YXRlLmlzRHJhd24gPT09IHRydWUgJiYgbS53aWxsQ29ubmVjdCA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0XHRpZiAoIG1TdGF0ZS5pc0Nvbm5lY3RlZCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHRtLnNldFN0YXRlKCAnaXNDb25uZWN0ZWQnICk7XHJcblx0XHRcdFx0XHRtLnNldFN0YXRlKCAnaXNGaWVsZEVmZmVjdCcgKTtcclxuXHRcdFx0XHRcdG0uc2V0U3RhdGUoICdpc0NvdW50ZG93bicgKTtcclxuXHRcdFx0XHRcdG0udG90YWxDbG9jayA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCAxMCwgNTAgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG0udXBkYXRlUmVuZGVyQ29uZmlnKCk7XHJcblx0XHRcdGZvciggbGV0IGogPSAwOyBqIDwgbS5wYXRocy5sZW5ndGg7IGorKyApIHtcclxuXHRcdFx0XHRsZXQgdGhpc1BhdGhDZmcgPSBtLnBhdGhzWyBqIF07XHJcblx0XHRcdFx0aWYgKCB0aGlzUGF0aENmZy5pc0NoaWxkID09PSBmYWxzZSAmJiB0aGlzUGF0aENmZy5pc0FjdGl2ZSA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1lbWJlcnMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdFx0aS0tO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXNQYXRoQ2ZnLnJlbmRlciggYywgbSwgdGhpcyApLnVwZGF0ZSggbSwgdGhpcyApO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHR9XHJcblx0Yy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnc291cmNlLW92ZXInO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVwZGF0ZTsiLCJmdW5jdGlvbiB1cGRhdGVSZW5kZXJDZmcoKSB7XHJcblx0XHRsZXQgbWVtYmVycyA9IHRoaXMubWVtYmVycztcclxuXHRcdGxldCBtZW1MZW4gPSBtZW1iZXJzLmxlbmd0aDtcclxuXHRcdGZvciggbGV0IGkgPSAwOyBpIDw9IG1lbUxlbiAtIDE7IGkrKyApIHtcclxuXHRcdFx0bWVtYmVyc1sgaSBdLnVwZGF0ZVJlbmRlckNvbmZpZygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlUmVuZGVyQ2ZnOyIsImZ1bmN0aW9uIGNhbGN1bGF0ZVN1YkRSYXRlKCBsZW5ndGgsIHRhcmdldExlbmd0aCwgc3ViRFJhdGUgKSB7XHJcblx0bGV0IGxEaXYgPSB0YXJnZXRMZW5ndGggLyBsZW5ndGg7XHJcblx0bGV0IGxEaXZDYWxjID0gc3ViRFJhdGUgLSBNYXRoLmZsb29yKCBsRGl2ICk7XHJcblx0aWYgKCBsRGl2Q2FsYyA8PSAxICkgcmV0dXJuIDE7XHJcblx0aWYgKCBsRGl2ID4gMiApIHJldHVybiBsRGl2Q2FsYztcclxuXHRyZXR1cm4gc3ViRFJhdGU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2FsY3VsYXRlU3ViRFJhdGU7IiwibGV0IG1hdGhVdGlscyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9tYXRoVXRpbHMuanMnICk7XHJcbmxldCBlYXNpbmcgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvZWFzaW5nLmpzJyApLmVhc2luZ0VxdWF0aW9ucztcclxubGV0IHRyaWcgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvdHJpZ29ub21pY1V0aWxzLmpzJyApLnRyaWdvbm9taWNVdGlscztcclxuXHJcbmZ1bmN0aW9uIGNoZWNrUG9pbnRJbmRleCggaSwgbGVuICkge1xyXG5cdHJldHVybiBpID09PSAwID8gMSA6IGkgPT09IGxlbiAtIDEgPyBsZW4gLSAyIDogaTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUGF0aENvbmZpZyggdGhpc1BhdGgsIG9wdGlvbnMgKSB7XHJcblx0bGV0IHRoaXNQYXRoQ2ZnID0gdGhpc1BhdGg7XHJcblx0bGV0IHAgPSB0aGlzUGF0aENmZy5wYXRoO1xyXG5cdGxldCBwTGVuID0gcC5sZW5ndGg7XHJcblxyXG5cdGxldCBvcHRzID0gb3B0aW9ucztcclxuXHRsZXQgcGF0aEluZGV4ID0gb3B0cy5wYXRoSW5kZXg7XHJcblx0bGV0IHBhdGhBbmdsZVNwcmVhZCA9IG9wdHMucGF0aEFuZ2xlU3ByZWFkIHx8IDAuMjtcclxuXHRsZXQgYnJhbmNoRGVwdGggPSBvcHRzLmJyYW5jaERlcHRoIHx8IDA7XHJcblxyXG5cdC8vIHNldHVwIHNvbWUgdmFycyB0byBwbGF5IHdpdGhcclxuXHRsZXQgcEluZGV4LCBwMSwgcDIsIHAzLCBwNCwgdGhldGEsIHJPZmZzZXQ7XHJcblx0Ly8gYW5nbGUgdmFyaWF0aW9uIHJhbmRvbWlzZXJcclxuXHRsZXQgdiA9ICggMiAqIE1hdGguUEkgKSAqIHBhdGhBbmdsZVNwcmVhZDtcclxuXHJcblx0Ly8gaWYgcGF0aCBpcyBvbmx5IHN0YXJ0L2VuZCBwb2ludHNcclxuXHRpZiAoIHBMZW4gPT09IDIgKSB7XHJcblx0XHRjb25zb2xlLmxvZyggYHBMZW4gPT09IDJgICk7XHJcblx0XHRwMSA9IHBbIDAgXTtcclxuXHRcdHAzID0gcFsgMSBdO1xyXG5cdFx0cDIgPSB0cmlnLnN1YmRpdmlkZShwMS54LCBwMS55LCBwMy54LCBwMy55LCAwLjUpO1xyXG5cdFx0ck9mZnNldCA9IHRoaXNQYXRoQ2ZnLnJlbmRlck9mZnNldCArIDE7XHJcblx0fVxyXG5cdGlmICggcExlbiA+IDIgKSB7XHJcblx0XHRwSW5kZXggPSBjaGVja1BvaW50SW5kZXgoIG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCAwLCBwTGVuIC0gMSApLCBwTGVuICk7XHJcblx0XHRwMSA9IHBbIHBJbmRleCAtIDEgXTtcclxuXHRcdHAyID0gcFsgcEluZGV4IF07XHJcblx0XHRwMyA9IHBbIHBJbmRleCArIDEgXTtcclxuXHRcdHJPZmZzZXQgPSB0aGlzUGF0aENmZy5yZW5kZXJPZmZzZXQgKyBwSW5kZXg7XHJcblx0fVxyXG5cclxuXHR0aGV0YSA9IHRoaXNQYXRoQ2ZnLmJhc2VBbmdsZSArIG1hdGhVdGlscy5yYW5kb20oIC12LCB2ICk7XHJcblx0bGV0IG1heEQgPSB0cmlnLmRpc3QoIHAyLngsIHAyLnksIHBbIHBMZW4gLSAxXS54LCBwWyBwTGVuIC0gMSBdLnkpO1xyXG5cdFxyXG5cdGxldCBkVmFyID0gbWF0aFV0aWxzLnJhbmRvbSggMCwgbWF4RCApO1xyXG5cdC8vIGNvbnNvbGUubG9nKCAncmFuZFRoZXRhOiAnLCByYW5kVGhldGEgKTtcclxuXHRsZXQgYnJhbmNoRW5kcG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbiggcDIueCwgcDIueSwgZFZhciwgdGhldGEgKTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGJyYW5jaERlcHRoOiBicmFuY2hEZXB0aCxcclxuXHRcdHJlbmRlck9mZnNldDogck9mZnNldCxcclxuXHRcdHN0YXJ0WDogcDIueCxcclxuXHRcdHN0YXJ0WTogcDIueSxcclxuXHRcdGVuZFg6IGJyYW5jaEVuZHBvaW50LngsXHJcblx0XHRlbmRZOiBicmFuY2hFbmRwb2ludC55LFxyXG5cdFx0ZFJhbmdlOiBkVmFyXHJcblx0fTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVQYXRoQ29uZmlnOyIsIlxyXG5sZXQgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL21hdGhVdGlscy5qcycgKTtcclxubGV0IGVhc2luZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5sZXQgdHJpZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy90cmlnb25vbWljVXRpbHMuanMnICkudHJpZ29ub21pY1V0aWxzO1xyXG5cclxubGV0IHBsb3RQb2ludHMgPSByZXF1aXJlKCAnLi9wbG90UGF0aFBvaW50cy5qcycgKTtcclxubGV0IGRyYXdQYXRocyA9IHJlcXVpcmUoICcuL2RyYXdQYXRoLmpzJyApO1xyXG5sZXQgcmVkcmF3UGF0aCA9IHJlcXVpcmUoICcuL3JlZHJhd1BhdGhzLmpzJyApO1xyXG5sZXQgdXBkYXRlUGF0aCA9IHJlcXVpcmUoICcuL3VwZGF0ZVBhdGguanMnICk7XHJcbmxldCByZW5kZXJQYXRoID0gcmVxdWlyZSggJy4vcmVuZGVyUGF0aC5qcycgKTtcclxuXHJcbmxldCBjaGlsZFBhdGhBbmltU2VxdWVuY2UgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL2NoaWxkUGF0aEFuaW1TZXF1ZW5jZS5qc2AgKTtcclxubGV0IG1haW5QYXRoQW5pbVNlcXVlbmNlID0gcmVxdWlyZSggYC4uL3NlcXVlbmNlci9tYWluUGF0aEFuaW1TZXF1ZW5jZS5qc2AgKTtcclxubGV0IHN0YXJ0U2VxdWVuY2UgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL3N0YXJ0U2VxdWVuY2UuanNgICk7XHJcbmxldCB1cGRhdGVTZXF1ZW5jZUNsb2NrID0gcmVxdWlyZSggYC4uL3NlcXVlbmNlci91cGRhdGVTZXF1ZW5jZUNsb2NrLmpzYCApO1xyXG5sZXQgdXBkYXRlU2VxdWVuY2UgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL3VwZGF0ZVNlcXVlbmNlLmpzYCApO1xyXG5sZXQgc2V0dXBTZXF1ZW5jZXMgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL3NldHVwU2VxdWVuY2VzLmpzYCApO1xyXG5cclxuLy8gbGlnaHRuaW5nIHBhdGggY29uc3RydWN0b3JcclxuXHJcbi8vIGxldCBkcmF3UGF0aFNlcXVlbmNlID0ge1xyXG4vLyBcdGlzQWN0aXZlOiBmYWxzZSxcclxuLy8gXHR0aW1lOiAxMDBcclxuLy8gfVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUGF0aEZyb21PcHRpb25zKCBvcHRzICkge1xyXG5cclxuXHRsZXQgbmV3UGF0aCA9IHBsb3RQb2ludHMoe1xyXG5cdFx0c3RhcnRYOiBvcHRzLnN0YXJ0WCxcclxuXHRcdHN0YXJ0WTogb3B0cy5zdGFydFksXHJcblx0XHRlbmRYOiBvcHRzLmVuZFgsXHJcblx0XHRlbmRZOiBvcHRzLmVuZFksXHJcblx0XHRzdWJkaXZpc2lvbnM6IG9wdHMuc3ViZGl2aXNpb25zLFxyXG5cdFx0ZFJhbmdlOiBvcHRzLmRSYW5nZSwgXHJcblx0XHRpc0NoaWxkOiBvcHRzLmlzQ2hpbGRcclxuXHR9KTtcclxuXHJcblx0Ly8gY29uc29sZS5sb2coICduZXdQYXRoTGVuOiAnLCBvcHRzLmlzQ2hpbGQgPT09IGZhbHNlID8gbmV3UGF0aC5sZW5ndGggOiBmYWxzZSApO1xyXG5cclxuXHRsZXQgY2hvc2VuU2VxdWVuY2UgPSBvcHRzLnNlcXVlbmNlcyB8fCBtYWluUGF0aEFuaW1TZXF1ZW5jZTtcclxuXHRsZXQgdGhpc1NlcXVlbmNlcyA9IHNldHVwU2VxdWVuY2VzKCBjaG9zZW5TZXF1ZW5jZSApO1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0Ly8gZmxhZ3NcclxuXHRcdGlzQ2hpbGQ6IG9wdHMuaXNDaGlsZCB8fCBmYWxzZSxcclxuXHRcdGlzQWN0aXZlOiBvcHRzLmlzQWN0aXZlIHx8IGZhbHNlLFxyXG5cdFx0aXNSZW5kZXJpbmc6IG9wdHMuaXNSZW5kZXJpbmcgfHwgZmFsc2UsXHJcblx0XHR3aWxsU3RyaWtlOiBvcHRzLndpbGxTdHJpa2UgfHwgZmFsc2UsXHJcblx0XHQvLyBjb25maWdcclxuXHRcdGJyYW5jaERlcHRoOiBvcHRzLmJyYW5jaERlcHRoIHx8IDAsXHJcblx0XHQvLyBjb21wdXRlZCBjb25maWdcclxuXHRcdGJhc2VBbmdsZTogdHJpZy5hbmdsZSggb3B0cy5zdGFydFgsIG9wdHMuc3RhcnRZLCBvcHRzLmVuZFgsIG9wdHMuZW5kWSApLFxyXG5cdFx0YmFzZURpc3Q6IHRyaWcuZGlzdCggb3B0cy5zdGFydFgsIG9wdHMuc3RhcnRZLCBvcHRzLmVuZFgsIG9wdHMuZW5kWSApLFxyXG5cdFx0Ly8gY29sb3JzXHJcblx0XHRjb2xSOiBvcHRzLnBhdGhDb2xSIHx8IDI1NSxcclxuXHRcdGNvbEc6IG9wdHMucGF0aENvbEcgfHwgMjU1LFxyXG5cdFx0Y29sQjogb3B0cy5wYXRoQ29sQiB8fCAyNTUsXHJcblx0XHRjb2xBOiBvcHRzLmlzQ2hpbGQgPyAwLjUgOiBvcHRzLnBhdGhDb2xBID8gb3B0cy5wYXRoQ29sQSA6IDEsXHJcblx0XHRnbG93Q29sUjogIG9wdHMuZ2xvd0NvbFIgfHwgMjU1LFxyXG5cdFx0Z2xvd0NvbEc6ICBvcHRzLmdsb3dDb2xHIHx8IDI1NSxcclxuXHRcdGdsb3dDb2xCOiAgb3B0cy5nbG93Q29sQiB8fCAyNTUsXHJcblx0XHRnbG93Q29sQTogIG9wdHMuZ2xvd0NvbEEgfHwgMSxcclxuXHRcdGxpbmVXaWR0aDogMSxcclxuXHRcdC8vIGNsb2Nrc1xyXG5cdFx0Y2xvY2s6IG9wdHMuY2xvY2sgfHwgMCxcclxuXHRcdHNlcXVlbmNlQ2xvY2s6IG9wdHMuc2VxdWVuY2VDbG9jayB8fCAwLFxyXG5cdFx0dG90YWxDbG9jazogb3B0cy50b3RhbENsb2NrIHx8IDAsXHJcblx0XHQvLyBhbmltIHNlcXVlbmNlc1xyXG5cdFx0Ly8gbWFpbiBkcmF3IHNlcXVlbmNlXHJcblx0XHRkcmF3UGF0aFNlcXVlbmNlOiBvcHRzLmlzQ2hpbGQgPyBmYWxzZSA6IHRydWUsXHJcblx0XHQvLyBhZGRpdGlvbmFsIHNlcXVlbmNlc1xyXG5cdFx0c2VxdWVuY2VzOiB0aGlzU2VxdWVuY2VzLFxyXG5cdFx0c2VxdWVuY2VTdGFydEluZGV4OiBvcHRzLnNlcXVlbmNlU3RhcnRJbmRleCB8fCAwLFxyXG5cdFx0c2VxdWVuY2VJbmRleDogb3B0cy5zZXF1ZW5jZUluZGV4IHx8IDAsXHJcblx0XHRwbGF5U2VxdWVuY2U6IGZhbHNlLFxyXG5cdFx0Y3VyclNlcXVlbmNlOiBmYWxzZSxcclxuXHRcdHN0YXJ0U2VxdWVuY2U6IHN0YXJ0U2VxdWVuY2UsXHJcblx0XHR1cGRhdGVTZXF1ZW5jZTogdXBkYXRlU2VxdWVuY2UsXHJcblx0XHR1cGRhdGVTZXF1ZW5jZUNsb2NrOiB1cGRhdGVTZXF1ZW5jZUNsb2NrLFxyXG5cdFx0ZHJhd1BhdGhzOiBkcmF3UGF0aHMsXHJcblx0XHRyZWRyYXdQYXRoOiByZWRyYXdQYXRoLFxyXG5cdFx0dXBkYXRlOiB1cGRhdGVQYXRoLFxyXG5cdFx0cmVuZGVyOiByZW5kZXJQYXRoLFxyXG5cdFx0Ly8gcGF0aCByZW5kZXJpbmcgZmxhZ3NcclxuXHRcdHJlbmRlck9mZnNldDogb3B0cy5yZW5kZXJPZmZzZXQgfHwgMCxcclxuXHRcdGN1cnJIZWFkUG9pbnQ6IDAsXHJcblx0XHQvLyB0aGUgYWN0dWFsIHBhdGhcclxuXHRcdHBhdGg6IG5ld1BhdGgsXHJcblx0XHQvLyBzYXZlZCBwYXRoc1xyXG5cdFx0c2F2ZWRQYXRoczoge1xyXG5cdFx0XHRtYWluOiBuZXcgUGF0aDJEKCksXHJcblx0XHRcdG9mZnNldDogbmV3IFBhdGgyRCgpLFxyXG5cdFx0XHRvcmlnaW5TaG9ydDogbmV3IFBhdGgyRCgpLFxyXG5cdFx0XHRvcmlnaW5Mb25nOiBuZXcgUGF0aDJEKClcclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVBhdGhGcm9tT3B0aW9uczsiLCIvLyB3cmFwIGluIGNvbmRpdGlvbiB0byBjaGVjayBpZiBkcmF3aW5nIGlzIHJlcXVpcmVkXHJcbmNvbnN0IGNsID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL2NsLmpzJyApO1xyXG5cclxuZnVuY3Rpb24gZHJhd1BhdGhzKCByZW5kZXJDZmcsIHBhcmVudCApIHtcclxuXHQvLyBwb2ludGVyc1xyXG5cdGxldCB0aGlzQ2ZnID0gdGhpcztcclxuXHRsZXQgeyBjdXJySGVhZDogbWFzdGVySGVhZFBvaW50LCBzZWdtZW50c1BlckZyYW1lIH0gPSByZW5kZXJDZmc7XHJcblx0bGV0IHsgcGF0aDogcGF0aEFyciwgc2F2ZWRQYXRocywgcmVuZGVyT2Zmc2V0OiBwYXRoU3RhcnRQb2ludCwgY3VyckhlYWRQb2ludDogY3VycmVudEhlYWRQb2ludCB9ID0gdGhpc0NmZztcclxuXHRsZXQgcGF0aEFyckxlbiA9IHBhdGhBcnIubGVuZ3RoO1xyXG5cdGxldCBzdGFydFBvaW50SW5kZXggPSAwO1xyXG5cdGxldCBlbmRQb2ludEluZGV4ID0gMDtcclxuXHJcblx0Ly8gZWFybHkgcmV0dXJuIG91dCBvZiBmdW5jdGlvbiBpZiB3ZSBoYXZlbid0IHJlYWNoZWQgdGhlIHBhdGggc3RhcnQgcG9pbnQgeWV0IE9SIHRoZSBjdXJyZW50SGVhZFBvaW50IGlzIGdyZWF0ZXIgdGhhbiB0aGUgcGF0aEFycmF5TGVuZ3RoXHJcblx0aWYgKCBwYXRoU3RhcnRQb2ludCA+IG1hc3RlckhlYWRQb2ludCApIHJldHVybjtcclxuXHJcblx0aWYgKCBjdXJyZW50SGVhZFBvaW50ID49IHBhdGhBcnJMZW4gKSB7XHJcblx0XHRpZiAoIHRoaXNDZmcuaXNDaGlsZCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdHBhcmVudC5pc0RyYXduID0gdHJ1ZTtcclxuXHRcdFx0cGFyZW50LnNldFN0YXRlKCAnaXNEcmF3bicgKTtcclxuXHRcdH1cclxuXHRcdHJldHVybjsgXHJcblx0fVxyXG5cclxuXHRzdGFydFBvaW50SW5kZXggPSBjdXJyZW50SGVhZFBvaW50ID09PSAwID8gY3VycmVudEhlYWRQb2ludCA6IGN1cnJlbnRIZWFkUG9pbnQ7XHJcblx0ZW5kUG9pbnRJbmRleCA9IE1hdGguZmxvb3IoIGN1cnJlbnRIZWFkUG9pbnQgKyBzZWdtZW50c1BlckZyYW1lID4gcGF0aEFyckxlbiA/IHBhdGhBcnJMZW4gOiBjdXJyZW50SGVhZFBvaW50ICsgc2VnbWVudHNQZXJGcmFtZSApO1xyXG5cclxuXHRmb3IoIGxldCBpID0gc3RhcnRQb2ludEluZGV4OyBpIDwgZW5kUG9pbnRJbmRleDsgaSsrICkge1xyXG5cdFx0bGV0IHAgPSBwYXRoQXJyWyBpIF07XHJcblx0XHRpZiAoIGkgPT09IDAgKSB7XHJcblx0XHRcdHNhdmVkUGF0aHMubWFpbi5tb3ZlVG8oIHAueCwgcC55ICk7XHJcblx0XHRcdHNhdmVkUGF0aHMub2Zmc2V0Lm1vdmVUbyggcC54LCBwLnkgLSAxMDAwMCApO1xyXG5cdFx0XHRzYXZlZFBhdGhzLm9yaWdpbkxvbmcubW92ZVRvKCBwLngsIHAueSAtIDEwMDAwICk7XHJcblx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0fVxyXG5cdFx0c2F2ZWRQYXRocy5tYWluLmxpbmVUbyggcC54LCBwLnkgKTtcclxuXHRcdHNhdmVkUGF0aHMub2Zmc2V0LmxpbmVUbyggcC54LCBwLnkgLSAxMDAwMCApO1xyXG5cclxuXHRcdGlmICggaSA8IDIwICkge1xyXG5cdFx0XHRzYXZlZFBhdGhzLm9yaWdpbkxvbmcubGluZVRvKCBwLngsIHAueSAtIDEwMDAwICk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHRoaXMuY3VyckhlYWRQb2ludCA9IGVuZFBvaW50SW5kZXg7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRyYXdQYXRoczsiLCJjb25zdCBjbCA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9jbC5qcycgKTtcclxuXHJcbmxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5sZXQgZWFzaW5nID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL2Vhc2luZy5qcycgKS5lYXNpbmdFcXVhdGlvbnM7XHJcbmxldCB0cmlnID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL3RyaWdvbm9taWNVdGlscy5qcycgKS50cmlnb25vbWljVXRpbHM7XHJcblxyXG4vLyBsaWdodG5pbmcgcGF0aCBjb25zdHJ1Y3RvclxyXG5cclxuXHJcbi8qKlxyXG4qIEBuYW1lIHBsb3RQYXRoUG9pbnRzXHJcbiogQGRlc2NyaXB0aW9uIGdpdmVuIGFuIG9yaWdpbiBwbG90IGEgcGF0aCwgcmFuZG9taXNlZCBhbmQgc3ViZGl2aWRlZCwgdG8gYSB0YXJnZXQuXHJcbiogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSB0aGUgY29uc3RydWN0b3IgY29uZmlndXJhdGlvbiBvYmplY3QuXHJcbiogQHBhcmFtIHtudW1iZXJ9IG9wdGlvbnMuc3RhcnRYIC0gdGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgcGF0aCBzdGFydCBwb2ludC5cclxuKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5zdGFydFkgLSB0aGUgWFljb29yZGluYXRlIG9mIHRoZSBwYXRoIHN0YXJ0IHBvaW50LlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBvcHRpb25zLmVuZFggLSB0aGUgWCBjb29yZGluYXRlIG9mIHRoZSBwYXRoIGVuZCBwb2ludC5cclxuKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5lbmRZIC0gdGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgcGF0aCBlbmQgcG9pbnQuXHJcbiogQHBhcmFtIHtib29sZWFufSBvcHRpb25zLmlzQ2hpbGQgLSBpcyB0aGlzIHBhdGggaW5zdGFuY2UgYSBjaGlsZC9zdWJwYXRoIG9mIGEgcGFyZW50Py5cclxuKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5zdWJkaXZpc2lvbnMgLSB0aGUgbGV2ZWwgb2YgcGF0aCBzdWJkaXZpc2lvbnMuXHJcbiogQHJldHVybnMge2FycmF5fSB0aGUgcGF0aCBhcyBhIHZlY3RvciBjb29yZGluYXRlIHNldC5cclxuICovXHJcbmZ1bmN0aW9uIHBsb3RQYXRoUG9pbnRzKCBvcHRpb25zICkge1xyXG5cdFx0XHJcblx0bGV0IG9wdHMgPSBvcHRpb25zO1xyXG5cdGxldCBzdWJEID0gb3B0cy5zdWJkaXZpc2lvbnM7XHJcblx0bGV0IHRlbXAgPSBbXTtcclxuXHJcblx0dGVtcC5wdXNoKCB7IHg6IG9wdHMuc3RhcnRYLCB5OiBvcHRzLnN0YXJ0WSB9ICk7XHJcblx0dGVtcC5wdXNoKCB7IHg6IG9wdHMuZW5kWCwgeTogb3B0cy5lbmRZIH0gKTtcclxuXHJcblx0bGV0IHRSYW5nZSA9IG9wdHMudFJhbmdlIHx8IDAuMzU7XHJcblx0bGV0IGlzQ2hpbGQgPSBvcHRzLmlzQ2hpbGQgfHwgdHJ1ZTtcclxuXHRsZXQgdkNoaWxkID0gaXNDaGlsZCA/IDggOiAyO1xyXG5cclxuXHQvLyBzZXQgdXAgc29tZSB2YXJzIHRvIHBsYXkgd2l0aFxyXG5cdGxldCBtaW5ELCBtYXhELCBjYWxjRDtcclxuXHJcblx0Zm9yICggbGV0IGkgPSAwOyBpIDw9IHN1YkQgLSAxOyBpKysgKSB7XHJcblx0XHRsZXQgYXJyTGVuID0gdGVtcC5sZW5ndGg7XHJcblx0XHRsZXQgZGFtcGVyID0gaSA9PT0gMCA/IDEgOiBpO1xyXG5cdFx0Zm9yICggbGV0IGogPSBhcnJMZW4gLSAxOyBqID4gMDsgai0tICkge1xyXG5cdFx0XHRpZiAoIGogPT09IDAgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBwID0gdGVtcFsgaiBdO1xyXG5cdFx0XHRsZXQgcHJldlAgPSB0ZW1wWyBqIC0gMSBdO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gc2V0IHVwIHNvbWUgbnVtYmVycyBmb3IgbWFraW5nIHRoZSBwYXRoXHJcblx0XHRcdC8vIGRpc3RhbmNlIGJldHdlZW4gdGhlIDIgcG9pbnRzXHJcblx0XHRcdGxldCB2RCA9IHRyaWcuZGlzdCggcC54LCBwLnksIHByZXZQLngsIHByZXZQLnkgKSAvIDI7XHJcblx0XHRcdC8vIHJhbmRvbSBwb3NpdGl2ZS9uZWdhdGl2ZSBtdWx0aXBsaWVyXHJcblx0XHRcdGxldCB2RmxpcCA9ICBtYXRoVXRpbHMucmFuZG9tSW50ZWdlciggMSwgMTAgKSA8PSA1ID8gMSA6IC0xO1xyXG5cdFx0XHQvLyBnZXQgdGhlIG1pZCBwb2ludCBiZXdlZW4gdGhlIHR3byBwb2ludHMgKHAgJiBwcmV2UClcclxuXHRcdFx0bGV0IG5QID0gdHJpZy5zdWJkaXZpZGUoIHByZXZQLngsIHByZXZQLnksIHAueCwgcC55LCAwLjUgKTtcclxuXHJcblx0XHRcdC8vIGNhbGN1bGF0ZSBzb21lIG51bWJlcnMgZm9yIHJhbmRvbSBkaXN0YW5jZVxyXG5cdFx0XHRpZiAoIGlzQ2hpbGQgPT09IGZhbHNlICkge1xyXG5cdFx0XHRcdG1pbkQgPSBlYXNpbmcuZWFzZUluUXVpbnQoIGksIHZEIC8gMiwgLSggdkQgLyAyICksIHN1YkQgKTtcclxuXHRcdFx0XHRtYXhEID0gZWFzaW5nLmVhc2VJblF1aW50KCBpLCB2RCwgLXZELCBzdWJEICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bWluRCA9IHZEIC8gMjtcclxuXHRcdFx0XHRtYXhEID0gdkQgLyB2Q2hpbGQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNhbGNEID0gbWF0aFV0aWxzLnJhbmRvbSggbWluRCwgbWF4RCApICogdkZsaXA7XHJcblxyXG5cdFx0XHQvLyB1c2luZyB0aGUgMiBwb2ludHMgKHAgJiBwcmV2UCksIGFuZCB0aGUgZ2VuZXJhdGVkIG1pZHBvaW50IGFzIGEgcHNldWRvIGN1cnZlIHBvaW50XHJcblx0XHRcdGxldCBvZmZzZXRQb2ludCA9IHRyaWcucHJvamVjdE5vcm1hbEF0RGlzdGFuY2UoXHJcblx0XHRcdFx0Ly8gLSBwcm9qZWN0IGEgbmV3IHBvaW50IGF0IHRoZSBub3JtYWwgb2YgdGhlIHBhdGggY3JlYXRlZCBieSBwL25QL3ByZXZQXHJcblx0XHRcdFx0cHJldlAsIG5QLCBwLFxyXG5cdFx0XHRcdC8vIGF0IGEgcmFuZG9tIHBvaW50IGFsb25nIHRoZSBjdXJ2ZSAoYmV0d2VlbiAwLjI1LzAuNzUpXHJcblx0XHRcdFx0bWF0aFV0aWxzLnJhbmRvbSggMC4yNSwgMC43NSApLFxyXG5cdFx0XHRcdC8vIC0gLSBwcm9qZWN0ZWQgYXQgYSBwcm9wb3J0aW9uIG9mIHRoZSBkaXN0YW5jZSAodkQpXHJcblx0XHRcdFx0Ly8gLSAtIC0gY2FsY3VsYXRlZCB0aHJvdWdoIHRoZSB2Q2hpbGQgdmFyaWFibGUgKGRhbXBlZCB0aHJvdWdoIGEgc3dpdGNoIGdlbmVyYXRlZCB0aHJvdWdoIHRoZSBpc0NoaWxkIGZsYWcpIFxyXG5cdFx0XHRcdGNhbGNEXHJcblx0XHRcdCk7XHJcblx0XHRcdC8vIHNwbGljZSBpbiB0aGUgbmV3IHBvaW50IHRvIHRoZSBwb2ludCBhcnJheVxyXG5cdFx0XHR0ZW1wLnNwbGljZSggaiwgMCwgeyB4OiBvZmZzZXRQb2ludC54LCB5OiBvZmZzZXRQb2ludC55IH0gKTtcclxuXHRcdFx0Ly8gcmVjdXJzZSB0aGUgbG9vcCBieSB0aGUgbnVtYmVyIGdpdmVuIGJ5IFwic3ViRFwiLCB0byBzdWJkaXZpbmRlIGFuZCByYW5kb21pc2UgdGhlIGxpbmVcclxuXHRcdH1cclxuXHR9O1xyXG5cdC8vIGNvbnNvbGUubG9nKCBgJHtjbC5kaW19JHtjbC55fXBhdGgubGVuZ3RoOiAke2NsLmJsZH0ke2NsLmJ9JHt0ZW1wLmxlbmd0aH0ke2NsLnJzdH1gICk7XHJcblx0cmV0dXJuIHRlbXA7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBsb3RQYXRoUG9pbnRzOyIsImZ1bmN0aW9uIHJlZHJhd1BhdGgoIHJlbmRlckNmZywgcGFyZW50LCBnbG9iYWxDb25maWcgKSB7XHJcblxyXG5cdGxldCB0aGlzQ2ZnID0gdGhpcztcclxuXHRsZXQgeyBwYXRoOiBwYXRoQXJyLCBzYXZlZFBhdGhzLCByZW5kZXJPZmZzZXQ6IHBhdGhTdGFydFBvaW50LCBpc0NoaWxkIH0gPSB0aGlzQ2ZnO1xyXG5cdGxldCBwYXRoQXJyTGVuID0gcGF0aEFyci5sZW5ndGg7XHJcblx0bGV0IG5vaXNlRmllbGQgPSBnbG9iYWxDb25maWcubm9pc2VGaWVsZDtcclxuXHRsZXQgbmV3TWFpblBhdGggPSBuZXcgUGF0aDJEKCk7XHJcblx0bGV0IG5ld09mZnNldFBhdGggPSBuZXcgUGF0aDJEKCk7XHJcblx0bGV0IG5ld09yaWdpbkxvbmdQYXRoID0gbmV3IFBhdGgyRCgpO1xyXG5cclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IHBhdGhBcnJMZW47IGkrKyApIHtcclxuXHRcdGxldCBwID0gcGF0aEFyclsgaSBdO1xyXG5cdFx0XHJcblx0XHRsZXQgdCA9IDA7XHJcblx0XHRcclxuXHRcdC8vIG1vZGlmeSBjb3JyZGluYXRlcyB3aXRoIGZpZWxkIGVmZmVjdDpcclxuXHRcdGxldCBmaWVsZE1vZFZhbCA9IG5vaXNlRmllbGQubm9pc2UzRCggcC54LCBwLnksIHQgKTtcclxuXHRcdGxldCB4ID0gcC54ICogZmllbGRNb2RWYWw7XHJcblx0XHRsZXQgeSA9IHAueSAqIGZpZWxkTW9kVmFsO1xyXG5cclxuXHRcdGlmICggaSA9PT0gMCApIHtcclxuXHRcdFx0bmV3TWFpblBhdGgubW92ZVRvKCBwLngsIHAueSApO1xyXG5cdFx0XHRuZXdPZmZzZXRQYXRoLm1vdmVUbyggcC54LCBwLnkgLSAxMDAwMCApO1xyXG5cdFx0XHRuZXdPcmlnaW5Mb25nUGF0aC5tb3ZlVG8oIHAueCwgcC55IC0gMTAwMDAgKTtcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR9XHJcblx0XHRuZXdNYWluUGF0aC5saW5lVG8oIHAueCwgcC55ICk7XHJcblx0XHRuZXdPZmZzZXRQYXRoLmxpbmVUbyggcC54LCBwLnkgLSAxMDAwMCApO1xyXG5cclxuXHRcdGlmICggaSA8IDIwICkge1xyXG5cdFx0XHRuZXdPcmlnaW5Mb25nUGF0aC5saW5lVG8oIHAueCwgcC55IC0gMTAwMDAgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXNDZmcuc2F2ZWRQYXRocy5tYWluID0gbmV3TWFpblBhdGg7XHJcblx0dGhpc0NmZy5zYXZlZFBhdGhzLm9mZnNldCA9IG5ld09mZnNldFBhdGg7XHJcblx0dGhpc0NmZy5zYXZlZFBhdGhzLm9yaWdpbkxvbmcgPSBuZXdPcmlnaW5Mb25nUGF0aDtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVkcmF3UGF0aDsiLCJmdW5jdGlvbiBwYXRoR2xvdyggYywgcGF0aENmZywgc2F2ZWRQYXRoLCBnbG93T3B0cyApIHtcclxuXHRsZXQgYmx1cnMgPSBnbG93T3B0cy5ibHVycyB8fCAgWyAxMDAsIDcwLCA1MCwgMzAsIDEwIF07XHJcblx0bGV0IGJsdXJDb2xvciA9IGdsb3dPcHRzLmJsdXJDb2xvciB8fCAnd2hpdGUnO1xyXG5cdGxldCBibHVyU2hhcGVPZmZzZXQgPSBnbG93T3B0cy5ibHVyU2hhcGVPZmZzZXQgfHwgMTAwMDA7XHJcblx0Ly8gYy5saW5lV2lkdGggPSBwYXRoQ2ZnLmxpbmVXaWR0aDtcclxuXHRjLnN0cm9rZVN0eWxlID0gXCJyZWRcIjtcclxuXHRjLmZpbGxTYnR5bGUgPSAnd2hpdGUnO1xyXG5cdGMuc2hhZG93T2Zmc2V0WSA9IGJsdXJTaGFwZU9mZnNldDtcclxuXHRjLnNoYWRvd0NvbG9yID0gYmx1ckNvbG9yO1xyXG5cclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IGJsdXJzLmxlbmd0aCAtIDE7IGkrKyApIHtcclxuXHRcdGMuc2hhZG93Qmx1ciA9IGJsdXJzWyBpIF07XHJcblx0XHRjLmxpbmVXaWR0aCA9IHBhdGhDZmcubGluZVdpZHRoICogMjtcclxuXHRcdGMuc3Ryb2tlKCBzYXZlZFBhdGggKTtcclxuXHR9XHJcblx0Yy5zaGFkb3dCbHVyID0gMDtcclxufVxyXG5cclxuLy8gcGF0aCByZW5kZXJpbmcgZnVuY3Rpb25cclxuZnVuY3Rpb24gcmVuZGVyUGF0aCggYywgcGFyZW50LCBnbG9iYWxDb25maWcgKSB7XHJcblx0XHJcblx0bGV0IHRoaXNDZmcgPSB0aGlzO1xyXG5cdGxldCByZW5kZXJDZmcgPSBwYXJlbnQucmVuZGVyQ29uZmlnO1xyXG5cdGxldCBjdXJyUmVuZGVyUG9pbnQgPSAwO1xyXG5cdGxldCBjdXJyUmVuZGVySGVhZCA9IDA7XHJcblx0bGV0IGN1cnJSZW5kZXJUYWlsID0gMDtcclxuXHRcclxuXHRjb25zdCB7IGlzQ2hpbGQsIGlzUmVuZGVyaW5nLCByZW5kZXJPZmZzZXQsIHNhdmVkUGF0aHMsIHBhdGg6IHRoaXNQYXRoLCBsaW5lV2lkdGgsIGNvbFIsIGNvbEcsIGNvbEIsIGNvbEEsIGdsb3dDb2xSLCBnbG93Q29sRywgZ2xvd0NvbEIsIGdsb3dDb2xBLCBjdXJySGVhZFBvaW50IH0gPSB0aGlzQ2ZnO1xyXG5cdGxldCBwYXRoTGVuID0gdGhpc1BhdGgubGVuZ3RoIC0gMTtcclxuXHJcblx0Y29uc3QgY29tcHV0ZWRQYXRoQ29sb3IgPSBgcmdiYSgke2NvbFJ9LCAke2NvbEd9LCAke2NvbEJ9LCAke2NvbEF9KWA7XHJcblx0Y29uc3QgcGF0aEdsb3dSR0IgPSBgJHtnbG93Q29sUn0sICR7Z2xvd0NvbEd9LCAke2dsb3dDb2xCfWA7XHJcblx0Y29uc3QgcGF0aEdsb3dDb21wdXRlZENvbG9yID0gYHJnYmEoICR7cGF0aEdsb3dSR0J9LCAke2NvbEF9IClgO1xyXG5cdGNvbnN0IGhlYWRHbG93Qmx1ckFyciA9IFsgMjAsIDEwIF07XHJcblx0Y29uc3QgcGF0aEdsb3dPcHRzID0geyBibHVyczogcGFyZW50Lmdsb3dCbHVySXRlcmF0aW9ucywgYmx1ckNvbG9yOiBwYXRoR2xvd0NvbXB1dGVkQ29sb3IgfTtcclxuXHRjb25zdCBwYXRoR2xvd1Nob3J0T3B0cyA9IHsgYmx1cnM6IFsxMjAsIDgwLCA2MCwgNDAsIDMwLCAyMCwgMTUsIDEwLCA1XSwgYmx1ckNvbG9yOiBwYXRoR2xvd0NvbXB1dGVkQ29sb3IgfTtcclxuXHRjb25zdCBoZWFkR2xvd09wdHMgPSB7IGJsdXJzOiBoZWFkR2xvd0JsdXJBcnIsIGJsdXJDb2xvcjogcGF0aEdsb3dDb21wdXRlZENvbG9yIH07XHJcblx0Ly8gc2hhZG93IHJlbmRlciBvZmZzZXRcclxuXHRjb25zdCBzUk8gPSBnbG9iYWxDb25maWcucmVuZGVyQ29uZmlnLmJsdXJSZW5kZXJPZmZzZXQ7XHJcblx0Y29uc3Qgb3JpZ2luID0gdGhpc0NmZy5wYXRoWzBdO1xyXG5cdGNvbnN0IHsgeDogb1gsIHk6IG9ZIH0gPSBvcmlnaW47XHJcblxyXG5cdGlmICggcGFyZW50LmlzRHJhd24gPT09IGZhbHNlICkgeyB0aGlzLmRyYXdQYXRocyggcmVuZGVyQ2ZnLCBwYXJlbnQgKTsgfVxyXG5cdFxyXG5cdGMubGluZVdpZHRoID0gbGluZVdpZHRoO1xyXG5cdGMuc3Ryb2tlU3R5bGUgPSBjb21wdXRlZFBhdGhDb2xvcjtcclxuXHRjLnN0cm9rZSggc2F2ZWRQYXRocy5tYWluICk7XHJcblx0cGF0aEdsb3coIGMsIHRoaXNDZmcsIHNhdmVkUGF0aHMub2Zmc2V0LCBwYXRoR2xvd09wdHMgKTtcclxuXHJcblx0Ly8gaWYgdGhlIG1haW4gcGF0aCBoYXMgXCJjb25uZWN0ZWRcIiBhbmQgaXMgXCJkaXNjaGFyZ2luZ1wiXHJcblx0aWYgKHRoaXNDZmcuaXNDaGlsZCA9PT0gZmFsc2UpIHtcclxuXHJcblx0XHRwYXRoR2xvdyggYywgdGhpc0NmZywgc2F2ZWRQYXRocy5vcmlnaW5Mb25nLCBwYXRoR2xvd09wdHMgKTtcclxuXHRcdHBhdGhHbG93KCBjLCB0aGlzQ2ZnLCBzYXZlZFBhdGhzLm9yaWdpblNob3J0LCBwYXRoR2xvd1Nob3J0T3B0cyApO1xyXG5cclxuXHRcdGlmICggcGFyZW50LmlzRHJhd24gPT09IHRydWUgKSB7XHJcblx0XHRcdC8vIG9yaWdpbiBnbG93IGdyYWRpZW50c1xyXG5cdFx0XHRsZXQgb3JpZ2luID0gdGhpc0NmZy5wYXRoWzBdO1xyXG5cdFx0XHRsZXQgZ3JkID0gYy5jcmVhdGVSYWRpYWxHcmFkaWVudCggb1gsIG9ZLCAwLCBvWCwgb1ksIDEwMjQgKTtcclxuXHRcdFx0Z3JkLmFkZENvbG9yU3RvcCggMCwgcGF0aEdsb3dDb21wdXRlZENvbG9yICk7XHJcblx0XHRcdGdyZC5hZGRDb2xvclN0b3AoIDEsIGByZ2JhKCAke3BhdGhHbG93UkdCfSwgMCApYCApO1xyXG5cclxuXHRcdFx0Yy5maWxsU3R5bGUgPSBncmQ7XHJcblx0XHRcdGMuZmlsbENpcmNsZSggb1gsIG9ZLCAxMDI0ICk7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9XHJcblxyXG5cdGlmICggcGF0aExlbiA+IDQgKSB7XHJcblx0XHRsZXQgZ2xvd0hlYWRQYXRoTCA9IG5ldyBQYXRoMkQoKTtcclxuXHRcdGxldCBnbG93SGVhZFBhdGhTID0gbmV3IFBhdGgyRCgpO1xyXG5cclxuXHRcdGdsb3dIZWFkUGF0aEwubW92ZVRvKCB0aGlzUGF0aFsgcGF0aExlbiAtIDIgXS54LCB0aGlzUGF0aFsgcGF0aExlbiAtIDIgXS55IC0gc1JPICk7XHJcblx0XHRnbG93SGVhZFBhdGhMLmxpbmVUbyggdGhpc1BhdGhbIHBhdGhMZW4gLSAxIF0ueCwgdGhpc1BhdGhbIHBhdGhMZW4gLSAxIF0ueSAtIHNSTyApO1xyXG5cdFx0Z2xvd0hlYWRQYXRoTC5saW5lVG8oIHRoaXNQYXRoWyBwYXRoTGVuIF0ueCwgdGhpc1BhdGhbIHBhdGhMZW4gXS55IC0gc1JPICk7XHJcblx0XHRwYXRoR2xvdyggYywgdGhpc0NmZywgZ2xvd0hlYWRQYXRoTCwgaGVhZEdsb3dPcHRzICk7XHJcblx0XHRcclxuXHRcdGdsb3dIZWFkUGF0aFMubW92ZVRvKCB0aGlzUGF0aFsgcGF0aExlbiAtIDEgXS54LCB0aGlzUGF0aFsgcGF0aExlbiAtIDEgXS55IC0gc1JPICk7XHJcblx0XHRnbG93SGVhZFBhdGhTLmxpbmVUbyggdGhpc1BhdGhbIHBhdGhMZW4gXS54LCB0aGlzUGF0aFsgcGF0aExlbiBdLnkgLSBzUk8gKTtcclxuXHRcdHBhdGhHbG93KCBjLCB0aGlzQ2ZnLCBnbG93SGVhZFBhdGhTLCBoZWFkR2xvd09wdHMgKTtcclxuXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJQYXRoOyIsImxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5sZXQgZWFzaW5nID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL2Vhc2luZy5qcycgKS5lYXNpbmdFcXVhdGlvbnM7XHJcbmxldCB0cmlnID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL3RyaWdvbm9taWNVdGlscy5qcycgKS50cmlnb25vbWljVXRpbHM7XHJcblxyXG4vLyBwYXRoIHVwZGF0ZSBmdW5jdGlvblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUGF0aCggcGFyZW50Q29uZmlnLCBnbG9iYWxDb25maWcgKSB7XHJcblxyXG5cdGxldCByQ2ZnID0gZ2xvYmFsQ29uZmlnLnJlbmRlckNvbmZpZ1xyXG5cdGxldCBwID0gcGFyZW50Q29uZmlnO1xyXG5cdGxldCBwU3RhdGUgPSBwLnN0YXRlLnN0YXRlcztcclxuXHRsZXQgcGF0aENmZyA9IHRoaXM7XHJcblx0bGV0IHBhdGhMZW4gPSBwYXRoQ2ZnLnBhdGgubGVuZ3RoO1xyXG5cdGxldCBybmRPZmZzZXQgPSBwYXRoQ2ZnLnJlbmRlck9mZnNldDtcclxuXHJcblx0aWYgKCBwU3RhdGUuaXNEcmF3biA9PT0gdHJ1ZSApIHtcclxuXHJcblx0XHRpZiAoIHAud2lsbENvbm5lY3QgPT09IGZhbHNlICkge1xyXG5cdFx0XHRpZiAoIHBhdGhDZmcucGxheVNlcXVlbmNlID09PSBmYWxzZSApIHtcclxuXHRcdFx0XHRwYXRoQ2ZnLnBsYXlTZXF1ZW5jZSA9IHRydWU7IFxyXG5cdFx0XHRcdHBhdGhDZmcuc3RhcnRTZXF1ZW5jZSgge2luZGV4OiAwfSApO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGlmICggcGF0aExlbiArIHJuZE9mZnNldCA8IHAucmVuZGVyQ29uZmlnLmN1cnJIZWFkKSB7XHJcblx0XHRwYXRoQ2ZnLmlzUmVuZGVyaW5nID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwYXRoQ2ZnLnVwZGF0ZVNlcXVlbmNlKCk7XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVwZGF0ZVBhdGg7IiwiY29uc3QgYWxwaGFGYWRlT3V0ID0gcmVxdWlyZSggJy4vc2VxdWVuY2VJdGVtcy9hbHBoYUZhZGVPdXQuanMnICk7XHJcblxyXG5sZXQgY2hpbGRQYXRoQW5pbVNlcXVlbmNlID0gW1xyXG5cdHtcclxuXHRcdG5hbWU6ICdsUGF0aENvb2wnLFxyXG5cdFx0dGltZTogMzAsXHJcblx0XHRsaW5rZWRTZXE6ICcnLFxyXG5cdFx0bG9vcDogZmFsc2UsXHJcblx0XHRsb29wQmFjazogZmFsc2UsXHJcblx0XHRmaW5hbDogdHJ1ZSxcclxuXHRcdGl0ZW1zOiBhbHBoYUZhZGVPdXRcclxuXHR9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoaWxkUGF0aEFuaW1TZXF1ZW5jZTsiLCJjb25zdCBmYWRlVG9SZWRBbmRGYWRlT3V0ID0gcmVxdWlyZSggJy4vc2VxdWVuY2VJdGVtcy9mYWRlVG9SZWRBbmRGYWRlT3V0LmpzJyApO1xyXG5jb25zdCBsaW5lV2lkdGhUbzEwID0gcmVxdWlyZSggJy4vc2VxdWVuY2VJdGVtcy9saW5lV2lkdGhUbzEwLmpzJyApO1xyXG5cclxubGV0IG1haW5QYXRoQW5pbVNlcXVlbmNlID0gW1xyXG5cdHtcclxuXHRcdG5hbWU6ICdsUGF0aEZpcmUnLFxyXG5cdFx0dGltZTogMSxcclxuXHRcdGxpbmtlZFNlcTogJzEnLFxyXG5cdFx0bG9vcDogZmFsc2UsXHJcblx0XHRsb29wQmFjazogZmFsc2UsXHJcblx0XHRpdGVtczogbGluZVdpZHRoVG8xMFxyXG5cdH0sXHJcblx0e1xyXG5cdFx0bmFtZTogJ2xQYXRoQ29vbCcsXHJcblx0XHR0aW1lOiAzMCxcclxuXHRcdGxpbmtlZFNlcTogJycsXHJcblx0XHRsb29wOiBmYWxzZSxcclxuXHRcdGxvb3BCYWNrOiBmYWxzZSxcclxuXHRcdGZpbmFsOiB0cnVlLFxyXG5cdFx0aXRlbXM6IGZhZGVUb1JlZEFuZEZhZGVPdXRcclxuXHR9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5QYXRoQW5pbVNlcXVlbmNlOyIsImNvbnN0IGFscGhhRmFkZU91dCA9IFtcclxuXHR7IHBhcmFtOiAnY29sQScsIHRhcmdldDogMCwgZWFzZWZOOiAnZWFzZU91dFF1aW50JyB9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFscGhhRmFkZU91dDsiLCJjb25zdCBmYWRlVG9SZWRBbmRGYWRlT3V0ID0gW1xyXG5cdHsgcGFyYW06ICdsaW5lV2lkdGgnLCBzdGFydDogMCwgdGFyZ2V0OiAxLCBlYXNlZk46ICdlYXNlT3V0UXVpbnQnIH0sXHJcblx0eyBwYXJhbTogJ2NvbEcnLCBzdGFydDogMCwgdGFyZ2V0OiAwLCBlYXNlZk46ICdlYXNlT3V0UXVpbnQnIH0sXHJcblx0eyBwYXJhbTogJ2NvbFInLCBzdGFydDogMCwgdGFyZ2V0OiAwLCBlYXNlZk46ICdlYXNlT3V0UXVpbnQnIH0sXHJcblx0eyBwYXJhbTogJ2NvbEEnLCBzdGFydDogMCwgdGFyZ2V0OiAwLCBlYXNlZk46ICdlYXNlT3V0U2luZScgfVxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmYWRlVG9SZWRBbmRGYWRlT3V0OyIsImNvbnN0IGxpbmVXaWR0aFRvMTAgPSBbXHJcblx0eyBwYXJhbTogJ2xpbmVXaWR0aCcsIHN0YXJ0OiAwLCB0YXJnZXQ6IDEwLCBlYXNlZk46ICdsaW5lYXJFYXNlJyB9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVXaWR0aFRvMTA7IiwiZnVuY3Rpb24gc2V0dXBTZXF1ZW5jZXMoIHNlcXVlbmNlcyApIHtcclxuXHRsZXQgc2VxdWVuY2VMZW4gPSBzZXF1ZW5jZXMubGVuZ3RoO1xyXG5cdGxldCBzZXFBcnJheSA9IFtdO1xyXG5cdGZvciggbGV0IGkgPSAwOyBpIDwgc2VxdWVuY2VMZW47IGkrKykge1xyXG5cdFx0bGV0IHNlcSA9IHNlcXVlbmNlc1sgaSBdO1xyXG5cdFx0bGV0IHRtcFNlcSA9IHtcclxuXHRcdFx0YWN0aXZlOiBmYWxzZSxcclxuXHRcdFx0Y2xvY2s6IDAsXHJcblx0XHRcdHRvdGFsQ2xvY2s6IHNlcS50aW1lLFxyXG5cdFx0XHRsaW5rZWRTZXE6IHNlcS5saW5rZWRTZXEsXHJcblx0XHRcdG5hbWU6IHNlcS5uYW1lLFxyXG5cdFx0XHRmaW5hbDogc2VxLmZpbmFsLFxyXG5cdFx0XHRpdGVtczogW11cclxuXHRcdH07XHJcblx0XHRmb3IoIGxldCBpID0gMDsgaSA8IHNlcS5pdGVtcy5sZW5ndGg7IGkrKyApe1xyXG5cdFx0XHRsZXQgaXRlbSA9IHNlcS5pdGVtc1sgaSBdO1xyXG5cdFx0XHR0bXBTZXEuaXRlbXMucHVzaChcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRwYXJhbTogaXRlbS5wYXJhbSxcclxuXHRcdFx0XHRcdHN0YXJ0OiAwLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiBpdGVtLnRhcmdldCxcclxuXHRcdFx0XHRcdGVhc2VmTjogaXRlbS5lYXNlZk5cclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHRzZXFBcnJheS5wdXNoKCB0bXBTZXEgKTtcclxuXHR9XHJcblx0cmV0dXJuIHNlcUFycmF5O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNldHVwU2VxdWVuY2VzOyAiLCJmdW5jdGlvbiBzdGFydFNlcXVlbmNlKCBvcHRzICkge1xyXG5cdC8vIGNvbnNvbGUubG9nKCBgc3RhcnRTZXF1ZW5jZWAgKTtcclxuXHRsZXQgdCA9IHRoaXM7XHJcblx0bGV0IHNlcUluZGV4ID0gb3B0cy5pbmRleCB8fCAwO1xyXG5cdC8vIHNldCBjdXJyZW50IHZhbHVlcyB0byBzdGFydCBzZXF1ZW5jZSB3aXRoXHJcblx0bGV0IHNlcSA9IHQuc2VxdWVuY2VzWyBzZXFJbmRleCBdO1xyXG5cdGZvciggbGV0IGkgPSAwOyBpIDwgc2VxLml0ZW1zLmxlbmd0aDsgaSsrICl7XHJcblx0XHRsZXQgaXRlbSA9IHNlcS5pdGVtc1sgaSBdO1xyXG5cdFx0bGV0IGN1cnJJdGVtVmFsID0gdFsgaXRlbS5wYXJhbSBdO1xyXG5cdFx0aXRlbS5zdGFydCA9IGN1cnJJdGVtVmFsO1xyXG5cdFx0aXRlbS50YXJnZXQgLT0gY3Vyckl0ZW1WYWw7XHJcblx0fVxyXG5cdHNlcS5hY3RpdmUgPSB0cnVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXJ0U2VxdWVuY2U7IiwibGV0IGVhc2luZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlU2VxdWVuY2UoIG9wdHMgKXtcclxuXHRsZXQgdCA9IG9wdHMgfHwgdGhpcztcclxuXHQvLyBjb25zb2xlLmxvZyggJ3VwZGF0ZSB0aGlzOiAnLCB0aGlzICk7XHJcblx0bGV0IGNTID0gdC5zZXF1ZW5jZXM7XHJcblx0bGV0IGNTTGVuID0gdC5zZXF1ZW5jZXMubGVuZ3RoO1xyXG5cclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IGNTTGVuOyBpKysgKXtcclxuXHRcdGxldCB0aGlzU2VxID0gY1NbIGkgXTtcclxuXHRcdGlmICggdGhpc1NlcS5hY3RpdmUgPT09IGZhbHNlICkge1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgeyBpdGVtcywgbGlua2VkU2VxLCBjbG9jaywgdG90YWxDbG9jaywgZmluYWwgfSA9IHRoaXNTZXE7XHJcblx0XHRsZXQgaXRlbUxlbiA9IGl0ZW1zLmxlbmd0aDtcclxuXHRcdGZvciggbGV0IGkgPSAwOyBpIDwgaXRlbUxlbjsgaSsrICl7XHJcblx0XHRcdGxldCBzID0gaXRlbXNbIGkgXTtcclxuXHRcdFx0dFsgcy5wYXJhbSBdID0gZWFzaW5nWyBzLmVhc2VmTiBdKFxyXG5cdFx0XHRcdGNsb2NrLCBzLnN0YXJ0LCBzLnRhcmdldCwgdG90YWxDbG9ja1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCBjbG9jayA+PSB0b3RhbENsb2NrICkge1xyXG5cdFx0XHR0aGlzU2VxLmFjdGl2ZSA9IGZhbHNlXHJcblx0XHRcdHRoaXNTZXEuY2xvY2sgPSAwO1xyXG5cdFx0XHRpZiggbGlua2VkU2VxICE9PSAnJyApIHtcclxuXHRcdFx0XHR0LnN0YXJ0U2VxdWVuY2UoIHsgaW5kZXg6IGxpbmtlZFNlcSB9ICk7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoICF0LmlzQ2hpbGQgJiYgZmluYWwgKSB7XHJcblx0XHRcdFx0dC5pc0FjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdFx0dGhpc1NlcS5jbG9jaysrO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGVTZXF1ZW5jZTsiLCJmdW5jdGlvbiB1cGRhdGVTZXF1ZW5jZUNsb2NrKCl7XHJcblx0bGV0IHQgPSB0aGlzO1xyXG5cdGlmICggdC5wbGF5U2VxdWVuY2UgPT09IHRydWUgKSB7XHJcblx0XHRpZiAoIHQuc2VxdWVuY2VDbG9jayA8IHQuY3VyclNlcXVlbmNlLnRpbWUgKSB7XHJcblx0XHRcdHQuc2VxdWVuY2VDbG9jaysrO1xyXG5cdFx0fTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlU2VxdWVuY2VDbG9jazsiLCIvKipcclxuICogalF1ZXJ5IG9iamVjdFxyXG4gKiBAZXh0ZXJuYWwgalF1ZXJ5XHJcbiAqIEBzZWUge0BsaW5rIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkvfVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEaW1lbnNpb25zXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB3IC0gd2lkdGhcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGggLSBoZWlnaHRcclxuICovXHJcblxyXG4vKipcclxuKiBAdHlwZWRlZiB7T2JqZWN0fSBQb2ludCAtIEEgcG9pbnQgaW4gc3BhY2Ugb24gYSAyZCAoY2FydGVzZWFuKSBwbGFuZSwgdXN1YWxseSBYL1lcclxuKiBAcHJvcGVydHkge251bWJlcn0geCAtIFRoZSBYIENvb3JkaW5hdGVcclxuKiBAcHJvcGVydHkge251bWJlcn0geSAtIFRoZSBZIENvb3JkaW5hdGVcclxuKi9cclxuXHJcbi8qKiBcclxuKiAgQHR5cGVkZWYge09iamVjdH0gVmVsb2NpdHlWZWN0b3IgLSBUaGUgY2hhbmdlIGRlbHRhIGZvciBjYXJ0ZXNlYW4geC95LCBvciAyZCBjb29yZGluYXRlIHN5c3RlbXNcclxuKiAgQHByb3BlcnR5IHtudW1iZXJ9IHhWZWwgVGhlIFggZGVsdGEgY2hhbmdlIHZhbHVlLlxyXG4qICBAcHJvcGVydHkge251bWJlcn0geVZlbCBUaGUgWSBkZWx0YSBjaGFuZ2UgdmFsdWUuXHJcbiovXHJcblxyXG4vKipcclxuKiBAdHlwZWRlZiB7T2JqZWN0fSB2ZWN0b3JDYWxjdWxhdGlvblxyXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBkaXN0YW5jZSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB2ZWN0b3JzXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGFuZ2xlIFRoZSBhbmdsZSBiZXR3ZWVuIHZlY3RvcnNcclxuKi8iLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZXh0ZW5kcyBDYW52YXMgcHJvdG90eXBlIHdpdGggdXNlZnVsIGRyYXdpbmcgbWl4aW5zXHJcbiogQGtpbmQgY29uc3RhbnRcclxuKi9cclxudmFyIGNhbnZhc0RyYXdpbmdBcGkgPSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlO1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gZHJhdyBjaXJjbGUgQVBJXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmNpcmNsZSA9IGZ1bmN0aW9uICh4LCB5LCByKSB7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBmaWxsZWQgY2lyY2xlXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmZpbGxDaXJjbGUgPSBmdW5jdGlvbiAoeCwgeSwgciwgY29udGV4dCkge1xyXG5cdHRoaXMuY2lyY2xlKHgsIHksIHIsIGNvbnRleHQpO1xyXG5cdHRoaXMuZmlsbCgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBzdHJva2VkIGNpcmNsZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gcmFkaXVzIG9mIGNpcmNsZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VDaXJjbGUgPSBmdW5jdGlvbiAoeCwgeSwgcikge1xyXG5cdHRoaXMuY2lyY2xlKHgsIHksIHIpO1xyXG5cdHRoaXMuc3Ryb2tlKCk7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IGggLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5lbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgTWF0aC5QSSAqIDI7IGkgKz0gTWF0aC5QSSAvIDE2KSB7XHJcblx0XHR0aGlzLmxpbmVUbyh4ICsgTWF0aC5jb3MoaSkgKiB3IC8gMiwgeSArIE1hdGguc2luKGkpICogaCAvIDIpO1xyXG5cdH1cclxuXHR0aGlzLmNsb3NlUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZmlsbGVkIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb3IgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IGggLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5maWxsRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoKSB7XHJcblx0dGhpcy5lbGxpcHNlKHgsIHksIHcsIGgsIGNvbnRleHQpO1xyXG5cdHRoaXMuZmlsbCgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBzdHJva2VkIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IGggLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VFbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcclxuXHR0aGlzLmVsbGlwc2UoeCwgeSwgdywgaCk7XHJcblx0dGhpcy5zdHJva2UoKTtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgbGluZSBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5saW5lID0gZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKSB7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLm1vdmVUbyh4MSwgeTEpO1xyXG5cdHRoaXMubGluZVRvKHgyLCB5Mik7XHJcblx0dGhpcy5zdHJva2UoKTtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgc3Ryb2tlZCByZWd1bGFyIHBvbHlnb24gc2hhcGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvbHlnb24gb3JpZ2luLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gWSBjb29yZGluYXRlIG9mIHRoZSBwb2x5Z29uIG9yaWdpbi5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIFJhZGl1cyBvZiB0aGUgcG9seWdvbi5cclxuKiBAcGFyYW0ge251bWJlcn0gcyAtIE51bWJlciBvZiBzaWRlcy5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VQb2x5ID0gZnVuY3Rpb24gKCB4LCB5LCByLCBzICkge1xyXG5cdFxyXG5cdHZhciBzaWRlcyA9IHM7XHJcblx0dmFyIHJhZGl1cyA9IHI7XHJcblx0dmFyIGN4ID0geDtcclxuXHR2YXIgY3kgPSB5O1xyXG5cdHZhciBhbmdsZSA9IDIgKiBNYXRoLlBJIC8gc2lkZXM7XHJcblx0XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLnRyYW5zbGF0ZSggY3gsIGN5ICk7XHJcblx0dGhpcy5tb3ZlVG8oIHJhZGl1cywgMCApOyAgICAgICAgICBcclxuXHRmb3IgKCB2YXIgaSA9IDE7IGkgPD0gc2lkZXM7IGkrKyApIHtcclxuXHRcdHRoaXMubGluZVRvKFxyXG5cdFx0XHRyYWRpdXMgKiBNYXRoLmNvcyggaSAqIGFuZ2xlICksXHJcblx0XHRcdHJhZGl1cyAqIE1hdGguc2luKCBpICogYW5nbGUgKVxyXG5cdFx0KTtcclxuXHR9XHJcblx0dGhpcy5zdHJva2UoKTtcclxuXHR0aGlzLnRyYW5zbGF0ZSggLWN4LCAtY3kgKTtcclxufVxyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZmlsbGVkIHJlZ3VsYXIgcG9seWdvbiBzaGFwZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9seWdvbiBvcmlnaW4uXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvbHlnb24gb3JpZ2luLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gUmFkaXVzIG9mIHRoZSBwb2x5Z29uLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzIC0gTnVtYmVyIG9mIHNpZGVzLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmZpbGxQb2x5ID0gZnVuY3Rpb24gKCB4LCB5LCByLCBzICkge1xyXG5cdFxyXG5cdHZhciBzaWRlcyA9IHM7XHJcblx0dmFyIHJhZGl1cyA9IHI7XHJcblx0dmFyIGN4ID0geDtcclxuXHR2YXIgY3kgPSB5O1xyXG5cdHZhciBhbmdsZSA9IDIgKiBNYXRoLlBJIC8gc2lkZXM7XHJcblx0XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLnRyYW5zbGF0ZSggY3gsIGN5ICk7XHJcblx0dGhpcy5tb3ZlVG8oIHJhZGl1cywgMCApOyAgICAgICAgICBcclxuXHRmb3IgKCB2YXIgaSA9IDE7IGkgPD0gc2lkZXM7IGkrKyApIHtcclxuXHRcdHRoaXMubGluZVRvKFxyXG5cdFx0XHRyYWRpdXMgKiBNYXRoLmNvcyggaSAqIGFuZ2xlICksXHJcblx0XHRcdHJhZGl1cyAqIE1hdGguc2luKCBpICogYW5nbGUgKVxyXG5cdFx0KTtcclxuXHR9XHJcblx0dGhpcy5maWxsKCk7XHJcblx0dGhpcy50cmFuc2xhdGUoIC1jeCwgLWN5ICk7XHJcblx0XHJcbn0iLCJsZXQgcHJlZml4ID0gJ1xceDFiWyc7XHJcblxyXG5jb25zdCBjbCA9IHtcclxuXHQvLyByZWRcclxuXHRyOiBgJHtwcmVmaXh9MzFtYCxcclxuXHRiZ3I6IGAke3ByZWZpeH00MG1gLFxyXG5cdC8vIGdyZWVuXHJcblx0ZzogYCR7cHJlZml4fTMybWAsXHJcblx0YmdnOiBgJHtwcmVmaXh9NDJtYCxcclxuXHQvL3llbGxvd1xyXG5cdHk6IGAke3ByZWZpeH0zM21gLFxyXG5cdGJneTogYCR7cHJlZml4fTQzbWAsXHJcblx0Ly8gYmx1ZVxyXG5cdGI6IGAke3ByZWZpeH0zNm1gLFxyXG5cdGJnYjogYCR7cHJlZml4fTQ2bWAsXHJcblx0Ly8gbWFnZW50YVxyXG5cdG06IGAke3ByZWZpeH0zNW1gLFxyXG5cdGJnbTogYCR7cHJlZml4fTQ1bWAsXHJcblx0Ly8gd2hpdGVcclxuXHR3OiBgJHtwcmVmaXh9MzdtYCxcclxuXHRiZ3c6IGAke3ByZWZpeH00N21gLFxyXG5cdC8vIHJlc2V0XHJcblx0cnN0OiBgJHtwcmVmaXh9MG1gLFxyXG5cdC8vIGJvbGQvYnJpZ2h0XHJcblx0YmxkOiBgJHtwcmVmaXh9MW1gLFxyXG5cdC8vIGRpbVxyXG5cdGRpbTogYCR7cHJlZml4fTJtYFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsOyIsIi8qXHJcbiAqIFRoaXMgaXMgYSBuZWFyLWRpcmVjdCBwb3J0IG9mIFJvYmVydCBQZW5uZXIncyBlYXNpbmcgZXF1YXRpb25zLiBQbGVhc2Ugc2hvd2VyIFJvYmVydCB3aXRoXHJcbiAqIHByYWlzZSBhbmQgYWxsIG9mIHlvdXIgYWRtaXJhdGlvbi4gSGlzIGxpY2Vuc2UgaXMgcHJvdmlkZWQgYmVsb3cuXHJcbiAqXHJcbiAqIEZvciBpbmZvcm1hdGlvbiBvbiBob3cgdG8gdXNlIHRoZXNlIGZ1bmN0aW9ucyBpbiB5b3VyIGFuaW1hdGlvbnMsIGNoZWNrIG91dCBteSBmb2xsb3dpbmcgdHV0b3JpYWw6IFxyXG4gKiBodHRwOi8vYml0Lmx5LzE4aUhIS3FcclxuICpcclxuICogLUtpcnVwYVxyXG4gKi9cclxuXHJcbi8qXHJcbiAqIEBhdXRob3IgUm9iZXJ0IFBlbm5lclxyXG4gKiBAbGljZW5zZSBcclxuICogVEVSTVMgT0YgVVNFIC0gRUFTSU5HIEVRVUFUSU9OU1xyXG4gKiBcclxuICogT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLiBcclxuICogXHJcbiAqIENvcHlyaWdodCDCqSAyMDAxIFJvYmVydCBQZW5uZXJcclxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogXHJcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIFxyXG4gKiBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbiAqIFxyXG4gKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBcclxuICogY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG4gKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBcclxuICogb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgXHJcbiAqIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuICogXHJcbiAqIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGF1dGhvciBub3IgdGhlIG5hbWVzIG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIFxyXG4gKiBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxyXG4gKiBcclxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBcclxuICogRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GXHJcbiAqIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXHJcbiAqIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURVxyXG4gKiBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgXHJcbiAqIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXHJcbiAqIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIFxyXG4gKiBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuIFxyXG4gKlxyXG4gKi9cclxuXHJcbi8qKlxyXG4qIFByb3ZpZGVzIGVhc2luZyBjYWxjdWxhdGlvbiBtZXRob2RzLlxyXG4qIEBuYW1lIGVhc2luZ0VxdWF0aW9uc1xyXG4qXHJcbiogQHNlZSB7QGxpbmsgXCJodHRwOi8vcm9iZXJ0cGVubmVyLmNvbS9lYXNpbmcvXCJ9XHJcbiogQHNlZSB7QGxpbmsgaHR0cHM6Ly9lYXNpbmdzLm5ldC9lbnxFYXNpbmcgY2hlYXQgc2hlZXR9XHJcbiovXHJcbnZhciBlYXNpbmdFcXVhdGlvbnMgPSB7XHJcblx0LyoqXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuXHQgKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG5cdCAqL1xyXG5cdGxpbmVhckVhc2U6IGZ1bmN0aW9uIGxpbmVhckVhc2UoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblx0LyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJblF1YWQ6IGZ1bmN0aW9uIGVhc2VJblF1YWQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiBjdXJyZW50SXRlcmF0aW9uICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZU91dFF1YWQ6IGZ1bmN0aW9uIGVhc2VPdXRRdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiBlYXNlSW5PdXRRdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBjdXJyZW50SXRlcmF0aW9uICogY3VycmVudEl0ZXJhdGlvbiArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKC0tY3VycmVudEl0ZXJhdGlvbiAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgLSAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cclxuXHRlYXNlSW5DdWJpYzogZnVuY3Rpb24gZWFzZUluQ3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMsIDMpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZU91dEN1YmljOiBmdW5jdGlvbiBlYXNlT3V0Q3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgMykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbiBlYXNlSW5PdXRDdWJpYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgMykgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCAzKSArIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluUXVhcnQ6IGZ1bmN0aW9uIGVhc2VJblF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCA0KSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRRdWFydDogZnVuY3Rpb24gZWFzZU91dFF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCA0KSAtIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uIGVhc2VJbk91dFF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCA0KSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCA0KSAtIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluUXVpbnQ6IGZ1bmN0aW9uIGVhc2VJblF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCA1KSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRRdWludDogZnVuY3Rpb24gZWFzZU91dFF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDUpICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gZWFzZUluT3V0UXVpbnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDUpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC0gMiwgNSkgKyAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJblNpbmU6IGZ1bmN0aW9uIGVhc2VJblNpbmUoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgxIC0gTWF0aC5jb3MoY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAqIChNYXRoLlBJIC8gMikpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRTaW5lOiBmdW5jdGlvbiBlYXNlT3V0U2luZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5zaW4oY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAqIChNYXRoLlBJIC8gMikpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluT3V0U2luZTogZnVuY3Rpb24gZWFzZUluT3V0U2luZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbkV4cG86IGZ1bmN0aW9uIGVhc2VJbkV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KDIsIDEwICogKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlT3V0RXhwbzogZnVuY3Rpb24gZWFzZU91dEV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgtTWF0aC5wb3coMiwgLTEwICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbk91dEV4cG86IGZ1bmN0aW9uIGVhc2VJbk91dEV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KDIsIDEwICogKGN1cnJlbnRJdGVyYXRpb24gLSAxKSkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLWN1cnJlbnRJdGVyYXRpb24pICsgMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5DaXJjOiBmdW5jdGlvbiBlYXNlSW5DaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoMSAtIE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRDaXJjOiBmdW5jdGlvbiBlYXNlT3V0Q2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiA9IGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gZWFzZUluT3V0Q2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKDEgLSBNYXRoLnNxcnQoMSAtIGN1cnJlbnRJdGVyYXRpb24gKiBjdXJyZW50SXRlcmF0aW9uKSkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gLT0gMikgKiBjdXJyZW50SXRlcmF0aW9uKSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluRWxhc3RpYzogZnVuY3Rpb24gZWFzZUluRWxhc3RpYyh0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcyA9IDEuNzAxNTg7dmFyIHAgPSAwO3ZhciBhID0gYztcclxuXHRcdGlmICh0ID09IDApIHJldHVybiBiO2lmICgodCAvPSBkKSA9PSAxKSByZXR1cm4gYiArIGM7aWYgKCFwKSBwID0gZCAqIC4zO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkge1xyXG5cdFx0XHRhID0gYzt2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oYyAvIGEpO1xyXG5cdFx0cmV0dXJuIC0oYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpICsgYjtcclxuXHR9LFxyXG5cdC8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlT3V0RWxhc3RpYzogZnVuY3Rpb24gZWFzZU91dEVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCkgPT0gMSkgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAuMztcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogdCkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSArIGMgKyBiO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5PdXRFbGFzdGljOiBmdW5jdGlvbiBlYXNlSW5PdXRFbGFzdGljKHQsIGIsIGMsIGQpIHtcclxuXHRcdHZhciBzID0gMS43MDE1ODt2YXIgcCA9IDA7dmFyIGEgPSBjO1xyXG5cdFx0aWYgKHQgPT0gMCkgcmV0dXJuIGI7aWYgKCh0IC89IGQgLyAyKSA9PSAyKSByZXR1cm4gYiArIGM7aWYgKCFwKSBwID0gZCAqICguMyAqIDEuNSk7XHJcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7XHJcblx0XHRcdGEgPSBjO3ZhciBzID0gcCAvIDQ7XHJcblx0XHR9IGVsc2UgdmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XHJcblx0XHRpZiAodCA8IDEpIHJldHVybiAtLjUgKiAoYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpICsgYjtcclxuXHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkgKiAuNSArIGMgKyBiO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5CYWNrOiBmdW5jdGlvbiBlYXNlSW5CYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyAqICh0IC89IGQpICogdCAqICgocyArIDEpICogdCAtIHMpICsgYjtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZU91dEJhY2s6IGZ1bmN0aW9uIGVhc2VPdXRCYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyAqICgodCA9IHQgLyBkIC0gMSkgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAxKSArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0QmFjazogZnVuY3Rpb24gZWFzZUluT3V0QmFjayh0LCBiLCBjLCBkLCBzKSB7XHJcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0aWYgKCh0IC89IGQgLyAyKSA8IDEpIHJldHVybiBjIC8gMiAqICh0ICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0IC0gcykpICsgYjtcclxuXHRcdHJldHVybiBjIC8gMiAqICgodCAtPSAyKSAqIHQgKiAoKChzICo9IDEuNTI1KSArIDEpICogdCArIHMpICsgMikgKyBiO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbiBlYXNlT3V0Qm91bmNlKHQsIGIsIGMsIGQpIHtcclxuXHRcdGlmICgodCAvPSBkKSA8IDEgLyAyLjc1KSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqIHQgKiB0KSArIGI7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAyIC8gMi43NSkge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAxLjUgLyAyLjc1KSAqIHQgKyAuNzUpICsgYjtcclxuXHRcdH0gZWxzZSBpZiAodCA8IDIuNSAvIDIuNzUpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMi4yNSAvIDIuNzUpICogdCArIC45Mzc1KSArIGI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAyLjYyNSAvIDIuNzUpICogdCArIC45ODQzNzUpICsgYjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5lYXNpbmdFcXVhdGlvbnMuZWFzZUluQm91bmNlID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcclxuXHRyZXR1cm4gYyAtIGVhc2luZ0VxdWF0aW9ucy5lYXNlT3V0Qm91bmNlKGQgLSB0LCAwLCBjLCBkKSArIGI7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcbmVhc2luZ0VxdWF0aW9ucy5lYXNlSW5PdXRCb3VuY2UgPSBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xyXG5cdGlmICh0IDwgZCAvIDIpIHJldHVybiBlYXNpbmdFcXVhdGlvbnMuZWFzZUluQm91bmNlKHQgKiAyLCAwLCBjLCBkKSAqIC41ICsgYjtcclxuXHRyZXR1cm4gZWFzaW5nRXF1YXRpb25zLmVhc2VPdXRCb3VuY2UodCAqIDIgLSBkLCAwLCBjLCBkKSAqIC41ICsgYyAqIC41ICsgYjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmVhc2luZ0VxdWF0aW9ucyA9IGVhc2luZ0VxdWF0aW9uczsiLCIvKipcclxuKiBwcm92aWRlcyBtYXRocyB1dGlsaWxpdHkgbWV0aG9kcyBhbmQgaGVscGVycy5cclxuKlxyXG4qIEBtb2R1bGUgbWF0aFV0aWxzXHJcbiovXHJcblxyXG52YXIgbWF0aFV0aWxzID0ge1xyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2VuZXJhdGUgcmFuZG9tIGludGVnZXIgYmV0d2VlbiAyIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdHJhbmRvbUludGVnZXI6IGZ1bmN0aW9uIHJhbmRvbUludGVnZXIobWluLCBtYXgpIHtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4ICsgMSAtIG1pbikgKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIEdlbmVyYXRlIHJhbmRvbSBmbG9hdCBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tOiBmdW5jdGlvbiByYW5kb20obWluLCBtYXgpIHtcclxuXHRcdGlmIChtaW4gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtaW4gPSAwO1xyXG5cdFx0XHRtYXggPSAxO1xyXG5cdFx0fSBlbHNlIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtYXggPSBtaW47XHJcblx0XHRcdG1pbiA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdGdldFJhbmRvbUFyYml0cmFyeTogZnVuY3Rpb24gZ2V0UmFuZG9tQXJiaXRyYXJ5KG1pbiwgbWF4KSB7XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBUcmFuc2Zvcm1zIHZhbHVlIHByb3BvcnRpb25hdGVseSBiZXR3ZWVuIGlucHV0IHJhbmdlIGFuZCBvdXRwdXQgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgb3JpZ2luIHJhbmdlICggbWluMS9tYXgxICkuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4xIC0gbWluaW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgxIC0gbWF4aW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4yIC0gbWluaW11bSB2YWx1ZSBpbiBkZXN0aW5hdGlvbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heDIgLSBtYXhpbXVtIHZhbHVlIGluIGRlc3RpbmF0aW9uIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiBkZXN0aW5hdGlvbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0bWFwOiBmdW5jdGlvbiBtYXAodmFsdWUsIG1pbjEsIG1heDEsIG1pbjIsIG1heDIsIGNsYW1wUmVzdWx0KSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgcmV0dXJudmFsdWUgPSAodmFsdWUgLSBtaW4xKSAvIChtYXgxIC0gbWluMSkgKiAobWF4MiAtIG1pbjIpICsgbWluMjtcclxuXHRcdGlmIChjbGFtcFJlc3VsdCkgcmV0dXJuIHNlbGYuY2xhbXAocmV0dXJudmFsdWUsIG1pbjIsIG1heDIpO2Vsc2UgcmV0dXJuIHJldHVybnZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ2xhbXAgdmFsdWUgYmV0d2VlbiByYW5nZSB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgcmFuZ2UgeyBtaW58bWF4IH0uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlIGluIHRoZSByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUgaW4gdGhlIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqL1xyXG5cdGNsYW1wOiBmdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtcclxuXHRcdGlmIChtYXggPCBtaW4pIHtcclxuXHRcdFx0dmFyIHRlbXAgPSBtaW47XHJcblx0XHRcdG1pbiA9IG1heDtcclxuXHRcdFx0bWF4ID0gdGVtcDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGhVdGlsczsiLCIvLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKSBzaGltIGJ5IFBhdWwgSXJpc2hcclxud2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHR3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHR3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVjIHx8XHJcblx0XHRcdGZ1bmN0aW9uKCBjYWxsYmFjaywgZWxlbWVudCApIHtcclxuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcclxuXHRcdFx0fTtcclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBCZWhhdmVzIHRoZSBzYW1lIGFzIHNldFRpbWVvdXQgZXhjZXB0IHVzZXMgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCkgd2hlcmUgcG9zc2libGUgZm9yIGJldHRlciBwZXJmb3JtYW5jZVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5IFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHNcclxuICovXHJcblxyXG53aW5kb3cucmVxdWVzdFRpbWVvdXQgPSBmdW5jdGlvbihmbiwgZGVsYXkpIHtcclxuXHRpZiAoICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmICF3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmICEoIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93Lm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSkgJiYgIXdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmICF3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKSB7XHJcblx0XHRyZXR1cm4gd2luZG93LnNldFRpbWVvdXQoZm4sIGRlbGF5KTtcclxuXHR9XHJcblx0XHRcdFxyXG5cdHZhciBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxyXG5cdFx0aGFuZGxlID0gbmV3IE9iamVjdCgpO1xyXG5cdFx0XHJcblx0ZnVuY3Rpb24gbG9vcCgpe1xyXG5cdFx0dmFyIGN1cnJlbnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcclxuXHRcdFx0ZGVsdGEgPSBjdXJyZW50IC0gc3RhcnQ7XHJcblx0XHRkZWx0YSA+PSBkZWxheSA/IGZuLmNhbGwoKSA6IGhhbmRsZS52YWx1ZSA9IHJlcXVlc3RBbmltRnJhbWUobG9vcCk7XHJcblx0fTtcclxuXHRcclxuXHRoYW5kbGUudmFsdWUgPSByZXF1ZXN0QW5pbUZyYW1lKGxvb3ApO1xyXG5cdHJldHVybiBoYW5kbGU7XHJcbn07XHJcblxyXG4vKipcclxuICogQmVoYXZlcyB0aGUgc2FtZSBhcyBjbGVhclRpbWVvdXQgZXhjZXB0IHVzZXMgY2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKCkgd2hlcmUgcG9zc2libGUgZm9yIGJldHRlciBwZXJmb3JtYW5jZVxyXG4gKiBAcGFyYW0ge2ludHxvYmplY3R9IGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxyXG4gKi9cclxud2luZG93LmNsZWFyUmVxdWVzdFRpbWVvdXQgPSBmdW5jdGlvbiggaGFuZGxlICkge1xyXG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID8gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKCBoYW5kbGUudmFsdWUgKSA6XHJcbiAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgPyB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUoIGhhbmRsZS52YWx1ZSApIDpcclxuICAgIHdpbmRvdy53ZWJraXRDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPyB3aW5kb3cud2Via2l0Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBoYW5kbGUudmFsdWUgKSA6IC8qIFN1cHBvcnQgZm9yIGxlZ2FjeSBBUEkgKi9cclxuICAgIHdpbmRvdy5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPyB3aW5kb3cubW96Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBoYW5kbGUudmFsdWUgKSA6XHJcbiAgICB3aW5kb3cub0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVx0PyB3aW5kb3cub0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSggaGFuZGxlLnZhbHVlICkgOlxyXG4gICAgd2luZG93Lm1zQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lID8gd2luZG93Lm1zQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBoYW5kbGUudmFsdWUgKSA6XHJcbiAgICBjbGVhclRpbWVvdXQoIGhhbmRsZSApO1xyXG59OyIsIi8qXHJcbiAqIEEgZmFzdCBqYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHNpbXBsZXggbm9pc2UgYnkgSm9uYXMgV2FnbmVyXHJcbkJhc2VkIG9uIGEgc3BlZWQtaW1wcm92ZWQgc2ltcGxleCBub2lzZSBhbGdvcml0aG0gZm9yIDJELCAzRCBhbmQgNEQgaW4gSmF2YS5cclxuV2hpY2ggaXMgYmFzZWQgb24gZXhhbXBsZSBjb2RlIGJ5IFN0ZWZhbiBHdXN0YXZzb24gKHN0ZWd1QGl0bi5saXUuc2UpLlxyXG5XaXRoIE9wdGltaXNhdGlvbnMgYnkgUGV0ZXIgRWFzdG1hbiAocGVhc3RtYW5AZHJpenpsZS5zdGFuZm9yZC5lZHUpLlxyXG5CZXR0ZXIgcmFuayBvcmRlcmluZyBtZXRob2QgYnkgU3RlZmFuIEd1c3RhdnNvbiBpbiAyMDEyLlxyXG5cclxuQ29weXJpZ2h0IChjKSAyMDE4IEpvbmFzIFdhZ25lclxyXG5cclxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXHJcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXHJcblNPRlRXQVJFLlxyXG4qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgdmFyIEYyID0gMC41ICogKE1hdGguc3FydCgzLjApIC0gMS4wKTtcclxuICB2YXIgRzIgPSAoMy4wIC0gTWF0aC5zcXJ0KDMuMCkpIC8gNi4wO1xyXG4gIHZhciBGMyA9IDEuMCAvIDMuMDtcclxuICB2YXIgRzMgPSAxLjAgLyA2LjA7XHJcbiAgdmFyIEY0ID0gKE1hdGguc3FydCg1LjApIC0gMS4wKSAvIDQuMDtcclxuICB2YXIgRzQgPSAoNS4wIC0gTWF0aC5zcXJ0KDUuMCkpIC8gMjAuMDtcclxuXHJcbiAgZnVuY3Rpb24gU2ltcGxleE5vaXNlKHJhbmRvbU9yU2VlZCkge1xyXG4gICAgdmFyIHJhbmRvbTtcclxuICAgIGlmICh0eXBlb2YgcmFuZG9tT3JTZWVkID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgcmFuZG9tID0gcmFuZG9tT3JTZWVkO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocmFuZG9tT3JTZWVkKSB7XHJcbiAgICAgIHJhbmRvbSA9IGFsZWEocmFuZG9tT3JTZWVkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJhbmRvbSA9IE1hdGgucmFuZG9tO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wID0gYnVpbGRQZXJtdXRhdGlvblRhYmxlKHJhbmRvbSk7XHJcbiAgICB0aGlzLnBlcm0gPSBuZXcgVWludDhBcnJheSg1MTIpO1xyXG4gICAgdGhpcy5wZXJtTW9kMTIgPSBuZXcgVWludDhBcnJheSg1MTIpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1MTI7IGkrKykge1xyXG4gICAgICB0aGlzLnBlcm1baV0gPSB0aGlzLnBbaSAmIDI1NV07XHJcbiAgICAgIHRoaXMucGVybU1vZDEyW2ldID0gdGhpcy5wZXJtW2ldICUgMTI7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuICBTaW1wbGV4Tm9pc2UucHJvdG90eXBlID0ge1xyXG4gICAgZ3JhZDM6IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDEsIDAsXHJcbiAgICAgIC0xLCAxLCAwLFxyXG4gICAgICAxLCAtMSwgMCxcclxuXHJcbiAgICAgIC0xLCAtMSwgMCxcclxuICAgICAgMSwgMCwgMSxcclxuICAgICAgLTEsIDAsIDEsXHJcblxyXG4gICAgICAxLCAwLCAtMSxcclxuICAgICAgLTEsIDAsIC0xLFxyXG4gICAgICAwLCAxLCAxLFxyXG5cclxuICAgICAgMCwgLTEsIDEsXHJcbiAgICAgIDAsIDEsIC0xLFxyXG4gICAgICAwLCAtMSwgLTFdKSxcclxuICAgIGdyYWQ0OiBuZXcgRmxvYXQzMkFycmF5KFswLCAxLCAxLCAxLCAwLCAxLCAxLCAtMSwgMCwgMSwgLTEsIDEsIDAsIDEsIC0xLCAtMSxcclxuICAgICAgMCwgLTEsIDEsIDEsIDAsIC0xLCAxLCAtMSwgMCwgLTEsIC0xLCAxLCAwLCAtMSwgLTEsIC0xLFxyXG4gICAgICAxLCAwLCAxLCAxLCAxLCAwLCAxLCAtMSwgMSwgMCwgLTEsIDEsIDEsIDAsIC0xLCAtMSxcclxuICAgICAgLTEsIDAsIDEsIDEsIC0xLCAwLCAxLCAtMSwgLTEsIDAsIC0xLCAxLCAtMSwgMCwgLTEsIC0xLFxyXG4gICAgICAxLCAxLCAwLCAxLCAxLCAxLCAwLCAtMSwgMSwgLTEsIDAsIDEsIDEsIC0xLCAwLCAtMSxcclxuICAgICAgLTEsIDEsIDAsIDEsIC0xLCAxLCAwLCAtMSwgLTEsIC0xLCAwLCAxLCAtMSwgLTEsIDAsIC0xLFxyXG4gICAgICAxLCAxLCAxLCAwLCAxLCAxLCAtMSwgMCwgMSwgLTEsIDEsIDAsIDEsIC0xLCAtMSwgMCxcclxuICAgICAgLTEsIDEsIDEsIDAsIC0xLCAxLCAtMSwgMCwgLTEsIC0xLCAxLCAwLCAtMSwgLTEsIC0xLCAwXSksXHJcbiAgICBub2lzZTJEOiBmdW5jdGlvbih4aW4sIHlpbikge1xyXG4gICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTI7XHJcbiAgICAgIHZhciBwZXJtID0gdGhpcy5wZXJtO1xyXG4gICAgICB2YXIgZ3JhZDMgPSB0aGlzLmdyYWQzO1xyXG4gICAgICB2YXIgbjAgPSAwOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcclxuICAgICAgdmFyIG4xID0gMDtcclxuICAgICAgdmFyIG4yID0gMDtcclxuICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxyXG4gICAgICB2YXIgcyA9ICh4aW4gKyB5aW4pICogRjI7IC8vIEhhaXJ5IGZhY3RvciBmb3IgMkRcclxuICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xyXG4gICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XHJcbiAgICAgIHZhciB0ID0gKGkgKyBqKSAqIEcyO1xyXG4gICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkpIHNwYWNlXHJcbiAgICAgIHZhciBZMCA9IGogLSB0O1xyXG4gICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cclxuICAgICAgdmFyIHkwID0geWluIC0gWTA7XHJcbiAgICAgIC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXHJcbiAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cclxuICAgICAgdmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xyXG4gICAgICBpZiAoeDAgPiB5MCkge1xyXG4gICAgICAgIGkxID0gMTtcclxuICAgICAgICBqMSA9IDA7XHJcbiAgICAgIH0gLy8gbG93ZXIgdHJpYW5nbGUsIFhZIG9yZGVyOiAoMCwwKS0+KDEsMCktPigxLDEpXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGkxID0gMDtcclxuICAgICAgICBqMSA9IDE7XHJcbiAgICAgIH0gLy8gdXBwZXIgdHJpYW5nbGUsIFlYIG9yZGVyOiAoMCwwKS0+KDAsMSktPigxLDEpXHJcbiAgICAgIC8vIEEgc3RlcCBvZiAoMSwwKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKDEtYywtYykgaW4gKHgseSksIGFuZFxyXG4gICAgICAvLyBhIHN0ZXAgb2YgKDAsMSkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMpIGluICh4LHkpLCB3aGVyZVxyXG4gICAgICAvLyBjID0gKDMtc3FydCgzKSkvNlxyXG4gICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzI7IC8vIE9mZnNldHMgZm9yIG1pZGRsZSBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXHJcbiAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMjtcclxuICAgICAgdmFyIHgyID0geDAgLSAxLjAgKyAyLjAgKiBHMjsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXHJcbiAgICAgIHZhciB5MiA9IHkwIC0gMS4wICsgMi4wICogRzI7XHJcbiAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgdGhyZWUgc2ltcGxleCBjb3JuZXJzXHJcbiAgICAgIHZhciBpaSA9IGkgJiAyNTU7XHJcbiAgICAgIHZhciBqaiA9IGogJiAyNTU7XHJcbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcclxuICAgICAgdmFyIHQwID0gMC41IC0geDAgKiB4MCAtIHkwICogeTA7XHJcbiAgICAgIGlmICh0MCA+PSAwKSB7XHJcbiAgICAgICAgdmFyIGdpMCA9IHBlcm1Nb2QxMltpaSArIHBlcm1bampdXSAqIDM7XHJcbiAgICAgICAgdDAgKj0gdDA7XHJcbiAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQzW2dpMF0gKiB4MCArIGdyYWQzW2dpMCArIDFdICogeTApOyAvLyAoeCx5KSBvZiBncmFkMyB1c2VkIGZvciAyRCBncmFkaWVudFxyXG4gICAgICB9XHJcbiAgICAgIHZhciB0MSA9IDAuNSAtIHgxICogeDEgLSB5MSAqIHkxO1xyXG4gICAgICBpZiAodDEgPj0gMCkge1xyXG4gICAgICAgIHZhciBnaTEgPSBwZXJtTW9kMTJbaWkgKyBpMSArIHBlcm1bamogKyBqMV1dICogMztcclxuICAgICAgICB0MSAqPSB0MTtcclxuICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDNbZ2kxXSAqIHgxICsgZ3JhZDNbZ2kxICsgMV0gKiB5MSk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHQyID0gMC41IC0geDIgKiB4MiAtIHkyICogeTI7XHJcbiAgICAgIGlmICh0MiA+PSAwKSB7XHJcbiAgICAgICAgdmFyIGdpMiA9IHBlcm1Nb2QxMltpaSArIDEgKyBwZXJtW2pqICsgMV1dICogMztcclxuICAgICAgICB0MiAqPSB0MjtcclxuICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDNbZ2kyXSAqIHgyICsgZ3JhZDNbZ2kyICsgMV0gKiB5Mik7XHJcbiAgICAgIH1cclxuICAgICAgLy8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxyXG4gICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXHJcbiAgICAgIHJldHVybiA3MC4wICogKG4wICsgbjEgKyBuMik7XHJcbiAgICB9LFxyXG4gICAgLy8gM0Qgc2ltcGxleCBub2lzZVxyXG4gICAgbm9pc2UzRDogZnVuY3Rpb24oeGluLCB5aW4sIHppbikge1xyXG4gICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTI7XHJcbiAgICAgIHZhciBwZXJtID0gdGhpcy5wZXJtO1xyXG4gICAgICB2YXIgZ3JhZDMgPSB0aGlzLmdyYWQzO1xyXG4gICAgICB2YXIgbjAsIG4xLCBuMiwgbjM7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgZm91ciBjb3JuZXJzXHJcbiAgICAgIC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cclxuICAgICAgdmFyIHMgPSAoeGluICsgeWluICsgemluKSAqIEYzOyAvLyBWZXJ5IG5pY2UgYW5kIHNpbXBsZSBza2V3IGZhY3RvciBmb3IgM0RcclxuICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xyXG4gICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XHJcbiAgICAgIHZhciBrID0gTWF0aC5mbG9vcih6aW4gKyBzKTtcclxuICAgICAgdmFyIHQgPSAoaSArIGogKyBrKSAqIEczO1xyXG4gICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseikgc3BhY2VcclxuICAgICAgdmFyIFkwID0gaiAtIHQ7XHJcbiAgICAgIHZhciBaMCA9IGsgLSB0O1xyXG4gICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSx6IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxyXG4gICAgICB2YXIgeTAgPSB5aW4gLSBZMDtcclxuICAgICAgdmFyIHowID0gemluIC0gWjA7XHJcbiAgICAgIC8vIEZvciB0aGUgM0QgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYSBzbGlnaHRseSBpcnJlZ3VsYXIgdGV0cmFoZWRyb24uXHJcbiAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cclxuICAgICAgdmFyIGkxLCBqMSwgazE7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqLGspIGNvb3Jkc1xyXG4gICAgICB2YXIgaTIsIGoyLCBrMjsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaixrKSBjb29yZHNcclxuICAgICAgaWYgKHgwID49IHkwKSB7XHJcbiAgICAgICAgaWYgKHkwID49IHowKSB7XHJcbiAgICAgICAgICBpMSA9IDE7XHJcbiAgICAgICAgICBqMSA9IDA7XHJcbiAgICAgICAgICBrMSA9IDA7XHJcbiAgICAgICAgICBpMiA9IDE7XHJcbiAgICAgICAgICBqMiA9IDE7XHJcbiAgICAgICAgICBrMiA9IDA7XHJcbiAgICAgICAgfSAvLyBYIFkgWiBvcmRlclxyXG4gICAgICAgIGVsc2UgaWYgKHgwID49IHowKSB7XHJcbiAgICAgICAgICBpMSA9IDE7XHJcbiAgICAgICAgICBqMSA9IDA7XHJcbiAgICAgICAgICBrMSA9IDA7XHJcbiAgICAgICAgICBpMiA9IDE7XHJcbiAgICAgICAgICBqMiA9IDA7XHJcbiAgICAgICAgICBrMiA9IDE7XHJcbiAgICAgICAgfSAvLyBYIFogWSBvcmRlclxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgaTEgPSAwO1xyXG4gICAgICAgICAgajEgPSAwO1xyXG4gICAgICAgICAgazEgPSAxO1xyXG4gICAgICAgICAgaTIgPSAxO1xyXG4gICAgICAgICAgajIgPSAwO1xyXG4gICAgICAgICAgazIgPSAxO1xyXG4gICAgICAgIH0gLy8gWiBYIFkgb3JkZXJcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgLy8geDA8eTBcclxuICAgICAgICBpZiAoeTAgPCB6MCkge1xyXG4gICAgICAgICAgaTEgPSAwO1xyXG4gICAgICAgICAgajEgPSAwO1xyXG4gICAgICAgICAgazEgPSAxO1xyXG4gICAgICAgICAgaTIgPSAwO1xyXG4gICAgICAgICAgajIgPSAxO1xyXG4gICAgICAgICAgazIgPSAxO1xyXG4gICAgICAgIH0gLy8gWiBZIFggb3JkZXJcclxuICAgICAgICBlbHNlIGlmICh4MCA8IHowKSB7XHJcbiAgICAgICAgICBpMSA9IDA7XHJcbiAgICAgICAgICBqMSA9IDE7XHJcbiAgICAgICAgICBrMSA9IDA7XHJcbiAgICAgICAgICBpMiA9IDA7XHJcbiAgICAgICAgICBqMiA9IDE7XHJcbiAgICAgICAgICBrMiA9IDE7XHJcbiAgICAgICAgfSAvLyBZIFogWCBvcmRlclxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgaTEgPSAwO1xyXG4gICAgICAgICAgajEgPSAxO1xyXG4gICAgICAgICAgazEgPSAwO1xyXG4gICAgICAgICAgaTIgPSAxO1xyXG4gICAgICAgICAgajIgPSAxO1xyXG4gICAgICAgICAgazIgPSAwO1xyXG4gICAgICAgIH0gLy8gWSBYIFogb3JkZXJcclxuICAgICAgfVxyXG4gICAgICAvLyBBIHN0ZXAgb2YgKDEsMCwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jLC1jKSBpbiAoeCx5LHopLFxyXG4gICAgICAvLyBhIHN0ZXAgb2YgKDAsMSwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jLC1jKSBpbiAoeCx5LHopLCBhbmRcclxuICAgICAgLy8gYSBzdGVwIG9mICgwLDAsMSkgaW4gKGksaixrKSBtZWFucyBhIHN0ZXAgb2YgKC1jLC1jLDEtYykgaW4gKHgseSx6KSwgd2hlcmVcclxuICAgICAgLy8gYyA9IDEvNi5cclxuICAgICAgdmFyIHgxID0geDAgLSBpMSArIEczOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseikgY29vcmRzXHJcbiAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMztcclxuICAgICAgdmFyIHoxID0gejAgLSBrMSArIEczO1xyXG4gICAgICB2YXIgeDIgPSB4MCAtIGkyICsgMi4wICogRzM7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xyXG4gICAgICB2YXIgeTIgPSB5MCAtIGoyICsgMi4wICogRzM7XHJcbiAgICAgIHZhciB6MiA9IHowIC0gazIgKyAyLjAgKiBHMztcclxuICAgICAgdmFyIHgzID0geDAgLSAxLjAgKyAzLjAgKiBHMzsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcclxuICAgICAgdmFyIHkzID0geTAgLSAxLjAgKyAzLjAgKiBHMztcclxuICAgICAgdmFyIHozID0gejAgLSAxLjAgKyAzLjAgKiBHMztcclxuICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSBmb3VyIHNpbXBsZXggY29ybmVyc1xyXG4gICAgICB2YXIgaWkgPSBpICYgMjU1O1xyXG4gICAgICB2YXIgamogPSBqICYgMjU1O1xyXG4gICAgICB2YXIga2sgPSBrICYgMjU1O1xyXG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSBmb3VyIGNvcm5lcnNcclxuICAgICAgdmFyIHQwID0gMC42IC0geDAgKiB4MCAtIHkwICogeTAgLSB6MCAqIHowO1xyXG4gICAgICBpZiAodDAgPCAwKSBuMCA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMCA9IHBlcm1Nb2QxMltpaSArIHBlcm1bamogKyBwZXJtW2trXV1dICogMztcclxuICAgICAgICB0MCAqPSB0MDtcclxuICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDNbZ2kwXSAqIHgwICsgZ3JhZDNbZ2kwICsgMV0gKiB5MCArIGdyYWQzW2dpMCArIDJdICogejApO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciB0MSA9IDAuNiAtIHgxICogeDEgLSB5MSAqIHkxIC0gejEgKiB6MTtcclxuICAgICAgaWYgKHQxIDwgMCkgbjEgPSAwLjA7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBnaTEgPSBwZXJtTW9kMTJbaWkgKyBpMSArIHBlcm1bamogKyBqMSArIHBlcm1ba2sgKyBrMV1dXSAqIDM7XHJcbiAgICAgICAgdDEgKj0gdDE7XHJcbiAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQzW2dpMV0gKiB4MSArIGdyYWQzW2dpMSArIDFdICogeTEgKyBncmFkM1tnaTEgKyAyXSAqIHoxKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDIgPSAwLjYgLSB4MiAqIHgyIC0geTIgKiB5MiAtIHoyICogejI7XHJcbiAgICAgIGlmICh0MiA8IDApIG4yID0gMC4wO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZ2kyID0gcGVybU1vZDEyW2lpICsgaTIgKyBwZXJtW2pqICsgajIgKyBwZXJtW2trICsgazJdXV0gKiAzO1xyXG4gICAgICAgIHQyICo9IHQyO1xyXG4gICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkM1tnaTJdICogeDIgKyBncmFkM1tnaTIgKyAxXSAqIHkyICsgZ3JhZDNbZ2kyICsgMl0gKiB6Mik7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHQzID0gMC42IC0geDMgKiB4MyAtIHkzICogeTMgLSB6MyAqIHozO1xyXG4gICAgICBpZiAodDMgPCAwKSBuMyA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMyA9IHBlcm1Nb2QxMltpaSArIDEgKyBwZXJtW2pqICsgMSArIHBlcm1ba2sgKyAxXV1dICogMztcclxuICAgICAgICB0MyAqPSB0MztcclxuICAgICAgICBuMyA9IHQzICogdDMgKiAoZ3JhZDNbZ2kzXSAqIHgzICsgZ3JhZDNbZ2kzICsgMV0gKiB5MyArIGdyYWQzW2dpMyArIDJdICogejMpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cclxuICAgICAgLy8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gc3RheSBqdXN0IGluc2lkZSBbLTEsMV1cclxuICAgICAgcmV0dXJuIDMyLjAgKiAobjAgKyBuMSArIG4yICsgbjMpO1xyXG4gICAgfSxcclxuICAgIC8vIDREIHNpbXBsZXggbm9pc2UsIGJldHRlciBzaW1wbGV4IHJhbmsgb3JkZXJpbmcgbWV0aG9kIDIwMTItMDMtMDlcclxuICAgIG5vaXNlNEQ6IGZ1bmN0aW9uKHgsIHksIHosIHcpIHtcclxuICAgICAgdmFyIHBlcm0gPSB0aGlzLnBlcm07XHJcbiAgICAgIHZhciBncmFkNCA9IHRoaXMuZ3JhZDQ7XHJcblxyXG4gICAgICB2YXIgbjAsIG4xLCBuMiwgbjMsIG40OyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIGZpdmUgY29ybmVyc1xyXG4gICAgICAvLyBTa2V3IHRoZSAoeCx5LHosdykgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIGNlbGwgb2YgMjQgc2ltcGxpY2VzIHdlJ3JlIGluXHJcbiAgICAgIHZhciBzID0gKHggKyB5ICsgeiArIHcpICogRjQ7IC8vIEZhY3RvciBmb3IgNEQgc2tld2luZ1xyXG4gICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeCArIHMpO1xyXG4gICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeSArIHMpO1xyXG4gICAgICB2YXIgayA9IE1hdGguZmxvb3IoeiArIHMpO1xyXG4gICAgICB2YXIgbCA9IE1hdGguZmxvb3IodyArIHMpO1xyXG4gICAgICB2YXIgdCA9IChpICsgaiArIGsgKyBsKSAqIEc0OyAvLyBGYWN0b3IgZm9yIDREIHVuc2tld2luZ1xyXG4gICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseix3KSBzcGFjZVxyXG4gICAgICB2YXIgWTAgPSBqIC0gdDtcclxuICAgICAgdmFyIFowID0gayAtIHQ7XHJcbiAgICAgIHZhciBXMCA9IGwgLSB0O1xyXG4gICAgICB2YXIgeDAgPSB4IC0gWDA7IC8vIFRoZSB4LHkseix3IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxyXG4gICAgICB2YXIgeTAgPSB5IC0gWTA7XHJcbiAgICAgIHZhciB6MCA9IHogLSBaMDtcclxuICAgICAgdmFyIHcwID0gdyAtIFcwO1xyXG4gICAgICAvLyBGb3IgdGhlIDREIGNhc2UsIHRoZSBzaW1wbGV4IGlzIGEgNEQgc2hhcGUgSSB3b24ndCBldmVuIHRyeSB0byBkZXNjcmliZS5cclxuICAgICAgLy8gVG8gZmluZCBvdXQgd2hpY2ggb2YgdGhlIDI0IHBvc3NpYmxlIHNpbXBsaWNlcyB3ZSdyZSBpbiwgd2UgbmVlZCB0b1xyXG4gICAgICAvLyBkZXRlcm1pbmUgdGhlIG1hZ25pdHVkZSBvcmRlcmluZyBvZiB4MCwgeTAsIHowIGFuZCB3MC5cclxuICAgICAgLy8gU2l4IHBhaXItd2lzZSBjb21wYXJpc29ucyBhcmUgcGVyZm9ybWVkIGJldHdlZW4gZWFjaCBwb3NzaWJsZSBwYWlyXHJcbiAgICAgIC8vIG9mIHRoZSBmb3VyIGNvb3JkaW5hdGVzLCBhbmQgdGhlIHJlc3VsdHMgYXJlIHVzZWQgdG8gcmFuayB0aGUgbnVtYmVycy5cclxuICAgICAgdmFyIHJhbmt4ID0gMDtcclxuICAgICAgdmFyIHJhbmt5ID0gMDtcclxuICAgICAgdmFyIHJhbmt6ID0gMDtcclxuICAgICAgdmFyIHJhbmt3ID0gMDtcclxuICAgICAgaWYgKHgwID4geTApIHJhbmt4Kys7XHJcbiAgICAgIGVsc2UgcmFua3krKztcclxuICAgICAgaWYgKHgwID4gejApIHJhbmt4Kys7XHJcbiAgICAgIGVsc2UgcmFua3orKztcclxuICAgICAgaWYgKHgwID4gdzApIHJhbmt4Kys7XHJcbiAgICAgIGVsc2UgcmFua3crKztcclxuICAgICAgaWYgKHkwID4gejApIHJhbmt5Kys7XHJcbiAgICAgIGVsc2UgcmFua3orKztcclxuICAgICAgaWYgKHkwID4gdzApIHJhbmt5Kys7XHJcbiAgICAgIGVsc2UgcmFua3crKztcclxuICAgICAgaWYgKHowID4gdzApIHJhbmt6Kys7XHJcbiAgICAgIGVsc2UgcmFua3crKztcclxuICAgICAgdmFyIGkxLCBqMSwgazEsIGwxOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgc2Vjb25kIHNpbXBsZXggY29ybmVyXHJcbiAgICAgIHZhciBpMiwgajIsIGsyLCBsMjsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIHRoaXJkIHNpbXBsZXggY29ybmVyXHJcbiAgICAgIHZhciBpMywgajMsIGszLCBsMzsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIGZvdXJ0aCBzaW1wbGV4IGNvcm5lclxyXG4gICAgICAvLyBzaW1wbGV4W2NdIGlzIGEgNC12ZWN0b3Igd2l0aCB0aGUgbnVtYmVycyAwLCAxLCAyIGFuZCAzIGluIHNvbWUgb3JkZXIuXHJcbiAgICAgIC8vIE1hbnkgdmFsdWVzIG9mIGMgd2lsbCBuZXZlciBvY2N1ciwgc2luY2UgZS5nLiB4Pnk+ej53IG1ha2VzIHg8eiwgeTx3IGFuZCB4PHdcclxuICAgICAgLy8gaW1wb3NzaWJsZS4gT25seSB0aGUgMjQgaW5kaWNlcyB3aGljaCBoYXZlIG5vbi16ZXJvIGVudHJpZXMgbWFrZSBhbnkgc2Vuc2UuXHJcbiAgICAgIC8vIFdlIHVzZSBhIHRocmVzaG9sZGluZyB0byBzZXQgdGhlIGNvb3JkaW5hdGVzIGluIHR1cm4gZnJvbSB0aGUgbGFyZ2VzdCBtYWduaXR1ZGUuXHJcbiAgICAgIC8vIFJhbmsgMyBkZW5vdGVzIHRoZSBsYXJnZXN0IGNvb3JkaW5hdGUuXHJcbiAgICAgIGkxID0gcmFua3ggPj0gMyA/IDEgOiAwO1xyXG4gICAgICBqMSA9IHJhbmt5ID49IDMgPyAxIDogMDtcclxuICAgICAgazEgPSByYW5reiA+PSAzID8gMSA6IDA7XHJcbiAgICAgIGwxID0gcmFua3cgPj0gMyA/IDEgOiAwO1xyXG4gICAgICAvLyBSYW5rIDIgZGVub3RlcyB0aGUgc2Vjb25kIGxhcmdlc3QgY29vcmRpbmF0ZS5cclxuICAgICAgaTIgPSByYW5reCA+PSAyID8gMSA6IDA7XHJcbiAgICAgIGoyID0gcmFua3kgPj0gMiA/IDEgOiAwO1xyXG4gICAgICBrMiA9IHJhbmt6ID49IDIgPyAxIDogMDtcclxuICAgICAgbDIgPSByYW5rdyA+PSAyID8gMSA6IDA7XHJcbiAgICAgIC8vIFJhbmsgMSBkZW5vdGVzIHRoZSBzZWNvbmQgc21hbGxlc3QgY29vcmRpbmF0ZS5cclxuICAgICAgaTMgPSByYW5reCA+PSAxID8gMSA6IDA7XHJcbiAgICAgIGozID0gcmFua3kgPj0gMSA/IDEgOiAwO1xyXG4gICAgICBrMyA9IHJhbmt6ID49IDEgPyAxIDogMDtcclxuICAgICAgbDMgPSByYW5rdyA+PSAxID8gMSA6IDA7XHJcbiAgICAgIC8vIFRoZSBmaWZ0aCBjb3JuZXIgaGFzIGFsbCBjb29yZGluYXRlIG9mZnNldHMgPSAxLCBzbyBubyBuZWVkIHRvIGNvbXB1dGUgdGhhdC5cclxuICAgICAgdmFyIHgxID0geDAgLSBpMSArIEc0OyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcclxuICAgICAgdmFyIHkxID0geTAgLSBqMSArIEc0O1xyXG4gICAgICB2YXIgejEgPSB6MCAtIGsxICsgRzQ7XHJcbiAgICAgIHZhciB3MSA9IHcwIC0gbDEgKyBHNDtcclxuICAgICAgdmFyIHgyID0geDAgLSBpMiArIDIuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciB0aGlyZCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xyXG4gICAgICB2YXIgeTIgPSB5MCAtIGoyICsgMi4wICogRzQ7XHJcbiAgICAgIHZhciB6MiA9IHowIC0gazIgKyAyLjAgKiBHNDtcclxuICAgICAgdmFyIHcyID0gdzAgLSBsMiArIDIuMCAqIEc0O1xyXG4gICAgICB2YXIgeDMgPSB4MCAtIGkzICsgMy4wICogRzQ7IC8vIE9mZnNldHMgZm9yIGZvdXJ0aCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xyXG4gICAgICB2YXIgeTMgPSB5MCAtIGozICsgMy4wICogRzQ7XHJcbiAgICAgIHZhciB6MyA9IHowIC0gazMgKyAzLjAgKiBHNDtcclxuICAgICAgdmFyIHczID0gdzAgLSBsMyArIDMuMCAqIEc0O1xyXG4gICAgICB2YXIgeDQgPSB4MCAtIDEuMCArIDQuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXHJcbiAgICAgIHZhciB5NCA9IHkwIC0gMS4wICsgNC4wICogRzQ7XHJcbiAgICAgIHZhciB6NCA9IHowIC0gMS4wICsgNC4wICogRzQ7XHJcbiAgICAgIHZhciB3NCA9IHcwIC0gMS4wICsgNC4wICogRzQ7XHJcbiAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgZml2ZSBzaW1wbGV4IGNvcm5lcnNcclxuICAgICAgdmFyIGlpID0gaSAmIDI1NTtcclxuICAgICAgdmFyIGpqID0gaiAmIDI1NTtcclxuICAgICAgdmFyIGtrID0gayAmIDI1NTtcclxuICAgICAgdmFyIGxsID0gbCAmIDI1NTtcclxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgZml2ZSBjb3JuZXJzXHJcbiAgICAgIHZhciB0MCA9IDAuNiAtIHgwICogeDAgLSB5MCAqIHkwIC0gejAgKiB6MCAtIHcwICogdzA7XHJcbiAgICAgIGlmICh0MCA8IDApIG4wID0gMC4wO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZ2kwID0gKHBlcm1baWkgKyBwZXJtW2pqICsgcGVybVtrayArIHBlcm1bbGxdXV1dICUgMzIpICogNDtcclxuICAgICAgICB0MCAqPSB0MDtcclxuICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDRbZ2kwXSAqIHgwICsgZ3JhZDRbZ2kwICsgMV0gKiB5MCArIGdyYWQ0W2dpMCArIDJdICogejAgKyBncmFkNFtnaTAgKyAzXSAqIHcwKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDEgPSAwLjYgLSB4MSAqIHgxIC0geTEgKiB5MSAtIHoxICogejEgLSB3MSAqIHcxO1xyXG4gICAgICBpZiAodDEgPCAwKSBuMSA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMSA9IChwZXJtW2lpICsgaTEgKyBwZXJtW2pqICsgajEgKyBwZXJtW2trICsgazEgKyBwZXJtW2xsICsgbDFdXV1dICUgMzIpICogNDtcclxuICAgICAgICB0MSAqPSB0MTtcclxuICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDRbZ2kxXSAqIHgxICsgZ3JhZDRbZ2kxICsgMV0gKiB5MSArIGdyYWQ0W2dpMSArIDJdICogejEgKyBncmFkNFtnaTEgKyAzXSAqIHcxKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDIgPSAwLjYgLSB4MiAqIHgyIC0geTIgKiB5MiAtIHoyICogejIgLSB3MiAqIHcyO1xyXG4gICAgICBpZiAodDIgPCAwKSBuMiA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMiA9IChwZXJtW2lpICsgaTIgKyBwZXJtW2pqICsgajIgKyBwZXJtW2trICsgazIgKyBwZXJtW2xsICsgbDJdXV1dICUgMzIpICogNDtcclxuICAgICAgICB0MiAqPSB0MjtcclxuICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDRbZ2kyXSAqIHgyICsgZ3JhZDRbZ2kyICsgMV0gKiB5MiArIGdyYWQ0W2dpMiArIDJdICogejIgKyBncmFkNFtnaTIgKyAzXSAqIHcyKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDMgPSAwLjYgLSB4MyAqIHgzIC0geTMgKiB5MyAtIHozICogejMgLSB3MyAqIHczO1xyXG4gICAgICBpZiAodDMgPCAwKSBuMyA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMyA9IChwZXJtW2lpICsgaTMgKyBwZXJtW2pqICsgajMgKyBwZXJtW2trICsgazMgKyBwZXJtW2xsICsgbDNdXV1dICUgMzIpICogNDtcclxuICAgICAgICB0MyAqPSB0MztcclxuICAgICAgICBuMyA9IHQzICogdDMgKiAoZ3JhZDRbZ2kzXSAqIHgzICsgZ3JhZDRbZ2kzICsgMV0gKiB5MyArIGdyYWQ0W2dpMyArIDJdICogejMgKyBncmFkNFtnaTMgKyAzXSAqIHczKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDQgPSAwLjYgLSB4NCAqIHg0IC0geTQgKiB5NCAtIHo0ICogejQgLSB3NCAqIHc0O1xyXG4gICAgICBpZiAodDQgPCAwKSBuNCA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpNCA9IChwZXJtW2lpICsgMSArIHBlcm1bamogKyAxICsgcGVybVtrayArIDEgKyBwZXJtW2xsICsgMV1dXV0gJSAzMikgKiA0O1xyXG4gICAgICAgIHQ0ICo9IHQ0O1xyXG4gICAgICAgIG40ID0gdDQgKiB0NCAqIChncmFkNFtnaTRdICogeDQgKyBncmFkNFtnaTQgKyAxXSAqIHk0ICsgZ3JhZDRbZ2k0ICsgMl0gKiB6NCArIGdyYWQ0W2dpNCArIDNdICogdzQpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFN1bSB1cCBhbmQgc2NhbGUgdGhlIHJlc3VsdCB0byBjb3ZlciB0aGUgcmFuZ2UgWy0xLDFdXHJcbiAgICAgIHJldHVybiAyNy4wICogKG4wICsgbjEgKyBuMiArIG4zICsgbjQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIGJ1aWxkUGVybXV0YXRpb25UYWJsZShyYW5kb20pIHtcclxuICAgIHZhciBpO1xyXG4gICAgdmFyIHAgPSBuZXcgVWludDhBcnJheSgyNTYpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IDI1NjsgaSsrKSB7XHJcbiAgICAgIHBbaV0gPSBpO1xyXG4gICAgfVxyXG4gICAgZm9yIChpID0gMDsgaSA8IDI1NTsgaSsrKSB7XHJcbiAgICAgIHZhciByID0gaSArIH5+KHJhbmRvbSgpICogKDI1NiAtIGkpKTtcclxuICAgICAgdmFyIGF1eCA9IHBbaV07XHJcbiAgICAgIHBbaV0gPSBwW3JdO1xyXG4gICAgICBwW3JdID0gYXV4O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHA7XHJcbiAgfVxyXG4gIFNpbXBsZXhOb2lzZS5fYnVpbGRQZXJtdXRhdGlvblRhYmxlID0gYnVpbGRQZXJtdXRhdGlvblRhYmxlO1xyXG5cclxuICAvKlxyXG4gIFRoZSBBTEVBIFBSTkcgYW5kIG1hc2hlciBjb2RlIHVzZWQgYnkgc2ltcGxleC1ub2lzZS5qc1xyXG4gIGlzIGJhc2VkIG9uIGNvZGUgYnkgSm9oYW5uZXMgQmFhZ8O4ZSwgbW9kaWZpZWQgYnkgSm9uYXMgV2FnbmVyLlxyXG4gIFNlZSBhbGVhLm1kIGZvciB0aGUgZnVsbCBsaWNlbnNlLlxyXG4gICovXHJcbiAgZnVuY3Rpb24gYWxlYSgpIHtcclxuICAgIHZhciBzMCA9IDA7XHJcbiAgICB2YXIgczEgPSAwO1xyXG4gICAgdmFyIHMyID0gMDtcclxuICAgIHZhciBjID0gMTtcclxuXHJcbiAgICB2YXIgbWFzaCA9IG1hc2hlcigpO1xyXG4gICAgczAgPSBtYXNoKCcgJyk7XHJcbiAgICBzMSA9IG1hc2goJyAnKTtcclxuICAgIHMyID0gbWFzaCgnICcpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHMwIC09IG1hc2goYXJndW1lbnRzW2ldKTtcclxuICAgICAgaWYgKHMwIDwgMCkge1xyXG4gICAgICAgIHMwICs9IDE7XHJcbiAgICAgIH1cclxuICAgICAgczEgLT0gbWFzaChhcmd1bWVudHNbaV0pO1xyXG4gICAgICBpZiAoczEgPCAwKSB7XHJcbiAgICAgICAgczEgKz0gMTtcclxuICAgICAgfVxyXG4gICAgICBzMiAtPSBtYXNoKGFyZ3VtZW50c1tpXSk7XHJcbiAgICAgIGlmIChzMiA8IDApIHtcclxuICAgICAgICBzMiArPSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBtYXNoID0gbnVsbDtcclxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHQgPSAyMDkxNjM5ICogczAgKyBjICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcclxuICAgICAgczAgPSBzMTtcclxuICAgICAgczEgPSBzMjtcclxuICAgICAgcmV0dXJuIHMyID0gdCAtIChjID0gdCB8IDApO1xyXG4gICAgfTtcclxuICB9XHJcbiAgZnVuY3Rpb24gbWFzaGVyKCkge1xyXG4gICAgdmFyIG4gPSAweGVmYzgyNDlkO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbiArPSBkYXRhLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgdmFyIGggPSAwLjAyNTE5NjAzMjgyNDE2OTM4ICogbjtcclxuICAgICAgICBuID0gaCA+Pj4gMDtcclxuICAgICAgICBoIC09IG47XHJcbiAgICAgICAgaCAqPSBuO1xyXG4gICAgICAgIG4gPSBoID4+PiAwO1xyXG4gICAgICAgIGggLT0gbjtcclxuICAgICAgICBuICs9IGggKiAweDEwMDAwMDAwMDsgLy8gMl4zMlxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAobiA+Pj4gMCkgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIGFtZFxyXG4gIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIFNpbXBsZXhOb2lzZTt9KTtcclxuICAvLyBjb21tb24ganNcclxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSBleHBvcnRzLlNpbXBsZXhOb2lzZSA9IFNpbXBsZXhOb2lzZTtcclxuICAvLyBicm93c2VyXHJcbiAgZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHdpbmRvdy5TaW1wbGV4Tm9pc2UgPSBTaW1wbGV4Tm9pc2U7XHJcbiAgLy8gbm9kZWpzXHJcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNpbXBsZXhOb2lzZTtcclxuICB9XHJcblxyXG59KSgpO1xyXG4iLCJyZXF1aXJlKCcuLi90eXBlRGVmcycpO1xyXG5cclxuLyoqXHJcbiogY2FjaGVkIHZhbHVlc1xyXG4qL1xyXG5jb25zdCBwaUJ5SGFsZiA9IE1hdGguUGkgLyAxODA7XHJcbmNvbnN0IGhhbGZCeVBpID0gMTgwIC8gTWF0aC5QSTtcclxuXHJcbi8qKlxyXG4qIHByb3ZpZGVzIHRyaWdvbm9taWMgdXRpbGl0eSBtZXRob2RzIGFuZCBoZWxwZXJzLlxyXG4qIEBtb2R1bGVcclxuKi9cclxubGV0IHRyaWdvbm9taWNVdGlscyA9IHtcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBhbmdsZVxyXG5cdCAqIEBkZXNjcmlwdGlvbiBjYWxjdWxhdGUgYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHRvIHZlY3RvciBwb2ludHMuXHJcblx0ICogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuXHQgKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgYW5nbGUgaW4gcmFkaWFucy5cclxuXHQgKi9cclxuXHRhbmdsZTogZnVuY3Rpb24ob3JpZ2luWCwgb3JpZ2luWSwgdGFyZ2V0WCwgdGFyZ2V0WSkge1xyXG4gICAgICAgIHZhciBkeCA9IG9yaWdpblggLSB0YXJnZXRYO1xyXG4gICAgICAgIHZhciBkeSA9IG9yaWdpblkgLSB0YXJnZXRZO1xyXG4gICAgICAgIHZhciB0aGV0YSA9IE1hdGguYXRhbjIoLWR5LCAtZHgpO1xyXG4gICAgICAgIHJldHVybiB0aGV0YTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0UmFkaWFuQW5nbGVCZXR3ZWVuMlZlY3RvcnM6IGZ1bmN0aW9uKCB4MSwgeTEsIHgyLCB5MiApIHtcclxuICAgIFx0cmV0dXJuIE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSk7XHJcbiAgICB9LFxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZGlzdFxyXG5cdCogQGRlc2NyaXB0aW9uIGNhbGN1bGF0ZSBkaXN0YW5jZSBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgxIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkxIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkyIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG5cdCogQHJldHVybnMge251bWJlcn0gdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIDIgcG9pbnRzLlxyXG5cdCovXHJcblx0ZGlzdDogZnVuY3Rpb24gZGlzdCh4MSwgeTEsIHgyLCB5Mikge1xyXG5cdFx0eDIgLT0geDE7eTIgLT0geTE7XHJcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KHgyICogeDIgKyB5MiAqIHkyKTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQqIEBuYW1lIGRlZ3JlZXNUb1JhZGlhbnNcclxuXHQqIEBkZXNjcmlwdGlvbiBjb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFucy5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWVzIC0gdGhlIGRlZ3JlZSB2YWx1ZSB0byBjb252ZXJ0LlxyXG5cdCogQHJldHVybnMge251bWJlcn0gcmVzdWx0IGFzIHJhZGlhbnMuXHJcblx0Ki9cclxuXHRkZWdyZWVzVG9SYWRpYW5zOiBmdW5jdGlvbihkZWdyZWVzKSB7XHJcblx0XHRyZXR1cm4gZGVncmVlcyAqIHBpQnlIYWxmO1xyXG5cdH0sXHJcblxyXG5cdGQyUjogdGhpcy5kZWdyZWVzVG9SYWRpYW5zLFxyXG5cdC8qKlxyXG5cdCogQG5hbWUgcmFkaWFuc1RvRGVncmVlc1xyXG5cdCogQGRlc2NyaXB0aW9uIGNvbnZlcnQgcmFkaWFucyB0byBkZWdyZWVzLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSB0aGUgZGVncmVlIHZhbHVlIHRvIGNvbnZlcnQuXHJcblx0KiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQgYXMgZGVncmVlcy5cclxuXHQqL1xyXG5cdHJhZGlhbnNUb0RlZ3JlZXM6IGZ1bmN0aW9uKHJhZGlhbnMpIHtcclxuXHRcdHJldHVybiByYWRpYW5zICogaGFsZkJ5UGk7XHJcblx0fSxcclxuXHJcblx0cjJEOiB0aGlzLnJhZGlhbnNUb0RlZ3JlZXMsXHJcblx0LyoqXHJcblx0KiBAbmFtZSBnZXRBbmdsZUFuZERpc3RhbmNlXHJcbiBcdCogQGRlc2NyaXB0aW9uIGNhbGN1bGF0ZSB0cmlnb21vbWljIHZhbHVlcyBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG4gXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4MiAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuXHQqIEByZXR1cm5zIHt2ZWN0b3JDYWxjdWxhdGlvbn0gdGhlIGNhbGN1bGF0ZWQgYW5nbGUgYW5kIGRpc3RhbmNlIGJldHdlZW4gdmVjdG9yc1xyXG5cdCovXHJcblx0Z2V0QW5nbGVBbmREaXN0YW5jZTogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIpIHtcclxuXHJcblx0XHQvLyBzZXQgdXAgYmFzZSB2YWx1ZXNcclxuXHRcdHZhciBkWCA9IHgyIC0geDE7XHJcblx0XHR2YXIgZFkgPSB5MiAtIHkxO1xyXG5cdFx0Ly8gZ2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwb2ludHNcclxuXHRcdHZhciBkID0gTWF0aC5zcXJ0KGRYICogZFggKyBkWSAqIGRZKTtcclxuXHRcdC8vIGFuZ2xlIGluIHJhZGlhbnNcclxuXHRcdC8vIHZhciByYWRpYW5zID0gTWF0aC5hdGFuMih5RGlzdCwgeERpc3QpICogMTgwIC8gTWF0aC5QSTtcclxuXHRcdC8vIGFuZ2xlIGluIHJhZGlhbnNcclxuXHRcdHZhciByID0gTWF0aC5hdGFuMihkWSwgZFgpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZGlzdGFuY2U6IGQsXHJcblx0XHRcdGFuZ2xlOiByXHJcblx0XHR9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZ2V0QWRqYWNlbnRMZW5ndGhcclxuXHQqIEBkZXNjcmlwdGlvbiBnZXQgbGVuZ3RoIG9mIHRoZSBBZGphY2VudCBzaWRlIG9mIGEgcmlnaHQtYW5nbGVkIHRyaWFuZ2xlLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSB0aGUgYW5nbGUgb3IgdGhlIHRyaWFuZ2xlLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGh5cG90b251c2UgLSB0aGUgbGVuZ3RoIG9mIHRoZSBoeXBvdGVudXNlLlxyXG5cdCogQHJldHVybnMge251bWJlcn0gcmVzdWx0IC0gdGhlIGxlbmd0aCBvZiB0aGUgQWRqYWNlbnQgc2lkZS5cclxuXHQqL1xyXG5cdGdldEFkamFjZW50TGVuZ3RoOiBmdW5jdGlvbiBnZXRBZGphY2VudExlbmd0aChyYWRpYW5zLCBoeXBvdG9udXNlKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5jb3MocmFkaWFucykgKiBoeXBvdG9udXNlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZ2V0T3Bwb3NpdGVMZW5ndGhcclxuXHQqIEBkZXNjcmlwdGlvbiBnZXQgbGVuZ3RoIG9mIHRoZSBPcHBvc2l0ZSBzaWRlIG9mIGEgcmlnaHQtYW5nbGVkIHRyaWFuZ2xlLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSB0aGUgYW5nbGUgb3IgdGhlIHRyaWFuZ2xlLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGh5cG90b251c2UgLSB0aGUgbGVuZ3RoIG9mIHRoZSBoeXBvdGVudXNlLlxyXG5cdCogQHJldHVybnMge251bWJlcn0gcmVzdWx0IC0gdGhlIGxlbmd0aCBvZiB0aGUgT3Bwb3NpdGUgc2lkZS5cclxuXHQqL1xyXG5cdGdldE9wcG9zaXRlTGVuZ3RoOiBmdW5jdGlvbihyYWRpYW5zLCBoeXBvdG9udXNlKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5zaW4ocmFkaWFucykgKiBoeXBvdG9udXNlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgY2FsY3VsYXRlVmVsb2NpdGllc1xyXG5cdCogQGRlc2NyaXB0aW9uIGdpdmVuIGFuIG9yaWdpbiAoeC95KSwgYW5nbGUgYW5kIGltcHVsc2UgKGFic29sdXRlIHZlbG9jaXR5KSBjYWxjdWxhdGUgcmVsYXRpdmUgeC95IHZlbG9jaXRpZXMuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0geCAtIHRoZSBjb29yZGluYXRlIFggdmFsdWUgb2YgdGhlIG9yaWdpbi5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5IC0gdGhlIGNvb3JkaW5hdGUgWSB2YWx1ZSBvZiB0aGUgb3JpZ2luLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gdGhlIGFuZ2xlIGluIHJhZGlhbnMuXHJcblx0KiBAcGFyYW0ge251bWJlcn0gaW1wdWxzZSAtIHRoZSBkZWx0YSBjaGFuZ2UgdmFsdWUuXHJcblx0KiBAcmV0dXJucyB7VmVsb2NpdHlWZWN0b3J9IHJlc3VsdCAtIHJlbGF0aXZlIGRlbHRhIGNoYW5nZSB2ZWxvY2l0eSBmb3IgWC9ZLlxyXG5cdCovXHJcblx0Y2FsY3VsYXRlVmVsb2NpdGllczogZnVuY3Rpb24oeCwgeSwgYW5nbGUsIGltcHVsc2UpIHtcclxuXHRcdHZhciBhMiA9IE1hdGguYXRhbjIoTWF0aC5zaW4oYW5nbGUpICogaW1wdWxzZSArIHkgLSB5LCBNYXRoLmNvcyhhbmdsZSkgKiBpbXB1bHNlICsgeCAtIHgpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0eFZlbDogTWF0aC5jb3MoYTIpICogaW1wdWxzZSxcclxuXHRcdFx0eVZlbDogTWF0aC5zaW4oYTIpICogaW1wdWxzZVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgcmFkaWFsRGlzdHJpYnV0aW9uXHJcblx0KiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIG5ldyBQb2ludCB2ZWN0b3IgKHgveSkgYXQgdGhlIGdpdmVuIGRpc3RhbmNlIChyKSBmcm9tIHRoZSBvcmlnaW4gYXQgdGhlIGFuZ2xlIChhKSAuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0geCAtIHRoZSBjb29yZGluYXRlIFggdmFsdWUgb2YgdGhlIG9yaWdpbi5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5IC0gdGhlIGNvb3JkaW5hdGUgWSB2YWx1ZSBvZiB0aGUgb3JpZ2luLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGQgLSB0aGUgYWJzb2x1dGUgZGVsdGEgY2hhbmdlIHZhbHVlLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGEgLSB0aGUgYW5nbGUgaW4gcmFkaWFucy5cclxuXHQqIEByZXR1cm5zIHtQb2ludH0gLSB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIG5ldyBwb2ludC5cclxuXHQqL1xyXG5cdHJhZGlhbERpc3RyaWJ1dGlvbjogZnVuY3Rpb24oeCwgeSwgZCwgYSkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0eDogeCArIGQgKiBNYXRoLmNvcyhhKSxcclxuXHRcdFx0eTogeSArIGQgKiBNYXRoLnNpbihhKVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZmluZE5ld1BvaW50XHJcblx0KiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIG5ldyBQb2ludCB2ZWN0b3IgKHgveSkgYXQgdGhlIGdpdmVuIGRpc3RhbmNlIChyKSBmcm9tIHRoZSBvcmlnaW4gYXQgdGhlIGFuZ2xlIChhKSAuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0geCAtIHRoZSBjb29yZGluYXRlIFggdmFsdWUgb2YgdGhlIG9yaWdpbi5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5IC0gdGhlIGNvb3JkaW5hdGUgWSB2YWx1ZSBvZiB0aGUgb3JpZ2luLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gdGhlIGFuZ2xlIGluIHJhZGlhbnMuXHJcblx0KiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSB0aGUgYWJzb2x1dGUgZGVsdGEgY2hhbmdlIHZhbHVlLlxyXG5cdCogQHJldHVybnMge1BvaW50fSAtIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgbmV3IHBvaW50LlxyXG5cdCovXHJcblx0ZmluZE5ld1BvaW50OiBmdW5jdGlvbih4LCB5LCBhbmdsZSwgZGlzdGFuY2UpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHg6IE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlICsgeCxcclxuXHRcdFx0eTogTWF0aC5zaW4oYW5nbGUpICogZGlzdGFuY2UgKyB5XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBnZXRQb2ludE9uUGF0aFxyXG5cdCogQGRlc2NyaXB0aW9uIFJldHVybnMgYSBuZXcgUG9pbnQgdmVjdG9yICh4L3kpIGF0IHRoZSBnaXZlbiBkaXN0YW5jZSAoZGlzdGFuY2UpIGFsb25nIGEgcGF0aCBkZWZpbmVkIGJ5IHgxL3kxLCB4Mi95Mi5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIHRoZSBjb29yZGluYXRlIFggdmFsdWUgb2YgdGhlIHBhdGggc3RhcnQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geTEgLSB0aGUgY29vcmRpbmF0ZSBZIHZhbHVlIG9mIHRoZSBwYXRoIHN0YXJ0LlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgyIC0gdGhlIGNvb3JkaW5hdGUgWCB2YWx1ZSBvZiB0aGUgcGF0aCBlbmQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geTIgLSB0aGUgY29vcmRpbmF0ZSBZIHZhbHVlIG9mIHRoZSBwYXRoIGVuZC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMSB3aGVyZSAwIGlzIHRoZSBwYXRoIHN0YXJ0LCAxIGlzIHRoZSBwYXRoIGVuZCwgYW5kIDAuNSBpcyB0aGUgcGF0aCBtaWRwb2ludC5cclxuXHQqL1xyXG5cdGdldFBvaW50T25QYXRoOiBmdW5jdGlvbiggeDEsIHkxLCB4MiwgeTIsIGRpc3RhbmNlICkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0eDogeDEgKyAoIHgyIC0geDEgKSAqIGRpc3RhbmNlLFxyXG5cdFx0XHR5OiB5MSArICggeTIgLSB5MSApICogZGlzdGFuY2VcclxuXHRcdH1cclxuXHR9LFxyXG5cdC8qKlxyXG5cdCogQG5hbWUgY29tcHV0ZU5vcm1hbHNcclxuXHQqIEBkZXNjcmlwdGlvbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjQzNjE0L2hvdy1kby1pLWNhbGN1bGF0ZS10aGUtbm9ybWFsLXZlY3Rvci1vZi1hLWxpbmUtc2VnbWVudFxyXG5cdCogaWYgd2UgZGVmaW5lIGR4PXgyLXgxIGFuZCBkeT15Mi15MVxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgxIC0gdGhlIGNvb3JkaW5hdGUgWCB2YWx1ZSBvZiB0aGUgcGF0aCBzdGFydC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIHRoZSBjb29yZGluYXRlIFkgdmFsdWUgb2YgdGhlIHBhdGggc3RhcnQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geDIgLSB0aGUgY29vcmRpbmF0ZSBYIHZhbHVlIG9mIHRoZSBwYXRoIGVuZC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIHRoZSBjb29yZGluYXRlIFkgdmFsdWUgb2YgdGhlIHBhdGggZW5kLlxyXG5cdCogQHJldHVybnMge29iamVjdH0gLSBUaGUgMiBub3JtYWwgdmVjdG9ycyBmcm9tIHRoZSBkZWZpbmVkIHBhdGggYXMgcG9pbnRzXHJcblx0Ki9cclxuXHRjb21wdXRlTm9ybWFsczogZnVuY3Rpb24oIHgxLCB5MSwgeDIsIHkyICkge1xyXG5cdFx0bGV0IGR4ID0geDIgLSB4MTtcclxuXHRcdGxldCBkeSA9IHkyIC0geTE7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuMTogeyB4OiAtZHksIHk6IGR4IH0sXHJcblx0XHRcdG4yOiB7IHg6IGR5LCB5OiAtZHggfSxcclxuXHRcdH1cclxuXHR9LFxyXG5cdC8qKlxyXG5cdCogQG5hbWUgc3ViZGl2aWRlXHJcblx0KiBAZGVzY3JpcHRpb24gc3ViZGl2aWRlcyBhIHZlY3RvciBwYXRoICh4MSwgeTEsIHgyLCB5MikgcHJvcG9ydGlvbmF0ZSB0byB0aGUgYmlhc1xyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgxIC0gdGhlIGNvb3JkaW5hdGUgWCB2YWx1ZSBvZiB0aGUgcGF0aCBzdGFydC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIHRoZSBjb29yZGluYXRlIFkgdmFsdWUgb2YgdGhlIHBhdGggc3RhcnQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geDIgLSB0aGUgY29vcmRpbmF0ZSBYIHZhbHVlIG9mIHRoZSBwYXRoIGVuZC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIHRoZSBjb29yZGluYXRlIFkgdmFsdWUgb2YgdGhlIHBhdGggZW5kLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGJpYXMgLSBvZmZzZXQgb2YgdGhlIHN1YmRpdmlzaW9uIGJldHdlZW4gdGhlIHNiZGl2aXNpb246IGkuZS4gMCAtIHRoZSBzdGFydCB2ZWN0b3IsIDAuNSAtIG1pZHBvaW50IGJldHdlZW4gdGhlIDIgdmVjdG9ycywgMSAtIHRoZSBlbmQgdmVjdG9yLlxyXG5cdCogQHJldHVybnMge3BvaW50fSAtIFRoZSBjb29yZGluYXRlcyBvZiB0aGUgc3ViZGl2aXNpb24gcG9pbnRcclxuXHQqL1xyXG5cdHN1YmRpdmlkZTogZnVuY3Rpb24oIHgxLCB5MSwgeDIsIHkyLCBiaWFzICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UG9pbnRPblBhdGgoIHgxLCB5MSwgeDIsIHkyLCBiaWFzICk7XHJcblx0fSxcclxuXHJcblx0Ly8gQ3VydmUgZnVjdGlvbnNcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBnZXRQb2ludEF0XHJcblx0KiBAZGVzY3JpcHRpb24gZ2l2ZW4gMyB2ZWN0b3Ige3BvaW50fXMgb2YgYSBxdWFkcmF0aWMgY3VydmUsIHJldHVybiB0aGUgcG9pbnQgb24gdGhlIGN1cnZlIGF0IHRcclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7cG9pbnR9IHAxIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3Mgc3RhcnQgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwYyAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGNvbnRyb2wgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwMiAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGVuZCBwb2ludC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBiaWFzIC0gdGhlIHBvaW50IGFsb25nIHRoZSBjdXJ2ZSdzIHBhdGggYXMgYSByYXRpbyAoMC0xKS5cclxuXHQqIEByZXR1cm5zIHtwb2ludH0gLSB7eCx5fSBvZiB0aGUgcG9pbnQgb24gdGhlIGN1cnZlIGF0IHtiaWFzfVxyXG5cdCovXHJcblx0Z2V0UG9pbnRBdDogZnVuY3Rpb24oIHAxLCBwYywgcDIsIGJpYXMgKSB7XHJcblx0ICAgIGNvbnN0IHggPSAoMSAtIGJpYXMpICogKDEgLSBiaWFzKSAqIHAxLnggKyAyICogKDEgLSBiaWFzKSAqIGJpYXMgKiBwYy54ICsgYmlhcyAqIGJpYXMgKiBwMi54XHJcblx0ICAgIGNvbnN0IHkgPSAoMSAtIGJpYXMpICogKDEgLSBiaWFzKSAqIHAxLnkgKyAyICogKDEgLSBiaWFzKSAqIGJpYXMgKiBwYy55ICsgYmlhcyAqIGJpYXMgKiBwMi55XHJcblx0ICAgIHJldHVybiB7IHgsIHkgfTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQqIEBuYW1lIGdldERlcml2YXRpdmVBdFxyXG5cdCogQGRlc2NyaXB0aW9uIEdpdmVuIDMgdmVjdG9yIHtwb2ludH1zIG9mIGEgcXVhZHJhdGljIGN1cnZlLCByZXR1cm5zIHRoZSBkZXJpdmF0aXZlICh0YW5nZXQpIG9mIHRoZSBjdXJ2ZSBhdCBwb2ludCBvZiBiaWFzLlxyXG5cdChUaGUgZGVyaXZhdGl2ZSBtZWFzdXJlcyB0aGUgc3RlZXBuZXNzIG9mIHRoZSBjdXJ2ZSBvZiBhIGZ1bmN0aW9uIGF0IHNvbWUgcGFydGljdWxhciBwb2ludCBvbiB0aGUgY3VydmUgKHNsb3BlIG9yIHJhdGlvIG9mIGNoYW5nZSBpbiB0aGUgdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGNoYW5nZSBpbiB0aGUgaW5kZXBlbmRlbnQgdmFyaWFibGUpLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtwb2ludH0gcDEgLSB7eCx5fSBvZiB0aGUgY3VydmUncyBzdGFydCBwb2ludC5cclxuXHQqIEBwYXJhbSB7cG9pbnR9IHBjIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgY29udHJvbCBwb2ludC5cclxuXHQqIEBwYXJhbSB7cG9pbnR9IHAyIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgZW5kIHBvaW50LlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGJpYXMgLSB0aGUgcG9pbnQgYWxvbmcgdGhlIGN1cnZlJ3MgcGF0aCBhcyBhIHJhdGlvICgwLTEpLlxyXG5cdCogQHJldHVybnMge3BvaW50fSAtIHt4LHl9IG9mIHRoZSBwb2ludCBvbiB0aGUgY3VydmUgYXQge2JpYXN9XHJcblx0Ki9cclxuXHRnZXREZXJpdmF0aXZlQXQ6IGZ1bmN0aW9uKHAxLCBwYywgcDIsIGJpYXMpIHtcclxuXHQgICAgY29uc3QgZDEgPSB7IHg6IDIgKiAocGMueCAtIHAxLngpLCB5OiAyICogKHBjLnkgLSBwMS55KSB9O1xyXG5cdCAgICBjb25zdCBkMiA9IHsgeDogMiAqIChwMi54IC0gcGMueCksIHk6IDIgKiAocDIueSAtIHBjLnkpIH07XHJcblx0ICAgIGNvbnN0IHggPSAoMSAtIGJpYXMpICogZDEueCArIGJpYXMgKiBkMi54O1xyXG5cdCAgICBjb25zdCB5ID0gKDEgLSBiaWFzKSAqIGQxLnkgKyBiaWFzICogZDIueTtcclxuXHQgICAgcmV0dXJuIHsgeCwgeSB9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZ2V0Tm9ybWFsQXRcclxuXHQqIEBkZXNjcmlwdGlvbiBnaXZlbiAzIHZlY3RvciB7cG9pbnR9cyBvZiBhIHF1YWRyYXRpYyBjdXJ2ZSByZXR1cm5zIHRoZSBub3JtYWwgdmVjdG9yIG9mIHRoZSBjdXJ2ZSBhdCB0aGUgcmF0aW8gcG9pbnQgYWxvbmcgdGhlIGN1cnZlIHtiaWFzfS5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7cG9pbnR9IHAxIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3Mgc3RhcnQgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwYyAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGNvbnRyb2wgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwMiAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGVuZCBwb2ludC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBiaWFzIC0gdGhlIHBvaW50IGFsb25nIHRoZSBjdXJ2ZSdzIHBhdGggYXMgYSByYXRpbyAoMC0xKS5cclxuXHQqIEByZXR1cm5zIHtwb2ludH0gLSB7eCx5fSBvZiB0aGUgcG9pbnQgb24gdGhlIGN1cnZlIGF0IHtiaWFzfVxyXG5cdCovXHJcblx0Z2V0Tm9ybWFsQXQ6IGZ1bmN0aW9uKHAxLCBwYywgcDIsIGJpYXMpIHtcclxuXHQgICAgY29uc3QgZCA9IHRoaXMuZ2V0RGVyaXZhdGl2ZUF0KCBwMSwgcGMsIHAyLCBiaWFzICk7XHJcblx0ICAgIGNvbnN0IHEgPSBNYXRoLnNxcnQoZC54ICogZC54ICsgZC55ICogZC55KTtcclxuXHQgICAgY29uc3QgeCA9IC1kLnkgLyBxO1xyXG5cdCAgICBjb25zdCB5ID0gZC54IC8gcTtcclxuXHQgICAgcmV0dXJuIHsgeCwgeSB9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgcHJvamVjdE5vcm1hbEF0RGlzdGFuY2VcclxuXHQqIEBkZXNjcmlwdGlvbiBnaXZlbiAzIHZlY3RvciB7cG9pbnR9cyBvZiBhIHF1YWRyYXRpYyBjdXJ2ZSByZXR1cm5zIHRoZSBub3JtYWwgdmVjdG9yIG9mIHRoZSBjdXJ2ZSBhdCB0aGUgcmF0aW8gcG9pbnQgYWxvbmcgdGhlIGN1cnZlIHtiaWFzfSBhdCB0aGUgcmVxdWlyZWQge2Rpc3RhbmNlfS5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7cG9pbnR9IHAxIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3Mgc3RhcnQgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwYyAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGNvbnRyb2wgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwMiAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGVuZCBwb2ludC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBiaWFzIC0gdGhlIHBvaW50IGFsb25nIHRoZSBjdXJ2ZSdzIHBhdGggYXMgYSByYXRpbyAoMC0xKS5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIHRoZSBkaXN0YW5jZSB0byBwcm9qZWN0IHRoZSBub3JtYWwuXHJcblx0KiBAcmV0dXJucyB7cG9pbnR9IC0ge3gseX0gb2YgdGhlIHBvaW50IHByb2plY3RlZCBmcm9tIHRoZSBub3JtYWwgb24gdGhlIGN1cnZlIGF0IHtiaWFzfVxyXG5cdCovXHJcblx0cHJvamVjdE5vcm1hbEF0RGlzdGFuY2U6IGZ1bmN0aW9uKHAxLCBwYywgcDIsIGJpYXMsIGRpc3RhbmNlKSB7XHJcblx0XHRjb25zdCBwID0gdGhpcy5nZXRQb2ludEF0KHAxLCBwYywgcDIsIGJpYXMpO1xyXG4gICAgICBcdGNvbnN0IG4gPSB0aGlzLmdldE5vcm1hbEF0KHAxLCBwYywgcDIsIGJpYXMpO1xyXG4gICAgICBcdGNvbnN0IHggPSBwLnggKyBuLnggKiBkaXN0YW5jZTtcclxuICAgICAgXHRjb25zdCB5ID0gcC55ICsgbi55ICogZGlzdGFuY2U7XHJcbiAgICAgIFx0cmV0dXJuIHsgeCwgeSB9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZ2V0QW5nbGVPZk5vcm1hbFxyXG5cdCogQGRlc2NyaXB0aW9uIGdpdmVuIDMgdmVjdG9yIHtwb2ludH1zIG9mIGEgcXVhZHJhdGljIGN1cnZlIHJldHVybnMgdGhlIGFuZ2xlIG9mIHRoZSBub3JtYWwgdmVjdG9yIG9mIHRoZSBjdXJ2ZSBhdCB0aGUgcmF0aW8gcG9pbnQgYWxvbmcgdGhlIGN1cnZlIHtiaWFzfS5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7cG9pbnR9IHAxIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3Mgc3RhcnQgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwYyAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGNvbnRyb2wgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwMiAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGVuZCBwb2ludC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBiaWFzIC0gdGhlIHBvaW50IGFsb25nIHRoZSBjdXJ2ZSdzIHBhdGggYXMgYSByYXRpbyAoMC0xKS5cclxuXHQqIEByZXR1cm5zIHtudW1iZXJ9IC0gdGhlIGFuZ2xlIG9mIHRoZSBub3JtYWwgb2YgdGhlIGN1cnZlIGF0IHtiaWFzfVxyXG5cdCovXHJcblx0Z2V0QW5nbGVPZk5vcm1hbDogZnVuY3Rpb24oIHAxLCBwYywgcDIsIGJpYXMgKSB7XHJcblx0XHRjb25zdCBwID0gdGhpcy5nZXRQb2ludEF0KHAxLCBwYywgcDIsIGJpYXMpO1xyXG4gICAgICBcdGNvbnN0IG4gPSB0aGlzLmdldE5vcm1hbEF0KHAxLCBwYywgcDIsIGJpYXMpO1xyXG4gICAgICBcdHJldHVybiB0aGlzLmdldFJhZGlhbkFuZ2xlQmV0d2VlbjJWZWN0b3JzKCBwLngsIHAueSwgbi54LCBuLnkgKTtcclxuXHR9XHJcblxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnRyaWdvbm9taWNVdGlscyA9IHRyaWdvbm9taWNVdGlsczsiXX0=
