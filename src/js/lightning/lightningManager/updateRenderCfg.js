function updateRenderCfg() {
		let members = this.members;
		let memLen = members.length;
		for( let i = 0; i <= memLen - 1; i++ ) {
			members[ i ].updateRenderConfig();
		}
	}

module.exports = updateRenderCfg;