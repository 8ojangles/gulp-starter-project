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
	let pathLen = thisPath.length - 1;

	const computedPathColor = `rgba(${colR}, ${colG}, ${colB}, ${colA})`;
	const pathGlowRGB = `${glowColR}, ${glowColG}, ${glowColB}`;
	const pathGlowComputedColor = `rgba( ${pathGlowRGB}, ${colA} )`;
	const headGlowBlurArr = [ 20, 10 ];
	const pathGlowOpts = { blurs: parent.glowBlurIterations, blurColor: pathGlowComputedColor };
	const pathGlowShortOpts = { blurs: [120, 80, 60, 40, 30, 20, 15, 10, 5], blurColor: pathGlowComputedColor };
	const headGlowOpts = { blurs: headGlowBlurArr, blurColor: pathGlowComputedColor };
	// shadow render offset
	const sRO = globalConfig.renderConfig.blurRenderOffset;
	const origin = thisCfg.path[0];
	const { x: oX, y: oY } = origin;

	if ( parent.isDrawn === false ) { this.drawPaths( renderCfg, parent ); }
	
	c.lineWidth = lineWidth;
	c.strokeStyle = computedPathColor;
	c.stroke( savedPaths.main );
	pathGlow( c, thisCfg, savedPaths.offset, pathGlowOpts );

	// if the main path has "connected" and is "discharging"
	if (thisCfg.isChild === false) {

		pathGlow( c, thisCfg, savedPaths.originLong, pathGlowOpts );
		pathGlow( c, thisCfg, savedPaths.originShort, pathGlowShortOpts );

		if ( parent.isDrawn === true ) {
			// origin glow gradients
			let origin = thisCfg.path[0];
			let grd = c.createRadialGradient( oX, oY, 0, oX, oY, 1024 );
			grd.addColorStop( 0, pathGlowComputedColor );
			grd.addColorStop( 1, `rgba( ${pathGlowRGB}, 0 )` );

			c.fillStyle = grd;
			c.fillCircle( oX, oY, 1024 );
		}
		
	}

	if ( pathLen > 4 ) {
		let glowHeadPathL = new Path2D();
		let glowHeadPathS = new Path2D();

		glowHeadPathL.moveTo( thisPath[ pathLen - 2 ].x, thisPath[ pathLen - 2 ].y - sRO );
		glowHeadPathL.lineTo( thisPath[ pathLen - 1 ].x, thisPath[ pathLen - 1 ].y - sRO );
		glowHeadPathL.lineTo( thisPath[ pathLen ].x, thisPath[ pathLen ].y - sRO );
		pathGlow( c, thisCfg, glowHeadPathL, headGlowOpts );
		
		glowHeadPathS.moveTo( thisPath[ pathLen - 1 ].x, thisPath[ pathLen - 1 ].y - sRO );
		glowHeadPathS.lineTo( thisPath[ pathLen ].x, thisPath[ pathLen ].y - sRO );
		pathGlow( c, thisCfg, glowHeadPathS, headGlowOpts );

	}

	return this;
}

module.exports = renderPath;