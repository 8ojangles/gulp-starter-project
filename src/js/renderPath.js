// path rendering function
function renderPath( c, parent, globalConfig ) {
	let renderCfg = globalConfig.renderConfig;
	let currRenderPoint = 0;
	let currRenderHead = 0;
	let currRenderTail = 0;
	let thisCfg = this;
	let thisPath = this.path;
	let pathLen = thisPath.length;

	let shadowRenderOffset = 10000;

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

	if ( parent.status.renderPhase === 1 && thisCfg.isChild === false) {

		c.fillStyle = `rgba( 255, 255, 255, ${parent.skyFlashAlpha} )`;
		c.fillRect( 0, 0, globalConfig.canvasW, globalConfig.canvasH );


		c.strokeStyle = "white";
		c.shadowBlur = 100;
		c.shadowOffsetY = shadowRenderOffset;
		c.shadowColor = "white";
		c.beginPath();
		for ( let l = 0; l <= pathLen - 1; l++ ) {
			let p = thisPath[ l + currRenderTail ];
			if ( this.renderOffset + l < renderCfg.currHead ) {
				if ( l === 0 ) {
					c.moveTo( p.x, p.y - shadowRenderOffset );
					continue;
				}
				c.lineTo( p.x, p.y - shadowRenderOffset );

				currHeadPoint = l;
			}
			// after drawing path, set currently rendered head index
			currRenderPoint = this.renderOffset + l;
		}
		c.stroke();

		c.shadowBlur = 20;
		c.beginPath();
		for ( let l = 0; l <= pathLen - 1; l++ ) {
			let p = thisPath[ l + currRenderTail ];
			if ( this.renderOffset + l < renderCfg.currHead ) {
				if ( l === 0 ) {
					c.moveTo( p.x, p.y - shadowRenderOffset );
					continue;
				}
				c.lineTo( p.x, p.y - shadowRenderOffset );

				currHeadPoint = l;
			}
			// after drawing path, set currently rendered head index
			currRenderPoint = this.renderOffset + l;
		}
		c.stroke();

		c.shadowBlur = 50;
		c.beginPath();
		for ( let l = 0; l <= pathLen - 1; l++ ) {
			let p = thisPath[ l + currRenderTail ];
			if ( this.renderOffset + l < renderCfg.currHead ) {
				if ( l === 0 ) {
					c.moveTo( p.x, p.y - shadowRenderOffset );
					continue;
				}
				c.lineTo( p.x, p.y - shadowRenderOffset );

				currHeadPoint = l;
			}
			// after drawing path, set currently rendered head index
			currRenderPoint = this.renderOffset + l;
		}
		c.stroke();

		c.shadowBlur = 0;
	}


	if ( currHeadPoint > 0 ) {
		if ( currHeadPoint >= pathLen - 1 ) {
			c.strokeStyle = `rgba( ${thisCfg.colR}, ${thisCfg.colG}, ${thisCfg.colB}, ${thisCfg.colA})`;
		} else {
			c.strokeStyle = 'white';
		}
		
		c.lineWidth = 3;
		c.shadowBlur = 20;
		c.shadowColor = `rgba( ${thisCfg.colR}, ${thisCfg.colG}, ${thisCfg.colB}, ${thisCfg.colA})`;
		c.shadowOffsetY = 10000;

		if ( currHeadPoint > 2 ) {
			c.beginPath();
			c.moveTo(
				thisPath[ currHeadPoint - 2 ].x,
				thisPath[ currHeadPoint - 2 ].y - shadowRenderOffset
			);
			c.lineTo(
				thisPath[ currHeadPoint - 1 ].x,
				thisPath[ currHeadPoint - 1 ].y - shadowRenderOffset
			);
			c.lineTo(
				thisPath[ currHeadPoint ].x,
				thisPath[ currHeadPoint ].y - shadowRenderOffset
			);
			c.stroke();

			c.shadowBlur = 10;
			c.beginPath();
			c.moveTo(
				thisPath[ currHeadPoint - 2 ].x,
				thisPath[ currHeadPoint - 2 ].y - shadowRenderOffset
			);
			c.lineTo(
				thisPath[ currHeadPoint - 1 ].x,
				thisPath[ currHeadPoint - 1 ].y - shadowRenderOffset
			);
			c.lineTo(
				thisPath[ currHeadPoint ].x,
				thisPath[ currHeadPoint ].y - shadowRenderOffset
			);
			c.stroke();
		}
		
		c.shadowColor = `rgba( ${thisCfg.colR}, ${thisCfg.colG}, ${thisCfg.colB}, ${thisCfg.colA / 2})`;

		c.shadowBlur = 10;
		c.beginPath();
		c.moveTo(
			thisPath[ currHeadPoint - 1 ].x,
			thisPath[ currHeadPoint - 1 ].y - shadowRenderOffset
		);
		c.lineTo(
			thisPath[ currHeadPoint ].x,
			thisPath[ currHeadPoint ].y - shadowRenderOffset
		);
		c.stroke();

		c.shadowBlur = 5;
		c.beginPath();
		c.moveTo(
			thisPath[ currHeadPoint - 1 ].x,
			thisPath[ currHeadPoint - 1 ].y - shadowRenderOffset
		);
		c.lineTo(
			thisPath[ currHeadPoint ].x,
			thisPath[ currHeadPoint ].y - shadowRenderOffset
		);
		c.stroke();

		c.shadowBlur = 0;
	}
}

module.exports = renderPath;