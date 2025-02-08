
import { ref } from "vue";
const isCollapse = ref(true);
const factory = ref("Ty Bach")
const userName = ref("Admin")
export default function useMainPage() {


  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };

  return {
    factory,
    userName,
    isCollapse,
    toggleCollapse, // 確保這個函數可以被組件使用
  };
}
