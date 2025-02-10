<template>
  <div class="dashboard">
    <div class="chart-container">
      <div class="chart-header">
        <h2>Performance dashboard</h2>
        <div class="filter-buttons">
          <button @click="filterData('all')" :class="{ active: activeFilter === 'all' }">All</button>
          <button @click="filterData('water')" :class="{ active: activeFilter === 'water' }">Water</button>
          <button @click="filterData('energy')" :class="{ active: activeFilter === 'energy' }">Energy</button>
        </div>
      </div>
      <div ref="echart" class="chart"></div>
    </div>

    <div class="usage-container">
      <div class="usage-card">
        <h3>Water usage <span class="percent green">5% ↓</span></h3>
        <div class="usage-content">
          <div class="usage-year">
            <p>Jan - Dec 2020</p>
            <div class="circle blue">5 660</div>
          </div>
          <span class="vs">vs</span>
          <div class="usage-year">
            <p>Jan - Dec 2021</p>
            <div class="circle green">5 377</div>
          </div>
        </div>
      </div>

      <div class="usage-card">
        <h3>Energy usage <span class="percent red">2% ↑</span></h3>
        <div class="usage-content">
          <div class="usage-year">
            <p>Jan - Dec 2020</p>
            <div class="circle blue">10 200</div>
          </div>
          <span class="vs">vs</span>
          <div class="usage-year">
            <p>Jan - Dec 2021</p>
            <div class="circle green">10 404</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const echart = ref(null)
const activeFilter = ref('all')

const rawData = {
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  energy: [45, 20, 55, 30, 70, 65, 60, 58, 55, 40, 50, 75],
  water: [30, 40, 25, 20, 60, 80, 75, 70, 65, 45, 35, 50]
}

let chart = null

const initChart = () => {
  chart = echarts.init(echart.value)
  updateChart()
}

const updateChart = () => {
  const { months, energy, water } = rawData
  const seriesData = []

  if (activeFilter.value === 'all' || activeFilter.value === 'energy') {
    seriesData.push({
      name: 'Energy',
      type: 'bar',
      data: energy,
      itemStyle: { color: 'rgba(144, 238, 144, 0.8)' }
    })
  }

  if (activeFilter.value === 'all' || activeFilter.value === 'water') {
    seriesData.push({
      name: 'Water',
      type: 'line',
      data: water,
      smooth: true,
      itemStyle: { color: 'rgba(30, 144, 255, 1)' }
    })
  }

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Energy', 'Water'] },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: seriesData
  }

  chart.setOption(option)
}

const filterData = (type) => {
  activeFilter.value = type
  updateChart()
}

onMounted(() => {
  initChart()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.chart-container {
  width: 80%;
  background: #e3f2fd;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-buttons button {
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #b3e5fc;
}

.filter-buttons .active {
  background: #0288d1;
  color: white;
}

.chart {
  height: 300px;
  margin-top: 10px;
}

.usage-container {
  display: flex;
  gap: 20px;
}

.usage-card {
  width: 300px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.usage-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.usage-year {
  text-align: center;
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

.blue { background: #64b5f6; color: white; }
.green { background: #81c784; color: black; }

.percent {
  font-size: 14px;
  font-weight: bold;
}

.green { color: green; }
.red { color: red; }
</style>
