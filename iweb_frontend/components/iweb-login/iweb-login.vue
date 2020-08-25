<template>
	<view>
		<uni-card title="用户登录" is-shadow>
			<!-- UNI-APP中的双向数据绑定语法与Vue.js相同：v-model指令-->
			<input class="input" type="text" v-model="uname" placeholder="请输入用户邮箱" />
			<input class="input" type="text" v-model="upwd" placeholder="请输入登录密码" password/>
			<button class="button" @click="doLogin">登录</button>
			<view class="gotoRegister" @click="gotoRegister">注册新用户</view>
		</uni-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uname: 'ranran@tedu.cn',
				upwd: '123456'
			};
		},
		methods:{
			doLogin(){	//执行登录操作：向服务器提交客户端输入的用户名和密码
				let data = {
					uname: this.uname,
					upwd: this.upwd
				}
				uni.request({
					method: 'POST',
					url: this.server.userLogin(),
					data: data,
					withCredentials: true,	//此参数是必需的！！不能省略！！
					success: res=>{
						let body = res.data
						if(body.code===200){	//登录成功
							uni.showToast({
								title: '登录成功'
							})
							//在客户端持续的保留登录状态——即使用户刷新浏览器仍然可以读到登录状态
							//getApp().globalData.userInfo = body.userInfo //小程序中保留全局数据的方法
							//使用uni-app提供的适配各种平台的客户端存储方案
							uni.setStorage({
								key: 'userInfo',
								data: body.userInfo,
								success: ()=>{	//本地缓存文件写出完毕
									//关闭“登录&注册”界面，正式进入“用户中心”界面
									//子组件修改父组件的数据（父子间的数据传递），使用发射自定义事件方式
									this.$emit('loginComplete')									
								}
							})
						}else {  //登录失败
							uni.showModal({
								title: '错误',
								content:'登录失败！服务器返回的错误码：'+body.code+' 错误消息：'+body.msg,
								showCancel: false
							})
						}
					}
				})
			},
			gotoRegister(){
				//子组件想修改父组件的数据——通过发射自定义事件
				this.$emit('requestShowRegister')
			},
		}
	}
</script>

<style lang="scss">
	.input {
		height: 3.4em;
		padding: 0  20rpx;   //如果竖直方向上的padding值大于height，会导致无法获得焦点
		border-bottom: 1px solid $uni-border-color;
	}
	.button {
		margin:  30rpx 0;
	}
	.gotoRegister {
		text-align: right;
		color: $iweb-theme-color
	}
</style>
