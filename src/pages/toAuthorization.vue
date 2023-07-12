<template>
  <el-dialog
    v-model="centerDialogVisible"
    title="授权"
    @closed="closeDialog(ruleFormRef)"
    style="width: 50%"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="7.5rem"
      class="demo-ruleForm"
    >
      <el-form-item label="主页链接" prop="address" style="width: 90%">
        <el-input
          v-model.number="ruleForm.address"
          placeholder="示例:https://vip.douyin.com/hVEaxaV/"
        />
      </el-form-item>
      <el-form-item label="账户昵称" prop="name" style="width: 90%">
        <el-input
          v-model.number="ruleForm.name"
          placeholder="示例:奇幻历险记"
        />
      </el-form-item>
      <el-form-item label="uid" prop="uid" style="width: 90%" class="help">
        <el-input v-model.number="ruleForm.uid" placeholder="抖音需要填写" />
        <img src="@/assets/authorization/help.svg" alt="" class="help_img1" />
        <div class="help_content">
          <img src="@/assets/authorization/help_img1.png" alt="" />
          <img src="@/assets/authorization/help_img2.png" alt="" />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)">清空</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 消息提示 -->

  <el-dialog v-model="DialogVisible" title="提示" width="30%" center>
    <span> 确定要删除绑定账号吗 </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="DialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDel"> 删除 </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="authorization_main">
    <div class="content">
      <div class="content_top">
        抖音、快手粉丝≤10000,西瓜、B站粉丝≤3000,可免费更换一次授权账号,不符合条件者不可更换。
      </div>
      <div class="content_center">
        <div class="content_center_left">
          <div class="platformlist">
            <div
              class="platformlist_item"
              v-for="(item, index) in platformlist"
              key="index"
              @click="chooseTypefun(index)"
              :class="typeIndex == index ? 'platformlist_active' : ''"
            >
              <div class="platformlist_item_left">
                <img src="@/assets/authorization/douyin.svg" alt="" />
                <span>{{ item.name }}</span>
              </div>

              <span class="add" @click="addFun">添加</span>
            </div>
          </div>
          <div class="surplus">
            剩余可绑定账号,抖音:994,西瓜:1000,B站:1000,快手:1000
          </div>
          <div class="pay">
            <img src="@/assets/authorization/lock.svg" alt="" />
            付费解锁新授权账号
          </div>
        </div>
        <div class="content_center_right">
          <div
            class="content_center_right_item"
            v-for="(item, index) in rightList"
            key="index"
          >
            <div class="item_left">
              <img src="@/assets/authorization/lock.svg" alt="" />
              <div class="userinfo">
                <span>{{ item.username }}</span>
                <span
                  >粉丝数:{{ item.status == 1 ? "未审核" : item.fans }}</span
                >
              </div>
            </div>
            <div class="item_right">
              <span
                >{{ item.status == 1 ? "未审核" : ""
                }}{{ item.status == 0 ? "未通过" : ""
                }}{{ item.status == 2 ? "已审核" : "" }}</span
              >
            </div>
            <el-button
              type="danger"
              :icon="Delete"
              circle
              style="position: absolute; right: 20px"
              @click="delItem(item)"
            />
          </div>
        </div>
      </div>
      <div class="back" @click="back">返回上一页</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import FormInstance from "element-plus";
import {
  addAccountAuthApi,
  getAuthInfoListApi,
  delUserAuthInfoApi,
} from "@/api/Allrequest.js";
import { Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
onMounted(() => {
  getTypeList();
});
const getTypeList = () => {
  let type = platformlist.value[typeIndex.value].name;
  getAuthInfoListApi({
    app: type,
    index: 0,
    size: 50,
  }).then((res) => {
    if (res.data.lenght != 0) {
      rightList.value = res.data;
    }
  });
};
const DialogVisible = ref(false);
// 要删除的账号id
const account_id = ref("");

// 删除账号
const delItem = (e) => {
  account_id.value = e.account_id;
  DialogVisible.value = true;
};
// 确认删除
const confirmDel = () => {
  delUserAuthInfoApi({
    account_id: account_id.value, //授权账号的account_id
  }).then((res) => {
    if (res.code == 200) {
      ElMessage({
        showClose: true,
        message: "删除成功",
        type: "success",
      });
      DialogVisible.value = false;
      setTimeout(() => {
        location.reload(true);
      }, 500);
    }
  });
};

// 弹出框
const centerDialogVisible = ref(false);
// 提交
const submitForm = (formEl) => {
  console.log("当前选择", platformlist.value[typeIndex.value].name);
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      addAccountAuthApi({
        app: platformlist.value[typeIndex.value].name,
        homeUrl: ruleForm.address,
        username: ruleForm.name,
        uid: ruleForm.uid.toString(),
      }).then((res) => {
        if (res.code == 200) {
          closeDialog();
          ElMessage({
            showClose: true,
            message: "添加成功!请等待后台审核",
            type: "success",
          });
          setTimeout(() => {
            location.reload(true);
          }, 500);
        }
      });
    } else {
      console.log("error submit!");
      centerDialogVisible.value = false;
      return false;
    }
  });
};

const addFun = (e) => {
  centerDialogVisible.value = true;
};
// 关闭弹出框
const closeDialog = (formEl) => {
  resetForm(formEl);
  centerDialogVisible.value = false;
};
// 清空表单
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
// 表单数据
const ruleForm = reactive({
  uid: "56805031809",
  address: "https://v.douyin.com/SfA96JY/",
  name: "小林很慌",
});
// 表单校验
const ruleFormRef = ref(FormInstance);
const checkName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入用户昵称"));
  }
  setTimeout(() => {
    callback();
  }, 500);
};
const checkUid = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入uid"));
  }
  setTimeout(() => {
    callback();
  }, 500);
};
const checkAddress = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入链接地址"));
  }
  setTimeout(() => {
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (urlRegex.test(value)) {
      callback();
    } else {
      callback(new Error("链接地址不正确"));
    }
  }, 500);
};
// 自定义校验规则
const rules = reactive({
  name: [{ validator: checkName, trigger: "blur" }],
  uid: [{ validator: checkUid, trigger: "blur" }],
  address: [{ validator: checkAddress, trigger: "blur" }],
});

// 平台列表
const platformlist = ref([
  { name: "抖音", img: "douyin.svg" },
  { name: "西瓜", img: "douyin.svg" },
  { name: "B站", img: "douyin.svg" },
  { name: "快手", img: "douyin.svg" },
]);
// 默认类型
const typeIndex = ref(0);
// 选择类型
const chooseTypefun = (e) => {
  typeIndex.value = e;
  getTypeList();
  console.log(platformlist.value[e].name);
};
// 右边列表数据
const rightList = ref([]);
// 返回上一页
const back = () => {
  window.history.back();
};
</script>

<style lang="scss" scoped>
// 提示框样式
:deep(.el-dialog__body) {
  background-color: red;
  width: 100%;
}
// 弹出框样式
:deep(.help) {
  display: flex !important;
  position: relative;
  .help_img1 {
    width: 20px;
    height: 20px;
    position: absolute;
    right: -25px;
    cursor: pointer;
  }
  .help_content {
    display: none;
  }
  .help_img1:hover + .help_content {
    position: absolute;
    display: flex;
    background-color: red;
    border: 2px solid #ccc;
    background-color: white;
    padding: 10px;
    box-sizing: border-box;
    right: -200px;
    top: -330px;
    border-radius: 5px;
    img {
      width: 200px;
      height: 300px;
    }
  }
}

.authorization_main {
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    width: 1120px;
    height: 700px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px 10px rgba($color: #000000, $alpha: 0.25);
    padding: 15px;
    box-sizing: border-box;
    .back {
      margin: 10px;
      display: flex;
      justify-content: flex-end;
      font-size: 16px;
      cursor: pointer;
    }
    .content_top {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      background-color: #fdf6ec;
      color: #e6a23c;
      font-size: 12px;
      font-weight: bold;
      border-radius: 5px;
    }
    .content_center {
      display: flex;
      width: 100%;
      .content_center_left {
        flex: 3;
        display: flex;
        flex-direction: column;
        align-items: center;
        .platformlist {
          width: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid #ccc;
          border-radius: 5px;
          margin-top: 20px;
          overflow: hidden;
          .platformlist_item {
            height: 70px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            padding: 10px;
            box-sizing: border-box;
            .platformlist_item_left {
              font-weight: bold;
              display: flex;
              align-items: center;
              img {
                width: 30px;
                height: 30px;
                margin-right: 10px;
              }
            }
          }
          .platformlist_item:hover {
            cursor: pointer;
            background-color: #ecf5ff;
          }
          .platformlist_active {
            background-color: #91b0d3;
          }
        }
        .surplus {
          font-size: 14px;
          background-color: #f0f9eb;
          color: #67c23a;
          margin-top: 20px;
          padding: 5px 10px;
          font-weight: bold;
          box-sizing: border-box;
          display: flex;
        }
        .pay {
          width: 60%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #66b1ff;
          color: white;
          height: 40px;
          margin-top: 50px;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
          img {
            width: 15px;
            height: 15px;
            margin-right: 5px;
          }
        }
        .pay:hover {
          background-color: #bcdcff;
        }
      }
      .content_center_right {
        flex: 7;
        border: 1px solid #ccc;
        margin-left: 20px;
        margin-top: 20px;
        border-radius: 5px;
        .content_center_right_item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f5f7f9;
          margin: 10px 10px 0 10px;
          border-radius: 5px;
          position: relative;

          .item_left {
            display: flex;
            align-items: center;
            .userinfo {
              display: flex;
              flex-direction: column;
              span:nth-of-type(1) {
                font-weight: bold;
                font-size: 20px;
              }
              span:nth-of-type(2) {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 10px;
                color: #888;
              }
            }
            img {
              width: 50px;
              height: 50px;
              background-color: red;
              border-radius: 50%;
              padding: 10px;
              box-sizing: border-box;
              margin: 0 20px;
            }
          }
          .item_right {
            height: 20px;
            padding: 5px 15px;
            background-color: #f0f9eb;
            color: #67c23a;
            font-size: 12px;
            margin-right: 60px;
          }
        }
      }
    }
  }
}
</style>
