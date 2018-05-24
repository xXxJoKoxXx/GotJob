// 工具库

export function getRedirectPath({type, avatar}) {
	// 根据用户信息返回跳转地址
	// user.type /boss or /genius
	// user.avatar /bossinfo or /geniusinfo
	let url = (type === 'boss') ? '/boss': '/genius';
	if (!avatar) {	//如果没有完善头像，跳转到完善信息页面
		url += 'info';
	}
	return url;
}

export function getChatId(userId, targetId) {
	return [userId, targetId].sort().join('_')
}