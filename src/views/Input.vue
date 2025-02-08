<template>
  <div class="input-container">
    <WaterTable />
    <EnergyTable />
  </div>
</template>

<script setup>
import WaterTable from "../components/WaterTable.vue";
import EnergyTable from "../components/EnergyTable.vue";
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>