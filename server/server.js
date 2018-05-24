// const express = require('express');
import express from 'express'
import  bodyParser from 'body-parser'
import  cookieParser from 'cookie-parser'
import  model from './model'
// const User = model.getModel('user');

// 项目打包编译设置相对路径path
import path from 'path'

import csshook from 'css-modules-require-hook/preset'
import assethook from 'asset-require-hook'
assethook({
  extensions: ['png']
})

import React from 'react'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import {
	StaticRouter
} from 'react-router-dom'
import { renderToNodeStream } from 'react-dom/server'
// renderToString
// renderToString将后端React组件 => <div>
// 不准在客户端渲染，可以使用renderToStaticMarkup
import App from '../src/app'
import reducers from '../src/reducer'
import staticPath from '../build/asset-manifest.json'


const Chat = model.getModel('chat');
const app = express()
// work with express, socket.io与express关联
const server = require('http').Server(app);
const io = require('socket.io')(server);

const userRouter = require('./user');

// io为全局的请求，而socket为当前的请求
io.on('connection', function(socket) {
	socket.on('sendmsg', function(data) {	//此处应用socket来监听sendmsg事件
		// console.log(data)
		// io.emit('recvmsg', data)
		const { sender, receiver, msg } = data
		// 将sender和receiver结合成一个唯一的chatid，一个chatid对应一个聊天情景
		const chatid = [sender, receiver].sort().join('_')
		Chat.create({chatid, from: sender, to: receiver, content: msg}, function(err, doc) {
			io.emit('recvmsg', Object.assign({}, doc._doc))
		}) 
	})
})

// app.use()开启中间件
app.use(cookieParser())	//cookie
app.use(bodyParser.json())		//接收post请求参数
app.use('/user', userRouter)  //userRouter为子路由

// 项目打包编译
// 设置express中间件
app.use(function(req, res, next) {
	if(req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
		return next()  //设置白名单
	}
	// 服务器渲染的脱水数据

	const store = createStore(reducers, compose(
		applyMiddleware(thunk),
	))
	let context = {}

	// 使用renderToString的字符串进行服务端渲染 
	// const markup = renderToString(
	// 	(<Provider store = { store } >
	// 		<StaticRouter
	// 			location = { req.url }
	// 			context = { context }  //告诉路由是否有跳转
	// 		>
	// 			<App />
	// 		</StaticRouter>
	// 	</Provider>)
	// )

	const obj = {
		'/msg': 'React聊天消息列表',
		'/boss': 'Boss查看牛人列表页面'
	}

	// 1.将字节流之前的html模板页面全部渲染
	res.write(`
	 	<!DOCTYPE html>
		<html lang="en">
		  <head>
		    <meta charset="utf-8">
		    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		    <meta name="theme-color" content="#000000">
		    <meta name="description" content="${obj[req.url]}">
		    <meta name="theme-color" content="#000000">
		    <link rel="stylesheet" href="/${staticPath['main.css']}">
		    <title>React App</title>
		  </head>
		  <body>
		    <noscript>
		      You need to enable JavaScript to run this app.
		    </noscript>
		    <div id="root">
	`)
	// 2.再把字节流渲染出来
	// 使用React16 renderToNodeStream的字节流进行服务端渲染 快3倍
	const markupStream = renderToNodeStream(
		(<Provider store = { store } >
			<StaticRouter
				location = { req.url }
				context = { context }  //告诉路由是否有跳转
			>
				<App />
			</StaticRouter>
		</Provider>)
	)
	markupStream.pipe(res, {end: false}) //将字节流不断输入resource,不停止
	markupStream.on('end', () => {	//3.监听end事件，输入停止时将字节流后的html模板渲染出来
		res.write(`
				</div>
			    <script src="/${staticPath['main.js']}" ></script>
			  </body>
			</html>
		`)
		res.end()
	})


	// renderToString字符串服务端渲染写入
	// const pageHtml = 
	// `<!DOCTYPE html>
	// 	<html lang="en">
	// 	  <head>
	// 	    <meta charset="utf-8">
	// 	    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	// 	    <meta name="theme-color" content="#000000">
	// 	    <meta name="description" content="${obj[req.url]}">
	// 	    <link rel="stylesheet" href="/${staticPath['main.css']}">
	// 	    <title>React App</title>
	// 	  </head>
	// 	  <body>
	// 	    <noscript>
	// 	      You need to enable JavaScript to run this app.
	// 	    </noscript>
	// 	    <div id="root">${markup}</div>
	// 	    <script src="/${staticPath['main.js']}" ></script>
	// 	  </body>
	// 	</html>`
	// res.send(pageHtml)


	// return res.sendFile(path.resolve('build/index.html'))
})
// 将全部路径设置为静态资源地址，通过中间件的形式转发
app.use('/',express.static(path.resolve('build')))

server.listen(9093, function() {
	console.log('Node app start at port 9093')
})

// app.get('/', function(req,res) {
// 	// 往页面发送hello world
// 	res.send('<h1>Hello World!</h1>')
// })
