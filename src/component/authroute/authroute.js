import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadData } from '../../redux/user.redux';

@withRouter
@connect(
	null,
	{loadData}
)
class AuthRoute extends React.Component {

	componentDidMount() {
		// 如果位于登录或注册页面则不用判断是否有登录信息
		const publicList = ['/login','/register']
		const pathname = this.props.location.pathname//等到当前path
		if(publicList.indexOf(pathname) > -1 ) {
			return null
		}

		//获取用户信息
		axios.get('/user/info').then( res => {
			if (res.status === 200) {
				if (res.data.code === 0) {
					// 有登录，调用redux中的loadData存储页面信息
					this.props.loadData(res.data.data)
				}else {
					// 没有登录，用history跳转到登录页面
					this.props.history.push('/login')
				}
			}
		})

		// 检查用户是否登录
		// 检查当前url地址，如未登录状态时进入user页面会跳转到login


		// 检查用户的type 身份是boss还是牛人
		// 检查用户信息是否完善
	}

	render(){
		return null
	}
}

export default AuthRoute