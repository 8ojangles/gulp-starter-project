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
	}
];

module.exports = mainPathAnimSequence;