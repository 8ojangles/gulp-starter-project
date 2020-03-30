let mathUtils = require( './mathUtils.js' );
let easing = require( './easing.js' ).easingEquations;
let trig = require( './trigonomicUtils.js' ).trigonomicUtils;
let plotPoints = require( './plotPathPoints.js');
let updatePath = require( './updatePath.js' );
let renderPath = require( './renderPath.js' );
// lightning path constructor

function updateSequenceClock(){
	if ( this.sequenceClock < this.sequences[ this.sequenceIndex ].time ) {
		this.sequenceClock++;
	} else {
		if ( this.sequenceIndex < this.sequences.length - 1 ) {
			this.sequenceClock = 0;
			this.sequenceIndex++;
		} else {
			this.sequenceClock = 0;
			this.sequenceIndex = 0;
			this.isActive = false;
		}
	}
}

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

	return {
		// flags
		isChild: opts.isChild || false,
		isActive: opts.isActive || false,
		isRendering: opts.isRendering || false,
		willStrike: opts.willStrike || false,
		// config
		branchDepth: opts.branchDepth || 0,
		renderOffset: opts.renderOffset || 0,
		// clocks
		clock: opts.clock || 0,
		sequenceClock: opts.sequenceClock || 0,
		totalClock: opts.totalClock || 0,
		sequences: opts.sequences || [],
		sequenceStartIndex: opts.sequenceStartIndex || 0,
		sequenceIndex: opts.sequenceIndex || 0,
		// colors
		colR: opts.colR || 255,
		colG: opts.colG || 255,
		colB: opts.colB || 255,
		colA: opts.isChild ? 0.5 : opts.colA,
		glowColApha:  opts.glowColApha || 1,
		// computed config
		baseAngle: trig.angle( opts.startX, opts.startY, opts.endX, opts.endY ),
		baseDist: trig.dist( opts.startX, opts.startY, opts.endX, opts.endY ),
		update: updatePath,
		render: renderPath,
		updateSequenceClock: updateSequenceClock,
		// the actual path
		path: newPath
	};
}

module.exports = createPathFromOptions;