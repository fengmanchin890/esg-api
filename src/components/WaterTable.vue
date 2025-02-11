<template>
  <div id="DemoPage">
    <div class="title">
      <img src="../assets/water.png" alt="water" class="icon"/>
      <h1>Water</h1>
    </div>
    <div class="water-input">
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
        <label>Tap Water Meter</label>
        <el-input v-model="newRecord.tapWaterMeter" />
      </div>
      <div>
        <label>Recycled Water Meter</label>
        <el-input v-model="newRecord.recycledWaterMeter" />
      </div>
      <el-button type="primary" @click="addRecord">INSERT</el-button>
      <div class="search-bar">
        <el-input v-model="searchQuery" placeholder="search by Year - Month" clearable />
      </div>
    </div>

      <ry-edit-table ref="ryEditTable" :listData="filteredList" :listConfig="listConfig" :rowButtons="rowButtons"
        :operationsConfig="{ width: 173 }" :action="'action'" :cellStyle="{ color: 'orange' }"
        :cellClassName="'custom-cell-class'" trigger="onChange" />
  </div>
</template>

<script setup>
import { CirclePlus } from "@element-plus/icons-vue";
import { useWater } from "@/hooks/useWater";
const { newRecord, searchQuery, listConfig, rowButtons, filteredList, addRecord } = useWater();
</script>

<style scoped>
#DemoPage {
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
}

.title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(61, 243, 243, 0.973);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  justify-content: center;
  padding: 20px 0;
  margin: -55px 0;
}

.icon {
  width: 60px;
}

.icon-add {
  color: green;
  font-size: 25px;
}

.water-input {
  display: flex;
  align-items: center;
  padding: 20px 0;
  gap: 20px;
}

.water-input div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.water-input label {
  white-space: nowrap;
  text-align: right;
}
</style>