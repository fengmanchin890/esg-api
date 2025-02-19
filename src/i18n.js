// src/i18n.js
import { createI18n } from 'vue-i18n';
import vi from './locales/vi.js';
import en from './locales/en.js';
import zhCn from './locales/zh-cn.js';
import zhTw from './locales/zh-tw.js';

const messages = {
  vi,
  en,
  'zh-cn': zhCn,
  'zh-tw': zhTw
};

const i18n = createI18n({
  locale: 'vi',         // Ngôn ngữ mặc định
  fallbackLocale: 'en', // Nếu key không có trong locale hiện tại sẽ dùng en
  messages
});

export default i18n;
