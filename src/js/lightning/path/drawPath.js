// wrap in condition to check if drawing is required
const cl = require( '../../utils/cl.js' );

function drawPaths( renderCfg, parent ) {
	// pointers
	let thisCfg = this;
	let { currHead: masterHeadPoint, segmentsPerFrame } = renderCfg;
	let { path: pathArr, savedPaths, renderOffset: pathStartPoint, currHeadPoint: currentHeadPoint } = thisCfg;
	let pathArrLen = pathArr.length;
	let startPointIndex = 0;
	let endPointIndex = 0;

	// early return out of function if we haven't reached the path start point yet OR the currentHeadPoint is greater than the pathArrayLength
	if ( pathStartPoint > masterHeadPoint ) return;

	if ( currentHeadPoint >= pathArrLen ) {
		if ( thisCfg.isChild === false ) {
			parent.isDrawn = true;
			parent.setState( 'isDrawn' );
		}
		return; 
	}

	startPointIndex = currentHeadPoint === 0 ? currentHeadPoint : currentHeadPoint;
	endPointIndex = Math.floor( currentHeadPoint + segmentsPerFrame > pathArrLen ? pathArrLen : currentHeadPoint + segmentsPerFrame );

	for( let i = startPointIndex; i < endPointIndex; i++ ) {
		let p = pathArr[ i ];
		if ( i === 0 ) {
			savedPaths.main.moveTo( p.x, p.y );
			savedPaths.offset.moveTo( p.x, p.y - 10000 );
			savedPaths.originLong.moveTo( p.x, p.y - 10000 );
			continue;
		}
		savedPaths.main.lineTo( p.x, p.y );
		savedPaths.offset.lineTo( p.x, p.y - 10000 );

		if ( i < 20 ) {
			savedPaths.originLong.lineTo( p.x, p.y - 10000 );
		}
	}
	this.currHeadPoint = endPointIndex;

}

module.exports = drawPaths;