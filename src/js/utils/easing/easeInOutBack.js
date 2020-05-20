/**
* @description function signature for easeInOutBack. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @param {number} [overshoot=1.70158] - a ratio of the {startValue} and {changeInValue} to give the effect of "overshooting" the initial {startValue} (easeIn*), "overshooting" final value {startValue + changeInValue} (easeOut*) or both (easeInOut*).
* @returns {number} - The calculated (absolute) value along the easing curve
*/

function easeInOutBack(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations,
    overshoot
) {
    if ( overshoot == undefined ) overshoot = 1.70158;
    if ( ( currentIteration /= totalIterations / 2 ) < 1 ) {
        return changeInValue / 2 * ( currentIteration * currentIteration * (( ( overshoot *= 1.525 ) + 1 ) * currentIteration - overshoot ) ) + startValue;
    }
    return changeInValue / 2 * ( ( currentIteration -= 2 ) * currentIteration * ( ( ( overshoot *= 1.525 ) + 1 ) * currentIteration + overshoot ) + 2 ) + startValue;
}

module.exports = easeInOutBack;