<template>
  <div id="DemoPage">
    <div class="title">
      <img src="../assets/water.png" alt="water" class="icon" />
      <h1>Water</h1>
    </div>
    <div class="water-input">
      <div>
        <label>Record Year</label>
        <el-input v-model="newRecord.recordyear" />
      </div>
      <div>
        <label>Record Month</label>
        <el-input v-model="newRecord.recordmonth" />
      </div>
      <div>
        <label>Tap Water Meter</label>
        <el-input v-model="newRecord.tapWaterMeter" />
      </div>
      <div>
        <label>Recycled Water Meter</label>
        <el-input v-model="newRecord.recycledWaterMeter" />
      </div>
      <el-button type="primary" @click="addRecord">INSERT</el-button>
      <div class="search-bar">
        <el-input v-model="searchQuery" placeholder="Search by Year - Month" clearable :prefix-icon="Search">
        </el-input>
      </div>
    </div>

    <ry-edit-table ref="ryEditTable" class="table-container" :listData="filteredList" :listConfig="listConfig"
      :rowButtons="rowButtons" :operationsConfig="{ width: 170 }" :action="'action'" :cellStyle="{ color: 'orange' }"
      :cellClassName="'custom-cell-class'" trigger="onChange" height="675px" />
  </div>
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
import { useWater } from "@/hooks/useWater";

const { newRecord, searchQuery, listConfig, rowButtons, filteredList, addRecord } = useWater();
</script>

<style scoped>
#DemoPage {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(226, 44, 31, 0.829);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  justify-content: center;
  margin: -50px 0 -50px -64px;
}

.icon {
  width: 60px;
}

.water-input {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  gap: 20px;
  padding: 20px 0;
  font-size: 18px;
}

.water-input div {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
}

.water-input label {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: fit-content;
}

.water-input .el-input {
  display: flex;
  align-items: center;
  min-width: 60px;
}

.search-bar {
  display: flex;
  align-items: center;
  min-width: 90px;
}

.table-container {
  display: flex;
  min-width: 100%;
  max-height: 1000px;
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
  z-index: 10;
  font-size: 18px;
}

:deep(.el-table .cell) {
  display: flex;
  flex-wrap: nowrap;
  padding: 0 10px;
}
</style>
