import { ref, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";

export default function useECharts(echartRef, selectedFactory, chooseYear, selectedCategory, rawData) {
  const chart = ref(null);

  const initChart = async () => {
    await nextTick();
    if (!echartRef.value) {
      console.error("❌ echartRef chưa sẵn sàng!");
      setTimeout(initChart, 500);
      return;
    }
    if (!chart.value) {
      chart.value = echarts.init(echartRef.value);
      console.log("✅ ECharts đã được khởi tạo!");
    }
  };

  const updateChart = async (factory, year, category) => {
    await nextTick();
    if (!echartRef.value || !chart.value) {
      console.warn("⚠️ Chart chưa được khởi tạo!");
      return;
    }

    // 🔥 Kiểm tra rawData trước khi truy cập
    if (!rawData?.value || !rawData.value[factory] || !rawData.value[factory][year]) {
      console.warn("⚠️ Không có dữ liệu để cập nhật biểu đồ!");
      return;
    }

    const data = rawData.value[factory][year];
    let primaryData = [], secondaryData = [], legendNames = [], yAxisLabel = "", barColor = "", lineColor = "";

    if (category === "water-recycledwater") {
      primaryData = data.water || Array(12).fill(null);
      secondaryData = data.recycledwater || Array(12).fill(null);
      legendNames = ["Tap Water Meter", "Recycled Water Meter"];
      yAxisLabel = "Value (m³)";
      barColor = "rgba(100, 181, 246, 1)";
      lineColor = "#239081";
    } else if (category === "energy-solarenergy") {
      primaryData = data.energy || Array(12).fill(null);
      secondaryData = data.solarenergy || Array(12).fill(null);
      legendNames = ["Grid Electric", "Solar Energy"];
      yAxisLabel = "Value (kWh)";
      barColor = "rgba(255, 183, 77, 0.8)";
      lineColor = "#d34d30";
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const option = {
      tooltip: { trigger: "axis" },
      legend: { data: legendNames, bottom: 0, left: "center" },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value", name: yAxisLabel },
      series: [
        { name: legendNames[0], type: "bar", data: primaryData, itemStyle: { color: barColor } },
        { name: legendNames[1], type: "line", data: secondaryData, lineStyle: { color: lineColor } },
      ],
    };

    chart.value.setOption(option);
  };

  onMounted(() => {
    initChart();
  });

  watch([selectedFactory, chooseYear, selectedCategory, rawData], async ([factory, year, category]) => {
    console.log(`🔄 Cập nhật biểu đồ: Factory=${factory}, Year=${year}, Category=${category}`);
  
    await nextTick(); // Đợi rawData cập nhật trước khi cập nhật chart
  
    if (rawData?.value?.[factory]?.[year]) {
      updateChart(factory, year, category);
    } else {
      console.warn("⚠️ Không có dữ liệu để cập nhật biểu đồ!");
    }
  });
  

  return { updateChart };
}
