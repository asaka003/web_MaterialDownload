<template>
  <el-container class="container">
    <el-aside class="menu">
      <el-dialog v-model="toolDownload" title="软件下载" width="30%" center>
        <span>
          
          百度网盘链接<a href="https://pan.baidu.com/s/1ba7aZrUJeA_2O3EXR8Mv9w?pwd=wiow">https://pan.baidu.com/s/1ba7aZrUJeA_2O3EXR8Mv9w?pwd=wiow</a>
          <br>提取码：wiow
        </span>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="toolDownload = false">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
      <div class="">
        <el-button round :style="{display:'none'}">
          <el-icon><Reading /></el-icon>
          <span>临时填充按钮</span>
        </el-button>
        <el-button @click="selectHanlder(0)"  round >
          <el-icon><Reading /></el-icon>
          <span>课程教学</span>
        </el-button>
        <el-button @click="selectHanlder(1)" round>
          <el-icon><Setting /></el-icon>
          <span>素材中心</span>
        </el-button>
        <el-button @click="selectHanlder(2)" round>
          <el-icon><Mic /></el-icon>
          <span>配音工具</span>
        </el-button>
        <el-button @click="selectHanlder(3)" round>
          <el-icon><EditPen /></el-icon>
          <span>AI写作</span>
        </el-button>
        <el-button @click="selectHanlder(4)" round>
          <el-icon><Picture /></el-icon>
          <span>AI生图</span>
        </el-button>
        <el-button @click="openNewTab(1)" round>
          <el-icon><Share /></el-icon>
          <span>小说拉新</span>
        </el-button>
        <el-button @click="openNewTab(2)" round>
          <el-icon><Download /></el-icon>
          <span>软件下载</span>
        </el-button>
      </div>
    </el-aside>
    <el-main class="ad">
      <el-carousel autoplay>
          <el-carousel-item v-for="item in carouselImages" :key="item">
              <img :src="item" />
          </el-carousel-item>
      </el-carousel>
    </el-main>
  </el-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus';

import {
  userBalanceApi,
} from "@/api/Allrequest.js";

const carouselImages = ref([
  "https://cdncos.eralab.cn/materials/海报.png",
  "https://cdncos.eralab.cn/materials/绿色海报.png"
])

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
const router = useRouter();
const selectHanlder = (index) =>{
  getCountSync()
  .then((res) => {
    switch(index){
      case 0: router.push("/videos");break;
      case 1: router.push("/material-center");break;
      case 2: router.push("/soundAIChart");break;
      case 3: router.push("/AIchat");break;
      case 4: router.push("/TextToImage");break;
      case 5: toolDownload.value = true;break;
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


.ad{
  /*height: 600px;*/
  text-align: center;
  :deep(.el-carousel){
    height: 620px;
  }
  :deep(.el-carousel__container){
    height: 100%;
  }
  img{
    padding: 0px;
    border-radius: 10px;
    height: 100%;

    /* 添加边框和阴影 */
    /* border: 2px solid #000; 边框颜色和宽度 */
  }
}

.menu{
  width: 20%;
  text-align: center;
  button{
    width: 80%;
    font-size: 20px;
    margin-top: 25px;
    margin-bottom: 25px;
    padding:20px
  }
}

</style>