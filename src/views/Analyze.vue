<template>
  <div class="dashboard">
    <div class="chart-container">
      <ChartECharts />
    </div>
    <div class="usage-container">
      <UsageWater />
      <UsageEnergy />
    </div>
  </div>
</template>

<script setup>
import ChartECharts from "@/components/ChartECharts.vue";
</script>

<style scoped>
.dashboard {
  position: relative;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  margin-top: -30px;
}

.chart-container {
  flex: 7;
  max-width: 70%;
  /* height: 1800px;  */
}

.usage-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 3;
  max-width: 30%;
}
</style>

