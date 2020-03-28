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
				thisPathCfg.colA -= 0.02;
			}
		}
	}

	if ( thisPathLen + rndOffset < renderCfg.currHead) {
		// currRenderTail += renderCfg.currHead;
		thisPathCfg.isRendering = false;
	}
}

module.exports = updatePath;