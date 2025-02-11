import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
export default function useECharts(echartRef, rawData, activeFilter) {
  let chart = null;

  const initChart = () => {
    if (echartRef.value) {
      chart = echarts.init(echartRef.value);
      updateChart();
    }
  };

  const updateChart = (data) => {
    if (!data || !data.months || !data.energy || !data.water) {
      ElMessage.warning("Dữ liệu không có sẵn cho năm này!");
      if (chart) chart.clear(); // Xóa biểu đồ nếu có dữ liệu cũ
      return;
    }
  
    const { months, energy, water } = data;
    const seriesData = [];
    const legendData = [];
  
    const maxEnergy = Math.ceil(Math.max(...energy) / 10) * 10;
    const maxWater = Math.ceil(Math.max(...water) / 10) * 10;
  
    if (activeFilter.value === "all" || activeFilter.value === "energy") {
      seriesData.push({
        name: "Energy (kWh)",
        type: "bar",
        data: energy,
        yAxisIndex: 0,
        itemStyle: { color: "rgba(144, 238, 144, 0.8)" },
      });
      legendData.push("Energy (kWh)");
    }
  
    if (activeFilter.value === "all" || activeFilter.value === "water") {
      seriesData.push({
        name: "Water (m³)",
        type: "line",
        data: water,
        yAxisIndex: 1,
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
      legendData.push("Water (m³)");
    }
  
    const option = {
      tooltip: { trigger: "axis" },
      legend: {
        data: legendData,
        textStyle: { color: "#333", fontWeight: "bold" },
        bottom: 10,
      },
      xAxis: {
        type: "category",
        data: months,
        axisLabel: { interval: 0 },
      },
      yAxis: [
        {
          type: "value",
          name: "Energy (kWh)",
          position: "left",
          min: 0,
          max: maxEnergy,
          axisLabel: { fontWeight: "bold" },
          splitLine: { lineStyle: { color: "rgba(39, 183, 226, 0.349)" } },
          nameTextStyle: { fontSize: 16, fontWeight: "bold", color: "#28a745" },
        },
        {
          type: "value",
          name: "Water (m³)",
          position: "right",
          min: 0,
          max: maxWater,
          axisLabel: { fontWeight: "bold" },
          splitLine: { show: false },
          nameTextStyle: { fontSize: 16, fontWeight: "bold", color: "#007bff" },
        },
      ],
      series: seriesData,
    };
  
    chart.setOption(option, true);
  };
  

  onMounted(() => {
    initChart();
  });

  watch(activeFilter, () => {
    if (rawData[baseYear.value]) {
      updateChart(rawData[baseYear.value]);
    }
  });
  

  return { updateChart };
}
