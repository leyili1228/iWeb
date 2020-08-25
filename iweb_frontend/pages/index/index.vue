<template>
	<!-- uni-app模板的根元素有且只能有一个；且能够使用HTML(但不推荐) -->
	<!-- 	<div>123</div>
			<h1>789</h1>
			<span>456</span>
			<hr>
	-->	
	<view class="container">
		<!-- 1.轮播广告 -->
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(c, i) in carouselList" :key="i">
				<navigator :url="'/pages/courseDetail/courseDetail?cid='+c.cid">
					<image :src="server.host + c.picUrl"></image>
				</navigator>
			</swiper-item>
		</swiper>
	
		<!-- 最新课程 -->
		<view class="header">
			<view class="title">最新课程</view>
			<navigator open-type="switchTab" hover-class="link-active" class="link" url="/pages/course/course">更多</navigator>
		</view>
		<view class="course-list">
			<view class="course" v-for="(c,i) in courseNewestList" :key="i">
				<image :src="server.host+c.pic" mode="widthFix"></image>
				<view class="title">{{c.title}}</view>
				<view class="tname">讲师：{{c.tname}}</view>
				<view class="price">{{c.price | currency}}</view>
			</view>
		</view>
		
		<!-- 热门课程 -->
		<view class="header">
			<view class="title">热门课程</view>
			<navigator open-type="switchTab" hover-class="link-active" class="link" url="/pages/course/course">更多</navigator>
		</view>
		<view class="course-list">
			<view class="course" v-for="(c,i) in courseHottestList" :key="i">
				<image :src="server.host+c.pic" mode="widthFix"></image>
				<view class="title">{{c.title}}</view>
				<view class="tname">讲师：{{c.tname}}</view>
				<view class="price">{{c.price | currency}}</view>
			</view>
		</view>
		
		<!-- 名师堂 -->
		<view class="header">
			<view class="title">名师堂</view>
			<navigator open-type="switchTab" hover-class="link-active" class="link" url="/pages/teacher/teacher">更多</navigator>
		</view>
		<scroll-view class="teacher-list" scroll-x="true" >
			<view class="teacher" v-for="(t,i) in teacherList" :key="i">
				<image :src="server.host+t.tpic" mode="widthFix"></image>
				<view class="tname">讲师：{{t.tname}}</view>
				<view class="maincourse">主讲：{{t.maincourse}}</view>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				carouselList: [],			//轮播广告列表
				courseHottestList: [],		//热门课程列表
				courseNewestList: [],		//最新课程列表
				teacherList: []				//讲师列表
			}
		},
		// mounted(){
		// 	console.log('index.mounted')
		// },
		onLoad(options) {			
			//向后端API异步请求动态数据
			//1.异步请求轮播广告数据
			uni.request({
				url: this.server.carousel(),
				success: res=>{
					// console.log(res)  //响应消息
					console.log(res.data)	//响应消息主体
					//this.setData({carouselList: res.data})  //错误！小程序修改Model的语法
					this.carouselList = res.data  //Vue.js修改Model语法
				},
				fail:(err)=>{
					uni.showToast({			//显示吐司对话框
						title: '请求失败！请稍后重试',
						icon: 'none'		//不显示对勾图标
					})
				}
			})
			//2.异步请求最新课程数据
			uni.request({
				url: this.server.courseNewest(),
				success: res=>{
					console.log(res.data)
					this.courseNewestList = res.data
				}
			})
			//3.异步请求热门课程数据
			uni.request({
				url: this.server.courseHottest(),
				success: res=>{
					console.log(res.data)
					this.courseHottestList = res.data
				}
			})
			//4.异步请求讲师数据
			uni.request({
				url: this.server.teacherList(),
				success: res=>{
					console.log(res.data)
					this.teacherList = res.data
				}
			})
		},
		
	}
</script>

<style lang="scss">
	$swiper-height: 300rpx;		//轮播广告的高度
	$swiper-width: 750rpx;		//轮播广告的宽度
	.swiper {
		width: $swiper-width;
		height: $swiper-height;
		
		navigator {
			height: $swiper-height;
			
			image {
				width: $swiper-width;
				height: $swiper-height;
			}
		}
	}

	.header {
		display: flex;
		margin: 30rpx  0  20rpx;
		border-bottom: 1px solid  $uni-border-color;
		.title {
			font-size: $uni-font-size-title;
			padding: 10rpx  35rpx;
			border-bottom: 1rpx solid $iweb-theme-color;
			transform: translateY(1rpx);
		}
		.link {
			flex: 1;
			text-align: right;
			padding-right: 25rpx;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
			transform: translateY(20rpx);
		}
		.link-active {
			color: $iweb-theme-color-reverse;
			background: transparent;
		}
	}

	.course-list {
		display: flex;
		flex-wrap: wrap; 	/*弹性布局中的自动换行*/
		
		.course {
			width: 375rpx;
			padding: 8rpx;
			text-align: center;
			
			image {
				width: 100%;
			}
			.title {
				font-size: $uni-font-size-base;
			}
			.tname {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}
			.price {
				font-size: $uni-font-size-lg;
			}
		}
	}

	.teacher-list {
		white-space: nowrap; //内容不换行
		.teacher {
			display: inline-block;
			width: 300rpx;
			padding: 8rpx 8rpx 40rpx;
			text-align: center;
			
			image {
				width:100%;
			}
			.tname {
				font-size: $uni-font-size-base;
			}
			.maincourse {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}
		}
	}
</style>
