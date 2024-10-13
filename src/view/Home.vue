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
          :index="item.id + ''"
          v-for="item in menuList"
          :key="item.id"
        >
          <!-- 模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="iconObj[item.id]"></i>
            <span>{{ item.name }}</span>
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
              style="width: 192px; height: 108px"
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
import { Camera } from "@mediapipe/camera_utils";
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
      // config: new Hands({
      //   locateFile: (file) => {
      //     return `/node_modules/@mediapipe/hands/${file}`;
      //   },
      // }),
      camera: null,
      hands: null,
      videoElement: null,
      canvasElement: null,
      canvasCtx: null,
      config: null,
      gestureMarked: null,
      gestureMarked1: null,
      timeMarked: new Date().getTime(),
    };
  },
  created() {
    this.getMenuList();
    this.acvtivePath = window.sessionStorage.getItem("acvtivePath");
    console.log("created");
  },
  mounted() {
    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        this.isFullscreen = false;
      }
    };
    console.log("mounted");
    this.config = {
      locateFile: (file) => {
        console.log(file, 111);
        // return `https://fastly.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}/${file}`;
        return `http://127.0.0.1:10000/${file}`;
        // return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@/${file}`;
      },
    };
    this.initCamera();
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
    handControl() {
      console.log("手势模式");
      // this.dialogVisible = true;
      console.log(this.config);
      // this.hands = new Hands(this.config);
      // this.hands.onResults(onResults);
    },
    onResults(results) {
      // console.log(4);
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
      if (results.multiHandLandmarks && results.multiHandedness) {
        for (
          let index = 0;
          index < results.multiHandLandmarks.length;
          index++
        ) {
          const classification = results.multiHandedness[index];
          const isRightHand = classification.label === "Right";
          const landmarks = results.multiHandLandmarks[index];
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
          //打印坐标
          //console.log(index, landmarks);
          let t = new Date().getTime();
          let gesture = this.isFistGesture(landmarks);
          if (gesture) {
            // 调用你的函数
            let timeMark = t;

            if (this.timeMarked <= timeMark - 1000) {
              //单击事件需要刷新时间与手势状态，以接收下一个手势
              console.log("gesture:" + gesture);
              console.log("gestureMarked:" + this.gestureMarked);

              if (gesture == this.gestureMarked) {
                // let element = document.getElementsByClassName("notion")[0];
                // element.style.display = "block";
                if (gesture == 5) {
                  console.log(
                    timeMark - this.timeMarked,
                    "================================================================成功调用：" +
                      gesture
                  );
                  //平移，传入中指指尖，用指尖的相对移动来移动模型xy轴
                  console.log("传入中指尖参数：{}", landmarks[12]);
                  // moveModel(landmarks[12]);
                } else if (gesture == 4) {
                  console.log(
                    timeMark - this.timeMarked,
                    "================================================================成功调用：" +
                      gesture
                  );
                  //平移，传入中指指尖，用指尖的相对移动来移动模型xy轴
                  console.log("传入中指尖参数：{}", landmarks[12]);
                  // moveCam(landmarks[12]);
                } else if (gesture == 2) {
                  console.log(
                    timeMark - this.timeMarked,
                    "================================================================成功调用：" +
                      gesture
                  );
                  // rotateCam();
                } else {
                  console.log(
                    timeMark - this.timeMarked,
                    "================================================================成功调用：" +
                      gesture
                  );
                  if (gesture == 6 || gesture == 7) {
                    // setSize(gesture);
                  }

                  this.gestureMarked = 0;
                  this.gestureMarked1 = 0;
                  this.timeMarked = t;
                  // yourFunction();
                }
              }
              //长按或拖动等操作需要判断当前手势是否改变
            }
            //与上一帧的手势不同
            if (gesture != this.gestureMarked1 || gesture == false) {
              console.log("手势变化，gesture：" + gesture);
              console.log("手势变化，gestureMarked1：" + this.gestureMarked1);
              this.gestureMarked1 = gesture;
              //刷新时间
              this.gestureMarked = gesture;
              this.timeMarked = t;
              console.log("刷新时间");
            }

            // yourFunction();
          }
        }
      }
      this.canvasCtx.restore();
    },
    initCamera() {
      this.videoElement = this.$refs.videoElement;
      this.canvasElement = this.$refs.canvasElement;
      console.log("initCamera", this.canvasElement);
      this.canvasCtx = this.canvasElement.getContext("2d");
      console.log(this.config, 2);
      console.log(new mpHands.Hands());
      this.hands = new mpHands.Hands(this.config);
      console.log(this.hands, 3);
      this.hands.onResults(this.onResults.bind(this.hands));
      this.hands.setOptions({
        selfieMode: true,
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      const camera = new Camera(this.videoElement, {
        onFrame: async () => {
          await this.hands.send({ image: this.videoElement });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
      console.log("last");
    },
    isFistGesture(landmarks) {
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

      //指尖
      const thumbTip = landmarks[4];
      const middleFingerTip = landmarks[12];
      const ringFingerTip = landmarks[16];
      const pinkyTip = landmarks[20];

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

      // 判断手势二
      if (
        // //食指
        this.angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
        //食指 第二 三指节为打直状态
        this.angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        //大拇指 第一 二指节弯曲
        (this.angle(thumb1, thumb2, thumb3) > -0.9 ||
          this.angle(thumb2, thumb3, thumb4) > -0.9) &&
        //无名指 小指 第二三指节 弯曲
        //无名指
        this.angle(ringFinger2, ringFinger3, ringFinger4) > -0.8 &&
        this.angle(pinky2, pinky3, pinky4) > -0.8
      ) {
        console.log("手势二识别成功");
        return 2;
      } else if (
        //判断手势一

        //食指 第二 三指节为打直状态
        this.angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        //大拇指 第一 二指节弯曲
        (this.angle(thumb1, thumb2, thumb3) > -0.9 ||
          this.angle(thumb2, thumb3, thumb4) > -0.9) &&
        this.angle(pinky2, pinky3, pinky4) > -0.8 &&
        //无名指 小指 第二三指节 弯曲
        //无名指
        this.angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
        this.angle(pinky2, pinky3, pinky4) > -0.5 &&
        //中指弯曲
        this.angle(middleFinger2, middleFinger3, middleFinger4) > -0.5
        //拇指
      ) {
        console.log("手势一识别成功！");
        return 1;
      } else if (
        //食指 中指 无名指打直
        //食指 第二 三指节为打直状态
        this.angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        //中指 第二 三指节为打直状态
        this.angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
        //无名指 第二 三指节为打直状态
        this.angle(ringFinger2, ringFinger3, ringFinger4) < -0.8 &&
        //拇指 小指弯曲
        (this.angle(thumb1, thumb2, thumb3) > -0.9 ||
          this.angle(thumb2, thumb3, thumb4) > -0.9) &&
        this.angle(pinky2, pinky3, pinky4) > -0.8
      ) {
        console.log("手势三识别成功");
        return 3;
      } else if (
        // //手势四

        //食指 第二 三指节为打直状态
        this.angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        //中指 第二 三指节为打直状态
        this.angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
        //无名指 第二 三指节为打直状态
        this.angle(ringFinger2, ringFinger3, ringFinger4) < -0.8 &&
        //小指 打直
        this.angle(pinky2, pinky3, pinky4) < -0.8 &&
        //拇指弯曲
        this.angle(thumb1, thumb2, thumb3) > -0.9
      ) {
        console.log("手势四判断成功");
        return 4;
      } else if (
        //食指 第二 三指节为打直状态
        this.angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        //中指 第二 三指节为打直状态
        this.angle(middleFinger2, middleFinger3, middleFinger4) < -0.8 &&
        //无名指 第二 三指节为打直状态
        this.angle(ringFinger2, ringFinger3, ringFinger4) < -0.8 &&
        //小指 打直
        this.angle(pinky2, pinky3, pinky4) < -0.8 &&
        //拇指直
        this.angle(thumb1, thumb2, thumb3) < -0.8
      ) {
        console.log("手势五判断成功");
        return 5;
      } else if (
        //食指 第二 三指节为打直状态
        this.angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        //拇指直
        this.angle(thumb1, thumb2, thumb3) < -0.8 &&
        //无名指
        this.angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
        this.angle(pinky2, pinky3, pinky4) > -0.5 &&
        //中指弯曲
        this.angle(middleFinger2, middleFinger3, middleFinger4) > -0.5 &&
        this.angle(indexFigure1, figure0, thumb1) > 0.8
      ) {
        console.log("手势六判断成功");
        return 6;
      } else if (
        //食指 第二 三指节为打直状态
        this.angle(indexFigure2, indexFigure3, indexFigure4) < -0.8 &&
        //拇指直
        this.angle(thumb1, thumb2, thumb3) < -0.8 &&
        //无名指
        this.angle(ringFinger2, ringFinger3, ringFinger4) > -0.5 &&
        this.angle(pinky2, pinky3, pinky4) > -0.5 &&
        //中指弯曲
        this.angle(middleFinger2, middleFinger3, middleFinger4) > -0.5 &&
        this.angle(indexFigure1, figure0, thumb1) < 0.7
      ) {
        console.log("手势七判断成功");
        return 7;
      }

      return false;
    },
    angle(p1, p2, p3) {
      //顶角为a
      var a = this.dist3D(p1.x, p1.y, p1.z, p3.x, p3.y, p3.z);
      var b = this.dist3D(p1.x, p1.y, p2.z, p2.x, p2.y, p2.z);
      var c = this.dist3D(p3.x, p3.y, p3.z, p2.x, p2.y, p2.z);

      var cosA = (b * b + c * c - a * a) / (2 * c * b);
      //console.log("cosA:"+cosA)
      return cosA;
    },
    dist2D(x1, y1, x2, y2) {
      var a = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      return a;
    },
    dist3D(x1, y1, z1, x2, y2, z2) {
      var a = Math.sqrt(
        (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2)
      );
      return a;
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
