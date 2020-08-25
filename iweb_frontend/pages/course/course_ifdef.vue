<template>
	<view>
		<!-- #ifndef MP -->
		<a href="http://www.baidu.com">跳转到百度</a>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onLoad(options){
			// #ifdef APP-NVUE
			console.log('this is app')
			// #endif
			
			// #ifdef H5
			alert('this is h5')
			// #endif
		}
	}
</script>

<style lang="scss">
/* #ifdef  MP-WEIXIN */
.box {
	background: #FF6600;
}
/* #endif */



/* #ifdef H5 || APP-PLUS */
.box {
	background: #00BE56;
}
/* #endif */
</style>
