import { ref } from "vue";

const isCollapse = ref(true);
const userName = ref("Admin");

const factoryNames = {
  LYN: "Ty Xuan",
  LYV: "Ty Bach",
  LYS: "Ty Thac",
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
