<template>
  <div class="login-container">
    <div class="welcome-section" v-show="!isShown">
      <h1 class="typing-text">{{ str2 }}</h1>
      <el-button round class="welcome-btn pulse-animation" @click="changeShown()">
        <i class="el-icon-right"></i> 开始使用
      </el-button>
    </div>

    <el-card class="login-form" :class="{ 'slide-in': isShown }" shadow="always" v-show="isShown">
      <div class="logo-container">
        <i class="el-icon-cloudy logo-icon"></i>
        <h2 class="login-title">智域云图</h2>
        <div class="subtitle">对象存储平台</div>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-iconuser"
            placeholder="用户名"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-mima"
            placeholder="密码"
            show-password
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="verify-code-item">
          <div class="verify-code-item-container">
            <el-input
              v-model="loginForm.code"
              prefix-icon="el-icon-key"
              placeholder="验证码"
              type="text"
              @keydown.enter.native="login()"
              class="verify-input custom-input"
            ></el-input>
            <div class="verify-img-container" @click="updateVerifyCode()">
              <img :src="vcUrl" alt="验证码" class="verify-img" />
              <div class="refresh-overlay">
                <i class="el-icon-refresh"></i>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item class="action-buttons">
          <el-button class="login-btn" type="primary" @click="login()">
            <i class="el-icon-key"></i> 登录
          </el-button>

          <el-button
            class="register-btn"
            type="primary"
            @click=";(dialogFormRegister = true), updateVerifyCode()"
          >
            <i class="el-icon-user-solid"></i> 注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 注册对话框 -->
    <el-dialog
      title="用户注册"
      :visible.sync="dialogFormRegister"
      width="500px"
      center
      class="register-dialog"
      :close-on-click-modal="false"
    >
      <div class="register-header">
        <i class="el-icon-user-solid register-icon"></i>
        <span>创建新账户</span>
      </div>

      <el-form
        :model="newuser"
        :rules="registerRules"
        ref="newuser"
        label-position="top"
        class="register-form"
      >
        <el-form-item label="用户名" prop="newUsername">
          <el-input
            v-model="newuser.newUsername"
            prefix-icon="iconfont icon-iconuser"
            placeholder="长度在 2 到 13 个字符"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="newPassword">
          <el-input
            v-model="newuser.newPassword"
            prefix-icon="iconfont icon-mima"
            type="password"
            placeholder="长度在 6 到 15 个字符"
            class="custom-input"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="newEmail">
          <el-input
            v-model="newuser.newEmail"
            prefix-icon="el-icon-message"
            placeholder="请输入规范邮箱"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="newMobile">
          <el-input
            v-model="newuser.newMobile"
            prefix-icon="el-icon-mobile-phone"
            placeholder="请输入规范手机号"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="人脸照片" class="face-photo-item">
          <div class="face-photo-container">
            <div v-if="!capturedImage" class="face-placeholder" @click="faceApprove()">
              <i class="el-icon-camera"></i>
              <div>点击拍摄照片</div>
              <div class="photo-desc">用于后续登录验证</div>
            </div>

            <div v-else class="face-preview">
              <img :src="capturedImage" alt="Captured Image" @click="faceApprove()" />
              <div class="face-overlay">
                <i class="el-icon-refresh"></i>
                <div>重新拍摄</div>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="newuser.agreement" class="agreement-checkbox"> </el-checkbox>
          我同意使用本次人脸数据仅用于该系统的注册登录
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormRegister = false" plain>
          <i class="el-icon-close"></i> 取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm()"
          :disabled="!capturedImage || !newuser.agreement"
        >
          <i class="el-icon-check"></i> 提交注册
        </el-button>
      </div>
    </el-dialog>

    <!-- 人脸拍摄对话框 -->
    <el-dialog
      :visible.sync="dialogface"
      title="人脸拍摄"
      width="550px"
      center
      class="face-dialog"
      append-to-body
    >
      <div class="face-capture-container">
        <h3 class="face-title">{{ facetitle }}</h3>
        <div class="video-container">
          <video ref="video" autoplay width="100%"></video>
          <div class="face-guide-overlay">
            <div class="face-outline"></div>
            <div class="face-guide-text">请将面部置于框内</div>
          </div>
        </div>

        <div class="capture-controls" v-if="facetitle == '拍摄'">
          <el-button type="primary" @click="capture" class="capture-btn">
            <i class="el-icon-camera"></i> 拍照
          </el-button>
        </div>

        <canvas ref="canvas" style="display: none"></canvas>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { Camera } from '@mediapipe/camera_utils'
import * as drawingUtils from '@mediapipe/drawing_utils'
import * as mpFaceMesh from '@mediapipe/face_mesh'
import { userAPI } from '@/api'
import { loginRules, registerRules } from '@/utils/validate'

export default {
  data() {
    return {
      str: '欢迎您来到智域云图-对象存储平台',
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
      loginFormRules: loginRules,
      registerRules: {
        ...registerRules,
        agreement: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请同意人脸数据使用协议'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      },
      newuser: {
        newUsername: '',
        newPassword: '',
        newEmail: '',
        newMobile: '',
        agreement: true
      },
      dialogFormRegister: false,
      formLabelWidth: '150px',
      dialogface: false,
      capturedImage: null,
      mediaStream: null,
      imageUrl: '',
      facetitle: '',
      config: null,
      faceMesh: null,
      canvasCtx: null,
      canvasElement: null,
      videoElement: null,
      solutionOptions: null,
      lastMessageTime: 0,
      messageInterval: 3000,
      nowtime: Date.now()
    }
  },
  mounted() {
    this.typing()
    this.config = {
      locateFile: (file) => {
        // return `http://127.0.0.1:10000/${file}`;
        // return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        return `/mediapipe/faces/${file}`
      }
    }
  },
  beforeDestroy() {
    if (this.camera) {
      this.camera.stop()
      this.camera = null
    }
    if (this.faceMesh) {
      this.faceMesh.reset()
      this.faceMesh = null
    }
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
      this.$refs.loginFormRef.validate(async (valid) => {
        // valid是一个布尔值，这是一个回调函数
        if (!valid) return 0
        // await只能用在被async修饰的方法中，只有当返回的数据是promise时才能使用
        const { data: res } = await userAPI.login(this.loginForm)
        if (res.status !== 200) {
          return this.$message.error(res.msg)
        } else {
          window.sessionStorage.setItem('authority', res.data.id)
          window.sessionStorage.setItem('token', res.data.token)
          this.facetitle = '人脸认证'
          this.dialogface = true
          setTimeout(() => {
            this.initCamera()
          }, 0)
        }
      })
    },

    submitForm() {
      this.$refs.newuser.validate(async (valid) => {
        if (!valid) return
        console.log(this.newuser)
        const { data: res } = await userAPI.addUser({
          username: this.newuser.newUsername,
          password: this.newuser.newPassword,
          email: this.newuser.newEmail,
          mobile: this.newuser.newMobile
        })
        if (res.status !== 200) {
          return this.$message.error(res.msg)
        }
        const fromData = new FormData()
        const bolbfile = await fetch(this.capturedImage).then((res) => {
          console.log(res)
          return res.blob().then((res) => {
            return new File([res], this.newuser.newUsername + '.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
          })
        })
        fromData.append('image', bolbfile)
        fromData.append('imageId', this.newuser.newUsername)
        console.log(fromData.get('image'), fromData, this.capturedImage)
        console.log(fromData)

        const { data: res2 } = await axios.post('http://127.0.0.1:7000/uploadImage', fromData)
        if (res.status == 200 && res2.status == 200) {
          this.$message.success('注册用户成功！')
          this.dialogFormRegister = false
        } else {
          return this.$message.error(res.msg)
        }
      })
    },

    faceApprove() {
      this.facetitle = '拍摄'
      this.dialogface = true
      this.startCamera()
    },
    async startCamera() {
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true
        })
        this.$refs.video.srcObject = this.mediaStream
      } catch (err) {
        console.error('Error accessing the camera: ', err)
      }
    },
    capture() {
      const video = this.$refs.video
      const canvas = this.$refs.canvas
      const context = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      this.capturedImage = canvas.toDataURL('image/jpeg')
      this.dialogface = false
      //这个是要上传的图片base64格式
      console.log(this.capturedImage)
    },
    async captureTorecognize() {
      console.log('fas')
      const video = this.$refs.video
      const canvas = this.$refs.canvas
      const context = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      this.capturedImage = canvas.toDataURL('image/jpeg')
      this.dialogface = false
      const formData = new FormData()
      const bolbfile = await fetch(this.capturedImage).then((res) => {
        return res.blob()
      })
      formData.append('file', bolbfile)
      const { data: res } = await axios.post('http://127.0.0.1:7000/recognize', formData)
      if (res.person_names[0] === this.loginForm.username) {
        console.log(res.person_names[0])
        this.stopCamera()
        this.$router.push('home')
        this.$message.success(`欢迎${this.loginForm.username}登录`)
      } else {
        console.log(res.person_names[0], this.loginForm.username)
        this.$message.error('人脸识别失败')
        window.sessionStorage.clear()
        this.stopCamera()
      }
    },
    initCamera() {
      console.log(this.config)

      this.videoElement = this.$refs.video
      this.canvasElement = this.$refs.canvas
      console.log(this.videoElement, this.canvasElement)
      this.canvasCtx = this.canvasElement.getContext('2d')
      this.solutionOptions = {
        selfieMode: true,
        enableFaceGeometry: false,
        maxNumFaces: 1,
        refineLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      }
      this.faceMesh = new mpFaceMesh.FaceMesh(this.config)
      this.faceMesh.setOptions(this.solutionOptions)
      this.faceMesh.onResults(this.onResults)
      const camera = new Camera(this.videoElement, {
        onFrame: async () => {
          await this.faceMesh.send({ image: this.videoElement })
          setTimeout(() => {
            this.facetitle = '请张张嘴'
          }, 1500)
        },
        width: 1280,
        height: 720
      })
      this.$message.success('人脸识别模块加载成功')
      camera.start()
    },
    async onResults(results) {
      this.canvasCtx.save()
      this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
      this.canvasCtx.drawImage(
        results.image,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      )
      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          this.nowtime = Date.now()
          drawingUtils.drawConnectors(this.canvasCtx, landmarks, mpFaceMesh.FACEMESH_TESSELATION, {
            color: '#C0C0C070',
            lineWidth: 0.5
          })
          drawingUtils.drawConnectors(this.canvasCtx, landmarks, mpFaceMesh.FACEMESH_RIGHT_EYE, {
            color: '#FF3030',
            lineWidth: 0.5
          })
          drawingUtils.drawConnectors(
            this.canvasCtx,
            landmarks,
            mpFaceMesh.FACEMESH_RIGHT_EYEBROW,
            { color: '#FF3030', lineWidth: 0.5 }
          )
          drawingUtils.drawConnectors(this.canvasCtx, landmarks, mpFaceMesh.FACEMESH_LEFT_EYE, {
            color: '#30FF30',
            lineWidth: 0.5
          })
          drawingUtils.drawConnectors(this.canvasCtx, landmarks, mpFaceMesh.FACEMESH_LEFT_EYEBROW, {
            color: '#30FF30',
            lineWidth: 0.5
          })
          drawingUtils.drawConnectors(this.canvasCtx, landmarks, mpFaceMesh.FACEMESH_FACE_OVAL, {
            color: '#E0E0E0',
            lineWidth: 0.5
          })
          drawingUtils.drawConnectors(this.canvasCtx, landmarks, mpFaceMesh.FACEMESH_LIPS, {
            color: '#ed494c',
            lineWidth: 0.5
          })
          if (this.solutionOptions.refineLandmarks) {
            drawingUtils.drawConnectors(this.canvasCtx, landmarks, mpFaceMesh.FACEMESH_RIGHT_IRIS, {
              color: '#FF3030',
              lineWidth: 0.5
            })
            drawingUtils.drawConnectors(this.canvasCtx, landmarks, mpFaceMesh.FACEMESH_LEFT_IRIS, {
              color: '#30FF30',
              lineWidth: 0.5
            })
          }
          if (
            this.calculateAngleCAB(landmarks[61], landmarks[291], landmarks[13]) > 35 &&
            this.nowtime - this.lastMessageTime > this.messageInterval
          ) {
            this.lastMessageTime = this.nowtime
            this.$message.success('张嘴验证成功')
            setTimeout(() => {
              this.captureTorecognize()
            }, 1500)
          }
        }
      }
      this.canvasCtx.restore()
    },
    calculateAngleCAB(A, B, C) {
      // 计算向量AB和AC
      const AB = {
        x: B.x - A.x,
        y: B.y - A.y,
        z: B.z - A.z
      }
      const AC = {
        x: C.x - A.x,
        y: C.y - A.y,
        z: C.z - A.z
      }

      // 计算向量AB和AC的点积
      const dotProduct = AB.x * AC.x + AB.y * AC.y + AB.z * AC.z

      // 计算向量AB和AC的模长
      const magnitudeAB = Math.sqrt(AB.x ** 2 + AB.y ** 2 + AB.z ** 2)
      const magnitudeAC = Math.sqrt(AC.x ** 2 + AC.y ** 2 + AC.z ** 2)

      // 计算夹角的余弦值
      const cosTheta = dotProduct / (magnitudeAB * magnitudeAC)

      // 计算夹角，结果是弧度制
      const angle = Math.acos(cosTheta)

      // 如果需要角度制，可以转换
      const angleInDegrees = angle * (180 / Math.PI)

      return angleInDegrees
    },
    stopCamera() {
      if (this.camera) {
        this.camera.stop()
        this.camera = null
      }
      if (this.faceMesh) {
        this.faceMesh.reset()
        this.faceMesh = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: url('../assets/image/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
}

// 欢迎部分
.welcome-section {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  transform: translateY(-50px);
}

.typing-text {
  color: white;
  text-align: center;
  font-size: 50px;
  margin-bottom: 40px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.welcome-btn {
  height: 60px;
  width: 180px;
  font-size: 22px;
  color: #fff;
  background: linear-gradient(135deg, #409eff, #007bff);
  border: none;
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 123, 255, 0.5);
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

// 登录表单
.login-form {
  position: relative;
  z-index: 2;
  width: 400px;
  margin: 0 auto;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 30px;
  transition: all 0.5s ease;
  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
}
.el-input {
  /deep/ .el-input__inner {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    height: 45px;
    color: #333;
    transition: all 0.3s ease;

    &:focus {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
    }
  }
}
.slide-in {
  animation: slide-in 0.6s forwards;
}

@keyframes slide-in {
  0% {
    transform: translateY(-30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.logo-container {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 60px;
  color: #409eff;
  margin-bottom: 10px;
}

.login-title {
  text-align: center;
  color: #333;
  font-size: 28px;
  margin: 5px 0;
  font-weight: 600;
}

.subtitle {
  color: #666;
  font-size: 16px;
  margin-top: 5px;
}

.custom-input {
  /deep/ .el-input__inner {
    height: 45px;
    border-radius: 8px;
    border: 1px solid #dcdfe6;

    &:focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }
}

.verify-code-item {
  display: flex;
  align-items: center;
}
.verify-code-item-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.verify-input {
  flex: 1;
}

.verify-img-container {
  border: 1px solid #dcdfe6;
  width: 100px;
  height: 45px;
  margin-left: 10px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  &:hover .refresh-overlay {
    opacity: 1;
  }
}

.verify-img {
  width: 100%;
  height: 100%;
}

.refresh-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  i {
    color: white;
    font-size: 24px;
  }
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.login-btn,
.register-btn {
  flex: 1;
  height: 45px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.login-btn {
  background: linear-gradient(135deg, #409eff, #007bff);
  border: none;
  margin-right: 10px;

  &:hover {
    background: linear-gradient(135deg, #007bff, #0056b3);
  }
}

.register-btn {
  background: linear-gradient(135deg, #67c23a, #409eff);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #409eff, #0056b3);
  }
}

// 注册对话框
.register-dialog {
  /deep/ .el-dialog {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    overflow: hidden;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    }
  }

  /deep/ .el-dialog__header {
    background: rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 15px 20px;

    .el-dialog__title {
      font-weight: 600;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .el-dialog__headerbtn {
      .el-dialog__close {
        color: rgba(255, 255, 255, 0.8);

        &:hover {
          color: #fff;
        }
      }
    }
  }

  /deep/ .el-dialog__body {
    padding: 30px;
    color: rgba(255, 255, 255, 0.9);

    .el-form-item__label {
      color: rgba(255, 255, 255, 0.9);
    }

    .el-input {
      .el-input__inner {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;

        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        &:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
        }
      }

      .el-input__icon {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }

  /deep/ .el-dialog__footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 15px 20px;

    .el-button {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
      }

      &.el-button--primary {
        background: linear-gradient(135deg, #43e97b, #38f9d7);
        border: none;
        color: white;

        &:hover {
          background: linear-gradient(135deg, #38f9d7, #43e97b);
          box-shadow: 0 5px 15px rgba(56, 249, 215, 0.3);
        }
      }

      &.el-button--default {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;

        &:hover {
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
        }
      }
    }
  }

  // 人脸采集区域优化
  .face-capture-box {
    width: 100%;
    height: 180px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    i {
      font-size: 40px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 15px;
    }

    p {
      color: white;
      margin: 0 0 5px;
      font-size: 16px;
    }

    .face-hint {
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .face-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      i {
        font-size: 30px;
        margin-bottom: 8px;
      }

      span {
        color: white;
        font-size: 14px;
      }
    }

    &:hover .face-overlay {
      opacity: 1;
    }
  }
}

.register-header {
  text-align: center;
  margin-bottom: 25px;

  .register-icon {
    font-size: 50px;
    color: #409eff;
    display: block;
    margin-bottom: 10px;
  }

  span {
    font-size: 20px;
    color: #333;
    font-weight: 500;
  }
}

.register-form {
  /deep/ .el-form-item__label {
    font-size: 15px;
    color: #606266;
    padding-bottom: 8px;
  }
}

.face-photo-item {
  margin-bottom: 0;
}

.face-photo-container {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.face-placeholder {
  width: 98%;
  height: 98%;
  background: #4b5d61;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e6f1fc;
    border-color: #409eff;
    color: #409eff;
    div {
      color: #000000;
    }
  }

  i {
    font-size: 40px;
    color: #909399;
    margin-bottom: 10px;
  }

  div {
    color: white;
    font-size: 16px;
  }

  .photo-desc {
    font-size: 13px;
    color: #909399;
    margin-top: 5px;
  }
}

.face-preview {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  &:hover .face-overlay {
    opacity: 1;
  }
}

.face-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;

  i {
    font-size: 30px;
    margin-bottom: 10px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  padding-top: 20px;

  .el-button {
    padding: 12px 25px;
    font-size: 16px;
  }
}

// 人脸拍摄对话框
.face-dialog {
  /deep/ .el-dialog {
    background: rgba(20, 30, 48, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  .face-title {
    color: white;
    font-size: 24px;
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
  }

  .video-container {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

    video {
      width: 100%;
      display: block;
      background: #000;
    }

    .face-guide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .face-circle {
        width: 200px;
        height: 200px;
        border: 3px dashed rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        animation: rotate 30s linear infinite;
      }

      .guide-text {
        position: absolute;
        bottom: 20px;
        color: white;
        background: rgba(0, 0, 0, 0.5);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
      }
    }
  }

  .capture-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;

    .capture-btn {
      background: linear-gradient(135deg, #43e97b, #38f9d7);
      border: none;
      color: white;

      &:hover {
        background: linear-gradient(135deg, #38f9d7, #43e97b);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(56, 249, 215, 0.3);
      }

      i {
        margin-right: 5px;
      }
    }

    .cancel-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
      }

      i {
        margin-right: 5px;
      }
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}

// .agreement-checkbox {
//   margin-top: 10px;
//   margin-left: 10px;
//   width: 20px;
//   height: 20px;
//   /deep/ .el-checkbox__label {
//     color: #606266;
//     font-size: 14px;
//   }

//   /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
//     background-color: #409eff;
//     border-color: #409eff;
//   }

//   /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
//     color: #409eff;
//   }

//   /deep/ .el-checkbox__inner:hover {
//     border-color: #409eff;
//   }
// }
</style>
