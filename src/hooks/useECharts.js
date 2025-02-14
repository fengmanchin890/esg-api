import { onMounted, watch, nextTick } from "vue";
import * as echarts from "echarts";

export default function useECharts(echartRef, rawData, chooseYear) {
  let chart = null;

  const initChart = () => {
    if (echartRef.value) {
      chart = echarts.init(echartRef.value);
      updateChart();
    }
  };

  const getNiceScale = (min, max) => {
    const range = max - min;
    const step = Math.pow(10, Math.floor(Math.log10(range)));
    const niceStep = Math.ceil(step / 10) * 10;
    const niceMin = Math.floor(min / niceStep) * niceStep;
    const niceMax = Math.ceil(max / niceStep) * niceStep;
    return { niceMin, niceMax };
  };

  const updateChart = async (factory, year, category) => {
    await nextTick();

    if (!rawData[factory] || !rawData[factory][year]) {
      return;
    }

    const data = rawData[factory][year];
    let primaryData = [];
    let secondaryData = [];
    let legendNames = [];
    let yAxisLabel = "";
    let barColor = "";
    let lineColor = "";

    if (category === "water-recycledwater") {
      primaryData = data.water || Array(12).fill(null);
      secondaryData = data.recycledwater || Array(12).fill(null);
      legendNames = ["Tap Water Meter", "Recycled Water Meter"];
      yAxisLabel = "Value (m³)";
      barColor = "rgba(100, 181, 246, 1)";
      lineColor = "#239081 ";
    } else if (category === "energy-solarenergy") {
      primaryData = data.energy || Array(12).fill(null);
      secondaryData = data.solarenergy || Array(12).fill(null);
      legendNames = ["Grid Electric", "Solar Energy"];
      yAxisLabel = "Value (kWh)";
      barColor = "rgba(255, 183, 77, 0.8)";
      lineColor = "#d34d30";
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const allData = [...primaryData, ...secondaryData].filter(v => v !== null);
    const { niceMin: finalYMin, niceMax: finalYMax } = getNiceScale(Math.min(...allData), Math.max(...allData));

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross", lineStyle: { width: 3 } },
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
          lineStyle: { type: "dashed", color: "#78909C" }, // Xám đậm hơn
        },
      },
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
          smooth: true,
          lineStyle: { width: 6, color: lineColor },
          itemStyle: { color: lineColor },
          emphasis: { focus: "series", lineStyle: { width: 8 } }
        },
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
