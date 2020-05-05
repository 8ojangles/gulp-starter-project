
let mathUtils = require( '../../utils/mathUtils.js' );
let easing = require( '../../utils/easing.js' ).easingEquations;
let trig = require( '../../utils/trigonomicUtils.js' ).trigonomicUtils;

let plotPoints = require( './plotPathPoints.js' );
let drawPaths = require( './drawPath.js' );
let redrawPath = require( './redrawPaths.js' );
let updatePath = require( './updatePath.js' );
let renderPath = require( './renderPath.js' );

let childPathAnimSequence = require( `../sequencer/childPathAnimSequence.js` );
let mainPathAnimSequence = require( `../sequencer/mainPathAnimSequence.js` );
let startSequence = require( `../sequencer/startSequence.js` );
let updateSequenceClock = require( `../sequencer/updateSequenceClock.js` );
let updateSequence = require( `../sequencer/updateSequence.js` );
let setupSequences = require( `../sequencer/setupSequences.js` );

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

	// console.log( 'newPathLen: ', opts.isChild === false ? newPath.length : false );

	let chosenSequence = opts.sequences || mainPathAnimSequence;
	let thisSequences = setupSequences( chosenSequence );

	return {
		// flags
		isChild: opts.isChild || false,
		isActive: opts.isActive || false,
		isRendering: opts.isRendering || false,
		willStrike: opts.willStrike || false,
		// config
		branchDepth: opts.branchDepth || 0,
		// computed config
		baseAngle: trig.angle( opts.startX, opts.startY, opts.endX, opts.endY ),
		baseDist: trig.dist( opts.startX, opts.startY, opts.endX, opts.endY ),
		// colors
		colR: opts.pathColR || 255,
		colG: opts.pathColG || 255,
		colB: opts.pathColB || 255,
		colA: opts.isChild ? 0.5 : opts.pathColA ? opts.pathColA : 1,
		glowColR:  opts.glowColR || 255,
		glowColG:  opts.glowColG || 255,
		glowColB:  opts.glowColB || 255,
		glowColA:  opts.glowColA || 1,
		lineWidth: 1,
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
		drawPaths: drawPaths,
		redrawPath: redrawPath,
		update: updatePath,
		render: renderPath,
		// path rendering flags
		renderOffset: opts.renderOffset || 0,
		currHeadPoint: 0,
		// the actual path
		path: newPath,
		// saved paths
		savedPaths: {
			main: new Path2D(),
			offset: new Path2D(),
			originShort: new Path2D(),
			originLong: new Path2D()
		}
	};
}

module.exports = createPathFromOptions;