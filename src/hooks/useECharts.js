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
    let energyData = [];
    let waterData = [];
    let legendNames = [];

    if (category === "water-energy") {
      energyData = data.energy || Array(12).fill(null);
      waterData = data.water || Array(12).fill(null);
      legendNames = ["Water", "Energy"];
    } else if (category === "recycledwater-solarenergy") {
      energyData = data.solarenergy || Array(12).fill(null);
      waterData = data.recycledwater || Array(12).fill(null);
      legendNames = ["Recycled Water", "Solar Energy"];
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const yMin1 = Math.min(...energyData.filter(v => v !== null));
    const yMax1 = Math.max(...energyData.filter(v => v !== null));
    const yMin2 = Math.min(...waterData.filter(v => v !== null));
    const yMax2 = Math.max(...waterData.filter(v => v !== null));

    const { niceMin: finalYMin1, niceMax: finalYMax1 } = getNiceScale(yMin1, yMax1);
    const { niceMin: finalYMin2, niceMax: finalYMax2 } = getNiceScale(yMin2, yMax2);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross", lineStyle: { width: 3 } },
      },
      legend: {
        data: legendNames, // Cập nhật tên legend theo category
        bottom: 0,
        left: "center",
        orient: "horizontal",
      },
      xAxis: { type: "category", data: months },
      yAxis: [
        { type: "value", name: `${legendNames[1]} (kWh)`, min: finalYMin1, max: finalYMax1 },
        { type: "value", name: `${legendNames[0]} (m³)`, min: finalYMin2, max: finalYMax2 },
      ],
      series: [
        { name: legendNames[1], type: "bar", data: energyData, yAxisIndex: 0, itemStyle: { color: "#FFB74D" } },
        { name: legendNames[0], type: "line", data: waterData, yAxisIndex: 1, smooth: true, lineStyle: { width: 7 }, itemStyle: { color: "#1E90FF" }, emphasis: { focus: "series", lineStyle: { width: 16 } } },
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
