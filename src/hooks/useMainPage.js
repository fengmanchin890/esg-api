import { ref } from "vue";

const isCollapse = ref(true);
const userName = ref("Admin");

const factoryNames = {
  LYN: "TY XUAN",
  LYV: "TY BACH",
  LYS: "TY THAC",
};

const dbChoice = localStorage.getItem("DB_CHOICE") || "Unknown";
const factory = ref(factoryNames[dbChoice]);

export default function useMainPage() {
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };

  return {
    factory,
    userName,
    isCollapse,
    toggleCollapse,
  };
}
