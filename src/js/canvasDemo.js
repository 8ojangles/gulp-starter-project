// Canvas Lightning v1
const mathUtils = require( './mathUtils.js' );
let rndInt = mathUtils.randomInteger;

// Lightning trigger range
let lightningFrequencyLow = 30;
let lightningFrequencyHigh = 100;

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
    this.createL = function( x, y, canSpawn ){

        let thisLightning = {
            x: x,
            y: y,
            xRange: rndInt( lSegmentXBoundsL, lSegmentXBoundsH ),
            yRange: rndInt( lSegmentYBoundsL, lSegmentYBoundsH ),
            path: [{ x: x, y: y }],
            pathLimit: rndInt( lSegmentCountL, lSegmentCountH ),
            canSpawn: canSpawn,
            hasFired: false
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
            if ( pathCount ===light.pathLimit ) {
                c.lineWidth = 5;
                alpha = 1;
            } else {
                c.lineWidth = rndInt( 1, 3 );
                alpha = rndInt( 10, 50 ) / 100;
            }

            c.strokeStyle = `hsla( 0, 100%, 100%, ${alpha} )`;
            // c.lineWidth = lWidthFn( 0, 150 );

            c.beginPath();
            c.moveTo( light.x, light.y );

            for( let i = 0; i < pathCount; i++ ){    
                let pSeg = light.path[ i ];
                c.lineTo( pSeg.x, pSeg.y );

                if( light.canSpawn ){
                    if( rndInt(0, 100 ) == 50 ){
                        light.canSpawn = false;
                        this.createL( pSeg.x, pSeg.y, true );
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

            var newX = rndInt( 50, cw - 50 );
            var newY = rndInt( -30, -25 ); 
            var createCount = rndInt( 1, 3 );
            
            while( createCount-- ){                         
                this.createL( newX, newY, true );
            }
            
            this.lightTimeCurrent = 0;
            this.lightTimeTotal = rndInt( lightningFrequencyLow, lightningFrequencyHigh );
        }
    }
 
    this.clearCanvas = function(){
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba( 0,0,0,' + rndInt( 1, 30 ) / 100 + ')';
        this.ctx.fillRect( 0, 0, this.cw, this.ch );
        this.ctx.globalCompositeOperation = 'source-over';
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