<template>
  <div class="dashboard">
    <div class="chart-container">
      <ChartECharts />
    </div>
    <div class="usage-container">
      <UsageWater />
      <UsageRecycledWater />
      <UsageEnergy />
      <UsageSolarEnergy />
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
  /* margin-top: -15px; */
  margin: -15px 0 -20px -10px;
}

.chart-container {
  flex: 8;
  max-width: 80%;
  /* height: 1800px;  */
}

.usage-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 2;
  max-width: 20%;
}
</style>

