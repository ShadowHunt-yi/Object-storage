/**
 * 邮箱验证规则
 */
export function validateEmail(rule, value, callback) {
  const regEmail = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
  if (regEmail.test(value)) {
    return callback()
  }
  callback(new Error('请输入合法的邮箱'))
}

/**
 * 手机号验证规则
 */
export function validateMobile(rule, value, callback) {
  const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
  if (regMobile.test(value)) {
    return callback()
  }
  callback(new Error('请输入合法的手机号'))
}

/**
 * 密码确认验证（比较两个密码是否一致）
 */
export function validatePasswordConfirm(password) {
  return (rule, value, callback) => {
    if (value === password) {
      return callback()
    }
    callback(new Error('两次输入密码不一致!'))
  }
}

/**
 * 常用的表单规则集合
 */
export const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ]
}

/**
 * 扩展表单规则集合，包含登录和注册所需规则
 */
export const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 13, message: '长度在 2 到 13 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

export const registerRules = {
  newUsername: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newEmail: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址格式', trigger: 'blur,change' }
  ],
  newMobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式', trigger: 'blur' }
  ]
} 