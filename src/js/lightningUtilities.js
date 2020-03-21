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
					mathUtils.random( 0, vectorDist/8 ) * ( mathUtils.randomInteger( 1, 10 ) <= 5 ? 1 : -1 )
				)
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
				subdivisions: 7,
				dRange: trig.dist( opts.startX, opts.startY, opts.endX, opts.endY ) / 2
			},
			tempPaths
		);

		// cycle through branch depth levels starting with 0
		for( let branchCurrNum = 0; branchCurrNum <= branchCfg.depth.curr; branchCurrNum++){
			// cycle through current paths in tempPath array
			for( let currPathNum = 0; currPathNum < tempPaths.length; currPathNum++ ) {
				// get path object instance
				let thisPathCfg = tempPaths[ currPathNum ];
				
				if ( thisPathCfg.branchDepth !== branchCurrNum ) {
					// if path branch depth and current loop branch depth dont match
					// exit to next loop instance
					continue;
				}

				// matching branch depth:

				// get the path point array
				let p = thisPathCfg.path
				// get the path array length
				let pLen = p.length;
				// set random number of branch points
				let branchPointsCount = mathUtils.randomInteger(
					branchCfg.spawnRate.min,
					branchCfg.spawnRate.max
				);
				// for each of the generated branch count
				for( let k = 0; k < branchPointsCount; k++ ) {
					// setup some vars to play with
					let pIndex, p1, p2, p3, p4, theta;
					// random left or right toggle
					let d = mathUtils.randomInteger( 1, 10 ) < 5 ? -0.5 : 0.5;
					// angle variation randomiser
					let v = mathUtils.random( -0.2, 0.2 );

					// if path is only start/end points
					if ( pLen === 2 ) {
						console.log( `pLen === 2` );
						p1 = thisPath[ 0 ];
						let p2 = trig.subdivide(p1.x, p1.y, p2.x, p2.y);
						p3 = thisPath[ 1 ];
						
						theta = trig.getAngleOfNormal( p1, p2, p3, 0.5 );
					}

					if ( pLen > 2 ) {
						pIndex = this.checkPointIndex(
							mathUtils.randomInteger( 0, pLen - 1 ),
							pLen
						);
						p1 = p[ pIndex - 1 ];
						p2 = p[ pIndex ];
						p3 = p[ pIndex + 1 ];
						console.log( `p1: ${p1}, p2: ${p2}, p3: ${p3}`);
						// p4 = trig.subdivide( p1.x, p1.y, p3.x, p3.y, 0.5 );
						console.log( `p4: ${p4}`);
						theta = trig.getAngleOfNormal( p1, p2, p3, 0.5 );
						console.log( `theta: ${theta}` );
					}
					let maxD = trig.dist( p2.x, p2.y, p[ pLen - 1].x, p[ pLen - 1 ].y);
					// let branchAngle = thisPathCfg.baseAngle + (chooseDirection <= 5 ? -0.5  : 0.5);
					let branchEndpoint = trig.radialDistribution( p2.x, p2.y, mathUtils.random( 0, maxD ), theta );
					this.createPath(
						{
							isChild: true,
							branchDepth: branchCurrNum + 1,
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
			} // end current paths loop
		} // end branch depth loop

		console.log( 'tempPaths: ', tempPaths );
		// create parent lightning instance
		let lInstance = {
			isActive: true,
			glowBlurIterations: mathUtils.randomInteger( 10, 50 ),
			status: {
				renderPhase: 0
			},
			paths: tempPaths
		}
		// push instance to master array
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
	drawDebugRadialTest: function( c ) {
		let PI = Math.PI;
		PISQ = PI * 2;
		let testCX = 200, testCY = 200, testCR = 150;
		let zeroRotPoint = trig.radialDistribution( testCX, testCY, testCR, PISQ );
		let qRotPoint = trig.radialDistribution( testCX, testCY, testCR, PISQ * 0.25 );
		let halfRotPoint = trig.radialDistribution( testCX, testCY, testCR, PISQ * 0.5 );
		let threeQRotPoint = trig.radialDistribution( testCX, testCY, testCR, PISQ * 0.75 );

		// start point
		let testP1Point = trig.radialDistribution( testCX, testCY, testCR, PISQ * 0.125 );
		// end point
		let testP2Point = trig.radialDistribution( testCX, testCY, testCR, PISQ * 0.625 );
		// curvePoint
		let testP3Point = trig.radialDistribution( testCX, testCY, testCR, PISQ * 0.875 );
		let testNormalPoint = trig.projectNormalAtDistance(
			testP1Point, testP3Point, testP2Point, 0.5, testCR * 1.1
		);
		c.strokeStyle = '#880000';
		c.fillStyle = 'blue';
		c.lineWidth = 2;
		c.strokeCircle( testCX, testCY, testCR );
		c.fillCircle( testCX, testCY, 5 );
		c.fillCircle( zeroRotPoint.x, zeroRotPoint.y, 5 );
		c.fillCircle( qRotPoint.x, qRotPoint.y, 5 );
		c.fillCircle( halfRotPoint.x, halfRotPoint.y, 5 );
		c.fillCircle( threeQRotPoint.x, threeQRotPoint.y, 5 );

		c.fillCircle( testP1Point.x, testP1Point.y, 5 );
		c.fillCircle( testP2Point.x, testP2Point.y, 5 );
		c.fillCircle( testP3Point.x, testP3Point.y, 5 );
		c.fillStyle = 'green';
		c.fillCircle( testNormalPoint.x, testNormalPoint.y, 5 );

		c.line( testP1Point.x, testP1Point.y, testP2Point.x, testP2Point.y );
		c.line( testP1Point.x, testP1Point.y, testP3Point.x, testP3Point.y );
		c.line( testP2Point.x, testP2Point.y, testP3Point.x, testP3Point.y );
		c.strokeStyle = '#009900';
		c.line( testCX, testCY, testNormalPoint.x, testNormalPoint.y );
		
		let testAngle = trig.getAngleOfNormal( testP1Point, testP3Point, testP2Point,0.5);
		console.log( 'testAngle: ', testAngle );
		let testAnglePoint = trig.radialDistribution( zeroRotPoint.x, zeroRotPoint.y, 100, testAngle );
		c.strokeStyle = '#000099';
		c.line( zeroRotPoint.x, zeroRotPoint.y, testAnglePoint.x, testAnglePoint.y );
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