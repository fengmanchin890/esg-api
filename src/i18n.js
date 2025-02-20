// i18n.js
import { createI18n } from 'vue-i18n';
import vi from './locales/vi.js';
import en from './locales/en.js';
import zhCn from './locales/zh-cn.js';
import zhTw from './locales/zh-tw.js';
import ja from './locales/ja.js';

const messages = {
  vi,
  en,
  'zh-cn': zhCn,
  'zh-tw': zhTw,
  ja
};

const defaultLocale = localStorage.getItem('locale') || 'en';

const i18n = createI18n({
  legacy: false,      
  locale: defaultLocale,  
  fallbackLocale: 'en',
  globalInjection: true, 
  messages
});

export default i18n;
