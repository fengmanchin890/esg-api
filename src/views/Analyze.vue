<template>
  <div class="dashboard">
    <div class="chart-container">
      <h2 class="title">Performance Dashboard</h2>
      <div ref="echart" class="chart"></div>
    </div>

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
        <br />
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
        <br />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useChart } from "@/hooks/useChart.js";

const echart = ref(null);
const activeFilter = ref("all");

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

const { updateChart } = useChart(echart, rawData, activeFilter);

const filterData = (type) => {
  activeFilter.value = type;
  updateChart();
};
</script><style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin-left: -64px;
  margin-top: -20px;
}

.chart-container {
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

.usage-container {
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: #003366;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  width: 100%;
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
  border: 3px solid rgba(255, 255, 255, 0.8);
  padding: 10px;
  text-align: center;
  line-height: 1.2;
}

.usage-card-water {
  background: rgba(173, 216, 230, 0.6);
  color: #003366;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.usage-card-water .circle {
  background: rgba(100, 181, 246, 0.8);
  color: #003366;
}

.usage-card-energy {
  background: rgba(255, 204, 128, 0.6);
  color: #7a3200;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.usage-card-energy .circle {
  background: rgba(255, 183, 77, 0.8);
  color: #7a3200;
}

.usage-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: 20px;
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

.title {
  background: linear-gradient(to right, #0055aa, #1f88d3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  font-size: 28px;
  margin: 0 -10px;
  padding: 5px 15px;
  display: inline-block;
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
</style>