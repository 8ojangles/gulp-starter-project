let mainPathAnimSequence = [
	{
		name: 'lPathFire',
		time: 2,
		items: [
			{ param: 'lineWidth', start: 0, target: 10, easefN: 'linearEase' },
			{ param: 'glowColApha', start: 0, target: 1, easefN: 'easeOutQuint' }
		],
		linkedSeq: '1'
	},
	{
		name: 'lPathCool',
		time: 80,
		items: [
			{ param: 'lineWidth', start: 0, target: 1, easefN: 'easeOutQuint' },
			{ param: 'colG', start: 0, target: 150, easefN: 'easeOutQuint' },
			// { param: 'colB', start: 0, target: 100, easefN: 'easeOutQuint' },
			{ param: 'colA', start: 0, target: 0, easefN: 'easeOutSine' }
		],
		linkedSeq: ''
	}
];

module.exports = mainPathAnimSequence;