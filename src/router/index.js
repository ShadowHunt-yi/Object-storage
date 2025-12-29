import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 懒加载组件，提高初始加载性能
const Login = () => import('../view/Login.vue')
const Home = () => import('../view/Home.vue')
const User = () => import('../view/user/User.vue')
const Console = () => import('../view/console/Console.vue')
const Rights = () => import('../view/power/Rights.vue')
const Roles = () => import('../view/power/Roles.vue')
const Upload = () => import('../view/file/Upload.vue')
const FileList = () => import('../view/file/FileList.vue')
const UserInfo = () => import('../view/user/UserInfo.vue')

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
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../view/Welcome.vue')
      },
      {
        path: '/users',
        meta: {
          parentTitle: '用户管理',
          title: '用户列表'
        },
        component: User
      },
      {
        path: '/console',
        meta: {
          parentTitle: '控制台',
          title: '控制台数据'
        },
        component: Console
      },
      {
        path: '/rights',
        meta: {
          parentTitle: '权限管理',
          title: '权限列表'
        },
        component: Rights
      },
      {
        path: '/roles',
        meta: {
          parentTitle: '权限管理',
          title: '角色列表'
        },
        component: Roles
      },
      {
        path: '/upload',
        meta: {
          parentTitle: '文件管理',
          title: '文件上传'
        },
        component: Upload
      },
      {
        path: '/filelist',
        meta: {
          parentTitle: '文件管理',
          title: '文件列表'
        },
        component: FileList
      },
      {
        path: '/userinfo',
        meta: {
          parentTitle: '个人中心',
          title: '修改个人信息'
        },
        component: UserInfo
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

// // 全局前置守卫 - 开始进度条
// router.beforeEach((to, from, next) => {
//   // 开始显示进度条
//   NProgress.start()

//   // to 将要访问的路径
//   // from 代表从哪个路径跳转而来
//   // next是一个函数，表示放行 next() next('/login')
//   if (to.path === '/login') {
//     return next()
//   }
//   // 获取session
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) {
//     return next('/login')
//   } else {
//     next()
//   }
// })

// 全局后置钩子 - 结束进度条
router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})

export default router
