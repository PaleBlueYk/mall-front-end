<template>
  <div class="main">
    <el-table :data="cartData" empty-text="还没有任何商品加入购物车QAQ">
      <el-table-column prop="id" label="ID" width="100" align="center" />
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <el-image class="photo" :src="cartData[scope.$index].imgSrc"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名" align="center" width="200"></el-table-column>
      <el-table-column prop="price" label="单价/元" align="center" width="100"></el-table-column>
      <el-table-column label="数量" align="center" width="150">
        <template slot-scope="scope">
          <el-input-number
            size="small"
            v-model="cartData[scope.$index].num"
            :min="1"
            :max="9999"
            label="数量"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="总价" align="center" width="100">
        <template slot-scope="scope">{{cartData[scope.$index].price*cartData[scope.$index].num}}</template>
      </el-table-column>
      <el-table-column align="center">
        <template slot-scope="scope">
          <el-button @click="del(scope.$index)" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      v-if="this.cartData.length>0"
      type="danger"
      :loading="this.loadingBtn"
      class="buy-btn"
      @click="buy"
    >购买</el-button>
    <el-dialog title="是否购买" :visible.sync="dialogVisible" width="30%" append-to-body>
      <span>请支付{{total}}元</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payCancle">取 消</el-button>
        <el-button type="primary" @click="paySure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Loading } from "element-ui";
export default {
  name: "cart",
  data: function() {
    return {
      cartData:
        JSON.parse(window.sessionStorage.getItem("cart")) == null
          ? []
          : JSON.parse(window.sessionStorage.getItem("cart")),
      loadingBtn: false,
      dialogVisible: false,
      total: 0.0
    };
  },
  methods: {
    del(num) {
      this.cartData.splice(num, 1);
      window.sessionStorage.setItem("cart", JSON.stringify(this.cartData));
    },
    payCancle() {
      this.dialogVisible = false;
      this.$alert("支付取消", { type: "warning" });
      this.loadingBtn = false;
      fetch("/api/products/cartToken", {
        method: "post",
        headers: {
          Token: window.sessionStorage.getItem("token"),
          username: window.sessionStorage.getItem("username")
        }
      })
        .then(rep => rep.json())
        .then(data => {
          console.log("New cartToken", data.object);
          window.sessionStorage.setItem("cartToken", data.object);
        });
    },
    paySure() {
      this.dialogVisible = false;
      this.$alert("支付成功", { type: "success" });
      //清空购物车
      window.sessionStorage.setItem("cart", "[]");
      this.cartData = JSON.parse(window.sessionStorage.getItem("cart"));
      //清空cartToken
      window.sessionStorage.removeItem("cartToken");
      this.loadingBtn = false;
    },
    buy() {
      this.loadingBtn = true;
      console.log(
        "提交时cartToken",
        window.sessionStorage.getItem("cartToken")
      );
      fetch("/api/products/buy", {
        method: "post",
        body: JSON.stringify(this.cartData),
        headers: {
          Token: window.sessionStorage.getItem("token"),
          cartToken: window.sessionStorage.getItem("cartToken"),
          "Content-Type": "application/json"
        }
      })
        .then(rep => rep.json())
        .then(data => {
          if (data.code === 200) {
            this.total = data.object.toFixed(2);
            this.dialogVisible = true;
          }
          if (data.code === 429) {
            this.$alert(data.msg, { type: "warning" });
            //清空cartToken
            window.sessionStorage.removeItem("cartToken");
            this.loadingBtn = false;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  margin-top: 20px;
  margin-bottom: 100px;
  padding: 20px 0px;
  background-color: #fff;
  opacity: 0.9;
  .photo {
    display: block;
    margin: 0 auto;
    width: 150px;
  }
  .buy-btn {
    margin-top: 20px;
  }
}
</style>