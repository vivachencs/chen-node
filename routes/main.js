/**
 * Created by Chen on 17/8/22.
 */
const fs = require('fs')
const { log } = require('./../utils')

const User = require('../models/user')

// 一个全局变量, 用于保存 session 信息
const session = {}

// 获取当前登录用户
const currentUser = (request) => {
    // 获取对应的 cookie 值
    const id = request.cookies.user || ''

    // 将取得的 cookie 值通过 session 进行匹配
    const uid = session[id] || -1
    const u = User.get(uid)
    const username = u.username
    return u
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

// 图片的响应函数, 读取图片并生成响应返回
const static = (request) => {
    // 静态资源的处理, 读取图片并生成相应返回
    const filename = request.query.file || 'doge.gif'
    const path = `../static/${filename}`
    const body = fs.readFileSync(path)
    const header = headerFromMapper()
    const h = Buffer.from(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

// 重定向函数
const redirect = (url) => {
    const headers = {
        Location: url,
    }
    const header = headerFromMapper(headers, 302)
    const r = header +'\r\n' + ''
    return r
}

const loginRequired = (routeFunc) => {
    const func = (request) => {
        const u = currentUser(request)
        if (u === null) {
            return redirect('/login')
        } else {
            return routeFunc(request)
        }
    }
    return func
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

module.exports = {
    session: session,
    currentUser: currentUser,
    template: template,
    headerFromMapper: headerFromMapper,
    static: static,
    redirect: redirect,
    loginRequired: loginRequired,
}

// const test = () => {
//     const headers = {
//         'Content-Type': 'text/html',
//     }
//     const header = headerFromMapper(headers)
// }
//
// test()