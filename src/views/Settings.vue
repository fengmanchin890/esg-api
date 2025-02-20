<!-- views/Settings -->
<template>
  <div class="settings-container">
    <el-select
      v-model="selectedLang"
      placeholder="Select Language"
      style="width: 170px;"
    >
      <template #prefix>
        <img
          v-if="selectedOption"
          :src="selectedOption.flag"
          style="width: 20px; margin-right: 8px; vertical-align: middle;"
        />
      </template>
      <el-option
        v-for="option in languageOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      >
        <template #default>
          <img
            :src="option.flag"
            style="width: 20px; margin-right: 8px; vertical-align: middle;"
          />
          {{ option.label }}
        </template>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const languageOptions = [
  {
    label: "Tiếng Việt",
    value: "vi",
    flag: new URL("@/assets/flag/VietNam_Flag.png", import.meta.url).href,
  },
  {
    label: "English",
    value: "en",
    flag: new URL("@/assets/flag/United_KingDom_Flag.png", import.meta.url).href,
  },
  {
    label: "简体中文",
    value: "zh-cn",
    flag: new URL("@/assets/flag/China_Flag.png", import.meta.url).href,
  },
  {
    label: "繁體中文",
    value: "zh-tw",
    flag: new URL("@/assets/flag/Taiwan_Flag.png", import.meta.url).href,
  },
];

const selectedLang = computed({
  get() {
    return store.getters.currentLocale;
  },
  set(newLocale) {
    store.dispatch('changeLocale', newLocale);
  }
});

const selectedOption = computed(() => {
  return languageOptions.find(option => option.value === selectedLang.value);
});
</script>

<style scoped>
.settings-container {
  padding: 20px;
}
</style>
