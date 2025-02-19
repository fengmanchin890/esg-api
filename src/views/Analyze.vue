<!-- views/Analyze.vue -->
<template>
  <div class="dashboard">
    <div class="chart-container">
      <ChartECharts ref="chartEChartsRef" @openComparison="openDialogComparison" />
      <Comparison
        ref="ComparisonRef"
        @applyComparisonData="handleComparisonData"
      />
    </div>
    <div class="usage-container">
      <UsageWaterMeter :comparisonData="comparisonData" />
      <UsageRecycledWater :comparisonData="comparisonData" />
      <UsageGridEnergy :comparisonData="comparisonData" />
      <UsageSolarEnergy :comparisonData="comparisonData" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ChartECharts from "@/components/ChartECharts.vue";
import Comparison from "@/components/Comparison.vue";

const chartEChartsRef = ref(null);
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: -30px -20px;
}

.chart-container {
  position: relative;
  background: #cfe2f0c5;
  padding: 20px;
  border-radius: 10px;
}

.usage-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}
</style>
