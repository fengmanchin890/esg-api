import { onMounted, watch, nextTick } from "vue";
import * as echarts from "echarts";

export default function useECharts(echartRef, rawData, selectedFactory, chooseYear, selectedCategory) {
  let chart = null;

  const initChart = async () => {
    await nextTick(); // ✅ Đợi DOM cập nhật

    if (!echartRef.value) {
      console.warn("⚠️ echartRef chưa sẵn sàng!");
      return;
    }

    chart = echarts.init(echartRef.value);
    console.log("✅ ECharts đã được khởi tạo!");

    updateChart(selectedFactory.value, chooseYear.value, selectedCategory.value);
  };

  const processData = (data) => {
    return data.map(item => (item === -1 ? 0 : item));
  };

  const updateChart = async (factory, year, category) => {
    await nextTick();

    if (!echartRef.value || !chart) {
      console.warn("⚠️ Chart chưa được khởi tạo!");
      return;
    }

    if (!rawData.value[factory] || !rawData.value[factory][year]) {
      console.warn("⚠️ Không có dữ liệu để cập nhật biểu đồ!");
      return;
    }

    const data = rawData.value[factory][year];
    let primaryData = [];
    let secondaryData = [];
    let legendNames = [];
    let yAxisLabel = "";
    let barColor = "";
    let lineColor = "";

    if (category === "water-recycledwater") {
      primaryData = processData(data.water || Array(12).fill(null));
      secondaryData = processData(data.recycledwater || Array(12).fill(null));
      legendNames = ["Tap Water Meter", "Recycled Water Meter"];
      yAxisLabel = "Value (m³)";
      barColor = "rgba(100, 181, 246, 1)";
      lineColor = "#239081";
    } else if (category === "energy-solarenergy") {
      primaryData = processData(data.energy || Array(12).fill(null));
      secondaryData = processData(data.solarenergy || Array(12).fill(null));
      legendNames = ["Grid Electric", "Solar Energy"];
      yAxisLabel = "Value (kWh)";
      barColor = "rgba(255, 183, 77, 0.8)";
      lineColor = "#d34d30";
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const allData = [...primaryData, ...secondaryData].filter(v => v !== null);
    const minY = Math.min(...allData);
    const maxY = Math.max(...allData);
    const finalYMin = Math.floor(minY / 10) * 10;
    const finalYMax = Math.ceil(maxY / 10) * 10;

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross", lineStyle: { width: 3 } },
        formatter: function (params) {
          let tooltipText = `${params[0].name}<br/>`;
          params.forEach(param => {
            const value = param.value === 0 ? "N/A" : param.value;
            tooltipText += `${param.seriesName}: ${value}<br/>`;
          });
          return tooltipText;
        }
      },
      legend: {
        data: legendNames,
        bottom: 0,
        left: "center",
        orient: "horizontal",
      },
      grid: {
        left: "10%",
        right: "10%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: { type: "category", data: months },
      yAxis: {
        type: "value",
        name: yAxisLabel,
        min: finalYMin,
        max: finalYMax,
        splitLine: {
          show: true,
          lineStyle: { type: "dashed", color: "#78909C" },
        },
      },
      series: [
        {
          name: legendNames[0],
          type: "bar",
          data: primaryData,
          itemStyle: { color: barColor },
        },
        {
          name: legendNames[1],
          type: "line",
          data: secondaryData,
          smooth: true,
          lineStyle: { width: 6, color: lineColor },
          itemStyle: { color: lineColor },
          emphasis: { focus: "series", lineStyle: { width: 8 } },
        },
      ],
    };

    chart.setOption(option);
  };

  onMounted(() => {
    initChart();
  });

  watch([selectedFactory, chooseYear, selectedCategory], async ([factory, year, category]) => {
    console.log(`🔄 Cập nhật biểu đồ: Factory=${factory}, Year=${year}, Category=${category}`);
    await updateChart(factory, year, category);
  });

  return { updateChart };
}
