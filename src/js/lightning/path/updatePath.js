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

	if ( pathCfg.isChild === false ) {
		if ( p.renderConfig.currHead >= pathLen ) {
			pStatus.renderPhase = 1;

			if ( pathCfg.currSequence === false ) {
				if ( pathCfg.playSequence === false ) {
					pathCfg.startSequence( { index: pathCfg.sequenceStartIndex } );
				}
			}
		}
		// if ( pathCfg.sequenceIndex === 1 ) {
		// 	if ( pathCfg.playSequence === false ) {
		// 		pathCfg.startSequence( { index: pathCfg.sequenceStartIndex } );
		// 	}
		// }
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

	if (pStatus.renderPhase === 2 ) {
		// if ( pathCfg.colR > 0 ) {
		// 	pathCfg.colR -= 5;
		// 	pathCfg.colG -= 5;
		// 	pathCfg.colB -= 5;
		// 	pathCfg.colA -= 0.001;
		// }
	}

	if ( pathCfg.playSequence === true ) {
		pathCfg.updateSequence();
	}

}

module.exports = updatePath;