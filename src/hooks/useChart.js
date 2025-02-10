// hooks/useChart.js
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

export const useChart = (echartRef, rawData, activeFilter) => {
  const chart = ref(null);

  const initChart = () => {
    chart.value = echarts.init(echartRef.value);
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

    if (activeFilter.value === "all" || activeFilter.value === "water") {
      seriesData.push({
        name: "Water",
        type: "line",
        data: water,
        smooth: true,
        itemStyle: {
          color: "rgba(30, 144, 255, 1)",
          borderColor: "rgba(255, 255, 255, 1)",
          borderWidth: 2,
        },
        lineStyle: { width: 3 },
        symbol: "circle",
        symbolSize: 8,
      });
    }
    
    const option = {
      tooltip: { trigger: "axis" },
      legend: {
        data: ["Energy", "Water"],
        textStyle: {
          color: "#333",
          fontWeight: "bold",
        },
      },
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
      },
      series: seriesData,
    };

    chart.value.setOption(option);
  };

  onMounted(() => {
    initChart();
  });

  return { updateChart };
};