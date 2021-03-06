const fadeToRedAndFadeOut = require( './sequenceItems/fadeToRedAndFadeOut.js' );
const lineWidthTo10 = require( './sequenceItems/lineWidthTo10.js' );

let mainPathAnimSequence = [
	{
		name: 'lPathFire',
		time: 1,
		linkedSeq: '1',
		loop: false,
		loopBack: false,
		items: lineWidthTo10
	},
	{
		name: 'lPathCool',
		time: 30,
		linkedSeq: '',
		loop: false,
		loopBack: false,
		final: true,
		items: fadeToRedAndFadeOut
	}
];

module.exports = mainPathAnimSequence;