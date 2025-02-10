<template>
  <div class="login-container">
    <div class="image-section">
      <TripleCircle></TripleCircle>
    </div>

    <div class="form-section">
      <div class="form-content">
        <div
          style="
            position: absolute;
            top: 5%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          "
        >
          <img
            src="https://www.laiyih.com/uploads/tw/company/20231218206.png"
            class="logo-image"
          />
        </div>

        <el-card class="custom-card">
          <el-form :model="Users" @submit.prevent="login" size="large">
            <el-form-item>
              <el-select
                v-model="Users.DB_CHOICE"
                placeholder="Select Factory"
                class="input-field"
              >
                <el-option label="Ty Xuan" value="LYN"></el-option>
                <el-option label="Ty Bach" value="Ty Bach"></el-option>
                <el-option label="Ty Thac" value="Ty Thac"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-input
                v-model="Users.USERID"
                placeholder="ID"
                class="input-field"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-input
                v-model="Users.PWD"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
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
              Login
            </el-button>
          </el-form>
        </el-card>
      </div>
    </div>
    <div class="footer">© 2025 Lai Yih Web Team. All rights reserved.</div>
  </div>
</template>


<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import TripleCircle from "../components/LoginPage/TripleCircle.vue";
import { Hide, View } from "@element-plus/icons-vue";
const router = useRouter();
const showPassword = ref(false);

const Users = reactive({
  USERID: localStorage.getItem("USERID") || "",
  PWD: localStorage.getItem("PASSWORD") || "",
  DB_CHOICE: localStorage.getItem("DB_CHOICE") || "LYN",
});

const Factory = ref("");

const login = async () => {
  try {
    const response = await axios.post(
      `http://localhost:8081/api/v1/auth/login`,
      Users
    );
    if (typeof response.data.data === "object") {
      localStorage.setItem("USERID", response.data.data.USERID);
      localStorage.setItem("PWD", response.data.data.PWD);
      localStorage.setItem("DB_CHOICE", response.data.data.DB_CHOICE);

      ElMessage({
        message: "Login successful!",
        type: "success",
      });

      router.push("/mainPage/input");
    } else {
      ElMessage({
        message: response.data.data,
        type: "warning",
      });
    }
  } catch (error) {
    ElMessage({
      message: "Login failed. Please try again!",
      type: "error",
    });
    // console.error(error);
  }
};
</script>

<style scoped>
.custom-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-field {
  width: 100%;
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

.login-image {
  max-width: 80%;
  height: auto;
  border-radius: 10px;
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