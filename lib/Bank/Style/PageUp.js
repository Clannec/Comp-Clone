const BankStyleBase = require('./Base')

class BankStylePageUp extends BankStyleBase {
	constructor(registry, style) {
		super(registry, 'pageup')
		this.defaultBg = Image.rgb(15, 15, 15)
	}

	draw() {
		if (this.img !== undefined) {
			this.img.backgroundColor(this.defaultBg)

			if (this.userconfig.getKey('page_plusminus')) {
				this.img.drawLetter(
					30,
					20,
					this.userconfig.getKey('page_direction_flipped') ? '-' : '+',
					Image.rgb(255, 255, 255),
					0,
					1
				)
			} else {
				this.img.drawLetter(26, 20, 'arrow_up', Image.rgb(255, 255, 255), 'icon')
			}

			this.img.drawAlignedText(0, 39, 72, 8, 'UP', this.defaultColor, 0, undefined, 1, 'center', 'center')
		}
	}
}

exports = modules.exports = BankStylePageUp
