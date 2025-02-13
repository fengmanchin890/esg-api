  <template>
  <!-- Comparisom -->
  <el-dialog v-model="showComparison" :style="{ width: '320px' }">
    <h1 class="title-choose">Comparison</h1>
    <div class="date-picker-container">
      <div class="picker-row">
        <div class="picker-group">
          <label class="picker-label">Start Month</label>
          <el-select v-model="selectedStartMonth" class="styled-select">
            <el-option
              v-for="month in availableMonths"
              :key="month.value"
              :label="month.label"
              :value="month.value"
            />
          </el-select>
        </div>
        <div class="picker-group">
          <label class="picker-label">End Month</label>
          <el-select v-model="selectedEndMonth" class="styled-select">
            <el-option
              v-for="month in availableMonths"
              :key="month.value"
              :label="month.label"
              :value="month.value"
            />
          </el-select>
        </div>
      </div>

      <div class="picker-row">
        <div class="picker-group">
          <label class="picker-label">Base Year</label>
          <el-select v-model="baseYear" class="styled-select">
            <el-option
              v-for="year in availableYears"
              :key="year"
              :label="year"
              :value="year"
            />
          </el-select>
        </div>
        <div class="picker-group">
          <label class="picker-label">Comparison Year</label>
          <el-select v-model="comparisonYear" class="styled-select">
            <el-option
              v-for="year in availableYears"
              :key="year"
              :label="year"
              :value="year"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="footer-buttons">
      <el-button type="primary" @click="confirmComparison">Apply</el-button>
      <el-button @click="showComparison = false">Cancel</el-button>
    </div>
  </el-dialog>

  <!-- Year -->
  <el-dialog v-model="showYear" :style="{ width: '220px', height: '165px' }">
    <div class="date-picker-year-container">
      <h1 class="title-choose">Choose Year</h1>
      <div class="picker-row">
        <div class="picker-group">
          <el-select
            v-model="chooseYear"
            class="styled-select"
            @change="confirmYear"
          >
            <el-option
              v-for="year in availableYears"
              :key="year"
              :label="year"
              :value="year"
            />
          </el-select>
          <div class="footer-buttons">
            <el-button type="primary" @click="confirmYear">Apply</el-button>
            <el-button @click="showYear = false">Cancel</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>

  <!-- Factory -->
  <el-dialog
    v-model="showFactoryPicker"
    :style="{ width: '220px', height: '165px' }"
  >
    <div class="factory-picker-container">
      <h1 class="title-choose">Factory</h1>
      <div class="picker-row">
        <div class="picker-group">
          <el-select v-model="selectedFactoryTemp" class="styled-select">
            <el-option
              v-for="factory in factoryList"
              :key="factory.value"
              :label="factory.label"
              :value="factory.value"
            />
          </el-select>
          <div class="footer-buttons">
            <el-button type="primary" @click="confirmFactory">
              Apply
            </el-button>
            <el-button @click="showFactoryPicker = false">Cancel</el-button>
          </div>
        </div>
      </div>
      <!-- <h2>Nhà máy hiện tại: {{ factoryList.find(f => f.value === selectedFactory)?.label || "Chưa chọn" }}</h2> -->
    </div>
  </el-dialog>

  <!-- Chart -->
  <div class="chart-container">
    <div class="button-group">
      <div class="left-buttons-bottom"></div>

      <div class="right-buttons-top"></div>
    </div>

    <h2 class="title">Performance Dashboard</h2>
    <div ref="echart" class="chart"></div>
    <div class="chart-controls">
      <div class="left-buttons-bottom">
        <el-button type="primary" class="button-echarts">Category</el-button>

        <el-button
          type="primary"
          @click="toggleDatePicker"
          class="button-echarts"
          >Comparison</el-button
        >
      </div>
      <div class="right-buttons-bottom">
        <el-button
          type="primary"
          @click="toggleDatePickerYear"
          class="button-echarts"
          >Year</el-button
        >
        <el-button
          type="primary"
          @click="toggleFactoryPicker"
          class="button-echarts"
          >Factory</el-button
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import useECharts from "@/hooks/useECharts";

// State variables
const activeFilter = ref("all");
const echart = ref(null);
const rawData = {
  2023: {
    months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    energy: [45, 20, 55, 30, 70, 65, 60, 58, 55, 40, 50, 55],
    water: [30, 40, 25, 20, 60, 80, 75, 70, 65, 45, 35, 1001],
  },
  2024: {
    months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    energy: [50, 30, 60, 35, 75, 70, 65, 63, 60, 45, 55, 6011],
    water: [35, 45, 30, 25, 65, 85, 80, 75, 70, 50, 40, 105],
  },
  2025: {
    months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    energy: [-1, 35, 65, 40, 80, 75, -1, 0, 65, 50, 60, 65],
    water: [-1, 50, 35, 30, 70, 90, -1, 20, 75, 55, 45, 110],
  },
};

const showComparison = ref(false);

const showYear = ref(false);

const baseYear = ref(new Date().getFullYear().toString());

const chooseYear = ref(new Date().getFullYear().toString());
const comparisonYear = ref("");
const selectedStartMonth = ref(
  new Date().getMonth().toString().padStart(2, "0")
);
const selectedEndMonth = ref("12");

const yearForButton = ref(new Date().getFullYear().toString());

const availableYears = ref(
  [...Array(new Date().getFullYear() - 1999 + 1).keys()]
    .map((i) => (1999 + i).toString())
    .reverse()
);
const availableMonths = ref([
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
]);

const showFactoryPicker = ref(false);
const factoryList = [
  { label: "TỶ XUÂN", value: "LYN" },
  { label: "TỶ BÁCH", value: "LYV" },
  { label: "TỶ THẠC", value: "LYS" },
];

const selectedFactoryTemp = ref(localStorage.getItem("DB_CHOICE") || "Unknown");
const selectedFactory = ref(selectedFactoryTemp.value);

// ECharts hook
const { updateChart } = useECharts(echart, rawData, activeFilter, chooseYear);

const confirmComparison = () => {
  console.log(
    `Selected Start Month: ${selectedStartMonth.value}, End Month: ${selectedEndMonth.value}`
  );
  console.log(
    `Base Year: ${baseYear.value}, Comparison Year: ${comparisonYear.value}, Choose Year: ${chooseYear.value}`
  );
  showComparison.value = false;
};

const confirmYear = () => {
  showYear.value = false;
  if (rawData[yearForButton.value]) {
    updateChart();
  } else {
    console.error("No data available for the selected year.");
  }
};

const confirmFactory = () => {
  selectedFactory.value = selectedFactoryTemp.value;
  console.log(`Selected Factory: ${selectedFactory.value}`);
  showFactoryPicker.value = false;
};

const toggleDatePicker = () => {
  showComparison.value = true;
};

const toggleDatePickerYear = () => {
  showYear.value = true;
};

const toggleFactoryPicker = () => {
  showFactoryPicker.value = true;
};

console.log(
  `Initial Factory Displayed: ${
    factoryList.find((f) => f.value === selectedFactory.value)?.label
  }`
);
</script>

<style scoped>
.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 0;
}

.right-buttons-bottom {
  display: flex;
  gap: 8px;
  align-items: center;
}

.left-buttons-bottom {
  display: flex;
  gap: 8px;
  align-items: center;
}
.right-buttons-top {
  display: flex;
  gap: 8px;
  align-items: center;
}

.right-buttons-top .el-button,
.left-buttons-bottom .el-button,
.right-buttons-bottom .el-button {
  min-width: 80px;
  text-align: center;
  padding: 8px 12px;
}

.chart-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  background: #cfe2f0c5;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.chart {
  height: 390px;
  margin-top: -20px;
}

.chart-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  width: 80%;
}
.chart-controls {
  pointer-events: none;
}

.chart-controls button {
  pointer-events: auto;
}

.left-buttons-bottom .right-buttons-top {
  display: flex;
  gap: 10px;
}
.left-buttons-bottom button.active {
  background: #0288d1;
  color: white;
}
.right-buttons-top button.active {
  background: #0288d1;
  color: white;
}
.title {
  color: #0055aa;
  font-size: 28px;
  margin-bottom: 10px;
  margin-top: -20px;
}
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration-energy {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  font-size: 28px;
  margin-bottom: 20px;
  color: rgb(100, 52, 6);
  font-weight: bold;
}
.button-w {
  width: 65px;
}
.factory-pd,
.button-w {
  width: 65px;
  background-color: #fff;
  color: #333;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.factory-pd.active,
.button-w.active {
  background-color: #0288d1;
  color: white;
  font-weight: bold;
}
:deep(.el-dialog) {
  width: 320px !important;
  max-width: 90%;
  border-radius: 12px;
  padding: 12px;
}

:deep(.el-dialog__body) {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title-choose {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: #0055aa;
  margin-bottom: 20px;
  margin-top: -10px;
}

.date-picker-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.picker-row {
  display: flex;
  gap: 20px;
}

.picker-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.picker-label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  text-align: center;
}
.styled-select {
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

.button-echarts {
  width: 90px;
  text-align: center;
  padding: 8px 12px;
}
.mg {
  margin-left: -64px;
}
</style>