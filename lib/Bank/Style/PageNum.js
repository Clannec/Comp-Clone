const BankStyleBase = require('./Base')

class BankStylePageNum extends BankStyleBase {
	constructor(registry, style) {
		super(registry, 'pagenum')
		this.defaultBg = Image.rgb(15, 15, 15)
	}

	draw() {
		if (this.img !== undefined) {
			this.img.backgroundColor(this.defaultBg)
			let pagename = this.pageId !== undefined && this.pageId > 0 ? this.page.getPageName(this.pageId) : ''

			if (this.pageId === undefined) {
				// Preview (no page/bank)
				this.img.drawAlignedText(0, 0, 72, 30, 'PAGE', this.defaultFg, 0, undefined, 1, 'center', 'bottom')
				this.img.drawAlignedText(0, 32, 72, 30, 'x', Image.rgb(255, 255, 255), 18, undefined, 1, 'center', 'top')
			} else if (pagename == 'PAGE' || pagename == '') {
				this.img.drawAlignedText(0, 0, 72, 30, 'PAGE', this.defaultFg, 0, undefined, 1, 'center', 'bottom')
				this.img.drawAlignedText(
					0,
					32,
					72,
					30,
					'' + this.pageId,
					Image.rgb(255, 255, 255),
					18,
					undefined,
					1,
					'center',
					'top'
				)
			} else {
				this.img.drawAlignedText(0, 0, 72, 72, pagename, Image.rgb(255, 255, 255), '18', 2, 0, 'center', 'center')
			}
		}
	}
}

exports = modules.exports = BankStylePageNum
