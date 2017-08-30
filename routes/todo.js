/**
 * Created by Chen on 17/8/29.
 */
const log = require('../utils')
const {
    session,
    currentUser,
    template,
    headerFromMapper,
    redirect,
} = require('./main')
const Todo = require('../models/todo')

const index = (request) => {
    const headers = {
        'Content-Type': 'text/html',
    }
    let body = template('todo_index.html')
    const todos = Todo.all()
    body = body.replace('{{todos}}', todos)
    const header = headerFromMapper(headers)
    const r = header + '\r\n' + body
    return r
}

const add = (request) => {
    // 用于增加新 todo 的路由函数
    if (request.method === 'POST') {
        const form = request.form()
        const t = Todo.create(form)
        t.save()
    }
    // 新增 todo 后, 重定向到 todo 的首页
    // 这样浏览器重新加载首页的时候, 就能拿到刚刚添加的数据
    return redirect('/todo')
}

const del = (request) => {
    if (request.method === 'POST') {
        const form = request.form()
        const t = Todo.findOne('id', form.id)
        t.remove()
    }
    return redirect('/todo')
}

const update = (request) => {
    if (request.method === 'POST') {
        // 更新 todo 有三种方案
        // 方案1, 主流的做法, 但是非常野鸡
        // t = Todo.get(id)
        // t.done = false
        // t.ut = Date.now
        // t.save()

        // 方案2, 算是比较好的一个方式
        const form = request.form()
        const t = Todo.findOne('id', form.id)
        t.update(form)

        // 方案3, 目前来说最好的方式
    }
    return redirect('/todo')
}

const routeMapper = {
    '/todo': index,
    '/todo/add': add,
    '/todo/delete': del,
    '/todo/update': update,
}

module.exports = routeMapper