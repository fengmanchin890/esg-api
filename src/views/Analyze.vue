<template>
  <div class="dashboard">
    <ChartECharts />
    <br />
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
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: -30px;
  margin-left: -64px;
}

.usage-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 940px;
  flex-wrap: wrap;
}
</style>
