let cLightning = require( './canvasDemo.js' ).startLightningAnimation;
let checkCanvasSupport = require( './checkCanvasSupport.js' );

window.onload = function() {
	if( checkCanvasSupport() ) {
        cLightning( '#lightningDrawingTest' );
	}
};