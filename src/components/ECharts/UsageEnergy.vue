<template>
  <div class="usage-card-energy">
    <h3 class="title-energy">
      <img src="@/assets/energy.png" alt="energy" class="icon" /> Energy Usage
    </h3>

    <div class="filter-section">
      <el-select v-model="selectedFactory" :options="factoryOptions" placeholder="Select Factory">
        <el-option
          v-for="option in factoryOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
      <el-date-picker v-model="dateRange" type="month" format="yyyy-MM" />
      <el-button type="primary" @click="fetchEnergyChartData">Create charts</el-button>
    </div>

    <div class="usage-content">
      <div class="usage-year" v-for="(data, index) in usageData" :key="index">
        <div class="data-column">
          <p class="day">{{ data.label }}</p>
        </div>

        <div class="circle-container">
          <div class="circle" :class="data.color">
            {{ data.total_grid_start }} kWh
            <p class="label">Total Grid Start</p>
          </div>

          <div class="circle" :class="data.color">
            {{ data.total_grid_end }} kWh
            <p class="label">Total Grid End</p>
          </div>
        </div>

        <span class="percent" :class="{
          red: data.grid_change_percent < 0,
          green: data.grid_change_percent > 0
        }">
          {{ data.grid_change_percent !== undefined ? data.grid_change_percent : 0 }}%
          <span v-if="data.grid_change_percent > 0">↑</span>
          <span v-if="data.grid_change_percent < 0">↓</span>
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
const dateRange = ref([dayjs().startOf('month'), dayjs().endOf('month')]); 
const factoryOptions = ref([]);
const usageData = ref([]);

const fetchFactoryList = async () => {
  try {
    const response = await axios.get(`${VITE_BACKEND_URL}/api/v1/factories/get`);
    if (response.data?.data && Array.isArray(response.data.data)) {
      factoryOptions.value = response.data.data.map(factory => ({
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

const fetchEnergyChartData = async () => {
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

  console.log("Dữ liệu truyền vào API:", payload);

  try {
    const response = await axios.post(`${VITE_BACKEND_URL}/api/v1/stats/energychart`, payload);

    console.log("Dữ liệu trả về từ API:", response.data);

    if (response.data && Array.isArray(response.data)) {
      usageData.value = response.data.map((item) => ({
        label: `${item.record_month_start}/${item.record_year_start} - ${item.record_month_end}/${item.record_year_end}`,
        total_grid_start: item.total_grid_start,
        total_grid_end: item.total_grid_end,
        total_solar_start: item.total_solar_start,
        total_solar_end: item.total_solar_end,
        grid_change_percent: item.grid_change_percent,
        solar_change_percent: item.solar_change_percent,
        value: item.total_grid_end, 
        color: item.grid_change_percent > 0 ? "green" : "red",
      }));
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API biểu đồ năng lượng:", error);
  }
};

onMounted(() => {
  fetchFactoryList();
});
</script>

<style scoped>
.title-energy {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}

.usage-card-energy {
  flex: 1;
  max-width: 700px;
  background: rgba(255, 204, 128, 0.6);
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
</style>
