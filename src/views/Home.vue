<template>
  <div class="home">
    <el-container>
      <el-header class="fixed-header"><Header /></el-header>
      <el-container class="content">
        <el-aside class="sidebar" width="120px"><Navbar /></el-aside>
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Header from "@components/Header.vue";
import Navbar from "@/components/Navbar.vue";
</script>

<style scoped>
.home {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #98e98d;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.content {
  display: flex;
  margin-top: 60px;
  height: calc(100vh - 60px);
  width: 100%;
}

.sidebar {
  background-color: aquamarine;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  overflow: auto;
}
</style>