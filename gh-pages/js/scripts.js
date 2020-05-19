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

},{"./matchDimentions.js":8,"./utils/easing.js":9,"./utils/mathUtils.js":15}],3:[function(require,module,exports){
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
const linearEase = require('./easing/linearEase.js');

const easeInQuad = require('./easing/easeInQuad.js');

const easeOutQuad = require('./easing/easeOutQuad.js');

const easeInOutQuad = require('./easing/easeInOutQuad.js');

const easeInCubic = require('./easing/easeInCubic.js'); // requires definition in-file to take advantage of "@callback" reusability
// bit of a hack but useful in this specific example where multiple functions have the same signature

/**
* Base function signature for easing methods.
{currentIteration} - the current clock or iteration cycle
{startValue} - The value to EASE from
{changeInValue} - The change value relative to the start value
{totalIterations} -The total cycles or iterations of the easing curve to calculate
{returns} - The calculated (absolute) value along the easing curve from the {startValue}
* @callback easingFn
* @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The calculated (absolute) value along the easing curve
*/

/**
* Base function signature for easing methods.
{currentIteration} - the current clock or iteration cycle
{startValue} - The value to EASE from
{changeInValue} - The change value relative to the start value
{totalIterations} -The total cycles or iterations of the easing curve to calculate
{overshoot} - a ratio of the {startValue} and {changeInValue} to give the effect of "overshooting" the initial {startValue} (easeIn*), "overshooting" final value {startValue + changeInValue} (easeOut*) or both (easeInOut*).
{returns} - The calculated (absolute) value along the easing curve from the {startValue}
* @callback easingFnExtended
* @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @param {number} [overshoot=1.70158] - a ratio of the {startValue} and {changeInValue} to give the effect of "overshooting" the initial {startValue} (easeIn*), "overshooting" final value {startValue + changeInValue} (easeOut*) or both (easeInOut*).
* @returns {number} - The calculated (absolute) value along the easing curve
*/

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
* @description {@link https://easings.net/en|See the Easing cheat sheet} for a visual representation for each curve formula. Originally developed by {@link http://robertpenner.com/easing/|Robert Penner}
*/


var easingEquations = {
  linearEase: linearEase,
  easeInQuad: easeInQuad,
  easeOutQuad: easeOutQuad,
  easeInOutQuad: easeInOutQuad,
  easeInCubic: easeInCubic,

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeOutCubic' curve
  	* @memberof easingEquations
  	*/
  easeOutCubic: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInOutCubic' curve
  	* @memberof easingEquations
  	*/
  easeInOutCubic: function (currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
    }

    return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInQuart' curve
  	* @memberof easingEquations
  	*/
  easeInQuart: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeOutQuart' curve
  	* @memberof easingEquations
  	*/
  easeOutQuart: function (currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInOutQuart' curve
  	* @memberof easingEquations
  	*/
  easeInOutQuart: function (currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
    }

    return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInQuint' curve
  	* @memberof easingEquations
  	*/
  easeInQuint: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeOutQuint' curve
  	* @memberof easingEquations
  	*/
  easeOutQuint: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInOutQuint' curve
  	* @memberof easingEquations
  	*/
  easeInOutQuint: function (currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
    }

    return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInSine' curve
  	* @memberof easingEquations
  	*/
  easeInSine: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeOutSine' curve
  	* @memberof easingEquations
  	*/
  easeOutSine: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInOutSine' curve
  	* @memberof easingEquations
  	*/
  easeInOutSine: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInExpo' curve
  	* @memberof easingEquations
  	*/
  easeInExpo: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeOutExpo' curve
  	* @memberof easingEquations
  	*/
  easeOutExpo: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInOutExpo' curve
  	* @memberof easingEquations
  	*/
  easeInOutExpo: function (currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
    }

    return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInCirc' curve
  	* @memberof easingEquations
  	*/
  easeInCirc: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeOutCirc' curve
  	* @memberof easingEquations
  	*/
  easeOutCirc: function (currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInOutCirc' curve
  	* @memberof easingEquations
  	*/
  easeInOutCirc: function (currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
      return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
    }

    return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInElastic' curve
  	* @memberof easingEquations
  	*/
  easeInElastic: function (currentIteration, startValue, changeInValue, totalIterations) {
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
  },

  /**
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeOutElastic' curve
  	* @memberof easingEquations
  	*/
  easeOutElastic: function (t, b, c, d) {
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
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeInOutElastic' curve
  	* @memberof easingEquations
  	*/
  easeInOutElastic: function (t, b, c, d) {
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
  * @method
  * @type {easingFnExtended}
  	* @description easing method for the 'easeInBack' curve
  * @memberof easingEquations
  	*/
  easeInBack: function (t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },

  /**
  * @method
  	* @type {easingFnExtended}
  	* @description easing method for the 'easeOutQuint' curve
  	* @memberof easingEquations
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
  * @method
  	* @type {easingFn}
  	* @description easing method for the 'easeOutBounce' curve
  	* @memberof easingEquations
  	*/
  easeOutBounce: function (t, b, c, d) {
    if ((t /= d) < 1 / 2.75) {
      return c * (7.5625 * t * t) + b;
    } else if (t < 2 / 2.75) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
    } else if (t < 2.5 / 2.75) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
    } else {
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
    }
  },

  /**
  * @method
  * @type {easingFn}
  * @description easing method for the 'easeInBounce' curve
  * @memberof easingEquations
  */
  easeInBounce: function (currentIteration, startValue, changeInValue, totalIterations) {
    let self = this;
    return changeInValue - self.easeOutBounce(totalIterations - currentIteration, 0, changeInValue, totalIterations) + startValue;
  }
}; // /**
// * @method
// * @type {easingFn}
// * @description easing method for the 'easeInBounce' curve
// * @memberof easingEquations
// */
// easingEquations.easeInBounce = function (currentIteration, startValue, changeInValue, totalIterations) {
// 	return changeInValue - easingEquations.easeOutBounce(totalIterations - currentIteration, 0, changeInValue, totalIterations) + startValue;
// };

/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeOutQuint' curve
 	* @memberof easingEquations
 	*/

easingEquations.easeInOutBounce = function (currentIteration, startValue, changeInValue, totalIterations) {
  if (currentIteration < totalIterations / 2) return easingEquations.easeInBounce(currentIteration * 2, 0, changeInValue, totalIterations) * .5 + startValue;
  return easingEquations.easeOutBounce(currentIteration * 2 - totalIterations, 0, changeInValue, totalIterations) * .5 + changeInValue * .5 + startValue;
};

module.exports.easingEquations = easingEquations;

},{"./easing/easeInCubic.js":10,"./easing/easeInOutQuad.js":11,"./easing/easeInQuad.js":12,"./easing/easeOutQuad.js":13,"./easing/linearEase.js":14}],10:[function(require,module,exports){
/**
* @description function signature for easeInCubic. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially  
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

},{}],11:[function(require,module,exports){
/**
* @summary function signature for easeInOutQuad. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially  
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

},{}],12:[function(require,module,exports){
/**
* @summary function signature for easeInQuad. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially  
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

},{}],13:[function(require,module,exports){
/**
* @summary function signature for easeOutQuad. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially  
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

},{}],14:[function(require,module,exports){
/**
* @summary function signature for linearEase. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially  
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

},{}],15:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NhbnZhc0RlbW8uanMiLCJzcmMvanMvY2hlY2tDYW52YXNTdXBwb3J0LmpzIiwic3JjL2pzL2NvbnRlbnRTVkdIaWdobGlnaHQuanMiLCJzcmMvanMvZGV0ZWN0VHJhbnNpdGlvbkVuZEV2ZW50Q29tcGF0LmpzIiwic3JjL2pzL2VudHJ5LmpzIiwic3JjL2pzL2Z1bmN0aW9ucy5qcyIsInNyYy9qcy9tYXRjaERpbWVudGlvbnMuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nLmpzIiwic3JjL2pzL3V0aWxzL2Vhc2luZy9lYXNlSW5DdWJpYy5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZUluT3V0UXVhZC5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZUluUXVhZC5qcyIsInNyYy9qcy91dGlscy9lYXNpbmcvZWFzZU91dFF1YWQuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nL2xpbmVhckVhc2UuanMiLCJzcmMvanMvdXRpbHMvbWF0aFV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQSxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUUsZ0JBQUYsQ0FBUCxDQUE0QixFQUF2QyxDLENBR0E7QUFDQTtBQUVBOzs7QUNQQTtBQUNBLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBRSxzQkFBRixDQUF6Qjs7QUFDQSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUUsbUJBQUYsQ0FBUCxDQUErQixlQUE5Qzs7QUFDQSxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUUsc0JBQUYsQ0FBN0IsQyxDQUVBOzs7QUFDQSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsVUFBcEI7QUFDQSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsYUFBdkI7QUFDQSxJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBcEIsQyxDQUNBOztBQUNBLElBQUks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QixHQUE1QixFQUFpQyxHQUFqQyxFQUFzQztBQUN6RCxXQUFPLElBQUksQ0FBQyxNQUFMLE1BQWlCLEdBQUcsR0FBRyxHQUF2QixJQUE4QixHQUFyQztBQUNBLEdBOUJjOztBQStCZjs7Ozs7Ozs7OztBQVVBLEVBQUEsR0FBRyxFQUFFLFNBQVMsR0FBVCxDQUFhLEtBQWIsRUFBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBZ0MsSUFBaEMsRUFBc0MsSUFBdEMsRUFBNEMsV0FBNUMsRUFBeUQ7QUFDN0QsUUFBSSxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUksV0FBVyxHQUFHLENBQUMsS0FBSyxHQUFHLElBQVQsS0FBa0IsSUFBSSxHQUFHLElBQXpCLEtBQWtDLElBQUksR0FBRyxJQUF6QyxJQUFpRCxJQUFuRTtBQUNBLFFBQUksV0FBSixFQUFpQixPQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsV0FBWCxFQUF3QixJQUF4QixFQUE4QixJQUE5QixDQUFQLENBQWpCLEtBQWlFLE9BQU8sV0FBUDtBQUNqRSxHQTdDYzs7QUErQ2Y7Ozs7Ozs7QUFPQSxFQUFBLEtBQUssRUFBRSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCLEdBQXRCLEVBQTJCLEdBQTNCLEVBQWdDO0FBQ3RDLFFBQUksR0FBRyxHQUFHLEdBQVYsRUFBZTtBQUNkLFVBQUksSUFBSSxHQUFHLEdBQVg7QUFDQSxNQUFBLEdBQUcsR0FBRyxHQUFOO0FBQ0EsTUFBQSxHQUFHLEdBQUcsSUFBTjtBQUNBOztBQUNELFdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULEVBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULEVBQWdCLEdBQWhCLENBQWQsQ0FBUDtBQUNBO0FBN0RjLENBQWhCO0FBZ0VBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gYXBwIGZ1bmN0aW9uc1xyXG5jb25zdCBmTiA9IHJlcXVpcmUoICcuL2Z1bmN0aW9ucy5qcycgKS5mTjtcclxuXHJcblxyXG4vLyAkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpe1xyXG4vLyBcdCQoICdib2R5IG1haW4nICkuYXBwZW5kKCAnPHA+SGVsbG8gV29ybGQ8L3A+JyApO1xyXG5cclxuLy8gfSApOyIsIi8vIENhbnZhcyBMaWdodG5pbmcgdjFcclxuY29uc3QgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5jb25zdCBlYXNpbmcgPSByZXF1aXJlKCAnLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5sZXQgbWF0Y2hEaW1lbnRpb25zID0gcmVxdWlyZSggJy4vbWF0Y2hEaW1lbnRpb25zLmpzJyApO1xyXG5cclxuLy8gbGV0IGVhc2VGbiA9IGVhc2luZy5lYXNlSW5DaXJjO1xyXG5sZXQgZWFzZUZuID0gZWFzaW5nLmxpbmVhckVhc2U7XHJcbmxldCBybmRJbnQgPSBtYXRoVXRpbHMucmFuZG9tSW50ZWdlcjtcclxubGV0IHJuZCA9IG1hdGhVdGlscy5yYW5kb207XHJcbi8vIExpZ2h0bmluZyB0cmlnZ2VyIHJhbmdlXHJcbmxldCBsaWdodG5pbmdGcmVxdWVuY3lMb3cgPSAxMDA7XHJcbmxldCBsaWdodG5pbmdGcmVxdWVuY3lIaWdoID0gMjUwO1xyXG5cclxuLy8gTGlnaHRuaW5nIHNlZ21lbnQgY291bnRcclxubGV0IGxTZWdtZW50Q291bnRMID0gMTA7XHJcbmxldCBsU2VnbWVudENvdW50SCA9IDM1O1xyXG5cclxuLy8gRGlzdGFuY2UgcmFuZ2VzIGJldHdlZW4gbGlnaHRuaW5nIHBhdGggc2VnbWVudHNcclxubGV0IGxTZWdtZW50WEJvdW5kc0wgPSAxNTtcclxubGV0IGxTZWdtZW50WEJvdW5kc0ggPSA2MDtcclxubGV0IGxTZWdtZW50WUJvdW5kc0wgPSAyNTtcclxubGV0IGxTZWdtZW50WUJvdW5kc0ggPSA1NTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY2FudmFzTGlnaHRuaW5nKCBjYW52YXMgKXtcclxuICBcclxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5sb29wKCk7XHJcbiAgICB9OyAgICBcclxuICBcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB0aGlzLmMgPSBjYW52YXM7XHJcbiAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCAnMmQnICk7XHJcbiAgICB0aGlzLmN3ID0gY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy5jaCA9IGNhbnZhcy5oZWlnaHQ7XHJcbiAgICB0aGlzLm14ID0gMDtcclxuICAgIHRoaXMubXkgPSAwO1xyXG5cclxuICAgIHRoaXMubGlnaHRuaW5nID0gW107XHJcbiAgICB0aGlzLmxpZ2h0VGltZUN1cnJlbnQgPSAwO1xyXG4gICAgdGhpcy5saWdodFRpbWVUb3RhbCA9IDUwO1xyXG4gIFxyXG4gICAgLy8gVXRpbGl0aWVzICAgICAgICBcclxuICAgIHRoaXMuaGl0VGVzdCA9IGZ1bmN0aW9uKCB4MSwgeTEsIHcxLCBoMSwgeDIsIHkyLCB3MiwgaDIpIHtcclxuICAgICAgICByZXR1cm4gISggeDEgKyB3MSA8IHgyIHx8IHgyICsgdzIgPCB4MSB8fCB5MSArIGgxIDwgeTIgfHwgeTIgKyBoMiA8IHkxICk7XHJcbiAgICB9O1xyXG4gICAgXHJcbi8vIENyZWF0ZSBMaWdodG5pbmdcclxuICAgIHRoaXMuY3JlYXRlTCA9IGZ1bmN0aW9uKCB4LCB5LCBjYW5TcGF3biwgaXNDaGlsZCApe1xyXG5cclxuICAgICAgICBsZXQgdGhpc0xpZ2h0bmluZyA9IHtcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgeFJhbmdlOiBybmRJbnQoIGxTZWdtZW50WEJvdW5kc0wsIGxTZWdtZW50WEJvdW5kc0ggKSxcclxuICAgICAgICAgICAgeVJhbmdlOiBybmRJbnQoIGxTZWdtZW50WUJvdW5kc0wsIGxTZWdtZW50WUJvdW5kc0ggKSxcclxuICAgICAgICAgICAgcGF0aDogW3sgeDogeCwgeTogeSB9XSxcclxuICAgICAgICAgICAgcGF0aExpbWl0OiBybmRJbnQoIGxTZWdtZW50Q291bnRMLCBsU2VnbWVudENvdW50SCApLFxyXG4gICAgICAgICAgICBjYW5TcGF3bjogY2FuU3Bhd24sXHJcbiAgICAgICAgICAgIGlzQ2hpbGQ6IGlzQ2hpbGQsXHJcbiAgICAgICAgICAgIGhhc0ZpcmVkOiBmYWxzZSxcclxuICAgICAgICAgICAgYWxwaGE6IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubGlnaHRuaW5nLnB1c2goIHRoaXNMaWdodG5pbmcgKTtcclxuICAgIH07XHJcbiAgICBcclxuLy8gVXBkYXRlIExpZ2h0bmluZ1xyXG4gICAgdGhpcy51cGRhdGVMID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgaSA9IHRoaXMubGlnaHRuaW5nLmxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoIGktLSApe1xyXG4gICAgICAgICAgICBsZXQgbGlnaHQgPSB0aGlzLmxpZ2h0bmluZ1sgaSBdO1xyXG4gICAgICAgICAgICBsZXQgeyBwYXRoLCB4UmFuZ2UsIHlSYW5nZSwgcGF0aExpbWl0IH0gPSBsaWdodDtcclxuICAgICAgICAgICAgbGV0IHBhdGhMZW4gPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IHByZXZMUGF0aCA9IHBhdGhbIHBhdGhMZW4gLSAxIF07ICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsaWdodC5wYXRoLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgeDogcHJldkxQYXRoLnggKyAoIHJuZEludCggMCwgeFJhbmdlICktKCB4UmFuZ2UgLyAyICkgKSxcclxuICAgICAgICAgICAgICAgIHk6IHByZXZMUGF0aC55ICsgKCBybmRJbnQoIDAsIHlSYW5nZSApIClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIHBhdGhMZW4gPiBwYXRoTGltaXQgKXtcclxuICAgICAgICAgICAgICAgIHRoaXMubGlnaHRuaW5nLnNwbGljZSggaSwgMSApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGlnaHQuaGFzRmlyZWQgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgXHJcbi8vIFJlbmRlciBMaWdodG5pbmdcclxuICAgIHRoaXMucmVuZGVyTCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLmxpZ2h0bmluZy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLmN0eDtcclxuICAgICAgICBsZXQgZ2xvd0NvbG9yID0gJ3doaXRlJztcclxuICAgICAgICBsZXQgZ2xvd0JsdXIgPSAzMDtcclxuICAgICAgICBsZXQgc2hhZG93UmVuZGVyT2Zmc2V0ID0gMTAwMDA7XHJcblxyXG4gICAgICAgIHdoaWxlKCBpLS0gKXtcclxuICAgICAgICAgICAgbGV0IGxpZ2h0ID0gdGhpcy5saWdodG5pbmdbIGkgXTtcclxuICAgICAgICAgICAgbGV0IHBhdGhDb3VudCA9IGxpZ2h0LnBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgY2hpbGRMaWdodEZpcmVzID0gcm5kSW50KCAwLCAxMDAgKSA8IDMwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgYWxwaGE7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGxpZ2h0LmlzQ2hpbGQgPT09IGZhbHNlIHx8IGNoaWxkTGlnaHRGaXJlcyApIHtcclxuICAgICAgICAgICAgICAgIGlmICggcGF0aENvdW50ID09PSBsaWdodC5wYXRoTGltaXQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYy5maWxsU3R5bGUgPSAncmdiYSggMjU1LCAyNTUsIDI1NSwgJyArIHJuZEludCggMjAsIDUwICkgLyAxMDAgKyAnKSc7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5maWxsUmVjdCggMCwgMCwgdGhpcy5jdywgdGhpcy5jaCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWF4TGluZVdpZHRoID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVyYXRpb25zID0gcm5kSW50KCAxMCwgNTAgKTtcclxuICAgICAgICAgICAgICAgICAgICBjLmxpbmVDYXAgPSBcInJvdW5kXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciggbGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9uczsgaSsrICl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29sb3JDaGFuZ2UgPSBlYXNlRm4oIGksIDE1MCwgMTA1LCBpdGVyYXRpb25zICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2xpZ2h0ZXInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjLnN0cm9rZVN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5zaGFkb3dCbHVyID0gZWFzZUZuKCBpLCBtYXhMaW5lV2lkdGgsIC1tYXhMaW5lV2lkdGgsIGl0ZXJhdGlvbnMgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5zaGFkb3dDb2xvciA9IGByZ2JhKCAkeyBjb2xvckNoYW5nZSB9LCAkeyBjb2xvckNoYW5nZSB9LCAyNTUsIDEgKWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuc2hhZG93T2Zmc2V0WSA9IHNoYWRvd1JlbmRlck9mZnNldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5tb3ZlVG8oIGxpZ2h0LngsIGxpZ2h0LnkgLSBzaGFkb3dSZW5kZXJPZmZzZXQgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKCBsZXQgaiA9IDA7IGogPCBwYXRoQ291bnQ7IGorKyApeyAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IGxpZ2h0LnBhdGhbIGogXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubGluZVRvKCBwLngsIHAueSAtIHNoYWRvd1JlbmRlck9mZnNldCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjLnNoYWRvd09mZnNldFkgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIGxpZ2h0LmlzQ2hpbGQgPT09IGZhbHNlIHx8IGNoaWxkTGlnaHRGaXJlcyApIHtcclxuICAgICAgICAgICAgICAgIGlmICggcGF0aENvdW50ID09PSBsaWdodC5wYXRoTGltaXQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5saW5lV2lkdGggPSA1O1xyXG4gICAgICAgICAgICAgICAgICAgIGFscGhhID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBjLnNoYWRvd0NvbG9yID0gJ3JnYmEoIDEwMCwgMTAwLCAyNTUsIDEgKSc7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5zaGFkb3dCbHVyID0gZ2xvd0JsdXI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGMubGluZVdpZHRoID0gMC41O1xyXG4gICAgICAgICAgICAgICAgICAgIGFscGhhID0gcm5kSW50KCAxMCwgNTAgKSAvIDEwMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGMubGluZVdpZHRoID0gMTtcclxuICAgICAgICAgICAgICAgIGFscGhhID0gcm5kSW50KCAxMCwgNTAgKSAvIDEwMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYy5zdHJva2VTdHlsZSA9IGBoc2xhKCAwLCAxMDAlLCAxMDAlLCAke2FscGhhfSApYDtcclxuXHJcblxyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjLm1vdmVUbyggbGlnaHQueCwgbGlnaHQueSApO1xyXG4gICAgICAgICAgICBmb3IoIGxldCBpID0gMDsgaSA8IHBhdGhDb3VudDsgaSsrICl7ICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHBTZWcgPSBsaWdodC5wYXRoWyBpIF07XHJcbiAgICAgICAgICAgICAgICBjLmxpbmVUbyggcFNlZy54LCBwU2VnLnkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggbGlnaHQuY2FuU3Bhd24gKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiggcm5kSW50KDAsIDEwMCApIDwgMSApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaWdodC5jYW5TcGF3biA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUwoIHBTZWcueCwgcFNlZy55LCB0cnVlLCB0cnVlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjLnNoYWRvd0JsdXIgPSAwO1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIFxyXG4vLyBMaWdodG5pbmcgVGltZXJcclxuICAgIHRoaXMubGlnaHRuaW5nVGltZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMubGlnaHRUaW1lQ3VycmVudCsrO1xyXG4gICAgICAgIGlmKCB0aGlzLmxpZ2h0VGltZUN1cnJlbnQgPj0gdGhpcy5saWdodFRpbWVUb3RhbCApe1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1ggPSBybmRJbnQoIDUwLCB0aGlzLmN3IC0gNTAgKTtcclxuICAgICAgICAgICAgbGV0IG5ld1kgPSBybmRJbnQoIC0zMCwgLTI1ICk7IFxyXG4gICAgICAgICAgICBsZXQgY3JlYXRlQ291bnQgPSBybmRJbnQoIDEsIDIgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlKCBjcmVhdGVDb3VudC0tICl7ICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVMKCBuZXdYLCBuZXdZLCB0cnVlLCBmYWxzZSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0VGltZUN1cnJlbnQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0VGltZVRvdGFsID0gcm5kSW50KCBsaWdodG5pbmdGcmVxdWVuY3lMb3csIGxpZ2h0bmluZ0ZyZXF1ZW5jeUhpZ2ggKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiBcclxuICAgIHRoaXMuY2xlYXJDYW52YXMgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGxldCBjID0gdGhpcy5jdHg7XHJcbiAgICAgICAgLy8gYy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3V0JztcclxuICAgICAgICBjLmZpbGxTdHlsZSA9ICdyZ2JhKCAwLDAsMCwnICsgcm5kSW50KCAxLCAzMCApIC8gMTAwICsgJyknO1xyXG4gICAgICAgIC8vIGMuZmlsbFN0eWxlID0gJ3JnYmEoIDAsMCwwLDAuMSknO1xyXG4gICAgICAgIGMuZmlsbFJlY3QoIDAsIDAsIHRoaXMuY3csIHRoaXMuY2ggKTtcclxuICAgICAgICBjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzb3VyY2Utb3Zlcic7XHJcbiAgICB9O1xyXG4gICAgXHJcblxyXG4gICAgdGhpcy5yZXNpemVDYW52YXNIYW5kbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgX3RoaXMuY3cgPSBfdGhpcy5jLndpZHRoID0gX3RoaXMuYy5wYXJlbnROb2RlLmNsaWVudFdpZHRoO1xyXG4gICAgfVxyXG5cclxuLy8gUmVzaXplIG9uIENhbnZhcyBvbiBXaW5kb3cgUmVzaXplXHJcbiAgICAkKHdpbmRvdykub24oICdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBfdGhpcy5yZXNpemVDYW52YXNIYW5kbGVyKCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4vLyBBbmltYXRpb24gTG9vcFxyXG4gICAgdGhpcy5sb29wID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgbG9vcEl0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBsb29wSXQsIF90aGlzLmMgKTtcclxuICAgICAgICAgICAgX3RoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgICAgICAgICAgX3RoaXMudXBkYXRlTCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5saWdodG5pbmdUaW1lcigpO1xyXG4gICAgICAgICAgICBfdGhpcy5yZW5kZXJMKCk7ICBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxvb3BJdCgpOyAgICAgICAgICAgICAgICAgICBcclxuICAgIH07XHJcbiAgXHJcbn07XHJcblxyXG5mdW5jdGlvbiBzdGFydExpZ2h0bmluZ0FuaW1hdGlvbiggY2FudmFzRG9tU2VsZWN0b3IsIHBhcmVudCApIHtcclxuICAgIGxldCB0aGlzUGFyZW50ID0gcGFyZW50IHx8IHdpbmRvdztcclxuICAgIGxldCB0aGlzQ2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggY2FudmFzRG9tU2VsZWN0b3IgKTtcclxuICAgIGNvbnNvbGUubG9nKCAndGhpc0NhbnZhczosICcsIHRoaXNDYW52YXMgKTtcclxuICAgIGNvbnNvbGUubG9nKCAndGhpc1BhcmVudDosICcsIHRoaXNQYXJlbnQgKTtcclxuICAgIGlmICggdGhpc0NhbnZhcyApIHtcclxuICAgICAgICBtYXRjaERpbWVudGlvbnMoIHRoaXNDYW52YXMsIHRoaXNQYXJlbnQgKTtcclxuICAgICAgICB2YXIgY2wgPSBuZXcgY2FudmFzTGlnaHRuaW5nKCB0aGlzQ2FudmFzICk7XHJcbiAgICAgICAgY2wuaW5pdCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oICdObyBlbGVtZW50IG1hdGNoaW5nIHNlbGVjdG9yOiAnK2NhbnZhc0RvbVNlbGVjdG9yKycgZm91bmQhJyApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jYW52YXNMaWdodG5pbmcgPSBjYW52YXNMaWdodG5pbmc7XHJcbm1vZHVsZS5leHBvcnRzLnN0YXJ0TGlnaHRuaW5nQW5pbWF0aW9uID0gc3RhcnRMaWdodG5pbmdBbmltYXRpb247IiwiLyoqXHJcbiogQ3JlYXRlcyBhIGNhbnZhcyBlbGVtZW50IGluIHRoZSBET00gdG8gdGVzdCBmb3IgYnJvd3NlciBzdXBwb3J0XHJcbiogdG8gc2VsZWN0ZWQgZWxlbWVudCB0byBtYXRjaCBzaXplIGRpbWVuc2lvbnMuXHJcbiogQHBhcmFtIHtzdHJpbmd9IGNvbnRleHRUeXBlIC0gKCAnMmQnIHwgJ3dlYmdsJyB8ICdleHBlcmltZW50YWwtd2ViZ2wnIHwgJ3dlYmdsMicsIHwgJ2JpdG1hcHJlbmRlcmVyJyAgKVxyXG4qIFRoZSB0eXBlIG9mIGNhbnZhcyBhbmQgY29udGV4dCBlbmdpbmUgdG8gY2hlY2sgc3VwcG9ydCBmb3JcclxuKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGJvdGggY2FudmFzIGFuZCB0aGUgY29udGV4dCBlbmdpbmUgYXJlIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlclxyXG4qL1xyXG5cclxuZnVuY3Rpb24gY2hlY2tDYW52YXNTdXBwb3J0KCBjb250ZXh0VHlwZSApIHtcclxuICAgIGxldCBjdHggPSBjb250ZXh0VHlwZSB8fCAnMmQnO1xyXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApO1xyXG4gICAgcmV0dXJuICEhKGVsZW0uZ2V0Q29udGV4dCAmJiBlbGVtLmdldENvbnRleHQoIGN0eCApICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hlY2tDYW52YXNTdXBwb3J0OyIsImZ1bmN0aW9uIGNvbnRlbnRTVkdIaWdobGlnaHQoKSB7XHJcblx0dmFyIHRvYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcudG9jJyApO1xyXG5cdHZhciB0b2NQYXRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy50b2MtbWFya2VyIHBhdGgnICk7XHJcblx0dmFyIHRvY0l0ZW1zO1xyXG5cclxuXHQvLyBGYWN0b3Igb2Ygc2NyZWVuIHNpemUgdGhhdCB0aGUgZWxlbWVudCBtdXN0IGNyb3NzXHJcblx0Ly8gYmVmb3JlIGl0J3MgY29uc2lkZXJlZCB2aXNpYmxlXHJcblx0dmFyIFRPUF9NQVJHSU4gPSAwLjAwLFxyXG5cdFx0Qk9UVE9NX01BUkdJTiA9IDAuMDtcclxuXHJcblx0dmFyIHBhdGhMZW5ndGg7XHJcblxyXG5cdHZhciBsYXN0UGF0aFN0YXJ0LFxyXG5cdFx0bGFzdFBhdGhFbmQ7XHJcblxyXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgZHJhd1BhdGgsIGZhbHNlICk7XHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBzeW5jLCBmYWxzZSApO1xyXG5cclxuXHRkcmF3UGF0aCgpO1xyXG5cclxuXHRmdW5jdGlvbiBkcmF3UGF0aCgpIHtcclxuXHJcblx0XHR0b2NJdGVtcyA9IFtdLnNsaWNlLmNhbGwoIHRvYy5xdWVyeVNlbGVjdG9yQWxsKCAnbGknICkgKTtcclxuXHJcblx0XHQvLyBDYWNoZSBlbGVtZW50IHJlZmVyZW5jZXMgYW5kIG1lYXN1cmVtZW50c1xyXG5cdFx0dG9jSXRlbXMgPSB0b2NJdGVtcy5tYXAoIGZ1bmN0aW9uKCBpdGVtICkge1xyXG5cdFx0XHR2YXIgYW5jaG9yID0gaXRlbS5xdWVyeVNlbGVjdG9yKCAnYScgKTtcclxuXHRcdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBhbmNob3IuZ2V0QXR0cmlidXRlKCAnaHJlZicgKS5zbGljZSggMSApICk7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGxpc3RJdGVtOiBpdGVtLFxyXG5cdFx0XHRcdGFuY2hvcjogYW5jaG9yLFxyXG5cdFx0XHRcdHRhcmdldDogdGFyZ2V0XHJcblx0XHRcdH07XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIG1pc3NpbmcgdGFyZ2V0c1xyXG5cdFx0dG9jSXRlbXMgPSB0b2NJdGVtcy5maWx0ZXIoIGZ1bmN0aW9uKCBpdGVtICkge1xyXG5cdFx0XHRyZXR1cm4gISFpdGVtLnRhcmdldDtcclxuXHRcdH0gKTtcclxuXHJcblx0XHR2YXIgcGF0aCA9IFtdO1xyXG5cdFx0dmFyIHBhdGhJbmRlbnQ7XHJcblxyXG5cdFx0dG9jSXRlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGl0ZW0sIGkgKSB7XHJcblxyXG5cdFx0XHR2YXIgeCA9IGl0ZW0uYW5jaG9yLm9mZnNldExlZnQgLSA1LFxyXG5cdFx0XHRcdHkgPSBpdGVtLmFuY2hvci5vZmZzZXRUb3AsXHJcblx0XHRcdFx0aGVpZ2h0ID0gaXRlbS5hbmNob3Iub2Zmc2V0SGVpZ2h0O1xyXG5cclxuXHRcdFx0aWYoIGkgPT09IDAgKSB7XHJcblx0XHRcdFx0cGF0aC5wdXNoKCAnTScsIHgsIHksICdMJywgeCwgeSArIGhlaWdodCApO1xyXG5cdFx0XHRcdGl0ZW0ucGF0aFN0YXJ0ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHQvLyBEcmF3IGFuIGFkZGl0aW9uYWwgbGluZSB3aGVuIHRoZXJlJ3MgYSBjaGFuZ2UgaW5cclxuXHRcdFx0XHQvLyBpbmRlbnQgbGV2ZWxzXHJcblx0XHRcdFx0aWYoIHBhdGhJbmRlbnQgIT09IHggKSBwYXRoLnB1c2goICdMJywgcGF0aEluZGVudCwgeSApO1xyXG5cclxuXHRcdFx0XHRwYXRoLnB1c2goICdMJywgeCwgeSApO1xyXG5cclxuXHRcdFx0XHQvLyBTZXQgdGhlIGN1cnJlbnQgcGF0aCBzbyB0aGF0IHdlIGNhbiBtZWFzdXJlIGl0XHJcblx0XHRcdFx0dG9jUGF0aC5zZXRBdHRyaWJ1dGUoICdkJywgcGF0aC5qb2luKCAnICcgKSApO1xyXG5cdFx0XHRcdGl0ZW0ucGF0aFN0YXJ0ID0gdG9jUGF0aC5nZXRUb3RhbExlbmd0aCgpIHx8IDA7XHJcblxyXG5cdFx0XHRcdHBhdGgucHVzaCggJ0wnLCB4LCB5ICsgaGVpZ2h0ICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHBhdGhJbmRlbnQgPSB4O1xyXG5cclxuXHRcdFx0dG9jUGF0aC5zZXRBdHRyaWJ1dGUoICdkJywgcGF0aC5qb2luKCAnICcgKSApO1xyXG5cdFx0XHRpdGVtLnBhdGhFbmQgPSB0b2NQYXRoLmdldFRvdGFsTGVuZ3RoKCk7XHJcblxyXG5cdFx0fSApO1xyXG5cclxuXHRcdHBhdGhMZW5ndGggPSB0b2NQYXRoLmdldFRvdGFsTGVuZ3RoKCk7XHJcblxyXG5cdFx0c3luYygpO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHN5bmMoKSB7XHJcblxyXG5cdFx0dmFyIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcblx0XHR2YXIgcGF0aFN0YXJ0ID0gcGF0aExlbmd0aCxcclxuXHRcdFx0cGF0aEVuZCA9IDA7XHJcblxyXG5cdFx0dmFyIHZpc2libGVJdGVtcyA9IDA7XHJcblxyXG5cdFx0dG9jSXRlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGl0ZW0gKSB7XHJcblxyXG5cdFx0XHR2YXIgdGFyZ2V0Qm91bmRzID0gaXRlbS50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG5cdFx0XHRpZiggdGFyZ2V0Qm91bmRzLmJvdHRvbSA+IHdpbmRvd0hlaWdodCAqIFRPUF9NQVJHSU4gJiYgdGFyZ2V0Qm91bmRzLnRvcCA8IHdpbmRvd0hlaWdodCAqICggMSAtIEJPVFRPTV9NQVJHSU4gKSApIHtcclxuXHRcdFx0XHRwYXRoU3RhcnQgPSBNYXRoLm1pbiggaXRlbS5wYXRoU3RhcnQsIHBhdGhTdGFydCApO1xyXG5cdFx0XHRcdHBhdGhFbmQgPSBNYXRoLm1heCggaXRlbS5wYXRoRW5kLCBwYXRoRW5kICk7XHJcblxyXG5cdFx0XHRcdHZpc2libGVJdGVtcyArPSAxO1xyXG5cclxuXHRcdFx0XHRpdGVtLmxpc3RJdGVtLmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGl0ZW0ubGlzdEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ3Zpc2libGUnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9ICk7XHJcblxyXG5cdFx0Ly8gU3BlY2lmeSB0aGUgdmlzaWJsZSBwYXRoIG9yIGhpZGUgdGhlIHBhdGggYWx0b2dldGhlclxyXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIG5vIHZpc2libGUgaXRlbXNcclxuXHRcdGlmKCB2aXNpYmxlSXRlbXMgPiAwICYmIHBhdGhTdGFydCA8IHBhdGhFbmQgKSB7XHJcblx0XHRcdGlmKCBwYXRoU3RhcnQgIT09IGxhc3RQYXRoU3RhcnQgfHwgcGF0aEVuZCAhPT0gbGFzdFBhdGhFbmQgKSB7XHJcblx0XHRcdFx0dG9jUGF0aC5zZXRBdHRyaWJ1dGUoICdzdHJva2UtZGFzaG9mZnNldCcsICcxJyApO1xyXG5cdFx0XHRcdHRvY1BhdGguc2V0QXR0cmlidXRlKCAnc3Ryb2tlLWRhc2hhcnJheScsICcxLCAnKyBwYXRoU3RhcnQgKycsICcrICggcGF0aEVuZCAtIHBhdGhTdGFydCApICsnLCAnICsgcGF0aExlbmd0aCApO1xyXG5cdFx0XHRcdHRvY1BhdGguc2V0QXR0cmlidXRlKCAnb3BhY2l0eScsIDEgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRvY1BhdGguc2V0QXR0cmlidXRlKCAnb3BhY2l0eScsIDAgKTtcclxuXHRcdH1cclxuXHJcblx0XHRsYXN0UGF0aFN0YXJ0ID0gcGF0aFN0YXJ0O1xyXG5cdFx0bGFzdFBhdGhFbmQgPSBwYXRoRW5kO1xyXG5cclxuXHR9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jb250ZW50U1ZHSGlnaGxpZ2h0ID0gY29udGVudFNWR0hpZ2hsaWdodDsiLCJmdW5jdGlvbiB3aGljaFRyYW5zaXRpb25FdmVudCgpe1xyXG4gIHZhciB0O1xyXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50Jyk7XHJcbiAgdmFyIHRyYW5zaXRpb25zID0ge1xyXG4gICAgJ1dlYmtpdFRyYW5zaXRpb24nIDond2Via2l0VHJhbnNpdGlvbkVuZCcsXHJcbiAgICAnTW96VHJhbnNpdGlvbicgICAgOid0cmFuc2l0aW9uZW5kJyxcclxuICAgICdNU1RyYW5zaXRpb24nICAgICA6J21zVHJhbnNpdGlvbkVuZCcsXHJcbiAgICAnT1RyYW5zaXRpb24nICAgICAgOidvVHJhbnNpdGlvbkVuZCcsXHJcbiAgICAndHJhbnNpdGlvbicgICAgICAgOid0cmFuc2l0aW9uRW5kJ1xyXG4gIH1cclxuXHJcbiAgZm9yKHQgaW4gdHJhbnNpdGlvbnMpe1xyXG4gICAgaWYoIGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQgKXtcclxuICAgICAgY29uc29sZS5sb2coIHRyYW5zaXRpb25zW3RdICk7XHJcbiAgICAgIHJldHVybiB0cmFuc2l0aW9uc1t0XTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB3aGljaFRyYW5zaXRpb25FdmVudDsiLCJyZXF1aXJlKCAnLi9hcHAuanMnICk7IiwibGV0IGNoZWNrQ2FudmFzU3VwcG9ydCA9IHJlcXVpcmUoICcuL2NoZWNrQ2FudmFzU3VwcG9ydC5qcycgKTtcclxubGV0IGNMaWdodG5pbmcgPSByZXF1aXJlKCAnLi9jYW52YXNEZW1vLmpzJyApLnN0YXJ0TGlnaHRuaW5nQW5pbWF0aW9uO1xyXG5sZXQgY29udGVudFNWR0hpZ2hsaWdodCA9IHJlcXVpcmUoICcuL2NvbnRlbnRTVkdIaWdobGlnaHQuanMnICkuY29udGVudFNWR0hpZ2hsaWdodDsgXHJcbmxldCBkZXRlY3RUcmFuc2l0aW9uRW5kID0gcmVxdWlyZSggJy4vZGV0ZWN0VHJhbnNpdGlvbkVuZEV2ZW50Q29tcGF0LmpzJyk7IFxyXG5sZXQgdHJhbnNFbmRFdmVudCA9IGRldGVjdFRyYW5zaXRpb25FbmQoKTtcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2l2ZW4gYXJyYXkgb2YgalF1ZXJ5IERPTSBlbGVtZW50cyB0aGUgZk4gaXRlcmF0ZXMgb3ZlciBlYWNoXHJcbiAqIG1lbWJlciwgbWVhc3VyZXMgaXQncyBoZWlnaHQsIGxvZ3MgdGhlIGhlaWdodCBhcyBhIG51bWJlciBhbmQgYXR0YWNoZXNcclxuICogYXMgYSBjdXN0b20gZWxlbWVudC4gVGhlIGZOIHRoZW4gYXBwbGllcyBhIGhlaWdodCBvZiAwIHZpYSBpbmxpbmVcclxuICogc3R5bGluZyBhbmQgYWRkcyB0aGUgXCJ0cmFuc2l0aW9uZXJcIiBjbGFzcy5cclxuICogQHBhcmFtIHtqUXVlcnl9IGFyciAtIHRoZSBhcnJheSBvZiBET00gZWxlbWVudHMgdG8gbWVhc3VyZS5cclxuICovXHJcbmZ1bmN0aW9uIG1lYXN1cmVFbHMoIGFyciApIHtcclxuXHQvKipcclxuXHQqIFRoZSBsZW5ndGggb2YgdGhlIGFycmF5XHJcblx0KiBAdHlwZSB7bnVtYmVyfVxyXG5cdCogQG1lbWJlcm9mIG1lYXN1cmVFbHNcclxuXHQqL1xyXG5cdGFyckxlbiA9IGFyci5sZW5ndGg7XHJcblx0Zm9yKCBsZXQgaSA9IGFyckxlbiAtIDE7IGkgPj0gMDsgaS0tICkge1xyXG5cdFx0LyoqXHJcblx0XHQqIFRoZSBjdXJyZW50IGl0ZXJhdGVlXHJcblx0XHQqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuXHRcdCogQG1lbWJlcm9mIG1lYXN1cmVFbHNcclxuXHRcdCogQGlubmVyXHJcblx0XHQqL1xyXG5cdFx0bGV0IGN1cnJFbCA9ICQoIGFyclsgaSBdICk7XHJcblx0XHRjdXJyRWxcclxuXHRcdFx0LmF0dHIoICdkYXRhLW9wZW4taGVpZ2h0JywgY3VyckVsLmlubmVySGVpZ2h0KCkgKVxyXG5cdFx0XHQuY3NzKCB7XHJcblx0XHRcdFx0J2hlaWdodCc6ICAwLFxyXG5cdFx0XHR9IClcclxuXHRcdFx0LmFkZENsYXNzKCAndHJhbnNpdGlvbmVyJyApO1xyXG5cdH1cclxufVxyXG5cclxuJCggZG9jdW1lbnQgKS5yZWFkeSggKCk9PiB7XHJcblxyXG5sZXQgJHJldmVhbEVscyA9ICQoICdbIGRhdGEtcmV2ZWFsLXRhcmdldCBdJyApO1xyXG5tZWFzdXJlRWxzKCAkcmV2ZWFsRWxzICk7XHJcblxyXG4kKCAnWyBkYXRhLXJldmVhbC10cmlnZ2VyIF0nICkuY2xpY2soIGZ1bmN0aW9uKCBlICl7XHJcblx0LyoqXHJcblx0KiBUaGUgY2xpY2tlZCBlbGVtZW50XHJcblx0KiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcblx0KiBAaW5uZXJcclxuXHQqL1xyXG5cdCR0aGlzID0gJCggdGhpcyApO1xyXG5cdC8qKlxyXG5cdCogVGhlIGVsZW1lbnQgbGlua2VkIHRvIHRoZSBjbGlja2VkIGVsZW1lbnQgYnkgY3VzdG9tIGRhdGEgYXR0cmlidXRlcyBcclxuXHQqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuXHQqIEBpbm5lclxyXG5cdCovXHJcblx0JGxpbmtlZEVsID0gJCggYFsgZGF0YS1yZXZlYWwtdGFyZ2V0PVwiJHskdGhpcy5hdHRyKCAnZGF0YS1yZXZlYWwtdHJpZ2dlcicgKX1cIiBdYCApO1xyXG5cdC8qKlxyXG5cdCogVGhlIGhlaWdodCBvZiB0aGUgbGlua2VkIGVsZW1lbnQgIGluIGl0J3MgbWF4aW11bSBvcGVuIHN0YXRlIFxyXG5cdCogQHR5cGUge251bWJlcn1cclxuXHQqIEBpbm5lclxyXG5cdCovXHJcblx0bGV0IHRoaXNIZWlnaHQgPSBgJHskbGlua2VkRWwuYXR0ciggJ2RhdGEtb3Blbi1oZWlnaHQnICl9cHhgO1xyXG5cclxuXHRpZiAoICRsaW5rZWRFbC5oYXNDbGFzcyggJ2lzLWFjdGl2ZScgKSApIHtcclxuXHRcdCRsaW5rZWRFbFxyXG5cdFx0XHQuY3NzKCB7ICdoZWlnaHQnOiAgMCB9IClcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdFx0JHRoaXMucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcblx0fSBlbHNlIHtcclxuXHRcdCRsaW5rZWRFbFxyXG5cdFx0XHQuY3NzKCB7ICdoZWlnaHQnOiAgdGhpc0hlaWdodCB9IClcclxuXHRcdFx0LmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cclxuXHRcdCR0aGlzLmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdH1cclxuIFxyXG59ICk7XHJcblxyXG59KTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0aWYgKCAkKCAnLnRvYycgKS5sZW5ndGggPiAwICkge1xyXG5cdFx0Y29udGVudFNWR0hpZ2hsaWdodCgpO1xyXG5cdH1cclxuXHRcclxuXHRpZiggY2hlY2tDYW52YXNTdXBwb3J0KCkgKXtcclxuXHRcdGlmICggJCggJyNjYW52YXMnICkubGVuZ3RoID4gMCApIHtcclxuXHRcdFx0Y0xpZ2h0bmluZyggJyNjYW52YXMnLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2NhbnZhcycgKS5wYXJlbnRFbGVtZW50ICk7XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG59OyIsIlxyXG4vKipcclxuKiBNZWFzdXJlcyB0aGUgdGFyZ2V0IERPTSBlbGVtZW50IGRpbWVuc2lvbnMuIERvbSBlbGVtZW50cyByZXF1aXJlIG5vZGUuY2xpZW50V2lkdGgvSGVpZ2h0LlxyXG4qIHRoZSBnbG9iYWwud2luZG93IG9iamVjdCByZXF1aXJlcyBub2RlLmlubmVyV2lkdGgvSGVpZ2h0XHJcbiogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBET00gbm9kZSBvciBlbGVtZW50IHRvIG1lYXN1cmUuXHJcbiogQHJldHVybnMge0RpbWVuc2lvbnN9IHRoZSBkaW1lbnNpb25zIG9mIHRoZSBlbGVtZW50XHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXREaW1lbnNpb25zKCBlbCApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdzogZWwuaW5uZXJXaWR0aCB8fCBlbC5jbGllbnRXaWR0aCxcclxuICAgICAgICBoOiBlbC5pbm5lckhlaWdodCB8fCBlbC5jbGllbnRIZWlnaHRcclxuICAgIH07XHJcbn1cclxuXHJcbi8qKlxyXG4qIE1lYXN1cmVzIHRoZSB0YXJnZXQgRE9NIGVsZW1lbnQgYW5kIGFwcGxpZXMgd2lkdGgvaGVpZ2h0XHJcbiogdG8gc2VsZWN0ZWQgZWxlbWVudCBcImVsXCIuXHJcbiogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBEb20gbm9kZSBwb2ludGluZyB0byBlbGVtZW50IHRvIHRyYW5zZm9ybSBzaXplLlxyXG4qIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldCAtIERvbSBub2RlIHBvaW50aW5nIHRvIGNvbnRhaW5lciBlbGVtZW50IHRvIG1hdGNoIGRpbWVuc2lvbnMuXHJcbiogQHBhcmFtIHtEaW1lbnNpb25zfSBvcHRpb25zIC0gb3B0aW9uYWwgcGFyYW1ldGVyIG9iamVjdCB3aXRoIG1lbWJlcnMgXCJ3XCIgYW5kIFwiaFwiXHJcbipyZXByZXNlbnRpbmcgd2lkdGggYW5kIGhlaWdodCBmb3Igc2V0dGluZyBkZWZhdWx0IG9yIG1pbmltdW0gdmFsdWVzIGlmIG5vdCBtZXQgYnkgXCJ0YXJnZXRcIi5cclxuKiBAcmV0dXJucyB7dm9pZH1cclxuKi9cclxuXHJcbmZ1bmN0aW9uIG1hdGNoRGltZW50aW9ucyggZWwsIHRhcmdldCwgb3B0aW9ucyA9IHsgdzogNTAwLCBoOiA1MDAgfSApIHtcclxuICAgIGxldCB0ID0gZ2V0RGltZW5zaW9ucyggdGFyZ2V0ICk7XHJcbiAgICBlbC53aWR0aCA9IHQudyA8IG9wdGlvbnMudyA/IG9wdGlvbnMudyA6IHQudztcclxuICAgIGVsLmhlaWdodCA9IHQuaCA8IG9wdGlvbnMuaCA/IG9wdGlvbnMuaCA6IHQuaDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaERpbWVudGlvbnM7IiwiY29uc3QgbGluZWFyRWFzZSA9IHJlcXVpcmUoICcuL2Vhc2luZy9saW5lYXJFYXNlLmpzJyApO1xyXG5jb25zdCBlYXNlSW5RdWFkID0gcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJblF1YWQuanMnICk7XHJcbmNvbnN0IGVhc2VPdXRRdWFkID0gcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VPdXRRdWFkLmpzJyApO1xyXG5jb25zdCBlYXNlSW5PdXRRdWFkID0gcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbk91dFF1YWQuanMnICk7XHJcbmNvbnN0IGVhc2VJbkN1YmljID0gcmVxdWlyZSggJy4vZWFzaW5nL2Vhc2VJbkN1YmljLmpzJyApO1xyXG4vLyByZXF1aXJlcyBkZWZpbml0aW9uIGluLWZpbGUgdG8gdGFrZSBhZHZhbnRhZ2Ugb2YgXCJAY2FsbGJhY2tcIiByZXVzYWJpbGl0eVxyXG4vLyBiaXQgb2YgYSBoYWNrIGJ1dCB1c2VmdWwgaW4gdGhpcyBzcGVjaWZpYyBleGFtcGxlIHdoZXJlIG11bHRpcGxlIGZ1bmN0aW9ucyBoYXZlIHRoZSBzYW1lIHNpZ25hdHVyZVxyXG5cclxuLyoqXHJcbiogQmFzZSBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2luZyBtZXRob2RzLlxyXG57Y3VycmVudEl0ZXJhdGlvbn0gLSB0aGUgY3VycmVudCBjbG9jayBvciBpdGVyYXRpb24gY3ljbGVcclxue3N0YXJ0VmFsdWV9IC0gVGhlIHZhbHVlIHRvIEVBU0UgZnJvbVxyXG57Y2hhbmdlSW5WYWx1ZX0gLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZVxyXG57dG90YWxJdGVyYXRpb25zfSAtVGhlIHRvdGFsIGN5Y2xlcyBvciBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlXHJcbntyZXR1cm5zfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBmcm9tIHRoZSB7c3RhcnRWYWx1ZX1cclxuKiBAY2FsbGJhY2sgZWFzaW5nRm5cclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiovXHJcblxyXG4vKipcclxuKiBCYXNlIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzaW5nIG1ldGhvZHMuXHJcbntjdXJyZW50SXRlcmF0aW9ufSAtIHRoZSBjdXJyZW50IGNsb2NrIG9yIGl0ZXJhdGlvbiBjeWNsZVxyXG57c3RhcnRWYWx1ZX0gLSBUaGUgdmFsdWUgdG8gRUFTRSBmcm9tXHJcbntjaGFuZ2VJblZhbHVlfSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlXHJcbnt0b3RhbEl0ZXJhdGlvbnN9IC1UaGUgdG90YWwgY3ljbGVzIG9yIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGVcclxue292ZXJzaG9vdH0gLSBhIHJhdGlvIG9mIHRoZSB7c3RhcnRWYWx1ZX0gYW5kIHtjaGFuZ2VJblZhbHVlfSB0byBnaXZlIHRoZSBlZmZlY3Qgb2YgXCJvdmVyc2hvb3RpbmdcIiB0aGUgaW5pdGlhbCB7c3RhcnRWYWx1ZX0gKGVhc2VJbiopLCBcIm92ZXJzaG9vdGluZ1wiIGZpbmFsIHZhbHVlIHtzdGFydFZhbHVlICsgY2hhbmdlSW5WYWx1ZX0gKGVhc2VPdXQqKSBvciBib3RoIChlYXNlSW5PdXQqKS5cclxue3JldHVybnN9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGZyb20gdGhlIHtzdGFydFZhbHVlfVxyXG4qIEBjYWxsYmFjayBlYXNpbmdGbkV4dGVuZGVkXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gW292ZXJzaG9vdD0xLjcwMTU4XSAtIGEgcmF0aW8gb2YgdGhlIHtzdGFydFZhbHVlfSBhbmQge2NoYW5nZUluVmFsdWV9IHRvIGdpdmUgdGhlIGVmZmVjdCBvZiBcIm92ZXJzaG9vdGluZ1wiIHRoZSBpbml0aWFsIHtzdGFydFZhbHVlfSAoZWFzZUluKiksIFwib3ZlcnNob290aW5nXCIgZmluYWwgdmFsdWUge3N0YXJ0VmFsdWUgKyBjaGFuZ2VJblZhbHVlfSAoZWFzZU91dCopIG9yIGJvdGggKGVhc2VJbk91dCopLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiovXHJcblxyXG4vKlxyXG5cdCogVGhpcyBpcyBhIG5lYXItZGlyZWN0IHBvcnQgb2YgUm9iZXJ0IFBlbm5lcidzIGVhc2luZyBlcXVhdGlvbnMuIFBsZWFzZSBzaG93ZXIgUm9iZXJ0IHdpdGhcclxuXHQqIHByYWlzZSBhbmQgYWxsIG9mIHlvdXIgYWRtaXJhdGlvbi4gSGlzIGxpY2Vuc2UgaXMgcHJvdmlkZWQgYmVsb3cuXHJcblx0KlxyXG5cdCogRm9yIGluZm9ybWF0aW9uIG9uIGhvdyB0byB1c2UgdGhlc2UgZnVuY3Rpb25zIGluIHlvdXIgYW5pbWF0aW9ucywgY2hlY2sgb3V0IG15IGZvbGxvd2luZyB0dXRvcmlhbDogXHJcblx0KiBodHRwOi8vYml0Lmx5LzE4aUhIS3FcclxuXHQqXHJcblx0KiAtS2lydXBhXHJcblx0Ki9cclxuXHJcblx0LypcclxuXHQqIEBhdXRob3IgUm9iZXJ0IFBlbm5lclxyXG5cdCogQGxpY2Vuc2UgXHJcblx0KiBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXHJcblx0KiBcclxuXHQqIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS4gXHJcblx0KiBcclxuXHQqIENvcHlyaWdodCDCqSAyMDAxIFJvYmVydCBQZW5uZXJcclxuXHQqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcblx0KiBcclxuXHQqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIFxyXG5cdCogYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxyXG5cdCogXHJcblx0KiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXMgbGlzdCBvZiBcclxuXHQqIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cclxuXHQqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IFxyXG5cdCogb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgXHJcblx0KiBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXHJcblx0KiBcclxuXHQqIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGF1dGhvciBub3IgdGhlIG5hbWVzIG9mIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIFxyXG5cdCogb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cclxuXHQqIFxyXG5cdCogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBcclxuXHQqIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRlxyXG5cdCogTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcblx0KiBDT1BZUklHSFQgT1dORVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXHJcblx0KiBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEVcclxuXHQqIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBcclxuXHQqIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXHJcblx0KiBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBcclxuXHQqIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gXHJcblx0KlxyXG4qL1xyXG5cclxuLyoqXHJcbiogUHJvdmlkZXMgZWFzaW5nIGNhbGN1bGF0aW9uIG1ldGhvZHMuXHJcbiogQG5hbWUgZWFzaW5nRXF1YXRpb25zXHJcbiogQGRlc2NyaXB0aW9uIHtAbGluayBodHRwczovL2Vhc2luZ3MubmV0L2VufFNlZSB0aGUgRWFzaW5nIGNoZWF0IHNoZWV0fSBmb3IgYSB2aXN1YWwgcmVwcmVzZW50YXRpb24gZm9yIGVhY2ggY3VydmUgZm9ybXVsYS4gT3JpZ2luYWxseSBkZXZlbG9wZWQgYnkge0BsaW5rIGh0dHA6Ly9yb2JlcnRwZW5uZXIuY29tL2Vhc2luZy98Um9iZXJ0IFBlbm5lcn1cclxuKi9cclxudmFyIGVhc2luZ0VxdWF0aW9ucyA9IHtcclxuXHRsaW5lYXJFYXNlOiBsaW5lYXJFYXNlLFxyXG5cdGVhc2VJblF1YWQ6IGVhc2VJblF1YWQsXHJcblx0ZWFzZU91dFF1YWQ6IGVhc2VPdXRRdWFkLFxyXG5cdGVhc2VJbk91dFF1YWQ6IGVhc2VJbk91dFF1YWQsXHJcblx0ZWFzZUluQ3ViaWM6IGVhc2VJbkN1YmljLFxyXG5cdFxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbn1cclxuIFx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlT3V0Q3ViaWMnIGN1cnZlXHJcbiBcdCogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gXHQqL1xyXG5cdGVhc2VPdXRDdWJpYzogZnVuY3Rpb24oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgMykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHQvKipcclxuXHQqIEBtZXRob2RcclxuIFx0KiBAdHlwZSB7ZWFzaW5nRm59XHJcbiBcdCogQGRlc2NyaXB0aW9uIGVhc2luZyBtZXRob2QgZm9yIHRoZSAnZWFzZUluT3V0Q3ViaWMnIGN1cnZlXHJcbiBcdCogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gXHQqL1xyXG5cdGVhc2VJbk91dEN1YmljOiBmdW5jdGlvbihjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgMykgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCAzKSArIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbn1cclxuIFx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlSW5RdWFydCcgY3VydmVcclxuIFx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiBcdCovXHJcblx0ZWFzZUluUXVhcnQ6IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCA0KSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHQvKipcclxuXHQqIEBtZXRob2RcclxuIFx0KiBAdHlwZSB7ZWFzaW5nRm59XHJcbiBcdCogQGRlc2NyaXB0aW9uIGVhc2luZyBtZXRob2QgZm9yIHRoZSAnZWFzZU91dFF1YXJ0JyBjdXJ2ZVxyXG4gXHQqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuIFx0Ki9cclxuXHRlYXNlT3V0UXVhcnQ6IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCA0KSAtIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbn1cclxuIFx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlSW5PdXRRdWFydCcgY3VydmVcclxuIFx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiBcdCovXHJcblx0ZWFzZUluT3V0UXVhcnQ6IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCA0KSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCA0KSAtIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbn1cclxuIFx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlSW5RdWludCcgY3VydmVcclxuIFx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiBcdCovXHJcblx0ZWFzZUluUXVpbnQ6IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCA1KSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbWV0aG9kXHJcbiBcdCogQHR5cGUge2Vhc2luZ0ZufVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VPdXRRdWludCcgY3VydmVcclxuIFx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiBcdCovXHJcblx0ZWFzZU91dFF1aW50OiBmdW5jdGlvbihjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCA1KSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cdFxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbn1cclxuIFx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlSW5PdXRRdWludCcgY3VydmVcclxuIFx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiBcdCovXHJcblx0ZWFzZUluT3V0UXVpbnQ6IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCA1KSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDUpICsgMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblx0XHJcblx0LyoqXHJcblx0KiBAbWV0aG9kXHJcbiBcdCogQHR5cGUge2Vhc2luZ0ZufVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VJblNpbmUnIGN1cnZlXHJcbiBcdCogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gXHQqL1xyXG5cdGVhc2VJblNpbmU6IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoMSAtIE1hdGguY29zKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKiAoTWF0aC5QSSAvIDIpKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblx0XHJcblx0LyoqXHJcblx0KiBAbWV0aG9kXHJcbiBcdCogQHR5cGUge2Vhc2luZ0ZufVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VPdXRTaW5lJyBjdXJ2ZVxyXG4gXHQqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuIFx0Ki9cclxuXHRlYXNlT3V0U2luZTogZnVuY3Rpb24oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGguc2luKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKiAoTWF0aC5QSSAvIDIpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHRcclxuXHQvKipcclxuXHQqIEBtZXRob2RcclxuIFx0KiBAdHlwZSB7ZWFzaW5nRm59XHJcbiBcdCogQGRlc2NyaXB0aW9uIGVhc2luZyBtZXRob2QgZm9yIHRoZSAnZWFzZUluT3V0U2luZScgY3VydmVcclxuIFx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiBcdCovXHJcblx0ZWFzZUluT3V0U2luZTogZnVuY3Rpb24oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoMSAtIE1hdGguY29zKE1hdGguUEkgKiBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblx0XHJcblx0LyoqXHJcblx0KiBAbWV0aG9kXHJcbiBcdCogQHR5cGUge2Vhc2luZ0ZufVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VJbkV4cG8nIGN1cnZlXHJcbiBcdCogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gXHQqL1xyXG5cdGVhc2VJbkV4cG86IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdygyLCAxMCAqIChjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSkpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cdFxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbn1cclxuIFx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlT3V0RXhwbycgY3VydmVcclxuIFx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiBcdCovXHJcblx0ZWFzZU91dEV4cG86IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoLU1hdGgucG93KDIsIC0xMCAqIGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMpICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbn1cclxuIFx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlSW5PdXRFeHBvJyBjdXJ2ZVxyXG4gXHQqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuIFx0Ki9cclxuXHRlYXNlSW5PdXRFeHBvOiBmdW5jdGlvbihjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAtIDEpKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tY3VycmVudEl0ZXJhdGlvbikgKyAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbWV0aG9kXHJcbiBcdCogQHR5cGUge2Vhc2luZ0ZufVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VJbkNpcmMnIGN1cnZlXHJcbiBcdCogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gXHQqL1xyXG5cdGVhc2VJbkNpcmM6IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoMSAtIE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbWV0aG9kXHJcbiBcdCogQHR5cGUge2Vhc2luZ0ZufVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VPdXRDaXJjJyBjdXJ2ZVxyXG4gXHQqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuIFx0Ki9cclxuXHRlYXNlT3V0Q2lyYzogZnVuY3Rpb24oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGguc3FydCgxIC0gKGN1cnJlbnRJdGVyYXRpb24gPSBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSkgKiBjdXJyZW50SXRlcmF0aW9uKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbWV0aG9kXHJcbiBcdCogQHR5cGUge2Vhc2luZ0ZufVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VJbk91dENpcmMnIGN1cnZlXHJcbiBcdCogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gXHQqL1xyXG5cdGVhc2VJbk91dENpcmM6IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoMSAtIE1hdGguc3FydCgxIC0gY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiAtPSAyKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbn1cclxuIFx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlSW5FbGFzdGljJyBjdXJ2ZVxyXG4gXHQqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuIFx0Ki9cclxuXHRlYXNlSW5FbGFzdGljOiBmdW5jdGlvbihjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHZhciBzID0gMS43MDE1ODtcclxuXHRcdHZhciBwID0gMDtcclxuXHRcdHZhciBhID0gY2hhbmdlSW5WYWx1ZTtcclxuXHRcdGlmIChjdXJyZW50SXRlcmF0aW9uID09IDApIHJldHVybiBzdGFydFZhbHVlO1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgPT0gMSkgcmV0dXJuIHN0YXJ0VmFsdWUgKyBjaGFuZ2VJblZhbHVlO1xyXG5cdFx0aWYgKCFwKSBwID0gdG90YWxJdGVyYXRpb25zICogLjM7XHJcblx0XHRpZiAoYSA8IE1hdGguYWJzKGNoYW5nZUluVmFsdWUpKSB7XHJcblx0XHRcdGEgPSBjaGFuZ2VJblZhbHVlO1xyXG5cdFx0XHR2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjaGFuZ2VJblZhbHVlIC8gYSlcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gLShhICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAtPSAxKSkgKiBNYXRoLnNpbigoY3VycmVudEl0ZXJhdGlvbiAqIHRvdGFsSXRlcmF0aW9ucyAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbWV0aG9kXHJcbiBcdCogQHR5cGUge2Vhc2luZ0ZufVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VPdXRFbGFzdGljJyBjdXJ2ZVxyXG4gXHQqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuIFx0Ki9cclxuXHRlYXNlT3V0RWxhc3RpYzogZnVuY3Rpb24odCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCkgPT0gMSkgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAuMztcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogdCkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSArIGMgKyBiO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbn1cclxuIFx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlSW5PdXRFbGFzdGljJyBjdXJ2ZVxyXG4gXHQqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuIFx0Ki9cclxuXHRlYXNlSW5PdXRFbGFzdGljOiBmdW5jdGlvbih0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcyA9IDEuNzAxNTg7dmFyIHAgPSAwO3ZhciBhID0gYztcclxuXHRcdGlmICh0ID09IDApIHJldHVybiBiO2lmICgodCAvPSBkIC8gMikgPT0gMikgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAoLjMgKiAxLjUpO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkge1xyXG5cdFx0XHRhID0gYzt2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oYyAvIGEpO1xyXG5cdFx0aWYgKHQgPCAxKSByZXR1cm4gLS41ICogKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIGI7XHJcblx0XHRyZXR1cm4gYSAqIE1hdGgucG93KDIsIC0xMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICogLjUgKyBjICsgYjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQqIEBtZXRob2RcclxuXHQqIEB0eXBlIHtlYXNpbmdGbkV4dGVuZGVkfVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VJbkJhY2snIGN1cnZlXHJcblx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiBcdCovXHJcblx0ZWFzZUluQmFjazogZnVuY3Rpb24odCwgYiwgYywgZCwgcykge1xyXG5cdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcclxuXHRcdHJldHVybiBjICogKHQgLz0gZCkgKiB0ICogKChzICsgMSkgKiB0IC0gcykgKyBiO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbkV4dGVuZGVkfVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VPdXRRdWludCcgY3VydmVcclxuIFx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiBcdCovXHJcblx0ZWFzZU91dEJhY2s6IGZ1bmN0aW9uIGVhc2VPdXRCYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyAqICgodCA9IHQgLyBkIC0gMSkgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAxKSArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0QmFjazogZnVuY3Rpb24gZWFzZUluT3V0QmFjayh0LCBiLCBjLCBkLCBzKSB7XHJcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0aWYgKCh0IC89IGQgLyAyKSA8IDEpIHJldHVybiBjIC8gMiAqICh0ICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0IC0gcykpICsgYjtcclxuXHRcdHJldHVybiBjIC8gMiAqICgodCAtPSAyKSAqIHQgKiAoKChzICo9IDEuNTI1KSArIDEpICogdCArIHMpICsgMikgKyBiO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCogQG1ldGhvZFxyXG4gXHQqIEB0eXBlIHtlYXNpbmdGbn1cclxuIFx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlT3V0Qm91bmNlJyBjdXJ2ZVxyXG4gXHQqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuIFx0Ki9cclxuXHRlYXNlT3V0Qm91bmNlOiBmdW5jdGlvbih0LCBiLCBjLCBkKSB7XHJcblx0XHRpZiAoKHQgLz0gZCkgPCAxIC8gMi43NSkge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiB0ICogdCkgKyBiO1xyXG5cdFx0fSBlbHNlIGlmICh0IDwgMiAvIDIuNzUpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMS41IC8gMi43NSkgKiB0ICsgLjc1KSArIGI7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAyLjUgLyAyLjc1KSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqICh0IC09IDIuMjUgLyAyLjc1KSAqIHQgKyAuOTM3NSkgKyBiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMi42MjUgLyAyLjc1KSAqIHQgKyAuOTg0Mzc1KSArIGI7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0KiBAbWV0aG9kXHJcblx0KiBAdHlwZSB7ZWFzaW5nRm59XHJcblx0KiBAZGVzY3JpcHRpb24gZWFzaW5nIG1ldGhvZCBmb3IgdGhlICdlYXNlSW5Cb3VuY2UnIGN1cnZlXHJcblx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcblx0Ki9cclxuXHRlYXNlSW5Cb3VuY2U6IGZ1bmN0aW9uKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLSBzZWxmLmVhc2VPdXRCb3VuY2UodG90YWxJdGVyYXRpb25zIC0gY3VycmVudEl0ZXJhdGlvbiwgMCwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSArIHN0YXJ0VmFsdWU7XHJcblx0fVxyXG5cdFxyXG5cclxufTtcclxuXHJcbi8vIC8qKlxyXG4vLyAqIEBtZXRob2RcclxuLy8gKiBAdHlwZSB7ZWFzaW5nRm59XHJcbi8vICogQGRlc2NyaXB0aW9uIGVhc2luZyBtZXRob2QgZm9yIHRoZSAnZWFzZUluQm91bmNlJyBjdXJ2ZVxyXG4vLyAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuLy8gKi9cclxuLy8gZWFzaW5nRXF1YXRpb25zLmVhc2VJbkJvdW5jZSA9IGZ1bmN0aW9uIChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuLy8gXHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAtIGVhc2luZ0VxdWF0aW9ucy5lYXNlT3V0Qm91bmNlKHRvdGFsSXRlcmF0aW9ucyAtIGN1cnJlbnRJdGVyYXRpb24sIDAsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykgKyBzdGFydFZhbHVlO1xyXG4vLyB9O1xyXG5cclxuLyoqXHJcblx0KiBAbWV0aG9kXHJcbiBcdCogQHR5cGUge2Vhc2luZ0ZufVxyXG4gXHQqIEBkZXNjcmlwdGlvbiBlYXNpbmcgbWV0aG9kIGZvciB0aGUgJ2Vhc2VPdXRRdWludCcgY3VydmVcclxuIFx0KiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiBcdCovXHJcbmVhc2luZ0VxdWF0aW9ucy5lYXNlSW5PdXRCb3VuY2UgPSBmdW5jdGlvbiAoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0aWYgKGN1cnJlbnRJdGVyYXRpb24gPCB0b3RhbEl0ZXJhdGlvbnMgLyAyKSByZXR1cm4gZWFzaW5nRXF1YXRpb25zLmVhc2VJbkJvdW5jZShjdXJyZW50SXRlcmF0aW9uICogMiwgMCwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSAqIC41ICsgc3RhcnRWYWx1ZTtcclxuXHRyZXR1cm4gZWFzaW5nRXF1YXRpb25zLmVhc2VPdXRCb3VuY2UoY3VycmVudEl0ZXJhdGlvbiAqIDIgLSB0b3RhbEl0ZXJhdGlvbnMsIDAsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykgKiAuNSArIGNoYW5nZUluVmFsdWUgKiAuNSArIHN0YXJ0VmFsdWU7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5lYXNpbmdFcXVhdGlvbnMgPSBlYXNpbmdFcXVhdGlvbnM7IiwiLyoqXHJcbiogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluQ3ViaWMuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAodW50aWwge2N1cnJlbnRJdGVyYXRpb259IGVxdWFscyB7dG90YWxpdGVyYXRpb25zfSkgb3RoZXJ3aXNlIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSBtdWx0aXBsaWVkIGV4cG9uZW50aWFsbHkgIFxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uL2N5Y2xlIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZSBjYWxjdWxhdGVkIGZyb20gdGhlIHtzdGFydFZhbHVlfSB0byB0aGUgZmluYWwgdmFsdWUgKHtzdGFydFZhbHVlfSArIHtjaGFuZ2VJblZhbHVlfSkuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBlYXNlSW5DdWJpYyhcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgMykgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VJbkN1YmljOyIsIi8qKlxyXG4qIEBzdW1tYXJ5IGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZUluT3V0UXVhZC4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh3aGVyZSB7Y3VycmVudEl0ZXJhdGlvbiBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5ICBcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gZWFzZUluT3V0UXVhZChcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuICAgICAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBjdXJyZW50SXRlcmF0aW9uICogY3VycmVudEl0ZXJhdGlvbiArIHN0YXJ0VmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKC0tY3VycmVudEl0ZXJhdGlvbiAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgLSAxKSArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWFzZUluT3V0UXVhZDsiLCIvKipcclxuKiBAc3VtbWFyeSBmdW5jdGlvbiBzaWduYXR1cmUgZm9yIGVhc2VJblF1YWQuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAod2hlcmUge2N1cnJlbnRJdGVyYXRpb24gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseSAgXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VJblF1YWQoXHJcbiAgICBjdXJyZW50SXRlcmF0aW9uLFxyXG4gICAgc3RhcnRWYWx1ZSxcclxuICAgIGNoYW5nZUluVmFsdWUsXHJcbiAgICB0b3RhbEl0ZXJhdGlvbnNcclxuKSB7XHJcbiAgICByZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiBjdXJyZW50SXRlcmF0aW9uICsgc3RhcnRWYWx1ZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBlYXNlSW5RdWFkOyIsIi8qKlxyXG4qIEBzdW1tYXJ5IGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgZWFzZU91dFF1YWQuIE5vdGUgdGhlIHtzdGFydFZhbHVlfSBzaG91bGQgbm90IGNoYW5nZSBmb3IgdGhlIGZ1bmN0aW9uIGxpZmVjeWNsZSAod2hlcmUge2N1cnJlbnRJdGVyYXRpb24gZXF1YWxzIHt0b3RhbGl0ZXJhdGlvbnN9KSBvdGhlcndpc2UgdGhlIHJldHVybiB2YWx1ZSB3aWxsIGJlIG11bHRpcGxpZWQgZXhwb25lbnRpYWxseSAgXHJcbiogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24vY3ljbGUgYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlIGNhbGN1bGF0ZWQgZnJvbSB0aGUge3N0YXJ0VmFsdWV9IHRvIHRoZSBmaW5hbCB2YWx1ZSAoe3N0YXJ0VmFsdWV9ICsge2NoYW5nZUluVmFsdWV9KS5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGVhc2VPdXRRdWFkKFxyXG4gICAgY3VycmVudEl0ZXJhdGlvbixcclxuICAgIHN0YXJ0VmFsdWUsXHJcbiAgICBjaGFuZ2VJblZhbHVlLFxyXG4gICAgdG90YWxJdGVyYXRpb25zXHJcbikge1xyXG4gICAgcmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgKyBzdGFydFZhbHVlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhc2VPdXRRdWFkOyIsIi8qKlxyXG4qIEBzdW1tYXJ5IGZ1bmN0aW9uIHNpZ25hdHVyZSBmb3IgbGluZWFyRWFzZS4gTm90ZSB0aGUge3N0YXJ0VmFsdWV9IHNob3VsZCBub3QgY2hhbmdlIGZvciB0aGUgZnVuY3Rpb24gbGlmZWN5Y2xlICh3aGVyZSB7Y3VycmVudEl0ZXJhdGlvbiBlcXVhbHMge3RvdGFsaXRlcmF0aW9uc30pIG90aGVyd2lzZSB0aGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgbXVsdGlwbGllZCBleHBvbmVudGlhbGx5ICBcclxuKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbi9jeWNsZSBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4qIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmUgY2FsY3VsYXRlZCBmcm9tIHRoZSB7c3RhcnRWYWx1ZX0gdG8gdGhlIGZpbmFsIHZhbHVlICh7c3RhcnRWYWx1ZX0gKyB7Y2hhbmdlSW5WYWx1ZX0pLlxyXG4qL1xyXG5cclxuZnVuY3Rpb24gbGluZWFyRWFzZShcclxuICAgIGN1cnJlbnRJdGVyYXRpb24sXHJcbiAgICBzdGFydFZhbHVlLFxyXG4gICAgY2hhbmdlSW5WYWx1ZSxcclxuICAgIHRvdGFsSXRlcmF0aW9uc1xyXG4pIHtcclxuICAgIHJldHVybiBjaGFuZ2VJblZhbHVlICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyArIHN0YXJ0VmFsdWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGluZWFyRWFzZTsiLCIvKipcclxuKiBwcm92aWRlcyBtYXRocyB1dGlsaWxpdHkgbWV0aG9kcyBhbmQgaGVscGVycy5cclxuKlxyXG4qIEBtb2R1bGUgbWF0aFV0aWxzXHJcbiovXHJcblxyXG52YXIgbWF0aFV0aWxzID0ge1xyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2VuZXJhdGUgcmFuZG9tIGludGVnZXIgYmV0d2VlbiAyIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSBtYXhpbXVtIHZhbHVlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdHJhbmRvbUludGVnZXI6IGZ1bmN0aW9uIHJhbmRvbUludGVnZXIobWluLCBtYXgpIHtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4ICsgMSAtIG1pbikgKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIEdlbmVyYXRlIHJhbmRvbSBmbG9hdCBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tOiBmdW5jdGlvbiByYW5kb20obWluLCBtYXgpIHtcclxuXHRcdGlmIChtaW4gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtaW4gPSAwO1xyXG5cdFx0XHRtYXggPSAxO1xyXG5cdFx0fSBlbHNlIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtYXggPSBtaW47XHJcblx0XHRcdG1pbiA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdGdldFJhbmRvbUFyYml0cmFyeTogZnVuY3Rpb24gZ2V0UmFuZG9tQXJiaXRyYXJ5KG1pbiwgbWF4KSB7XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBUcmFuc2Zvcm1zIHZhbHVlIHByb3BvcnRpb25hdGVseSBiZXR3ZWVuIGlucHV0IHJhbmdlIGFuZCBvdXRwdXQgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgb3JpZ2luIHJhbmdlICggbWluMS9tYXgxICkuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4xIC0gbWluaW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgxIC0gbWF4aW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4yIC0gbWluaW11bSB2YWx1ZSBpbiBkZXN0aW5hdGlvbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heDIgLSBtYXhpbXVtIHZhbHVlIGluIGRlc3RpbmF0aW9uIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiBkZXN0aW5hdGlvbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0bWFwOiBmdW5jdGlvbiBtYXAodmFsdWUsIG1pbjEsIG1heDEsIG1pbjIsIG1heDIsIGNsYW1wUmVzdWx0KSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgcmV0dXJudmFsdWUgPSAodmFsdWUgLSBtaW4xKSAvIChtYXgxIC0gbWluMSkgKiAobWF4MiAtIG1pbjIpICsgbWluMjtcclxuXHRcdGlmIChjbGFtcFJlc3VsdCkgcmV0dXJuIHNlbGYuY2xhbXAocmV0dXJudmFsdWUsIG1pbjIsIG1heDIpO2Vsc2UgcmV0dXJuIHJldHVybnZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ2xhbXAgdmFsdWUgYmV0d2VlbiByYW5nZSB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgcmFuZ2UgeyBtaW58bWF4IH0uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlIGluIHRoZSByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUgaW4gdGhlIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqL1xyXG5cdGNsYW1wOiBmdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtcclxuXHRcdGlmIChtYXggPCBtaW4pIHtcclxuXHRcdFx0dmFyIHRlbXAgPSBtaW47XHJcblx0XHRcdG1pbiA9IG1heDtcclxuXHRcdFx0bWF4ID0gdGVtcDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGhVdGlsczsiXX0=
