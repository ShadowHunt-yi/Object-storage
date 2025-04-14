<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>上传路径</span>
          </div>
          <div class="inputlist">
            <div class="input">
              <div class="title">桶名：</div>
              <el-input placehold="请输入桶名" v-model="bucketNameShow" style="width: 80% ;margin: 0 20px;"></el-input>
              <el-button type="primary" plain @click="dialogTableVisible = true">选择桶</el-button>
              <el-dialog title="选择桶" :visible.sync="dialogTableVisible">
                <el-table :data="buckets" width="1600px">
                  <el-table-column label="桶名" width="200">
                    <template slot-scope="scope">
                      <div>
                        <span>{{ scope.row.name }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注" width="200">
                    <template slot-scope="scope">
                      <div>
                        <span>{{ scope.row.creationDate }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="文件数量">
                    <template slot-scope="scope">
                      <div>
                        <span>{{ scope.row.fileCount }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="文件总大小" width="150">
                    <template slot-scope="scope">
                      <div>
                        <span>{{ scope.row.size }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="250">
                    <template slot-scope="scope" v-if="buckets !== [{}]">
                      <el-button size="mini" type="primary" @click="rebucketName(scope.row.name)">重命名</el-button>
                      <el-button size="mini" type="success"
                        @click="select(scope.row.name), dialogTableVisible = false">选择</el-button>
                      <el-button size="mini" type="danger" @click="removeBucket(scope.row.name)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
              <el-button type="primary" plain @click="dialogFormVisible = true" style="margin: 0 10px;">创建桶</el-button>
              <el-dialog title="创建桶" :visible.sync="dialogFormVisible" width="600px">
                <div>
                  <span>桶名：</span>
                  <el-input v-model="newbucket" placeholder="请输入英文名称">
                  </el-input>
                  <el-button @click="dialogFormVisible = false, newbucket = ''" style="margin: 10px 0;">取消</el-button>
                  <el-button @click="dialogFormVisible = false, createBusket(newbucket)"
                    style="float: right;margin: 10px 0;">创建</el-button>
                </div>
              </el-dialog>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" class="fileupload-bottom">
        <el-card style="width: 50%;margin: 0 10px 0 0;" header="文件分片上传" shadow="hover">
          <el-upload style="width: 100%;" action="/api" drag multiple :http-request="handleHttpRequest"
            :on-remove="handleRemoveFile">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text" style="text-align: center;">
              请拖拽文件到此处或 <em>点击此处上传</em>
            </div>
          </el-upload>

        </el-card>
        <el-card style="width: 50%;margin: 0 0 0 10px;" header="文件压缩上传" shadow="hover">
          <el-upload action="/api" drag :http-request="handleHttpRequestzip" :on-remove="handleRemoveFile"
            style="width: 100%;">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text" style="text-align: center;">
              请拖拽文件到此处或<em>点击此处上传</em>
            </div>
          </el-upload>
        </el-card>
      </el-col>
      <el-col>
        <el-card style="width: 100%;height: 200px; margin: 10px 0 0 0; " header="图片裁剪上传" shadow="hover">
          <el-upload class="upload-demo" action="/api" :auto-upload="false" :show-file-list="false"
            :on-change="changeUpload" style="height: 100%;">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击上传</div>
            <div class="el-upload__tip">支持绝大多数图片格式</div>
          </el-upload>

          <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
            <div class="cropper-content">
              <div class="cropper">
                <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType"
                  :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox"
                  :original="option.original" :autoCrop="option.autoCrop" :fixed="option.fixed"
                  :fixedNumber="option.fixedNumber" :centerBox="option.centerBox" :infoTrue="option.infoTrue"
                  :fixedBox="option.fixedBox"></vueCropper>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="finish(), dialogVisible = false" :loading="loading">确认</el-button>
            </div>
          </el-dialog>


          <!-- <el-button type="primary" @click="handleHttpRequestPic()">确认上传<i
              class="el-icon-upload el-icon--right"></i></el-button> -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import md5 from "../../lib/md5";
import { taskInfo, initTask, preSignUrl, merge } from "../../lib/api";
import axios from "axios";
import { ref } from "vue";
import Queue from "promise-queue-plus";
import { HTTP_SUCCESS_CODE } from '@/lib/api.code.js'
import { bucketAPI } from '@/api'
//压缩上传
const handleHttpRequestzip = async function (options) {
  console.log(this.bucketNameShow);
  if(this.bucketNameShow==''){
    return this.$message('未选择桶')
  }
  const file = options.file
  const identifier = await md5(file)
  console.log(identifier);
  const totalSize = file.size
  const chunkSize = 5 * 1024 * 1024
  const fileName = file.name
  let FormDatas = new FormData()
  FormDatas.append('file', file)
  console.log(FormDatas.get('file'));
  const _up = axios.create()
  _up.request({
    url: '/api/zip/upload/' + this.bucketNameShow,
    method: 'POST',
    data: FormDatas,
    params: {
      identifier: identifier,
      fileName: fileName,
      totalSize: totalSize,
      chunkSize: chunkSize
    }
  })
  console.log(1);
}
// 文件上传分块任务的队列（用于移除文件时，停止该文件的上传队列） key：fileUid value： queue object
const fileUploadChunkQueue = ref({}).value

/**
 * 获取一个上传任务，没有则初始化一个
 */
const getTaskInfo = async function (file,bucketName) {
  let task;
  const identifier = await md5(file)
  console.log(bucketName);
  const { code, data, msg } = await taskInfo(identifier,bucketName)
  if (code === HTTP_SUCCESS_CODE) {
    task = data
    if (!task) {
      const initTaskData = {
        identifier,
        fileName: file.name,
        totalSize: file.size,
        chunkSize: 5 * 1024 * 1024,
        bucketName
      }
      const { code, data, msg } = await initTask(initTaskData)
      if (code === HTTP_SUCCESS_CODE) {
        task = data
      } else {
        this.$message.error({
          message: msg
        })

      }
    }
  } else {
    this.$message.error({
      message: msg
    })
  }
  return task
}

/**
 * 上传逻辑处理，如果文件已经上传完成（完成分块合并操作），则不会进入到此方法中
 */
const handleUpload = (file, taskRecord, options,bucketName) => {

  let lastUploadedSize = 0; // 上次断点续传时上传的总大小
  let uploadedSize = 0 // 已上传的大小
  const totalSize = file.size || 0 // 文件总大小
  let startMs = new Date().getTime(); // 开始上传的时间
  const { exitPartList, chunkSize, chunkNum, fileIdentifier } = taskRecord

  // 获取从开始上传到现在的平均速度（byte/s）
  const getSpeed = () => {
    // 已上传的总大小 - 上次上传的总大小（断点续传）= 本次上传的总大小（byte）
    const intervalSize = uploadedSize - lastUploadedSize
    const nowMs = new Date().getTime()
    // 时间间隔（s）
    const intervalTime = (nowMs - startMs) / 1000
    return intervalSize / intervalTime
  }

  const uploadNext = async (partNumber) => {
    const start = new Number(chunkSize) * (partNumber - 1)
    const end = start + new Number(chunkSize)
    const blob = file.slice(start, end)
    const _http = axios.create()
    const { code, data, msg } = await preSignUrl({ identifier: fileIdentifier, partNumber: partNumber,bucketName:bucketName })
    if (code === HTTP_SUCCESS_CODE && data) {
      await _http.request({
        url: data,
        method: 'PUT',
        data: blob,
        headers: {
          'Content-Type': 'application/octet-stream',
        }
      })
      return Promise.resolve({ partNumber: partNumber, uploadedSize: blob.size })
    }
    return Promise.reject(`分片${partNumber}， 获取上传地址失败`)
  }

  /**
   * 更新上传进度
   * @param increment 为已上传的进度增加的字节量
   */
  const updateProcess = (increment) => {
    increment = new Number(increment)
    const { onProgress } = options
    let factor = 1000; // 每次增加1000 byte
    let from = 0;
    // 通过循环一点一点的增加进度
    while (from <= increment) {
      from += factor
      uploadedSize += factor
      const percent = Math.round(uploadedSize / totalSize * 100).toFixed(2);
      onProgress({ percent: percent })
    }

    const speed = getSpeed();
    const remainingTime = speed != 0 ? Math.ceil((totalSize - uploadedSize) / speed) + 's' : '未知'
    console.log('剩余大小：', (totalSize - uploadedSize) / 1024 / 1024, 'mb');
    console.log('当前速度：', (speed / 1024 / 1024).toFixed(2), 'mbps');
    console.log('预计完成：', remainingTime);
  }


  return new Promise(resolve => {
    const failArr = [];
    const queue = Queue(5, {
      "retry": 3,               //Number of retries
      "retryIsJump": false,     //retry now?
      "workReject": function (reason, queue) {
        failArr.push(reason)
      },
      "queueEnd": function (queue) {
        resolve(failArr);
      }
    })
    fileUploadChunkQueue[file.uid] = queue
    for (let partNumber = 1; partNumber <= chunkNum; partNumber++) {
      const exitPart = (exitPartList || []).find(exitPart => exitPart.partNumber == partNumber)
      if (exitPart) {
        // 分片已上传完成，累计到上传完成的总额中,同时记录一下上次断点上传的大小，用于计算上传速度
        lastUploadedSize += new Number(exitPart.size)
        updateProcess(exitPart.size)
      } else {
        queue.push(() => uploadNext(partNumber).then(res => {
          // 单片文件上传完成再更新上传进度
          updateProcess(res.uploadedSize)
        }))
      }
    }
    if (queue.getLength() == 0) {
      // 所有分片都上传完，但未合并，直接return出去，进行合并操作
      resolve(failArr);
      return;
    }
    queue.start()
  })
}

/**
 * el-upload 自定义上传方法入口
 */
const handleHttpRequest = async function (options) {
  if(this.bucketNameShow==''){
    return this.$message('未选择桶')
  }
  const file = options.file
  let _this = this;
  const selectbucket =this.bucketNameShow
  const task = await getTaskInfo(file,selectbucket)
  console.log(task);

  if (task) {
    const { finished, path, taskRecord } = task
    const { fileIdentifier: identifier } = taskRecord
    if (finished) {
      return path
    } else {
      const errorList = await handleUpload(file, taskRecord, options,selectbucket)
      if (errorList.length > 0) {
        _this.$message.error({
          message: '部分分片上传失败，请尝试重新上传文件'
        })
        return;
      }
      const { code, data, msg } = await merge(identifier,selectbucket)
      if (code === HTTP_SUCCESS_CODE) {
        return path;
      } else {
        _this.$message.error({
          message: msg
        })
      }
    }
  } else {
    _this.$message.error({
      message: '获取上传任务失败'
    })
  }
}

/**
 * 移除文件列表中的文件
 * 如果文件存在上传队列任务对象，则停止该队列的任务
 */
const handleRemoveFile = (uploadFile, uploadFiles) => {
  console.log(uploadFile);
  const queueObject = fileUploadChunkQueue[uploadFile.uid]
  if (queueObject) {
    queueObject.stop()
    fileUploadChunkQueue[uploadFile.uid] = undefined
  }
}


export default {

  data() {
    return {
      /*  headers: {
         Authorization: 'Bearer ' + window.sessionStorage.getItem('token')
       }, */
      /* params: {
        path: 'default'
      }, */
      dialogTableVisible: false,
      dialogFormVisible: false,
      buckets: [],
      bucketNameShow: sessionStorage.getItem("bucketName")||'',
      newbucket: '',
      disabled: false,
      imgFileList: [],
      dialogImageUrl: '',
      showCropper: false,
      cropperImg: '',
      cropperedImg: '',
      editImgs: [],


      isPreview: false,
      dialogVisible: false,
      previewImg: '', // 预览图片地址
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        canMoveBox: true, // 截图框能否拖动
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      // 防止重复提交
      loading: false


    }
  },
  created() {
    this.getBuckets()
  },
  methods: {
    handleHttpRequest,
    handleHttpRequestzip,
    handleRemoveFile,
    getTaskInfo,
    uploadone(e) {
      var that = this
      var files = e
      let file = e.target.files[0]
      let param = new FormData()       // 创建form对象
      param.append('file', file)       // 通过append向form对象添加数据
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      this.axios.post("/uploadone", param, config).then((res) => {
        if (res.succeed) {
          this.$message.success("添加成功")  //需要引入elemrnt
        } else {
          this.$message.warning("添加失败")
        }
      }).catch((err) => {
        this.$message.warning("上传失败，请重新上传!")
      })
    },
    select(bucketName) {
      this.bucketNameShow = bucketName;
      sessionStorage.setItem('bucketName',bucketName);
    },
    async removeBucket(bucketName) {
      console.log(bucketName);
      const { data: res } = await bucketAPI.deleteBucket(bucketName)
      if (res.status !== 200) {
        return this.$message.error("删除桶失败")
      } else this.$message.success('删除成功')
      this.getBuckets()
    },
    rebucketName() {

    },
    async getBuckets() {
      const { data: res } = await bucketAPI.getBuckets()
      if (res.status !== 200) {
        return this.$message.error('获取桶列表失败')
      } else this.$message.success('获取桶列表成功')
      for (const key in res.data) {
        if (res.data[key].name == 'base') {
          res.data.splice(key, 1)

        }
      }
      this.buckets = res.data

    },
    async createBusket(name) {
      if (this.newbucket != '') {
        const { data: res } = await bucketAPI.createBucket(name)
        if (res.status !== 200) {
          return this.$message.error('创建桶失败' + res.msg)
          this.newbucket = ''
        } else this.$message.success('创建桶成功')
        this.newbucket = ''
        this.getBuckets()
      }

    },
    changeUpload(file, fileList) {

      //提前存一下文件名字 一会转文件的时候能用
      this.fileName = file.name
      let url = URL.createObjectURL(file.raw)
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = url
        this.dialogVisible = true
      })
    },

    // 放大/缩小
    changeScaleHandle(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 左旋转
    rotateLeftHandle() {
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    rotateRightHandle() {
      this.$refs.cropper.rotateRight();
    },
    // 下载
    downloadHandle(type) {
      let aLink = document.createElement('a')
      aLink.download = 'author-img'
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          let downImg = window.URL.createObjectURL(data)
          aLink.href = window.URL.createObjectURL(data)
          aLink.click()
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          let downImg = data;
          aLink.href = data;
          aLink.click()
        })
      }
    },
    // 清理图片
    clearImgHandle() {
      this.option.img = ''
    },
    // 截图框移动回调函数
    cropMoving(data) {
      // 截图框的左上角 x，y和右下角坐标x，y
      // let cropAxis = [data.axis.x1, data.axis.y1, data.axis.x2, data.axis.y2]
      // console.log(cropAxis)
    },
    finish() {
      if(this.bucketNameShow==''){
        return this.$message('未选择桶')
       }
      this.$refs.cropper.getCropBlob(async (data) => {

        let file = new window.File([data], this.fileName, { type: 'image/jpg' })
        const identifier = await md5(file)
        console.log(identifier);
        const totalSize = file.size
        const chunkSize = 5 * 1024 * 1024
        const fileName = file.name
        let FormDatas = new FormData()
        FormDatas.append('file', file)
        console.log(FormDatas.get('file'));
        const _up = axios.create()
        _up.request({
          url: '/api/zip/upload/' + this.bucketNameShow,
          method: 'POST',
          data: FormDatas,
          params: {
            identifier: identifier,
            fileName: fileName,
            totalSize: totalSize,
            chunkSize: chunkSize
          }
        })


      })
    },

  }
}

</script>

<style lang="less" scoped>
.uploadcard {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.input {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.title {
  width: 6%;
  text-align: left;
}

.inputlist {
  display: flex;
  flex-direction: column;
}

.fileupload-bottom {
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
}

/deep/ .el-upload {
  width: 100%;
}

/deep/ .el-upload .el-upload-dragger {
  width: 100%;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.cropper {
  text-align: center;
  width: auto;
  height: 400px;
}
</style>
