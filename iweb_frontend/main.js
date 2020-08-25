import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
//此处可以声明全局数据——不需要频繁修改的
Vue.prototype.server = {		
	host: 'http://127.0.0.1:5050/',
	carousel(){
		return this.host + 'carousel'
	},
	courseNewest(count){
		if(count){
			return this.host + 'course/newest?count='+count
		}else {
			return this.host + 'course/newest'
		}
	},
	courseHottest(count){
		if(count){
			return this.host + 'course/hottest?count='+count
		}else {
			return this.host + 'course/hottest'
		}
	},
	teacherList(){
		return this.host + 'teacher/list'
	},
	teacherDetail(tid){
		return this.host + 'teacher/detail?tid='+tid
	},
	type(){
		return this.host + 'type'
	},
	courseList(pageNum, typeId){
		let url = this.host + 'course/list'
		if(pageNum){
			url += '?pageNum='+pageNum
		}else {
			url += '?pageNum=1'
		}
		if(typeId && typeId>0){
			url += '&typeId='+typeId
		}
		return url
	},
	courseDetail(cid){
		return this.host + 'course/detail?cid=' + cid
	},
	userLogin(){	//用户登录
		return this.host + 'user/login'
	},
	userRegister(){	//注册新用户
		return this.host + 'user/register'
	},
	userUploadAvatar(){	//上传头像文件，得到服务器端的文件名 —— 不验证登录
		return this.host + 'user/upload/avatar'
	},
	userUpdateAvatar(){	//修改自己的头像 —— 必需先登录
		return this.host + 'user/update/avatar'
	},
	userDetails(){	//获取当前登录用户的详细信息
		return this.host + 'user/details'
	},
	//TODO: 注册时“用户名”失去焦点时验证是否已被占用
	//TODO: 注册时“电话”失去焦点时验证是否已被占用
	captchaRegister(){	//生成验证码图片
		return this.host + 'captcha/register'
	},
	favoriteAdd(){	//添加到收藏夹——必需先登录
		return this.host + 'favorite/add'
	},
	favoriteList(){	//显示我的收藏夹内容——必需先登录
		return this.host + 'favorite/list'
	}
}

//此处可以声明全局过滤器
Vue.filter('currency', (val)=>{		//货币过滤器，把数据600转换为'￥600.00'
	if(val){
		let n = Number(val)
		return '￥'+n.toFixed(2)
	}
})
Vue.filter('phoneMask', (val)=>{		//电话过滤器，把数据13501234567转换为135*****567
	if(val){
		//string => array => string
		let arr = val.split("")		//把字符串内容用“空白”拆分为数组
		arr.splice(3, 5, '*****')	//把数组中第3开始5个字符替换
		return arr.join("")			//把数组中的元素使用“空白”拼接为字符串
	}
})
//此处可以声明全局子组件
//Vue.component('组件名', 组件对象)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
