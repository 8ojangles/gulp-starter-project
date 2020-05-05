const fadeToRedAndFadeOut = require( './sequenceItems/fadeToRedAndFadeOut.js' );
const lineWidthTo10 = require( './sequenceItems/lineWidthTo10.js' );

let connectedPathAnimSequence = [
	{
		name: 'lPathFire',
		time: 1,
		linkedSeq: '',
		trigger: {
			actionType: 'setState',
			actionValue: 'isConnected'
		},
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

module.exports = connectedPathAnimSequence;