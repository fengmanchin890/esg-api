// hooks/useECharts-api.js
import { ref } from "vue";

export const rawData = {
  LYV: {
    2025: {
      energy: [45, 18, 57, 26, 80, 60, 66, 50, 42, 38, 48, 59],
      solarenergy: [3, 5, 9, 7, 12, 15, 10, 22, 18, 30, 20, 28],
      water: [5, 38, 30, 12, 70, 85, 65, 90, 55, 32, 41, 250],
      recycledwater: [1, 12, 10, 24, 20, 35, 25, 50, 45, 65, 30, 55],
    },
    2024: {
      energy: [52, 22, 49, 32, 78, 72, 58, 67, 45, 39, 62, 55],
      water: [30, 50, 28, 18, 75, 95, 60, 85, 72, 50, 28, 130],
      recycledwater: [12, 22, 18, 30, 28, 45, 32, 48, 55, 75, 50, 70],
      solarenergy: [6, 14, 10, 18, 20, 26, 15, 35, 28, 40, 36, 50],
    },
    2023: {
      energy: [58, 32, 66, 28, 85, 68, 70, 62, 50, 44, 71, 80],
      water: [45, 42, 40, 25, 65, 120, 70, 100, 85, 75, 50, 200],
      recycledwater: [14, 25, 20, 28, 33, 50, 45, 52, 65, 85, 55, 78],
      solarenergy: [9, 18, 20, 30, 22, 40, 35, 50, 42, 60, 48, 70],
    },
  },
  LYN: {
    2025: {
      energy: [390, 25, 52, 31, 66, 55, 62, 48, 42, 31, 52, 45],
      water: [30, 40, 18, 12, 65, 85, 68, 80, 55, 50, 22, 370],
      recycledwater: [4, 6, 15, 8, 22, 35, 18, 42, 30, 50, 40, 55],
      solarenergy: [1, 5, 7, 10, 8, 15, 12, 20, 18, 28, 25, 30],
    },
    2024: {
      energy: [430, 28, 61, 38, 79, 72, 55, 60, 58, 39, 64, 53],
      water: [40, 38, 27, 18, 78, 95, 72, 85, 60, 50, 38, 240],
      recycledwater: [8, 16, 20, 28, 25, 38, 35, 50, 42, 60, 58, 68],
      solarenergy: [3, 6, 10, 15, 20, 26, 22, 35, 28, 42, 30, 50],
    },
  },
  LYS: {
    2025: {
      energy: [40, 10, 48, 20, 55, 60, 45, 55, 30, 42, 50, 38],
      water: [22, 28, 12, 8, 48, 72, 50, 65, 55, 38, 28, 190],
      recycledwater: [6, 12, 20, 22, 30, 35, 38, 42, 50, 60, 55, 65],
      solarenergy: [2, 4, 8, 10, 12, 15, 10, 18, 14, 22, 20, 25],
    },
    2024: {
      energy: [48, 22, 58, 35, 72, 60, 62, 53, 50, 38, 48, 54],
      water: [25, 38, 18, 14, 58, 80, 75, 85, 65, 50, 28, 300],
      recycledwater: [8, 14, 22, 25, 32, 40, 45, 50, 55, 70, 65, 75],
      solarenergy: [3, 6, 10, 14, 20, 25, 22, 35, 28, 38, 30, 42],
    },
  }
};

export const factoryList = [
  { label: "TỶ XUÂN", value: "LYN" },
  { label: "TỶ BÁCH", value: "LYV" },
  { label: "TỶ THẠC", value: "LYS" },
];

export const availableYears = ref(
  [...Array(new Date().getFullYear() - 1999 + 1).keys()]
    .map((i) => (1999 + i).toString())
    .reverse()
);

export const availableMonths = ref([
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
