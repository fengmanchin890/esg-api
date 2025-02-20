<template>
  <div class="login-container">
    <div class="image-section">
      <TripleCircle />
    </div>

    <div class="form-section">
      <div class="form-content">
        <div class="logo-container">
          <img
            src="https://www.laiyih.com/uploads/tw/company/20231218206.png"
            class="logo-image"
          />
        </div>

        <el-card class="custom-card">
          <el-form :model="Users" @submit.prevent="login" size="large">
            <div class="row-select">
              <el-form-item class="flex-item" style="margin-right: 10px;">
                <el-select
                  v-model="Users.DB_CHOICE"
                  :placeholder="$t('login.selectFactory')"
                  class="input-field"
                >
                  <el-option
                    :label="$t('login.factoryTyXuan')"
                    value="LYN"
                  ></el-option>
                  <el-option
                    :label="$t('login.factoryTyBach')"
                    value="LYV"
                  ></el-option>
                  <el-option
                    :label="$t('login.factoryTyThac')"
                    value="LYS"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item class="flex-item">
                <el-select
                  v-model="selectedLang"
                  placeholder="Select Language"
                  class="input-field"
                  :prefix-icon="FlagIconWithSelectedFlag"
                >
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
              </el-form-item>
            </div>

            <el-form-item>
              <el-input
                v-model="Users.USERID"
                :placeholder="$t('login.userId')"
                class="input-field"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-input
                v-model="Users.PWD"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('login.password')"
                class="input-field"
              >
                <template #append>
                  <el-button
                    :icon="showPassword ? Hide : View"
                    @click="showPassword = !showPassword"
                  ></el-button>
                </template>
              </el-input>
            </el-form-item>

            <el-button
              type="primary"
              native-type="submit"
              class="login-button"
              block
            >
              {{ $t('login.loginButton') }}
            </el-button>
          </el-form>
        </el-card>
      </div>
    </div>

    <div class="footer">
      © 2025 Lai Yih Web Team. All rights reserved.
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, h } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import TripleCircle from "@components/LoginPage/TripleCircle.vue";
import { Hide, View } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const { t } = useI18n();
const store = useStore();
const router = useRouter();
const showPassword = ref(false);

const Users = reactive({
  USERID: localStorage.getItem("USERID") || "",
  PWD: localStorage.getItem("PASSWORD") || "",
  DB_CHOICE: localStorage.getItem("DB_CHOICE") || "",
  DB_CHOICE2: localStorage.getItem("DB_CHOICE2") || "",
  USERNAME: sessionStorage.getItem("USERNAME") || "",
});

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
    store.dispatch("changeLocale", newLocale);
  }
});

// Tìm thông tin của option được chọn dựa vào selectedLang
const selectedOption = computed(() => {
  return languageOptions.find(option => option.value === selectedLang.value);
});

// Tạo computed property trả về một component render lá cờ dựa trên selectedOption
const FlagIconWithSelectedFlag = computed(() => {
  return {
    render() {
      return selectedOption.value
        ? h("img", {
            src: selectedOption.value.flag,
            style: "width:20px; margin-right:8px; vertical-align:middle;",
          })
        : null;
    }
  };
});

const login = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
      Users
    );
    if (typeof response.data.data === "object") {
      localStorage.setItem("USERID", response.data.data.USERID);
      localStorage.setItem("DB_CHOICE", response.data.data.DB_CHOICE);
      localStorage.setItem("DB_CHOICE2", response.data.data.DB_CHOICE2);
      sessionStorage.setItem("TOKEN", response.data.data.TOKEN);
      localStorage.setItem("USERNAME", response.data.data.USERNAME);
      Object.assign(Users, response.data.data);

      ElMessage({
        message: t("login.loginSuccess"),
        type: "success",
      });

      setTimeout(() => {
        router.push("/mainPage/input");
        window.location.reload();
      }, 500);
    } else {
      ElMessage({
        message: response.data.data,
        type: "warning",
      });
    }
  } catch (error) {
    ElMessage({
      message: t("login.loginFailed"),
      type: "error",
    });
  }
};
</script>

<style scoped>
.input-field {
  width: 100%;
}
.row-select {
  display: flex;
}
.flex-item {
  flex: 1;
}
.logo-container {
  position: absolute;
  top: 5%;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}
.footer {
  position: fixed;
  bottom: 10px;
  right: 20px;
  font-size: larger;
  color: white;
  font-weight: 700;
  pointer-events: none;
  user-select: none;
}
.login-container {
  display: flex;
  height: 100vh;
  background: url(https://attachment.pooban.com/uploads/allimg/20220805/1-220P50F520I8.jpg);
  background-size: cover;
}
.image-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  clip-path: polygon(0 0, 80% 0, 100% 100%, 10% 100%);
}
.form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(https://www.laiyih.com/uploads/tw/home_about/20210205281.png);
  background-size: cover;
  clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);
}
.form-content {
  text-align: center;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.logo-image {
  height: 100px;
}
.custom-card {
  background: rgb(255, 255, 255);
  border: 2px solid rgb(16, 172, 211);
  border-radius: 10px;
  padding: 20px;
  width: 100%;
}
.login-button {
  color: white;
  font-size: 1rem;
  background-color: rgb(0, 110, 255);
  width: 100%;
}
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  .image-section {
    height: 40%;
  }
  .form-section {
    height: 60%;
  }
}
</style>
