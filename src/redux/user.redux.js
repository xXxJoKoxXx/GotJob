import axios from 'axios';
import { getRedirectPath } from '../util';
// actionType

const AUTH_SUCCESS = 'AUTH_SUCCESS'
const ERROR_MSG = 'ERROR_MSG'
const LOAD_DATA = 'LOAD_DATA'
const LOGOUT = 'LOGOUT'
const TOREGISTER = 'TOREGISTER'

const initState = {
	redirectTo: '',
	msg: '',
	user: '',
	type: ''
}
// reducer
export function user(state = initState, action) {
	switch(action.type) {
		case AUTH_SUCCESS:
			return { ...state, msg: '', redirectTo:getRedirectPath(action.payload), 
				...action.payload }
		case LOAD_DATA:
			return { ...state, ...action.payload }
		case LOGOUT:
			return {...initState, redirectTo: '/login' }
		case TOREGISTER:
			return {...initState, redirectTo: '' }
		case ERROR_MSG:
			return { ...state, msg:action.msg }
		default: 
			return state
	}
	
}

// 登录行为与后台交互的函数
export function login({user, pwd}) {
	if(!user||!pwd) {
		return errorMsg('用户名或密码未输入')
	}
	return async dispatch => {
		const res = await axios.post('/user/login', {user,pwd})
		if(res.status === 200 && res.data.code === 0) {
			dispatch(authSuccess(res.data.data))
		}else {
			dispatch(errorMsg(res.data.msg))
		}
	}
}

// 注册行为与后台交互的函数
export function register({user,pwd,repeatpwd,type}) {
	if(!user||!pwd) {
		return errorMsg('用户名或密码未输入')
	}
	if (pwd !== repeatpwd) {
		return errorMsg('两次密码输入不一样')
	}
	return async dispatch => {
		const res = await axios.post('/user/register', {user,pwd,type})
		if(res.status === 200 && res.data.code === 0) {
			dispatch(authSuccess({user,pwd,type}))
		}else {
			dispatch(errorMsg(res.data.msg))
		}
	}
}

// 用于更新BOSS和牛人填写的信息
export function update(data) {
	return async dispatch =>{
		const res = await axios.post('/user/update', data)
		if(res.status === 200 && res.data.code === 0) {
			dispatch(authSuccess(res.data.data))
		}else {
			dispatch(errorMsg(res.data.msg))
		}	
	}
}

export function logoutSubmit() {
	return { type: LOGOUT }
}

export function callbackLogin() {
	return { type: TOREGISTER }
}

// action
function errorMsg(msg) {
	return { type:ERROR_MSG, msg:msg } 
	//or {msg, type：ERROR_MSG},但变量一定要先写在前面
}

function authSuccess(obj) {
	const { pwd, ...data } = obj //过滤掉pwd
	return {type: AUTH_SUCCESS, payload: data}
}

export function loadData(userinfo) {
	return { type: LOAD_DATA, payload: userinfo  }
}