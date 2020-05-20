/**
* @summary function signature for linearEase. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially.
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/

function linearEase(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations
) {
    return changeInValue * currentIteration / totalIterations + startValue;
}

module.exports = linearEase;