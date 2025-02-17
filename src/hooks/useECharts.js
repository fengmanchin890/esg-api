import { ref, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";
// import { ElMessage } from "element-plus";

export default function useECharts(echartRef, selectedFactory, chooseYear, selectedCategory, rawData) {
  const chart = ref(null);

  const initChart = async () => {
    await nextTick();
    if (!echartRef.value) {
      setTimeout(initChart, 500);
      return;
    }
    if (!chart.value) {
      chart.value = echarts.init(echartRef.value);
    }
  };

  const handleNegativeValues = (data) => {
    return data.map((value) => (value < 0 ? 0 : value));
  };

  const updateChart = async (factory, year, category) => {
    await nextTick();
    if (!echartRef.value || !chart.value) {
      
      return;
    }

    if (!rawData?.value || !rawData.value[factory] || !rawData.value[factory][year]) {
      return;
    }

    const data = rawData.value[factory][year];
    let primaryData = [], secondaryData = [], legendNames = [], yAxisLabel = "", barColor = "", lineColor = "";

    if (category === "water-recycledwater") {
      primaryData = handleNegativeValues(data.water || Array(12).fill(0));
      secondaryData = handleNegativeValues(data.recycledwater || Array(12).fill(0));
      legendNames = ["Tap Water Meter", "Recycled Water Meter"];
      yAxisLabel = "Value (m³)";
      barColor = "rgba(100, 181, 246, 1)";
      lineColor = "#239081";
    } else if (category === "energy-solarenergy") {
      primaryData = handleNegativeValues(data.energy || Array(12).fill(0));
      secondaryData = handleNegativeValues(data.solarenergy || Array(12).fill(0));
      legendNames = ["Grid Electric", "Solar Energy"];
      yAxisLabel = "Value (kWh)";
      barColor = "rgba(255, 183, 77, 0.8)";
      lineColor = "#d34d30";
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const availableMonths = data.water ? Object.keys(data.water) : [];

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let tooltipContent = '';
          params.forEach(param => {
            let value = param.value;
            if (value === 0 || value === null) {
              value = 'N/A'; 
            }
            tooltipContent += `${param.seriesName}: ${value} <br>`;
          });
          return tooltipContent;
        }
      },
      legend: { data: legendNames, bottom: 0, left: "center" },
      xAxis: {
        type: "category",
        data: months,
        axisLabel: {
          formatter: function (value, index) {
            if (!availableMonths.includes(index.toString())) {
              return '';
            }
            return value;
          }
        }
      },
      yAxis: { type: "value", name: yAxisLabel },
      series: [
        {
          name: legendNames[0],
          type: "bar",
          data: primaryData,
          itemStyle: { color: barColor }
        },
        {
          name: legendNames[1],
          type: "line",
          data: secondaryData,
          lineStyle: { color: lineColor }
        },
      ],
    };

    chart.value.setOption(option);
  };

  onMounted(() => {
    initChart();
  });

  watch([selectedFactory, chooseYear, selectedCategory, rawData], async ([factory, year, category]) => {
    // ElMessage.info(`🔄 Cập nhật biểu đồ: Factory=${factory}, Year=${year}, Category=${category}`);

    await nextTick();

    if (rawData?.value?.[factory]?.[year]) {
      updateChart(factory, year, category);
    } else {
      // ElMessage.warning("⚠️ Không có dữ liệu để cập nhật biểu đồ!");
    }
  });

  return { updateChart };
}
