let mathUtils = require( '../../utils/mathUtils.js' );
let easing = require( '../../utils/easing.js' ).easingEquations;
let trig = require( '../../utils/trigonomicUtils.js' ).trigonomicUtils;

// path update function

function updatePath( parentConfig, globalConfig ) {

	let rCfg = globalConfig.renderConfig
	let p = parentConfig;
	let pState = p.state.states;
	let pathCfg = this;
	let pathLen = pathCfg.path.length;
	let rndOffset = pathCfg.renderOffset;

	if ( pState.isDrawn === true ) {

		if ( p.willConnect === false ) {
			if ( pathCfg.playSequence === false ) {
				pathCfg.playSequence = true; 
				pathCfg.startSequence( {index: 0} );
			}
		} else {

			
			
		}

	}

	if ( pathLen + rndOffset < p.renderConfig.currHead) {
		pathCfg.isRendering = false;
	}

	pathCfg.updateSequence();

	return this;
}

module.exports = updatePath;