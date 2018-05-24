import axios from 'axios';

// actioType
const USER_LIST = 'USER_LIST';

const initState = {
	userlist: [],
}
// reducer
export function chatUser(state = initState, action) {
	switch(action.type) {
		case USER_LIST:
			return { ...state, userlist: action.payload }
		default:
			return state
	}
}

export function getUserList(type) {
	return async dispatch => {
		const res = await axios.get('/user/list?type=' + type)
		if(res.data.code === 0){
			dispatch(userList(res.data.data))
		}
	}
}

// action
function userList(data) {
	return { type: USER_LIST, payload: data }
}