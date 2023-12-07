<template>
  <!-- 登录注册弹出框 -->
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
      <el-form-item
        label="用户名"
        prop="username"
        style="width: 90%"
        v-if="loginOrregister == '注册'"
      >
        <el-input v-model.number="ruleForm.username" />
      </el-form-item>
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
      <!-- <el-form-item v-if="loginOrregister == '注册'">
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
      </el-form-item> -->
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
          v-if="isChangePass"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newpass" style="width: 90%">
        <el-input
          v-model="changePassForm.newpass"
          type="password"
          autocomplete="off"
          :show-password="true"
          v-if="isChangePass"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="checknewpass" style="width: 90%">
        <el-input
          v-model="changePassForm.checknewpass"
          type="password"
          autocomplete="off"
          :show-password="true"
          v-if="isChangePass"
        />
      </el-form-item>
    </el-form>

    <div class="formContainer" v-if="PopUpPrompt.title == '上传图片'">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        drag
        action=""
        :http-request="upload"
        multiple
        :auto-upload="false"
        :on-remove="removeFile"
        :on-success="fileUploadSuccess"
        :on-change="FileUp"
      >
        <img src="@/assets/filelogo.svg" alt="" />
        <div class="el-upload__text">拖入文本或者<em>点击这里上传文本</em></div>
        <template #tip>
          <div class="el-upload__tip">
            <!-- jpg/png files with a size less than 500kb -->
          </div>
        </template>
      </el-upload>
      <div class="formContainer_select">
        <el-select
          v-model="chooseFirst"
          placeholder="文件类型"
          @change="firstTypes"
        >
          <el-option
            v-for="(item, index) in newlabels"
            :key="index"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <el-select
          v-model="chooseSecond"
          placeholder="文件类型2"
          @change="SecondTypes"
        >
          <el-option
            v-for="(item, index) in newlabels[chooseFirstIndex].secondTags"
            :key="index"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <el-select
          v-model="copyRight"
          placeholder="版权设置"
          @change="copyRights"
        >
          <el-option label="版权" value="版权" />
          <el-option label="非版权" value="非版权" />
        </el-select>
        <!-- <el-select
          v-model="chooseThird"
          placeholder="文件类型3"
          @change="ThirdTypes"
        >
          <el-option
            v-if="
              newlabels[chooseFirstIndex].secondTags[chooseSecondIndex].thirTags
            "
            v-for="(item, index) in newlabels[chooseFirstIndex].secondTags[
              chooseSecondIndex
            ].thirTags.slice(1)"
            key="index"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-select
          v-model="chooseFour"
          placeholder="文件类型4"
          @change="FourTypes"
        >
          <el-option
            v-if="
              newlabels[chooseFirstIndex].secondTags[chooseSecondIndex].fourTags
            "
            v-for="(item, index) in newlabels[chooseFirstIndex].secondTags[
              chooseSecondIndex
            ].fourTags.slice(1)"
            key="index"
            :label="item"
            :value="item"
          />
        </el-select> -->
        <div class="imgprice">
          <el-input v-model="imgPrice" placeholder="请输入图片价格"></el-input>
          <div class="unit">潮币</div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogSubmit(PopUpPrompt)">
          {{ PopUpPrompt.button }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 其它提示 -->
  <div class="user">
    <div class="topName">
      <img src="@/assets/logo3.png" alt="" />
    </div>
    <div class="topCenter">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
      <el-menu-item class="menu-item" index="0">首页</el-menu-item>
      <el-menu-item class="menu-item" index="1">素材中心</el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <span class="menu-item">AI工具</span>
          </template>
          <el-menu-item index="2-1">AI配音</el-menu-item>
          <el-menu-item index="2-2">AI文章助手</el-menu-item>
          <el-menu-item index="2-3">AI绘图</el-menu-item>
        </el-sub-menu>
        <el-menu-item class="menu-item" index="3">软件下载</el-menu-item>
        <el-menu-item class="menu-item" index="4">课程教学</el-menu-item>
      </el-menu>
    </div>

    <div class="allright">
      <!-- <div class="user_left" v-if="identity != 1 && phone != ''">
        潮币: <span>{{ userBalance }}</span>
        <span @click="topup">去充值</span>
      </div> -->

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
              <el-dropdown-item @click="toAuthorizationFun" v-if="identity != 1"
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
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import UploadInstance from "element-plus";
import FormInstance from "element-plus";
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
const router = useRouter();

// 新的标签页数据
const newlabels = ref([
  {
    name: "人物",
    secondTags: [
      {
        name: "玄幻修仙",
        fourTags: ["全部", "男", "女", "非人族"],
      },
      {
        name: "现代都市",
        fourTags: ["全部", "男", "女", "非人族"],
      },
      {
        name: "历史朝代",
        thirTags: [
          "全部",
          "通用",
          "秦汉",
          "三国",
          "秦汉",
          "唐朝",
          "三国",
          "元朝",
          "宋朝",
          "明朝",
          "清朝",
        ],
        fourTags: ["全部", "男", "女"],
      },

      {
        name: "近代战争",
        fourTags: ["全部", "男", "女"],
      },

      {
        name: "80|90年代",
        fourTags: ["全部", "男", "女"],
      },

      {
        name: "荒野求生",
        fourTags: ["全部", "男", "女"],
      },

      {
        name: "科技科幻",
        fourTags: ["全部", "男", "女"],
      },
      {
        name: "其他",
        fourTags: ["其他"],
      },
    ],
  },
  {
    name: "背景图",
    secondTags: [
      {
        name: "玄幻修仙",
        thirTags: [
          "全部",
          "雪地",
          "熔岩",
          "草地",
          "岩石",
          "沙漠",
          "其他野外",
          "洞穴",
          "天空",
          "室内",
          "建筑",
        ],
        fourTags: ["全部", "白天", "黑夜"],
      },
      {
        name: "现代都市",
        thirTags: [
          "全部",
          "住宅楼",
          "学校",
          "办公室",
          "医院",
          "酒店/餐厅",
          "其他室内",
          "城市街道",
          "乡村",
          "森林野外",
          "其它室外",
        ],
        fourTags: ["全部", "白天", "黑夜"],
      },
      {
        name: "历史朝代",
        thirTags: [
          "全部",
          "宫殿",
          "城墙外",
          "府邸",
          "街道",
          "战场",
          "海边",
          "其他",
        ],
      },

      {
        name: "近代战争",
        fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "80|90年代",
        fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "荒野求生",
        fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "科技科幻",
        fourTags: ["全部", "白天", "黑夜"],
      },
      {
        name: "其他",
        fourTags: ["其他"],
      },
    ],
  },
  {
    name: "道具图",
    secondTags: [
      {
        name: "玄幻修仙",
        thirTags: ["全部", "武器法宝", "书籍", "丹药", "翅膀", "其他"],
      },
      {
        name: "现代都市",
        thirTags: ["全部", "武器", "汽车", "日用品", "植物", "其他"],
        fourTags: ["全部", "白天", "黑夜"],
      },
      {
        name: "历史朝代",
        thirTags: ["全部", "武器", "交通工具", "饮食", "其它"],
      },

      {
        name: "近代战争",
        fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "80|90年代",
        fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "荒野求生",
        fourTags: ["全部", "白天", "黑夜"],
      },

      {
        name: "科技科幻",
        fourTags: ["全部", "白天", "黑夜"],
      },
      {
        name: "其他",
        fourTags: ["其他"],
      },
    ],
  },
  {
    name: "表情包",
    secondTags: [
      {
        name: "玄幻修仙",
        fourTags: ["全部", "男", "女", "非人族"],
      },
      {
        name: "历史朝代",
        thirTags: ["全部", "通用", "秦汉", "三国"],
        fourTags: ["全部", "男", "女"],
      },
      {
        name: "其他",
        fourTags: ["其他"],
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
// 一级选项
const chooseFirst = ref("");
const chooseFirstIndex = ref(0);
// 二级选项
const chooseSecond = ref("");
const chooseSecondIndex = ref(0);
// 三级选项
const chooseThird = ref("");
const chooseThirdIndex = ref(0);
// 四级选项
const chooseFour = ref("");
//版权选项
const copyRight = ref(""); 
const chooseFourIndex = ref(0);
// 选中第一个类型
const firstTypes = (e) => {
  chooseFirst.value = e;
  chooseFirstIndex.value = newlabels.value.findIndex(
    (option) => option.name === chooseFirst.value
  );
};
// 选中第二个类型
const SecondTypes = (e) => {
  chooseSecond.value = e;
  chooseSecondIndex.value = newlabels.value[
    chooseFirstIndex.value
  ].secondTags.findIndex((option) => option.name === chooseSecond.value);
  console.log("第二个选择的下标", chooseSecondIndex.value);
};
const copyRights = (e) => {
  copyRight.value = e;
}
// 选中第三个类型
const ThirdTypes = (e) => {
  chooseThird.value = e;
  console.log(
    "测试第三",
    newlabels.value[chooseFirstIndex.value].secondTags[chooseSecondIndex.value]
      .thirTags
  );
  chooseThirdIndex.value = newlabels.value[chooseFirstIndex.value].secondTags[
    chooseSecondIndex.value
  ].thirTags.findIndex((option) => option === chooseThird.value);
  console.log("第三个选择的下标", chooseThirdIndex.value);
};
// 选中第四个类型
const FourTypes = (e) => {
  chooseFour.value = e;
  chooseFourIndex.value = newlabels.value[chooseFirstIndex.value].secondTags[
    chooseSecondIndex.value
  ].fourTags.findIndex((option) => option === chooseThird.value);
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

  dialogVisible.value = true;
};

// 弹出提示的内容
const PopUpPrompt = reactive({
  title: "",
  content: "",
  button: "",
  options: "",
});
// 是否点击修改密码
const isChangePass = ref(false);
// 前往授权账号页面
const toAuthorizationFun = () => {
  router.push("/authorization");
};
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
// 前往管理员查看绑定账号页面
const toAdminCheckFun = () => {
  router.push("/administratorcheck");
};
// 表单数据
const ruleForm = reactive({
  username: "",
  pass: "",
  code: "",
  name: "",
  checkpass: "",
});

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
// 用户登录
const loginFun = () => {
  // 用户登录
  console.log("用户登录");

  
  loginApi({
    phone: ruleForm.name.toString(),
    password: ruleForm.pass,
  }).then((res) => {
    console.log("登录", res);
    if (res.code == 200) {
      isToLogin.value = false;
      // 数据存储在本地
      localStorage.setItem("token", res.data.tokne);
      localStorage.setItem("identity", res.data.identity);
      localStorage.setItem("phone", res.data.phone);
      localStorage.setItem("balance", res.data.balance);
      identity.value = res.data.identity;
      phone.value = res.data.phone;
      userBalance.value = res.data.balance;
      
      location.reload(true);
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
    username: ruleForm.username,
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
// 关闭注册登录的弹出框
const closeDialog = (formEl) => {
  resetForm(formEl);
};
// 清空表单
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 表单校验
const ruleFormRef = ref(FormInstance);

const checkUsername = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入真实姓名"));
  }
  setTimeout(() => {
    let reg = /^[\u4e00-\u9fa5]{2,4}$/;
    if (!reg.test(value.toString())) {
      callback(new Error("名字格式不正确"));
    } else {
      callback();
    }
  }, 500);
};

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
  username: [{ validator: checkUsername, trigger: "blur" }],
});

const changePassForm = {
  pass:'',
  newpass:'',
  checknewpass:''
}
// 修改密码
const changePass = () => {
  dialogCustomize({ title: "修改密码", button: "修改密码" });
  isChangePass.value = true;
};
// 弹出提示框的boolean
const dialogVisible = ref(false);
// 弹出框按钮下一步操纵
const dialogSubmit = (e) => {
  if (e.button == "确认上传") {
    if (fileNum.value == 0) {
      ElMessage({
        message: "请传入文件!",
        type: "warning",
      });
      return;
    } else if (chooseFirst.value == null) {
      ElMessage({
        message: "请选择文件类型!",
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
      }).then((res) => {
        dialogCustomize({ content: "修改成功" });
      });
    }
  }
  if (e.button == "完成") {
    location.reload(true);
  }
  if (e.content == "删除成功") {
    location.reload(true);
  }
  if (e.content == "修改成功") {
    location.reload(true);
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
  isChangePass.value = false;
};
// 用户退出登录
const logout = () => {
  logoutApi().then((res) => {
    localStorage.clear();
    isLogin.value = false;
    location.reload(true);
  });
};
// 弹出框关闭或者取消选择
const customerDialogClose = (e) => {
  isChangeMoney.value = false;
  ServiceCode.value = false;
  dialogVisible.value = false;
  AdministratorRecharge.value = false;
  isChangePass.value = false;
};
// 管理员进行充值
const RechargePhone = ref(null);
const RechargeCount = ref(null);
const AdministratorRecharge = ref(false);
const Recharge = () => {
  AdministratorRecharge.value = true;
  dialogCustomize({ title: "后台充值", button: "充值" });
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
  formData.append("type1", chooseFirst.value);
  formData.append("type2", chooseSecond.value);
  formData.append("type3", chooseThird.value);
  formData.append("type4", chooseFour.value);
  formData.append("copyRight",copyRight.value);
  formData.append("waterMark", "false");
  formData.append("cost", imgPrice.value);
  uploadFileApi(formData)
    .then((res) => {
      alreadyFileNum.value++;
      ElMessage({
        message: "文件"+item.file.name +"上传成功!  进度"+alreadyFileNum.value/fileNum.value*100+"%",
        type: "success",
      });
      if(alreadyFileNum.value == fileNum.value){
        ElMessage({
          message: "所有文件上传成功!",
          type: "success",
        });

        alreadyFileNum.value = 0;
        fileNum.value = 0;
      }
      // dialogCustomize({ content: "上传成功", button: "完成" });
    })
    .catch((err) => {
      dialogCustomize({ content: err });
      return;
    });
};

const firstItem = ref([""]);
// 上传图片价格
const imgPrice = ref(null);
// 上传总文件个数
let fileNum = ref(0);
// 文件个数
let alreadyFileNum = ref(0);
// 上传图片
const fileUploadSuccess = (res) => {
  // console.log("文件上传成功", res);
  console.log(fileList);
};
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
// 用户去充值
const topup = () => {
  ServiceCode.value = true;
  dialogCustomize({ title: "添加客服进行充值" });
};
// 显示客服二维码
const ServiceCode = ref(false);
// 点击获取验证码
const getCode = () => {
  dialogCustomize({ content: "微信扫一扫添加客服获取激活码" });
  dialogVisible.value = true;
  ServiceCode.value = true;
};
// 修改金额
const isChangeMoney = ref(false);
const inputMoney = ref(null);
const changeMoney = (e) => {
  if (identity.value == 1) {
    isChangeMoney.value = true;
    dialogCustomize({ title: "修改潮币", button: "确认修改", options: e.id });
  }
};

// 登录注册的弹出框
const isToLogin = ref(false);
// 登录
const login = () => {
  // 显示弹出框
  isToLogin.value = true;
};

// 顶部用户信息 start
const userBalance = ref(0);
const phone = ref("");
const identity = ref("");
// 顶部用户信息 end

// 添加激活码
const AddActivationCode = () => {
  AddActivationCodeApi().then((res) => {
    console.log("激活码", res.data);
    dialogCustomize({ title: "激活码", content: res.data });
  });
};

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
};
onMounted(() => {
  getLocalInfo();
});
// Dubbing
var activeIndex = '0';
const handleSelect = (key, keyPath) => {
  activeIndex = key;
  console.log(key);
  switch(key){
    case '0': router.push("/");break;
    case '1': router.push("/material-center");break;
    case '2-1': router.push("/soundAIChart");break;
    case '2-2': router.push("/AIchat");break;
    case '2-3': router.push("/TextToImage");break;
    // case '2-3': router.push("/soundAIChart");break;

    case '3':
              getCountSync()
              .then((res) => {
                localStorage.setItem("balance", res.data.balance);
                userBalance.value = localStorage.getItem("balance");
              })
              .catch((err) => {
                console.log(err);
                login()
              }); 
              router.push("/toolsDownload");break;
    case '4': //检测登录token是否有效
              //var self = this
              getCountSync()
              .then((res) => {
                localStorage.setItem("balance", res.data.balance);
                userBalance.value = localStorage.getItem("balance");
              })
              .catch((err) => {
                console.log(err);
                login()
              });
              router.push("/videos");
              break;
  }
  console.log(key, keyPath);
};
</script>

<!-- <script>
export default {
    data() {
      return {
        activeIndex: '1',
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        this.activeIndex = key;
        if(key == 4){
          router.push("/administratorcheck");
        }
        console.log(key, keyPath);
      }
    }
  }
</script> -->
<style lang="scss" scoped>
// 自定义弹出框 上传图片样式修改
:deep(.formContainer_select) {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .el-select {
    margin-bottom: 10px;
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

html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    min-height: 100%;
    font-family: "Helvetica Neue For Number", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    background-color: #fff;
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


.user {
  width: 100%;
  height: 3.125rem;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  box-sizing: border-box;
  background-color: #fafafa;
  overflow: hidden;
  @media screen and (max-width: 1280px){
    padding: 0 14px;
  }
  padding: 0 24px;
  .topName {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    width: 9em;
    height: 4.5em;
    margin-right: .625em;

    img {
      display: block;
      width: 6.375em;
      border-style: none;
    }
  }
  .topCenter{
      width: 100%;
      .menu-item{
        font-size: 1em;
      }
    }
  .allright {
    -ms-flex: 1;
    flex: 1;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -ms-flex-align: center;
    align-items: center;

    .user_right {
      background: transparent;
      outline: none;
      padding: .3125em .625em;
      margin: .3125em .625em;
      border: 1px solid #555;
      border-radius: 4px;
      white-space: nowrap;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      font-size: 1em;
      display: flex;
      align-items: center;
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
</style>
