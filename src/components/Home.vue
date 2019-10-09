<template>
  <el-row type="flex" justify="center">
    <el-col :span="18">
      <div id="home">
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/cart">购物车</el-menu-item>
          <el-submenu index="3" id="userId">
            <template slot="title">{{nickname}}</template>
            <el-menu-item index="3-1">登出</el-menu-item>
          </el-submenu>
        </el-menu>
        <router-view></router-view>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Home",
  data: function() {
    return {
      activeIndex: this.$route.path,
      nickname: window.sessionStorage.getItem("nickname")
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      if (key === "3-1") {
        fetch("/api/user/loginOut", {
          method: "delete",
          headers: { Token: window.sessionStorage.getItem("token") }
        })
          .then(rep => rep.json())
          .then(json => {
            if (json.code === 401) {
              this.$alert("Token验证失败,请刷新页面后重试", "Token验证失败");
            } else {
              this.$message({ message: "注销成功!", type: "success" });
              this.$router.push("/login");
            }
          });
        window.sessionStorage.clear();
      }
    }
  }
};
</script>

<style lang="scss">
#home {
  height: 100%;
  margin-bottom: 50px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
#userId {
  float: right;
}
</style>
