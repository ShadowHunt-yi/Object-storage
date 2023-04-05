<template>
  <div class="function-wrapper">
    <h2>欢迎使用智域云图-对象存储平台</h2>
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
          desc: ' OSS 对象存储、MinIO 存储',
        },
        {
          icon: require('../assets/home/function/shard.png'),
          title: '分片、断点续传及极速秒传',
          desc: '集成 vue-simple-uploader，实现文件分片上传，提高上传速度；准确识别已上传文件，达到秒传效果，以分片为维度，可实现断点续传',
        },
        {
          icon: require('../assets/home/function/edit.png'),
          title: '图片裁剪上传',
          desc: '提供图片墙上传，以及对图片进行裁剪后上传',
        },
        {
          icon: require('../assets/home/function/type.png'),
          title: '控制台数据展示',
          desc: '展示存储桶的相关数据，并以可视化形式展现',
        },
        {
          icon: require('../assets/home/function/preview.png'),
          title: '权限管理',
          desc: '支持通过权限控制可以为特定用户设置权限',
        },
        {
          icon: require('../assets/home/function/operation.png'),
          title: '基本操作',
          desc: '支持拖拽上传文件，支持文件重命名、压缩上传、下载、删除',
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
  width: 90%;
  margin: 0 auto;
}

.function-list {
  width: 100%;
  padding: 0;
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  list-style: none;
}

.function-item {
  margin: 40px 0;
  width: 27%;
}

.function-live {
  display: block;
  border-radius: 15%;
  background: rgba(rgb(240, 80, 80), rgb(97, 214, 97), rgb(66, 66, 218), 0.7);
/*   border: 1px solid black; */
  width: 100%;
  height: 100%;
  padding: 15px;
  text-align: center;
}
.function-live:hover{
  background: #6adef386;
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

