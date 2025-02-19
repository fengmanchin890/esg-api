<!-- Components/Echarts/UsageRecycledWater.vue -->
<template>
  <div class="usage-card-water">
    <h3 class="title-water">
      <img src="@/assets/water.png" alt="water" class="icon" />
      Water Recycle Usage 
    </h3>
    <div class="usage-content" v-if="usageData.length">
      <div class="usage-year" v-for="(data, index) in usageData" :key="index">
        <div class="data-column">
          <p class="day">{{ data.label }}</p>
        </div>
        <div class="circle-container">
          <div class="circle" :class="data.color">
            {{ data.total_recycled_start }} m³
            <p class="label">Total Tap Start</p>
          </div>
          <div class="circle" :class="data.color">
            {{ data.total_recycled_end }} m³
            <p class="label">Total Tap End</p>
          </div>
        </div>
        <span
          class="percent"
          :class="{
            red: data.tap_change_percent > 0,
            green: data.tap_change_percent < 0
          }"
        >
          {{ data.tap_change_percent !== undefined ? data.tap_change_percent : 0 }}%
        </span>
      </div>
    </div>
    <div v-else class="no-data">Không có dữ liệu</div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const props = defineProps({
  comparisonData: {
    type: Object,
    default: () => ({})
  }
});

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const usageData = ref([]);

const fetchWaterChartData = async () => {
  if (!props.comparisonData.factory) {
    ElMessage.error("Dữ liệu Comparison chưa hợp lệ.");
    return;
  }
  const payload = {
    factory_id: props.comparisonData.factory,
    start_year: props.comparisonData.firstYear,
    start_month: props.comparisonData.startMonth,
    end_year: props.comparisonData.secondYear,
    end_month: props.comparisonData.endMonth
  };

  try {
    const response = await axios.post(
      `${VITE_BACKEND_URL}/api/v1/stats/waterchart`,
      payload
    );
    if (response.data && Array.isArray(response.data)) {
      usageData.value = response.data.map((item) => ({
        label: `${item.record_month_start}/${item.record_year_start} - ${item.record_month_end}/${item.record_year_end}`,
        total_tap_start: item.total_tap_start,
        total_tap_end: item.total_tap_end,
        tap_change_percent: item.tap_change_percent,
        total_recycled_start: item.total_recycled_start,
        total_recycled_end: item.total_recycled_end,
        recycled_change_percent: item.recycled_change_percent,
        color: item.tap_change_percent > 0 ? "red" : "green"
      }));
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API biểu đồ nước:", error);
  }
};

watch(
  () => props.comparisonData,
  (newVal) => {
    if (newVal && newVal.factory) {
      fetchWaterChartData();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.usage-card-water {
  max-width: 800px;
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  margin: 20px auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.title-water {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #333;
}

.icon {
  width: 40px;
  margin-right: 12px;
}

.usage-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.usage-year {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  width: calc(50% - 30px);
  min-width: 280px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.data-column {
  margin-bottom: 15px;
}

.day {
  font-size: 18px;
  font-weight: 600;
  color: #555;
}

.circle-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.circle.green {
  background: linear-gradient(135deg, #28a745, #70d77c);
}

.circle.red {
  background: linear-gradient(135deg, #dc3545, #f08080);
}

.label {
  font-size: 12px;
  color: #f0f0f0;
  margin-top: 5px;
}

.percent {
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
}

.percent.red {
  color: #dc3545;
}

.percent.green {
  color: #28a745;
}

.no-data {
  font-size: 16px;
  color: #888;
  margin-top: 20px;
}

@media (max-width: 600px) {
  .circle {
    width: 80px;
    height: 80px;
    font-size: 18px;
  }
  .usage-year {
    width: 100%;
  }
  .title-water {
    font-size: 22px;
  }
}
</style>
