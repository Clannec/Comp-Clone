const CoreBase = require('../Core/Base')
const PageType = require('./Type')

const fs = require('fs-extra')
const Path = require('path')

class PageController extends CoreBase {
	bankStyles = {}
	debug = require('debug')('Page/Controller')
	pages
	store

	constructor(registry) {
		super(registry, 'page')

		this.store = this.db.getKey('page', [])

		this.setupPages()

		this.registry.on('io_connect', this.clientConnect.bind(this))
	}

	clientConnect(client) {
		client.on('set_page', (id, name) => {
			this.debug('client: set_page ' + id, name)
			this.setPageName(id, name)
		})

		client.on('get_page_all', (answer) => {
			this.debug('client: get_page_all')
			answer(this.getAllSimple())
		})
	}

	drawAll(invalidate = true) {
		for (let n = 1; n <= global.MAX_PAGES; n++) {
			if (this.pages[n] !== undefined) {
				out[n] = this.pages[n].draw(invalidate)
			}
		}
	}

	getAll() {
		return this.pages
	}

	getAllSimple() {
		let out = {}

		for (let n = 1; n <= global.MAX_PAGES; n++) {
			if (this.pages[n] !== undefined) {
				out[n] = this.pages[n].getSimple()
			}
		}

		return out
	}

	getBank(page, id) {
		let out

		if (this.pages[page] !== undefined) {
			this.pages[page].getBank(id)
		}

		return out
	}

	getBankBuffer(page, id) {
		return this.getBank(page, id).buffer
	}

	getBankStyles() {
		if (this.bankStyles.length == 0) {
			try {
				let path = Path.join(this.registry.appRoot, 'lib/Bank/Style')

				if (fs.existsSync(path)) {
					styleFolder = fs.readdirSync(path)

					if (styleFolder.length > 0) {
						for (let i in styleFolder) {
							let file = styleFolder[i]
							let name = file.toLowerCase().substring(0, file.length - 3)

							if (file == 'Base.js') {
								continue
							} else {
								try {
									let style = require(Path.join(path, file))
									this.bankStyles[name] = style
								} catch (e) {
									this.debug(`Could not read bank style ${name}: ${e.message}`)
								}
							}
						}
					}
				}
			} catch (e) {
				this.debug(`Could not read bank styles: ${e.message}`)
			}
		}

		return this.bankStyles
	}

	getPage(id) {
		return this.pages[id]
	}

	getPageExtended(id) {
		return
	}

	getPageImages(id) {
		return this.pages[id] !== undefined ? this.pages[id].getBankImages() : null
	}

	getPageSimple(id) {
		return this.pages[id] !== undefined ? this.pages[id].getSimple() : null
	}

	getPageName(id) {
		return this.pages[id] !== undefined ? this.pages[id].name : ''
	}

	resetAll() {
		for (let n = 1; n <= global.MAX_PAGES; n++) {
			this.pages[n].reset()
		}
	}

	setPageName(id, name, invalidate = true) {
		this.debug('Set page ' + id + ' to ', name)
		if (this.pages[id] !== undefined) {
			this.pages[id].setName(name, invalidate)
		}
	}

	setupPages() {
		for (let n = 1; n <= global.MAX_PAGES; n++) {
			if (this.store[n] === undefined) {
				this.store[n] = {}
			}

			this.pages[n] = new PageType(this.registry, n, this.store[n])
		}
	}
}

exports = module.exports = PageController
