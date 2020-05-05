function redrawPath( renderCfg, parent, globalConfig ) {

	let thisCfg = this;
	let { path: pathArr, savedPaths, renderOffset: pathStartPoint } = thisCfg;
	let pathArrLen = pathArr.length;
	let noiseField = globalConfig.noiseField;
	let newMainPath = new Path2D();
	let newOffsetPath = new Path2D();
	let newOriginLongPath = new Path2D();

	for( let i = 0; i < pathArrLen; i++ ) {
		let p = pathArr[ i ];
		if ( i === 0 ) {
			newMainPath.moveTo( p.x, p.y );
			newOffsetPath.moveTo( p.x, p.y - 10000 );
			newOriginLongPath.moveTo( p.x, p.y - 10000 );
			continue;
		}
		newMainPath.lineTo( p.x, p.y );
		newOffsetPath.lineTo( p.x, p.y - 10000 );

		if ( i < 20 ) {
			newOriginLongPath.lineTo( p.x, p.y - 10000 );
		}
	}

	thisCfg.savedPaths.main = newMainPath;
	thisCfg.savedPaths.offset = newOffsetPath;
	thisCfg.savedPaths.originLong = newOriginLongPath;

}

module.exports = redrawPath;