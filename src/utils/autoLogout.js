/**
 * 自动登出工具
 * 监听用户活动，在指定时间无操作后自动登出系统
 */
import router from '@/router'
import { Message } from 'element-ui'

class AutoLogout {
  constructor() {
    this.timeout = 10 * 60 * 1000 // 默认10分钟超时
    this.warningTime = 1 * 60 * 1000 // 默认提前1分钟警告
    this.activityTimer = null
    this.warningTimer = null
    this.events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown'
    ]
    this.initialized = false
  }

  /**
   * 初始化自动登出功能
   * @param {Object} options 配置选项
   * @param {number} options.timeout 超时时间（毫秒）
   * @param {number} options.warningTime 警告时间（毫秒）
   * @param {Function} options.onLogout 登出回调函数
   */
  init(options = {}) {
    if (this.initialized) {
      return
    }

    // 更新配置
    if (options.timeout) {
      this.timeout = options.timeout
    }
    if (options.warningTime) {
      this.warningTime = options.warningTime
    }
    this.onLogout = options.onLogout || this.defaultLogout

    // 绑定事件处理程序到当前实例
    this.resetTimer = this.resetTimer.bind(this)
    this.logout = this.logout.bind(this)
    this.showWarning = this.showWarning.bind(this)

    // 添加所有事件监听器
    this.addEventListeners()
    
    // 初始化计时器
    this.resetTimer()
    
    this.initialized = true
    console.log(`自动登出功能已启用，无操作 ${this.timeout/60000} 分钟后自动退出`)
  }

  /**
   * 添加所有事件监听器
   */
  addEventListeners() {
    this.events.forEach(event => {
      window.addEventListener(event, this.resetTimer)
    })
  }

  /**
   * 移除所有事件监听器
   */
  removeEventListeners() {
    this.events.forEach(event => {
      window.removeEventListener(event, this.resetTimer)
    })
  }

  /**
   * 重置超时计时器
   */
  resetTimer() {
    // 清除现有计时器
    this.clearTimers()
    
    // 计算警告时间点
    const warningDelay = this.timeout - this.warningTime
    
    // 设置新的警告和登出计时器
    if (warningDelay > 0) {
      this.warningTimer = setTimeout(this.showWarning, warningDelay)
    }
    this.activityTimer = setTimeout(this.logout, this.timeout)
  }

  /**
   * 清除所有计时器
   */
  clearTimers() {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer)
      this.warningTimer = null
    }
    if (this.activityTimer) {
      clearTimeout(this.activityTimer)
      this.activityTimer = null
    }
  }

  /**
   * 显示即将登出的警告
   */
  showWarning() {
    const minutes = Math.ceil(this.warningTime / 60000)
    Message({
      type: 'warning',
      message: `您已经有一段时间没有操作了，系统将在 ${minutes} 分钟后自动退出。请继续操作以保持登录状态。`,
      duration: 10000
    })
  }

  /**
   * 执行登出操作
   */
  logout() {
    this.clearTimers()
    Message({
      type: 'info',
      message: '由于长时间无操作，您已被自动登出系统',
      duration: 3000
    })
    
    // 执行登出回调
    this.onLogout()
  }

  /**
   * 默认登出行为
   */
  defaultLogout() {
    // 清除会话数据
    window.sessionStorage.clear()
    // 跳转到登录页
    router.push('/login')
  }

  /**
   * 停止自动登出功能
   */
  stop() {
    this.clearTimers()
    this.removeEventListeners()
    this.initialized = false
    console.log('自动登出功能已停用')
  }
}

// 创建单例实例
const autoLogout = new AutoLogout()

export default autoLogout 