/**
* @description function signature for easeInElastic. Note the {startValue} should not change for the function lifecycle (until {currentIteration} equals {totaliterations}) otherwise the return value will be multiplied exponentially
* @memberof easingEquations
* @param {number} currentIteration - The current iteration/cycle as a proportion of the totalIteration parameter.
* @param {number} startValue - The starting value
* @param {number} changeInValue - The change value relative to the start value.
* @param {number} totalIterations - The total iterations of the easing curve to calculate.
* @returns {number} - The value along the easing curve calculated from the {startValue} to the final value ({startValue} + {changeInValue}).
*/

function easeInElastic(
    currentIteration,
    startValue,
    changeInValue,
    totalIterations
) {
    var s = 1.70158;
		var p = 0;
		var a = changeInValue;
		if (currentIteration == 0) return startValue;
		if ((currentIteration /= totalIterations) == 1) return startValue + changeInValue;
		if (!p) p = totalIterations * .3;
		if (a < Math.abs(changeInValue)) {
			a = changeInValue;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(changeInValue / a)
		};
		return -(a * Math.pow(2, 10 * (currentIteration -= 1)) * Math.sin((currentIteration * totalIterations - s) * (2 * Math.PI) / p)) + startValue;
}

module.exports = easeInElastic;