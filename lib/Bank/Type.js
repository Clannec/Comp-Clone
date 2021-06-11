const CoreBase = require('../Core/Base')

class BankType extends CoreBase {
	id
	parent
	store
	style
	constructor(parent, id, data, newBank) {
		super(parent.registry, `bank_${parent.id}.${id}`)

		this.debug = require('debug')(`Bank/${parent.id}.${id}`)
		this.parent = parent
		this.id = id
		this.store = data

		if (newBank === true) {
			switch (id) {
				case 1:
					this.store.type = 'pageup'
					break
				case 9:
					this.store.type = 'pagenum'
					break
				case 17:
					this.store.type = 'pagedown'
					break
				default:
					this.store.type = 'none'
					break
			}
		}
	}
}

exports = module.exports = BankType
