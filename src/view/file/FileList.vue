<template>
  <div class="filelist">
    <el-card>
      <div slot="header" class="card-head">
        <div class="bread">
          <el-breadcrumb separator="/" style="font-size:12px;">
            <el-breadcrumb-item><a href="javascript:;" @click="getFileList()"> 全部文件</a> </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in pathlist" :key="index">
              <a href="javascript:;" @click="listChange(index)">{{ item }}</a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-button type="primary" @click="gotoUpload()">上传文件</el-button>
      </div>
      <div class="bottom">

        <el-table :data="filelist">
          <el-table-column label="文件名" width="600px">
            <!-- 模板区域 -->
            <template slot-scope="scope">
              <!-- 图标 -->
              <div @click="getDirFile(scope.row)" style="cursor: pointer;">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="iconName(scope.row.type)"></use>
                </svg>
                <span style=" font-size:16px"> {{ scope.row.virtualName }}{{ scope.row.fileName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="大小" prop="size" width="100px">
            <template slot-scope="scope">
              <div>
                <span style=" font-size:16px"> {{ scope.row.fileSize }} </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="mtime">
            <template slot-scope="scope">
              <div>
                <span style=" font-size:16px"> {{ scope.row.updateTime }} </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope" v-if="scope.row.type !== 'directory'">
              <el-button size="mini" type="primary"
                @click="dialogNewname = true, oldname = scope.row.fileName">重命名</el-button>
              <el-button size="mini" type="success" @click="downloadfile(scope.row.virtualName)">下载</el-button>
              <el-button size="mini" type="danger" @click="deletefile(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="重命名" :visible.sync="dialogNewname" width="30%">
      <el-input placeholder="请输入新名字" v-model="newname" clearable>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogNewname = false, newname = ''">取 消</el-button>
        <el-button type="primary" @click="rename(oldname, newname)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import * as fileUtil from '@/utils/fileUtil'
import { rename } from 'fs'
export default {
  data() {
    return {
      // 前一个文件夹
      prevFileList: [],
      filelist: [],
      pathlist: [],
      fileDetails: {},
      previewVisible: false,
      dialogImageUrl: '',
      dialogNewname: false,
      newname: '',
      oldname: '',

    }
  },
  created() {
    this.getFlieList()
  },
  computed: {
    iconName() {
      return function (type) {
        const iconName = fileUtil.getIconName(type)
        return iconName
      }
    }
  },
  methods: {
    gotoUpload() {
      this.$router.push('upload')
    },
    // 获取一级目录
    async getFlieList() {
      const { data: res } = await this.$http.get('/api/lists1', { params: { prefix: '' } })
      if (res.status !== 200) {
        return this.$message.error('获取文件列表失败')
      } else this.$message.success('获取文件列表成功')
      this.filelist = res.data
      console.log(this.filelist)

    },
    rollbackFile() {
      // if (!this.prevFileList) return;
      this.filelist = this.prevFileList
      this.pathlist.pop();

    },
    // 根据目录获取
    getDirFile(fileInfo) {
      console.log(fileInfo);
      this.prevFileList = this.filelist;
      this.filelist = fileInfo.children.data
      this.pathlist.push(fileInfo.virtualName);
      console.log(this.file);
      /*  if (fileInfo.type !== 'directory') { return }
       let url = ''

       if (fileInfo.virtualName === '') {
         return
       } else {
         url = fileInfo.virtualName
       } */
      /* const { data: res } = await this.$http.get('/api/lists1', { params: { prefix: url } })
      if (res.status !== 200) {
        return this.$message.error('获取文件列表失败')
      }
      this.filelist = res.data
      console.log(this.filelist) */
    },
    async listChange(index) {
      let url = ''
      for (let i = 0; i < index; i++) {
        url += this.pathlist[i] + '/'
      }
      url += this.pathlist[index]
      const { data: res } = await this.$http.get('/api/lists1', { params: { prefix: url } })
      if (res.status !== 200) {
        return this.$message.error('获取文件列表失败')
      }
      this.filelist = res.data
    },
    // 重命名文件
    async rename(_old, _new) {
      if (_new != '') {
        const { data: res } = await this.$http.post('/api/rename', {
          params: {
            bucketName: 'minio-upload',
            oldFileName: _old,
            newFileName: _new
          },
        })

        if (res.status !== 200) {
          return this.$message.error(msg)
        }
        this.fileName = res.data
        this.dialogNewname = false
        this.newname = ''
      } return
    },
    //删除文件
    async deletefile(fileInfo) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`/api/remove/${fileInfo.md5}`)
      if (res.status !== 200) {
        return this.$message.error('删除失败')
      }

      this.filelist.splice(this.filelist.indexOf(fileInfo), 1)
      return this.$message.success('删除成功')
    },
    downloadfile(name) {
      const params = {
        fileName: name
      }
      this.$http({
        url: '/api/download',
        method: 'get',
        params: params,
        responseType: 'blob' // 接收类型设置，否者返回字符型
      }).then(res => { // 定义文件名等相关信息
        const blob = res.data
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = (e) => {
          const a = document.createElement('a')
          a.download = name
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })

      return this.$message.success('成功开始下载......')
    }

  }
}
</script>

<style lang="less" scoped>
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.4em;
  fill: currentColor;
  overflow: hidden;
  margin-right: 5px;
}

.el-button {
  font-size: 16px;
}

.el-table {
  margin-bottom: 10px;
  font-size: 16px;
}

.bread a {
  color: #606266;
}

.bread a:hover {
  color: #000000;
}

.card-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
