<template>
  <!-- Filter Dialog -->
  <el-dialog v-model="showDialog" :style="{ width: '250px' }">
    <h1 class="title-choose">Select Options</h1>
    <div class="picker-container">
      <div class="picker-group">
        <label class="picker-label">Category</label>
        <el-select v-model="tempCategory" class="styled-select">
          <el-option label="Water-Recycledwater" value="water-recycledwater" />
          <el-option label="Energy-Solarenergy" value="energy-solarenergy" />
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
        <el-select v-model="chooseYear" class="styled-select">
          <el-option
            v-for="year in availableYears"
            :key="year"
            :label="year"
            :value="year"
          />
        </el-select>
      </div>
    </div>
    <div class="footer-buttons">
      <el-button type="primary" @click="applySelection">Apply</el-button>
      <el-button @click="showDialog = false">Cancel</el-button>
    </div>
  </el-dialog>

  <!-- Chart -->
  <div class="chart-container">
    <div class="button-group">
      <div class="left-buttons-bottom"></div>
      <div class="right-buttons-top"></div>
    </div>

    <h2 class="title">Performance Dashboard</h2>
    <div ref="echart" class="chart"></div>
    <div class="chart-controls">
      <div class="left-buttons-bottom"></div>
      <div class="right-buttons-bottom">
        <el-button
          type="primary"
          class="button-echarts"
          @click="showDialog = true"
          >Filter</el-button
        >
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
  availableYears,
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

const chooseYear = ref(
  localStorage.getItem("YEAR") || new Date().getFullYear().toString()
);

const showDialog = ref(false);

const { updateChart } = useECharts(
  echart,
  selectedFactory,
  chooseYear,
  selectedCategory,
  rawData
);

onMounted(async () => {
  await initData();
  await applySelection();
});

watch([selectedFactory, chooseYear], () => {
  localStorage.setItem("DB_CHOICE2", selectedFactory.value);
  localStorage.setItem("YEAR", chooseYear.value);
});

const applySelection = async () => {
  showDialog.value = false;

  selectedCategory.value = tempCategory.value;
  localStorage.setItem("CATEGORY", selectedCategory.value);

  try {
    await useEChartsData(selectedFactory.value, Number(chooseYear.value));

    await nextTick();

    const chartData = rawData.value[selectedFactory.value]?.[chooseYear.value];

    if (chartData && Object.keys(chartData).length > 0) {
      updateChart(
        selectedFactory.value,
        chooseYear.value,
        selectedCategory.value
      );
    } else {
      updateChart(
        selectedFactory.value,
        chooseYear.value,
        selectedCategory.value
      );
    }
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

.right-buttons-bottom,
.left-buttons-bottom,
.right-buttons-top {
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
  width: 100%; 
  max-width: 90%; 
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
  width: 80%;
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
</style>