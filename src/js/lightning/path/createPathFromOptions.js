
let mathUtils = require( '../../mathUtils.js' );
let easing = require( '../../easing.js' ).easingEquations;
let trig = require( '../../trigonomicUtils.js' ).trigonomicUtils;

let plotPoints = require( './plotPathPoints.js' );
let updatePath = require( './updatePath.js' );
let renderPath = require( './renderPath.js' );

let childPathAnimSequence = require( `../sequencer/childPathAnimSequence.js` );
let mainPathAnimSequence = require( `../sequencer/mainPathAnimSequence.js` );
let startSequence = require( `../sequencer/startSequence.js` );
let updateSequenceClock = require( `../sequencer/updateSequenceClock.js` );
let updateSequence = require( `../sequencer/updateSequence.js` );

// lightning path constructor

// let drawPathSequence = {
// 	isActive: false,
// 	time: 100
// }

function createPathFromOptions( opts ) {

	let newPath = plotPoints({
		startX: opts.startX,
		startY: opts.startY,
		endX: opts.endX,
		endY: opts.endY,
		subdivisions: opts.subdivisions,
		dRange: opts.dRange, 
		isChild: opts.isChild
	});

	let thisSequences = opts.isChild ? childPathAnimSequence : mainPathAnimSequence;
	let thisAlpha = opts.isChild ? 0.5 : opts.colA ? opts.colA : 1;

	return {
		// flags
		isChild: opts.isChild || false,
		isActive: opts.isActive || false,
		isRendering: opts.isRendering || false,
		willStrike: opts.willStrike || false,
		// config
		branchDepth: opts.branchDepth || 0,
		renderOffset: opts.renderOffset || 0,
		// computed config
		baseAngle: trig.angle( opts.startX, opts.startY, opts.endX, opts.endY ),
		baseDist: trig.dist( opts.startX, opts.startY, opts.endX, opts.endY ),
		// colors
		colR: opts.colR || 255,
		colG: opts.colG || 255,
		colB: opts.colB || 255,
		colA: thisAlpha,
		glowColApha:  opts.glowColApha || 1,
		// clocks
		clock: opts.clock || 0,
		sequenceClock: opts.sequenceClock || 0,
		totalClock: opts.totalClock || 0,
		// anim sequences
		// main draw sequence
		drawPathSequence: opts.isChild ? false : true,
		// additional sequences
		sequences: thisSequences,
		sequenceStartIndex: opts.sequenceStartIndex || 0,
		sequenceIndex: opts.sequenceIndex || 0,
		playSequence: false,
		currSequence: false,
		startSequence: startSequence,
		updateSequence: updateSequence,
		updateSequenceClock: updateSequenceClock,
		update: updatePath,
		render: renderPath,
		// the actual path
		path: newPath
	};
}

module.exports = createPathFromOptions;