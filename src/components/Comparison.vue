<!-- components/Comparison.vue -->
<template>
  <el-dialog v-model="showDialogComparison" width="330px">
    <h1 class="title-choose">Select Comparison Options</h1>
    <div class="picker-container">
      <div class="form-group">
        <label class="picker-label">Factory</label>
        <el-select v-model="tempFactoryComparison" class="styled-select">
          <el-option
            v-for="factory in factoryList"
            :key="factory.value"
            :label="factory.label"
            :value="factory.value"
          />
        </el-select>
      </div>
      <div class="form-group">
        <label class="form-label">Select First and Second Year</label>
        <el-date-picker
          v-model="valueYear"
          type="yearrange"
          range-separator="To"
          start-placeholder="Start Year"
          end-placeholder="End Year"
          class="styled-select"
          style="width: 278px"
        />
      </div>
      <div class="form-group">
        <label class="form-label">Select Start and End Month</label>
        <el-select
          ref="monthSelect"
          v-model="form.selectedMonths"
          multiple
          :multiple-limit="2"
          placeholder="Maxium two mounths"
          class="styled-select"
          @visible-change="handleVisibleChange"
          @change="handleMonthSelectChange"
        >
          <el-option
            v-for="month in months"
            :key="month.value"
            :label="month.label"
            :value="month.value"
          />
        </el-select>
      </div>
    </div>
    <div class="footer-buttons">
      <el-button type="primary" @click="applyComparison">Apply</el-button>
      <el-button @click="showDialogComparison = false">Cancel</el-button>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, defineExpose, defineEmits } from "vue";
import { ElMessage } from "element-plus";
import { factoryList } from "@/hooks/useECharts-api";

const emit = defineEmits(["applyComparisonData"]);

const showDialogComparison = ref(false);
const tempCategoryComparison = ref("");
const valueYear = ref("");

const selectedFactory = ref(
  localStorage.getItem("DB_CHOICE2") &&
    localStorage.getItem("DB_CHOICE2") !== "undefined"
    ? localStorage.getItem("DB_CHOICE2").trim()
    : localStorage.getItem("DB_CHOICE")?.trim() || "Unknown"
);
const tempFactoryComparison = ref(selectedFactory.value);

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const form = reactive({ selectedMonths: [] });
const monthSelect = ref(null);

const openDialogComparison = () => {
  form.selectedMonths = [];
  tempCategoryComparison.value = "";
  valueYear.value = "";
  showDialogComparison.value = true;
};

const handleMonthSelectChange = () => {
  if (form.selectedMonths.length === 2) {
    if (form.selectedMonths[0] > form.selectedMonths[1]) {
      const temp = form.selectedMonths[0];
      form.selectedMonths[0] = form.selectedMonths[1];
      form.selectedMonths[1] = temp;
    }
    monthSelect.value?.blur();
  }
};

const handleVisibleChange = (visible) => {
  if (visible && form.selectedMonths.length === 2) {
    form.selectedMonths = [];
  }
};

const applyComparison = () => {
  if (!valueYear.value || valueYear.value.length !== 2) {
    ElMessage.error("Vui lòng chọn đầy đủ năm (Start và End)!");
    return;
  }
  if (form.selectedMonths.length !== 2) {
    ElMessage.error("Vui lòng chọn đúng 2 tháng!");
    return;
  }
  
  const factory = tempFactoryComparison.value;
  const firstYear = new Date(valueYear.value[0]).getFullYear();
  const secondYear = new Date(valueYear.value[1]).getFullYear();
  const startMonth = form.selectedMonths[0];
  const endMonth = form.selectedMonths[1];

  emit("applyComparisonData", {
    factory,
    firstYear,
    secondYear,
    startMonth,
    endMonth,
  });

  showDialogComparison.value = false;
};

defineExpose({ openDialogComparison });
</script>


<style scoped>
.title-choose {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: #0055aa;
  margin-bottom: 20px;
  margin-top: -10px;
}
.picker-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}
.styled-select {
  width: 100%;
}
::v-deep .el-date-editor {
  width: 100%;
}
.footer-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}
.footer-buttons .el-button {
  flex: 1;
  font-size: 14px;
}
</style>

