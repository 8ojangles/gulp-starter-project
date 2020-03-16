require( './mathUtils.js' );
let easing = require( './easing.js' ).easingEquations;

let ligntningMgr = {

	members: [],

	globalConfig: {
		intervalMin: 0,
		intervalMax: 0,
		intervalCurrent: 0
	},

	creationConfig: {
		branches: {
			spawnRate: {
				min: 0,
				max: 0
			},
			min: 0,
			max: 0
		},

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

	createPath: function( options, dest ) {
		let lMgr = this;
		let opts = options;

		let temp = [];
		temp.push( { x: opts.startX, y: opts.startY } );
		temp.push( { x: opts.endX, y: opts.endY } );
		plotPoints( temp, opts.subdivisions );

		let lPath = {
			isChild: opts.isChild || false,
			branchDepth: opts.branchDepth || 0,
			renderOffset: opts.renderOffset || 0,
			path: temp
		};

		dest.push( lPath );

	},

	createBranchPoints: function( pathArray, branchCount ) {
		let pLen = pathArray.length;
		let temp = [];
		for( let i = branchCount; i > 0; i-- ) {
			let branchP = pathArray[ mathutils.random( 0, pLen ) ];

			temp.push( mathutils.random( 0, pLen ) );
		};
		return temp;
	},

	createLightning: function( options ) {

		let lMgr = this;
		let opts = options;
		let creationConfig = this.creationConfig;
		let branchCfg = creationConfig.branches;
		let branchCount = mathUtils.randomInteger(
			branchCfg.min, branchCfg.max
		);
		let tempPaths = [];
		let branchCurr = 0;

		// 1. create intial path
			// 2. increment branch depth level
				// 3. for each path at branch depth level
					// 3.a for each branch point
						// 3.b create path
						// goto 3


		for(let i = 0, i < branchCount; i++){
			if ( i === 0 ) {
				this.createPath(
					{
						isChild: false,
						branchDepth: 0,
						renderOffset: 0,
						startX: opts.startX,
						startY: opts.startY,
						endX: opts.endX,
						endY: opts.endY,
						subdivisions: opts.subdivisions
					},
					tempPaths
				);
			} else {

			}

		}

		let lInstance = {
			isActive: true,
			status: {
				renderPhase: 0
			},
			paths: tempPaths
		}

		this.members.push( lInstance );
	}
}

module.exports = ligntningMgr;