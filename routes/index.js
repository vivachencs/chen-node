/**
 * Created by Chen on 17/8/22.
 */
const fs = require('fs')

const {
    session,
    currentUser,
    template,
    headerFromMapper,
} = require('./main')

// 首页处理函数
const index = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    let body = template('index.html')
    const username = currentUser(request)
    // log('debug index username', username)
    body = body.replace('{{username}}', username)
    const r = header + '\r\n' + body
    return r
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

    // 字符串转 buffer
    const h = Buffer.from(header + '\r\n')
    // buffer 拼接
    const r = Buffer.concat([h, body])
    return r
}

const routeIndex = {
    '/': index,
    '/static': static,
    '/favicon.ico': favicon,
}

module.exports = routeIndex