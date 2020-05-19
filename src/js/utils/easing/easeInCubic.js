/**
* @description function signature for easeInCubic. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially  
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/

function easeInCubic(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations
) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
}

module.exports = easeInCubic;