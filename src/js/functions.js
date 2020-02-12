let canvasLightning = require( './canvasDemo.js' ).canvasLightning;
let contentSVGHighlight = require( './contentSVGHighlight.js' ).contentSVGHighlight; 

let detectTransitionEnd = require( './detectTransitionEndEventCompat.js'); 
let transEndEvent = detectTransitionEnd();

let thisVar = 200;
function measureEls( arr ) {
	arrLen = arr.length;
	for( let i = arrLen - 1; i >= 0; i-- ) {
		let currEl = $( arr[ i ] );

		currEl
			.attr( 'data-open-height', currEl.innerHeight() )
			.css( {
				'height':  0,
			} )
			.addClass( 'transitioner' );
	}
}

$( document ).ready( ()=> {

let $revealEls = $( '[ data-reveal-target ]' );
measureEls( $revealEls );

$( '[ data-reveal-trigger ]' ).click( function( e ){
	$this = $( this );
	$linkedEl = $( `[ data-reveal-target="${$this.attr( 'data-reveal-trigger' )}" ]` );
	let thisHeight = $linkedEl.attr( 'data-open-height' )+'px';

	if ( $linkedEl.hasClass( 'is-active' ) ) {
		$linkedEl
			.css( {
				'height':  0,
			} )
			.removeClass( 'is-active' );
		$this.removeClass( 'is-active' );
	} else {

		// $linkedEl.removeClass( 'transitioner' );
		$linkedEl
			.css( {
				'height':  thisHeight,
			} )
			.addClass( 'is-active' );

		$this.addClass( 'is-active' );
	}
 
} );

});


// check canvas support
var isCanvasSupported = function(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
};

window.onload = function() {
	contentSVGHighlight();

	if(isCanvasSupported){
		var c = document.getElementById( 'canvas' );
		var cw = c.width = c.parentNode.clientWidth;
		var ch = c.height = 300; 
		var cl = new canvasLightning( c, cw, ch );
		cl.init();
	}

};




// window.onload = function() { 
//   if(isCanvasSupported){
//     var c = document.getElementById('canvas');
//     var cw = c.width;
//     var ch = c.height; 
//     var cl = new canvasLightning( c, cw, ch );                
    
//     // setupRAF();
//     cl.init();
//   }
// };
