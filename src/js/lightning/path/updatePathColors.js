let mathUtils = require( '../../mathUtils.js' );
let easing = require( '../../easing.js' ).easingEquations;
let trig = require( '../../trigonomicUtils.js' ).trigonomicUtils;

function updatePathColors() {
	let p = this;

	let sq = this.sequences[ this.sequenceIndex ];
	let t = sq.time;
	let cT = this.sequenceClock;
	
}

module.exports = updatePathColors;