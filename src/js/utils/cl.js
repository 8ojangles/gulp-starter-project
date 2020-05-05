let prefix = '\x1b[';

const cl = {
	// red
	r: `${prefix}31m`,
	bgr: `${prefix}40m`,
	// green
	g: `${prefix}32m`,
	bgg: `${prefix}42m`,
	//yellow
	y: `${prefix}33m`,
	bgy: `${prefix}43m`,
	// blue
	b: `${prefix}36m`,
	bgb: `${prefix}46m`,
	// magenta
	m: `${prefix}35m`,
	bgm: `${prefix}45m`,
	// white
	w: `${prefix}37m`,
	bgw: `${prefix}47m`,
	// reset
	rst: `${prefix}0m`,
	// bold/bright
	bld: `${prefix}1m`,
	// dim
	dim: `${prefix}2m`
}

module.exports = cl;