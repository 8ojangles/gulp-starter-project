
/**
* Measures the target DOM element dimensions. Dom elements require node.clientWidth/Height.
* the global.window object rrequires node.innerWidth/Height
* @param {HTMLElement} el - Dom node or element to measure.
* @returns {Dimensions} the dimensions of the element
*/

function getDimensions( el ) {
    return {
        w: el.innerWidth || el.clientWidth,
        h: el.innerHeight || el.clientHeight
    };
}

/**
* Measures the target DOM element and applies width/height
* to selected element "el".
* @param {HTMLElement} el - Dom node pointing to element to transform size.
* @param {HTMLElement} target - Dom node pointing to container element to match dimensions.
* @param {Dimensions} options - optional parameter object with members "w" and "h"
*representing width and height for setting default or minimum values if not met by "target".
* @returns {void}
*/

function matchDimentions( el, target, options = { w: 500, h: 500 } ) {
    let t = getDimensions( target );
    el.width = t.w < options.w ? options.w : t.w;
    el.height = t.h < options.h ? options.h : t.h;
}

module.exports = matchDimentions;