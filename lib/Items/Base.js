const CoreBase = require('../Core/Base')
const shortid = require('shortid')
const { cloneDeep } = require('lodash')

/**
 * Abstract class to be extended and used by bank controllers to track their items.
 * See {@link ActionItems} and {@link FeedbackItems}
 *
 * @extends CoreBase
 * @author Håkon Nessjøen <haakon@bitfocus.io>
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 * @author William Viker <william@bitfocus.io>
 * @since 2.3.0
 * @abstract
 * @copyright 2021 Bitfocus AS
 * @license
 * This program is free software.
 * You should have received a copy of the MIT licence as well as the Bitfocus
 * Individual Contributor License Agreement for Companion along with
 * this program.
 *
 * You can be released from the requirements of the license by purchasing
 * a commercial license. Buying such a license is mandatory as soon as you
 * develop commercial activities involving the Companion software without
 * disclosing the source code of your own applications.
 */
class ItemsBase extends CoreBase {
	/**
	 * The parent controller
	 * @type {(BankActionController|BankFeedbackController)}
	 * @access protected
	 */
	controller = null
	/**
	 * Nested arrays for the definitions from the instances: <code>[instance_id][item_id]</code>
	 * @type {Object.<string,Object[]>}
	 * @access protected
	 */
	definitions = {}
	/**
	 * Arrays containing the items.
	 * @type {Object[]}
	 * @access protected
	 */
	items = null

	/**
	 * @param {Registry} registry - the core registry
	 * @param {(BankActionController|BankFeedbackController)} controller - the item's parent controller
	 * @param {string} logSource - module name to be used in logs
	 * @param {Object[]} items - incoming items
	 */
	constructor(registry, controller, logSource, items = []) {
		super(registry, logSource)
		this.controller = controller

		this.items = items
		this.cleanupItems()
	}

	/**
	 * Add an item to a bank
	 * @param {string} item - item information in form: `"instance_id:type"`
	 * @access public
	 */
	addItem(item) {
		const s = item.split(/:/)

		let newItem = {
			id: shortid.generate(),
			label: item,
			type: s[1],
			instance: s[0],
			options: {},
		}

		if (!this.instance.getInstanceConfig(newItem.instance)) {
			// Item is not valid
			return
		}

		if (this.definitions[s[0]] !== undefined && this.definitions[s[0]][s[1]] !== undefined) {
			let definition = this.definitions[s[0]][s[1]]

			if (definition.options !== undefined && definition.options.length > 0) {
				for (let j in definition.options) {
					let opt = definition.options[j]
					newItem.options[opt.id] = opt.default
				}
			}
		}

		this.items.push(newItem)
		this.subscribe(newItem)
	}

	/**
	 * Add item to a bank via a client socket
	 * @param {string} item - item information in form: `"instance_id:type"`
	 * @param {function} answer - UI callback
	 * @access public
	 */
	addItemByClient(item, answer) {
		this.addItem(item)

		this.save()
		answer(this.items)
	}

	/**
	 * Scan the page/bank array to find items for an instance or just specific types and populate an array with the findings
	 * @param {string} id - the instance ID to check for
	 * @param {string} type - the item type to check for
	 * @returns {boolean} <code>true</code> if that instance [and type] are present in this set
	 * @access public
	 */
	checkInstanceStatus(id, type) {
		out = false
		for (let i in this.items) {
			let item = this.items[i]
			if (item.instance == id && (type === undefined || item.type == type)) {
				out = true
			}
		}

		return out
	}

	/**
	 * Check an item's status
	 * @param {number} i - the item's index
	 * @access protected
	 */
	checkStatus(i) {}

	/**
	 * Checks all the items to ensure their instances still exist
	 * @access protected
	 */
	cleanupItems() {
		const res = {}

		if (this.items !== undefined) {
			for (let i in this.items) {
				const item = this.items[i]
				if (item && this.instance.getInstanceConfig(item.instance)) {
					res.push(item)
				}
			}
		}

		this.items = res
		this.save()
	}

	/**
	 * Scan the page/bank array for items from an instance and delete them
	 * @param {string} id - the instance ID to delete
	 * @returns {boolean} <code>true</code> if an item was deleted
	 * @access public
	 */
	deleteInstance(id) {
		out = false
		for (let i in this.items) {
			let item = this.items[i]

			if (item.instance == id) {
				this.debug('Deleting item ' + i + ' from button')
				this.deleteItem(i)
				out = true
			}
		}

		this.save()

		return out
	}

	/**
	 * Delete an item
	 * @param {number} index - the item's index
	 * @access public
	 */
	deleteItem(index) {
		if (this.items[index] !== undefined) {
			this.unsubscribeItem(this.items[index])
			this.items.splice(index, 1)
		}
	}

	/**
	 * Delete an item from a bank via a client socket
	 * @param {string} index - the item's id (`item.id`)
	 * @param {function} answer - UI callback
	 * @access public
	 */
	deleteItemByClient(id, answer) {
		let ba = this.items[page][bank]

		for (let n in this.items) {
			if (this.items[n].id == id) {
				this.deleteItem(n)
				break
			}
		}

		this.save()
		answer(page, bank, this.items[page][bank])
		this.bank.checkBankStatus(page, bank)
	}

	/**
	 * Get the items in a bank
	 * @param {boolean} [clone = false] - <code>true</code> if a clone is needed instead of a link
	 * @returns {Object[]} the items array
	 * @access public
	 */
	getAll(clone = false) {
		let out

		if (clone === true) {
			out = cloneDeep(this.items)

			// cleanup old keys
			for (let i in out) {
				if (out[i].action !== undefined && out[i].type !== undefined) {
					delete out[i].action
				}

				if (out[i].instance_id !== undefined && out[i].instance !== undefined) {
					delete out[i].instance_id
				}
			}
		} else {
			out = this.items
		}

		return out
	}

	/**
	 * Get the items in a bank via a client socket
	 * @param {function} answer - UI callback
	 * @access public
	 */
	getAllByClient(answer) {
		answer(this.getAll())
	}

	/**
	 * Get all the items for a specific instance
	 * @param {string} id - the instance id
	 * @param {boolean} [clone = false] - <code>true</code> if a clone is needed instead of a link
	 * @returns {Object[]} the items array
	 * @access public
	 */
	getInstanceItems(id, clone = false) {
		let out = []

		for (let i in this.items) {
			if (this.items[i].instance == id) {
				out.push(this.items[i])
			}
		}

		if (clone === true) {
			out = cloneDeep(out)
		}

		return out
	}

	/**
	 * Import and subscribe items to a bank
	 * @param {Object[]} items - the items to import
	 * @access public
	 */
	importItems(items) {
		if (items !== undefined) {
			for (let i = 0; i < items.length; ++i) {
				let obj = items[i]
				obj.id = shortid.generate()
				this.items.push(obj)
			}

			this.subscribeAll()
		}
	}

	/**
	 * Unsubscribe, clear a bank, and save
	 * @access public
	 */
	reset() {
		this.unsubscribeAll()
		this.items = []
		this.save()
	}

	/**
	 * Flag the database to save
	 * @access public
	 */
	save() {
		this.db.setDirty()
	}

	/**
	 * Find a subscribe function for an item and execute it
	 * @param {Object} item - the item object
	 * @access protected
	 */
	subscribe(item) {
		if (item.type !== undefined && item.instance !== undefined) {
			if (this.definitions[item.instance] !== undefined && this.definitions[item.instance][item.type] !== undefined) {
				let definition = this.definitions[item.instance][item.type]
				// Run the subscribe function if needed
				if (definition.subscribe !== undefined && typeof definition.subscribe == 'function') {
					definition.subscribe(item)
				}
			}
		}
	}

	/**
	 * Execute subscribes for all the items in a bank
	 * @access public
	 */
	subscribeAll() {
		for (let i in this.items) {
			this.subscribe(this.items[i])
		}
	}

	/**
	 * Find an unsubscribe function for an item and execute it
	 * @param {Object} item - the item object
	 * @access protected
	 */
	unsubscribe(item) {
		if (item.type !== undefined && item.instance !== undefined) {
			if (this.definitions[item.instance] !== undefined && this.definitions[item.instance][item.type] !== undefined) {
				let definition = this.definitions[item.instance][item.type]
				// Run the subscribe function if needed
				if (definition.unsubscribe !== undefined && typeof definition.unsubscribe == 'function') {
					definition.unsubscribe(item)
				}
			}
		}
	}

	/**
	 * Execute unsubscribes for all the items in a bank
	 * @access public
	 */
	unsubscribeAll() {
		for (let i in this.items) {
			this.unsubscribe(this.items[i])
		}
	}

	/**
	 * Update an option for an item, subscribe, and save
	 * @param {string} item - the item's id (`item.id`)
	 * @param {string} option - the option id/key
	 * @param {(string|string[]|number|boolean)} value - the new value
	 * @access public
	 */
	updateItemOption(item, option, value) {
		this.debug('bank_update_item_option', item, option, value)

		for (let n in this.items) {
			let obj = this.items[n]
			if (obj !== undefined && obj.id === item) {
				this.unsubscribe(obj)
				if (obj.options === undefined) {
					obj.options = {}
				}
				obj.options[option] = value
				this.subscribe(obj)
				this.save()
			}
		}
	}

	/**
	 * Update a bank item order by swapping two keys
	 * @param {number} oldIndex - the moving item's index
	 * @param {number} newIndex - the other index to swap with
	 * @access public
	 */
	updateItemOrder(oldIndex, newIndex) {
		this.items.splice(newIndex, 0, this.items.splice(oldIndex, 1)[0])
		this.save()
	}
}

exports = module.exports = ItemsBase
