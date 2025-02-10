import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

export function useEnergy() {
  const listData = ref([]);
  const newRecord = ref({
    recordyear: "",
    recordmonth: "",
    grid_electricity_meter: "",
    solar_energy_meter: "",
  });

  const listConfig = [
    { label: "RecordID", prop: "recordid", minWidth: "150px" },
    { label: "FactoryID", prop: "factoryid", minWidth: "150px" },
    { label: "Year", prop: "recordyear", minWidth: "100px" },
    { label: "Month", prop: "recordmonth", minWidth: "100px" },
    { mode: "text", label: "Grid Electricity", prop: "grid_electricity_meter", minWidth: "150px" },
    { mode: "text", label: "Solar Energy", prop: "solar_energy_meter", minWidth: "150px" },
  ];

  const fetchEnergyData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v1/energy/get");
      listData.value = response.data.data;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  const addRecord = async () => {
    try {
      const userId = localStorage.getItem("USERID");
      if (!userId) {
        ElMessage.error("Không tìm thấy UserID, vui lòng đăng nhập lại!");
        return;
      }

      const factoryId = localStorage.getItem("DB_CHOICE");
      if (!factoryId) {
        ElMessage.error("Không tìm thấy factoryId, vui lòng đăng nhập lại!");
        return;
      }

      const response = await axios.post("http://localhost:8081/api/v1/energy/add", {
        factoryid: factoryId,
        recordyear: parseInt(newRecord.value.recordyear),
        recordmonth: parseInt(newRecord.value.recordmonth),
        grid_electricity_meter: parseFloat(newRecord.value.grid_electricity_meter),
        solar_energy_meter: parseFloat(newRecord.value.solar_energy_meter),
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
      console.error("Lỗi khi thêm dữ liệu:", error);
      ElMessage.error("Có lỗi xảy ra khi thêm dữ liệu!");
    }
  };

  const updateRecord = async (row) => {
    try {
      const response = await axios.put("http://localhost:8081/api/v1/energy/update", {
        recordid: row.recordid,
        factoryid: row.factoryid,
        recordyear: parseInt(row.recordyear),
        recordmonth: parseInt(row.recordmonth),
        grid_electricity_meter: parseFloat(row.grid_electricity_meter),
        solar_energy_meter: parseFloat(row.solar_energy_meter),
      });

      if (response.data.code === 200) {
        ElMessage.success("Cập nhật thành công!");
        fetchEnergyData();
      } else {
        ElMessage.error("Cập nhật thất bại: " + response.data.msg);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
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

      const response = await axios.delete(`http://localhost:8081/api/v1/energy/delete`, {
        data: { recordid: recordid },
      });

      if (response.data.code === 200) {
        ElMessage.success("Xóa thành công!");
        fetchEnergyData();
      } else {
        ElMessage.error("Xóa thất bại: " + response.data.msg);
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
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

  onMounted(() => {
    fetchEnergyData();
  });

  return {
    listData,
    newRecord,
    listConfig,
    addRecord,
    updateRecord,
    deleteEnergy,
  };
}
