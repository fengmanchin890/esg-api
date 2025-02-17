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
  padding: 20px;
}

.chart-container {
  display: flex;
}

.usage-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
