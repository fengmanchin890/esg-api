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
        <el-input v-model="newRecord.gridElectricityMeter" />
      </div>
      <div>
        <label>Solar Energy Meter</label>
        <el-input v-model="newRecord.solarEnergyMeter" />
      </div>
      <el-button type="primary" @click="addRecord">INSERT</el-button>
      <div class="search-bar">
        <el-input v-model="searchQuery" placeholder="search by Year - Month" clearable />
      </div>
    </div>

    <ry-edit-table ref="ryEditTable" class="table-container" :listData="filteredList" :listConfig="listConfig"
      :rowButtons="rowButtons" :operationsConfig="{ width: 173 }" :action="'action'" :cellStyle="{ color: 'orange' }"
      :cellClassName="'custom-cell-class'" trigger="onChange" height="625px" />
  </div>
</template>

<script setup>
import { useEnergy } from "@/hooks/useEnergy";
import { CirclePlus } from "@element-plus/icons-vue";

const { newRecord, searchQuery, listConfig, rowButtons, filteredList, addRecord } = useEnergy();
</script>

<style scoped>
#DemoPage {
  height: 85vh;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(226, 44, 31, 0.829);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  justify-content: center;
  padding: 10px 0;
  margin: -50px 0;
}

.icon {
  width: 60px;
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
  font-size: 18px;

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


.search-bar .el-input input {
  font-size: 14px;
  padding: 10px;
}

.table-container {
  max-height: 580px;
  overflow-y: auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

:deep(.el-table) {
  font-size: 18px;
}

:deep(.el-table thead th) {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  font-size: 18px;
}
</style>
