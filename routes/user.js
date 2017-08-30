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

const routeUser = {
    '/login': login,
    '/register': register,
    'profile': loginRequired(profile),
}

module.exports = routeUser
