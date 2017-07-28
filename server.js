// 引入原生模块
const fs = require('fs')
const net = require('net')

// 引入自定义模块
const { log } = require('./utils')

// 主页处理函数
const routeIndex = () => {
	// 响应头
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
	// body
    const body = '<h1>hello world</h1> <img src="static/doge.gif">'
	// 合成响应
    const response = header + '\r\n' + body

	return response
}

// 图片处理函数
const routeImage = () => {
    // 响应头
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: image/gif\r\n\r\n'

	// 读取图片
	// readFileSync 会返回一个 buffer 类型
	const file = 'doge.gif'
    const body = fs.readFileSync(file)

	// 将 header 转化为 buffer 类型
	const h = Buffer.from(header)
    // 拼接 buffer 类型
	const response = Buffer.concat([h, body])

	return response
}

// 错误处理函数
const error = (code=404) => {
	// 表驱动法
	const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
	}

	const response = e[code] || ''

    return response
}

// 根据 path 返回 response
const responseForPath = (path) => {
	// 表驱动法
	const r = {
		'/': routeIndex,
		'/doge.gif': routeImage,
	}

	const res = r[path] || error
	const response = res()

	return response
}

// 服务器逻辑
const run = (host='', port=3000) => {
	// 创建服务器
	const server = new net.Server()

	// 开启一个服务器监听连接
	server.listen(port, host, () => {
		log('listening: ', server.address())
	})

	// 监听连接事件
	server.on('connection', (socket) => {
		const address = socket.remoteAddress
		const port = socket.remotePort
		const family = socket.remoteFamily
		log('connected client info', address, port, family)

		// 监听连接事件
		// 当 socket 接收到数据时, 会触发 data 事件
		// data 参数为 buffer 类型, 表示接收到的数据
		socket.on('data', (data) => {
			// 将 buffer 类型的数据转化为字符串
			const r = data.toString()
			log('接受到的原始数据\n', r)

			// 从 request 中解析 path
			const path = r.split(' ')[1]

			// 调用 responseForPath 得到响应
			const response = responseForPath(path)

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
	const host = ''
	const port = 3000
	run(host, port)
}

__main()