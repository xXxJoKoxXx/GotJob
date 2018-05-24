import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabBar } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

@withRouter
@connect(
	state => state.chat
)
class NavLinkBar extends Component {
	static propTypes = {
		data: PropTypes.array.isRequired,
	}

	render() {
		const navList = this.props.data.filter(v => !v.hide)
		// console.log('navList',navList)
		const { pathname } = this.props.location
		const unread = this.props.unread
		// console.log('navlink_props',this.props)
		return (
			<TabBar>
				{navList.map(v => (		//直接返回值使用()
					<TabBar.Item
						badge = { v.path === '/msg' ? unread : null }
						key = { v.path }
						title = { v.text }
						icon = {{ uri:require(`./img/${v.icon}.png`) }}
						selectedIcon = {{uri:require(`./img/${v.icon}-active.png`)}}
						selected = { pathname === v.path }
						onPress = { () =>{
							this.props.history.push(v.path)
						}}
					>	
					</TabBar.Item>
				))}
			</TabBar>
		)  
	}
}

export default NavLinkBar;
