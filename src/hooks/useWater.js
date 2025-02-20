//hooks/useWater.js
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
const VITE_BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;
export function useWater(t) {
  const listData = ref([]);
  const searchQuery = ref(getCurrentYearMonth());
  const newRecord = ref({
    recordyear: "",
    recordmonth: "",
    tapWaterMeter: "",
    recycledWaterMeter: "",
  });
  const listConfig = [
    { label: "ID", prop: "recordid", minWidth: "150px" },
    { label: "Factory", prop: "factoryid", minWidth: "150px" },
    { label: "Year", prop: "recordyear", minWidth: "100px" },
    { label: "Month", prop: "recordmonth", minWidth: "100px" },
    { mode: "text", label: "Tap Water Meter", prop: "tapWaterMeter", minWidth: "150px" },
    { mode: "text", label: "Recycled Water Meter", prop: "recycledWaterMeter", minWidth: "150px" },
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
      click: (ref, row) => deleteWater(row.recordid),
    },
  ];
  function getCurrentYearMonth() {
    const now = new Date();
    const year = now.getFullYear();
    return `${year}`;
  }
  const fetchWaterData = async () => {
    try {
      const factoryID = localStorage.getItem('DB_CHOICE');
      if (!factoryID) {
        console.error("FactoryID not found in localStorage.");
        return;
      }
      const response = await axios.get(`${VITE_BACKEND_URL}/api/v1/water/get`, {
        params: { factoryID },
      });
      listData.value = response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const addRecord = async () => {
    try {
      const userId = localStorage.getItem("USERID");
      const factoryId = localStorage.getItem("DB_CHOICE");
      if (!userId || !factoryId) {
        ElMessage.error(t("waterUsage.noLoginInfo"));
        return;
      }
      const response = await axios.post(`${VITE_BACKEND_URL}/api/v1/water/add`, {
        factoryid: factoryId,
        recordyear: parseInt(newRecord.value.recordyear) || 0,
        recordmonth: parseInt(newRecord.value.recordmonth) || 0,
        tapWaterMeter: isNaN(parseFloat(newRecord.value.tapWaterMeter)) ? 0 : parseFloat(newRecord.value.tapWaterMeter),
        recycledWaterMeter: isNaN(parseFloat(newRecord.value.recycledWaterMeter)) ? 0 : parseFloat(newRecord.value.recycledWaterMeter),
        userid: userId,
      });
      if (response.data.code === 200) {
        ElMessage.success(t("waterUsage.addSuccess"));
        fetchWaterData();
        clearForm();
      } else {
        ElMessage.error(t("waterUsage.addFailed") + ": " + response.data.msg);
      }
    } catch (error) {
      console.error("Error adding record:", error);
      if (error.response) {
        ElMessage.error(t("waterUsage.serverError") + ": " + (error.response.data.message || t("waterUsage.unknown")));
      } else if (error.request) {
        ElMessage.error(t("waterUsage.noServerResponse"));
      } else {
        ElMessage.error(t("waterUsage.requestSetupError") + ": " + error.message);
      }
    }
  };
  const updateRecord = async (row) => {
    try {
      const response = await axios.put(`${VITE_BACKEND_URL}/api/v1/water/update`, {
        recordid: row.recordid,
        factoryid: row.factoryid,
        recordyear: parseInt(row.recordyear) || 0,
        recordmonth: parseInt(row.recordmonth) || 0,
        tapWaterMeter: isNaN(parseFloat(row.tapWaterMeter)) ? 0 : parseFloat(row.tapWaterMeter),
        recycledWaterMeter: isNaN(parseFloat(row.recycledWaterMeter)) ? 0 : parseFloat(row.recycledWaterMeter),
      });
      if (response.data.code === 200) {
        ElMessage.success(t("waterUsage.updateSuccess"));
        fetchWaterData();
      } else {
        ElMessage.error(t("waterUsage.updateFailed") + ": " + response.data.msg);
      }
    } catch (error) {
      ElMessage.error(t("waterUsage.updateError"));
    }
  };
  const deleteWater = async (recordid) => {
    try {
      await ElMessageBox.confirm(
        t("waterUsage.deleteConfirm", { recordid }),
        t("waterUsage.confirm"),
        {
          confirmButtonText: t("waterUsage.yes"),
          cancelButtonText: t("waterUsage.no"),
          type: "warning",
        }
      );
      
      const response = await axios.delete(`${VITE_BACKEND_URL}/api/v1/water/delete`, {
        data: { recordid },
      });
      if (response.data.code === 200) {
        ElMessage.success(t("waterUsage.deleteSuccess"));
        fetchWaterData();
      } else {
        ElMessage.error(t("waterUsage.deleteFailed") + ": " + response.data.msg);
      }
    } catch (error) {
      // ElMessage.error(t("waterUsage.deleteError"));
    }
  };
  const clearForm = () => {
    newRecord.value = {
      recordyear: "",
      recordmonth: "",
      tapWaterMeter: "",
      recycledWaterMeter: "",
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
  onMounted(fetchWaterData);
  return {
    listData,
    searchQuery,
    newRecord,
    listConfig,
    rowButtons,
    filteredList,
    fetchWaterData,
    addRecord,
    updateRecord,
    deleteWater,
  };
}
