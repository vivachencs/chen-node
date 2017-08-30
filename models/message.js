/**
 * Created by Chen on 17/8/29.
 */
const Model = require('./main')

class Message extends Model {
    constructor(form={}) {
        super()
        this.author = form.author || ''
        this.content = form.content || ''
        // this.extra = 'tetra message'
    }
}

module.exports = Message
