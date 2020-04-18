let mainPathAnimSequence = [
	{
		name: 'lPathFire',
		time: 1,
		linkedSeq: '1',
		items: [
			{ param: 'lineWidth', start: 0, target: 10, easefN: 'linearEase' }
		]
	},
	{
		name: 'lPathCool',
		time: 50,
		linkedSeq: '',
		final: true,
		items: [
			{ param: 'lineWidth', start: 0, target: 1, easefN: 'easeOutQuint' },
			{ param: 'colG', start: 0, target: 0, easefN: 'easeOutQuint' },
			{ param: 'colB', start: 0, target: 150, easefN: 'easeInSine' },
			{ param: 'colA', start: 0, target: 0, easefN: 'easeOutSine' }
		]
	}
];

module.exports = mainPathAnimSequence;