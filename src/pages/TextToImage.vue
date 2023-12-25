<template>
  <div class="common-layout container" >
    <el-container >
      <el-aside  width="35%">
            <el-tabs v-model="activeName" class="tabs" @tab-click="handleTapsClick">
                <el-tab-pane label="二次元模型" name="二次元模型">
                    <div name="textarea-input">
                        <el-text tag="b" size="large">描述你想生成的图片</el-text>
                        <el-input class="textarea-style"
                            v-model="textarea"
                            type="textarea"
                            rows="5"
                            show-word-limit
                            :maxlength="100"
                            placeholder="在此输入您的创意,每个描述词用逗号分开,如:一个女孩，蓝色头发，校园"
                        /><br>
                        <el-text :style="{'color':'grey'}">创作灵感: <el-text tag="b">绚丽背景，空旷天空，绿茵草地</el-text></el-text> <br>
                    </div>
                    <div name="img-size" class="top-margin-div">
                        <el-text  tag="b" size="large">图片大小</el-text>
                        <div class="top-margin-text">
                            <el-radio-group v-model="imgSize">
                                <el-radio label="1024x1024" size="large" border>1024x1024</el-radio>
                                <el-radio label="1024x1792" size="large" border>1024x1792</el-radio>
                                <el-radio label="1792x1024" size="large" border>1792x1024</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div name="style" class="top-margin-div">
                        <el-text  tag="b" size="large">风格选择</el-text>
                        <div class="top-margin-text">
                            <el-radio-group v-model="selectedImgStyle" class="radio-group-div">
                                <div class="radio-item" v-for="style in styles" :key="style.fileName">
                                    <label>
                                        <el-radio :label="style.fileName" class="image-wrapper">
                                            <div class="image-wrapper" :class="{ 'selected': selectedImgStyle === style.fileName }">
                                                <img class="style-img" :src="style.url" alt="风格图片" />
                                                <el-tag class="overlay">{{ style.fileName }}</el-tag>
                                            </div>
                                        </el-radio>
                                    </label>
                                </div>
                            </el-radio-group>
                        </div>
                    </div>
                    <div name="submit" class="submit-div">
                        <el-button type="primary" size="large" :style="{'width':'93.5%'}" @click="generateImage">开始创作</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="图生图模型" name="图生图模型">功能开发中</el-tab-pane>
            </el-tabs>
        </el-aside>
        <el-main >
            <div>今日剩余AI绘图{{ generateTime }}次</div>
            <el-button class="img-button" type="primary" @click="downloadImg">下载</el-button>
            <img class="AiImage" @load="loading" v-if="AiImageUrl == ''" src="@/assets/背景.png" alt="">  
            <img class="AiImage" v-loading="loading" v-else :src="AiImageUrl" alt="">     
        </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref ,onMounted } from 'vue'
import { GetTextToImageConfig, TextToImage} from '@/api/ImageAI'
import { ElLoading } from 'element-plus'
// 页面渲染
onMounted(() => {
  InitTextToImageConfig()
  getGenerateTime();
});

const activeName = ref('二次元模型')
const textarea = ref('')
const imgSize = ref('1024x1024')
const selectedImgStyle = ref('二次元')
const styles = ref([])
const AiImageUrl = ref('')
const generateImageParams = ref({
    prompt: textarea,
    style: selectedImgStyle,
    size: imgSize,
})
//初始化AI生图配置
const InitTextToImageConfig = () =>{
    GetTextToImageConfig().then(res =>{
        styles.value = res.styles
        console.log(res)
    })
}

import { GetGenerateTime } from '@/api/Allrequest';
const generateTime = ref("");
const getGenerateTime = () => {
  GetGenerateTime()
    .then((res) => {
      if (res.code == 200) {
        generateTime.value = res.data.textToImage;
        if(res.data.textToImage <= 0){
            ElMessage.error('当日次数已用完!')
        }
      }
    })
    .catch((err) => {
      dialogCustomize({ content: err });
      return;
    });
};

//生成图片
const generateImage = () =>{
    AiImageUrl.value = '';
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    TextToImage(generateImageParams.value).then(res =>{
        AiImageUrl.value = "/gpt/material/GetImage/"+res.data
        loading.close();
        if(res.code == 403){
            ElMessage.error('输入文字非法!')
        }
    }).catch(err =>{
        console.log(err)
        ElMessage.error('请重新登录或当日次数已使用完!')
    })
}

//下载图片文件
const downloadImg = () =>{
    if(AiImageUrl.value == ''){
        ElMessage({
            message: '请先绘制图片！',
            type: 'warning',
        })
    }else{
        window.open(AiImageUrl.value)
    }
}
    
const handleTapsClick = (tab, event) => {
  console.log(tab, event)
}
</script>

<style>


.container {
    margin-top: 100px;
    margin-left: 50px;
    margin-right: 50px;
}

.tabs {
    width: 100%;
}

.textarea-style{
    margin-top: 10px;
    width: 93.5%;
}

.radio-group-div{
    margin-left: -16px;
}

.submit-div{
    margin-bottom: 20px;
}

.top-margin-div{
    margin-top: 30px;
}
.top-margin-text{
    margin-top: 10px;
}

.AiImage{
    width: 100%;
    border-radius: 8px;
    border: 2px solid;
}

.img-button{
    float: right;
    margin-bottom: 10px;
}

</style>

<style scoped>
.radio-item {
  display: inline-block;
  margin: 10px;
}

.image-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px; /* Add border-radius for rounded corners */
}

.style-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.image-wrapper.selected {
  border: 3px solid rgb(209,227,68); /* Add border for selected style */
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px;
  border: none;
  text-align: center;
  color: white;
  backdrop-filter: blur(2px);
}

::v-deep .el-radio__input {  /* 去掉单选框的圆圈 */
  display: none ;
} 
</style>
