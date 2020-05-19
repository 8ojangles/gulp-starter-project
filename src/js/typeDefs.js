/**
 * jQuery object
 * @external jQuery
 * @see {@link http://api.jquery.com/jQuery/}
 */

/**
 * @typedef {Object} Dimensions
 * @description values describing the length of sides X (horizontal) and Y (vertical) in 2d (cartesean) space
 * @property {number} w - width
 * @property {number} h - height
 */

/**
* @typedef {Object} Point - A point in space on a 2d (cartesean) plane
* @description A point in a 2d (cartesean) space plane, as an x/y coordinate pair
* @property {number} x - The X Coordinate
* @property {number} y - The Y Coordinate
*/

/** 
*  @typedef {Object} VelocityVector - The change delta for cartesean x/y, or 2d coordinate systems
*  @property {number} xVel The X delta change value.
*  @property {number} yVel The Y delta change value.
*/

/**
* @typedef {Object} vectorCalculation
* @property {number} distance The distance between vectors
* @property {number} angle The angle between vectors
*/

/**
* @typedef {object} createPathOptions
* @description The options available when creating a new path from the {@link createPathFromOptions} constructor function
* @property {boolean} [isChild=false] - is the path spawned from the original seed path or the main path?.
* @property {boolean} [isActive=false] - is the path active?.
* @property {boolean} [isRendering=false] - is the path rendering.
* @property {boolean} [willStrike=false] - will the path connect with a target.
* @property {number} startX - x value for the path start.
* @property {number} startY - y value for the path start.
* @property {number} endX - x value for the path end.
* @property {number} endY - y value for the path end.
* @property {number} subdivisions - number of subdivion passes made when plotting the path points from start to end.
* @property {object} sequences - object containing an animation sequence information.
* @property {number} [pathColR=255] - path stroke color RED (0-255).
* @property {number} [pathColG=255] - path stroke color GREEN (0-255).
* @property {number} [pathColB=255] - path stroke color BLUE (0-255).
* @property {number} [pathColA=1] - path stroke color ALPHA (transparency) (0-1).
* @property {number} [glowColR=255] - path glow color RED (0-255).
* @property {number} [glowColG=255] - path glow color GREEN (0-255).
* @property {number} [glowColB=255] - path glow color BLUE (0-255).
* @property {number} [glowColA=1] - path glow color ALPHA (transparency) (0-1).
* @property {number} [lineWidth=1] - line width of the path at creation (default: 1).
* @property {number} [renderOffset=0] - if isChild is true, this reperesents the array index on the main path point array which this path will regard as it's start point. During rendering where the paths are drawn along their length, this is used as the offset before starting the child paths rendering.
* @property {number} [branchDepth=0] - the branch level that this path has been spawned at (main path is level 0).
* @property {number} [clock=0] - clock incrementer for the path.
* @property {number} [totalClock] - total time before event.
* @property {number} [sequenceClock] - total length of sequence.sequenceStartIndex
* @property {number} [sequenceStartIndex=0] - given the path may have more than one sequence attached this will be the array index of the sequence to start with.
* @property {number} [sequenceIndex=0] - the array index of the current active sequence.
*/


/**
* @typedef {object} pathObject
* @description The return object created by the {@link createPathFromOptions} function
* @property {boolean} isChild is this the main path or a sub(child) path?
* @property {boolean} isActive is this path active?
* @property {boolean} isRendering is the path to be rendered onscreen?
* @property {boolean} willStrike will the path connect to a target?
* @property {number} branchDepth what level of the recursive path creation function is this path? Main path = branchDepth = 0.
* @property {number} baseAngle the angle in radians between the path start and end points.
* @property {number} baseDist the distance between the path start and end points.
* @property {number} colR - path stroke color RED (0-255).
* @property {number} colG - path stroke color GREEN (0-255).
* @property {number} colB - path stroke color BLUE (0-255).
* @property {number} colA - path stroke color ALPHA (transparency) (0-1).
* @property {number} glowColR - path glow color RED (0-255).
* @property {number} glowColG - path glow color GREEN (0-255).
* @property {number} glowColB - path glow color BLUE (0-255).
* @property {number} glowColA - path glow color ALPHA (transparency) (0-1).
* @property {number} lineWidth - line width of the path at creation (default: 1)
* @property {number} clock - the main clock timer for the path
* @property {number} sequenceClock - the sequence clock for current active sequence
* @property {number} totalClock - total clock timing for the path
* @property {boolean} drawPathSequence - is the path in drawing mode
* @property {array} sequences - array of sequence definition objects
* @property {number} sequenceStartIndex - array index of the first sequence to run when active
* @property {number} sequenceIndex - array index of the currently active sequence
* @property {boolean} playSequence - are the sequences playing
* @property {object} currSequence - the current active sequence
* @property {function} startSequence - utility method to start a sequence
* @property {function} updateSequence - utility method to update active sequence
* @property {function} updateSequenceClock - utility method to update the sequence clock
* @property {function} drawPaths - utility method to draw the path
* @property {function} redrawPath - utility method to re-draw the path with possible variances
* @property {function} update - utility method to update the path
* @property {function} render - utility method to render the path
* @property {number} renderOffset - if isChild = true the array index on the main path coordinate list where this child path starts.  
* @property {number} currHeadPoint - when rendering the current array index of path to render.
* @property {array<Point>} path - the created path as an array of x/y coordinate pair objects
* @property {object} savedPaths - object containing named saved paths stored after plotting the path points
* @property {Path2D} savedPaths.main - Path2D primitive containing the main path
* @property {Path2D} savedPaths.offset - Path2D primitive containing the main path duplicate for outer glow rendering
* @property {Path2D} savedPaths.originShort - Path2D primitive containing path for rendering the glow at path start (main path, i.e. isChild = false) 
* @property {Path2D} savedPaths.originLong - Path2D primitive containing path for rendering the additional glow at path start (main path, i.e. isChild = false)
*/




module.exports = {};