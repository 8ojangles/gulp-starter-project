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

	if ( p.renderConfig.currHead >= pathLen ) {
		if ( pathCfg.playSequence === false ) {
			pathCfg.playSequence = true; 
			pathCfg.startSequence( {index: 0} );
		}
	}

	if ( pathLen + rndOffset < p.renderConfig.currHead) {
		pathCfg.isRendering = false;
	}

	pathCfg.updateSequence();
	// if ( pathCfg.playSequence === true ) {
	// 	pathCfg.updateSequence();
	// }
	return this;
}

module.exports = updatePath;