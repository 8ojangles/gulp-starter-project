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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY2hlY2tDYW52YXNTdXBwb3J0LmpzIiwic3JjL2pzL2xpZ2h0bmluZ1Rlc3QuanMiLCJzcmMvanMvbGlnaHRuaW5nVGVzdEluY2x1ZGUuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvY2xlYXJNZW1iZXJBcnJheS5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9jcmVhdGVCbHVyQXJyYXkuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvY3JlYXRlTGlnaHRuaW5nLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2NyZWF0aW9uQ29uZmlnLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2RyYXdEZWJ1Z0xpbmVzLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2RyYXdEZWJ1Z1JhZGlhbFRlc3QuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvZ2xvYmFsQ29uZmlnLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2xNZ3JDbG9jay5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9saWdodG5pbmdNYW5hZ2VyVXRpbGl0aWVzLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2xpZ2h0bmluZ1V0aWxpdGllcy5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9yZW5kZXJDb25maWcuanMiLCJzcmMvanMvbGlnaHRuaW5nL2xpZ2h0bmluZ01hbmFnZXIvc2V0Q2FudmFzRGV0YWlscy5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9zZXRHbG9iYWxJbnRlcnZhbC5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci9zZXRMb2NhbENsb2NrVGFyZ2V0LmpzIiwic3JjL2pzL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL3VwZGF0ZUFyci5qcyIsInNyYy9qcy9saWdodG5pbmcvbGlnaHRuaW5nTWFuYWdlci91cGRhdGVSZW5kZXJDZmcuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvY2FsY3VsYXRlU3ViRFJhdGUuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvY3JlYXRlUGF0aENvbmZpZy5qcyIsInNyYy9qcy9saWdodG5pbmcvcGF0aC9jcmVhdGVQYXRoRnJvbU9wdGlvbnMuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvZHJhd1BhdGguanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvcGxvdFBhdGhQb2ludHMuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvcmVkcmF3UGF0aHMuanMiLCJzcmMvanMvbGlnaHRuaW5nL3BhdGgvcmVuZGVyUGF0aC5qcyIsInNyYy9qcy9saWdodG5pbmcvcGF0aC91cGRhdGVQYXRoLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvY2hpbGRQYXRoQW5pbVNlcXVlbmNlLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvbWFpblBhdGhBbmltU2VxdWVuY2UuanMiLCJzcmMvanMvbGlnaHRuaW5nL3NlcXVlbmNlci9zZXF1ZW5jZUl0ZW1zL2FscGhhRmFkZU91dC5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3NlcXVlbmNlSXRlbXMvZmFkZVRvUmVkQW5kRmFkZU91dC5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3NlcXVlbmNlSXRlbXMvbGluZVdpZHRoVG8xMC5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3NldHVwU2VxdWVuY2VzLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvc3RhcnRTZXF1ZW5jZS5qcyIsInNyYy9qcy9saWdodG5pbmcvc2VxdWVuY2VyL3VwZGF0ZVNlcXVlbmNlLmpzIiwic3JjL2pzL2xpZ2h0bmluZy9zZXF1ZW5jZXIvdXBkYXRlU2VxdWVuY2VDbG9jay5qcyIsInNyYy9qcy90eXBlRGVmcy5qcyIsInNyYy9qcy91dGlscy9jYW52YXNBcGlBdWdtZW50YXRpb24uanMiLCJzcmMvanMvdXRpbHMvY2wuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nLmpzIiwic3JjL2pzL3V0aWxzL21hdGhVdGlscy5qcyIsInNyYy9qcy91dGlscy9yYWZQb2x5ZmlsbC5qcyIsInNyYy9qcy91dGlscy9zaW1wbGV4LW5vaXNlLW5ldy5qcyIsInNyYy9qcy91dGlscy90cmlnb25vbWljVXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7OztBQVFBLFNBQVMsa0JBQVQsQ0FBNkIsV0FBN0IsRUFBMkM7QUFDdkMsTUFBSSxHQUFHLEdBQUcsV0FBVyxJQUFJLElBQXpCO0FBQ0EsTUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBd0IsUUFBeEIsQ0FBWDtBQUNBLFNBQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFMLElBQW1CLElBQUksQ0FBQyxVQUFMLENBQWlCLEdBQWpCLENBQXJCLENBQVI7QUFDSDs7QUFFRCxNQUFNLENBQUMsT0FBUCxHQUFpQixrQkFBakI7OztBQ2RBLE9BQU8sQ0FBRSwyQkFBRixDQUFQOzs7QUNBQSxJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBRSx5QkFBRixDQUFoQzs7QUFDQSxPQUFPLENBQUUsd0JBQUYsQ0FBUDs7QUFDQSxPQUFPLENBQUUsa0NBQUYsQ0FBUDs7QUFFQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUUsbUJBQUYsQ0FBUCxDQUErQixlQUE1Qzs7QUFDQSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBcEI7O0FBRUEsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFFLDRCQUFGLENBQVAsQ0FBd0MsZUFBbkQ7O0FBQ0EsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQXZCO0FBQ0EsSUFBSSxLQUFLLEdBQUcs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LEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEI7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEI7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEI7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEIsQ0FwRDRCLENBcUQ1Qjs7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEI7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEI7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEI7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEIsQ0F6RDRCLENBMEQ1Qjs7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEI7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEI7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEI7QUFDQSxNQUFBLEVBQUUsR0FBRyxLQUFLLElBQUksQ0FBVCxHQUFhLENBQWIsR0FBaUIsQ0FBdEIsQ0E5RDRCLENBK0Q1Qjs7QUFDQSxVQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBTCxHQUFVLEVBQW5CLENBaEU0QixDQWdFTDs7QUFDdkIsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsR0FBVSxFQUFuQjtBQUNBLFVBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFMLEdBQVUsRUFBbkI7QUFDQSxVQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBTCxHQUFVLEVBQW5CO0FBQ0EsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsR0FBVSxNQUFNLEVBQXpCLENBcEU0QixDQW9FQzs7QUFDN0IsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsR0FBVSxNQUFNLEVBQXpCO0FBQ0EsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsR0FBVSxNQUFNLEVBQXpCO0FBQ0EsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsR0FBVSxNQUFNLEVBQXpCO0FBQ0EsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsR0FBVSxNQUFNLEVBQXpCLENBeEU0QixDQXdFQzs7QUFDN0IsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsR0FBVSxNQUFNLEVBQXpCO0FBQ0EsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsR0FBVSxNQUFNLEVBQXpCO0FBQ0EsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsR0FBVSxNQUFNLEVBQXpCO0FBQ0EsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUwsR0FBVyxNQUFNLEVBQTFCLENBNUU0QixDQTRFRTs7QUFDOUIsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUwsR0FBVyxNQUFNLEVBQTFCO0FBQ0EsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUwsR0FBVyxNQUFNLEVBQTFCO0FBQ0EsVUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUwsR0FBVyxNQUFNLEVBQTFCLENBL0U0QixDQWdGNUI7O0FBQ0EsVUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQWI7QUFDQSxVQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBYjtBQUNBLFVBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFiO0FBQ0EsVUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQWIsQ0FwRjRCLENBcUY1Qjs7QUFDQSxVQUFJLEVBQUUsR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFYLEdBQWdCLEVBQUUsR0FBRyxFQUFyQixHQUEwQixFQUFFLEdBQUcsRUFBL0IsR0FBb0MsRUFBRSxHQUFHLEVBQWxEO0FBQ0EsVUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZLEVBQUUsR0FBRyxHQUFMLENBQVosS0FDSztBQUNILFlBQUksR0FBRyxHQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFELENBQVYsQ0FBVixDQUFWLENBQUosR0FBNEMsRUFBN0MsR0FBbUQsQ0FBN0Q7QUFDQSxRQUFBLEVBQUUsSUFBSSxFQUFOO0FBQ0EsUUFBQSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsSUFBVyxLQUFLLENBQUMsR0FBRCxDQUFMLEdBQWEsRUFBYixHQUFrQixLQUFLLENBQUMsR0FBRyxHQUFHLENBQVAsQ0FBTCxHQUFpQixFQUFuQyxHQUF3QyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQVAsQ0FBTCxHQUFpQixFQUF6RCxHQUE4RCxLQUFLLENBQUMsR0FBRyxHQUFHLENBQVAsQ0FBTCxHQUFpQixFQUExRixDQUFMO0FBQ0Q7QUFDRCxVQUFJLEVBQUUsR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFYLEdBQWdCLEVBQUUsR0FBRyxFQUFyQixHQUEwQixFQUFFLEdBQUcsRUFBL0IsR0FBb0MsRUFBRSxHQUFHLEVBQWxEO0FBQ0EsVUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZLEVBQUUsR0FBRyxHQUFMLENBQVosS0FDSztBQUNILFlBQUksR0FBRyxHQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBTCxHQUFVLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBTCxHQUFVLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBTCxHQUFVLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBTixDQUFmLENBQWYsQ0FBZixDQUFKLEdBQWdFLEVBQWpFLEdBQXVFLENBQWpGO0FBQ0EsUUFBQSxFQUFFLElBQUksRUFBTjtBQUNBLFFBQUEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFMLElBQVcsS0FBSyxDQUFDLEdBQUQsQ0FBTCxHQUFhLEVBQWIsR0FBa0IsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQUwsR0FBaUIsRUFBbkMsR0FBd0MsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQUwsR0FBaUIsRUFBekQsR0FBOEQsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQUwsR0FBaUIsRUFBMUYsQ0FBTDtBQUNEO0FBQ0QsVUFBSSxFQUFFLEdBQUcsTUFBTSxFQUFFLEdBQUcsRUFBWCxHQUFnQixFQUFFLEdBQUcsRUFBckIsR0FBMEIsRUFBRSxHQUFHLEVBQS9CLEdBQW9DLEVBQUUsR0FBRyxFQUFsRDtBQUNBLFVBQUksRUFBRSxHQUFHLENBQVQsRUFBWSxFQUFFLEdBQUcsR0FBTCxDQUFaLEtBQ0s7QUFDSCxZQUFJLEdBQUcsR0FBSSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUwsR0FBVSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUwsR0FBVSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUwsR0FBVSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQU4sQ0FBZixDQUFmLENBQWYsQ0FBSixHQUFnRSxFQUFqRSxHQUF1RSxDQUFqRjtBQUNBLFFBQUEsRUFBRSxJQUFJLEVBQU47QUFDQSxRQUFBLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBTCxJQUFXLEtBQUssQ0FBQyxHQUFELENBQUwsR0FBYSxFQUFiLEdBQWtCLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBUCxDQUFMLEdBQWlCLEVBQW5DLEdBQXdDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBUCxDQUFMLEdBQWlCLEVBQXpELEdBQThELEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBUCxDQUFMLEdBQWlCLEVBQTFGLENBQUw7QUFDRDtBQUNELFVBQUksRUFBRSxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQVgsR0FBZ0IsRUFBRSxHQUFHLEVBQXJCLEdBQTBCLEVBQUUsR0FBRyxFQUEvQixHQUFvQyxFQUFFLEdBQUcsRUFBbEQ7QUFDQSxVQUFJLEVBQUUsR0FBRyxDQUFULEVBQVksRUFBRSxHQUFHLEdBQUwsQ0FBWixLQUNLO0FBQ0gsWUFBSSxHQUFHLEdBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFMLEdBQVUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFMLEdBQVUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFMLEdBQVUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFOLENBQWYsQ0FBZixDQUFmLENBQUosR0FBZ0UsRUFBakUsR0FBdUUsQ0FBakY7QUFDQSxRQUFBLEVBQUUsSUFBSSxFQUFOO0FBQ0EsUUFBQSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUwsSUFBVyxLQUFLLENBQUMsR0FBRCxDQUFMLEdBQWEsRUFBYixHQUFrQixLQUFLLENBQUMsR0FBRyxHQUFHLENBQVAsQ0FBTCxHQUFpQixFQUFuQyxHQUF3QyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQVAsQ0FBTCxHQUFpQixFQUF6RCxHQUE4RCxLQUFLLENBQUMsR0FBRyxHQUFHLENBQVAsQ0FBTCxHQUFpQixFQUExRixDQUFMO0FBQ0Q7QUFDRCxVQUFJLEVBQUUsR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFYLEdBQWdCLEVBQUUsR0FBRyxFQUFyQixHQUEwQixFQUFFLEdBQUcsRUFBL0IsR0FBb0MsRUFBRSxHQUFHLEVBQWxEO0FBQ0EsVUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZLEVBQUUsR0FBRyxHQUFMLENBQVosS0FDSztBQUNILFlBQUksR0FBRyxHQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBTCxHQUFTLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBTCxHQUFTLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBTCxHQUFTLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBTixDQUFkLENBQWQsQ0FBZCxDQUFKLEdBQTRELEVBQTdELEdBQW1FLENBQTdFO0FBQ0EsUUFBQSxFQUFFLElBQUksRUFBTjtBQUNBLFFBQUEsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFMLElBQVcsS0FBSyxDQUFDLEdBQUQsQ0FBTCxHQUFhLEVBQWIsR0FBa0IsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQUwsR0FBaUIsRUFBbkMsR0FBd0MsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQUwsR0FBaUIsRUFBekQsR0FBOEQsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFQLENBQUwsR0FBaUIsRUFBMUYsQ0FBTDtBQUNELE9BeEgyQixDQXlINUI7O0FBQ0EsYUFBTyxRQUFRLEVBQUUsR0FBRyxFQUFMLEdBQVUsRUFBVixHQUFlLEVBQWYsR0FBb0IsRUFBNUIsQ0FBUDtBQUNEO0FBNVVzQixHQUF6Qjs7QUErVUEsV0FBUyxxQkFBVCxDQUErQixNQUEvQixFQUF1QztBQUNyQyxRQUFJLENBQUo7QUFDQSxRQUFJLENBQUMsR0FBRyxJQUFJLFVBQUosQ0FBZSxHQUFmLENBQVI7O0FBQ0EsU0FBSyxDQUFDLEdBQUcsQ0FBVCxFQUFZLENBQUMsR0FBRyxHQUFoQixFQUFxQixDQUFDLEVBQXRCLEVBQTBCO0FBQ3hCLE1BQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQVA7QUFDRDs7QUFDRCxTQUFLLENBQUMsR0FBRyxDQUFULEVBQVksQ0FBQyxHQUFHLEdBQWhCLEVBQXFCLENBQUMsRUFBdEIsRUFBMEI7QUFDeEIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLE1BQU0sTUFBTSxDQUFaLENBQVIsQ0FBYjtBQUNBLFVBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFELENBQVg7QUFDQSxNQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTyxDQUFDLENBQUMsQ0FBRCxDQUFSO0FBQ0EsTUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sR0FBUDtBQUNEOztBQUNELFdBQU8sQ0FBUDtBQUNEOztBQUNELEVBQUEsWUFBWSxDQUFDLHNCQUFiLEdBQXNDLHFCQUF0QztBQUVBOzs7Ozs7QUFLQSxXQUFTLElBQVQsR0FBZ0I7QUFDZCxRQUFJLEVBQUUsR0FBRyxDQUFUO0FBQ0EsUUFBSSxFQUFFLEdBQUcsQ0FBVDtBQUNBLFFBQUksRUFBRSxHQUFHLENBQVQ7QUFDQSxRQUFJLENBQUMsR0FBRyxDQUFSO0FBRUEsUUFBSSxJQUFJLEdBQUcsTUFBTSxFQUFqQjtBQUNBLElBQUEsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFELENBQVQ7QUFDQSxJQUFBLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRCxDQUFUO0FBQ0EsSUFBQSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUQsQ0FBVDs7QUFFQSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUE5QixFQUFzQyxDQUFDLEVBQXZDLEVBQTJDO0FBQ3pDLE1BQUEsRUFBRSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBRCxDQUFWLENBQVY7O0FBQ0EsVUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZO0FBQ1YsUUFBQSxFQUFFLElBQUksQ0FBTjtBQUNEOztBQUNELE1BQUEsRUFBRSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBRCxDQUFWLENBQVY7O0FBQ0EsVUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZO0FBQ1YsUUFBQSxFQUFFLElBQUksQ0FBTjtBQUNEOztBQUNELE1BQUEsRUFBRSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBRCxDQUFWLENBQVY7O0FBQ0EsVUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZO0FBQ1YsUUFBQSxFQUFFLElBQUksQ0FBTjtBQUNEO0FBQ0Y7O0FBQ0QsSUFBQSxJQUFJLEdBQUcsSUFBUDtBQUNBLFdBQU8sWUFBVztBQUNoQixVQUFJLENBQUMsR0FBRyxVQUFVLEVBQVYsR0FBZSxDQUFDLEdBQUcsc0JBQTNCLENBRGdCLENBQ21DOztBQUNuRCxNQUFBLEVBQUUsR0FBRyxFQUFMO0FBQ0EsTUFBQSxFQUFFLEdBQUcsRUFBTDtBQUNBLGFBQU8sRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQVosQ0FBYjtBQUNELEtBTEQ7QUFNRDs7QUFDRCxXQUFTLE1BQVQsR0FBa0I7QUFDaEIsUUFBSSxDQUFDLEdBQUcsVUFBUjtBQUNBLFdBQU8sVUFBUyxJQUFULEVBQWU7QUFDcEIsTUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQUwsRUFBUDs7QUFDQSxXQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUF6QixFQUFpQyxDQUFDLEVBQWxDLEVBQXNDO0FBQ3BDLFFBQUEsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFMLENBQWdCLENBQWhCLENBQUw7QUFDQSxZQUFJLENBQUMsR0FBRyxzQkFBc0IsQ0FBOUI7QUFDQSxRQUFBLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBVjtBQUNBLFFBQUEsQ0FBQyxJQUFJLENBQUw7QUFDQSxRQUFBLENBQUMsSUFBSSxDQUFMO0FBQ0EsUUFBQSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQVY7QUFDQSxRQUFBLENBQUMsSUFBSSxDQUFMO0FBQ0EsUUFBQSxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVQsQ0FSb0MsQ0FRZDtBQUN2Qjs7QUFDRCxhQUFPLENBQUMsQ0FBQyxLQUFLLENBQVAsSUFBWSxzQkFBbkIsQ0Fab0IsQ0FZdUI7QUFDNUMsS0FiRDtBQWNELEdBbGJTLENBb2JWOzs7QUFDQSxNQUFJLE9BQU8sTUFBUCxLQUFrQixXQUFsQixJQUFpQyxNQUFNLENBQUMsR0FBNUMsRUFBaUQsTUFBTSxDQUFDLFlBQVc7QUFBQyxXQUFPLFlBQVA7QUFBcUIsR0FBbEMsQ0FBTixDQXJidkMsQ0FzYlY7O0FBQ0EsTUFBSSxPQUFPLE9BQVAsS0FBbUIsV0FBdkIsRUFBb0MsT0FBTyxDQUFDLFlBQVIsR0FBdUIsWUFBdkIsQ0FBcEMsQ0FDQTtBQURBLE9BRUssSUFBSSxPQUFPLE1BQVAsS0FBa0IsV0FBdEIsRUFBbUMsTUFBTSxDQUFDLFlBQVAsR0FBc0IsWUFBdEIsQ0F6YjlCLENBMGJWOztBQUNBLE1BQUksT0FBTyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLElBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsWUFBakI7QUFDRDtBQUVGLENBL2JEOzs7QUMxQkEsT0FBTyxDQUFDLGFBQUQsQ0FBUDtBQUVBOzs7OztBQUdBLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFMLEdBQVUsR0FBM0I7QUFDQSxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxFQUE1QjtBQUVBOzs7OztBQUlBLElBQUksZUFBZSxHQUFHO0FBRXJCOzs7Ozs7Ozs7O0FBVUEsRUFBQSxLQUFLLEVBQUUsVUFBUyxPQUFULEVBQWtCLE9BQWxCLEVBQTJCLE9BQTNCLEVBQW9DLE9BQXBDLEVBQTZDO0FBQzdDLFFBQUksRUFBRSxHQUFHLE9BQU8sR0FBRyxPQUFuQjtBQUNBLFFBQUksRUFBRSxHQUFHLE9BQU8sR0FBRyxPQUFuQjtBQUNBLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxFQUFaLEVBQWdCLENBQUMsRUFBakIsQ0FBWjtBQUNBLFdBQU8sS0FBUDtBQUNILEdBakJpQjtBQW1CbEIsRUFBQSw2QkFBNkIsRUFBRSxVQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCLEVBQXRCLEVBQTJCO0FBQ3pELFdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxFQUFFLEdBQUcsRUFBaEIsRUFBb0IsRUFBRSxHQUFHLEVBQXpCLENBQVA7QUFDQSxHQXJCaUI7O0FBc0JyQjs7Ozs7Ozs7OztBQVVBLEVBQUEsSUFBSSxFQUFFLFNBQVMsSUFBVCxDQUFjLEVBQWQsRUFBa0IsRUFBbEIsRUFBc0IsRUFBdEIsRUFBMEIsRUFBMUIsRUFBOEI7QUFDbkMsSUFBQSxFQUFFLElBQUksRUFBTjtBQUFTLElBQUEsRUFBRSxJQUFJLEVBQU47QUFDVCxXQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBRSxHQUFHLEVBQUwsR0FBVSxFQUFFLEdBQUcsRUFBekIsQ0FBUDtBQUNBLEdBbkNvQjs7QUFxQ3JCOzs7Ozs7O0FBT0EsRUFBQSxnQkFBZ0IsRUFBRSxVQUFTLE9BQVQsRUFBa0I7QUFDbkMsV0FBTyxPQUFPLEdBQUcsUUFBakI7QUFDQSxHQTlDb0I7QUFnRHJCLEVBQUEsR0FBRyxFQUFFLEtBQUssZ0JBaERXOztBQWlEckI7Ozs7Ozs7QUFPQSxFQUFBLGdCQUFnQixFQUFFLFVBQVMsT0FBVCxFQUFrQjtBQUNuQyxXQUFPLE9BQU8sR0FBRyxRQUFqQjtBQUNBLEdBMURvQjtBQTREckIsRUFBQSxHQUFHLEVBQUUsS0FBSyxnQkE1RFc7O0FBNkRyQjs7Ozs7Ozs7OztBQVVBLEVBQUEsbUJBQW1CLEVBQUUsVUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixFQUFqQixFQUFxQixFQUFyQixFQUF5QjtBQUU3QztBQUNBLFFBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFkO0FBQ0EsUUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQWQsQ0FKNkMsQ0FLN0M7O0FBQ0EsUUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFFLEdBQUcsRUFBTCxHQUFVLEVBQUUsR0FBRyxFQUF6QixDQUFSLENBTjZDLENBTzdDO0FBQ0E7QUFDQTs7QUFDQSxRQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQVgsRUFBZSxFQUFmLENBQVI7QUFDQSxXQUFPO0FBQ04sTUFBQSxRQUFRLEVBQUUsQ0FESjtBQUVOLE1BQUEsS0FBSyxFQUFFO0FBRkQsS0FBUDtBQUlBLEdBdEZvQjs7QUF3RnJCOzs7Ozs7OztBQVFBLEVBQUEsaUJBQWlCLEVBQUUsU0FBUyxpQkFBVCxDQUEyQixPQUEzQixFQUFvQyxVQUFwQyxFQUFnRDtBQUNsRSxXQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsT0FBVCxJQUFvQixVQUEzQjtBQUNBLEdBbEdvQjs7QUFvR3JCOzs7Ozs7OztBQVFBLEVBQUEsaUJBQWlCLEVBQUUsVUFBUyxPQUFULEVBQWtCLFVBQWxCLEVBQThCO0FBQ2hELFdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxPQUFULElBQW9CLFVBQTNCO0FBQ0EsR0E5R29COztBQWdIckI7Ozs7Ozs7Ozs7QUFVQSxFQUFBLG1CQUFtQixFQUFFLFVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxLQUFmLEVBQXNCLE9BQXRCLEVBQStCO0FBQ25ELFFBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULElBQWtCLE9BQWxCLEdBQTRCLENBQTVCLEdBQWdDLENBQTNDLEVBQThDLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxJQUFrQixPQUFsQixHQUE0QixDQUE1QixHQUFnQyxDQUE5RSxDQUFUO0FBQ0EsV0FBTztBQUNOLE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFMLENBQVMsRUFBVCxJQUFlLE9BRGY7QUFFTixNQUFBLElBQUksRUFBRSxJQUFJLENBQUMsR0FBTCxDQUFTLEVBQVQsSUFBZTtBQUZmLEtBQVA7QUFJQSxHQWhJb0I7O0FBa0lyQjs7Ozs7Ozs7OztBQVVBLEVBQUEsa0JBQWtCLEVBQUUsVUFBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUI7QUFDeEMsV0FBTztBQUNOLE1BQUEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULENBREw7QUFFTixNQUFBLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVDtBQUZMLEtBQVA7QUFJQSxHQWpKb0I7O0FBbUpyQjs7Ozs7Ozs7OztBQVVBLEVBQUEsWUFBWSxFQUFFLFVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxLQUFmLEVBQXNCLFFBQXRCLEVBQWdDO0FBQzdDLFdBQU87QUFDTixNQUFBLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsSUFBa0IsUUFBbEIsR0FBNkIsQ0FEMUI7QUFFTixNQUFBLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsSUFBa0IsUUFBbEIsR0FBNkI7QUFGMUIsS0FBUDtBQUlBLEdBbEtvQjs7QUFvS3JCOzs7Ozs7Ozs7O0FBVUEsRUFBQSxjQUFjLEVBQUUsVUFBVSxFQUFWLEVBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQixFQUF0QixFQUEwQixRQUExQixFQUFxQztBQUNwRCxXQUFPO0FBQ04sTUFBQSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUUsRUFBRSxHQUFHLEVBQVAsSUFBYyxRQURoQjtBQUVOLE1BQUEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFFLEVBQUUsR0FBRyxFQUFQLElBQWM7QUFGaEIsS0FBUDtBQUlBLEdBbkxvQjs7QUFvTHJCOzs7Ozs7Ozs7OztBQVdBLEVBQUEsY0FBYyxFQUFFLFVBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsRUFBbEIsRUFBc0IsRUFBdEIsRUFBMkI7QUFDMUMsUUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQWQ7QUFDQSxRQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBZDtBQUNBLFdBQU87QUFDTixNQUFBLEVBQUUsRUFBRTtBQUFFLFFBQUEsQ0FBQyxFQUFFLENBQUMsRUFBTjtBQUFVLFFBQUEsQ0FBQyxFQUFFO0FBQWIsT0FERTtBQUVOLE1BQUEsRUFBRSxFQUFFO0FBQUUsUUFBQSxDQUFDLEVBQUUsRUFBTDtBQUFTLFFBQUEsQ0FBQyxFQUFFLENBQUM7QUFBYjtBQUZFLEtBQVA7QUFJQSxHQXRNb0I7O0FBdU1yQjs7Ozs7Ozs7Ozs7QUFXQSxFQUFBLFNBQVMsRUFBRSxVQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCLEVBQXRCLEVBQTBCLElBQTFCLEVBQWlDO0FBQzNDLFdBQU8sS0FBSyxjQUFMLENBQXFCLEVBQXJCLEVBQXlCLEVBQXpCLEVBQTZCLEVBQTdCLEVBQWlDLEVBQWpDLEVBQXFDLElBQXJDLENBQVA7QUFDQSxHQXBOb0I7QUFzTnJCOztBQUVBOzs7Ozs7Ozs7O0FBVUEsRUFBQSxVQUFVLEVBQUUsVUFBVSxFQUFWLEVBQWMsRUFBZCxFQUFrQixFQUFsQixFQUFzQixJQUF0QixFQUE2QjtBQUNyQyxVQUFNLENBQUMsR0FBRyxDQUFDLElBQUksSUFBTCxLQUFjLElBQUksSUFBbEIsSUFBMEIsRUFBRSxDQUFDLENBQTdCLEdBQWlDLEtBQUssSUFBSSxJQUFULElBQWlCLElBQWpCLEdBQXdCLEVBQUUsQ0FBQyxDQUE1RCxHQUFnRSxJQUFJLEdBQUcsSUFBUCxHQUFjLEVBQUUsQ0FBQyxDQUEzRjtBQUNBLFVBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFMLEtBQWMsSUFBSSxJQUFsQixJQUEwQixFQUFFLENBQUMsQ0FBN0IsR0FBaUMsS0FBSyxJQUFJLElBQVQsSUFBaUIsSUFBakIsR0FBd0IsRUFBRSxDQUFDLENBQTVELEdBQWdFLElBQUksR0FBRyxJQUFQLEdBQWMsRUFBRSxDQUFDLENBQTNGO0FBQ0EsV0FBTztBQUFFLE1BQUEsQ0FBRjtBQUFLLE1BQUE7QUFBTCxLQUFQO0FBQ0gsR0F0T29COztBQXdPckI7Ozs7Ozs7Ozs7O0FBV0EsRUFBQSxlQUFlLEVBQUUsVUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixFQUFqQixFQUFxQixJQUFyQixFQUEyQjtBQUN4QyxVQUFNLEVBQUUsR0FBRztBQUFFLE1BQUEsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUgsR0FBTyxFQUFFLENBQUMsQ0FBZixDQUFMO0FBQXdCLE1BQUEsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUgsR0FBTyxFQUFFLENBQUMsQ0FBZjtBQUEzQixLQUFYO0FBQ0EsVUFBTSxFQUFFLEdBQUc7QUFBRSxNQUFBLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFILEdBQU8sRUFBRSxDQUFDLENBQWYsQ0FBTDtBQUF3QixNQUFBLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFILEdBQU8sRUFBRSxDQUFDLENBQWY7QUFBM0IsS0FBWDtBQUNBLFVBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFMLElBQWEsRUFBRSxDQUFDLENBQWhCLEdBQW9CLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBeEM7QUFDQSxVQUFNLENBQUMsR0FBRyxDQUFDLElBQUksSUFBTCxJQUFhLEVBQUUsQ0FBQyxDQUFoQixHQUFvQixJQUFJLEdBQUcsRUFBRSxDQUFDLENBQXhDO0FBQ0EsV0FBTztBQUFFLE1BQUEsQ0FBRjtBQUFLLE1BQUE7QUFBTCxLQUFQO0FBQ0gsR0F6UG9COztBQTJQckI7Ozs7Ozs7Ozs7QUFVQSxFQUFBLFdBQVcsRUFBRSxVQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLEVBQWpCLEVBQXFCLElBQXJCLEVBQTJCO0FBQ3BDLFVBQU0sQ0FBQyxHQUFHLEtBQUssZUFBTCxDQUFzQixFQUF0QixFQUEwQixFQUExQixFQUE4QixFQUE5QixFQUFrQyxJQUFsQyxDQUFWO0FBQ0EsVUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxDQUFDLENBQUMsQ0FBRixHQUFNLENBQUMsQ0FBQyxDQUFSLEdBQVksQ0FBQyxDQUFDLENBQUYsR0FBTSxDQUFDLENBQUMsQ0FBOUIsQ0FBVjtBQUNBLFVBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUgsR0FBTyxDQUFqQjtBQUNBLFVBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBaEI7QUFDQSxXQUFPO0FBQUUsTUFBQSxDQUFGO0FBQUssTUFBQTtBQUFMLEtBQVA7QUFDSCxHQTNRb0I7O0FBNlFyQjs7Ozs7Ozs7Ozs7QUFXQSxFQUFBLHVCQUF1QixFQUFFLFVBQVMsRUFBVCxFQUFhLEVBQWIsRUFBaUIsRUFBakIsRUFBcUIsSUFBckIsRUFBMkIsUUFBM0IsRUFBcUM7QUFDN0QsVUFBTSxDQUFDLEdBQUcsS0FBSyxVQUFMLENBQWdCLEVBQWhCLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLElBQTVCLENBQVY7QUFDSyxVQUFNLENBQUMsR0FBRyxLQUFLLFdBQUwsQ0FBaUIsRUFBakIsRUFBcUIsRUFBckIsRUFBeUIsRUFBekIsRUFBNkIsSUFBN0IsQ0FBVjtBQUNBLFVBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBQyxDQUFDLENBQUYsR0FBTSxRQUF0QjtBQUNBLFVBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFGLEdBQU0sQ0FBQyxDQUFDLENBQUYsR0FBTSxRQUF0QjtBQUNBLFdBQU87QUFBRSxNQUFBLENBQUY7QUFBSyxNQUFBO0FBQUwsS0FBUDtBQUNMLEdBOVJvQjs7QUFnU3JCOzs7Ozs7Ozs7O0FBVUEsRUFBQSxnQkFBZ0IsRUFBRSxVQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCLElBQXRCLEVBQTZCO0FBQzlDLFVBQU0sQ0FBQyxHQUFHLEtBQUssVUFBTCxDQUFnQixFQUFoQixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixJQUE1QixDQUFWO0FBQ0ssVUFBTSxDQUFDLEdBQUcsS0FBSyxXQUFMLENBQWlCLEVBQWpCLEVBQXFCLEVBQXJCLEVBQXlCLEVBQXpCLEVBQTZCLElBQTdCLENBQVY7QUFDQSxXQUFPLEtBQUssNkJBQUwsQ0FBb0MsQ0FBQyxDQUFDLENBQXRDLEVBQXlDLENBQUMsQ0FBQyxDQUEzQyxFQUE4QyxDQUFDLENBQUMsQ0FBaEQsRUFBbUQsQ0FBQyxDQUFDLENBQXJELENBQVA7QUFDTDtBQTlTb0IsQ0FBdEI7QUFtVEEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxlQUFmLEdBQWlDLGVBQWpDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXHJcbiogQ3JlYXRlcyBhIGNhbnZhcyBlbGVtZW50IGluIHRoZSBET00gdG8gdGVzdCBmb3IgYnJvd3NlciBzdXBwb3J0XHJcbiogdG8gc2VsZWN0ZWQgZWxlbWVudCB0byBtYXRjaCBzaXplIGRpbWVuc2lvbnMuXHJcbiogQHBhcmFtIHtzdHJpbmd9IGNvbnRleHRUeXBlIC0gKCAnMmQnIHwgJ3dlYmdsJyB8ICdleHBlcmltZW50YWwtd2ViZ2wnIHwgJ3dlYmdsMicsIHwgJ2JpdG1hcHJlbmRlcmVyJyAgKVxyXG4qIFRoZSB0eXBlIG9mIGNhbnZhcyBhbmQgY29udGV4dCBlbmdpbmUgdG8gY2hlY2sgc3VwcG9ydCBmb3JcclxuKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGJvdGggY2FudmFzIGFuZCB0aGUgY29udGV4dCBlbmdpbmUgYXJlIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlclxyXG4qL1xyXG5cclxuZnVuY3Rpb24gY2hlY2tDYW52YXNTdXBwb3J0KCBjb250ZXh0VHlwZSApIHtcclxuICAgIGxldCBjdHggPSBjb250ZXh0VHlwZSB8fCAnMmQnO1xyXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApO1xyXG4gICAgcmV0dXJuICEhKGVsZW0uZ2V0Q29udGV4dCAmJiBlbGVtLmdldENvbnRleHQoIGN0eCApICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hlY2tDYW52YXNTdXBwb3J0OyIsInJlcXVpcmUoICcuL2xpZ2h0bmluZ1Rlc3RJbmNsdWRlLmpzJyApO1xyXG4iLCJsZXQgY2hlY2tDYW52YXNTdXBwb3J0ID0gcmVxdWlyZSggJy4vY2hlY2tDYW52YXNTdXBwb3J0LmpzJyApO1xyXG5yZXF1aXJlKCAnLi91dGlscy9yYWZQb2x5ZmlsbC5qcycpO1xyXG5yZXF1aXJlKCAnLi91dGlscy9jYW52YXNBcGlBdWdtZW50YXRpb24uanMnKTtcclxuXHJcbmxldCBlYXNpbmcgPSByZXF1aXJlKCAnLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5sZXQgZWFzZUZuID0gZWFzaW5nLmVhc2VPdXRTaW5lO1xyXG5cclxubGV0IHRyaWcgPSByZXF1aXJlKCAnLi91dGlscy90cmlnb25vbWljVXRpbHMuanMnICkudHJpZ29ub21pY1V0aWxzO1xyXG5sZXQgcG9pbnRPblBhdGggPSB0cmlnLmdldFBvaW50T25QYXRoO1xyXG5sZXQgY2FsY0QgPSB0cmlnLmRpc3Q7XHJcbmxldCBjYWxjQSA9IHRyaWcuYW5nbGU7XHJcblxyXG5sZXQgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5sZXQgcm5kID0gbWF0aFV0aWxzLnJhbmRvbTtcclxubGV0IHJuZEludCA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyO1xyXG5cclxubGV0IGxpZ250bmluZ01nciA9IHJlcXVpcmUoICcuL2xpZ2h0bmluZy9saWdodG5pbmdNYW5hZ2VyL2xpZ2h0bmluZ1V0aWxpdGllcy5qcycpO1xyXG5cclxuXHJcbi8vIGhvdXNla2VlcGluZ1xyXG5sZXQgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJyNsaWdodG5pbmdEcmF3aW5nVGVzdCcgKTtcclxubGV0IGNXID0gY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbmxldCBjSCA9IGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbmxldCBjID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5saWdudG5pbmdNZ3Iuc2V0Q2FudmFzQ2ZnKCAnI2xpZ2h0bmluZ0RyYXdpbmdUZXN0JyApO1xyXG5cclxuYy5saW5lQ2FwID0gJ3JvdW5kJztcclxubGV0IGNvdW50ZXIgPSAwO1xyXG5cclxubGV0IHNob3dEZWJ1Z0luZm8gPSBmYWxzZTtcclxuXHJcbi8vIHRlc3QgVmVjdG9yIHBhdGhcclxubGV0IHRlc3RWZWMgPSB7XHJcblx0c3RhcnRYOiBjVyAvIDIsXHJcblx0c3RhcnRZOiA1MCxcclxuXHRlbmRYOiAoY1cgLyAyKSxcclxuXHRlbmRZOiBjSCAtIDUwXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdMaW5lKCBkZWJ1ZyApIHtcclxuXHRpZiAoIGRlYnVnID09PSB0cnVlICkge1xyXG5cdFx0Yy5zdHJva2VTdHlsZSA9ICdyZWQnO1xyXG5cdFx0Yy5zZXRMaW5lRGFzaCggWzUsIDE1XSApO1xyXG5cdFx0Yy5saW5lKCB0ZXN0VmVjLnN0YXJ0WCwgdGVzdFZlYy5zdGFydFksIHRlc3RWZWMuZW5kWCwgdGVzdFZlYy5lbmRZICk7XHJcblx0XHRjLnNldExpbmVEYXNoKCBbXSApO1xyXG5cdH1cclxufVxyXG5cclxuLy8gbGV0IGl0ZXJhdGlvbnMgPSBybmRJbnQoIDEwLCA1MCApO1xyXG5sZXQgaXRlcmF0aW9ucyA9IDE7XHJcblxyXG5sZXQgYmFzZVRoZW1lID0ge1xyXG5cdGNhbnZhc1c6IGNXLFxyXG5cdGNhbnZhc0g6IGNILFxyXG5cdHN0YXJ0WDogdGVzdFZlYy5zdGFydFgsXHJcblx0c3RhcnRZOiB0ZXN0VmVjLnN0YXJ0WSxcclxuXHRlbmRYOiB0ZXN0VmVjLmVuZFgsXHJcblx0ZW5kWTogdGVzdFZlYy5lbmRZLFxyXG5cdHN1YmRpdmlzaW9uczogbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoIDMsIDYgKSxcclxuXHRzcGVlZE1vZFJhdGU6IDAuOSxcclxuXHR3aWxsQ29ubmVjdDogdHJ1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVUaGVtZSggZXZlbnQgKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdGNhbnZhc1c6IGNXLFxyXG5cdFx0Y2FudmFzSDogY0gsXHJcblx0XHRzdGFydFg6IGV2ZW50LmNsaWVudFgsXHJcblx0XHRzdGFydFk6IGV2ZW50LmNsaWVudFksXHJcblx0XHRlbmRYOiB0ZXN0VmVjLmVuZFgsXHJcblx0XHRlbmRZOiB0ZXN0VmVjLmVuZFksXHJcblx0XHRzdWJkaXZpc2lvbnM6IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCAzLCA2IClcclxuXHR9XHJcbn1cclxuXHJcblxyXG5saWdudG5pbmdNZ3IuY3JlYXRlTGlnaHRuaW5nKCBiYXNlVGhlbWUgKTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQnV0dG9uIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiQoICcuanMtcnVuJyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKXtcclxuXHRsaWdudG5pbmdNZ3IuY3JlYXRlTGlnaHRuaW5nKCBiYXNlVGhlbWUgKTtcclxufSApO1xyXG5cclxuJCggJy5qcy1jbGVhci1tZ3InICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApe1xyXG5cdGxpZ250bmluZ01nci5jbGVhck1lbWJlckFycmF5KCk7XHJcbn0gKTtcclxuXHJcbiQoICcuanMtY2xlYXItbWdyLXJ1bicgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICl7XHJcblx0bGlnbnRuaW5nTWdyLmNsZWFyTWVtYmVyQXJyYXkoKTtcclxuXHRsaWdudG5pbmdNZ3IuY3JlYXRlTGlnaHRuaW5nKCBiYXNlVGhlbWUgKTtcclxufSApO1xyXG5cclxuJCggJ2NhbnZhcycgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICl7XHJcblx0bGlnbnRuaW5nTWdyLmNyZWF0ZUxpZ2h0bmluZyggY3JlYXRlVGhlbWUoIGV2ZW50ICkgKTtcclxufSApO1xyXG5cclxuJCggJy5qcy1idXR0b24tdG9nZ2xlJyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKSB7XHJcblx0bGV0IHRoaXNJdGVtID0gJCggdGhpcyApO1xyXG5cdGlmICggdGhpc0l0ZW0uaGFzQ2xhc3MoICdqcy1pc0FjdGl2ZScpICkge1xyXG5cdFx0dGhpc0l0ZW0ucmVtb3ZlQ2xhc3MoICdqcy1pc0FjdGl2ZScpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aGlzSXRlbS5hZGRDbGFzcyggJ2pzLWlzQWN0aXZlJyk7XHJcblx0fVxyXG5cclxuXHRpZiAoIHR5cGVvZiAkKCB0aGlzICkuYXR0ciggJ2RhdGEtbGlua2VkLXRvZ2dsZScgKSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcclxuXHRcdCQoIHRoaXMgKS5wYXJlbnQoKS5maW5kKCAnLicrJCggdGhpcyApLmF0dHIoICdkYXRhLWxpbmtlZC10b2dnbGUnICkgKS5yZW1vdmVDbGFzcyggJ2pzLWlzQWN0aXZlJyApO1xyXG5cdH1cclxuXHJcbn0gKTtcclxuXHJcbiQoICcuanMtc2hvdy1kZWJ1Zy1vdmVybGF5JyApLmNsaWNrKCBmdW5jdGlvbiggZXZlbnQgKXtcclxuXHRpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ2FjdGl2ZScgKSApIHtcclxuXHRcdCQoIHRoaXMgKS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcclxuXHRcdHNob3dEZWJ1Z0luZm8gPSBmYWxzZTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0JCggdGhpcyApLmFkZENsYXNzKCAnYWN0aXZlJyApO1xyXG5cdFx0c2hvd0RlYnVnSW5mbyA9IHRydWU7XHJcblx0fVxyXG59ICk7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEFwcCBzdGFydFxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBkcmF3VGVzdCgpIHtcclxuXHRsaWdudG5pbmdNZ3IudXBkYXRlKCBjICk7XHJcblx0ZHJhd0xpbmUoIHNob3dEZWJ1Z0luZm8gKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYXJTY3JlZW4oKSB7XHJcblx0Yy5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG5cdGMuZmlsbFJlY3QoIDAsIDAsIGNXLCBjSCApO1xyXG59XHJcblxyXG5mdW5jdGlvbiByYWZMb29wKCkge1xyXG5cdC8vIGZsdXNoIHNjcmVlbiBidWZmZXJcclxuXHRjbGVhclNjcmVlbigpO1xyXG5cdC8vIERvIHdoYXRldmVyXHJcblx0ZHJhd1Rlc3QoKTtcclxuXHQvL2xvb3BcclxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHJhZkxvb3AgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdGlhbGlzZSgpIHtcclxuXHQvLyBzZXR1cFxyXG5cdFx0Ly8gZG8gc2V0dXAgdGhpbmdzIGhlcmVcclxuXHQvL2xvb3BlclxyXG5cdHJhZkxvb3AoKTtcclxufVxyXG5cclxuaW5pdGlhbGlzZSgpO1xyXG4iLCJmdW5jdGlvbiBjbGVhck1lbWJlckFycmF5KCkge1xyXG5cdHRoaXMubWVtYmVycy5sZW5ndGggPSAwO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsZWFyTWVtYmVyQXJyYXk7IiwibGV0IGVhc2luZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQmx1ckFycmF5KCBibHVyQ291bnQsIG1pbkJsdXJEaXN0LCBtYXhCbHVyRGlzdCwgZWFzZSApe1xyXG5cdGxldCB0bXAgPSBbXTtcclxuXHRsZXQgZWFzZUZuID0gZWFzaW5nWyBlYXNlIF07XHJcblx0bGV0IGNoYW5nZURlbHRhID0gbWF4Qmx1ckRpc3QgLSBtaW5CbHVyRGlzdDtcclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IGJsdXJDb3VudDsgaSsrICkge1xyXG5cdFx0dG1wLnB1c2goXHJcblx0XHRcdE1hdGguZmxvb3IoIGVhc2VGbiggaSwgbWluQmx1ckRpc3QsIGNoYW5nZURlbHRhLCBibHVyQ291bnQgKSApXHJcblx0XHQpO1xyXG5cdH1cclxuXHRyZXR1cm4gdG1wO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCbHVyQXJyYXk7IiwibGV0IG1hdGhVdGlscyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9tYXRoVXRpbHMuanMnICk7XHJcbmxldCBlYXNpbmcgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvZWFzaW5nLmpzJyApLmVhc2luZ0VxdWF0aW9ucztcclxubGV0IHRyaWcgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvdHJpZ29ub21pY1V0aWxzLmpzJyApLnRyaWdvbm9taWNVdGlscztcclxuXHJcbmxldCBsbWdyVXRpbHMgPSByZXF1aXJlKCAnLi9saWdodG5pbmdNYW5hZ2VyVXRpbGl0aWVzLmpzJyApO1xyXG5sZXQgY3JlYXRlTGlnaHRuaW5nUGFyZW50ID0gbG1nclV0aWxzLmNyZWF0ZUxpZ2h0bmluZ1BhcmVudDtcclxuXHJcbmxldCByZW5kZXJDb25maWcgPSByZXF1aXJlKCAnLi9yZW5kZXJDb25maWcuanMnICk7XHJcblxyXG5sZXQgbWFpblBhdGhBbmltU2VxdWVuY2UgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL21haW5QYXRoQW5pbVNlcXVlbmNlLmpzYCApO1xyXG5sZXQgY2hpbGRQYXRoQW5pbVNlcXVlbmNlID0gcmVxdWlyZSggYC4uL3NlcXVlbmNlci9jaGlsZFBhdGhBbmltU2VxdWVuY2UuanNgICk7XHJcblxyXG5sZXQgY3JlYXRlUGF0aEZyb21PcHRpb25zID0gcmVxdWlyZSggJy4uL3BhdGgvY3JlYXRlUGF0aEZyb21PcHRpb25zLmpzJyApO1xyXG5sZXQgY3JlYXRlUGF0aENvbmZpZyA9IHJlcXVpcmUoICcuLi9wYXRoL2NyZWF0ZVBhdGhDb25maWcuanMnICk7XHJcbmxldCBjYWxjdWxhdGVTdWJEUmF0ZSA9IHJlcXVpcmUoICcuLi9wYXRoL2NhbGN1bGF0ZVN1YkRSYXRlLmpzJyApO1xyXG5cclxuLy8gc3RvcmUgc3ViZGl2aXNpb24gbGV2ZWwgc2VnbWVudCBjb3VudCBhcyBhIGxvb2sgdXAgdGFibGUvYXJyYXlcclxubGV0IHN1YkRTZWdtZW50Q291bnRMb29rVXAgPSBbIDEsIDIsIDQsIDgsIDE2LCAzMiwgNjQsIDEyOCwgMjU2LCA1MTIsIDEwMjQgXTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpZ2h0bmluZyggb3B0aW9ucyApIHtcclxuXHJcblx0bGV0IGxNZ3IgPSB0aGlzO1xyXG5cdGxldCBvcHRzID0gb3B0aW9ucztcclxuXHRsZXQgY3JlYXRpb25Db25maWcgPSB0aGlzLmNyZWF0aW9uQ29uZmlnO1xyXG5cdGxldCBicmFuY2hDZmcgPSBjcmVhdGlvbkNvbmZpZy5icmFuY2hlcztcclxuXHRsTWdyLmNhbnZhc1cgPSBvcHRzLmNhbnZhc1c7XHJcblx0bE1nci5jYW52YXNIID0gb3B0cy5jYW52YXNIO1xyXG5cdGxldCBtYXhDYW52YXNEaXN0ID0gdHJpZy5kaXN0KCAwLCAwLCBvcHRzLmNhbnZhc1csIG9wdHMuY2FudmFzSCApO1xyXG5cdFxyXG5cdGJyYW5jaENmZy5kZXB0aC5jdXJyID0gMTtcclxuXHJcblx0Ly8gbGV0IG1heFN1YkQgPSA4O1xyXG5cdGxldCBzdWJEID0gNjtcclxuXHRsZXQgc3ViRGl2cyA9IG9wdHMuc3ViZGl2aXNpb25zIHx8IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCBicmFuY2hDZmcuc3ViRC5taW4sIGJyYW5jaENmZy5zdWJELm1heCk7XHJcblx0XHJcblx0bGV0IGQgPSB0cmlnLmRpc3QoIG9wdHMuc3RhcnRYLCBvcHRzLnN0YXJ0WSwgb3B0cy5lbmRYLCBvcHRzLmVuZFkgKTtcclxuXHRsZXQgc3ViRFJhdGUgPSBjYWxjdWxhdGVTdWJEUmF0ZSggZCwgbWF4Q2FudmFzRGlzdCwgc3ViRCApO1xyXG5cdGxldCBwYXJlbnRQYXRoRGlzdCA9IGQ7XHJcblx0XHJcblx0bGV0IHNwZWVkID0gICggZCAvIHN1YkRTZWdtZW50Q291bnRMb29rVXBbIHN1YkRSYXRlIF0gKTtcclxuXHRsZXQgc3BlZWRNb2RSYXRlID0gb3B0cy5zcGVlZE1vZFJhdGUgfHwgMC42O1xyXG5cdGxldCBzcGVlZE1vZCA9IHNwZWVkICogc3BlZWRNb2RSYXRlO1xyXG5cdC8vIGNhbGN1bGF0ZSBkcmF3IHNwZWVkIGJhc2VkIG9uIGJvbHQgbGVuZ3RoIC8gXHJcblxyXG5cdGxldCB0ZW1wUGF0aHMgPSBbXTtcclxuXHJcblx0Ly8gMS4gY3JlYXRlIGludGlhbC9tYWluIHBhdGhcclxuXHR0ZW1wUGF0aHMucHVzaChcclxuXHRcdGNyZWF0ZVBhdGhGcm9tT3B0aW9ucyhcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlzQ2hpbGQ6IGZhbHNlLFxyXG5cdFx0XHRcdGlzQWN0aXZlOiB0cnVlLFxyXG5cdFx0XHRcdGlzUmVuZGVyaW5nOiB0cnVlLFxyXG5cdFx0XHRcdHNlcXVlbmNlU3RhcnRJbmRleDogMSxcclxuXHRcdFx0XHRzZXF1ZW5jZXM6IG1haW5QYXRoQW5pbVNlcXVlbmNlLFxyXG5cdFx0XHRcdHN0YXJ0WDogb3B0cy5zdGFydFgsXHJcblx0XHRcdFx0c3RhcnRZOiBvcHRzLnN0YXJ0WSxcclxuXHRcdFx0XHRlbmRYOiBvcHRzLmVuZFgsXHJcblx0XHRcdFx0ZW5kWTogb3B0cy5lbmRZLFxyXG5cdFx0XHRcdHBhdGhDb2xSOiAxNTUsXHJcblx0XHRcdFx0cGF0aENvbEc6IDE1NSxcclxuXHRcdFx0XHRwYXRoQ29sQjogMjU1LFxyXG5cdFx0XHRcdHBhdGhDb2xBOiAxLFxyXG5cdFx0XHRcdGdsb3dDb2xSOiAxNTAsXHJcblx0XHRcdFx0Z2xvd0NvbEc6IDE1MCxcclxuXHRcdFx0XHRnbG93Q29sQjogMjU1LFxyXG5cdFx0XHRcdGdsb3dDb2xBOiAxLFxyXG5cdFx0XHRcdHBhcmVudFBhdGhEaXN0OiAwLFxyXG5cdFx0XHRcdGxpbmVXaWR0aDogMSxcclxuXHRcdFx0XHRzdWJEUmF0ZTogc3ViRFJhdGUsXHJcblx0XHRcdFx0c3ViZGl2aXNpb25zOiBzdWJELFxyXG5cdFx0XHRcdGRSYW5nZTogZCAvIDJcclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdCk7XHJcblxyXG5cdGxldCBicmFuY2hQb2ludHNDb3VudCA9IDY7XHJcblx0bGV0IGJyYW5jaFN1YkRGYWN0b3IgPSA2O1xyXG5cdC8vIGN5Y2xlIHRocm91Z2ggYnJhbmNoIGRlcHRoIGxldmVscyBzdGFydGluZyB3aXRoIDBcclxuXHRmb3IoIGxldCBicmFuY2hDdXJyTnVtID0gMDsgYnJhbmNoQ3Vyck51bSA8PSBicmFuY2hDZmcuZGVwdGguY3VycjsgYnJhbmNoQ3Vyck51bSsrKXtcclxuXHRcdC8vIGN5Y2xlIHRocm91Z2ggY3VycmVudCBwYXRocyBpbiB0ZW1wUGF0aCBhcnJheVxyXG5cdFx0Zm9yKCBsZXQgY3VyclBhdGhOdW0gPSAwOyBjdXJyUGF0aE51bSA8IHRlbXBQYXRocy5sZW5ndGg7IGN1cnJQYXRoTnVtKysgKSB7XHJcblx0XHRcdC8vIGdldCBwYXRoIG9iamVjdCBpbnN0YW5jZVxyXG5cdFx0XHRsZXQgdGhpc1BhdGhDZmcgPSB0ZW1wUGF0aHNbIGN1cnJQYXRoTnVtIF07XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoIHRoaXNQYXRoQ2ZnLmJyYW5jaERlcHRoICE9PSBicmFuY2hDdXJyTnVtICkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBnZXQgdGhlIHBhdGggcG9pbnQgYXJyYXlcclxuXHRcdFx0bGV0IHAgPSB0aGlzUGF0aENmZy5wYXRoO1xyXG5cdFx0XHRsZXQgcExlbiA9IHAubGVuZ3RoO1xyXG5cclxuXHRcdFx0Ly8gZm9yIGVhY2ggb2YgdGhlIGdlbmVyYXRlZCBicmFuY2ggY291bnRcclxuXHRcdFx0Zm9yKCBsZXQgayA9IDA7IGsgPCBicmFuY2hQb2ludHNDb3VudDsgaysrICkge1xyXG5cclxuXHRcdFx0XHRsZXQgcENmZyA9IGNyZWF0ZVBhdGhDb25maWcoXHJcblx0XHRcdFx0XHR0aGlzUGF0aENmZyxcclxuXHRcdFx0XHRcdHtcdFxyXG5cdFx0XHRcdFx0XHRwYXJlbnRQYXRoRGlzdDogZCxcclxuXHRcdFx0XHRcdFx0YnJhbmNoRGVwdGg6IGJyYW5jaEN1cnJOdW0gKyAxXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0dGVtcFBhdGhzLnB1c2goXHJcblx0XHRcdFx0XHRjcmVhdGVQYXRoRnJvbU9wdGlvbnMoXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRpc0NoaWxkOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdGlzQWN0aXZlOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdGlzUmVuZGVyaW5nOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdGJyYW5jaERlcHRoOiBwQ2ZnLmJyYW5jaERlcHRoLFxyXG5cdFx0XHRcdFx0XHRcdHJlbmRlck9mZnNldDogcENmZy5yZW5kZXJPZmZzZXQsXHJcblx0XHRcdFx0XHRcdFx0c2VxdWVuY2VTdGFydEluZGV4OiAxLFxyXG5cdFx0XHRcdFx0XHRcdHNlcXVlbmNlczogY2hpbGRQYXRoQW5pbVNlcXVlbmNlLFxyXG5cdFx0XHRcdFx0XHRcdHBhdGhDb2xSOiAxNTUsXHJcblx0XHRcdFx0XHRcdFx0cGF0aENvbEc6IDE1NSxcclxuXHRcdFx0XHRcdFx0XHRwYXRoQ29sQjogMjU1LFxyXG5cdFx0XHRcdFx0XHRcdGdsb3dDb2xSOiAxNTAsXHJcblx0XHRcdFx0XHRcdFx0Z2xvd0NvbEc6IDE1MCxcclxuXHRcdFx0XHRcdFx0XHRnbG93Q29sQjogMjU1LFxyXG5cdFx0XHRcdFx0XHRcdGdsb3dDb2xBOiAxLFxyXG5cdFx0XHRcdFx0XHRcdHN0YXJ0WDogcENmZy5zdGFydFgsXHJcblx0XHRcdFx0XHRcdFx0c3RhcnRZOiBwQ2ZnLnN0YXJ0WSxcclxuXHRcdFx0XHRcdFx0XHRlbmRYOiBwQ2ZnLmVuZFgsXHJcblx0XHRcdFx0XHRcdFx0ZW5kWTogcENmZy5lbmRZLFxyXG5cdFx0XHRcdFx0XHRcdHBhcmVudFBhdGhEaXN0OiBkLFxyXG5cdFx0XHRcdFx0XHRcdGxpbmVXaWR0aDogMSxcclxuXHRcdFx0XHRcdFx0XHRzdWJkaXZpc2lvbnM6IGNhbGN1bGF0ZVN1YkRSYXRlKCBwQ2ZnLmRWYXIsIG1heENhbnZhc0Rpc3QsIHN1YkQgKSxcclxuXHRcdFx0XHRcdFx0XHRkUmFuZ2U6IHBDZmcuZFZhcixcclxuXHRcdFx0XHRcdFx0XHRzZXF1ZW5jZVN0YXJ0SW5kZXg6IDFcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH0gLy8gZW5kIGN1cnJlbnQgcGF0aHMgbG9vcFxyXG5cclxuXHRcdGlmICggYnJhbmNoUG9pbnRzQ291bnQgPiAwICkge1xyXG5cdFx0XHRicmFuY2hQb2ludHNDb3VudCA9IE1hdGguZmxvb3IoIGJyYW5jaFBvaW50c0NvdW50IC8gMTYgKTtcclxuXHRcdH1cclxuXHRcdGlmICggYnJhbmNoU3ViREZhY3RvciA+IDEgKSB7XHJcblx0XHRcdGJyYW5jaFN1YkRGYWN0b3ItLTtcclxuXHRcdH1cclxuXHR9IC8vIGVuZCBicmFuY2ggZGVwdGggbG9vcFxyXG5cclxuXHQvLyBjcmVhdGUgcGFyZW50IGxpZ2h0bmluZyBpbnN0YW5jZVxyXG5cdGNyZWF0ZUxpZ2h0bmluZ1BhcmVudChcclxuXHRcdHsgc3BlZWQ6IHNwZWVkTW9kLCB0ZW1wUGF0aHM6IHRlbXBQYXRocyB9LFxyXG5cdFx0dGhpcy5tZW1iZXJzXHJcblx0KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVMaWdodG5pbmc7IiwiY29uc3QgY3JlYXRpb25Db25maWcgPSAge1xyXG5cdGJyYW5jaGVzOiB7XHJcblx0XHRzdWJEOiB7XHJcblx0XHRcdG1pbjogMyxcclxuXHRcdFx0bWF4OiA2XHJcblx0XHR9LFxyXG5cdFx0ZGVwdGg6IHtcclxuXHRcdFx0bWluOiAxLFxyXG5cdFx0XHRtYXg6IDIsXHJcblx0XHRcdGN1cnI6IDBcclxuXHRcdH0sXHJcblx0XHRzcGF3blJhdGU6IHtcclxuXHRcdFx0bWluOiA1LFxyXG5cdFx0XHRtYXg6IDEwXHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGlvbkNvbmZpZzsiLCJmdW5jdGlvbiBkcmF3RGVidWdMaW5lcyggYyApIHtcclxuXHRsZXQgbWVtYmVycyA9IHRoaXMubWVtYmVycztcclxuXHRsZXQgbWVtYmVyc0xlbiA9IG1lbWJlcnMubGVuZ3RoO1xyXG5cclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IG1lbWJlcnNMZW47IGkrKyApIHtcclxuXHRcdGxldCB0aGlzTWVtYmVyID0gdGhpcy5tZW1iZXJzWyBpIF07XHJcblxyXG5cdFx0bGV0IHRoaXNQYXRocyA9IHRoaXNNZW1iZXIucGF0aHM7XHJcblx0XHRsZXQgdGhpc1BhdGhzTGVuID0gdGhpc1BhdGhzLmxlbmd0aDtcclxuXHJcblx0XHRmb3IoIGxldCBqID0gMDsgaiA8IHRoaXNQYXRoc0xlbjsgaisrICkge1xyXG5cdFx0XHRsZXQgcGF0aCA9IHRoaXNQYXRoc1sgaiBdLnBhdGg7XHJcblx0XHRcdGMubGluZVdpZHRoID0gNTtcclxuXHRcdFx0Yy5zdHJva2VTdHlsZSA9ICdyZWQnO1xyXG5cdFx0XHRjLnNldExpbmVEYXNoKCBbNSwgMTVdICk7XHJcblx0XHRcdGMubGluZSggcGF0aFswXS54LCBwYXRoWzBdLnksIHBhdGhbcGF0aC5sZW5ndGggLSAxXS54LCBwYXRoW3BhdGgubGVuZ3RoIC0gMV0ueSApO1xyXG5cdFx0XHRjLnNldExpbmVEYXNoKCBbXSApO1x0XHJcblx0XHR9XHJcblxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkcmF3RGVidWdMaW5lczsiLCJsZXQgdHJpZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy90cmlnb25vbWljVXRpbHMuanMnICkudHJpZ29ub21pY1V0aWxzO1xyXG5cclxuZnVuY3Rpb24gZHJhd0RlYnVnUmFkaWFsVGVzdCggYyApIHtcclxuXHRsZXQgUEkgPSBNYXRoLlBJO1xyXG5cdFBJU1EgPSBQSSAqIDI7XHJcblx0bGV0IGNYID0gMTUwLCBjWSA9IDE1MCwgY1IgPSAxMDA7XHJcblx0bGV0IHplcm9Sb3RQb2ludCA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBjWCwgY1ksIGNSLCBQSVNRICk7XHJcblx0bGV0IHFSb3RQb2ludCA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBjWCwgY1ksIGNSLCBQSVNRICogMC4yNSApO1xyXG5cdGxldCBoYWxmUm90UG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbiggY1gsIGNZLCBjUiwgUElTUSAqIDAuNSApO1xyXG5cdGxldCB0aHJlZVFSb3RQb2ludCA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBjWCwgY1ksIGNSLCBQSVNRICogMC43NSApO1xyXG5cclxuXHQvLyBzdGFydCBwb2ludFxyXG5cdGxldCB0ZXN0UDFQb2ludCA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBjWCwgY1ksIGNSLCBQSVNRICogMC4xMjUgKTtcclxuXHQvLyBlbmQgcG9pbnRcclxuXHRsZXQgdGVzdFAyUG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbiggY1gsIGNZLCBjUiwgUElTUSAqIDAuNjI1ICk7XHJcblx0Ly8gY3VydmVQb2ludFxyXG5cdGxldCB0ZXN0UDNQb2ludCA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBjWCwgY1ksIGNSLCBQSVNRICogMC44NzUgKTtcclxuXHRsZXQgdGVzdE5vcm1hbFBvaW50ID0gdHJpZy5wcm9qZWN0Tm9ybWFsQXREaXN0YW5jZShcclxuXHRcdHRlc3RQMVBvaW50LCB0ZXN0UDNQb2ludCwgdGVzdFAyUG9pbnQsIDAuNSwgY1IgKiAxLjFcclxuXHQpO1xyXG5cdC8vIHJlZmVyZW5jZSBwb2ludHMgcmVuZGVyXHJcblx0Yy5zdHJva2VTdHlsZSA9ICcjODgwMDAwJztcclxuXHRjLmZpbGxTdHlsZSA9ICdyZWQnO1xyXG5cdGMubGluZVdpZHRoID0gMjtcclxuXHRjLnN0cm9rZUNpcmNsZSggY1gsIGNZLCBjUiApO1xyXG5cdGMuZmlsbENpcmNsZSggY1gsIGNZLCA1ICk7XHJcblx0Yy5maWxsQ2lyY2xlKCB6ZXJvUm90UG9pbnQueCwgemVyb1JvdFBvaW50LnksIDUgKTtcclxuXHRjLmZpbGxDaXJjbGUoIHFSb3RQb2ludC54LCBxUm90UG9pbnQueSwgNSApO1xyXG5cdGMuZmlsbENpcmNsZSggaGFsZlJvdFBvaW50LngsIGhhbGZSb3RQb2ludC55LCA1ICk7XHJcblx0Yy5maWxsQ2lyY2xlKCB0aHJlZVFSb3RQb2ludC54LCB0aHJlZVFSb3RQb2ludC55LCA1ICk7XHJcblxyXG5cdC8vIHJlZmVuY2Ugc2hhcGUgdHJpYW5nbGUgcG9pbnRzIHJlbmRlclxyXG5cdGMuZmlsbFN0eWxlID0gJyMwMDg4ZWUnO1xyXG5cdGMuZmlsbENpcmNsZSggdGVzdFAxUG9pbnQueCwgdGVzdFAxUG9pbnQueSwgNSApO1xyXG5cdGMuZmlsbENpcmNsZSggdGVzdFAyUG9pbnQueCwgdGVzdFAyUG9pbnQueSwgNSApO1xyXG5cdGMuZmlsbENpcmNsZSggdGVzdFAzUG9pbnQueCwgdGVzdFAzUG9pbnQueSwgNSApO1xyXG5cclxuXHQvLyByZWZlbmNlIHNoYXBlIGVkZ2UgcmVuZGVyXHJcblx0Yy5zdHJva2VTdHlsZSA9ICcjMDAyMjY2JztcclxuXHRjLnNldExpbmVEYXNoKCBbMywgNl0gKTtcclxuXHRjLmxpbmUoIHRlc3RQMVBvaW50LngsIHRlc3RQMVBvaW50LnksIHRlc3RQMlBvaW50LngsIHRlc3RQMlBvaW50LnkgKTtcclxuXHRjLmxpbmUoIHRlc3RQMVBvaW50LngsIHRlc3RQMVBvaW50LnksIHRlc3RQM1BvaW50LngsIHRlc3RQM1BvaW50LnkgKTtcclxuXHRjLmxpbmUoIHRlc3RQMlBvaW50LngsIHRlc3RQMlBvaW50LnksIHRlc3RQM1BvaW50LngsIHRlc3RQM1BvaW50LnkgKTtcclxuXHJcblx0Ly8gcHJvamVjdGVkIE5PUk1BTCByZWZlcmVuY2UgcG9pbnRcclxuXHRjLmZpbGxTdHlsZSA9ICcjMDBhYWZmJztcclxuXHRjLmZpbGxDaXJjbGUoIHRlc3ROb3JtYWxQb2ludC54LCB0ZXN0Tm9ybWFsUG9pbnQueSwgNSApO1xyXG5cclxuXHQvLyBub3JtYWwgbGluZSByZW5kZXJcclxuXHQvLyBpbm5lclxyXG5cdGMuc2V0TGluZURhc2goIFszLCA2XSApO1xyXG5cdGMuc3Ryb2tlU3R5bGUgPSAnIzAwNTUwMCc7XHJcblx0Yy5saW5lKCBjWCwgY1ksIHRlc3RQM1BvaW50LngsIHRlc3RQM1BvaW50LnkgKTtcclxuXHQvLyBvdXRlclxyXG5cdGMuc3Ryb2tlU3R5bGUgPSAnIzAwZmYwMCc7XHJcblx0Yy5saW5lKCB0ZXN0UDNQb2ludC54LCB0ZXN0UDNQb2ludC55LCB0ZXN0Tm9ybWFsUG9pbnQueCwgdGVzdE5vcm1hbFBvaW50LnkgKTtcclxuXHRjLnNldExpbmVEYXNoKFtdKTtcclxuXHJcblx0Ly8gY2FsY3VsYXRlIG5vcm1hbCBhbmdsZSBiYWNrIGZyb20gdGVzdCBzaGFwZSBmb3IgdGVzdGluZ1xyXG5cdGxldCB0ZXN0QW5nbGUgPSB0cmlnLmdldEFuZ2xlT2ZOb3JtYWwoIHRlc3RQMVBvaW50LCB0ZXN0UDNQb2ludCwgdGVzdFAyUG9pbnQsMC41KTtcclxuXHQvLyBwcm9qZWN0IG5vbWFsIHBvaW50IGZyb20gY2FsY3VsYXRpb25cclxuXHRsZXQgdGVzdEFuZ2xlUG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbihcclxuXHRcdGNYLCBjWSArIDIwMCwgMTAwLFxyXG5cdFx0TWF0aC5hdGFuMih0ZXN0Tm9ybWFsUG9pbnQueSAtIGNZLCB0ZXN0Tm9ybWFsUG9pbnQueCAtIGNYKVxyXG5cdFx0KTtcclxuXHJcblx0Ly8gZHJhdyBsaW5lIGZvciB0ZXN0IHJlZmVyZW5jZVxyXG5cdGMuc3Ryb2tlU3R5bGUgPSAnIzAwMDA5OSc7XHJcblx0Yy5maWxsU3R5bGUgPSAnIzAwNjZkZCc7XHJcblx0Yy5zdHJva2VDaXJjbGUoIGNYLCBjWSArIDIwMCwgNzUgKTtcclxuXHRjLmxpbmUoIGNYLCBjWSArIDIwMCwgdGVzdEFuZ2xlUG9pbnQueCwgdGVzdEFuZ2xlUG9pbnQueSApO1xyXG5cdGMuZmlsbENpcmNsZSggY1gsIGNZICsgMjAwLCA1ICk7XHJcblx0Yy5maWxsQ2lyY2xlKCB0ZXN0QW5nbGVQb2ludC54LCB0ZXN0QW5nbGVQb2ludC55LCA1ICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZHJhd0RlYnVnUmFkaWFsVGVzdDsiLCJjb25zdCBnbG9iYWxDb25maWcgPSB7XHJcblx0aW50ZXJ2YWxNaW46IDAsXHJcblx0aW50ZXJ2YWxNYXg6IDAsXHJcblx0aW50ZXJ2YWxDdXJyZW50OiAwXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsQ29uZmlnOyIsImNvbnN0IGxNZ3JDbG9jayA9IHtcclxuXHRnbG9iYWw6IHtcclxuXHRcdGlzUnVubmluZzogZmFsc2UsXHJcblx0XHRjdXJyZW50VGljazogMFxyXG5cdH0sXHJcblx0bG9jYWw6IHtcclxuXHRcdGlzUnVubmluZzogZmFsc2UsXHJcblx0XHRjdXJyZW50VGljazogMCxcclxuXHRcdHRhcmdldDogMFxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsTWdyQ2xvY2s7IiwibGV0IGNyZWF0ZUJsdXJBcnJheSA9IHJlcXVpcmUoICcuL2NyZWF0ZUJsdXJBcnJheS5qcycgKTtcclxubGV0IG1hdGhVdGlscyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9tYXRoVXRpbHMuanMnICk7XHJcblxyXG4vLyBzdGF0ZSBsaXN0IGRlY2xhcmF0aW9uc1xyXG5jb25zdCBJU19VTklOSVRJQUxJU0VEID0gJ2lzVW5pbml0aWFsaXNlZCc7XHJcbmNvbnN0IElTX0lOSVRJQUxJU0VEID0gJ2lzSW5pdGlhbGlzZWQnO1xyXG5jb25zdCBJU19BQ1RJVkUgPSAnaXNBY3RpdmUnO1xyXG5jb25zdCBJU19EUkFXSU5HID0gJ2lzRHJhd2luZyc7XHJcbmNvbnN0IElTX0RSQVdOID0gJ2lzRHJhd24nO1xyXG5jb25zdCBJU19DT05ORUNURUQgPSAnaXNDb25uZWN0ZWQnO1xyXG5jb25zdCBJU19SRURSQVdJTkcgPSAnaXNSZWRyYXdpbmcnO1xyXG5jb25zdCBJU19BTklNQVRFRCA9ICdpc0FuaW1hdGluZyc7XHJcbmNvbnN0IElTX0ZJRUxERUZGRUNUID0gJ2lzRmllbGRFZmZlY3QnO1xyXG5jb25zdCBJU19DT1VOVERPV04gPSAnaXNDb3VudGRvd24nO1xyXG5jb25zdCBJU19DT01QTEVURSA9ICdpc0NvbXBsZXRlJztcclxuY29uc3QgSVNfQ09VTlRET1dOQ09NUExFVEUgPSAnaXNDb3VudGRvd25Db21wbGV0ZSc7XHJcblxyXG5mdW5jdGlvbiBzZXRTdGF0ZSggc3RhdGVOYW1lICkge1xyXG5cdGxldCBzdGF0ZXMgPSB0aGlzLnN0YXRlLnN0YXRlcztcclxuXHRjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoIHN0YXRlcyApO1xyXG5cdGNvbnN0IGVudHJpZXNMZW4gPSBlbnRyaWVzLmxlbmd0aDtcclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IGVudHJpZXNMZW47IGkrKyApIHtcclxuXHRcdGxldCB0aGlzRW50cnkgPSBlbnRyaWVzWyBpIF07XHJcblx0XHRsZXQgdGhpc0VudHJ5TmFtZSA9IHRoaXNFbnRyeVsgMCBdO1xyXG5cdFx0aWYoIHRoaXNFbnRyeU5hbWUgPT09IHN0YXRlTmFtZSApIHtcclxuXHRcdFx0c3RhdGVzWyBzdGF0ZU5hbWUgXSA9IHRydWU7XHJcblx0XHRcdHRoaXMuc3RhdGUuY3VycmVudCA9IHRoaXNFbnRyeU5hbWU7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2V0Q3VycmVudFN0YXRlKCkge1xyXG5cdHJldHVybiB0aGlzLnN0YXRlLmN1cnJlbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVJlbmRlckNvbmZpZygpIHtcclxuXHR0aGlzLnJlbmRlckNvbmZpZy5jdXJySGVhZCArPSB0aGlzLnJlbmRlckNvbmZpZy5zZWdtZW50c1BlckZyYW1lO1xyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVMaWdodG5pbmdQYXJlbnQoIG9wdHMsIGFyciApIHtcclxuXHJcblx0bGV0IGxJbnN0YW5jZSA9IHtcclxuXHRcdHNwZWVkOiBvcHRzLnNwZWVkIHx8IDEsXHJcblx0XHRpc0RyYXduOiBmYWxzZSxcclxuXHRcdGlzQW5pbWF0ZWQ6IG9wdHMuaXNBbmltYXRlZCB8fCBmYWxzZSxcclxuXHRcdHdpbGxDb25uZWN0OiBvcHRzLndpbGxDb25uZWN0IHx8IGZhbHNlLFxyXG5cdFx0c2t5Rmxhc2hBbHBoYTogb3B0cy5za3lGbGFzaEFscGhhIHx8IDAuMixcclxuXHRcdG9yaWdpbkZsYXNoQWxwaGE6IG9wdHMub3JpZ2luRmxhc2hBbHBoYSB8fCAxLFxyXG5cdFx0Z2xvd0JsdXJJdGVyYXRpb25zOiBjcmVhdGVCbHVyQXJyYXkoXHJcblx0XHRcdG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCAyLCA2ICksXHJcblx0XHRcdDMwLFxyXG5cdFx0XHQxMDAsXHJcblx0XHRcdCdsaW5lYXJFYXNlJ1xyXG5cdFx0KSxcclxuXHRcdGNsb2NrOiAwLFxyXG5cdFx0dG90YWxDbG9jazogb3B0cy53aWxsQ29ubmVjdCA/IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCAxMCwgNjAgKSA6IDAsXHJcblx0XHRzdGF0ZToge1xyXG5cdFx0XHRjdXJyZW50OiAnaXNVbmluaXRpYWxpc2VkJyxcclxuXHRcdFx0c3RhdGVzOiB7XHJcblx0XHRcdFx0aXNVbmluaXRpYWxpc2VkOiB0cnVlLFxyXG5cdFx0XHRcdGlzSW5pdGlhbGlzZWQ6IGZhbHNlLFxyXG5cdFx0XHRcdGlzQWN0aXZlOiBmYWxzZSxcclxuXHRcdFx0XHRpc0RyYXdpbmc6IGZhbHNlLFxyXG5cdFx0XHRcdGlzRHJhd246IGZhbHNlLFxyXG5cdFx0XHRcdGlzQ29ubmVjdGVkOiBmYWxzZSxcclxuXHRcdFx0XHRpc1JlZHJhd2luZzogZmFsc2UsXHJcblx0XHRcdFx0aXNBbmltYXRpbmc6IGZhbHNlLFxyXG5cdFx0XHRcdGlzRmllbGRFZmZlY3Q6IGZhbHNlLFxyXG5cdFx0XHRcdGlzQ291bnRkb3duOiBmYWxzZSxcclxuXHRcdFx0XHRpc0NvdW50ZG93bkNvbXBsZXRlOiBmYWxzZSxcclxuXHRcdFx0XHRpc0NvbXBsZXRlOiBmYWxzZVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0YWN0aW9uczoge1xyXG5cclxuXHRcdH0sXHJcblx0XHRzdGF0ZUFjdGlvbnM6IHtcclxuXHRcdFx0aXNDb25uZWN0ZWQ6IHtcclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHNldFN0YXRlOiBzZXRTdGF0ZSxcclxuXHRcdGdldEN1cnJlbnRTdGF0ZTogZ2V0Q3VycmVudFN0YXRlLFxyXG5cdFx0cmVuZGVyQ29uZmlnOiB7XHJcblx0XHRcdGN1cnJIZWFkOiAwLFxyXG5cdFx0XHRzZWdtZW50c1BlckZyYW1lOiBvcHRzLnNwZWVkIHx8IDFcclxuXHRcdH0sXHJcblx0XHR1cGRhdGVSZW5kZXJDb25maWc6IHVwZGF0ZVJlbmRlckNvbmZpZyxcclxuXHRcdHBhdGhzOiBvcHRzLnRlbXBQYXRocyB8fCBbXVxyXG5cdH07XHJcblxyXG5cdGFyci5wdXNoKCBsSW5zdGFuY2UgKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZUxpZ2h0bmluZ1BhcmVudCA9IGNyZWF0ZUxpZ2h0bmluZ1BhcmVudDtcclxuIiwibGV0IGdsb2JhbENvbmZpZyA9IHJlcXVpcmUoICcuL2dsb2JhbENvbmZpZy5qcycgKTtcclxubGV0IGNyZWF0aW9uQ29uZmlnID0gcmVxdWlyZSggJy4vY3JlYXRpb25Db25maWcuanMnICk7XHJcbmxldCByZW5kZXJDb25maWcgPSByZXF1aXJlKCAnLi9yZW5kZXJDb25maWcuanMnICk7XHJcbmxldCBsTWdyQ2xvY2sgPSByZXF1aXJlKCAnLi9sTWdyQ2xvY2suanMnICk7XHJcbmxldCBzZXRHbG9iYWxJbnRlcnZhbCA9IHJlcXVpcmUoICcuL3NldEdsb2JhbEludGVydmFsLmpzJyApO1xyXG5sZXQgc2V0TG9jYWxDbG9ja1RhcmdldCA9IHJlcXVpcmUoICcuL3NldExvY2FsQ2xvY2tUYXJnZXQuanMnICk7XHJcbmxldCBjcmVhdGVMaWdodG5pbmcgPSByZXF1aXJlKCAnLi9jcmVhdGVMaWdodG5pbmcuanMnICk7XHJcbmxldCBjbGVhck1lbWJlckFycmF5ID0gcmVxdWlyZSggJy4vY2xlYXJNZW1iZXJBcnJheS5qcycgKTtcclxubGV0IHNldENhbnZhc0RldGFpbHMgPSByZXF1aXJlKCAnLi9zZXRDYW52YXNEZXRhaWxzLmpzJyApO1xyXG5sZXQgdXBkYXRlID0gcmVxdWlyZSggJy4vdXBkYXRlQXJyLmpzJyApO1xyXG5sZXQgdXBkYXRlUmVuZGVyQ2ZnID0gcmVxdWlyZSggJy4vdXBkYXRlUmVuZGVyQ2ZnLmpzJyApO1xyXG5sZXQgZHJhd0RlYnVnUmFkaWFsVGVzdCA9IHJlcXVpcmUoICcuL2RyYXdEZWJ1Z1JhZGlhbFRlc3QuanMnICk7XHJcbmxldCBkcmF3RGVidWdMaW5lcyA9IHJlcXVpcmUoICcuL2RyYXdEZWJ1Z0xpbmVzLmpzJyApO1xyXG5sZXQgU2ltcGxleE5vaXNlID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL3NpbXBsZXgtbm9pc2UtbmV3LmpzJyApO1xyXG5cclxubGV0IGxpZ250bmluZ01nciA9IHtcclxuXHRtZW1iZXJzOiBbXSxcclxuXHRkZWJ1Z01lbWJlcnM6IFtdLFxyXG5cdGNhbnZhc0NmZzoge30sXHJcblx0bm9pc2VGaWVsZDogbmV3IFNpbXBsZXhOb2lzZSgpLFxyXG5cdG5vaXNlQ2xvY2s6IDAsXHJcblx0c2V0Q2FudmFzQ2ZnOiBzZXRDYW52YXNEZXRhaWxzLFxyXG5cdGdsb2JhbENvbmZpZzpnbG9iYWxDb25maWcsXHJcblx0Y3JlYXRpb25Db25maWc6IGNyZWF0aW9uQ29uZmlnLFxyXG5cdHJlbmRlckNvbmZpZzogcmVuZGVyQ29uZmlnLFxyXG5cdGNsb2NrOiBsTWdyQ2xvY2ssXHJcblx0Y2xlYXJNZW1iZXJBcnJheTogY2xlYXJNZW1iZXJBcnJheSxcclxuXHRzZXRMb2NhbENsb2NrVGFyZ2V0OiBzZXRMb2NhbENsb2NrVGFyZ2V0LFxyXG5cdHNldEdsb2JhbEludGVydmFsOiBzZXRHbG9iYWxJbnRlcnZhbCxcclxuXHRjcmVhdGVMaWdodG5pbmc6IGNyZWF0ZUxpZ2h0bmluZyxcclxuXHR1cGRhdGU6IHVwZGF0ZSxcclxuXHR1cGRhdGVSZW5kZXJDZmc6IHVwZGF0ZVJlbmRlckNmZyxcclxuXHRkcmF3RGVidWdSYWRpYWxUZXN0OiBkcmF3RGVidWdSYWRpYWxUZXN0LFxyXG5cdGRyYXdEZWJ1Z0xpbmVzOiBkcmF3RGVidWdMaW5lc1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpZ250bmluZ01ncjsiLCJsZXQgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL21hdGhVdGlscy5qcycgKTtcclxubGV0IGxpZ2h0bmluZ1N0cmlrZVRpbWVNYXggPSAzMDA7XHJcbmxldCBzdHJpa2VEcmF3VGltZSA9IGxpZ2h0bmluZ1N0cmlrZVRpbWVNYXggLyAyO1xyXG5sZXQgc3RyaWtlRmlyZVRpbWUgPSBsaWdodG5pbmdTdHJpa2VUaW1lTWF4IC8gNjtcclxubGV0IHN0cmlrZUNvb2xUaW1lID0gbGlnaHRuaW5nU3RyaWtlVGltZU1heCAvIDM7XHJcblxyXG5jb25zdCByZW5kZXJDb25maWcgPSB7XHJcblx0Ymx1ckl0ZXJhdGlvbnM6IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCA1LCA4ICksXHJcblx0Ymx1clJlbmRlck9mZnNldDogMTAwMDAsXHJcblx0Y3VyckhlYWQ6IDAsXHJcblx0dGltaW5nOiB7XHJcblx0XHRtYXg6IGxpZ2h0bmluZ1N0cmlrZVRpbWVNYXgsXHJcblx0XHRkcmF3OiBzdHJpa2VEcmF3VGltZSxcclxuXHRcdGZpcmU6IHN0cmlrZUZpcmVUaW1lLFxyXG5cdFx0Y29vbDogc3RyaWtlQ29vbFRpbWUsXHJcblx0XHRzZWdtZW50c1BlckZyYW1lOiAxXHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlckNvbmZpZzsiLCJmdW5jdGlvbiBzZXRDYW52YXNEZXRhaWxzKCBjYW52YXNJZCApIHtcclxuXHRsZXQgY2FudmFzSW5zdGFuY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBjYW52YXNJZCApO1xyXG5cdGxldCBjdHggPSBjYW52YXNJbnN0YW5jZS5nZXRDb250ZXh0KCcyZCcpO1xyXG5cdGxldCBjVyA9IGNhbnZhc0luc3RhbmNlLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblx0bGV0IGNIID0gY2FudmFzSW5zdGFuY2UuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuXHR0aGlzLmNhbnZhc0NmZy5jYW52YXMgPSBjYW52YXNJbnN0YW5jZTtcclxuXHR0aGlzLmNhbnZhc0NmZy5jID0gY3R4O1xyXG5cdHRoaXMuY2FudmFzQ2ZnLmNXID0gY1c7XHJcblx0dGhpcy5jYW52YXNDZmcuY0ggPSBjSDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYW52YXNEZXRhaWxzOyIsImxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5cclxuZnVuY3Rpb24gc2V0R2xvYmFsSW50ZXJ2YWwoKSB7XHJcblx0dGhpcy5nbG9iYWxDb25maWcuaW50ZXJ2YWxDdXJyZW50ID0gbWF0aFV0aWxzLnJhbmRvbShcclxuXHRcdHRoaXMuZ2xvYmFsQ29uZmlnLGludGVydmFsTWluLFxyXG5cdFx0dGhpcy5nbG9iYWxDb25maWcsaW50ZXJ2YWxNYXhcclxuXHRcdCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2V0R2xvYmFsSW50ZXJ2YWw7IiwiZnVuY3Rpb24gc2V0TG9jYWxDbG9ja1RhcmdldCggdGFyZ2V0ICkge1xyXG5cdFx0aWYoIHRhcmdldCApIHtcclxuXHRcdFx0dGhpcy5jbG9jay5sb2NhbC50YXJnZXQgPSB0YXJnZXQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmNsb2NrLmxvY2FsLnRhcmdldCA9IHRoaXMuZ2xvYmFsQ29uZmlnLmludGVydmFsQ3VycmVudDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNldExvY2FsQ2xvY2tUYXJnZXQ7IiwibGV0IG1hdGhVdGlscyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9tYXRoVXRpbHMuanMnICk7XHJcblxyXG5mdW5jdGlvbiB1cGRhdGUoIGMgKXtcclxuXHRsZXQgcmVuZGVyQ2ZnID0gdGhpcy5yZW5kZXJDb25maWc7XHJcblx0bGV0IG1MZW4gPSB0aGlzLm1lbWJlcnMubGVuZ3RoO1xyXG5cdGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2xpZ2h0ZXInO1xyXG5cclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IG1MZW47IGkrKyApIHtcclxuXHRcdGxldCBtID0gdGhpcy5tZW1iZXJzWyBpIF07XHJcblxyXG5cdFx0aWYgKCBtICE9PSB1bmRlZmluZWQgKSB7XHJcblxyXG5cdFx0XHRsZXQgbVN0YXRlID0gbS5zdGF0ZS5zdGF0ZXM7XHJcblx0XHRcdGxldCBjdXJyU3RhdGUgPSBtLmdldEN1cnJlbnRTdGF0ZSgpO1xyXG5cclxuXHRcdFx0aWYoIGN1cnJTdGF0ZSA9PT0gJ2lzQ291bnRkb3duJyApIHtcclxuXHRcdFx0XHRsZXQgbUNsb2NrID0gbS5jbG9jaztcclxuXHRcdFx0XHRsZXQgbVRvdGFsQ2xvY2sgPSBtLnRvdGFsQ2xvY2s7XHJcblx0XHRcdFx0aWYgKCBtQ2xvY2sgPCBtVG90YWxDbG9jayApIHtcclxuXHRcdFx0XHRcdG0uY2xvY2srKztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bS5jbG9jayA9IDA7XHJcblx0XHRcdFx0XHRpZiAoIG1TdGF0ZS5pc0NvbXBsZXRlID09PSBmYWxzZSApIHtcclxuXHRcdFx0XHRcdFx0bS50b3RhbENsb2NrID0gbWF0aFV0aWxzLnJhbmRvbUludGVnZXIoIDEwLCA1MCApO1xyXG5cdFx0XHRcdFx0XHRtLnNldFN0YXRlKCAnaXNDb3VudGRvd24nICk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRtLnNldFN0YXRlKCAnaXNDb3VudGRvd25Db21wbGV0ZScgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggbVN0YXRlLmlzRHJhd24gPT09IHRydWUgJiYgbS53aWxsQ29ubmVjdCA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0XHRpZiAoIG1TdGF0ZS5pc0Nvbm5lY3RlZCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHRtLnNldFN0YXRlKCAnaXNDb25uZWN0ZWQnICk7XHJcblx0XHRcdFx0XHRtLnNldFN0YXRlKCAnaXNGaWVsZEVmZmVjdCcgKTtcclxuXHRcdFx0XHRcdG0uc2V0U3RhdGUoICdpc0NvdW50ZG93bicgKTtcclxuXHRcdFx0XHRcdG0udG90YWxDbG9jayA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCAxMCwgNTAgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG0udXBkYXRlUmVuZGVyQ29uZmlnKCk7XHJcblx0XHRcdGZvciggbGV0IGogPSAwOyBqIDwgbS5wYXRocy5sZW5ndGg7IGorKyApIHtcclxuXHRcdFx0XHRsZXQgdGhpc1BhdGhDZmcgPSBtLnBhdGhzWyBqIF07XHJcblx0XHRcdFx0aWYgKCB0aGlzUGF0aENmZy5pc0NoaWxkID09PSBmYWxzZSAmJiB0aGlzUGF0aENmZy5pc0FjdGl2ZSA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1lbWJlcnMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdFx0aS0tO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXNQYXRoQ2ZnLnJlbmRlciggYywgbSwgdGhpcyApLnVwZGF0ZSggbSwgdGhpcyApO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHR9XHJcblx0Yy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnc291cmNlLW92ZXInO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVwZGF0ZTsiLCJmdW5jdGlvbiB1cGRhdGVSZW5kZXJDZmcoKSB7XHJcblx0XHRsZXQgbWVtYmVycyA9IHRoaXMubWVtYmVycztcclxuXHRcdGxldCBtZW1MZW4gPSBtZW1iZXJzLmxlbmd0aDtcclxuXHRcdGZvciggbGV0IGkgPSAwOyBpIDw9IG1lbUxlbiAtIDE7IGkrKyApIHtcclxuXHRcdFx0bWVtYmVyc1sgaSBdLnVwZGF0ZVJlbmRlckNvbmZpZygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlUmVuZGVyQ2ZnOyIsImZ1bmN0aW9uIGNhbGN1bGF0ZVN1YkRSYXRlKCBsZW5ndGgsIHRhcmdldExlbmd0aCwgc3ViRFJhdGUgKSB7XHJcblx0bGV0IGxEaXYgPSB0YXJnZXRMZW5ndGggLyBsZW5ndGg7XHJcblx0bGV0IGxEaXZDYWxjID0gc3ViRFJhdGUgLSBNYXRoLmZsb29yKCBsRGl2ICk7XHJcblx0aWYgKCBsRGl2Q2FsYyA8PSAxICkgcmV0dXJuIDE7XHJcblx0aWYgKCBsRGl2ID4gMiApIHJldHVybiBsRGl2Q2FsYztcclxuXHRyZXR1cm4gc3ViRFJhdGU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2FsY3VsYXRlU3ViRFJhdGU7IiwibGV0IG1hdGhVdGlscyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9tYXRoVXRpbHMuanMnICk7XHJcbmxldCBlYXNpbmcgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvZWFzaW5nLmpzJyApLmVhc2luZ0VxdWF0aW9ucztcclxubGV0IHRyaWcgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvdHJpZ29ub21pY1V0aWxzLmpzJyApLnRyaWdvbm9taWNVdGlscztcclxuXHJcbmZ1bmN0aW9uIGNoZWNrUG9pbnRJbmRleCggaSwgbGVuICkge1xyXG5cdHJldHVybiBpID09PSAwID8gMSA6IGkgPT09IGxlbiAtIDEgPyBsZW4gLSAyIDogaTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUGF0aENvbmZpZyggdGhpc1BhdGgsIG9wdGlvbnMgKSB7XHJcblx0bGV0IHRoaXNQYXRoQ2ZnID0gdGhpc1BhdGg7XHJcblx0bGV0IHAgPSB0aGlzUGF0aENmZy5wYXRoO1xyXG5cdGxldCBwTGVuID0gcC5sZW5ndGg7XHJcblxyXG5cdGxldCBvcHRzID0gb3B0aW9ucztcclxuXHRsZXQgcGF0aEluZGV4ID0gb3B0cy5wYXRoSW5kZXg7XHJcblx0bGV0IHBhdGhBbmdsZVNwcmVhZCA9IG9wdHMucGF0aEFuZ2xlU3ByZWFkIHx8IDAuMjtcclxuXHRsZXQgYnJhbmNoRGVwdGggPSBvcHRzLmJyYW5jaERlcHRoIHx8IDA7XHJcblxyXG5cdC8vIHNldHVwIHNvbWUgdmFycyB0byBwbGF5IHdpdGhcclxuXHRsZXQgcEluZGV4LCBwMSwgcDIsIHAzLCBwNCwgdGhldGEsIHJPZmZzZXQ7XHJcblx0Ly8gYW5nbGUgdmFyaWF0aW9uIHJhbmRvbWlzZXJcclxuXHRsZXQgdiA9ICggMiAqIE1hdGguUEkgKSAqIHBhdGhBbmdsZVNwcmVhZDtcclxuXHJcblx0Ly8gaWYgcGF0aCBpcyBvbmx5IHN0YXJ0L2VuZCBwb2ludHNcclxuXHRpZiAoIHBMZW4gPT09IDIgKSB7XHJcblx0XHRjb25zb2xlLmxvZyggYHBMZW4gPT09IDJgICk7XHJcblx0XHRwMSA9IHBbIDAgXTtcclxuXHRcdHAzID0gcFsgMSBdO1xyXG5cdFx0cDIgPSB0cmlnLnN1YmRpdmlkZShwMS54LCBwMS55LCBwMy54LCBwMy55LCAwLjUpO1xyXG5cdFx0ck9mZnNldCA9IHRoaXNQYXRoQ2ZnLnJlbmRlck9mZnNldCArIDE7XHJcblx0fVxyXG5cdGlmICggcExlbiA+IDIgKSB7XHJcblx0XHRwSW5kZXggPSBjaGVja1BvaW50SW5kZXgoIG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCAwLCBwTGVuIC0gMSApLCBwTGVuICk7XHJcblx0XHRwMSA9IHBbIHBJbmRleCAtIDEgXTtcclxuXHRcdHAyID0gcFsgcEluZGV4IF07XHJcblx0XHRwMyA9IHBbIHBJbmRleCArIDEgXTtcclxuXHRcdHJPZmZzZXQgPSB0aGlzUGF0aENmZy5yZW5kZXJPZmZzZXQgKyBwSW5kZXg7XHJcblx0fVxyXG5cclxuXHR0aGV0YSA9IHRoaXNQYXRoQ2ZnLmJhc2VBbmdsZSArIG1hdGhVdGlscy5yYW5kb20oIC12LCB2ICk7XHJcblx0bGV0IG1heEQgPSB0cmlnLmRpc3QoIHAyLngsIHAyLnksIHBbIHBMZW4gLSAxXS54LCBwWyBwTGVuIC0gMSBdLnkpO1xyXG5cdFxyXG5cdGxldCBkVmFyID0gbWF0aFV0aWxzLnJhbmRvbSggMCwgbWF4RCApO1xyXG5cdC8vIGNvbnNvbGUubG9nKCAncmFuZFRoZXRhOiAnLCByYW5kVGhldGEgKTtcclxuXHRsZXQgYnJhbmNoRW5kcG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbiggcDIueCwgcDIueSwgZFZhciwgdGhldGEgKTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGJyYW5jaERlcHRoOiBicmFuY2hEZXB0aCxcclxuXHRcdHJlbmRlck9mZnNldDogck9mZnNldCxcclxuXHRcdHN0YXJ0WDogcDIueCxcclxuXHRcdHN0YXJ0WTogcDIueSxcclxuXHRcdGVuZFg6IGJyYW5jaEVuZHBvaW50LngsXHJcblx0XHRlbmRZOiBicmFuY2hFbmRwb2ludC55LFxyXG5cdFx0ZFJhbmdlOiBkVmFyXHJcblx0fTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVQYXRoQ29uZmlnOyIsIlxyXG5sZXQgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL21hdGhVdGlscy5qcycgKTtcclxubGV0IGVhc2luZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5sZXQgdHJpZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy90cmlnb25vbWljVXRpbHMuanMnICkudHJpZ29ub21pY1V0aWxzO1xyXG5cclxubGV0IHBsb3RQb2ludHMgPSByZXF1aXJlKCAnLi9wbG90UGF0aFBvaW50cy5qcycgKTtcclxubGV0IGRyYXdQYXRocyA9IHJlcXVpcmUoICcuL2RyYXdQYXRoLmpzJyApO1xyXG5sZXQgcmVkcmF3UGF0aCA9IHJlcXVpcmUoICcuL3JlZHJhd1BhdGhzLmpzJyApO1xyXG5sZXQgdXBkYXRlUGF0aCA9IHJlcXVpcmUoICcuL3VwZGF0ZVBhdGguanMnICk7XHJcbmxldCByZW5kZXJQYXRoID0gcmVxdWlyZSggJy4vcmVuZGVyUGF0aC5qcycgKTtcclxuXHJcbmxldCBjaGlsZFBhdGhBbmltU2VxdWVuY2UgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL2NoaWxkUGF0aEFuaW1TZXF1ZW5jZS5qc2AgKTtcclxubGV0IG1haW5QYXRoQW5pbVNlcXVlbmNlID0gcmVxdWlyZSggYC4uL3NlcXVlbmNlci9tYWluUGF0aEFuaW1TZXF1ZW5jZS5qc2AgKTtcclxubGV0IHN0YXJ0U2VxdWVuY2UgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL3N0YXJ0U2VxdWVuY2UuanNgICk7XHJcbmxldCB1cGRhdGVTZXF1ZW5jZUNsb2NrID0gcmVxdWlyZSggYC4uL3NlcXVlbmNlci91cGRhdGVTZXF1ZW5jZUNsb2NrLmpzYCApO1xyXG5sZXQgdXBkYXRlU2VxdWVuY2UgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL3VwZGF0ZVNlcXVlbmNlLmpzYCApO1xyXG5sZXQgc2V0dXBTZXF1ZW5jZXMgPSByZXF1aXJlKCBgLi4vc2VxdWVuY2VyL3NldHVwU2VxdWVuY2VzLmpzYCApO1xyXG5cclxuLy8gbGlnaHRuaW5nIHBhdGggY29uc3RydWN0b3JcclxuXHJcbi8vIGxldCBkcmF3UGF0aFNlcXVlbmNlID0ge1xyXG4vLyBcdGlzQWN0aXZlOiBmYWxzZSxcclxuLy8gXHR0aW1lOiAxMDBcclxuLy8gfVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlUGF0aEZyb21PcHRpb25zKCBvcHRzICkge1xyXG5cclxuXHRsZXQgbmV3UGF0aCA9IHBsb3RQb2ludHMoe1xyXG5cdFx0c3RhcnRYOiBvcHRzLnN0YXJ0WCxcclxuXHRcdHN0YXJ0WTogb3B0cy5zdGFydFksXHJcblx0XHRlbmRYOiBvcHRzLmVuZFgsXHJcblx0XHRlbmRZOiBvcHRzLmVuZFksXHJcblx0XHRzdWJkaXZpc2lvbnM6IG9wdHMuc3ViZGl2aXNpb25zLFxyXG5cdFx0ZFJhbmdlOiBvcHRzLmRSYW5nZSwgXHJcblx0XHRpc0NoaWxkOiBvcHRzLmlzQ2hpbGRcclxuXHR9KTtcclxuXHJcblx0Ly8gY29uc29sZS5sb2coICduZXdQYXRoTGVuOiAnLCBvcHRzLmlzQ2hpbGQgPT09IGZhbHNlID8gbmV3UGF0aC5sZW5ndGggOiBmYWxzZSApO1xyXG5cclxuXHRsZXQgY2hvc2VuU2VxdWVuY2UgPSBvcHRzLnNlcXVlbmNlcyB8fCBtYWluUGF0aEFuaW1TZXF1ZW5jZTtcclxuXHRsZXQgdGhpc1NlcXVlbmNlcyA9IHNldHVwU2VxdWVuY2VzKCBjaG9zZW5TZXF1ZW5jZSApO1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0Ly8gZmxhZ3NcclxuXHRcdGlzQ2hpbGQ6IG9wdHMuaXNDaGlsZCB8fCBmYWxzZSxcclxuXHRcdGlzQWN0aXZlOiBvcHRzLmlzQWN0aXZlIHx8IGZhbHNlLFxyXG5cdFx0aXNSZW5kZXJpbmc6IG9wdHMuaXNSZW5kZXJpbmcgfHwgZmFsc2UsXHJcblx0XHR3aWxsU3RyaWtlOiBvcHRzLndpbGxTdHJpa2UgfHwgZmFsc2UsXHJcblx0XHQvLyBjb25maWdcclxuXHRcdGJyYW5jaERlcHRoOiBvcHRzLmJyYW5jaERlcHRoIHx8IDAsXHJcblx0XHQvLyBjb21wdXRlZCBjb25maWdcclxuXHRcdGJhc2VBbmdsZTogdHJpZy5hbmdsZSggb3B0cy5zdGFydFgsIG9wdHMuc3RhcnRZLCBvcHRzLmVuZFgsIG9wdHMuZW5kWSApLFxyXG5cdFx0YmFzZURpc3Q6IHRyaWcuZGlzdCggb3B0cy5zdGFydFgsIG9wdHMuc3RhcnRZLCBvcHRzLmVuZFgsIG9wdHMuZW5kWSApLFxyXG5cdFx0Ly8gY29sb3JzXHJcblx0XHRjb2xSOiBvcHRzLnBhdGhDb2xSIHx8IDI1NSxcclxuXHRcdGNvbEc6IG9wdHMucGF0aENvbEcgfHwgMjU1LFxyXG5cdFx0Y29sQjogb3B0cy5wYXRoQ29sQiB8fCAyNTUsXHJcblx0XHRjb2xBOiBvcHRzLmlzQ2hpbGQgPyAwLjUgOiBvcHRzLnBhdGhDb2xBID8gb3B0cy5wYXRoQ29sQSA6IDEsXHJcblx0XHRnbG93Q29sUjogIG9wdHMuZ2xvd0NvbFIgfHwgMjU1LFxyXG5cdFx0Z2xvd0NvbEc6ICBvcHRzLmdsb3dDb2xHIHx8IDI1NSxcclxuXHRcdGdsb3dDb2xCOiAgb3B0cy5nbG93Q29sQiB8fCAyNTUsXHJcblx0XHRnbG93Q29sQTogIG9wdHMuZ2xvd0NvbEEgfHwgMSxcclxuXHRcdGxpbmVXaWR0aDogMSxcclxuXHRcdC8vIGNsb2Nrc1xyXG5cdFx0Y2xvY2s6IG9wdHMuY2xvY2sgfHwgMCxcclxuXHRcdHNlcXVlbmNlQ2xvY2s6IG9wdHMuc2VxdWVuY2VDbG9jayB8fCAwLFxyXG5cdFx0dG90YWxDbG9jazogb3B0cy50b3RhbENsb2NrIHx8IDAsXHJcblx0XHQvLyBhbmltIHNlcXVlbmNlc1xyXG5cdFx0Ly8gbWFpbiBkcmF3IHNlcXVlbmNlXHJcblx0XHRkcmF3UGF0aFNlcXVlbmNlOiBvcHRzLmlzQ2hpbGQgPyBmYWxzZSA6IHRydWUsXHJcblx0XHQvLyBhZGRpdGlvbmFsIHNlcXVlbmNlc1xyXG5cdFx0c2VxdWVuY2VzOiB0aGlzU2VxdWVuY2VzLFxyXG5cdFx0c2VxdWVuY2VTdGFydEluZGV4OiBvcHRzLnNlcXVlbmNlU3RhcnRJbmRleCB8fCAwLFxyXG5cdFx0c2VxdWVuY2VJbmRleDogb3B0cy5zZXF1ZW5jZUluZGV4IHx8IDAsXHJcblx0XHRwbGF5U2VxdWVuY2U6IGZhbHNlLFxyXG5cdFx0Y3VyclNlcXVlbmNlOiBmYWxzZSxcclxuXHRcdHN0YXJ0U2VxdWVuY2U6IHN0YXJ0U2VxdWVuY2UsXHJcblx0XHR1cGRhdGVTZXF1ZW5jZTogdXBkYXRlU2VxdWVuY2UsXHJcblx0XHR1cGRhdGVTZXF1ZW5jZUNsb2NrOiB1cGRhdGVTZXF1ZW5jZUNsb2NrLFxyXG5cdFx0ZHJhd1BhdGhzOiBkcmF3UGF0aHMsXHJcblx0XHRyZWRyYXdQYXRoOiByZWRyYXdQYXRoLFxyXG5cdFx0dXBkYXRlOiB1cGRhdGVQYXRoLFxyXG5cdFx0cmVuZGVyOiByZW5kZXJQYXRoLFxyXG5cdFx0Ly8gcGF0aCByZW5kZXJpbmcgZmxhZ3NcclxuXHRcdHJlbmRlck9mZnNldDogb3B0cy5yZW5kZXJPZmZzZXQgfHwgMCxcclxuXHRcdGN1cnJIZWFkUG9pbnQ6IDAsXHJcblx0XHQvLyB0aGUgYWN0dWFsIHBhdGhcclxuXHRcdHBhdGg6IG5ld1BhdGgsXHJcblx0XHQvLyBzYXZlZCBwYXRoc1xyXG5cdFx0c2F2ZWRQYXRoczoge1xyXG5cdFx0XHRtYWluOiBuZXcgUGF0aDJEKCksXHJcblx0XHRcdG9mZnNldDogbmV3IFBhdGgyRCgpLFxyXG5cdFx0XHRvcmlnaW5TaG9ydDogbmV3IFBhdGgyRCgpLFxyXG5cdFx0XHRvcmlnaW5Mb25nOiBuZXcgUGF0aDJEKClcclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVBhdGhGcm9tT3B0aW9uczsiLCIvLyB3cmFwIGluIGNvbmRpdGlvbiB0byBjaGVjayBpZiBkcmF3aW5nIGlzIHJlcXVpcmVkXHJcbmNvbnN0IGNsID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL2NsLmpzJyApO1xyXG5cclxuZnVuY3Rpb24gZHJhd1BhdGhzKCByZW5kZXJDZmcsIHBhcmVudCApIHtcclxuXHQvLyBwb2ludGVyc1xyXG5cdGxldCB0aGlzQ2ZnID0gdGhpcztcclxuXHRsZXQgeyBjdXJySGVhZDogbWFzdGVySGVhZFBvaW50LCBzZWdtZW50c1BlckZyYW1lIH0gPSByZW5kZXJDZmc7XHJcblx0bGV0IHsgcGF0aDogcGF0aEFyciwgc2F2ZWRQYXRocywgcmVuZGVyT2Zmc2V0OiBwYXRoU3RhcnRQb2ludCwgY3VyckhlYWRQb2ludDogY3VycmVudEhlYWRQb2ludCB9ID0gdGhpc0NmZztcclxuXHRsZXQgcGF0aEFyckxlbiA9IHBhdGhBcnIubGVuZ3RoO1xyXG5cdGxldCBzdGFydFBvaW50SW5kZXggPSAwO1xyXG5cdGxldCBlbmRQb2ludEluZGV4ID0gMDtcclxuXHJcblx0Ly8gZWFybHkgcmV0dXJuIG91dCBvZiBmdW5jdGlvbiBpZiB3ZSBoYXZlbid0IHJlYWNoZWQgdGhlIHBhdGggc3RhcnQgcG9pbnQgeWV0IE9SIHRoZSBjdXJyZW50SGVhZFBvaW50IGlzIGdyZWF0ZXIgdGhhbiB0aGUgcGF0aEFycmF5TGVuZ3RoXHJcblx0aWYgKCBwYXRoU3RhcnRQb2ludCA+IG1hc3RlckhlYWRQb2ludCApIHJldHVybjtcclxuXHJcblx0aWYgKCBjdXJyZW50SGVhZFBvaW50ID49IHBhdGhBcnJMZW4gKSB7XHJcblx0XHRpZiAoIHRoaXNDZmcuaXNDaGlsZCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdHBhcmVudC5pc0RyYXduID0gdHJ1ZTtcclxuXHRcdFx0cGFyZW50LnNldFN0YXRlKCAnaXNEcmF3bicgKTtcclxuXHRcdH1cclxuXHRcdHJldHVybjsgXHJcblx0fVxyXG5cclxuXHRzdGFydFBvaW50SW5kZXggPSBjdXJyZW50SGVhZFBvaW50ID09PSAwID8gY3VycmVudEhlYWRQb2ludCA6IGN1cnJlbnRIZWFkUG9pbnQ7XHJcblx0ZW5kUG9pbnRJbmRleCA9IE1hdGguZmxvb3IoIGN1cnJlbnRIZWFkUG9pbnQgKyBzZWdtZW50c1BlckZyYW1lID4gcGF0aEFyckxlbiA/IHBhdGhBcnJMZW4gOiBjdXJyZW50SGVhZFBvaW50ICsgc2VnbWVudHNQZXJGcmFtZSApO1xyXG5cclxuXHRmb3IoIGxldCBpID0gc3RhcnRQb2ludEluZGV4OyBpIDwgZW5kUG9pbnRJbmRleDsgaSsrICkge1xyXG5cdFx0bGV0IHAgPSBwYXRoQXJyWyBpIF07XHJcblx0XHRpZiAoIGkgPT09IDAgKSB7XHJcblx0XHRcdHNhdmVkUGF0aHMubWFpbi5tb3ZlVG8oIHAueCwgcC55ICk7XHJcblx0XHRcdHNhdmVkUGF0aHMub2Zmc2V0Lm1vdmVUbyggcC54LCBwLnkgLSAxMDAwMCApO1xyXG5cdFx0XHRzYXZlZFBhdGhzLm9yaWdpbkxvbmcubW92ZVRvKCBwLngsIHAueSAtIDEwMDAwICk7XHJcblx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0fVxyXG5cdFx0c2F2ZWRQYXRocy5tYWluLmxpbmVUbyggcC54LCBwLnkgKTtcclxuXHRcdHNhdmVkUGF0aHMub2Zmc2V0LmxpbmVUbyggcC54LCBwLnkgLSAxMDAwMCApO1xyXG5cclxuXHRcdGlmICggaSA8IDIwICkge1xyXG5cdFx0XHRzYXZlZFBhdGhzLm9yaWdpbkxvbmcubGluZVRvKCBwLngsIHAueSAtIDEwMDAwICk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHRoaXMuY3VyckhlYWRQb2ludCA9IGVuZFBvaW50SW5kZXg7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRyYXdQYXRoczsiLCJjb25zdCBjbCA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9jbC5qcycgKTtcclxuXHJcbmxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5sZXQgZWFzaW5nID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL2Vhc2luZy5qcycgKS5lYXNpbmdFcXVhdGlvbnM7XHJcbmxldCB0cmlnID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL3RyaWdvbm9taWNVdGlscy5qcycgKS50cmlnb25vbWljVXRpbHM7XHJcblxyXG4vLyBsaWdodG5pbmcgcGF0aCBjb25zdHJ1Y3RvclxyXG5cclxuXHJcbi8qKlxyXG4qIEBuYW1lIHBsb3RQYXRoUG9pbnRzXHJcbiogQGRlc2NyaXB0aW9uIGdpdmVuIGFuIG9yaWdpbiBwbG90IGEgcGF0aCwgcmFuZG9taXNlZCBhbmQgc3ViZGl2aWRlZCwgdG8gYSB0YXJnZXQuXHJcbiogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSB0aGUgY29uc3RydWN0b3IgY29uZmlndXJhdGlvbiBvYmplY3QuXHJcbiogQHBhcmFtIHtudW1iZXJ9IG9wdGlvbnMuc3RhcnRYIC0gdGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgcGF0aCBzdGFydCBwb2ludC5cclxuKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5zdGFydFkgLSB0aGUgWFljb29yZGluYXRlIG9mIHRoZSBwYXRoIHN0YXJ0IHBvaW50LlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBvcHRpb25zLmVuZFggLSB0aGUgWCBjb29yZGluYXRlIG9mIHRoZSBwYXRoIGVuZCBwb2ludC5cclxuKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5lbmRZIC0gdGhlIFkgY29vcmRpbmF0ZSBvZiB0aGUgcGF0aCBlbmQgcG9pbnQuXHJcbiogQHBhcmFtIHtib29sZWFufSBvcHRpb25zLmlzQ2hpbGQgLSBpcyB0aGlzIHBhdGggaW5zdGFuY2UgYSBjaGlsZC9zdWJwYXRoIG9mIGEgcGFyZW50Py5cclxuKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5zdWJkaXZpc2lvbnMgLSB0aGUgbGV2ZWwgb2YgcGF0aCBzdWJkaXZpc2lvbnMuXHJcbiogQHJldHVybnMge2FycmF5fSB0aGUgcGF0aCBhcyBhIHZlY3RvciBjb29yZGluYXRlIHNldC5cclxuICovXHJcbmZ1bmN0aW9uIHBsb3RQYXRoUG9pbnRzKCBvcHRpb25zICkge1xyXG5cdFx0XHJcblx0bGV0IG9wdHMgPSBvcHRpb25zO1xyXG5cdGxldCBzdWJEID0gb3B0cy5zdWJkaXZpc2lvbnM7XHJcblx0bGV0IHRlbXAgPSBbXTtcclxuXHJcblx0dGVtcC5wdXNoKCB7IHg6IG9wdHMuc3RhcnRYLCB5OiBvcHRzLnN0YXJ0WSB9ICk7XHJcblx0dGVtcC5wdXNoKCB7IHg6IG9wdHMuZW5kWCwgeTogb3B0cy5lbmRZIH0gKTtcclxuXHJcblx0bGV0IHRSYW5nZSA9IG9wdHMudFJhbmdlIHx8IDAuMzU7XHJcblx0bGV0IGlzQ2hpbGQgPSBvcHRzLmlzQ2hpbGQgfHwgdHJ1ZTtcclxuXHRsZXQgdkNoaWxkID0gaXNDaGlsZCA/IDggOiAyO1xyXG5cclxuXHQvLyBzZXQgdXAgc29tZSB2YXJzIHRvIHBsYXkgd2l0aFxyXG5cdGxldCBtaW5ELCBtYXhELCBjYWxjRDtcclxuXHJcblx0Zm9yICggbGV0IGkgPSAwOyBpIDw9IHN1YkQgLSAxOyBpKysgKSB7XHJcblx0XHRsZXQgYXJyTGVuID0gdGVtcC5sZW5ndGg7XHJcblx0XHRsZXQgZGFtcGVyID0gaSA9PT0gMCA/IDEgOiBpO1xyXG5cdFx0Zm9yICggbGV0IGogPSBhcnJMZW4gLSAxOyBqID4gMDsgai0tICkge1xyXG5cdFx0XHRpZiAoIGogPT09IDAgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBwID0gdGVtcFsgaiBdO1xyXG5cdFx0XHRsZXQgcHJldlAgPSB0ZW1wWyBqIC0gMSBdO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gc2V0IHVwIHNvbWUgbnVtYmVycyBmb3IgbWFraW5nIHRoZSBwYXRoXHJcblx0XHRcdC8vIGRpc3RhbmNlIGJldHdlZW4gdGhlIDIgcG9pbnRzXHJcblx0XHRcdGxldCB2RCA9IHRyaWcuZGlzdCggcC54LCBwLnksIHByZXZQLngsIHByZXZQLnkgKSAvIDI7XHJcblx0XHRcdC8vIHJhbmRvbSBwb3NpdGl2ZS9uZWdhdGl2ZSBtdWx0aXBsaWVyXHJcblx0XHRcdGxldCB2RmxpcCA9ICBtYXRoVXRpbHMucmFuZG9tSW50ZWdlciggMSwgMTAgKSA8PSA1ID8gMSA6IC0xO1xyXG5cdFx0XHQvLyBnZXQgdGhlIG1pZCBwb2ludCBiZXdlZW4gdGhlIHR3byBwb2ludHMgKHAgJiBwcmV2UClcclxuXHRcdFx0bGV0IG5QID0gdHJpZy5zdWJkaXZpZGUoIHByZXZQLngsIHByZXZQLnksIHAueCwgcC55LCAwLjUgKTtcclxuXHJcblx0XHRcdC8vIGNhbGN1bGF0ZSBzb21lIG51bWJlcnMgZm9yIHJhbmRvbSBkaXN0YW5jZVxyXG5cdFx0XHRpZiAoIGlzQ2hpbGQgPT09IGZhbHNlICkge1xyXG5cdFx0XHRcdG1pbkQgPSBlYXNpbmcuZWFzZUluUXVpbnQoIGksIHZEIC8gMiwgLSggdkQgLyAyICksIHN1YkQgKTtcclxuXHRcdFx0XHRtYXhEID0gZWFzaW5nLmVhc2VJblF1aW50KCBpLCB2RCwgLXZELCBzdWJEICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bWluRCA9IHZEIC8gMjtcclxuXHRcdFx0XHRtYXhEID0gdkQgLyB2Q2hpbGQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNhbGNEID0gbWF0aFV0aWxzLnJhbmRvbSggbWluRCwgbWF4RCApICogdkZsaXA7XHJcblxyXG5cdFx0XHQvLyB1c2luZyB0aGUgMiBwb2ludHMgKHAgJiBwcmV2UCksIGFuZCB0aGUgZ2VuZXJhdGVkIG1pZHBvaW50IGFzIGEgcHNldWRvIGN1cnZlIHBvaW50XHJcblx0XHRcdGxldCBvZmZzZXRQb2ludCA9IHRyaWcucHJvamVjdE5vcm1hbEF0RGlzdGFuY2UoXHJcblx0XHRcdFx0Ly8gLSBwcm9qZWN0IGEgbmV3IHBvaW50IGF0IHRoZSBub3JtYWwgb2YgdGhlIHBhdGggY3JlYXRlZCBieSBwL25QL3ByZXZQXHJcblx0XHRcdFx0cHJldlAsIG5QLCBwLFxyXG5cdFx0XHRcdC8vIGF0IGEgcmFuZG9tIHBvaW50IGFsb25nIHRoZSBjdXJ2ZSAoYmV0d2VlbiAwLjI1LzAuNzUpXHJcblx0XHRcdFx0bWF0aFV0aWxzLnJhbmRvbSggMC4yNSwgMC43NSApLFxyXG5cdFx0XHRcdC8vIC0gLSBwcm9qZWN0ZWQgYXQgYSBwcm9wb3J0aW9uIG9mIHRoZSBkaXN0YW5jZSAodkQpXHJcblx0XHRcdFx0Ly8gLSAtIC0gY2FsY3VsYXRlZCB0aHJvdWdoIHRoZSB2Q2hpbGQgdmFyaWFibGUgKGRhbXBlZCB0aHJvdWdoIGEgc3dpdGNoIGdlbmVyYXRlZCB0aHJvdWdoIHRoZSBpc0NoaWxkIGZsYWcpIFxyXG5cdFx0XHRcdGNhbGNEXHJcblx0XHRcdCk7XHJcblx0XHRcdC8vIHNwbGljZSBpbiB0aGUgbmV3IHBvaW50IHRvIHRoZSBwb2ludCBhcnJheVxyXG5cdFx0XHR0ZW1wLnNwbGljZSggaiwgMCwgeyB4OiBvZmZzZXRQb2ludC54LCB5OiBvZmZzZXRQb2ludC55IH0gKTtcclxuXHRcdFx0Ly8gcmVjdXJzZSB0aGUgbG9vcCBieSB0aGUgbnVtYmVyIGdpdmVuIGJ5IFwic3ViRFwiLCB0byBzdWJkaXZpbmRlIGFuZCByYW5kb21pc2UgdGhlIGxpbmVcclxuXHRcdH1cclxuXHR9O1xyXG5cdC8vIGNvbnNvbGUubG9nKCBgJHtjbC5kaW19JHtjbC55fXBhdGgubGVuZ3RoOiAke2NsLmJsZH0ke2NsLmJ9JHt0ZW1wLmxlbmd0aH0ke2NsLnJzdH1gICk7XHJcblx0cmV0dXJuIHRlbXA7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHBsb3RQYXRoUG9pbnRzOyIsImZ1bmN0aW9uIHJlZHJhd1BhdGgoIHJlbmRlckNmZywgcGFyZW50LCBnbG9iYWxDb25maWcgKSB7XHJcblxyXG5cdGxldCB0aGlzQ2ZnID0gdGhpcztcclxuXHRsZXQgeyBwYXRoOiBwYXRoQXJyLCBzYXZlZFBhdGhzLCByZW5kZXJPZmZzZXQ6IHBhdGhTdGFydFBvaW50LCBpc0NoaWxkIH0gPSB0aGlzQ2ZnO1xyXG5cdGxldCBwYXRoQXJyTGVuID0gcGF0aEFyci5sZW5ndGg7XHJcblx0bGV0IG5vaXNlRmllbGQgPSBnbG9iYWxDb25maWcubm9pc2VGaWVsZDtcclxuXHRsZXQgbmV3TWFpblBhdGggPSBuZXcgUGF0aDJEKCk7XHJcblx0bGV0IG5ld09mZnNldFBhdGggPSBuZXcgUGF0aDJEKCk7XHJcblx0bGV0IG5ld09yaWdpbkxvbmdQYXRoID0gbmV3IFBhdGgyRCgpO1xyXG5cclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IHBhdGhBcnJMZW47IGkrKyApIHtcclxuXHRcdGxldCBwID0gcGF0aEFyclsgaSBdO1xyXG5cdFx0XHJcblx0XHRsZXQgdCA9IDA7XHJcblx0XHRcclxuXHRcdC8vIG1vZGlmeSBjb3JyZGluYXRlcyB3aXRoIGZpZWxkIGVmZmVjdDpcclxuXHRcdGxldCBmaWVsZE1vZFZhbCA9IG5vaXNlRmllbGQubm9pc2UzRCggcC54LCBwLnksIHQgKTtcclxuXHRcdGxldCB4ID0gcC54ICogZmllbGRNb2RWYWw7XHJcblx0XHRsZXQgeSA9IHAueSAqIGZpZWxkTW9kVmFsO1xyXG5cclxuXHRcdGlmICggaSA9PT0gMCApIHtcclxuXHRcdFx0bmV3TWFpblBhdGgubW92ZVRvKCB4LCB5ICk7XHJcblx0XHRcdG5ld09mZnNldFBhdGgubW92ZVRvKCB4LCB5IC0gMTAwMDAgKTtcclxuXHRcdFx0bmV3T3JpZ2luTG9uZ1BhdGgubW92ZVRvKCB4LCB5IC0gMTAwMDAgKTtcclxuXHRcdFx0Y29udGludWU7XHJcblx0XHR9XHJcblx0XHRuZXdNYWluUGF0aC5saW5lVG8oIHgsIHkgKTtcclxuXHRcdG5ld09mZnNldFBhdGgubGluZVRvKCB4LCB5IC0gMTAwMDAgKTtcclxuXHJcblx0XHRpZiAoIGkgPCAyMCApIHtcclxuXHRcdFx0bmV3T3JpZ2luTG9uZ1BhdGgubGluZVRvKCB4LCB5IC0gMTAwMDAgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRoaXNDZmcuc2F2ZWRQYXRocy5tYWluID0gbmV3TWFpblBhdGg7XHJcblx0dGhpc0NmZy5zYXZlZFBhdGhzLm9mZnNldCA9IG5ld09mZnNldFBhdGg7XHJcblx0dGhpc0NmZy5zYXZlZFBhdGhzLm9yaWdpbkxvbmcgPSBuZXdPcmlnaW5Mb25nUGF0aDtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVkcmF3UGF0aDsiLCJmdW5jdGlvbiBwYXRoR2xvdyggYywgcGF0aENmZywgc2F2ZWRQYXRoLCBnbG93T3B0cyApIHtcclxuXHRsZXQgYmx1cnMgPSBnbG93T3B0cy5ibHVycyB8fCAgWyAxMDAsIDcwLCA1MCwgMzAsIDEwIF07XHJcblx0bGV0IGJsdXJDb2xvciA9IGdsb3dPcHRzLmJsdXJDb2xvciB8fCAnd2hpdGUnO1xyXG5cdGxldCBibHVyU2hhcGVPZmZzZXQgPSBnbG93T3B0cy5ibHVyU2hhcGVPZmZzZXQgfHwgMTAwMDA7XHJcblx0Ly8gYy5saW5lV2lkdGggPSBwYXRoQ2ZnLmxpbmVXaWR0aDtcclxuXHRjLnN0cm9rZVN0eWxlID0gXCJyZWRcIjtcclxuXHRjLmZpbGxTYnR5bGUgPSAnd2hpdGUnO1xyXG5cdGMuc2hhZG93T2Zmc2V0WSA9IGJsdXJTaGFwZU9mZnNldDtcclxuXHRjLnNoYWRvd0NvbG9yID0gYmx1ckNvbG9yO1xyXG5cclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IGJsdXJzLmxlbmd0aCAtIDE7IGkrKyApIHtcclxuXHRcdGMuc2hhZG93Qmx1ciA9IGJsdXJzWyBpIF07XHJcblx0XHRjLmxpbmVXaWR0aCA9IHBhdGhDZmcubGluZVdpZHRoICogMjtcclxuXHRcdGMuc3Ryb2tlKCBzYXZlZFBhdGggKTtcclxuXHR9XHJcblx0Yy5zaGFkb3dCbHVyID0gMDtcclxufVxyXG5cclxuLy8gcGF0aCByZW5kZXJpbmcgZnVuY3Rpb25cclxuZnVuY3Rpb24gcmVuZGVyUGF0aCggYywgcGFyZW50LCBnbG9iYWxDb25maWcgKSB7XHJcblx0XHJcblx0bGV0IHRoaXNDZmcgPSB0aGlzO1xyXG5cdGxldCByZW5kZXJDZmcgPSBwYXJlbnQucmVuZGVyQ29uZmlnO1xyXG5cdGxldCBjdXJyUmVuZGVyUG9pbnQgPSAwO1xyXG5cdGxldCBjdXJyUmVuZGVySGVhZCA9IDA7XHJcblx0bGV0IGN1cnJSZW5kZXJUYWlsID0gMDtcclxuXHRcclxuXHRjb25zdCB7IGlzQ2hpbGQsIGlzUmVuZGVyaW5nLCByZW5kZXJPZmZzZXQsIHNhdmVkUGF0aHMsIHBhdGg6IHRoaXNQYXRoLCBsaW5lV2lkdGgsIGNvbFIsIGNvbEcsIGNvbEIsIGNvbEEsIGdsb3dDb2xSLCBnbG93Q29sRywgZ2xvd0NvbEIsIGdsb3dDb2xBLCBjdXJySGVhZFBvaW50IH0gPSB0aGlzQ2ZnO1xyXG5cdGxldCBwYXRoTGVuID0gdGhpc1BhdGgubGVuZ3RoIC0gMTtcclxuXHJcblx0Y29uc3QgY29tcHV0ZWRQYXRoQ29sb3IgPSBgcmdiYSgke2NvbFJ9LCAke2NvbEd9LCAke2NvbEJ9LCAke2NvbEF9KWA7XHJcblx0Y29uc3QgcGF0aEdsb3dSR0IgPSBgJHtnbG93Q29sUn0sICR7Z2xvd0NvbEd9LCAke2dsb3dDb2xCfWA7XHJcblx0Y29uc3QgcGF0aEdsb3dDb21wdXRlZENvbG9yID0gYHJnYmEoICR7cGF0aEdsb3dSR0J9LCAke2NvbEF9IClgO1xyXG5cdGNvbnN0IGhlYWRHbG93Qmx1ckFyciA9IFsgMjAsIDEwIF07XHJcblx0Y29uc3QgcGF0aEdsb3dPcHRzID0geyBibHVyczogcGFyZW50Lmdsb3dCbHVySXRlcmF0aW9ucywgYmx1ckNvbG9yOiBwYXRoR2xvd0NvbXB1dGVkQ29sb3IgfTtcclxuXHRjb25zdCBwYXRoR2xvd1Nob3J0T3B0cyA9IHsgYmx1cnM6IFsxMjAsIDgwLCA2MCwgNDAsIDMwLCAyMCwgMTUsIDEwLCA1XSwgYmx1ckNvbG9yOiBwYXRoR2xvd0NvbXB1dGVkQ29sb3IgfTtcclxuXHRjb25zdCBoZWFkR2xvd09wdHMgPSB7IGJsdXJzOiBoZWFkR2xvd0JsdXJBcnIsIGJsdXJDb2xvcjogcGF0aEdsb3dDb21wdXRlZENvbG9yIH07XHJcblx0Ly8gc2hhZG93IHJlbmRlciBvZmZzZXRcclxuXHRjb25zdCBzUk8gPSBnbG9iYWxDb25maWcucmVuZGVyQ29uZmlnLmJsdXJSZW5kZXJPZmZzZXQ7XHJcblx0Y29uc3Qgb3JpZ2luID0gdGhpc0NmZy5wYXRoWzBdO1xyXG5cdGNvbnN0IHsgeDogb1gsIHk6IG9ZIH0gPSBvcmlnaW47XHJcblxyXG5cdGlmICggcGFyZW50LmlzRHJhd24gPT09IGZhbHNlICkgeyB0aGlzLmRyYXdQYXRocyggcmVuZGVyQ2ZnLCBwYXJlbnQgKTsgfVxyXG5cdFxyXG5cdGMubGluZVdpZHRoID0gbGluZVdpZHRoO1xyXG5cdGMuc3Ryb2tlU3R5bGUgPSBjb21wdXRlZFBhdGhDb2xvcjtcclxuXHRjLnN0cm9rZSggc2F2ZWRQYXRocy5tYWluICk7XHJcblx0cGF0aEdsb3coIGMsIHRoaXNDZmcsIHNhdmVkUGF0aHMub2Zmc2V0LCBwYXRoR2xvd09wdHMgKTtcclxuXHJcblx0Ly8gaWYgdGhlIG1haW4gcGF0aCBoYXMgXCJjb25uZWN0ZWRcIiBhbmQgaXMgXCJkaXNjaGFyZ2luZ1wiXHJcblx0aWYgKHRoaXNDZmcuaXNDaGlsZCA9PT0gZmFsc2UpIHtcclxuXHJcblx0XHRwYXRoR2xvdyggYywgdGhpc0NmZywgc2F2ZWRQYXRocy5vcmlnaW5Mb25nLCBwYXRoR2xvd09wdHMgKTtcclxuXHRcdHBhdGhHbG93KCBjLCB0aGlzQ2ZnLCBzYXZlZFBhdGhzLm9yaWdpblNob3J0LCBwYXRoR2xvd1Nob3J0T3B0cyApO1xyXG5cclxuXHRcdGlmICggcGFyZW50LmlzRHJhd24gPT09IHRydWUgKSB7XHJcblx0XHRcdC8vIG9yaWdpbiBnbG93IGdyYWRpZW50c1xyXG5cdFx0XHRsZXQgb3JpZ2luID0gdGhpc0NmZy5wYXRoWzBdO1xyXG5cdFx0XHRsZXQgZ3JkID0gYy5jcmVhdGVSYWRpYWxHcmFkaWVudCggb1gsIG9ZLCAwLCBvWCwgb1ksIDEwMjQgKTtcclxuXHRcdFx0Z3JkLmFkZENvbG9yU3RvcCggMCwgcGF0aEdsb3dDb21wdXRlZENvbG9yICk7XHJcblx0XHRcdGdyZC5hZGRDb2xvclN0b3AoIDEsIGByZ2JhKCAke3BhdGhHbG93UkdCfSwgMCApYCApO1xyXG5cclxuXHRcdFx0Yy5maWxsU3R5bGUgPSBncmQ7XHJcblx0XHRcdGMuZmlsbENpcmNsZSggb1gsIG9ZLCAxMDI0ICk7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9XHJcblxyXG5cdGlmICggcGF0aExlbiA+IDQgKSB7XHJcblx0XHRsZXQgZ2xvd0hlYWRQYXRoTCA9IG5ldyBQYXRoMkQoKTtcclxuXHRcdGxldCBnbG93SGVhZFBhdGhTID0gbmV3IFBhdGgyRCgpO1xyXG5cclxuXHRcdGdsb3dIZWFkUGF0aEwubW92ZVRvKCB0aGlzUGF0aFsgcGF0aExlbiAtIDIgXS54LCB0aGlzUGF0aFsgcGF0aExlbiAtIDIgXS55IC0gc1JPICk7XHJcblx0XHRnbG93SGVhZFBhdGhMLmxpbmVUbyggdGhpc1BhdGhbIHBhdGhMZW4gLSAxIF0ueCwgdGhpc1BhdGhbIHBhdGhMZW4gLSAxIF0ueSAtIHNSTyApO1xyXG5cdFx0Z2xvd0hlYWRQYXRoTC5saW5lVG8oIHRoaXNQYXRoWyBwYXRoTGVuIF0ueCwgdGhpc1BhdGhbIHBhdGhMZW4gXS55IC0gc1JPICk7XHJcblx0XHRwYXRoR2xvdyggYywgdGhpc0NmZywgZ2xvd0hlYWRQYXRoTCwgaGVhZEdsb3dPcHRzICk7XHJcblx0XHRcclxuXHRcdGdsb3dIZWFkUGF0aFMubW92ZVRvKCB0aGlzUGF0aFsgcGF0aExlbiAtIDEgXS54LCB0aGlzUGF0aFsgcGF0aExlbiAtIDEgXS55IC0gc1JPICk7XHJcblx0XHRnbG93SGVhZFBhdGhTLmxpbmVUbyggdGhpc1BhdGhbIHBhdGhMZW4gXS54LCB0aGlzUGF0aFsgcGF0aExlbiBdLnkgLSBzUk8gKTtcclxuXHRcdHBhdGhHbG93KCBjLCB0aGlzQ2ZnLCBnbG93SGVhZFBhdGhTLCBoZWFkR2xvd09wdHMgKTtcclxuXHJcblx0fVxyXG5cclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJQYXRoOyIsImxldCBtYXRoVXRpbHMgPSByZXF1aXJlKCAnLi4vLi4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5sZXQgZWFzaW5nID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL2Vhc2luZy5qcycgKS5lYXNpbmdFcXVhdGlvbnM7XHJcbmxldCB0cmlnID0gcmVxdWlyZSggJy4uLy4uL3V0aWxzL3RyaWdvbm9taWNVdGlscy5qcycgKS50cmlnb25vbWljVXRpbHM7XHJcblxyXG4vLyBwYXRoIHVwZGF0ZSBmdW5jdGlvblxyXG5cclxuZnVuY3Rpb24gdXBkYXRlUGF0aCggcGFyZW50Q29uZmlnLCBnbG9iYWxDb25maWcgKSB7XHJcblxyXG5cdGxldCByQ2ZnID0gZ2xvYmFsQ29uZmlnLnJlbmRlckNvbmZpZ1xyXG5cdGxldCBwID0gcGFyZW50Q29uZmlnO1xyXG5cdGxldCBwU3RhdGUgPSBwLnN0YXRlLnN0YXRlcztcclxuXHRsZXQgcGF0aENmZyA9IHRoaXM7XHJcblx0bGV0IHBhdGhMZW4gPSBwYXRoQ2ZnLnBhdGgubGVuZ3RoO1xyXG5cdGxldCBybmRPZmZzZXQgPSBwYXRoQ2ZnLnJlbmRlck9mZnNldDtcclxuXHJcblx0aWYgKCBwU3RhdGUuaXNEcmF3biA9PT0gdHJ1ZSApIHtcclxuXHJcblx0XHRpZiAoIHAud2lsbENvbm5lY3QgPT09IGZhbHNlICkge1xyXG5cdFx0XHRpZiAoIHBhdGhDZmcucGxheVNlcXVlbmNlID09PSBmYWxzZSApIHtcclxuXHRcdFx0XHRwYXRoQ2ZnLnBsYXlTZXF1ZW5jZSA9IHRydWU7IFxyXG5cdFx0XHRcdHBhdGhDZmcuc3RhcnRTZXF1ZW5jZSgge2luZGV4OiAwfSApO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdGlmICggcGF0aExlbiArIHJuZE9mZnNldCA8IHAucmVuZGVyQ29uZmlnLmN1cnJIZWFkKSB7XHJcblx0XHRwYXRoQ2ZnLmlzUmVuZGVyaW5nID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwYXRoQ2ZnLnVwZGF0ZVNlcXVlbmNlKCk7XHJcblxyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHVwZGF0ZVBhdGg7IiwiY29uc3QgYWxwaGFGYWRlT3V0ID0gcmVxdWlyZSggJy4vc2VxdWVuY2VJdGVtcy9hbHBoYUZhZGVPdXQuanMnICk7XHJcblxyXG5sZXQgY2hpbGRQYXRoQW5pbVNlcXVlbmNlID0gW1xyXG5cdHtcclxuXHRcdG5hbWU6ICdsUGF0aENvb2wnLFxyXG5cdFx0dGltZTogMzAsXHJcblx0XHRsaW5rZWRTZXE6ICcnLFxyXG5cdFx0bG9vcDogZmFsc2UsXHJcblx0XHRsb29wQmFjazogZmFsc2UsXHJcblx0XHRmaW5hbDogdHJ1ZSxcclxuXHRcdGl0ZW1zOiBhbHBoYUZhZGVPdXRcclxuXHR9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNoaWxkUGF0aEFuaW1TZXF1ZW5jZTsiLCJjb25zdCBmYWRlVG9SZWRBbmRGYWRlT3V0ID0gcmVxdWlyZSggJy4vc2VxdWVuY2VJdGVtcy9mYWRlVG9SZWRBbmRGYWRlT3V0LmpzJyApO1xyXG5jb25zdCBsaW5lV2lkdGhUbzEwID0gcmVxdWlyZSggJy4vc2VxdWVuY2VJdGVtcy9saW5lV2lkdGhUbzEwLmpzJyApO1xyXG5cclxubGV0IG1haW5QYXRoQW5pbVNlcXVlbmNlID0gW1xyXG5cdHtcclxuXHRcdG5hbWU6ICdsUGF0aEZpcmUnLFxyXG5cdFx0dGltZTogMSxcclxuXHRcdGxpbmtlZFNlcTogJzEnLFxyXG5cdFx0bG9vcDogZmFsc2UsXHJcblx0XHRsb29wQmFjazogZmFsc2UsXHJcblx0XHRpdGVtczogbGluZVdpZHRoVG8xMFxyXG5cdH0sXHJcblx0e1xyXG5cdFx0bmFtZTogJ2xQYXRoQ29vbCcsXHJcblx0XHR0aW1lOiAzMCxcclxuXHRcdGxpbmtlZFNlcTogJycsXHJcblx0XHRsb29wOiBmYWxzZSxcclxuXHRcdGxvb3BCYWNrOiBmYWxzZSxcclxuXHRcdGZpbmFsOiB0cnVlLFxyXG5cdFx0aXRlbXM6IGZhZGVUb1JlZEFuZEZhZGVPdXRcclxuXHR9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5QYXRoQW5pbVNlcXVlbmNlOyIsImNvbnN0IGFscGhhRmFkZU91dCA9IFtcclxuXHR7IHBhcmFtOiAnY29sQScsIHRhcmdldDogMCwgZWFzZWZOOiAnZWFzZU91dFF1aW50JyB9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGFscGhhRmFkZU91dDsiLCJjb25zdCBmYWRlVG9SZWRBbmRGYWRlT3V0ID0gW1xyXG5cdHsgcGFyYW06ICdsaW5lV2lkdGgnLCBzdGFydDogMCwgdGFyZ2V0OiAxLCBlYXNlZk46ICdlYXNlT3V0UXVpbnQnIH0sXHJcblx0eyBwYXJhbTogJ2NvbEcnLCBzdGFydDogMCwgdGFyZ2V0OiAwLCBlYXNlZk46ICdlYXNlT3V0UXVpbnQnIH0sXHJcblx0eyBwYXJhbTogJ2NvbFInLCBzdGFydDogMCwgdGFyZ2V0OiAwLCBlYXNlZk46ICdlYXNlT3V0UXVpbnQnIH0sXHJcblx0eyBwYXJhbTogJ2NvbEEnLCBzdGFydDogMCwgdGFyZ2V0OiAwLCBlYXNlZk46ICdlYXNlT3V0U2luZScgfVxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmYWRlVG9SZWRBbmRGYWRlT3V0OyIsImNvbnN0IGxpbmVXaWR0aFRvMTAgPSBbXHJcblx0eyBwYXJhbTogJ2xpbmVXaWR0aCcsIHN0YXJ0OiAwLCB0YXJnZXQ6IDEwLCBlYXNlZk46ICdsaW5lYXJFYXNlJyB9XHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVXaWR0aFRvMTA7IiwiZnVuY3Rpb24gc2V0dXBTZXF1ZW5jZXMoIHNlcXVlbmNlcyApIHtcclxuXHRsZXQgc2VxdWVuY2VMZW4gPSBzZXF1ZW5jZXMubGVuZ3RoO1xyXG5cdGxldCBzZXFBcnJheSA9IFtdO1xyXG5cdGZvciggbGV0IGkgPSAwOyBpIDwgc2VxdWVuY2VMZW47IGkrKykge1xyXG5cdFx0bGV0IHNlcSA9IHNlcXVlbmNlc1sgaSBdO1xyXG5cdFx0bGV0IHRtcFNlcSA9IHtcclxuXHRcdFx0YWN0aXZlOiBmYWxzZSxcclxuXHRcdFx0Y2xvY2s6IDAsXHJcblx0XHRcdHRvdGFsQ2xvY2s6IHNlcS50aW1lLFxyXG5cdFx0XHRsaW5rZWRTZXE6IHNlcS5saW5rZWRTZXEsXHJcblx0XHRcdG5hbWU6IHNlcS5uYW1lLFxyXG5cdFx0XHRmaW5hbDogc2VxLmZpbmFsLFxyXG5cdFx0XHRpdGVtczogW11cclxuXHRcdH07XHJcblx0XHRmb3IoIGxldCBpID0gMDsgaSA8IHNlcS5pdGVtcy5sZW5ndGg7IGkrKyApe1xyXG5cdFx0XHRsZXQgaXRlbSA9IHNlcS5pdGVtc1sgaSBdO1xyXG5cdFx0XHR0bXBTZXEuaXRlbXMucHVzaChcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRwYXJhbTogaXRlbS5wYXJhbSxcclxuXHRcdFx0XHRcdHN0YXJ0OiAwLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiBpdGVtLnRhcmdldCxcclxuXHRcdFx0XHRcdGVhc2VmTjogaXRlbS5lYXNlZk5cclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHRzZXFBcnJheS5wdXNoKCB0bXBTZXEgKTtcclxuXHR9XHJcblx0cmV0dXJuIHNlcUFycmF5O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNldHVwU2VxdWVuY2VzOyAiLCJmdW5jdGlvbiBzdGFydFNlcXVlbmNlKCBvcHRzICkge1xyXG5cdC8vIGNvbnNvbGUubG9nKCBgc3RhcnRTZXF1ZW5jZWAgKTtcclxuXHRsZXQgdCA9IHRoaXM7XHJcblx0bGV0IHNlcUluZGV4ID0gb3B0cy5pbmRleCB8fCAwO1xyXG5cdC8vIHNldCBjdXJyZW50IHZhbHVlcyB0byBzdGFydCBzZXF1ZW5jZSB3aXRoXHJcblx0bGV0IHNlcSA9IHQuc2VxdWVuY2VzWyBzZXFJbmRleCBdO1xyXG5cdGZvciggbGV0IGkgPSAwOyBpIDwgc2VxLml0ZW1zLmxlbmd0aDsgaSsrICl7XHJcblx0XHRsZXQgaXRlbSA9IHNlcS5pdGVtc1sgaSBdO1xyXG5cdFx0bGV0IGN1cnJJdGVtVmFsID0gdFsgaXRlbS5wYXJhbSBdO1xyXG5cdFx0aXRlbS5zdGFydCA9IGN1cnJJdGVtVmFsO1xyXG5cdFx0aXRlbS50YXJnZXQgLT0gY3Vyckl0ZW1WYWw7XHJcblx0fVxyXG5cdHNlcS5hY3RpdmUgPSB0cnVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0YXJ0U2VxdWVuY2U7IiwibGV0IGVhc2luZyA9IHJlcXVpcmUoICcuLi8uLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlU2VxdWVuY2UoIG9wdHMgKXtcclxuXHRsZXQgdCA9IG9wdHMgfHwgdGhpcztcclxuXHQvLyBjb25zb2xlLmxvZyggJ3VwZGF0ZSB0aGlzOiAnLCB0aGlzICk7XHJcblx0bGV0IGNTID0gdC5zZXF1ZW5jZXM7XHJcblx0bGV0IGNTTGVuID0gdC5zZXF1ZW5jZXMubGVuZ3RoO1xyXG5cclxuXHRmb3IoIGxldCBpID0gMDsgaSA8IGNTTGVuOyBpKysgKXtcclxuXHRcdGxldCB0aGlzU2VxID0gY1NbIGkgXTtcclxuXHRcdGlmICggdGhpc1NlcS5hY3RpdmUgPT09IGZhbHNlICkge1xyXG5cdFx0XHRjb250aW51ZTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgeyBpdGVtcywgbGlua2VkU2VxLCBjbG9jaywgdG90YWxDbG9jaywgZmluYWwgfSA9IHRoaXNTZXE7XHJcblx0XHRsZXQgaXRlbUxlbiA9IGl0ZW1zLmxlbmd0aDtcclxuXHRcdGZvciggbGV0IGkgPSAwOyBpIDwgaXRlbUxlbjsgaSsrICl7XHJcblx0XHRcdGxldCBzID0gaXRlbXNbIGkgXTtcclxuXHRcdFx0dFsgcy5wYXJhbSBdID0gZWFzaW5nWyBzLmVhc2VmTiBdKFxyXG5cdFx0XHRcdGNsb2NrLCBzLnN0YXJ0LCBzLnRhcmdldCwgdG90YWxDbG9ja1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCBjbG9jayA+PSB0b3RhbENsb2NrICkge1xyXG5cdFx0XHR0aGlzU2VxLmFjdGl2ZSA9IGZhbHNlXHJcblx0XHRcdHRoaXNTZXEuY2xvY2sgPSAwO1xyXG5cdFx0XHRpZiggbGlua2VkU2VxICE9PSAnJyApIHtcclxuXHRcdFx0XHR0LnN0YXJ0U2VxdWVuY2UoIHsgaW5kZXg6IGxpbmtlZFNlcSB9ICk7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoICF0LmlzQ2hpbGQgJiYgZmluYWwgKSB7XHJcblx0XHRcdFx0dC5pc0FjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdFx0dGhpc1NlcS5jbG9jaysrO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGVTZXF1ZW5jZTsiLCJmdW5jdGlvbiB1cGRhdGVTZXF1ZW5jZUNsb2NrKCl7XHJcblx0bGV0IHQgPSB0aGlzO1xyXG5cdGlmICggdC5wbGF5U2VxdWVuY2UgPT09IHRydWUgKSB7XHJcblx0XHRpZiAoIHQuc2VxdWVuY2VDbG9jayA8IHQuY3VyclNlcXVlbmNlLnRpbWUgKSB7XHJcblx0XHRcdHQuc2VxdWVuY2VDbG9jaysrO1xyXG5cdFx0fTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlU2VxdWVuY2VDbG9jazsiLCIvKipcclxuICogalF1ZXJ5IG9iamVjdFxyXG4gKiBAZXh0ZXJuYWwgalF1ZXJ5XHJcbiAqIEBzZWUge0BsaW5rIGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkvfVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBEaW1lbnNpb25zXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB3IC0gd2lkdGhcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IGggLSBoZWlnaHRcclxuICovXHJcblxyXG4vKipcclxuKiBAdHlwZWRlZiB7T2JqZWN0fSBQb2ludCAtIEEgcG9pbnQgaW4gc3BhY2Ugb24gYSAyZCAoY2FydGVzZWFuKSBwbGFuZSwgdXN1YWxseSBYL1lcclxuKiBAcHJvcGVydHkge251bWJlcn0geCAtIFRoZSBYIENvb3JkaW5hdGVcclxuKiBAcHJvcGVydHkge251bWJlcn0geSAtIFRoZSBZIENvb3JkaW5hdGVcclxuKi9cclxuXHJcbi8qKiBcclxuKiAgQHR5cGVkZWYge09iamVjdH0gVmVsb2NpdHlWZWN0b3IgLSBUaGUgY2hhbmdlIGRlbHRhIGZvciBjYXJ0ZXNlYW4geC95LCBvciAyZCBjb29yZGluYXRlIHN5c3RlbXNcclxuKiAgQHByb3BlcnR5IHtudW1iZXJ9IHhWZWwgVGhlIFggZGVsdGEgY2hhbmdlIHZhbHVlLlxyXG4qICBAcHJvcGVydHkge251bWJlcn0geVZlbCBUaGUgWSBkZWx0YSBjaGFuZ2UgdmFsdWUuXHJcbiovXHJcblxyXG4vKipcclxuKiBAdHlwZWRlZiB7T2JqZWN0fSB2ZWN0b3JDYWxjdWxhdGlvblxyXG4qIEBwcm9wZXJ0eSB7bnVtYmVyfSBkaXN0YW5jZSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB2ZWN0b3JzXHJcbiogQHByb3BlcnR5IHtudW1iZXJ9IGFuZ2xlIFRoZSBhbmdsZSBiZXR3ZWVuIHZlY3RvcnNcclxuKi8iLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZXh0ZW5kcyBDYW52YXMgcHJvdG90eXBlIHdpdGggdXNlZnVsIGRyYXdpbmcgbWl4aW5zXHJcbiogQGtpbmQgY29uc3RhbnRcclxuKi9cclxudmFyIGNhbnZhc0RyYXdpbmdBcGkgPSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlO1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gZHJhdyBjaXJjbGUgQVBJXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmNpcmNsZSA9IGZ1bmN0aW9uICh4LCB5LCByKSB7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBmaWxsZWQgY2lyY2xlXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmZpbGxDaXJjbGUgPSBmdW5jdGlvbiAoeCwgeSwgciwgY29udGV4dCkge1xyXG5cdHRoaXMuY2lyY2xlKHgsIHksIHIsIGNvbnRleHQpO1xyXG5cdHRoaXMuZmlsbCgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBzdHJva2VkIGNpcmNsZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4IC0gb3JpZ2luIFggb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgY2lyY2xlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gcmFkaXVzIG9mIGNpcmNsZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VDaXJjbGUgPSBmdW5jdGlvbiAoeCwgeSwgcikge1xyXG5cdHRoaXMuY2lyY2xlKHgsIHksIHIpO1xyXG5cdHRoaXMuc3Ryb2tlKCk7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IGggLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5lbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgTWF0aC5QSSAqIDI7IGkgKz0gTWF0aC5QSSAvIDE2KSB7XHJcblx0XHR0aGlzLmxpbmVUbyh4ICsgTWF0aC5jb3MoaSkgKiB3IC8gMiwgeSArIE1hdGguc2luKGkpICogaCAvIDIpO1xyXG5cdH1cclxuXHR0aGlzLmNsb3NlUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZmlsbGVkIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb3IgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IGggLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5maWxsRWxsaXBzZSA9IGZ1bmN0aW9uICh4LCB5LCB3LCBoKSB7XHJcblx0dGhpcy5lbGxpcHNlKHgsIHksIHcsIGgsIGNvbnRleHQpO1xyXG5cdHRoaXMuZmlsbCgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBzdHJva2VkIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gb3JpZ2luIFkgb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIHdpZHRoIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IGggLSBoZWlnaHQgb2YgZWxsaXBzZS5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VFbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcclxuXHR0aGlzLmVsbGlwc2UoeCwgeSwgdywgaCk7XHJcblx0dGhpcy5zdHJva2UoKTtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgbGluZSBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5saW5lID0gZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyKSB7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLm1vdmVUbyh4MSwgeTEpO1xyXG5cdHRoaXMubGluZVRvKHgyLCB5Mik7XHJcblx0dGhpcy5zdHJva2UoKTtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgc3Ryb2tlZCByZWd1bGFyIHBvbHlnb24gc2hhcGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvbHlnb24gb3JpZ2luLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gWSBjb29yZGluYXRlIG9mIHRoZSBwb2x5Z29uIG9yaWdpbi5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIFJhZGl1cyBvZiB0aGUgcG9seWdvbi5cclxuKiBAcGFyYW0ge251bWJlcn0gcyAtIE51bWJlciBvZiBzaWRlcy5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5zdHJva2VQb2x5ID0gZnVuY3Rpb24gKCB4LCB5LCByLCBzICkge1xyXG5cdFxyXG5cdHZhciBzaWRlcyA9IHM7XHJcblx0dmFyIHJhZGl1cyA9IHI7XHJcblx0dmFyIGN4ID0geDtcclxuXHR2YXIgY3kgPSB5O1xyXG5cdHZhciBhbmdsZSA9IDIgKiBNYXRoLlBJIC8gc2lkZXM7XHJcblx0XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLnRyYW5zbGF0ZSggY3gsIGN5ICk7XHJcblx0dGhpcy5tb3ZlVG8oIHJhZGl1cywgMCApOyAgICAgICAgICBcclxuXHRmb3IgKCB2YXIgaSA9IDE7IGkgPD0gc2lkZXM7IGkrKyApIHtcclxuXHRcdHRoaXMubGluZVRvKFxyXG5cdFx0XHRyYWRpdXMgKiBNYXRoLmNvcyggaSAqIGFuZ2xlICksXHJcblx0XHRcdHJhZGl1cyAqIE1hdGguc2luKCBpICogYW5nbGUgKVxyXG5cdFx0KTtcclxuXHR9XHJcblx0dGhpcy5zdHJva2UoKTtcclxuXHR0aGlzLnRyYW5zbGF0ZSggLWN4LCAtY3kgKTtcclxufVxyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZmlsbGVkIHJlZ3VsYXIgcG9seWdvbiBzaGFwZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9seWdvbiBvcmlnaW4uXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvbHlnb24gb3JpZ2luLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gUmFkaXVzIG9mIHRoZSBwb2x5Z29uLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzIC0gTnVtYmVyIG9mIHNpZGVzLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmZpbGxQb2x5ID0gZnVuY3Rpb24gKCB4LCB5LCByLCBzICkge1xyXG5cdFxyXG5cdHZhciBzaWRlcyA9IHM7XHJcblx0dmFyIHJhZGl1cyA9IHI7XHJcblx0dmFyIGN4ID0geDtcclxuXHR2YXIgY3kgPSB5O1xyXG5cdHZhciBhbmdsZSA9IDIgKiBNYXRoLlBJIC8gc2lkZXM7XHJcblx0XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxuXHR0aGlzLnRyYW5zbGF0ZSggY3gsIGN5ICk7XHJcblx0dGhpcy5tb3ZlVG8oIHJhZGl1cywgMCApOyAgICAgICAgICBcclxuXHRmb3IgKCB2YXIgaSA9IDE7IGkgPD0gc2lkZXM7IGkrKyApIHtcclxuXHRcdHRoaXMubGluZVRvKFxyXG5cdFx0XHRyYWRpdXMgKiBNYXRoLmNvcyggaSAqIGFuZ2xlICksXHJcblx0XHRcdHJhZGl1cyAqIE1hdGguc2luKCBpICogYW5nbGUgKVxyXG5cdFx0KTtcclxuXHR9XHJcblx0dGhpcy5maWxsKCk7XHJcblx0dGhpcy50cmFuc2xhdGUoIC1jeCwgLWN5ICk7XHJcblx0XHJcbn0iLCJsZXQgcHJlZml4ID0gJ1xceDFiWyc7XHJcblxyXG5jb25zdCBjbCA9IHtcclxuXHQvLyByZWRcclxuXHRyOiBgJHtwcmVmaXh9MzFtYCxcclxuXHRiZ3I6IGAke3ByZWZpeH00MG1gLFxyXG5cdC8vIGdyZWVuXHJcblx0ZzogYCR7cHJlZml4fTMybWAsXHJcblx0YmdnOiBgJHtwcmVmaXh9NDJtYCxcclxuXHQvL3llbGxvd1xyXG5cdHk6IGAke3ByZWZpeH0zM21gLFxyXG5cdGJneTogYCR7cHJlZml4fTQzbWAsXHJcblx0Ly8gYmx1ZVxyXG5cdGI6IGAke3ByZWZpeH0zNm1gLFxyXG5cdGJnYjogYCR7cHJlZml4fTQ2bWAsXHJcblx0Ly8gbWFnZW50YVxyXG5cdG06IGAke3ByZWZpeH0zNW1gLFxyXG5cdGJnbTogYCR7cHJlZml4fTQ1bWAsXHJcblx0Ly8gd2hpdGVcclxuXHR3OiBgJHtwcmVmaXh9MzdtYCxcclxuXHRiZ3c6IGAke3ByZWZpeH00N21gLFxyXG5cdC8vIHJlc2V0XHJcblx0cnN0OiBgJHtwcmVmaXh9MG1gLFxyXG5cdC8vIGJvbGQvYnJpZ2h0XHJcblx0YmxkOiBgJHtwcmVmaXh9MW1gLFxyXG5cdC8vIGRpbVxyXG5cdGRpbTogYCR7cHJlZml4fTJtYFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsOyIsIi8qXHJcbiAqIFRoaXMgaXMgYSBuZWFyLWRpcmVjdCBwb3J0IG9mIFJvYmVydCBQZW5uZXIncyBlYXNpbmcgZXF1YXRpb25zLiBQbGVhc2Ugc2hvd2VyIFJvYmVydCB3aXRoXHJcbiAqIHByYWlzZSBhbmQgYWxsIG9mIHlvdXIgYWRtaXJhdGlvbi4gSGlzIGxpY2Vuc2UgaXMgcHJvdmlkZWQgYmVsb3cuXHJcbiAqXHJcbiAqIEZvciBpbmZvcm1hdGlvbiBvbiBob3cgdG8gdXNlIHRoZXNlIGZ1bmN0aW9ucyBpbiB5b3VyIGFuaW1hdGlvbnMsIGNoZWNrIG91dCBteSBmb2xsb3dpbmcgdHV0b3JpYWw6IFxyXG4gKiBodHRwOi8vYml0Lmx5LzE4aUhIS3FcclxuICpcclxuICogLUtpcnVwYVxyXG4gKi9cclxuXHJcbi8qXHJcbiAqIEBhdXRob3IgUm9iZXJ0IFBlbm5lclxyXG4gKiBAbGljZW5zZSBcclxuICogVEVSTVMgT0YgVVNFIC0gRUFTSU5HIEVRVUFUSU9OU1xyXG4gKiBcclxuICogT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLiBcclxuICogXHJcbiAqIENvcHlyaWdodCDCqSAyMDAxIFJvYmVydCBQZW5uZXJcclxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICogXHJcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIFxyXG4gKiBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcbiAqIFxyXG4gKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBcclxuICogY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG4gKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBcclxuICogb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgXHJcbiAqIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuICogXHJcbiAqIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGF1dGhvciBub3IgdGhlIG5hbWVzIG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIFxyXG4gKiBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxyXG4gKiBcclxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBcclxuICogRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GXHJcbiAqIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXHJcbiAqIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURVxyXG4gKiBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgXHJcbiAqIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXHJcbiAqIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIFxyXG4gKiBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuIFxyXG4gKlxyXG4gKi9cclxuXHJcbi8qKlxyXG4qIFByb3ZpZGVzIGVhc2luZyBjYWxjdWxhdGlvbiBtZXRob2RzLlxyXG4qIEBuYW1lIGVhc2luZ0VxdWF0aW9uc1xyXG4qXHJcbiogQHNlZSB7QGxpbmsgXCJodHRwOi8vcm9iZXJ0cGVubmVyLmNvbS9lYXNpbmcvXCJ9XHJcbiogQHNlZSB7QGxpbmsgaHR0cHM6Ly9lYXNpbmdzLm5ldC9lbnxFYXNpbmcgY2hlYXQgc2hlZXR9XHJcbiovXHJcbnZhciBlYXNpbmdFcXVhdGlvbnMgPSB7XHJcblx0LyoqXHJcblx0ICogQGZ1bmN0aW9uXHJcblx0ICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuXHQgKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG5cdCAqL1xyXG5cdGxpbmVhckVhc2U6IGZ1bmN0aW9uIGxpbmVhckVhc2UoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblx0LyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJblF1YWQ6IGZ1bmN0aW9uIGVhc2VJblF1YWQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiBjdXJyZW50SXRlcmF0aW9uICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZU91dFF1YWQ6IGZ1bmN0aW9uIGVhc2VPdXRRdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiBlYXNlSW5PdXRRdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBjdXJyZW50SXRlcmF0aW9uICogY3VycmVudEl0ZXJhdGlvbiArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKC0tY3VycmVudEl0ZXJhdGlvbiAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgLSAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cclxuXHRlYXNlSW5DdWJpYzogZnVuY3Rpb24gZWFzZUluQ3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMsIDMpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZU91dEN1YmljOiBmdW5jdGlvbiBlYXNlT3V0Q3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgMykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbiBlYXNlSW5PdXRDdWJpYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgMykgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCAzKSArIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluUXVhcnQ6IGZ1bmN0aW9uIGVhc2VJblF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCA0KSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRRdWFydDogZnVuY3Rpb24gZWFzZU91dFF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCA0KSAtIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uIGVhc2VJbk91dFF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCA0KSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCA0KSAtIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluUXVpbnQ6IGZ1bmN0aW9uIGVhc2VJblF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCA1KSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRRdWludDogZnVuY3Rpb24gZWFzZU91dFF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDUpICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5PdXRRdWludDogZnVuY3Rpb24gZWFzZUluT3V0UXVpbnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDUpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC0gMiwgNSkgKyAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJblNpbmU6IGZ1bmN0aW9uIGVhc2VJblNpbmUoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgxIC0gTWF0aC5jb3MoY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAqIChNYXRoLlBJIC8gMikpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRTaW5lOiBmdW5jdGlvbiBlYXNlT3V0U2luZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5zaW4oY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAqIChNYXRoLlBJIC8gMikpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluT3V0U2luZTogZnVuY3Rpb24gZWFzZUluT3V0U2luZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbkV4cG86IGZ1bmN0aW9uIGVhc2VJbkV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KDIsIDEwICogKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlT3V0RXhwbzogZnVuY3Rpb24gZWFzZU91dEV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgtTWF0aC5wb3coMiwgLTEwICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbk91dEV4cG86IGZ1bmN0aW9uIGVhc2VJbk91dEV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KDIsIDEwICogKGN1cnJlbnRJdGVyYXRpb24gLSAxKSkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKC1NYXRoLnBvdygyLCAtMTAgKiAtLWN1cnJlbnRJdGVyYXRpb24pICsgMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5DaXJjOiBmdW5jdGlvbiBlYXNlSW5DaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoMSAtIE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRDaXJjOiBmdW5jdGlvbiBlYXNlT3V0Q2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiA9IGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluT3V0Q2lyYzogZnVuY3Rpb24gZWFzZUluT3V0Q2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKDEgLSBNYXRoLnNxcnQoMSAtIGN1cnJlbnRJdGVyYXRpb24gKiBjdXJyZW50SXRlcmF0aW9uKSkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gLT0gMikgKiBjdXJyZW50SXRlcmF0aW9uKSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluRWxhc3RpYzogZnVuY3Rpb24gZWFzZUluRWxhc3RpYyh0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcyA9IDEuNzAxNTg7dmFyIHAgPSAwO3ZhciBhID0gYztcclxuXHRcdGlmICh0ID09IDApIHJldHVybiBiO2lmICgodCAvPSBkKSA9PSAxKSByZXR1cm4gYiArIGM7aWYgKCFwKSBwID0gZCAqIC4zO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkge1xyXG5cdFx0XHRhID0gYzt2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oYyAvIGEpO1xyXG5cdFx0cmV0dXJuIC0oYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpICsgYjtcclxuXHR9LFxyXG5cdC8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlT3V0RWxhc3RpYzogZnVuY3Rpb24gZWFzZU91dEVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCkgPT0gMSkgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAuMztcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogdCkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSArIGMgKyBiO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5PdXRFbGFzdGljOiBmdW5jdGlvbiBlYXNlSW5PdXRFbGFzdGljKHQsIGIsIGMsIGQpIHtcclxuXHRcdHZhciBzID0gMS43MDE1ODt2YXIgcCA9IDA7dmFyIGEgPSBjO1xyXG5cdFx0aWYgKHQgPT0gMCkgcmV0dXJuIGI7aWYgKCh0IC89IGQgLyAyKSA9PSAyKSByZXR1cm4gYiArIGM7aWYgKCFwKSBwID0gZCAqICguMyAqIDEuNSk7XHJcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7XHJcblx0XHRcdGEgPSBjO3ZhciBzID0gcCAvIDQ7XHJcblx0XHR9IGVsc2UgdmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XHJcblx0XHRpZiAodCA8IDEpIHJldHVybiAtLjUgKiAoYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpICsgYjtcclxuXHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkgKiAuNSArIGMgKyBiO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5CYWNrOiBmdW5jdGlvbiBlYXNlSW5CYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyAqICh0IC89IGQpICogdCAqICgocyArIDEpICogdCAtIHMpICsgYjtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZU91dEJhY2s6IGZ1bmN0aW9uIGVhc2VPdXRCYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyAqICgodCA9IHQgLyBkIC0gMSkgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAxKSArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0QmFjazogZnVuY3Rpb24gZWFzZUluT3V0QmFjayh0LCBiLCBjLCBkLCBzKSB7XHJcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0aWYgKCh0IC89IGQgLyAyKSA8IDEpIHJldHVybiBjIC8gMiAqICh0ICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0IC0gcykpICsgYjtcclxuXHRcdHJldHVybiBjIC8gMiAqICgodCAtPSAyKSAqIHQgKiAoKChzICo9IDEuNTI1KSArIDEpICogdCArIHMpICsgMikgKyBiO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbiBlYXNlT3V0Qm91bmNlKHQsIGIsIGMsIGQpIHtcclxuXHRcdGlmICgodCAvPSBkKSA8IDEgLyAyLjc1KSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqIHQgKiB0KSArIGI7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAyIC8gMi43NSkge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAxLjUgLyAyLjc1KSAqIHQgKyAuNzUpICsgYjtcclxuXHRcdH0gZWxzZSBpZiAodCA8IDIuNSAvIDIuNzUpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMi4yNSAvIDIuNzUpICogdCArIC45Mzc1KSArIGI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAyLjYyNSAvIDIuNzUpICogdCArIC45ODQzNzUpICsgYjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5lYXNpbmdFcXVhdGlvbnMuZWFzZUluQm91bmNlID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcclxuXHRyZXR1cm4gYyAtIGVhc2luZ0VxdWF0aW9ucy5lYXNlT3V0Qm91bmNlKGQgLSB0LCAwLCBjLCBkKSArIGI7XHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcbmVhc2luZ0VxdWF0aW9ucy5lYXNlSW5PdXRCb3VuY2UgPSBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xyXG5cdGlmICh0IDwgZCAvIDIpIHJldHVybiBlYXNpbmdFcXVhdGlvbnMuZWFzZUluQm91bmNlKHQgKiAyLCAwLCBjLCBkKSAqIC41ICsgYjtcclxuXHRyZXR1cm4gZWFzaW5nRXF1YXRpb25zLmVhc2VPdXRCb3VuY2UodCAqIDIgLSBkLCAwLCBjLCBkKSAqIC41ICsgYyAqIC41ICsgYjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmVhc2luZ0VxdWF0aW9ucyA9IGVhc2luZ0VxdWF0aW9uczsiLCIvKipcclxuKiBwcm92aWRlcyBtYXRocyB1dGlsaWxpdHkgbWV0aG9kcyBhbmQgaGVscGVycy5cclxuKlxyXG4qIEBtb2R1bGUgbWF0aFV0aWxzXHJcbiovXHJcblxyXG52YXIgbWF0aFV0aWxzID0ge1xyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2VuZXJhdGUgcmFuZG9tIGludGVnZXIgYmV0d2VlbiAyIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdHJhbmRvbUludGVnZXI6IGZ1bmN0aW9uIHJhbmRvbUludGVnZXIobWluLCBtYXgpIHtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4ICsgMSAtIG1pbikgKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIEdlbmVyYXRlIHJhbmRvbSBmbG9hdCBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tOiBmdW5jdGlvbiByYW5kb20obWluLCBtYXgpIHtcclxuXHRcdGlmIChtaW4gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtaW4gPSAwO1xyXG5cdFx0XHRtYXggPSAxO1xyXG5cdFx0fSBlbHNlIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtYXggPSBtaW47XHJcblx0XHRcdG1pbiA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdGdldFJhbmRvbUFyYml0cmFyeTogZnVuY3Rpb24gZ2V0UmFuZG9tQXJiaXRyYXJ5KG1pbiwgbWF4KSB7XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBUcmFuc2Zvcm1zIHZhbHVlIHByb3BvcnRpb25hdGVseSBiZXR3ZWVuIGlucHV0IHJhbmdlIGFuZCBvdXRwdXQgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgb3JpZ2luIHJhbmdlICggbWluMS9tYXgxICkuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4xIC0gbWluaW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgxIC0gbWF4aW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4yIC0gbWluaW11bSB2YWx1ZSBpbiBkZXN0aW5hdGlvbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heDIgLSBtYXhpbXVtIHZhbHVlIGluIGRlc3RpbmF0aW9uIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiBkZXN0aW5hdGlvbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0bWFwOiBmdW5jdGlvbiBtYXAodmFsdWUsIG1pbjEsIG1heDEsIG1pbjIsIG1heDIsIGNsYW1wUmVzdWx0KSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgcmV0dXJudmFsdWUgPSAodmFsdWUgLSBtaW4xKSAvIChtYXgxIC0gbWluMSkgKiAobWF4MiAtIG1pbjIpICsgbWluMjtcclxuXHRcdGlmIChjbGFtcFJlc3VsdCkgcmV0dXJuIHNlbGYuY2xhbXAocmV0dXJudmFsdWUsIG1pbjIsIG1heDIpO2Vsc2UgcmV0dXJuIHJldHVybnZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ2xhbXAgdmFsdWUgYmV0d2VlbiByYW5nZSB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgcmFuZ2UgeyBtaW58bWF4IH0uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlIGluIHRoZSByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUgaW4gdGhlIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqL1xyXG5cdGNsYW1wOiBmdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtcclxuXHRcdGlmIChtYXggPCBtaW4pIHtcclxuXHRcdFx0dmFyIHRlbXAgPSBtaW47XHJcblx0XHRcdG1pbiA9IG1heDtcclxuXHRcdFx0bWF4ID0gdGVtcDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGhVdGlsczsiLCIvLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKSBzaGltIGJ5IFBhdWwgSXJpc2hcclxud2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHR3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHR3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVjIHx8XHJcblx0XHRcdGZ1bmN0aW9uKCBjYWxsYmFjaywgZWxlbWVudCApIHtcclxuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcclxuXHRcdFx0fTtcclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBCZWhhdmVzIHRoZSBzYW1lIGFzIHNldFRpbWVvdXQgZXhjZXB0IHVzZXMgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCkgd2hlcmUgcG9zc2libGUgZm9yIGJldHRlciBwZXJmb3JtYW5jZVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cclxuICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5IFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHNcclxuICovXHJcblxyXG53aW5kb3cucmVxdWVzdFRpbWVvdXQgPSBmdW5jdGlvbihmbiwgZGVsYXkpIHtcclxuXHRpZiAoICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmICF3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmICEoIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93Lm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSkgJiYgIXdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmICF3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKSB7XHJcblx0XHRyZXR1cm4gd2luZG93LnNldFRpbWVvdXQoZm4sIGRlbGF5KTtcclxuXHR9XHJcblx0XHRcdFxyXG5cdHZhciBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxyXG5cdFx0aGFuZGxlID0gbmV3IE9iamVjdCgpO1xyXG5cdFx0XHJcblx0ZnVuY3Rpb24gbG9vcCgpe1xyXG5cdFx0dmFyIGN1cnJlbnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcclxuXHRcdFx0ZGVsdGEgPSBjdXJyZW50IC0gc3RhcnQ7XHJcblx0XHRkZWx0YSA+PSBkZWxheSA/IGZuLmNhbGwoKSA6IGhhbmRsZS52YWx1ZSA9IHJlcXVlc3RBbmltRnJhbWUobG9vcCk7XHJcblx0fTtcclxuXHRcclxuXHRoYW5kbGUudmFsdWUgPSByZXF1ZXN0QW5pbUZyYW1lKGxvb3ApO1xyXG5cdHJldHVybiBoYW5kbGU7XHJcbn07XHJcblxyXG4vKipcclxuICogQmVoYXZlcyB0aGUgc2FtZSBhcyBjbGVhclRpbWVvdXQgZXhjZXB0IHVzZXMgY2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKCkgd2hlcmUgcG9zc2libGUgZm9yIGJldHRlciBwZXJmb3JtYW5jZVxyXG4gKiBAcGFyYW0ge2ludHxvYmplY3R9IGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxyXG4gKi9cclxud2luZG93LmNsZWFyUmVxdWVzdFRpbWVvdXQgPSBmdW5jdGlvbiggaGFuZGxlICkge1xyXG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID8gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKCBoYW5kbGUudmFsdWUgKSA6XHJcbiAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgPyB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUoIGhhbmRsZS52YWx1ZSApIDpcclxuICAgIHdpbmRvdy53ZWJraXRDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPyB3aW5kb3cud2Via2l0Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBoYW5kbGUudmFsdWUgKSA6IC8qIFN1cHBvcnQgZm9yIGxlZ2FjeSBBUEkgKi9cclxuICAgIHdpbmRvdy5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPyB3aW5kb3cubW96Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBoYW5kbGUudmFsdWUgKSA6XHJcbiAgICB3aW5kb3cub0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVx0PyB3aW5kb3cub0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSggaGFuZGxlLnZhbHVlICkgOlxyXG4gICAgd2luZG93Lm1zQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lID8gd2luZG93Lm1zQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBoYW5kbGUudmFsdWUgKSA6XHJcbiAgICBjbGVhclRpbWVvdXQoIGhhbmRsZSApO1xyXG59OyIsIi8qXHJcbiAqIEEgZmFzdCBqYXZhc2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHNpbXBsZXggbm9pc2UgYnkgSm9uYXMgV2FnbmVyXHJcbkJhc2VkIG9uIGEgc3BlZWQtaW1wcm92ZWQgc2ltcGxleCBub2lzZSBhbGdvcml0aG0gZm9yIDJELCAzRCBhbmQgNEQgaW4gSmF2YS5cclxuV2hpY2ggaXMgYmFzZWQgb24gZXhhbXBsZSBjb2RlIGJ5IFN0ZWZhbiBHdXN0YXZzb24gKHN0ZWd1QGl0bi5saXUuc2UpLlxyXG5XaXRoIE9wdGltaXNhdGlvbnMgYnkgUGV0ZXIgRWFzdG1hbiAocGVhc3RtYW5AZHJpenpsZS5zdGFuZm9yZC5lZHUpLlxyXG5CZXR0ZXIgcmFuayBvcmRlcmluZyBtZXRob2QgYnkgU3RlZmFuIEd1c3RhdnNvbiBpbiAyMDEyLlxyXG5cclxuQ29weXJpZ2h0IChjKSAyMDE4IEpvbmFzIFdhZ25lclxyXG5cclxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXHJcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXHJcblNPRlRXQVJFLlxyXG4qL1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgdmFyIEYyID0gMC41ICogKE1hdGguc3FydCgzLjApIC0gMS4wKTtcclxuICB2YXIgRzIgPSAoMy4wIC0gTWF0aC5zcXJ0KDMuMCkpIC8gNi4wO1xyXG4gIHZhciBGMyA9IDEuMCAvIDMuMDtcclxuICB2YXIgRzMgPSAxLjAgLyA2LjA7XHJcbiAgdmFyIEY0ID0gKE1hdGguc3FydCg1LjApIC0gMS4wKSAvIDQuMDtcclxuICB2YXIgRzQgPSAoNS4wIC0gTWF0aC5zcXJ0KDUuMCkpIC8gMjAuMDtcclxuXHJcbiAgZnVuY3Rpb24gU2ltcGxleE5vaXNlKHJhbmRvbU9yU2VlZCkge1xyXG4gICAgdmFyIHJhbmRvbTtcclxuICAgIGlmICh0eXBlb2YgcmFuZG9tT3JTZWVkID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgcmFuZG9tID0gcmFuZG9tT3JTZWVkO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocmFuZG9tT3JTZWVkKSB7XHJcbiAgICAgIHJhbmRvbSA9IGFsZWEocmFuZG9tT3JTZWVkKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJhbmRvbSA9IE1hdGgucmFuZG9tO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wID0gYnVpbGRQZXJtdXRhdGlvblRhYmxlKHJhbmRvbSk7XHJcbiAgICB0aGlzLnBlcm0gPSBuZXcgVWludDhBcnJheSg1MTIpO1xyXG4gICAgdGhpcy5wZXJtTW9kMTIgPSBuZXcgVWludDhBcnJheSg1MTIpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1MTI7IGkrKykge1xyXG4gICAgICB0aGlzLnBlcm1baV0gPSB0aGlzLnBbaSAmIDI1NV07XHJcbiAgICAgIHRoaXMucGVybU1vZDEyW2ldID0gdGhpcy5wZXJtW2ldICUgMTI7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuICBTaW1wbGV4Tm9pc2UucHJvdG90eXBlID0ge1xyXG4gICAgZ3JhZDM6IG5ldyBGbG9hdDMyQXJyYXkoWzEsIDEsIDAsXHJcbiAgICAgIC0xLCAxLCAwLFxyXG4gICAgICAxLCAtMSwgMCxcclxuXHJcbiAgICAgIC0xLCAtMSwgMCxcclxuICAgICAgMSwgMCwgMSxcclxuICAgICAgLTEsIDAsIDEsXHJcblxyXG4gICAgICAxLCAwLCAtMSxcclxuICAgICAgLTEsIDAsIC0xLFxyXG4gICAgICAwLCAxLCAxLFxyXG5cclxuICAgICAgMCwgLTEsIDEsXHJcbiAgICAgIDAsIDEsIC0xLFxyXG4gICAgICAwLCAtMSwgLTFdKSxcclxuICAgIGdyYWQ0OiBuZXcgRmxvYXQzMkFycmF5KFswLCAxLCAxLCAxLCAwLCAxLCAxLCAtMSwgMCwgMSwgLTEsIDEsIDAsIDEsIC0xLCAtMSxcclxuICAgICAgMCwgLTEsIDEsIDEsIDAsIC0xLCAxLCAtMSwgMCwgLTEsIC0xLCAxLCAwLCAtMSwgLTEsIC0xLFxyXG4gICAgICAxLCAwLCAxLCAxLCAxLCAwLCAxLCAtMSwgMSwgMCwgLTEsIDEsIDEsIDAsIC0xLCAtMSxcclxuICAgICAgLTEsIDAsIDEsIDEsIC0xLCAwLCAxLCAtMSwgLTEsIDAsIC0xLCAxLCAtMSwgMCwgLTEsIC0xLFxyXG4gICAgICAxLCAxLCAwLCAxLCAxLCAxLCAwLCAtMSwgMSwgLTEsIDAsIDEsIDEsIC0xLCAwLCAtMSxcclxuICAgICAgLTEsIDEsIDAsIDEsIC0xLCAxLCAwLCAtMSwgLTEsIC0xLCAwLCAxLCAtMSwgLTEsIDAsIC0xLFxyXG4gICAgICAxLCAxLCAxLCAwLCAxLCAxLCAtMSwgMCwgMSwgLTEsIDEsIDAsIDEsIC0xLCAtMSwgMCxcclxuICAgICAgLTEsIDEsIDEsIDAsIC0xLCAxLCAtMSwgMCwgLTEsIC0xLCAxLCAwLCAtMSwgLTEsIC0xLCAwXSksXHJcbiAgICBub2lzZTJEOiBmdW5jdGlvbih4aW4sIHlpbikge1xyXG4gICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTI7XHJcbiAgICAgIHZhciBwZXJtID0gdGhpcy5wZXJtO1xyXG4gICAgICB2YXIgZ3JhZDMgPSB0aGlzLmdyYWQzO1xyXG4gICAgICB2YXIgbjAgPSAwOyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcclxuICAgICAgdmFyIG4xID0gMDtcclxuICAgICAgdmFyIG4yID0gMDtcclxuICAgICAgLy8gU2tldyB0aGUgaW5wdXQgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggY2VsbCB3ZSdyZSBpblxyXG4gICAgICB2YXIgcyA9ICh4aW4gKyB5aW4pICogRjI7IC8vIEhhaXJ5IGZhY3RvciBmb3IgMkRcclxuICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xyXG4gICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XHJcbiAgICAgIHZhciB0ID0gKGkgKyBqKSAqIEcyO1xyXG4gICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkpIHNwYWNlXHJcbiAgICAgIHZhciBZMCA9IGogLSB0O1xyXG4gICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSBkaXN0YW5jZXMgZnJvbSB0aGUgY2VsbCBvcmlnaW5cclxuICAgICAgdmFyIHkwID0geWluIC0gWTA7XHJcbiAgICAgIC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXHJcbiAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cclxuICAgICAgdmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xyXG4gICAgICBpZiAoeDAgPiB5MCkge1xyXG4gICAgICAgIGkxID0gMTtcclxuICAgICAgICBqMSA9IDA7XHJcbiAgICAgIH0gLy8gbG93ZXIgdHJpYW5nbGUsIFhZIG9yZGVyOiAoMCwwKS0+KDEsMCktPigxLDEpXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGkxID0gMDtcclxuICAgICAgICBqMSA9IDE7XHJcbiAgICAgIH0gLy8gdXBwZXIgdHJpYW5nbGUsIFlYIG9yZGVyOiAoMCwwKS0+KDAsMSktPigxLDEpXHJcbiAgICAgIC8vIEEgc3RlcCBvZiAoMSwwKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKDEtYywtYykgaW4gKHgseSksIGFuZFxyXG4gICAgICAvLyBhIHN0ZXAgb2YgKDAsMSkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgtYywxLWMpIGluICh4LHkpLCB3aGVyZVxyXG4gICAgICAvLyBjID0gKDMtc3FydCgzKSkvNlxyXG4gICAgICB2YXIgeDEgPSB4MCAtIGkxICsgRzI7IC8vIE9mZnNldHMgZm9yIG1pZGRsZSBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXHJcbiAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMjtcclxuICAgICAgdmFyIHgyID0geDAgLSAxLjAgKyAyLjAgKiBHMjsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXHJcbiAgICAgIHZhciB5MiA9IHkwIC0gMS4wICsgMi4wICogRzI7XHJcbiAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgdGhyZWUgc2ltcGxleCBjb3JuZXJzXHJcbiAgICAgIHZhciBpaSA9IGkgJiAyNTU7XHJcbiAgICAgIHZhciBqaiA9IGogJiAyNTU7XHJcbiAgICAgIC8vIENhbGN1bGF0ZSB0aGUgY29udHJpYnV0aW9uIGZyb20gdGhlIHRocmVlIGNvcm5lcnNcclxuICAgICAgdmFyIHQwID0gMC41IC0geDAgKiB4MCAtIHkwICogeTA7XHJcbiAgICAgIGlmICh0MCA+PSAwKSB7XHJcbiAgICAgICAgdmFyIGdpMCA9IHBlcm1Nb2QxMltpaSArIHBlcm1bampdXSAqIDM7XHJcbiAgICAgICAgdDAgKj0gdDA7XHJcbiAgICAgICAgbjAgPSB0MCAqIHQwICogKGdyYWQzW2dpMF0gKiB4MCArIGdyYWQzW2dpMCArIDFdICogeTApOyAvLyAoeCx5KSBvZiBncmFkMyB1c2VkIGZvciAyRCBncmFkaWVudFxyXG4gICAgICB9XHJcbiAgICAgIHZhciB0MSA9IDAuNSAtIHgxICogeDEgLSB5MSAqIHkxO1xyXG4gICAgICBpZiAodDEgPj0gMCkge1xyXG4gICAgICAgIHZhciBnaTEgPSBwZXJtTW9kMTJbaWkgKyBpMSArIHBlcm1bamogKyBqMV1dICogMztcclxuICAgICAgICB0MSAqPSB0MTtcclxuICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDNbZ2kxXSAqIHgxICsgZ3JhZDNbZ2kxICsgMV0gKiB5MSk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHQyID0gMC41IC0geDIgKiB4MiAtIHkyICogeTI7XHJcbiAgICAgIGlmICh0MiA+PSAwKSB7XHJcbiAgICAgICAgdmFyIGdpMiA9IHBlcm1Nb2QxMltpaSArIDEgKyBwZXJtW2pqICsgMV1dICogMztcclxuICAgICAgICB0MiAqPSB0MjtcclxuICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDNbZ2kyXSAqIHgyICsgZ3JhZDNbZ2kyICsgMV0gKiB5Mik7XHJcbiAgICAgIH1cclxuICAgICAgLy8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxyXG4gICAgICAvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXHJcbiAgICAgIHJldHVybiA3MC4wICogKG4wICsgbjEgKyBuMik7XHJcbiAgICB9LFxyXG4gICAgLy8gM0Qgc2ltcGxleCBub2lzZVxyXG4gICAgbm9pc2UzRDogZnVuY3Rpb24oeGluLCB5aW4sIHppbikge1xyXG4gICAgICB2YXIgcGVybU1vZDEyID0gdGhpcy5wZXJtTW9kMTI7XHJcbiAgICAgIHZhciBwZXJtID0gdGhpcy5wZXJtO1xyXG4gICAgICB2YXIgZ3JhZDMgPSB0aGlzLmdyYWQzO1xyXG4gICAgICB2YXIgbjAsIG4xLCBuMiwgbjM7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgZm91ciBjb3JuZXJzXHJcbiAgICAgIC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cclxuICAgICAgdmFyIHMgPSAoeGluICsgeWluICsgemluKSAqIEYzOyAvLyBWZXJ5IG5pY2UgYW5kIHNpbXBsZSBza2V3IGZhY3RvciBmb3IgM0RcclxuICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKHhpbiArIHMpO1xyXG4gICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeWluICsgcyk7XHJcbiAgICAgIHZhciBrID0gTWF0aC5mbG9vcih6aW4gKyBzKTtcclxuICAgICAgdmFyIHQgPSAoaSArIGogKyBrKSAqIEczO1xyXG4gICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseikgc3BhY2VcclxuICAgICAgdmFyIFkwID0gaiAtIHQ7XHJcbiAgICAgIHZhciBaMCA9IGsgLSB0O1xyXG4gICAgICB2YXIgeDAgPSB4aW4gLSBYMDsgLy8gVGhlIHgseSx6IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxyXG4gICAgICB2YXIgeTAgPSB5aW4gLSBZMDtcclxuICAgICAgdmFyIHowID0gemluIC0gWjA7XHJcbiAgICAgIC8vIEZvciB0aGUgM0QgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYSBzbGlnaHRseSBpcnJlZ3VsYXIgdGV0cmFoZWRyb24uXHJcbiAgICAgIC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cclxuICAgICAgdmFyIGkxLCBqMSwgazE7IC8vIE9mZnNldHMgZm9yIHNlY29uZCBjb3JuZXIgb2Ygc2ltcGxleCBpbiAoaSxqLGspIGNvb3Jkc1xyXG4gICAgICB2YXIgaTIsIGoyLCBrMjsgLy8gT2Zmc2V0cyBmb3IgdGhpcmQgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaixrKSBjb29yZHNcclxuICAgICAgaWYgKHgwID49IHkwKSB7XHJcbiAgICAgICAgaWYgKHkwID49IHowKSB7XHJcbiAgICAgICAgICBpMSA9IDE7XHJcbiAgICAgICAgICBqMSA9IDA7XHJcbiAgICAgICAgICBrMSA9IDA7XHJcbiAgICAgICAgICBpMiA9IDE7XHJcbiAgICAgICAgICBqMiA9IDE7XHJcbiAgICAgICAgICBrMiA9IDA7XHJcbiAgICAgICAgfSAvLyBYIFkgWiBvcmRlclxyXG4gICAgICAgIGVsc2UgaWYgKHgwID49IHowKSB7XHJcbiAgICAgICAgICBpMSA9IDE7XHJcbiAgICAgICAgICBqMSA9IDA7XHJcbiAgICAgICAgICBrMSA9IDA7XHJcbiAgICAgICAgICBpMiA9IDE7XHJcbiAgICAgICAgICBqMiA9IDA7XHJcbiAgICAgICAgICBrMiA9IDE7XHJcbiAgICAgICAgfSAvLyBYIFogWSBvcmRlclxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgaTEgPSAwO1xyXG4gICAgICAgICAgajEgPSAwO1xyXG4gICAgICAgICAgazEgPSAxO1xyXG4gICAgICAgICAgaTIgPSAxO1xyXG4gICAgICAgICAgajIgPSAwO1xyXG4gICAgICAgICAgazIgPSAxO1xyXG4gICAgICAgIH0gLy8gWiBYIFkgb3JkZXJcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHsgLy8geDA8eTBcclxuICAgICAgICBpZiAoeTAgPCB6MCkge1xyXG4gICAgICAgICAgaTEgPSAwO1xyXG4gICAgICAgICAgajEgPSAwO1xyXG4gICAgICAgICAgazEgPSAxO1xyXG4gICAgICAgICAgaTIgPSAwO1xyXG4gICAgICAgICAgajIgPSAxO1xyXG4gICAgICAgICAgazIgPSAxO1xyXG4gICAgICAgIH0gLy8gWiBZIFggb3JkZXJcclxuICAgICAgICBlbHNlIGlmICh4MCA8IHowKSB7XHJcbiAgICAgICAgICBpMSA9IDA7XHJcbiAgICAgICAgICBqMSA9IDE7XHJcbiAgICAgICAgICBrMSA9IDA7XHJcbiAgICAgICAgICBpMiA9IDA7XHJcbiAgICAgICAgICBqMiA9IDE7XHJcbiAgICAgICAgICBrMiA9IDE7XHJcbiAgICAgICAgfSAvLyBZIFogWCBvcmRlclxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgaTEgPSAwO1xyXG4gICAgICAgICAgajEgPSAxO1xyXG4gICAgICAgICAgazEgPSAwO1xyXG4gICAgICAgICAgaTIgPSAxO1xyXG4gICAgICAgICAgajIgPSAxO1xyXG4gICAgICAgICAgazIgPSAwO1xyXG4gICAgICAgIH0gLy8gWSBYIFogb3JkZXJcclxuICAgICAgfVxyXG4gICAgICAvLyBBIHN0ZXAgb2YgKDEsMCwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jLC1jKSBpbiAoeCx5LHopLFxyXG4gICAgICAvLyBhIHN0ZXAgb2YgKDAsMSwwKSBpbiAoaSxqLGspIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jLC1jKSBpbiAoeCx5LHopLCBhbmRcclxuICAgICAgLy8gYSBzdGVwIG9mICgwLDAsMSkgaW4gKGksaixrKSBtZWFucyBhIHN0ZXAgb2YgKC1jLC1jLDEtYykgaW4gKHgseSx6KSwgd2hlcmVcclxuICAgICAgLy8gYyA9IDEvNi5cclxuICAgICAgdmFyIHgxID0geDAgLSBpMSArIEczOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseikgY29vcmRzXHJcbiAgICAgIHZhciB5MSA9IHkwIC0gajEgKyBHMztcclxuICAgICAgdmFyIHoxID0gejAgLSBrMSArIEczO1xyXG4gICAgICB2YXIgeDIgPSB4MCAtIGkyICsgMi4wICogRzM7IC8vIE9mZnNldHMgZm9yIHRoaXJkIGNvcm5lciBpbiAoeCx5LHopIGNvb3Jkc1xyXG4gICAgICB2YXIgeTIgPSB5MCAtIGoyICsgMi4wICogRzM7XHJcbiAgICAgIHZhciB6MiA9IHowIC0gazIgKyAyLjAgKiBHMztcclxuICAgICAgdmFyIHgzID0geDAgLSAxLjAgKyAzLjAgKiBHMzsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSx6KSBjb29yZHNcclxuICAgICAgdmFyIHkzID0geTAgLSAxLjAgKyAzLjAgKiBHMztcclxuICAgICAgdmFyIHozID0gejAgLSAxLjAgKyAzLjAgKiBHMztcclxuICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSBmb3VyIHNpbXBsZXggY29ybmVyc1xyXG4gICAgICB2YXIgaWkgPSBpICYgMjU1O1xyXG4gICAgICB2YXIgamogPSBqICYgMjU1O1xyXG4gICAgICB2YXIga2sgPSBrICYgMjU1O1xyXG4gICAgICAvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSBmb3VyIGNvcm5lcnNcclxuICAgICAgdmFyIHQwID0gMC42IC0geDAgKiB4MCAtIHkwICogeTAgLSB6MCAqIHowO1xyXG4gICAgICBpZiAodDAgPCAwKSBuMCA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMCA9IHBlcm1Nb2QxMltpaSArIHBlcm1bamogKyBwZXJtW2trXV1dICogMztcclxuICAgICAgICB0MCAqPSB0MDtcclxuICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDNbZ2kwXSAqIHgwICsgZ3JhZDNbZ2kwICsgMV0gKiB5MCArIGdyYWQzW2dpMCArIDJdICogejApO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciB0MSA9IDAuNiAtIHgxICogeDEgLSB5MSAqIHkxIC0gejEgKiB6MTtcclxuICAgICAgaWYgKHQxIDwgMCkgbjEgPSAwLjA7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBnaTEgPSBwZXJtTW9kMTJbaWkgKyBpMSArIHBlcm1bamogKyBqMSArIHBlcm1ba2sgKyBrMV1dXSAqIDM7XHJcbiAgICAgICAgdDEgKj0gdDE7XHJcbiAgICAgICAgbjEgPSB0MSAqIHQxICogKGdyYWQzW2dpMV0gKiB4MSArIGdyYWQzW2dpMSArIDFdICogeTEgKyBncmFkM1tnaTEgKyAyXSAqIHoxKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDIgPSAwLjYgLSB4MiAqIHgyIC0geTIgKiB5MiAtIHoyICogejI7XHJcbiAgICAgIGlmICh0MiA8IDApIG4yID0gMC4wO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZ2kyID0gcGVybU1vZDEyW2lpICsgaTIgKyBwZXJtW2pqICsgajIgKyBwZXJtW2trICsgazJdXV0gKiAzO1xyXG4gICAgICAgIHQyICo9IHQyO1xyXG4gICAgICAgIG4yID0gdDIgKiB0MiAqIChncmFkM1tnaTJdICogeDIgKyBncmFkM1tnaTIgKyAxXSAqIHkyICsgZ3JhZDNbZ2kyICsgMl0gKiB6Mik7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHQzID0gMC42IC0geDMgKiB4MyAtIHkzICogeTMgLSB6MyAqIHozO1xyXG4gICAgICBpZiAodDMgPCAwKSBuMyA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMyA9IHBlcm1Nb2QxMltpaSArIDEgKyBwZXJtW2pqICsgMSArIHBlcm1ba2sgKyAxXV1dICogMztcclxuICAgICAgICB0MyAqPSB0MztcclxuICAgICAgICBuMyA9IHQzICogdDMgKiAoZ3JhZDNbZ2kzXSAqIHgzICsgZ3JhZDNbZ2kzICsgMV0gKiB5MyArIGdyYWQzW2dpMyArIDJdICogejMpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEFkZCBjb250cmlidXRpb25zIGZyb20gZWFjaCBjb3JuZXIgdG8gZ2V0IHRoZSBmaW5hbCBub2lzZSB2YWx1ZS5cclxuICAgICAgLy8gVGhlIHJlc3VsdCBpcyBzY2FsZWQgdG8gc3RheSBqdXN0IGluc2lkZSBbLTEsMV1cclxuICAgICAgcmV0dXJuIDMyLjAgKiAobjAgKyBuMSArIG4yICsgbjMpO1xyXG4gICAgfSxcclxuICAgIC8vIDREIHNpbXBsZXggbm9pc2UsIGJldHRlciBzaW1wbGV4IHJhbmsgb3JkZXJpbmcgbWV0aG9kIDIwMTItMDMtMDlcclxuICAgIG5vaXNlNEQ6IGZ1bmN0aW9uKHgsIHksIHosIHcpIHtcclxuICAgICAgdmFyIHBlcm0gPSB0aGlzLnBlcm07XHJcbiAgICAgIHZhciBncmFkNCA9IHRoaXMuZ3JhZDQ7XHJcblxyXG4gICAgICB2YXIgbjAsIG4xLCBuMiwgbjMsIG40OyAvLyBOb2lzZSBjb250cmlidXRpb25zIGZyb20gdGhlIGZpdmUgY29ybmVyc1xyXG4gICAgICAvLyBTa2V3IHRoZSAoeCx5LHosdykgc3BhY2UgdG8gZGV0ZXJtaW5lIHdoaWNoIGNlbGwgb2YgMjQgc2ltcGxpY2VzIHdlJ3JlIGluXHJcbiAgICAgIHZhciBzID0gKHggKyB5ICsgeiArIHcpICogRjQ7IC8vIEZhY3RvciBmb3IgNEQgc2tld2luZ1xyXG4gICAgICB2YXIgaSA9IE1hdGguZmxvb3IoeCArIHMpO1xyXG4gICAgICB2YXIgaiA9IE1hdGguZmxvb3IoeSArIHMpO1xyXG4gICAgICB2YXIgayA9IE1hdGguZmxvb3IoeiArIHMpO1xyXG4gICAgICB2YXIgbCA9IE1hdGguZmxvb3IodyArIHMpO1xyXG4gICAgICB2YXIgdCA9IChpICsgaiArIGsgKyBsKSAqIEc0OyAvLyBGYWN0b3IgZm9yIDREIHVuc2tld2luZ1xyXG4gICAgICB2YXIgWDAgPSBpIC0gdDsgLy8gVW5za2V3IHRoZSBjZWxsIG9yaWdpbiBiYWNrIHRvICh4LHkseix3KSBzcGFjZVxyXG4gICAgICB2YXIgWTAgPSBqIC0gdDtcclxuICAgICAgdmFyIFowID0gayAtIHQ7XHJcbiAgICAgIHZhciBXMCA9IGwgLSB0O1xyXG4gICAgICB2YXIgeDAgPSB4IC0gWDA7IC8vIFRoZSB4LHkseix3IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxyXG4gICAgICB2YXIgeTAgPSB5IC0gWTA7XHJcbiAgICAgIHZhciB6MCA9IHogLSBaMDtcclxuICAgICAgdmFyIHcwID0gdyAtIFcwO1xyXG4gICAgICAvLyBGb3IgdGhlIDREIGNhc2UsIHRoZSBzaW1wbGV4IGlzIGEgNEQgc2hhcGUgSSB3b24ndCBldmVuIHRyeSB0byBkZXNjcmliZS5cclxuICAgICAgLy8gVG8gZmluZCBvdXQgd2hpY2ggb2YgdGhlIDI0IHBvc3NpYmxlIHNpbXBsaWNlcyB3ZSdyZSBpbiwgd2UgbmVlZCB0b1xyXG4gICAgICAvLyBkZXRlcm1pbmUgdGhlIG1hZ25pdHVkZSBvcmRlcmluZyBvZiB4MCwgeTAsIHowIGFuZCB3MC5cclxuICAgICAgLy8gU2l4IHBhaXItd2lzZSBjb21wYXJpc29ucyBhcmUgcGVyZm9ybWVkIGJldHdlZW4gZWFjaCBwb3NzaWJsZSBwYWlyXHJcbiAgICAgIC8vIG9mIHRoZSBmb3VyIGNvb3JkaW5hdGVzLCBhbmQgdGhlIHJlc3VsdHMgYXJlIHVzZWQgdG8gcmFuayB0aGUgbnVtYmVycy5cclxuICAgICAgdmFyIHJhbmt4ID0gMDtcclxuICAgICAgdmFyIHJhbmt5ID0gMDtcclxuICAgICAgdmFyIHJhbmt6ID0gMDtcclxuICAgICAgdmFyIHJhbmt3ID0gMDtcclxuICAgICAgaWYgKHgwID4geTApIHJhbmt4Kys7XHJcbiAgICAgIGVsc2UgcmFua3krKztcclxuICAgICAgaWYgKHgwID4gejApIHJhbmt4Kys7XHJcbiAgICAgIGVsc2UgcmFua3orKztcclxuICAgICAgaWYgKHgwID4gdzApIHJhbmt4Kys7XHJcbiAgICAgIGVsc2UgcmFua3crKztcclxuICAgICAgaWYgKHkwID4gejApIHJhbmt5Kys7XHJcbiAgICAgIGVsc2UgcmFua3orKztcclxuICAgICAgaWYgKHkwID4gdzApIHJhbmt5Kys7XHJcbiAgICAgIGVsc2UgcmFua3crKztcclxuICAgICAgaWYgKHowID4gdzApIHJhbmt6Kys7XHJcbiAgICAgIGVsc2UgcmFua3crKztcclxuICAgICAgdmFyIGkxLCBqMSwgazEsIGwxOyAvLyBUaGUgaW50ZWdlciBvZmZzZXRzIGZvciB0aGUgc2Vjb25kIHNpbXBsZXggY29ybmVyXHJcbiAgICAgIHZhciBpMiwgajIsIGsyLCBsMjsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIHRoaXJkIHNpbXBsZXggY29ybmVyXHJcbiAgICAgIHZhciBpMywgajMsIGszLCBsMzsgLy8gVGhlIGludGVnZXIgb2Zmc2V0cyBmb3IgdGhlIGZvdXJ0aCBzaW1wbGV4IGNvcm5lclxyXG4gICAgICAvLyBzaW1wbGV4W2NdIGlzIGEgNC12ZWN0b3Igd2l0aCB0aGUgbnVtYmVycyAwLCAxLCAyIGFuZCAzIGluIHNvbWUgb3JkZXIuXHJcbiAgICAgIC8vIE1hbnkgdmFsdWVzIG9mIGMgd2lsbCBuZXZlciBvY2N1ciwgc2luY2UgZS5nLiB4Pnk+ej53IG1ha2VzIHg8eiwgeTx3IGFuZCB4PHdcclxuICAgICAgLy8gaW1wb3NzaWJsZS4gT25seSB0aGUgMjQgaW5kaWNlcyB3aGljaCBoYXZlIG5vbi16ZXJvIGVudHJpZXMgbWFrZSBhbnkgc2Vuc2UuXHJcbiAgICAgIC8vIFdlIHVzZSBhIHRocmVzaG9sZGluZyB0byBzZXQgdGhlIGNvb3JkaW5hdGVzIGluIHR1cm4gZnJvbSB0aGUgbGFyZ2VzdCBtYWduaXR1ZGUuXHJcbiAgICAgIC8vIFJhbmsgMyBkZW5vdGVzIHRoZSBsYXJnZXN0IGNvb3JkaW5hdGUuXHJcbiAgICAgIGkxID0gcmFua3ggPj0gMyA/IDEgOiAwO1xyXG4gICAgICBqMSA9IHJhbmt5ID49IDMgPyAxIDogMDtcclxuICAgICAgazEgPSByYW5reiA+PSAzID8gMSA6IDA7XHJcbiAgICAgIGwxID0gcmFua3cgPj0gMyA/IDEgOiAwO1xyXG4gICAgICAvLyBSYW5rIDIgZGVub3RlcyB0aGUgc2Vjb25kIGxhcmdlc3QgY29vcmRpbmF0ZS5cclxuICAgICAgaTIgPSByYW5reCA+PSAyID8gMSA6IDA7XHJcbiAgICAgIGoyID0gcmFua3kgPj0gMiA/IDEgOiAwO1xyXG4gICAgICBrMiA9IHJhbmt6ID49IDIgPyAxIDogMDtcclxuICAgICAgbDIgPSByYW5rdyA+PSAyID8gMSA6IDA7XHJcbiAgICAgIC8vIFJhbmsgMSBkZW5vdGVzIHRoZSBzZWNvbmQgc21hbGxlc3QgY29vcmRpbmF0ZS5cclxuICAgICAgaTMgPSByYW5reCA+PSAxID8gMSA6IDA7XHJcbiAgICAgIGozID0gcmFua3kgPj0gMSA/IDEgOiAwO1xyXG4gICAgICBrMyA9IHJhbmt6ID49IDEgPyAxIDogMDtcclxuICAgICAgbDMgPSByYW5rdyA+PSAxID8gMSA6IDA7XHJcbiAgICAgIC8vIFRoZSBmaWZ0aCBjb3JuZXIgaGFzIGFsbCBjb29yZGluYXRlIG9mZnNldHMgPSAxLCBzbyBubyBuZWVkIHRvIGNvbXB1dGUgdGhhdC5cclxuICAgICAgdmFyIHgxID0geDAgLSBpMSArIEc0OyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgY29ybmVyIGluICh4LHkseix3KSBjb29yZHNcclxuICAgICAgdmFyIHkxID0geTAgLSBqMSArIEc0O1xyXG4gICAgICB2YXIgejEgPSB6MCAtIGsxICsgRzQ7XHJcbiAgICAgIHZhciB3MSA9IHcwIC0gbDEgKyBHNDtcclxuICAgICAgdmFyIHgyID0geDAgLSBpMiArIDIuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciB0aGlyZCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xyXG4gICAgICB2YXIgeTIgPSB5MCAtIGoyICsgMi4wICogRzQ7XHJcbiAgICAgIHZhciB6MiA9IHowIC0gazIgKyAyLjAgKiBHNDtcclxuICAgICAgdmFyIHcyID0gdzAgLSBsMiArIDIuMCAqIEc0O1xyXG4gICAgICB2YXIgeDMgPSB4MCAtIGkzICsgMy4wICogRzQ7IC8vIE9mZnNldHMgZm9yIGZvdXJ0aCBjb3JuZXIgaW4gKHgseSx6LHcpIGNvb3Jkc1xyXG4gICAgICB2YXIgeTMgPSB5MCAtIGozICsgMy4wICogRzQ7XHJcbiAgICAgIHZhciB6MyA9IHowIC0gazMgKyAzLjAgKiBHNDtcclxuICAgICAgdmFyIHczID0gdzAgLSBsMyArIDMuMCAqIEc0O1xyXG4gICAgICB2YXIgeDQgPSB4MCAtIDEuMCArIDQuMCAqIEc0OyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5LHosdykgY29vcmRzXHJcbiAgICAgIHZhciB5NCA9IHkwIC0gMS4wICsgNC4wICogRzQ7XHJcbiAgICAgIHZhciB6NCA9IHowIC0gMS4wICsgNC4wICogRzQ7XHJcbiAgICAgIHZhciB3NCA9IHcwIC0gMS4wICsgNC4wICogRzQ7XHJcbiAgICAgIC8vIFdvcmsgb3V0IHRoZSBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlcyBvZiB0aGUgZml2ZSBzaW1wbGV4IGNvcm5lcnNcclxuICAgICAgdmFyIGlpID0gaSAmIDI1NTtcclxuICAgICAgdmFyIGpqID0gaiAmIDI1NTtcclxuICAgICAgdmFyIGtrID0gayAmIDI1NTtcclxuICAgICAgdmFyIGxsID0gbCAmIDI1NTtcclxuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgZml2ZSBjb3JuZXJzXHJcbiAgICAgIHZhciB0MCA9IDAuNiAtIHgwICogeDAgLSB5MCAqIHkwIC0gejAgKiB6MCAtIHcwICogdzA7XHJcbiAgICAgIGlmICh0MCA8IDApIG4wID0gMC4wO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgZ2kwID0gKHBlcm1baWkgKyBwZXJtW2pqICsgcGVybVtrayArIHBlcm1bbGxdXV1dICUgMzIpICogNDtcclxuICAgICAgICB0MCAqPSB0MDtcclxuICAgICAgICBuMCA9IHQwICogdDAgKiAoZ3JhZDRbZ2kwXSAqIHgwICsgZ3JhZDRbZ2kwICsgMV0gKiB5MCArIGdyYWQ0W2dpMCArIDJdICogejAgKyBncmFkNFtnaTAgKyAzXSAqIHcwKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDEgPSAwLjYgLSB4MSAqIHgxIC0geTEgKiB5MSAtIHoxICogejEgLSB3MSAqIHcxO1xyXG4gICAgICBpZiAodDEgPCAwKSBuMSA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMSA9IChwZXJtW2lpICsgaTEgKyBwZXJtW2pqICsgajEgKyBwZXJtW2trICsgazEgKyBwZXJtW2xsICsgbDFdXV1dICUgMzIpICogNDtcclxuICAgICAgICB0MSAqPSB0MTtcclxuICAgICAgICBuMSA9IHQxICogdDEgKiAoZ3JhZDRbZ2kxXSAqIHgxICsgZ3JhZDRbZ2kxICsgMV0gKiB5MSArIGdyYWQ0W2dpMSArIDJdICogejEgKyBncmFkNFtnaTEgKyAzXSAqIHcxKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDIgPSAwLjYgLSB4MiAqIHgyIC0geTIgKiB5MiAtIHoyICogejIgLSB3MiAqIHcyO1xyXG4gICAgICBpZiAodDIgPCAwKSBuMiA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMiA9IChwZXJtW2lpICsgaTIgKyBwZXJtW2pqICsgajIgKyBwZXJtW2trICsgazIgKyBwZXJtW2xsICsgbDJdXV1dICUgMzIpICogNDtcclxuICAgICAgICB0MiAqPSB0MjtcclxuICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZDRbZ2kyXSAqIHgyICsgZ3JhZDRbZ2kyICsgMV0gKiB5MiArIGdyYWQ0W2dpMiArIDJdICogejIgKyBncmFkNFtnaTIgKyAzXSAqIHcyKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDMgPSAwLjYgLSB4MyAqIHgzIC0geTMgKiB5MyAtIHozICogejMgLSB3MyAqIHczO1xyXG4gICAgICBpZiAodDMgPCAwKSBuMyA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpMyA9IChwZXJtW2lpICsgaTMgKyBwZXJtW2pqICsgajMgKyBwZXJtW2trICsgazMgKyBwZXJtW2xsICsgbDNdXV1dICUgMzIpICogNDtcclxuICAgICAgICB0MyAqPSB0MztcclxuICAgICAgICBuMyA9IHQzICogdDMgKiAoZ3JhZDRbZ2kzXSAqIHgzICsgZ3JhZDRbZ2kzICsgMV0gKiB5MyArIGdyYWQ0W2dpMyArIDJdICogejMgKyBncmFkNFtnaTMgKyAzXSAqIHczKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgdDQgPSAwLjYgLSB4NCAqIHg0IC0geTQgKiB5NCAtIHo0ICogejQgLSB3NCAqIHc0O1xyXG4gICAgICBpZiAodDQgPCAwKSBuNCA9IDAuMDtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGdpNCA9IChwZXJtW2lpICsgMSArIHBlcm1bamogKyAxICsgcGVybVtrayArIDEgKyBwZXJtW2xsICsgMV1dXV0gJSAzMikgKiA0O1xyXG4gICAgICAgIHQ0ICo9IHQ0O1xyXG4gICAgICAgIG40ID0gdDQgKiB0NCAqIChncmFkNFtnaTRdICogeDQgKyBncmFkNFtnaTQgKyAxXSAqIHk0ICsgZ3JhZDRbZ2k0ICsgMl0gKiB6NCArIGdyYWQ0W2dpNCArIDNdICogdzQpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFN1bSB1cCBhbmQgc2NhbGUgdGhlIHJlc3VsdCB0byBjb3ZlciB0aGUgcmFuZ2UgWy0xLDFdXHJcbiAgICAgIHJldHVybiAyNy4wICogKG4wICsgbjEgKyBuMiArIG4zICsgbjQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIGJ1aWxkUGVybXV0YXRpb25UYWJsZShyYW5kb20pIHtcclxuICAgIHZhciBpO1xyXG4gICAgdmFyIHAgPSBuZXcgVWludDhBcnJheSgyNTYpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IDI1NjsgaSsrKSB7XHJcbiAgICAgIHBbaV0gPSBpO1xyXG4gICAgfVxyXG4gICAgZm9yIChpID0gMDsgaSA8IDI1NTsgaSsrKSB7XHJcbiAgICAgIHZhciByID0gaSArIH5+KHJhbmRvbSgpICogKDI1NiAtIGkpKTtcclxuICAgICAgdmFyIGF1eCA9IHBbaV07XHJcbiAgICAgIHBbaV0gPSBwW3JdO1xyXG4gICAgICBwW3JdID0gYXV4O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHA7XHJcbiAgfVxyXG4gIFNpbXBsZXhOb2lzZS5fYnVpbGRQZXJtdXRhdGlvblRhYmxlID0gYnVpbGRQZXJtdXRhdGlvblRhYmxlO1xyXG5cclxuICAvKlxyXG4gIFRoZSBBTEVBIFBSTkcgYW5kIG1hc2hlciBjb2RlIHVzZWQgYnkgc2ltcGxleC1ub2lzZS5qc1xyXG4gIGlzIGJhc2VkIG9uIGNvZGUgYnkgSm9oYW5uZXMgQmFhZ8O4ZSwgbW9kaWZpZWQgYnkgSm9uYXMgV2FnbmVyLlxyXG4gIFNlZSBhbGVhLm1kIGZvciB0aGUgZnVsbCBsaWNlbnNlLlxyXG4gICovXHJcbiAgZnVuY3Rpb24gYWxlYSgpIHtcclxuICAgIHZhciBzMCA9IDA7XHJcbiAgICB2YXIgczEgPSAwO1xyXG4gICAgdmFyIHMyID0gMDtcclxuICAgIHZhciBjID0gMTtcclxuXHJcbiAgICB2YXIgbWFzaCA9IG1hc2hlcigpO1xyXG4gICAgczAgPSBtYXNoKCcgJyk7XHJcbiAgICBzMSA9IG1hc2goJyAnKTtcclxuICAgIHMyID0gbWFzaCgnICcpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHMwIC09IG1hc2goYXJndW1lbnRzW2ldKTtcclxuICAgICAgaWYgKHMwIDwgMCkge1xyXG4gICAgICAgIHMwICs9IDE7XHJcbiAgICAgIH1cclxuICAgICAgczEgLT0gbWFzaChhcmd1bWVudHNbaV0pO1xyXG4gICAgICBpZiAoczEgPCAwKSB7XHJcbiAgICAgICAgczEgKz0gMTtcclxuICAgICAgfVxyXG4gICAgICBzMiAtPSBtYXNoKGFyZ3VtZW50c1tpXSk7XHJcbiAgICAgIGlmIChzMiA8IDApIHtcclxuICAgICAgICBzMiArPSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBtYXNoID0gbnVsbDtcclxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHQgPSAyMDkxNjM5ICogczAgKyBjICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcclxuICAgICAgczAgPSBzMTtcclxuICAgICAgczEgPSBzMjtcclxuICAgICAgcmV0dXJuIHMyID0gdCAtIChjID0gdCB8IDApO1xyXG4gICAgfTtcclxuICB9XHJcbiAgZnVuY3Rpb24gbWFzaGVyKCkge1xyXG4gICAgdmFyIG4gPSAweGVmYzgyNDlkO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbiArPSBkYXRhLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgdmFyIGggPSAwLjAyNTE5NjAzMjgyNDE2OTM4ICogbjtcclxuICAgICAgICBuID0gaCA+Pj4gMDtcclxuICAgICAgICBoIC09IG47XHJcbiAgICAgICAgaCAqPSBuO1xyXG4gICAgICAgIG4gPSBoID4+PiAwO1xyXG4gICAgICAgIGggLT0gbjtcclxuICAgICAgICBuICs9IGggKiAweDEwMDAwMDAwMDsgLy8gMl4zMlxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAobiA+Pj4gMCkgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vIGFtZFxyXG4gIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIFNpbXBsZXhOb2lzZTt9KTtcclxuICAvLyBjb21tb24ganNcclxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSBleHBvcnRzLlNpbXBsZXhOb2lzZSA9IFNpbXBsZXhOb2lzZTtcclxuICAvLyBicm93c2VyXHJcbiAgZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHdpbmRvdy5TaW1wbGV4Tm9pc2UgPSBTaW1wbGV4Tm9pc2U7XHJcbiAgLy8gbm9kZWpzXHJcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IFNpbXBsZXhOb2lzZTtcclxuICB9XHJcblxyXG59KSgpO1xyXG4iLCJyZXF1aXJlKCcuLi90eXBlRGVmcycpO1xyXG5cclxuLyoqXHJcbiogY2FjaGVkIHZhbHVlc1xyXG4qL1xyXG5jb25zdCBwaUJ5SGFsZiA9IE1hdGguUGkgLyAxODA7XHJcbmNvbnN0IGhhbGZCeVBpID0gMTgwIC8gTWF0aC5QSTtcclxuXHJcbi8qKlxyXG4qIHByb3ZpZGVzIHRyaWdvbm9taWMgdXRpbGl0eSBtZXRob2RzIGFuZCBoZWxwZXJzLlxyXG4qIEBtb2R1bGVcclxuKi9cclxubGV0IHRyaWdvbm9taWNVdGlscyA9IHtcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBhbmdsZVxyXG5cdCAqIEBkZXNjcmlwdGlvbiBjYWxjdWxhdGUgYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHRvIHZlY3RvciBwb2ludHMuXHJcblx0ICogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuXHQgKiBAcGFyYW0ge251bWJlcn0geTEgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgYW5nbGUgaW4gcmFkaWFucy5cclxuXHQgKi9cclxuXHRhbmdsZTogZnVuY3Rpb24ob3JpZ2luWCwgb3JpZ2luWSwgdGFyZ2V0WCwgdGFyZ2V0WSkge1xyXG4gICAgICAgIHZhciBkeCA9IG9yaWdpblggLSB0YXJnZXRYO1xyXG4gICAgICAgIHZhciBkeSA9IG9yaWdpblkgLSB0YXJnZXRZO1xyXG4gICAgICAgIHZhciB0aGV0YSA9IE1hdGguYXRhbjIoLWR5LCAtZHgpO1xyXG4gICAgICAgIHJldHVybiB0aGV0YTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0UmFkaWFuQW5nbGVCZXR3ZWVuMlZlY3RvcnM6IGZ1bmN0aW9uKCB4MSwgeTEsIHgyLCB5MiApIHtcclxuICAgIFx0cmV0dXJuIE1hdGguYXRhbjIoeTIgLSB5MSwgeDIgLSB4MSk7XHJcbiAgICB9LFxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZGlzdFxyXG5cdCogQGRlc2NyaXB0aW9uIGNhbGN1bGF0ZSBkaXN0YW5jZSBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgxIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkxIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHkyIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG5cdCogQHJldHVybnMge251bWJlcn0gdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIDIgcG9pbnRzLlxyXG5cdCovXHJcblx0ZGlzdDogZnVuY3Rpb24gZGlzdCh4MSwgeTEsIHgyLCB5Mikge1xyXG5cdFx0eDIgLT0geDE7eTIgLT0geTE7XHJcblx0XHRyZXR1cm4gTWF0aC5zcXJ0KHgyICogeDIgKyB5MiAqIHkyKTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQqIEBuYW1lIGRlZ3JlZXNUb1JhZGlhbnNcclxuXHQqIEBkZXNjcmlwdGlvbiBjb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFucy5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWVzIC0gdGhlIGRlZ3JlZSB2YWx1ZSB0byBjb252ZXJ0LlxyXG5cdCogQHJldHVybnMge251bWJlcn0gcmVzdWx0IGFzIHJhZGlhbnMuXHJcblx0Ki9cclxuXHRkZWdyZWVzVG9SYWRpYW5zOiBmdW5jdGlvbihkZWdyZWVzKSB7XHJcblx0XHRyZXR1cm4gZGVncmVlcyAqIHBpQnlIYWxmO1xyXG5cdH0sXHJcblxyXG5cdGQyUjogdGhpcy5kZWdyZWVzVG9SYWRpYW5zLFxyXG5cdC8qKlxyXG5cdCogQG5hbWUgcmFkaWFuc1RvRGVncmVlc1xyXG5cdCogQGRlc2NyaXB0aW9uIGNvbnZlcnQgcmFkaWFucyB0byBkZWdyZWVzLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSB0aGUgZGVncmVlIHZhbHVlIHRvIGNvbnZlcnQuXHJcblx0KiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQgYXMgZGVncmVlcy5cclxuXHQqL1xyXG5cdHJhZGlhbnNUb0RlZ3JlZXM6IGZ1bmN0aW9uKHJhZGlhbnMpIHtcclxuXHRcdHJldHVybiByYWRpYW5zICogaGFsZkJ5UGk7XHJcblx0fSxcclxuXHJcblx0cjJEOiB0aGlzLnJhZGlhbnNUb0RlZ3JlZXMsXHJcblx0LyoqXHJcblx0KiBAbmFtZSBnZXRBbmdsZUFuZERpc3RhbmNlXHJcbiBcdCogQGRlc2NyaXB0aW9uIGNhbGN1bGF0ZSB0cmlnb21vbWljIHZhbHVlcyBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG4gXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4MiAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuXHQqIEByZXR1cm5zIHt2ZWN0b3JDYWxjdWxhdGlvbn0gdGhlIGNhbGN1bGF0ZWQgYW5nbGUgYW5kIGRpc3RhbmNlIGJldHdlZW4gdmVjdG9yc1xyXG5cdCovXHJcblx0Z2V0QW5nbGVBbmREaXN0YW5jZTogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIpIHtcclxuXHJcblx0XHQvLyBzZXQgdXAgYmFzZSB2YWx1ZXNcclxuXHRcdHZhciBkWCA9IHgyIC0geDE7XHJcblx0XHR2YXIgZFkgPSB5MiAtIHkxO1xyXG5cdFx0Ly8gZ2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwb2ludHNcclxuXHRcdHZhciBkID0gTWF0aC5zcXJ0KGRYICogZFggKyBkWSAqIGRZKTtcclxuXHRcdC8vIGFuZ2xlIGluIHJhZGlhbnNcclxuXHRcdC8vIHZhciByYWRpYW5zID0gTWF0aC5hdGFuMih5RGlzdCwgeERpc3QpICogMTgwIC8gTWF0aC5QSTtcclxuXHRcdC8vIGFuZ2xlIGluIHJhZGlhbnNcclxuXHRcdHZhciByID0gTWF0aC5hdGFuMihkWSwgZFgpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZGlzdGFuY2U6IGQsXHJcblx0XHRcdGFuZ2xlOiByXHJcblx0XHR9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZ2V0QWRqYWNlbnRMZW5ndGhcclxuXHQqIEBkZXNjcmlwdGlvbiBnZXQgbGVuZ3RoIG9mIHRoZSBBZGphY2VudCBzaWRlIG9mIGEgcmlnaHQtYW5nbGVkIHRyaWFuZ2xlLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSB0aGUgYW5nbGUgb3IgdGhlIHRyaWFuZ2xlLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGh5cG90b251c2UgLSB0aGUgbGVuZ3RoIG9mIHRoZSBoeXBvdGVudXNlLlxyXG5cdCogQHJldHVybnMge251bWJlcn0gcmVzdWx0IC0gdGhlIGxlbmd0aCBvZiB0aGUgQWRqYWNlbnQgc2lkZS5cclxuXHQqL1xyXG5cdGdldEFkamFjZW50TGVuZ3RoOiBmdW5jdGlvbiBnZXRBZGphY2VudExlbmd0aChyYWRpYW5zLCBoeXBvdG9udXNlKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5jb3MocmFkaWFucykgKiBoeXBvdG9udXNlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZ2V0T3Bwb3NpdGVMZW5ndGhcclxuXHQqIEBkZXNjcmlwdGlvbiBnZXQgbGVuZ3RoIG9mIHRoZSBPcHBvc2l0ZSBzaWRlIG9mIGEgcmlnaHQtYW5nbGVkIHRyaWFuZ2xlLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnMgLSB0aGUgYW5nbGUgb3IgdGhlIHRyaWFuZ2xlLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGh5cG90b251c2UgLSB0aGUgbGVuZ3RoIG9mIHRoZSBoeXBvdGVudXNlLlxyXG5cdCogQHJldHVybnMge251bWJlcn0gcmVzdWx0IC0gdGhlIGxlbmd0aCBvZiB0aGUgT3Bwb3NpdGUgc2lkZS5cclxuXHQqL1xyXG5cdGdldE9wcG9zaXRlTGVuZ3RoOiBmdW5jdGlvbihyYWRpYW5zLCBoeXBvdG9udXNlKSB7XHJcblx0XHRyZXR1cm4gTWF0aC5zaW4ocmFkaWFucykgKiBoeXBvdG9udXNlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgY2FsY3VsYXRlVmVsb2NpdGllc1xyXG5cdCogQGRlc2NyaXB0aW9uIGdpdmVuIGFuIG9yaWdpbiAoeC95KSwgYW5nbGUgYW5kIGltcHVsc2UgKGFic29sdXRlIHZlbG9jaXR5KSBjYWxjdWxhdGUgcmVsYXRpdmUgeC95IHZlbG9jaXRpZXMuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0geCAtIHRoZSBjb29yZGluYXRlIFggdmFsdWUgb2YgdGhlIG9yaWdpbi5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5IC0gdGhlIGNvb3JkaW5hdGUgWSB2YWx1ZSBvZiB0aGUgb3JpZ2luLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gdGhlIGFuZ2xlIGluIHJhZGlhbnMuXHJcblx0KiBAcGFyYW0ge251bWJlcn0gaW1wdWxzZSAtIHRoZSBkZWx0YSBjaGFuZ2UgdmFsdWUuXHJcblx0KiBAcmV0dXJucyB7VmVsb2NpdHlWZWN0b3J9IHJlc3VsdCAtIHJlbGF0aXZlIGRlbHRhIGNoYW5nZSB2ZWxvY2l0eSBmb3IgWC9ZLlxyXG5cdCovXHJcblx0Y2FsY3VsYXRlVmVsb2NpdGllczogZnVuY3Rpb24oeCwgeSwgYW5nbGUsIGltcHVsc2UpIHtcclxuXHRcdHZhciBhMiA9IE1hdGguYXRhbjIoTWF0aC5zaW4oYW5nbGUpICogaW1wdWxzZSArIHkgLSB5LCBNYXRoLmNvcyhhbmdsZSkgKiBpbXB1bHNlICsgeCAtIHgpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0eFZlbDogTWF0aC5jb3MoYTIpICogaW1wdWxzZSxcclxuXHRcdFx0eVZlbDogTWF0aC5zaW4oYTIpICogaW1wdWxzZVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgcmFkaWFsRGlzdHJpYnV0aW9uXHJcblx0KiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIG5ldyBQb2ludCB2ZWN0b3IgKHgveSkgYXQgdGhlIGdpdmVuIGRpc3RhbmNlIChyKSBmcm9tIHRoZSBvcmlnaW4gYXQgdGhlIGFuZ2xlIChhKSAuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0geCAtIHRoZSBjb29yZGluYXRlIFggdmFsdWUgb2YgdGhlIG9yaWdpbi5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5IC0gdGhlIGNvb3JkaW5hdGUgWSB2YWx1ZSBvZiB0aGUgb3JpZ2luLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGQgLSB0aGUgYWJzb2x1dGUgZGVsdGEgY2hhbmdlIHZhbHVlLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGEgLSB0aGUgYW5nbGUgaW4gcmFkaWFucy5cclxuXHQqIEByZXR1cm5zIHtQb2ludH0gLSB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIG5ldyBwb2ludC5cclxuXHQqL1xyXG5cdHJhZGlhbERpc3RyaWJ1dGlvbjogZnVuY3Rpb24oeCwgeSwgZCwgYSkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0eDogeCArIGQgKiBNYXRoLmNvcyhhKSxcclxuXHRcdFx0eTogeSArIGQgKiBNYXRoLnNpbihhKVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZmluZE5ld1BvaW50XHJcblx0KiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIG5ldyBQb2ludCB2ZWN0b3IgKHgveSkgYXQgdGhlIGdpdmVuIGRpc3RhbmNlIChyKSBmcm9tIHRoZSBvcmlnaW4gYXQgdGhlIGFuZ2xlIChhKSAuXHJcblx0KiBAbWVtYmVyb2YgdHJpZ29ub21pY1V0aWxzXHJcblx0KiBAcGFyYW0ge251bWJlcn0geCAtIHRoZSBjb29yZGluYXRlIFggdmFsdWUgb2YgdGhlIG9yaWdpbi5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5IC0gdGhlIGNvb3JkaW5hdGUgWSB2YWx1ZSBvZiB0aGUgb3JpZ2luLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0gdGhlIGFuZ2xlIGluIHJhZGlhbnMuXHJcblx0KiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSB0aGUgYWJzb2x1dGUgZGVsdGEgY2hhbmdlIHZhbHVlLlxyXG5cdCogQHJldHVybnMge1BvaW50fSAtIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgbmV3IHBvaW50LlxyXG5cdCovXHJcblx0ZmluZE5ld1BvaW50OiBmdW5jdGlvbih4LCB5LCBhbmdsZSwgZGlzdGFuY2UpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHg6IE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlICsgeCxcclxuXHRcdFx0eTogTWF0aC5zaW4oYW5nbGUpICogZGlzdGFuY2UgKyB5XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBnZXRQb2ludE9uUGF0aFxyXG5cdCogQGRlc2NyaXB0aW9uIFJldHVybnMgYSBuZXcgUG9pbnQgdmVjdG9yICh4L3kpIGF0IHRoZSBnaXZlbiBkaXN0YW5jZSAoZGlzdGFuY2UpIGFsb25nIGEgcGF0aCBkZWZpbmVkIGJ5IHgxL3kxLCB4Mi95Mi5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIHRoZSBjb29yZGluYXRlIFggdmFsdWUgb2YgdGhlIHBhdGggc3RhcnQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geTEgLSB0aGUgY29vcmRpbmF0ZSBZIHZhbHVlIG9mIHRoZSBwYXRoIHN0YXJ0LlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgyIC0gdGhlIGNvb3JkaW5hdGUgWCB2YWx1ZSBvZiB0aGUgcGF0aCBlbmQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geTIgLSB0aGUgY29vcmRpbmF0ZSBZIHZhbHVlIG9mIHRoZSBwYXRoIGVuZC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMSB3aGVyZSAwIGlzIHRoZSBwYXRoIHN0YXJ0LCAxIGlzIHRoZSBwYXRoIGVuZCwgYW5kIDAuNSBpcyB0aGUgcGF0aCBtaWRwb2ludC5cclxuXHQqL1xyXG5cdGdldFBvaW50T25QYXRoOiBmdW5jdGlvbiggeDEsIHkxLCB4MiwgeTIsIGRpc3RhbmNlICkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0eDogeDEgKyAoIHgyIC0geDEgKSAqIGRpc3RhbmNlLFxyXG5cdFx0XHR5OiB5MSArICggeTIgLSB5MSApICogZGlzdGFuY2VcclxuXHRcdH1cclxuXHR9LFxyXG5cdC8qKlxyXG5cdCogQG5hbWUgY29tcHV0ZU5vcm1hbHNcclxuXHQqIEBkZXNjcmlwdGlvbiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjQzNjE0L2hvdy1kby1pLWNhbGN1bGF0ZS10aGUtbm9ybWFsLXZlY3Rvci1vZi1hLWxpbmUtc2VnbWVudFxyXG5cdCogaWYgd2UgZGVmaW5lIGR4PXgyLXgxIGFuZCBkeT15Mi15MVxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgxIC0gdGhlIGNvb3JkaW5hdGUgWCB2YWx1ZSBvZiB0aGUgcGF0aCBzdGFydC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIHRoZSBjb29yZGluYXRlIFkgdmFsdWUgb2YgdGhlIHBhdGggc3RhcnQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geDIgLSB0aGUgY29vcmRpbmF0ZSBYIHZhbHVlIG9mIHRoZSBwYXRoIGVuZC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIHRoZSBjb29yZGluYXRlIFkgdmFsdWUgb2YgdGhlIHBhdGggZW5kLlxyXG5cdCogQHJldHVybnMge29iamVjdH0gLSBUaGUgMiBub3JtYWwgdmVjdG9ycyBmcm9tIHRoZSBkZWZpbmVkIHBhdGggYXMgcG9pbnRzXHJcblx0Ki9cclxuXHRjb21wdXRlTm9ybWFsczogZnVuY3Rpb24oIHgxLCB5MSwgeDIsIHkyICkge1xyXG5cdFx0bGV0IGR4ID0geDIgLSB4MTtcclxuXHRcdGxldCBkeSA9IHkyIC0geTE7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuMTogeyB4OiAtZHksIHk6IGR4IH0sXHJcblx0XHRcdG4yOiB7IHg6IGR5LCB5OiAtZHggfSxcclxuXHRcdH1cclxuXHR9LFxyXG5cdC8qKlxyXG5cdCogQG5hbWUgc3ViZGl2aWRlXHJcblx0KiBAZGVzY3JpcHRpb24gc3ViZGl2aWRlcyBhIHZlY3RvciBwYXRoICh4MSwgeTEsIHgyLCB5MikgcHJvcG9ydGlvbmF0ZSB0byB0aGUgYmlhc1xyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtudW1iZXJ9IHgxIC0gdGhlIGNvb3JkaW5hdGUgWCB2YWx1ZSBvZiB0aGUgcGF0aCBzdGFydC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIHRoZSBjb29yZGluYXRlIFkgdmFsdWUgb2YgdGhlIHBhdGggc3RhcnQuXHJcblx0KiBAcGFyYW0ge251bWJlcn0geDIgLSB0aGUgY29vcmRpbmF0ZSBYIHZhbHVlIG9mIHRoZSBwYXRoIGVuZC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIHRoZSBjb29yZGluYXRlIFkgdmFsdWUgb2YgdGhlIHBhdGggZW5kLlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGJpYXMgLSBvZmZzZXQgb2YgdGhlIHN1YmRpdmlzaW9uIGJldHdlZW4gdGhlIHNiZGl2aXNpb246IGkuZS4gMCAtIHRoZSBzdGFydCB2ZWN0b3IsIDAuNSAtIG1pZHBvaW50IGJldHdlZW4gdGhlIDIgdmVjdG9ycywgMSAtIHRoZSBlbmQgdmVjdG9yLlxyXG5cdCogQHJldHVybnMge3BvaW50fSAtIFRoZSBjb29yZGluYXRlcyBvZiB0aGUgc3ViZGl2aXNpb24gcG9pbnRcclxuXHQqL1xyXG5cdHN1YmRpdmlkZTogZnVuY3Rpb24oIHgxLCB5MSwgeDIsIHkyLCBiaWFzICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0UG9pbnRPblBhdGgoIHgxLCB5MSwgeDIsIHkyLCBiaWFzICk7XHJcblx0fSxcclxuXHJcblx0Ly8gQ3VydmUgZnVjdGlvbnNcclxuXHJcblx0LyoqXHJcblx0KiBAbmFtZSBnZXRQb2ludEF0XHJcblx0KiBAZGVzY3JpcHRpb24gZ2l2ZW4gMyB2ZWN0b3Ige3BvaW50fXMgb2YgYSBxdWFkcmF0aWMgY3VydmUsIHJldHVybiB0aGUgcG9pbnQgb24gdGhlIGN1cnZlIGF0IHRcclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7cG9pbnR9IHAxIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3Mgc3RhcnQgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwYyAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGNvbnRyb2wgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwMiAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGVuZCBwb2ludC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBiaWFzIC0gdGhlIHBvaW50IGFsb25nIHRoZSBjdXJ2ZSdzIHBhdGggYXMgYSByYXRpbyAoMC0xKS5cclxuXHQqIEByZXR1cm5zIHtwb2ludH0gLSB7eCx5fSBvZiB0aGUgcG9pbnQgb24gdGhlIGN1cnZlIGF0IHtiaWFzfVxyXG5cdCovXHJcblx0Z2V0UG9pbnRBdDogZnVuY3Rpb24oIHAxLCBwYywgcDIsIGJpYXMgKSB7XHJcblx0ICAgIGNvbnN0IHggPSAoMSAtIGJpYXMpICogKDEgLSBiaWFzKSAqIHAxLnggKyAyICogKDEgLSBiaWFzKSAqIGJpYXMgKiBwYy54ICsgYmlhcyAqIGJpYXMgKiBwMi54XHJcblx0ICAgIGNvbnN0IHkgPSAoMSAtIGJpYXMpICogKDEgLSBiaWFzKSAqIHAxLnkgKyAyICogKDEgLSBiaWFzKSAqIGJpYXMgKiBwYy55ICsgYmlhcyAqIGJpYXMgKiBwMi55XHJcblx0ICAgIHJldHVybiB7IHgsIHkgfTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQqIEBuYW1lIGdldERlcml2YXRpdmVBdFxyXG5cdCogQGRlc2NyaXB0aW9uIEdpdmVuIDMgdmVjdG9yIHtwb2ludH1zIG9mIGEgcXVhZHJhdGljIGN1cnZlLCByZXR1cm5zIHRoZSBkZXJpdmF0aXZlICh0YW5nZXQpIG9mIHRoZSBjdXJ2ZSBhdCBwb2ludCBvZiBiaWFzLlxyXG5cdChUaGUgZGVyaXZhdGl2ZSBtZWFzdXJlcyB0aGUgc3RlZXBuZXNzIG9mIHRoZSBjdXJ2ZSBvZiBhIGZ1bmN0aW9uIGF0IHNvbWUgcGFydGljdWxhciBwb2ludCBvbiB0aGUgY3VydmUgKHNsb3BlIG9yIHJhdGlvIG9mIGNoYW5nZSBpbiB0aGUgdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGNoYW5nZSBpbiB0aGUgaW5kZXBlbmRlbnQgdmFyaWFibGUpLlxyXG5cdCogQG1lbWJlcm9mIHRyaWdvbm9taWNVdGlsc1xyXG5cdCogQHBhcmFtIHtwb2ludH0gcDEgLSB7eCx5fSBvZiB0aGUgY3VydmUncyBzdGFydCBwb2ludC5cclxuXHQqIEBwYXJhbSB7cG9pbnR9IHBjIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgY29udHJvbCBwb2ludC5cclxuXHQqIEBwYXJhbSB7cG9pbnR9IHAyIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3MgZW5kIHBvaW50LlxyXG5cdCogQHBhcmFtIHtudW1iZXJ9IGJpYXMgLSB0aGUgcG9pbnQgYWxvbmcgdGhlIGN1cnZlJ3MgcGF0aCBhcyBhIHJhdGlvICgwLTEpLlxyXG5cdCogQHJldHVybnMge3BvaW50fSAtIHt4LHl9IG9mIHRoZSBwb2ludCBvbiB0aGUgY3VydmUgYXQge2JpYXN9XHJcblx0Ki9cclxuXHRnZXREZXJpdmF0aXZlQXQ6IGZ1bmN0aW9uKHAxLCBwYywgcDIsIGJpYXMpIHtcclxuXHQgICAgY29uc3QgZDEgPSB7IHg6IDIgKiAocGMueCAtIHAxLngpLCB5OiAyICogKHBjLnkgLSBwMS55KSB9O1xyXG5cdCAgICBjb25zdCBkMiA9IHsgeDogMiAqIChwMi54IC0gcGMueCksIHk6IDIgKiAocDIueSAtIHBjLnkpIH07XHJcblx0ICAgIGNvbnN0IHggPSAoMSAtIGJpYXMpICogZDEueCArIGJpYXMgKiBkMi54O1xyXG5cdCAgICBjb25zdCB5ID0gKDEgLSBiaWFzKSAqIGQxLnkgKyBiaWFzICogZDIueTtcclxuXHQgICAgcmV0dXJuIHsgeCwgeSB9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZ2V0Tm9ybWFsQXRcclxuXHQqIEBkZXNjcmlwdGlvbiBnaXZlbiAzIHZlY3RvciB7cG9pbnR9cyBvZiBhIHF1YWRyYXRpYyBjdXJ2ZSByZXR1cm5zIHRoZSBub3JtYWwgdmVjdG9yIG9mIHRoZSBjdXJ2ZSBhdCB0aGUgcmF0aW8gcG9pbnQgYWxvbmcgdGhlIGN1cnZlIHtiaWFzfS5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7cG9pbnR9IHAxIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3Mgc3RhcnQgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwYyAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGNvbnRyb2wgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwMiAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGVuZCBwb2ludC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBiaWFzIC0gdGhlIHBvaW50IGFsb25nIHRoZSBjdXJ2ZSdzIHBhdGggYXMgYSByYXRpbyAoMC0xKS5cclxuXHQqIEByZXR1cm5zIHtwb2ludH0gLSB7eCx5fSBvZiB0aGUgcG9pbnQgb24gdGhlIGN1cnZlIGF0IHtiaWFzfVxyXG5cdCovXHJcblx0Z2V0Tm9ybWFsQXQ6IGZ1bmN0aW9uKHAxLCBwYywgcDIsIGJpYXMpIHtcclxuXHQgICAgY29uc3QgZCA9IHRoaXMuZ2V0RGVyaXZhdGl2ZUF0KCBwMSwgcGMsIHAyLCBiaWFzICk7XHJcblx0ICAgIGNvbnN0IHEgPSBNYXRoLnNxcnQoZC54ICogZC54ICsgZC55ICogZC55KTtcclxuXHQgICAgY29uc3QgeCA9IC1kLnkgLyBxO1xyXG5cdCAgICBjb25zdCB5ID0gZC54IC8gcTtcclxuXHQgICAgcmV0dXJuIHsgeCwgeSB9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgcHJvamVjdE5vcm1hbEF0RGlzdGFuY2VcclxuXHQqIEBkZXNjcmlwdGlvbiBnaXZlbiAzIHZlY3RvciB7cG9pbnR9cyBvZiBhIHF1YWRyYXRpYyBjdXJ2ZSByZXR1cm5zIHRoZSBub3JtYWwgdmVjdG9yIG9mIHRoZSBjdXJ2ZSBhdCB0aGUgcmF0aW8gcG9pbnQgYWxvbmcgdGhlIGN1cnZlIHtiaWFzfSBhdCB0aGUgcmVxdWlyZWQge2Rpc3RhbmNlfS5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7cG9pbnR9IHAxIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3Mgc3RhcnQgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwYyAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGNvbnRyb2wgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwMiAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGVuZCBwb2ludC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBiaWFzIC0gdGhlIHBvaW50IGFsb25nIHRoZSBjdXJ2ZSdzIHBhdGggYXMgYSByYXRpbyAoMC0xKS5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBkaXN0YW5jZSAtIHRoZSBkaXN0YW5jZSB0byBwcm9qZWN0IHRoZSBub3JtYWwuXHJcblx0KiBAcmV0dXJucyB7cG9pbnR9IC0ge3gseX0gb2YgdGhlIHBvaW50IHByb2plY3RlZCBmcm9tIHRoZSBub3JtYWwgb24gdGhlIGN1cnZlIGF0IHtiaWFzfVxyXG5cdCovXHJcblx0cHJvamVjdE5vcm1hbEF0RGlzdGFuY2U6IGZ1bmN0aW9uKHAxLCBwYywgcDIsIGJpYXMsIGRpc3RhbmNlKSB7XHJcblx0XHRjb25zdCBwID0gdGhpcy5nZXRQb2ludEF0KHAxLCBwYywgcDIsIGJpYXMpO1xyXG4gICAgICBcdGNvbnN0IG4gPSB0aGlzLmdldE5vcm1hbEF0KHAxLCBwYywgcDIsIGJpYXMpO1xyXG4gICAgICBcdGNvbnN0IHggPSBwLnggKyBuLnggKiBkaXN0YW5jZTtcclxuICAgICAgXHRjb25zdCB5ID0gcC55ICsgbi55ICogZGlzdGFuY2U7XHJcbiAgICAgIFx0cmV0dXJuIHsgeCwgeSB9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG5hbWUgZ2V0QW5nbGVPZk5vcm1hbFxyXG5cdCogQGRlc2NyaXB0aW9uIGdpdmVuIDMgdmVjdG9yIHtwb2ludH1zIG9mIGEgcXVhZHJhdGljIGN1cnZlIHJldHVybnMgdGhlIGFuZ2xlIG9mIHRoZSBub3JtYWwgdmVjdG9yIG9mIHRoZSBjdXJ2ZSBhdCB0aGUgcmF0aW8gcG9pbnQgYWxvbmcgdGhlIGN1cnZlIHtiaWFzfS5cclxuXHQqIEBtZW1iZXJvZiB0cmlnb25vbWljVXRpbHNcclxuXHQqIEBwYXJhbSB7cG9pbnR9IHAxIC0ge3gseX0gb2YgdGhlIGN1cnZlJ3Mgc3RhcnQgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwYyAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGNvbnRyb2wgcG9pbnQuXHJcblx0KiBAcGFyYW0ge3BvaW50fSBwMiAtIHt4LHl9IG9mIHRoZSBjdXJ2ZSdzIGVuZCBwb2ludC5cclxuXHQqIEBwYXJhbSB7bnVtYmVyfSBiaWFzIC0gdGhlIHBvaW50IGFsb25nIHRoZSBjdXJ2ZSdzIHBhdGggYXMgYSByYXRpbyAoMC0xKS5cclxuXHQqIEByZXR1cm5zIHtudW1iZXJ9IC0gdGhlIGFuZ2xlIG9mIHRoZSBub3JtYWwgb2YgdGhlIGN1cnZlIGF0IHtiaWFzfVxyXG5cdCovXHJcblx0Z2V0QW5nbGVPZk5vcm1hbDogZnVuY3Rpb24oIHAxLCBwYywgcDIsIGJpYXMgKSB7XHJcblx0XHRjb25zdCBwID0gdGhpcy5nZXRQb2ludEF0KHAxLCBwYywgcDIsIGJpYXMpO1xyXG4gICAgICBcdGNvbnN0IG4gPSB0aGlzLmdldE5vcm1hbEF0KHAxLCBwYywgcDIsIGJpYXMpO1xyXG4gICAgICBcdHJldHVybiB0aGlzLmdldFJhZGlhbkFuZ2xlQmV0d2VlbjJWZWN0b3JzKCBwLngsIHAueSwgbi54LCBuLnkgKTtcclxuXHR9XHJcblxyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnRyaWdvbm9taWNVdGlscyA9IHRyaWdvbm9taWNVdGlsczsiXX0=
