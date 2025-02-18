<template>
    <el-dialog v-model="showDialog" :style="{ width: '330px' } ">
      <h1 class="title-choose">Select Options</h1>
      <div class="picker-container">
        <div class="picker-group">
          <label class="picker-label">Category</label>
          <el-select v-model="tempCategory" class="styled-select">
            <el-option
              label="Tap Water Meter and Recycled Water Meter"
              value="water-recycledwater"
            />
            <el-option
              label="Grid Energy and Solar Energy"
              value="energy-solarenergy"
            />
          </el-select>
        </div>
        <div class="picker-group">
          <label class="picker-label">Factory</label>
          <el-select v-model="selectedFactory" class="styled-select">
            <el-option
              v-for="factory in factoryList"
              :key="factory.value"
              :label="factory.label"
              :value="factory.value"
            />
          </el-select>
        </div>
        <div class="picker-group">
          <label class="picker-label">Year</label>
          <el-date-picker
            style="width: 100%"
            v-model="tempYear"
            type="year"
            placeholder="Select Year"
            format="YYYY"
            value-format="YYYY"
            clearable
          />
        </div>
      </div>
      <div class="footer-buttons">
        <el-button type="primary" @click="applySelection">Apply</el-button>
        <el-button @click="showDialog = false">Cancel</el-button>
      </div>
    </el-dialog>
  
    <div class="chart-container">
      <div class="button-group">
        <div class="left-buttons-top"></div>
        <div class="right-buttons-top"></div>
      </div>
  
      <div class="header-container">
        <h2 class="title">Performance Dashboard</h2>
        <div class="interface">
          <span class="info-label">Factory:</span>
          <span class="info-value">{{ factoryTitle }}</span>
          <span class="separator">|</span>
          <span class="info-label">Year:</span>
          <span class="info-value">{{ yearTitle }}</span>
        </div>
      </div>
      <div ref="echart" class="chart"></div>
      <div class="chart-controls">
        <div class="left-buttons-bottom"></div>
        <div class="right-buttons-bottom">
          <el-button type="primary" class="button-echarts" @click="openDialog">
            Select
          </el-button>
        </div>
      </div>
    </div>
  </template>
<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import useECharts from "@/hooks/useECharts";
import {
  rawData,
  factoryList,
  useEChartsData,
  initData,
} from "@/hooks/useECharts-api";

const echart = ref(null);
const selectedFactory = ref(
  localStorage.getItem("DB_CHOICE2") &&
    localStorage.getItem("DB_CHOICE2") !== "undefined"
    ? localStorage.getItem("DB_CHOICE2").trim()
    : localStorage.getItem("DB_CHOICE")?.trim() || "Unknown"
);
const selectedCategory = ref(
  localStorage.getItem("CATEGORY") || "water-recycledwater"
);
const tempCategory = ref(selectedCategory.value);

const selectYear = ref(
  localStorage.getItem("YEAR") || new Date().getFullYear().toString()
);
const tempYear = ref(selectYear.value);

const showDialog = ref(false);

// Chuyển factoryTitle từ computed sang ref
const factoryTitle = ref("");

const updateFactoryTitle = () => {
  const mapping = {
    LYV: "Ty Bach",
    LYS: "Ty Thac",
    LYN: "Ty Xuan",
  };
  factoryTitle.value = mapping[selectedFactory.value] || selectedFactory.value;
};

// Theo dõi sự thay đổi của selectedFactory để cập nhật factoryTitle
watch(selectedFactory, updateFactoryTitle, { immediate: true });

const yearTitle = ref(selectYear.value);

const { updateChart } = useECharts(
  echart,
  selectedFactory,
  selectYear,
  selectedCategory,
  rawData,
  factoryTitle
);

onMounted(async () => {
  await initData();
  await applySelection();
});

watch([selectedFactory, selectYear], () => {
  localStorage.setItem("DB_CHOICE2", selectedFactory.value);
  localStorage.setItem("YEAR", selectYear.value);
});

const openDialog = () => {
  tempYear.value = selectYear.value;
  showDialog.value = true;
};

const applySelection = async () => {
  showDialog.value = false;
  selectedCategory.value = tempCategory.value;
  selectYear.value = tempYear.value;

  localStorage.setItem("CATEGORY", selectedCategory.value);
  localStorage.setItem("YEAR", selectYear.value);

  try {
    await useEChartsData(selectedFactory.value, Number(selectYear.value));
    await nextTick();
    updateChart(
      selectedFactory.value,
      selectYear.value,
      selectedCategory.value
    );

    // factoryTitle.value = selectedFactory.value; 
    yearTitle.value = selectYear.value;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API:", error);
  }
};

onMounted(async () => {
  await applySelection();
});
</script>

  
  
  <style scoped>
  .button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 900px;
    margin: 0 auto;
    padding: 10px 0;
  }
  
  .interface {
    gap: 5px;
    align-items: center;
    text-align: center;
  }
  
  .right-buttons-bottom {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .el-button {
    min-width: 80px;
    text-align: center;
    padding: 8px 12px;
  }
  .chart-container {
    position: relative;
    max-width: 100%;
    background: #cfe2f0c5;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }
  .chart {
    width: 100%;
    height: 705px;
  }
  .chart-controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    width: 85%;
    pointer-events: none;
  }
  .chart-controls button {
    pointer-events: auto;
  }
  .button-echarts {
    width: 90px;
    padding: 8px 12px;
  }
  .title {
    color: #0055aa;
    font-size: 28px;
    margin-bottom: 10px;
    margin-top: -20px;
  }
  .button-w,
  .factory-pd {
    width: 65px;
    background-color: #fff;
    color: #333;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }
  .button-w.active,
  .factory-pd.active {
    background-color: #0288d1;
    color: white;
    font-weight: bold;
  }
  :deep(.el-dialog) {
    max-width: 90%;
    border-radius: 12px;
    padding: 12px;
  }
  :deep(.el-dialog__body) {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .title-choose {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    color: #0055aa;
    margin-bottom: 20px;
    margin-top: -10px;
  }
  .date-picker-container,
  .picker-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .picker-row {
    display: flex;
    gap: 20px;
  }
  .picker-group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .picker-label {
    font-size: 13px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
    text-align: left;
  }
  .styled-select {
    width: 100%;
    text-align: center;
  }
  .footer-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
  }
  .footer-buttons .el-button {
    flex: 1;
    font-size: 14px;
  }
  .info-label {
    font-weight: bold;
    color: #0055aa;
  }
  .info-value {
    margin: -55px 5px;
    color: #333;
  }
  .separator {
    margin: 0 13px 0 5px;
    color: #251010;
  }
  </style>
  