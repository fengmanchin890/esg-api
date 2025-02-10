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
    </div>

    <ry-edit-table ref="ryEditTable" :listData="listData" :listConfig="listConfig" :rowButtons="rowButtons"
      :operationsConfig="{ width: 173 }" :action="'action'" :cellStyle="{ color: 'orange' }"
      :cellClassName="'custom-cell-class'" trigger="onChange" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useEnergy } from "../hooks/useEnergy";
import { CirclePlus } from "@element-plus/icons-vue";

const { listData, newRecord, listConfig, addRecord, updateRecord, deleteEnergy } = useEnergy();

const rowButtons = [
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
      await updateRecord(row);
      ref.cancel();
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
      deleteEnergy(row.recordid);
    },
  },
];
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
</style>
