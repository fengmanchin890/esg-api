<template>
  <div class="dashboard">
    <div class="chart-container">
      <h2 class="title">Performance Dashboard</h2>
      <div class="chart-header">
        <div class="year-selector">
          <label for="year">Select Year:</label>
          <select
            id="year"
            v-model="selectedYear"
            @change="updateChart"
            class="custom-select"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div class="filter-buttons">
          <button
            @click="filterData('all')"
            :class="{ active: activeFilter === 'all' }"
          >
            All
          </button>
          <button
            @click="filterData('water')"
            :class="{ active: activeFilter === 'water' }"
          >
            Water
          </button>
          <button
            @click="filterData('energy')"
            :class="{ active: activeFilter === 'energy' }"
          >
            Energy
          </button>
        </div>
      </div>
      <div ref="echart" class="chart"></div>
    </div>

    <div class="usage-container">
      <div class="usage-card">
        <h3>Water Usage <span class="percent greentext">5% ↓</span></h3>
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

      <div class="usage-card">
        <h3>Energy Usage <span class="percent red">2% ↑</span></h3>
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
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const echart = ref(null);
const activeFilter = ref("all");
const selectedYear = ref(2021);
const years = [2020, 2021, 2022];

const rawData = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  energy: [45, 20, 55, 30, 70, 65, 60, 58, 55, 40, 50, 75],
  water: [30, 40, 25, 20, 60, 80, 75, 70, 65, 45, 35, 50],
};

let chart = null;

const initChart = () => {
  chart = echarts.init(echart.value);
  updateChart();
};

const updateChart = () => {
  const { months, energy, water } = rawData;
  const seriesData = [];

  if (activeFilter.value === "all" || activeFilter.value === "energy") {
    seriesData.push({
      name: "Energy",
      type: "bar",
      data: energy,
      itemStyle: { color: "rgba(144, 238, 144, 0.8)" },
    });
  }

  // if (activeFilter.value === "all" || activeFilter.value === "water") {
  //   seriesData.push({
  //     name: "Water",
  //     type: "line",
  //     data: water,
  //     smooth: true,
  //     itemStyle: { color: "rgba(30, 144, 255, 1)" },
  //   });
  // }

  if (activeFilter.value === "all" || activeFilter.value === "water") {
    seriesData.push({
      name: "Water",
      type: "line",
      data: water,
      smooth: true,
      itemStyle: { color: "rgba(30, 144, 255, 1)" },
      lineStyle: { width: 3 },
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: 'rgba(30, 144, 255, 1)',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 2,
      }
    });
}

  const option = {
    tooltip: { trigger: "axis" },
    legend: { data: ["Energy", "Water"] },
    xAxis: {
      type: "category",
      data: months,
      axisLabel: { interval: 0 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 80,
      interval: 20,
      axisLabel: { fontWeight: "bold" },
      splitLine: {
        lineStyle: {
          color: "rgba(39, 183, 226, 0.349)",
          width: 1.5,
        },
      },
      name: "USAGE",
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        fontSize: 16,
        fontWeight: "bold",
        rotate: 90,
      },
    },
    series: seriesData,
  };

  chart.setOption(option);
};

const filterData = (type) => {
  activeFilter.value = type;
  updateChart();
};

onMounted(() => {
  initChart();
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin-left:-64px;
}

.chart-container {
  width: 100%;
  max-width: 1200px;
  background: #e3f2fd;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.year-selector {
  display: flex;
  align-items: center;
}

.year-selector label {
  margin-right: 10px;
}

.year-selector select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #4fc3f7;
  background: #f0f4f8;
  color: #333;
  font-weight: bold;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"%3E%3Cpolygon points="6 9 12 15 18 9"/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px;
  transition: border-color 0.2s;
}

.year-selector select:hover {
  border-color: #0288d1;
}

.year-selector select:focus {
  border-color: #0288d1;
  outline: none;
}

.filter-buttons {
  display: flex;
  gap: 10px;
}

.filter-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #4fc3f7;
  color: white;
  font-weight: bold;
  transition: background 0.3s;
}

.filter-buttons button:hover {
  background: #0288d1;
}

.filter-buttons .active {
  background: #0288d1;
  color: white;
}

.chart {
  height: 300px;
}

.usage-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  max-width: 1200px;
  flex-wrap: wrap;
}

.usage-card {
  flex: 1;
  text-align: center;
  min-width: 250px;
  max-width: 300px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .usage-container {
    flex-direction: column;
    align-items: center;
  }

  .usage-card {
    width: 100%;
    max-width: 400px;
  }

  .circle {
    width: 60px;
    height: 60px;
    font-size: 16px;
  }

  .usage-year {
    padding: 10px;
  }
}

.usage-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: 20px;
  text-align: center;
}

.usage-year {
  flex: 1;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.usage-year p {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
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
}

.blue {
  background: #64b5f6;
  color: white;
}

.green {
  background: #81c784;
  color: rgb(11, 68, 4);
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

.custom-select {
  width: 80px;
}

.title {
  background: linear-gradient(to right, #003366, #1a87cf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(2, 28, 54, 0.7);
  font-weight: bold;
  font-size: 28px;
}

</style>