/**
 * Created by Chen on 2017/7/29.
 */
const { log } = require('./utils')

class Request {
    constructor() {
    	// request 原始信息
		this.raw = ''
		// 请求方法
		this.method = 'GET'
		this.path = ''
		this.query = {}
		this.body = ''
		this.headers = {}
		this.cookies = {}
    }

    //
    addCookies() {
		const cookies = this.headers.Cookies || ''
		const pairs = cookies.split('; ')
		pairs.forEach((pair) => {
			if (pair.includes('=')) {
				const [k, v] = pair.split('=')
				this.cookies[k] = v
			}
		})
	}

	//
	addHeaders(headers) {
    	headers.forEach((header) => {
    		const [k, v] = header.split(': ')
			this.headers[k] = v
		})
		this.addCookies()
	}

    // 解析 POST 方式的 form data
    form() {
    	const body = decodeURIComponent(this.body)
		const pairs = body.split('&')
		const d = {}
		for (let pair of pairs) {
			const [k, v] = pair.split('=')
			d[k] = v
		}
		return d
	}
}

// es5 实现方式
// function Request() {
//     this.raw = ''
//     // 默认是 GET 方法
//     this.method = 'GET'
//     this.path = ''
//     // query 默认是一个 object, 这样使用会更加方便
//     this.query = {}
//     this.body = ''
// }
//
// Request.prototype.form = function() {
//     const body = decodeURIComponent(this.body)
//     const pairs = body.split('&')
//     const d = {}
//     for (let pair of pairs) {
//         const [k, v] = pair.split('=')
//         d[k] = v
//     }
//     return d
// }

// Request.静态方法 = function() {
//     console.log('es5 的静态方法')
// }

module.exports = Request
