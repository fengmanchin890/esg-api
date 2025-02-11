<template>
  <div class="dashboard">
    <el-dialog v-model="showDatePicker">
      <h1 class="title-choose">Choose Date</h1>
      <div class="date-picker-container">
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

      <div class="footer-buttons">
        <el-button type="primary" @click="confirmSelection">Compare</el-button>
        <el-button @click="showDatePicker = false">Cancel</el-button>
      </div>
    </el-dialog>

    <div class="chart-container">
      <h2 class="title">Performance Dashboard</h2>
      <div ref="echart" class="chart"></div>
      <div class="chart-controls">
        <div class="left-buttons">
          <el-button type="primary" @click="toggleDatePicker"
            >Choose Date</el-button
          >
        </div>
        <div class="right-buttons">
          <el-button
            class="button-w"
            :class="{ active: activeFilter === 'all' }"
            @click="filterData('all')"
            >All</el-button
          >
          <el-button
            class="button-w"
            :class="{ active: activeFilter === 'water' }"
            @click="filterData('water')"
            >Water</el-button
          >
          <el-button
            class="button-w"
            :class="{ active: activeFilter === 'energy' }"
            @click="filterData('energy')"
            >Energy</el-button
          >
        </div>
      </div>
    </div>
    <br />
    <div class="usage-container">
      <div class="usage-card-water">
        <h3 class="title-water">
          <img src="@i/water.png" alt="water" class="icon" />Water Usage
          <span class="percent greentext">5% ↓</span>
        </h3>
        <div class="usage-content">
          <div class="usage-year">
            <p>Jan - Dec 2020</p>
            <div class="circle blue">5,660</div>
          </div>
          <div class="usage-year">
            <p>Jan - Dec 2021</p>
            <div class="circle green">5,377</div>
          </div>
        </div>
      </div>
      <div class="usage-card-energy">
        <h3 class="title-energy">
          <img src="@i/energy.png" alt="water" class="icon" />Energy Usage
          <span class="percent red">2% ↑</span>
        </h3>
        <div class="usage-content">
          <div class="usage-year">
            <p>Jan - Dec 2020</p>
            <div class="circle blue">10,200</div>
          </div>
          <div class="usage-year">
            <p>Jan - Dec 2021</p>
            <div class="circle green">10,404</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useECharts from "@/hooks/useECharts";

const echart = ref(null);
const activeFilter = ref("all");

const rawData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  energy: [45, 20, 55, 30, 70, 65, 60, 58, 55, 40, 50, 75.5],
  water: [30, 40, 25, 20, 60, 80, 75, 70, 65, 45, 35, 50],
};

const { updateChart } = useECharts(echart, rawData, activeFilter);

const filterData = (type) => {
  activeFilter.value = type;
};

const toggleDatePicker = () => {
  showDatePicker.value = true;
};

const showDatePicker = ref(false);
const selectedStartMonth = ref("01");
const selectedEndMonth = ref("12");
const baseYear = ref(new Date().getFullYear().toString());
const comparisonYear = ref(null);
const availableYears = ref(["2019", "2020", "2021", "2022", "2023", "2024"]);
const availableMonths = ref([
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
]);

const confirmSelection = () => {
  showDatePicker.value = false;
  console.log("Start Month:", selectedStartMonth.value);
  console.log("End Month:", selectedEndMonth.value);
  console.log("Base Year:", baseYear.value);
  console.log("Comparison Year:", comparisonYear.value);
};
</script>


<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 900px;
  margin-bottom: 10px;
}

.left-buttons,
.right-buttons {
  display: flex;
  gap: 10px;
}

.left-buttons .el-button {
  width: 100px;
}
.right-buttons button.active {
  background: #0288d1;
  color: white;
}

.chart-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  background: #cfe2f0c5;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.chart {
  height: 400px;
}

.chart-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.left-buttons,
.right-buttons {
  display: flex;
  gap: 10px;
}

.right-buttons button.active {
  background: #0288d1;
  color: white;
}

.usage-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 940px;
  flex-wrap: wrap;
}

.usage-card-water,
.usage-card-energy {
  flex: 1;
  max-width: 600px;
  background: rgba(173, 216, 230, 0.6);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.usage-card-water .circle {
  background: rgba(100, 181, 246, 0.8);
}

.usage-card-energy {
  background: rgba(255, 204, 128, 0.6);
}

.usage-card-energy .circle {
  background: rgba(255, 183, 77, 0.8);
}

.usage-content {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.usage-year {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title-water,
.title-energy {
  display: flex;
  justify-content: center;
  align-items: center;
}
.circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.percent {
  font-size: 18px;
  font-weight: bold;
  margin-left: 5px;
}

.greentext {
  color: green;
}

.red {
  color: red;
}

.title {
  color: #0055aa;
  font-size: 28px;
}

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}
.demo-date-picker .demonstration-energy {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  font-size: 28px;
  margin-bottom: 20px;
  color: rgb(100, 52, 6);
  font-weight: bold;
}

.icon {
  width: 30px;
  margin-right: 10px;
}

.button-w {
  width: 70px;
}

:deep(.el-dialog) {
  width: 400px !important;
  height: 470px !important;
  min-width: 200px !important;
  padding: 5px;
}

:deep(.el-dialog__body) {
  padding: 5px;
}

.title-choose {
  font-size: 30px;
  text-align: center;
  margin-top: 10px;
  color: #0055aa;
}

.demo-date-picker {
  display: flex;
  justify-content: center;
  padding: 5px;
}
.date-picker-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.picker-group {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
  margin-left: 19px;
}

.picker-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.styled-picker {
  width: 100%;
}

.styled-select {
  width: 94%;
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
