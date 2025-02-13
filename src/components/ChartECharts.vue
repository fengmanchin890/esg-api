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

  <el-dialog v-model="showDialog" :style="{ width: '350px' }">
    <h1 class="title-choose">Select Options</h1>
    <div class="picker-container">
      <div class="picker-group">
        <label class="picker-label">Category</label>
        <el-select v-model="selectedCategory" class="styled-select">
          <el-option label="Water + Energy" value="water-energy" />
          <el-option
            label="Recycled Water + Solar Energy"
            value="recycledwater-solarenergy"
          />
        </el-select>
      </div>
      <div class="picker-group">
        <label class="picker-label">Factory</label>
        <el-select v-model="selectedFactory" class="styled-select">
          <el-option
            v-for="factory in factoryList"
            :key="factory.value"
            :label="factory.label"
            :value="factory.value"
          />
        </el-select>
      </div>
      <div class="picker-group">
        <label class="picker-label">Year</label>
        <el-select v-model="chooseYear" class="styled-select">
          <el-option
            v-for="year in availableYears"
            :key="year"
            :label="year"
            :value="year"
          />
        </el-select>
      </div>
    </div>
    <div class="footer-buttons">
      <el-button type="primary" @click="applySelection">Apply</el-button>
      <el-button @click="showDialog = false">Cancel</el-button>
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
          class="button-echarts"
          @click="showDialog = true"
          >Filter</el-button
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
const months = [
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
];

const rawData = {
  LYV: {
    2025: {
      energy: [45, 20, 55, 30, 70, 65, 60, 58, 55, 40, 50, 55],
      water: [30, 40, 25, 20, 60, 80, 75, 70, 65, 45, 35, 201],
      recycledwater: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      solarenergy: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
    },
    2024: {
      energy: [50, 30, 60, 35, 75, 70, 65, 63, 60, 45, 55, 61],
      water: [35, 45, 30, 25, 65, 85, 80, 75, 70, 50, 40, 105],
      recycledwater: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
      solarenergy: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    },
  },
  LYN: {
    2025: {
      energy: [410, 25, 50, 35, 65, 60, 55, 53, 50, 35, 45, 50],
      water: [25, 35, 20, 15, 55, 75, 70, 65, 60, 40, 30, 350],
      recycledwater: [2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
      solarenergy: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
    },
  },
};
const factoryList = [
  { label: "TỶ XUÂN", value: "LYN" },
  { label: "TỶ BÁCH", value: "LYV" },
  { label: "TỶ THẠC", value: "LYS" },
];

const selectedCategory = ref("water-energy");

const showComparison = ref(false);

const baseYear = ref(new Date().getFullYear().toString());

const chooseYear = ref(new Date().getFullYear().toString());
const comparisonYear = ref("");
const selectedStartMonth = ref(
  new Date().getMonth().toString().padStart(2, "0")
);
const selectedEndMonth = ref("12");

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


const showDialog = ref(false);



const applySelection = () => {
  if (!rawData[selectedFactory.value]) {
    console.error(`Factory ${selectedFactory.value} không có dữ liệu!`);
    return;
  }
  if (!rawData[selectedFactory.value][chooseYear.value]) {
    console.error(`Năm ${chooseYear.value} không có dữ liệu cho factory ${selectedFactory.value}!`);
    return;
  }

  console.log(
    `Category: ${selectedCategory.value}, Factory: ${selectedFactory.value}, Year: ${chooseYear.value}`
  );

  showDialog.value = false;

  // Cập nhật dữ liệu biểu đồ với factory, năm và danh mục đã chọn
  updateChart(selectedFactory.value, chooseYear.value, selectedCategory.value);
};


const selectedFactoryTemp = ref(localStorage.getItem("DB_CHOICE") || "LYV");
if (!factoryList.some(f => f.value === selectedFactoryTemp.value)) {
  selectedFactoryTemp.value = "LYV"; 
}
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

const toggleDatePicker = () => {
  showComparison.value = true;
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
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 0;
}

.right-buttons-bottom,
.left-buttons-bottom,
.right-buttons-top {
  display: flex;
  gap: 8px;
  align-items: center;
}

.el-button {
  min-width: 80px;
  text-align: center;
  padding: 8px 12px;
}

.chart-container {
  position: relative;
  width: 1000px;
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
  pointer-events: none;
}

.chart-controls button {
  pointer-events: auto;
}

.button-echarts {
  width: 90px;
  padding: 8px 12px;
}

.title {
  color: #0055aa;
  font-size: 28px;
  margin-bottom: 10px;
  margin-top: -20px;
}

.button-w,
.factory-pd {
  width: 65px;
  background-color: #fff;
  color: #333;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.button-w.active,
.factory-pd.active {
  background-color: #0288d1;
  color: white;
  font-weight: bold;
}

:deep(.el-dialog) {
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

.date-picker-container,
.picker-container {
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
</style>