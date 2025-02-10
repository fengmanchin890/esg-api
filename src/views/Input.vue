<template>
  <div class="input-container">
    <template v-if="route.path === '/mainPage/input'">
      <WaterTable />
      <EnergyTable />
    </template>
    <router-view v-else/>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import WaterTable from "../components/WaterTable.vue";
import EnergyTable from "../components/EnergyTable.vue";

const route = useRoute();
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>