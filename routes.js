/**
 * Created by Chen on 2017/7/29.
 */
const fs = require('fs')
const { log } = require('./utils')

const { User, Message } = require('./models')

// 一个全局变量, 用于保存 session 信息
const session = {}

// 生成一个随机字符串
const randomStr = () => {
    // 字符池
    const seed = 'asdfghjokpwefdsui3456789dfghjk67wsdcfvgbnmkcvb2e'
    let s = ''
    for (let i = 0; i < 16; i++) {
        const random = Math.random() * (seed.length - 2)
        const index = Math.floor(random)
        s += seed[index]
    }
    return s
}

// 获取当前登录用户的 username
const currentUser = (request) => {
    // 获取 username 对应的 cookie 值
    // log('debug currentuser request', request)
    const id = request.cookies.user || ''
    log('debug session[id]', session)
    // 将取得的 cookie 值通过 session 进行匹配
    const username = session[id] || '游客'
    return username
}

// 读取 html 文件
const template = (name) => {
    const path = 'templates/' + name
    const options = {
        encoding: 'utf8'
    }
    const content = fs.readFileSync(path, options)
    return content
}

// 根据 mapper code 生成响应头
const headerFromMapper = (mapper={}, code=200) => {
    const state = {
        200: 'HTTP/1.1 200 OK\r\n',
        302: 'HTTP/1.1 302 Moved\r\n',
    }
    let base = state[code]
    const keys = Object.keys(mapper)
    const s = keys.map((k) => {
        const v = mapper[k]
        const h = `${k}: ${v}\r\n`
        return h
    }).join('')
    const header = base + s
    return header
}

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

// 登录处理函数
const login = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if (u.validateLogin()) {
            // log('login in')
            const sid = randomStr()
            // log('debug sid', sid)
            session[sid] = u.username
            // log('debug session', session)
            headers['Set-Cookie'] = `user=${sid}`
            result = '登录成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }
    const username = currentUser(request)
    let body = template('login.html')
	body = body.replace('{{result}}', result)
    body = body.replace('{{username}}', username)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const register = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if (u.validataRegister()) {
            u.save()
            const us = User.all()
            result = `注册成功<br><pre>${us}</pre>`
        } else {
            result = '用户名或者密码长度必须大于2'
        }
    } else {
        result = ''
    }
    const header = headerFromMapper(headers)
    let body = template('register.html')
    body = body.replace('{{result}}', result)
    const r = header + '\r\n' + body
    return r
}

const message = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    if (request.method === 'POST') {
        const form = request.form()
        log('debug form', form)
        const m = Message.create(form)
        m.save()
    }
    const header = headerFromMapper(headers)
    let body = template('message.html')
    const ms = Message.all()
    body = body.replace('{{messages}}', ms)
    const r = header + '\r\n' + body
    return r
}

const profile = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    let r
    let body = template('profile.html')
    const username = currentUser(request)
    if (username !== '游客') {
        const u = User.findOne('username', username)
        const header = headerFromMapper(headers)
        body = body.replace('{{result}}', u)
        r = header + '\r\n' + body
    } else {
        headers.Location = '/login'
        const header = headerFromMapper(headers, 302)
        log('debug header', header)
        r = header + '\r\n' + body
    }
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

const routeMapper = {
    '/': index,
    '/static': static,
    '/login': login,
    '/register': register,
    '/message': message,
    '/profile': profile,
}

module.exports = routeMapper

// const test = () => {
//     const headers = {
//         'Content-Type': 'text/html',
//     }
//     const header = headerFromMapper(headers)
// }
//
// test()