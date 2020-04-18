function pathGlow( c, pathCfg, savedPath, glowOpts ) {
	let blurs = glowOpts.blurs ||  [ 100, 70, 50, 30, 10 ];
	let blurColor = glowOpts.blurColor || 'white';
	let blurShapeOffset = glowOpts.blurShapeOffset || 10000;
	// c.lineWidth = pathCfg.lineWidth;
	c.strokeStyle = "red";
	c.fillSbtyle = 'white';
	c.shadowOffsetY = blurShapeOffset;
	c.shadowColor = blurColor;

	for( let i = 0; i < blurs.length - 1; i++ ) {
		c.shadowBlur = blurs[ i ];
		c.lineWidth = pathCfg.lineWidth * 2;
		c.stroke( savedPath );
	}
	c.shadowBlur = 0;
}

// path rendering function
function renderPath( c, parent, globalConfig ) {
	
	let thisCfg = this;
	let renderCfg = parent.renderConfig;
	let currRenderPoint = 0;
	let currRenderHead = 0;
	let currRenderTail = 0;
	
	const { isChild, isRendering, renderOffset, savedPaths, path: thisPath, lineWidth, colR, colG, colB, colA, glowColR, glowColG, glowColB, glowColA, currHeadPoint } = thisCfg;
	let pathLen = thisPath.length;

	const computedPathColor = `rgba(${colR}, ${colG}, ${colB}, ${colA})`;
	const pathGlowRGB = `${glowColR}, ${glowColG}, ${glowColB}`;
	
	// shadow render offset
	let sRO = globalConfig.renderConfig.blurRenderOffset;
	c.lineWidth = lineWidth;

	let cHP = 0; // current head point

	let currPath = new Path2D();
	let offsetPath = new Path2D();
	let originGlowShort = new Path2D();
	let originGlowLong = new Path2D();


	// for( let l = this.renderOffset + this.currHeadPoint; l < renderCfg.currHead; l++ ) {
	// 	let p = thisPath[ l ];
	// 	if ( l === 0 ) {
	// 		savedPaths.main.moveTo( p.x, p.y );
	// 		savedPaths.offset.moveTo( p.x, p.y - sRO );
	// 		originShort.moveTo( p.x, p.y - sRO );
	// 		savedPaths.originLong.moveTo( p.x, p.y - sRO );
	// 		continue;
	// 	}

	// 	currPath.lineTo( p.x, p.y );
	// 	offsetPath.lineTo( p.x, p.y - sRO );

	// 	if ( l < 20 ) {
	// 		if ( l < 5 ) {
	// 			originGlowShort.lineTo( p.x, p.y - sRO );
	// 		}
	// 		originGlowLong.lineTo( p.x, p.y - sRO );
	// 	}
	// 	cHP = l;
	// 	this.currHeadPoint = l;

	// }

	// if ( renderCfg.currHead < thisPath.length ) {

	// 	for ( let l = 0; l <= pathLen - 1; l++ ) {
	// 		let p = thisPath[ l ];
	// 		if ( renderOffset + l < renderCfg.currHead ) {
	// 			if ( l === 0 ) {
	// 				savedPaths.main.moveTo( p.x, p.y );
	// 				savedPaths.offset.moveTo( p.x, p.y - sRO );
	// 				savedPaths.originShort.moveTo( p.x, p.y - sRO );
	// 				savedPaths.originLong.moveTo( p.x, p.y - sRO );
	// 				continue;
	// 			}
	// 			savedPaths.main.lineTo( p.x, p.y );
	// 			savedPaths.offset.lineTo( p.x, p.y - sRO );

	// 			if ( l < 20 ) {
	// 				if ( l < 5 ) {
	// 					savedPaths.originShort.lineTo( p.x, p.y - sRO );
	// 				}
	// 				savedPaths.originLong.lineTo( p.x, p.y - sRO );
	// 			}

	// 			cHP = l;
	// 			this.currHeadPoint = l;
	// 		} else {
	// 			break;
	// 		}
	// 		// after drawing path, set currently rendered head index
	// 		currRenderPoint = this.renderOffset + l;

	// 		if ( l === pathLen - 1 ) {
	// 			this.sequenceIndex = 1;
	// 		}
	// 	}

	// } else {
	// 	console.log( 'savedPaths.main: ', savedPaths.main );
	// }
	

	for ( let l = 0; l <= pathLen - 1; l++ ) {
		let p = thisPath[ l + currRenderTail ];
		if ( this.renderOffset + l < renderCfg.currHead ) {
			if ( l === 0 ) {
				currPath.moveTo( p.x, p.y );
				offsetPath.moveTo( p.x, p.y - sRO );
				originGlowShort.moveTo( p.x, p.y - sRO );
				originGlowLong.moveTo( p.x, p.y - sRO );
				continue;
			}
			currPath.lineTo( p.x, p.y );
			offsetPath.lineTo( p.x, p.y - sRO );

			if ( l < 20 ) {
				if ( l < 5 ) {
					originGlowShort.lineTo( p.x, p.y - sRO );
				}
				originGlowLong.lineTo( p.x, p.y - sRO );
			}

			cHP = l;
			this.currHeadPoint = l;
		} else {
			break;
		}
		// after drawing path, set currently rendered head index
		currRenderPoint = this.renderOffset + l;

		if ( l === pathLen - 1 ) {
			this.sequenceIndex = 1;
		}
	}

	c.strokeStyle = computedPathColor;
	c.stroke( savedPaths.main );
	c.stroke( currPath );

	pathGlow(
		c, thisCfg, offsetPath,
		{
			blurs: parent.glowBlurIterations,
			blurColor: `rgba( ${pathGlowRGB}, ${colA} )`
		}
	);

	// if the main path has "connected" and is "discharging"
	if (thisCfg.isChild === false) {

		// sky flash
		// c.fillStyle = `rgba( 255, 255, 255, ${thisCfg.colA / 10} )`;
		// c.fillRect( 0, 0, globalConfig.canvasW, globalConfig.canvasH );

		

		pathGlow( 
			c, thisCfg, originGlowLong,
			{
				blurColor: `rgba( ${pathGlowRGB}, ${thisCfg.colA / 2} )`
			} 
		);

		// origin glow gradients
		let origin = thisCfg.path[0];
		let longGlowGradient = c.createRadialGradient(
			origin.x, origin.y, 0,
			origin.x, origin.y, 600
		);
		longGlowGradient.addColorStop( 0, `rgba( 255, 150, 255, ${colA / 4} )` );
		longGlowGradient.addColorStop( 1, 'rgba( 255, 150, 255, 0 )' );

		c.fillStyle = longGlowGradient;
		c.fillCircle( origin.x, origin.y, 600 );

		let originGradient = c.createRadialGradient(
			origin.x, origin.y, 0,
			origin.x, origin.y, 100
		);
		originGradient.addColorStop( 0, `rgba( ${pathGlowRGB}, ${colA / 2} )` );
		originGradient.addColorStop( 1, `rgba( ${pathGlowRGB}, 0 )` );

		c.fillStyle = originGradient;
		c.fillCircle( origin.x, origin.y, 100 );
		
		// pathGlow( 
		// 	c, thisCfg, originGlowShort,
		// 	{
		// 		blurs: [ 100, 70, 50, 40, 30, 20, 10 ],
		// 		blurShapeOffset: sRO,
		// 		blurColor: `rgba( 150, 150, 255, ${thisCfg.glowColApha} )`
		// 	} 
		// );

	}


	if ( cHP > 0 ) {
		if ( cHP >= pathLen - 1 ) {
			c.strokeStyle = computedPathColor;
		} else {
			c.strokeStyle = 'white';
		}
		c.lineWidth = 3;
		c.shadowColor = computedPathColor;
		let glowHeadPathL = new Path2D();
		let glowHeadPathS = new Path2D();
		if ( cHP > 2 ) {
			glowHeadPathL.moveTo( thisPath[ cHP - 2 ].x, thisPath[ cHP - 2 ].y - sRO );
			glowHeadPathL.lineTo( thisPath[ cHP - 1 ].x, thisPath[ cHP - 1 ].y - sRO );
			glowHeadPathL.lineTo( thisPath[ cHP ].x, thisPath[ cHP ].y - sRO );
			
			c.shadowBlur = 20;
			c.stroke( glowHeadPathL );
			c.shadowBlur = 10;
			c.stroke( glowHeadPathL );
		}
		
		glowHeadPathS.moveTo( thisPath[ cHP - 1 ].x, thisPath[ cHP - 1 ].y - sRO );
		glowHeadPathS.lineTo( thisPath[ cHP ].x, thisPath[ cHP ].y - sRO );
		
		c.shadowBlur = 10;
		c.stroke( glowHeadPathS );
		c.shadowBlur = 5;
		c.stroke( glowHeadPathS );
		c.shadowBlur = 0;
	}

	return this;
}

module.exports = renderPath;