import { ref, onMounted, watch, nextTick } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";


export default function useECharts(echartRef, rawData, activeFilter, chooseYear) {
  let chart = null;
  const currentYear = new Date().getFullYear().toString();

  const initChart = () => {
    if (echartRef.value) {
      chart = echarts.init(echartRef.value);
      updateChart();
    }
  };

  const updateChart = async (factory, year, category) => {
    await nextTick();
  
    if (!rawData[factory] || !rawData[factory][year]) {
      ElMessage.warning(`Dữ liệu không có sẵn cho ${factory} - ${year}, hiển thị dữ liệu mặc định.`);
      return;
    }
  
    const data = rawData[factory][year];
  
    // Xử lý lấy dữ liệu theo danh mục đã chọn
    let energyData = [];
    let waterData = [];
  
    if (category === "water-energy") {
      energyData = data.energy || Array(12).fill(0);
      waterData = data.water || Array(12).fill(0);
    } else if (category === "recycledwater-solarenergy") {
      energyData = data.solarenergy || Array(12).fill(0);
      waterData = data.recycledwater || Array(12).fill(0);
    }
  
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    const option = {
      tooltip: { trigger: "axis" },
      legend: { data: ["Energy", "Water"] },
      xAxis: { type: "category", data: months },
      yAxis: [{ type: "value" }, { type: "value" }],
      series: [
        { name: "Energy", type: "bar", data: energyData },
        { name: "Water", type: "line", data: waterData },
      ],
    };
  
    chart.setOption(option);
  };
  
  onMounted(() => {
    initChart();
  });

  watch(chooseYear, async () => {
    await nextTick();
    updateChart();
  });

  return { updateChart, chooseYear };
}
