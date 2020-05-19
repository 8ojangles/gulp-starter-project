const linearEase = require( './easing/linearEase.js' );
const easeInQuad = require( './easing/easeInQuad.js' );
const easeOutQuad = require( './easing/easeOutQuad.js' );
const easeInOutQuad = require( './easing/easeInOutQuad.js' );
const easeInCubic = require( './easing/easeInCubic.js' );
// requires definition in-file to take advantage of "@callback" reusability
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
	easeOutCubic: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
	},
	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeInOutCubic' curve
 	* @memberof easingEquations
 	*/
	easeInOutCubic: function(currentIteration, startValue, changeInValue, totalIterations) {
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
	easeInQuart: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
	},
	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeOutQuart' curve
 	* @memberof easingEquations
 	*/
	easeOutQuart: function(currentIteration, startValue, changeInValue, totalIterations) {
		return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
	},
	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeInOutQuart' curve
 	* @memberof easingEquations
 	*/
	easeInOutQuart: function(currentIteration, startValue, changeInValue, totalIterations) {
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
	easeInQuint: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
	},

	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeOutQuint' curve
 	* @memberof easingEquations
 	*/
	easeOutQuint: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
	},
	
	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeInOutQuint' curve
 	* @memberof easingEquations
 	*/
	easeInOutQuint: function(currentIteration, startValue, changeInValue, totalIterations) {
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
	easeInSine: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
	},
	
	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeOutSine' curve
 	* @memberof easingEquations
 	*/
	easeOutSine: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
	},
	
	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeInOutSine' curve
 	* @memberof easingEquations
 	*/
	easeInOutSine: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
	},
	
	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeInExpo' curve
 	* @memberof easingEquations
 	*/
	easeInExpo: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
	},
	
	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeOutExpo' curve
 	* @memberof easingEquations
 	*/
	easeOutExpo: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
	},

	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeInOutExpo' curve
 	* @memberof easingEquations
 	*/
	easeInOutExpo: function(currentIteration, startValue, changeInValue, totalIterations) {
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
	easeInCirc: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
	},

	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeOutCirc' curve
 	* @memberof easingEquations
 	*/
	easeOutCirc: function(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
	},

	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeInOutCirc' curve
 	* @memberof easingEquations
 	*/
	easeInOutCirc: function(currentIteration, startValue, changeInValue, totalIterations) {
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
	easeInElastic: function(currentIteration, startValue, changeInValue, totalIterations) {
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
			var s = p / (2 * Math.PI) * Math.asin(changeInValue / a)
		};
		return -(a * Math.pow(2, 10 * (currentIteration -= 1)) * Math.sin((currentIteration * totalIterations - s) * (2 * Math.PI) / p)) + startValue;
	},

	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeOutElastic' curve
 	* @memberof easingEquations
 	*/
	easeOutElastic: function(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},

	/**
	* @method
 	* @type {easingFn}
 	* @description easing method for the 'easeInOutElastic' curve
 	* @memberof easingEquations
 	*/
	easeInOutElastic: function(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
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
	easeInBack: function(t, b, c, d, s) {
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
	easeOutBounce: function(t, b, c, d) {
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
	easeInBounce: function(currentIteration, startValue, changeInValue, totalIterations) {
		let self = this;
		return changeInValue - self.easeOutBounce(totalIterations - currentIteration, 0, changeInValue, totalIterations) + startValue;
	}
	

};

// /**
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