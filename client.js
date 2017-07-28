// 引入模块
const net = require('net')
const { log } = require('./utils')

// 配置参数
const host = 'music.163.com'
const port = 80

// 创建客户端
const client = new net.Socket()

// 连接服务器
client.connect(port, host, () => {
	log('connect to: ', host, port)
	// 请求数据
	// const request = 'data from client'
	const request = 'GET / HTTP/1.1\r\nHost: music.163.com\r\n\r\n'
	// 发送请求
	client.write(request)
})

// 接收数据
client.on('data', (data) => {
	log('data', data, data.toString())

	// 关闭客户端
	client.destroy()
})

// 关闭客户端
client.on('close', () => {
	log('connection close')
})
