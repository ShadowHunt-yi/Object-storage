import Vue from 'vue'

// 为了确保样式正常显示，暂时导入完整样式
// babel-plugin-import 在 Vite 开发环境下可能不稳定
import 'element-ui/lib/theme-chalk/index.css'

// 按需导入组件
import {
  Button,
  Input,
  Form,
  FormItem,
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  MessageBox,
  Message,
  Notification,
  Loading,
  Card,
  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItem,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Upload,
  Progress,
  Switch,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  DatePicker,
  TimePicker,
  Cascader,
  Transfer,
  Tree,
  Tabs,
  TabPane,
  Alert,
  Badge,
  Steps,
  Step,
  Tooltip,
  Popover,
  Collapse,
  CollapseItem,
  Tag,
  Icon,
  Dropdown,
  DropdownMenu,
  DropdownItem
} from 'element-ui'

// 注册组件
const components = [
  Button,
  Input,
  Form,
  FormItem,
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Card,
  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItem,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Upload,
  Progress,
  Switch,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  DatePicker,
  TimePicker,
  Cascader,
  Transfer,
  Tree,
  Tabs,
  TabPane,
  Alert,
  Badge,
  Steps,
  Step,
  Tooltip,
  Popover,
  Collapse,
  CollapseItem,
  Tag,
  Icon,
  Dropdown,
  DropdownMenu,
  DropdownItem
]

components.forEach(component => {
  Vue.use(component)
})

// 注册全局方法
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$loading = Loading.service

// 配置全局Element UI选项
Vue.prototype.$ELEMENT = { 
  size: 'medium', 
  zIndex: 3000 
}