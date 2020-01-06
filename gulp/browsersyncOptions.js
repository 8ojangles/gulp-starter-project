// If you are already serving your website locally using something like apache
// You can use the proxy setting to proxy that instead
// proxy: "yourlocal.dev"
let bsOpts = {
	open: false,
    server: {
        baseDir: "./dist/",
        directory: true
    },
    port: 4000,
    ui: {
		port: 4001
	}
}

module.exports = bsOpts;