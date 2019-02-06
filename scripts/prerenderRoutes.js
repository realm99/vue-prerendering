function getPrerenderRoutes (pagesConfig) {
	var routesToPrerender = []
	for (var entryPage in pagesConfig) {
		const pageConfig = pagesConfig[entryPage]
		if (pageConfig.prerender === true) {
			const route = pageConfig.template !== 'public/index.html' ? `/${pageConfig.filename}` : '/'
			routesToPrerender.push(route)
		}
	}
	return routesToPrerender
}

module.exports = getPrerenderRoutes
