let mathUtils = require( './mathUtils.js' );
let easing = require( './easing.js' ).easingEquations;
let trig = require( './trigonomicUtils.js' ).trigonomicUtils;
let easeFn = easing.easeOutSine;

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
				max: mathUtils.randomInteger( 0, 20 )
			},
			min: 2,
			max: 5
		},
	},

	renderConfig: {
		blurIterations: mathUtils.randomInteger( 10, 40 )
	},

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

	plotPoints: function( arr, subdivisions ) {
		let dRange = 200;
		let tRange = 0.5;
		for ( let i = 0; i <= subdivisions - 1; i++ ) {
			let arrLen = arr.length;
			for ( let j = arrLen - 1; j > 0; j-- ) {
				console.log( 'j: ', j );
				if ( j === 0 ) {
					return;
				}
				let p = arr[ j ];
				let prevP = arr[ j - 1 ];
				let newPoint = trig.subdivide( p.x, p.y, prevP.x, prevP.y, tRange );
				let rndRadians = mathUtils.random( -2, 2 ) * 180/Math.PI;


				let newPointOffset = trig.radialDistribution( newPoint.x, newPoint.y, mathUtils.random( -dRange , dRange), rndRadians )
				arr.splice( j, 0, { x: newPointOffset.x, y: newPointOffset.y } );
			}

			dRange = dRange * 0.5;
			// tRange = tRange * 0.8;
		}
	},

	createPath: function( options, destArray ) {
		let lMgr = this;
		let opts = options;

		let temp = [];
		temp.push( { x: opts.startX, y: opts.startY } );
		temp.push( { x: opts.endX, y: opts.endY } );
		this.plotPoints( temp, opts.subdivisions );

		let lPath = {
			isChild: opts.isChild || false,
			branchDepth: opts.branchDepth || 0,
			renderOffset: opts.renderOffset || 0,
			path: temp
		};

		destArray.push( lPath );

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
		let subDivs = opts.subdivisions;

		// 1. create intial/main path
			// 2. increment branch depth level
				// 3. for each path at branch depth level
					// 3.a for each branch point
						// 3.b create path
						// goto 3

		for( let i = 0; i <= branchCount; i++ ){
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
						subdivisions: subDivs
					},
					tempPaths
				);
				console.log( 'tempPaths main: ', tempPaths );
			} else {
				for( let i = 0; i < tempPaths.length - 1; i++ ) {
					let thisPath = tempPaths[ i ].path;
					// set random number of branch points
					let branchPointsCount = mathUtils.randomInteger(
						0, creationConfig.branches.spawnRate.max
					);
					subDivs = subDivs / 2;
					for( let i = 0; i < branchPointsCount; i++ ) {
						let thisPoint = thisPath[ mathUtils.randomInteger(
							0, thisPath.length ) ];
						let branchEndpoint = trig.radialDistribution(
							thisPoint.x,
							thisPoint.y,
							mathUtils.randomInteger( 100, 300 ),
							mathUtils.random( -2, 2 ) * 180 / Math.PI
						);
						this.createPath(
							{
								isChild: true,
								branchDepth: 0,
								renderOffset: 0,
								startX: thisPath.x,
								startY: thisPath.y,
								endX: branchEndpoint.x,
								endY: branchEndpoint.y,
								subdivisions: opts.subdivisions
							},
							tempPaths
						);
					}
				}
			}
		};
		console.log( 'tempPaths: ', tempPaths );
		let lInstance = {
			isActive: true,
			glowBlurIterations: mathUtils.randomInteger( 10, 50 ),
			status: {
				renderPhase: 0
			},
			paths: tempPaths
		}

		this.members.push( lInstance );
	},

	drawPointArr: function( c ){
		let renderCfg = this.renderConfig;
		let iterations = renderCfg.blurIterations;
		let membersLen = this.members.length;

		for( let i = 0; i < membersLen; i++ ) {
			let thisMember = this.members[ i ];
			for( let j = 0; i < thisMember.paths.length; i++ ) {
				let thisPath =  thisMember.paths[ j ];

				c.globalCompositeOperation = 'lighter';
				let shadowOffset = -10000;
				let blurWidth = 100;
				let maxLineWidth = 200;

				for ( let k = 0; k <= iterations; k++ ) {
					let colorChange = easeFn( k, 150, 105, iterations );

					c.strokeStyle = 'white';

					if ( k === 0 ) {
						c.lineWidth = 1;
						blurWidth = 0;
					} else {
						blurWidth = 10 * k;
					}
					c.beginPath();
					for ( let l = 0; l <= thisPath.length - 1; l++ ) {
						let p = thisPath[ l ];
						if ( l === 0 ) {
							c.moveTo( p.x, p.y + ( l === 0 ? 0 : shadowOffset ) );
							continue;
						}
						c.lineTo( p.x, p.y + ( l === 0 ? 0 : shadowOffset ) );
					}
					c.shadowOffsetY = -shadowOffset;
					c.shadowBlur = easeFn( k, maxLineWidth, -maxLineWidth, iterations );
					c.shadowColor = `rgba( ${ colorChange }, ${ colorChange }, 255, 1 )`;
					c.stroke();

				}
				c.globalCompositeOperation = 'source-over';

			}

		}

		// c.globalCompositeOperation = 'lighter';
		// let shadowOffset = -10000;
		// let blurWidth = 100;
		// let maxLineWidth = 200;

		// for ( let j = 0; j <= iterations; j++ ) {
		// 	let colorChange = easeFn( j, 150, 105, iterations );

		// 	c.strokeStyle = 'white';

		// 	if ( j === 0 ) {
		// 		c.lineWidth = 1;
		// 		blurWidth = 0;
		// 	} else {
		// 		blurWidth = 10 * j;
		// 	}
		// 	c.beginPath();
		// 	for ( let i = 0; i <= segArr.length - 1; i++ ) {
		// 		let p = segArr[ i ];
		// 		if ( i === 0 ) {
		// 			c.moveTo( p.x, p.y + ( j === 0 ? 0 : shadowOffset ) );
		// 			continue;
		// 		}
		// 		c.lineTo( p.x, p.y + ( j === 0 ? 0 : shadowOffset ) );
		// 	}
		// 	c.shadowOffsetY = -shadowOffset;
		// 	c.shadowBlur = easeFn( j, maxLineWidth, -maxLineWidth, iterations );
		// 	c.shadowColor = `rgba( ${ colorChange }, ${ colorChange }, 255, 1 )`;
		// 	c.stroke();

		// }
		// c.globalCompositeOperation = 'source-over';

		// c.fillStyle = 'white';
		// c.fillCircle( testVec.startX, testVec.startY, 7 );
		// c.fillCircle( testVec.endX, testVec.endY, 7 );
		// c.fillStyle = 'blue';
		// for ( let i = 0; i <= segArr.length - 1; i++ ) {
		// 	if ( i === segArr.length / 2 - 1 ) {
		// 		c.fillStyle = 'green';
		// 	}
		// 	c.fillCircle( segArr[ i ].x, segArr[ i ].y, 5 );
		// 	if ( i === segArr.length / 2 - 1 ) {
		// 		c.fillStyle = 'blue';
		// 	}
		// }
	}
}

module.exports = ligntningMgr;