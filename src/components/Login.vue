<template>
  <div class="login">
    <el-form ref="form" status-icon :rules='rules' :model="form" label-width="80px">
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop='username'>
        <el-input placeholder='请输入用户名' v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop='password'>
        <el-input @keyup.enter.native="login" placeholder='请输入密码' type='password' v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click='login'>登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在3到9个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在3到5个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
    },
    login() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 发送请求登录
          let res = await this.axios({
            url: '/login',
            method: 'post',
            data: {
              username: this.form.username,
              password: this.form.password
            }
          })
          console.log(res)
          let { data, meta } = res.data
          if (meta.status === 200) {
            // 登录成功，跳转首页组件
            this.$message.success('登录成功')
            // 登录成功后，先保存token 才能跳转
            localStorage.setItem('token', data.token)
            this.$router.push('/home')
          } else {
            this.$message({
              type: 'error',
              message: meta.msg
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login {
  height: 100%;
  overflow: hidden;
  background-color: rgb(245, 210, 232);
  .el-form {
    width: 400px;
    background-color: rgb(245, 164, 218);
    box-shadow: 0px 0px 20px 10px #fff inset;
    margin: 200px auto;
    padding: 70px 40px 15px 40px;
    border-radius: 20px;
    position: relative;
    // + 兄弟选择器 表示后面一个兄弟  ~ 兄弟选择器：后面所有的兄弟
    .el-button + .el-button {
      margin-left: 100px;
    }
    img {
      position: absolute;
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }
  }
}
</style>
