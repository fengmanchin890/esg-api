import { ref, onMounted, watch, nextTick } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";

export default function useECharts(echartRef, rawData, activeFilter, chooseYear) {

  let chart = null;
  const currentYear = new Date().getFullYear().toString();
  // const chooseYear = ref(currentYear);
  // console.log("js", chooseYear.value)
  const initChart = () => {
    if (echartRef.value) {
      chart = echarts.init(echartRef.value);
      updateChart();
    }
  };

  const updateChart = async () => {
    await nextTick();
  
    let selectedYear = chooseYear.value;
  
    if (!rawData[selectedYear]) {
      ElMessage.warning(`Dữ liệu không có sẵn cho năm ${selectedYear}, hiển thị dữ liệu của ${currentYear}.`);
      selectedYear = currentYear;
      chooseYear.value = currentYear;
    }
  
    const data = rawData[selectedYear];
  
    if (!data || !data.months || !data.energy || !data.water) {
      if (chart) {
        chart.setOption({
          title: { text: "Không có dữ liệu", left: "center", top: "middle" },
          xAxis: { show: false },
          yAxis: { show: false },
          series: [],
        });
      }
      return;
    }
  
    const { months, energy, water } = data;
    const seriesData = [];
    const legendData = {}; // Object để kiểm soát trạng thái bật/tắt
  
    if (activeFilter.value === "all" || activeFilter.value === "energy") {
      legendData["Energy (kWh)"] = true;
      seriesData.push({
        name: "Energy (kWh)",
        type: "bar",
        data: energy,
        yAxisIndex: 0,
        itemStyle: { color: "rgba(144, 238, 144, 0.8)" },
      });
    }
  
    if (activeFilter.value === "all" || activeFilter.value === "water") {
      legendData["Water (m³)"] = true;
      seriesData.push({
        name: "Water (m³)",
        type: "line",
        data: water,
        yAxisIndex: 1,
        smooth: true,
        itemStyle: { color: "rgba(30, 144, 255, 1)" },
      });
    }
  
    const option = {
      tooltip: { trigger: "axis" },
      legend: {
        data: Object.keys(legendData), // Lấy danh sách tên series hợp lệ
        selected: legendData, // Ánh xạ trạng thái bật/tắt
        selectedMode: "multiple", // Cho phép bật/tắt nhiều series
      },
      xAxis: { type: "category", data: months },
      yAxis: [
        { type: "value", name: "Energy (kWh)" },
        { type: "value", name: "Water (m³)" },
      ],
      series: seriesData,
    };
  
    chart.setOption(option);
  };
  

  onMounted(() => {
    initChart();
  });

  watch(chooseYear, async (newYear) => {
    // console.log("Giá trị chooseYear mới:", newYear);
    await nextTick(); // Chờ chooseYear cập nhật
    updateChart();
  });

  return { updateChart, chooseYear };
}
