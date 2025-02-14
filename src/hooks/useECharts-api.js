// services/dataService.js
import { ref } from "vue";

export const rawData = {
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
        2023: {
          energy: [55, 35, 65, 40, 80, 75, 70, 68, 65, 50, 60, 66],
          water: [40, 50, 35, 30, 75, 95, 90, 85, 80, 60, 50, 120],
          recycledwater: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
          solarenergy: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
        },
        2022: {
          energy: [60, 40, 70, 45, 85, 80, 75, 73, 70, 55, 65, 71],
          water: [45, 55, 40, 35, 80, 100, 95, 90, 85, 65, 55, 135],
          recycledwater: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
          solarenergy: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
        },
      },
      LYN: {
        2025: {
          energy: [410, 25, 50, 35, 65, 60, 55, 53, 50, 35, 45, 50],
          water: [25, 35, 20, 15, 55, 75, 70, 65, 60, 40, 30, 350],
          recycledwater: [2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
          solarenergy: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
        },
        2024: {
          energy: [420, 30, 55, 40, 70, 65, 60, 58, 55, 40, 50, 55],
          water: [30, 40, 25, 20, 60, 80, 75, 70, 65, 45, 35, 201],
          recycledwater: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
          solarenergy: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
        },
        2023: {
          energy: [430, 35, 60, 45, 75, 70, 65, 63, 60, 45, 55, 61],
          water: [35, 45, 30, 25, 65, 85, 80, 75, 70, 50, 40, 105],
          recycledwater: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
          solarenergy: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
        },
      },
      LYS: {
        2025: {
          energy: [35, 15, 45, 25, 60, 55, 50, 48, 45, 30, 40, 45],
          water: [20, 30, 15, 10, 50, 70, 65, 60, 55, 35, 25, 175],
          recycledwater: [1214, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48],
          solarenergy: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },
        2024: {
          energy: [40, 20, 50, 30, 65, 60, 55, 53, 50, 35, 45, 50],
          water: [25, 35, 20, 15, 55, 75, 70, 65, 60, 40, 30, 350],
          recycledwater: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72],
          solarenergy: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
        },
      },
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
