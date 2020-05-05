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

},{"./matchDimentions.js":8,"./utils/easing.js":9,"./utils/mathUtils.js":10}],3:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NhbnZhc0RlbW8uanMiLCJzcmMvanMvY2hlY2tDYW52YXNTdXBwb3J0LmpzIiwic3JjL2pzL2NvbnRlbnRTVkdIaWdobGlnaHQuanMiLCJzcmMvanMvZGV0ZWN0VHJhbnNpdGlvbkVuZEV2ZW50Q29tcGF0LmpzIiwic3JjL2pzL2VudHJ5LmpzIiwic3JjL2pzL2Z1bmN0aW9ucy5qcyIsInNyYy9qcy9tYXRjaERpbWVudGlvbnMuanMiLCJzcmMvanMvdXRpbHMvZWFzaW5nLmpzIiwic3JjL2pzL3V0aWxzL21hdGhVdGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0EsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFFLGdCQUFGLENBQVAsQ0FBNEIsRUFBdkMsQyxDQUdBO0FBQ0E7QUFFQTs7O0FDUEE7QUFDQSxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUUsc0JBQUYsQ0FBekI7O0FBQ0EsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFFLG1CQUFGLENBQVAsQ0FBK0IsZUFBOUM7O0FBQ0EsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFFLHNCQUFGLENBQTdCLEMsQ0FFQTs7O0FBQ0EsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQXBCO0FBQ0EsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQXZCO0FBQ0EsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQXBCLEMsQ0FDQTs7QUFDQSxJQUFJLHFCQUFxQixHQUFHLEdBQTVCO0FBQ0EsSUFBSSxzQkFBc0IsR0FBRyxHQUE3QixDLENBRUE7O0FBQ0EsSUFBSSxjQUFjLEdBQUcsRUFBckI7QUFDQSxJQUFJLGNBQWMsR0FBRyxFQUFyQixDLENBRUE7O0FBQ0EsSUFBSSxnQkFBZ0IsR0FBRyxFQUF2QjtBQUNBLElBQUksZ0JBQWdCLEdBQUcsRUFBdkI7QUFDQSxJQUFJLGdCQUFn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RyxJQUF6QyxJQUFpRCxJQUFuRTtBQUNBLFFBQUksV0FBSixFQUFpQixPQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsV0FBWCxFQUF3QixJQUF4QixFQUE4QixJQUE5QixDQUFQLENBQWpCLEtBQWlFLE9BQU8sV0FBUDtBQUNqRSxHQTdDYzs7QUErQ2Y7Ozs7Ozs7QUFPQSxFQUFBLEtBQUssRUFBRSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCLEdBQXRCLEVBQTJCLEdBQTNCLEVBQWdDO0FBQ3RDLFFBQUksR0FBRyxHQUFHLEdBQVYsRUFBZTtBQUNkLFVBQUksSUFBSSxHQUFHLEdBQVg7QUFDQSxNQUFBLEdBQUcsR0FBRyxHQUFOO0FBQ0EsTUFBQSxHQUFHLEdBQUcsSUFBTjtBQUNBOztBQUNELFdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULEVBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULEVBQWdCLEdBQWhCLENBQWQsQ0FBUDtBQUNBO0FBN0RjLENBQWhCO0FBZ0VBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gYXBwIGZ1bmN0aW9uc1xyXG5jb25zdCBmTiA9IHJlcXVpcmUoICcuL2Z1bmN0aW9ucy5qcycgKS5mTjtcclxuXHJcblxyXG4vLyAkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpe1xyXG4vLyBcdCQoICdib2R5IG1haW4nICkuYXBwZW5kKCAnPHA+SGVsbG8gV29ybGQ8L3A+JyApO1xyXG5cclxuLy8gfSApOyIsIi8vIENhbnZhcyBMaWdodG5pbmcgdjFcclxuY29uc3QgbWF0aFV0aWxzID0gcmVxdWlyZSggJy4vdXRpbHMvbWF0aFV0aWxzLmpzJyApO1xyXG5jb25zdCBlYXNpbmcgPSByZXF1aXJlKCAnLi91dGlscy9lYXNpbmcuanMnICkuZWFzaW5nRXF1YXRpb25zO1xyXG5sZXQgbWF0Y2hEaW1lbnRpb25zID0gcmVxdWlyZSggJy4vbWF0Y2hEaW1lbnRpb25zLmpzJyApO1xyXG5cclxuLy8gbGV0IGVhc2VGbiA9IGVhc2luZy5lYXNlSW5DaXJjO1xyXG5sZXQgZWFzZUZuID0gZWFzaW5nLmxpbmVhckVhc2U7XHJcbmxldCBybmRJbnQgPSBtYXRoVXRpbHMucmFuZG9tSW50ZWdlcjtcclxubGV0IHJuZCA9IG1hdGhVdGlscy5yYW5kb207XHJcbi8vIExpZ2h0bmluZyB0cmlnZ2VyIHJhbmdlXHJcbmxldCBsaWdodG5pbmdGcmVxdWVuY3lMb3cgPSAxMDA7XHJcbmxldCBsaWdodG5pbmdGcmVxdWVuY3lIaWdoID0gMjUwO1xyXG5cclxuLy8gTGlnaHRuaW5nIHNlZ21lbnQgY291bnRcclxubGV0IGxTZWdtZW50Q291bnRMID0gMTA7XHJcbmxldCBsU2VnbWVudENvdW50SCA9IDM1O1xyXG5cclxuLy8gRGlzdGFuY2UgcmFuZ2VzIGJldHdlZW4gbGlnaHRuaW5nIHBhdGggc2VnbWVudHNcclxubGV0IGxTZWdtZW50WEJvdW5kc0wgPSAxNTtcclxubGV0IGxTZWdtZW50WEJvdW5kc0ggPSA2MDtcclxubGV0IGxTZWdtZW50WUJvdW5kc0wgPSAyNTtcclxubGV0IGxTZWdtZW50WUJvdW5kc0ggPSA1NTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gY2FudmFzTGlnaHRuaW5nKCBjYW52YXMgKXtcclxuICBcclxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5sb29wKCk7XHJcbiAgICB9OyAgICBcclxuICBcclxuICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICB0aGlzLmMgPSBjYW52YXM7XHJcbiAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCAnMmQnICk7XHJcbiAgICB0aGlzLmN3ID0gY2FudmFzLndpZHRoO1xyXG4gICAgdGhpcy5jaCA9IGNhbnZhcy5oZWlnaHQ7XHJcbiAgICB0aGlzLm14ID0gMDtcclxuICAgIHRoaXMubXkgPSAwO1xyXG5cclxuICAgIHRoaXMubGlnaHRuaW5nID0gW107XHJcbiAgICB0aGlzLmxpZ2h0VGltZUN1cnJlbnQgPSAwO1xyXG4gICAgdGhpcy5saWdodFRpbWVUb3RhbCA9IDUwO1xyXG4gIFxyXG4gICAgLy8gVXRpbGl0aWVzICAgICAgICBcclxuICAgIHRoaXMuaGl0VGVzdCA9IGZ1bmN0aW9uKCB4MSwgeTEsIHcxLCBoMSwgeDIsIHkyLCB3MiwgaDIpIHtcclxuICAgICAgICByZXR1cm4gISggeDEgKyB3MSA8IHgyIHx8IHgyICsgdzIgPCB4MSB8fCB5MSArIGgxIDwgeTIgfHwgeTIgKyBoMiA8IHkxICk7XHJcbiAgICB9O1xyXG4gICAgXHJcbi8vIENyZWF0ZSBMaWdodG5pbmdcclxuICAgIHRoaXMuY3JlYXRlTCA9IGZ1bmN0aW9uKCB4LCB5LCBjYW5TcGF3biwgaXNDaGlsZCApe1xyXG5cclxuICAgICAgICBsZXQgdGhpc0xpZ2h0bmluZyA9IHtcclxuICAgICAgICAgICAgeDogeCxcclxuICAgICAgICAgICAgeTogeSxcclxuICAgICAgICAgICAgeFJhbmdlOiBybmRJbnQoIGxTZWdtZW50WEJvdW5kc0wsIGxTZWdtZW50WEJvdW5kc0ggKSxcclxuICAgICAgICAgICAgeVJhbmdlOiBybmRJbnQoIGxTZWdtZW50WUJvdW5kc0wsIGxTZWdtZW50WUJvdW5kc0ggKSxcclxuICAgICAgICAgICAgcGF0aDogW3sgeDogeCwgeTogeSB9XSxcclxuICAgICAgICAgICAgcGF0aExpbWl0OiBybmRJbnQoIGxTZWdtZW50Q291bnRMLCBsU2VnbWVudENvdW50SCApLFxyXG4gICAgICAgICAgICBjYW5TcGF3bjogY2FuU3Bhd24sXHJcbiAgICAgICAgICAgIGlzQ2hpbGQ6IGlzQ2hpbGQsXHJcbiAgICAgICAgICAgIGhhc0ZpcmVkOiBmYWxzZSxcclxuICAgICAgICAgICAgYWxwaGE6IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubGlnaHRuaW5nLnB1c2goIHRoaXNMaWdodG5pbmcgKTtcclxuICAgIH07XHJcbiAgICBcclxuLy8gVXBkYXRlIExpZ2h0bmluZ1xyXG4gICAgdGhpcy51cGRhdGVMID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgaSA9IHRoaXMubGlnaHRuaW5nLmxlbmd0aDtcclxuICAgICAgICB3aGlsZSAoIGktLSApe1xyXG4gICAgICAgICAgICBsZXQgbGlnaHQgPSB0aGlzLmxpZ2h0bmluZ1sgaSBdO1xyXG4gICAgICAgICAgICBsZXQgeyBwYXRoLCB4UmFuZ2UsIHlSYW5nZSwgcGF0aExpbWl0IH0gPSBsaWdodDtcclxuICAgICAgICAgICAgbGV0IHBhdGhMZW4gPSBwYXRoLmxlbmd0aDtcclxuICAgICAgICAgICAgbGV0IHByZXZMUGF0aCA9IHBhdGhbIHBhdGhMZW4gLSAxIF07ICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsaWdodC5wYXRoLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgeDogcHJldkxQYXRoLnggKyAoIHJuZEludCggMCwgeFJhbmdlICktKCB4UmFuZ2UgLyAyICkgKSxcclxuICAgICAgICAgICAgICAgIHk6IHByZXZMUGF0aC55ICsgKCBybmRJbnQoIDAsIHlSYW5nZSApIClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIHBhdGhMZW4gPiBwYXRoTGltaXQgKXtcclxuICAgICAgICAgICAgICAgIHRoaXMubGlnaHRuaW5nLnNwbGljZSggaSwgMSApXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGlnaHQuaGFzRmlyZWQgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgXHJcbi8vIFJlbmRlciBMaWdodG5pbmdcclxuICAgIHRoaXMucmVuZGVyTCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLmxpZ2h0bmluZy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLmN0eDtcclxuICAgICAgICBsZXQgZ2xvd0NvbG9yID0gJ3doaXRlJztcclxuICAgICAgICBsZXQgZ2xvd0JsdXIgPSAzMDtcclxuICAgICAgICBsZXQgc2hhZG93UmVuZGVyT2Zmc2V0ID0gMTAwMDA7XHJcblxyXG4gICAgICAgIHdoaWxlKCBpLS0gKXtcclxuICAgICAgICAgICAgbGV0IGxpZ2h0ID0gdGhpcy5saWdodG5pbmdbIGkgXTtcclxuICAgICAgICAgICAgbGV0IHBhdGhDb3VudCA9IGxpZ2h0LnBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICBsZXQgY2hpbGRMaWdodEZpcmVzID0gcm5kSW50KCAwLCAxMDAgKSA8IDMwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgYWxwaGE7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGxpZ2h0LmlzQ2hpbGQgPT09IGZhbHNlIHx8IGNoaWxkTGlnaHRGaXJlcyApIHtcclxuICAgICAgICAgICAgICAgIGlmICggcGF0aENvdW50ID09PSBsaWdodC5wYXRoTGltaXQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYy5maWxsU3R5bGUgPSAncmdiYSggMjU1LCAyNTUsIDI1NSwgJyArIHJuZEludCggMjAsIDUwICkgLyAxMDAgKyAnKSc7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5maWxsUmVjdCggMCwgMCwgdGhpcy5jdywgdGhpcy5jaCApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWF4TGluZVdpZHRoID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpdGVyYXRpb25zID0gcm5kSW50KCAxMCwgNTAgKTtcclxuICAgICAgICAgICAgICAgICAgICBjLmxpbmVDYXAgPSBcInJvdW5kXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciggbGV0IGkgPSAwOyBpIDwgaXRlcmF0aW9uczsgaSsrICl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29sb3JDaGFuZ2UgPSBlYXNlRm4oIGksIDE1MCwgMTA1LCBpdGVyYXRpb25zICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2xpZ2h0ZXInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjLnN0cm9rZVN0eWxlID0gJ3doaXRlJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5zaGFkb3dCbHVyID0gZWFzZUZuKCBpLCBtYXhMaW5lV2lkdGgsIC1tYXhMaW5lV2lkdGgsIGl0ZXJhdGlvbnMgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5zaGFkb3dDb2xvciA9IGByZ2JhKCAkeyBjb2xvckNoYW5nZSB9LCAkeyBjb2xvckNoYW5nZSB9LCAyNTUsIDEgKWA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuc2hhZG93T2Zmc2V0WSA9IHNoYWRvd1JlbmRlck9mZnNldDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5tb3ZlVG8oIGxpZ2h0LngsIGxpZ2h0LnkgLSBzaGFkb3dSZW5kZXJPZmZzZXQgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKCBsZXQgaiA9IDA7IGogPCBwYXRoQ291bnQ7IGorKyApeyAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IGxpZ2h0LnBhdGhbIGogXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMubGluZVRvKCBwLngsIHAueSAtIHNoYWRvd1JlbmRlck9mZnNldCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjLnNoYWRvd09mZnNldFkgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIGxpZ2h0LmlzQ2hpbGQgPT09IGZhbHNlIHx8IGNoaWxkTGlnaHRGaXJlcyApIHtcclxuICAgICAgICAgICAgICAgIGlmICggcGF0aENvdW50ID09PSBsaWdodC5wYXRoTGltaXQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5saW5lV2lkdGggPSA1O1xyXG4gICAgICAgICAgICAgICAgICAgIGFscGhhID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBjLnNoYWRvd0NvbG9yID0gJ3JnYmEoIDEwMCwgMTAwLCAyNTUsIDEgKSc7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5zaGFkb3dCbHVyID0gZ2xvd0JsdXI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGMubGluZVdpZHRoID0gMC41O1xyXG4gICAgICAgICAgICAgICAgICAgIGFscGhhID0gcm5kSW50KCAxMCwgNTAgKSAvIDEwMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGMubGluZVdpZHRoID0gMTtcclxuICAgICAgICAgICAgICAgIGFscGhhID0gcm5kSW50KCAxMCwgNTAgKSAvIDEwMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYy5zdHJva2VTdHlsZSA9IGBoc2xhKCAwLCAxMDAlLCAxMDAlLCAke2FscGhhfSApYDtcclxuXHJcblxyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjLm1vdmVUbyggbGlnaHQueCwgbGlnaHQueSApO1xyXG4gICAgICAgICAgICBmb3IoIGxldCBpID0gMDsgaSA8IHBhdGhDb3VudDsgaSsrICl7ICAgIFxyXG4gICAgICAgICAgICAgICAgbGV0IHBTZWcgPSBsaWdodC5wYXRoWyBpIF07XHJcbiAgICAgICAgICAgICAgICBjLmxpbmVUbyggcFNlZy54LCBwU2VnLnkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggbGlnaHQuY2FuU3Bhd24gKXtcclxuICAgICAgICAgICAgICAgICAgICBpZiggcm5kSW50KDAsIDEwMCApIDwgMSApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaWdodC5jYW5TcGF3biA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUwoIHBTZWcueCwgcFNlZy55LCB0cnVlLCB0cnVlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xyXG4gICAgICAgICAgICBjLnNoYWRvd0JsdXIgPSAwO1xyXG5cclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIFxyXG4vLyBMaWdodG5pbmcgVGltZXJcclxuICAgIHRoaXMubGlnaHRuaW5nVGltZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMubGlnaHRUaW1lQ3VycmVudCsrO1xyXG4gICAgICAgIGlmKCB0aGlzLmxpZ2h0VGltZUN1cnJlbnQgPj0gdGhpcy5saWdodFRpbWVUb3RhbCApe1xyXG5cclxuICAgICAgICAgICAgbGV0IG5ld1ggPSBybmRJbnQoIDUwLCB0aGlzLmN3IC0gNTAgKTtcclxuICAgICAgICAgICAgbGV0IG5ld1kgPSBybmRJbnQoIC0zMCwgLTI1ICk7IFxyXG4gICAgICAgICAgICBsZXQgY3JlYXRlQ291bnQgPSBybmRJbnQoIDEsIDIgKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHdoaWxlKCBjcmVhdGVDb3VudC0tICl7ICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVMKCBuZXdYLCBuZXdZLCB0cnVlLCBmYWxzZSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0VGltZUN1cnJlbnQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0VGltZVRvdGFsID0gcm5kSW50KCBsaWdodG5pbmdGcmVxdWVuY3lMb3csIGxpZ2h0bmluZ0ZyZXF1ZW5jeUhpZ2ggKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiBcclxuICAgIHRoaXMuY2xlYXJDYW52YXMgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGxldCBjID0gdGhpcy5jdHg7XHJcbiAgICAgICAgLy8gYy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24tb3V0JztcclxuICAgICAgICBjLmZpbGxTdHlsZSA9ICdyZ2JhKCAwLDAsMCwnICsgcm5kSW50KCAxLCAzMCApIC8gMTAwICsgJyknO1xyXG4gICAgICAgIC8vIGMuZmlsbFN0eWxlID0gJ3JnYmEoIDAsMCwwLDAuMSknO1xyXG4gICAgICAgIGMuZmlsbFJlY3QoIDAsIDAsIHRoaXMuY3csIHRoaXMuY2ggKTtcclxuICAgICAgICBjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzb3VyY2Utb3Zlcic7XHJcbiAgICB9O1xyXG4gICAgXHJcblxyXG4gICAgdGhpcy5yZXNpemVDYW52YXNIYW5kbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgX3RoaXMuY3cgPSBfdGhpcy5jLndpZHRoID0gX3RoaXMuYy5wYXJlbnROb2RlLmNsaWVudFdpZHRoO1xyXG4gICAgfVxyXG5cclxuLy8gUmVzaXplIG9uIENhbnZhcyBvbiBXaW5kb3cgUmVzaXplXHJcbiAgICAkKHdpbmRvdykub24oICdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBfdGhpcy5yZXNpemVDYW52YXNIYW5kbGVyKCk7XHJcbiAgICB9KTtcclxuICAgIFxyXG4vLyBBbmltYXRpb24gTG9vcFxyXG4gICAgdGhpcy5sb29wID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgbG9vcEl0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBsb29wSXQsIF90aGlzLmMgKTtcclxuICAgICAgICAgICAgX3RoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgICAgICAgICAgX3RoaXMudXBkYXRlTCgpO1xyXG4gICAgICAgICAgICBfdGhpcy5saWdodG5pbmdUaW1lcigpO1xyXG4gICAgICAgICAgICBfdGhpcy5yZW5kZXJMKCk7ICBcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxvb3BJdCgpOyAgICAgICAgICAgICAgICAgICBcclxuICAgIH07XHJcbiAgXHJcbn07XHJcblxyXG5mdW5jdGlvbiBzdGFydExpZ2h0bmluZ0FuaW1hdGlvbiggY2FudmFzRG9tU2VsZWN0b3IsIHBhcmVudCApIHtcclxuICAgIGxldCB0aGlzUGFyZW50ID0gcGFyZW50IHx8IHdpbmRvdztcclxuICAgIGxldCB0aGlzQ2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggY2FudmFzRG9tU2VsZWN0b3IgKTtcclxuICAgIGNvbnNvbGUubG9nKCAndGhpc0NhbnZhczosICcsIHRoaXNDYW52YXMgKTtcclxuICAgIGNvbnNvbGUubG9nKCAndGhpc1BhcmVudDosICcsIHRoaXNQYXJlbnQgKTtcclxuICAgIGlmICggdGhpc0NhbnZhcyApIHtcclxuICAgICAgICBtYXRjaERpbWVudGlvbnMoIHRoaXNDYW52YXMsIHRoaXNQYXJlbnQgKTtcclxuICAgICAgICB2YXIgY2wgPSBuZXcgY2FudmFzTGlnaHRuaW5nKCB0aGlzQ2FudmFzICk7XHJcbiAgICAgICAgY2wuaW5pdCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oICdObyBlbGVtZW50IG1hdGNoaW5nIHNlbGVjdG9yOiAnK2NhbnZhc0RvbVNlbGVjdG9yKycgZm91bmQhJyApO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jYW52YXNMaWdodG5pbmcgPSBjYW52YXNMaWdodG5pbmc7XHJcbm1vZHVsZS5leHBvcnRzLnN0YXJ0TGlnaHRuaW5nQW5pbWF0aW9uID0gc3RhcnRMaWdodG5pbmdBbmltYXRpb247IiwiLyoqXHJcbiogQ3JlYXRlcyBhIGNhbnZhcyBlbGVtZW50IGluIHRoZSBET00gdG8gdGVzdCBmb3IgYnJvd3NlciBzdXBwb3J0XHJcbiogdG8gc2VsZWN0ZWQgZWxlbWVudCB0byBtYXRjaCBzaXplIGRpbWVuc2lvbnMuXHJcbiogQHBhcmFtIHtzdHJpbmd9IGNvbnRleHRUeXBlIC0gKCAnMmQnIHwgJ3dlYmdsJyB8ICdleHBlcmltZW50YWwtd2ViZ2wnIHwgJ3dlYmdsMicsIHwgJ2JpdG1hcHJlbmRlcmVyJyAgKVxyXG4qIFRoZSB0eXBlIG9mIGNhbnZhcyBhbmQgY29udGV4dCBlbmdpbmUgdG8gY2hlY2sgc3VwcG9ydCBmb3JcclxuKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGJvdGggY2FudmFzIGFuZCB0aGUgY29udGV4dCBlbmdpbmUgYXJlIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlclxyXG4qL1xyXG5cclxuZnVuY3Rpb24gY2hlY2tDYW52YXNTdXBwb3J0KCBjb250ZXh0VHlwZSApIHtcclxuICAgIGxldCBjdHggPSBjb250ZXh0VHlwZSB8fCAnMmQnO1xyXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApO1xyXG4gICAgcmV0dXJuICEhKGVsZW0uZ2V0Q29udGV4dCAmJiBlbGVtLmdldENvbnRleHQoIGN0eCApICk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2hlY2tDYW52YXNTdXBwb3J0OyIsImZ1bmN0aW9uIGNvbnRlbnRTVkdIaWdobGlnaHQoKSB7XHJcblx0dmFyIHRvYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcudG9jJyApO1xyXG5cdHZhciB0b2NQYXRoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy50b2MtbWFya2VyIHBhdGgnICk7XHJcblx0dmFyIHRvY0l0ZW1zO1xyXG5cclxuXHQvLyBGYWN0b3Igb2Ygc2NyZWVuIHNpemUgdGhhdCB0aGUgZWxlbWVudCBtdXN0IGNyb3NzXHJcblx0Ly8gYmVmb3JlIGl0J3MgY29uc2lkZXJlZCB2aXNpYmxlXHJcblx0dmFyIFRPUF9NQVJHSU4gPSAwLjAwLFxyXG5cdFx0Qk9UVE9NX01BUkdJTiA9IDAuMDtcclxuXHJcblx0dmFyIHBhdGhMZW5ndGg7XHJcblxyXG5cdHZhciBsYXN0UGF0aFN0YXJ0LFxyXG5cdFx0bGFzdFBhdGhFbmQ7XHJcblxyXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgZHJhd1BhdGgsIGZhbHNlICk7XHJcblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdzY3JvbGwnLCBzeW5jLCBmYWxzZSApO1xyXG5cclxuXHRkcmF3UGF0aCgpO1xyXG5cclxuXHRmdW5jdGlvbiBkcmF3UGF0aCgpIHtcclxuXHJcblx0XHR0b2NJdGVtcyA9IFtdLnNsaWNlLmNhbGwoIHRvYy5xdWVyeVNlbGVjdG9yQWxsKCAnbGknICkgKTtcclxuXHJcblx0XHQvLyBDYWNoZSBlbGVtZW50IHJlZmVyZW5jZXMgYW5kIG1lYXN1cmVtZW50c1xyXG5cdFx0dG9jSXRlbXMgPSB0b2NJdGVtcy5tYXAoIGZ1bmN0aW9uKCBpdGVtICkge1xyXG5cdFx0XHR2YXIgYW5jaG9yID0gaXRlbS5xdWVyeVNlbGVjdG9yKCAnYScgKTtcclxuXHRcdFx0dmFyIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBhbmNob3IuZ2V0QXR0cmlidXRlKCAnaHJlZicgKS5zbGljZSggMSApICk7XHJcblxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGxpc3RJdGVtOiBpdGVtLFxyXG5cdFx0XHRcdGFuY2hvcjogYW5jaG9yLFxyXG5cdFx0XHRcdHRhcmdldDogdGFyZ2V0XHJcblx0XHRcdH07XHJcblx0XHR9ICk7XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIG1pc3NpbmcgdGFyZ2V0c1xyXG5cdFx0dG9jSXRlbXMgPSB0b2NJdGVtcy5maWx0ZXIoIGZ1bmN0aW9uKCBpdGVtICkge1xyXG5cdFx0XHRyZXR1cm4gISFpdGVtLnRhcmdldDtcclxuXHRcdH0gKTtcclxuXHJcblx0XHR2YXIgcGF0aCA9IFtdO1xyXG5cdFx0dmFyIHBhdGhJbmRlbnQ7XHJcblxyXG5cdFx0dG9jSXRlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGl0ZW0sIGkgKSB7XHJcblxyXG5cdFx0XHR2YXIgeCA9IGl0ZW0uYW5jaG9yLm9mZnNldExlZnQgLSA1LFxyXG5cdFx0XHRcdHkgPSBpdGVtLmFuY2hvci5vZmZzZXRUb3AsXHJcblx0XHRcdFx0aGVpZ2h0ID0gaXRlbS5hbmNob3Iub2Zmc2V0SGVpZ2h0O1xyXG5cclxuXHRcdFx0aWYoIGkgPT09IDAgKSB7XHJcblx0XHRcdFx0cGF0aC5wdXNoKCAnTScsIHgsIHksICdMJywgeCwgeSArIGhlaWdodCApO1xyXG5cdFx0XHRcdGl0ZW0ucGF0aFN0YXJ0ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHQvLyBEcmF3IGFuIGFkZGl0aW9uYWwgbGluZSB3aGVuIHRoZXJlJ3MgYSBjaGFuZ2UgaW5cclxuXHRcdFx0XHQvLyBpbmRlbnQgbGV2ZWxzXHJcblx0XHRcdFx0aWYoIHBhdGhJbmRlbnQgIT09IHggKSBwYXRoLnB1c2goICdMJywgcGF0aEluZGVudCwgeSApO1xyXG5cclxuXHRcdFx0XHRwYXRoLnB1c2goICdMJywgeCwgeSApO1xyXG5cclxuXHRcdFx0XHQvLyBTZXQgdGhlIGN1cnJlbnQgcGF0aCBzbyB0aGF0IHdlIGNhbiBtZWFzdXJlIGl0XHJcblx0XHRcdFx0dG9jUGF0aC5zZXRBdHRyaWJ1dGUoICdkJywgcGF0aC5qb2luKCAnICcgKSApO1xyXG5cdFx0XHRcdGl0ZW0ucGF0aFN0YXJ0ID0gdG9jUGF0aC5nZXRUb3RhbExlbmd0aCgpIHx8IDA7XHJcblxyXG5cdFx0XHRcdHBhdGgucHVzaCggJ0wnLCB4LCB5ICsgaGVpZ2h0ICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHBhdGhJbmRlbnQgPSB4O1xyXG5cclxuXHRcdFx0dG9jUGF0aC5zZXRBdHRyaWJ1dGUoICdkJywgcGF0aC5qb2luKCAnICcgKSApO1xyXG5cdFx0XHRpdGVtLnBhdGhFbmQgPSB0b2NQYXRoLmdldFRvdGFsTGVuZ3RoKCk7XHJcblxyXG5cdFx0fSApO1xyXG5cclxuXHRcdHBhdGhMZW5ndGggPSB0b2NQYXRoLmdldFRvdGFsTGVuZ3RoKCk7XHJcblxyXG5cdFx0c3luYygpO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHN5bmMoKSB7XHJcblxyXG5cdFx0dmFyIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcblx0XHR2YXIgcGF0aFN0YXJ0ID0gcGF0aExlbmd0aCxcclxuXHRcdFx0cGF0aEVuZCA9IDA7XHJcblxyXG5cdFx0dmFyIHZpc2libGVJdGVtcyA9IDA7XHJcblxyXG5cdFx0dG9jSXRlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGl0ZW0gKSB7XHJcblxyXG5cdFx0XHR2YXIgdGFyZ2V0Qm91bmRzID0gaXRlbS50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG5cdFx0XHRpZiggdGFyZ2V0Qm91bmRzLmJvdHRvbSA+IHdpbmRvd0hlaWdodCAqIFRPUF9NQVJHSU4gJiYgdGFyZ2V0Qm91bmRzLnRvcCA8IHdpbmRvd0hlaWdodCAqICggMSAtIEJPVFRPTV9NQVJHSU4gKSApIHtcclxuXHRcdFx0XHRwYXRoU3RhcnQgPSBNYXRoLm1pbiggaXRlbS5wYXRoU3RhcnQsIHBhdGhTdGFydCApO1xyXG5cdFx0XHRcdHBhdGhFbmQgPSBNYXRoLm1heCggaXRlbS5wYXRoRW5kLCBwYXRoRW5kICk7XHJcblxyXG5cdFx0XHRcdHZpc2libGVJdGVtcyArPSAxO1xyXG5cclxuXHRcdFx0XHRpdGVtLmxpc3RJdGVtLmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGl0ZW0ubGlzdEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSggJ3Zpc2libGUnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9ICk7XHJcblxyXG5cdFx0Ly8gU3BlY2lmeSB0aGUgdmlzaWJsZSBwYXRoIG9yIGhpZGUgdGhlIHBhdGggYWx0b2dldGhlclxyXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIG5vIHZpc2libGUgaXRlbXNcclxuXHRcdGlmKCB2aXNpYmxlSXRlbXMgPiAwICYmIHBhdGhTdGFydCA8IHBhdGhFbmQgKSB7XHJcblx0XHRcdGlmKCBwYXRoU3RhcnQgIT09IGxhc3RQYXRoU3RhcnQgfHwgcGF0aEVuZCAhPT0gbGFzdFBhdGhFbmQgKSB7XHJcblx0XHRcdFx0dG9jUGF0aC5zZXRBdHRyaWJ1dGUoICdzdHJva2UtZGFzaG9mZnNldCcsICcxJyApO1xyXG5cdFx0XHRcdHRvY1BhdGguc2V0QXR0cmlidXRlKCAnc3Ryb2tlLWRhc2hhcnJheScsICcxLCAnKyBwYXRoU3RhcnQgKycsICcrICggcGF0aEVuZCAtIHBhdGhTdGFydCApICsnLCAnICsgcGF0aExlbmd0aCApO1xyXG5cdFx0XHRcdHRvY1BhdGguc2V0QXR0cmlidXRlKCAnb3BhY2l0eScsIDEgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHRvY1BhdGguc2V0QXR0cmlidXRlKCAnb3BhY2l0eScsIDAgKTtcclxuXHRcdH1cclxuXHJcblx0XHRsYXN0UGF0aFN0YXJ0ID0gcGF0aFN0YXJ0O1xyXG5cdFx0bGFzdFBhdGhFbmQgPSBwYXRoRW5kO1xyXG5cclxuXHR9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jb250ZW50U1ZHSGlnaGxpZ2h0ID0gY29udGVudFNWR0hpZ2hsaWdodDsiLCJmdW5jdGlvbiB3aGljaFRyYW5zaXRpb25FdmVudCgpe1xyXG4gIHZhciB0O1xyXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50Jyk7XHJcbiAgdmFyIHRyYW5zaXRpb25zID0ge1xyXG4gICAgJ1dlYmtpdFRyYW5zaXRpb24nIDond2Via2l0VHJhbnNpdGlvbkVuZCcsXHJcbiAgICAnTW96VHJhbnNpdGlvbicgICAgOid0cmFuc2l0aW9uZW5kJyxcclxuICAgICdNU1RyYW5zaXRpb24nICAgICA6J21zVHJhbnNpdGlvbkVuZCcsXHJcbiAgICAnT1RyYW5zaXRpb24nICAgICAgOidvVHJhbnNpdGlvbkVuZCcsXHJcbiAgICAndHJhbnNpdGlvbicgICAgICAgOid0cmFuc2l0aW9uRW5kJ1xyXG4gIH1cclxuXHJcbiAgZm9yKHQgaW4gdHJhbnNpdGlvbnMpe1xyXG4gICAgaWYoIGVsLnN0eWxlW3RdICE9PSB1bmRlZmluZWQgKXtcclxuICAgICAgY29uc29sZS5sb2coIHRyYW5zaXRpb25zW3RdICk7XHJcbiAgICAgIHJldHVybiB0cmFuc2l0aW9uc1t0XTtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB3aGljaFRyYW5zaXRpb25FdmVudDsiLCJyZXF1aXJlKCAnLi9hcHAuanMnICk7IiwibGV0IGNoZWNrQ2FudmFzU3VwcG9ydCA9IHJlcXVpcmUoICcuL2NoZWNrQ2FudmFzU3VwcG9ydC5qcycgKTtcclxubGV0IGNMaWdodG5pbmcgPSByZXF1aXJlKCAnLi9jYW52YXNEZW1vLmpzJyApLnN0YXJ0TGlnaHRuaW5nQW5pbWF0aW9uO1xyXG5sZXQgY29udGVudFNWR0hpZ2hsaWdodCA9IHJlcXVpcmUoICcuL2NvbnRlbnRTVkdIaWdobGlnaHQuanMnICkuY29udGVudFNWR0hpZ2hsaWdodDsgXHJcbmxldCBkZXRlY3RUcmFuc2l0aW9uRW5kID0gcmVxdWlyZSggJy4vZGV0ZWN0VHJhbnNpdGlvbkVuZEV2ZW50Q29tcGF0LmpzJyk7IFxyXG5sZXQgdHJhbnNFbmRFdmVudCA9IGRldGVjdFRyYW5zaXRpb25FbmQoKTtcclxuXHJcbi8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2l2ZW4gYXJyYXkgb2YgalF1ZXJ5IERPTSBlbGVtZW50cyB0aGUgZk4gaXRlcmF0ZXMgb3ZlciBlYWNoXHJcbiAqIG1lbWJlciwgbWVhc3VyZXMgaXQncyBoZWlnaHQsIGxvZ3MgdGhlIGhlaWdodCBhcyBhIG51bWJlciBhbmQgYXR0YWNoZXNcclxuICogYXMgYSBjdXN0b20gZWxlbWVudC4gVGhlIGZOIHRoZW4gYXBwbGllcyBhIGhlaWdodCBvZiAwIHZpYSBpbmxpbmVcclxuICogc3R5bGluZyBhbmQgYWRkcyB0aGUgXCJ0cmFuc2l0aW9uZXJcIiBjbGFzcy5cclxuICogQHBhcmFtIHtqUXVlcnl9IGFyciAtIHRoZSBhcnJheSBvZiBET00gZWxlbWVudHMgdG8gbWVhc3VyZS5cclxuICovXHJcbmZ1bmN0aW9uIG1lYXN1cmVFbHMoIGFyciApIHtcclxuXHQvKipcclxuXHQqIFRoZSBsZW5ndGggb2YgdGhlIGFycmF5XHJcblx0KiBAdHlwZSB7bnVtYmVyfVxyXG5cdCogQG1lbWJlcm9mIG1lYXN1cmVFbHNcclxuXHQqL1xyXG5cdGFyckxlbiA9IGFyci5sZW5ndGg7XHJcblx0Zm9yKCBsZXQgaSA9IGFyckxlbiAtIDE7IGkgPj0gMDsgaS0tICkge1xyXG5cdFx0LyoqXHJcblx0XHQqIFRoZSBjdXJyZW50IGl0ZXJhdGVlXHJcblx0XHQqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuXHRcdCogQG1lbWJlcm9mIG1lYXN1cmVFbHNcclxuXHRcdCogQGlubmVyXHJcblx0XHQqL1xyXG5cdFx0bGV0IGN1cnJFbCA9ICQoIGFyclsgaSBdICk7XHJcblx0XHRjdXJyRWxcclxuXHRcdFx0LmF0dHIoICdkYXRhLW9wZW4taGVpZ2h0JywgY3VyckVsLmlubmVySGVpZ2h0KCkgKVxyXG5cdFx0XHQuY3NzKCB7XHJcblx0XHRcdFx0J2hlaWdodCc6ICAwLFxyXG5cdFx0XHR9IClcclxuXHRcdFx0LmFkZENsYXNzKCAndHJhbnNpdGlvbmVyJyApO1xyXG5cdH1cclxufVxyXG5cclxuJCggZG9jdW1lbnQgKS5yZWFkeSggKCk9PiB7XHJcblxyXG5sZXQgJHJldmVhbEVscyA9ICQoICdbIGRhdGEtcmV2ZWFsLXRhcmdldCBdJyApO1xyXG5tZWFzdXJlRWxzKCAkcmV2ZWFsRWxzICk7XHJcblxyXG4kKCAnWyBkYXRhLXJldmVhbC10cmlnZ2VyIF0nICkuY2xpY2soIGZ1bmN0aW9uKCBlICl7XHJcblx0LyoqXHJcblx0KiBUaGUgY2xpY2tlZCBlbGVtZW50XHJcblx0KiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcblx0KiBAaW5uZXJcclxuXHQqL1xyXG5cdCR0aGlzID0gJCggdGhpcyApO1xyXG5cdC8qKlxyXG5cdCogVGhlIGVsZW1lbnQgbGlua2VkIHRvIHRoZSBjbGlja2VkIGVsZW1lbnQgYnkgY3VzdG9tIGRhdGEgYXR0cmlidXRlcyBcclxuXHQqIEB0eXBlIHtIVE1MRWxlbWVudH1cclxuXHQqIEBpbm5lclxyXG5cdCovXHJcblx0JGxpbmtlZEVsID0gJCggYFsgZGF0YS1yZXZlYWwtdGFyZ2V0PVwiJHskdGhpcy5hdHRyKCAnZGF0YS1yZXZlYWwtdHJpZ2dlcicgKX1cIiBdYCApO1xyXG5cdC8qKlxyXG5cdCogVGhlIGhlaWdodCBvZiB0aGUgbGlua2VkIGVsZW1lbnQgIGluIGl0J3MgbWF4aW11bSBvcGVuIHN0YXRlIFxyXG5cdCogQHR5cGUge251bWJlcn1cclxuXHQqIEBpbm5lclxyXG5cdCovXHJcblx0bGV0IHRoaXNIZWlnaHQgPSBgJHskbGlua2VkRWwuYXR0ciggJ2RhdGEtb3Blbi1oZWlnaHQnICl9cHhgO1xyXG5cclxuXHRpZiAoICRsaW5rZWRFbC5oYXNDbGFzcyggJ2lzLWFjdGl2ZScgKSApIHtcclxuXHRcdCRsaW5rZWRFbFxyXG5cdFx0XHQuY3NzKCB7ICdoZWlnaHQnOiAgMCB9IClcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdFx0JHRoaXMucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcblx0fSBlbHNlIHtcclxuXHRcdCRsaW5rZWRFbFxyXG5cdFx0XHQuY3NzKCB7ICdoZWlnaHQnOiAgdGhpc0hlaWdodCB9IClcclxuXHRcdFx0LmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cclxuXHRcdCR0aGlzLmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdH1cclxuIFxyXG59ICk7XHJcblxyXG59KTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0aWYgKCAkKCAnLnRvYycgKS5sZW5ndGggPiAwICkge1xyXG5cdFx0Y29udGVudFNWR0hpZ2hsaWdodCgpO1xyXG5cdH1cclxuXHRcclxuXHRpZiggY2hlY2tDYW52YXNTdXBwb3J0KCkgKXtcclxuXHRcdGlmICggJCggJyNjYW52YXMnICkubGVuZ3RoID4gMCApIHtcclxuXHRcdFx0Y0xpZ2h0bmluZyggJyNjYW52YXMnLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI2NhbnZhcycgKS5wYXJlbnRFbGVtZW50ICk7XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG59OyIsIlxyXG4vKipcclxuKiBNZWFzdXJlcyB0aGUgdGFyZ2V0IERPTSBlbGVtZW50IGRpbWVuc2lvbnMuIERvbSBlbGVtZW50cyByZXF1aXJlIG5vZGUuY2xpZW50V2lkdGgvSGVpZ2h0LlxyXG4qIHRoZSBnbG9iYWwud2luZG93IG9iamVjdCByZXF1aXJlcyBub2RlLmlubmVyV2lkdGgvSGVpZ2h0XHJcbiogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBET00gbm9kZSBvciBlbGVtZW50IHRvIG1lYXN1cmUuXHJcbiogQHJldHVybnMge0RpbWVuc2lvbnN9IHRoZSBkaW1lbnNpb25zIG9mIHRoZSBlbGVtZW50XHJcbiovXHJcblxyXG5mdW5jdGlvbiBnZXREaW1lbnNpb25zKCBlbCApIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdzogZWwuaW5uZXJXaWR0aCB8fCBlbC5jbGllbnRXaWR0aCxcclxuICAgICAgICBoOiBlbC5pbm5lckhlaWdodCB8fCBlbC5jbGllbnRIZWlnaHRcclxuICAgIH07XHJcbn1cclxuXHJcbi8qKlxyXG4qIE1lYXN1cmVzIHRoZSB0YXJnZXQgRE9NIGVsZW1lbnQgYW5kIGFwcGxpZXMgd2lkdGgvaGVpZ2h0XHJcbiogdG8gc2VsZWN0ZWQgZWxlbWVudCBcImVsXCIuXHJcbiogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBEb20gbm9kZSBwb2ludGluZyB0byBlbGVtZW50IHRvIHRyYW5zZm9ybSBzaXplLlxyXG4qIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldCAtIERvbSBub2RlIHBvaW50aW5nIHRvIGNvbnRhaW5lciBlbGVtZW50IHRvIG1hdGNoIGRpbWVuc2lvbnMuXHJcbiogQHBhcmFtIHtEaW1lbnNpb25zfSBvcHRpb25zIC0gb3B0aW9uYWwgcGFyYW1ldGVyIG9iamVjdCB3aXRoIG1lbWJlcnMgXCJ3XCIgYW5kIFwiaFwiXHJcbipyZXByZXNlbnRpbmcgd2lkdGggYW5kIGhlaWdodCBmb3Igc2V0dGluZyBkZWZhdWx0IG9yIG1pbmltdW0gdmFsdWVzIGlmIG5vdCBtZXQgYnkgXCJ0YXJnZXRcIi5cclxuKiBAcmV0dXJucyB7dm9pZH1cclxuKi9cclxuXHJcbmZ1bmN0aW9uIG1hdGNoRGltZW50aW9ucyggZWwsIHRhcmdldCwgb3B0aW9ucyA9IHsgdzogNTAwLCBoOiA1MDAgfSApIHtcclxuICAgIGxldCB0ID0gZ2V0RGltZW5zaW9ucyggdGFyZ2V0ICk7XHJcbiAgICBlbC53aWR0aCA9IHQudyA8IG9wdGlvbnMudyA/IG9wdGlvbnMudyA6IHQudztcclxuICAgIGVsLmhlaWdodCA9IHQuaCA8IG9wdGlvbnMuaCA/IG9wdGlvbnMuaCA6IHQuaDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaERpbWVudGlvbnM7IiwiLypcclxuICogVGhpcyBpcyBhIG5lYXItZGlyZWN0IHBvcnQgb2YgUm9iZXJ0IFBlbm5lcidzIGVhc2luZyBlcXVhdGlvbnMuIFBsZWFzZSBzaG93ZXIgUm9iZXJ0IHdpdGhcclxuICogcHJhaXNlIGFuZCBhbGwgb2YgeW91ciBhZG1pcmF0aW9uLiBIaXMgbGljZW5zZSBpcyBwcm92aWRlZCBiZWxvdy5cclxuICpcclxuICogRm9yIGluZm9ybWF0aW9uIG9uIGhvdyB0byB1c2UgdGhlc2UgZnVuY3Rpb25zIGluIHlvdXIgYW5pbWF0aW9ucywgY2hlY2sgb3V0IG15IGZvbGxvd2luZyB0dXRvcmlhbDogXHJcbiAqIGh0dHA6Ly9iaXQubHkvMThpSEhLcVxyXG4gKlxyXG4gKiAtS2lydXBhXHJcbiAqL1xyXG5cclxuLypcclxuICogQGF1dGhvciBSb2JlcnQgUGVubmVyXHJcbiAqIEBsaWNlbnNlIFxyXG4gKiBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXHJcbiAqIFxyXG4gKiBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuIFxyXG4gKiBcclxuICogQ29weXJpZ2h0IMKpIDIwMDEgUm9iZXJ0IFBlbm5lclxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBcclxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgXHJcbiAqIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuICogXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIFxyXG4gKiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IFxyXG4gKiBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBcclxuICogcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4gKiBcclxuICogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgYXV0aG9yIG5vciB0aGUgbmFtZXMgb2YgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2UgXHJcbiAqIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcbiAqIFxyXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIFxyXG4gKiBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0ZcclxuICogTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiAqIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcclxuICogRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFXHJcbiAqIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBcclxuICogQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcclxuICogTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgXHJcbiAqIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gXHJcbiAqXHJcbiAqL1xyXG5cclxuLyoqXHJcbiogUHJvdmlkZXMgZWFzaW5nIGNhbGN1bGF0aW9uIG1ldGhvZHMuXHJcbiogQG5hbWUgZWFzaW5nRXF1YXRpb25zXHJcbipcclxuKiBAc2VlIHtAbGluayBcImh0dHA6Ly9yb2JlcnRwZW5uZXIuY29tL2Vhc2luZy9cIn1cclxuKiBAc2VlIHtAbGluayBodHRwczovL2Vhc2luZ3MubmV0L2VufEVhc2luZyBjaGVhdCBzaGVldH1cclxuKi9cclxudmFyIGVhc2luZ0VxdWF0aW9ucyA9IHtcclxuXHQvKipcclxuXHQgKiBAZnVuY3Rpb25cclxuXHQgKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG5cdCAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuXHQgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcblx0ICovXHJcblx0bGluZWFyRWFzZTogZnVuY3Rpb24gbGluZWFyRWFzZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHQvKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluUXVhZDogZnVuY3Rpb24gZWFzZUluUXVhZChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIGN1cnJlbnRJdGVyYXRpb24gKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlT3V0UXVhZDogZnVuY3Rpb24gZWFzZU91dFF1YWQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgKiAoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMpICogKGN1cnJlbnRJdGVyYXRpb24gLSAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbk91dFF1YWQ6IGZ1bmN0aW9uIGVhc2VJbk91dFF1YWQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIGN1cnJlbnRJdGVyYXRpb24gKiBjdXJyZW50SXRlcmF0aW9uICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAvIDIgKiAoLS1jdXJyZW50SXRlcmF0aW9uICogKGN1cnJlbnRJdGVyYXRpb24gLSAyKSAtIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblxyXG5cdGVhc2VJbkN1YmljOiBmdW5jdGlvbiBlYXNlSW5DdWJpYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgMykgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlT3V0Q3ViaWM6IGZ1bmN0aW9uIGVhc2VPdXRDdWJpYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCAzKSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uIGVhc2VJbk91dEN1YmljKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCAzKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDMpICsgMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5RdWFydDogZnVuY3Rpb24gZWFzZUluUXVhcnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMsIDQpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZU91dFF1YXJ0OiBmdW5jdGlvbiBlYXNlT3V0UXVhcnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDQpIC0gMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gZWFzZUluT3V0UXVhcnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDQpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDQpIC0gMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5RdWludDogZnVuY3Rpb24gZWFzZUluUXVpbnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMsIDUpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZU91dFF1aW50OiBmdW5jdGlvbiBlYXNlT3V0UXVpbnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgNSkgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiBlYXNlSW5PdXRRdWludChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgNSkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCA1KSArIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluU2luZTogZnVuY3Rpb24gZWFzZUluU2luZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKDEgLSBNYXRoLmNvcyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zICogKE1hdGguUEkgLyAyKSkpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZU91dFNpbmU6IGZ1bmN0aW9uIGVhc2VPdXRTaW5lKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnNpbihjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zICogKE1hdGguUEkgLyAyKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiBlYXNlSW5PdXRTaW5lKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKDEgLSBNYXRoLmNvcyhNYXRoLlBJICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluRXhwbzogZnVuY3Rpb24gZWFzZUluRXhwbyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEpKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRFeHBvOiBmdW5jdGlvbiBlYXNlT3V0RXhwbyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKC1NYXRoLnBvdygyLCAtMTAgKiBjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zKSArIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gZWFzZUluT3V0RXhwbyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAtIDEpKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tY3VycmVudEl0ZXJhdGlvbikgKyAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbkNpcmM6IGZ1bmN0aW9uIGVhc2VJbkNpcmMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgxIC0gTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMpICogY3VycmVudEl0ZXJhdGlvbikpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcblx0ZWFzZU91dENpcmM6IGZ1bmN0aW9uIGVhc2VPdXRDaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnNxcnQoMSAtIChjdXJyZW50SXRlcmF0aW9uID0gY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEpICogY3VycmVudEl0ZXJhdGlvbikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiBlYXNlSW5PdXRDaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoMSAtIE1hdGguc3FydCgxIC0gY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiAtPSAyKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlSW5FbGFzdGljOiBmdW5jdGlvbiBlYXNlSW5FbGFzdGljKHQsIGIsIGMsIGQpIHtcclxuXHRcdHZhciBzID0gMS43MDE1ODt2YXIgcCA9IDA7dmFyIGEgPSBjO1xyXG5cdFx0aWYgKHQgPT0gMCkgcmV0dXJuIGI7aWYgKCh0IC89IGQpID09IDEpIHJldHVybiBiICsgYztpZiAoIXApIHAgPSBkICogLjM7XHJcblx0XHRpZiAoYSA8IE1hdGguYWJzKGMpKSB7XHJcblx0XHRcdGEgPSBjO3ZhciBzID0gcCAvIDQ7XHJcblx0XHR9IGVsc2UgdmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XHJcblx0XHRyZXR1cm4gLShhICogTWF0aC5wb3coMiwgMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSkgKyBiO1xyXG5cdH0sXHJcblx0LyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRFbGFzdGljOiBmdW5jdGlvbiBlYXNlT3V0RWxhc3RpYyh0LCBiLCBjLCBkKSB7XHJcblx0XHR2YXIgcyA9IDEuNzAxNTg7dmFyIHAgPSAwO3ZhciBhID0gYztcclxuXHRcdGlmICh0ID09IDApIHJldHVybiBiO2lmICgodCAvPSBkKSA9PSAxKSByZXR1cm4gYiArIGM7aWYgKCFwKSBwID0gZCAqIC4zO1xyXG5cdFx0aWYgKGEgPCBNYXRoLmFicyhjKSkge1xyXG5cdFx0XHRhID0gYzt2YXIgcyA9IHAgLyA0O1xyXG5cdFx0fSBlbHNlIHZhciBzID0gcCAvICgyICogTWF0aC5QSSkgKiBNYXRoLmFzaW4oYyAvIGEpO1xyXG5cdFx0cmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiB0KSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICsgYyArIGI7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbk91dEVsYXN0aWM6IGZ1bmN0aW9uIGVhc2VJbk91dEVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCAvIDIpID09IDIpIHJldHVybiBiICsgYztpZiAoIXApIHAgPSBkICogKC4zICogMS41KTtcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdGlmICh0IDwgMSkgcmV0dXJuIC0uNSAqIChhICogTWF0aC5wb3coMiwgMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSkgKyBiO1xyXG5cdFx0cmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSAqIC41ICsgYyArIGI7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VJbkJhY2s6IGZ1bmN0aW9uIGVhc2VJbkJhY2sodCwgYiwgYywgZCwgcykge1xyXG5cdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcclxuXHRcdHJldHVybiBjICogKHQgLz0gZCkgKiB0ICogKChzICsgMSkgKiB0IC0gcykgKyBiO1xyXG5cdH0sXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuXHRlYXNlT3V0QmFjazogZnVuY3Rpb24gZWFzZU91dEJhY2sodCwgYiwgYywgZCwgcykge1xyXG5cdFx0aWYgKHMgPT0gdW5kZWZpbmVkKSBzID0gMS43MDE1ODtcclxuXHRcdHJldHVybiBjICogKCh0ID0gdCAvIGQgLSAxKSAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDEpICsgYjtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRCYWNrOiBmdW5jdGlvbiBlYXNlSW5PdXRCYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRpZiAoKHQgLz0gZCAvIDIpIDwgMSkgcmV0dXJuIGMgLyAyICogKHQgKiB0ICogKCgocyAqPSAxLjUyNSkgKyAxKSAqIHQgLSBzKSkgKyBiO1xyXG5cdFx0cmV0dXJuIGMgLyAyICogKCh0IC09IDIpICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0ICsgcykgKyAyKSArIGI7XHJcblx0fSxcclxuLyoqXHJcbiAqIEBmdW5jdGlvblxyXG4gKiBAZGVzY3JpcHRpb24gSW50ZXJmYWNlIGZvciBlYXNpbmcgZnVuY3Rpb25zLlxyXG4gKiBAbWVtYmVyb2YgZWFzaW5nRXF1YXRpb25zXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50SXRlcmF0aW9uIC0gVGhlIGN1cnJlbnQgaXRlcmF0aW9uIGFzIGEgcHJvcG9ydGlvbiBvZiB0aGUgdG90YWxJdGVyYXRpb24gcGFyYW1ldGVyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnRWYWx1ZSAtIFRoZSBzdGFydGluZyB2YWx1ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2hhbmdlSW5WYWx1ZSAtIFRoZSBjaGFuZ2UgdmFsdWUgcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxJdGVyYXRpb25zIC0gVGhlIHRvdGFsIGl0ZXJhdGlvbnMgb2YgdGhlIGVhc2luZyBjdXJ2ZSB0byBjYWxjdWxhdGUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIGNhbGN1bGF0ZWQgKGFic29sdXRlKSB2YWx1ZSBhbG9uZyB0aGUgZWFzaW5nIGN1cnZlXHJcbiAqL1xyXG5cdGVhc2VPdXRCb3VuY2U6IGZ1bmN0aW9uIGVhc2VPdXRCb3VuY2UodCwgYiwgYywgZCkge1xyXG5cdFx0aWYgKCh0IC89IGQpIDwgMSAvIDIuNzUpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogdCAqIHQpICsgYjtcclxuXHRcdH0gZWxzZSBpZiAodCA8IDIgLyAyLjc1KSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqICh0IC09IDEuNSAvIDIuNzUpICogdCArIC43NSkgKyBiO1xyXG5cdFx0fSBlbHNlIGlmICh0IDwgMi41IC8gMi43NSkge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAyLjI1IC8gMi43NSkgKiB0ICsgLjkzNzUpICsgYjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqICh0IC09IDIuNjI1IC8gMi43NSkgKiB0ICsgLjk4NDM3NSkgKyBiO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07XHJcblxyXG4vKipcclxuICogQGZ1bmN0aW9uXHJcbiAqIEBkZXNjcmlwdGlvbiBJbnRlcmZhY2UgZm9yIGVhc2luZyBmdW5jdGlvbnMuXHJcbiAqIEBtZW1iZXJvZiBlYXNpbmdFcXVhdGlvbnNcclxuICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRJdGVyYXRpb24gLSBUaGUgY3VycmVudCBpdGVyYXRpb24gYXMgYSBwcm9wb3J0aW9uIG9mIHRoZSB0b3RhbEl0ZXJhdGlvbiBwYXJhbWV0ZXIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydFZhbHVlIC0gVGhlIHN0YXJ0aW5nIHZhbHVlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2VJblZhbHVlIC0gVGhlIGNoYW5nZSB2YWx1ZSByZWxhdGl2ZSB0byB0aGUgc3RhcnQgdmFsdWUuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbEl0ZXJhdGlvbnMgLSBUaGUgdG90YWwgaXRlcmF0aW9ucyBvZiB0aGUgZWFzaW5nIGN1cnZlIHRvIGNhbGN1bGF0ZS5cclxuICogQHJldHVybnMge251bWJlcn0gLSBUaGUgY2FsY3VsYXRlZCAoYWJzb2x1dGUpIHZhbHVlIGFsb25nIHRoZSBlYXNpbmcgY3VydmVcclxuICovXHJcbmVhc2luZ0VxdWF0aW9ucy5lYXNlSW5Cb3VuY2UgPSBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xyXG5cdHJldHVybiBjIC0gZWFzaW5nRXF1YXRpb25zLmVhc2VPdXRCb3VuY2UoZCAtIHQsIDAsIGMsIGQpICsgYjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZnVuY3Rpb25cclxuICogQGRlc2NyaXB0aW9uIEludGVyZmFjZSBmb3IgZWFzaW5nIGZ1bmN0aW9ucy5cclxuICogQG1lbWJlcm9mIGVhc2luZ0VxdWF0aW9uc1xyXG4gKiBAcGFyYW0ge251bWJlcn0gY3VycmVudEl0ZXJhdGlvbiAtIFRoZSBjdXJyZW50IGl0ZXJhdGlvbiBhcyBhIHByb3BvcnRpb24gb2YgdGhlIHRvdGFsSXRlcmF0aW9uIHBhcmFtZXRlci5cclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0VmFsdWUgLSBUaGUgc3RhcnRpbmcgdmFsdWVcclxuICogQHBhcmFtIHtudW1iZXJ9IGNoYW5nZUluVmFsdWUgLSBUaGUgY2hhbmdlIHZhbHVlIHJlbGF0aXZlIHRvIHRoZSBzdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsSXRlcmF0aW9ucyAtIFRoZSB0b3RhbCBpdGVyYXRpb25zIG9mIHRoZSBlYXNpbmcgY3VydmUgdG8gY2FsY3VsYXRlLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSBjYWxjdWxhdGVkIChhYnNvbHV0ZSkgdmFsdWUgYWxvbmcgdGhlIGVhc2luZyBjdXJ2ZVxyXG4gKi9cclxuZWFzaW5nRXF1YXRpb25zLmVhc2VJbk91dEJvdW5jZSA9IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XHJcblx0aWYgKHQgPCBkIC8gMikgcmV0dXJuIGVhc2luZ0VxdWF0aW9ucy5lYXNlSW5Cb3VuY2UodCAqIDIsIDAsIGMsIGQpICogLjUgKyBiO1xyXG5cdHJldHVybiBlYXNpbmdFcXVhdGlvbnMuZWFzZU91dEJvdW5jZSh0ICogMiAtIGQsIDAsIGMsIGQpICogLjUgKyBjICogLjUgKyBiO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZWFzaW5nRXF1YXRpb25zID0gZWFzaW5nRXF1YXRpb25zOyIsIi8qKlxyXG4qIHByb3ZpZGVzIG1hdGhzIHV0aWxpbGl0eSBtZXRob2RzIGFuZCBoZWxwZXJzLlxyXG4qXHJcbiogQG1vZHVsZSBtYXRoVXRpbHNcclxuKi9cclxuXHJcbnZhciBtYXRoVXRpbHMgPSB7XHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBHZW5lcmF0ZSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tSW50ZWdlcjogZnVuY3Rpb24gcmFuZG9tSW50ZWdlcihtaW4sIG1heCkge1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggKyAxIC0gbWluKSApICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gR2VuZXJhdGUgcmFuZG9tIGZsb2F0IGJldHdlZW4gMiB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IC0gbWF4aW11bSB2YWx1ZS5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRyYW5kb206IGZ1bmN0aW9uIHJhbmRvbShtaW4sIG1heCkge1xyXG5cdFx0aWYgKG1pbiA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdG1pbiA9IDA7XHJcblx0XHRcdG1heCA9IDE7XHJcblx0XHR9IGVsc2UgaWYgKG1heCA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdG1heCA9IG1pbjtcclxuXHRcdFx0bWluID0gMDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcblx0fSxcclxuXHJcblx0Z2V0UmFuZG9tQXJiaXRyYXJ5OiBmdW5jdGlvbiBnZXRSYW5kb21BcmJpdHJhcnkobWluLCBtYXgpIHtcclxuXHRcdHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcblx0fSxcclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIFRyYW5zZm9ybXMgdmFsdWUgcHJvcG9ydGlvbmF0ZWx5IGJldHdlZW4gaW5wdXQgcmFuZ2UgYW5kIG91dHB1dCByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gdGhlIHZhbHVlIGluIHRoZSBvcmlnaW4gcmFuZ2UgKCBtaW4xL21heDEgKS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbjEgLSBtaW5pbXVtIHZhbHVlIGluIG9yaWdpbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heDEgLSBtYXhpbXVtIHZhbHVlIGluIG9yaWdpbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbjIgLSBtaW5pbXVtIHZhbHVlIGluIGRlc3RpbmF0aW9uIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4MiAtIG1heGltdW0gdmFsdWUgaW4gZGVzdGluYXRpb24gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjbGFtcFJlc3VsdCAtIGNsYW1wIHJlc3VsdCBiZXR3ZWVuIGRlc3RpbmF0aW9uIHJhbmdlIGJvdW5kYXJ5cy5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRtYXA6IGZ1bmN0aW9uIG1hcCh2YWx1ZSwgbWluMSwgbWF4MSwgbWluMiwgbWF4MiwgY2xhbXBSZXN1bHQpIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdHZhciByZXR1cm52YWx1ZSA9ICh2YWx1ZSAtIG1pbjEpIC8gKG1heDEgLSBtaW4xKSAqIChtYXgyIC0gbWluMikgKyBtaW4yO1xyXG5cdFx0aWYgKGNsYW1wUmVzdWx0KSByZXR1cm4gc2VsZi5jbGFtcChyZXR1cm52YWx1ZSwgbWluMiwgbWF4Mik7ZWxzZSByZXR1cm4gcmV0dXJudmFsdWU7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBDbGFtcCB2YWx1ZSBiZXR3ZWVuIHJhbmdlIHZhbHVlcy5cclxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gdGhlIHZhbHVlIGluIHRoZSByYW5nZSB7IG1pbnxtYXggfS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIG1pbmltdW0gdmFsdWUgaW4gdGhlIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IC0gbWF4aW11bSB2YWx1ZSBpbiB0aGUgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjbGFtcFJlc3VsdCAtIGNsYW1wIHJlc3VsdCBiZXR3ZWVuIHJhbmdlIGJvdW5kYXJ5cy5cclxuICovXHJcblx0Y2xhbXA6IGZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW4sIG1heCkge1xyXG5cdFx0aWYgKG1heCA8IG1pbikge1xyXG5cdFx0XHR2YXIgdGVtcCA9IG1pbjtcclxuXHRcdFx0bWluID0gbWF4O1xyXG5cdFx0XHRtYXggPSB0ZW1wO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4odmFsdWUsIG1heCkpO1xyXG5cdH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWF0aFV0aWxzOyJdfQ==
