/**
* Creates a canvas element in the DOM to test for browser support
* to selected element to match size dimensions.
* @param {string} contextType - ( '2d' | 'webgl' | 'experimental-webgl' | 'webgl2', | 'bitmaprenderer'  )
* The type of canvas and context engine to check support for
* @returns {boolean} - true if both canvas and the context engine are supported by the browser
*/

function checkCanvasSupport( contextType ) {
    let ctx = contextType || '2d';
    let elem = document.createElement( 'canvas' );
    return !!(elem.getContext && elem.getContext( ctx ) );
}

module.exports = checkCanvasSupport;