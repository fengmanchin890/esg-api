<template>
    <div style=" border: 1px solid lightgray; padding: 20px; border-radius: 20px; box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px; background-color: white; min-width: 800px;">
      <div class="header">
        <div class="icon-section">
          <img src="../assets/energy.png" alt="Energy" class="icon" />
          <span>Power Usage</span>
        </div>
        <div class="search-section">
          <el-input v-model="searchQuery" placeholder="yyyymm" class="input-with-select">
            <template #prepend>
              <el-button :icon="Search" />
            </template>
            <template #append>
              <div>Year - Month</div>
            </template>
          </el-input>
          <el-button type="success" @click="dialogVisible = true">
          <el-icon class="el-icon--left"><Back /></el-icon> INSERT
        </el-button>
        </div>
  
      </div>
  
      <!-- 資料表 -->
        <ry-edit-table 
        ref="ryEditTable" 
        class="table-container" 
        :listData="filteredList" 
        :listConfig="listConfig"
        :rowButtons="rowButtons" 
        :operationsConfig="{ width: 180 }" 
        :action="'action'" 
        :cellStyle="{ color: 'black' }"
        :cellClassName="'custom-cell-class'" 
        trigger="onChange" 
        height="700"
      />
  
  
      <!-- INSERT Dialog -->
      <el-dialog v-model="dialogVisible" title="Add New Record" width="520px" class="custom-dialog">
          <div class="input-container">
            <!-- 年份選擇 -->
            <div class="input-row">
              <label>Record Year</label>
              <el-date-picker
                style="width: 100%;"
                v-model="newRecord.recordyear"
                type="year"
                placeholder="Select Year"
                format="YYYY"
                value-format="YYYY"
                clearable
              />
            </div>

            <!-- 月份選擇 -->
            <div class="input-row">
              <label>Record Month</label>
              <el-select v-model="newRecord.recordmonth" placeholder="Select Month" clearable>
                <el-option v-for="month in 12" :key="month" :label="month" :value="String(month).padStart(2, '0')" />
              </el-select>
            </div>

            <!-- Grid Electricity Meter -->
            <div class="input-row">
              <label>Grid Electricity Meter</label>
              <el-input v-model="newRecord.gridElectricityMeter" clearable />
            </div>

            <!-- Solar Energy Meter -->
            <div class="input-row">
              <label>Solar Energy Meter</label>
              <el-input v-model="newRecord.solarEnergyMeter" clearable />
            </div>
          </div>

          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogVisible = false" type="info" plain>Cancel</el-button>
              <el-button type="success" @click="addRecord">Confirm</el-button>
            </div>
          </template>
        </el-dialog>


    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { Search, Back } from "@element-plus/icons-vue";
  import { useEnergy } from "@/hooks/useEnergy";
  
  const { newRecord, searchQuery, listConfig, rowButtons, filteredList, addRecord } = useEnergy();
  const dialogVisible = ref(false);
  </script>
  
  <style scoped>
  


  .input-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .input-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .input-row label {
      width: 300px; /* 固定 Label 寬度，讓輸入框對齊 */
      text-align: left;
      font-weight: 600;
    }


  /* 頂部 Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-wrap: wrap; /* 允許換行 */
  }
  .icon{
    width: 60px;
  }
  
  .input-with-select{
    max-width: 300px;
  }
  /* Icon 部分 */
  .icon-section {
    display: flex;
    align-items: center;
    gap: 10px;
    color: rgba(232, 79, 8, 0.9);
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    font-size: 40px;
    width: 35%;
    min-width: 200px;
    font-weight: 700;
    padding-bottom: 10px;
  }
  
  /* 搜尋欄 */
  .search-section {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-grow: 1;
  }
  
  /* RWD 設計：小螢幕時 Header 改為 Column */
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }
  
    .icon-section, 
    .search-section {
      width: 100%;
      justify-content: center;
    }
  
    .search-section {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
  
  /* Table 樣式 */
  .table-container {
    display: flex;
    overflow: hidden;
    width: 100%;
    align-items: start;
    justify-content: center;
    border: 1px solid lightgray;
  
  }

  /* button nowrap */
:deep(.cell) {
  display: flex;
}
  
  /* Dialog 美化 */
  .custom-dialog {
    border-radius: 12px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
  }
  
  
  /* Dialog Footer */
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  </style>
  