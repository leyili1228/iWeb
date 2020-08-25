let arr = [
	{tpid: 1, tpname: '基础课程'},
	{tpid: 2, tpname: '高级课程'},
	{tpid: 3, tpname: '进阶课程'},
]
//['基础课程', '高级课程', '进阶课程']

let arr2 = arr.map((item, i)=>{
	return  item.tpname
})

console.log(arr2)