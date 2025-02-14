<template>
  <el-dialog v-model="showComparison" :style="{ width: '320px' }">
    <h1 class="title-choose">Comparison</h1>
    <div class="date-picker-container">
      <div class="picker-row">
        <div class="picker-group">
          <label class="picker-label">Start Month</label>
          <el-select v-model="selectedStartMonth" class="styled-select">
            <el-option
              v-for="month in availableMonths"
              :key="month.value"
              :label="month.label"
              :value="month.value"
            />
          </el-select>
        </div>
        <div class="picker-group">
          <label class="picker-label">End Month</label>
          <el-select v-model="selectedEndMonth" class="styled-select">
            <el-option
              v-for="month in availableMonths"
              :key="month.value"
              :label="month.label"
              :value="month.value"
            />
          </el-select>
        </div>
      </div>

      <div class="picker-row">
        <div class="picker-group">
          <label class="picker-label">Base Year</label>
          <el-select v-model="baseYear" class="styled-select">
            <el-option
              v-for="year in availableYears"
              :key="year"
              :label="year"
              :value="year"
            />
          </el-select>
        </div>
        <div class="picker-group">
          <label class="picker-label">Comparison Year</label>
          <el-select v-model="comparisonYear" class="styled-select">
            <el-option
              v-for="year in availableYears"
              :key="year"
              :label="year"
              :value="year"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="footer-buttons">
      <el-button type="primary" @click="confirmComparison">Apply</el-button>
      <el-button @click="showComparison = false">Cancel</el-button>
    </div>
  </el-dialog>
</template>
  
  <script setup>
import { ref } from "vue";
import { availableYears, availableMonths } from "@/hooks/useECharts-api";

// State variables
const showComparison = ref(false);
const selectedStartMonth = ref(
  new Date().getMonth().toString().padStart(2, "0")
);
const selectedEndMonth = ref("12");
const baseYear = ref(new Date().getFullYear().toString());
const comparisonYear = ref("");

const confirmComparison = () => {
  console.log(
    `Selected Start Month: ${selectedStartMonth.value}, End Month: ${selectedEndMonth.value}`
  );
  console.log(
    `Base Year: ${baseYear.value}, Comparison Year: ${comparisonYear.value}`
  );
  showComparison.value = false;
};
</script>
  
  <style scoped>
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
  text-align: center;
}

.styled-select {
  width: 100%;
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
  