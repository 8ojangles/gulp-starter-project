let mathUtils = require( './mathUtils.js' );
let easing = require( './easing.js' ).easingEquations;
let trig = require( './trigonomicUtils.js' ).trigonomicUtils;
let easeFn = easing.easeOutSine;

let ligntningMgr = {

	members: [],

	debugMembers: [],

	globalConfig: {
		intervalMin: 0,
		intervalMax: 0,
		intervalCurrent: 0
	},

	creationConfig: {
		branches: {
			subD: {
				min: 3,
				max: 6
			},
			depth: {
				min: 1,
				max: 3,
				curr: 0
			},
			spawnRate: {
				min: 0,
				max: 3
			}
		}
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

	plotPoints: function( arr, subdivisions, options ) {
		let dRange = options.dRange || 200;
		let tRange = options.tRange || 0.35;
		for ( let i = 0; i <= subdivisions - 1; i++ ) {
			let arrLen = arr.length;
			console.log( 'dRange ', dRange );
			for ( let j = arrLen - 1; j > 0; j-- ) {
				if ( j === 0 ) {
					return;
				}
				let p = arr[ j ];
				let prevP = arr[ j - 1 ];
				let vectorDist = trig.dist( p.x, p.y, prevP.x, prevP.y );
				let nP = trig.subdivide( prevP.x, prevP.y, p.x, p.y, 0.5 );
				let offsetPoint = trig.projectNormalAtDistance(
					{x: prevP.x, y: prevP.y},
					{x: nP.x, y: nP.y},
					{x: p.x, y: p.y},
					mathUtils.random( 0.25, 0.75 ),
					mathUtils.random( 0, vectorDist/4 ) * ( mathUtils.randomInteger( 1, 10 ) <= 5 ? 1 : -1 )
				)
				
				// let currAngle = trig.angle( prevP.x, prevP.y, p.x, p.y );
				// currAngle = currAngle + ( mathUtils.randomInteger(0, 10) < 5 ? -0.5 : 0.5 );
				// let rndRadians = mathUtils.random( currAngle - 0.25, currAngle + 0.25 );

				// let newPointOffset = trig.radialDistribution( newPoint.x, newPoint.y, mathUtils.random( -dRange , dRange), rndRadians )
				arr.splice( j, 0, { x: offsetPoint.x, y: offsetPoint.y } );
			}

			dRange *= 0.5;
			// tRange = tRange * 0.8;
		}
	},

	createPath: function( options, destArray ) {
		let lMgr = this;
		let opts = options;

		let temp = [];
		temp.push( { x: opts.startX, y: opts.startY } );
		temp.push( { x: opts.endX, y: opts.endY } );
		this.plotPoints( temp, opts.subdivisions, { dRange: opts.dRange } );

		let lPath = {
			isChild: opts.isChild || false,
			branchDepth: opts.branchDepth || 0,
			renderOffset: opts.renderOffset || 0,
			baseAngle: trig.angle( opts.startX, opts.startY, opts.endX, opts.endY ),
			baseDist: trig.dist( opts.startX, opts.startY, opts.endX, opts.endY ),
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

	checkPointIndex: function( pointIndex, pathLength ) {
		let result = pointIndex;
		if ( pointIndex === 0 ) {
			return 1;
		} else if ( pointIndex === pathLength - 1 ) {
			return pathLength - 2;
		}
		return result;
	},

	createLightning: function( options ) {

		let lMgr = this;
		let opts = options;
		let creationConfig = this.creationConfig;
		let branchCfg = creationConfig.branches;
		branchCfg.depth.curr = mathUtils.randomInteger(
			branchCfg.depth.min, branchCfg.depth.max
		);
		let tempPaths = [];
		let branchCurr = 0;
		let subDivs = opts.subdivisions || mathUtils.randomInteger( branchCfg.subD.min, branchCfg.subD.max);
		// 1. create intial/main path
		this.createPath(
			{
				isChild: false,
				branchDepth: 0,
				renderOffset: 0,
				startX: opts.startX,
				startY: opts.startY,
				endX: opts.endX,
				endY: opts.endY,
				subdivisions: 5,
				dRange: trig.dist( opts.startX, opts.startY, opts.endX, opts.endY ) / 2
			},
			tempPaths
		);

		// 

				
					// 3.a for each branch point
						// 3.b create path
						// goto 3
		// 2. iterate through branch depth levels
		for( let i = 0; i <= branchCfg.depth.curr; i++ ){

			for( let j = 0; j < tempPaths.length; j++ ) {
				let thisPathCfg =  tempPaths[ j ];
				
				// 3. for each path at branch depth level
				if ( thisPathCfg.branchDepth === i ) {
					let p = thisPathCfg.path;
					let pLen = p.length;

					// set random number of branch points
					let branchPointsCount = mathUtils.randomInteger(
						branchCfg.spawnRate.min,
						branchCfg.spawnRate.max
					);
					// let branchPointsCount = 4;
					for( let k = 0; k < branchPointsCount; k++ ) {
						let maxD = p.baseDist;
						// setup some vars to play with
						let pIndex, p1, p2, p3, p4, theta;

						console.log( `pLen: ${pLen}`);
						// get random point for branch
						if ( pLen === 2 ) {
							console.log( `pLen === 2` );
							let d = mathUtils.randomInteger( 1, 10 ) < 5 ? -0.5 : 0.5;
							let v = mathUtils.random( -0.2, 0.2 );
							p1 = thisPath[ 0 ];
							p2 = thisPath[ 1 ];
							theta = trig.angle( p1.x, p1.y, p2.x, p2.y ) + d + v;
						}

						if ( pLen > 2 ) {
							console.log( `pLen > 2` );
							pIndex = this.checkPointIndex( mathUtils.randomInteger( 0, pLen - 1 ), pLen );
							console.log( `pIndex: ${pIndex}`);
							p1 = p[ pIndex - 1 ];
							p2 = p[ pIndex ];
							p3 = p[ pIndex + 1 ];
							console.log( `p1: ${p1}, p2: ${p2}, p3: ${p3}`);
							// p4 = trig.subdivide( p1.x, p1.y, p3.x, p3.y, 0.5 );
							console.log( `p4: ${p4}`);
							theta = trig.getAngleOfNormal( p1, p2, p3, 0.5 );
							console.log( `theta: ${theta}` );
						}

						// let branchAngle = thisPathCfg.baseAngle + (chooseDirection <= 5 ? -0.5  : 0.5);
						let branchEndpoint = trig.radialDistribution( p2.x, p2.y, mathUtils.random( 0, maxD ), theta );
						this.createPath(
							{
								isChild: true,
								branchDepth: i + 1,
								renderOffset: 0,
								startX: p2.x,
								startY: p2.y,
								endX: branchEndpoint.x,
								endY: branchEndpoint.y,
								subdivisions: 1,
								dRange: trig.dist( p2.x, p2.y, branchEndpoint.x, branchEndpoint.y ) / 2
							},
							tempPaths
						);
					}

				}

			
			}
		}
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
		let iterations = 1;
		let membersLen = this.members.length;
		let strokeWidth = this.creationConfig.branches.depth.curr;

		for( let i = 0; i < membersLen; i++ ) {
			let thisMember = this.members[ i ];
			for( let j = 0; j < thisMember.paths.length; j++ ) {
				let thisPathCfg =  thisMember.paths[ j ];
				let thisPath =  thisPathCfg.path;
				let thisPathLen = thisPath.length;
				// console.log( 'thisPathCfg: ', thisPathCfg );
				c.globalCompositeOperation = 'lighter';
				let shadowOffset = -10000;
				let blurWidth = 100;
				let maxLineWidth = 200;

				for ( let k = 0; k <= iterations; k++ ) {
					let colorChange = easeFn( k, 150, 105, iterations );

					c.strokeStyle = 'white';
					
					if ( thisPathCfg.isChild === false ) {
						c.lineWidth = 4;
						
					} else {
						c.lineWidth = 1;
						
					}

					if ( k === 0 ) {
						blurWidth = 0;
					} else {
						blurWidth = 10 * k;
					}
					c.beginPath();
					for ( let l = 0; l <= thisPathLen - 1; l++ ) {
						let p = thisPath[ l ];
						if ( l === 0 ) {
							c.moveTo( p.x, p.y );
							continue;
						}
						c.lineTo( p.x, p.y );
					}
					// c.shadowOffsetY = -shadowOffset;
					// c.shadowBlur = easeFn( k, maxLineWidth, -maxLineWidth, iterations );
					// c.shadowColor = `rgba( ${ colorChange }, ${ colorChange }, 255, 1 )`;
					c.stroke();

				}
				c.globalCompositeOperation = 'source-over';

			}

			// this.drawDebugLines( c );
		}
		// shadow offset : + ( l === 0 ? 0 : shadowOffset )
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
	},

	drawDebugLines: function( c ) {
		let members = this.members;
		let membersLen = members.length;

		for( let i = 0; i < membersLen; i++ ) {
			let thisMember = this.members[ i ];

			let thisPaths = thisMember.paths;
			let thisPathsLen = thisPaths.length;
			for( let j = 0; j < thisPathsLen; j++ ) {
				let path = thisPaths[ j ].path;

				c.lineWidth = 5;
				c.strokeStyle = 'red';
				c.setLineDash( [5, 15] );
				c.line( path[0].x, path[0].y, path[path.length - 1].x, path[path.length - 1].y );
				c.setLineDash( [] );

				

			}

		}
	}
}

module.exports = ligntningMgr;