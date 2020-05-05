let mathUtils = require( '../../utils/mathUtils.js' );
let easing = require( '../../utils/easing.js' ).easingEquations;
let trig = require( '../../utils/trigonomicUtils.js' ).trigonomicUtils;

let lmgrUtils = require( './lightningManagerUtilities.js' );
let createLightningParent = lmgrUtils.createLightningParent;

let renderConfig = require( './renderConfig.js' );

let mainPathAnimSequence = require( `../sequencer/mainPathAnimSequence.js` );
let childPathAnimSequence = require( `../sequencer/childPathAnimSequence.js` );

let createPathFromOptions = require( '../path/createPathFromOptions.js' );
let createPathConfig = require( '../path/createPathConfig.js' );
let calculateSubDRate = require( '../path/calculateSubDRate.js' );

// store subdivision level segment count as a look up table/array
let subDSegmentCountLookUp = [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 ];

function createLightning( options ) {

	let lMgr = this;
	let opts = options;
	let creationConfig = this.creationConfig;
	let branchCfg = creationConfig.branches;
	lMgr.canvasW = opts.canvasW;
	lMgr.canvasH = opts.canvasH;
	let maxCanvasDist = trig.dist( 0, 0, opts.canvasW, opts.canvasH );
	
	branchCfg.depth.curr = 1;

	// let maxSubD = 8;
	let subD = 6;
	let subDivs = opts.subdivisions || mathUtils.randomInteger( branchCfg.subD.min, branchCfg.subD.max);
	
	let d = trig.dist( opts.startX, opts.startY, opts.endX, opts.endY );
	let subDRate = calculateSubDRate( d, maxCanvasDist, subD );
	let parentPathDist = d;
	
	let speed =  ( d / subDSegmentCountLookUp[ subDRate ] );
	let speedModRate = opts.speedModRate || 0.6;
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
				pathColR: 155,
				pathColG: 155,
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
							pathColR: 155,
							pathColG: 155,
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
	createLightningParent(
		{ speed: speedMod, tempPaths: tempPaths },
		this.members
	);
}

module.exports = createLightning;