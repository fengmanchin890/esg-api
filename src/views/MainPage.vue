<template>
    <el-container class="app-container">
      <!-- 固定 Header -->
      <el-header class="fixed-header">
        <Header />
      </el-header>
  
      <!-- 主體區域：側邊欄 + 內容 -->
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
  /* 整個頁面高度 100vh */
  .app-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* 固定 Header */
  .fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 1000;
    background: white;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  /* 讓 Header 下方的內容區域填滿剩餘空間 */
  .content-container {
    display: flex;
    flex: 1;
    margin-top: 60px; /* 確保 Header 不會遮擋內容 */
    overflow: hidden;
  }
  
  /* 側邊選單 */
  .aside-menu {
    background-color:lightgrey;
    width: fit-content;
    color: white;
    height: 100%;
  }
  
  /* 主要內容區域 */
  .main-content {
    flex: 1;
    padding: 20px;
    overflow: auto;
    background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
  }
  </style>
  