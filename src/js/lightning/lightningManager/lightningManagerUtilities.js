let createBlurArray = require( './createBlurArray.js' );
let mathUtils = require( '../../utils/mathUtils.js' );

// state list declarations
const IS_UNINITIALISED = 'isUninitialised';
const IS_INITIALISED = 'isInitialised';
const IS_ACTIVE = 'isActive';
const IS_DRAWING = 'isDrawing';
const IS_DRAWN = 'isDrawn';
const IS_CONNECTED = 'isConnected';
const IS_REDRAWING = 'isRedrawing';
const IS_ANIMATED = 'isAnimating';
const IS_FIELDEFFECT = 'isFieldEffect';
const IS_COUNTDOWN = 'isCountdown';
const IS_COMPLETE = 'isComplete';
const IS_COUNTDOWNCOMPLETE = 'isCountdownComplete';

function setState( stateName ) {
	let states = this.state.states;
	const entries = Object.entries( states );
	const entriesLen = entries.length;
	for( let i = 0; i < entriesLen; i++ ) {
		let thisEntry = entries[ i ];
		let thisEntryName = thisEntry[ 0 ];
		if( thisEntryName === stateName ) {
			states[ stateName ] = true;
			this.state.current = thisEntryName;
		}
	}
};

function getCurrentState() {
	return this.state.current;
}

function updateRenderConfig() {
	this.renderConfig.currHead += this.renderConfig.segmentsPerFrame;
	return this;
}

function createLightningParent( opts, arr ) {

	let lInstance = {
		speed: opts.speed || 1,
		isDrawn: false,
		isAnimated: opts.isAnimated || false,
		willConnect: opts.willConnect || false,
		skyFlashAlpha: opts.skyFlashAlpha || 0.2,
		originFlashAlpha: opts.originFlashAlpha || 1,
		glowBlurIterations: createBlurArray(
			mathUtils.randomInteger( 2, 6 ),
			30,
			100,
			'linearEase'
		),
		clock: 0,
		totalClock: opts.willConnect ? mathUtils.randomInteger( 10, 60 ) : 0,
		state: {
			current: 'isUninitialised',
			states: {
				isUninitialised: true,
				isInitialised: false,
				isActive: false,
				isDrawing: false,
				isDrawn: false,
				isConnected: false,
				isRedrawing: false,
				isAnimating: false,
				isFieldEffect: false,
				isCountdown: false,
				isCountdownComplete: false,
				isComplete: false
			}
		},
		actions: {

		},
		stateActions: {
			isConnected: {
				
			}
		},
		setState: setState,
		getCurrentState: getCurrentState,
		renderConfig: {
			currHead: 0,
			segmentsPerFrame: opts.speed || 1
		},
		updateRenderConfig: updateRenderConfig,
		paths: opts.tempPaths || []
	};

	arr.push( lInstance );

}

module.exports.createLightningParent = createLightningParent;
