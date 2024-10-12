<template>
  <div class="login-container">
    <div style="text-align: center; padding-top: 250px" v-show="!isShown">
      <h1>{{ str2 }}</h1>
      <el-button round class="btn" @click="changeShown()">Click Here</el-button>
    </div>
    <el-card class="login-form" shadow="always" v-show="isShown">
      <div style="text-align: center">
        <i class="el-icon-cloudy" style="color: #409eff; font-size: 50px"></i>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <h2 class="login-title">智域云图</h2>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-iconuser"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-mima"
            placeholder="密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            prefix-icon="el-icon-key"
            placeholder="点击图片更换验证码"
            type="text"
            @keydown.enter.native="login()"
            style="width: 65%; margin-right: 10px"
          ></el-input>
          <img
            :src="vcUrl"
            alt="验证码"
            @click="updateVerifyCode()"
            style="width: 30%; position: relative; top: 10px"
          />
        </el-form-item>
        <!-- <el-form-item style="margin-bottom: 5px; text-align: center">
          <el-button
            class="user-btn"
            style="width: 30%"
            type="primary"
            @click="faceApprove()"
            >人脸认证</el-button
          >
        </el-form-item> -->
        <el-form-item style="margin-bottom: 5px; text-align: center">
          <el-button
            class="user-btn"
            style="width: 45%"
            type="primary"
            @click="login()"
            >登录</el-button
          >

          <el-button
            class="user-btn"
            style="width: 45%"
            type="primary"
            @click="(dialogFormRegister = true), updateVerifyCode()"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      title="注册"
      :visible.sync="dialogFormRegister"
      style="width: 60%; margin: auto; position: relative; top: -50px"
    >
      <el-form
        :model="newuser"
        :rules="loginFormRules"
        ref="newuser"
        :inline="false"
      >
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          label-position="left"
          prop="newUsername"
        >
          <el-input
            v-model="newuser.newUsername"
            autocomplete="off"
            placeholder="长度在 2 到 13 个字符"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          label-position="left"
          prop="newPassword"
        >
          <el-input
            width="auto"
            v-model="newuser.newPassword"
            autocomplete="off"
            placeholder="长度在 6 到 15 个字符"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          :label-width="formLabelWidth"
          label-position="left"
          prop="newEmail"
        >
          <el-input
            v-model="newuser.newEmail"
            autocomplete="off"
            placeholder="请输入规范邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          label-position="left"
          :label-width="formLabelWidth"
          prop="newMobile"
        >
          <el-input
            v-model="newuser.newMobile"
            autocomplete="off"
            placeholder="请输入规范手机号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="请选择拍摄正脸照片以用于后续登录认证（点击图片重新拍摄）"
          label-position="left"
          :label-width="formLabelWidth"
          prop="newMobile"
        >
          <el-button v-if="!capturedImage" type="primary" @click="faceApprove()"
            >开始拍摄</el-button
          >
          <img
            v-if="capturedImage"
            :src="capturedImage"
            alt="Captured Image"
            width="90%"
            @click="faceApprove()"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormRegister = false" style="float: left"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitForm()">注 册</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogface">
      <h1>{{ facetitle }}</h1>
      <video ref="video" autoplay width="100%"></video>
      <br />
      <el-button v-if="this.facetitle == '人脸认证'" @click="captureTorecognize"
        >人脸识别</el-button
      >
      <el-button v-if="this.facetitle !== '人脸认证'" @click="capture"
        >拍摄</el-button
      >
      <canvas ref="canvas" style="display: none"></canvas>
      <!-- <img :src="capturedImage" alt="Captured Image" /> -->
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      str: "欢迎您来到智域云图-对象存储平台",
      i: 0,
      timer: 0,
      str2: "",
      isShown: false,
      vcUrl: "",
      loginForm: {
        username: "",
        password: "",
        code: "",
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 13,
            message: "长度在 2 到 13 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            validator: function (rule, value, callback) {
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
            trigger: "blur",
          },
        ],
      },
      registerRules: {
        newUsername: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "用户名长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        newPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        newEmail: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址格式",
            trigger: "blur,change",
          },
        ],
        newMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号码格式",
            trigger: "blur",
          },
        ],
      },
      newuser: {
        newUsername: "",
        newPassword: "",
        newEmail: "",
        newMobile: "",
      },
      dialogFormRegister: false,
      formLabelWidth: "150px",
      dialogface: false,
      capturedImage: null,
      mediaStream: null,
      imageUrl: "",
      facetitle: "",
    };
  },
  mounted() {
    this.typing();
  },
  methods: {
    changeShown() {
      this.updateVerifyCode();
      this.isShown = !this.isShown;
    },
    typing() {
      if (this.i < this.str.length) {
        this.str2 = this.str.slice(0, this.i++) + "_";
        this.timer = setTimeout(() => {
          this.typing();
        }, 200);
      } else {
        this.str2 = this.str.slice(0, this.i++);
        clearTimeout(this.timer);
      }
    },
    updateVerifyCode() {
      this.vcUrl = "/api/verifyCode?time=" + new Date();
    },
    login() {
      /*  this.$router.push('console') */
      this.$refs.loginFormRef.validate(async (valid) => {
        // valid是一个布尔值，这是一个回调函数
        if (!valid) return 0;
        // await只能用在被async修饰的方法中，只有当返回的数据是promise时才能使用
        const { data: res } = await this.$http.post(
          "/api/login",
          this.loginForm
        );
        if (res.status !== 200) {
          return this.$message.error(res.msg);
        } else {
          window.sessionStorage.setItem("authority", res.data.id);
          window.sessionStorage.setItem("token", res.data.token);
          this.facetitle = "人脸认证";
          this.startCamera();
          this.dialogface = true;
        }
      });
    },

    submitForm() {
      this.$refs.newuser.validate(async (valid) => {
        if (!valid) return;
        console.log(this.newuser);
        const { data: res } = await this.$http.post("/api/addUser", {
          username: this.newuser.newUsername,
          password: this.newuser.newPassword,
          email: this.newuser.newEmail,
          mobile: this.newuser.newMobile,
        });
        if (res.status !== 200) {
          return this.$message.error(res.msg);
        }
        const fromData = new FormData();
        const bolbfile = await fetch(this.capturedImage).then((res) => {
          console.log(res);
          return res.blob().then((res) => {
            return new File([res], this.newuser.newUsername + ".jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
          });
        });
        fromData.append("image", bolbfile);
        fromData.append("imageId", this.newuser.newUsername);
        console.log(fromData.get("image"), fromData, this.capturedImage);
        console.log(fromData);

        const { data: res2 } = await axios.post(
          "http://127.0.0.1:7000/uploadImage",
          fromData
        );
        if (res.status == 200 && res2.status == 200) {
          this.$message.success("注册用户成功！");
          this.dialogFormRegister = false;
        } else {
          return this.$message.error(res.msg);
        }
      });
    },

    faceApprove() {
      console.log("开启人脸识别");
      this.dialogface = true;
      this.startCamera();
    },
    async startCamera() {
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.$refs.video.srcObject = this.mediaStream;
      } catch (err) {
        console.error("Error accessing the camera: ", err);
      }
    },
    capture() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImage = canvas.toDataURL("image/jpeg");
      this.dialogface = false;
      //这个是要上传的图片base64格式
      console.log(this.capturedImage);
    },
    async captureTorecognize() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImage = canvas.toDataURL("image/jpeg");
      this.dialogface = false;
      const formData = new FormData();
      const bolbfile = await fetch(this.capturedImage).then((res) => {
        return res.blob();
      });
      formData.append("file", bolbfile);
      const { data: res } = await axios.post(
        "http://127.0.0.1:7000/recognize",
        formData
      );
      if (res.person_names[0] === this.loginForm.username) {
        this.$message.success("人脸识别成功");
        this.$router.push("home");
      } else {
        console.log(res.person_names[0], this.loginForm.username);
        this.$message.error("人脸识别失败");
        window.sessionStorage.clear();
      }
    },
    stopCamera() {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((track) => track.stop());
      }
    },
    onUploadChange(file) {
      const isJPG = file.raw.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return;
      }
      this.imageUrl = URL.createObjectURL(file.raw);

      return isJPG && isLt2M;
    },
  },
};
</script>

<style lang="less" scoped>
， h1 {
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
  color: #fff;
  background-color: #00000059;
  border-color: #00000057;
}
.face-btn {
  color: #fff;
  background-color: #00000059;
  border-color: #00000057;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/deep/.el-form-item__label {
  text-align: left;
}
</style>
