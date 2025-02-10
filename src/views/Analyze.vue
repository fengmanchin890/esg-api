<template>
  <div class="dashboard">
    <el-dialog v-model="showDatePicker" title="Choose Date">
      <div class="demo-date-picker">
        <div class="block">
          <span class="demonstration-water">
            <img src="@i/water.png" alt="water" class="icon" />Water</span
          >
          <el-date-picker
  v-model="value1"
  type="monthrange"
  range-separator="To"
  start-placeholder="Start month"
  end-placeholder="End month"
/>
        </div>
        <div class="block">
          <span class="demonstration-energy"
            ><img src="@i/energy.png" alt="water" class="icon" />Energy</span
          >
          <el-date-picker
  v-model="value2"
  type="monthrange"
  unlink-panels
  range-separator="To"
  start-placeholder="Start month"
  end-placeholder="End month"
  :shortcuts="shortcuts"
/>
        </div>
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
          <el-button type="success">Comparison</el-button>
        </div>
        <div class="right-buttons">
          <el-button
            :class="{ active: activeFilter === 'all' }"
            @click="filterData('all')"
            >All</el-button
          >
          <el-button
            :class="{ active: activeFilter === 'water' }"
            @click="filterData('water')"
            >Water</el-button
          >
          <el-button
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
          Water Usage <span class="percent greentext">5% ↓</span>
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
          Energy Usage <span class="percent red">2% ↑</span>
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
const showDatePicker = ref(false);

const rawData = {
  months: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  energy: [45, 20, 55, 30, 70, 65, 60, 58, 55, 40, 50, 75.5],
  water: [30, 40, 25, 20, 60, 80, 75, 70, 65, 45, 35, 50],
};

const { updateChart } = useECharts(echart, rawData, activeFilter);

const filterData = (type) => {
  activeFilter.value = type;
  // console.log("Active filter changed to:", activeFilter.value);
};

const toggleDatePicker = () => {
  showDatePicker.value = true;
};

const value1 = ref("");
const value2 = ref("");

const shortcuts = [
  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
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
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration-water {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  font-size: 28px;
  margin-bottom: 20px;
  color: rgb(24, 110, 180);
  font-weight: bold;
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
</style>
