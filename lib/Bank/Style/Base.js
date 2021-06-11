const CoreBase = require('../../Core/Base')
const Image = require('../../Resources/Image')

class BankStyleBase extends CoreBase {
	bankId
	defaultBg = Image.rgb(0, 0, 0)
	defaultFg = Image.rgb(255, 198, 0)
	pageId

	constructor(registry, logSource) {
		super(registry, logSource)
		this.img = new Image(72, 72)
	}

	draw() {
		let img = this.img
		let c = this.style
		let removeTopbar = this.userconfig.getKey('remove_topbar')

		if (removeTopbar) {
			img.boxFilled(0, 0, 71, 71, c.bgcolor)
		} else {
			img.boxFilled(0, 14, 71, 71, c.bgcolor)
		}

		this.system.emit('graphics_set_bank_bg', page, bank, c.bgcolor)

		if (c.png64 !== undefined) {
			try {
				let data = Buffer.from(c.png64, 'base64')
				let halign = c.pngalignment.split(':', 2)[0]
				let valign = c.pngalignment.split(':', 2)[1]

				if (removeTopbar) {
					img.drawFromPNGdata(data, 0, 0, 72, 72, halign, valign)
				} else {
					img.drawFromPNGdata(data, 0, 14, 72, 58, halign, valign)
				}
			} catch (e) {
				img.boxFilled(0, 14, 71, 57, 0)
				img.drawAlignedText(2, 18, 68, 52, 'PNG ERROR', Image.rgb(255, 0, 0), 0, 2, 1, 'center', 'center')
				return img
			}
		} else {
			//TODO move this block to an upgrade
			if (fs.existsSync(this.cfgDir + '/banks/' + page + '_' + bank + '.png')) {
				// one last time
				img.drawFromPNG(this.cfgDir + '/banks/' + page + '_' + bank + '.png', 0, 14)

				// Upgrade config with base64 and delete file
				try {
					data = fs.readFileSync(this.cfgDir + '/banks/' + page + '_' + bank + '.png')
					this.system.emit('bank_set_key', page, bank, 'png64', data.toString('base64'))
					fs.unlink(this.cfgDir + '/banks/' + page + '_' + bank + '.png')
				} catch (e) {
					this.debug('Error upgrading config to inline png for bank ' + page + '.' + bank)
					this.debug('Reason:' + e.message)
				}
			}
		}

		/* raw image buffers */
		if (c.img64 !== undefined) {
			try {
				if (removeTopbar) {
					img.drawPixelBuffer(0, 0, 72, 72, c.img64, 'base64')
				} else {
					img.drawPixelBuffer(0, 14, 72, 58, c.img64, 'base64')
				}
			} catch (e) {
				img.boxFilled(0, 14, 71, 57, 0)
				img.drawAlignedText(2, 18, 68, 52, 'IMAGE ERROR', Image.rgb(255, 0, 0), 0, 2, 1, 'center', 'center')
				return img
			}
		}

		this.drawText

		// move outside of base
		this.drawStatus()
		if (!removeTopbar) {
			this.drawTopbar()
		}
	}

	drawStatus() {
		if (this.img !== undefined && !this.isStatic) {
			let colors = [0, Image.rgb(255, 127, 0), Image.rgb(255, 0, 0)]
			// needs to be revisited
			const instance = this.parent.getInstanceStatus()

			if (instance > 0) {
				this.img.boxFilled(62, 2, 70, 10, colors[instance])
			}

			// needs to be shifted out of base
			if (this.parent.getRunStatus()) {
				this.img.drawLetter(55, 3, 'play', Image.rgb(0, 255, 0), 'icon')
			}
		}
	}

	drawText(c) {
		let img = this.img
		let removeTopbar = this.userconfig.getKey('remove_topbar')
		let text = this.instance.variable.parseText(c.text)

		let halign = c.alignment.split(':', 2)[0]
		let valign = c.alignment.split(':', 2)[1]

		//TODO move to upgrade
		if (c.size == 'small') {
			c.size = 0
		} else if (c.size == 'large') {
			c.size = 14
		} else if (c.size == 7) {
			c.size = 0
		}

		if (c.size != 'auto') {
			if (removeTopbar) {
				img.drawAlignedText(2, 2, 68, 68, text, c.color, parseInt(c.size), 2, 1, halign, valign)
			} else {
				img.drawAlignedText(2, 18, 68, 52, text, c.color, parseInt(c.size), 2, 1, halign, valign)
			}
		} else {
			if (removeTopbar) {
				img.drawAlignedText(2, 2, 68, 68, text, c.color, 'auto', 2, 1, halign, valign)
			} else {
				img.drawAlignedText(2, 18, 68, 52, text, c.color, 'auto', 2, 1, halign, valign)
			}
		}
	}

	drawTopbar(fgColor = this.defaultColor, bgColor = 0) {
		if (this.img !== undefined) {
			this.img.boxFilled(0, 0, 71, 14, bgColor)
			this.img.horizontalLine(13, fgColor)
			this.img.drawTextLine(3, 3, this.id, fgColor, 0)
		}
	}

	get id() {
		if (!this.isStatic) {
			return `${this.pageId}.${this.bankId}`
		} else {
			return 'x.x'
		}
	}

	get isStatic() {
		return this.pageId === undefined && this.bankId === undefined
	}

	get key() {
		if (!this.isStatic) {
			return `${this.pageId}_${this.bankId}`
		} else {
			return 'x_x'
		}
	}
}

exports = module.exports = BankStyleBase
