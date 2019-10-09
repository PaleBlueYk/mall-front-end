<template>
  <div id="app">
  <div class="bg"></div>
  <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>
<style lang="scss">
*{
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  a{
    text-decoration: none;
  }
}
#app{
  height: 100%;
}
.bg {
  width: 100%;
  height: 100%;
  position: fixed;
  background-image: url('./assets/login_bg.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -webkit-filter: blur(5px);
  z-index: -1;
  filter: blur(5px);
}
</style>