/**
 * Created by Chen on 2017/7/29.
 */
const fs = require('fs')
const { log } = require('./utils')

// 确保文件存在
const ensureExists = (path) => {
	// 如果不存在则创建一个空文件
	if (!fs.existsSync(path)) {
		const data = '[]'
		fs.writeFileSync(path, data)
	}
}

// 保存文件
const save = (data, path) => {
	// 序列化数据
	const s = JSON.stringify(data, null, 2)
	// 存入文件
	fs.writeFileSync(path, s)
}

// 读取文件
const load = (path) => {
	// 设置读取参数
	const options = {
		encoding: 'utf8',
	}
	// 确定文件是否存在
	ensureExists(path)
	// 读取文件, 如果指定读取参数 readFileSync 函数就会直接返回字符串, 而不是 buffer
	const s = fs.readFileSync(path, options)
	// 反序列化数据
	const data = JSON.parse(s)
	return data
}

class Model {
	// 返回 db 文件的路径
	static dbPath() {
		// 静态方法的 this 指向类, this.name 就是类名
		const classname = this.name.toLowerCase()
		const path = `${classname}.txt`
		return path
	}

	// 获取一个类所有的实例
	static all() {
		// 获取 db 文件路径
		const path = this.dbPath()
		// 读取文件
		const models = load(path)
		// 生成实例
		// const ms = models.map((item) => {
		// 	const instance = this.create(item)
		// 	return instance
		// })
		// return ms
		return models.map(m => this.create(m))
	}

	static create(form={}) {
		const instance = new this(form)
		return instance
	}

	// 保存一个实例
	save() {
		const cls = this.constructor
		const models = cls.all()
		models.push(this)
		const path = cls.dbPath()
		save(models, path)
	}

	// toString() {
	// 	const classname = this.constructor.name
	// 	const keys = Object.keys(this)
	// 	const properties = keys.map((k) => {
	// 		const v = this[k]
	// 		const s = `${k}: (${v})`
	// 		return s
	// 	}).join('\n  ')
	// 	const s = `< ${classname}: \n ${properties}\n>\n`
	// 	return s
	// }
	toString() {
		const s = JSON.stringify(this, null, 2)
		return s
	}
}

class User extends Model {
    constructor(form={}) {
        super()
		this.username = form.username || ''
		this.password = form.password || ''
    }

    // 验证登录
    validateLogin() {
    	return this.username === 'gua' && this.password === '123'
	}

	// 验证注册
	validataRegister() {
		return this.username.length > 2 && this.password.length > 2
	}
}

class Message extends Model {
    constructor(form={}) {
        super()
		this.author = form.author || ''
		this.content = form.content || ''
		this.extra = 'tetra message'
    }
}

module.exports = {
	User: User,
	Message: Message,
}
