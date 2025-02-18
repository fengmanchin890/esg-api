<template>
  <div class="dashboard">
    <div class="chart-container">
      <ChartECharts ref="chartEChartsRef" />
    </div>
    <div class="usage-container">
      <div class="button-group">
        <el-button type="primary" class="select-button" @click="openDialog">
          Select
        </el-button>
        <el-button type="primary" class="select-button">
          Comparison
        </el-button>
      </div>
      <UsageWater />
      <UsageRecycledWater />
      <UsageEnergy />
      <UsageSolarEnergy />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ChartECharts from "@/components/ChartECharts.vue";
// import UsageWater from "@/components/Echarts/UsageWater.vue";
// import UsageRecycledWater from "@/components/Echarts/UsageRecycledWater.vue";
// import UsageEnergy from "@/components/Echarts/UsageEnergy.vue";
// import UsageSolarEnergy from "@/components/Echarts/UsageSolarEnergy.vue";

const chartEChartsRef = ref(null);
const openDialog = () => {
  chartEChartsRef.value.openDialog();
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

.usage-container {
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
