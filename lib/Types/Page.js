const CoreBase = require('../Core/Base')
const BankType = require('./Bank')

class PageType extends CoreBase {
	banks = []
	id
	name
	store

	constructor(registry, id, data) {
		super(registry, `page_${id}`)
		this.id = id
		this.name = data.name !== undefined ? data.name : 'PAGE'
		this.store = data

		this.setupBanks(data.banks)
	}

	getSimple() {
		return { name: this.name }
	}

	invalidatePageName() {
		for (let i in this.banks) {
			if (this.banks[i] !== undefined) {
				if (this.banks[i].style == 'pagenum') {
					this.banks[i].invalidate()
				}
			}
		}
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

	setupBanks(data) {
		for (var n = 1; n <= global.MAX_BUTTONS; n++) {
			this.banks[n] = new BankType(n, data[n])
		}
	}
}

exports = module.exports = PageType
