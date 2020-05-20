/**
* @description function signature for easeOutBounce. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/

function easeOutBounce(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations
) {
    if ( ( currentIteration /= totalIterations ) < 1 / 2.75 ) {
        return changeInValue * ( 7.5625 * currentIteration * currentIteration ) + startValue;
    } else if ( currentIteration < 2 / 2.75 ) {
        return changeInValue * ( 7.5625 * ( currentIteration -= 1.5 / 2.75 ) * currentIteration + .75 ) + startValue;
    } else if ( currentIteration < 2.5 / 2.75 ) {
        return changeInValue * ( 7.5625 * ( currentIteration -= 2.25 / 2.75 ) * currentIteration + .9375 ) + startValue;
    } else {
        return changeInValue * ( 7.5625 * ( currentIteration -= 2.625 / 2.75 ) * currentIteration + .984375 ) + startValue;
    }
}

module.exports = easeOutBounce;