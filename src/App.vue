<template>
  <topBar></topBar>
  <el-container>
    <el-aside class="aside"><asideMenu></asideMenu></el-aside>
    <el-main style="margin-left: 15%"><router-view/></el-main>
  </el-container>

</template>
<script setup>
import asideMenu from "@/components/asideMenu.vue";
import topBar from "@/components/topBar.vue";
// import asideBar from "@/components/asideBar.vue";
</script>

<style scoped>
.aside{
  width: 15%;
  height: 100%;
  overflow: auto;
  border-right: solid 3px var(--el-menu-border-color);
  position: fixed;
  margin-top: 50px;
}
</style>
