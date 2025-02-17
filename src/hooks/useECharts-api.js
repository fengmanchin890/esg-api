// hooks/useECharts-api.js
import { ref } from "vue";
import axios from "axios";
import useECharts from "./useECharts";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const rawData = ref({});
export const factoryList = ref([]);
export const availableYears = ref(
  Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => (2000 + i).toString()).reverse()
);

export const availableMonths = ref([
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
]);

export const fetchFactoryList = async () => {
  try {
    const response = await axios.get(`${VITE_BACKEND_URL}/api/v1/factories/get`);
    if (response.data?.data && Array.isArray(response.data.data)) {
      factoryList.value = response.data.data.map(factory => ({
        label: factory.factoryname,
        value: factory.factoryid,
      }));
      console.log("✅ Factory List Updated:", factoryList.value);
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API danh sách factories:", error);
  }
};

// 🔄 Lấy dữ liệu ECharts
export const fetchRawData = async (factoryId, year) => {
  try {
    // console.log(`🔄 Gọi API dữ liệu cho Factory: ${factoryId}, Year: ${year}`);

    if (!rawData.value[factoryId]) {
      rawData.value[factoryId] = {};
    }

    const results = await Promise.allSettled([
      axios.post(`${VITE_BACKEND_URL}/api/v1/stats/searchenergy`, { factory_id: factoryId, year }),
      axios.post(`${VITE_BACKEND_URL}/api/v1/stats/searchsolarenergy`, { factory_id: factoryId, year }),
      axios.post(`${VITE_BACKEND_URL}/api/v1/stats/searchwater`, { factory_id: factoryId, year }),
      axios.post(`${VITE_BACKEND_URL}/api/v1/stats/searchrecycledwater`, { factory_id: factoryId, year }),
    ]);

    //console.log("📦 Kết quả API:", JSON.stringify(results, null, 2));

    rawData.value[factoryId][year] = {
      energy: results[0].status === "fulfilled" ? results[0].value.data.data.map(item => item.value) : [],
      solarenergy: results[1].status === "fulfilled" ? results[1].value.data.data.map(item => item.value) : [],
      water: results[2].status === "fulfilled" ? results[2].value.data.data.map(item => item.value) : [],
      recycledwater: results[3].status === "fulfilled" ? results[3].value.data.data.map(item => item.value) : [],
    };

    // console.log("✅ Dữ liệu rawData sau khi cập nhật:", JSON.stringify(rawData.value, null, 2));
  } catch (error) {
    // console.error(`❌ Lỗi khi lấy dữ liệu cho Factory ${factoryId}, Year ${year}:`, error);
  }
};

// ✅ Hàm khởi tạo API
export const initData = async () => {
  await fetchFactoryList();
};

// ✅ Hàm gọi dữ liệu biểu đồ
export const useEChartsData = async (factoryId, year) => {
  if (factoryId && year) {
    await fetchRawData(factoryId, year);
  }
};
