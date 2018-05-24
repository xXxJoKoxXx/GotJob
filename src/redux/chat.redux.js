import axios from 'axios';
import io from 'socket.io-client';

// 跨域连接，需要用io进行websocket协议的跨域连接
// 如果不是跨域连接，则直接使用io()即可
const socket = io('ws://localhost:9093')

// actionType
// 获取聊天列表
const MSG_LIST = 'MSG_LIST'
// 读取信息
const MSG_RECV = 'MSG_RECV'
// 标识已读
const MSG_READ = 'MSG_READ'

const initState = {
	chatmsg: [],
	users: {},
	unread: 0
}
// reducer
export function chat(state = initState, action) {
	switch(action.type) {
		case MSG_LIST:
			return { ...state, users: action.payload.users, 
				chatmsg:action.payload.msgs, 
				unread:action.payload.msgs.filter(
					v =>!v.isread&&v.to === action.payload.userid).length }
		case MSG_RECV:
			const n = action.payload.to === action.userid ? 1 : 0  //自己发的unread加0
			return { ...state, chatmsg:[...state.chatmsg, action.payload],
			 unread:state.unread + n }
		case MSG_READ:
			const { sender, num } = action.payload
			return { 
				...state, 
				chatmsg: state.chatmsg.map(v =>({ ...v, isread: sender === v.from ? true : v.isread })), //直接return用对象()包含
				unread: state.unread - num
			}
		default:
			return state
	}
}


export function getMsgList() {
	// 第二个参数getState,为store.getState(),获取应用里的所有状态
	return async (dispatch, getState) => {
		const res = await axios.get('/user/getmsglist')
		if(res.status ===200 && res.data.code === 0 ){
			const userid = getState().user._id
			dispatch(msgList(res.data.msgs, res.data.users, userid))
		}
	}
}

export function sendMsg({sender, receiver, msg}) {
	return dispatch => {
		socket.emit('sendmsg', { sender, receiver, msg })
	}	
}

export function recvMsg() {
	return (dispatch, getState) => {
		socket.on('recvmsg', function(data) {
			// console.log('recvmsg',data)
			const userid = getState().user._id
			dispatch(msgRecv(data, userid))
		})
	}
}

export function readMsg(sender) {
	return async (dispatch, getState) => {
		const res = await axios.post('/user/readmsg', {sender})
		const userid = getState().user._id
		if (res.status === 200 && res.data.code === 0 ) {
			dispatch(msgRead({sender, userid, num: res.data.num}))
		}
	}
}

// action
function msgList(msgs, users, userid) {
	return { type: MSG_LIST, payload: { msgs, users, userid } }
}

function msgRecv(msg, userid) {
	return {userid, type: MSG_RECV, payload: msg }
}

function msgRead({sender, userid, num}) {
	return { type: MSG_READ, payload: { sender, userid, num } }
}
