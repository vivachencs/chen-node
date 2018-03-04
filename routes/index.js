/**
 * Created by Chen on 17/8/22.
 */
const fs = require('fs')

const {
	currentUser,
	template,
	headerFromMapper,
	httpResponse,
} = require('./main')

const index = (request) => {
	const u = currentUser(request)
	const username = u ? u.username : ''
	const id = u ? u.id : ''
	let body = template('index.html', {
		username: username,
		id: id,
	})
	return httpResponse(body)
}

const static = (request) => {
	const filename = request.query.file || 'doge.gif'
	const path = `static/${filename}`
	const body = fs.readFileSync(path)
	const header = headerFromMapper()

	const h = Buffer.from(header + '\r\n')
	const r = Buffer.concat([h, body])
	return r
}

const favicon = (request) => {
	const filename = 'favicon.ico'
	const path = `static/${filename}`
	const body = fs.readFileSync(path)
	const header = headerFromMapper()

	const h = Buffer.from(header + '\r\n')
	const r = Buffer.concat([h, body])
	return r
}

const routeIndex = {
	'/': index,
	'/static': static,
	'/favicon.ico': favicon,
}

module.exports = routeIndex