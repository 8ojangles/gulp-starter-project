let easing = require( '../../utils/easing.js' ).easingEquations;

function createBlurArray( blurCount, minBlurDist, maxBlurDist, ease ){
	let tmp = [];
	let easeFn = easing[ ease ];
	let changeDelta = maxBlurDist - minBlurDist;
	for( let i = 0; i < blurCount; i++ ) {
		tmp.push(
			Math.floor( easeFn( i, minBlurDist, changeDelta, blurCount ) )
		);
	}
	return tmp;
};

module.exports = createBlurArray;