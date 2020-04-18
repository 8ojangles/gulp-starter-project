// wrap in condition to check if drawing is required

function drawPaths( pathArray, savedPaths, pathDrawStart, pathDrawEnd, parentCfg ) {
	
	// pointers
	let thisCfg = this;
	let pathArr = thisCfg.path;
	let pathArrLen = pathArr.length;

	// current parent render head point
	let masterHeadPoint = parentCfg.renderCfg.currHead;
	// path start point
	let pathStartPoint = thisCfg.renderOffset;
	// path current end point
	let currHeadPoint = thisCfg.currHeadPoint;

	let startPointIndex = 0;
	let endPointIndex = 0;

	// calculate number and indexes of points to add to savedPath
		// calculate start point
		// calculate end point

	// add points to path

	// update drawStart and drawEnd

	//////////////////////////////////////////////////////////////////
	// conditions:

		// if pathStartPoint > masterHeadPoint
			// return

		// if pathStartPoint <= masterHeadPoint
			// calculate startPoint = currHeadPoint
			// calculate endPoint = masterHeadPoint


	//////////////////////////////////////////////////////////////////
	if ( pathStartPoint > masterHeadPoint ) {
		return;
	}


	if ( pathStartPoint < masterHeadPoint ) {

		if ( currentHeadPoint === 0 ) {
			let p = pathArr[ 0 ];
			savedPaths.main.moveTo( p.x, p.y );
			savedPaths.offset.moveTo( p.x, p.y - 10000 );
			savedPaths.originShort.moveTo( p.x, p.y - 10000 );
			savedPaths.originLong.moveTo( p.x, p.y - 10000 );
		} else {
			let calculateHeadDiff = currentHeadPoint + ( masterHeadPoint - pathStartPoint - currentHeadPoint);
			for( let i = currHeadPoint; i < calculateHeadDiff; i++ ) {
				let p = thisPath[ i ];
				savedPaths.main.lineTo( p.x, p.y );
				savedPaths.offset.lineTo( p.x, p.y - 10000 );

				if ( l < 20 ) {
					savedPaths.originLong.lineTo( p.x, p.y - 10000 );
					if ( l < 5 ) {
						savedPaths.originShort.lineTo( p.x, p.y - 10000 );
					}
				}
			}

			thisCfg.currHeadPoint += calculateHeadDiff; 

		}

	}

	// if ( currentHeadPoint === 0 ) {
	// 	savedPaths.main.moveTo( p.x, p.y );
	// 	savedPaths.offset.moveTo( p.x, p.y - sRO );
	// 	savedPaths.originShort.moveTo( p.x, p.y - sRO );
	// 	savedPaths.originLong.moveTo( p.x, p.y - sRO );
	// }

	// calculate number and indexes of points to add to savedPath
		// calculate start point
		// calculate end point

	// add points to path

	// update drawStart and drawEnd

}

module.exports = drawPaths;