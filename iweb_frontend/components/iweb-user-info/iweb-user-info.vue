<template>
	<view class="user">
		<block v-if="user.uid">
			<!-- 用户头像 -->
			<image class="avatar" :src="server.host + user.avatar" mode="scaleToFill"/>
			<!-- 功能菜单——折叠组件 -->
			<uni-collapse accordion>
				<uni-collapse-item title="我的信息" open>
					<view class="pane">
						<view class="row">
							<view class="label">用户：</view>
							<view>{{user.uname}}</view>
						</view>
						<view class="row">
							<view class="label">昵称：</view>
							<view>{{user.nickname}}</view>
						</view>
						<view class="row">
							<view class="label">电话：</view>
							<!-- <view>{{user.phone}}</view> -->
							<view>{{user.phone | phoneMask}}</view>
						</view>
						<view class="row">
							<view class="label">性别：</view>
							<view>{{user.sex}}</view>
						</view>
						<view class="row">
							<view class="label">年龄：</view>
							<view>{{user.age}}</view>
						</view>
						<view class="row">
							<view class="label">学历：</view>
							<view>{{user.edu}}</view>
						</view>
						<view class="row">
							<view class="label">职业：</view>
							<view>{{user.job}}</view>
						</view>
					</view>
				</uni-collapse-item>
				<uni-collapse-item title="修改密码">
					<view class="pane">
						<input type="text" password placeholder="请输入原密码">
						<input type="text" password placeholder="请输入新密码">
						<input type="text" password placeholder="请再次输入新密码">
						<button type="default">提交修改</button>
					</view>
				</uni-collapse-item>
				<uni-collapse-item title="修改头像">
					<view class="pane">
						<button @click="chooseUploadUpdateAvatar">选择并上传头像</button>
					</view>
				</uni-collapse-item>
				<uni-collapse-item title="我的订单">
					<view class="pane">
						内容
					</view>
				</uni-collapse-item>
				<uni-collapse-item title="我的收藏夹">
					<view class="pane">
						内容
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</block>
		<view class="loading" v-else>
			用户数据加载中...
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {},		//用户对象，包含当前登录用户的完整信息
			};
		},
		mounted(){		//注意：uni-app中组件不能使用页面的钩子函数：onLoad()!
			//异步请求当前登录用户的完整信息
			uni.request({
				url: this.server.userDetails(),
				withCredentials: true,	//必需不能忘记！！一次不写，之前的session数据全部丢失！！
				success: res=>{
					this.user = res.data
					console.log(this.user)
				}
			})
		},
		methods:{
			chooseUploadUpdateAvatar(){
				//①客户端选择一张本地图片
				uni.chooseImage({
					count: 1,		//限制选择的图片数量
					success: result=>{	//用户选择了一张图片
						//console.log(result)  //tempFiles、 tempFilePaths
						let filePath = result.tempFilePaths[0]//用户选择的图片路径

						//②客户端上传图片、服务器接收图片，并生成随机文件名
						//wx.uploadFile()此方法不支持修改withCredentials属性！！
						uni.uploadFile({
							url: this.server.userUploadAvatar(), //上传头像文件的API
							filePath: filePath,
							name: 'avatar',	//服务器端要读取的文件上传字段名
							success: res=>{
								//uni.uploadFile()不会自动把响应消息中的JSON对象解析为JS对象
								let body = JSON.parse(res.data)	//String=>Object
								let fileName = body.fileName //客户端上传的图片在服务器上存储文件名
								
								//③服务器把新文件名保存入数据库中
								uni.request({
									method: 'POST',
									url: this.server.userUpdateAvatar(), //更新头像路径
									data: {fileName: fileName},
									withCredentials: true,
									success: res=>{
										//.......
									}
								})
							}
						})
						
					}
				})
			}
		},
	}
</script>

<style lang="scss">
.user{
	//padding: 
	.avatar {
		width: 140rpx;
		height: 140rpx;
		display: block;
		margin: 20rpx auto; //水平居中
		border-radius: 50%;
		box-shadow: 0 0 8rpx #888;
	}
	.pane {
		padding: 20rpx 20rpx 40rpx;
		background: lighten($uni-bg-color-grey, 1);
		.row {
			line-height: 1.6em;
			display: flex;
			.label {
				font-weight: bold;
				margin-right: 1em;
				margin-left: 1em;
			}
		}
	}
	.loading{
		text-align: center;
		margin: 50rpx 0;
	}
}
</style>
