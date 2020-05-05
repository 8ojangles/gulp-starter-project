function setLocalClockTarget( target ) {
		if( target ) {
			this.clock.local.target = target;
		} else {
			this.clock.local.target = this.globalConfig.intervalCurrent;
		}
	}

module.exports = setLocalClockTarget;