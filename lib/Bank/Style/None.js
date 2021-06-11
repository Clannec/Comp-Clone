const BankStyleBase = require('./Base')

class BankStyleNone extends BankStyleBase {
	constructor(registry, style) {
		super(registry, 'none')
	}
}

exports = modules.exports = BankStyleNone
