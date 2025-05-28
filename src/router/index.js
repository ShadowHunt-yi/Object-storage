import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import resourceLoader from '@/utils/resourceLoader'

Vue.use(VueRouter)

// 配置NProgress选项
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 速度
  showSpinner: false, // 是否显示加载微调器
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.1 // 初始化时的最小百分比
})

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: () => import('../view/Login.vue')
  },
  {
    path: '/home',
    component: () => import('../view/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../view/Welcome.vue'),
        meta: { preload: ['upload', 'console'] }
      },
      {
        path: '/users',
        meta: {
          parentTitle: '用户管理',
          title: '用户列表'
        },
        component: () => import('../view/user/User.vue')
      },
      {
        path: '/console',
        meta: {
          parentTitle: '控制台',
          title: '控制台数据',
          requiresCharts: true
        },
        component: () => import('../view/console/Console.vue')
      },
      {
        path: '/rights',
        meta: {
          parentTitle: '权限管理',
          title: '权限列表'
        },
        component: () => import('../view/power/Rights.vue')
      },
      {
        path: '/roles',
        meta: {
          parentTitle: '权限管理',
          title: '角色列表'
        },
        component: () => import('../view/power/Roles.vue')
      },
      {
        path: '/upload',
        meta: {
          parentTitle: '文件管理',
          title: '文件上传',
          requiresUpload: true
        },
        component: () => import('../view/file/Upload.vue')
      },
      {
        path: '/filelist',
        meta: {
          parentTitle: '文件管理',
          title: '文件列表'
        },
        component: () => import('../view/file/FileList.vue')
      },
      {
        path: '/userinfo',
        meta: {
          parentTitle: '个人中心',
          title: '修改个人信息'
        },
        component: () => import('../view/user/UserInfo.vue')
      }
    ]
  },
  {
    path: '/*',
    name: '404',
    component: () => import('../view/error/404.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫 - 开始进度条
router.beforeEach(async (to, from, next) => {
  // 开始显示进度条
  NProgress.start()

  // 预加载页面所需的异步组件
  if (to.meta.requiresUpload) {
    // 预加载上传相关组件
    Vue.prototype.$loadElementAsyncComponents()
    Vue.prototype.$loadVueCropper()
  }

  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next是一个函数，表示放行 next() next('/login')
  if (to.path === '/login') {
    return next()
  }
  // 获取session
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  } else {
    next()
  }
})

// 全局后置钩子 - 结束进度条和智能预取
router.afterEach((to, from) => {
  // 完成进度条
  NProgress.done()

  // 智能预取下一个可能访问的页面资源
  if (to.meta.preload) {
    setTimeout(() => {
      to.meta.preload.forEach(routeName => {
        resourceLoader.prefetchRouteResources(routeName)
      })
    }, 1000)
  }

  // 根据当前页面预取相关资源
  const routeName = to.path.replace('/', '')
  if (routeName && routeName !== 'welcome') {
    setTimeout(() => {
      resourceLoader.prefetchRouteResources(routeName)
    }, 500)
  }
})

export default router
