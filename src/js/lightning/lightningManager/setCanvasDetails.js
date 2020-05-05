function setCanvasDetails( canvasId ) {
	let canvasInstance = document.querySelector( canvasId );
	let ctx = canvasInstance.getContext('2d');
	let cW = canvasInstance.width = window.innerWidth;
	let cH = canvasInstance.height = window.innerHeight;

	this.canvasCfg.canvas = canvasInstance;
	this.canvasCfg.c = ctx;
	this.canvasCfg.cW = cW;
	this.canvasCfg.cH = cH;
}

module.exports = setCanvasDetails;