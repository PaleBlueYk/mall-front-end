<template>
  <div class="registered">
    <h3>注册</h3>
    <el-form
      ref="registeredForm"
      status-icon
      :model="registeredForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="账号:" prop="username">
        <el-input v-model="registeredForm.username" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="用户名:" prop="nickname">
        <el-input v-model="registeredForm.nickname" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="密码:" prop="password">
        <el-input v-model="registeredForm.password" placeholder="请输入" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码:" prop="passCheck">
        <el-input v-model="registeredForm.passCheck" placeholder="请输入" show-password></el-input>
      </el-form-item>
      <el-form-item class="btn">
        <el-button type="success" @click="submitForm('registeredForm')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { type } from 'os';
export default {
  name: "registered",
  data: function() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registeredForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registeredForm: {
        username: "",
        nickname: "",
        password: "",
        passCheck: ""
      },
      
      rules: {
        username: [
          { required: true, message: "此项必填", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3-10个字符", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "此项必填", trigger: "blur" },
          { min: 1, max: 10, message: "长度在3-10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "此项必填", trigger: "blur" },
          { min: 6, max: 20, message: "长度在6-20个字符", trigger: "blur" }
        ],
        passCheck: [
          { required: true, message: "请再次输入确认密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            let subData = {
                username: this.registeredForm.username,
                nickname: this.registeredForm.nickname,
                password: this.registeredForm.password
            }
          fetch('/api/user/add',{
              method: 'post',
              body: JSON.stringify(subData),
              headers: {'content-type': 'application/json'}
          }).then(rep=>rep.json())
          .then(data=>{
              if(data.code===201){
                  this.$router.push("/login");
                  this.$message({type: 'success',message: '注册成功'})
              }else{
                  this.$message({type: 'warning',message: '注册失败,请稍后再试'})
              }
          })
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style>
.el-form-item__label {
  color: #fff;
}
</style>

<style lang="scss" scoped>
.btn {
  text-align: center;
}
.registered {
  width: 30%;
  position: relative;
  top: 50%;
  left: 50%;
  padding: 10px;
  border-radius: 8px;
  transform: translate(-50%, -50%);
  opacity: 0.8;
}
h3 {
  margin-top: 0;
  padding-top: 0;
  text-align: center;
  font-size: 30px;
  color: #fff;
}
</style>
