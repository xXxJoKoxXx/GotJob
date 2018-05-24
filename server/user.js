const express = require('express');
const utils = require('utility');

const Router = express.Router();
const model = require('./model');
const User = model.getModel('user');
const Chat = model.getModel('chat');
const _filter = {'pwd': 0, '__v': 0};		//不让密码显示在网页信息中
// Chat.remove({}, function(e, d){
// })

Router.post('/login', function(req, res) {	//接收post请求
	const { user, pwd } = req.body  //得到请求参数
	User.findOne({user, pwd: md5Pwd(pwd)}, _filter, function(err, doc) {		//数据库查询用户名是否存在
		if (err) {															
			return res.json({code:1, msg:'啊噢！后端出错了(○´･д･)ﾉ'})
		}
		if(!doc) {
			return res.json({code: 1, msg: '用户名或密码错误'})
		}
		// 添加cookie信息并返回code:0表示登录成功
		res.cookie('userid', doc._id);
		return res.json({code:0, data: doc })
	})
})

// 注册页面数据库交互
Router.post('/register', function(req, res) {	//接收post请求
	const { user, pwd, type } = req.body	//得到请求参数
	User.findOne({user}, function(err, doc) {		//数据库查询用户名是否存在
		if (doc) {																//找到说明存在，提示错误
			return res.json({code:1, msg:'用户名已注册'});
		}
		// 使用create无法返回生成后的_id字段，所以使用save方法
		const userModel = new User({user, type, pwd: md5Pwd(pwd)})
		userModel.save(function(err, doc) {
			if(err) {
				return res.json({code:1, msg:'啊噢！后端出错了(○´･д･)ﾉ'})
			}
			const { user, type, _id } = doc
			res.cookie('userid', _id)
			return res.json({code: 0, data: { user, type, _id }})
		})
	})
})

Router.post('/update', function(req, res) {
	const userid = req.cookies.userid
	if (!userid) {
		return res.json.dumps({code: 1})
	}
	const body = req.body
	User.findByIdAndUpdate(userid, body, function(err, doc) {
			// if(err) {
			// 	return res.json({code:0, msg:'啊噢！后端出错了(○´･д･)ﾉ'}); 
			// }
			const data = Object.assign({}, {
				user: doc.user,
				type: doc.type
			}, body)
			return res.json({ code: 0, data })
	})
})

Router.post('/readmsg', function(req, res) {
	const userid = req.cookies.userid
	const {sender}  = req.body
	Chat.update(
		{from: sender, to: userid},
		{'$set': {isread: true}}, 
		{'multi': true}, 
		function(err, doc) {
		console.log(doc)
		if(!err) {
			return res.json({ code: 0, num: doc.nModified })
		}
		return res.json({ code: 1, msg: '修改失败' })
	})
})

Router.get('/getmsglist', function(req, res) {
	const user = req.cookies.userid
	User.find({}, function(err, userdoc) {
		let users = {}
		userdoc.forEach(v => {
			users[v._id] = {name: v.user, avatar: v.avatar }
		})
			// 使用'$or'进行多个条件查询
		Chat.find({'$or':[{from:user}, {to:user}]}, function(err, doc) {
			if(!err) {
				return res.json({code: 0,msgs: doc, users: users})
			}
		})
	})
})

Router.get('/list', function(req, res) {
	const { type } = req.query		//使用大括号直接获取type值
	// if (!type) {
	// 	return res.json({code: 1})
	// }
	// User.remove({},(e, d) => {})  // 用于测试时清除数据库数据
	User.find({type}, function(err, doc) {
		return res.json({ code: 0, data: doc })	//获取数据需要使用data:doc形式
	}) 
})

Router.get('/info',function(req, res){
	// 用户有没有cookie
	const {userid} = req.cookies
	if (!userid) {
		return res.json({code: 1})
	}
	User.findOne({_id: userid}, _filter, function(err, doc) {
		if(err) {
			return res.json({code:1, msg:'啊噢！后端出错了(○´･д･)ﾉ'}) 
		} 
		if(doc) {
			return res.json({code: 0, data: doc})
		}
	})		
})

function md5Pwd(pwd) {
	// 为md5密文“加盐”
	const salt = 'joko_very_handsome_975x997!!@542##~'
	return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router;
