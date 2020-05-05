let mathUtils = require( '../../utils/mathUtils.js' );

function update( c ){
	let renderCfg = this.renderConfig;
	let mLen = this.members.length;
	c.globalCompositeOperation = 'lighter';

	for( let i = 0; i < mLen; i++ ) {
		let m = this.members[ i ];

		if ( m !== undefined ) {

			let mState = m.state.states;
			let currState = m.getCurrentState();

			if( currState === 'isCountdown' ) {
				let mClock = m.clock;
				let mTotalClock = m.totalClock;
				if ( mClock < mTotalClock ) {
					m.clock++;
				} else {
					m.clock = 0;
					if ( mState.isComplete === false ) {
						m.totalClock = mathUtils.randomInteger( 10, 50 );
						m.setState( 'isCountdown' );
					} else {
						m.setState( 'isCountdownComplete' );
					}
				}
			}

			if ( mState.isDrawn === true && m.willConnect === true ) {
				if ( mState.isConnected === false ) {
					m.setState( 'isConnected' );
					m.setState( 'isFieldEffect' );
					m.setState( 'isCountdown' );
					m.totalClock = mathUtils.randomInteger( 10, 50 );
				}
			}

			m.updateRenderConfig();
			for( let j = 0; j < m.paths.length; j++ ) {
				let thisPathCfg = m.paths[ j ];
				if ( thisPathCfg.isChild === false && thisPathCfg.isActive === false ) {
					this.members.splice(i, 1);
					i--;
					break;
				}
				thisPathCfg.render( c, m, this ).update( m, this );
			}
		} else {
			continue;
		}
	}
	c.globalCompositeOperation = 'source-over';
}

module.exports = update;