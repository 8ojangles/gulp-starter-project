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

function easeOutBack(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations,
    overshoot
) {
    if ( overshoot == undefined ) overshoot = 1.70158;
    return changeInValue * ( ( currentIteration = currentIteration / totalIterations - 1 ) * currentIteration * ( ( overshoot + 1 ) * currentIteration + overshoot ) + 1 ) + startValue;
}

module.exports = easeOutBack;