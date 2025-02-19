<!-- views/Analyze.vue -->
<template>
  <div class="dashboard">
    <div class="chart-container">
      <ChartECharts ref="chartEChartsRef" />
      <Comparison ref="ComparisonRef" @applyComparisonData="handleComparisonData" />
    </div>
    <div class="Comparison-container">
      <div class="button-group">
        <el-button type="primary" class="select-button" @click="openDialogECharts">
          Select
        </el-button>
        <el-button type="primary" class="select-button" @click="openDialogComparison">
          Comparison
        </el-button>
      </div>
      <UsageWaterMeter :comparisonData="comparisonData" />
      <UsageRecycledWater />
      <UsageGridEnergy />
      <UsageSolarEnergy />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ChartECharts from "@/components/ChartECharts.vue";
import Comparison from "@/components/Comparison.vue";

const chartEChartsRef = ref(null);
const openDialogECharts = () => {
  chartEChartsRef.value.openDialogECharts();
};

const ComparisonRef = ref(null);
const openDialogComparison = () => {
  ComparisonRef.value.openDialogComparison();
};

const comparisonData = ref({});

const handleComparisonData = (data) => {
  console.log("Dữ liệu nhận được từ Comparison:", data);
  comparisonData.value = data;
};
</script>


<style scoped>
.dashboard {
  position: relative;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  margin: -25px 0 -20px -20px;
}

.chart-container {
  flex: 8;
  max-width: 80%;
}

.Comparison-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 2;
  max-width: 20%;
}

.button-group {
  display: flex;
  gap: 10px;
}

.select-button {
  flex: 1;
}
</style>
