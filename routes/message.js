/**
 * Created by Chen on 17/8/29.
 */
const {
    session,
    currentUser,
    template,
    headerFromMapper,
} = require('./main')

const Message = require('../models/message')

// 留言板的处理函数, 返回留言板的响应
const message = (request) => {
    if (request.method === 'POST') {
        const form = request.form()
        const m = Message.create(form)
        m.save()
        // messageList.push(m)
    }
    let body = template('message.html')
    const ms = Message.all()
    body = body.replace('{{messages}}', ms)
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}
const routeIndex = {
    '/message': message,
}

module.exports = routeIndex