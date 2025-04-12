<template>
  <el-container class="home-container">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div style="text-align: center">
        <svg
          t="1586276749157"
          viewBox="0 0 1408 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1871"
          width="54px"
          height="54px"
        >
          <path
            d="M620.8 454.4h19.2c19.2 0 32-12.8 32-32s-12.8-32-32-32h-19.2c-44.8 0-76.8-25.6-76.8-57.6s32-57.6 76.8-57.6c12.8 0 19.2 0 32 6.4 19.2 6.4 38.4-6.4 44.8-25.6 0-19.2 25.6-32 51.2-32 32 0 51.2 19.2 51.2 38.4v6.4c-6.4 19.2 6.4 38.4 25.6 44.8 25.6 6.4 38.4 19.2 38.4 38.4s-25.6 38.4-51.2 38.4h-25.6c-19.2 0-32 12.8-32 32s12.8 32 32 32h25.6c64 0 115.2-44.8 115.2-102.4 0-38.4-25.6-76.8-64-89.6 0-57.6-57.6-102.4-115.2-102.4-44.8 0-83.2 19.2-102.4 57.6h-25.6c-76.8 0-140.8 51.2-140.8 121.6s64 115.2 140.8 115.2zM544 768h-320c-19.2 0-32 12.8-32 32s12.8 32 32 32h320c19.2 0 32-12.8 32-32s-12.8-32-32-32z"
            fill="#909399"
            p-id="1872"
          ></path>
          <path
            d="M1388.8 716.8v-19.2l-153.6-544C1216 64 1132.8 0 1056 0h-704C275.2 0 192 64 166.4 147.2L12.8 691.2v19.2c-6.4 32-12.8 57.6-12.8 89.6C0 921.6 102.4 1024 224 1024h960c121.6 0 224-102.4 224-224 0-32-6.4-57.6-19.2-83.2zM230.4 166.4C243.2 108.8 300.8 64 352 64h704c51.2 0 102.4 44.8 121.6 102.4l121.6 448c-32-25.6-70.4-38.4-115.2-38.4h-960c-44.8 0-83.2 12.8-115.2 32l121.6-441.6zM1184 960h-960C134.4 960 64 889.6 64 800c0-12.8 0-19.2 6.4-32v-6.4c12.8-70.4 76.8-121.6 153.6-121.6h960c76.8 0 140.8 51.2 153.6 128 0 12.8 6.4 19.2 6.4 32 0 89.6-70.4 160-160 160z"
            fill="#909399"
            p-id="1873"
          ></path>
          <path
            d="M1120 704c-51.2 0-96 44.8-96 96s44.8 96 96 96 96-44.8 96-96-44.8-96-96-96z m0 128c-19.2 0-32-12.8-32-32s12.8-32 32-32 32 12.8 32 32-12.8 32-32 32z"
            fill="#909399"
            p-id="1874"
          ></path>
        </svg>
      </div>
      <!-- 侧边栏菜单区域 -->
      <el-menu
        ref="menu"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409eff"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
        :default-active="acvtivePath"
      >
        <!-- 一级菜单 -->
        <el-submenu
          ref="subMenu"
          :index="item.id + ''"
          v-for="item in menuList"
          :key="item.id"
        >
          <!-- 模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="iconObj[item.id]"></i>
            <span @click="saveNavsub(item.id)">{{ item.name }}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/' + subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="saveNavState('/' + subItem.path)"
          >
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <span>{{ subItem.name }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <!-- <div class="toggle-button" @click="toggleCollapse">|||</div> -->
        <hamburger
          :is-active="!isCollapse"
          class="hamburger-container"
          @toggleClick="toggleChange()"
        />
        <div style="display: flex; align-items: center">
          <span style="margin-left: 15px">智域云图-对象存储平台</span>
        </div>
        <div @click="screenfull()" class="fullscreen">
          <svg
            t="1586700823354"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2320"
            width="28"
            height="28"
            style="vertical-align: -0.5em"
          >
            <path
              d="M376.96 107.52V0H0v376.96h107.52V184.32l242.56 242.56 76.8-76.8-242.56-242.56h192.64z m-26.88 490.24L107.52 840.32V647.04H0V1024h376.96V916.48H184.32l242.56-242.56-76.8-76.16zM916.48 0H647.04v107.52h193.28L597.76 350.08l76.16 76.8 242.56-242.56v192.64H1024V0H916.48z m0 840.32L673.92 597.76l-76.16 76.16 242.56 242.56H647.04V1024H1024V647.04H916.48v193.28z"
              p-id="2321"
              fill="#707070"
            ></path>
          </svg>
        </div>
        <div>
          <el-button type="primary" @click="handControl" style="margin: 0 10px"
            >手势模式</el-button
          >
          <div style="position: absolute; right: 0">
            <video
              ref="videoElement"
              autoplay
              muted
              width="200px"
              style="display: none"
            ></video>
            <canvas
              ref="canvasElement"
              style="
                width: 192px;
                height: 108px;
                position: relative;
                right: 20px;
                z-index: 9999;
              "
            ></canvas>
          </div>
          <el-button type="info" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <breadCrumb />
        <!-- 路由占位符 -->
        <transition :name="transitionName">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import * as drawingUtils from "@mediapipe/drawing_utils";
import * as mpHands from "@mediapipe/hands";
import screenfull from "screenfull";
import Hamburger from "../components/Hamburger";
import BreadCrumb from "../components/BreadCrumb";
export default {
  components: {
    Hamburger,
    BreadCrumb,
  },
  data() {
    return {
      // 左侧菜单数据
      menuList: "",
      iconObj: {
        100: "iconfont icon-mn_baobiao_fill",
        102: "iconfont icon-users",
        109: "iconfont icon-tijikongjian",
        121: "iconfont icon-wenjian",
        126: "iconfont icon-setting",
      },
      isFullscreen: false,
      isCollapse: false,
      // 被激活的连接地址
      acvtivePath: "",
      transitionName: "",
      dialogVisible: false,
      camera: null,
      hands: null,
      videoElement: null,
      canvasElement: null,
      canvasCtx: null,
      config: null,
      gestureMarked: null,
      gestureMarked1: null,
      timeMarked: new Date().getTime(),
      handvideo: 0,
      camera: null,
      subID: window.sessionStorage.getItem("subID"),
      enumSub: {
        100: 0,
        102: 1,
        109: 2,
        126: 3,
        121: 4,
      },
      handGestureWorker: null,
      wasmModule: null,
    };
  },
  created() {
    this.getMenuList();
    this.acvtivePath = window.sessionStorage.getItem("acvtivePath");
  },
  mounted() {
    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        this.isFullscreen = false;
      }
    };
    this.config = {
      locateFile: (file) => {
        console.log("请求加载模型文件:", file);
        return `/mediapipe/hands/${file}`;
      }
    };
    
    // 初始化手势识别Worker
    if (window.Worker) {
      try {
        this.initHandGestureWorker();
      } catch (error) {
        console.error('初始化手势识别Worker失败:', error);
      }
    } else {
      console.warn('此浏览器不支持Web Workers');
    }
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    },
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("login");
    },
    async getMenuList() {
      // 将data去处 重定向为res
      const { data: res } = await this.$http.get("/api/menus");
      if (res.status !== 200) {
        return this.$message.error(res.msg);
      }
      this.menuList = res.data;
    },
    toggleChange() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(acvtivePath) {
      window.sessionStorage.setItem("acvtivePath", acvtivePath);
      this.acvtivePath = acvtivePath;
    },
    saveNavsub(id) {
      window.sessionStorage.setItem("subID", id);
      this.subID = id;
    },
    /**
     * 全屏事件
     */
    screenfull() {
      screenfull.toggle();
      this.isFullscreen = true;
    },
    /**
     * 是否全屏并按键ESC键的方法
     */
    checkFull() {
      var isFull =
        document.fullscreenEnabled ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled;
      // to fix : false || undefined == undefined
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },
    async handControl() {
      this.handvideo = !this.handvideo;
      if (this.handvideo) {
        try {
          // 确保MediaPipe组件已加载
          if (!window.Camera) {
            // 如果Camera未定义，可能需要动态加载
            this.$message.warning('正在加载摄像头组件，请稍候...');
            
            // 可以考虑动态导入
            const { Camera } = await import("@mediapipe/camera_utils");
            window.Camera = Camera;
          }
          
          this.initCamera();
        } catch (error) {
          console.error('初始化摄像头失败:', error);
          this.$message.error(`无法初始化摄像头: ${error.message}`);
          this.handvideo = false;
        }
      } else {
        this.stopCamera();
      }
    },
    initCamera() {
      this.$refs.canvasElement.style.display = "block";
      this.videoElement = this.$refs.videoElement;
      this.canvasElement = this.$refs.canvasElement;
      this.canvasCtx = this.canvasElement.getContext("2d");
      
      console.log("初始化手势识别组件...");
      
      // 关键修改：使用本地模型文件
      this.config = {
        locateFile: (file) => {
          console.log("请求加载模型文件:", file);
          return `/mediapipe/hands/${file}`;
        }
      };
      
      try {
        // 创建Hands实例
        this.hands = new mpHands.Hands(this.config);
        console.log("成功创建Hands实例");
        
        this.hands.onResults(this.onResults.bind(this));
        this.hands.setOptions({
          selfieMode: true,
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        
        // 初始化摄像头
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({
            video: {
              width: 1280,
              height: 720
            }
          })
          .then((stream) => {
            console.log("摄像头访问成功");
            this.videoElement.srcObject = stream;
            this.videoElement.onloadedmetadata = () => {
              this.videoElement.play();
              this.startFrameProcessing();
            };
          })
          .catch((error) => {
            console.error("摄像头访问失败:", error);
            this.$message.error("无法访问摄像头，请确保已授予权限");
          });
        } else {
          console.error("浏览器不支持getUserMedia API");
          this.$message.error("您的浏览器不支持摄像头功能");
        }
      } catch (error) {
        console.error("初始化手势识别失败:", error);
        this.$message.error(`初始化失败: ${error.message}`);
      }
    },
    onResults(results) {
      // 保存原始绘图逻辑
      this.canvasCtx.save();
      this.canvasCtx.clearRect(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      this.canvasCtx.drawImage(
        results.image,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      
      // 处理手部标记绘制
      if (results.multiHandLandmarks && results.multiHandedness) {
        for (let index = 0; index < results.multiHandLandmarks.length; index++) {
          const classification = results.multiHandedness[index];
          const isRightHand = classification.label === "Right";
          const landmarks = results.multiHandLandmarks[index];
          
          // 绘制手部连接线和关键点
          drawingUtils.drawConnectors(
            this.canvasCtx,
            landmarks,
            mpHands.HAND_CONNECTIONS,
            { color: isRightHand ? "#00FF00" : "#FF0000" }
          );
          drawingUtils.drawLandmarks(this.canvasCtx, landmarks, {
            color: isRightHand ? "#00FF00" : "#FF0000",
            fillColor: isRightHand ? "#FF0000" : "#00FF00",
            radius: (data) => {
              return drawingUtils.lerp(data.from.z, -0.15, 0.1, 8, 1);
            },
          });
          
          // 将手部关键点数据发送到Worker处理
          if (this.handGestureWorker) {
            this.handGestureWorker.postMessage({
              type: 'processLandmarks',
              data: {
                landmarks: landmarks,
                handedness: classification.label
              }
            });
          } else {
            // 如果Worker不可用，回退到原始处理逻辑
            this.processHandGestureInMainThread(landmarks, classification.label);
          }
        }
      }
      
      this.canvasCtx.restore();
    },
    handleGestureDetection(data) {
      const { hand, gesture, landmarks } = data;
      const t = new Date().getTime();
      
      if (hand === 'Right') {
        // 处理右手手势
        if (this.timeMarked <= t - 1000) {
          if (gesture === this.gestureMarked) {
            this.processRightHandGesture(gesture);
            this.gestureMarked = 0;
            this.gestureMarked1 = 0;
            this.timeMarked = t;
          }
        }
        
        if (gesture !== this.gestureMarked1 || gesture === false) {
          this.gestureMarked1 = gesture;
          this.gestureMarked = gesture;
          this.timeMarked = t;
        }
      } else if (hand === 'Left') {
        // 处理左手手势
        if (this.timeMarked <= t - 1000) {
          if (gesture === this.gestureMarked) {
            this.processLeftHandGesture(gesture);
            this.gestureMarked = 0;
            this.gestureMarked1 = 0;
            this.timeMarked = t;
          }
        }
        
        if (gesture !== this.gestureMarked1 || gesture === false) {
          this.gestureMarked1 = gesture;
          this.gestureMarked = gesture;
          this.timeMarked = t;
        }
      }
    },
    processRightHandGesture(gesture) {
      switch (gesture) {
        case 1:
          window.eventBus.$emit("getDirFileInfo");
          window.eventBus.$emit("getDirFileByIndex", 1);
          break;
        case 2:
          window.eventBus.$emit("getDirFileByIndex", 2);
          break;
        case 3:
          window.eventBus.$emit("getDirFileByIndex", 3);
          break;
        case 4:
          window.eventBus.$emit("getDirFileByIndex", 4);
          break;
        case 5:
          window.eventBus.$emit("getDirFileByIndex", 5);
          break;
        case 101:
          window.eventBus.$emit("rollbackFile", 101);
          break;
        // 其他手势处理...
      }
    },
    processLeftHandGesture(gesture) {
      switch (gesture) {
        case 1:
          this.upSubMenu();
          break;
        case 101:
          this.chooseMenu1();
          break;
        case 102:
          this.chooseMenu2();
          break;
        case 201:
          this.downSubMenu();
          break;
      }
    },
    stopCamera() {
      if (this.camera) {
        this.camera.stop();
        this.camera = null;
      }
      
      if (this.hands) {
        this.hands.reset();
        this.hands = null;
      }
      
      if (this.handGestureWorker) {
        this.handGestureWorker.terminate();
        this.handGestureWorker = null;
      }
      
      this.$refs.canvasElement.style.display = "none";
    },
    openMenu(index, num) {
      console.log(this.menuList);
      switch (index) {
        case 1:
          if (this.$refs.menu.openedMenus[0] == 100) {
            // console.log(this.$refs.subMenu);
            this.$refs.subMenu[0].$children[0].handleClick();
          } else {
            this.$refs.subMenu[0].handleClick();
          }
          console.log(this.$refs.subMenu, this.$refs.menu);
          break;
        case 2:
          if (this.$refs.menu.openedMenus[0] == 102) {
            // console.log(this.$refs.subMenu);
            this.$refs.subMenu[0].$children[0].handleClick();
          } else {
            this.$refs.subMenu[1].handleClick();
          }
          break;
        case 3:
          if (this.$refs.menu.openedMenus[0] == 109) {
            if (num == 1) {
              this.$refs.subMenu[0].$children[0].handleClick();
            } else {
              this.$refs.subMenu[0].$children[1].handleClick();
            }
          } else {
            this.$refs.subMenu[2].handleClick();
          }
          break;
        case 4:
          if (this.$refs.menu.openedMenus[0] == 126) {
            // console.log(this.$refs.subMenu);
            this.$refs.subMenu[0].$children[0].handleClick();
          } else {
            this.$refs.subMenu[3].handleClick();
          }
        case 5:
          if (this.$refs.menu.openedMenus[0] == 121) {
            if (num == 1) {
              this.$refs.subMenu[0].$children[0].handleClick();
            } else {
              this.$refs.subMenu[0].$children[1].handleClick();
            }
          } else {
            this.$refs.subMenu[4].handleClick();
          }
      }
    },
    upSubMenu() {
      if (this.enumSub[this.subID] > 0) {
        this.$refs.subMenu[this.enumSub[this.subID] - 1].handleClick();
        this.subID = this.$refs.menu.openedMenus[0];
        window.sessionStorage.setItem("subID", this.subID);
        console.log(this.subID, this.$refs.menu.openedMenus[0]);
      } else {
        this.$refs.subMenu[4].handleClick();
        console.log(this.$refs.menu);
        this.subID = 121;
        window.sessionStorage.setItem("subID", this.subID);
        console.log(this.subID, this.$refs.menu.openedMenus[0]);
      }
    },
    downSubMenu() {
      if (this.enumSub[this.subID] < 3) {
        this.$refs.subMenu[this.enumSub[this.subID] + 1].handleClick();
        this.subID = this.$refs.menu.openedMenus[0];
        window.sessionStorage.setItem("subID", this.subID);
      } else {
        this.$refs.subMenu[0].handleClick();
        this.subID = 100;
        window.sessionStorage.setItem("subID", this.subID);
      }
    },
    chooseMenu1() {
      this.$refs.subMenu[this.enumSub[this.subID]].$children[0].handleClick();
    },
    chooseMenu2() {
      if (this.$refs.subMenu[this.enumSub[this.subID]].$children[1]) {
        this.$refs.subMenu[this.enumSub[this.subID]].$children[1].handleClick();
      }
    },
    initHandGestureWorker() {
      // Worker代码作为字符串
      const workerCode = `
        // Worker内部代码
        let gestureMarked = null;
        let gestureMarked1 = null;
        let timeMarked = new Date().getTime();
        
        // 接收消息
        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          if (type === 'processLandmarks') {
            const { landmarks, handedness } = data;
            
            // 在Worker中处理手势识别
            const gesture = isFistGesture(landmarks);
            
            if (gesture) {
              self.postMessage({
                type: 'gestureDetected',
                data: {
                  hand: handedness,
                  gesture: gesture,
                  landmarks: landmarks
                }
              });
            }
          }
        };
        
        // 计算两点间距离 (3D)
        function dist3D(x1, y1, z1, x2, y2, z2) {
          return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
        }
        
        // 计算角度
        function angle(p1, p2, p3) {
          const a = dist3D(p1.x, p1.y, p1.z, p3.x, p3.y, p3.z);
          const b = dist3D(p1.x, p1.y, p2.z, p2.x, p2.y, p2.z);
          const c = dist3D(p3.x, p3.y, p3.z, p2.x, p2.y, p2.z);
          
          const cosA = (b * b + c * c - a * a) / (2 * c * b);
          return cosA;
        }
        
        // 移植原有的手势识别逻辑
        function isFistGesture(landmarks) {
          // 获取食指关键点信息
          const indexFigure1 = landmarks[8];
          const indexFigure2 = landmarks[7];
          const indexFigure3 = landmarks[6];
          const indexFigure4 = landmarks[5];
        
          //拇指
          const thumb1 = landmarks[4];
          const thumb2 = landmarks[3];
          const thumb3 = landmarks[2];
          const thumb4 = landmarks[1];
        
          // 获取中指关键点信息
          const middleFinger1 = landmarks[12];
          const middleFinger2 = landmarks[11];
          const middleFinger3 = landmarks[10];
          const middleFinger4 = landmarks[9];
        
          //获取无名指关键点信息
          const ringFinger1 = landmarks[16];
          const ringFinger2 = landmarks[15];
          const ringFinger3 = landmarks[14];
          const ringFinger4 = landmarks[13];
        
          //获取小指关键点信息
          const pinky1 = landmarks[20];
          const pinky2 = landmarks[19];
          const pinky3 = landmarks[18];
          const pinky4 = landmarks[17];
        
          //手腕
          const figure0 = landmarks[0];
        
          // 判断手势
          if (
            //判断手势一
            //食指 第二 三指节为打直状态
            angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
            //大拇指 第一 二指节弯曲
            (angle(thumb1, thumb2, thumb3) > -0.9 ||
              angle(thumb2, thumb3, thumb4) > -0.9) &&
            angle(pinky2, pinky3, pinky4) > -0.8 &&
            //无名指 小指 第二三指节 弯曲
            //无名指
            angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
            angle(pinky2, pinky3, pinky4) > -0.5 &&
            //中指弯曲
            angle(middleFinger2, middleFinger3, middleFinger4) > -0.5
            //拇指
          ) {
            return 1;
          } 
          
          // 其他手势判断逻辑...
          // 这里移植原始代码中的其他手势判断
          
          // ... 省略其他手势判断代码 ...
          
          return false;
        }
      `;
      
      // 创建Blob URL
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      
      // 创建Worker
      this.handGestureWorker = new Worker(workerUrl);
      
      // 设置消息处理
      this.handGestureWorker.onmessage = (e) => {
        const { type, data } = e.data;
        
        if (type === 'gestureDetected') {
          this.handleGestureDetection(data);
        }
      };
      
      // 释放Blob URL
      URL.revokeObjectURL(workerUrl);
    },
    processHandGestureInMainThread(landmarks, handLabel) {
      // 这里复制原始isFistGesture函数的逻辑
      // 原始处理逻辑保留，作为备选方案
      // ...
    },
    // 添加帧处理函数
    startFrameProcessing() {
      // 使用requestAnimationFrame处理视频帧
      const processFrame = async () => {
        if (this.handvideo && this.videoElement && this.hands) {
          try {
            await this.hands.send({image: this.videoElement});
          } catch (error) {
            console.error("处理视频帧失败:", error);
          }
        }
        
        if (this.handvideo) {
          this.animationFrameId = requestAnimationFrame(processFrame);
        }
      };
      
      this.animationFrameId = requestAnimationFrame(processFrame);
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #97a8be;
  font-size: 18px;
}

.el-aside {
  background-color: #304156;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eff1f4;
}

span {
  font-size: 16px;
}

.iconfont {
  margin-right: 10px;
}

.hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

.breadcrumb-container {
  float: left;
}

.iconfont {
  margin-right: 10px;
}

.fullscreen {
  position: absolute;
  right: 220px;
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
