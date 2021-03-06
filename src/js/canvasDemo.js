// Canvas Lightning v1
const mathUtils = require( './utils/mathUtils.js' );
const easing = require( './utils/easing.js' ).easingEquations;
let matchDimentions = require( './matchDimentions.js' );

// let easeFn = easing.easeInCirc;
let easeFn = easing.linearEase;
let rndInt = mathUtils.randomInteger;
let rnd = mathUtils.random;
// Lightning trigger range
let lightningFrequencyLow = 100;
let lightningFrequencyHigh = 250;

// Lightning segment count
let lSegmentCountL = 10;
let lSegmentCountH = 35;

// Distance ranges between lightning path segments
let lSegmentXBoundsL = 15;
let lSegmentXBoundsH = 60;
let lSegmentYBoundsL = 25;
let lSegmentYBoundsH = 55;



function canvasLightning( canvas ){
  
    this.init = function(){
        this.loop();
    };    
  
    var _this = this;
    this.c = canvas;
    this.ctx = canvas.getContext( '2d' );
    this.cw = canvas.width;
    this.ch = canvas.height;
    this.mx = 0;
    this.my = 0;

    this.lightning = [];
    this.lightTimeCurrent = 0;
    this.lightTimeTotal = 50;
  
    // Utilities        
    this.hitTest = function( x1, y1, w1, h1, x2, y2, w2, h2) {
        return !( x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1 );
    };
    
// Create Lightning
    this.createL = function( x, y, canSpawn, isChild ){

        let thisLightning = {
            x: x,
            y: y,
            xRange: rndInt( lSegmentXBoundsL, lSegmentXBoundsH ),
            yRange: rndInt( lSegmentYBoundsL, lSegmentYBoundsH ),
            path: [{ x: x, y: y }],
            pathLimit: rndInt( lSegmentCountL, lSegmentCountH ),
            canSpawn: canSpawn,
            isChild: isChild,
            hasFired: false,
            alpha: 0
        }

        this.lightning.push( thisLightning );
    };
    
// Update Lightning
    this.updateL = function(){
        var i = this.lightning.length;
        while ( i-- ){
            let light = this.lightning[ i ];
            let { path, xRange, yRange, pathLimit } = light;
            let pathLen = path.length;
            let prevLPath = path[ pathLen - 1 ];                      
            light.path.push({
                x: prevLPath.x + ( rndInt( 0, xRange )-( xRange / 2 ) ),
                y: prevLPath.y + ( rndInt( 0, yRange ) )
            });
            
            if ( pathLen > pathLimit ){
                this.lightning.splice( i, 1 )
            }
            light.hasFired = true;
        };
    };
    
// Render Lightning
    this.renderL = function(){
        let i = this.lightning.length;
        let c = this.ctx;
        let glowColor = 'white';
        let glowBlur = 30;
        let shadowRenderOffset = 10000;

        while( i-- ){
            let light = this.lightning[ i ];
            let pathCount = light.path.length;
            let childLightFires = rndInt( 0, 100 ) < 30 ? true : false;
            let alpha;

            if ( light.isChild === false || childLightFires ) {
                if ( pathCount === light.pathLimit ) {
                    
                    c.fillStyle = 'rgba( 255, 255, 255, ' + rndInt( 20, 50 ) / 100 + ')';
                    c.fillRect( 0, 0, this.cw, this.ch );

                    let maxLineWidth = 100;
                    let iterations = rndInt( 10, 50 );
                    c.lineCap = "round";

                    for( let i = 0; i < iterations; i++ ){

                        let colorChange = easeFn( i, 150, 105, iterations );
                        c.globalCompositeOperation = 'lighter';
                        c.strokeStyle = 'white';
                        c.shadowBlur = easeFn( i, maxLineWidth, -maxLineWidth, iterations );
                        c.shadowColor = `rgba( ${ colorChange }, ${ colorChange }, 255, 1 )`;
                        c.shadowOffsetY = shadowRenderOffset;
                        c.beginPath();
                        c.moveTo( light.x, light.y - shadowRenderOffset );
                        for( let j = 0; j < pathCount; j++ ){  
                            let p = light.path[ j ];
                            c.lineTo( p.x, p.y - shadowRenderOffset );
                        }
                        c.stroke();
                        
                    }
                    c.shadowOffsetY = 0;
                }
            }

            if ( light.isChild === false || childLightFires ) {
                if ( pathCount === light.pathLimit ) {
                    c.lineWidth = 5;
                    alpha = 1;
                    c.shadowColor = 'rgba( 100, 100, 255, 1 )';
                    c.shadowBlur = glowBlur;
                } else {
                    c.lineWidth = 0.5;
                    alpha = rndInt( 10, 50 ) / 100;
                }
            } else {
                c.lineWidth = 1;
                alpha = rndInt( 10, 50 ) / 100;
            }

            c.strokeStyle = `hsla( 0, 100%, 100%, ${alpha} )`;


            c.beginPath();
            c.moveTo( light.x, light.y );
            for( let i = 0; i < pathCount; i++ ){    
                let pSeg = light.path[ i ];
                c.lineTo( pSeg.x, pSeg.y );

                if( light.canSpawn ){
                    if( rndInt(0, 100 ) < 1 ){
                        light.canSpawn = false;
                        this.createL( pSeg.x, pSeg.y, true, true );
                    } 
                }
            }
            c.stroke();
            c.shadowBlur = 0;

        };
    };
    
// Lightning Timer
    this.lightningTimer = function(){
        this.lightTimeCurrent++;
        if( this.lightTimeCurrent >= this.lightTimeTotal ){

            let newX = rndInt( 50, this.cw - 50 );
            let newY = rndInt( -30, -25 ); 
            let createCount = rndInt( 1, 2 );
            
            while( createCount-- ){                         
                this.createL( newX, newY, true, false );
            }
            
            this.lightTimeCurrent = 0;
            this.lightTimeTotal = rndInt( lightningFrequencyLow, lightningFrequencyHigh );
        }
    }
 
    this.clearCanvas = function(){
        let c = this.ctx;
        // c.globalCompositeOperation = 'destination-out';
        c.fillStyle = 'rgba( 0,0,0,' + rndInt( 1, 30 ) / 100 + ')';
        // c.fillStyle = 'rgba( 0,0,0,0.1)';
        c.fillRect( 0, 0, this.cw, this.ch );
        c.globalCompositeOperation = 'source-over';
    };
    

    this.resizeCanvasHandler = function() {
        _this.cw = _this.c.width = _this.c.parentNode.clientWidth;
    }

// Resize on Canvas on Window Resize
    $(window).on( 'resize', function() {
        _this.resizeCanvasHandler();
    });
    
// Animation Loop
    this.loop = function(){
        var loopIt = function(){
            requestAnimationFrame( loopIt, _this.c );
            _this.clearCanvas();
            _this.updateL();
            _this.lightningTimer();
            _this.renderL();  
        };
        loopIt();                   
    };
  
};

function startLightningAnimation( canvasDomSelector, parent ) {
    let thisParent = parent || window;
    let thisCanvas = document.querySelector( canvasDomSelector );
    console.log( 'thisCanvas:, ', thisCanvas );
    console.log( 'thisParent:, ', thisParent );
    if ( thisCanvas ) {
        matchDimentions( thisCanvas, thisParent );
        var cl = new canvasLightning( thisCanvas );
        cl.init();
    } else {
        console.warn( 'No element matching selector: '+canvasDomSelector+' found!' );
    }
}

module.exports.canvasLightning = canvasLightning;
module.exports.startLightningAnimation = startLightningAnimation;