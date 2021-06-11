const CoreBase = require('../Core/Base')
const BankType = require('../Bank/Type')

class PageType extends CoreBase {
	banks = []
	debug
	id
	name
	store

	constructor(registry, id, data) {
		super(registry, `page_${id}`)

		this.debug = require('debug')(`Page/${id}`)
		this.id = id
		this.name = data.name !== undefined ? data.name : 'PAGE'
		this.store = data

		let newPage = false

		if (this.store.banks === undefined) {
			this.store.banks = []
			newPage = true
		}

		this.setupBanks(this.store.banks, newPage)
	}

	draw(invalidate = true) {
		for (let n in this.banks) {
			if (this.banks[n] !== undefined) {
				this.banks[n].draw(invalidate)
			}
		}
	}

	findPageNav() {
		const nav = {
			pagenum: [],
			pageup: [],
			pagedown: [],
		}

		for (let n = 1; n <= global.MAX_BUTTONS; n++) {
			if (this.banks[n].style !== undefined) {
				switch (this.banks[n].style) {
					case 'pageup':
						nav.pageup.push(n)
						break
					case 'pagenum':
						nav.pagenum.push(n)
						break
					case 'pagedown':
						nav.pagedown.push(n)
						break
				}
			}
		}
	}

	getBank(id) {
		return this.banks[id]
	}

	getBankImages() {
		let out = {}

		for (let n = 1; n <= global.MAX_BUTTONS; n++) {
			if (this.banks[n] !== undefined) {
				result[n] = this.banks[n].getBufferAndTime()
			}
		}

		return out
	}

	getExtended() {
		return { ...this.findPageNav(), name: this.name }
	}

	getSimple() {
		return { name: this.name }
	}

	invalidatePageName() {
		for (let n in this.banks) {
			if (this.banks[n] !== undefined) {
				if (this.banks[n].style == 'pagenum') {
					this.banks[n].invalidate()
				}
			}
		}
	}

	reset() {
		this.setName('PAGE')

		for (var n = 1; n <= global.MAX_BUTTONS; n++) {
			this.banks[n].reset()
		}

		this.banks[1].setStyle('pageup')
		this.banks[9].setStyle('pagenum')
		this.banks[17].setStyle('pagedown')
	}

	resetNav() {
		this.banks[1].reset()
		this.banks[9].reset()
		this.banks[17].reset()

		this.banks[1].setStyle('pageup')
		this.banks[9].setStyle('pagenum')
		this.banks[17].setStyle('pagedown')
	}

	setName(name, invalidate = true) {
		if (typeof name == 'string') {
			this.name = this.store.name = name

			this.io.emit('set_page:result', this.id, name)

			if (invalidate === true) {
				this.invalidatePageName()
				this.instance.internal.updatePages()
				this.preview.updateWebButtonsPage(this.id)
			}

			this.db.setDirty()
		}
	}

	setupBanks(data, newPage) {
		for (let n = 1; n <= global.MAX_BUTTONS; n++) {
			if (data[n] === undefined) {
				data[n] = {}
			}

			this.banks[n] = new BankType(this, n, data[n], newPage)
		}
	}
}

exports = module.exports = PageType
