const CoreBase = require('../Core/Base')
const PageType = require('../Types/Page')

class PageController extends CoreBase {
	debug = require('debug')('Page/Controller')
	pages
	store

	constructor(registry) {
		super(registry, 'page')

		this.store = this.db.getKey('page', {})

		this.setupPages()

		this.system.on('io_connect', (client) => {
			client.on('set_page', (id, name) => {
				this.debug('client: set_page ' + id, name)
				this.setPageName(id, name)
			})

			client.on('get_page_all', (answer) => {
				this.debug('client: get_page_all')
				answer(this.getAll())
			})
		})
	}

	getAll() {
		let out = {}

		for (let id = 1; id <= global.MAX_PAGES; id++) {
			if (this.pages[id] !== undefined) {
				out[n] = this.pages[id].getSimple()
			}
		}

		return out
	}

	getPage(id) {
		return this.pages[id] !== undefined ? this.pages[id].getSimple() : null
	}

	getPageName(id) {
		return this.pages[id] !== undefined ? this.pages[id].name : ''
	}

	setPageName(id, name, invalidate = true) {
		this.debug('Set page ' + id + ' to ', name)
		if (this.pages[id] !== undefined) {
			this.pages[id].setName(name, invalidate)
		}
	}

	setupPages() {
		for (let n = 1; n <= global.MAX_PAGES; n++) {
			this.pages[n] = new PageType(n, this.store[n])
		}
	}
}

exports = module.exports = PageController
