let detectTransitionEnd = require( './detectTransitionEndEventCompat.js'); 
let transEndEvent = detectTransitionEnd();

let thisVar = 200;
function measureEls( arr ) {
	arrLen = arr.length;
	for( let i = arrLen - 1; i >= 0; i-- ) {
		let currEl = $( arr[ i ] );
		let currElContent = currEl.find( '[ data-reveal-content ]' );
		let thisHeight = currEl.innerHeight();

		currEl
			.attr( 'data-open-height', thisHeight )
			.css( {
				'height':  thisHeight,
			} )
			.addClass( 'scaledY-zero transitioner' );
		currElContent.addClass( 'scaledY-dble' );
	}
}

$( document ).ready( ()=> {

let $revealEls = $( '[ data-reveal-target ]' );
measureEls( $revealEls );

$( '[ data-reveal-trigger ]' ).click( function( e ){
	$this = $( this );
	$linkedEl = $( `[ data-reveal-target="${$this.attr( 'data-reveal-trigger' )}" ]` );
	let openHeight = $linkedEl.attr( 'data-open-height' )+'px';
	$linkedElContent = $linkedEl.find( '[ data-reveal-content ]' );

	if ( $linkedEl.hasClass( 'is-active' ) ) {
		$linkedEl.removeClass( 'is-active scaledY-init' ).addClass( 'scaledY-zero' );
		$linkedElContent.removeClass( 'scaledY-init' ).addClass( 'scaledY-dble' );
		$this.removeClass( 'is-active' );
	} else {

		// $linkedEl.removeClass( 'transitioner' );
		$linkedEl
			.removeClass( 'scaledY-zero' )
			.addClass( 'is-active scaledY-init transitioner' );
		$linkedElContent
			.removeClass( 'scaledY-dble' )
			.addClass( 'transitioner scaledY-init' );

		$this.addClass( 'is-active' );
	}
 
} );

});

