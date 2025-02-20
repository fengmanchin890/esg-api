<!-- components/WaterTable.vue -->
<template>
  <div style="border: 1px solid lightgray; padding: 20px; border-radius: 20px; box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px; background-color: white; min-width: 800px;">
    <div class="header">
      <div class="icon-section">
        <img src="../assets/water.png" alt="water" class="icon" />
        <span>{{ t("waterUsage.waterUsage") }}</span>
      </div>
      <div class="search-section">
        <el-input v-model="searchQuery" :placeholder="t('waterUsage.placeholder.yyyymm')" class="input-with-select">
          <template #prepend>
            <el-button :icon="Search" />
          </template>
          <template #append>
            <div>{{ t("waterUsage.yearMonth") }}</div>
          </template>
        </el-input>
        <el-button type="success" @click="dialogVisible = true">
          <el-icon class="el-icon--left">
            <Back />
          </el-icon>
          {{ t("waterUsage.insert") }}
        </el-button>
      </div>
    </div>
    <ry-edit-table
      ref="ryEditTable"
      class="table-container"
      :listData="filteredList"
      :listConfig="listConfigTranslated"
      :rowButtons="rowButtonsTranslated"
      :operationsConfig="{ width: 180, label: t('waterUsage.actions') }"
      :action="'action'"
      :cellStyle="{ color: 'black' }"
      :cellClassName="'custom-cell-class'"
      trigger="onChange"
      height="700"
    />
    <el-dialog v-model="dialogVisible" :title="t('waterUsage.addNewRecord')" width="520px" class="custom-dialog">
      <div class="input-container">
        <div class="input-row">
          <label>{{ t("waterUsage.recordYear") }}</label>
          <el-date-picker style="width: 100%" v-model="newRecord.recordyear" type="year" :placeholder="t('waterUsage.selectYear')" format="YYYY" value-format="YYYY" clearable />
        </div>
        <div class="input-row">
          <label>{{ t("waterUsage.recordMonth") }}</label>
          <el-select v-model="newRecord.recordmonth" :placeholder="t('waterUsage.selectMonth')" clearable>
            <el-option v-for="month in 12" :key="month" :label="month" :value="String(month).padStart(2, '0')" />
          </el-select>
        </div>
        <div class="input-row">
          <label>{{ t("waterUsage.tapWaterMeter") }}</label>
          <el-input v-model="newRecord.tapWaterMeter" clearable />
        </div>
        <div class="input-row">
          <label>{{ t("waterUsage.recycledWaterMeter") }}</label>
          <el-input v-model="newRecord.recycledWaterMeter" clearable />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" type="info" plain>
            {{ t("waterUsage.cancel") }}
          </el-button>
          <el-button type="success" @click="addRecord">
            {{ t("waterUsage.confirm") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Search, Back } from "@element-plus/icons-vue";
import { useWater } from "@/hooks/useWater";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
const { newRecord, searchQuery, filteredList, addRecord, listConfig: originalListConfig, rowButtons: originalRowButtons } = useWater(t);
const listConfigArray = Array.isArray(originalListConfig) ? originalListConfig : [];
const columnsTranslationMap = {
  recordid: "waterUsage.columns.recordid",
  factoryid: "waterUsage.columns.factoryid",
  recordyear: "waterUsage.columns.recordyear",
  recordmonth: "waterUsage.columns.recordmonth",
  tapWaterMeter: "waterUsage.columns.tapWaterMeter",
  recycledWaterMeter: "waterUsage.columns.recycledWaterMeter",
  action: "waterUsage.columns.action"
};
const listConfigTranslated = computed(() => {
  return listConfigArray.map((col) => {
    if (columnsTranslationMap[col.prop]) {
      return { ...col, label: t(columnsTranslationMap[col.prop]) };
    }
    return col;
  });
});
const rowButtonsArray = Array.isArray(originalRowButtons) ? originalRowButtons : [];
const rowButtonsTranslated = computed(() => {
  const dummy = locale.value;
  return rowButtonsArray.map((btn) => {
    const lowerName = btn.name ? btn.name.toLowerCase() : "";
    if (lowerName === "edit") {
      return { ...btn, name: t("waterUsage.edit") };
    }
    if (lowerName === "save") {
      return { ...btn, name: t("waterUsage.save") };
    }
    if (lowerName === "delete") {
      return { ...btn, name: t("waterUsage.delete") };
    }
    if (lowerName === "cancel") {
      return { ...btn, name: t("waterUsage.cancel") };
    }
    return btn;
  });
});
const dialogVisible = ref(false);
</script>





<style scoped>
.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-row label {
  width: 300px;
  /* 固定 Label 寬度，讓輸入框對齊 */
  text-align: left;
  font-weight: 600;
}

/* 頂部 Header */
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  /* 允許換行 */
}

.icon {
  width: 60px;
  /* margin-right: -5px; */
}

.input-with-select {
  max-width: 300px;
}

/* Icon 部分 */
.icon-section {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(15, 87, 213, 0.9);
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

/* 輸入框 */
.input-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 15px;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
