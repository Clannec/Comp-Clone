import ControlBase from './ControlBase.js'
import Registry from '../Registry.js'

export default class PageDownButtonControl extends ControlBase {
	type = 'pagedown'

	constructor(registry, controlId, storage) {
		super(registry, controlId, 'page-button', 'Controls/PageDownButton')

		if (!storage) {
			// New control

			// Save the change
			this.commitChange()
		} else {
			if (storage.type !== 'pagedown') throw new Error(`Invalid type given to PageDownButtonControl: "${storage.type}"`)
		}
	}
	//

	toJSON(clone = true) {
		return {
			type: this.type,
		}
	}
}