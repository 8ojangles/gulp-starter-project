require('./typeDefs');

/**
* cached values
*/
const piByHalf = Math.Pi / 180;
const halfByPi = 180 / Math.PI;

/**
* provides trigonomic utility methods and helpers.
* @module
*/
let trigonomicUtils = {

	angle: function(originX, originY, targetX, targetY) {
        var dx = originX - targetX;
        var dy = originY - targetY;
        var theta = Math.atan2(-dy, -dx);
        return theta;
    },

	/**
 * @description calculate distance between 2 vector coordinates.
 * @memberof trigonomicUtils
 * @param {number} x1 - X coordinate of vector 1.
 * @param {number} y1 - Y coordinate of vector 1.
 * @param {number} x2 - X coordinate of vector 2.
 * @param {number} y2 - Y coordinate of vector 2.
 * @returns {number} result.
 */
	dist: function dist(x1, y1, x2, y2) {
		x2 -= x1;y2 -= y1;
		return Math.sqrt(x2 * x2 + y2 * y2);
	},

	/**
	* @description convert degrees to radians.
	* @memberof trigonomicUtils
	* @param {number} degrees - the degree value to convert.
	* @returns {number} result.
	*/
	degreesToRadians: function(degrees) {
		return degrees * piByHalf;
	},

	/**
	* @description convert radians to degrees.
	* @memberof trigonomicUtils
	* @param {number} radians - the degree value to convert.
	* @returns {number} result.
	*/
	radiansToDegrees: function(radians) {
		return radians * halfByPi;
	},

	/**
 	* @description calculate trigomomic values between 2 vector coordinates.
 	* @memberof trigonomicUtils
	* @param {number} x1 - X coordinate of vector 1.
	* @param {number} y1 - Y coordinate of vector 1.
	* @param {number} x2 - X coordinate of vector 2.
	* @param {number} y2 - Y coordinate of vector 2.
	* @typedef {Object} Calculation
	* @property {number} distance The distance between vectors
	* @property {number} angle The angle between vectors
	* @returns { Calculation } the calculated angle and distance between vectors
	*/
	getAngleAndDistance: function getAngleAndDistance(x1, y1, x2, y2) {

		// set up base values
		var dX = x2 - x1;
		var dY = y2 - y1;
		// get the distance between the points
		var d = Math.sqrt(dX * dX + dY * dY);
		// angle in radians
		// var radians = Math.atan2(yDist, xDist) * 180 / Math.PI;
		// angle in radians
		var r = Math.atan2(dY, dX);
		return {
			distance: d,
			angle: r
		};
	},

	/**
	* @description get length of the Adjacent side of a right-angled triangle.
	* @memberof trigonomicUtils
	* @param {number} radians - the angle or the triangle.
	* @param {number} hypotonuse - the length of the hypotenuse.
	* @returns {number} result - the length of the Adjacent side.
	*/
	getAdjacentLength: function getAdjacentLength(radians, hypotonuse) {
		return Math.cos(radians) * hypotonuse;
	},

	/**
	* @description get length of the Opposite side of a right-angled triangle.
	* @memberof trigonomicUtils
	* @param {number} radians - the angle or the triangle.
	* @param {number} hypotonuse - the length of the hypotenuse.
	* @returns {number} result - the length of the Opposite side.
	*/
	getOppositeLength: function(radians, hypotonuse) {
		return Math.sin(radians) * hypotonuse;
	},

	/**
	* @description given an origin (x/y), angle and impulse (absulte velocity) calculate relative x/y velocities.
	* @memberof trigonomicUtils
	* @param {number} x - the coordinate X value of the origin.
	* @param {number} y - the coordinate Y value of the origin.
	* @param {number} angle - the angle in radians.
	* @param {number} impulse - the delta change value.
	* @returns {VelocityVector} result - relative delta change velocity for X/Y.
	*/
	calculateVelocities: function(x, y, angle, impulse) {
		var a2 = Math.atan2(Math.sin(angle) * impulse + y - y, Math.cos(angle) * impulse + x - x);
		return {
			xVel: Math.cos(a2) * impulse,
			yVel: Math.sin(a2) * impulse
		}
	},

	/**
	* @description Returns a new Point vector (x/y) at the given distance (r) from the origin at the angle (a) .
	* @memberof trigonomicUtils
	* @param {number} x - the coordinate X value of the origin.
	* @param {number} y - the coordinate Y value of the origin.
	* @param {number} r - the absolute delta change value.
	* @param {number} a - the angle in radians.
	* @returns {Point} - the coordinates of the new point.
	*/
	radialDistribution: function(x, y, r, a) {
		return {
			x: x + r * Math.cos(a),
			y: y + r * Math.sin(a)
		}
	},

	/**
	* @description Returns a new Point vector (x/y) at the given distance (r) from the origin at the angle (a) .
	* @memberof trigonomicUtils
	* @param {number} x - the coordinate X value of the origin.
	* @param {number} y - the coordinate Y value of the origin.
	* @param {number} angle - the angle in radians.
	* @param {number} distance - the absolute delta change value.
	* @returns {Point} - the coordinates of the new point.
	*/
	findNewPoint: function(x, y, angle, distance) {
		return {
			x: Math.cos(angle) * distance + x,
			y: Math.sin(angle) * distance + y
		}
	},

	/**
	* @description Returns a new Point vector (x/y) at the given distance (distance) along a path defined by x1/y1, x2/y2.
	* @memberof trigonomicUtils
	* @param {number} x1 - the coordinate X value of the path start.
	* @param {number} y1 - the coordinate Y value of the path start.
	* @param {number} x2 - the coordinate X value of the path end.
	* @param {number} y2 - the coordinate Y value of the path end.
	* @param {number} distance - a number between 0 and 1 where 0 is the path start, 1 is the path end, and 0.5 is the path midpoint.
	*/
	getPointOnPath: function( x1, y1, x2, y2, distance ) {
		return {
			x: x1 + ( x2 - x1 ) * distance,
			y: y1 + ( y2 - y1 ) * distance
		}
	},
	/**
	* @name computeNormals
	* @description https://stackoverflow.com/questions/1243614/how-do-i-calculate-the-normal-vector-of-a-line-segment
	* if we define dx=x2-x1 and dy=y2-y1
	* @memberof trigonomicUtils
	* @param {number} x1 - the coordinate X value of the path start.
	* @param {number} y1 - the coordinate Y value of the path start.
	* @param {number} x2 - the coordinate X value of the path end.
	* @param {number} y2 - the coordinate Y value of the path end.
	* @returns {object} - The 2 normal vectors from the defined path as points
	*/
	computeNormals: function( x1, y1, x2, y2 ) {
		let dx = x2 - x1;
		let dy = y2 - y1;
		return {
			n1: { x: -dy, y: dx },
			n2: { x: dy, y: -dx },
		}
	},
	/**
	* @name subdivide
	* @description subdivides a vector path (x1, y1, x2, y2) proportionate to the bias
	* @memberof trigonomicUtils
	* @param {number} x1 - the coordinate X value of the path start.
	* @param {number} y1 - the coordinate Y value of the path start.
	* @param {number} x2 - the coordinate X value of the path end.
	* @param {number} y2 - the coordinate Y value of the path end.
	* @param {number} bias - offset of the subdivision between the sbdivision: i.e. 0 - the start vector, 0.5 - midpoint between the 2 vectors, 1 - the end vector.
	* @returns {point} - The coordinates of the subdivision point
	*/
	subdivide: function( x1, y1, x2, y2, bias ) {
		return this.getPointOnPath( x1, y1, x2, y2, bias );
	}

};

module.exports.trigonomicUtils = trigonomicUtils;