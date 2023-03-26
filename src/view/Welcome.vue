<template>
  <div class="function-wrapper">
    <h2>欢迎使用点击对象存储</h2>
    <div class="function-title">功能介绍</div>
    <ul class="function-list">
      <li class="function-item" v-for="(item, index) in functionList" :key="index">
        <div class="function-live">
          <div class="img-wrapper">
            <img class="img" :src="item.icon" />
          </div>
          <div class="content">
            <h3 class="title">{{ item.title }}</h3>
            <p class="desc">{{ item.desc}}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      functionList: [
        {
          icon: require('../assets/home/function/store.png'),
          title: '多种存储方式',
          desc: ' OSS 对象存储、FastDFS 存储、MinIO 存储、七牛云 KODO 对象存储',
        },
        {
          icon: require('../assets/home/function/shard.png'),
          title: '分片、断点续传及极速秒传',
          desc: '集成 vue-simple-uploader，实现文件分片上传，提高上传速度；准确识别已上传文件，达到秒传效果，以分片为维度，可实现断点续传',
        },
        {
          icon: require('../assets/home/function/edit.png'),
          title: '在线编辑文档',
          desc: '提供 Word, Excel, PowerPoint 文档的在线创建、在线编辑、协同编辑功能',
        },

        {
          icon: require('../assets/home/function/type.png'),
          title: '多种文件分类 & 查看模式',
          desc: '支持以图片、文档、视频、音乐、其他五种分类查看文件；提供了列表模式',
        },
        {
          icon: require('../assets/home/function/preview.png'),
          title: '权限管理',
          desc: '支持通过权限控制可以为特定用户设置权限',
        },
        {
          icon: require('../assets/home/function/operation.png'),
          title: '基本操作',
          desc: '支持拖拽上传文件，支持文件重命名、解压缩、下载、删除',
        },
      ]
    }
  }
}
</script>

<style lang="css" scoped>
.function-wrapper {
  margin-bottom: 10px;

}


.function-title {
  padding: 0 0;
  text-align: center;
  font-size: 28px;
}

.function-list {
  width: 100%;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
}

.function-item {
  margin: 20px;
  width: 26%;

}

.function-live {
  display: block;
  border-radius: 10px;
  background: #ecf5ff;
  width: 100%;
  height: 100%;
  padding: 15px;
  text-align: center;
}
.function-live:hover{
  background: #13cff0f3;
}

.img-wrapper {
  border-radius: 50%;
  background: #fff;
  margin: 0 auto;
  padding:13px 0;
  width: 100px;
  height: 74px;
}

.img {
  width: 70px;
  height: 70px;
}

.content {
  margin-top: 32px;
}

.desc {
  color: #808080;
}

.title {
  margin: 0 0 24px;
  color: #333;
  font-weight: normal;
  font-size: 18px;
}
h2 {
  text-align: center;
  font-size: 40px;
}
</style>

