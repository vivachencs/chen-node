/**
 * Created by Chen on 17/8/29.
 */
const { log, randomStr } = require('../utils')
const {
    session,
    currentUser,
    template,
    loginRequired,
    headerFromMapper,
} = require('./main')

const User = require('../models/user')

// 登录处理函数
const login = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.findOne('username', form.username)
        if (u.validateLogin()) {
            const sid = randomStr()
            session[sid] = u.id
            headers['Set-Cookie'] = `user=${sid}`
            result = '登录成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }
    const user = currentUser(request)
    const username = user ? user.username : ''
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

const profile = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    const header = headerFromMapper(headers)
    let body = template('profile.html')
    const u = currentUser(request)
    body = body.replace('{{username}}', u.username)
    body = body.replace('{{password}}', u.password)
    body = body.replace('{{note}}', u.note)
    const r = header + '\r\n' + body
    return r
}

const routeUser = {
    '/login': login,
    '/register': register,
    '/profile': loginRequired(profile),
}

module.exports = routeUser
