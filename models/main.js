/**
 * Created by Chen on 2017/7/29.
 */
const fs = require('fs')

const ensureExists = (path) => {
	if (!fs.existsSync(path)) {
		const data = '[]'
		fs.writeFileSync(path, data)
	}
}

const save = (data, path) => {
	const s = JSON.stringify(data, null, 2)
	fs.writeFileSync(path, s)
}

const load = (path) => {
	const options = {
		encoding: 'utf8',
	}
	ensureExists(path)
	const s = fs.readFileSync(path, options)
	const data = JSON.parse(s)
	return data
}

class Model {
	static dbPath() {
		const classname = this.name.toLowerCase()
		const path = require('path')
		const filename = `${classname}.txt`
		const p = path.join(__dirname, '../db', filename)
		return p
	}

	static _newFromDict(dict) {
		const cls = this
		const m = new cls(dict)
		return m
	}

	static all() {
		const path = this.dbPath()
		const models = load(path)
		const ms = models.map((m) => {
			const cls = this
			const instance = cls._newFromDict(m)
			return instance
		})
		return ms
	}

	static create(form={}) {
		const cls = this
		const instance = new cls(form)
		instance.save()
		return instance
	}

	static findOne(key, value) {
		const list = this.find(key, value)
		if (list.length === 0) {
			return null
		} else {
			return list[0]
		}
	}

	static find(key, value) {
		if (typeof (key) === 'object') {
			return this.fetch(key)
		}
		if (typeof (key) === 'string') {
			return this.fetchBy(key, value)
		}
	}

	static get(id) {
		return this.findOne('id', id)
	}

	save() {
		const cls = this.constructor
		const models = cls.all()
		if (this.id === undefined) {
			if (models.length > 0) {
				const last = models[models.length - 1]
				this.id = last.id + 1
			} else {
				this.id = 1
			}
			models.push(this)
		} else {
			const index = models.findIndex((e) => {
				return e.id === this.id
			})
			if (index > -1) {
				models[index] = this
			}
		}
		const path = cls.dbPath()
		save(models, path)
	}

	static remove(id) {
		const cls = this
		const models = cls.all()
		const index = models.findIndex((e) => {
			return e.id === id
		})
		if (index > -1) {
			models.splice(index, 1)
		}
		const path = cls.dbPath()
		save(models, path)
		return
	}

	toString() {
		const s = JSON.stringify(this, null, 2)
		return s
	}

	static _contains(container, item) {
		let result = true
		const keys = Object.keys(item)
		for (let i = 0; i < keys.length; i++) {
			let k = keys[i]
			let v1 = item[k]
			let v2 = container[k]
			if (v1 !== v2) {
				result = false
			}
		}
		return result
	}

	static fetch(query) {
		const all = this.all()
		const result = []
		for (let i = 0; i < all.length; i++) {
			let m = all[i]
			let state = this._contains(m, query)
			if (state === true) {
				result.push(m)
			}
		}
		return result
	}

	static fetchBy(key, value) {
		const query = {}
		query[key] = value
		const result = this.fetch(query)
		return result
	}
}

module.exports = Model