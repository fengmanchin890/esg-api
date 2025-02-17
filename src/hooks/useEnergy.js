import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
const VITE_BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;
export function useEnergy() {
  const listData = ref([]);
  const searchQuery = ref(getCurrentYearMonth());
  const newRecord = ref({
    recordyear: "",
    recordmonth: "",
    gridElectricityMeter: "",
    solarEnergyMeter: "",
  });

  const listConfig = [
    { label: "ID", prop: "recordid", minWidth: "150px" },
    { label: "Factory", prop: "factoryid", minWidth: "150px" },
    { label: "Year", prop: "recordyear", minWidth: "100px" },
    { label: "Month", prop: "recordmonth", minWidth: "100px" },
    { mode: "text", label: "Grid Electricity", prop: "gridElectricityMeter", minWidth: "150px" },
    { mode: "text", label: "Solar Energy", prop: "solarEnergyMeter", minWidth: "150px" },
  ];

  const rowButtons = [
    {
      name: "Edit",
      type: "primary",
      vIf: (row) => !row.isEdit,
      click: (ref) => ref.edit(),
    },
    {
      name: "Save",
      type: "success",
      vIf: (row) => row.isEdit,
      click: async (ref, row) => {
        await updateRecord(row);
        ref.cancel();
      },
    },
    {
      name: "Cancel",
      type: "danger",
      vIf: (row) => row.isEdit,
      click: (ref) => ref.cancel(),
    },
    {
      name: "Delete",
      type: "danger",
      vIf: (row) => !row.isEdit,
      click: (ref, row) => deleteEnergy(row.recordid),
    },
  ];


  function getCurrentYearMonth() {
    const now = new Date();
    const year = now.getFullYear();
    // const month = String(now.getMonth() + 1).padStart(2, "0"); // 確保月份兩位數
    return `${year}`;
    // return `${year}${month}`;
  }



  const fetchEnergyData = async () => {
    try {
      // Lấy factoryID từ localStorage
      const factoryID = localStorage.getItem('DB_CHOICE');
  
      if (!factoryID) {
        console.error('Không tìm thấy FactoryID trong localStorage.');
        return;
      }
  
      // Gửi request với factoryID trong query string
      const response = await axios.get(`${VITE_BACKEND_URL}/api/v1/energy/get`, {
        params: {
          factoryID: factoryID, // Truyền factoryID vào query string
        },
      });
  
      // Lưu dữ liệu vào listData
      listData.value = response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };
  

  const addRecord = async () => {
    try {
      const userId = localStorage.getItem("USERID");
      const factoryId = localStorage.getItem("DB_CHOICE");

      if (!userId || !factoryId) {
        ElMessage.error("Không tìm thấy thông tin đăng nhập!");
        return;
      }

      const response = await axios.post(`${VITE_BACKEND_URL}/api/v1/energy/add`, {
        factoryid: factoryId,
        recordyear: parseInt(newRecord.value.recordyear),
        recordmonth: parseInt(newRecord.value.recordmonth),
        grid_electricity_meter: parseFloat(newRecord.value.gridElectricityMeter),
        solar_energy_meter: parseFloat(newRecord.value.solarEnergyMeter),
        userid: userId,
      });

      if (response.data.code === 200) {
        ElMessage.success("Thêm dữ liệu thành công!");
        fetchEnergyData();
        clearForm();
      } else {
        ElMessage.error("Thêm dữ liệu thất bại: " + response.data.msg);
      }
    } catch (error) {
      ElMessage.error("Có lỗi xảy ra khi thêm dữ liệu!");
    }
  };

  const updateRecord = async (row) => {
    try {
      const response = await axios.put(`${VITE_BACKEND_URL}/api/v1/energy/update`, {
        recordid: row.recordid,
        factoryid: row.factoryid,
        recordyear: parseInt(row.recordyear),
        recordmonth: parseInt(row.recordmonth),
        grid_electricity_meter: parseFloat(row.gridElectricityMeter),
        solar_energy_meter: parseFloat(row.solarEnergyMeter),
      });

      if (response.data.code === 200) {
        ElMessage.success("Cập nhật thành công!");
        fetchEnergyData();
      } else {
        ElMessage.error("Cập nhật thất bại: " + response.data.msg);
      }
    } catch (error) {
      ElMessage.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const deleteEnergy = async (recordid) => {
    try {
      await ElMessageBox.confirm(`Bạn có chắc chắn muốn xóa bản ghi có ID ${recordid}?`, "Xác nhận", {
        confirmButtonText: "Có",
        cancelButtonText: "Không",
        type: "warning",
      });

      const response = await axios.delete(`${VITE_BACKEND_URL}/api/v1/energy/delete`, {
        data: { recordid },
      });

      if (response.data.code === 200) {
        ElMessage.success("Xóa thành công!");
        fetchEnergyData();
      } else {
        ElMessage.error("Xóa thất bại: " + response.data.msg);
      }
    } catch (error) {
      ElMessage.error("Có lỗi xảy ra khi xóa!");
    }
  };

  const clearForm = () => {
    newRecord.value = {
      recordyear: "",
      recordmonth: "",
      grid_electricity_meter: "",
      solar_energy_meter: "",
    };
  };

  const filteredList = computed(() => {
    if (!searchQuery.value) return listData.value;
    const searchLower = searchQuery.value.toLowerCase().trim();

    return listData.value.filter((item) => {
      const yearMonth = `${item.recordyear}-${item.recordmonth}`;
      return (
        item.recordyear.toString().includes(searchLower) ||
        item.recordmonth.toString().includes(searchLower) ||
        yearMonth.includes(searchLower)
      );
    });
  });

  onMounted(fetchEnergyData);

  return {
    listData,
    searchQuery,
    newRecord,
    listConfig,
    rowButtons,
    filteredList,
    fetchEnergyData,
    addRecord,
    updateRecord,
    deleteEnergy,
  };
}
