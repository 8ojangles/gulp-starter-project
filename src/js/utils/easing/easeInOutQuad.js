/**
* @summary function signature for easeInOutQuad. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations  
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/

function easeInOutQuad(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations
) {
    if ((currentIteration /= totalIterations / 2) < 1) {
        return changeInValue / 2 * currentIteration * currentIteration + startValue;
    }
    return -changeInValue / 2 * (--currentIteration * (currentIteration - 2) - 1) + startValue;
}

module.exports = easeInOutQuad;