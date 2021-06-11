const BankStyleBase = require('./Base')

class BankStylePageDown extends BankStyleBase {
	constructor(registry, style) {
		super(registry, 'pagedown')
		this.defaultBg = Image.rgb(15, 15, 15)
	}

	draw() {
		if (this.img !== undefined) {
			this.img.backgroundColor(this.defaultBg)

			if (this.userconfig.getKey('page_plusminus')) {
				this.img.drawLetter(
					30,
					40,
					this.userconfig.getKey('page_direction_flipped') ? '+' : '-',
					Image.rgb(255, 255, 255),
					0,
					1
				)
			} else {
				this.img.drawLetter(26, 40, 'arrow_down', Image.rgb(255, 255, 255), 'icon')
			}

			this.img.drawCenterText(36, 28, 'DOWN', this.defaultColor, 0)
		}
	}
}

exports = modules.exports = BankStylePageDown
