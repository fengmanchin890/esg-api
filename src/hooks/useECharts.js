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
  
    const { months } = data;

    // Xử lý dữ liệu: -1 không hiển thị trên biểu đồ, nhưng tooltip vẫn hiện "N/A"
    const processData = (arr) =>
      arr.map((value) => (value === -1 ? { value: null, display: "N/A" } : { value, display: value }));

    const energy = processData(data.energy);
    const water = processData(data.water);

    const seriesData = [];
    const legendData = {};

    if (activeFilter.value === "all" || activeFilter.value === "energy") {
      legendData["Energy (kWh)"] = true;
      seriesData.push({
        name: "Energy (kWh)",
        type: "bar",
        data: energy,
        yAxisIndex: 0,
        // itemStyle: { color: "#40E0D0" },
        itemStyle: { color: "rgba(255, 183, 77, 0.8)" },
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
        lineStyle: { width: 5 },
        emphasis: {
          focus: "series",
          itemStyle: { color: "#fff", borderColor: "#fff", borderWidth: 3, opacity: 1 },
          lineStyle: { width: 6 },
          symbolSize: 12,
        },
        symbolSize: 6,
      });
    }

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: { color: "#aaa", width: 1.5, type: "dashed" },
        },
        formatter: function (params) {
          return params
            .map((param) => {
              return `${param.marker} ${param.seriesName}: <b>${param.data?.display ?? "N/A"}</b>`;
            })
            .join("<br>");
        },
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        textStyle: { color: "#000", fontSize: 14, fontWeight: "bold" },
        borderColor: "#ddd",
        borderWidth: 2,
        padding: [10, 15],
        extraCssText: "box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);",
      },

      legend: {
        data: Object.keys(legendData),
        selected: legendData,
        selectedMode: "multiple",
        bottom: 0,
        left: "center",
        orient: "horizontal",
      },

      xAxis: { type: "category", data: months },
      yAxis: [
        {
          type: "value",
          name: "Energy (kWh)",
          splitLine: {
            show: true,
            lineStyle: { color: "rgba(173, 216, 230, 0.8)", type: "dashed", width: 1.5 },
          },
        },
        {
          type: "value",
          name: "Water (m³)",
          splitLine: {
            show: true,
            lineStyle: { color: "rgba(173, 216, 230, 0.8)", type: "dashed", width: 1.5 },
          },
        },
      ],

      series: seriesData,
    };

    chart.setOption(option);
  };

  onMounted(() => {
    initChart();
  });

  watch(chooseYear, async (newYear) => {
    await nextTick();
    updateChart();
  });

  return { updateChart, chooseYear };
}
