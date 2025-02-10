<template>
  <el-dialog v-model="visible" title="Logout Confirmation" width="400px">
    <p>Are you sure you want to log out?</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">Cancel</el-button>
        <el-button type="danger" @click="confirmLogout">Logout</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
  <script setup>
import { ref, defineEmits } from "vue";

const visible = ref(false);
const emit = defineEmits(["confirm", "close"]);

const open = () => {
  visible.value = true;
};

const cancel = () => {
  visible.value = false;
  emit("close");
};

const confirmLogout = () => {
  visible.value = false;
  emit("confirm");
};

defineExpose({ open });
</script>
  
  <style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
  