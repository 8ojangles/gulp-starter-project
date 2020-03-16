require( './mathUtils.js' );
let easing = require( './easing.js' ).easingEquations;

let ligntningMgr = {

	members: [],

	globalConfig: {
		intervalMin: 0,
		intervalMax: 0,
		intervalCurrent: 0
	},

	renderConfig: {},

	clock: {
		global: {
			isRunning: false,
			currentTick: 0
		},
		local: {
			isRunning: false,
			currentTick: 0,
			target: 0
		}
	},

	setGlobalInterval: function() {
		this.globalConfig.intervalCurrent = mathUtils.random(
			this.globalConfig,intervalMin,
			this.globalConfig,intervalMax
			);
	},
	startGlobalClock: function() {
		this.clock.global.isRunning = true;
	},

	stopGlobalClock: function() {
		this.clock.global.isRunning = false;
	},

	startLocalClock: function() {
		this.clock.local.isRunning = true;
	},

	stopLocalClock: function() {
		this.clock.local.isRunning = false;
	},

	resetLocalClock: function() {
		this.clock.local.currentTick = 0;
	},

	setLocalClockTarget: function( target ) {
		if( target ) {
			this.clock.local.target = target;
		} else {
			this.clock.local.target = this.globalConfig.intervalCurrent;
		}
	},

	createMainPath: function() {

	},

	createChildPath: function() {

	},

	createPath: function( options, dest ) {
		let lMgr = this;
		let opts = options;

		lPath = {
			isChild: opts.isChild ? opts.isChild : false,
			renderOffset: opts.renderOffset ? 0 : opts.renderOffset,
			path: []
		}

		dest.push( lPath );

	},

	createLightning: function( originX, originY, targetX, targetY ) {

	},
}

module.exports = ligntningMgr;