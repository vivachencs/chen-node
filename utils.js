const log = (...args) => {
	console.log.apply(console, args)
}

// 生成一个随机字符串
const randomStr = () => {
    // 字符池
    const seed = 'asdfghjokpwefdsui3456789dfghjk67wsdcfvgbnmkcvb2e'
    let s = ''
    for (let i = 0; i < 16; i++) {
        const random = Math.random() * (seed.length - 2)
        const index = Math.floor(random)
        s += seed[index]
    }
    return s
}

module.exports = { log, randomStr }
// module.exports.log = log
// module.exports.randomStr = randomStr