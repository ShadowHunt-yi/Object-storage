<template>
  <div class="login-container">
    <div style="text-align: center; padding-top: 250px;" v-show="!isShown">
      <h1>{{ str2 }}</h1>
      <el-button round class="btn" @click="changeShown()">Click Here</el-button>
    </div>
    <el-card class="login-form" shadow="always" v-show="isShown">
      <div style="text-align: center">
        <i class="el-icon-cloudy" style="color: #409EFF; font-size:50px;"></i>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <h2 class="login-title">点击对象存储</h2>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-iconuser" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" placeholder="密码"
            show-password></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" prefix-icon="el-icon-key" placeholder="点击图片更换验证码" type="text"
            @keydown.enter.native="login()" style="width:65%;margin-right: 10px"></el-input>
          <img :src="vcUrl" alt="验证码" @click="updateVerifyCode()" style="width:30%; position: relative;top:10px" />
        </el-form-item>
        <el-form-item style="margin-bottom: 5px;text-align: center">
          <el-button class="user-btn" style="width: 45%" type="primary" @click="login()">登录</el-button>
          <el-button class="user-btn" style="width: 45%" type="primary" @click="dialogFormRegister = true,updateVerifyCode()">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="注册" :visible.sync="dialogFormRegister"  style="width: 45%; margin: auto;" >
      <el-form :model="newuser" :rules="loginFormRules" ref="newuser">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="newUsername">
          <el-input v-model="newuser.newUsername" autocomplete="off" placeholder="长度在 2 到 13 个字符"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="newPassword">
          <el-input v-model="newuser.newPassword" autocomplete="off" placeholder="长度在 6 到 15 个字符"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="newEmail">
          <el-input v-model="newuser.newEmail" autocomplete="off" placeholder="请输入规范邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="newMobile">
          <el-input v-model="newuser.newMobile" autocomplete="off" placeholder="请输入规范手机号"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormRegister = false" style="float: left;">取 消</el-button>
        <el-button type="primary" @click=submitForm()>注 册</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* import 'axios'form */
export default {
  data() {
    return {
      str: '欢迎您来到点击对象存储',
      i: 0,
      timer: 0,
      str2: '',
      isShown: false,
      vcUrl: '',
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 13, message: '长度在 2 到 13 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: function(rule, value, callback) {
              if (
                /^\w{1,64}@[a-z0-9\-]{1,256}(\.[a-z]{2,6}){1,2}$/i.test(
                  value
                ) == false
              ) {
                callback(new Error("邮箱格式错误"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      newuser: {
        newUsername: '',
        newPassword: '',
        newEmail: '',
        newMobile:'',
      },
      dialogFormRegister: false,
      formLabelWidth:'100'
    }
  },
  mounted() {
    this.typing()
  },
  methods: {
    changeShown() {
      this.updateVerifyCode()
      this.isShown = !this.isShown
    },
    typing() {
      if (this.i < this.str.length) {
        this.str2 = this.str.slice(0, this.i++) + '_'
        this.timer = setTimeout(() => {
          this.typing()
        }, 200)
      } else {
        this.str2 = this.str.slice(0, this.i++)
        clearTimeout(this.timer)
      }
    },
    updateVerifyCode() {
      this.vcUrl = '/api/verifyCode?time=' + new Date()
    },
    login() {
         /*  this.$router.push('console') */
      this.$refs.loginFormRef.validate(async valid => {
        // valid是一个布尔值，这是一个回调函数
        if (!valid) return 0
        // await只能用在被async修饰的方法中，只有当返回的数据是promise时才能使用
        const { data: res } = await this.$http.post('/api/login', this.loginForm)
        if (res.status !== 200) {
          return this.$message.error(res.msg)
        }else {
          this.$message.success(res.msg)
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('home')
        }

      })
    },
    submitForm(){
      this.$refs.newuser.validate(async valid=> {
        if (!valid) return
        console.log(this.newuser);
        const { data: res } = await this.$http.post('/api/users',{
          username:this.newuser.newUsername,
          password:this.newuser.newPassword,
          email:this.newuser.newEmail,
          mobile:this.newuser.newMobile
        })
        if (res.status !== 200) {
          return this.$message.error(res.msg)
        }
        this.$message.success('注册用户成功！')
        this.dialogFormRegister = false
      })
    }
  }

}
</script>

<style lang="less" scoped>
h1 {
  color: black;
  text-align: center;
  font-size: 50px;
}

.login-container {
  background: url("../assets/image/background.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 100%;
}

.btn {
  height: 50px;
  width: 150px;
  font-size: 20px;

}

.login-form {
  // background-color: aliceblue;
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-radius: 20px;
  background-color: #9b989860;
}

.login-title {
  text-align: center;
  color: #000000;
}

.el-form-item__content {
  display: flex;
  align-items: center;
  // 垂直居中
}

.user-btn {
  color: #FFF;
  background-color: #00000059;
  border-color: #00000057;
}
</style>
