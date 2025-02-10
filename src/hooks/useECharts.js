// hooks/useECharts.js
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";

export default function useECharts(echartRef, rawData, activeFilter) {
  let chart = null;

  const initChart = () => {
    if (echartRef.value) {
      chart = echarts.init(echartRef.value);
      updateChart();
    }
  };

  const updateChart = () => {
    if (!chart) return;
  
    const { months, energy, water } = rawData;
    const seriesData = [];
    const legendData = []; 
    if (activeFilter.value === "all" || activeFilter.value === "energy") {
      seriesData.push({
        name: "Energy",
        type: "bar",
        data: energy,
        itemStyle: { color: "rgba(144, 238, 144, 0.8)" },
      });
      legendData.push("Energy"); 
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
      legendData.push("Water"); 
    }
  
    const option = {
      tooltip: { trigger: "axis" },
      legend: {
        data: legendData, 
        textStyle: {
          color: "#333",
          fontWeight: "bold",
        },
        bottom: 10,
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
        splitLine: {
          lineStyle: {
            color: "rgba(39, 183, 226, 0.349)",
            width: 1.5,
          },
        },
        name: "USAGE",
        nameLocation: "middle",
        nameGap: 60,
        nameTextStyle: {
          fontSize: 22,
          fontWeight: "bold",
          rotate: 90,
        },
      },
      series: seriesData,
    };
  
    chart.setOption(option, true);
  };
  
  

  onMounted(() => {
    initChart();
  });

  watch(activeFilter, (newValue) => {
    // console.log("Updating chart for filter:", newValue);
    updateChart();
  });
  

  return { updateChart };
}
