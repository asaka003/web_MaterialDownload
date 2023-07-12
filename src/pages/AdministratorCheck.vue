<template>
  <div class="checkMain">
    <div class="checkTop">用户授权信息列表 <span @click="back">返回</span></div>
    <div class="checkCenter">
      <div class="checkCenter_table">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="用户" prop="username" />
          <el-table-column label="注册时间" width="200">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{
                  msToDate(new Date(scope.row.create_time)).hasTime
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="总绑定账户数" prop="total_auth_bind" />
          <el-table-column label="抖音" prop="douyin">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ checkTypes(scope.row.binding_count, "抖音") }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="西瓜" prop="xigua">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ checkTypes(scope.row.binding_count, "西瓜") }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="B站" prop="bzhan">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ checkTypes(scope.row.binding_count, "B站") }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="快手" prop="kuaishou">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ checkTypes(scope.row.binding_count, "快手") }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="待审核" prop="wait_for_check" />
          <el-table-column align="left">
            <template #header>
              <el-input v-model="search" size="small" placeholder="搜索" />
            </template>
            <template #default="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
                >查看</el-button
              >
              <!-- <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
          >Delete</el-button
        > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="checkCenter_pager">
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
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { getAllUserAuthStatisticsApi } from "@/api/Allrequest.js";
const User = ref({
  date: "",
  name: "",
  address: "",
});
import { useRouter } from "vue-router";
const search = ref("");
const tableData = ref([]);
const filterTableData = computed(() =>
  tableData.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
);
// 检测平台绑定数
const checkTypes = (e, type) => {
  for (let i = 0; i < e.length; i++) {
    if (e[i].app === type) {
      return e[i].total;
    }
  }
  return 0;
};

//实现方法 @return 返回2个值，一个是带时分秒，另一个不带。
function msToDate(msec) {
  let datetime = new Date(msec);
  let year = datetime.getFullYear();
  let month = datetime.getMonth();
  let date = datetime.getDate();
  let hour = datetime.getHours();
  let minute = datetime.getMinutes();
  let second = datetime.getSeconds();

  let result1 =
    year +
    "-" +
    (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
    "-" +
    (date + 1 < 10 ? "0" + date : date) +
    " " +
    (hour + 1 < 10 ? "0" + hour : hour) +
    ":" +
    (minute + 1 < 10 ? "0" + minute : minute) +
    ":" +
    (second + 1 < 10 ? "0" + second : second);

  let result2 =
    year +
    "-" +
    (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
    "-" +
    (date + 1 < 10 ? "0" + date : date);

  let result = {
    hasTime: result1,
    withoutTime: result2,
  };

  return result;
}
// 获取用户授权列表数
const getUserList = () => {
  getAllUserAuthStatisticsApi({
    index: 0,
    size: 5,
    search: "",
  }).then((res) => {
    console.log(res);
    total.value = res.data.length;
    tableData.value = res.data;
  });
};
onMounted(() => {
  getUserList();
});

// 返回上一页
const back = () => {
  window.history.back();
};
const router = useRouter();
// 编辑按钮
const handleEdit = (index, row) => {
  router.push({ path: "/userdetail", query: { user_id: row.user_id } });
};
const handleDelete = (index, row) => {
  console.log(index, row);
};
// const tableData = [
//   {
//     date: "2016-05-03",
//     name: "Tom",
//     address: "No. 189, Grove St, Los Angeles",
//     allCount: 10,
//     douyin: 2,
//     xigua: 2,
//     bzhan: 4,
//     kuaishou: 2,
//     ToReviewed: 1,
//   },
//   {
//     date: "2016-05-02",
//     name: "John",
//     address: "No. 189, Grove St, Los Angeles",
//     allCount: 10,
//     douyin: 2,
//     xigua: 2,
//     bzhan: 4,
//     kuaishou: 2,
//     ToReviewed: 1,
//   },
//   {
//     date: "2016-05-04",
//     name: "Morgan",
//     address: "No. 189, Grove St, Los Angeles",
//     allCount: 11,
//     douyin: 2,
//     xigua: 2,
//     bzhan: 4,
//     kuaishou: 2,
//     ToReviewed: 1,
//   },
//   {
//     date: "2016-05-01",
//     name: "Jessy",
//     address: "No. 189, Grove St, Los Angeles",
//     allCount: 12,
//     douyin: 2,
//     xigua: 2,
//     bzhan: 4,
//     kuaishou: 2,
//     ToReviewed: 1,
//   },
// ];

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
const handleSizeChange = (e) => {
  pageSize.value = e;
  getUserList();
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
      (currentPage.value - 1) * pageSize.value + currentIndex.value;
  }
  getUserList();
};
</script>

<style lang="scss" scoped>
.checkMain {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  .checkCenter {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    .checkCenter_table {
      width: 80%;
      margin: 30px 0;
    }
  }
  .checkTop {
    width: 80%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 20px 0;
    box-sizing: border-box;
    font-size: 50px;
    font-weight: bold;
    span {
      font-size: 20px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
}
</style>
