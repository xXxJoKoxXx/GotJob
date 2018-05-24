// 用于操作数据库

const mongoose = require('mongoose');
// 连接mongo 并使用imooc集合
const DB_URL = 'mongodb://localhost:27017/imooc';
mongoose.connect(DB_URL)

const models = {
	// 建立集合和字段
	user: {
		'user': { 'type':String, 'require': true },	//require为必须传值
		'pwd': { 'type':String, 'require': true },
		'type': { 'type':String, 'require': true },
		// 头像
		'avatar': { 'type':String},
		// 个人简介或职位简介
		'desc': { 'type':String},
		// 职位名
		'title': { 'type':String},
		// boss的公司和薪资
		'company': { 'type':String},
		'money': { 'type':String}
	},
	chat: {
		'chatid':{ 'type': String, 'require': true },
		'from': { 'type': String, 'require': true },
		'to': { 'type': String, 'require': true },
		'isread':{ 'type': Boolean, default: false },
		'content': { 'type': String, 'require': true, default:'' },
		'create_time': { 'type': Number, default: new Date().getTime() }
	}
}

// 遍历集合和字段生成文档模型
for(let m in models) {
	mongoose.model(m, new mongoose.Schema(models[m]))
}

module.exports = {
	getModel: (name) => {
		return mongoose.model(name)
	}
}
