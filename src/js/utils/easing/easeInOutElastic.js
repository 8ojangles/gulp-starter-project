/**
* @description function signature for easeInOutElastic. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/

function easeInOutElastic(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations
) {
    var s = 1.70158;
    var p = 0;
    var a = changeInValue;
    if ( currentIteration == 0 ) return startValue;
    if ( ( currentIteration /= totalIterations / 2 ) == 2 ) return startValue + changeInValue;
    if ( !p ) p = totalIterations * ( .3 * 1.5 );
    if ( a < Math.abs( changeInValue ) ) {
        a = changeInValue;
        var s = p / 4;
    } else {
        var s = p / ( 2 * Math.PI ) * Math.asin( changeInValue  / a );
    };
    if ( currentIteration < 1 ) {
        return -.5 * ( a * Math.pow( 2, 10 * ( currentIteration -= 1 ) ) * Math.sin( ( currentIteration * totalIterations - s ) * ( 2 * Math.PI ) / p ) ) + startValue;
    }
    return a * Math.pow( 2, -10 * ( currentIteration -= 1 ) ) * Math.sin( ( currentIteration * totalIterations - s ) * ( 2 * Math.PI) / p ) * .5 + changeInValue + startValue;
}

module.exports = easeInOutElastic;