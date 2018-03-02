/**
 * Created by Chen on 17/8/29.
 */
const { log } = require('../utils')
const {
	currentUser,
	template,
	redirect,
	loginRequired,
	httpResponse,
} = require('./main')
const Todo = require('../models/todo')

const index = (request) => {
	const u = currentUser(request)
	const models = Todo.all()
	const body = template('todo_index.html', {
		todos: models,
	})
	return httpResponse(body)
}

const add = (request) => {
	// 用于增加新 todo 的路由函数
	if (request.method === 'POST') {
		const form = request.form()
		const u = currentUser(request)
		// form.user_id = u.id
		const t = Todo.create(form)
		t.save()
	}
	return redirect('/todo')
}

const edit = (request) => {
	const u = currentUser(request)
	const id = Number(request.query.id)
	const todo = Todo.get(id)
	const body = template('todo_edit.html', {
		todo: todo
	})
	return httpResponse(body)
}

const del = (request) => {
	const id = Number(request.query.id)
	Todo.remove(id)
	return redirect('/todo')
}

const update = (request) => {
	if (request.method === 'POST') {
		const form = request.form()
		Todo.update(form)
	}
	return redirect('/todo')
}

const routeMapper = {
	'/todo': index,
	'/todo/add': add,
	'/todo/delete': del,
	'/todo/edit': edit,
	'/todo/update': update,
}

module.exports = routeMapper