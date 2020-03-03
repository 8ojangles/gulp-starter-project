let checkCanvasSupport = require( './checkCanvasSupport.js' );
let cLightning = require( './canvasDemo.js' ).startLightningAnimation;
let contentSVGHighlight = require( './contentSVGHighlight.js' ).contentSVGHighlight; 
let detectTransitionEnd = require( './detectTransitionEndEventCompat.js'); 
let transEndEvent = detectTransitionEnd();


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
	let thisHeight = `${$linkedEl.attr( 'data-open-height' )}px`;

	if ( $linkedEl.hasClass( 'is-active' ) ) {
		$linkedEl
			.css( { 'height':  0 } )
			.removeClass( 'is-active' );
		$this.removeClass( 'is-active' );
	} else {
		$linkedEl
			.css( { 'height':  thisHeight } )
			.addClass( 'is-active' );

		$this.addClass( 'is-active' );
	}
 
} );

});

window.onload = function() {

	if ( $( '.toc' ).length > 0 ) {
		contentSVGHighlight();
	}
	
	if( checkCanvasSupport() ){
		if ( $( '#canvas' ).length > 0 ) {
			cLightning( '#canvas', document.querySelector( '#canvas' ).parentElement );	
		}
	}

};