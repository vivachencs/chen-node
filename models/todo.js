/**
 * Created by Chen on 17/8/29.
 */
const Model = require('./main')

class Todo extends Model {
    constructor(form={}) {
        super()
        this.id = form.id
        this.title = form.title || ''
        this.done = false
        const now = Date.now()
        this.ct = now
        this.ut = now
    }
}

const test = () => {

}

if (require.main === module) {
    test()
}

module.exports = Todo