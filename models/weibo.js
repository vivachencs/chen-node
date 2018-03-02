/**
 * Created by Chen on 2018/3/2.
 */
const Model = require('./main')
const User = require('./user')

class Weibo extends Model {
	constructor(form={}, user_id=-1) {
		super()
		this.id = form.id
		this.content = form.content || ''
		this.user_id = Number(form.user_id || user_id)
	}

	user() {
		const u = User.findOne('id', this.user_id)
		return u
	}

	comments() {
		const Comment = require('./comment')

		const cs = Comment.find('weibo_id', this.id)
		return cs
	}
}

module.exports = Weibo