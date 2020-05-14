require('../typeDefs');

/**
* cached values
*/
const piByHalf = Math.PI / 180;
const halfByPi = 180 / Math.PI;

/**
* provides trigonomic utility methods and helpers.
* @module
* @typedef {import("../typeDefs").Point} Point
* @typedef {import("../typeDefs").Dimensions} Dimensions
* @typedef {import("../typeDefs").VelocityVector} VelocityVector
* @typedef {import("../typeDefs").vectorCalculation} vectorCalculation
*/
let trigonomicUtils = {
	/**
	* @name angle
	 * @description calculate angle in radians between to vector points.
	 * @memberof trigonomicUtils
	 * @param {number} x1 - X coordinate of vector 1.
	 * @param {number} y1 - Y coordinate of vector 1.
	 * @param {number} x2 - X coordinate of vector 2.
	 * @param {number} y2 - Y coordinate of vector 2.
	 * @returns {number} the angle in radians.
	 */
	angle: function(x1, y1, x2, y2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        var theta = Math.atan2(-dy, -dx);
        return theta;
    },

    getRadianAngleBetween2Vectors: function( x1, y1, x2, y2 ) {
    	return Math.atan2(y2 - y1, x2 - x1);
    },
	/**
	* @name dist
	* @description calculate distance between 2 vector coordinates.
	* @memberof trigonomicUtils
	* @param {number} x1 - X coordinate of vector 1.
	* @param {number} y1 - Y coordinate of vector 1.
	* @param {number} x2 - X coordinate of vector 2.
	* @param {number} y2 - Y coordinate of vector 2.
	* @returns {number} the distance between the 2 points.
	*/
	dist: function dist(x1, y1, x2, y2) {
		x2 -= x1;y2 -= y1;
		return Math.sqrt(x2 * x2 + y2 * y2);
	},

	/**
	* @name degreesToRadians
	* @description convert degrees to radians.
	* @memberof trigonomicUtils
	* @param {number} degrees - the degree value to convert.
	* @returns {number} result as radians.
	*/
	degreesToRadians: function(degrees) {
		return degrees * piByHalf;
	},

	/**
	* @name radiansToDegrees
	* @description convert radians to degrees.
	* @memberof trigonomicUtils
	* @param {number} radians - the degree value to convert.
	* @returns {number} result as degrees.
	*/
	radiansToDegrees: function(radians) {
		return radians * halfByPi;
	},

	/**
	* @name getAngleAndDistance
 	* @description calculate trigomomic values between 2 vector coordinates.
 	* @memberof trigonomicUtils
	* @param {number} x1 - X coordinate of vector 1.
	* @param {number} y1 - Y coordinate of vector 1.
	* @param {number} x2 - X coordinate of vector 2.
	* @param {number} y2 - Y coordinate of vector 2.
	* @returns {vectorCalculation} the calculated angle and distance between vectors
	*/
	getAngleAndDistance: function(x1, y1, x2, y2) {

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
	* @name getAdjacentLength
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
	* @name getOppositeLength
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
	* @name calculateVelocities
	* @description given an origin (x/y), angle and impulse (absolute velocity) calculate relative x/y velocities.
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
	* @name radialDistribution
	* @description Returns a new Point vector (x/y) at the given distance (r) from the origin at the angle (a) .
	* @memberof trigonomicUtils
	* @param {number} x - the coordinate X value of the origin.
	* @param {number} y - the coordinate Y value of the origin.
	* @param {number} d - the absolute delta change value.
	* @param {number} a - the angle in radians.
	* @returns {Point} - the coordinates of the new point.
	*/
	radialDistribution: function(x, y, d, a) {
		return {
			x: x + d * Math.cos(a),
			y: y + d * Math.sin(a)
		}
	},

	/**
	* @name findNewPoint
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
	* @name getPointOnPath
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
	* @returns {Point} - The coordinates of the subdivision point
	*/
	subdivide: function( x1, y1, x2, y2, bias ) {
		return this.getPointOnPath( x1, y1, x2, y2, bias );
	},

	// Curve fuctions

	/**
	* @name getPointAt
	* @description given 3 vector {point}s of a quadratic curve, return the point on the curve at t
	* @memberof trigonomicUtils
	* @param {Point} p1 - {x,y} of the curve's start point.
	* @param {Point} pc - {x,y} of the curve's control point.
	* @param {Point} p2 - {x,y} of the curve's end point.
	* @param {number} bias - the point along the curve's path as a ratio (0-1).
	* @returns {Point} - {x,y} of the point on the curve at {bias}
	*/
	getPointAt: function( p1, pc, p2, bias ) {
	    const x = (1 - bias) * (1 - bias) * p1.x + 2 * (1 - bias) * bias * pc.x + bias * bias * p2.x
	    const y = (1 - bias) * (1 - bias) * p1.y + 2 * (1 - bias) * bias * pc.y + bias * bias * p2.y
	    return { x, y };
	},

	/**
	* @name getDerivativeAt
	* @description Given 3 vector {point}s of a quadratic curve, returns the derivative (tanget) of the curve at point of bias.
	(The derivative measures the steepness of the curve of a function at some particular point on the curve (slope or ratio of change in the value of the function to change in the independent variable).
	* @memberof trigonomicUtils
	* @param {Point} p1 - {x,y} of the curve's start point.
	* @param {Point} pc - {x,y} of the curve's control point.
	* @param {Point} p2 - {x,y} of the curve's end point.
	* @param {number} bias - the point along the curve's path as a ratio (0-1).
	* @returns {Point} - {x,y} of the point on the curve at {bias}
	*/
	getDerivativeAt: function(p1, pc, p2, bias) {
	    const d1 = { x: 2 * (pc.x - p1.x), y: 2 * (pc.y - p1.y) };
	    const d2 = { x: 2 * (p2.x - pc.x), y: 2 * (p2.y - pc.y) };
	    const x = (1 - bias) * d1.x + bias * d2.x;
	    const y = (1 - bias) * d1.y + bias * d2.y;
	    return { x, y };
	},

	/**
	* @name getNormalAt
	* @description given 3 vector {point}s of a quadratic curve returns the normal vector of the curve at the ratio point along the curve {bias}.
	* @memberof trigonomicUtils
	* @param {Point} p1 - {x,y} of the curve's start point.
	* @param {Point} pc - {x,y} of the curve's control point.
	* @param {Point} p2 - {x,y} of the curve's end point.
	* @param {number} bias - the point along the curve's path as a ratio (0-1).
	* @returns {Point} - {x,y} of the point on the curve at {bias}
	*/
	getNormalAt: function(p1, pc, p2, bias) {
	    const d = this.getDerivativeAt( p1, pc, p2, bias );
	    const q = Math.sqrt(d.x * d.x + d.y * d.y);
	    const x = -d.y / q;
	    const y = d.x / q;
	    return { x, y };
	},

	/**
	* @name projectNormalAtDistance
	* @description given 3 vector {point}s of a quadratic curve returns the normal vector of the curve at the ratio point along the curve {bias} at the required {distance}.
	* @memberof trigonomicUtils
	* @param {Point} p1 - {x,y} of the curve's start point.
	* @param {Point} pc - {x,y} of the curve's control point.
	* @param {Point} p2 - {x,y} of the curve's end point.
	* @param {number} bias - the point along the curve's path as a ratio (0-1).
	* @param {number} distance - the distance to project the normal.
	* @returns {Point} - {x,y} of the point projected from the normal on the curve at {bias}
	*/
	projectNormalAtDistance: function(p1, pc, p2, bias, distance) {
		const p = this.getPointAt(p1, pc, p2, bias);
      	const n = this.getNormalAt(p1, pc, p2, bias);
      	const x = p.x + n.x * distance;
      	const y = p.y + n.y * distance;
      	return { x, y };
	},

	/**
	* @name getAngleOfNormal
	* @description given 3 vector {point}s of a quadratic curve returns the angle of the normal vector of the curve at the ratio point along the curve {bias}.
	* @memberof trigonomicUtils
	* @param {Point} p1 - {x,y} of the curve's start point.
	* @param {Point} pc - {x,y} of the curve's control point.
	* @param {Point} p2 - {x,y} of the curve's end point.
	* @param {number} bias - the point along the curve's path as a ratio (0-1).
	* @returns {number} - the angle of the normal of the curve at {bias}
	*/
	getAngleOfNormal: function( p1, pc, p2, bias ) {
		const p = this.getPointAt(p1, pc, p2, bias);
      	const n = this.getNormalAt(p1, pc, p2, bias);
      	return this.getRadianAngleBetween2Vectors( p.x, p.y, n.x, n.y );
	}


};

trigonomicUtils.d2R = trigonomicUtils.degreesToRadians;
trigonomicUtils.r2D = trigonomicUtils.radiansToDegrees;

module.exports.trigonomicUtils = trigonomicUtils;