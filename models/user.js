/**
 * Created by Chen on 17/8/29.
 */
const Model = require('./main')

class User extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        this.username = form.username || ''
        this.password = form.password || ''
        this.note = form.note || ''
    }

    // 验证登录
    validateLogin() {
        let valid = false
        const u = User.findOne('username', this.username)
        if (u !== null && this.password === u.password) {
            valid = true
        }
        return valid
    }

    // 验证注册
    validataRegister() {
        let valid = false
        const u = User.findOne('username', this.username)
        if (u === null && this.username.length > 2 && this.password.length > 2) {
            valid = true
        }
        return valid
    }
}

module.exports = User