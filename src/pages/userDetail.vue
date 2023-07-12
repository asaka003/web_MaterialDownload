<template>
  <div class="checkMain">
    <div class="checkCenter">
      <div class="userInfo">
        <span>用户名xxxx</span> <span @click="back">返回上一页</span>
      </div>
      <div class="checkCenter_item" v-for="(item, index) in types" key="index">
        <div class="checkCenter_table" v-if="item === '抖音'">
          <div class="checkCenter_table_title">{{ item }}</div>
          <el-table :data="type1" style="width: 100%">
            <el-table-column label="用户名" prop="username" />
            <el-table-column label="用户id" prop="uid" />
            <el-table-column label="状态" prop="status">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span v-if="scope.row.status == 0">审核未通过 </span>
                  <span v-if="scope.row.status == 1">未进行审核 </span>
                  <span v-if="scope.row.status == 2">审核通过 </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left">
              <template #header>
                <el-input v-model="search" size="small" placeholder="搜索" />
              </template>
              <template #default="scope">
                <el-button
                  size="small"
                  @click="handleEdit(scope.$index, scope.row)"
                  >{{ scope.row.status == 2 ? "查看" : "审核" }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="checkCenter_pager">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[50, 100, 150, 200]"
              :small="small"
              :disabled="disabled"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="type1.length"
              @size-change="(e) => handleSizeChange(item, e)"
              @current-change="(e) => handleCurrentChange(item, e)"
            >
            </el-pagination>
          </div>
        </div>
        <div class="checkCenter_table" v-if="item === '西瓜'">
          <div class="checkCenter_table_title">{{ item }}</div>
          <el-table :data="type2" style="width: 100%">
            <el-table-column label="用户名" prop="name">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span>{{ scope.row.binding_count }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="用户id" prop="id" />
            <el-table-column label="状态" prop="status" />
            <el-table-column align="left">
              <template #header>
                <el-input v-model="search" size="small" placeholder="搜索" />
              </template>
              <template #default="scope">
                <el-button
                  size="small"
                  @click="handleEdit(scope.$index, scope.row)"
                  >{{ scope.row.status == 2 ? "查看" : "审核" }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="checkCenter_pager">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[50, 100, 150, 200]"
              :small="small"
              :disabled="disabled"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="type2.length"
              @size-change="(e) => handleSizeChange(item, e)"
              @current-change="(e) => handleCurrentChange(item, e)"
            >
            </el-pagination>
          </div>
        </div>
        <div class="checkCenter_table" v-if="item === 'B站'">
          <div class="checkCenter_table_title">{{ item }}</div>
          <el-table :data="type3" style="width: 100%">
            <el-table-column label="用户名" prop="name">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span>{{ scope.row.binding_count }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="用户id" prop="id" />
            <el-table-column label="状态" prop="status" />
            <el-table-column align="left">
              <template #header>
                <el-input v-model="search" size="small" placeholder="搜索" />
              </template>
              <template #default="scope">
                <el-button
                  size="small"
                  @click="handleEdit(scope.$index, scope.row)"
                  >{{ scope.row.status == 2 ? "查看" : "审核" }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="checkCenter_pager">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[50, 100, 150, 200]"
              :small="small"
              :disabled="disabled"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="type3.length"
              @size-change="(e) => handleSizeChange(item, e)"
              @current-change="(e) => handleCurrentChange(item, e)"
            >
            </el-pagination>
          </div>
        </div>
        <div class="checkCenter_table" v-if="item === '快手'">
          <div class="checkCenter_table_title">{{ item }}</div>
          <el-table :data="type4" style="width: 100%">
            <el-table-column label="用户名" prop="name">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span>{{ scope.row.binding_count }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="用户id" prop="id" />
            <el-table-column label="状态" prop="status" />
            <el-table-column align="left">
              <template #header>
                <el-input v-model="search" size="small" placeholder="搜索" />
              </template>
              <template #default="scope">
                <el-button
                  size="small"
                  @click="handleEdit(scope.$index, scope.row)"
                  >{{ scope.row.status == 2 ? "查看" : "审核" }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="checkCenter_pager">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[50, 100, 150, 200]"
              :small="small"
              :disabled="disabled"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="type4.length"
              @size-change="(e) => handleSizeChange(item, e)"
              @current-change="(e) => handleCurrentChange(item, e)"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="outerVisible" title="审核信息">
    <template #default>
      <el-form :model="form" class="dialogForm" label-position="left">
        <el-form-item label="用户名:">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户id:">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="主页链接:">
          <el-input v-model="form.url" autocomplete="off" />
        </el-form-item>
        <el-form-item label="头像链接:">
          <el-input v-model="form.headurl" autocomplete="off" />
        </el-form-item>
        <el-form-item label="粉丝数:">
          <el-input v-model="form.fans" autocomplete="off" />
        </el-form-item>
        <el-form-item label="审核结果:">
          <el-select
            v-model="form.result"
            placeholder="选择审核结果"
            :disabled="form.result == '通过'"
          >
            <el-option label="通过" value="1" />
            <el-option label="不通过" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-dialog
        v-model="innerVisible"
        width="30%"
        title="Inner Dialog"
        append-to-body
      >
      </el-dialog>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="outerVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="nextAudit"
          v-if="form.result != '通过'"
        >
          确认审核
        </el-button>
        <el-button
          type="primary"
          @click="nextAudit"
          v-if="form.result == '通过'"
        >
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, onMounted, reactive } from "vue";
const User = ref({
  date: "",
  name: "",
  address: "",
});
import { useRouter } from "vue-router";
import {
  getAuthInfoListApi,
  adminUpdateAuthInfoApi,
} from "@/api/Allrequest.js";
const search = ref("");
// 当前页面用户id
const userID = ref("");
const router = useRouter();
// 平台类型
const types = ref(["抖音", "西瓜", "B站", "快手"]);
// 全部类型数据
const type1 = ref([]);
const type2 = ref([]);
const type3 = ref([]);
const type4 = ref([]);
const allTypes = reactive({
  douyin: [],
  xigua: [],
  bzhan: [],
  kuaishou: [],
});

// 获取单独用户的所有账号信息
const getuserDetail = () => {
  userID.value = router.currentRoute.value.query.user_id;
  for (let i = 0; i < types.value.length; i++) {
    let name = types.value[i];
    getAuthInfoListApi({
      app: types.value[i],
      user_id: userID.value,
      status: 1,
      index: 0,
      size: 50,
      search: "",
    }).then((res) => {
      if (name == "抖音") {
        type1.value = res.data;
        console.log("数据", type1.value);
      }
      if (name == "西瓜") {
        type2.value = res.data;
      }
      if (name == "B站") {
        type3.value = res.data;
      }
      if (name == "快手") {
        type4.value = res.data;
      }
    });
  }
};
onMounted(() => {
  getuserDetail();
});

// 返回上一页
const back = () => {
  window.history.back();
};
const form = reactive({
  name: "",
  id: "",
  url: "",
  headurl: "",
  fans: "",
  result: "通过",
  account_id: "",
});

const outerVisible = ref(false);
const innerVisible = ref(false);
// 编辑按钮
const handleEdit = (index, row) => {
  console.log("测试", row);
  form.name = row.username;
  form.id = row.uid;
  if (row.status == 2) {
    form.result = "通过";
  } else {
    form.result = "不通过";
  }
  form.url = row.homeUrl;
  form.headurl = row.headImg;
  form.fans = row.fans;
  form.account_id = row.account_id;
  outerVisible.value = true;
};
// 下一步
const nextAudit = () => {
  adminUpdateAuthInfoApi({
    account_id: parseInt(form.account_id),

    headImg: form.headurl,

    fans: parseInt(form.fans),
  }).then((res) => {
    outerVisible.value = false;
    location.reload(true);
  });
};
const handleDelete = (index, row) => {
  console.log(index, row);
};

// 分页器操作

// 列表数据
const list = ref([]);

const total = ref(0);
const currentPage = ref(1);
// 列表数下标
const startIndex = ref(0);
const currentIndex = ref(0);
const pageSize = ref(50);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

// 切换页数大小
const handleSizeChange = (item, e) => {
  pageSize.value = e;
  console.log(item);
  //   getImg();
};
// 切换页数
const handleCurrentChange = (item, e) => {
  scrollToTop();
  currentPage.value = e;
  console.log(item);
  console.log("当前页面", currentPage.value);
  if (e == 1) {
    // 当前图片的下标
    startIndex.value = 0;
  } else {
    startIndex.value =
      (currentPage.value - 1) * pageSize.value + currentIndex.value;
  }
  //   getImg();
};
</script>

<style lang="scss" scoped>
.dialogForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  :deep(.el-form-item) {
    min-width: 500px;
    display: flex;
    justify-content: space-between;
    .el-form-item__content {
      max-width: 400px;
    }
  }
}
.checkMain {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  .checkCenter {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    padding: 50px 0;
    box-sizing: border-box;
    .userInfo {
      width: 80%;
      display: flex;
      font-size: 30px;
      margin-top: 50px;
      justify-content: space-between;
      align-items: center;
      span:nth-of-type(2) {
        display: flex;
        align-items: center;
        font-size: 20px;
        margin-left: 30px;
        cursor: pointer;
      }
    }
    .checkCenter_item {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .checkCenter_pager {
        margin: 10px;
        display: flex;
        justify-content: center;
      }
      .checkCenter_table {
        width: 80%;
        margin: 30px 0;
        display: flex;
        flex-direction: column;
        .checkCenter_table_title {
          font-size: 26px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
