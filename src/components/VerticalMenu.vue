<!-- components/VerticalMenu.vue -->
<template>
  <el-menu
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    :default-active="activeIndex"
  >
    <!-- Input page -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon @click="navigateTo('/mainPage/input')">
          <Edit />
        </el-icon>
        <span @click="navigateTo('/mainPage/input')">{{ $t('menu.input') }}</span>
      </template>
      <el-menu-item
        class="first-menu-item"
        index="1-1"
        @click="navigateTo('/mainPage/input/water')"
      >
        <img
          src="@/assets/water.png"
          alt="icon_water"
          style="width: 24px; margin: 0px 8px 0 -30px"
        />
        {{ $t('menu.inputWater') }}
      </el-menu-item>
      <el-menu-item
        class="second-menu-item"
        index="1-2"
        @click="navigateTo('/mainPage/input/energy')"
      >
        <img
          src="@/assets/energy.png"
          alt="icon_energy"
          style="width: 24px; margin: 0px 8px 0 -30px"
        />
        {{ $t('menu.inputElectricity') }}
      </el-menu-item>
    </el-sub-menu>

    <!-- Analyze page -->
    <el-menu-item index="2" @click="navigateTo('/mainPage/analyze')">
      <el-icon>
        <DataAnalysis />
      </el-icon>
      <template #title>{{ $t('menu.dataAnalysis') }}</template>
    </el-menu-item>

    <!-- Settings -->
    <el-menu-item index="3" @click="navigateTo('/mainPage/settings')">
      <el-icon>
        <Setting />
      </el-icon>
      <template #title>{{ $t('menu.settings') }}</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Edit, DataAnalysis, Setting } from "@element-plus/icons-vue";
import useMainPage from "../hooks/useMainPage";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { isCollapse } = useMainPage();
const router = useRouter();
const route = useRoute();

// Tính toán activeIndex dựa trên route hiện tại
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

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
  background-color: white;
  color: #fff;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
}
.first-menu-item,
.second-menu-item {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}
</style>
