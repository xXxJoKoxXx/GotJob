import React, { Component } from 'react';
import { 
	List, InputItem, WingBlank, 
	WhiteSpace, Button, 
} from 'antd-mobile';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { login, callbackLogin } from '../../redux/user.redux';
import Logo from '../../component/logo/logo';
import Form from '../../component/form/form';

@connect(
	state => state.user,
	{login, callbackLogin}
)
@Form
class Login extends Component {
	constructor(props){
		super(props)

		this.handleLogin = this.handleLogin.bind(this)
		this.register = this.register.bind(this)
	}

	handleLogin() {
		this.props.login(this.props.state)
	}

	register() {
		// console.log('register onclick')
		this.props.callbackLogin()
		this.props.history.push('/register')
	}
	render() {
		return (
			<div>
				{(this.props.redirectTo && this.props.redirectTo !== '/login') ? <Redirect to={this.props.redirectTo} /> : null }
				<Logo></Logo>
				<WingBlank>
					<List>
						{this.props.msg ? <p className="error-msg">{this.props.msg}</p> : null }
						<InputItem
							onChange = {(v) => this.props.handleChange('user', v)}
						>用户</InputItem>
						<WhiteSpace />
						<InputItem
							type = 'password'
							onChange = {(v) => this.props.handleChange('pwd', v)}
						>密码</InputItem>
					</List>
					<WhiteSpace />
					<Button 
						type = 'primary' 
						onClick = {this.handleLogin}
					>登录</Button>
					<WhiteSpace />
					<Button type = 'primary' onClick = { this.register } >注册</Button>
				</WingBlank>
			</div>
		)
	}
}

export default Login;