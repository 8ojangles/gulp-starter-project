let mainPathAnimSequence = [
	{
		name: 'lPathCool',
		time: 200,
		items: [
			{ param: 'glowColApha', start: 0, target: 0, easefN: 'easeOutQuint' },
			{ param: 'colG', start: 0, target: 0, easefN: 'easeOutCubic' },
			{ param: 'colB', start: 0, target: 0, easefN: 'easeOutCubic' },
			{ param: 'colA', start: 0, target: 0, easefN: 'linearEase' }
		],
		linkedSeq: ''
	},
	{
		name: 'lPathFire',
		time: 5,
		items: [
			{ param: 'lineWidth', start: 0, target: 5, easefN: 'linearEase' },
			{ param: 'glowColApha', start: 0, target: 1, easefN: 'easeOutQuint' }
		],
		linkedSeq: '2'
	},
	{
		name: 'lPathCool',
		time: 100,
		items: [
			{ param: 'lineWidth', start: 0, target: 1, easefN: 'easeOutQuint' },
			{ param: 'colG', start: 0, target: 100, easefN: 'easeOutQuint' },
			// { param: 'colB', start: 0, target: 100, easefN: 'easeOutQuint' },
			{ param: 'colA', start: 0, target: 0, easefN: 'easeOutSine' }
		],
		linkedSeq: ''
	}
];

module.exports = mainPathAnimSequence;