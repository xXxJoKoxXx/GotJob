import React from 'react';
import { 
	List, InputItem, WingBlank, 
	WhiteSpace, Button, Radio,
} from 'antd-mobile';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { register } from '../../redux/user.redux';
import Logo from '../../component/logo/logo';
import Form from '../../component/form/form'

@connect(
	state => state.user,
	{register}
)
@Form
class Register extends React.Component {
	constructor(props){
		super(props)

		// 使用bind绑定事件则无法向箭头函数式事件那样直接传参
		// 所以在需要传参的情况下使用箭头函数事件，而绑定事件可以优化性能
		this.handleRegister = this.handleRegister.bind(this)
	}

	componentDidMount() {
		this.props.handleChange('type','genius')
	}

	handleRegister() {
		this.props.register(this.props.state)
	}

	render() {
		const RadioItem = Radio.RadioItem
		return (
			<div>
				{this.props.redirectTo ? <Redirect to={this.props.redirectTo} /> : null }
				<Logo />
				<WingBlank>
					<List>
						{this.props.msg ? <p className="error-msg">{this.props.msg}</p> : null }
						<InputItem
							onChange = {(v) => this.props.handleChange('user', v)} 
						>用户名</InputItem>
						<WhiteSpace />
						<InputItem
							type = "password"
							onChange = {(v) => this.props.handleChange('pwd', v)} 
						>密码</InputItem>
						<WhiteSpace />
						<InputItem 
							type = "password"
							onChange = {(v) => this.props.handleChange('repeatpwd', v)}
						>确认密码</InputItem>
						<WhiteSpace />
						<RadioItem 
							checked = {this.props.state.type === "genius" } 
							onChange = {() => this.props.handleChange('type','genius')}
						>牛人</RadioItem>
						<RadioItem 
							checked = {this.props.state.type === "boss" }
							onChange = {() => this.props.handleChange('type','boss')}
						>Boss</RadioItem>
						<WhiteSpace />
						<Button type = "primary" onClick = {this.handleRegister} >注册</Button>
					</List>
				</WingBlank>
			</div>
		)
	}
}

export default Register;