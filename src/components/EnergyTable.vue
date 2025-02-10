<template>
  <div id="DemoPage">
    <div class="title">
      <img src="../assets/energy.png" alt="energy" class="icon" />
      <h1> Energy</h1>
    </div>

    <div class="energy-input">
      <div>
        <el-icon class="icon-add">
          <CirclePlus />
        </el-icon>
      </div>

      <div>
        <label>Record Year</label>
        <el-input v-model="newRecord.recordyear" />
      </div>
      <div>
        <label>Record Month</label>
        <el-input v-model="newRecord.recordmonth" />
      </div>
      <div>
        <label>Grid Electricity Meter</label>
        <el-input v-model="newRecord.grid_electricity_meter" />
      </div>
      <div>
        <label>Solar Energy Meter</label>
        <el-input v-model="newRecord.solar_energy_meter" />
      </div>
      <el-button type="primary" @click="addRecord">INSERT</el-button>
      <!-- Ô tìm kiếm -->
      <div class="search-bar">
        <el-input v-model="searchQuery" placeholder="search by Year - Month"
          clearable />
      </div>

    </div>


    <ry-edit-table ref="ryEditTable" :listData="filteredList" :listConfig="listConfig" :rowButtons="rowButtons"
      :operationsConfig="{ width: 173 }" :action="'action'" :cellStyle="{ color: 'orange' }"
      :cellClassName="'custom-cell-class'" trigger="onChange" />


  </div>
</template>

<script>
import axios from "axios";
import { CirclePlus } from '@element-plus/icons-vue';

export default {
  name: "demoPage",
  components: {
    CirclePlus,
  },
  data() {
    return {
      listData: [], // Dữ liệu từ API
      searchQuery: "", // Biến lưu từ khóa tìm kiếm
      newRecord: {
        recorddate: "",
        factoryid: "",
        grid_electricity_meter: "",
        solar_energy_meter: "",
        userid: "",
        userdate: "",
      },
      listConfig: [
        { label: "ID", prop: "recordid", minWidth: "150px" },
        { label: "Factory", prop: "factoryid", minWidth: "150px" },
        { label: "Year", prop: "recordyear", minWidth: "100px" },
        { label: "Month", prop: "recordmonth", minWidth: "100px" },
        { mode: "text", label: "Grid Electricity", prop: "grid_electricity_meter", minWidth: "150px" },
        { mode: "text", label: "Solar Energy", prop: "solar_energy_meter", minWidth: "150px" },
      ],
      rowButtons: [
        {
          name: "Edit",
          type: "primary",
          vIf: (row) => !row.isEdit,
          click: (ref) => {
            ref.edit();
          },
        },
        {
          name: "Save",
          type: "success",
          vIf: (row) => row.isEdit,
          click: async (ref, row) => {
            await this.updateRecord(row); // Gọi API cập nhật dữ liệu
            ref.cancel(); // Kết thúc chế độ chỉnh sửa
          },
        },
        {
          name: "Cancel",
          type: "danger",
          vIf: (row) => row.isEdit,
          click: (ref) => {
            ref.cancel();
          },
        },
        {
          name: "Delete",
          type: "danger",
          vIf: (row) => !row.isEdit,
          click: (ref, row) => {
            this.deleteEnergy(row.recordid); // Gọi API xóa
          },
        },
      ]
    };
  },
  created() {
    this.fetchEnergyData();
  },
  computed: {
    filteredList() {
      if (!this.searchQuery) return this.listData;
      const searchLower = this.searchQuery.toLowerCase().trim();

      return this.listData.filter((item) => {
        const yearMonth = `${item.recordyear}-${item.recordmonth}`; // Ghép năm-tháng
        return (
          item.recordyear.toString().includes(searchLower) ||
          item.recordmonth.toString().includes(searchLower) ||
          yearMonth.includes(searchLower) // Tìm theo định dạng "YYYY-MM"
        );
      });
    },
  },
  methods: {
    async fetchEnergyData() {
      try {
        const response = await axios.get("http://localhost:8081/api/v1/energy/get");
        this.listData = response.data.data;
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    },
    async addRecord() {
      try {
        const userId = localStorage.getItem("USERID");
        if (!userId) {
          this.$message.error("Không tìm thấy UserID, vui lòng đăng nhập lại!");
          return;
        }

        const factoryId = localStorage.getItem("DB_CHOICE");
        if (!factoryId) {
          this.$message.error("Không tìm thấy factoryId, vui lòng đăng nhập lại!");
          return;
        }

        const response = await axios.post("http://localhost:8081/api/v1/energy/add", {
          factoryid: factoryId,
          recordyear: parseInt(this.newRecord.recordyear),
          recordmonth: parseInt(this.newRecord.recordmonth),
          grid_electricity_meter: parseFloat(this.newRecord.grid_electricity_meter),
          solar_energy_meter: parseFloat(this.newRecord.solar_energy_meter),
          userid: userId,
        });

        console.log("📩 API Response:", response.data); // Kiểm tra phản hồi từ server

        if (response.data.code === 200) {
          this.$message.success("Thêm dữ liệu thành công!");
          this.fetchEnergyData();
          this.clearForm();
        } else {
          this.$message.error("Thêm dữ liệu thất bại: " + response.data.msg);
        }
      } catch (error) {
        console.error("❌ Lỗi khi thêm dữ liệu:", error);

        // Kiểm tra nếu lỗi từ server có response
        if (error.response) {
          console.log("🛑 Server Response Error:", error.response.data);
          this.$message.error("Lỗi từ server: " + (error.response.data.msg || "Không rõ nguyên nhân!"));
        } else {
          this.$message.error("Có lỗi xảy ra khi thêm dữ liệu!");
        }
      }
    },
    async updateRecord(row) {
      try {
        const response = await axios.put("http://localhost:8081/api/v1/energy/update", {
          recordid: row.recordid,
          factoryid: row.factoryid,
          recordyear: parseInt(row.recordyear),   // Ép kiểu thành số nguyên
          recordmonth: parseInt(row.recordmonth), // Ép kiểu thành số nguyên
          grid_electricity_meter: parseFloat(row.grid_electricity_meter), // Ép kiểu thành float
          solar_energy_meter: parseFloat(row.solar_energy_meter),         // Ép kiểu thành float
        });

        if (response.data.code === 200) {
          this.$message.success("Cập nhật thành công!");
          this.fetchEnergyData(); // Load lại dữ liệu từ API
        } else {
          this.$message.error("Cập nhật thất bại: " + response.data.msg);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        this.$message.error("Có lỗi xảy ra khi cập nhật!");
      }
    },
    async deleteEnergy(recordid) {
      try {
        // Xác nhận trước khi xóa
        this.$confirm(`Bạn có chắc chắn muốn xóa bản ghi có ID ${recordid}?`, "Xác nhận", {
          confirmButtonText: "Có",
          cancelButtonText: "Không",
          type: "warning",
        }).then(async () => {
          const response = await axios.delete(`http://localhost:8081/api/v1/energy/delete`, {
            data: { recordid: recordid }, // Gửi trong `data` nếu backend yêu cầu JSON
          });

          if (response.data.code === 200) {
            this.$message.success("Xóa thành công!");
            this.fetchEnergyData(); // Load lại danh sách
          } else {
            this.$message.error("Xóa thất bại: " + response.data.msg);
          }
        });
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        this.$message.error("Có lỗi xảy ra khi xóa!");
      }
    },
    // Hàm xóa dữ liệu trong form
    clearForm() {
      this.newRecord = {
        recordyear: "",
        recordmonth: "",
        grid_electricity_meter: "",
        solar_energy_meter: "",
      };
    },
  },
};
</script>


<style scoped>
.title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(226, 44, 31, 0.829);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  justify-content: center;
  padding: 20px;
}

.icon {
  width: 140px;
}

.icon-add {
  color: green;
  font-size: 25px;
}

.energy-input {
  display: flex;
  align-items: center;
  padding: 20px 0;
  gap: 20px;
}

.energy-input div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.energy-input label {
  white-space: nowrap;
  text-align: right;
}

.search-bar {
  display: flex;
}

.search-bar .el-input {
  max-width: 100%;
  border-radius: 8px;
  /* Bo góc */
  border: 1px solid #ccc;
}

.search-bar .el-input input {
  font-size: 14px;
  /* Cỡ chữ */
  padding: 10px;
  /* Padding bên trong */
}
</style>
