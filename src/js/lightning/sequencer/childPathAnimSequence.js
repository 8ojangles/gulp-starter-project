const alphaFadeOut = require( './sequenceItems/alphaFadeOut.js' );

let childPathAnimSequence = [
	{
		name: 'lPathCool',
		time: 30,
		linkedSeq: '',
		loop: false,
		loopBack: false,
		final: true,
		items: alphaFadeOut
	}
];

module.exports = childPathAnimSequence;