<template>
  <!-- 登录注册弹出框 用于校验是否登录-->
  <el-dialog
    v-model="isToLogin"
    title="素材网"
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
      <el-form-item label="手机号" prop="name" style="width: 90%">
        <el-input v-model.number="ruleForm.name" />
      </el-form-item>
      <el-form-item label="密码" prop="pass" style="width: 90%">
        <el-input
          v-model="ruleForm.pass"
          type="password"
          autocomplete="off"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="checkpass"
        style="width: 90%"
        v-if="loginOrregister == '注册'"
      >
        <el-input
          v-model="ruleForm.checkpass"
          type="password"
          autocomplete="off"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item
        label="激活码"
        prop="code"
        style="width: 90%"
        v-if="loginOrregister == '注册'"
      >
        <el-input v-model="ruleForm.code" type="text" />
      </el-form-item>
      <el-form-item v-if="loginOrregister == '注册'">
        <img
          src="@/assets/getCode.svg"
          alt=""
          style="width: 20px; height: 20px"
        />
        <span style="margin-left: 0.625rem; cursor: pointer" @click="getCode"
          >获取激活码</span
        >
      </el-form-item>
      <el-form-item v-if="loginOrregister == '注册'">
        <span style="margin-left: 0.625rem; color: red"
          >添加客服获取激活码，素材网一个月内免费使用
          （素材陆续更新中，尽请期待）</span
        >
      </el-form-item>
      <el-form-item v-if="loginOrregister == '登录'">
        <span
          style="cursor: pointer; color: var(--el-color-primary)"
          @click="toRegister"
          >前往注册</span
        ></el-form-item
      >
      <el-form-item v-if="loginOrregister == '注册'">
        <span
          style="cursor: pointer; color: var(--el-color-primary)"
          @click="toLogin"
          >前往登录</span
        ></el-form-item
      >
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
  <!-- 登录注册弹出框 -->
  <!-- 其它提示 -->
  <el-dialog
    center
    v-model="dialogVisible"
    :title="PopUpPrompt.title"
    width="40%"
    @close="customerDialogClose"
  >
    <span class="PopUpPrompt">{{ PopUpPrompt.content }}</span>
    <div class="code" v-if="ServiceCode">
      <img src="@/assets/toDown.jpg" alt="" />
    </div>

    <el-input
      v-model="inputMoney"
      placeholder="输入需要修改的潮币数"
      v-if="isChangeMoney"
    />
    <el-input
      v-model="inputFilename"
      placeholder="输入需要修改的文件名"
      v-if="isChangeFileName"
    />
    <el-input
      v-model="RechargePhone"
      placeholder="输入需要充值的手机号"
      v-if="AdministratorRecharge"
      style="margin-bottom: 1.25rem"
    />
    <el-input
      v-model="RechargeCount"
      placeholder="输充值的潮币数"
      v-if="AdministratorRecharge"
    />
    <el-form
      ref="ruleFormRef"
      :model="changePassForm"
      status-icon
      :rules="newrules"
      label-width="7.5rem"
      class="demo-ruleForm"
      v-if="isChangePass"
    >
      <el-form-item label="原始密码" prop="pass" style="width: 90%">
        <el-input
          v-model="changePassForm.pass"
          type="password"
          autocomplete="off"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newpass" style="width: 90%">
        <el-input
          v-model="changePassForm.newpass"
          type="password"
          autocomplete="off"
          :show-password="true"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="checknewpass" style="width: 90%">
        <el-input
          v-model="changePassForm.checknewpass"
          type="password"
          autocomplete="off"
          :show-password="true"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogSubmit(PopUpPrompt)">
          {{ PopUpPrompt.button }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 其它提示 -->
  <div class="main">
    <el-backtop :bottom="80"></el-backtop>
    <!-- <div class="user">
      <div class="topName">
        <img src="@/assets/logo.svg" alt="" /> <span>沙雕素材网</span>
      </div>
      <div class="allright">
        <div class="user_left" v-if="identity != 1 && phone != ''">
          潮币: <span>{{ userBalance }}</span>
          <span @click="topup">去充值</span>
        </div>

        <div class="user_right" v-if="phone != ''">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{ identity == 1 ? "管理员" : "用户" }} : {{ phone }}</span
            >

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="a" @click="changePass"
                  >修改密码</el-dropdown-item
                >
                <el-dropdown-item
                  @click="toAuthorizationFun"
                  v-if="identity != 1"
                  >授权账号</el-dropdown-item
                >
                <el-dropdown-item @click="toAdminCheckFun" v-if="identity == 1"
                  >授权账号查看</el-dropdown-item
                >

                <el-dropdown-item
                  command="b"
                  @click="AddActivationCode"
                  v-if="identity == 1"
                  >添加激活码</el-dropdown-item
                >
                <el-dropdown-item
                  command="c"
                  v-if="identity == 1"
                  @click="uploadImg"
                  >上传图片</el-dropdown-item
                >
                <el-dropdown-item
                  command="d"
                  v-if="identity == 1"
                  @click="Recharge"
                  >充值系统</el-dropdown-item
                >
                <el-dropdown-item command="b" @click="logout"
                  >退出</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <img class="img" src="@/assets/toDown.png" alt="" />
        </div>

        <div class="user_right" @click="login" v-if="phone == ''">登录</div>
      </div>
    </div> -->

    <div class="top">
      未经授权账户使用拥有版权的素材将被视为侵权行为，我们将保护我们的版权并追究其法律责任。
    </div>

    <div class="search">
      <el-input v-model="search" placeholder="输入关键字" clearable />
      <el-button type="primary" @click="searchKeyword">搜索</el-button>
    </div>
    <div class="LabelField">
      <!-- <el-tabs
        class="demo-tabs"
        @tab-click="
          (event) => {
            handleClick(event, index);
          }
        "
      >
        <el-tab-pane
          :label="item"
          :name="index"
          v-for="(item, index) in labels"
          :key="index"
        ></el-tab-pane>
      </el-tabs> -->
      <div class="firstTabs">
        <div
          v-for="(item, index) in newlabels"
          :key="index"
          @click="clcikTabs(item, index)"
          class="firstTabs_item"
          :class="firstTabsIndex == index ? 'firstTabs_item_active' : ''"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="allSeconTabs">
        <div class="seconTabs">
          <div
            v-for="(item, index) in newlabels[firstTabsIndex].secondTags"
            :key="index"
            @click="clcikSecondTabs(item, index)"
            class="seconTabs_item"
            :class="secondTabsIndex == index ? 'seconTabs_item_active' : ''"
          >
            {{ item.name }}
          </div>
        </div>
        <div
          class="seconTabs"
          v-if="newlabels[firstTabsIndex].secondTags[secondTabsIndex].thirTags"
        >
          <div
            v-for="(item, index) in newlabels[firstTabsIndex].secondTags[
              secondTabsIndex
            ].thirTags"
            :key="index"
            @click="clcikThirdTabs(item, index)"
            class="seconTabs_item"
            :class="thirdTabsIndex == index ? 'seconTabs_item_active' : ''"
          >
            {{ item }}
          </div>
        </div>
        <div
          class="seconTabs"
          v-if="newlabels[firstTabsIndex].secondTags[secondTabsIndex].fourTags"
        >
          <div
            v-for="(item, index) in newlabels[firstTabsIndex].secondTags[
              secondTabsIndex
            ].fourTags"
            :key="index"
            @click="clcikFourTabs(item, index)"
            class="seconTabs_item"
            :class="fourTabsIndex == index ? 'seconTabs_item_active' : ''"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>

    <div class="imgContainer">
      <el-empty
        description="没有该类型图片"
        v-if="imgs.length == 0"
        style="width: 100%; display: flex; justify-content: center"
      />
      
      <div class="img" v-for="(item, index) in imgs" :key="index" >
        <div class="img_copyright" v-if="item.copyRight == '版权'">版权</div>
        <div v-if="chooseLabel == '音频'" style="text-align: center;">
          <span style="color: #409eff;font-size:20px;padding:20px;" @click="changeFilename(item)">{{
            item.filename
          }}</span>
          <!-- 音频播放控件 -->
          <audio :src="'/AIweb_material/' + item.filename + getBrowserExt(item.file_exts)" controls controlsList="nodownload" style="width:100%"></audio>
        </div>
        <el-image
          v-if="chooseLabel != '音频'"
          loading="lazy"
          :src="'/AIweb_material/' + item.filename + getBrowserExt(item.file_exts)"
          fit="fill"
          :preview-src-list="[
            '/AIweb_material/' +
              item.filename +
              '_mediumImg' + getBrowserExt(item.file_exts),
          ]"
          :zoom-rate="1.2"
        >
          <template #placeholder>
            <div class="image-slot">加载中<span class="dot">...</span></div>
          </template>
        </el-image>
        <div class="title">
          <span class="img_name" @click="changeFilename(item)">{{
            item.filename
          }}</span>
          <span v-if="identity == 1" class="delete" @click="deleteImgFun(item)"
            >删除</span
          >
          <!-- <span class="money" v-if="item.buy" key="index">已购买 </span>
          <span class="money" @click="changeMoney(item)"
            >{{ item.cost }}潮币</span
          > -->

          <el-dropdown
            class="downLoad"
            trigger="click"
            style="font-size: 0.75rem"
          >
            <span class="el-dropdown-link"> 下载 </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item1, index1) in item.file_exts.split('|')"
                  style="font-size: 0.75rem"
                  @click="downloadFile(item, item1)"
                  >{{ item1.split(".")[1] + "格式" }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- <span class="downLoad" @click="imgclickDown(item)">下载</span> -->
        </div>
      </div>
    </div>

    <div class="imgContainerHide">图窗太小,请全屏使用</div>
    <div class="pager">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[50, 100, 150, 200]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #total>
          <span class="el-pagination__total"> 总共{{ total }}条 </span>
        </template>
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import FormInstance from "element-plus";
// import { Message, UploadFilled } from "@element-plus/icons-vue";
import {
  loginApi,
  getImgsApi,
  downImgApi,
  uploadFileApi,
  deleteImgApi,
  logoutApi,
  AddActivationCodeApi,
  signinApi,
  changePassApi,
  updateFileApi,
  adminRechargeApi,
  userBalanceApi,
  addAccountAuthApi,
} from "@/api/Allrequest.js";
// import TopBar from '@/components/topBar.vue';
import UploadInstance from "element-plus";
// import APlayer from '@moefe/vue-aplayer';
import JSZip from "jszip";
// import { useActiveStore } from "@/pina/index.js";
import { useRouter } from "vue-router";
// const store = useActiveStore();
const router = useRouter();
// 前往授权账号页面
const toAuthorizationFun = () => {
  router.push("/authorization");
};
// 前往管理员查看绑定账号页面
const toAdminCheckFun = () => {
  router.push("/administratorcheck");
};

// 管理员进行充值
const RechargePhone = ref(null);
const RechargeCount = ref(null);
const AdministratorRecharge = ref(false);
const Recharge = () => {
  AdministratorRecharge.value = true;
  dialogCustomize({ title: "后台充值", button: "充值" });
};

// 用户去充值
const topup = () => {
  ServiceCode.value = true;
  dialogCustomize({ title: "添加客服进行充值" });
};
// 搜索关键字
const searchKeyword = () => {
  // 搜索api
  console.log("搜索", search.value);
  getImg();
};
// 弹出提示的内容
const PopUpPrompt = reactive({
  title: "",
  content: "",
  button: "",
  options: "",
  cost: "",
  filename: "",
});
// 弹出提示框的boolean
const dialogVisible = ref(false);
// 弹出框按钮下一步操纵
const dialogSubmit = (e) => {
  if (e.title == "修改文件名") {
    if (inputFilename.value == null) {
      ElMessage({
        message: "请输入文件名!",
        type: "warning",
      });
      return;
    } else {
      // 修改图片信息
      updateFileApi({
        file_id: parseInt(e.options),
        filename: inputFilename.value,
        cost: parseFloat(e.cost),
      }).then((res) => {
        isChangeFileName.value = false;
        dialogCustomize({ content: "修改成功" });
      });
    }
  }
  if (e.button == "确认上传") {
    if (fileNum.value == 0) {
      ElMessage({
        message: "请传入文件!",
        type: "warning",
      });
      return;
    } else if (imgTypeselect.value == null) {
      ElMessage({
        message: "请选择图片类型!",
        type: "warning",
      });
      return;
    } else if (imgPrice.value == null) {
      ElMessage({
        message: "请输入图片价格!",
        type: "warning",
      });
      return;
    } else {
      uploadRef.value.submit();
    }
  }
  if (e.button == "下载") {
    console.log("下载", e.options);
    console.log(parseInt(e.options.cost) <= parseInt(userBalance.value))
    console.log(parseInt(e.options.cost))
    console.log(parseInt(userBalance.value))
    console.log(userBalance.value)
    // 判断余额
    if (parseInt(e.options.cost) <= parseInt(userBalance.value)) {
      let filename = {
        file_id: parseInt(e.options.id),
        ext: e.options.filetype,
      };
      downImgApi(filename).then((res) => {
        console.log("下载文件", res);
        if (res.type == "application/json") {
        } else {
          if (filename.ext == ".fla") {
            const zip = new JSZip();
            zip.loadAsync(res.data).then((zip) => {
              const file = zip.file("DOMDocument.xml");
              if (!file) {
                throw new Error("Failed to extract DOMDocument.xml");
              }
              file.async("uint8array").then((data) => {
                const blob = new Blob([data], {
                  type: "application/octet-stream",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                const filename = e.options.filename + ".fla";
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              });
            });
          } else if (filename.ext == ".jpg") {
            const blob = new Blob([res.data]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            const filename = e.options.filename + ".jpg";
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            const blob = new Blob([res.data], { type: "image/png" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            const filename = e.options.filename + ".png";
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }
        // 更新潮币
        getLocalInfo();
      });
    } else {
      ElMessage({
        message: "余额不足，请充值!",
        type: "warning",
      });
      return;
    }
  }

  if (e.title == "后台充值" && e.button == "充值") {
    if (RechargePhone.value == null) {
      ElMessage({
        message: "请输入充值手机号!",
        type: "warning",
      });
      return;
    } else if (RechargeCount.value == null) {
      ElMessage({
        message: "请输入充值潮币数!",
        type: "warning",
      });
      return;
    } else {
      // 发送充值请求
      adminRechargeApi({
        phone: RechargePhone.value.toString(),
        money: parseInt(RechargeCount.value),
      }).then((res) => {
        if (res.msg == "success") {
          dialogCustomize({ content: "充值成功!" });
        }
      });
    }
  }
  if (e.title == "修改潮币") {
    console.log("文件名", e.filename);
    if (inputMoney.value == null) {
      ElMessage({
        message: "请输入潮币数!",
        type: "warning",
      });
      return;
    } else {
      // 修改图片信息
      updateFileApi({
        file_id: parseInt(e.options),
        cost: parseFloat(inputMoney.value),
        filename: e.filename,
      }).then((res) => {
        dialogCustomize({ content: "修改成功" });
      });
    }
  }
  if (e.button == "完成") {
    location.reload(true);
  }
  if (e.content == "删除成功") {
    getImg();
  }
  if (e.content == "修改成功") {
    getImg();
  }
  if (e.button == "删除") {
    // 删除api
    deleteImgApi({ file_id: e.options }).then((res) => {
      dialogCustomize({ content: "删除成功" });
    });
  }
  if (e.button == "修改密码") {
    changePassApi({
      cur_password: changePassForm.pass,

      password: changePassForm.newpass,

      re_password: changePassForm.checknewpass,
    }).then((res) => {
      if (res.code == 200) {
        dialogCustomize({ content: "修改成功" });
        setTimeout(() => {
          logout();
        }, 1000);
      } else {
        dialogCustomize({ content: res.msg });
      }
    });
  }
  isChangeMoney.value = false;
  ServiceCode.value = false;
  dialogVisible.value = false;
  AdministratorRecharge.value = false;
};
// 弹出框关闭或者取消选择
const customerDialogClose = (e) => {
  isChangeMoney.value = false;
  ServiceCode.value = false;
  dialogVisible.value = false;
  AdministratorRecharge.value = false;
};
const fileUploadSuccess = (res) => {
  // console.log("文件上传成功", res);
};

// 点击下载文件
const downloadFile = (e, type) => {
  e.filetype = type;
  const phoneLocal = localStorage.getItem("phone");
  console.log("当前点击下载文件", e);
  
  if (phoneLocal == "" || phoneLocal == null) {
    dialogCustomize({ content: "请登录后再进行下载" });
    return;
  }
  let filename = {
    file_id: parseInt(e.id),
    ext: type,
  };
  window.open("/AIweb_materialSys/materialSystem/getFile/"+filename.file_id+"/"+filename.ext)
  // 更新潮币
  getLocalInfo();

  // if (identity == 1) {
  //   // 处理特定身份的逻辑
  // } else {
  //   if (e.buy || identity.value == 1) {
  //     let filename = {
  //       file_id: parseInt(e.id),
  //       ext: type,
  //     };

  //     window.open("/AIweb_materialSys/materialSystem/getFile/"+filename.file_id+"/"+filename.ext)
  //     // 更新潮币
  //     getLocalInfo();

  //     // downImgApi(filename).then((res) => {
  //     //   console.log("下载文件", res);

  //     //   if (res.type == "application/json") {
  //     //     dialogCustomize({ content: "余额不足，请充值" });
  //     //   } else {
  //     //     const blob = new Blob([res.data]);
  //     //     const url = URL.createObjectURL(blob);
  //     //     const a = document.createElement("a");
  //     //     a.style.display = "none";
  //     //     const filename = e.filename + type;
  //     //     a.href = url;
  //     //     a.download = filename;
  //     //     document.body.appendChild(a);
  //     //     a.click();
  //     //     document.body.removeChild(a);
  //     //   }

  //     //   // 更新潮币
  //     //   getLocalInfo();
  //     // });

  //   } else {
  //     dialogCustomize({
  //       content: "确定花费" + e.cost + "潮币下载吗",
  //       button: "下载",
  //       options: e,
  //     });
  //   }
  // }
};

// 点击下载jpg图片
// const imgclickDown = (e, type) => {
//   e.filetype = type;
//   const phoneLocal = localStorage.getItem("phone");
//   console.log("当前点击下载图片", e);
//   if (phoneLocal == "" || phoneLocal == null) {
//     dialogCustomize({ content: "请登录后再进行下载" });
//     return;
//   } else if (identity == 1) {
//   } else {
//     if (e.buy || identity.value == 1) {
//       let filename = {
//         file_id: parseInt(e.id),
//         ext: type,
//       };
//       downImgApi(filename).then((res) => {
//         console.log("下载文件", res);
//         if (res.type == "application/json") {
//           dialogCustomize({ content: "余额不足,请充值" });
//         } else {
//           if (filename.ext == ".fla") {
//             const zip = new JSZip();
//             zip.loadAsync(res.data).then((zip) => {
//               const file = zip.file("DOMDocument.xml");
//               if (!file) {
//                 throw new Error("Failed to extract DOMDocument.xml");
//               }
//               file.async("uint8array").then((data) => {
//                 const blob = new Blob([data], {
//                   type: "application/octet-stream",
//                 });
//                 const url = URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.style.display = "none";
//                 const filename = e.filename + ".fla";
//                 a.href = url;
//                 a.download = filename;
//                 document.body.appendChild(a);
//                 a.click();
//                 document.body.removeChild(a);
//               });
//             });
//           } else if (filename.ext == ".jpg") {
//             const blob = new Blob([res.data]);
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.style.display = "none";
//             const filename = e.filename + ".jpg";
//             a.href = url;
//             a.download = filename;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//           } else {
//             const blob = new Blob([res.data], { type: "image/png" });
//             const url = URL.createObjectURL(blob);
//             const a = document.createElement("a");
//             a.style.display = "none";
//             const filename = e.filename + ".png";
//             a.href = url;
//             a.download = filename;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//           }
//         }

//         // 更新潮币
//         getLocalInfo();
//       });
//     } else {
//       dialogCustomize({
//         content: "确定花费" + e.cost + "潮币下载吗",
//         button: "下载",
//         options: e,
//       });
//     }
//   }
// };

// 是否点击修改密码
const isChangePass = ref(false);
// 修改密码表单
const changePassForm = reactive({
  pass: "",
  newpass: "",
  checknewpass: "",
});

// 原始密码
const originPass = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入原始密码"));
  } else {
    const res1 = new RegExp(
      /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,16}$/
    );
    const res2 = res1.exec(value);
    if (res2) {
      callback();
    } else {
      callback(
        new Error(
          "密码应为字母，数字，特殊符号(~!@#$%^&*()_.)，两种及以上组合，8-16位字符串，如：xiao123456"
        )
      );
    }
  }
};
// 密码
const newPass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入新密码"));
  } else {
    const res1 = new RegExp(
      /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,16}$/
    );
    const res2 = res1.exec(value);
    if (res2) {
      callback();
    } else {
      callback(
        new Error(
          "密码应为字母，数字，特殊符号(~!@#$%^&*()_.)，两种及以上组合，8-16位字符串，如：xiao123456"
        )
      );
    }
  }
};
// 确认密码
const checknewPass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入确认密码"));
  } else if (changePassForm.newpass != value) {
    callback(new Error("密码不一致!"));
  } else {
    const res1 = new RegExp(
      /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,16}$/
    );
    const res2 = res1.exec(value);
    if (res2) {
      callback();
    } else {
      callback(
        new Error(
          "密码应为字母，数字，特殊符号(~!@#$%^&*()_.)，两种及以上组合，8-16位字符串，如：xiao123456"
        )
      );
    }
  }
};
// 自定义校验规则
const newrules = reactive({
  pass: [{ validator: originPass, trigger: "blur" }],
  newpass: [{ validator: newPass, trigger: "blur" }],
  checknewpass: [{ validator: checknewPass, trigger: "blur" }],
});

// 修改密码
const changePass = () => {
  dialogCustomize({ title: "修改密码", button: "修改密码" });
  isChangePass.value = true;
};
// 添加激活码
const AddActivationCode = () => {
  AddActivationCodeApi().then((res) => {
    console.log("激活码", res.data);
    dialogCustomize({ title: "激活码", content: res.data });
  });
};
// 上传图片
const uploadRef = ref(UploadInstance);
const uploadImg = () => {
  dialogVisible.value = true;
  dialogCustomize({ title: "上传图片", button: "确认上传" });
};
const upload = (item) => {
  let formData = new FormData();
  formData.append("file", item.file);
  formData.append("type", imgTypeselect.value);
  formData.append("cost", imgPrice.value);
  formData.append("waterMark", "false");
  uploadFileApi(formData)
    .then((res) => {
      ElMessage({
        message: "文件"+item.filename +"上传成功!",
        type: "success",
      });
      // dialogCustomize({ content: "上传成功", button: "完成" });
    })
    .catch((err) => {
      dialogCustomize({ content: err });
      return;
    });
};
// 上传图片

// 删除图片
const deleteImgFun = (e) => {
  dialogCustomize({ content: "确定要删除吗", button: "删除", options: e.id });
  console.log("tet")
};

// 修改文件名
const isChangeFileName = ref(false);
const inputFilename = ref(null);
const changeFilename = (e) => {
  if (identity.value == 1) {
    isChangeFileName.value = true;
    dialogCustomize({
      title: "修改文件名",
      button: "确认修改",
      options: e.id,
      cost: e.cost,
      filename: e.filename,
    });
  }
};

// 修改金额
const isChangeMoney = ref(false);
const inputMoney = ref(null);
const changeMoney = (e) => {
  console.log("修改金额", e);
  if (identity.value == 1) {
    isChangeMoney.value = true;
    dialogCustomize({
      title: "修改潮币",
      button: "确认修改",
      options: e.id,
      cost: e.cost,
      filename: e.filename,
    });
  }
};

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
    PopUpPrompt.button = "好的";
  }
  if (PopUpPrompt.options != "" || PopUpPrompt.options != null) {
    PopUpPrompt.options = data.options;
  }
  if (PopUpPrompt.cost != "" || PopUpPrompt.cost != null) {
    PopUpPrompt.cost = data.cost;
  }
  if (PopUpPrompt.filename != "" || PopUpPrompt.filename != null) {
    PopUpPrompt.filename = data.filename;
  }

  dialogVisible.value = true;
};
// 显示客服二维码
const ServiceCode = ref(false);
// 点击获取验证码
const getCode = () => {
  dialogCustomize({ content: "微信扫一扫添加客服获取激活码" });
  dialogVisible.value = true;
  ServiceCode.value = true;
};

const search = ref("");
// 图片数据
const imgs = ref([]);

const total = ref(0);
const currentPage = ref(1);
// 图片下标
const startIndex = ref(0);
const currentImgIndex = ref(0);
const pageSize = ref(50);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

//获取文件预览格式后缀
const getBrowserExt = (exts) =>{
  if(exts.includes(".gif")){
    return ".gif";
  }else if(exts.includes(".wav")){
    return ".wav";
  }else if(exts.includes(".mp3")){
    return ".mp3";
  }else{
    return ".jpg";
  }
}

//播放音频文件
// const playAudio = (url) =>{
//   console.log(url)
//   const audioElement = new Audio(url);
//   audioElement.play();
// }

// 切换页数大小
const handleSizeChange = (e) => {
  pageSize.value = e;
  getImg();
};

// 切换页数
const handleCurrentChange = (e) => {
  scrollToTop();
  currentPage.value = e;
  console.log("当前页面", currentPage.value);
  if (e == 1) {
    // 当前图片的下标
    startIndex.value = 0;
  } else {
    startIndex.value =
      (currentPage.value - 1) * pageSize.value + currentImgIndex.value;
  }
  getImg();
};

// 回到顶部
const scrollToTop = () => {
  window.scrollToTop();
};
onMounted(() => {
  window.scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  getImg();
  getLocalInfo();
});
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
// 获取本地信息
const getLocalInfo = async () => {
  // 获取身份
  const identityLocal = localStorage.getItem("identity");
  if (identityLocal) {
    identity.value = identityLocal;
  }
  const phoneLocal = localStorage.getItem("phone");
  if (phoneLocal) {
    phone.value = phoneLocal;
    await getCountSync()
      .then((res) => {
        localStorage.setItem("balance", res.data.balance);
        userBalance.value = localStorage.getItem("balance");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // userBalance.value = localStorage.getItem("balance");
  // store.setActive(userBalance.value);
};
// 登录注册的弹出框
const isToLogin = ref(false);
// 登录
const login = () => {
  // 显示弹出框
  isToLogin.value = true;
};
// 清空表单
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
// 关闭注册登录的弹出框
const closeDialog = (formEl) => {
  resetForm(formEl);
};
// 表单数据
const ruleForm = reactive({
  pass: "",
  code: "",
  name: "",
  checkpass: "",
});
// 表单校验
const ruleFormRef = ref(FormInstance);
// 手机号
const checkName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入手机号"));
  }
  setTimeout(() => {
    let reg = /^1[0-9]{10}$/;
    if (!reg.test(value.toString())) {
      callback(new Error("手机号不正确"));
    } else {
      callback();
    }
  }, 500);
};
// 验证码
const checkCode = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入验证码"));
  } else {
    callback();
  }
};
// 密码
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const res1 = new RegExp(
      /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,16}$/
    );
    const res2 = res1.exec(value);
    if (res2) {
      callback();
    } else {
      callback(
        new Error(
          "密码应为字母，数字，特殊符号(~!@#$%^&*()_.)，两种及以上组合，8-16位字符串，如：xiao123456"
        )
      );
    }
  }
};
// 确认密码
const checkPass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (ruleForm.pass != value) {
    callback(new Error("密码不一致!"));
  } else {
    const res1 = new RegExp(
      /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,16}$/
    );
    const res2 = res1.exec(value);
    if (res2) {
      callback();
    } else {
      callback(
        new Error(
          "密码应为字母，数字，特殊符号(~!@#$%^&*()_.)，两种及以上组合，8-16位字符串，如：xiao123456"
        )
      );
    }
  }
};
// 自定义校验规则
const rules = reactive({
  pass: [{ validator: validatePass, trigger: "blur" }],
  code: [{ validator: checkCode, trigger: "blur" }],
  name: [{ validator: checkName, trigger: "blur" }],
  checkpass: [{ validator: checkPass, trigger: "blur" }],
});
// 用户身份
const identity = ref(0);
// 用户手机号
const phone = ref("");
// 目前是登录表单还是注册表单
const loginOrregister = ref("登录");
// 切换表单
const toRegister = () => {
  loginOrregister.value = "注册";
};
const toLogin = () => {
  loginOrregister.value = "登录";
};
// 用户是否登录
const isLogin = ref(false);

// 用户已经购买的图片
const buiedFiles = ref(null);
// 已经购买图片
const buiedFilesFun = () => {};

// 获取图片素材
const getImg = () => {
  if (search.value == "") {
    getImgsApi({
      type1: chooseLabel.value,

      type2: secondTabsItem.value,

      type3: "",//thirdTabsItem.value == "全部" ? "" : thirdTabsItem.value,

      type4: "",//fourTabsItem.value == "全部" ? "" : fourTabsItem.value,
      index: startIndex.value,
      size: pageSize.value,
    }).then((res) => {
      if (res.code == 403 && isLogin.value == true) {
        //dialogCustomize({ content: "用户信息过期,请重新登录" });
        ElMessage({
          message: "用户信息过期,请重新登录!",
          type: "warning",
        });
        login()
      } else if (res.code == 403) {
        //dialogCustomize({ content: "请登录" });
        ElMessage({
          message: "请登录!",
          type: "warning",
        });
        login()
        // localStorage.clear();
        // isLogin.value = false;
        // setTimeout(() => {
        //   location.reload();
        // }, 2000);
      }
      if (res.code == 200) {
        // imgs.value = res.data.files;
        // 对图片名进行排序
        let fin1 = getSortedNames(res.data.files);

        imgs.value = fin1;
        total.value = res.data.total;
        if (phone.value != "") {
          if (imgs.value.length != 0) {
            buiedFiles.value = res.data.buiedFiles;
            for (let k = 0; k < imgs.value.length; k++) {
              for (let i = 0; i < buiedFiles.value.length; i++) {
                // console.log(imgs.value[k].id);
                // console.log(buiedFiles.value[i].file_id);
                if (imgs.value[k].id == buiedFiles.value[i].file_id) {
                  imgs.value[k].buy = true;
                }
              }
            }
          }
        }
      }
    });
  } else {
    getImgsApi({
      filetype: chooseLabel.value,
      index: startIndex.value,
      size: pageSize.value,
      search: search.value,
    }).then((res) => {
      if (res.code == 403 && isLogin.value == true) {
        dialogCustomize({ content: "用户信息过期,请重新登录" });
      } else if (res.code == 403) {
        dialogCustomize({ content: "请登录" });
      }
      if (res.code == 200) {
        // imgs.value = res.data.files;
        // 对图片名进行排序
        let fin1 = getSortedNames(res.data.files);
        imgs.value = fin1;
        total.value = res.data.total;

        if (phone.value != "") {
          if (res.data.buiedFiles.length != 0) {
            buiedFiles.value = res.data.buiedFiles;
          }
        }
        console.log("测试", buiedFiles.value);
      }
    });
  }
};

// 图片名按照类型的名字进行数字排序
const getSortedNames = (arr) => {
  arr.sort(function (a, b) {
    var reg = /(\d+)/;
    var aNum = parseInt(a.filename.match(reg)?.[1] || "0");
    var bNum = parseInt(b.filename.match(reg)?.[1] || "0");
    var aPrefix = a.filename.replace(reg, "");
    var bPrefix = b.filename.replace(reg, "");
    var cmp = aPrefix.localeCompare(bPrefix);
    if (cmp === 0) {
      return aNum - bNum;
    } else {
      return cmp;
    }
  });
  return arr;
};

// 用户币数
const userBalance = ref(0);

// 用户登录
const loginFun = () => {
  // 用户登录
  console.log("用户登录");
  loginApi({
    phone: ruleForm.name.toString(),
    password: ruleForm.pass,
  }).then((res) => {
    console.log("登录",res);
    if (res.code == 200) {
      isToLogin.value = false;
      isLogin.value = true;
      // 数据存储在本地
      localStorage.setItem("token", res.data.tokne);
      localStorage.setItem("identity", res.data.identity);
      localStorage.setItem("phone", res.data.phone);
      localStorage.setItem("balance", res.data.balance);
      identity.value = res.data.identity;
      phone.value = res.data.phone;
      userBalance.value = res.data.balance;

    } else {
      dialogCustomize({ content: res.msg });
    }
  });
};
// 用户注册
const registerFun = () => {
  console.log("当前输入验证码", ruleForm.code);
  // 用户注册
  signinApi({
    phone: ruleForm.name.toString(),

    password: ruleForm.pass,

    re_password: ruleForm.checkpass,

    CDkey: ruleForm.code,
  }).then((res) => {
    if (res.code == 200) {
      dialogCustomize({ content: "注册成功" });
      isToLogin.value = false;
      // loginFun();
    } else {
      dialogCustomize({ content: res.msg });
    }
    console.log("注册状态");
  });
};
// 用户退出登录
const logout = () => {
  logoutApi().then((res) => {
    localStorage.clear();
    isLogin.value = false;
    location.reload(true);
  });
};

// 注册登录提交
const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // 用户登录
      if (loginOrregister.value == "登录") {
        loginFun();
      } else {
        registerFun();
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
// 新的标签页数据
const newlabels = ref([
  {
    name: "人物",
    secondTags: [
      {
        name: "玄幻修仙",
        //fourTags: ["全部", "男", "女", "非人族"],
      },
      {
        name: "现代都市",
        //fourTags: ["全部", "男", "女", "非人族"],
      },
      {
        name: "历史朝代",
        // thirTags: [
        //   "全部",
        //   "通用",
        //   "秦汉",
        //   "三国",
        //   "秦汉",
        //   "唐朝",
        //   "三国",
        //   "元朝",
        //   "宋朝",
        //   "明朝",
        //   "清朝",
        // ],
        //fourTags: ["全部", "男", "女"],
      },

      {
        name: "近代战争",
        //fourTags: ["全部", "男", "女"],
      },

      {
        name: "80/90年代",
        //fourTags: ["全部", "男", "女"],
      },

      {
        name: "荒野求生",
        //fourTags: ["全部", "男", "女"],
      },

      {
        name: "科技科幻",
        //fourTags: ["全部", "男", "女"],
      },
      {
        name: "其他",
        //fourTags: ["全部", "男", "女"],
      },
    ],
  },
  {
    name: "背景图",
    secondTags: [
      {
        name: "玄幻修仙",
        // thirTags: [
        //   "全部",
        //   "雪地",
        //   "熔岩",
        //   "草地",
        //   "岩石",
        //   "沙漠",
        //   "其他野外",
        //   "洞穴",
        //   "天空",
        //   "室内",
        //   "建筑",
        // ],
        //fourTags: ["全部", "白天", "黑夜"],
      },
      {
        name: "现代都市",
        // thirTags: [
        //   "全部",
        //   "住宅楼",
        //   "学校",
        //   "办公室",
        //   "医院",
        //   "酒店/餐厅",
        //   "其他室内",
        //   "城市街道",
        //   "乡村",
        //   "森林野外",
        //   "其它室外",
        // ],
        //fourTags: ["全部", "白天", "黑夜"],
      },
      {
        name: "历史朝代",
        // thirTags: [
        //   "全部",
        //   "宫殿",
        //   "城墙外",
        //   "府邸",
        //   "街道",
        //   "战场",
        //   "海边",
        //   "其他",
        // ],
      },

      {
        name: "近代战争",
        //fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "80/90年代",
        //fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "荒野求生",
        //fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "科技科幻",
        //fourTags: ["全部", "白天", "黑夜"],
      },
      {
        name: "其他",
        //fourTags: ["全部", "白天", "黑夜"],
      },
    ],
  },
  {
    name: "道具图",
    secondTags: [
      {
        name: "玄幻修仙",
        //thirTags: ["全部", "武器法宝", "书籍", "丹药", "翅膀", "其他"],
      },
      {
        name: "现代都市",
        //thirTags: ["全部", "武器", "汽车", "日用品", "植物", "其他"],
        //fourTags: ["全部", "白天", "黑夜"],
      },
      {
        name: "历史朝代",
        //thirTags: ["全部", "武器", "交通工具", "饮食", "其它"],
      },

      {
        name: "近代战争",
        //fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "80/90年代",
        //fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "荒野求生",
        //fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "科技科幻",
        //fourTags: ["全部", "白天", "黑夜"],
      },
      {
        name: "其他",
        //fourTags: ["全部", "白天", "黑夜"],
      },
    ],
  },
  {
    name: "表情包",
    secondTags: [
      {
        name: "玄幻修仙",
        //fourTags: ["全部", "男", "女", "非人族"],
      },
      {
        name: "历史朝代",
        //thirTags: ["全部", "通用", "秦汉", "三国"],
        //fourTags: ["全部", "男", "女"],
      },
      {
        name: "其他",
        //fourTags: ["全部", "白天", "黑夜"],
      },
    ],
  },
  {
    name: "特效",
    secondTags: [
      {
        name: "常规特效",   
      },
      {
        name: "打斗特效",
      },
      {
        name: "全屏特效",
      },

      {
        name: "其他",
      },
    ],
  },
  {
    name: "音频",
    secondTags: [
      {
        name: "常规",   
      },
      {
        name: "动物",
      },
      {
        name: "攻击特效",
      },
    ],
  },
]);

// 当前标签页下标 一级
const firstTabsIndex = ref(0);
// 当前选择标签内容 一级
const chooseLabel = ref(newlabels.value[firstTabsIndex.value].name);
// 标签页 一级
const clcikTabs = (item, index) => {
  chooseLabel.value = item.name;
  firstTabsIndex.value = index;
  secondTabsIndex.value = 0;
  secondTabsItem.value =
    newlabels.value[firstTabsIndex.value].secondTags[
      secondTabsIndex.value
    ].name;
  thirdTabsIndex.value = 0;
  if (thirdTabsItem.value != "") {
    thirdTabsItem.value =
      newlabels.value[firstTabsIndex.value].secondTags[
        secondTabsIndex.value
      ].thirTags[thirdTabsIndex.value];
  }
  fourTabsIndex.value = 0;
  if (fourTabsItem.value != "") {
    fourTabsItem.value =
      newlabels.value[firstTabsIndex.value].secondTags[
        secondTabsIndex.value
      ].fourTags[fourTabsIndex.value];
  }
  getImg();
};
// 二级
const secondTabsIndex = ref(0);
const secondTabsItem = ref(
  newlabels.value[firstTabsIndex.value].secondTags[secondTabsIndex.value].name
);
const clcikSecondTabs = (item, index) => {
  secondTabsIndex.value = index;
  secondTabsItem.value = item.name;
  thirdTabsIndex.value = 0;
  if (thirdTabsItem.value != "") {
    thirdTabsItem.value =
      newlabels.value[firstTabsIndex.value].secondTags[
        secondTabsIndex.value
      ].thirTags[thirdTabsIndex.value];
  }
  fourTabsIndex.value = 0;
  if (fourTabsItem.value != "") {
    fourTabsItem.value =
      newlabels.value[firstTabsIndex.value].secondTags[
        secondTabsIndex.value
      ].fourTags[fourTabsIndex.value];
  }
  getImg();
};
// 三级
const thirdTabsIndex = ref(0);
const thirdTabsItem = ref("");
const clcikThirdTabs = (item, index) => {
  thirdTabsIndex.value = index;
  thirdTabsItem.value = item;
  fourTabsIndex.value = 0;
  if (fourTabsItem.value != "") {
    fourTabsItem.value =
      newlabels.value[firstTabsIndex.value].secondTags[
        secondTabsIndex.value
      ].fourTags[fourTabsIndex.value];
  }
  getImg();
};
// 四级
const fourTabsIndex = ref(0);
const fourTabsItem = ref("");
const clcikFourTabs = (item, index) => {
  fourTabsIndex.value = index;
  fourTabsItem.value = item;
  getImg();
};
//上传图片类型选择
const imgTypeselect = ref(null);
const imgTypeselectOption = ref(["人物", "背景图", "表情包"]);
// 上传图片价格
const imgPrice = ref(null);

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
</script>

<style lang="scss" scoped>
// 自定义弹出框 上传图片样式修改
:deep(.formContainer_select) {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .el-select {
    margin: 1.25rem 0;
    box-sizing: border-box;
  }
  .imgprice {
    display: flex;
    position: relative;
    align-items: center;
    .unit {
      position: absolute;
      right: 0;
      padding: 0 0.3125rem;
      font-size: 0.75rem;
      color: #ccc;
    }
  }
}

.PopUpPrompt {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.code {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-top: 4.375rem;
  // background-image: url("@/assets/bg.png");
  // background-size: 20%;
  // background-position: center;

  :deep(.el-empty__description) {
    p {
      color: #d1e344;
      font-size: 1.375rem;
      border-radius: 0.625rem;
      padding: 0.625rem;
      box-sizing: border-box;
      background-color: rgba($color: #000000, $alpha: 0.35);
    }
  }
  .firstTabs {
    display: flex;
    margin-bottom: 10px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;

    .firstTabs_item {
      margin-left: 10px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 8px 8px 0 0;
      padding: 5px 25px;
    }
    .firstTabs_item:nth-of-type(1) {
      margin-left: 0;
    }
    .firstTabs_item_active {
      color: #d1e344;
    }
  }
  .allSeconTabs {
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
    border-radius: 6px;
    .seconTabs {
      display: flex;
      height: 50px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      .seconTabs_item {
        margin-left: 20px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        padding: 5px 15px;
        display: flex;
      }
      .seconTabs_item_active {
        color: white;
        border-radius: 10px;
        background-color: #d1e344;
      }
    }
  }

  .user {
    width: 100%;
    height: 3.125rem;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    padding: 0 8.125rem;
    box-sizing: border-box;
    justify-content: space-between;
    background-color: white;
    box-shadow: 0 0.25rem 0.25rem 0.25rem rgba($color: #000000, $alpha: 0.25);
    overflow: hidden;
    cursor: pointer;
    .allright {
      white-space: nowrap;
      display: flex;
      .user_right {
        display: flex;
        align-items: center;
        justify-content: center;
        .img {
          width: 0.9375rem;
          height: 0.9375rem;
          margin-left: 0.3125rem;
        }
        .name {
          font-size: 1.25rem;
        }
        .logout {
          cursor: pointer;
          margin-left: 1.25rem;
        }
        .el-dropdown {
          cursor: pointer;
        }
      }
      .user_left {
        font-size: 0.875rem;
        margin-right: 1.5625rem;
        overflow: hidden;
        span:nth-of-type(1) {
          color: #f56c6c;
          margin-right: 1.25rem;
        }
        span:nth-of-type(2) {
          cursor: pointer;
        }
      }
    }
  }
  .top {
    width: 100%;
    height: 2.5rem;
    background-color: #fdf6ec;
    color: #e6a23c;
    font-size: 0.8125rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.625rem 0;
  }
  .topName {
    height: 100%;
    font-size: 1.25rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 3.125rem;
      height: 3.125rem;
      margin-right: 0.625rem;
    }
  }
  .search {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    height: 2.5rem;
    margin-top: 1.25rem;
    padding: 0 8.125rem;
    box-sizing: border-box;
    :deep(.el-input) {
      flex: 9.5;
      font-size: 1rem;
      .el-input__wrapper {
        border-radius: 0.3125rem 0 0 0.3125rem;
        padding-left: 1.25rem;
        box-sizing: border-box;
      }
    }
    :deep(.el-button) {
      flex: 0.5;
      height: 100%;
      border-radius: 0 0.3125rem 0.3125rem 0;
    }
  }
  @media screen and (min-width: 82.5rem) {
    .LabelField {
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      margin-top: 1.875rem;
      display: flex;
      padding: 0 8.125rem;
      .SecondLabelField {
        display: flex;
        padding: 0.9375rem 8.125rem;
        box-sizing: border-box;
      }
      .el-tabs {
        :deep(.el-tabs__header) {
          padding: 0 !important;
          margin: 0 !important;
        }
        :deep(.el-tabs__item) {
          width: 9.375rem;
          font-size: 1rem;
          border: 0.125rem solid #ccc;
          background-color: white;
          padding: 0 !important;
          box-sizing: border-box !important;
          border-radius: 0.3125rem 0.3125rem 0 0;
          padding-left: 0.0625rem !important;
          padding-bottom: 0.125rem !important;
          margin-right: 0.625rem !important;
        }
        :nth-child(5n) {
          margin-right: 0rem !important;
        }

        :deep(.is-active) {
          border: 0.125rem solid #d1e344;
        }
      }
    }

    .imgContainer {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding: 3.125rem 9.375rem;
      box-sizing: border-box;
      

      .img {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        max-height: 12.5rem;
        //min-height: 12.5rem;
        overflow: hidden;
        width: calc((100% - 5rem) / 5);
        max-width: calc((100% - 5rem) / 5);
        min-width: calc((100% - 5rem) / 5);
        margin-right: 0.625rem;
        margin-bottom: 1.25rem;
        border-radius: 0.625rem;
        background-color: white;
        border: 0.0625rem solid #ccc;
        position: relative;
        overflow: hidden;
        .img_copyright {
          width: 9.375rem;
          height: 1.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-45deg);
          background-color: rgba($color: #fdf6ec, $alpha: 1);
          color: #e6a23c;
          position: absolute;
          z-index: 20;
          left: -3.125rem;
          top: 0.625rem;
        }
        .el-image {
          width: 100%;
          height: 100%;
          :deep(.image-slot) {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            color: #ccc;
          }
        }
        &:nth-child(5n) {
          margin-right: 0rem;
        }
        .title {
          padding: 0 0.625rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1rem;
          height: 3.125rem;
          font-size: 0.75rem;
          border-top: 0.0625rem solid #ccc;
          box-sizing: border-box;
          .delete {
            color: #f56c6c;
          }
          .money {
            color: #f56c6c;
          }
          span {
            cursor: pointer;
          }
          .downLoad {
            color: #409eff;
          }
        }
      }
      .img:hover {
        cursor: pointer;
        box-shadow: 0 0 0.3125rem 0.3125rem rgba($color: #000000, $alpha: 0.25);
      }
    }
  }

  .imgContainerHide {
    display: none;
  }
  @media screen and (max-width: 82.5rem) {
    .LabelField {
      width: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      margin-top: 1.875rem;
      display: flex;
      padding: 0 8.125rem;
      overflow: hidden;
      .el-tabs {
        :deep(.el-tabs__header) {
          padding: 0 !important;
          margin: 0 !important;
        }
        :deep(.el-tabs__item) {
          width: 9.375rem;
          font-size: 1rem;
          border: 0.125rem solid #ccc;
          background-color: white;
          padding: 0 !important;
          box-sizing: border-box !important;
          border-radius: 0.3125rem 0.3125rem 0 0;
          padding-left: 0.0625rem !important;
          padding-bottom: 0.125rem !important;
          margin-right: 0.625rem !important;
        }
        :nth-child(5n) {
          margin-right: 0rem !important;
        }

        :deep(.is-active) {
          border: 0.125rem solid #d1e344;
        }
      }
    }

    .imgContainer {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding: 3.125rem 3.125rem 0 3.125rem;

      .img {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        max-height: 12.5rem;
        overflow: hidden;
        width: calc((100% - 1.25rem) / 3);
        max-width: calc((100% - 1.25rem) / 3);
        min-width: calc((100% - 1.25rem) / 3);
        margin-right: 0.625rem;
        margin-bottom: 1.25rem;
        border-radius: 0.625rem;
        background-color: white;
        border: 0.0625rem solid #ccc;
        position: relative;
        .img_copyright {
          width: 9.375rem;
          height: 1.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-45deg);
          background-color: rgba($color: #fdf6ec, $alpha: 1);
          color: #e6a23c;
          position: absolute;
          z-index: 20;
          left: -3.125rem;
          top: 0.625rem;
        }
        .el-image {
          width: 100%;
          height: 100%;
          :deep(.image-slot) {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            color: #ccc;
          }
        }
        &:nth-child(3n) {
          margin-right: 0rem;
        }
        .title {
          padding: 0 0.625rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1rem;
          height: 3.125rem;
          font-size: 0.75rem;
          .delete {
            color: #f56c6c;
          }
          .money {
            color: #f56c6c;
          }
          span {
            cursor: pointer;
          }
          :deep(.el-dropdown-menu__item) {
            font-size: 0.75rem !important;
          }
        }
      }
    }
  }
  @media screen and (max-width: 48.4375rem) {
    .topName {
      span {
        display: none;
      }
    }
    .LabelField {
      display: none;
    }
    .imgContainer {
      display: none;
    }

    .imgContainerHide {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.375rem;
      color: #ccc;
    }
    .pager {
      display: none !important;
    }
  }
  .pager {
    width: 100%;
    display: flex;
    padding: 0 8.125rem;
    box-sizing: border-box;
    margin-bottom: 3.125rem;
    .el-pagination {
      padding: 0.625rem 1.25rem;
      box-sizing: border-box;
      border: 0.0625rem solid #ccc;
      border-radius: 0.9375rem;
      background-color: white;
      display: flex;
      justify-content: flex-start;
      color: black;
    }
  }
}
</style>
