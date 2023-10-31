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
    <div class="top">
      
    </div>
    <div class="content">
      <div class="c1">
        <div class="c1_title">一键将您的写作进行精简优化</div>
        <div class="c1_title1">智能、完美、从容地精简</div>
      </div>
      <div class="c2">
        
        <div class="c2_title">
          <div class="prompt">
            点击这里进行文本生成
            <img src="@/assets/there.svg" alt="" />
            <img
              src="@/assets/change.png"
              alt=""
              class="c2_change"
              @click="toModify"
            />
          </div>
          <div class="clearAll" @click="clearAll">清空文本</div>
        </div>
        <div class="c2_content">
          <div class="c2_content_textarea line">
            <input type="text" style="width:93.859%;height:30px;padding: 2px 20px ;font-size:15px" placeholder="请输入提示词,示例:请将以下文章内容精简" v-model="question">
            <!-- <p v-if="!textarea1">请输入或粘贴文本查看修改后的文案</p> -->
            <textarea
              class="t1 ScrollBar"
              style="max-height:92.5%"
              name=""
              id=""
              cols="30"
              rows="32"
              placeholder="请输入要处理的文本内容"
              v-model="textarea1"
            ></textarea>
            <div class="NumberOfWords">
              <span>{{ textarea1.length }}</span> 字
            </div>

            <!-- <el-upload
              ref="uploadRef"
              class="upload-demo"
              drag
              action=""
              :http-request="upload"
              :auto-upload="false"
              :limit="1"
              :on-exceed="OutOfLimit"
              :on-change="FileUp"
              :multiple="false"
              :on-remove="removeFile"
              :on-success="fileUploadSuccess"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖入文本或者<em>点击这里上传文本</em>(一次只能上传一个文件,支持txt,word)
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  
                </div>
              </template>
            </el-upload> -->
          </div>

          <div class="c2_content_textarea">
            <img
              src="@/assets/Hourglass.gif"
              alt=""
              class="loginSvg"
              v-if="loading"
            />
            <textarea
              v-if="!loading"
              class="t2 ScrollBar"
              name=""
              id=""
              cols="30"
              rows="30"
              v-model="textarea2"
            ></textarea>
            <div class="NumberOfWords">
              <span>{{ textarea2.length }}</span> 字
            </div>
          </div>

          <!-- <el-input
            v-model="input"
            placeholder=""
            type="textarea"
            class="c2_content_t2"
            :rows="24"
            resize="none"
          /> -->
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import UploadInstance from "element-plus";
import { uploadFile, LongTextDigest } from "@/api/Allrequest";
// 页面渲染
onMounted(() => {});

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
// 清空文本

const clearAll = () => {
  if (fileNum.value != 0) {
    uploadRef.value.clearFiles();
  }
  question.value = "";
  textarea1.value = "";
  textarea2.value = "";
  fileNum.value = 0;
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
// 是否加载中
const loading = ref(false);
const chooseStyleFun = (e) => {
  chooseStyle.value = e;
};
const fileUploadSuccess = (res) => {
  // console.log("文件上传成功", res);
};
const toModify = () => {
  // 检测内容是否为空 或者文件为空
  if (textarea1.value == "") {
    dialogCustomize({ content: "文案不能为空!" });
    return;
  } else if (question.value == 0) {
    dialogCustomize({ content: "提示词不能为空" });
    return;
  } else {
    loading.value = true;
    upload()
  }
};
const upload = (item) => {
  let formData = new FormData();
  
  //formData.append("file", item.file);
  
  formData.append("type", "SKU");
  formData.append("question", question.value);
  formData.append("content",textarea1.value)
  LongTextDigest(formData)
    .then((res) => {
      if (res.data.content != "") {
        textarea2.value = res.data.content;
        loading.value = false;
      }
    })
    .catch((err) => {
      // console.log("报错", err);
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
:deep(.el-button) {
  background-color: #006494;
  color: white;
  border: none;
}

// 拖拽框样式
:deep(.el-upload-dragger) {
  border: none !important;
  margin: 0 0.3125rem;
}

.write {
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  .top {
    width: 100%;
    height: 3.75rem;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    max-width: 87.5rem;
    padding: 0.3125rem 0.625rem;
    .logo {
      display: flex;
      .logo_fix {
        position: relative;
        width: 5.625rem;
        height: 100%;
        border: 0.0625rem solid #037171;
        border-radius: 0.3125rem;
      }
      .title {
        display: flex;
        align-items: center;
        font-size: 1rem;
        margin-left: 0.625rem;
        span {
          margin-right: 0.3125rem;
        }
        .deepl {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f2b46;
          font-weight: 800;
          font-size: 1.125rem;
        }
        .future {
          font-size: 0.875rem;
        }
        .beta {
          width: 2.9375rem;
          height: 1.625rem;
          color: white;
          background-color: #037171;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          border-radius: 0.3125rem;
          margin-left: 0.3125rem;
        }
      }
    }
    .login {
      display: flex;
      align-items: center;
      span {
        margin: 0.625rem;
      }
      img {
        width: 2.25rem;
        height: 2rem;
      }
    }
  }
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
</style>