<template>
  <div>
    <el-button type="primary" @click="dialogTable = true" style="margin: 10px">选择桶</el-button>
    <div v-if="type === 'primary'">当前桶：{{ bucketName }}</div>
    <el-dialog title="选择桶" :visible.sync="dialogTable" width="500px">
      <el-table :data="buckets" width="600px">
        <el-table-column label="桶名" width="200">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="200" v-if="type === 'edit'">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.creationDate }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件数量" v-if="type === 'edit'">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.fileCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件总大小" width="150" v-if="type === 'edit'">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.size }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope" v-if="buckets !== [{}]">
            <el-button
              size="mini"
              type="primary"
              @click="rebucketName(scope.row.name)"
              v-if="type === 'edit'"
              >重命名</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="selectBucket(scope.row.name), (dialogTableVisible = false)"
              >选择</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="removeBucket(scope.row.name)"
              v-if="type === 'edit'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { bucketAPI } from '@/api'

export default {
  props: {
    type: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {
      dialogTable: false,
      buckets: []
    }
  },
  computed: {
    bucketName() {
      return this.$store.state.selectedBucket
    }
  },
  created() {
    this.getBuckets()
  },
  methods: {
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
    selectBucket(bucketName) {
      this.$store.commit('updateSelectedBucket', bucketName)
      this.$emit('bucket-selected', bucketName) // 触发事件，通知父组件桶已选择
    },
    rebucketName(bucketName) {
      this.$emit('rebucket-name', bucketName) // 触发事件，通知父组件桶已选择
    },
    async removeBucket(bucketName) {
      console.log(bucketName)
      const { data: res } = await bucketAPI.deleteBucket(bucketName)
      if (res.status !== 200) {
        return this.$message.error('删除桶失败')
      } else this.$message.success('删除成功')
      this.getBuckets()
    }
  }
}
</script>

<style scoped>
/* 样式可以根据需要调整 */
</style>
