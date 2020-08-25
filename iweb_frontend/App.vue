<script>
	//在page或component中可以使用getApp()获得当前App实例
	export default {
		onLaunch: function() {
			//console.log('App Launch')
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		},
		//整个应用程序基本的全局数据——需要不断改变的数据
		globalData:{
			userInfo: null	,//用户登录后的信息
			//server: {host: 'http://127.0.0.1:5050/'}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	* {
		box-sizing: border-box; //盒子总宽度=margin+width
	}
	.container {
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// justify-content: center;
		// padding: 10rpx;
		font-size: $uni-font-size-base;
	}
	.price {
		color: $iweb-theme-color-reverse;
	}
	.h1 {
		font-size: $uni-font-size-title;
	}
	.h2 {
		font-size: $uni-font-size-subtitle;
	}
	.p {
		font-size: $uni-font-size-paragraph;
	}
</style>
