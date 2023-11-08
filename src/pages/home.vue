<template>
    <div class="main">
        <el-carousel class="carousel">
            <el-carousel-item v-for="item in carouselImages" :key="item">
                <img :src="item" style="width: 100%;" />
            </el-carousel-item>
        </el-carousel>
        <div class="tag"> 人物 </div>
        <el-row style="height: 400px;margin: 5px 20px;">
            <el-col :span="9" class="cell">
                <el-card class="cell" :body-style="{ padding: '0px', height: '100%' }">
                    <img :src="images[0]" class="image" />
                    <div class="description">
                        <span class="title">{{ tag }}</span>
                        <div class="subtitle">
                            {{ subTag[0] }}
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="15" class="cell">
                <el-row v-for="i in 2" style="height: 50%;">
                    <el-col v-for="j in 3" :span="8" class="cell">
                        <el-card class="cell" :body-style="{ padding: '0px', height: '100%' }">
                            <img :src="images[(i - 1) * 3 + j]" class="subimage" />
                            <div class="description">
                                <span class="title">{{ tag }}</span>
                                <div class="subtitle">
                                    {{ subTag[(i - 1) * 3 + j] }}
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const carouselImages = ref([
    'https://img.51miz.com/Element/00/81/07/80/c02a0fdf_E810780_585e3597.jpg',
    'https://img.zcool.cn/community/01662f554243770000019ae9cb94c1.jpg@1280w_1l_2o_100sh.jpg',
    'https://img.tukuppt.com/ad_preview/00/11/10/5c993f614215a.jpg!/fw/980',
    'https://tse4-mm.cn.bing.net/th/id/OIP-C.p3XlYmx3lqEzw--N8kxsPAHaHa?pid=ImgDet&rs=1',
])

const images = ref(
    [
        "http://127.0.0.1:5173/AIweb_material/%E5%A5%A5%E7%89%B9%E6%9B%BC%E5%A5%B3%EF%BC%88%E6%AD%A3%E9%9D%A2%EF%BC%89-1.jpg",
        "http://127.0.0.1:5173/AIweb_material/%E5%A5%A5%E7%89%B9%E6%9B%BC%E5%A5%B3%EF%BC%88%E6%AD%A3%E9%9D%A2%EF%BC%89-2.jpg",
        "http://127.0.0.1:5173/AIweb_material/%E5%A5%A5%E7%89%B9%E6%9B%BC%E5%A5%B3%EF%BC%88%E6%AD%A3%E9%9D%A2%EF%BC%89-3.jpg",
        "http://127.0.0.1:5173/AIweb_material/%E5%A5%A5%E7%89%B9%E6%9B%BC%E5%A5%B3%EF%BC%88%E6%AD%A3%E9%9D%A2%EF%BC%89-4.jpg",
        "http://127.0.0.1:5173/AIweb_material/%E5%85%AB%E6%88%92%EF%BC%88%E5%A5%B3%EF%BC%89.jpg",
        "http://127.0.0.1:5173/AIweb_material/%E6%AF%94%E5%8D%A1%E4%B8%98%E5%A5%B3%EF%BC%88%E6%AD%A3%E9%9D%A2%EF%BC%89.jpg",
        "http://127.0.0.1:5173/AIweb_material/%E6%B2%99%E5%83%A7%EF%BC%88%E5%A5%B3%EF%BC%89.jpg",

    ])
const tag = ref('玄幻修仙')
const subTag = ref(['奥特曼女-1', '奥特曼女-2', '奥特曼女-3', '奥特曼女-4', '八戒', '皮卡丘', '沙僧'])

</script>



<style scoped>
body {
    font-family: 'Roboto', sans-serif;
}

.main {
    margin-top: 4.375rem;
    position: relative;
}

:deep(.el-card) {
    width: 100%;
    height: 100%;
}

.cell {
    height: 100%;
    padding: 5px;
}

.cell .image {
    display: block;
    width: 100%;
    height: 80%;
    object-fit: contain;
}

.cell .subimage {
    display: block;
    width: 100%;
    height: 60%;
    object-fit: contain;
}

.cell .description {
    padding: 5px;
}

.tag {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 10px 0;
    padding: 0 50px;
}

.description .title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
}

.description .subtitle {
    font-size: 16px;
    font-weight: 700;
    color: #666;
    margin-bottom: 10px;
}
</style>