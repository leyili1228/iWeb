<template>
	<view class="container">
		<!-- 如果用户尚未登录，则可以在“登录”和“注册”两个组件间切换 -->
		<block v-if="!alreadyLogin">
			<!-- <button type="default" @click="showLogin=!showLogin">隐藏登录卡片</button> -->
			<uni-transition :mode-class="['slide-left','fade']" :show="showLogin">
				<iweb-login class="transition-box" @requestShowRegister="showLogin=false"  @loginComplete="alreadyLogin=true"></iweb-login>
			</uni-transition>
			
			<uni-transition :mode-class="['slide-right','fade']" :show="!showLogin">
				<iweb-register class="transition-box" @requestShowLogin="showLogin=true"></iweb-register>
			</uni-transition>
		</block>
		<!-- 如果用户已经登录，则显示“用户信息”组件和“退出登录”按钮 -->
		<block v-else>
			<iweb-user-info></iweb-user-info>
			<button class="logout" @click="logout">退出登录</button>
		</block>
	</view>
</template>

<script>
	import iwebLogin from '@/components/iweb-login/iweb-login'
	import iwebRegister from '@/components/iweb-register/iweb-register'
	import iwebUserInfo from '@/components/iweb-user-info/iweb-user-info'
	export default {
		components: {		//注册自定义的子组件
			iwebLogin,
			iwebRegister,
			iwebUserInfo,
		},
		data() {
			return {
				alreadyLogin: false,	//当前是否已经成功登录了
				showLogin: true,		//当前应该显示登录卡片吗？
			};
		},
		onLoad(){
			//H5页面刷新，必然调用onLoad——读取的App中的数据也会被刷新
			//console.log('user-center.onload:', getApp().globalData.userInfo)
			//读取本地缓存中存储的数据
			uni.getStorage({
				key: 'userInfo',
				success: result=>{		//成功获得到了缓存数据
					//console.log('SUCCESS: userCenter.onLoad:', result)
					this.alreadyLogin = true	//缓存中读取到了登录信息，设置为“已经登录”
				},
				fail: err=>{			//没有查询到相关缓存数据
					//console.log('FAIL: userCenter.onLoad:', err)
				}
			})
		},
		methods:{
			logout(){	//退出登录
				uni.removeStorage({	//清除客户端的登录缓存数据
					key: 'userInfo',
					success: ()=>{
						//重新刷新当前页面
						uni.reLaunch({
							url: '/pages/userCenter/userCenter'
						})
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	.transition-box {
		position: absolute;
		width: 100%;
	}
	.logout {
		margin: 50rpx 0;
	}
</style>
