<template>
  <!-- 其它提示 -->
  <el-dialog
    center
    v-model="dialogVisible"
    :title="PopUpPrompt.title"
    width="30%"
  >
    <span class="PopUpPrompt">{{ PopUpPrompt.content }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogSubmit(PopUpPrompt)">
          {{ PopUpPrompt.button }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 其它提示 -->
  <div class="write">
    <div class="copywriter">
      <div class="ai-menu">
        <div
          :class="
            textType == item.name
              ? 'menu-list is-menu-list-active'
              : 'menu-list'
          "
          @click="changeTextType(item.name)"
          v-for="(item, index) in tabbar"
          :key="index"
        >
          <div :class="textType == item.name ? 'is-active' : ''">
            <img v-if="item.name == textType" src="@/assets/ai-icon-active.png" alt="">
            <img v-else src="@/assets/ai-icon.png" alt="">{{ item.name }}
           <!-- <img :src="textType == item.name ? '@/assets/ai-icon-active.png' : '@/assets/ai-icon.png'" alt=""> {{ item.name }} -->
          </div>
        </div>
      </div>
      <div class="ai-create" v-if="textType == '字幕转化'">
        <div class="ai-top">
          <div class="message-count">
            <div class="ai-message">Ai自动转化文案为字幕版</div>
            <div class="ai-count">（应用于剪映后期）</div>
            <div>今日剩余文本处理{{ generateTime }}次</div>
          </div>
          <div class="ai-button">
            <el-button type="primary" :loading="loading" @click="toModify">
              生成
            </el-button>
            <el-button type="primary" @click="clearAll"> 重置 </el-button>
          </div>
        </div>
        <div class="ai-content">
          <el-row>
            <el-col :span="12">
              <div class="ai-left" style="">
                <div class="ai-text">
                  <el-input
                    v-model="textarea1"
                    autosize
                    maxlength="60000"
                    show-word-limit
                    placeholder="请输入文案"
                    type="textarea"
                  />
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="ai-right" style="">
                <!---->
                <div class="ai-bottom" style="">
                  <div class="ai-result ai-adapt">
                    <!-- <div class="ai-adapt-new-msg"></div> -->
                    <div class="ai-adapt-new-text">
                      <div class="textarea2" v-if="!loading && textarea2">
                        <pre>{{ textarea2 }}</pre>
                      </div>
                      <div class="copy-btn" v-if="!loading && textarea2">
                        <el-icon @click="copyToClipboard(textarea2)"
                          ><CopyDocument
                        /></el-icon>
                      </div>
                      <div class="no-textarea2" v-if="loading">
                        <el-button
                          type=""
                          :loading="true"
                          size="large"
                          :icon="Loading"
                          plain
                        >
                        </el-button>
                        <div>
                          Ai正在加速生成中，预计120秒内生成出结果，请稍等
                          (已等待{{ milliseconds }}s)
                        </div>
                      </div>
                      <!-- <el-input
                        v-model="textarea1"
                        autosize
                        maxlength="60000"
                        show-word-limit
                        placeholder="请输入文案"
                        type="textarea"
                      /> -->
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="ai-create" v-else-if="textType == 'Ai神标题'">
        <div class="ai-top">
          <div class="message-count">
            <div class="ai-message">Ai自动生成文案的长短标题</div>
            <div class="ai-count">如Ai生成结果不满意，请重新生成试试</div>
          </div>
          <div class="ai-button">
            <el-button type="primary" :loading="loading" @click="toModify">
              生成
            </el-button>
            <el-button type="primary" @click="clearAll"> 重置 </el-button>
          </div>
        </div>
        <div class="ai-content">
          <el-row>
            <el-col :span="12">
              <div class="ai-left" style="">
                <div class="ai-text">
                  <el-input
                    v-model="textarea1"
                    autosize
                    maxlength="60000"
                    show-word-limit
                    placeholder="请输入文案"
                    type="textarea"
                  />
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="ai-right" style="">
                <!---->
                <div class="ai-bottom" style="">
                  <div class="ai-result ai-adapt">
                    <div class="ai-adapt-new-text ai-adapt-new-text2">
                      <div>
                        <div
                          class="list"
                          v-for="(item, index) in textarea2Arr"
                          :key="index"
                        >
                          <div class="title">{{ item.name }}</div>
                          <div class="list-m">
                            <div class="list-m-info">
                              <div>{{ item.text }}</div>
                            </div>
                            <el-icon @click="copyToClipboard(item.text)"
                              ><CopyDocument
                            /></el-icon>
                          </div>
                        </div>
                      </div>

                      <div class="no-textarea2" v-if="loading">
                        <div class="tips">
                          <el-button
                            type=""
                            :loading="true"
                            size="large"
                            :icon="Loading"
                            plain
                          >
                          </el-button>
                          <div>
                            Ai正在加速生成中，预计120秒内生成出结果，请稍等
                            (已等待{{ milliseconds }}s)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="ai-create" v-else-if="textType == 'Ai神开头'">
        <div class="ai-top">
          <div class="message-count">
            <div class="ai-message">Ai自动生成文案的爆点开头</div>
            <div class="ai-count">如Ai生成结果不满意，请重新生成试试</div>
          </div>
          <div class="ai-button">
            <el-button type="primary" :loading="loading" @click="toModify">
              生成
            </el-button>
            <el-button type="primary" @click="clearAll"> 重置 </el-button>
          </div>
        </div>
        <div class="ai-content">
          <el-row>
            <el-col :span="12">
              <div class="ai-left" style="">
                <div class="ai-text">
                  <el-input
                    v-model="textarea1"
                    autosize
                    maxlength="60000"
                    show-word-limit
                    placeholder="请输入文案"
                    type="textarea"
                  />
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="ai-right" style="">
                <!---->
                <div class="ai-bottom" style="">
                  <div class="ai-result ai-adapt">
                    <div class="ai-adapt-new-text ai-adapt-new-text2">
                      <div>
                        <div
                          class="list"
                          v-for="(item, index) in textarea3Arr"
                          :key="index"
                        >
                          <div class="title">{{ item.name }}</div>
                          <div class="list-m">
                            <div class="list-m-info">
                              <pre>{{ item.text }}</pre>
                            </div>
                            <el-icon @click="copyToClipboard(item.text)"
                              ><CopyDocument
                            /></el-icon>
                          </div>
                        </div>
                      </div>

                      <div class="no-textarea2" v-if="loading">
                        <div class="tips">
                          <el-button
                            type=""
                            :loading="true"
                            size="large"
                            :icon="Loading"
                            plain
                          >
                          </el-button>
                          <div>
                            Ai正在加速生成中，预计120秒内生成出结果，请稍等
                            (已等待{{ milliseconds }}s)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="ai-create" v-else-if="textType == 'Ai神改编'">
        <div class="ai-top">
          <div class="message-count">
            <div class="ai-message">Ai自动生成改编文案</div>
            <div class="ai-count">如Ai生成结果不满意，请重新生成试试</div>
          </div>
          <div class="ai-button">
            <el-button type="primary" :loading="loading" @click="toModify">
              生成
            </el-button>
            <el-button type="primary" @click="clearAll"> 重置 </el-button>
          </div>
        </div>
        <div class="ai-content">
          <el-row>
            <el-col :span="12">
              <div class="ai-left" style="">
                <div class="ai-text">
                  <el-input
                    v-model="textarea1"
                    autosize
                    maxlength="60000"
                    show-word-limit
                    placeholder="请输入文案"
                    type="textarea"
                  />
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="ai-right" style="">
                <!---->
                <div class="ai-bottom" style="">
                  <div class="ai-result ai-adapt">
                    <!-- <div class="ai-adapt-new-msg"></div> -->
                    <div class="ai-adapt-new-text">
                      <div class="textarea2" v-if="!loading && textarea2">
                        <pre>{{ textarea2 }}</pre>
                      </div>
                      <div class="copy-btn" v-if="!loading && textarea2">
                        <el-icon @click="copyToClipboard(textarea2)"
                          ><CopyDocument
                        /></el-icon>
                      </div>
                      <div class="no-textarea2" v-if="loading">
                        <el-button
                          type=""
                          :loading="true"
                          size="large"
                          :icon="Loading"
                          plain
                        >
                        </el-button>
                        <div>
                          Ai正在加速生成中，预计120秒内生成出结果，请稍等
                          (已等待{{ milliseconds }}s)
                        </div>
                      </div>
                      <!-- <el-input
                        v-model="textarea1"
                        autosize
                        maxlength="60000"
                        show-word-limit
                        placeholder="请输入文案"
                        type="textarea"
                      /> -->
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import UploadInstance from "element-plus";
import { TextGenerate } from "@/api/Allrequest";
// 页面渲染
onMounted(() => {
  getGenerateTime()
});

const uploadRef = ref(UploadInstance);
// 超出文件限制
const OutOfLimit = (e) => {
  dialogCustomize({ content: "一次只能上传一个文件" });
  return;
};
// 文件个数
const fileNum = ref(0);
// 文件上传次数检测
const FileUp = (e) => {
  // console.log(e);
  fileNum.value++;
  // console.log(fileNum.value);
};
// 移出文件
const removeFile = (e) => {
  fileNum.value--;
  // console.log(fileNum.value);
};

const aiIcon = '@/assets/ai-icon.png'
const aiIconActive = '@/assets/ai-icon-active.png'

// 清空文本

const clearAll = () => {
  if (fileNum.value != 0) {
    uploadRef.value.clearFiles();
  }
  question.value = "";
  textarea1.value = "";
  textarea2.value = "";
  loading.value = false;
  stopTimer();
  fileNum.value = 0;

  textarea2Arr.value = [
    { name: "短标题1", text: "" },
    { name: "短标题2", text: "" },
    { name: "短标题3", text: "" },
    { name: "长标题1", text: "" },
    { name: "长标题2", text: "" },
    { name: "长标题3", text: "" },
  ];
  textarea3Arr.value = [
    { name: "神开头1", text: "" },
    { name: "神开头2", text: "" },
    { name: "神开头3", text: "" },
    { name: "神开头4", text: "" },
    { name: "神开头5", text: "" },
    // { name: "神开头6", text: "" },
  ];
};

// 左侧导航切换
const textType = ref("字幕转化");
const tabbar = ref([
  { name: "字幕转化", id: 1 },
  { name: "Ai神标题", id: 2 },
  { name: "Ai神开头", id: 3 },
  { name: "Ai神改编", id: 4 },
]);
const changeTextType = (name) => {
  textType.value = name;
  clearAll();
};

const copyToClipboard = (text) => {
  if (text == null || text == "" || text.length == 0) {
    ElMessage({
      message: "暂无内容",
      type: "warning",
    });
    return;
  }
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // alert("已成功复制到剪切板！");
      ElMessage({
        message: "已成功复制到剪切板！",
        type: "success",
      });
    })
    .catch((error) => {
      ElMessage({
        message: "复制到剪切板失败",
        type: "error",
      });
    });
};

// 是否输入了文字
const isInputText = ref(false);

// 输入框  风格
const chooseStyle = ref("");
// 弹出框提示
const PopUpPrompt = reactive({
  title: "",
  content: "",
  button: "",
});

// 是否显示弹出框
const dialogVisible = ref(false);

// 弹出框消息自定义
const dialogCustomize = (data) => {
  if (
    PopUpPrompt.content != "" ||
    PopUpPrompt.content != null ||
    PopUpPrompt.title != null ||
    PopUpPrompt.title != "" ||
    PopUpPrompt.title != null
  ) {
    PopUpPrompt.content = data.content;
    PopUpPrompt.title = data.title;
    PopUpPrompt.button = data.button;
  } else {
    PopUpPrompt.content = "";
    PopUpPrompt.title = "";
  }
  if (!data.button) {
    PopUpPrompt.button = "OK";
  }
  dialogVisible.value = true;
};

// 弹出框按钮下一步操纵
const dialogSubmit = (e) => {
  dialogVisible.value = false;
};

// 文本内容1
const textarea1 = ref("");
//提示词
const question = ref("");
// 文本内容2
const textarea2 = ref("");

const textarea2Arr = ref([
 { name: "短标题1", text: "" },
    { name: "短标题2", text: "" },
    { name: "短标题3", text: "" },
    { name: "长标题1", text: "" },
    { name: "长标题2", text: "" },
    { name: "长标题3", text: "" },
]);
const textarea3Arr = ref([
  { name: "神开头1", text: "" },
  { name: "神开头2", text: "" },
  { name: "神开头3", text: "" },
  { name: "神开头4", text: "" },
  { name: "神开头5", text: "" },
  // { name: "神开头6", text: "" },
]);
// 是否加载中
const loading = ref(false);
const chooseStyleFun = (e) => {
  chooseStyle.value = e;
};
const fileUploadSuccess = (res) => {
  // console.log("文件上传成功", res);
};
const toModify = () => {
  //    if(textarea1.value.length<100){
  //    dialogCustomize({ content: "文案不能少于100字!" });
  //    return
  // }
  textarea2Arr.value = [
    { name: "短标题1", text: "" },
    { name: "短标题2", text: "" },
    { name: "短标题3", text: "" },
    { name: "长标题1", text: "" },
    { name: "长标题2", text: "" },
    { name: "长标题3", text: "" },
  ];
  textarea3Arr.value = [
    { name: "神开头1", text: "" },
    { name: "神开头2", text: "" },
    { name: "神开头3", text: "" },
    { name: "神开头4", text: "" },
    { name: "神开头5", text: "" },
    // { name: "神开头6", text: "" },
  ];
  loading.value = false;
  textarea2.value = "";
  // 检测内容是否为空 或者文件为空
  if (textarea1.value == "") {
    // dialogCustomize({ content: "文案不能为空!" });
    ElMessage({
      message: "文案不能为空",
      type: "warning",
    });
    return;
  } else {
    loading.value = true;
    upload();
  }
  // else if (question.value == 0) {
  //   dialogCustomize({ content: "提示词不能为空" });
  //   return;
  // }
};
const milliseconds = ref(0);
let timer;
const startTimer = () => {
  timer = setInterval(() => {
    milliseconds.value += 1;
  }, 1000);
};

const stopTimer = () => {
  milliseconds.value = 0;
  clearInterval(timer);
};

const upload = (item) => {
  let formData = new FormData();

  //formData.append("file", item.file);
  startTimer();
  ElMessage({
    message: "AI生成预计需要等待5到120秒，请耐心等待",
    type: "warning",
  });
  formData.append("textType", textType.value);
  // formData.append("question", question.value);
  formData.append("content", textarea1.value);
  TextGenerate(formData)
    .then((res) => {
      stopTimer();
      if(res.code == 403){
        ElMessage.error('请重新登录!');
        return;
      }
      if (res.data.content != "") {
        if (textType.value == "Ai神标题") {
          // textarea2Arr.value = res.data;
          // res.data.map()
          // if (textarea2Arr.value.length === res.data.length) {
          //     textarea2Arr.value.forEach((item, index) => {
          //       item.text = res.data[index];
          //     });
          //   }
          const minLength = Math.min(textarea2Arr.value.length, res.data.length);
          for (let i = 0; i < minLength; i++) {
            textarea2Arr.value[i].text = res.data[i];
          }

          // 删除多余的元素
          if (textarea2Arr.value.length > res.data.length) {
            const deleteCount = textarea2Arr.value.length - res.data.length;
            textarea2Arr.value.splice(-deleteCount);
          }
        } else if (textType.value == "Ai神开头") {
          // if (textarea3Arr.value.length === res.data.length) {
          //   textarea3Arr.value.forEach((item, index) => {
          //     item.text = res.data[index];
          //   });
          // }
          const minLength = Math.min(textarea3Arr.value.length, res.data.length);
          for (let i = 0; i < minLength; i++) {
            textarea3Arr.value[i].text = res.data[i];
          }

          // 删除多余的元素
          if (textarea3Arr.value.length > res.data.length) {
            const deleteCount = textarea3Arr.value.length - res.data.length;
            textarea3Arr.value.splice(-deleteCount);
          }
        } else {
          textarea2.value = res.data;
        }

        loading.value = false;
      }
    })
    .catch((err) => {
      ElMessage.error('请重新登录或次数已用完!')
      dialogCustomize({ content: err });
      return;
    });
};

import { GetGenerateTime } from '@/api/Allrequest';
const generateTime = ref("");
const getGenerateTime = () => {
  GetGenerateTime()
    .then((res) => {
      if (res.code == 200) {
        generateTime.value = res.data.textToText;
      }
    })
    .catch((err) => {
      dialogCustomize({ content: err });
      return;
    });
};
</script>

<style lang="scss" scoped>
// 提示框
.PopUpPrompt {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
// 下拉框样式
:deep(.el-dropdown-menu__item):hover {
  background-color: #006494;
  color: white;
}
:deep(.el-dropdown-menu__item) {
  width: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 弹出框样式
// :deep(.el-button) {
//   background-color: #006494;
//   color: white;
//   border: none;
// }

// 拖拽框样式
:deep(.el-upload-dragger) {
  border: none !important;
  margin: 0 0.3125rem;
}

.write {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center; 
  background-color: rgb(255, 255, 255,0.5);
  border-radius: 10px;
  margin-top: 10px;
  //margin-left: 20px;
  margin-right: 20px;
  
  .content {
    padding: 0 4.375rem 2.5rem 4.375rem;
    box-sizing: border-box;
    width: 100%;
    // flex: 1;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    align-items: center;
    .c1 {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
      padding: 1.25rem 0;
      max-width: 87.5rem;
      .c1_title {
        font-size: 1.75rem;
      }
      .c1_title1 {
        font-size: 1.125rem;
      }
    }
    .c2 {
      //   box-sizing: border-box;
      width: 100%;
      min-height: 6.25rem;
      border-radius: 0.625rem;
      box-shadow: #ccc 0rem 0rem 0.3125rem;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      max-width: 87.5rem;
      .c2_title {
        width: 100%;
        min-height: 3.4375rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 0.0625rem solid #dae1e8;
        box-sizing: border-box;
        padding: 0.5rem 1.25rem;
        .clearAll {
          cursor: pointer;
        }
        .el-dropdown-link {
          display: flex;
          align-items: center;
          font-size: 1rem;
          cursor: pointer;
          img {
            width: 1.25rem;
            height: 1.25rem;
            margin-left: 0.625rem;
          }
        }
        .c2_input {
          outline: none;
          padding: 0.625rem;
          font-size: 0.875rem;
          border-radius: 0.3125rem;
          border: 0.0625rem solid #ccc;
          margin: 0 0.625rem;
          max-width: 12.5rem;
          min-width: 6.25rem;
        }
        .c2_input:focus {
          border: 0.0625rem solid #006494;
        }
        .el-input {
          max-width: 15.625rem !important;
          margin-left: 0.625rem;
          min-height: 0rem !important;
        }
        .c2_change {
          width: 1.5rem;
          height: 1.5rem;
          margin-left: 1.25rem;
          cursor: pointer;
        }
        .prompt {
          font-size: 1rem;
          display: flex;
          align-items: center;
          img {
            width: 1.875rem;
            height: 1.875rem;
            margin-left: 0.625rem;
          }
        }
        .c2_change:hover {
          animation: rotation 0.5s ease;
        }

        @keyframes rotation {
          /*以百分比来规定改变发生的时间 也可以通过"from"和"to",等价于0% 和 100%*/
          0% {
            /*rotate(2D旋转) scale(放大或者缩小) translate(移动) skew(翻转)*/
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(180deg);
          }
        }
      }
      .c2_content {
        width: 100%;
        display: flex;
        box-sizing: border-box;
        min-height: 31.25rem;
        //height: 31.25rem;
        .c2_content_textarea {
          flex: 1;
          max-height: 31.25rem;
          //height: 100%;
          position: relative;
          textarea {
            padding: 1.875rem;
            font-size: 1.625rem;
            border: 0.0625rem solid rgba($color: #ccc, $alpha: 0);
            flex: 1;
            outline: none;
            resize: none;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
          }
          .upload-demo {
            width: 100%;
            border: none;
            position: absolute;
            bottom: 0;
            left: 0;
          }

          .NumberOfWords {
            font-size: 0.75rem;
            color: #ccc;
            position: absolute;
            right: 0.625rem;
            bottom: 0.625rem;
            z-index: 99;

            span {
              color: #006494;
              font-size: 0.875rem;
            }
          }
          textarea:focus {
            border: 0.0625rem solid #006494;
          }
          .loginSvg {
            margin-top: 1.25rem;
            margin-left: 1.25rem;
          }
          .t1 {
            border-radius: 0 0 0 0.625rem;
          }
          .t2 {
            border-radius: 0 0 0.625rem 0;
          }
        }

        .line {
          border-right: 0.0625rem solid #ccc;
        }
        .ScrollBar::-webkit-scrollbar {
          width: 0.375rem;
          height: 0.375rem;
        }
        .ScrollBar::-webkit-scrollbar-thumb {
          border-radius: 0.1875rem;
          -moz-border-radius: 0.1875rem;
          -webkit-border-radius: 0.1875rem;
          background-color: #c3c3c3;
        }
        .ScrollBar::-webkit-scrollbar-track {
          background-color: transparent;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 13.5625rem;
    flex-wrap: wrap;
    .bottom_center {
      display: flex;
      box-sizing: border-box;
      padding: 1.25rem;
      justify-content: space-around;
      // max-width: 100rem;
      .b1 {
        img {
          width: 14.0625rem;
          height: 13.5625rem;
        }
      }
      .b2 {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-around;
        box-sizing: border-box;
        max-width: 51.25rem;
        margin-left: 3.125rem;
        .b2_title {
          font-size: 1.5rem;
        }
        .b2_content {
          display: flex;
          flex-wrap: wrap;
          max-width: 56.25rem;
          justify-content: flex-start;
          div {
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            margin-bottom: 0.9375rem;
            margin-right: 0.9375rem;
            img {
              width: 1.375rem;
              height: 1.625rem;
              margin-top: -0.1875rem;
              margin-right: 0.3125rem;
            }
          }
        }
      }
    }
  }
}

.copywriter {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding: 1.5rem;
  width: 100%; 
  overflow: hidden;
  overflow-x: auto;
  .ai-menu {
    border-right: 1px solid #e6e6e6;
    width: 200px;
    .menu-list {
      width: 100%;
      color: #303133;
      padding: 0 20px;
      height: 3.5rem;
      line-height: 3.5rem;
      text-align: left;
      cursor: pointer;
      box-sizing: border-box;
      // transition: 0.5s;
      img{
        width: 1rem;
        margin-right: .5rem;
      }
      .is-active {
        color: #d1e344;
      }
    }
    .is-menu-list-active {
      background: rgba(64, 158, 255, 0.1);
    }
    .menu-list:hover {
      background: rgba(64, 158, 255, 0.1);
    }
  }
  .ai-create {
    width: 80%;
    // width: 72rem;

    .ai-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1.25rem;
      box-sizing: border-box;
      // width: 70rem;
      width: 97%;
      // padding: 0 4.375rem 0 4.375rem;
      margin-bottom: 0;

      .message-count {
        display: flex;
        align-items: flex-end;

        .ai-message {
          font-size: 1.25rem;
          font-weight: 500;
          
        }

        .ai-count {
          margin-left: 0.6rem;
          color: grey;
          font-size: 0.87rem;
        }
      }
    }

    .ai-content {
      // padding: 0 4.375rem 2.5rem 4.375rem;
      margin: 0.6 1.5rem;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      justify-content: space-between;
      //  min-height: 31.25rem;
      //  min-height: calc(100vh - 18rem);
      // min-height: 31.25rem;

      .el-row {
        width: 100%;
      }

      .ai-left {
        border-radius: 0.5rem;
        margin: 1.25rem;

        .el-textarea textarea {
          line-height: 1.5rem;
          
        }

        .ai-text {
          position: relative;
          :deep(.el-textarea__inner) {
            height: 67rem !important;
            color: #212121;
            
            background-color: #fff;
          }
          :deep(.el-input__count){
            color: #212121;
            background-color: #fff;
          }
          

          // .el-textarea {
          //   position: relative;
          //   display: inline-block;
          //   width: 100%;
          //   vertical-align: bottom;
          //   font-size: 0.87rem;
          // }

          .ai-text-count {
            color: #909399;
            background: #fff;
            position: absolute;
            font-size: 0.75rem;
            bottom: 0.3rem;
            right: 0.6rem;
          }
        }
      }

      .ai-right {
        margin-top: 1.25rem;

        .ai-bottom {
          .ai-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 1.25rem 0 0.3rem;

            p {
              font-weight: 500;
            }
          }

          .ai-result {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 1.25rem 0.3rem 0;
            font-size: 10.3rem;
            line-height: 1.25rem;
          }

          .ai-result-bg {
            border-radius: 0.5rem;
            padding: 0.6rem;
            background: #f5f6f7;
          }

          .ai-msg {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #4a4a4a;
            margin: 0 1.25rem 0.3rem 0;
            border-radius: 0.5rem;
            padding: 0.3rem 0.6rem;
            font-size: 13px;
          }

          .ai-adapt {
            height: 67rem;

            display: flex;
            align-items: flex-start;
            flex-direction: column;
            justify-content: flex-start;

            .ai-adapt-new-msg {
              white-space: pre-line;
              word-break: break-all;
              overflow: hidden;
              height: 15rem;
              width: 100%;
              border-radius: 0.5rem;
              background: #f5f6f7;
              padding: 0.6rem;
              overflow-y: auto;
              margin-bottom: 1.25rem;
            }

            .ai-adapt-new-text {
              position: relative;
              white-space: pre-line;
              word-break: break-all;
              overflow: hidden;
              height: 100%;
              width: 100%;
              height: 67rem;
              border: 0.0625rem solid black;
              border-radius: 0.5rem;
              background: #fff;
              padding: 0.6rem;
              overflow-y: auto;
              padding-top: 1rem;
              font-size: 1rem;
              .no-textarea2 {
                text-align: center;
                color: #d1e344;
                font-size: 0.9rem;
                position: absolute;
                top: 29%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                :deep(.el-button, .is-loading:before) {
                  background: #f5f6f7;
                  font-size: 1.5rem;
                  font-size: 1.5rem !important;
                  background: transparent;
                  border: none;
                  color: #d1e344;
                }
                :deep(.is-loading:before) {
                  background: transparent;
                }
              }

              .copy-btn {
                position: absolute;
                cursor: pointer;
                right: 0.6rem;
                top: 0.6rem;
                font-size: 1rem;
              }
            }
            .ai-adapt-new-text2 {
              background: transparent;
              box-sizing: border-box;
              position: relative;
              padding: 0;
              .no-textarea2 {
                height: 100%;
                width: 100%;
                //background: rgba(255, 255, 255, 0.8);
                background: rgba(0, 0, 0, 0.062);
                .tips {
                  text-align: center;
                  color: #d1e344;
                  font-size: 0.9rem;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 100%;
                }
              }
              .list {
                height: auto;
                .title {
                  font-weight: 500;
                  font-size: 1rem;
                  margin: 0 1.25rem 0 0.3rem;
                  padding: 1rem 0;
                }
                .list-m {
                  //background: #212121;
                  border: 0.0625rem solid black;
                  border-radius: 0.2rem;
                  margin: 0 1.25rem 0 0.3rem;
                  margin-right: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: space-around;
                  padding: 0.7rem;
                  .list-m-info {
                    font-size: 0.9rem;
                    width: calc(100% - 1rem);
                  }
                }
              }
            }
          }
        }
      }

      .ai-alert {
        position: absolute;
        padding-right: 1.25rem;
        width: 50%;

        border: 1px solid red;

        div {
          border-radius: 0.5rem;
          background: hsla(0, 0%, 100%, 0.8509803921568627);
          width: 100%;
          height: 100%;
          display: flex;
        }
      }
    }
  }

  pre {
    white-space: pre-wrap; /* css-3 */
    word-wrap: break-word; /* InternetExplorer5.5+ */
    white-space: -moz-pre-wrap; /* Mozilla,since1999 */
    white-space: -pre-wrap; /* Opera4-6 */
    white-space: -o-pre-wrap; /* Opera7 */
  }
}

div{
  color: black;
}

</style>