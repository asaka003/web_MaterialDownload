<template>
    <div class="main">
        <el-carousel height="65vh">
            <el-carousel-item v-for="item in carouselImages" :key="item">
                <img :src="item" style="width: 100%;" />
            </el-carousel-item>
        </el-carousel>

        <div v-for="(showList, key) in images">
            <div class="tag"> {{ key }} </div>
            <el-row style="height: 100%;margin: 5px 20px;">
                <el-col :span="9" class="cell">
                    <el-card v-if="showList.length > 0" :body-style="{ padding: '0px', height: '100%', cursor: 'pointer' }"
                        @click="jump(key, showList[0]['type2'])">
                        <img :src="url_prefix + showList[0]['filename']" class="image" />
                        <div class="description">
                            <span class="title">{{ showList[0]['type2'] }}</span>
                            <div class="subtitle">
                                {{ removeFileExtension(showList[0]['filename']) }}
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="15">
                    <el-row v-for="i in 2" style="height: 50%;">
                        <el-col v-for="j in 3" :span="8" class="cell">
                            <el-card v-if="showList.length > ((i - 1) * 3 + j)"
                                :body-style="{ padding: '0px', height: '100%', cursor: 'pointer' }"
                                @click="jump(key, showList[(i - 1) * 3 + j]['type2'])">
                                <img :src="url_prefix + showList[(i - 1) * 3 + j]['filename']" class="subimage" />
                                <div class="description">
                                    <span class="title">{{ showList[(i - 1) * 3 + j]['type2'] }}</span>
                                    <div class="subtitle">
                                        {{ removeFileExtension(showList[(i - 1) * 3 + j]['filename']) }}
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { tags } from '../router/jump';

const carouselImages = ref([])
const images = ref({})

onMounted(async () => {
    carouselImages.value = await getCarousel()
    images.value = trans(await getShowList())
})

const url_prefix = 'https://www.eralab.cn/AIweb_material/show_'

function trans(list) {
    return list.reduce((result, item) => {
        const t = item['type1'];

        if (!result[t]) {
            result[t] = [];
        }

        result[t].push(item);
        return result;
    }, {});
}


function removeFileExtension(filename) {
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex !== -1) {
        return filename.substring(0, dotIndex);
    }
    return filename;
}

function jump(tag1, tag2) {
    console.log(tag1, tag2)
    tags.value = [tag1, tag2]
    window.location.href = '#/material-center'
}

// api.js

async function getCarousel() {
    const res = await post('/AIweb_materialSys/getAllScrollImageList')
    return res.map(i => url_prefix + i['filename'])
}

function getShowList() {
    return post('/AIweb_materialSys/getAllShowImageList')
}

async function post(url, data) {
    const res = await fetch(url,
        {
            method: 'POST',
            // credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

    return check(await res.json())
}

function check(res) {
    // console.log(res)
    if (res.msg === "success")
        return res.data;
    else return Promise.reject(new Error(res.msg));
}
</script>



<style scoped>
body {
    font-family: 'Roboto', sans-serif;
}

.main {
    margin-top: 3.125rem;
    position: relative;
}

:deep(.el-card) {
    height: 100%;
}

.cell {
    margin: 5px 0;
    padding: 5px;
}

.cell .image {
    display: block;
    width: 100%;
    height: 85%;
    object-fit: contain;
}

.cell .subimage {
    display: block;
    width: 100%;
    height: 75%;
    object-fit: contain;
}

.cell .description {
    padding: 5px;
    margin-left: 10px;
}

.tag {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-top: 3rem;
    padding: 0 50px;
}

.description .title {
    font-size: 1.4vw;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
}

.description .subtitle {
    font-size: 1vw;
    font-weight: 700;
    color: #666;
    margin-bottom: 10px;
}
</style>