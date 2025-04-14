<template>
  <div>
    <el-card class="box-card" >
      <div slot="header" align="center">
        {{ userinfo.username }}
      </div>
      <div class="card-body"  align="center">
        <div>邮箱：
          <el-tag>{{userinfo.email}}</el-tag>
        </div>
        <div>手机号：
          <el-tag>{{userinfo.mobile}}</el-tag>
        </div>
        <div style="display: flex;justify-content: space-around;margin-top: 10px">
          <el-button type="primary" @click="showEditDialog()">修改信息</el-button>
          <el-button type="danger" @click="showEditPassword()">修改密码</el-button>
        </div>
      </div>
    </el-card>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose()">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
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
    <el-dialog :visible.sync="editPasswordVisible" width="50%" @close="editPasswordClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef">
        <el-form-item prop="old">
          <el-input placeholder="请输入旧密码" type="password" v-model="ruleForm.old" show-password></el-input>
        </el-form-item>
        <el-form-item prop="new">
          <el-input placeholder="请输入新密码" type="password" v-model="ruleForm.new" show-password></el-input>
        </el-form-item>
        <el-form-item prop="checkpassword">
          <el-input placeholder="新确认密码" type="password" v-model="ruleForm.checkpassword" show-password></el-input>
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
  data () {
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
  created () {
    this.initUserInfo()
  },
  methods: {
    async initUserInfo () {
      const { data: res } = await userAPI.getUserInfo()
      if (res.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userinfo = res.data
    },
    showEditDialog () {
      this.editForm = this.userinfo
      this.editDialogVisible = true
    },
    async showEditPassword () {
      this.editPasswordVisible = true
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editPasswordClose () {
      this.$refs.ruleFormRef.resetFields()
    },
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await userAPI.updateUser(this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.status !== 200) {
          return this.$message.error('修改信息失败！')
        }
        this.editDialogVisible = false
        this.initUserInfo()
        this.$message.success('修改信息成功！')
      })
    },
    editPassword () {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await userAPI.checkPassword(qs.stringify({ password: this.ruleForm.old }))
        if (res.status !== 200) {
          return this.$message.error('原密码错误')
        }
        const { data: response } = await userAPI.updatePassword(qs.stringify({ password: this.ruleForm.checkpassword }))
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
  width: 1000px;
  margin: 0 auto;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: space-between;
  div {
    margin-bottom: 5px;
  }
}
.el-form-item__content {
  display: flex;
  align-items: center;
  // 垂直居中
}
</style>
