<template>
  <div id="404">
    <div class="box">
    <img src="../assets/404.png" alt="" srcset="">
      <h1>404 NotFound!</h1>
      <h3>啊哦!你找的页面不存在哦</h3>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.box{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
h1,
h3 {
  text-align: center;
  margin: 0;
}
</style>