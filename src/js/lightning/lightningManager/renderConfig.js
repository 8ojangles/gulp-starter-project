let mathUtils = require( '../../utils/mathUtils.js' );
let lightningStrikeTimeMax = 300;
let strikeDrawTime = lightningStrikeTimeMax / 2;
let strikeFireTime = lightningStrikeTimeMax / 6;
let strikeCoolTime = lightningStrikeTimeMax / 3;

const renderConfig = {
	blurIterations: mathUtils.randomInteger( 5, 8 ),
	blurRenderOffset: 10000,
	currHead: 0,
	timing: {
		max: lightningStrikeTimeMax,
		draw: strikeDrawTime,
		fire: strikeFireTime,
		cool: strikeCoolTime,
		segmentsPerFrame: 1
	}
}

module.exports = renderConfig;