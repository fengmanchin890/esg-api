<template>
  

  <div class="usage-card-water">
    <h3 class="title-water">
      <img src="@/assets/water.png" alt="water" class="icon" /> Water Usage
    </h3>

    <div class="filter-section">
      <el-select
        v-model="selectedFactory"
        :options="factoryOptions"
        placeholder="Select Factory"
      />
      <el-date-picker
        v-model="dateRange"
        type="month"
        format="YYYY-MM"
        placeholder="Select Month"
      />
      <el-button type="primary" @click="fetchWaterChartData"
        >Create charts</el-button
      >
    </div>

    <div class="usage-content">
      <div class="usage-year" v-for="(data, index) in usageData" :key="index">
        <div class="data-column">
          <p class="day">{{ data.label }}</p>
        </div>

        <div class="circle-container">
          <div class="circle" :class="data.color">
            {{ data.total_tap_start }} m³
            <p class="label">Total Tap Start</p>
          </div>

          <div class="circle" :class="data.color">
            {{ data.total_tap_end }} m³
            <p class="label">Total Tap End</p>
          </div>
        </div>

        <span
          class="percent"
          :class="{
            red: data.tap_change_percent < 0,
            green: data.tap_change_percent > 0,
          }"
        >
          {{
            data.tap_change_percent !== undefined ? data.tap_change_percent : 0
          }}%
          <span v-if="data.tap_change_percent > 0">↑</span>
          <span v-if="data.tap_change_percent < 0">↓</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const selectedFactory = ref(null);
const dateRange = ref([dayjs().startOf("month"), dayjs().endOf("month")]);
const factoryOptions = ref([]);
const usageData = ref([]);

const fetchFactoryList = async () => {
  try {
    const response = await axios.get(
      `${VITE_BACKEND_URL}/api/v1/factories/get`
    );
    if (response.data?.data && Array.isArray(response.data.data)) {
      factoryOptions.value = response.data.data.map((factory) => ({
        label: factory.factoryname,
        value: factory.factoryid,
      }));
      if (factoryOptions.value.length > 0) {
        selectedFactory.value = factoryOptions.value[0].value;
      }
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API danh sách factories:", error);
  }
};

const fetchWaterChartData = async () => {
  if (!selectedFactory.value || dateRange.value.length !== 2) {
    ElMessage.error("Vui lòng chọn nhà máy và khoảng thời gian.");
    return;
  }

  const startDate = dateRange.value[0];
  const endDate = dateRange.value[1];

  const payload = {
    factory_id: selectedFactory.value,
    start_year: startDate.year(),
    start_month: startDate.month() + 1,
    end_year: endDate.year(),
    end_month: endDate.month() + 1,
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
        color: item.tap_change_percent > 0 ? "green" : "red",
      }));
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API biểu đồ nước:", error);
  }
};

onMounted(() => {
  fetchFactoryList();
});
</script>

<style scoped>
.title-water {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}

.usage-card-water {
  flex: 1;
  max-width: 700px;
  background: rgba(173, 216, 230, 0.6);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-section {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.usage-content {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.usage-year {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.data-column {
  text-align: center;
  margin-bottom: 10px;
}

.day {
  font-size: 16px;
  font-weight: 600;
}

.circle-container {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
}

.green {
  background: rgba(144, 238, 144, 0.8);
}

.red {
  background: rgba(255, 99, 71, 0.8);
}

.percent {
  font-size: 14px;
  font-weight: bold;
}

.label {
  font-size: 12px;
  color: #555;
}

.icon {
  width: 30px;
  margin-right: 10px;
}

.percent-recycled {
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
