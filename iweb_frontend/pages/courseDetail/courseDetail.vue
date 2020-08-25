<template>
	<view class="container">
		<!-- 如果课程对象从服务器端已经查询到了，再绑定课程内容 -->
		<view class="course" v-if="course.cid">
			<view class="title">{{course.title}}</view>
			<!-- http://127.0.0.1:5050/undefined -->
			<image class="pic" :src="server.host + course.pic" mode="widthFix"></image>
			<view class="details">
				<view class="row">
					<view class="label">讲师：</view>
					<navigator class="tname" :url="'/pages/teacherDetail/teacherDetail?tid='+course.tid">{{course.tname}}</navigator>
				</view>
				<view class="row">
					<view class="label">课程时长：</view>
					<view>{{course.cLength}}</view>
				</view>
				<view class="row">
					<view class="label">开课时间：</view>
					<view>{{course.startTime}}</view>
				</view>
				<view class="row">
					<view class="label">开课校区：</view>
					<navigator class="school" v-for="(s, i) in course.schoolList" :key="i" :url="'/pages/schoolDetail/schoolDetail?sid='+s.sid">{{s.sname}}{{i==course.schoolList.length-1?'':'、'}}</navigator>
				</view>
			</view>
			<view class="price-box">
				<view class="label">课程价格：</view>
				<view class="price">{{course.price|currency}}</view>
				<uni-fav :checked="false" bg-color="#00be56" bg-color-checked="#f60" fg-color="#fff" circle @click="addFavorite"></uni-fav>
			</view>
			<!-- 课程详情 -->
			<view class="content-header">
				<view class="content-title">课程详情</view>
			</view>
			<!-- Vue.js中渲染一段HTML内容的语法：v-html指令 -->
			<view class="content" v-html="course.details"></view>
			<!-- 小程序中使用一个组件渲染一段HTML内容：rich-text -->
			<view class="content">
				<rich-text :nodes="course.details"></rich-text>
			</view>
		</view>
		<view v-else class="no-data">暂无数据</view>
	
		<!-- 固定定位在页面底部的“商品导航条” -->
		<view class="bottom-box">
			<uni-goods-nav :fill="true" :options="goodsNavOptions" :button-group="goodsNavButtonGroup" @click="doOptionClick" @buttonClick="doButtonClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				course: {},		//根据cid要查询的课程对象
				goodsNavOptions: [		//商品导航左侧的选项菜单
					{icon: 'more', text: '更多'},
					{icon: 'star', text: '收藏夹'},
					{icon: 'cart', text: '购物车', info: 3},
				],
				goodsNavButtonGroup: [	//商品导航右侧的按钮组
					{text: '加入购物车', backgroundColor: '#f00', color: '#fff'},
					{text: '立即购买', backgroundColor: '#ffa200', color: '#fff'},
				]
			};
		},
		onLoad(options){
			//从形参options中读取路由参数：cid —— 要查询课程编号
			//console.log('course detail onload: ', options)
			let cid = options.cid
			
			//由于H5环境下，用户可以在地址栏中直接输入当前页面地址，而不传cid参数，需要检验
			// #ifdef H5
			if(!cid){
				uni.showModal({
					title: '警告',
					content: '请从课程列表页进入当前页面！点击“确定”按钮返回列表页。',
					showCancel: false,
					success: res=>{
						//销毁跳转到有页签的页面
						uni.switchTab({
							url: '/pages/course/course'
						})
						return
					}
				})
			}
			// #endif
			
			uni.showLoading({
				title: '加载中'
			})
			//根据cid发起异步请求，获取指定课程的详情
			uni.request({
				url: this.server.courseDetail(cid),
				success: res=>{
					//console.log(res.data)
					this.course = res.data
					uni.hideLoading() //隐藏“加载中”提示
				}
			})
		},
		methods: {
			addFavorite(){
				//添加课程到“我的收藏夹”必需先验证用户是否已经登录
				if(getApp().globalData.userInfo===null){	//客户端未曾登录过
					uni.showModal({
						title: '提示',
						content: '登录后才能添加到收藏夹！点击“确定”跳转到登录界面。',
						complete: result=>{
							//用户点击了“确定”按钮，跳转到登录页面
							if(result.confirm){
								uni.switchTab({
									url: '/pages/userCenter/userCenter'
								})
							}
						}
					})
				}else {	//客户端显示已经登录——将课程编号提交给服务器，进一步验证登录是否超时
					uni.request({
						url: this.server.favoriteAdd(this.course.cid),
						success: res=>{
							if(res.data.code===490){  //服务器端会话超时
								uni.showModal({
									title: '提示',
									content: '服务器端会话超时！点击“确定”按钮跳转到登录页面。',
									complete: res=>{
										if(res.confirm){
											uni.switchTab({
												url: '/pages/userCenter/userCenter'
											})
										}
									}
								})
							}else if(res.data.code===200){  //收藏成功
								uni.showToast({
									title: '收藏成功'   //顺带会显示一个√
								})
							}else if(res.data.code===201){	//之前收藏过，此次重新更新了收藏时间
								uni.showToast({
									title: '收藏时间已更新'
								})
							}else {	//收藏失败
								uni.showModal({
									title: '错误',
									content: '收藏失败！请稍后重试！错误原因：'+res.data.msg,
									showCancel: false
								})
							}
						}
					})
				}
			},
			//商品导航左侧选项菜单被单击
			doOptionClick(e){
				//console.log(e) //this.$emit('click', {index:2,content:{}})
				if(e.index===0){		//“更多”选项
					uni.switchTab({		//TODO: 此处应该跳转到“相关商品推荐页面”
						url: '/pages/course/course'
					})
				}else if(e.index===1){	//“收藏夹”选项
					uni.navigateTo({
						url: '/pages/favorite/favorite'
					})
				}else if(e.index===2){	//“购物车”选项
					uni.navigateTo({
						url: '/pages/cart/cart'
					})
				}
			},
			//商品导航右侧按钮组中的按钮被单击
			doButtonClick(e){
				//console.log(e)//this.$emit('buttonClick', {index:0,content:{}})
				if(e.index===0){		//“加入购物车”
					//TODO:此处应该检查是否登录；
					//若未登录则跳转到登录页；否则异步请求“购物车添加API”
				}else if(e.index===1){	//“立即购买”
					//TODO：此处应该直接跳转到“下单”页面
				}
			},
		},
	}
</script>

<style lang="scss">
	.course {
		margin-bottom:55px;	//露出底部的商品导航条的高度
		.title {
			color: $uni-text-color;
			font-size: $uni-font-size-title;
			text-align: center;
			margin: 30rpx 0 15rpx;
			font-weight: bold;
		}
		.pic {
			width: 750rpx;
		}
		.details {
			background: $uni-bg-color-grey;
			padding: 30rpx 20rpx;
			.row {
				display: flex;
				flex-wrap: wrap;
				line-height: 1.6em;
				.label {
					font-weight: bold;
					margin-right: .6em;
				}
				.tname, .school {
					color: $iweb-theme-color-reverse;
					display: inline;
				}
			}
		}
		.price-box {
			display: flex;
			align-items: center;
			padding: 30rpx 20rpx;
			.label {
				font-weight: bold;
			}
			.price {
				font-size: 1.3em;
				margin-right: 80rpx;
			}
		}		
		.content-header {
			display: flex;
			margin: 30rpx  0  20rpx;
			border-bottom: 1px solid  $uni-border-color;
			.content-title {
				font-size: $uni-font-size-title;
				padding: 10rpx  40rpx 10rpx 20rpx;
				border-bottom: 2rpx solid $iweb-theme-color;
				transform: translateY(2rpx);
			}
		}
		.content {
			padding: 20rpx;
		}
	}
	.no-data {
		text-align: center;
		color: $uni-text-color-grey;
		margin: 60rpx 0;
	}
	.bottom-box {		//固定定位于底部的商品导航条
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>
