<template>
  <el-header class="header">
    <el-row class="header-row">
      <el-col :span="6" class="left-section">
        <div class="logo-container">
          <img
            src="@/assets/lai_yih_logo.png"
            alt="Lai Yih Logo"
            class="lai-yih-logo"
            @click="toggleCollapse"
          />
          <div class="company-text">
            <span class="company-name-main">
              <span class="green">L</span><span class="yellow">AI </span>
              <span class="green">Y</span><span class="yellow">IH</span>
            </span>
            <span class="company-name-sub">FOOTWEAR CO., LTD.</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="center-section">
        <span class="dashboard-title">ESG Dashboard</span>
      </el-col>
      <el-col :span="6" class="right-section">
        <div class="logo-company">
          <img src="@/assets/logo.png" alt="Factory Logo" class="logo" />
          <span class="company-name">{{ factory }}</span>
        </div>
        <el-dropdown trigger="click">
  <div class="user-info flex items-center cursor-pointer">
    <span class="user-icon-container">
      <img src="@/assets/user.png" alt="User Icon" class="user-icon" />
    </span>
    <span class="user-name select-none ml-2">{{ USERNAME }}</span>
  </div>
  <template #dropdown>
    <el-dropdown-menu class="custom-dropdown" divided>
      <el-dropdown-item @click="openLogoutDialog">
        <el-icon><switch-button /></el-icon>
        <span class="logout-text">Đăng xuất</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </template>
</el-dropdown>

      </el-col>
    </el-row>
    <LogoutConfirmation ref="logoutDialog" @confirm="logout" />
  </el-header>
</template>

<script setup>
import { ref } from "vue";
import useMainPage from "../hooks/useMainPage";
import useUser from "../hooks/useUser";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { SwitchButton } from "@element-plus/icons-vue";
import LogoutConfirmation from "@components/LoginPage/LogoutConfirmation.vue";

const { factory, userName, toggleCollapse } = useMainPage();
const { clearUserData } = useUser();
const router = useRouter();
const logoutDialog = ref(null);

const openLogoutDialog = () => {
  logoutDialog.value.open();
};

const USERNAME = localStorage.getItem("USERNAME");

const logout = () => {
  clearUserData();
  ElMessage.success("Logout successful!");
  router.push("/");
};
const observer = new ResizeObserver((entries) => {
  // requestAnimationFrame(() => {
  //   for (let entry of entries) {
  //     console.log("Resized:", entry.contentRect.width, entry.contentRect.height);
  //   }
  // });
});
observer.observe(document.body);
</script>


<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1000;
  border-bottom: 1px solid lightgray;
  color: gray;
  background: rgba(255, 255, 255, 0.1); /* 10% 透明 */
  backdrop-filter: blur(10px); /* 背景模糊效果 */
  transition: all 0.5s ease-in-out; /* 平滑過渡效果 */
}




.header-row {
  display: flex;
  align-items: center;
  height: 100%;
  
}

.left-section,
.center-section,
.right-section {
  display: flex;
  align-items: center;
  height: 100%;
}

.left-section {
  justify-content: flex-start;
  padding-left: 10px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lai-yih-logo {
  height: 70px;
  cursor: pointer;
  margin-left: -18px;
}

.company-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.company-name-main {
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
}

.company-name-sub {
  font-size: 10px;
  font-weight: 500;
  color: #2d5d34;
  text-transform: uppercase;
}

.green {
  color: #1d7731;
}

.yellow {
  color: #f4a900;
}

.center-section {
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
}

.dashboard-title {
  padding: 5px 15px;
  font-size: 24px;
}

.right-section {
  justify-content: flex-end;
  padding-right: 10px;
  gap: 10px;
}

.logo-company {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 20px;
}

.logo {
  height: 30px;
  
}

.company-name {
  font-size: 16px;
  font-weight: bold;
  margin-top: 2px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-icon-container {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.user-icon {
  width: 32px; 
  height: 32px;
}
.user-name {
  font-size: 16px;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
  color: gray;

}

@media (max-width: 768px) {
  .header {
    height: 70px;
  }
  .dashboard-title {
    font-size: 20px;
    -webkit-text-stroke: 0.6px green;
  }
}
</style>
