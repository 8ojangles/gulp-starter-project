let checkCanvasSupport = require( './checkCanvasSupport.js' );
let cLightning = require( './canvasDemo.js' ).startLightningAnimation;
let contentSVGHighlight = require( './contentSVGHighlight.js' ).contentSVGHighlight; 
let detectTransitionEnd = require( './detectTransitionEndEventCompat.js'); 
let transEndEvent = detectTransitionEnd();

/**
 * @description Given array of jQuery DOM elements the fN iterates over each
 * member, measures it's height, logs the height as a number and attaches
 * as a custom element. The fN then applies a height of 0 via inline
 * styling and adds the "transitioner" class.
 * @param {jQuery} arr - the array of DOM elements to measure.
 */
function measureEls( arr ) {
	/**
	* The length of the array
	* @type {number}
	* @memberof measureEls
	*/
	arrLen = arr.length;
	for( let i = arrLen - 1; i >= 0; i-- ) {
		/**
		* The current iteratee
		* @type {HTMLElement}
		* @memberof measureEls
		* @inner
		*/
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
	/**
	* The clicked element
	* @type {HTMLElement}
	* @inner
	*/
	$this = $( this );
	/**
	* The element linked to the clicked element by custom data attributes 
	* @type {HTMLElement}
	* @inner
	*/
	$linkedEl = $( `[ data-reveal-target="${$this.attr( 'data-reveal-trigger' )}" ]` );
	/**
	* The height of the linked element  in it's maximum open state 
	* @type {number}
	* @inner
	*/
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