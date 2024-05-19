<template>
  <el-row class="tac">
    <el-menu
        default-active="2-2-1"
        class="aside-menu"
        @open="handleOpen"
        @close="handleClose"
        @select="selectHanlder"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Reading /></el-icon>
            <h2>课程教学</h2>
          </template>
          <el-menu-item index="1-1" class="title3">动画速成班</el-menu-item>
          <!-- <el-menu-item index="1-2" class="title3">精细化课程</el-menu-item> -->
          <el-sub-menu index="1-2">
            <template #title>
              <p class="title3">精细化课程</p>
            </template>
            <el-menu-item index="1-2-1" class="title3" @click="CourseJump(1)"><a href="https://learn.htknow.com/login">海豚知道</a></el-menu-item>
            <el-menu-item index="1-2-2" class="title3" @click="CourseJump(2)"><a href="https://web.lizhiweike.com">荔枝微课</a></el-menu-item>
          </el-sub-menu>
          <el-menu-item index="1-3" class="title3">十三太保专属文案课</el-menu-item>
          <el-menu-item index="1-4" class="title3">运营课</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Setting /></el-icon>
            <h2>素材中心</h2>
          </template>
          <el-sub-menu index="2-1" v-if="checkUser()">
            <template #title><h3 class="aside-title">大咖专属素材</h3></template>
            <el-menu-item index="2-1-1" class="title2">在下零零玖</el-menu-item>
            <el-menu-item index="2-1-2" class="title2">奇遇十三太保</el-menu-item>
            <el-menu-item index="2-1-3" class="title2">在下豆缺</el-menu-item>
            <el-menu-item index="2-1-4" class="title2">雕十三</el-menu-item>
            
          </el-sub-menu>
          <el-sub-menu index="2-2">
            <template #title><h3 class="aside-title">人物素材</h3></template>
            <el-menu-item index="2-2-1" class="title2">修仙</el-menu-item>
            <el-menu-item index="2-2-2" class="title2">古代</el-menu-item>
            <el-menu-item index="2-2-3" class="title2">都市</el-menu-item>
            <el-menu-item index="2-2-4" class="title2">年代</el-menu-item>
            <el-menu-item index="2-2-5" class="title2">战争</el-menu-item>
            <el-menu-item index="2-2-6" class="title2">其他</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2-3">
            <template #title><h3 class="aside-title">场景素材</h3></template>
            <el-menu-item index="2-3-1" class="title2">修仙</el-menu-item>
            <el-menu-item index="2-3-2" class="title2">古代</el-menu-item>
            <el-menu-item index="2-3-3" class="title2">都市</el-menu-item>
            <el-menu-item index="2-3-4" class="title2">年代</el-menu-item>
            <el-menu-item index="2-3-5" class="title2">战争</el-menu-item>
            <el-menu-item index="2-3-6" class="title2">其他</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2-4">
            <template #title><h3 class="aside-title">表情包</h3></template>
            <el-menu-item index="2-4-1" class="title2">男生</el-menu-item>
            <el-menu-item index="2-4-2" class="title2">女生</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2-5">
            <template #title><h3 class="aside-title">道具素材</h3></template>
            <el-menu-item index="2-5-1" class="title2">修仙</el-menu-item>
            <el-menu-item index="2-5-2" class="title2">古代</el-menu-item>
            <el-menu-item index="2-5-3" class="title2">都市</el-menu-item>
            <el-menu-item index="2-5-4" class="title2">食物</el-menu-item>
            <el-menu-item index="2-5-5" class="title2">动物</el-menu-item>
            <el-menu-item index="2-5-6" class="title2">植物</el-menu-item>
            <el-menu-item index="2-5-7" class="title2">其他</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2-6">
            <template #title><h3 class="aside-title">特效</h3></template>
            <el-menu-item index="2-6-1" class="title2">常规特效</el-menu-item>
            <el-menu-item index="2-6-2" class="title2">打斗特效</el-menu-item>
            <el-menu-item index="2-6-3" class="title2">全屏特效</el-menu-item>
            <el-menu-item index="2-6-4" class="title2">其他</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2-7-1"><h3 class="aside-title">音频</h3></el-menu-item>
        </el-sub-menu>
        <el-menu-item index="3">
          <el-icon><Mic /></el-icon>
          <h2>配音工具</h2>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><EditPen /></el-icon>
          <h2>AI改文工具</h2>
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon><Picture /></el-icon>
          <h2>AI生图工具</h2>
        </el-menu-item>
        <el-menu-item index="6">
          <el-icon><Share /></el-icon>
          <h2>小说拉新</h2>
        </el-menu-item>
        <el-menu-item index="7">
          <el-icon><Download /></el-icon>
          <h2>软件下载</h2>
        </el-menu-item>
      </el-menu>
  </el-row>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus';
import {
  userBalanceApi,
} from "@/api/Allrequest.js";
const getCountSync = async () => {
  try {
    const res = await userBalanceApi({ option: "check" }); // 等待异步操作返回结果
    if (res.code == 200) {
      return res;
    } else {
      throw new Error(res);
    }
  } catch (error) {
    throw error;
  }
};
//验证是否是管理员或者专属用户
const checkUser = () => {
  return localStorage.getItem("userType") == '管理员' || localStorage.getItem("userType") == '专属用户'
}
const router = useRouter();
// const materialType = ref([
//   ["在下零零玖","奇遇十三太保","苦瓜就是苦"],
//   ["修仙","古代","历史","年代","战争","其他"],
//   ["古代","历史","年代","战争","其他"],
//   ["男生","女生"],
//   ["武器","动植物","其他"],
//   ["常规特效","打斗特效","全屏特效","其他"],
//   ["音频"]
// ])
// 标签
const materialType = ref([
  {
    name:"大咖专属素材",
    secondTags:["在下零零玖","奇遇十三太保","在下豆缺","雕十三"],
  },
  {
    name: "人物素材",
    secondTags: ["修仙","古代","都市","年代","战争","其他"],
  },
  {
    name: "场景素材",
    secondTags: ["修仙","古代","都市","年代","战争","其他"],
  },
  {
    name: "表情包",
    secondTags: ["男生","女生"],
  },
  {
    name: "道具素材",
    secondTags: ["修仙","古代","都市","食物","动物","植物","其他"],
  },
  {
    name: "特效",
    secondTags: ["常规特效","打斗特效","全屏特效","其他"],
  },
  {
    name: "音频",
    secondTags: [""],
  },
]);

const videoLabels = ref([{name:"动画速成班"},{name:"精细化课程"},{name:"十三太保专属文案课"},{name:"运营课"}])

const ViewMoreCourse = () =>{
  window.location.href = ""
}

const CourseJump = (num)=>{
  if (num == 1){
     window.location.href = "https://learn.htknow.com/login"
  }else{
     window.location.href = "https://web.lizhiweike.com"
  }
}

const selectHanlder = (key, keyPath) =>{
    console.log(key,keyPath)
  getCountSync()
  .then((res) => {
    switch(key[0]){
      case '1':
                var index = keyPath[keyPath.length-1].split("-")
                localStorage.setItem("videoType",videoLabels.value[Number(index[1])-1].name)
                //console.log(videoLabels.value[Number(index[1])-1].name)
                router.push("/videos");
                break;
      case '3': router.push("/soundAIChart");break;
      case '4': router.push("/AIchat");break;
      case '5': router.push("/TextToImage");break;
      case '6': openNewTab(1);break;
      case '7': openNewTab(2);break;
      default:  //素材中心
        var index = keyPath[keyPath.length-1].split("-")
        localStorage.setItem("type1",materialType.value[Number(index[1])-1].name)
        localStorage.setItem("type2",materialType.value[Number(index[1])-1].secondTags[Number(index[2])-1])
        router.push("/material-center");
    }
  }).catch(err => {
    ElMessage.error('请重新登录！')
  })
  
}

const toolDownload = ref(false)
const openNewTab = (num)=>{
  switch(num){
    case 1: window.open('https://tuixiaoguo.lizhibj.cn/login?redirect=%2F');break;
    case 2: window.open('https://pan.baidu.com/s/1ba7aZrUJeA_2O3EXR8Mv9w?pwd=wiow');break;
  }
}
</script>
<style lang="scss" scoped>
.aside-menu{
    width: 100%;
    border-right: solid 0px var(--el-menu-border-color) ;
    margin-bottom: 150px;
}
.aside-title{
  margin-left:9px;
}
.title2{
    margin-left:-11px
  }
.title3{
  margin-left: 10px
}

</style>