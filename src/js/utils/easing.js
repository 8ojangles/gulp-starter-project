//#region Licence information 
/*
	* This is a near-direct port of Robert Penner's easing equations. Please shower Robert with
	* praise and all of your admiration. His license is provided below.
	*
	* For information on how to use these functions in your animations, check out my following tutorial: 
	* http://bit.ly/18iHHKq
	*
	* -Kirupa
	*/

	/*
	* @author Robert Penner
	* @license 
	* TERMS OF USE - EASING EQUATIONS
	* 
	* Open source under the BSD License. 
	* 
	* Copyright © 2001 Robert Penner
	* All rights reserved.
	* 
	* Redistribution and use in source and binary forms, with or without modification, 
	* are permitted provided that the following conditions are met:
	* 
	* Redistributions of source code must retain the above copyright notice, this list of 
	* conditions and the following disclaimer.
	* Redistributions in binary form must reproduce the above copyright notice, this list 
	* of conditions and the following disclaimer in the documentation and/or other materials 
	* provided with the distribution.
	* 
	* Neither the name of the author nor the names of contributors may be used to endorse 
	* or promote products derived from this software without specific prior written permission.
	* 
	* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
	* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
	* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
	* COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	* EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
	* GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
	* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	* NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
	* OF THE POSSIBILITY OF SUCH DAMAGE. 
	*
*/
//#endregion

/**
* Provides easing calculation methods.
* @name easingEquations
* @description {@link https://easings.net/en|See the Easing cheat sheet} for a visual representation for each curve formula. Originally developed by {@link http://robertpenner.com/easing/|Robert Penner}
*/
var easingEquations = {
	linearEase: require( './easing/linearEase.js' ),
	easeInQuad: require( './easing/easeInQuad.js' ),
	easeOutQuad: require( './easing/easeOutQuad.js' ),
	easeInOutQuad: require( './easing/easeInOutQuad.js' ),
	easeInCubic: require( './easing/easeInCubic.js' ),
	easeOutCubic: require( './easing/easeOutCubic.js' ),
	easeInOutCubic: require( './easing/easeInOutCubic.js' ),
	easeInQuart: require( './easing/easeInQuart.js' ),
	easeOutQuart: require( './easing/easeOutQuart.js' ),
	easeInOutQuart: require( './easing/easeInOutQuart.js' ),
	easeInQuint: require( './easing/easeInQuint.js' ),
	easeOutQuint: require( './easing/easeOutQuint.js' ),
	easeInOutQuint: require( './easing/easeInOutQuint.js' ),
	easeInSine: require( './easing/easeInSine.js' ),
	easeOutSine: require( './easing/easeOutSine.js' ),
	easeInOutSine: require( './easing/easeInOutSine.js' ),
	easeInExpo: require( './easing/easeInExpo.js' ),
	easeOutExpo: require( './easing/easeOutExpo.js' ),
	easeInOutExpo: require( './easing/easeInOutExpo.js' ),
	easeInCirc: require( './easing/easeInCirc.js' ),
	easeOutCirc: require( './easing/easeOutCirc.js' ),
	easeInOutCirc: require( './easing/easeInOutCirc.js' ),
	easeInElastic: require( './easing/easeInElastic.js' ),
	easeOutElastic: require( './easing/easeOutElastic.js' ),
	easeInOutElastic: require( './easing/easeInOutElastic.js' ),
	easeOutBack: require( './easing/easeOutBack.js' ),
	easeInBack: require( './easing/easeInBack.js' ),
	easeInOutBack: require( './easing/easeInOutBack.js' ),
	easeOutBounce: require( './easing/easeOutBounce.js' ),
	easeInBounce: require( './easing/easeInBounce.js' ),
	easeInOutBounce: require( './easing/easeInOutBounce.js' )
};

module.exports.easingEquations = easingEquations;