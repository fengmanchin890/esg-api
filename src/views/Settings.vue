<template>
  <div>
    <select @change="handleChange($event)">
      <option value="vi">Tiếng Việt</option>
      <option value="en">English</option>
      <option value="zh-cn">中文（简体）</option>
      <option value="zh-tw">中文（繁體）</option>
    </select>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore();

const handleChange = (e) => {
  const newLocale = e.target.value;
  store.dispatch('changeLocale', newLocale);
};
</script>
