/**
 * Created by Chen on 17/8/29.
 */
const {
	template,
	httpResponse,
} = require('./main')

const Message = require('../models/message')

// 留言板的处理函数, 返回留言板的响应
const message = (request) => {
	if (request.method === 'POST') {
		const form = request.form()
		const m = Message.create(form)
		m.save()
	}
	const ms = Message.all()
	const body = template('message.html', {
		messages: ms,
	})
	return httpResponse(body)
}
const routeIndex = {
	'/message': message,
}

module.exports = routeIndex