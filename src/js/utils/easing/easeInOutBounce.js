const easeInBounce = require( './easeInBounce.js' );
const easeOutBounce = require( './easeOutBounce.js' );

/**
* @description function signature for easeInOutBounce. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/

function easeInOutBounce(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations
) {
    if ( currentIteration < totalIterations / 2 ) {
        return easeInBounce( currentIteration * 2, 0, changeInValue, totalIterations ) * .5 + startValue;
    }
	return easeOutBounce( currentIteration * 2 - totalIterations, 0, changeInValue, totalIterations ) * .5 + changeInValue * .5 + startValue;
}

module.exports = easeInOutBounce;