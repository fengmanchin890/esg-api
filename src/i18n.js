// i18n.js
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
  legacy: false,      
  locale: 'vi',        
  fallbackLocale: 'en',
  globalInjection: true, 
  messages
});

export default i18n;
