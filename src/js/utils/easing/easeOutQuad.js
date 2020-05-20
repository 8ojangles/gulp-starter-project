/**
* @summary function signature for easeOutQuad. Note the {startValue} should not change for the function lifecycle (where {currentIteration equals {totaliterations}) otherwise the return value will be multiplied exponentially. See {@link https://easings.net/#easeOutQuad easeOutQuad} for a visual representation of the curve and further information.
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/

function easeOutQuad(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations
) {
    return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
}

module.exports = easeOutQuad;