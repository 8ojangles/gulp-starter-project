(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// app functions
const fN = require('./functions.js').fN; // $( document ).ready( function(){
// 	$( 'body main' ).append( '<p>Hello World</p>' );
// } );

},{"./functions.js":7}],2:[function(require,module,exports){
// Canvas Lightning v1
const mathUtils = require('./utils/mathUtils.js');

const easing = require('./utils/easing.js').easingEquations;

let matchDimentions = require('./matchDimentions.js'); // let easeFn = easing.easeInCirc;


let easeFn = easing.linearEase;
let rndInt = mathUtils.randomInteger;
let rnd = mathUtils.random; // Lightning trigger range

let lightningFrequencyLow = 100;
let lightningFrequencyHigh = 250; // Lightning segment count

let lSegmentCountL = 10;
let lSegmentCountH = 35; // Distance ranges between lightning path segments

let lSegmentXBoundsL = 15;
let lSegmentXBoundsH = 60;
let lSegmentYBoundsL = 25;
let lSegmentYBoundsH = 55;

function canvasLightning(canvas) {
  this.init = function () {
    this.loop();
  };

  var _this = this;

  this.c = canvas;
  this.ctx = canvas.getContext('2d');
  this.cw = canvas.width;
  this.ch = canvas.height;
  this.mx = 0;
  this.my = 0;
  this.lightning = [];
  this.lightTimeCurrent = 0;
  this.lightTimeTotal = 50; // Utilities        

  this.hitTest = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
  }; // Create Lightning


  this.createL = function (x, y, canSpawn, isChild) {
    let thisLightning = {
      x: x,
      y: y,
      xRange: rndInt(lSegmentXBoundsL, lSegmentXBoundsH),
      yRange: rndInt(lSegmentYBoundsL, lSegmentYBoundsH),
      path: [{
        x: x,
        y: y
      }],
      pathLimit: rndInt(lSegmentCountL, lSegmentCountH),
      canSpawn: canSpawn,
      isChild: isChild,
      hasFired: false,
      alpha: 0
    };
    this.lightning.push(thisLightning);
  }; // Update Lightning


  this.updateL = function () {
    var i = this.lightning.length;

    while (i--) {
      let light = this.lightning[i];
      let {
        path,
        xRange,
        yRange,
        pathLimit
      } = light;
      let pathLen = path.length;
      let prevLPath = path[pathLen - 1];
      light.path.push({
        x: prevLPath.x + (rndInt(0, xRange) - xRange / 2),
        y: prevLPath.y + rndInt(0, yRange)
      });

      if (pathLen > pathLimit) {
        this.lightning.splice(i, 1);
      }

      light.hasFired = true;
    }

    ;
  }; // Render Lightning


  this.renderL = function () {
    let i = this.lightning.length;
    let c = this.ctx;
    let glowColor = 'white';
    let glowBlur = 30;
    let shadowRenderOffset = 10000;

    while (i--) {
      let light = this.lightning[i];
      let pathCount = light.path.length;
      let childLightFires = rndInt(0, 100) < 30 ? true : false;
      let alpha;

      if (light.isChild === false || childLightFires) {
        if (pathCount === light.pathLimit) {
          c.fillStyle = 'rgba( 255, 255, 255, ' + rndInt(20, 50) / 100 + ')';
          c.fillRect(0, 0, this.cw, this.ch);
          let maxLineWidth = 100;
          let iterations = rndInt(10, 50);
          c.lineCap = "round";

          for (let i = 0; i < iterations; i++) {
            let colorChange = easeFn(i, 150, 105, iterations);
            c.globalCompositeOperation = 'lighter';
            c.strokeStyle = 'white';
            c.shadowBlur = easeFn(i, maxLineWidth, -maxLineWidth, iterations);
            c.shadowColor = `rgba( ${colorChange}, ${colorChange}, 255, 1 )`;
            c.shadowOffsetY = shadowRenderOffset;
            c.beginPath();
            c.moveTo(light.x, light.y - shadowRenderOffset);

            for (let j = 0; j < pathCount; j++) {
              let p = light.path[j];
              c.lineTo(p.x, p.y - shadowRenderOffset);
            }

            c.stroke();
          }

          c.shadowOffsetY = 0;
        }
      }

      if (light.isChild === false || childLightFires) {
        if (pathCount === light.pathLimit) {
          c.lineWidth = 5;
          alpha = 1;
          c.shadowColor = 'rgba( 100, 100, 255, 1 )';
          c.shadowBlur = glowBlur;
        } else {
          c.lineWidth = 0.5;
          alpha = rndInt(10, 50) / 100;
        }
      } else {
        c.lineWidth = 1;
        alpha = rndInt(10, 50) / 100;
      }

      c.strokeStyle = `hsla( 0, 100%, 100%, ${alpha} )`;
      c.beginPath();
      c.moveTo(light.x, light.y);

      for (let i = 0; i < pathCount; i++) {
        let pSeg = light.path[i];
        c.lineTo(pSeg.x, pSeg.y);

        if (light.canSpawn) {
          if (rndInt(0, 100) < 1) {
            light.canSpawn = false;
            this.createL(pSeg.x, pSeg.y, true, true);
          }
        }
      }

      c.stroke();
      c.shadowBlur = 0;
    }

    ;
  }; // Lightning Timer


  this.lightningTimer = function () {
    this.lightTimeCurrent++;

    if (this.lightTimeCurrent >= this.lightTimeTotal) {
      let newX = rndInt(50, this.cw - 50);
      let newY = rndInt(-30, -25);
      let createCount = rndInt(1, 2);

      while (createCount--) {
        this.createL(newX, newY, true, false);
      }

      this.lightTimeCurrent = 0;
      this.lightTimeTotal = rndInt(lightningFrequencyLow, lightningFrequencyHigh);
    }
  };

  this.clearCanvas = function () {
    let c = this.ctx; // c.globalCompositeOperation = 'destination-out';

    c.fillStyle = 'rgba( 0,0,0,' + rndInt(1, 30) / 100 + ')'; // c.fillStyle = 'rgba( 0,0,0,0.1)';

    c.fillRect(0, 0, this.cw, this.ch);
    c.globalCompositeOperation = 'source-over';
  };

  this.resizeCanvasHandler = function () {
    _this.cw = _this.c.width = _this.c.parentNode.clientWidth;
  }; // Resize on Canvas on Window Resize


  $(window).on('resize', function () {
    _this.resizeCanvasHandler();
  }); // Animation Loop

  this.loop = function () {
    var loopIt = function () {
      requestAnimationFrame(loopIt, _this.c);

      _this.clearCanvas();

      _this.updateL();

      _this.lightningTimer();

      _this.renderL();
    };

    loopIt();
  };
}

;

function startLightningAnimation(canvasDomSelector, parent) {
  let thisParent = parent || window;
  let thisCanvas = document.querySelector(canvasDomSelector);
  console.log('thisCanvas:, ', thisCanvas);
  console.log('thisParent:, ', thisParent);

  if (thisCanvas) {
    matchDimentions(thisCanvas, thisParent);
    var cl = new canvasLightning(thisCanvas);
    cl.init();
  } else {
    console.warn('No element matching selector: ' + canvasDomSelector + ' found!');
  }
}

module.exports.canvasLightning = canvasLightning;
module.exports.startLightningAnimation = startLightningAnimation;

},{"./matchDimentions.js":8,"./utils/easing.js":9,"./utils/mathUtils.js":41}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
function contentSVGHighlight() {
  var toc = document.querySelector('.toc');
  var tocPath = document.querySelector('.toc-marker path');
  var tocItems; // Factor of screen size that the element must cross
  // before it's considered visible

  var TOP_MARGIN = 0.00,
      BOTTOM_MARGIN = 0.0;
  var pathLength;
  var lastPathStart, lastPathEnd;
  window.addEventListener('resize', drawPath, false);
  window.addEventListener('scroll', sync, false);
  drawPath();

  function drawPath() {
    tocItems = [].slice.call(toc.querySelectorAll('li')); // Cache element references and measurements

    tocItems = tocItems.map(function (item) {
      var anchor = item.querySelector('a');
      var target = document.getElementById(anchor.getAttribute('href').slice(1));
      return {
        listItem: item,
        anchor: anchor,
        target: target
      };
    }); // Remove missing targets

    tocItems = tocItems.filter(function (item) {
      return !!item.target;
    });
    var path = [];
    var pathIndent;
    tocItems.forEach(function (item, i) {
      var x = item.anchor.offsetLeft - 5,
          y = item.anchor.offsetTop,
          height = item.anchor.offsetHeight;

      if (i === 0) {
        path.push('M', x, y, 'L', x, y + height);
        item.pathStart = 0;
      } else {
        // Draw an additional line when there's a change in
        // indent levels
        if (pathIndent !== x) path.push('L', pathIndent, y);
        path.push('L', x, y); // Set the current path so that we can measure it

        tocPath.setAttribute('d', path.join(' '));
        item.pathStart = tocPath.getTotalLength() || 0;
        path.push('L', x, y + height);
      }

      pathIndent = x;
      tocPath.setAttribute('d', path.join(' '));
      item.pathEnd = tocPath.getTotalLength();
    });
    pathLength = tocPath.getTotalLength();
    sync();
  }

  function sync() {
    var windowHeight = window.innerHeight;
    var pathStart = pathLength,
        pathEnd = 0;
    var visibleItems = 0;
    tocItems.forEach(function (item) {
      var targetBounds = item.target.getBoundingClientRect();

      if (targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * (1 - BOTTOM_MARGIN)) {
        pathStart = Math.min(item.pathStart, pathStart);
        pathEnd = Math.max(item.pathEnd, pathEnd);
        visibleItems += 1;
        item.listItem.classList.add('visible');
      } else {
        item.listItem.classList.remove('visible');
      }
    }); // Specify the visible path or hide the path altogether
    // if there are no visible items

    if (visibleItems > 0 && pathStart < pathEnd) {
      if (pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
        tocPath.setAttribute('stroke-dashoffset', '1');
        tocPath.setAttribute('stroke-dasharray', '1, ' + pathStart + ', ' + (pathEnd - pathStart) + ', ' + pathLength);
        tocPath.setAttribute('opacity', 1);
      }
    } else {
      tocPath.setAttribute('opacity', 0);
    }

    lastPathStart = pathStart;
    lastPathEnd = pathEnd;
  }
}

module.exports.contentSVGHighlight = contentSVGHighlight;

},{}],5:[function(require,module,exports){
function whichTransitionEvent() {
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'MSTransition': 'msTransitionEnd',
    'OTransition': 'oTransitionEnd',
    'transition': 'transitionEnd'
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      console.log(transitions[t]);
      return transitions[t];
    }
  }
}

module.exports = whichTransitionEvent;

},{}],6:[function(require,module,exports){
require('./app.js');

},{"./app.js":1}],7:[function(require,module,exports){
let checkCanvasSupport = require('./checkCanvasSupport.js');

let cLightning = require('./canvasDemo.js').startLightningAnimation;

let contentSVGHighlight = require('./contentSVGHighlight.js').contentSVGHighlight;

let detectTransitionEnd = require('./detectTransitionEndEventCompat.js');

let transEndEvent = detectTransitionEnd();
/**
 * @description Given array of jQuery DOM elements the fN iterates over each
 * member, measures it's height, logs the height as a number and attaches
 * as a custom element. The fN then applies a height of 0 via inline
 * styling and adds the "transitioner" class.
 * @param {jQuery} arr - the array of DOM elements to measure.
 */

function measureEls(arr) {
  /**
  * The length of the array
  * @type {number}
  * @memberof measureEls
  */
  arrLen = arr.length;

  for (let i = arrLen - 1; i >= 0; i--) {
    /**
    * The current iteratee
    * @type {HTMLElement}
    * @memberof measureEls
    * @inner
    */
    let currEl = $(arr[i]);
    currEl.attr('data-open-height', currEl.innerHeight()).css({
      'height': 0
    }).addClass('transitioner');
  }
}

$(document).ready(() => {
  let $revealEls = $('[ data-reveal-target ]');
  measureEls($revealEls);
  $('[ data-reveal-trigger ]').click(function (e) {
    /**
    * The clicked element
    * @type {HTMLElement}
    * @inner
    */
    $this = $(this);
    /**
    * The element linked to the clicked element by custom data attributes 
    * @type {HTMLElement}
    * @inner
    */

    $linkedEl = $(`[ data-reveal-target="${$this.attr('data-reveal-trigger')}" ]`);
    /**
    * The height of the linked element  in it's maximum open state 
    * @type {number}
    * @inner
    */

    let thisHeight = `${$linkedEl.attr('data-open-height')}px`;

    if ($linkedEl.hasClass('is-active')) {
      $linkedEl.css({
        'height': 0
      }).removeClass('is-active');
      $this.removeClass('is-active');
    } else {
      $linkedEl.css({
        'height': thisHeight
      }).addClass('is-active');
      $this.addClass('is-active');
    }
  });
});

window.onload = function () {
  if ($('.toc').length > 0) {
    contentSVGHighlight();
  }

  if (checkCanvasSupport()) {
    if ($('#canvas').length > 0) {
      cLightning('#canvas', document.querySelector('#canvas').parentElement);
    }
  }
};

},{"./canvasDemo.js":2,"./checkCanvasSupport.js":3,"./contentSVGHighlight.js":4,"./detectTransitionEndEventCompat.js":5}],8:[function(require,module,exports){
/**
* Measures the target DOM element dimensions. Dom elements require node.clientWidth/Height.
* the global.window object requires node.innerWidth/Height
* @param {HTMLElement} el - DOM node or element to measure.
* @returns {Dimensions} the dimensions of the element
*/
function getDimensions(el) {
  return {
    w: el.innerWidth || el.clientWidth,
    h: el.innerHeight || el.clientHeight
  };
}
/**
* Measures the target DOM element and applies width/height
* to selected element "el".
* @param {HTMLElement} el - Dom node pointing to element to transform size.
* @param {HTMLElement} target - Dom node pointing to container element to match dimensions.
* @param {Dimensions} options - optional parameter object with members "w" and "h"
*representing width and height for setting default or minimum values if not met by "target".
* @returns {void}
*/


function matchDimentions(el, target, options = {
  w: 500,
  h: 500
}) {
  let t = getDimensions(target);
  el.width = t.w < options.w ? options.w : t.w;
  el.height = t.h < options.h ? options.h : t.h;
}

module.exports = matchDimentions;

},{}],9:[function(require,module,exports){
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

},{"./easing/easeInBack.js":10,"./easing/easeInBounce.js":11,"./easing/easeInCirc.js":12,"./easing/easeInCubic.js":13,"./easing/easeInElastic.js":14,"./easing/easeInExpo.js":15,"./easing/easeInOutBack.js":16,"./easing/easeInOutBounce.js":17,"./easing/easeInOutCirc.js":18,"./easing/easeInOutCubic.js":19,"./easing/easeInOutElastic.js":20,"./easing/easeInOutExpo.js":21,"./easing/easeInOutQuad.js":22,"./easing/easeInOutQuart.js":23,"./easing/easeInOutQuint.js":24,"./easing/easeInOutSine.js":25,"./easing/easeInQuad.js":26,"./easing/easeInQuart.js":27,"./easing/easeInQuint.js":28,"./easing/easeInSine.js":29,"./easing/easeOutBack.js":30,"./easing/easeOutBounce.js":31,"./easing/easeOutCirc.js":32,"./easing/easeOutCubic.js":33,"./easing/easeOutElastic.js":34,"./easing/easeOutExpo.js":35,"./easing/easeOutQuad.js":36,"./easing/easeOutQuart.js":37,"./easing/easeOutQuint.js":38,"./easing/easeOutSine.js":39,"./easing/linearEase.js":40}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./easeOutBounce.js":31}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{"./easeInBounce.js":11,"./easeOutBounce.js":31}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NhbnZhc0RlbW8uanMiLCJzcmMvanMvY2hlY2tDYW52YXNTdXBwb3J0LmpzIiwic3JjL2pzL2NvbnRlbnRTVkdIaWdobGlnaHQuanMiLCJzcmMvanMvZGV0ZWN0VHJhbnNpdGlvbkVuZEV2ZW50Q29tcGF0LmpzIiwic3JjL2pzL2VudHJ5LmpzIiwic3JjL2pzL2Z1bmN0aW9ucy5qcyIsInNyYy9qcy9tYXRjaERpbWVudGlvbnMuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5CYWNrLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5Cb3VuY2UuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJbkNpcmMuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJbkN1YmljLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5FbGFzdGljLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5FeHBvLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRCYWNrLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRCb3VuY2UuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJbk91dENpcmMuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJbk91dEN1YmljLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRFbGFzdGljLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRFeHBvLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRRdWFkLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5PdXRRdWFydC5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZUluT3V0UXVpbnQuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJbk91dFNpbmUuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJblF1YWQuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VJblF1YXJ0LmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5RdWludC5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZUluU2luZS5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZU91dEJhY2suanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VPdXRCb3VuY2UuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VPdXRDaXJjLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlT3V0Q3ViaWMuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VPdXRFbGFzdGljLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlT3V0RXhwby5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZU91dFF1YWQuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2Vhc2VPdXRRdWFydC5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZU91dFF1aW50LmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlT3V0U2luZS5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvbGluZWFyRWFzZS5qcyIsInNyYy9qcy91dGlscy9tYXRoVXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBRSxnQkFBRixDQUFQLENBQTRCLEVBQXZDLEMsQ0FHQTtBQUNBO0FBRUE7OztBQ1BBO0FBQ0EsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFFLHNCQUFGLENBQXpCOztBQUNBLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBRSxtQkFBRixDQUFQLENBQStCLGVBQTlDOztBQUNBLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBRSxzQkFBRixDQUE3QixDLENBRUE7OztBQUNBLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxV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QUEsR0FBRyxFQUFFLFNBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBZ0MsSUFBaEMsRUFBc0MsSUFBdEMsRUFBNEMsV0FBNUMsRUFBeUQ7QUFDN0QsUUFBSSxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUksV0FBVyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQVQsS0FBa0IsSUFBSSxHQUFHLElBQXpCLEtBQWtDLElBQUksR0FBRyxJQUF6QyxJQUFpRCxJQUFuRTtBQUNBLFFBQUksV0FBSixFQUFpQixPQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsV0FBWCxFQUF3QixJQUF4QixFQUE4QixJQUE5QixDQUFQLENBQWpCLEtBQWlFLE9BQU8sV0FBUDtBQUNqRSxHQTdDYzs7QUErQ2Y7Ozs7Ozs7QUFPQSxFQUFBLEtBQUssRUFBRSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCLEdBQXRCLEVBQTJCLEdBQTNCLEVBQWdDO0FBQ3RDLFFBQUksR0FBRyxHQUFHLEdBQVYsRUFBZTtBQUNkLFVBQUksSUFBSSxHQUFHLEdBQVg7QUFDQSxNQUFBLEdBQUcsR0FBRyxHQUFOO0FBQ0EsTUFBQSxHQUFHLEdBQUcsSUFBTjtBQUNBOztBQUNELFdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULEVBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULEVBQWdCLEdBQWhCLENBQWQsQ0FBUDtBQUNBO0FBN0RjLENBQWhCO0FBZ0VBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gYXBwIGZ1bmN0aW9uc1xyXG5jb25zdCBmTiA9IHJlcXVpcmUoICcuL2Z1bmN0aW9ucy5qcycgKS5mTjtcclxuXHJcblxyXG4vLyAkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpe1xyXG4vLyBcdCQoICdib2R5IG1haW4nICkuYXBwZW5kKCAnPHA+SGVsbG8gV29ybGQ8L3A+JyApO1xyXG5cclxuLy8gfSApOyIsIi8vIENhbnZhcyBMaWdodG5pbmcgdjFcclxuY29uc3QgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5jb25zdCBlYXNpbmcgPSByZXF1aXJlKCAnLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5sZXQgbWF0Y2hEaW1lbnRpb25zID0gcmVxdWlyZSggJy4vbWF0Y2hEaW1lbnRpb25zLmpzJyApO1xyXG5cclxuLy8gbGV0IGVhc2VGbiA9IGVhc2luZy5lYXNlSW5DaXJjO1xyXG5sZXQgZWFzZUZuID0gZWFzaW5nLmxpbmVhckVhc2U7XHJcbmxldCBybmRJbnQgPSBtYXRoVXRpbHMucmFuZG9tSW50ZWdlcjtcclxubGV0IHJuZCA9IG1hdGhVdGlscy5yYW5kb207XHJcbi8vIExpZ2h0bmluZyB0cmlnZ2VyIHJhbmdlXHJcbmxldCBsaWdodG5pbmdGcmVxdWVuY3lMb3cgPSAxMDA7XHJcbmxldCBsaWdodG5pbmdGcmVxdWVuY3lIaWdoID0gMjUwO1xyXG5cclxuLy8gTGlnaHRuaW5nIHNlZ21lbnQgY291bnRcclxubGV0IGxTZWdtZW50Q291bnRMID0gMTA7XHJcbmxldCBsU2VnbWVudENvdW50SCA9IDM1O1xyXG5cclxuLy8gRGlzdGFuY2UgcmFuZ2VzIGJldHdlZW4gbGlnaHRuaW5nIHBhdGggc2VnbWVudHNcclxubGV0IGxTZWdtZW50WEJvdW5kc0wgPSAxNTtcclxubGV0IGxTZWdtZW50WEJvdW5kc0ggPSA2MDtcclxubGV0IGxTZWdtZW50WUJvdW5kc0wgPSAyNTtcclxubGV0IGxTZWdtZW50WUJvdW5kc0ggPSA1NTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY2FudmFzTGlnaHRuaW5nKCBjYW52YXMgKXtcclxuICBcclxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5sb29wKCk7XHJcbiAgICB9OyAgICBcclxuICBcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB0aGlzLmMgPSBjYW52YXM7XHJcbiAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCAnMmQnICk7XHJcbiAgICB0aGlzLmN3ID0gY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy5jaCA9IGNhbnZhcy5oZWlnaHQ7XHJcbiAgICB0aGlzLm14ID0gMDtcclxuICAgIHRoaXMubXkgPSAwO1xyXG5cclxuICAgIHRoaXMubGlnaHRuaW5nID0gW107XHJcbiAgICB0aGlzLmxpZ2h0VGltZUN1cnJlbnQgPSAwO1xyXG4gICAgdGhpcy5saWdodFRpbWVUb3RhbCA9IDUwO1xyXG4gIFxyXG4gICAgLy8gVXRpbGl0aWVzICAgICAgICBcclxuICAgIHRoaXMuaGl0VGVzdCA9IGZ1bmN0aW9uKCB4MSwgeTEsIHcxLCBoMSwgeDIsIHkyLCB3MiwgaDIpIHtcclxuICAgICAgICByZXR1cm4gISggeDEgKyB3MSA8IHgyIHx8IHgyICsgdzIgPCB4MSB8fCB5MSArIGgxIDwgeTIgfHwgeTIgKyBoMiA8IHkxICk7XHJcbiAgICB9O1xyXG4gICAgXHJcbi8vIENyZWF0ZSBMaWdodG5pbmdcclxuICAgIHRoaXMuY3JlYXRlTCA9IGZ1bmN0aW9uKCB4LCB5LCBjYW5TcGF3biwgaXNDaGlsZCApe1xyXG5cclxuICAgICAgICBsZXQgdGhpc0xpZ2h0bmluZyA9IHtcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgeFJhbmdlOiBybmRJbnQoIGxTZWdtZW50WEJvdW5kc0wsIGxTZWdtZW50WEJvdW5kc0ggKSxcclxuICAgICAgICAgICAgeVJhbmdlOiBybmRJbnQoIGxTZWdtZW50WUJvdW5kc0wsIGxTZWdtZW50WUJvdW5kc0ggKSxcclxuICAgICAgICAgICAgcGF0aDogW3sgeDogeCwgeTogeSB9XSxcclxuICAgICAgICAgICAgcGF0aExpbWl0OiBybmRJbnQoIGxTZWdtZW50Q291bnRMLCBsU2VnbWVudENvdW50SCApLFxyXG4gICAgICAgICAgICBjYW5TcGF3bjogY2FuU3Bhd24sXHJcbiAgICAgICAgICAgIGlzQ2hpbGQ6IGlzQ2hpbGQsXHJcbiAgICAgICAgICAgIGhhc0ZpcmVkOiBmYWxzZSxcclxuICAgICAgICAgICAgYWxwaGE6IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubGlnaHRuaW5nLnB1c2goIHRoaXNMaWdodG5pbmcgKTtcclxuICAgIH07XHJcbiAgICBcclxuLy8gVXBkYXRlIExpZ2h0bmluZ1xyXG4gICAgdGhpcy51cGRhdGVMID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgaSA9IHRoaXMubGlnaHRuaW5nLmxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoIGktLSApe1xyXG4gICAgICAgICAgICBsZXQgbGlnaHQgPSB0aGlzLmxpZ2h0bmluZ1sgaSBdO1xyXG4gICAgICAgICAgICBsZXQgeyBwYXRoLCB4UmFuZ2UsIHlSYW5nZSwgcGF0aExpbWl0IH0gPSBsaWdodDtcclxuICAgICAgICAgICAgbGV0IHBhdGhMZW4gPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IHByZXZMUGF0aCA9IHBhdGhbIHBhdGhMZW4gLSAxIF07ICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsaWdodC5wYXRoLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgeDogcHJldkxQYXRoLnggKyAoIHJuZEludCggMCwgeFJhbmdlICktKCB4UmFuZ2UgLyAyICkgKSxcclxuICAgICAgICAgICAgICAgIHk6IHByZXZMUGF0aC55ICsgKCBybmRJbnQoIDAsIHlSYW5nZSApIClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIHBhdGhMZW4gPiBwYXRoTGltaXQgKXtcclxuICAgICAgICAgICAgICAgIHRoaXMubGlnaHRuaW5nLnNwbGljZSggaSwgMSApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGlnaHQuaGFzRmlyZWQgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgXHJcbi8vIFJlbmRlciBMaWdodG5pbmdcclxuICAgIHRoaXMucmVuZGVyTCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLmxpZ2h0bmluZy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLmN0eDtcclxuICAgICAgICBsZXQgZ2xvd0NvbG9yID0gJ3doaXRlJztcclxuICAgICAgICBsZXQgZ2xvd0JsdXIgPSAzMDtcclxuICAgICAgICBsZXQgc2hhZG93UmVuZGVyT2Zmc2V0ID0gMTAwMDA7XHJcblxyXG4gICAgICAgIHdoaWxlKCBpLS0gKXtcclxuICAgICAgICAgICAgbGV0IGxpZ2h0ID0gdGhpcy5saWdodG5pbmdbIGkgXTtcclxuICAgICAgICAgICAgbGV0IHBhdGhDb3VudCA9IGxpZ2h0LnBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgY2hpbGRMaWdodEZpcmVzID0gcm5kSW50KCAwLCAxMDAgKSA8IDMwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgYWxwaGE7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGxpZ2h0LmlzQ2hpbGQgPT09IGZhbHNlIHx8IGNoaWxkTGlnaHRGaXJlcyApIHtcclxuICAgICAgICAgICAgICAgIGlmICggcGF0aENvdW50ID09PSBsaWdodC5wYXRoTGltaXQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYy5maWxsU3R5bGUgPSAncmdiYSggMjU1LCAyNTUsIDI1NSwgJyArIHJuZEludCggMjAsIDUwICkgLyAxMDAgKyAnKSc7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5maWxsUmVjdCggMCwgMCwgdGhpcy5jdywgdGhpcy5jaCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWF4TGluZVdpZHRoID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVyYXRpb25zID0gcm5kSW50KCAxMCwgNTAgKTtcclxuICAgICAgICAgICAgICAgICAgICBjLmxpbmVDYXAgPSBcInJvdW5kXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciggbGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9uczsgaSsrICl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29sb3JDaGFuZ2UgPSBlYXNlRm4oIGksIDE1MCwgMTA1LCBpdGVyYXRpb25zICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2xpZ2h0ZXInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjLnN0cm9rZVN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5zaGFkb3dCbHVyID0gZWFzZUZuKCBpLCBtYXhMaW5lV2lkdGgsIC1tYXhMaW5lV2lkdGgsIGl0ZXJhdGlvbnMgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5zaGFkb3dDb2xvciA9IGByZ2JhKCAkeyBjb2xvckNoYW5nZSB9LCAkeyBjb2xvckNoYW5nZSB9LCAyNTUsIDEgKWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuc2hhZG93T2Zmc2V0WSA9IHNoYWRvd1JlbmRlck9mZnNldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5tb3ZlVG8oIGxpZ2h0LngsIGxpZ2h0LnkgLSBzaGFkb3dSZW5kZXJPZmZzZXQgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKCBsZXQgaiA9IDA7IGogPCBwYXRoQ291bnQ7IGorKyApeyAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IGxpZ2h0LnBhdGhbIGogXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubGluZVRvKCBwLngsIHAueSAtIHNoYWRvd1JlbmRlck9mZnNldCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjLnNoYWRvd09mZnNldFkgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIGxpZ2h0LmlzQ2hpbGQgPT09IGZhbHNlIHx8IGNoaWxkTGlnaHRGaXJlcyApIHtcclxuICAgICAgICAgICAgICAgIGlmICggcGF0aENvdW50ID09PSBsaWdodC5wYXRoTGltaXQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5saW5lV2lkdGggPSA1O1xyXG4gICAgICAgICAgICAgICAgICAgIGFscGhhID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBjLnNoYWRvd0NvbG9yID0gJ3JnYmEoIDEwMCwgMTAwLCAyNTUsIDEgKSc7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5zaGFkb3dCbHVyID0gZ2xvd0JsdXI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGMubGluZVdpZHRoID0gMC41O1xyXG4gICAgICAgICAgICAgICAgICAgIGFscGhhID0gcm5kSW50KCAxMCwgNTAgKSAvIDEwMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGMubGluZVdpZHRoID0gMTtcclxuICAgICAgICAgICAgICAgIGFscGhhID0gcm5kSW50KCAxMCwgNTAgKSAvIDEwMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYy5zdHJva2VTdHlsZSA9IGBoc2xhKCAwLCAxMDAlLCAxMDAlLCAke2FscGhhfSApYDtcclxuXHJcblxyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjLm1vdmVUbyggbGlnaHQueCwgbGlnaHQueSApO1xyXG4gICAgICAgICAgICBmb3IoIGxldCBpID0gMDsgaSA8IHBhdGhDb3VudDsgaSsrICl7ICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHBTZWcgPSBsaWdodC5wYXRoWyBpIF07XHJcbiAgICAgICAgICAgICAgICBjLmxpbmVUbyggcFNlZy54LCBwU2VnLnkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggbGlnaHQuY2FuU3Bhd24gKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiggcm5kSW50KDAsIDEwMCApIDwgMSApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaWdodC5jYW5TcGF3biA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUwoIHBTZWcueCwgcFNlZy55LCB0cnVlLCB0cnVlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjLnNoYWRvd0JsdXIgPSAwO1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIFxyXG4vLyBMaWdodG5pbmcgVGltZXJcclxuICAgIHRoaXMubGlnaHRuaW5nVGltZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMubGlnaHRUaW1lQ3VycmVudCsrO1xyXG4gICAgICAgIGlmKCB0aGlzLmxpZ2h0VGltZUN1cnJlbnQgPj0gdGhpcy5saWdodFRpbWVUb3RhbCApe1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1ggPSBybmRJbnQoIDUwLCB0aGlzLmN3IC0gNTAgKTtcclxuICAgICAgICAgICAgbGV0IG5ld1kgPSBybmRJbnQoIC0zMCwgLTI1ICk7IFxyXG4gICAgICAgICAgICBsZXQgY3JlYXRlQ291bnQgPSBybmRJbnQoIDEsIDIgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlKCBjcmVhdGVDb3VudC0tICl7ICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVMKCBuZXdYLCBuZXdZLCB0cnVlLCBmYWxzZSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0VGltZUN1cnJlbnQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0VGltZVRvdGFsID0gcm5kSW50KCBsaWdodG5pbmdGcmVxdWVuY3lMb3csIGxpZ2h0bmluZ0ZyZXF1ZW5jeUhpZ2ggKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiBcclxuICAgIHRoaXMuY2xlYXJDYW52YXMgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGxldCBjID0gdGhpcy5jdHg7XHJcbiAgICAgICAgLy8gYy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3V0JztcclxuICAgICAgICBjLmZpbGxTdHlsZSA9ICdyZ2JhKCAwLDAsMCwnICsgcm5kSW50KCAxLCAzMCApIC8gMTAwICsgJyknO1xyXG4gICAgICAgIC8vIGMuZmlsbFN0eWxlID0gJ3JnYmEoIDAsMCwwLDAuMSknO1xyXG4gICAgICAgIGMuZmlsbFJlY3QoIDAsIDAsIHRoaXMuY3csIHRoaXMuY2ggKTtcclxuICAgICAgICBjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzb3VyY2Utb3Zlcic7XHJcbiAgICB9O1xyXG4gICAgXHJcblxyXG4gICAgdGhpcy5yZXNpemVDYW52YXNIYW5kbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgX3RoaXMuY3cgPSBfdGhpcy5jLndpZHRoID0gX3RoaXMuYy5wYXJlbnROb2RlLmNsaWVudFdpZHRoO1xyXG4gICAgfVxyXG5cclxuLy8gUmVzaXplIG9uIENhbnZhcyBvbiBXaW5kb3cgUmVzaXplXHJcbiAgICAkKHdpbmRvdykub24oICdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBfdGhpcy5yZXNpemVDYW52YXNIYW5kbGVyKCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4vLyBBbmltYXRpb24gTG9vcFxyXG4gICAgdGhpcy5sb29wID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgbG9vcEl0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBsb29wSXQsIF90aGlzLmMgKTtcclxuICAgICAgICAgICAgX3RoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgICAgICAgICAgX3RoaXMudXBkYXRlTCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5saWdodG5pbmdUaW1lcigpO1xyXG4gICAgICAgICAgICBfdGhpcy5yZW5kZXJMKCk7ICBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxvb3BJdCgpOyAgICAgICAgICAgICAgICAgICBcclxuICAgIH07XHJcbiAgXHJcbn07XHJcblxyXG5mdW5jdGlvbiBzdGFydExpZ2h0bmluZ0FuaW1hdGlvbiggY2FudmFzRG9tU2VsZWN0b3IsIHBhcmVudCApIHtcclxuICAgIGxldCB0aGlzUGFyZW50ID0gcGFyZW50IHx8IHdpbmRvdztcclxuICAgIGxldCB0aGlzQ2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggY2FudmFzRG9tU2VsZWN0b3IgKTtcclxuICAgIGNvbnNvbGUubG9nKCAndGhpc0NhbnZhczosICcsIHRoaXNDYW52YXMgKTtcclxuICAgIGNvbnNvbGUubG9nKCAndGhpc1BhcmVudDosICcsIHRoaXNQYXJlbnQgKTtcclxuICAgIGlmICggdGhpc0NhbnZhcyApIHtcclxuICAgICAgICBtYXRjaERpbWVudGlvbnMoIHRoaXNDYW52YXMsIHRoaXNQYXJlbnQgKTtcclxuICAgICAgICB2YXIgY2wgPSBuZXcgY2FudmFzTGlnaHRuaW5nKCB0aGlzQ2FudmFzICk7XHJcbiAgICAgICAgY2wuaW5pdCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oICdObyBlbGVtZW50IG1hdGNoaW5nIHNlbGVjdG9yOiAnK2NhbnZhc0RvbVNlbGVjdG9yKycgZm91bmQhJyApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jYW52YXNMaWdodG5pbmcgPSBjYW52YXNMaWdodG5pbmc7XHJcbm1vZHVsZS5leHBvcnRzLnN0YXJ0TGlnaHRuaW5nQW5pbWF0aW9uID0gc3RhcnRMaWdodG5pbmdBbmltYXRpb247IiwiLyoqXHJcbiogQ3JlYXRlcyBhIGNhbnZhcyBlbGVtZW50IGluIHRoZSBET00gdG8gdGVzdCBmb3IgYnJvd3NlciBzdXBwb3J0XHJcbiogdG8gc2VsZWN0ZWQgZWxlbWVudCB0byBtYXRjaCBzaXplIGRpbWVuc2lvbnMuXHJcbiogQHBhcmFtIHtzdHJpbmd9IGNvbnRleHRUeXBlIC0gKCAnMmQnIHwgJ3dlYmdsJyB8ICdleHBlcmltZW50YWwtd2ViZ2wnIHwgJ3dlYmdsMicsIHwgJ2JpdG1hcHJlbmRlcmVyJyAgKVxyXG4qIFRoZSB0eXBlIG9mIGNhbnZhcyBhbmQgY29udGV4dCBlbmdpbmUgdG8gY2hlY2sgc3VwcG9ydCBmb3JcclxuKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGJvdGggY2FudmFzIGFuZCB0aGUgY29udGV4dCBlbmdpbmUgYXJlIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlclxyXG4qL1xyXG5cclxuZnVuY3Rpb24gY2hlY2tDYW52YXNTdXBwb3J0KCBjb250ZXh0VHlwZSApIHtcclxuICAgIGxldCBjdHggPSBjb250ZXh0VHlwZSB8fCAnMmQnO1xyXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApO1xyXG4gICAgcmV0dXJuICEhKGVsZW0uZ2V0Q29udGV4dCAmJiBlbGVtLmdldENvbnRleHQoIGN0eCApICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hlY2tDYW52YXNTdXBwb3J0OyIsImZ1bmN0aW9uIGNvbnRlbnRTVkdIaWdobGlnaHQoKSB7XHJcblx0dmFyIHRvYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcudG9jJyApO1xyXG5cdHZhciB0b2NQYXRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy50b2MtbWFya2VyIHBhdGgnICk7XHJcblx0dmFyIHRvY0l0ZW1zO1xyXG5cclxuXHQvLyBGYWN0b3Igb2Ygc2NyZWVuIHNpemUgdGhhdCB0aGUgZWxlbWVudCBtdXN0IGNyb3NzXHJcblx0Ly8gYmVmb3JlIGl0J3MgY29uc2lkZXJlZCB2aXNpYmxlXHJcblx0dmFyIFRPUF9NQVJHSU4gPSAwLjAwLFxyXG5cdFx0Qk9UVE9NX01BUkdJTiA9IDAuMDtcclxuXHJcblx0dmFyIHBhdGhMZW5ndGg7XHJcblxyXG5cdHZhciBsYXN0UGF0aFN0YXJ0LFxyXG5cdFx0bGFzdFBhdGhFbmQ7XHJcblxyXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgZHJhd1BhdGgsIGZhbHNlICk7XHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBzeW5jLCBmYWxzZSApO1xyXG5cclxuXHRkcmF3UGF0aCgpO1xyXG5cclxuXHRmdW5jdGlvbiBkcmF3UGF0aCgpIHtcclxuXHJcblx0XHR0b2NJdGVtcyA9IFtdLnNsaWNlLmNhbGwoIHRvYy5xdWVyeVNlbGVjdG9yQWxsKCAnbGknICkgKTtcclxuXHJcblx0XHQvLyBDYWNoZSBlbGVtZW50IHJlZmVyZW5jZXMgYW5kIG1lYXN1cmVtZW50c1xyXG5cdFx0dG9jSXRlbXMgPSB0b2NJdGVtcy5tYXAoIGZ1bmN0aW9uKCBpdGVtICkge1xyXG5cdFx0XHR2YXIgYW5jaG9yID0gaXRlbS5xdWVyeVNlbGVjdG9yKCAnYScgKTtcclxuXHRcdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBhbmNob3IuZ2V0QXR0cmlidXRlKCAnaHJlZicgKS5zbGljZSggMSApICk7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGxpc3RJdGVtOiBpdGVtLFxyXG5cdFx0XHRcdGFuY2hvcjogYW5jaG9yLFxyXG5cdFx0XHRcdHRhcmdldDogdGFyZ2V0XHJcblx0XHRcdH07XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIG1pc3NpbmcgdGFyZ2V0c1xyXG5cdFx0dG9jSXRlbXMgPSB0b2NJdGVtcy5maWx0ZXIoIGZ1bmN0aW9uKCBpdGVtICkge1xyXG5cdFx0XHRyZXR1cm4gISFpdGVtLnRhcmdldDtcclxuXHRcdH0gKTtcclxuXHJcblx0XHR2YXIgcGF0aCA9IFtdO1xyXG5cdFx0dmFyIHBhdGhJbmRlbnQ7XHJcblxyXG5cdFx0dG9jSXRlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGl0ZW0sIGkgKSB7XHJcblxyXG5cdFx0XHR2YXIgeCA9IGl0ZW0uYW5jaG9yLm9mZnNldExlZnQgLSA1LFxyXG5cdFx0XHRcdHkgPSBpdGVtLmFuY2hvci5vZmZzZXRUb3AsXHJcblx0XHRcdFx0aGVpZ2h0ID0gaXRlbS5hbmNob3Iub2Zmc2V0SGVpZ2h0O1xyXG5cclxuXHRcdFx0aWYoIGkgPT09IDAgKSB7XHJcblx0XHRcdFx0cGF0aC5wdXNoKCAnTScsIHgsIHksICdMJywgeCwgeSArIGhlaWdodCApO1xyXG5cdFx0XHRcdGl0ZW0ucGF0aFN0YXJ0ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHQvLyBEcmF3IGFuIGFkZGl0aW9uYWwgbGluZSB3aGVuIHRoZXJlJ3MgYSBjaGFuZ2UgaW5cclxuXHRcdFx0XHQvLyBpbmRlbnQgbGV2ZWxzXHJcblx0XHRcdFx0aWYoIHBhdGhJbmRlbnQgIT09IHggKSBwYXRoLnB1c2goICdMJywgcGF0aEluZGVudCwgeSApO1xyXG5cclxuXHRcdFx0XHRwYXRoLnB1c2goICdMJywgeCwgeSApO1xyXG5cclxuXHRcdFx0XHQvLyBTZXQgdGhlIGN1cnJlbnQgcGF0aCBzbyB0aGF0IHdlIGNhbiBtZWFzdXJlIGl0XHJcblx0XHRcdFx0dG9jUGF0aC5zZXRBdHRyaWJ1dGUoICdkJywgcGF0aC5qb2luKCAnICcgKSApO1xyXG5cdFx0XHRcdGl0ZW0ucGF0aFN0YXJ0ID0gdG9jUGF0aC5nZXRUb3RhbExlbmd0aCgpIHx8IDA7XHJcblxyXG5cdFx0XHRcdHBhdGgucHVzaCggJ0wnLCB4LCB5ICsgaGVpZ2h0ICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHBhdGhJbmRlbnQgPSB4O1xyXG5cclxuXHRcdFx0dG9jUGF0aC5zZXRBdHRyaWJ1dGUoICdkJywgcGF0aC5qb2luKCAnICcgKSApO1xyXG5cdFx0XHRpdGVtLnBhdGhFbmQgPSB0b2NQYXRoLmdldFRvdGFsTGVuZ3RoKCk7XHJcblxyXG5cdFx0fSApO1xyXG5cclxuXHRcdHBhdGhMZW5ndGggPSB0b2NQYXRoLmdldFRvdGFsTGVuZ3RoKCk7XHJcblxyXG5cdFx0c3luYygpO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHN5bmMoKSB7XHJcblxyXG5cdFx0dmFyIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcblx0XHR2YXIgcGF0aFN0YXJ0ID0gcGF0aExlbmd0aCxcclxuXHRcdFx0cGF0aEVuZCA9IDA7XHJcblxyXG5cdFx0dmFyIHZpc2libGVJdGVtcyA9IDA7XHJcblxyXG5cdFx0dG9jSXRlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGl0ZW0gKSB7XHJcblxyXG5cdFx0XHR2YXIgdGFyZ2V0Qm91bmRzID0gaXRlbS50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG5cdFx0XHRpZiggdGFyZ2V0Qm91bmRzLmJvdHRvbSA+IHdpbmRvd0hlaWdodCAqIFRPUF9NQVJHSU4gJiYgdGFyZ2V0Qm91bmRzLnRvcCA8IHdpbmRvd0hlaWdodCAqICggMSAtIEJPVFRPTV9NQVJHSU4gKSApIHtcclxuXHRcdFx0XHRwYXRoU3RhcnQgPSBNYXRoLm1pbiggaXRlbS5wYXRoU3RhcnQsIHBhdGhTdGFydCApO1xyXG5cdFx0XHRcdHBhdGhFbmQgPSBNYXRoLm1heCggaXRlbS5wYXRoRW5kLCBwYXRoRW5kICk7XHJcblxyXG5cdFx0XHRcdHZpc2libGVJdGVtcyArPSAxO1xyXG5cclxuXHRcdFx0XHRpdGVtLmxpc3RJdGVtLmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGl0ZW0ubGlzdEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ3Zpc2libGUnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9ICk7XHJcblxyXG5cdFx0Ly8gU3BlY2lmeSB0aGUgdmlzaWJsZSBwYXRoIG9yIGhpZGUgdGhlIHBhdGggYWx0b2dldGhlclxyXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIG5vIHZpc2libGUgaXRlbXNcclxuXHRcdGlmKCB2aXNpYmxlSXRlbXMgPiAwICYmIHBhdGhTdGFydCA8IHBhdGhFbmQgKSB7XHJcblx0XHRcdGlmKCBwYXRoU3RhcnQgIT09IGxhc3RQYXRoU3RhcnQgfHwgcGF0aEVuZCAhPT0gbGFzdFBhdGhFbmQgKSB7XHJcblx0XHRcdFx0dG9jUGF0aC5zZXRBdHRyaWJ1dGUoICdzdHJva2UtZGFzaG9mZnNldCcsICcxJyApO1xyXG5cdFx0XHRcdHRvY1BhdGguc2V0QXR0cmlidXRlKCAnc3Ryb2tlLWRhc2hhcnJheScsICcxLCAnKyBwYXRoU3RhcnQgKycsICcrICggcGF0aEVuZCAtIHBhdGhTdGFydCApICsnLCAnICsgcGF0aExlbmd0aCApO1xyXG5cdFx0XHRcdHRvY1BhdGguc2V0QXR0cmlidXRlKCAnb3BhY2l0eScsIDEgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRvY1BhdGguc2V0QXR0cmlidXRlKCAnb3BhY2l0eScsIDAgKTtcclxuXHRcdH1cclxuXHJcblx0XHRsYXN0UGF0aFN0YXJ0ID0gcGF0aFN0YXJ0O1xyXG5cdFx0bGFzdFBhdGhFbmQgPSBwYXRoRW5kO1xyXG5cclxuXHR9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jb250ZW50U1ZHSGlnaGxpZ2h0ID0gY29udGVudFNWR0hpZ2hsaWdodDsiLCJmdW5jdGlvbiB3aGljaFRyYW5zaXRpb25FdmVudCgpe1xyXG4gIHZhciB0O1xyXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50Jyk7XHJcbiAgdmFyIHRyYW5zaXRpb25zID0ge1xyXG4gICAgJ1dlYmtpdFRyYW5zaXRpb24nIDond2Via2l0VHJhbnNpdGlvbkVuZCcsXHJcbiAgICAnTW96VHJhbnNpdGlvbicgICAgOid0cmFuc2l0aW9uZW5kJyxcclxuICAgICdNU1RyYW5zaXRpb24nICAgICA6J21zVHJhbnNpdGlvbkVuZCcsXHJcbiAgICAnT1RyYW5zaXRpb24nICAgICAgOidvVHJhbnNpdGlvbkVuZCcsXHJcbiAgICAndHJhbnNpdGlvbicgICAgICAgOid0cmFuc2l0aW9uRW5kJ1xyXG4gIH1cclxuXHJcbiAgZm9yKHQgaW4gdHJhbnNpdGlvbnMpe1xyXG4gICAgaWYoIGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQgKXtcclxuICAgICAgY29uc29sZS5sb2coIHRyYW5zaXRpb25zW3RdICk7XHJcbiAgICAgIHJldHVybiB0cmFuc2l0aW9uc1t0XTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB3aGljaFRyYW5zaXRpb25FdmVudDsiLCJyZXF1aXJlKCAnLi9hcHAuanMnICk7IiwibGV0IGNoZWNrQ2FudmFzU3VwcG9ydCA9IHJlcXVpcmUoICcuL2NoZWNrQ2FudmFzU3VwcG9ydC5qcycgKTtcclxubGV0IGNMaWdodG5pbmcgPSByZXF1aXJlKCAnLi9jYW52YXNEZW1vLmpzJyApLnN0YXJ0TGlnaHRuaW5nQW5pbWF0aW9uO1xyXG5sZXQgY29udGVudFNWR0hpZ2hsaWdodCA9IHJlcXVpcmUoICcuL2NvbnRlbnRTVkdIaWdobGlnaHQuanMnICkuY29udGVudFNWR0hpZ2hsaWdodDsgXHJcbmxldCBkZXRlY3RUcmFuc2l0aW9uRW5kID0gcmVxdWlyZSggJy4vZGV0ZWN0VHJhbnNpdGlvbkVuZEV2ZW50Q29tcGF0LmpzJyk7IFxyXG5sZXQgdHJhbnNFbmRFdmVudCA9IGRldGVjdFRyYW5zaXRpb25FbmQoKTtcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2l2ZW4gYXJyYXkgb2YgalF1ZXJ5IERPTSBlbGVtZW50cyB0aGUgZk4gaXRlcmF0ZXMgb3ZlciBlYWNoXHJcbiAqIG1lbWJlciwgbWVhc3VyZXMgaXQncyBoZWlnaHQsIGxvZ3MgdGhlIGhlaWdodCBhcyBhIG51bWJlciBhbmQgYXR0YWNoZXNcclxuICogYXMgYSBjdXN0b20gZWxlbWVudC4gVGhlIGZOIHRoZW4gYXBwbGllcyBhIGhlaWdodCBvZiAwIHZpYSBpbmxpbmVcclxuICogc3R5bGluZyBhbmQgYWRkcyB0aGUgXCJ0cmFuc2l0aW9uZXJcIiBjbGFzcy5cclxuICogQHBhcmFtIHtqUXVlcnl9IGFyciAtIHRoZSBhcnJheSBvZiBET00gZWxlbWVudHMgdG8gbWVhc3VyZS5cclxuICovXHJcbmZ1bmN0aW9uIG1lYXN1cmVFbHMoIGFyciApIHtcclxuXHQvKipcclxuXHQqIFRoZSBsZW5ndGggb2YgdGhlIGFycmF5XHJcblx0KiBAdHlwZSB7bnVtYmVyfVxyXG5cdCogQG1lbWJlcm9mIG1lYXN1cmVFbHNcclxuXHQqL1xyXG5cdGFyckxlbiA9IGFyci5sZW5ndGg7XHJcblx0Zm9yKCBsZXQgaSA9IGFyckxlbiAtIDE7IGkgPj0gMDsgaS0tICkge1xyXG5cdFx0LyoqXHJcblx0XHQqIFRoZSBjdXJyZW50IGl0ZXJhdGVlXHJcblx0XHQqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuXHRcdCogQG1lbWJlcm9mIG1lYXN1cmVFbHNcclxuXHRcdCogQGlubmVyXHJcblx0XHQqL1xyXG5cdFx0bGV0IGN1cnJFbCA9ICQoIGFyclsgaSBdICk7XHJcblx0XHRjdXJyRWxcclxuXHRcdFx0LmF0dHIoICdkYXRhLW9wZW4taGVpZ2h0JywgY3VyckVsLmlubmVySGVpZ2h0KCkgKVxyXG5cdFx0XHQuY3NzKCB7XHJcblx0XHRcdFx0J2hlaWdodCc6ICAwLFxyXG5cdFx0XHR9IClcclxuXHRcdFx0LmFkZENsYXNzKCAndHJhbnNpdGlvbmVyJyApO1xyXG5cdH1cclxufVxyXG5cclxuJCggZG9jdW1lbnQgKS5yZWFkeSggKCk9PiB7XHJcblxyXG5sZXQgJHJldmVhbEVscyA9ICQoICdbIGRhdGEtcmV2ZWFsLXRhcmdldCBdJyApO1xyXG5tZWFzdXJlRWxzKCAkcmV2ZWFsRWxzICk7XHJcblxyXG4kKCAnWyBkYXRhLXJldmVhbC10cmlnZ2VyIF0nICkuY2xpY2soIGZ1bmN0aW9uKCBlICl7XHJcblx0LyoqXHJcblx0KiBUaGUgY2xpY2tlZCBlbGVtZW50XHJcblx0KiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcblx0KiBAaW5uZXJcclxuXHQqL1xyXG5cdCR0aGlzID0gJCggdGhpcyApO1xyXG5cdC8qKlxyXG5cdCogVGhlIGVsZW1lbnQgbGlua2VkIHRvIHRoZSBjbGlja2VkIGVsZW1lbnQgYnkgY3VzdG9tIGRhdGEgYXR0cmlidXRlcyBcclxuXHQqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuXHQqIEBpbm5lclxyXG5cdCovXHJcblx0JGxpbmtlZEVsID0gJCggYFsgZGF0YS1yZXZlYWwtdGFyZ2V0PVwiJHskdGhpcy5hdHRyKCAnZGF0YS1yZXZlYWwtdHJpZ2dlcicgKX1cIiBdYCApO1xyXG5cdC8qKlxyXG5cdCogVGhlIGhlaWdodCBvZiB0aGUgbGlua2VkIGVsZW1lbnQgIGluIGl0J3MgbWF4aW11bSBvcGVuIHN0YXRlIFxyXG5cdCogQHR5cGUge251bWJlcn1cclxuXHQqIEBpbm5lclxyXG5cdCovXHJcblx0bGV0IHRoaXNIZWlnaHQgPSBgJHskbGlua2VkRWwuYXR0ciggJ2RhdGEtb3Blbi1oZWlnaHQnICl9cHhgO1xyXG5cclxuXHRpZiAoICRsaW5rZWRFbC5oYXNDbGFzcyggJ2lzLWFjdGl2ZScgKSApIHtcclxuXHRcdCRsaW5rZWRFbFxyXG5cdFx0XHQuY3NzKCB7ICdoZWlnaHQnOiAgMCB9IClcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdFx0JHRoaXMucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcblx0fSBlbHNlIHtcclxuXHRcdCRsaW5rZWRFbFxyXG5cdFx0XHQuY3NzKCB7ICdoZWlnaHQnOiAgdGhpc0hlaWdodCB9IClcclxuXHRcdFx0LmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cclxuXHRcdCR0aGlzLmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdH1cclxuIFxyXG59ICk7XHJcblxyXG59KTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0aWYgKCAkKCAnLnRvYycgKS5sZW5ndGggPiAwICkge1xyXG5cdFx0Y29udGVudFNWR0hpZ2hsaWdodCgpO1xyXG5cdH1cclxuXHRcclxuXHRpZiggY2hlY2tDYW52YXNTdXBwb3J0KCkgKXtcclxuXHRcdGlmICggJCggJyNjYW52YXMnICkubGVuZ3RoID4gMCApIHtcclxuXHRcdFx0Y0xpZ2h0bmluZyggJyNjYW52YXMnLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2NhbnZhcycgKS5wYXJlbnRFbGVtZW50ICk7XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG59OyIsIlxyXG4vKipcclxuKiBNZWFzdXJlcyB0aGUgdGFyZ2V0IERPTSBlbGVtZW50IGRpbWVuc2lvbnMuIERvbSBlbGVtZW50cyByZXF1aXJlIG5vZGUuY2xpZW50V2lkdGgvSGVpZ2h0LlxyXG4qIHRoZSBnbG9iYWwud2luZG93IG9iamVjdCByZXF1aXJlcyBub2RlLmlubmVyV2lkdGgvSGVpZ2h0XHJcbiogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBET00gbm9kZSBvciBlbGVtZW50IHRvIG1lYXN1cmUuXHJcbiogQHJldHVybnMge0RpbWVuc2lvbnN9IHRoZSBkaW1lbnNpb25zIG9mIHRoZSBlbGVtZW50XHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXREaW1lbnNpb25zKCBlbCApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdzogZWwuaW5uZXJXaWR0aCB8fCBlbC5jbGllbnRXaWR0aCxcclxuICAgICAgICBoOiBlbC5pbm5lckhlaWdodCB8fCBlbC5jbGllbnRIZWlnaHRcclxuICAgIH07XHJcbn1cclxuXHJcbi8qKlxyXG4qIE1lYXN1cmVzIHRoZSB0YXJnZXQgRE9NIGVsZW1lbnQgYW5kIGFwcGxpZXMgd2lkdGgvaGVpZ2h0XHJcbiogdG8gc2VsZWN0ZWQgZWxlbWVudCBcImVsXCIuXHJcbiogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBEb20gbm9kZSBwb2ludGluZyB0byBlbGVtZW50IHRvIHRyYW5zZm9ybSBzaXplLlxyXG4qIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldCAtIERvbSBub2RlIHBvaW50aW5nIHRvIGNvbnRhaW5lciBlbGVtZW50IHRvIG1hdGNoIGRpbWVuc2lvbnMuXHJcbiogQHBhcmFtIHtEaW1lbnNpb25zfSBvcHRpb25zIC0gb3B0aW9uYWwgcGFyYW1ldGVyIG9iamVjdCB3aXRoIG1lbWJlcnMgXCJ3XCIgYW5kIFwiaFwiXHJcbipyZXByZXNlbnRpbmcgd2lkdGggYW5kIGhlaWdodCBmb3Igc2V0dGluZyBkZWZhdWx0IG9yIG1pbmltdW0gdmFsdWVzIGlmIG5vdCBtZXQgYnkgXCJ0YXJnZXRcIi5cclxuKiBAcmV0dXJucyB7dm9pZH1cclxuKi9cclxuXHJcbmZ1bmN0aW9uIG1hdGNoRGltZW50aW9ucyggZWwsIHRhcmdldCwgb3B0aW9ucyA9IHsgdzogNTAwLCBoOiA1MDAgfSApIHtcclxuICAgIGxldCB0ID0gZ2V0RGltZW5zaW9ucyggdGFyZ2V0ICk7XHJcbiAgICBlbC53aWR0aCA9IHQudyA8IG9wdGlvbnMudyA/IG9wdGlvbnMudyA6IHQudztcclxuICAgIGVsLmhlaWdodCA9IHQuaCA8IG9wdGlvbnMuaCA/IG9wdGlvbnMuaCA6IHQuaDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaERpbWVudGlvbnM7IiwiLy8jcmVnaW9uIExpY2VuY2UgaW5mb3JtYXRpb24gXHJcbi8qXHJcblx0KiBUaGlzIGlzIGEgbmVhci1kaXJlY3QgcG9ydCBvZiBSb2JlcnQgUGVubmVyJ3MgZWFzaW5nIGVxdWF0aW9ucy4gUGxlYXNlIHNob3dlciBSb2JlcnQgd2l0aFxyXG5cdCogcHJhaXNlIGFuZCBhbGwgb2YgeW91ciBhZG1pcmF0aW9uLiBIaXMgbGljZW5zZSBpcyBwcm92aWRlZCBiZWxvdy5cclxuXHQqXHJcblx0KiBGb3IgaW5mb3JtYXRpb24gb24gaG93IHRvIHVzZSB0aGVzZSBmdW5jdGlvbnMgaW4geW91ciBhbmltYXRpb25zLCBjaGVjayBvdXQgbXkgZm9sbG93aW5nIHR1dG9yaWFsOiBcclxuXHQqIGh0dHA6Ly9iaXQubHkvMThpSEhLcVxyXG5cdCpcclxuXHQqIC1LaXJ1cGFcclxuXHQqL1xyXG5cclxuXHQvKlxyXG5cdCogQGF1dGhvciBSb2JlcnQgUGVubmVyXHJcblx0KiBAbGljZW5zZSBcclxuXHQqIFRFUk1TIE9GIFVTRSAtIEVBU0lORyBFUVVBVElPTlNcclxuXHQqIFxyXG5cdCogT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLiBcclxuXHQqIFxyXG5cdCogQ29weXJpZ2h0IMKpIDIwMDEgUm9iZXJ0IFBlbm5lclxyXG5cdCogQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuXHQqIFxyXG5cdCogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgXHJcblx0KiBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XHJcblx0KiBcclxuXHQqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIFxyXG5cdCogY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxyXG5cdCogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3QgXHJcblx0KiBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBcclxuXHQqIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cclxuXHQqIFxyXG5cdCogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgYXV0aG9yIG5vciB0aGUgbmFtZXMgb2YgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2UgXHJcblx0KiBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxyXG5cdCogXHJcblx0KiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIFxyXG5cdCogRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GXHJcblx0KiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuXHQqIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcclxuXHQqIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURVxyXG5cdCogR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIFxyXG5cdCogQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcclxuXHQqIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIFxyXG5cdCogT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLiBcclxuXHQqXHJcbiovXHJcbi8vI2VuZHJlZ2lvblxyXG5cclxuLyoqXHJcbiogUHJvdmlkZXMgZWFzaW5nIGNhbGN1bGF0aW9uIG1ldGhvZHMuXHJcbiogQG5hbWUgZWFzaW5nRXF1YXRpb25zXHJcbiogQGRlc2NyaXB0aW9uIHtAbGluayBodHRwczovL2Vhc2luZ3MubmV0L2VufFNlZSB0aGUgRWFzaW5nIGNoZWF0IHNoZWV0fSBmb3IgYSB2aXN1YWwgcmVwcmVzZW50YXRpb24gZm9yIGVhY2ggY3VydmUgZm9ybXVsYS4gT3JpZ2luYWxseSBkZXZlbG9wZWQgYnkge0BsaW5rIGh0dHA6Ly9yb2JlcnRwZW5uZXIuY29tL2Vhc2luZy98Um9iZXJ0IFBlbm5lcn1cclxuKi9cclxudmFyIGVhc2luZ0VxdWF0aW9ucyA9IHtcclxuXHRsaW5lYXJFYXNlOiByZXF1aXJlKCAnLi9lYXNpbmcvbGluZWFyRWFzZS5qcycgKSxcclxuXHRlYXNlSW5RdWFkOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluUXVhZC5qcycgKSxcclxuXHRlYXNlT3V0UXVhZDogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VPdXRRdWFkLmpzJyApLFxyXG5cdGVhc2VJbk91dFF1YWQ6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5PdXRRdWFkLmpzJyApLFxyXG5cdGVhc2VJbkN1YmljOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluQ3ViaWMuanMnICksXHJcblx0ZWFzZU91dEN1YmljOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZU91dEN1YmljLmpzJyApLFxyXG5cdGVhc2VJbk91dEN1YmljOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluT3V0Q3ViaWMuanMnICksXHJcblx0ZWFzZUluUXVhcnQ6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5RdWFydC5qcycgKSxcclxuXHRlYXNlT3V0UXVhcnQ6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlT3V0UXVhcnQuanMnICksXHJcblx0ZWFzZUluT3V0UXVhcnQ6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5PdXRRdWFydC5qcycgKSxcclxuXHRlYXNlSW5RdWludDogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJblF1aW50LmpzJyApLFxyXG5cdGVhc2VPdXRRdWludDogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VPdXRRdWludC5qcycgKSxcclxuXHRlYXNlSW5PdXRRdWludDogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbk91dFF1aW50LmpzJyApLFxyXG5cdGVhc2VJblNpbmU6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5TaW5lLmpzJyApLFxyXG5cdGVhc2VPdXRTaW5lOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZU91dFNpbmUuanMnICksXHJcblx0ZWFzZUluT3V0U2luZTogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbk91dFNpbmUuanMnICksXHJcblx0ZWFzZUluRXhwbzogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbkV4cG8uanMnICksXHJcblx0ZWFzZU91dEV4cG86IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlT3V0RXhwby5qcycgKSxcclxuXHRlYXNlSW5PdXRFeHBvOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluT3V0RXhwby5qcycgKSxcclxuXHRlYXNlSW5DaXJjOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluQ2lyYy5qcycgKSxcclxuXHRlYXNlT3V0Q2lyYzogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VPdXRDaXJjLmpzJyApLFxyXG5cdGVhc2VJbk91dENpcmM6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5PdXRDaXJjLmpzJyApLFxyXG5cdGVhc2VJbkVsYXN0aWM6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5FbGFzdGljLmpzJyApLFxyXG5cdGVhc2VPdXRFbGFzdGljOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZU91dEVsYXN0aWMuanMnICksXHJcblx0ZWFzZUluT3V0RWxhc3RpYzogcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbk91dEVsYXN0aWMuanMnICksXHJcblx0ZWFzZU91dEJhY2s6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlT3V0QmFjay5qcycgKSxcclxuXHRlYXNlSW5CYWNrOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluQmFjay5qcycgKSxcclxuXHRlYXNlSW5PdXRCYWNrOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluT3V0QmFjay5qcycgKSxcclxuXHRlYXNlT3V0Qm91bmNlOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZU91dEJvdW5jZS5qcycgKSxcclxuXHRlYXNlSW5Cb3VuY2U6IHJlcXVpcmUoICcuL2Vhc2luZy9lYXNlSW5Cb3VuY2UuanMnICksXHJcblx0ZWFzZUluT3V0Qm91bmNlOiByZXF1aXJlKCAnLi9lYXNpbmcvZWFzZUluT3V0Qm91bmNlLmpzJyApXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5lYXNpbmdFcXVhdGlvbnMgPSBlYXNpbmdFcXVhdGlvbnM7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIDxwPkZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluQmFjay48L3A+IDxwPlNlZSA8YSBocmVmPVwiIGh0dHBzOi8vZWFzaW5ncy5uZXQvI2Vhc2VJblF1YWRcIj5lYXNlSW5RdWFkPC9hPiBmb3IgYSB2aXN1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGN1cnZlIGFuZCBmdXJ0aGVyIGluZm9ybWF0aW9uLjwvcD48cD5Ob3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIDxzdHJvbmc+bm90PC9zdHJvbmc+IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHkuPC9wPlxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBbb3ZlcnNob290PTEuNzAxNThdIC0gYSByYXRpbyBvZiB0aGUge3N0YXJ0VmFsdWV9IGFuZCB7Y2hhbmdlSW5WYWx1ZX0gdG8gZ2l2ZSB0aGUgZWZmZWN0IG9mIFwib3ZlcnNob290aW5nXCIgdGhlIGluaXRpYWwge3N0YXJ0VmFsdWV9IChlYXNlSW4pLCBcIm92ZXJzaG9vdGluZ1wiIGZpbmFsIHZhbHVlIHtzdGFydFZhbHVlICsgY2hhbmdlSW5WYWx1ZX0gKGVhc2VPdXQpIG9yIGJvdGggKGVhc2VJbk91dCkuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbkJhY2soXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnMsXHJcbiAgICBvdmVyc2hvb3RcclxuKSB7XHJcbiAgICBpZiAoIG92ZXJzaG9vdCA9PSB1bmRlZmluZWQgKSBvdmVyc2hvb3QgPSAxLjcwMTU4O1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgKSAqIGN1cnJlbnRJdGVyYXRpb24gKiAoICggb3ZlcnNob290ICsgMSkgKiBjdXJyZW50SXRlcmF0aW9uIC0gb3ZlcnNob290ICkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJbkJhY2s7IiwiY29uc3QgZWFzZU91dEJvdW5jZSA9IHJlcXVpcmUoICcuL2Vhc2VPdXRCb3VuY2UuanMnIClcclxuXHJcbi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbkJvdW5jZS4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluQm91bmNlKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLSBlYXNlT3V0Qm91bmNlKCB0b3RhbEl0ZXJhdGlvbnMgLSBjdXJyZW50SXRlcmF0aW9uLCAwLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMgKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluQm91bmNlOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbkNpcmMuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbkNpcmMoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgxIC0gTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMpICogY3VycmVudEl0ZXJhdGlvbikpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5DaXJjOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbkN1YmljLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5DdWJpYyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgMykgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJbkN1YmljOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbkVsYXN0aWMuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbkVsYXN0aWMoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICB2YXIgcyA9IDEuNzAxNTg7XHJcblx0XHR2YXIgcCA9IDA7XHJcblx0XHR2YXIgYSA9IGNoYW5nZUluVmFsdWU7XHJcblx0XHRpZiAoY3VycmVudEl0ZXJhdGlvbiA9PSAwKSByZXR1cm4gc3RhcnRWYWx1ZTtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMpID09IDEpIHJldHVybiBzdGFydFZhbHVlICsgY2hhbmdlSW5WYWx1ZTtcclxuXHRcdGlmICghcCkgcCA9IHRvdGFsSXRlcmF0aW9ucyAqIC4zO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjaGFuZ2VJblZhbHVlKSkge1xyXG5cdFx0XHRhID0gY2hhbmdlSW5WYWx1ZTtcclxuXHRcdFx0dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oY2hhbmdlSW5WYWx1ZSAvIGEpXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIC0oYSAqIE1hdGgucG93KDIsIDEwICogKGN1cnJlbnRJdGVyYXRpb24gLT0gMSkpICogTWF0aC5zaW4oKGN1cnJlbnRJdGVyYXRpb24gKiB0b3RhbEl0ZXJhdGlvbnMgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJbkVsYXN0aWM7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluRXhwby4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluRXhwbyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEpKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluRXhwbzsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlSW5PdXRCYWNrLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IFtvdmVyc2hvb3Q9MS43MDE1OF0gLSBhIHJhdGlvIG9mIHRoZSB7c3RhcnRWYWx1ZX0gYW5kIHtjaGFuZ2VJblZhbHVlfSB0byBnaXZlIHRoZSBlZmZlY3Qgb2YgXCJvdmVyc2hvb3RpbmdcIiB0aGUgaW5pdGlhbCB7c3RhcnRWYWx1ZX0gKGVhc2VJbiopLCBcIm92ZXJzaG9vdGluZ1wiIGZpbmFsIHZhbHVlIHtzdGFydFZhbHVlICsgY2hhbmdlSW5WYWx1ZX0gKGVhc2VPdXQqKSBvciBib3RoIChlYXNlSW5PdXQqKS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluT3V0QmFjayhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9ucyxcclxuICAgIG92ZXJzaG9vdFxyXG4pIHtcclxuICAgIGlmICggb3ZlcnNob290ID09IHVuZGVmaW5lZCApIG92ZXJzaG9vdCA9IDEuNzAxNTg7XHJcbiAgICBpZiAoICggY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyICkgPCAxICkge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqICggY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24gKiAoKCAoIG92ZXJzaG9vdCAqPSAxLjUyNSApICsgMSApICogY3VycmVudEl0ZXJhdGlvbiAtIG92ZXJzaG9vdCApICkgKyBzdGFydFZhbHVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKCAoIGN1cnJlbnRJdGVyYXRpb24gLT0gMiApICogY3VycmVudEl0ZXJhdGlvbiAqICggKCAoIG92ZXJzaG9vdCAqPSAxLjUyNSApICsgMSApICogY3VycmVudEl0ZXJhdGlvbiArIG92ZXJzaG9vdCApICsgMiApICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5PdXRCYWNrOyIsImNvbnN0IGVhc2VJbkJvdW5jZSA9IHJlcXVpcmUoICcuL2Vhc2VJbkJvdW5jZS5qcycgKTtcclxuY29uc3QgZWFzZU91dEJvdW5jZSA9IHJlcXVpcmUoICcuL2Vhc2VPdXRCb3VuY2UuanMnICk7XHJcblxyXG4vKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlSW5PdXRCb3VuY2UuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbk91dEJvdW5jZShcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIGlmICggY3VycmVudEl0ZXJhdGlvbiA8IHRvdGFsSXRlcmF0aW9ucyAvIDIgKSB7XHJcbiAgICAgICAgcmV0dXJuIGVhc2VJbkJvdW5jZSggY3VycmVudEl0ZXJhdGlvbiAqIDIsIDAsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucyApICogLjUgKyBzdGFydFZhbHVlO1xyXG4gICAgfVxyXG5cdHJldHVybiBlYXNlT3V0Qm91bmNlKCBjdXJyZW50SXRlcmF0aW9uICogMiAtIHRvdGFsSXRlcmF0aW9ucywgMCwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zICkgKiAuNSArIGNoYW5nZUluVmFsdWUgKiAuNSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluT3V0Qm91bmNlOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbk91dENpcmMuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbk91dENpcmMoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICBpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKDEgLSBNYXRoLnNxcnQoMSAtIGN1cnJlbnRJdGVyYXRpb24gKiBjdXJyZW50SXRlcmF0aW9uKSkgKyBzdGFydFZhbHVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gLT0gMikgKiBjdXJyZW50SXRlcmF0aW9uKSArIDEpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5PdXRDaXJjOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbk91dEN1YmljLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5PdXRDdWJpYyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuICAgICAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCAzKSArIHN0YXJ0VmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDMpICsgMikgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJbk91dEN1YmljOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbk91dEVsYXN0aWMuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbk91dEVsYXN0aWMoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICB2YXIgcyA9IDEuNzAxNTg7XHJcbiAgICB2YXIgcCA9IDA7XHJcbiAgICB2YXIgYSA9IGNoYW5nZUluVmFsdWU7XHJcbiAgICBpZiAoIGN1cnJlbnRJdGVyYXRpb24gPT0gMCApIHJldHVybiBzdGFydFZhbHVlO1xyXG4gICAgaWYgKCAoIGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMiApID09IDIgKSByZXR1cm4gc3RhcnRWYWx1ZSArIGNoYW5nZUluVmFsdWU7XHJcbiAgICBpZiAoICFwICkgcCA9IHRvdGFsSXRlcmF0aW9ucyAqICggLjMgKiAxLjUgKTtcclxuICAgIGlmICggYSA8IE1hdGguYWJzKCBjaGFuZ2VJblZhbHVlICkgKSB7XHJcbiAgICAgICAgYSA9IGNoYW5nZUluVmFsdWU7XHJcbiAgICAgICAgdmFyIHMgPSBwIC8gNDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIHMgPSBwIC8gKCAyICogTWF0aC5QSSApICogTWF0aC5hc2luKCBjaGFuZ2VJblZhbHVlICAvIGEgKTtcclxuICAgIH07XHJcbiAgICBpZiAoIGN1cnJlbnRJdGVyYXRpb24gPCAxICkge1xyXG4gICAgICAgIHJldHVybiAtLjUgKiAoIGEgKiBNYXRoLnBvdyggMiwgMTAgKiAoIGN1cnJlbnRJdGVyYXRpb24gLT0gMSApICkgKiBNYXRoLnNpbiggKCBjdXJyZW50SXRlcmF0aW9uICogdG90YWxJdGVyYXRpb25zIC0gcyApICogKCAyICogTWF0aC5QSSApIC8gcCApICkgKyBzdGFydFZhbHVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGEgKiBNYXRoLnBvdyggMiwgLTEwICogKCBjdXJyZW50SXRlcmF0aW9uIC09IDEgKSApICogTWF0aC5zaW4oICggY3VycmVudEl0ZXJhdGlvbiAqIHRvdGFsSXRlcmF0aW9ucyAtIHMgKSAqICggMiAqIE1hdGguUEkpIC8gcCApICogLjUgKyBjaGFuZ2VJblZhbHVlICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5PdXRFbGFzdGljOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbk91dEV4cG8uIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbk91dEV4cG8oXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICBpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAtIDEpKSArIHN0YXJ0VmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tY3VycmVudEl0ZXJhdGlvbikgKyAyKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluT3V0RXhwbzsiLCIvKipcclxuKiBAc3VtbWFyeSBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbk91dFF1YWQuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAod2hlcmUge2N1cnJlbnRJdGVyYXRpb24gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnMgIFxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5PdXRRdWFkKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgaWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIGN1cnJlbnRJdGVyYXRpb24gKiBjdXJyZW50SXRlcmF0aW9uICsgc3RhcnRWYWx1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiAtY2hhbmdlSW5WYWx1ZSAvIDIgKiAoLS1jdXJyZW50SXRlcmF0aW9uICogKGN1cnJlbnRJdGVyYXRpb24gLSAyKSAtIDEpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5PdXRRdWFkOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJbk91dFF1YXJ0LiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLiBcclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluT3V0UXVhcnQoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICBpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgNCkgKyBzdGFydFZhbHVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIC1jaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC0gMiwgNCkgLSAyKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluT3V0UXVhcnQ7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluT3V0UXVpbnQuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJbk91dFF1aW50KFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgaWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDUpICsgc3RhcnRWYWx1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC0gMiwgNSkgKyAyKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluT3V0UXVpbnQ7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluT3V0U2luZS4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluT3V0U2luZShcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMpKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluT3V0U2luZTsiLCIvKipcclxuKiBAc3VtbWFyeSBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJblF1YWQuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAod2hlcmUge2N1cnJlbnRJdGVyYXRpb24gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseS4gU2VlIHtAbGluayBodHRwczovL2Vhc2luZ3MubmV0LyNlYXNlSW5RdWFkIGVhc2VJblF1YWR9IGZvciBhIHZpc3VhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgY3VydmUgYW5kIGZ1cnRoZXIgaW5mb3JtYXRpb24uXHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5RdWFkKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMpICogY3VycmVudEl0ZXJhdGlvbiArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluUXVhZDsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlSW5RdWFydC4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluUXVhcnQoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMsIDQpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5RdWFydDsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlSW5RdWludC4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluUXVpbnQoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMsIDUpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5RdWludDsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlSW5TaW5lLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5LiBTZWUge0BsaW5rIGh0dHBzOi8vZWFzaW5ncy5uZXQvI2Vhc2VJblNpbmUgZWFzZUluU2luZX0gZm9yIGEgdmlzdWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjdXJ2ZSBhbmQgZnVydGhlciBpbmZvcm1hdGlvbi4gIFxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluU2luZShcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogKCAxIC0gTWF0aC5jb3MoIGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKiAoIE1hdGguUEkgLyAyICkgKSApICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5TaW5lOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VPdXRCYWNrLiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IFtvdmVyc2hvb3Q9MS43MDE1OF0gLSBhIHJhdGlvIG9mIHRoZSB7c3RhcnRWYWx1ZX0gYW5kIHtjaGFuZ2VJblZhbHVlfSB0byBnaXZlIHRoZSBlZmZlY3Qgb2YgXCJvdmVyc2hvb3RpbmdcIiB0aGUgaW5pdGlhbCB7c3RhcnRWYWx1ZX0gKGVhc2VJbiopLCBcIm92ZXJzaG9vdGluZ1wiIGZpbmFsIHZhbHVlIHtzdGFydFZhbHVlICsgY2hhbmdlSW5WYWx1ZX0gKGVhc2VPdXQqKSBvciBib3RoIChlYXNlSW5PdXQqKS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZU91dEJhY2soXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnMsXHJcbiAgICBvdmVyc2hvb3RcclxuKSB7XHJcbiAgICBpZiAoIG92ZXJzaG9vdCA9PSB1bmRlZmluZWQgKSBvdmVyc2hvb3QgPSAxLjcwMTU4O1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoICggY3VycmVudEl0ZXJhdGlvbiA9IGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxICkgKiBjdXJyZW50SXRlcmF0aW9uICogKCAoIG92ZXJzaG9vdCArIDEgKSAqIGN1cnJlbnRJdGVyYXRpb24gKyBvdmVyc2hvb3QgKSArIDEgKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZU91dEJhY2s7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZU91dEJvdW5jZS4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZU91dEJvdW5jZShcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIGlmICggKCBjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyApIDwgMSAvIDIuNzUgKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoIDcuNTYyNSAqIGN1cnJlbnRJdGVyYXRpb24gKiBjdXJyZW50SXRlcmF0aW9uICkgKyBzdGFydFZhbHVlO1xyXG4gICAgfSBlbHNlIGlmICggY3VycmVudEl0ZXJhdGlvbiA8IDIgLyAyLjc1ICkge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogKCA3LjU2MjUgKiAoIGN1cnJlbnRJdGVyYXRpb24gLT0gMS41IC8gMi43NSApICogY3VycmVudEl0ZXJhdGlvbiArIC43NSApICsgc3RhcnRWYWx1ZTtcclxuICAgIH0gZWxzZSBpZiAoIGN1cnJlbnRJdGVyYXRpb24gPCAyLjUgLyAyLjc1ICkge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogKCA3LjU2MjUgKiAoIGN1cnJlbnRJdGVyYXRpb24gLT0gMi4yNSAvIDIuNzUgKSAqIGN1cnJlbnRJdGVyYXRpb24gKyAuOTM3NSApICsgc3RhcnRWYWx1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoIDcuNTYyNSAqICggY3VycmVudEl0ZXJhdGlvbiAtPSAyLjYyNSAvIDIuNzUgKSAqIGN1cnJlbnRJdGVyYXRpb24gKyAuOTg0Mzc1ICkgKyBzdGFydFZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VPdXRCb3VuY2U7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZU91dENpcmMuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VPdXRDaXJjKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnNxcnQoMSAtIChjdXJyZW50SXRlcmF0aW9uID0gY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEpICogY3VycmVudEl0ZXJhdGlvbikgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VPdXRDaXJjOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VPdXRDdWJpYy4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZU91dEN1YmljKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDMpICsgMSkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VPdXRDdWJpYzsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlT3V0RWxhc3RpYy4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZU91dEVsYXN0aWMoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICB2YXIgcyA9IDEuNzAxNTg7XHJcbiAgICB2YXIgcCA9IDA7XHJcbiAgICB2YXIgYSA9IGNoYW5nZUluVmFsdWU7XHJcbiAgICBpZiAoIGN1cnJlbnRJdGVyYXRpb24gPT0gMCApIHJldHVybiBzdGFydFZhbHVlO1xyXG4gICAgaWYgKCAoIGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zICkgPT0gMSApIHJldHVybiBzdGFydFZhbHVlICsgY2hhbmdlSW5WYWx1ZTtcclxuICAgIGlmICggIXAgKSBwID0gdG90YWxJdGVyYXRpb25zICogLjM7XHJcbiAgICBpZiAoIGEgPCBNYXRoLmFicyggY2hhbmdlSW5WYWx1ZSApICkge1xyXG4gICAgICAgIGEgPSBjaGFuZ2VJblZhbHVlO1xyXG4gICAgICAgIHZhciBzID0gcCAvIDQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBzID0gcCAvICggMiAqIE1hdGguUEkgKSAqIE1hdGguYXNpbiggY2hhbmdlSW5WYWx1ZSAvIGEgKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhICogTWF0aC5wb3coIDIsIC0xMCAqIGN1cnJlbnRJdGVyYXRpb24gKSAqIE1hdGguc2luKCAoIGN1cnJlbnRJdGVyYXRpb24gKiB0b3RhbEl0ZXJhdGlvbnMgLSBzICkgKiAoIDIgKiBNYXRoLlBJICkgLyBwICkgKyBjaGFuZ2VJblZhbHVlICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlT3V0RWxhc3RpYzsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlT3V0RXhwby4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh1bnRpbCB7Y3VycmVudEl0ZXJhdGlvbn0gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseVxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZU91dEV4cG8oXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgtTWF0aC5wb3coMiwgLTEwICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZU91dEV4cG87IiwiLyoqXHJcbiogQHN1bW1hcnkgZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlT3V0UXVhZC4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh3aGVyZSB7Y3VycmVudEl0ZXJhdGlvbiBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5LiBTZWUge0BsaW5rIGh0dHBzOi8vZWFzaW5ncy5uZXQvI2Vhc2VPdXRRdWFkIGVhc2VPdXRRdWFkfSBmb3IgYSB2aXN1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGN1cnZlIGFuZCBmdXJ0aGVyIGluZm9ybWF0aW9uLlxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZU91dFF1YWQoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gLWNoYW5nZUluVmFsdWUgKiAoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMpICogKGN1cnJlbnRJdGVyYXRpb24gLSAyKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZU91dFF1YWQ7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZU91dFF1YXJ0LiBOb3RlIHRoZSB7c3RhcnRWYWx1ZX0gc2hvdWxkIG5vdCBjaGFuZ2UgZm9yIHRoZSBmdW5jdGlvbiBsaWZlY3ljbGUgKHVudGlsIHtjdXJyZW50SXRlcmF0aW9ufSBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5XHJcbiogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlT3V0UXVhcnQoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gLWNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDQpIC0gMSkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VPdXRRdWFydDsiLCIvKipcclxuKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gc2lnbmF0dXJlIGZvciBlYXNlT3V0UXVpbnQuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VPdXRRdWludChcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCA1KSArIDEpICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlT3V0UXVpbnQ7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZU91dFNpbmUuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHlcclxuKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VPdXRTaW5lKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnNpbihjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zICogKE1hdGguUEkgLyAyKSkgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VPdXRTaW5lOyIsIi8qKlxyXG4qIEBzdW1tYXJ5IGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgbGluZWFyRWFzZS4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh3aGVyZSB7Y3VycmVudEl0ZXJhdGlvbiBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5LlxyXG4qIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gbGluZWFyRWFzZShcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGluZWFyRWFzZTsiLCIvKipcclxuKiBwcm92aWRlcyBtYXRocyB1dGlsaWxpdHkgbWV0aG9kcyBhbmQgaGVscGVycy5cclxuKlxyXG4qIEBtb2R1bGUgbWF0aFV0aWxzXHJcbiovXHJcblxyXG52YXIgbWF0aFV0aWxzID0ge1xyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2VuZXJhdGUgcmFuZG9tIGludGVnZXIgYmV0d2VlbiAyIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdHJhbmRvbUludGVnZXI6IGZ1bmN0aW9uIHJhbmRvbUludGVnZXIobWluLCBtYXgpIHtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4ICsgMSAtIG1pbikgKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIEdlbmVyYXRlIHJhbmRvbSBmbG9hdCBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tOiBmdW5jdGlvbiByYW5kb20obWluLCBtYXgpIHtcclxuXHRcdGlmIChtaW4gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtaW4gPSAwO1xyXG5cdFx0XHRtYXggPSAxO1xyXG5cdFx0fSBlbHNlIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtYXggPSBtaW47XHJcblx0XHRcdG1pbiA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdGdldFJhbmRvbUFyYml0cmFyeTogZnVuY3Rpb24gZ2V0UmFuZG9tQXJiaXRyYXJ5KG1pbiwgbWF4KSB7XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBUcmFuc2Zvcm1zIHZhbHVlIHByb3BvcnRpb25hdGVseSBiZXR3ZWVuIGlucHV0IHJhbmdlIGFuZCBvdXRwdXQgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgb3JpZ2luIHJhbmdlICggbWluMS9tYXgxICkuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4xIC0gbWluaW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgxIC0gbWF4aW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4yIC0gbWluaW11bSB2YWx1ZSBpbiBkZXN0aW5hdGlvbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heDIgLSBtYXhpbXVtIHZhbHVlIGluIGRlc3RpbmF0aW9uIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiBkZXN0aW5hdGlvbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0bWFwOiBmdW5jdGlvbiBtYXAodmFsdWUsIG1pbjEsIG1heDEsIG1pbjIsIG1heDIsIGNsYW1wUmVzdWx0KSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgcmV0dXJudmFsdWUgPSAodmFsdWUgLSBtaW4xKSAvIChtYXgxIC0gbWluMSkgKiAobWF4MiAtIG1pbjIpICsgbWluMjtcclxuXHRcdGlmIChjbGFtcFJlc3VsdCkgcmV0dXJuIHNlbGYuY2xhbXAocmV0dXJudmFsdWUsIG1pbjIsIG1heDIpO2Vsc2UgcmV0dXJuIHJldHVybnZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ2xhbXAgdmFsdWUgYmV0d2VlbiByYW5nZSB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgcmFuZ2UgeyBtaW58bWF4IH0uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlIGluIHRoZSByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUgaW4gdGhlIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqL1xyXG5cdGNsYW1wOiBmdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtcclxuXHRcdGlmIChtYXggPCBtaW4pIHtcclxuXHRcdFx0dmFyIHRlbXAgPSBtaW47XHJcblx0XHRcdG1pbiA9IG1heDtcclxuXHRcdFx0bWF4ID0gdGVtcDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGhVdGlsczsiXX0=
