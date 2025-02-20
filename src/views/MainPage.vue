<!-- views/MainPage.vue -->
<template>
  <el-container class="app-container">
      <Header />
    <el-container class="content-container">
      <el-aside class="aside-menu">
        <VerticalMenu />
      </el-aside>
      <el-main class="main-content">
        <router-view />
      </el-main>
      <Footer></Footer>
    </el-container>
  </el-container>
</template>

<script setup>
import Header from "@components/Header.vue";
import VerticalMenu from "@components/VerticalMenu.vue";
import Footer from "../components/Footer.vue";
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content-container {
  display: flex;
  flex: 1;
  margin-top: 60px;
  overflow: hidden;
}

.aside-menu {
  background-color: lightgrey;
  width: fit-content;
  color: white;
  height: 100%;
}

.main-content {
  flex: 1;
  padding: 25px;
  overflow: auto;
  background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
}
</style>