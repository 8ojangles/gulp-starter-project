// Canvas Lightning v1
const mathUtils = require( './mathUtils.js' );
const easing = require( './easing.js' ).easingEquations;
let easeFn = easing.easeInCirc;

let rndInt = mathUtils.randomInteger;

// Lightning trigger range
let lightningFrequencyLow = 50;
let lightningFrequencyHigh = 150;

// Lightning segment count
let lSegmentCountL = 10;
let lSegmentCountH = 35;

// Distance ranges between lightning path segments
let lSegmentXBoundsL = 15;
let lSegmentXBoundsH = 60;
let lSegmentYBoundsL = 25;
let lSegmentYBoundsH = 55;

function lWidthFn( lowBounds, highBounds ) {
    
    let rndInt = mathUtils.randomInteger( lowBounds, highBounds );
    // range: 0 - 20 - 40 - 130 - 145 - 150
    if ( rndInt > 130 ) {
        // number is between 120 - 150;
        if ( rndInt < 145 ) {
            // number is between 120 - 140;
            return 4;
        } else {
            // number is between 140 - 150;
            return 5;
        }
    } else {
        // number is between 0 - 120;
        if ( rndInt < 40 ) {
            // number is between 0 - 40;
            if ( rndInt < 20 ) {
                // number is between 0 - 20;
                return 3;
            } else {
                // number is between 20 - 40;
                return 2;
            }
        } else {
            // number is between 40 - 120;
            return 1;
        }
    }
}

function canvasLightning( c, cw, ch ){
  
    this.init = function(){
        this.loop();
    };    
  
    var _this = this;
    this.c = c;
    this.ctx = c.getContext( '2d' );
    this.cw = cw;
    this.ch = ch;
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
        while( i-- ){
            let light = this.lightning[ i ];
            let { path, xRange, yRange, pathLimit } = light;
            let pathLen = path.length;
            let prevLPath = path[ pathLen - 1 ];                      
            light.path.push({
                x: prevLPath.x + ( rndInt( 0, xRange )-( xRange / 2 ) ),
                y: prevLPath.y + ( rndInt( 0, yRange ) )
            });

            if( pathLen > pathLimit ){
                this.lightning.splice( i, 1 )
            }
            light.hasFired = true;
        };
    };
    
// Render Lightning
    this.renderL = function(){
        let i = this.lightning.length;
        let c = this.ctx;

        while( i-- ){

            let light = this.lightning[ i ];
            let pathCount = light.path.length;
            let alpha;

            if ( light.isChild === false ) {
                if ( pathCount === light.pathLimit ) {

                    let maxLineWidth = 150;
                    let iterations = 30;
                    let maxAlpha = 0.05;
                    c.lineCap = "round";

                    for( let i = 0; i < iterations; i++ ){
                        c.lineWidth = easeFn( i, maxLineWidth, -maxLineWidth, iterations );
                        c.strokeStyle = `hsla( 0, 100%, 100%, ${ easeFn( i, 0, maxAlpha, iterations ) } )`;

                        c.beginPath();
                        c.moveTo( light.x, light.y );
                        for( let j = 0; j < pathCount; j++ ){    
                            let pSeg = light.path[ j ];
                            c.lineTo( pSeg.x, pSeg.y );
                        }
                        c.stroke();

                    }

                }
            }

            if ( light.isChild === false ) {
                if ( pathCount === light.pathLimit ) {
                    c.lineWidth = 5;
                    alpha = 1;
                } else {
                    c.lineWidth = rndInt( 1, 3 );
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

            if( !light.hasFired ){
                c.fillStyle = 'rgba( 255, 255, 255, ' + rndInt( 4, 12 ) / 100 + ')';
                c.fillRect( 0, 0, this.cw, this.ch );  
            }

            if( rndInt( 0, 30 ) === 0 ){
                c.fillStyle = 'rgba( 255, 255, 255, ' + rndInt( 1, 3 ) / 100 + ')';
                c.fillRect( 0, 0, this.cw, this.ch );  
            }

        };
    };
    
// Lightning Timer
    this.lightningTimer = function(){
        this.lightTimeCurrent++;
        if( this.lightTimeCurrent >= this.lightTimeTotal ){

            let newX = rndInt( 50, cw - 50 );
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
        c.globalCompositeOperation = 'destination-out';
        c.fillStyle = 'rgba( 0,0,0,' + rndInt( 1, 30 ) / 100 + ')';
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


module.exports.canvasLightning = canvasLightning;