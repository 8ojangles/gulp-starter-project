// path rendering function
function renderPath( c, parent, globalConfig ) {
	let renderCfg = globalConfig.renderConfig;
	let currRenderPoint = 0;
	let currRenderHead = 0;
	let currRenderTail = 0;
	let thisCfg = this;
	let thisPath = this.path;
	let pathLen = thisPath.length;

	if ( thisCfg.isChild === false ) {
		if ( parent.status.renderPhase === 1 ) {
			c.lineWidth = 5;
		} else {
			c.lineWidth = 1;
		}
		
		c.strokeStyle = 'white';
	} else {
		c.lineWidth = 1;
	}
	let currHeadPoint = 0;

	c.strokeStyle = `rgba( ${thisCfg.colR}, ${thisCfg.colG}, ${thisCfg.colB}, ${thisCfg.colA})`;
	c.beginPath();
	for ( let l = 0; l <= pathLen - 1; l++ ) {
		let p = thisPath[ l + currRenderTail ];
		if ( this.renderOffset + l < renderCfg.currHead ) {
			if ( l === 0 ) {
				c.moveTo( p.x, p.y );
				continue;
			}
			c.lineTo( p.x, p.y );

			currHeadPoint = l;
		}
		// after drawing path, set currently rendered head index
		currRenderPoint = this.renderOffset + l;
	}
	c.stroke();

	if ( currHeadPoint > 0 ) {
		if ( currHeadPoint >= pathLen - 1 ) {
			c.strokeStyle = `rgba( ${thisCfg.colR}, ${thisCfg.colG}, ${thisCfg.colB}, ${thisCfg.colA})`;
		} else {
			c.strokeStyle = 'white';
		}
		
		c.lineWidth = 3;
		c.beginPath();
		c.moveTo( thisPath[ currHeadPoint - 1 ].x, thisPath[ currHeadPoint - 1 ].y );
		c.lineTo( thisPath[ currHeadPoint ].x, thisPath[ currHeadPoint ].y );
		c.stroke();
	}
}

module.exports = renderPath;