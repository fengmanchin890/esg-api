import { ref, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";

const niceNumber = (value, round) => {
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction;
  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }
  return niceFraction * Math.pow(10, exponent);
};

const getNiceScale = (min, max, ticks = 5) => {
  const range = max - min;
  const tickSpacing = niceNumber(range / (ticks - 1), true);
  const niceMin = Math.floor(min / tickSpacing) * tickSpacing;
  const niceMax = Math.ceil(max / tickSpacing) * tickSpacing;
  return { niceMin, niceMax };
};

export default function useECharts(echartRef, selectedFactory, selectYear, selectedCategory, rawData) {
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

  const handleNegativeValues = (data) => data.map(value => value === -1 ? "N/A" : value === 0 ? "" : value);

  const updateChart = async (factory, year, category) => {
    await nextTick();
    if (!echartRef.value || !chart.value) return;
    if (!rawData?.value || !rawData.value[factory] || !rawData.value[factory][year]) return;
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
    const series1Data = primaryData.map(val => val === "" ? null : val);
    const series2Data = secondaryData.map(val => val === "" ? null : val);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const availableMonths = data.water ? Object.keys(data.water) : [];
    const allData = primaryData.concat(secondaryData).filter(val => val !== "N/A" && val !== "");
    const minData = allData.length > 0 ? Math.min(...allData) : 0;
    const maxData = allData.length > 0 ? Math.max(...allData) : 0;
    const adjustedMin = allData.length <= 2 ? Math.min(minData, maxData) - 1 : minData;
    const adjustedMax = allData.length <= 2 ? Math.max(minData, maxData) + 1 : maxData;
    const { niceMin, niceMax } = getNiceScale(adjustedMin, adjustedMax, 5);
    lineSeriesName.value = legendNames[1];
    const option = {
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          const idx = params.dataIndex;
          const val1 = primaryData[idx] === "" ? "0" : primaryData[idx];
          const val2 = secondaryData[idx] === "" ? "0" : secondaryData[idx];
          return `${legendNames[0]}: ${val1}<br/>${legendNames[1]}: ${val2}`;
        }
      },
      legend: { data: legendNames, bottom: 0, left: "center" },
      xAxis: {
        type: "category",
        data: months,
        axisLabel: {
          formatter: function (value, index) {
            return availableMonths.includes(index.toString()) ? value : "";
          }
        }
      },
      yAxis: {
        type: "value",
        name: yAxisLabel,
        min: niceMin !== niceMax ? niceMin : adjustedMin,
        max: niceMax !== niceMin ? niceMax : adjustedMax,
        splitLine: { show: true, lineStyle: { color: "#B0B0B0", type: "dashed" } }
      },
      series: [
        { name: legendNames[0], type: "bar", data: series1Data, itemStyle: { color: barColor } },
        {
          name: legendNames[1],
          type: "line",
          data: series2Data,
          lineStyle: { color: lineColor, width: 6 },
          smooth: true,
          symbolSize: 10,
          emphasis: { lineStyle: { width: 8 }, symbolSize: 12 }
        }
      ]
    };
    chart.value.setOption(option);
  };

  onMounted(() => {
    initChart();
  });

  watch([selectedFactory, selectYear, selectedCategory, rawData], async ([factory, year, category]) => {
    await nextTick();
    if (rawData?.value?.[factory]?.[year]) updateChart(factory, year, category);
  });

  return { updateChart };
}
