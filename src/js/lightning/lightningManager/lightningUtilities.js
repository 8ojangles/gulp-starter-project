let globalConfig = require( './globalConfig.js' );
let creationConfig = require( './creationConfig.js' );
let renderConfig = require( './renderConfig.js' );
let lMgrClock = require( './lMgrClock.js' );
let setGlobalInterval = require( './setGlobalInterval.js' );
let setLocalClockTarget = require( './setLocalClockTarget.js' );
let createLightning = require( './createLightning.js' );
let clearMemberArray = require( './clearMemberArray.js' );
let setCanvasDetails = require( './setCanvasDetails.js' );
let update = require( './updateArr.js' );
let updateRenderCfg = require( './updateRenderCfg.js' );
let drawDebugRadialTest = require( './drawDebugRadialTest.js' );
let drawDebugLines = require( './drawDebugLines.js' );
let SimplexNoise = require( '../../utils/simplex-noise-new.js' );

let ligntningMgr = {
	members: [],
	debugMembers: [],
	canvasCfg: {},
	noiseField: new SimplexNoise(),
	setCanvasCfg: setCanvasDetails,
	globalConfig:globalConfig,
	creationConfig: creationConfig,
	renderConfig: renderConfig,
	clock: lMgrClock,
	clearMemberArray: clearMemberArray,
	setLocalClockTarget: setLocalClockTarget,
	setGlobalInterval: setGlobalInterval,
	createLightning: createLightning,
	update: update,
	updateRenderCfg: updateRenderCfg,
	drawDebugRadialTest: drawDebugRadialTest,
	drawDebugLines: drawDebugLines
}

module.exports = ligntningMgr;