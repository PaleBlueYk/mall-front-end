<template>
  <el-row type="flex" justify="center" :gutter="10" class="main-row">
    <el-col :span="6" v-for="product of productPrice" :key="product.id">
      <el-card :body-style="{ padding: '0px'}" shadow="hover">
        <el-image :src="product.imgSrc" :alt="product.name">
          <div slot="placeholder" class="image-slot">
            加载中
            <span class="dot">...</span>
          </div>
        </el-image>
        <div style="padding: 15px;">
          <span>{{product.name}}</span>
          <div class="info">
            <span>￥{{product.price}}</span>
            <el-button type="danger" @click="addToCart(product.id)">加入购物车</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "product",
  data: function() {
    return {
      productPrice: [],
      cart: []
    };
  },
  methods: {
    addToCart(pid) {
        let cart = JSON.parse(window.sessionStorage.getItem("cart")) === null? []:JSON.parse(window.sessionStorage.getItem("cart"));
      if (cart.length === 0) {
        this.cart.push(this.productPrice[pid - 1]);
        window.sessionStorage.setItem("cart", JSON.stringify(this.cart));
        fetch("/api/products/cartToken", {
          method: "post",
          headers: {
            Token: window.sessionStorage.getItem("token"),
            username: window.sessionStorage.getItem("username")
          }
        })
          .then(rep => rep.json())
          .then(data => {
            console.log('cartToken',data.object);
            window.sessionStorage.setItem("cartToken", data.object);
          });
      } else {
        this.cart = JSON.parse(window.sessionStorage.getItem("cart"));
        this.cart.push(this.productPrice[pid - 1]);
        window.sessionStorage.setItem("cart", JSON.stringify(this.cart));
      }
      this.$message("加入成功");
    }
  },
  beforeCreate: function() {
    fetch("/api/products", {
      headers: { Token: window.sessionStorage.getItem("token") }
    })
      .then(rep => rep.json())
      .then(data => {
        this.productPrice = JSON.parse(JSON.stringify(data.object));
        console.log(this.productPrice)
        for(let item in this.productPrice){
            this.productPrice[item].num = 1;
        }
      });
  }
};
</script>

<style scoped lang="scss">
.el-col-6 {
  margin-top: 20px;
}
img {
  width: 100%;
  display: block;
}
.info {
  position: relative;
  top: 10px;
  height: 50px;
  line-height: 40px;
  span {
    float: left;
  }
  button {
    float: right;
  }
}
.el-image {
  display: block;
}
.main-row {
  flex-wrap: wrap;
}
</style>