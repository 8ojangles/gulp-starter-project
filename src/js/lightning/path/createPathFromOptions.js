require('../../typeDefs');
/**
@typedef {import("../../typeDefs").pathObject} pathObject
@typedef {import("../../typeDefs").createPathOptions} createPathOptions
@typedef {import("../../typeDefs").Point} Point
*/

const trig = require( '../../utils/trigonomicUtils.js' ).trigonomicUtils;
const plotPathPoints = require( './plotPathPoints.js' );
const drawPaths = require( './drawPath.js' );
const redrawPath = require( './redrawPaths.js' );
const updatePath = require( './updatePath.js' );
const renderPath = require( './renderPath.js' );
const mainPathAnimSequence = require( `../sequencer/mainPathAnimSequence.js` );
const startSequence = require( `../sequencer/startSequence.js` );
const updateSequenceClock = require( `../sequencer/updateSequenceClock.js` );
const updateSequence = require( `../sequencer/updateSequence.js` );
const setupSequences = require( `../sequencer/setupSequences.js` );

/**
* createPathFromOptions
* @description create path object from provide options {opts}.
* @see {@link createPathOptions} for constructor options
* @see {@link pathObject} for function return object members
* @param {...createPathOptions} opts - the constructor options and paremeters for the path.
* @returns {pathObject} - the calculated path object containing parameters, flags, path coordinate arrays and constructed path2d() primitives.
*/

function createPathFromOptions( opts ) {

	/**
	 * @name newPath
	 * @memberof createPathFromOptions
	 * @type {Array<Point>}
	 * @static
	 * @description Array of {@link Point|Points} created by the {@link plotPathPoints} function from options supplied in the parent function's {opts} parameters
	*/

	let _newPath = plotPathPoints({
		startX: opts.startX,
		startY: opts.startY,
		endX: opts.endX,
		endY: opts.endY,
		subdivisions: opts.subdivisions, 
		isChild: opts.isChild
	});

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
		path: _newPath,
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