import React, { Component } from 'react';
import { List, InputItem, NavBar, Icon, Grid } from 'antd-mobile';
import { connect } from 'react-redux';

import { getMsgList, sendMsg, recvMsg, readMsg } from '../../redux/chat.redux';
import { getChatId } from '../../util';

@connect(
	state => state,
	{ getMsgList, sendMsg, recvMsg, readMsg }
)
class Chat extends Component {
	constructor(props){
		super(props)
		this.state = { 
			text: '', 
			msg: []
		}
	}

	componentDidMount() {
		if(!this.props.chat.chatmsg.length) {
			this.props.getMsgList()
			this.props.recvMsg()			
		}
	}

	componentWillUnmount() {
		const to = this.props.match.params.user //获取当前聊天对象id
		this.props.readMsg(to)
	}

	fixCarousel() {
		setTimeout(function() {
			window.dispatchEvent(new Event('resize'))
		}, 0)	
	}

	handleSubmit() {
		// socket.emit('sendmsg', {text: this.state.text})
		const sender = this.props.user._id
		const receiver = this.props.match.params.user
		const msg = this.state.text
		this.props.sendMsg({sender, receiver, msg}) 
		this.setState({
		 text: '',
		 isShowEmoji: false 
		})
	}

	render() {
		const emoji = 
		'😂 😁 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 😗 😙 😀 😚 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 😴 😌 😛 😜 😝 🤤 😒 😓 😔 😕 🙃 🤑 😲 ☹ 🙁 😖 😞 😟 😤 😦 😢 😧 😭 😨 😩 🤯 😬 😰 😱 😳 🤪 😵 😡 😠 🤬 😷 🤒 🤕 🤢 🤮 🤧 😇 🤠 🤡 🤥 🤫 🤭 🧐 🤓 😈 👿 👹 👺 💀 👻 👽 🤖 💩 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👶 👦 👧 👨 👩 👴 👵'
									.split(' ')
									.filter(v => v)
									.map(v => ({text: v}))
		// console.log(this.props)
		const userid = this.props.match.params.user
		const users = this.props.chat.users
		const Item = List.Item
		// userid:聊天的用户信息，props.user._id:当前用户信息
		const chatid = getChatId(userid, this.props.user._id)
		const chatmsgs = this.props.chat.chatmsg.filter(v => v.chatid === chatid)
		if(!users[userid]) {
			return null
		}
		return (
			<div id = 'chat-page' >
				<NavBar 
					className = "fixd-header"
					mode ='dark' 
					icon = {<Icon type = "left" />}
					onLeftClick = {() => {
						this.props.history.goBack()
					}}
				>
					{users[userid].name}
				</NavBar>
				<div className = "chat-list">
					{chatmsgs.map(v => {
						const avatar = require(`../img/${users[v.from].avatar}.png`)
						return v.from === userid ? (
							<List key = {v._id}>
								<Item 
									multipleLine
									thumb = {avatar}
								>{v.content}</Item>
							</List>
						) : 
							<List key = {v._id}>
								<Item
									className = 'chat-me' 
									extra = {<img src = {avatar} alt="" />}
									multipleLine
								>{v.content}</Item>
							</List>
					})}
				</div>
				<div className="stick-footer">
					<List>
						<InputItem
							placeholder = "在此输入信息"
							value = {this.state.text}
							onChange = {v => {
								this.setState({text: v})
							}}
							extra = {
								<div>
					        <span
					        	style = {{marginRight:15}}
					        	onClick = {() =>{
					        		this.setState({
					        			isShowEmoji: !this.state.isShowEmoji
					        		})
					        		this.fixCarousel()
					        	}}
					        >😃</span>
								  <span onClick = {() => this.handleSubmit()} >发送</span>
								</div>
								
							}
						></InputItem>
					</List>
					{this.state.isShowEmoji ? 
						<Grid
						data = {emoji}
						columnNum = {9}
						carouselMaxRow = {4}
						isCarousel = {true}
						onClick = {el => {
							this.setState({
								text: this.state.text + el.text
							})
						}}
					/> : null }
				</div>	
			</div>
		)
	}
}

export default Chat