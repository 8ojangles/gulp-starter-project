const lMgrClock = {
	global: {
		isRunning: false,
		currentTick: 0
	},
	local: {
		isRunning: false,
		currentTick: 0,
		target: 0
	}
}

module.exports = lMgrClock;