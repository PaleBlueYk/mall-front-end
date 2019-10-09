<template>
  <div class="hello">
    <img alt="logo" src="../assets/logo.png" />
    <h3>购物车</h3>
    <div class="login">
      <h3>登录</h3>
      <el-form :model="loginForm">
        <el-form-item>
          <el-input v-model="loginForm.username" placeholder="帐号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginForm.password" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-tooltip effect="dark" content="点击切换" placement="bottom">
            <el-image
              :src="loginForm.captchaSrc"
              alt="captcha"
              class="captcha"
              @click="changeCaptcha"
            >
              <div slot="placeholder" class="image-slot">
                验证码加载中
                <span class="dot">...</span>
              </div>
            </el-image>
          </el-tooltip>
          <el-input v-model="loginForm.captcha" placeholder="验证码" class="captchaInput"></el-input>
        </el-form-item>
        <el-form-item type="flex">
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <router-link to="/registered">注册</router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Loading } from "element-ui";
export default {
  name: "Login",

  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        captcha: "",
        captchaSrc: "/api/user/captcha?" + new Date().getTime()
      }
    };
  },
  methods: {
    onSubmit() {
      let formData = JSON.stringify(this.loginForm);
      let loading = Loading.service({
        lock: true,
        text: "拿命在加载"
      });
      fetch("/api/user/login", {
        method: "post",
        body: formData,
        headers: { "content-type": "application/json" },
        credentials: "include"
      })
        .then(rep => rep.json())
        .then(data => {
          this.$nextTick(() => {
            loading.close();
          });
          window.sessionStorage.setItem("token", data.object.token);
          window.sessionStorage.setItem("nickname", data.object.nickname);
          window.sessionStorage.setItem("username", data.object.username);
          window.console.log(window.sessionStorage.getItem("nickname"));
          window.console.log(data);
          if (data.code === 201) {
            this.$router.push("/");
          } else {
            this.$alert(data.msg);
            this.loginForm.captchaSrc =
              "/api/user/captcha?" + new Date().getTime();
          }
        });
    },
    changeCaptcha() {
      this.loginForm.captchaSrc = "/api/user/captcha?" + new Date().getTime();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  width: 100%;
  height: 100%;
  text-align: center;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  img {
    margin-top: 10rem;
  }
  .captcha {
    margin: 0;
    width: 100px;
    height: 40px;
    float: left;
  }
  .captchaInput {
    width: 350px;
    float: right;
  }
  .login {
    position: absolute;
    width: 30rem;
    height: 20rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
h3 {
  font-size: 38px;
  margin: 25px;
}
a {
  margin-left: 40px;
  color: #fff;
}
</style>
