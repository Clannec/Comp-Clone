const BankStyleBase = require('./Base')

class BankStylePress extends BankStyleBase {
	constructor(registry, style) {
		super(registry, 'press')
	}
}

exports = modules.exports = BankStylePress
