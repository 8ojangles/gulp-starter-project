let mathUtils = require( '../../utils/mathUtils.js' );

function setGlobalInterval() {
	this.globalConfig.intervalCurrent = mathUtils.random(
		this.globalConfig,intervalMin,
		this.globalConfig,intervalMax
		);
}

module.exports = setGlobalInterval;