// 引入原生模块
const fs = require('fs')
const net = require('net')

// 引入自定义模块
const { log } = require('./utils')
const Request = require('./request')
const routeIndex = require('./routes/index')
const routeUser = require('./routes/user')
const routeMessage = require('./routes/message')

// 错误处理函数
const error = (code=404) => {
	const e = {
		404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
	}

	const response = e[code] || ''
	return response
}

// 响应函数
// 根据 request 生成对应的 response
const responseFor = (raw, request) => {
	// 定义一个基本的空 route 对象
	const route = {}
	const routes = Object.assign(route, routeIndex, routeUser, routeMessage)
	// log('debug routes', routes)
	// 获取 response 函数
	const response = routes[request.path] || error
	// log('debug response', response)
	const resp = response(request)
	// log('debug resp', resp)
	return resp
}

const processRequest = (data, socket) => {
	const raw = data.toString('utf8')
    // 每次触发 data 事件(每次收到请求), 生成一个 request 实例
    const request = new Request(raw)
	// log('debug request', request)
    const ip = socket.localAddress
    log(`ip and request, ${ip}\n${raw}`)

    // 调用 responseFor 得到响应
    const response = responseFor(raw, request)

	// log('debug response', response)
    // 发送响应数据
    socket.write(response)

    // 关闭连接
    socket.destroy()
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
			processRequest(data, socket)
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

if (require.main === module) {
    __main()
}
