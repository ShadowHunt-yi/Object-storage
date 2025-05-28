import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui'

// 核心组件 - 首屏必需
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Select)
Vue.use(Option)

// 表格相关组件 - 按需加载
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Tree)

// 全局方法
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

// 异步加载的组件注册函数
const loadAsyncComponents = async () => {
  try {
    const { Upload, Checkbox } = await import('element-ui')
    Vue.use(Upload)
    Vue.use(Checkbox)
    return { Upload, Checkbox }
  } catch (error) {
    console.warn('异步组件加载失败:', error)
    return {}
  }
}

// 将异步加载函数挂载到Vue原型上
Vue.prototype.$loadElementAsyncComponents = loadAsyncComponents

export default {
  loadAsyncComponents
}
