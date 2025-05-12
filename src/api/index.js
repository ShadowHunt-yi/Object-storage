import request from '@/utils/request'

// 用户相关API
export const userAPI = {
  // 获取用户列表
  getUsers(params) {
    return request.get('/users', { params })
  },
  // 获取单个用户
  getUser(id) {
    return request.get(`/users/${id}`)
  },
  // 获取当前用户信息
  getUserInfo() {
    return request.get('/users/info')
  },
  // 添加用户
  addUser(data) {
    return request.post('/addUser', data)
  },
  // 更新用户信息
  updateUser(id, data) {
    return request.put(`/users/${id}`, data)
  },
  // 更新用户状态
  updateUserState(id, state) {
    return request.put(`/users/${id}/state/${state}`)
  },
  // 更新用户角色
  updateUserRole(id, data) {
    return request.put(`/users/${id}/role`, data)
  },
  // 删除用户
  deleteUser(id) {
    return request.delete(`/users/${id}`)
  },
  // 验证用户密码
  checkPassword(data) {
    return request.post('/users/checkPass', data)
  },
  // 更新用户密码
  updatePassword(data) {
    return request.post('/users/updatePassword', data)
  },
  // 登录
  login(data) {
    return request.post('/login', data)
  }
}

// 角色相关API
export const roleAPI = {
  // 获取角色列表
  getRoles() {
    return request.get('/roles')
  },
  // 获取角色树
  getRolesTree() {
    return request.get('/roles/tree')
  },
  // 获取单个角色
  getRole(id) {
    return request.get(`/roles/${id}`)
  },
  // 添加角色
  addRole(data) {
    return request.post('/roles/addRole', data)
  },
  // 更新角色
  updateRole(id, data) {
    return request.put(`/roles/${id}`, data)
  },
  // 删除角色
  deleteRole(id) {
    return request.delete(`/roles/${id}`)
  },
  // 删除角色权限
  deleteRoleRight(roleId, rightId) {
    return request.delete(`/roles/${roleId}/rights/${rightId}`)
  },
  // 分配角色权限
  assignRights(data) {
    return request.post('/roles/rights', data)
  }
}

// 权限相关API
export const rightAPI = {
  // 获取权限列表
  getRightsList() {
    return request.get('/rights/list')
  },
  // 获取权限树
  getRightsTree() {
    return request.get('/rights/tree')
  }
}

// 文件相关API
export const fileAPI = {
  // 获取文件统计
  getCountAndSize() {
    return request.get('/getCountAndSize')
  },
  // 获取指定桶的表格数据
  getTable(bucketName) {
    return request.get(`/getTable/${bucketName}`)
  },
  // 获取文件列表
  getFileList(bucketName, params) {
    return request.get(`/getLists/${bucketName}`, params)
  },
  // 文件重命名
  renameFile(oldName, newName, type) {
    return request.post(`/rename/${oldName}/${newName}.${type}`)
  },
  // 删除文件
  deleteFile(bucketName, md5) {
    return request.delete(`/remove/${bucketName}/${md5}`)
  },
  // 下载文件
  downloadFile(params) {
    return request.get('/download', {
      params,
      responseType: 'blob'
    })
  },
  // 获取文件URL
  getFileUrl(params) {
    return request.get('/getUrl', { params })
  }
}

// 桶相关API
export const bucketAPI = {
  // 获取桶列表
  getBuckets() {
    return request.get('/buckets')
  },
  // 创建桶
  createBucket(name) {
    return request.post(`/createBuckets/${name}`)
  },
  // 删除桶
  deleteBucket(name) {
    return request.delete(`/deleteBuckets/${name}`)
  },
  // 获取桶信息
  getBucketInfo(name) {
    return request.get(`/getBucketInfo/${name}`)
  }
}

// 归档数据相关API
export const archiveAPI = {
  // 获取归档数据
  getArchiving() {
    return request.get('/v1/minio/tasks/getArchving')
  },
  // 执行SQL语句(恢复备份)
  executeSql(data) {
    return request.post('/sql/execute', data)
  }
}

// 菜单相关API
export const menuAPI = {
  // 获取菜单列表
  getMenuList() {
    return request.get('/menus')
  }
}

// 为了向后兼容，仍提供默认导出
export default {
  userAPI,
  roleAPI,
  rightAPI,
  fileAPI,
  bucketAPI,
  archiveAPI
}
