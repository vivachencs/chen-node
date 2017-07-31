/**
 * Created by Chen on 2017/7/29.
 */
const fs = require('fs')
const { log } = require('./utils')

const { User, Message } = require('./models')

const messageList = []

// 读取 html 文件
const template = (name) => {
    const path = 'template/' + name
    const options = {
        encoding: 'utf8'
    }
    const content = fs.readFileSync(path, options)
    return content
}

const index = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = template('index.html')
    const r = header + '\r\n' + body
    return r
}

const login = (request) => {
    let result
    if (request.method !== 'POST') {
        const form = request.query
        const u = User.create(form)
        if (u.validateLogin()) {
            result = '登录成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = template('login.html')
    body = body.replace('{{result}}', result)
    const r = header + '\r\n' + body
    return r
}

// const register = (request) => {
//     let result
//     if (request.method === 'POST') {
//         const form = request.body
//         const u = User.create(form)
//         if (u.validataRegister()) {
//             u.save()
//             const us = User.all()
//             result = ''
//         }
//     }
// }

const static = (request) => {
    const filename = request.query.file || 'doge.gif'
    const path = `static/${filename}`
    const body = fs.readFileSync(path)
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: image/gif\r\n\r\n'
    const h = Buffer.form(header)
    const r = Buffer.concat([h, body])
    return r
}

const routeMapper = {
    '/': index,
    '/static': static,
    '/login': login,
    // '/register': register,
    // '/message': message,
}

module.exports = routeMapper