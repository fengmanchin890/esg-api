import { ref, onMounted, nextTick, watch } from "vue";
import * as echarts from "echarts";

const getNiceScale = (min, max) => {
  const range = max - min;
  const step = Math.pow(10, Math.floor(Math.log10(range)));
  const niceStep = Math.ceil(step / 10) * 10;
  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;
  return { niceMin, niceMax };
};

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
    // let negativeMonths = [];
  
    const result = data.map((value, index) => {
      if (value === -1) {
        return 'N/A';  // Khi giá trị là -1, thay thế bằng 'N/A'
      }
      return value === 0 ? '' : value;  // Nếu giá trị là 0 thì không hiển thị gì
    });
  
    return result;
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

      console.log("-------------------------------------------");
      console.log("📌 selectedFactory:", selectedFactory.value);
      console.log("📦 chooseYear:", chooseYear.value);
      console.log("Water",primaryData, secondaryData);

      legendNames = ["Tap Water Meter", "Recycled Water Meter"];
      yAxisLabel = "Value (m³)";
      barColor = "rgba(100, 181, 246, 1)";
      lineColor = "#239081";
    } else if (category === "energy-solarenergy") {
      primaryData = handleNegativeValues(data.energy || Array(12).fill(0));
      secondaryData = handleNegativeValues(data.solarenergy || Array(12).fill(0));

      console.log("-------------------------------------------");
      console.log("📌 selectedFactory:", selectedFactory.value);
      console.log("📦 chooseYear:", chooseYear.value);
      console.log("Energy",primaryData, secondaryData);
      
      legendNames = ["Grid Electric", "Solar Energy"];
      yAxisLabel = "Value (kWh)";
      barColor = "rgba(255, 183, 77, 0.8)";
      lineColor = "#d34d30";
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const availableMonths = data.water ? Object.keys(data.water) : [];

    const allData = primaryData.concat(secondaryData);
    const validData = allData.filter(value => value !== 'N/A');
    const minData = validData.length > 0 ? Math.min(...validData) : 0;
    const maxData = validData.length > 0 ? Math.max(...validData) : 0;

    // Nếu chỉ có vài tháng, đảm bảo min/max không bị trùng
    const adjustedMin = validData.length <= 2 ? Math.min(minData, maxData) - 1 : minData;
    const adjustedMax = validData.length <= 2 ? Math.max(minData, maxData) + 1 : maxData;

    const { niceMin, niceMax } = getNiceScale(adjustedMin, adjustedMax);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          return `${params.seriesName}: ${params.value}`;
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
      yAxis: { 
        type: "value", 
        name: yAxisLabel, 
        min: niceMin !== niceMax ? niceMin : adjustedMin,
        max: niceMax !== niceMin ? niceMax : adjustedMax,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#B0B0B0', 
            type: 'dashed',
          }
        }
      },
      series: [
        {
          name: legendNames[0],
          type: "bar",
          data: primaryData.filter(value => value !== ''),  // Loại bỏ giá trị rỗng (0) ở đây
          itemStyle: { color: barColor }
        },
        {
          name: legendNames[1],
          type: "line",
          data: secondaryData.filter(value => value !== ''),  // Loại bỏ giá trị rỗng (0) ở đây
          lineStyle: { 
            color: lineColor, 
            width: 6 
          },
          smooth: true,
          symbolSize: 10,
          emphasis: {
            lineStyle: {
              width: 8
            },
            symbolSize: 12
          }
        },
      ],
    };
    

    chart.value.setOption(option);
  };

  onMounted(() => {
    initChart();
  });

  watch([selectedFactory, chooseYear, selectedCategory, rawData], async ([factory, year, category]) => {
    await nextTick();

    if (rawData?.value?.[factory]?.[year]) {
      updateChart(factory, year, category);
    } else {
      // ElMessage.warning("⚠️ Không có dữ liệu để cập nhật biểu đồ!");
    }
  });

  return { updateChart };
}
