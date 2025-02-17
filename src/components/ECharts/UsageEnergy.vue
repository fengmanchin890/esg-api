<template>
  <div class="usage-card-energy">
    <h3 class="title-energy">
      <img src="@/assets/energy.png" alt="energy" class="icon" /> Energy Usage
    </h3>

    <div class="filter-section">
      <a-select v-model:value="selectedFactory" :options="factoryOptions" placeholder="Select Factory" />
      <!-- Dropdown để chọn nhà máy -->
      <a-range-picker v-model:value="dateRange" picker="month" format="YYYY-MM" />
      <!-- Chọn khoảng thời gian (tháng) để xem dữ liệu -->
      <a-button type="primary" @click="fetchEnergyChartData">Create charts</a-button>
      <!-- Nút để tạo biểu đồ năng lượng -->
    </div>

    <div class="usage-content">
      <div class="usage-year" v-for="(data, index) in usageData" :key="index">
        <div class="data-column">
          <p class="day">{{ data.label }}</p>
          <!-- Hiển thị khoảng thời gian, ví dụ: Tháng 1/2023 - Tháng 2/2023 -->
        </div>

        <div class="circle-container">

          <div class="circle" :class="data.color">
            {{ data.total_grid_start }} kWh
            <p class="label">Total Grid Start</p>
            <!-- Hiển thị tổng năng lượng lưới tại thời điểm đầu kỳ -->
          </div>

          <div class="circle" :class="data.color">
            {{ data.total_grid_end }} kWh
            <p class="label">Total Grid End</p>
            <!-- Hiển thị tổng năng lượng lưới tại thời điểm cuối kỳ -->
          </div>
          
        </div>

        <span class="percent" :class="{
          red: data.grid_change_percent < 0,
          green: data.grid_change_percent > 0
        }">
          {{ data.grid_change_percent !== undefined ? data.grid_change_percent : 0 }}%
          <!-- Hiển thị phần trăm thay đổi năng lượng lưới -->
          <span v-if="data.grid_change_percent > 0">↑</span>
          <!-- Mũi tên lên nếu thay đổi phần trăm là dương -->
          <span v-if="data.grid_change_percent < 0">↓</span>
          <!-- Mũi tên xuống nếu thay đổi phần trăm là âm -->
        </span>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import { message } from "ant-design-vue";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const selectedFactory = ref(null);
const dateRange = ref([dayjs().startOf('month'), dayjs().endOf('month')]); // Đặt mặc định là tháng hiện tại
const factoryOptions = ref([]);
const usageData = ref([]); // Dữ liệu biểu đồ

// 🛠 API: Lấy danh sách nhà máy
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

// 🛠 API: Lấy dữ liệu biểu đồ năng lượng
const fetchEnergyChartData = async () => {
  if (!selectedFactory.value || dateRange.value.length !== 2) {
    message.error("Vui lòng chọn nhà máy và khoảng thời gian.");
    return;
  }

  const startDate = dateRange.value[0];
  const endDate = dateRange.value[1];

  const payload = {
    factory_id: selectedFactory.value, // Truyền id nhà máy
    start_year: startDate.year(), // Năm bắt đầu
    start_month: startDate.month() + 1, // Tháng bắt đầu (cộng 1 vì tháng trả về từ 0 đến 11)
    end_year: endDate.year(), // Năm kết thúc
    end_month: endDate.month() + 1, // Tháng kết thúc
  };

  // Log dữ liệu truyền vào API
  console.log("Dữ liệu truyền vào API:", payload);

  try {
    const response = await axios.post(`${VITE_BACKEND_URL}/api/v1/stats/energychart`, payload);

    // Log dữ liệu trả về từ API
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
        value: item.total_grid_end, // Chọn giá trị hiển thị là total_grid_end hoặc bất kỳ giá trị nào bạn muốn
        color: item.grid_change_percent > 0 ? "green" : "red", // Màu sắc cho biểu đồ
      }));
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API biểu đồ năng lượng:", error);
  }
};

// Gọi API khi component được mounted
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
