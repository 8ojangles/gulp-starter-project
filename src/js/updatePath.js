let mathUtils = require( './mathUtils.js' );
let easing = require( './easing.js' ).easingEquations;
let trig = require( './trigonomicUtils.js' ).trigonomicUtils;
let plotPoints = require( './plotPathPoints.js');

// path update function

function updatePath( parentConfig, globalConfig ) {

	let renderCfg = globalConfig.renderConfig
	let parent = parentConfig;
	let thisPathCfg = this;
	let thisPathLen = thisPathCfg.path.length;
	let rndOffset = thisPathCfg.renderOffset;

	if ( thisPathCfg.isChild === false ) {
		if ( renderCfg.currHead >= thisPathLen ) {
			// switch to next renderPhase
			parent.status.renderPhase = 1;
		}
	} else {
		if ( thisPathCfg.isRendering === false ) {
			if ( thisPathCfg.colA > 0 ) {
				thisPathCfg.colA -= 0.005;
			}
		}
	}

	if ( thisPathLen + rndOffset < renderCfg.currHead) {
		// currRenderTail += renderCfg.currHead;
		thisPathCfg.isRendering = false;
	}

	if ( parent.status.renderPhase >= 1 ) {
		if ( parentConfig.skyFlashAlpha > 0 ) {
			parentConfig.skyFlashAlpha -= 0.001;
		}
	}

	if (parent.status.renderPhase === 2 ) {
		if ( thisPathCfg.colR > 0 ) {
			thisPathCfg.colR -= 5;
			thisPathCfg.colG -= 5;
			thisPathCfg.colB -= 5;
			thisPathCfg.colA -= 0.001;
		}
	}

	if ( parent.status.renderPhase === 1 )  {
		// console.log( 'parent.status.renderPhase: ', parent.status.renderPhase );
		// console.log( 'changing to phase 2');
		// parent.status.renderPhase = 2;
	};

	thisPathCfg.updateSequenceClock;
}

module.exports = updatePath;