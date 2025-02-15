import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
const VITE_BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}`;
export function useWater() {
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
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 確保月份兩位數
    return `${year}${month}`;
  }



  const fetchWaterData = async () => {
    try {
      const factoryID = localStorage.getItem('DB_CHOICE');
  
      if (!factoryID) {
        console.error('Không tìm thấy FactoryID trong localStorage.');
        return;
      }
  
      const response = await axios.get(`${VITE_BACKEND_URL}/api/v1/water/get`, {
        params: {
          factoryID: factoryID, // Truyền factoryID vào query string
        },
      });
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
  
      // Gửi request đến API
      const response = await axios.post(`${VITE_BACKEND_URL}/api/v1/water/add`, {
        factoryid: factoryId,
        recordyear: parseInt(newRecord.value.recordyear) || 0,
        recordmonth: parseInt(newRecord.value.recordmonth) || 0,
        tapWaterMeter: isNaN(parseFloat(newRecord.value.tapWaterMeter)) ? 0 : parseFloat(newRecord.value.tapWaterMeter),
        recycledWaterMeter: isNaN(parseFloat(newRecord.value.recycledWaterMeter)) ? 0 : parseFloat(newRecord.value.recycledWaterMeter),
        userid: userId,
      });
      console.log(response)
      // Kiểm tra mã phản hồi từ server
      if (response.data.code === 200) {
        ElMessage.success("Thêm dữ liệu thành công!");
        fetchWaterData();
        clearForm();
      } else {
        ElMessage.error("Thêm dữ liệu thất bại: " + response.data.msg);
      }
    } catch (error) {
      // Ghi log lỗi chi tiết
      console.error("Lỗi chi tiết khi thêm dữ liệu:", error);
      
      if (error.response) {
        // Nếu lỗi từ server (HTTP response lỗi)
        ElMessage.error(`Lỗi từ server: ${error.response.data.message || "Không xác định"}`);
      } else if (error.request) {
        // Nếu không có phản hồi từ server (có thể lỗi kết nối mạng)
        ElMessage.error("Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng!");
      } else {
        // Nếu lỗi trong khi thiết lập yêu cầu (có thể do cấu hình sai)
        ElMessage.error("Lỗi khi thiết lập yêu cầu: " + error.message);
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
        ElMessage.success("Cập nhật thành công!");
        fetchWaterData();
      } else {
        ElMessage.error("Cập nhật thất bại: " + response.data.msg);
      }
    } catch (error) {
      ElMessage.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const deleteWater = async (recordid) => {
    try {
      await ElMessageBox.confirm(`Bạn có chắc chắn muốn xóa bản ghi có ID ${recordid}?`, "Xác nhận", {
        confirmButtonText: "Có",
        cancelButtonText: "Không",
        type: "warning",
      });

      const response = await axios.delete(`${VITE_BACKEND_URL}/api/v1/water/delete`, {
        data: { recordid },
      });

      if (response.data.code === 200) {
        ElMessage.success("Xóa thành công!");
        fetchWaterData();
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
