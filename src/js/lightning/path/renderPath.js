function pathGlow( c, pathCfg, savedPath, glowOpts ) {
	let blurs = glowOpts.blurs || [ 100, 50, 20 ];
	let blurColor = glowOpts.blurColor || 'white';
	let blurShapeOffset = glowOpts.blurShapeOffset || 10000;

	c.strokeStyle = "white";
	c.fillSbtyle = 'white';
	c.shadowOffsetY = blurShapeOffset;
	c.shadowColor = blurColor;

	for( let i = 0; i < blurs.length - 1; i++ ) {
		c.shadowBlur = blurs[ i ];
		c.stroke( savedPath );
	}
	c.shadowBlur = 0;
}

// path rendering function
function renderPath( c, parent, globalConfig ) {
	let renderCfg = globalConfig.renderConfig;
	let currRenderPoint = 0;
	let currRenderHead = 0;
	let currRenderTail = 0;
	let thisCfg = this;
	let isChild = thisCfg.isChild;
	let isRendering = thisCfg.isRendering;
	let thisPath = this.path;
	let pathLen = thisPath.length;

	// shadow render offset
	let sRO = 10000;

	if ( isChild === false ) {
		if ( parent.status.renderPhase === 1 ) {
			c.lineWidth = 5;
		} else {
			c.lineWidth = 1;
		}
		
		c.strokeStyle = 'white';
	} else {
		c.lineWidth = 1;
	}
	let cHP = 0; // current head point

	c.strokeStyle = `rgba( ${thisCfg.colR}, ${thisCfg.colG}, ${thisCfg.colB}, ${thisCfg.colA})`;

	let currPath = new Path2D();
	let offsetPath = new Path2D();
	let originGlowShort = new Path2D();
	let originGlowLong = new Path2D();

	// currPath.beginPath();
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
		} else {
			break;
		}
		// after drawing path, set currently rendered head index
		currRenderPoint = this.renderOffset + l;

		if ( l === pathLen - 1 ) {
			this.sequenceIndex = 1;
		}
	}

	c.stroke( currPath );

	// if the main path has "connected" and is "discharging"
	if ( parent.status.renderPhase === 1 && thisCfg.isChild === false) {

		// sky flash
		c.fillStyle = `rgba( 255, 255, 255, ${parent.skyFlashAlpha} )`;
		c.fillRect( 0, 0, globalConfig.canvasW, globalConfig.canvasH );

		pathGlow(
			c, thisCfg, offsetPath,
			{
				blurs: [ 100, 70, 50, 30, 10 ],
				blurShapeOffset: sRO,
				blurColor: `rgba( 150, 150, 255, ${thisCfg.glowColApha} )`
			}
		);

		pathGlow( 
			c, thisCfg, originGlowLong,
			{
				blurs: [ 100, 70, 50, 30, 10 ],
				blurShapeOffset: sRO,
				blurColor: `rgba( 150, 150, 255, ${thisCfg.glowColApha} )`
			} 
		);

		let longGlowGradient = c.createRadialGradient(
			thisCfg.path[0].x, thisCfg.path[0].y, 0,
			thisCfg.path[0].x, thisCfg.path[0].y, 600
		);
		longGlowGradient.addColorStop( 0, `rgba( 255, 150, 255, ${parent.originFlashAlpha} )` );
		longGlowGradient.addColorStop( 1, 'rgba( 255, 150, 255, 0 )' );

		c.fillStyle = longGlowGradient;
		c.fillCircle( thisCfg.path[0].x, thisCfg.path[0].y, 600 );

		let originGradient = c.createRadialGradient(
			thisCfg.path[0].x, thisCfg.path[0].y, 0,
			thisCfg.path[0].x, thisCfg.path[0].y, 100
		);
		originGradient.addColorStop( 0, `rgba( 150, 150, 255, ${parent.originFlashAlpha} )` );
		originGradient.addColorStop( 1, 'rgba( 150, 150, 255, 0 )' );

		c.fillStyle = originGradient;
		c.fillCircle( thisCfg.path[0].x, thisCfg.path[0].y, 100 );
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
			c.strokeStyle = `rgba( ${thisCfg.colR}, ${thisCfg.colG}, ${thisCfg.colB}, ${thisCfg.colA})`;
		} else {
			c.strokeStyle = 'white';
		}
		
		c.lineWidth = 3;
		c.shadowBlur = 20;
		c.shadowColor = `rgba( ${thisCfg.colR}, ${thisCfg.colG}, ${thisCfg.colB}, ${thisCfg.colA})`;

		let glowHeadPathL = new Path2D();
		let glowHeadPathS = new Path2D();
		if ( cHP > 2 ) {
			glowHeadPathL.moveTo( thisPath[ cHP - 2 ].x, thisPath[ cHP - 2 ].y - sRO );
			glowHeadPathL.lineTo( thisPath[ cHP - 1 ].x, thisPath[ cHP - 1 ].y - sRO );
			glowHeadPathL.lineTo( thisPath[ cHP ].x, thisPath[ cHP ].y - sRO );
			c.stroke( glowHeadPathL );

			c.shadowBlur = 10;
			c.stroke( glowHeadPathL );
		}
		
		c.shadowColor = `rgba( ${thisCfg.colR}, ${thisCfg.colG}, ${thisCfg.colB}, ${thisCfg.colA / 2})`;
		c.shadowBlur = 10;
		glowHeadPathS.moveTo( thisPath[ cHP - 1 ].x, thisPath[ cHP - 1 ].y - sRO );
		glowHeadPathS.lineTo( thisPath[ cHP ].x, thisPath[ cHP ].y - sRO );
		c.stroke( glowHeadPathS );

		c.shadowBlur = 5;
		c.stroke( glowHeadPathS );

		c.shadowBlur = 0;
	}
}

module.exports = renderPath;