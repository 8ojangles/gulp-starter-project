let mathUtils = require( '../../mathUtils.js' );
let easing = require( '../../easing.js' ).easingEquations;
let trig = require( '../../trigonomicUtils.js' ).trigonomicUtils;

// path update function

function updatePath( parentConfig, globalConfig ) {

	let rCfg = globalConfig.renderConfig
	let p = parentConfig;
	let pStatus = p.status;
	let pathCfg = this;
	let pathLen = pathCfg.path.length;
	let rndOffset = pathCfg.renderOffset;	

	// console.log( "this: ", this );

	if ( pathCfg.isChild === false ) {
		if ( p.renderConfig.currHead >= pathLen ) {
			if ( pathCfg.playSequence === false ) {
				// console.log( 'starting 1st animation' );
				pathCfg.playSequence = true; 
				pathCfg.startSequence( {index: 0} );
			}
		}
	} else {
		if ( pathCfg.isRendering === false ) {
			if ( pathCfg.colA > 0 ) {
				pathCfg.colA -= 0.01;
			}
		}
	}

	if ( pathLen + rndOffset < p.renderConfig.currHead) {
		pathCfg.isRendering = false;
	}

	if ( pStatus.renderPhase >= 1 ) {
		if ( p.skyFlashAlpha > 0 ) {
			p.skyFlashAlpha -= 0.005;
		}
		if ( p.originFlashAlpha > 0 ) {
			p.originFlashAlpha -= 0.0005;
		}
	}

	pathCfg.updateSequence();
	// if ( pathCfg.playSequence === true ) {
	// 	pathCfg.updateSequence();
	// }

}

module.exports = updatePath;