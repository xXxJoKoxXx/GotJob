import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Badge } from 'antd-mobile'

@connect(
	state => state
)
class Msg extends Component {

	getLast(arr) {
		return arr[arr.length-1]
	}

	render() {
		const Item = List.Item
		const Brief = Item.Brief
		const userid = this.props.user._id
		const userinfo = this.props.chat.users
		// console.log(this.props)
		// 按照聊天用户分组，根据chatid
		const msgGroup = {}
		this.props.chat.chatmsg.forEach(v => {
			msgGroup[v.chatid] = msgGroup[v.chatid] || []
			msgGroup[v.chatid].push(v)
		})
		const chatList = Object.values(msgGroup).sort((a, b) => {  
			const a_last = this.getLast(a).create_time //消息列表按时间先后逆序排布
			const b_last = this.getLast(b).create_time
			return b_last - a_last
		})
		// console.log([5,9,7,4,6,8,3,1].sort(function(a,b) {  //一个排序小知识
		// 	return a-b  //a-b则顺序排，b-a则逆序排
		// }))
		// console.log(Object.values(msgGroup))
		// console.log(Object.values({name:'joko', age:18}))
		return (
			<div>				
				{chatList.map(v =>{
					const lastItem = this.getLast(v)
					const targetId = v[0].from === userid ? v[0].to : v[0].from
					const unreadNum = v.filter(v => !v.isread && v.to === userid).length
					if(!userinfo[targetId]) {
						return null
					}
					return (
						<List key = {lastItem._id} >
							<Item 
								thumb = { require(`../img/${userinfo[targetId].avatar}.png`)}
								extra = {<Badge text = { unreadNum } ></Badge>}
								arrow = "horizontal"
								onClick = {() => {
									this.props.history.push(`/chat/${targetId}`)
								}}
							>
								{userinfo[targetId].name}
								<Brief>{lastItem.content}</Brief>
							</Item>
						</List>
					)
				})}
			</div>
		);
	}
}


export default Msg;