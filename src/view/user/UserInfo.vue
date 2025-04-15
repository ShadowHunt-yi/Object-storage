<template>
  <div>
    <el-card class="box-card">
      <div slot="header" align="center" class="card-header">
        <i class="el-icon-user"></i>
        <span>{{ userinfo.username }}</span>
      </div>
      <div class="card-body" align="center">
        <div class="info-item">
          <i class="el-icon-message"></i>
          <span>邮箱：</span>
          <el-tag type="info">{{ userinfo.email }}</el-tag>
        </div>
        <div class="info-item">
          <i class="el-icon-mobile-phone"></i>
          <span>手机号：</span>
          <el-tag type="info">{{ userinfo.mobile }}</el-tag>
        </div>
        <div class="button-group">
          <el-button type="primary" icon="el-icon-edit" @click="showEditDialog()"
            >修改信息</el-button
          >
          <el-button type="danger" icon="el-icon-lock" @click="showEditPassword()"
            >修改密码</el-button
          >
        </div>
      </div>
    </el-card>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClose()"
      :modal="false"
      :append-to-body="false"
      custom-class="custom-dialog"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      :visible.sync="editPasswordVisible"
      width="30%"
      @close="editPasswordClose"
      :modal="false"
      :append-to-body="false"
      custom-class="custom-dialog"
    >
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef" label-width="80px">
        <el-form-item label="旧密码" prop="old">
          <el-input
            placeholder="请输入旧密码"
            type="password"
            v-model="ruleForm.old"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new">
          <el-input
            placeholder="请输入新密码"
            type="password"
            v-model="ruleForm.new"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpassword">
          <el-input
            placeholder="请再次输入新密码"
            type="password"
            v-model="ruleForm.checkpassword"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPassword()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import { userAPI } from '@/api'
import { validateEmail, validateMobile, validatePasswordConfirm } from '@/utils/validate'
export default {
  data() {
    return {
      userinfo: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
      editForm: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      ruleForm: {
        old: '',
        new: '',
        checkpassword: ''
      },
      editPasswordVisible: false,
      rules: {
        old: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        new: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        checkpassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePasswordConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // this.initUserInfo()
    this.userinfo = {
      id: 1,
      username: 'admin',
      mobile: '18888888888',
      email: 'admin@163.com'
    }
  },
  methods: {
    async initUserInfo() {
      const { data: res } = await userAPI.getUserInfo()
      if (res.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userinfo = res.data
    },
    showEditDialog() {
      this.editForm = this.userinfo
      this.editDialogVisible = true
    },
    async showEditPassword() {
      this.editPasswordVisible = true
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    editPasswordClose() {
      this.$refs.ruleFormRef.resetFields()
    },
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await userAPI.updateUser(this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.status !== 200) {
          return this.$message.error('修改信息失败！')
        }
        this.editDialogVisible = false
        this.initUserInfo()
        this.$message.success('修改信息成功！')
      })
    },
    editPassword() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await userAPI.checkPassword(
          qs.stringify({ password: this.ruleForm.old })
        )
        if (res.status !== 200) {
          return this.$message.error('原密码错误')
        }
        const { data: response } = await userAPI.updatePassword(
          qs.stringify({ password: this.ruleForm.checkpassword })
        )
        if (response.code !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('密码更新成功')
        return this.$router.push('login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  font-size: 20px;
  font-weight: bold;
  i {
    margin-right: 10px;
  }
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  i {
    margin-right: 10px;
    font-size: 18px;
  }
  span {
    margin-right: 10px;
    font-size: 16px;
  }
}

.button-group {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
  .el-button {
    width: 45%;
  }
}
</style>
