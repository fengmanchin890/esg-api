<!-- Components/Comparison.vue -->
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
        <div class="month-group">
          <el-select v-model="form.startMonth" placeholder="Start Month" class="styled-select">
            <el-option
              v-for="month in months"
              :key="month.value"
              :label="month.label"
              :value="month.value"
            />
          </el-select>
          <el-select v-model="form.endMonth" placeholder="End Month" class="styled-select">
            <el-option
              v-for="month in months"
              :key="month.value"
              :label="month.label"
              :value="month.value"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="footer-buttons">
      <el-button type="primary" @click="applyComparison">Apply</el-button>
      <el-button @click="showDialogComparison = false">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { factoryList } from "@/hooks/useECharts-api";

const emit = defineEmits(["applyComparisonData"]);
const showDialogComparison = ref(false);
const tempCategoryComparison = ref("");
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const valueYear = ref([new Date(currentYear - 1, 0, 1), new Date(currentYear, 0, 1)]);
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
  { value: 12, label: "December" }
];
const form = reactive({
  startMonth: currentMonth === 1 ? 1 : currentMonth - 1,
  endMonth: currentMonth
});
const openDialogComparison = () => {
  const savedData = localStorage.getItem("COMPARISON_DATA");
  if (savedData) {
    const data = JSON.parse(savedData);
    valueYear.value = [new Date(data.firstYear, 0, 1), new Date(data.secondYear, 0, 1)];
    form.startMonth = data.startMonth;
    form.endMonth = data.endMonth;
    tempFactoryComparison.value = data.factory;
  } else {
    valueYear.value = [new Date(currentYear - 1, 0, 1), new Date(currentYear, 0, 1)];
    form.startMonth = currentMonth === 1 ? 1 : currentMonth - 1;
    form.endMonth = currentMonth;
    tempFactoryComparison.value = selectedFactory.value;
  }
  tempCategoryComparison.value = "";
  showDialogComparison.value = true;
};
const applyComparison = () => {
  if (!valueYear.value || valueYear.value.length !== 2) {
    ElMessage.error("Vui lòng chọn đầy đủ năm (Start và End)!");
    return;
  }
  const firstYear = new Date(valueYear.value[0]).getFullYear();
  const secondYear = new Date(valueYear.value[1]).getFullYear();
  if (firstYear === secondYear) {
    ElMessage.error("Năm không được trùng nhau!");
    return;
  }
  if (!form.startMonth || !form.endMonth) {
    ElMessage.error("Vui lòng chọn đầy đủ tháng!");
    return;
  }
  const factory = tempFactoryComparison.value;
  const startMonth = form.startMonth;
  const endMonth = form.endMonth;
  const comparisonData = { factory, firstYear, secondYear, startMonth, endMonth };
  localStorage.setItem("COMPARISON_DATA", JSON.stringify(comparisonData));
  emit("applyComparisonData", comparisonData);
  showDialogComparison.value = false;
};

onMounted(() => {
  const savedData = localStorage.getItem("COMPARISON_DATA");
  if (savedData) {
    const data = JSON.parse(savedData);
    valueYear.value = [new Date(data.firstYear, 0, 1), new Date(data.secondYear, 0, 1)];
    form.startMonth = data.startMonth;
    form.endMonth = data.endMonth;
    tempFactoryComparison.value = data.factory;
  }
});

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
.month-group {
  display: flex;
  gap: 10px;
}
:deep(.el-date-editor) {
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
