<template>
  <el-header class="header">
    <el-row class="header-row">
      <el-col :span="6" class="left-section">
        <div class="logo-container">
          <img
            src="@/assets/lai_yih_logo.png"
            alt="Lai Yih Logo"
            class="lai-yih-logo"
            @click="toggleCollapse()"
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
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <span class="company-name">{{ factory }}</span>
        </div>
        <div class="user-info">
          <img src="@/assets/user.png" alt="User" class="user-icon" />
          <span class="user-name">{{ userName }}</span>
        </div>
      </el-col>
    </el-row>
  </el-header>
</template>

<script setup>
import useMainPage from '../hooks/useMainPage';
const { factory, userName, toggleCollapse } = useMainPage();

</script>




<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 1000;
  background-image: linear-gradient(to right, #07ef8a 0%, #0f6b03 100%);
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
  color: white;
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
  height: 40px;
}

.company-name {
  font-size: 16px;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-icon {
  height: 35px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
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