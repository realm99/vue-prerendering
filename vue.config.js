const webpack = require('webpack')
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const getPrerenderRoutes = require('./scripts/prerenderRoutes.js')

// Multipage Entries
var pagesConfig = {
	index: {
		entry: 'src/main.js',
		template: 'public/index.html',
		prerender: true
	},
	home: {
		entry: 'src/js/Home.js',
		template: './src/pages/home.html',
		filename: 'home.html',
		prerender: true
	}
}

// WEBPACK CONFIG
module.exports = {
	filenameHashing: false,
	runtimeCompiler: true,
	// Vue Multipage Setup
	pages: pagesConfig,
	configureWebpack: {
		plugins: []
	},
	// Webpack chainable config
	chainWebpack: config => {
		// Disable html minify
		for (var pageName in pagesConfig) {
			config.plugin('html-' + pageName).tap(args => {
				args[0].minify = false
				return args
			})
		}
	},
}

// BUILD CONFIG
if (process.env.NODE_ENV === 'production') {
	module.exports.configureWebpack.plugins = (module.exports.configureWebpack.plugins || []).concat([
		// Prerender
		new PrerenderSPAPlugin({
			staticDir: path.join(__dirname, 'dist'),
			routes: getPrerenderRoutes(pagesConfig),
			postProcess (context) {
				// Remove /index.html from the output path if the dir name ends with a .html file extension.
				// For example: /dist/dir/special.html/index.html -> /dist/dir/special.html
				if (context.route.endsWith('.html')) {
					context.outputPath = path.join(__dirname, 'dist', context.route)
				}
				return context
			}
		})
	])
}
