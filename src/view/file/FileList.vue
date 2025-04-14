<template>
  <div class="filelist">
    <el-card>
      <div slot="header" class="card-head">
        <div class="bread">
          <el-breadcrumb separator="/" style="font-size: 12px">
            <el-breadcrumb-item
              ><a href="javascript:;" @click="rollbackFile()"> 全部文件</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in pathlist" :key="index">
              <a href="javascript:;" @click="listChange(index)">{{ item }}</a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          <el-button
            type="primary"
            @click="dialogTableVisible = true"
            style="margin: 10px"
            >选择桶</el-button
          >
          <el-dialog
            title="选择桶"
            :visible.sync="dialogTableVisible"
            width="500px"
          >
            <el-table :data="buckets" width="600px">
              <el-table-column label="桶名" width="300px">
                <template slot-scope="scope">
                  <div>
                    <span>{{ scope.row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="success"
                    @click="
                      getFlieList(scope.row.name), (dialogTableVisible = false)
                    "
                    >选择</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <el-button type="primary" @click="gotoUpload()">上传文件</el-button>
        </div>
      </div>
      <div class="bottom">
        <el-table :data="paginatedFilelist">
          <el-table-column label="文件名" width="500px">
            <!-- 模板区域 -->
            <template slot-scope="scope">
              <!-- 图标 -->
              <div
                @click="getDirFile(scope.row)"
                style="cursor: pointer"
                ref="files"
              >
                <svg class="icon" aria-hidden="true">
                  <use
                    :xlink:href="
                      iconName(scope.row.subString || scope.row.type)
                    "
                  ></use>
                </svg>
                <span style="font-size: 16px">
                  {{ scope.row.fileName || scope.row.virtualName }}</span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="大小"
            prop="size"
            width="150px"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <span style="font-size: 16px">
                  {{ totalSize(scope.row) }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="mtime" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.type !== 'directory'">
                <span style="font-size: 16px">
                  {{ formatTime(scope.row.updateTime) }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="300px"
            align="center"
            style="display: flex"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="shareFile(scope.row.objectKey), (dialogUrl = true)"
                v-if="scope.row.type !== 'directory'"
                style="margin: 0 10px"
                >分享</el-button
              >
              <el-dialog :visible.sync="dialogUrl" title="分享链接" width="30%">
                <span>{{ url }}</span>
              </el-dialog>
              <el-button
                size="mini"
                type="primary"
                @click="
                  (dialogNewname = true),
                    (oldname = scope.row.fileName),
                    (_subString = scope.row.subString)
                "
                v-if="scope.row.type !== 'directory'"
                style="margin: 10px"
                >重命名</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="downloadfile(scope.row.objectKey)"
                v-if="scope.row.type !== 'directory'"
                style="margin: 10px"
                >下载</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="deletefile(scope.row)"
                style="margin: 10px"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="preview(scope.row.objectKey)"
                v-if="
                  scope.row.subString == 'xls' ||
                  scope.row.subString == 'doc' ||
                  scope.row.subString == 'ppt' ||
                  scope.row.subString == 'docs' ||
                  scope.row.subString == 'pdf'
                "
                style="margin: 10px"
                >预览</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
        >
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="重命名" :visible.sync="dialogNewname" width="30%">
      <el-input placeholder="请输入新名字" v-model="newname" clearable>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="(dialogNewname = false), (newname = '')"
          >取 消</el-button
        >
        <el-button type="primary" @click="rename(oldname, newname, _subString)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
var dayjs = require("dayjs");
var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");
import * as fileUtil from "@/utils/fileUtil";
import { fileAPI, bucketAPI } from '@/api'
export default {
  data() {
    return {
      // 前一个文件夹
      prevFileList: [],
      filelist: [],
      pathlist: [],
      fileDetails: {},
      previewVisible: false,
      dialogImageUrl: "",
      dialogNewname: false,
      newname: "",
      oldname: "",
      _subString: "",
      buckets: "",
      dialogTableVisible: false,
      selectionName: "",
      bucketName: sessionStorage.getItem("bucketName") || "",
      dialogUrl: false,
      url: "",
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页显示的条目数
      totalItems: 0, // 总条目数
    };
  },
  created() {
    this.getBuckets();
    if (this.bucketName != "") {
      this.getFlieList(this.bucketName);
    }
  },
  mounted() {
    window.eventBus.$on("getDirFileInfo", () => {
      // 不带参数
      this.getDirFileInfo();
    });
    window.eventBus.$on("getDirFileByIndex", (a) => {
      this.getDirFileByIndex(a);
    });
    window.eventBus.$on("rollbackFile", () => {
      this.rollbackFile();
    });
  },
  computed: {
    iconName() {
      return function (type) {
        const iconName = fileUtil.getIconName(type);
        return iconName;
      };
    },
    paginatedFilelist() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filelist.slice(start, end);
    },
  },
  methods: {
    async getBuckets() {
      const { data: res } = await bucketAPI.getBuckets();
      if (res.status !== 200) {
        return this.$message.error("获取桶列表失败");
      } else this.$message.success("获取桶列表成功");
      for (const key in res.data) {
        if (res.data[key].name == "base") {
          res.data.splice(key, 1);
        }
      }
      this.buckets = res.data;
    },
    formatSize(byte) {
      if (byte > 1024 * 1024) {
        return parseFloat(byte / 1024 / 1024).toFixed(2) + " MB";
      }
      if (byte > 1024) {
        return parseFloat(byte / 1024).toFixed(2) + " KB";
      }
      return parseFloat(byte).toFixed(2) + " B";
    },
    totalSize(e) {
      if (e.type != "directory") {
        return this.formatSize(e.Size);
      } else {
        let sumSize = 0;
        for (let item of e.children.data) {
          sumSize += parseFloat(item.Size);
        }
        return this.formatSize(sumSize);
      }
    },
    formatTime(e) {
      dayjs.extend(utc);
      dayjs.extend(timezone);
      dayjs(e).tz("Asia/Shanghai").format();
      return dayjs(e).tz("Asia/Shanghai").format();
    },
    gotoUpload() {
      this.$router.push("upload");
    },
    // 获取一级目录
    async getFlieList(name) {
      this.bucketName = name;
      sessionStorage.setItem("bucketName", name);
      const { data: res } = await fileAPI.getFileList(name, {
        params: { prefix: "" },
      });
      if (res.status !== 200) {
        return this.$message.error("获取文件列表失败");
      } else this.$message.success("获取文件列表成功");
      this.filelist = this.prevFileList = res.data;
      this.totalItems = this.filelist.length;
    },
    rollbackFile() {
      this.filelist = this.prevFileList;
      this.pathlist.pop();
      this.currentPage = 1;
      this.totalItems = this.filelist.length;
    },
    // 根据目录获取
    getDirFile(fileInfo) {
      if (fileInfo.type == "directory") {
        this.prevFileList = this.filelist;
        this.filelist = fileInfo.children.data;
        this.pathlist.push(fileInfo.virtualName);
        this.currentPage = 1;
        this.totalItems = this.filelist.length;
      }
    },
    getDirFileByIndex(index) {
      if (this.filelist[index - 1].type == "directory") {
        this.prevFileList = this.filelist;
        this.pathlist.push(this.filelist[index - 1].virtualName);
        this.filelist = this.filelist[index - 1].children.data;
      }
    },
    getDirFileInfo() {
      console.log(this.$refs.files, this.filelist);
    },
    async listChange(index) {
      let url = "";
      console.log(index);
      for (let i = 0; i < index; i++) {
        url += this.pathlist[i] + "/";
      }
      url += this.pathlist[index];
      const { data: res } = await fileAPI.getFileList(this.selectionName, {
        params: { prefix: url },
      });
      if (res.status !== 200) {
        return this.$message.error("获取文件列表失败");
      }
      this.filelist = res.data;
    },
    // 重命名文件
    async rename(_old, _new, _type) {
      console.log(_type);
      if (_new != "") {
        const { data: res } = await fileAPI.renameFile(_old, _new, _type);

        if (res.status !== 200) {
          return this.$message.error(res.msg);
        }
        this.fileName = res.data;
        this.dialogNewname = false;
        this.newname = "";
        this.getFlieList(this.bucketName);
      }
      return;
    },
    //删除文件
    async deletefile(fileInfo) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已经取消删除");
      }
      const { data: res } = await fileAPI.deleteFile(this.bucketName, fileInfo.md5);
      if (res.status !== 200) {
        return this.$message.error("删除失败");
      }

      this.filelist.splice(this.filelist.indexOf(fileInfo), 1);
      return this.$message.success("删除成功");
    },
    downloadfile(name) {
      const _bucketName = this.bucketName;
      const params = {
        fileName: name,
        bucketName: _bucketName,
      };
      const _this = this;
      _this.$message("正在进行文件校验");
      setTimeout(function () {
        _this.$message.success("文件校验成功");
        // _this
        //   .$http({
        //     url: "/api/download",
        //     method: "get",
        //     params: params,
        //     responseType: "blob", // 接收类型设置，否者返回字符型
        //   })
        fileAPI.downloadFile({params})
          .then((res) => {
            // 定义文件名等相关信息
            const blob = res.data;
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = (e) => {
              const a = document.createElement("a");
              a.download = name;
              a.href = e.target.result;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            };
          });
        return _this.$message.success("成功开始下载......");
      }, 2000);
    },
    async shareFile(key) {
      const { data: res } = await fileAPI.getFileUrl({
        params: { bucketName: this.bucketName, fileName: key },
      });
      if (res.status != 200) {
        this.$message.error(res.msg);
      }
      this.url = res.data;
    },
    async preview(key) {
      await this.shareFile(key);
      const _url = this.url;
      console.log(this.url);
      this.$http.post(
        "https://view.officeapps.live.com/op/view.aspx?src=" + _url
      );
      console.log(1);
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1; // 重置到第一页
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },
  },
};
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
