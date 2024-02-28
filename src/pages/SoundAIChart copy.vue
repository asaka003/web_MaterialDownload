<template>
  <div class="write">
    <div class="t-r-btn">
      <!-- <button @click="play">播放</button> -->
      <!-- ，已使用0次 -->
      <div>今日剩余配音{{ generateTime }}次</div>
      <div class="r-btn">
        <audio v-if="saveAudioUrl"
          id="audioPlayer"
          controls="controls"
          controlslist="nodownload  noplaybackrate"
          style="height: 40px !important"
          :src="saveAudioUrl"
        ></audio>
        <!-- <audio ref="audioRef" src="@/assets/如果你要实现鼠标悬停.mp3"></audio> -->
        <el-button size="large" type="primary" @click="generateTextToSpeech">配音</el-button>
        <el-button size="large" type="primary" plain @click="downloadSpeechFile">下载音频</el-button>
      </div>
    </div>
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="8"
          ><div class="grid-content ep-bg-purple" />
          <div class="make-txt">
            <!-- <div class="l-t-nav">
              <div class="make-fun">
                <div class="make-fun-item">
                  <div class="make-fun-cont">
                    <el-icon><VideoPlay /></el-icon> <span>插入停顿</span>
                  </div>
                </div>
                <div class="make-fun-item">
                  <div class="make-fun-cont">
                    <el-icon><Edit /></el-icon><span>多音字</span>
                  </div>
                </div>
                <div class="make-fun-item">
                  <div class="make-fun-cont">
                    <el-icon><User /></el-icon><span>多人配音</span>
                  </div>
                </div>
                <div class="make-fun-item">
                  <div class="make-fun-cont">
                    <el-icon><Notification /></el-icon><span>符号停顿</span>
                  </div>
                </div>
              </div>
            </div> -->
            <div class="l-b-m">
              <el-input
                v-model="textareaValue"
                autosize
                maxlength="300"
                show-word-limit
                placeholder="请输入配音内容"
                type="textarea"
              />
            </div>
            <audio
              style="position: absolute; z-index: -1; top: 0"
              id="audioPlayerdemoUrl"
              ref="audioPlayerdemoUrl"
              :src="audioUrl"
              controls
            ></audio>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="c-user">
            <div class="parameter-top">
              <div class="parameter parameter-left">
                <div class="el-image parameter-head">
                  <img
                    :src="userInfo.headerImage"
                    class="el-image__inner"
                    style="
                      border-radius: 50%;
                      border: 5px solid #fff;
                      box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.16);
                    "
                  />
                </div>
                <div
                  class="zb-name"
                  style="
                    font-size: 20px;
                    font-family: PingFang SC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: white;
                    margin-top: 12px;
                  "
                >
                  {{ userInfo.speaker }}
                </div>
                <div>
                  <el-button
                    size="large"
                    @click="handleDialog"
                    icon="Refresh"
                    type="primary"
                    plain
                    >更换主播</el-button
                  >
                </div>
                <div>
                  <el-button
                    @click="openCollectionSave"
                    size="large"
                    icon="Star"
                    type="primary"
                    plain
                    >收藏</el-button
                  >
                </div>
              </div>
              <div class="parameter parameter-right">
                <div class="type-v">
                  <div class="title">朗读速度</div>
                  <div class="slider-box">
                    <el-slider
                      size="small"
                      step="0.1"
                      :min="ld[0]"
                      :max="ld[1]"
                      show-input-controls
                      input-size
                      v-model="slider.ld"
                    />
                    <el-input-number
                      v-model="slider.ld"
                      :min="ld[0]"
                      step="0.1"
                      :max="ld[1]"
                      controls-position="right"
                      size="small"
                    />
                  </div>
                </div>
                <div class="type-v">
                  <div class="title">主播音量</div>
                  <div class="slider-box">
                    <el-slider
                      size="small"
                      step="0.1"
                      :min="yl[0]"
                      :max="yl[1]"
                      v-model="slider.yl"
                    />
                    <el-input-number
                      size="small"
                      step="0.1"
                      :min="yl[0]"
                      :max="yl[1]"
                      v-model="slider.yl"
                      controls-position="right"
                    />
                  </div>
                </div>
                <div class="type-v">
                  <div class="title">语调调节</div>
                  <div class="slider-box">
                    <el-slider
                      size="small"
                      step="1"
                      :min="yd[0]"
                      :max="yd[1]"
                      v-model="slider.yd"
                    />
                    <el-input-number
                      size="small"
                      step="1"
                      :min="yd[0]"
                      :max="yd[1]"
                      v-model="slider.yd"
                      controls-position="right"
                    />
                  </div>
                </div>
                <div class="type-v">
                  <div class="title">音频类型</div>
                  <div class="slider-box">
                    <el-select
                      style="width: 120px"
                      v-model="slider.type"
                      size="small"
                      class="m-2"
                      placeholder="Select"
                    >
                      <el-option label="mp3" value="mp3"></el-option>
                      <el-option label="wav" value="wav"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>

              <div class="make-moods">
                <div class="title">情绪</div>
                <div class="moods">
                  <div
                    @click="handleMood(item.speaker, item.demoUrl,item.name)"
                    @mouseenter="handleMouseEnter(item.speaker)"
                    :class="
                      makeActive == item.speaker
                        ? 'mood-item make-active'
                        : 'mood-item'
                    "
                    v-for="item in userInfo.speakerEmotion"
                    :key="item.speaker"
                  >
                    <div class="mood-item-image">
                      {{ item.firstCharacter }}
                      <img
                        v-if="makeActive == item.speaker"
                        :src="item.play"
                        alt=""
                      />
                      <img
                        v-if="isHovering == item.speaker"
                        :src="item.stop"
                        alt=""
                      />
                    </div>
                    <div class="name">{{ item.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="make-cle">
            <div class="title">
              <div class="search">
                <span class="cle-title">收藏</span>
                <el-select
                  style="margin-left: 10px !important;"
                  v-model="value"
                  class="m-2"
                  size="small"
                  placeholder="Select"
                >
                  <el-option
                    placeholder="收藏类型选择"
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="edit-delete">
                <div class="cle-delete">编辑</div>
                <div class="cle-delete">删除</div>
              </div>
            </div>
            <div class="cle-content">
              <div name="collectionList">
                <div class="collectionList" v-for="collection in collectionList" :key="collection.id">
                  <el-tooltip
                    class="box-item"
                    effect="light"
                    placement="top-start"
                  >
                    <template #content> 
                      主播: {{collection.speakerName}}<br>
                      情绪: {{collection.speaker_emotion}}<br>
                      速度: {{collection.speed}}<br>
                      音量: {{collection.volume}}<br>
                      语调: {{collection.pitch}}<br>
                    </template>
                    <img
                      :src="collection.headerImage"
                      style="
                        border-radius: 50%;
                        border: 5px solid #fff;
                        box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.16);
                        width: 60px;
                        height: 60px;
                        cursor: pointer;
                      "
                      @click="collectionReload(collection)"
                    />
                  </el-tooltip><br>
                  <el-text class="remark">{{ collection.remark }}</el-text>
                </div>
              </div>
              <el-dialog v-model="collectionFormVisible" title="收藏主播配置">
                <el-form :model="form">
                  <el-form-item label="备注" :label-width="80">
                    <el-input v-model="remark" autocomplete="off" />
                  </el-form-item>
                </el-form>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="collectionFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleCollectionSave">
                      确认
                    </el-button>
                  </span>
                </template>
              </el-dialog>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-dialog
    style="width: 950px; border-radius: 15px !important;background-color: #212121;"
    center
    v-model="dialogVisible"
  >
    <div class="zb-nav">
      <div class="table-item">
        <div class="table-item-name">声色</div>
        <div class="nav-items">
          <div
            class="nav-item"
            :class="{ 'active': item.value == queryParams.gender }"
            v-for="item in genderList"
            :key="item.name"
            @click="handleQuery('gender', item.value)"
          >
            {{ item.name }}
          </div>

          <!-- <v-if>loadinShow</v-if> -->
        </div>
      </div>
      <div class="table-item">
        <div class="table-item-name">年龄</div>
        <div class="nav-items">
          <div
            :class="
              item.value == queryParams.ageScope
                ? 'nav-item active'
                : 'nav-item'
            "
            v-for="(item, index) in ageScopeList"
            :key="index"
            @click="handleQuery('ageScope', item.value)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="table-item">
        <div class="table-item-name">语种</div>
        <div class="nav-items">
          <div
            :class="
              item.value == queryParams.specificLanguage
                ? 'nav-item active'
                : 'nav-item'
            "
            v-for="(item, index) in specificLanguageList"
            :key="index"
            @click="handleQuery('specificLanguage', item.value)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="anchors">
      <ul
        v-infinite-scroll="loadData"
        class="infinite-list"
        style="overflow: auto"
      >
        <div class="anchor-item" v-for="(item, index) in zbData" :key="index">
          <el-icon
            size="20"
            v-if="item.headerImage == sureZb"
            bgColor="#fff"
            color="#d1e344"
            ><CircleCheckFilled
          /></el-icon>

          <div class="item-top" @click="handleSureZb(item)">
            <div class="el-image item-image">
              <el-avatar :size="50" :src="item.headerImage" />
            </div>
            <div>
              <div class="list-nc">
                <p>{{ item.speaker }}</p>
              </div>
              <p class="list-desc">{{ item.behavior }}</p>
            </div>
          </div>
          <div class="item-bottom">
            <div
              class="list-top"
              @click="stopDemoUrl(item, index)"
              v-if="item.demoUrl == audioUrl"
            >
              <img :src="item.demoUrl == audioUrl ? item.bf : item.zt" alt="" />
              <p>{{ item.name }}</p>
            </div>
            <div class="list-top" @click="playDemoUrl(item, index)" v-else>
              <img :src="item.demoUrl == audioUrl ? item.bf : item.zt" alt="" />
              <p>{{ item.name }}</p>
            </div>
            <p @click="handleSureZb(item)">立即配音</p>
          </div>
        </div>
        <div class="anchor-null" v-if="zbData && zbData.length == 0">
          暂无该类型的主播
        </div>
        <div class="el-loading-mask" v-if="loadinShow">
          <div class="el-loading-spinner">
            <div v-loading="loadinShow"></div>
          </div>
        </div>
      </ul>
    </div>

    <!-- <span class="PopUpPrompt">{{ PopUpPrompt.content }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogSubmit(PopUpPrompt)">
          {{ PopUpPrompt.button }}
        </el-button>
      </span>
    </template> -->
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import UploadInstance from "element-plus";
import {
  GetGenerateTime,
  GetUserCollectionList,
  getTextToSpeechConfig,
  AddUserCollection,
} from "@/api/Allrequest";
// 页面渲染
onMounted(() => {
  getGenerateTime();
  getCollectionList();
  userInfoData();
});
// var audioPlayerDemo = document.getElementById('audioPlayerdemoUrl');

const audioPlayerdemoUrl = ref(null);
const handleDialog = () => {
  dialogVisible.value = true;
  resetData();
  getZbData();
};

const sureZb = ref("");
const handleSureZb = (row) => {
  processArray(row.speakerEmotion);
  userInfo.value = row;
  sureZb.value = row.headerImage;
  console.log(userInfo.value);
};

// 收藏
const remark = ref("");
const collectionList = ref([]);
const collectionFormVisible = ref(false);
const deleteMode = ref(false);
const editMode = ref(false);
const openCollectionSave = () =>{
  collectionFormVisible.value = true;
}
//添加收藏信息
const handleCollectionSave = () => {
  AddUserCollection({
    headerImage: userInfo.value.headerImage,
    remark: remark.value,
    speakerName: userInfo.value.speaker,
    speaker: makeActive.value,
    speaker_emotion: speakerEmotion.value,
    volume: slider.value.yl,
    speed: slider.value.ld,
    pitch: slider.value.yd,
    type: slider.value.type,
  }).then((res) => {
    loadinShow.value = false;
    if (res.code == 200) {
      if (res.data && res.data.length > 0) {
        res.data.map((item) => {
          item.zt = zt;
          item.bf = bf;
          item.name = "试听";
        });
        zbData.value = [...zbData.value, ...res.data];
        console.log("=======", zbData.value);
      }
    }
    getCollectionList()
  });
  collectionFormVisible.value = false;
};
//获取收藏列表信息
const getCollectionList = () =>{
  GetUserCollectionList().then(res =>{
    collectionList.value = res.data;
    console.log(res)
  })
}
//重载收藏主播信息
const collectionReload = (collection) =>{
  //查询主播信息
  if(sureZb.value != collection.speakerName){
    getTextToSpeechConfig({
      keyWord: collection.speakerName,
      pageSize: 10,
      pageNum: 1,
    }).then((res) => {
      if (res.code == 200) {
        let data = res.data[0];
        processArray(data.speakerEmotion);
        userInfo.value = data;
        sureZb.value = data.headerImage;
      }
    });
  }
  speakerEmotion.value = collection.speaker_emotion;
  slider.value.ld = collection.speed;
  slider.value.yl = collection.volume;
  slider.value.yd = collection.pitch;
}
//删除收藏主播信息
const deleteCollection = (id) => {

}
//编辑收藏主播信息
const editCollection = () => {
  
}


// ===================
const audioUrl = ref("");
const saveAudioUrl = ref("");


const playDemoUrl = (row, index) => {
  zbData.value = zbData.value.map((item) => {
    return { ...item, name: "试听" };
  });
  zbData.value[index].name = "暂停";
  audioUrl.value = JSON.parse(JSON.stringify(row.demoUrl));

  setTimeout(() => {
    audioPlayerdemoUrl.value.play();
  }, 100);
};
const stopDemoUrl = (row) => {
  zbData.value = zbData.value.map((item) => {
    return { ...item, name: "试听" };
  });
  audioUrl.value = "";
  setTimeout(() => {
    audioPlayerdemoUrl.value.pause();
  }, 100);
};

// 弹窗
const dialogVisible = ref(false);
const gender = ref("男性");
const genderList = ref([
  { name: "全部", value: "" },
  { name: "男性", value: "男性" },
  { name: "女性", value: "女性" },
]);
const ageScope = ref("全部");
const ageScopeList = ref([
  { name: "全部", value: "" },
  { name: "儿童", value: "儿童" },
  { name: "少年、少女", value: "少年、少女" },
  { name: "青年", value: "青年" },
  { name: "壮年", value: "壮年" },
  { name: "中年", value: "中年" },
  { name: "老年", value: "老年" },
]);
const specificLanguage = ref("全部");
const specificLanguageList = [
  { name: "全部", value: "" },
  { name: "普通话", value: "普通话" },
  { name: "台湾腔", value: "台湾腔" },
  { name: "粤语", value: "粤语" },
  { name: "四川话", value: "四川话" },
  { name: "湖南话", value: "湖南话" },
  { name: "浙普", value: "浙普" },
  { name: "东北话", value: "东北话" },
  { name: "北京话", value: "北京话" },
  { name: "天津话", value: "天津话" },
  { name: "港台腔", value: "港台腔" },
  { name: "说唱腔", value: "说唱腔" },
  { name: "河南话", value: "河南话" },
];

const currentPage = ref(1);
const currentPageNum = ref(30);
// 初始化数据的方法
const initializeData = () => {
  const initialData = {
    keyWord: "",
    specificLanguage: "",
    ageScope: "",
    gender: "",
    age: "",
    pageSize: currentPageNum.value,
    pageNum: currentPage.value,
  };
  Object.assign(queryParams, initialData);
};

let queryParams = reactive({
  keyWord: "",
  specificLanguage: "",
  ageScope: "",
  gender: "",
  age: "",
  pageSize: currentPageNum.value,
  pageNum: currentPage.value,
});
const loadData = () => {
  // queryParams.pageNum += 1;
  getZbData();
  //console.log(queryParams);
};

const resetData = () => {
  queryParams.pageNum = 1;
  zbData.value = [];
};
const handleQuery = (type, values) => {
  console.log(type, values);
  queryParams[type] = values;
  switch(type){
    case 'gender':gender.value = values;break;
    case 'specificLanguage':specificLanguage.value = values;break;
    case 'ageScope':queryParams.age=values;ageScope.value = values;break;
  }
  //console.log(queryParams);
  // initializeData();
  resetData();
  getZbData();
};
const zbData = ref([]);
const loadinShow = ref(false);
import zt from "@/assets/image/zt.png";
import bf from "@/assets/image/bf.png";

const getZbData = () => {
  loadinShow.value = true;
  console.log(queryParams);
  getTextToSpeechConfig(queryParams).then((res) => {
    console.log(res.data.data)
    loadinShow.value = false;
    if (res.code == 200) {
      if (res.data.data && res.data.data.length > 0) {
        res.data.data.map((item) => {
          item.zt = zt;
          item.bf = bf;
          item.name = "试听";
        });
        zbData.value = [...zbData.value, ...res.data.data];
        anchorsPageTotal.value = res.data.total
      }
    }
  });
};

// 滑块
const ld = ref([0.5, 2]);
const yl = ref([0.1, 1]);
const yd = ref([-10, 10]);
const slider = ref({
  ld: 1,
  yl: 1,
  yd: 0,
  type: "mp3",
});

// ========================
import stopImage from "@/assets/image/boom-zt.png";
import playImage from "@/assets/image/boom-bf.png";

const makeActive = ref("");
const speakerEmotion = ref("通用")
const handleMood = (speaker, demoUrl,emotion) => {
  console.log(speaker,demoUrl)
  speakerEmotion.value = emotion;
  audioPlayerdemoUrl.value.pause();
  makeActive.value = speaker;
  audioUrl.value = demoUrl;
  setTimeout(() => {
    audioPlayerdemoUrl.value.play();
  }, 100);
};
const isHovering = ref("");
const handleMouseEnter = (speaker) => {
  isHovering.value = speaker;
};

// 情绪素材==========
const userInfo = ref("");
const userInfoData = () => {
  getTextToSpeechConfig({
    keyWord: "满超ZN",
    pageSize: 30,
    pageNum: currentPage.value,
  }).then((res) => {
    console.log(res)
    if (res.code == 200) {
      console.log(res)
      let data = res.data.data[0];
      processArray(data.speakerEmotion);
      userInfo.value = data;
      sureZb.value = data.headerImage;
    }
  });
};
// 处理文字
const processArray = (arr) => {
  return arr.map((item) => {
    const index = item.name.indexOf("|");
    makeActive.value = arr[0].speaker;
    if (index !== -1) {
      item.name = item.name.substr(index + 1);
      item.firstCharacter = item.name.charAt(0);
      item.play = playImage;
      item.stop = stopImage;
    }
    return item;
  });
};

// ============
import {
  textToSpeech
} from "@/api/SoundAIChat";
//文本转语音处理
const textareaValue = ref("");
const generateTextToSpeech = () => {
  textToSpeech({
    text: textareaValue.value,
    speaker: makeActive.value,
    symbol_sil: "",
    audio_type: slider.value.type, //生成文件类型
    volume: slider.value.yl, // 音量,范围0.1->1.0
    speed: slider.value.ld, //语速,范围0.5->2.0
    pitch: slider.value.yd, //语调,范围-10->10
  }).then((res) => {
    if (res.code == 200) {
      saveAudioUrl.value = "/AIweb_materialSys/materialSystem/GetTextToSpeechFile/" + res.data;
    }
    else if(res.code == 403){
        ElMessage.error('请重新登录!')
        return;
    }else{
        ElMessage.error('参数有误!')
    }
  }).catch(err =>{
    ElMessage.error('请重新登录或次数已用完!')
  })
}
const downloadSpeechFile = () =>{
  window.open(saveAudioUrl.value)
}
const generateTime = ref("");
const getGenerateTime = () => {
  GetGenerateTime()
    .then((res) => {
      if (res.code == 200) {
        generateTime.value = res.data.textToSpeech;
      }
    })
    .catch((err) => {
      ElMessage.error('请重新登录或当日次数已使用完!')
      //dialogCustomize({ content: err });
      return;
    });
};

const anchorsPageTotal = ref(0);
const handleCurrentChange = (number) =>{
  currentPage.value = number
  getZbData()
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  font-family: PingFang SC-Regular, PingFang SC;
}

.zb-nav {
  .table-item {
    display: flex;
    .table-item-name {
      font-size: 15px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 700;
      color: #fff;
      width: 40px;
      margin-right: 20px;
      -ms-flex-negative: 0;
      flex-shrink: 0;
    }
    .nav-items {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      color: #fff;
      font-weight: 400;
      margin-right: 9px;
      display: flex;
      flex-wrap: wrap;
      .nav-item {
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        color: #fff;
        font-weight: 400;
        margin-right: 9px;
        cursor: pointer;
        padding: 0 5px;
        margin-bottom: 12px;
      }
      .nav-item.active {
        padding: 0 5px;
        background-color: #ecf5ff;
        color: #000;
        border-radius: 13px;
      }
    }
  }
}
.anchors {
  * {
    box-sizing: border-box;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .el-loading-box {
    position: relative;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-top: 20px;
    height: 500px;
    overflow: auto;
    .el-loading-mask {
      position: absolute;
      z-index: 2000;
      background-color: hsla(0, 0%, 100%, 0.9);
      margin: 0;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      -webkit-transition: opacity 0.3s;
      transition: opacity 1s;
      border-radius: 15px;
    }
  }

  .infinite-list {
    position: relative;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-top: 20px;
    height: 500px;
    overflow: auto;
    -ms-flex-line-pack: start;
    align-content: flex-start;
    margin-left: -20px;

    .anchor-item {
      position: relative;
      width: 190px;
      height: 167px;
      border-radius: 20px;
      background-size: 100%;
      margin-left: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px 1px hsla(0, 0%, 53.3%, 0.15);
      cursor: pointer;
      :deep(.el-icon) {
        position: absolute;
        position: absolute;
        top: 10px;
        right: 10px;
      }

      .list-xz {
        position: absolute;
        top: 9px;
        right: 9px;
        width: 18px;
        height: 18px;
      }

      .item-top {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 115px;
        align-items: center;
        padding: 0 12px;
        background: #caeddd;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;

        .item-image {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          border: 3px solid #fff;
          margin-top: 4px;
          margin-right: 7px;
        }

        .list-nc {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100px;

          p {
            font-size: 16px;
            font-family: PingFang SC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333;
          }
        }

        .list-desc {
          font-size: 11px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #666;
          margin-top: 0;
        }
      }

      .item-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 190px;
        height: 49px;
        padding: 14px 29px;
        color: #000;
        background-color: #fff;
        border-radius: 0px 0px 10px 10px;

        .list-top {
          display: flex;
          flex-direction: row;
          align-items: center;
          color: #000;

          img {
            width: 18px;
            height: 18px;
            margin-right: 5px;
            margin-top: 2px;
            cursor: pointer;
          }
        }
      }
    }
  }
}

.write {
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: rgb(255, 255, 255,0.5);
  border-radius: 10px;

  min-height: calc(100vh - 3.125rem);
  color: grey;
  padding: 2rem;
  
  .t-r-btn {
    display: flex;
    margin-bottom: 1.2rem;
    align-items: center;
    justify-content: space-between;
    .r-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      audio {
        margin-right: 3rem;
      }
      .el-button {
        border-radius: 0.625rem;
        width: 6.25rem;
      }
    }
  }

  .make-txt {
    padding: 1rem;
    background: #212121;
    border-radius: 1.2rem;
    border: 0.0625rem solid white;
    font-size: 0.875rem;
    .l-b-m {
      margin-top: 1rem;
      :deep(.el-textarea__inner) {
        height: 40rem !important;
        background: transparent;
        border: none;
        outline: none;
        box-shadow: none;
        color: white;
        background-color: #212121;
      }
      :deep(.el-input__count){
        color: white;
        background-color: #212121;
      }

      // border: 1px solid red;
      //  :deep(.el-textarea__inner) {
      //       height: 6vh !important;
      //     }
    }
    .l-t-nav {
      padding-bottom: 20px;
      border-bottom: 1px solid #eaeaea;
      overflow-x: auto;
      overflow-y: hidden;
      .make-fun {
        display: flex;
        align-items: center;
        .make-fun-item {
          background: #fff;
          padding: 0.41rem 0.47rem;
          margin-right: 0.3rem;
          border-radius: 0.3rem;
          color: #000;
          font-size: 0.875rem;
          cursor: pointer;
          .make-fun-cont {
            display: flex;
            align-items: center;
            span {
              padding-left: 0.15rem;
            }
          }
        }
      }
    }
  }

  .content {
    * {
      box-sizing: border-box;
    }
    .c-user {
      .parameter-top {
        display: flex;
        .parameter {
          padding: 1.25rem;
          border-right: 1px solid #eaeaea;
        }
        .make-moods {
          padding: 1.25rem;
          width: 45%;
          .title {
            font-size: 1.25rem;
            font-weight: 600;
            padding-bottom: 1.25rem;
            color: black;
            // line-height: 2.5rem;
          }
          .moods {
            display: flex;
            flex-wrap: wrap;
            .mood-item {
              display: flex;
              align-content: center;
              justify-content: center;
              width: 3.25rem;
              height: 3.75rem;
              border-radius: 0.5rem;
              text-align: center;
              flex-wrap: wrap;
              cursor: pointer;
              .name {
                width: 100%;
                font-size: 0.875 !important;
                text-align: center;
                font-family: PingFang SC-Regular, PingFang SC;
                color: #999;
                overflow: hidden;
                margin: 0;
                padding-top: 0.1rem;
              }

              .mood-item-image {
                width: 100%;
                margin: 0 auto;
                margin-bottom: 0.2rem;
                position: relative;
                width: 1.75rem;
                height: 1.75rem;
                line-height: 1.75rem;
                text-align: center;
                height: 1.75rem;
                color: #fff;
                border-radius: 50%;
                background: #409eff;
                font-size: 1rem;
                img {
                  position: absolute;
                  top: -3px;
                  left: -3px;
                  width: 34px;
                  height: 34px;
                  z-index: 99;
                  cursor: pointer;
                  opacity: 0.6;
                }
              }
            }
            .make-active {
              background-color: #f5f5f5;
            }
          }
        }
        .parameter-left {
          line-height: 3rem;
          width: 20%;
          text-align: center;
          .parameter-head {
            width: 6.6rem;
            height: 6.6rem;
            padding: 0.5rem;
            margin: 0 auto;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .el-button {
            width: 6.25rem;
            border-radius: 0.625rem;
          }

          // .parameter-head img {
          //   width: 6.6rem;
          //   height: 6.6rem;
          //   border-radius: 50%;
          // }
        }
        .parameter-right {
          width: 35%;
          .type-v {
            .title {
              line-height: 3rem;
              //color: #000;
              color: white;
              font-family: Helvetica Neue, Helvetica, PingFang SC,
                Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
            }
            .slider-box {
              display: flex;
              align-items: center;
              justify-content: space-between;
              .el-slider {
                padding-right: 1rem;
                --el-slider-main-bg-color: var(--el-color-primary);
                --el-slider-runway-bg-color: var(--el-border-color-light);
                --el-slider-stop-bg-color: var(--el-color-white);
                --el-slider-disabled-color: var(--el-text-color-placeholder);
                --el-slider-border-radius: 5px;
                --el-slider-height: 3px;
                --el-slider-button-size: 15px;
                --el-slider-button-wrapper-size: 36px;
                --el-slider-button-wrapper-offset: -17px;
              }
              .el-input-number--small {
                width: 6.5rem;
              }
            }
          }
        }
      }
    }
    .make-cle {
      padding-left: 47px;
      padding-top: 20px;
      color: #333;
      .title {
        border-bottom: 1px solid #ccc;
        display: flex;
        padding: 20px 0;
        justify-content: space-between;
        .el-input__wrapper {
          border: none !important;
          background: #f5f5f5 !important;
          border-radius: 20px !important;
          margin-left: 10px !important;
        }
        .search {
          font-size: 20px;
          font-weight: 600;
        }
      }
      .edit-delete {
        color: rgb(64, 158, 255);
        display: flex;
        width: 100px;
        justify-content: space-between;
      }
    }
  }
}

.collectionList{
  width: 70px;
  height: 80px;
  float: left;
  margin-top: 20px;
  margin-right: 10px ;
  text-align: center;
}

.cle-title{
  color: white;
}

.remark{
  color: #fff;
}

/*-------------new style-------------*/
.pagination{
  margin-top: 20px;
  margin-left: 50px;
}

</style>