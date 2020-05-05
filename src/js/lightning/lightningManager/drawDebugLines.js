function drawDebugLines( c ) {
	let members = this.members;
	let membersLen = members.length;

	for( let i = 0; i < membersLen; i++ ) {
		let thisMember = this.members[ i ];

		let thisPaths = thisMember.paths;
		let thisPathsLen = thisPaths.length;

		for( let j = 0; j < thisPathsLen; j++ ) {
			let path = thisPaths[ j ].path;
			c.lineWidth = 5;
			c.strokeStyle = 'red';
			c.setLineDash( [5, 15] );
			c.line( path[0].x, path[0].y, path[path.length - 1].x, path[path.length - 1].y );
			c.setLineDash( [] );	
		}

	}
}

module.exports = drawDebugLines;