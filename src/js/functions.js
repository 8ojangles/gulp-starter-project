let thisVar = 200;
function measureEls( arr ) {
	arrLen = arr.length;
	for( let i = arrLen - 1; i >= 0; i-- ) {
		let currEl = $( arr[ i ] );
		let thisHeight = currEl.innerHeight();
		console.log( i+": height: "+ thisHeight );
		currEl
			.attr( 'data-open-height', thisHeight )
			.css( 'height', "0" )
			.addClass( 'transioner' );
	}
}

$( document ).ready( ()=> {

let $codeExamples = $( '.js-ks-item-code' );
measureEls( $codeExamples );

$( '.js-show-code' ).click( function( e ){
	$this = $( this );
	$linkedEl = $( '.js-ks-item-code[ data-code-example="'+$this.attr( 'data-code-example' )+'" ]' );
	$linkedEl.hasClass( 'is-active' ) ?
		( $linkedEl.css( 'height', 0 ).removeClass( 'is-active' ),
		$this.removeClass( 'is-active' ) ) :
		( $linkedEl.css( 'height', $linkedEl.attr( 'data-open-height' )+'px' ).addClass( 'is-active' ),
			$this.addClass( 'is-active' ) );
} );

});

