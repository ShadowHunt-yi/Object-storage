<template>
  <div>
    <el-row :gutter="20" type="flex" justify="center">
      <el-col>
        <el-card shadow="hover">
          <div slot="header">
            文件总数
            <i class="fa fa-calculator"></i>
          </div>
          <div class="page-view-totla">
            {{ consoleData.TotalCount }}
          </div>
        </el-card>
      </el-col>
      <el-col>
        <el-card shadow="hover">
          <div slot="header">
            文件总大小
            <i class="fa fa-file-archive-o"></i>
          </div>
          <div class="page-view-totla">
            {{ consoleData.TotalSize }}
          </div>
        </el-card>
      </el-col>
      <el-col>
        <el-card shadow="hover">
          <div slot="header">桶数目<i class="fa fa-cubes"></i></div>
          <div class="page-view-totla">
            {{ consoleData.diskTotalSize }}
          </div>
        </el-card>
      </el-col>
      <el-col>
        <el-card shadow="hover">
          <div slot="header">
            磁盘剩余空间
            <i class="fa fa-cube"></i>
          </div>
          <div class="page-view-totla">
            {{ consoleData.diskFreeSize }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 第二行 -->
    <el-row :gutter="20" type="flex" justify="center">
      <el-col v-if="authority()">
        <el-card shadow="hover" :body-style="{ height: '170px', padding: '5px 10px 5px 5px' }">
          <div slot="header">快捷操作<i class="el-icon-s-tools" style="float: right"></i></div>
          <a class="shortcut-button" @click="toUpload">
            <span class="shortcut-button-icon"
              ><i class="el-icon-upload" style="font-size: 25px"></i
            ></span>
            <span>文件上传</span>
          </a>
          <a class="shortcut-button" @click="toFileList">
            <span class="shortcut-button-icon"
              ><i class="el-icon-document" style="font-size: 25px"></i
            ></span>
            <span>文件列表</span>
          </a>
          <a class="shortcut-button" @click="toDisplay" v-if="admin">
            <span class="shortcut-button-icon"
              ><i class="el-icon-takeaway-box" style="font-size: 25px"></i
            ></span>
            <span>归档数据</span>
          </a>
          <el-dialog
            title="归档"
            :visible.sync="dialogDisplay"
            width="900px"
            style="margin: 0 auto"
            append-to-body
          >
            <el-table :data="archiving">
              <el-table-column label="文件名" width="500px" style="text-align: center">
                <template slot-scope="scope">
                  <div>
                    <span style="font-size: 16px">{{ scope.row.fileName }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="大小" width="150px" align="center">
                <template slot-scope="scope">
                  <div>
                    <span style="font-size: 16px">
                      {{ formatFileSize(scope.row.totalSize) }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="150px" align="center">
                <template slot-scope="scope">
                  <div>
                    <span style="font-size: 16px">
                      {{ formatTime(scope.row.objectKey) }}
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <a class="shortcut-button" @click="toRestore">
            <span class="shortcut-button-icon"
              ><i class="el-icon-refresh" style="font-size: 25px"></i
            ></span>
            <span>恢复备份</span>
          </a>
        </el-card>
      </el-col>
      <el-col>
        <el-card shadow="hover" :body-style="{ height: '170px', padding: '5px 10px 5px 5px' }">
          <div slot="header">版本信息<i class="el-icon-info" style="float: right"></i></div>
          <table class="console-table">
            <colgroup>
              <col width="200" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td>当前版本</td>
                <td>
                  <span> {{ consoleData.version }} </span>
                  <a
                    href="https://github.com/ShadowHunt-yi/Object-storage"
                    style="color: #009688"
                    target="_blank"
                    >更新日志</a
                  >
                </td>
              </tr>
              <tr>
                <td>发布日期</td>
                <td>{{ consoleData.versionDate }}</td>
              </tr>
              <tr>
                <td>操作系统</td>
                <td>{{ consoleData.osName }}</td>
              </tr>
            </tbody>
          </table>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card>
        <chooseBucket type="primary" @bucket-selected="getTable" />
        <!-- <el-button type="primary" @click="dialogTable = true" style="margin: 10px"
          >选择桶</el-button
        >
        <div>当前桶：{{ bucketName }}</div>
        <el-dialog title="选择桶" :visible.sync="dialogTable" width="500px">
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
                  @click="Select(scope.row.name), (dialogTableVisible = false)"
                  >选择</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-dialog> -->
        <div slot="header" style="fontsize: 18; text-align: center">文件统计(30天)</div>
        <div id="main" style="height: 400px"></div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import { fileAPI, bucketAPI, archiveAPI } from '@/api'
import { formatFileSize } from '@/utils/format'
import chooseBucket from '@/components/chooseBucket.vue'
export default {
  components: {
    chooseBucket
  },
  data() {
    return {
      consoleParam: {
        totalFileCount: '',
        totalFileSize: '',
        diskTotalSize: '',
        diskFreeSize: '',
        osName: '',
        osArch: '',
        versionDate: '',
        version: '',
        dayNumList: [],
        dayFileSizeList: [],
        dayFileCountList: []
      },
      dialogDisplay: false,
      archiving: [],
      dialogTable: false,
      buckets: '',
      bucketName: sessionStorage.getItem('bucketName') || '',
      consoleData: {}
    }
  },
  computed: {
    admin() {
      return sessionStorage.getItem('authority') == '0'
    }
  },
  created() {
    this.getConsoleState()
    this.getTable()
    this.getBuckets()
  },
  mounted() {
    this.initCharts()
  },
  update() {
    this.getTable()
  },
  watch: {
    consoleParam(newVal) {
      this.initCharts()
    }
  },
  methods: {
    async getConsoleState() {
      const { data: res } = await fileAPI.getCountAndSize()
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.consoleData = res.data
    },
    initCharts() {
      var chart = {
        dayNumList: this.consoleParam.dayNumList,
        dayFileCountList: this.consoleParam.dayFileCountList,
        dayFileSizeList: this.consoleParam.dayFileSizeList
      }
      this.$nextTick(() => {
        var myChart = echarts.init(document.getElementById('main'))
        myChart.setOption({
          color: ['#445e75', '#45a7ca', '#98d5ef'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{a}:{c}MB<br>{a1}:{c1}'
          },
          legend: {
            data: ['文件大小', '文件数量'],
            top: '20'
          },
          grid: {
            left: '3%',
            right: '4%',
            top: '15%',
            bottom: '11%',
            containLabel: true
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              data: chart.dayNumList
            }
          ],
          yAxis: [
            {
              type: 'value',
              nameLocation: 'middle',
              nameGap: 30,
              nameTextStyle: {
                fontWeight: 'bold',
                fontSize: '14'
              }
            }
          ],
          series: [
            {
              name: '文件大小',
              type: 'bar',
              data: chart.dayFileSizeList,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: 'top', //在上方显示
                    textStyle: {
                      //数值样式
                      color: 'black',
                      fontSize: 16
                    }
                  }
                }
              }
            },
            {
              name: '文件数量',
              type: 'bar',
              data: chart.dayFileCountList,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: 'top', //在上方显示
                    textStyle: {
                      //数值样式
                      color: 'black',
                      fontSize: 16
                    }
                  }
                }
              }
            }
          ]
        })
        window.addEventListener('resize', () => {
          myChart.resize()
        })
        setTimeout(() => {
          myChart.resize()
        }, 1500)
      })
    },
    toUpload() {
      this.$router.push('upload')
    },
    toFileList() {
      z
      this.$router.push('filelist')
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
    async toDisplay() {
      const { data: res } = await archiveAPI.getArchiving()
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
      this.archiving = res.data
      this.dialogDisplay = true
    },
    formatTime(e) {
      return e.split('/')[0]
    },
    async toRestore() {
      const { data: res } = await archiveAPI.executeSql({
        params: { objectName: 'base/backups/mytable/mytable_test.sql.gz' }
      })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
    },
    authority() {
      return (
        sessionStorage.getItem('authority') == '0' || sessionStorage.getItem('authority') == '1'
      )
    },
    async getTable() {
      const { data: res } = await fileAPI.getTable(this.$store.state.selectedBucket)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.consoleParam = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.fa {
  float: right;
}

.page-view-totla {
  font-size: 36px;
  color: #666;
  line-height: 36px;
  padding: 5px 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}

.console-table {
  border-collapse: collapse;
  border-spacing: 0px;
  width: 100%;
  background-color: #fff;
  color: #666666;
  margin: 5px 0;
}

.console-table tr {
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
}

.console-table th {
  text-align: left;
  font-weight: 400;
}

.console-table td,
.console-table th {
  border-width: 1px;
  border-style: solid;
  border-color: #e6e6e6;
  position: relative;
  padding: 9px 15px;
  min-height: 20px;
  line-height: 20px;
  font-size: 14px;
}

.shortcut-button {
  width: 100px;
  height: 80px;
  display: block;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
  text-align: center;
  background: rgb(248, 248, 248);
}

.shortcut-button-icon {
  display: block;
  height: 55px;
  text-align: center;
  line-height: 55px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
