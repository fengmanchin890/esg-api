import { ref, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";
// import { ElMessage } from "element-plus"; 

const niceNumber = (value, round) => {
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction;
  if (round) {
    niceFraction = fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10;
  } else {
    niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  }
  return niceFraction * Math.pow(10, exponent);
};

const getNiceScale = (min, max, ticks = 5) => {
  const range = max - min;
  const tickSpacing = niceNumber(range / (ticks - 1), true);
<<<<<<< HEAD
  return {
    niceMin: Math.floor(min / tickSpacing) * tickSpacing,
    niceMax: Math.ceil(max / tickSpacing) * tickSpacing,
  };
=======
  const niceMax = Math.ceil(max / tickSpacing) * tickSpacing;
  return { niceMin, niceMax };
>>>>>>> b89f50b566dd9d76e8fce0896565a15337ce62ee
};

export default function useECharts(echartRef, selectedFactory, selectYear, selectedCategory, rawData, factoryTitle) {
  const chart = ref(null);
  const lineSeriesName = ref("");

  const initChart = async () => {
    await nextTick();
    if (!echartRef.value) {
      setTimeout(initChart, 500);
      return;
    }
    if (!chart.value) chart.value = echarts.init(echartRef.value);

    chart.value.on("legendselectchanged", (params) => {
      if (lineSeriesName.value && params.selected[lineSeriesName.value] !== undefined) {
        const isLineSelected = params.selected[lineSeriesName.value];
        chart.value.setOption({
          series: [
            {
              name: lineSeriesName.value,
              showSymbol: isLineSelected,
              symbolSize: isLineSelected ? 10 : 0,
              emphasis: {
                symbolSize: isLineSelected ? 12 : 0
              }
            }
          ]
        });
      }
    });
  };

  const handleNegativeValues = (data) =>
    data.map(value => (value === -1 ? "N/A" : value === 0 ? "" : value));

  const updateChart = async (factory, year, category) => {
    await nextTick();
    if (!echartRef.value || !chart.value) return;
    if (!rawData?.value || !rawData.value[factory] || !rawData.value[factory][year]) return;

    const data = rawData.value[factory][year];
    let primaryData = [], secondaryData = [], legendNames = [], yAxisLabel = "", barColor = "", lineColor = "";

    const noDataMessage = `Chưa có dữ liệu năm ${year} của nhà máy ${factoryTitle.value}`;

    if (category === "water-recycledwater") {
      if (!data.water || data.water.length !== 12 || data.water.every(v => v === -1)) {
        chart.value.clear();
        chart.value.setOption({
          title: {
            text: noDataMessage,  
            left: "center",
            top: "middle",
            textStyle: { fontSize: 16, fontWeight: "bold", fontFamily: "Arial" }
          }
        });
        // ElMessage.warning(noDataMessage);
        return;
      }
      primaryData = handleNegativeValues(data.water || Array(12).fill(0));
      secondaryData = handleNegativeValues(data.recycledwater || Array(12).fill(0));
      legendNames = ["Tap Water Meter", "Recycled Water Meter"];
      yAxisLabel = "Value (m³)";
      barColor = "rgba(100, 181, 246, 1)";
      lineColor = "#239081";
    } else if (category === "energy-solarenergy") {
      if (!data.energy || data.energy.length !== 12 || data.energy.every(v => v === -1)) {
        chart.value.clear();
        chart.value.setOption({
          title: {
            text: noDataMessage,
            left: "center",
            top: "middle",
            textStyle: { fontSize: 16, fontWeight: "bold", fontFamily: "Arial" }
          }
        });
        // ElMessage.warning(noDataMessage);
        return;
      }
      primaryData = handleNegativeValues(data.energy || Array(12).fill(0));
      secondaryData = handleNegativeValues(data.solarenergy || Array(12).fill(0));
      legendNames = ["Grid Electric", "Solar Energy"];
      yAxisLabel = "Value (kWh)";
      barColor = "rgba(255, 183, 77, 0.8)";
      lineColor = "#d34d30";
    } else {
      // ElMessage.error("Danh mục không hợp lệ!");
      return;
    }

    const allData = [...primaryData, ...secondaryData].filter(val => val !== "N/A" && val !== "");
    const minData = allData.length > 0 ? Math.min(...allData) : 0;
    const maxData = allData.length > 0 ? Math.max(...allData) : 0;
    const adjustedMin = minData === maxData ? minData - 1 : minData;
    const adjustedMax = minData === maxData ? maxData + 1 : maxData;
    const { niceMin, niceMax } = getNiceScale(adjustedMin, adjustedMax, 5);
    lineSeriesName.value = legendNames[1];

    const option = {
      tooltip: {
        trigger: "item",
        formatter: (params) => {
          const idx = params.dataIndex;
          const val1 = primaryData[idx] || "0";
          const val2 = secondaryData[idx] || "0";
          return `${legendNames[0]}: ${val1}<br/>${legendNames[1]}: ${val2}`;
        }
      },
      legend: { data: legendNames, bottom: 0, left: "center" },
      xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
      yAxis: {
        type: "value",
        name: yAxisLabel,
<<<<<<< HEAD
        min: niceMin,
        max: niceMax,
=======
        min: 0,
        max: niceMax !== niceMin ? niceMax : adjustedMax,
>>>>>>> b89f50b566dd9d76e8fce0896565a15337ce62ee
        splitLine: { show: true, lineStyle: { color: "#B0B0B0", type: "dashed" } }
      },
      series: [
        { name: legendNames[0], type: "bar", data: primaryData.map(v => v === "" ? null : v), itemStyle: { color: barColor } },
        { name: legendNames[1], type: "line", data: secondaryData.map(v => v === "" ? null : v), lineStyle: { color: lineColor, width: 6 }, smooth: true, symbolSize: 10, emphasis: { lineStyle: { width: 8 }, symbolSize: 12 } }
      ]
    };
    chart.value.setOption(option);
  };

  onMounted(initChart);

  watch([selectedFactory, selectYear, selectedCategory, rawData], async ([factory, year, category]) => {
    await nextTick();
    if (rawData?.value?.[factory]?.[year]) updateChart(factory, year, category);
  });

  return { updateChart };
}
