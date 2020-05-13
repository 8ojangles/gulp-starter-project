function redrawPath( renderCfg, parent, globalConfig ) {

	let thisCfg = this;
	let { path: pathArr, savedPaths, renderOffset: pathStartPoint, isChild } = thisCfg;
	let pathArrLen = pathArr.length;
	let noiseField = globalConfig.noiseField;
	let newMainPath = new Path2D();
	let newOffsetPath = new Path2D();
	let newOriginLongPath = new Path2D();

	for( let i = 0; i < pathArrLen; i++ ) {
		let p = pathArr[ i ];
		
		let t = 0;
		
		// modify corrdinates with field effect:
		let fieldModVal = noiseField.noise3D( p.x, p.y, t );
		let x = p.x * fieldModVal;
		let y = p.y * fieldModVal;

		if ( i === 0 ) {
			newMainPath.moveTo( x, y );
			newOffsetPath.moveTo( x, y - 10000 );
			newOriginLongPath.moveTo( x, y - 10000 );
			continue;
		}
		newMainPath.lineTo( x, y );
		newOffsetPath.lineTo( x, y - 10000 );

		if ( i < 20 ) {
			newOriginLongPath.lineTo( x, y - 10000 );
		}
	}

	thisCfg.savedPaths.main = newMainPath;
	thisCfg.savedPaths.offset = newOffsetPath;
	thisCfg.savedPaths.originLong = newOriginLongPath;

}

module.exports = redrawPath;