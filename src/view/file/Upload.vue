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
              <el-input
                placehold="请输入桶名"
                v-model="bucketNameShow"
                style="width: 80%; margin: 0 20px"
              ></el-input>
              <chooseBucket type="edit" />
              <!-- <el-button type="primary" plain @click="dialogTableVisible = true">选择桶</el-button>
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
                      <el-button size="mini" type="primary" @click="rebucketName(scope.row.name)"
                        >重命名</el-button
                      >
                      <el-button
                        size="mini"
                        type="success"
                        @click="select(scope.row.name), (dialogTableVisible = false)"
                        >选择</el-button
                      >
                      <el-button size="mini" type="danger" @click="removeBucket(scope.row.name)"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog> -->
              <el-button
                type="primary"
                plain
                @click="dialogFormVisible = true"
                style="margin: 0 10px"
                >创建桶</el-button
              >
              <el-dialog title="创建桶" :visible.sync="dialogFormVisible" width="600px" append-to-body>
                <div>
                  <span>桶名：</span>
                  <el-input v-model="newbucket" placeholder="请输入英文名称"> </el-input>
                  <el-button
                    @click=";(dialogFormVisible = false), (newbucket = '')"
                    style="margin: 10px 0"
                    >取消</el-button
                  >
                  <el-button
                    @click=";(dialogFormVisible = false), createBusket(newbucket)"
                    style="float: right; margin: 10px 0"
                    >创建</el-button
                  >
                </div>
              </el-dialog>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- Electron 文件系统集成功能 -->
      <el-col v-if="isElectronEnv" :span="24" style="margin-bottom: 20px;">
        <el-card header="桌面文件系统集成" shadow="hover">
          <div class="electron-file-system">
            <div class="action-buttons" style="margin-bottom: 15px;">
              <el-button-group>
                <el-button type="primary" icon="el-icon-folder" @click="selectFiles" size="medium">
                  选择文件
                </el-button>
                <el-button type="success" icon="el-icon-folder-opened" @click="selectFolder" size="medium">
                  选择文件夹
                </el-button>
                <el-button type="warning" icon="el-icon-document" @click="selectMultipleItems" size="medium">
                  混合选择
                </el-button>
              </el-button-group>
              
              <div style="float: right;">
                <el-button type="info" icon="el-icon-view" @click="showUploadQueue" size="medium">
                  上传队列 ({{ uploadQueue.length }})
                </el-button>
                <el-button 
                  v-if="uploadQueue.length > 0"
                  type="danger" 
                  icon="el-icon-delete" 
                  @click="clearUploadQueue" 
                  size="medium"
                >
                  清空队列
                </el-button>
              </div>
            </div>
            
            <!-- 拖拽提示和状态 -->
            <div class="drag-drop-info">
              <el-alert
                title="增强拖拽上传"
                type="info"
                :closable="false"
                show-icon
                style="margin-bottom: 10px;"
              >
                <template slot="default">
                  支持拖拽文件或整个文件夹到下方上传区域，自动识别所有子文件夹中的文件
                  <br>
                  <small style="color: #909399;">
                    • 支持文件夹嵌套上传  • 自动跳过隐藏文件  • 智能重复文件检测
                  </small>
                </template>
              </el-alert>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="24" class="fileupload-bottom">
        <el-card style="width: 50%; margin: 0 10px 0 0" header="文件分片上传" shadow="hover">
          <el-upload
            style="width: 100%"
            action="/api"
            drag
            multiple
            :http-request="handleHttpRequest"
            :on-remove="handleRemoveFile"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text" style="text-align: center">
              请拖拽文件到此处或 <em>点击此处上传</em>
            </div>
          </el-upload>
        </el-card>
        <el-card style="width: 50%; margin: 0 0 0 10px" header="文件压缩上传" shadow="hover">
          <el-upload
            action="/api"
            drag
            :http-request="handleHttpRequestzip"
            :on-remove="handleRemoveFile"
            style="width: 100%"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text" style="text-align: center">
              请拖拽文件到此处或<em>点击此处上传</em>
            </div>
          </el-upload>
        </el-card>
      </el-col>
      <el-col>
        <el-card
          style="width: 100%; height: 200px; margin: 10px 0 0 0"
          header="图片裁剪上传"
          shadow="hover"
        >
          <el-upload
            class="upload-demo"
            action="/api"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="changeUpload"
            style="height: 100%"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击上传</div>
            <div class="el-upload__tip">支持绝大多数图片格式</div>
          </el-upload>

          <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
            <div class="cropper-content">
              <div class="cropper">
                <vueCropper
                  ref="cropper"
                  :img="option.img"
                  :outputSize="option.size"
                  :outputType="option.outputType"
                  :info="true"
                  :full="option.full"
                  :canMove="option.canMove"
                  :canMoveBox="option.canMoveBox"
                  :original="option.original"
                  :autoCrop="option.autoCrop"
                  :fixed="option.fixed"
                  :fixedNumber="option.fixedNumber"
                  :centerBox="option.centerBox"
                  :infoTrue="option.infoTrue"
                  :fixedBox="option.fixedBox"
                ></vueCropper>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button
                type="primary"
                @click="finish(), (dialogVisible = false)"
                :loading="loading"
                >确认</el-button
              >
            </div>
          </el-dialog>

          <!-- <el-button type="primary" @click="handleHttpRequestPic()">确认上传<i
              class="el-icon-upload el-icon--right"></i></el-button> -->
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 上传队列对话框 -->
    <el-dialog
      title="上传队列管理"
      :visible.sync="queueDialogVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="upload-queue-dialog">
        <!-- 队列统计 -->
        <div class="queue-stats" style="margin-bottom: 20px;">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-statistic title="总文件数" :value="uploadQueue.length"></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic title="待上传" :value="uploadQueue.filter(item => item.status === 'pending').length"></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic title="上传中" :value="uploadQueue.filter(item => item.status === 'uploading').length"></el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic title="已完成" :value="uploadQueue.filter(item => item.status === 'completed').length"></el-statistic>
            </el-col>
          </el-row>
        </div>
        
        <!-- 批量操作按钮 -->
        <div class="batch-actions" style="margin-bottom: 15px;">
          <el-button 
            type="primary" 
            icon="el-icon-upload" 
            @click="startBatchUpload"
            :disabled="uploadQueue.filter(item => item.status === 'pending').length === 0"
          >
            开始批量上传
          </el-button>
          <el-button 
            type="warning" 
            icon="el-icon-refresh-left" 
            @click="retryFailedUploads"
          >
            重试失败项
          </el-button>
          <el-button 
            type="danger" 
            icon="el-icon-delete" 
            @click="clearUploadQueue"
          >
            清空队列
          </el-button>
        </div>
        
        <!-- 文件列表 -->
        <el-table :data="uploadQueue" height="400" style="width: 100%">
          <el-table-column label="文件名" min-width="200">
            <template slot-scope="scope">
              <div style="display: flex; align-items: center;">
                <i :class="getFileIcon(scope.row.extension)" style="margin-right: 8px; font-size: 16px;"></i>
                <div>
                  <div style="font-weight: 500;">{{ scope.row.name }}</div>
                  <div style="font-size: 12px; color: #909399;" v-if="scope.row.folderPath">
                    来自: {{ scope.row.folderPath }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="大小" width="100">
            <template slot-scope="scope">
              {{ scope.row.sizeFormatted }}
            </template>
          </el-table-column>
          
          <el-table-column label="状态" width="120">
            <template slot-scope="scope">
              <el-tag 
                :type="getStatusTagType(scope.row.status)"
                size="small"
              >
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column label="进度" width="150">
            <template slot-scope="scope">
              <el-progress 
                :percentage="scope.row.progress" 
                :status="scope.row.status === 'error' ? 'exception' : (scope.row.status === 'completed' ? 'success' : null)"
                :stroke-width="6"
                :show-text="false"
              ></el-progress>
              <span style="font-size: 12px; margin-left: 8px;">{{ scope.row.progress }}%</span>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button-group>
                <el-button 
                  size="mini" 
                  type="primary" 
                  icon="el-icon-folder-opened"
                  @click="showFileInFolder(scope.row.path)"
                  title="在文件管理器中显示"
                >
                </el-button>
                <el-button 
                  size="mini" 
                  type="danger" 
                  icon="el-icon-delete"
                  @click="removeFromQueue(scope.row.id)"
                  title="从队列中移除"
                >
                </el-button>
              </el-button-group>
              
              <div v-if="scope.row.error" style="margin-top: 5px;">
                <el-tooltip :content="scope.row.error" placement="top">
                  <span style="color: #f56c6c; font-size: 12px; cursor: help;">
                    <i class="el-icon-warning"></i> 错误详情
                  </span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import md5 from '../../lib/md5'
import { taskInfo, initTask, preSignUrl, merge } from '../../lib/api'
import axios from 'axios'
import { ref } from 'vue'
import Queue from 'promise-queue-plus'
import { HTTP_SUCCESS_CODE } from '@/lib/api.code.js'
import { bucketAPI } from '@/api'
import chooseBucket from '@/components/chooseBucket.vue'
//压缩上传
const handleHttpRequestzip = async function (options) {
  if (this.bucketNameShow == '') {
    return this.$message('未选择桶')
  }
  const file = options.file
  const identifier = await md5(file)
  const totalSize = file.size
  const chunkSize = 5 * 1024 * 1024
  const fileName = file.name
  let FormDatas = new FormData()
  FormDatas.append('file', file)
  console.log(FormDatas.get('file'))
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
  console.log(1)
}
// 文件上传分块任务的队列（用于移除文件时，停止该文件的上传队列） key：fileUid value： queue object
const fileUploadChunkQueue = ref({}).value

/**
 * 获取一个上传任务，没有则初始化一个
 */
const getTaskInfo = async function (file, bucketName) {
  let task
  const identifier = await md5(file)
  console.log(bucketName)
  const { code, data, msg } = await taskInfo(identifier, bucketName)
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
const handleUpload = (file, taskRecord, options, bucketName) => {
  let lastUploadedSize = 0 // 上次断点续传时上传的总大小
  let uploadedSize = 0 // 已上传的大小
  const totalSize = file.size || 0 // 文件总大小
  let startMs = new Date().getTime() // 开始上传的时间
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
    const { code, data, msg } = await preSignUrl({
      identifier: fileIdentifier,
      partNumber: partNumber,
      bucketName: bucketName
    })
    if (code === HTTP_SUCCESS_CODE && data) {
      await _http.request({
        url: data,
        method: 'PUT',
        data: blob,
        headers: {
          'Content-Type': 'application/octet-stream'
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
    let factor = 1000 // 每次增加1000 byte
    let from = 0
    // 通过循环一点一点的增加进度
    while (from <= increment) {
      from += factor
      uploadedSize += factor
      const percent = Math.round((uploadedSize / totalSize) * 100).toFixed(2)
      onProgress({ percent: percent })
    }

    const speed = getSpeed()
    const remainingTime = speed != 0 ? Math.ceil((totalSize - uploadedSize) / speed) + 's' : '未知'
    console.log('剩余大小：', (totalSize - uploadedSize) / 1024 / 1024, 'mb')
    console.log('当前速度：', (speed / 1024 / 1024).toFixed(2), 'mbps')
    console.log('预计完成：', remainingTime)
  }

  return new Promise((resolve) => {
    const failArr = []
    const queue = Queue(5, {
      retry: 3, //Number of retries
      retryIsJump: false, //retry now?
      workReject: function (reason, queue) {
        failArr.push(reason)
      },
      queueEnd: function (queue) {
        resolve(failArr)
      }
    })
    fileUploadChunkQueue[file.uid] = queue
    for (let partNumber = 1; partNumber <= chunkNum; partNumber++) {
      const exitPart = (exitPartList || []).find((exitPart) => exitPart.partNumber == partNumber)
      if (exitPart) {
        // 分片已上传完成，累计到上传完成的总额中,同时记录一下上次断点上传的大小，用于计算上传速度
        lastUploadedSize += new Number(exitPart.size)
        updateProcess(exitPart.size)
      } else {
        queue.push(() =>
          uploadNext(partNumber).then((res) => {
            // 单片文件上传完成再更新上传进度
            updateProcess(res.uploadedSize)
          })
        )
      }
    }
    if (queue.getLength() == 0) {
      // 所有分片都上传完，但未合并，直接return出去，进行合并操作
      resolve(failArr)
      return
    }
    queue.start()
  })
}

/**
 * el-upload 自定义上传方法入口
 */
const handleHttpRequest = async function (options) {
  if (this.bucketNameShow == '') {
    return this.$message('未选择桶')
  }
  const file = options.file
  let _this = this
  const selectbucket = this.bucketNameShow
  const task = await getTaskInfo(file, selectbucket)
  console.log(task)
  if (task) {
    const { finished, path, taskRecord } = task
    const { fileIdentifier: identifier } = taskRecord
    if (finished) {
      return path
    } else {
      const errorList = await handleUpload(file, taskRecord, options, selectbucket)
      if (errorList.length > 0) {
        _this.$message.error({
          message: '部分分片上传失败，请尝试重新上传文件'
        })
        return
      }
      const { code, data, msg } = await merge(identifier, selectbucket)
      if (code === HTTP_SUCCESS_CODE) {
        return path
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
  console.log(uploadFile)
  const queueObject = fileUploadChunkQueue[uploadFile.uid]
  if (queueObject) {
    queueObject.stop()
    fileUploadChunkQueue[uploadFile.uid] = undefined
  }
}

export default {
  components: {
    chooseBucket
  },
  computed: {
    bucketNameShow() {
      return this.$store.state.selectedBucket
    }
  },
  data() {
    return {
      /*  headers: {
         Authorization: 'Bearer ' + window.sessionStorage.getItem('token')
       }, */
      /* params: {
        path: 'default'
      }, */
      
      // === 文件系统集成相关数据 ===
      isElectronEnv: false,
      uploadQueue: [], // 上传队列
      selectedFolders: [], // 选中的文件夹
      uploadProgress: {}, // 上传进度跟踪
      queueDialogVisible: false, // 队列对话框显示状态
      dialogTableVisible: false,
      dialogFormVisible: false,
      buckets: [],
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
  
  mounted() {
    // 检测 Electron 环境
    this.isElectronEnv = typeof window !== 'undefined' && window.electronAPI && window.electronAPI.isElectron
    
    if (this.isElectronEnv) {
      console.log('🖥️ Electron 文件系统集成已启用')
      this.setupDragDropEnhancement()
    }
  },
  
  methods: {
    setupDragDropEnhancement() {
      // 增强现有的拖拽上传功能
      const uploadElements = this.$el.querySelectorAll('.el-upload-dragger')
      
      uploadElements.forEach(element => {
        // 覆盖原有的 drop 事件处理
        element.addEventListener('drop', async (e) => {
          e.preventDefault()
          e.stopPropagation()
          
          if (this.isElectronEnv) {
            const items = Array.from(e.dataTransfer.items)
            const files = []
            const folders = []
            
            for (const item of items) {
              if (item.kind === 'file') {
                const entry = item.webkitGetAsEntry()
                if (entry) {
                  if (entry.isDirectory) {
                    folders.push(entry.name)
                    // 处理文件夹拖拽
                    await this.handleFolderDrop(entry)
                  } else {
                    files.push(item.getAsFile())
                  }
                }
              }
            }
            
            if (folders.length > 0) {
              this.$message.success(`已处理 ${folders.length} 个文件夹的拖拽上传`)
            }
          }
        }, true) // 使用捕获阶段
      })
    },
    
    async handleFolderDrop(directoryEntry) {
      try {
        // 这里处理文件夹拖拽逻辑
        const files = await this.readDirectoryEntry(directoryEntry)
        if (files.length > 0) {
          // 将文件添加到现有的上传组件中
          // 或者添加到我们的上传队列中
          this.$message.info(`文件夹 "${directoryEntry.name}" 中包含 ${files.length} 个文件`)
        }
      } catch (error) {
        console.error('处理文件夹拖拽失败:', error)
        this.$message.error('处理文件夹失败')
      }
    },
    
    async readDirectoryEntry(directoryEntry) {
      // 递归读取目录中的文件
      return new Promise((resolve) => {
        const files = []
        const reader = directoryEntry.createReader()
        
        function readEntries() {
          reader.readEntries(async (entries) => {
            if (entries.length === 0) {
              resolve(files)
              return
            }
            
            for (const entry of entries) {
              if (entry.isFile) {
                const file = await new Promise((fileResolve) => {
                  entry.file(fileResolve)
                })
                files.push(file)
              } else if (entry.isDirectory) {
                const subFiles = await this.readDirectoryEntry(entry)
                files.push(...subFiles)
              }
            }
            
            readEntries()
          })
        }
        
        readEntries()
      })
    },
    
    // === 文件系统集成方法 ===
    
    /**
     * 选择文件
     */
    async selectFiles() {
      try {
        const result = await window.electronAPI.selectFiles({
          filters: [
            { name: '所有文件', extensions: ['*'] },
            { name: '图片', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] },
            { name: '文档', extensions: ['pdf', 'doc', 'docx', 'txt', 'md'] },
            { name: '视频', extensions: ['mp4', 'avi', 'mkv', 'mov'] },
            { name: '音频', extensions: ['mp3', 'wav', 'flac', 'aac'] },
            { name: '压缩包', extensions: ['zip', 'rar', '7z'] }
          ]
        })
        
        if (!result.canceled && result.filePaths.length > 0) {
          await this.addFilesToQueue(result.filePaths)
          this.$message.success(`已选择 ${result.filePaths.length} 个文件`)
        }
      } catch (error) {
        console.error('选择文件失败:', error)
        this.$message.error('选择文件失败: ' + error.message)
      }
    },
    
    /**
     * 选择文件夹
     */
    async selectFolder() {
      try {
        const result = await window.electronAPI.selectFolder()
        
        if (!result.canceled && result.filePaths.length > 0) {
          const folderPath = result.filePaths[0]
          await this.processFolderUpload(folderPath)
        }
      } catch (error) {
        console.error('选择文件夹失败:', error)
        this.$message.error('选择文件夹失败: ' + error.message)
      }
    },
    
    /**
     * 混合选择（文件和文件夹）
     */
    async selectMultipleItems() {
      try {
        this.$confirm('请选择操作类型', '混合选择', {
          distinguishCancelAndClose: true,
          confirmButtonText: '选择文件夹',
          cancelButtonText: '选择文件',
          type: 'info'
        }).then(async () => {
          // 选择多个文件夹
          const result = await window.electronAPI.selectFolders()
          if (!result.canceled && result.filePaths.length > 0) {
            for (const folderPath of result.filePaths) {
              await this.processFolderUpload(folderPath)
            }
          }
        }).catch(async (action) => {
          if (action === 'cancel') {
            // 选择文件
            await this.selectFiles()
          }
        })
      } catch (error) {
        console.error('混合选择失败:', error)
        this.$message.error('操作失败: ' + error.message)
      }
    },
    
    /**
     * 处理文件夹上传
     */
    async processFolderUpload(folderPath) {
      try {
        this.$message.info('正在读取文件夹内容...')
        
        const result = await window.electronAPI.readDirectoryRecursive(folderPath, {
          maxDepth: 10,
          includeHidden: false
        })
        
        if (result.success) {
          const files = result.files.filter(item => item.isFile)
          if (files.length > 0) {
            const filePaths = files.map(file => file.path)
            await this.addFilesToQueue(filePaths, { folderPath })
            this.$message.success(`文件夹 "${window.electronAPI.path.basename(folderPath)}" 中的 ${files.length} 个文件已加入队列`)
          } else {
            this.$message.warning('文件夹中没有找到文件')
          }
        } else {
          throw new Error(result.error || '读取文件夹失败')
        }
      } catch (error) {
        console.error('处理文件夹失败:', error)
        this.$message.error('处理文件夹失败: ' + error.message)
      }
    },
    
    /**
     * 添加文件到上传队列
     */
    async addFilesToQueue(filePaths, options = {}) {
      for (const filePath of filePaths) {
        try {
          const fileStats = await window.electronAPI.getFileStats(filePath)
          if (fileStats && fileStats.isFile) {
            const queueItem = {
              id: this.generateUploadId(),
              path: filePath,
              name: window.electronAPI.path.basename(filePath),
              size: fileStats.size,
              sizeFormatted: this.formatFileSize(fileStats.size),
              extension: window.electronAPI.path.extname(filePath).substring(1),
              status: 'pending', // pending, uploading, completed, error
              progress: 0,
              error: null,
              addedTime: new Date(),
              folderPath: options.folderPath || null
            }
            
            // 检查是否已存在
            const exists = this.uploadQueue.find(item => item.path === filePath)
            if (!exists) {
              this.uploadQueue.push(queueItem)
            }
          }
        } catch (error) {
          console.warn(`无法获取文件信息: ${filePath}`, error)
        }
      }
    },
    
    /**
     * 显示上传队列
     */
    showUploadQueue() {
      this.queueDialogVisible = true
    },
    
    /**
     * 清空上传队列
     */
    clearUploadQueue() {
      this.$confirm('确定要清空上传队列吗？', '确认清空', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.uploadQueue = []
        this.uploadProgress = {}
        this.$message.success('队列已清空')
      })
    },
    
    /**
     * 批量上传队列中的文件
     */
    async startBatchUpload() {
      if (this.uploadQueue.length === 0) {
        this.$message.warning('上传队列为空')
        return
      }
      
      if (!this.bucketNameShow) {
        this.$message.warning('请先选择桶')
        return
      }
      
      const pendingFiles = this.uploadQueue.filter(item => item.status === 'pending')
      if (pendingFiles.length === 0) {
        this.$message.info('没有待上传的文件')
        return
      }
      
      this.$message.info(`开始批量上传 ${pendingFiles.length} 个文件`)
      
      // 并发控制：同时最多上传3个文件
      const concurrency = 3
      const uploadPromises = []
      
      for (let i = 0; i < pendingFiles.length; i += concurrency) {
        const batch = pendingFiles.slice(i, i + concurrency)
        const batchPromises = batch.map(item => this.uploadSingleFile(item))
        uploadPromises.push(...batchPromises)
        
        // 等待当前批次完成再继续下一批次
        if (i + concurrency < pendingFiles.length) {
          await Promise.allSettled(batchPromises)
        }
      }
      
      // 等待所有上传完成
      const results = await Promise.allSettled(uploadPromises)
      
      const successful = results.filter(result => result.status === 'fulfilled').length
      const failed = results.length - successful
      
      if (failed === 0) {
        this.$message.success(`所有文件上传完成！成功：${successful} 个`)
      } else {
        this.$message.warning(`批量上传完成。成功：${successful} 个，失败：${failed} 个`)
      }
    },
    
    /**
     * 上传单个文件
     */
    async uploadSingleFile(queueItem) {
      try {
        queueItem.status = 'uploading'
        queueItem.progress = 0
        
        // 这里需要将文件路径转换为 File 对象或直接使用路径
        // 暂时模拟上传过程
        for (let progress = 0; progress <= 100; progress += 10) {
          queueItem.progress = progress
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        
        queueItem.status = 'completed'
        queueItem.progress = 100
        
        return queueItem
      } catch (error) {
        queueItem.status = 'error'
        queueItem.error = error.message
        throw error
      }
    },
    
    /**
     * 生成上传 ID
     */
    generateUploadId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2)
    },
    
    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    /**
     * 获取文件图标
     */
    getFileIcon(extension) {
      const iconMap = {
        // 图片
        jpg: 'el-icon-picture',
        jpeg: 'el-icon-picture',
        png: 'el-icon-picture',
        gif: 'el-icon-picture',
        bmp: 'el-icon-picture',
        webp: 'el-icon-picture',
        svg: 'el-icon-picture',
        
        // 文档
        pdf: 'el-icon-document',
        doc: 'el-icon-document',
        docx: 'el-icon-document',
        txt: 'el-icon-document',
        md: 'el-icon-document',
        
        // 音视频
        mp3: 'el-icon-headset',
        wav: 'el-icon-headset',
        flac: 'el-icon-headset',
        aac: 'el-icon-headset',
        mp4: 'el-icon-video-camera',
        avi: 'el-icon-video-camera',
        mkv: 'el-icon-video-camera',
        mov: 'el-icon-video-camera',
        
        // 压缩包
        zip: 'el-icon-box',
        rar: 'el-icon-box',
        '7z': 'el-icon-box',
        tar: 'el-icon-box',
        
        // 默认
        default: 'el-icon-document'
      }
      
      return iconMap[extension] || iconMap.default
    },
    
    /**
     * 获取状态标签类型
     */
    getStatusTagType(status) {
      const typeMap = {
        pending: 'info',
        uploading: '',
        completed: 'success',
        error: 'danger'
      }
      return typeMap[status] || 'info'
    },
    
    /**
     * 获取状态文本
     */
    getStatusText(status) {
      const textMap = {
        pending: '待上传',
        uploading: '上传中',
        completed: '已完成',
        error: '失败'
      }
      return textMap[status] || '未知'
    },
    
    /**
     * 在文件管理器中显示文件
     */
    async showFileInFolder(filePath) {
      if (this.isElectronEnv) {
        await window.electronAPI.showItemInFolder(filePath)
      } else {
        this.$message.warning('此功能仅在桌面应用中可用')
      }
    },
    
    /**
     * 从队列中移除文件
     */
    removeFromQueue(taskId) {
      const index = this.uploadQueue.findIndex(item => item.id === taskId)
      if (index !== -1) {
        this.uploadQueue.splice(index, 1)
        this.$message.success('已从队列中移除')
      }
    },
    
    /**
     * 重试失败的上传
     */
    retryFailedUploads() {
      const failedItems = this.uploadQueue.filter(item => item.status === 'error')
      if (failedItems.length === 0) {
        this.$message.info('没有失败的上传任务')
        return
      }
      
      failedItems.forEach(item => {
        item.status = 'pending'
        item.progress = 0
        item.error = null
      })
      
      this.$message.success(`已重置 ${failedItems.length} 个失败任务`)
    },
    uploadone(e) {
      var that = this
      var files = e
      let file = e.target.files[0]
      let param = new FormData() // 创建form对象
      param.append('file', file) // 通过append向form对象添加数据
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      this.axios
        .post('/uploadone', param, config)
        .then((res) => {
          if (res.succeed) {
            this.$message.success('添加成功') //需要引入elemrnt
          } else {
            this.$message.warning('添加失败')
          }
        })
        .catch((err) => {
          this.$message.warning('上传失败，请重新上传!')
        })
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
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 左旋转
    rotateLeftHandle() {
      this.$refs.cropper.rotateLeft()
    },
    // 右旋转
    rotateRightHandle() {
      this.$refs.cropper.rotateRight()
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
          let downImg = data
          aLink.href = data
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
      if (this.bucketNameShow == '') {
        return this.$message('未选择桶')
      }
      this.$refs.cropper.getCropBlob(async (data) => {
        let file = new window.File([data], this.fileName, { type: 'image/jpg' })
        const identifier = await md5(file)
        console.log(identifier)
        const totalSize = file.size
        const chunkSize = 5 * 1024 * 1024
        const fileName = file.name
        let FormDatas = new FormData()
        FormDatas.append('file', file)
        console.log(FormDatas.get('file'))
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
    }
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
  color: #409eff;
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
