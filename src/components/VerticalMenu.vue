<template>
  <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" :default-active="activeIndex">
    <!-- Input 頁面 -->
    <el-sub-menu index="1" @click="navigateTo('/mainPage/input')">
      <template #title>
        <el-icon>
          <Edit />
        </el-icon>
        <span>Input</span>
      </template>
      <el-menu-item index="1-1" @click="navigateTo('/mainPage/input/water')">Water</el-menu-item>
      <el-menu-item index="1-2" @click="navigateTo('/mainPage/input/energy')">Energy</el-menu-item>
    </el-sub-menu>
    
    <!-- Analyze 頁面 -->
    <el-menu-item index="2" @click="navigateTo('/mainPage/analyze')">
      <el-icon>
        <DataAnalysis />
      </el-icon>
      <template #title>Analyze</template>
    </el-menu-item>

    <!-- 設定 -->
    <el-menu-item index="3" @click="navigateTo('/mainPage/settings')">
      <el-icon>
        <Setting />
      </el-icon>
      <template #title>Settings</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Edit, DataAnalysis, Setting } from "@element-plus/icons-vue";
import useMainPage from "../hooks/useMainPage";

const { isCollapse } = useMainPage();
const router = useRouter();
const route = useRoute();

// 根據當前路徑動態計算 activeIndex
const activeIndex = computed(() => {
  if (route.path.includes("/mainPage/input/water")) return "1-1";
  if (route.path.includes("/mainPage/input/energy")) return "1-2";
  if (route.path.includes("/mainPage/input")) return "1";
  if (route.path.includes("/mainPage/analyze")) return "2";
  if (route.path.includes("/mainPage/settings")) return "3";
  return "1";
});

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
