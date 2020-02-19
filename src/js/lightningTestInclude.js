let canvasLightning = require( './canvasDemo.js' ).canvasLightning;

var isCanvasSupported = function(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
};

window.onload = function() {
	

	if(isCanvasSupported){
		if ( $( '#lightningDrawingTest').length > 0 ) {
			var c = document.getElementById( 'lightningDrawingTest' );
			var cw = c.width = window.innerWidth;
			var ch = c.height = window.innerHeight; 
			var cl = new canvasLightning( c, cw, ch );
			cl.init();
		}
		
	}

};