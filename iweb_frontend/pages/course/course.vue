<template>
	<view class="container">
		<!-- 顶部的分段器 -->
		<view class="segmented-box">
			<uni-segmented-control :current="current" :values="typeList" @clickItem="doClickItem" active-color="#00be56"></uni-segmented-control>
		</view>
		
		<!-- 主体部分的课程列表 -->
		<uni-list>
			<uni-list-item v-for="(c,i) in courseList"  :key="i"  @click="doCourseClick(c.cid)">
				<view class="course">
					<!-- 左侧：图片 -->
					<image class="pic" :src="server.host+c.pic" mode="widthFix"></image>
					<!-- 中央：课程详情介绍性文字 -->
					<view class="details">
						<view class="title">{{c.title}}</view>
						<view class="tname">讲师：{{c.tname}}</view>
						<view class="cLength">时长：{{c.cLength}}</view>
					</view>
					<!-- 右侧：价格 -->
					<view class="price">{{c.price | currency}}</view>
				</view>
			</uni-list-item>
		</uni-list>
		
		<!-- 底部按钮：没有更多数据了 -->
		<button type="default" disabled>{{ hasMore?'加载中':'没有更多数据了'}}</button>
		
	</view>
</template>

<script>
	//@指代项目根目录，uni-app中导入扩展组件必需以@开头
	//import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control"
	export default {
		// components:{
		// 	uniSegmentedControl
		// },
		data() {
			return {
				current: 0,				//当前选中的课程类别
				typeList: ['不限'],		//课程类别列表
				pageNum: 0,				//当前加载到哪一页课程数据了
				courseList: [],			//已经加载到的所有课程
				hasMore: true,			//还有更多数据可供加载吗？
			};
		},
		onLoad(options){
			//异步请求课程列表数据
			uni.request({
				url: this.server.type(),
				success: res=>{
					//console.log(res.data)
					let arr = res.data.map((t, i)=>{	//把对象数组映射为字符串数组
						return t.tpname
					})
					this.typeList = this.typeList.concat(arr)  //在“不限”后拼接更多的课程类型
				}
			})
			//加载下一页课程数据
			this.loadCourse()   //①页面加载完成
		},
		onReachBottom(){
			//用户滚动到页面底部，继续异步加载下一页课程数据——②页面滚动到底部
			this.loadCourse()
		},
		methods:{
			//处理分段器条目被单击事件
			doClickItem(e){
				//console.log('item clicked...', e)  //{currentIndex: 当前选中的项目}
				if(this.current != e.currentIndex){
					this.current = e.currentIndex	//修改得到最新的想查询的课程类别
					this.hasMore = true	//修改新的课程类别，默认认为该类别下有数据
					this.pageNum = 0	//新的类别还没有加载过数据
					this.courseList = []	//清空上一个类别已经查询到的数据
					//加载下一页课程数据——③用户切换课程类别
					this.loadCourse()
				}
			},
			
			//处理列表项(一个课程对象)被单击事件
			doCourseClick(cid){
				//注意：原生DOM事件才能在处理方法中获得“事件对象”
				//所有的扩展组件都是底层出发的自定义事件(可能携带数据也可能没有)：this.$emit('click', 数据/无数据)
				//console.log('course click ', e)
				//保留跳转到课程详情 —— 并携带路由参数
				uni.navigateTo({
					url: '/pages/courseDetail/courseDetail?cid='+cid
				})
			},
			
			//加载下一页课程数据：可用于①页面加载完成  ②页面滚动到底部   ③用户切换课程类别
			loadCourse(){
				//1.如果没有更多数据可供加载，则退出
				if(!this.hasMore){
					return
				}
				//2.如果有更多数据可供加载，显示“加载中”提示框
				uni.showLoading({
					title: '数据加载中'
				})
				//3.异步请求下一页数据
				this.pageNum++	//要加载的页号+1
				uni.request({
					url: this.server.courseList(this.pageNum, this.current),
					success: res=>{
						//console.log(res.data)  //响应消息主体是一个数据分页对象
						//4.拿到下一页数据，追加到“课程列表”
						this.courseList = this.courseList.concat(res.data.courseList)
						//5.判定还有更多数据吗？当前页已经大于等于总页数，则没有更多数据了
						if(this.pageNum >= res.data.pageCount){
							this.hasMore = false
						}
						//6.隐藏“加载中”提示框
						uni.hideLoading()
						//console.log(this.courseList)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.segmented-box {
		padding: 10rpx;
	}
	.course {
		display: flex;
		align-items: center;
		.pic {
			width: 250rpx;
		}
		.details {
			flex: 1; //文字占所有空白
			padding-left: 10rpx;
			overflow: hidden;   //4.子元素内容过长则隐藏
			.title {
				font-size: $uni-font-size-lg;
				font-weight: bold;
				margin-bottom: $uni-spacing-row-lg;
				white-space: nowrap;  //1.文本不换行
				overflow: hidden;  //2.溢出的文本隐藏起来
				text-overflow: ellipsis;  //3.文本溢出显示省略号
			}
			.tname, .cLength {
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
			}
		}
	}
</style>
