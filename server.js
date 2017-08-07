// 引入原生模块
const fs = require('fs')
const net = require('net')

// 引入自定义模块
const { log } = require('./utils')
const Request = require('./request')
const routeMapper = require('./routes')

// 错误处理函数
const error = (code=404) => {
	const e = {
		404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
	}

	const response = e[code] || ''
	return response
}

// 解析 path, 返回包含 path 和 query 的 object
const parsedPath = (path) => {
	const index = path.indexOf('?')
	if (index === -1) {
		return {
			path: path,
			query: {},
		}
	} else {
		const l = path.split('?')
		path = l[0]

		const search = l[1]
		const args = search.split('&')
		const query = {}
		for (let arg of args) {
			const [k, v] = arg.split('=')
			query[k] = v
		}
		return {
			path: path,
			query: query,
		}
	}
}

// 响应函数
// 根据 request 生成对应的 response
const responseFor = (r, request) => {
	const raw = r
	const raws = raw.split(' ')

	request.raw = r
	request.method = raws[0]
	let pathname = raws[1]
	// log('debug pathname', pathname)
	let { path, query } = parsedPath(pathname)
	// log('debug path and query', path, query)
	request.path = path
	request.query = query
	request.body = raw.split('\r\n\r\n')[1]

	// 定一个基本的空 route
	const route = {}
	// 将引入的 routeMapper 与 route 合并
	const routes = Object.assign(route, routeMapper)
	// 获取 response 函数
	const response = routes[path] || error
	const resp = response(request)
	return resp
}

// 服务器逻辑
const run = (host='', port=3000) => {
	// 创建服务器
	const server = new net.Server()

	// 开启一个服务器监听连接
	server.listen(port, host, () => {
		const address = server.address()
		log(`listening server at http://${address.address}:${address.port}`)
	})

	// 监听连接事件, 新连接建立时会触发 connection 事件
	server.on('connection', (socket) => {
		// 当 socket 接收到数据时, 会触发 data 事件
		// data 参数为 buffer 类型, 表示接收到的数据
		socket.on('data', (data) => {
			// 每次触发 data 事件(每次收到请求), 生成一个 request 实例
			const request = new Request()
			// 将 buffer 类型的数据转化为字符串
			const r = data.toString('utf8')
			log('接受到的原始数据\n', r)

			const ip = socket.localAddress
			log(`ip and request, ${ip}\n${r}`)

			// 调用 responseFor 得到响应
			const response = responseFor(r, request)
			// log('debug original request\n', r)
			// log('dubug request instance\n', request)
			// log('debug response: \n', response)

			// 发送响应数据
			socket.write(response)

			// 关闭连接
			socket.destroy()
		})
	})

	// 服务器错误事件
	server.on('error', (error) => {
		log('server error', error)
	})

	// 服务器关闭事件
	server.on('close', () => {
		log('server closed')
	})
}

// 程序入口
const __main = () => {
	// 传入参数, 运行服务器
	const host = '0.0.0.0'
	const port = 3000
	run(host, port)
}

__main()