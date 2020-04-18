let mathUtils = require( './mathUtils.js' );
let easing = require( './easing.js' ).easingEquations;
let trig = require( './trigonomicUtils.js' ).trigonomicUtils;
let createPathFromOptions = require( './lightning/path/createPathFromOptions.js' );
let createPathConfig = require( './lightning/path/createPathConfig.js' );
let updateLightningArray = require( './lightning/updateLightningArray.js' );
let easeFn = easing.easeOutSine;
let createBlurArray = require( './lightning/createBlurArray.js' );
let mainPathAnimSequence = require( `./lightning/sequencer/mainPathAnimSequence.js` );
let childPathAnimSequence = require( `./lightning/sequencer/childPathAnimSequence.js` );
let lightningStrikeTimeMax = 300;
let strikeDrawTime = lightningStrikeTimeMax / 2;
let strikeFireTime = lightningStrikeTimeMax / 6;
let strikeCoolTime = lightningStrikeTimeMax / 3;

// store subdivision level segment count as a look up table/array
let subDSegmentCountLookUp = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 ];

function calculateSubDRate( length, targetLength, subDRate ) {
	let lDiv = targetLength / length;
	let lDivCalc = subDRate - Math.floor( lDiv );
	if ( lDivCalc <= 1 ) return 1;
	if ( lDiv > 2 ) return lDivCalc;
	return subDRate;
}

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
				max: 2,
				curr: 0
			},
			spawnRate: {
				min: 5,
				max: 10
			}
		}
	},

	renderConfig: {
		blurIterations: mathUtils.randomInteger( 5, 8 ),
		blurRenderOffset: 10000,
		currHead: 0,
		timing: {
			max: lightningStrikeTimeMax,
			draw: strikeDrawTime,
			fire: strikeFireTime,
			cool: strikeCoolTime,
			segmentsPerFrame: 1
		}
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

	setLocalClockTarget: function( target ) {
		if( target ) {
			this.clock.local.target = target;
		} else {
			this.clock.local.target = this.globalConfig.intervalCurrent;
		}
	},

	updateLightningArray: function() {
		let lCollection = this.members;
		let lCollectionLen = lCollection.length - 1;
		for( let i = 0; i < lCollectionLen; i++ ) {
			let thisL = lCollection[ i ];
			let thisClock = thisL.clock;
			let thisTotalClock = thisL.totalClock;
			if ( thisClock < thisTotalClock ) {
				thisClock++;
			}
		}
	},

	createLightning: function( options ) {

		let lMgr = this;
		let opts = options;
		let creationConfig = this.creationConfig;
		let branchCfg = creationConfig.branches;
		lMgr.canvasW = opts.canvasW;
		lMgr.canvasH = opts.canvasH;
		let maxCanvasDist = trig.dist( 0, 0, opts.canvasW, opts.canvasH );
		let maxSubD = 8;
		branchCfg.depth.curr = 1;
		let subDivs = opts.subdivisions || mathUtils.randomInteger( branchCfg.subD.min, branchCfg.subD.max);
		let subD = 6;
		let d = trig.dist( opts.startX, opts.startY, opts.endX, opts.endY );
		let parentPathDist = d;
		let subDRate = calculateSubDRate( d, maxCanvasDist, subD );

		let speed =  ( d / subDSegmentCountLookUp[ subDRate ] );
		let speedModRate = opts.speedModRate || 0.1;
		let speedMod = speed * speedModRate;
		// calculate draw speed based on bolt length / 

		let tempPaths = [];
		
		// 1. create intial/main path
		tempPaths.push(
			createPathFromOptions(
				{
					isChild: false,
					isActive: true,
					isRendering: true,
					sequenceStartIndex: 1,
					sequences: mainPathAnimSequence,
					startX: opts.startX,
					startY: opts.startY,
					endX: opts.endX,
					endY: opts.endY,
					pathColR: 255,
					pathColG: 0,
					pathColB: 255,
					pathColA: 1,
					glowColR: 150,
					glowColG: 150,
					glowColB: 255,
					glowColA: 1,
					parentPathDist: 0,
					lineWidth: 1,
					subDRate: subDRate,
					subdivisions: subD,
					dRange: d / 2
				}
			)
		);

		let branchPointsCount = 6;
		let branchSubDFactor = 6;
		// cycle through branch depth levels starting with 0
		for( let branchCurrNum = 0; branchCurrNum <= branchCfg.depth.curr; branchCurrNum++){
			// cycle through current paths in tempPath array
			for( let currPathNum = 0; currPathNum < tempPaths.length; currPathNum++ ) {
				// get path object instance
				let thisPathCfg = tempPaths[ currPathNum ];
				
				if ( thisPathCfg.branchDepth !== branchCurrNum ) {
					continue;
				}

				// get the path point array
				let p = thisPathCfg.path;
				let pLen = p.length;

				// for each of the generated branch count
				for( let k = 0; k < branchPointsCount; k++ ) {

					let pCfg = createPathConfig(
						thisPathCfg,
						{	
							parentPathDist: d,
							branchDepth: branchCurrNum + 1
						}
					);

					tempPaths.push(
						createPathFromOptions(
							{
								isChild: true,
								isActive: true,
								isRendering: true,
								branchDepth: pCfg.branchDepth,
								renderOffset: pCfg.renderOffset,
								sequenceStartIndex: 1,
								sequences: childPathAnimSequence,
								pathColR: 255,
								pathColG: 0,
								pathColB: 255,
								glowColR: 150,
								glowColG: 150,
								glowColB: 255,
								glowColA: 1,
								startX: pCfg.startX,
								startY: pCfg.startY,
								endX: pCfg.endX,
								endY: pCfg.endY,
								parentPathDist: d,
								lineWidth: 1,
								subdivisions: calculateSubDRate( pCfg.dVar, maxCanvasDist, subD ),
								dRange: pCfg.dVar,
								sequenceStartIndex: 1
							}
						)
					);
					
				}
			} // end current paths loop

			if ( branchPointsCount > 0 ) {
				branchPointsCount = Math.floor( branchPointsCount / 16 );
			}
			if ( branchSubDFactor > 1 ) {
				branchSubDFactor--;
			}
		} // end branch depth loop

		// create parent lightning instance
		let lInstance = {
			isActive: true,
			speed: speedMod,
			skyFlashAlpha: 0.2,
			originFlashAlpha: 1,
			glowBlurIterations: createBlurArray(
				mathUtils.randomInteger( 5, 8 ),
				5,
				120,
				'linearEase'
			),
			clock: 0,
			totalClock: 0,
			sequence: [
				{ name: 'draw', time: strikeDrawTime },
				{ name: 'fire', time: strikeFireTime },
				{ name: 'cool', time: strikeCoolTime }
			],
			renderConfig: {
				currHead: 0,
				segmentsPerFrame: speedMod
			},
			status: {
				currentHead: 0,
				renderPhase: 0
			},
			paths: tempPaths
		};

		// console.log( 'speed',speed );

		let accumulator = 0;
		for (let i = 0; i < lInstance.sequence.length; i++ ) {
			accumulator += lInstance.sequence[ i ].time;
		}
		lInstance.totalClock = accumulator;
		lInstance.status.renderPhaseMax = lInstance.sequence.length - 1;

		// push instance to master array
		this.members.push( lInstance );
	},

	updateArr: function( c ){
		let renderCfg = this.renderConfig;
		let membersLen = this.members.length;
		c.globalCompositeOperation = 'lighter';

		for( let i = 0; i < membersLen; i++ ) {
			let thisMember = this.members[ i ];
			if ( thisMember !== undefined ) {
				for( let j = 0; j < thisMember.paths.length; j++ ) {
					let thisPathCfg = thisMember.paths[ j ];
					if ( thisPathCfg.isChild === false && thisPathCfg.isActive === false ) {
						this.members.splice(i, 1);
						i--;
						break;
					}
					thisPathCfg.render( c, thisMember, this ).update( thisMember, this );
				}
			} else {
				continue;
			}
		}
		c.globalCompositeOperation = 'source-over';
	},

	updateRenderCfg: function() {
		let members = this.members;
		let memLen = members.length;
		for( let i = 0; i <= memLen - 1; i++ ) {
			let m = members[ i ];
			m.renderConfig.currHead += m.renderConfig.segmentsPerFrame;
		}
	},

	drawDebugRadialTest: function( c ) {
		let PI = Math.PI;
		PISQ = PI * 2;
		let cX = 150, cY = 150, cR = 100;
		let zeroRotPoint = trig.radialDistribution( cX, cY, cR, PISQ );
		let qRotPoint = trig.radialDistribution( cX, cY, cR, PISQ * 0.25 );
		let halfRotPoint = trig.radialDistribution( cX, cY, cR, PISQ * 0.5 );
		let threeQRotPoint = trig.radialDistribution( cX, cY, cR, PISQ * 0.75 );

		// start point
		let testP1Point = trig.radialDistribution( cX, cY, cR, PISQ * 0.125 );
		// end point
		let testP2Point = trig.radialDistribution( cX, cY, cR, PISQ * 0.625 );
		// curvePoint
		let testP3Point = trig.radialDistribution( cX, cY, cR, PISQ * 0.875 );
		let testNormalPoint = trig.projectNormalAtDistance(
			testP1Point, testP3Point, testP2Point, 0.5, cR * 1.1
		);
		// reference points render
		c.strokeStyle = '#880000';
		c.fillStyle = 'red';
		c.lineWidth = 2;
		c.strokeCircle( cX, cY, cR );
		c.fillCircle( cX, cY, 5 );
		c.fillCircle( zeroRotPoint.x, zeroRotPoint.y, 5 );
		c.fillCircle( qRotPoint.x, qRotPoint.y, 5 );
		c.fillCircle( halfRotPoint.x, halfRotPoint.y, 5 );
		c.fillCircle( threeQRotPoint.x, threeQRotPoint.y, 5 );

		// refence shape triangle points render
		c.fillStyle = '#0088ee';
		c.fillCircle( testP1Point.x, testP1Point.y, 5 );
		c.fillCircle( testP2Point.x, testP2Point.y, 5 );
		c.fillCircle( testP3Point.x, testP3Point.y, 5 );

		// refence shape edge render
		c.strokeStyle = '#002266';
		c.setLineDash( [3, 6] );
		c.line( testP1Point.x, testP1Point.y, testP2Point.x, testP2Point.y );
		c.line( testP1Point.x, testP1Point.y, testP3Point.x, testP3Point.y );
		c.line( testP2Point.x, testP2Point.y, testP3Point.x, testP3Point.y );

		// projected NORMAL reference point
		c.fillStyle = '#00aaff';
		c.fillCircle( testNormalPoint.x, testNormalPoint.y, 5 );

		// normal line render
		// inner
		c.setLineDash( [3, 6] );
		c.strokeStyle = '#005500';
		c.line( cX, cY, testP3Point.x, testP3Point.y );
		// outer
		c.strokeStyle = '#00ff00';
		c.line( testP3Point.x, testP3Point.y, testNormalPoint.x, testNormalPoint.y );
		c.setLineDash([]);

		// calculate normal angle back from test shape for testing
		let testAngle = trig.getAngleOfNormal( testP1Point, testP3Point, testP2Point,0.5);
		// project nomal point from calculation
		let testAnglePoint = trig.radialDistribution(
			cX, cY + 200, 100,
			Math.atan2(testNormalPoint.y - cY, testNormalPoint.x - cX)
			);

		// draw line for test reference
		c.strokeStyle = '#000099';
		c.fillStyle = '#0066dd';
		c.strokeCircle( cX, cY + 200, 75 );
		c.line( cX, cY + 200, testAnglePoint.x, testAnglePoint.y );
		c.fillCircle( cX, cY + 200, 5 );
		c.fillCircle( testAnglePoint.x, testAnglePoint.y, 5 );
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