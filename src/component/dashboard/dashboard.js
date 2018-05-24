// 用于存放BOSS、牛人列表，ME 和 Msg 四个页面
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavBar } from 'antd-mobile';
import { Switch, Route, Redirect } from 'react-router-dom';

import NavLinkBar  from '../navlink/navlink'
import Boss from '../boss/boss';
import Genius from '../genius/genius';
import User from '../user/user';
import Msg from '../msg/msg'
import { getMsgList, recvMsg } from '../../redux/chat.redux';

@connect(
	state => state,
	{ getMsgList, recvMsg }
)
class Dashboard extends Component {

	// componentWillMount() {
	// 	const { pathname } = this.props.location;
	// 	if(pathname === '/'){
	// 		this.props.history.push('/login');
	// 	}
	// }
	componentDidMount() {
		if(!this.props.chat.chatmsg.length) {
			this.props.getMsgList()
			this.props.recvMsg()			
		}
	}

	render() {
		/*
		const pathname = this.props.location.pathname
		可使用上面的写法，但使用大括号的形式也可直接获取location里的pathname
		使代码更简介。
		*/
		const { pathname } = this.props.location
		// console.log('location',this.props.location);
		const user = this.props.user
		const navList = [
			{
				path: '/boss',
				text: '牛人',
				icon: 'boss',
				title: '牛人列表',
				component: Boss,
				hide: user.type === 'genius'
			},
			{
				path: '/genius',
				text: 'boss',
				icon: 'job',
				title: 'BOSS列表',
				component: Genius,
				hide: user.type === 'boss'
			},
			{
				path: '/msg',
				text: '消息',
				icon: 'msg',
				title: '消息列表',
				component: Msg
			},
			{
				path: '/me',
				text: '我',
				icon: 'user',
				title: '个人中心',
				component: User
			},
		]
		return navList.find(v => v.path === pathname) ? (
			<div>
				<NavBar className = 'fixd-header' mode = 'dark'>
					{ navList.find(v => v.path === pathname).title }
				</NavBar>
		    <div style = {{marginTop:45}} >
		    	<Switch>
		    		{navList.map(v => (
		    			<Route key = {v.path} path = {v.path}  component = {v.component} 
		    			></Route>
		    		))}
		    	</Switch>
		    </div>
		    <NavLinkBar data = { navList } ></NavLinkBar>
			</div>
			// <Route path = '/boss' component = {Boss} ></Route>
			// <Route></Route>
			// <Route></Route>
			// <Route></Route>
		) : <Redirect to = '/msg' ></Redirect>
	}
}

export default Dashboard
