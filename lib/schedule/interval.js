const plugin_base = require('./plugin_base')

class interval extends plugin_base {
	setup() {
		this.options = [
			{
				key: 'seconds',
				name: 'Run every',
				type: 'textinput',
				placeholder: 'Time, in seconds, to run event',
				pattern: '([0-9]*)',
			},
		]
	}

	add(id, data) {
		let seconds = parseInt(data.config.seconds)
		let interval = null
		if (!isNaN(seconds) && seconds > 0) {
			interval = setInterval(() => {
				this.scheduler.action(id)
			}, seconds * 1000)
		}

		super.add(id, {
			...data,
			interval,
		})
	}

	remove(id) {
		const config = this.watch.find((x) => x.id == id)
		if (config && config.interval) {
			clearInterval(config.interval)
		}

		super.remove(id)
	}

	get type() {
		return 'interval'
	}

	get name() {
		return 'Time interval'
	}

	config_desc(config) {
		let time
		if (config.seconds >= 3600) {
			time = `${parseInt(config.seconds / 3600)} hours`
		} else if (config.seconds >= 60) {
			time = `${parseInt(config.seconds / 60)} minutes`
		} else {
			time = `${config.seconds} seconds`
		}

		return `Runs every <strong>${time}</strong>.`
	}
}

module.exports = interval
