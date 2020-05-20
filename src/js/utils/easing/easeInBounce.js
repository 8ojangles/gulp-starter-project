const easeOutBounce = require( './easeOutBounce.js' )

/**
* @description function signature for easeInBounce. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/

function easeInBounce(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations
) {
    return changeInValue - easeOutBounce( totalIterations - currentIteration, 0, changeInValue, totalIterations ) + startValue;
}

module.exports = easeInBounce;