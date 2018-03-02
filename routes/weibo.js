const { log, error } = require('../utils')
const {
	currentUser,
	template,
	redirect,
	loginRequired,
	httpResponse,
} = require('./main')

const User = require('../models/user')
const Weibo = require('../models/weibo')
const Comment = require('../models/comment')

const index = (request) => {
	const user_id = Number(request.query.user_id || -1)
	const u = User.get(user_id)
	const weibos = Weibo.find('user_id', u.id)
	const body = template('weibo_index.html', {
		weibos: weibos,
		user: u,
	})
	return httpResponse(body)
}

const create = (request) => {
	const body = template('weibo_new.html')
	return httpResponse(body)
}

const add = (request) => {
	const u = currentUser(request)
	const form = request.form()
	const w = Weibo.create(form)
	w.user_id = u.id
	w.save()
	return redirect(`/weibo/index?user_id=${u.id}`)
}

const del = (request) => {
	const weiboId = Number(request.query.id)
	Weibo.remove(weiboId)
	const u = currentUser(request)
	return redirect(`/weibo/index?user_id=${u.id}`)
}

const edit = (request) => {
	const weiboId = Number(request.query.id)
	const w = Weibo.get(weiboId)
	if (w === null) {
		return error()
	} else {
		const body = template('weibo_edit.html', {
			weibo: w,
		})
		return httpResponse(body)
	}
}

const update = (request) => {

}

const commentAdd = (request) => {
	const u = currentUser(request)
	const form = request.form()
	const c = Comment.create(form)
	c.user_id = u.id
	c.save()

	const w = c.weibo()
	const user = w.user()
	return redirect(`/weibo/index?user_id=${user.id}`)
}

const routeMapper = {
	'/weibo/index': loginRequired(index),
	'/weibo/new': loginRequired(create),
	'/weibo/add': add,
	'/weibo/delete': del,
	'/weibo/edit': edit,
	'/weibo/update': update,
	'/comment/add': loginRequired(commentAdd),
}

module.exports = routeMapper