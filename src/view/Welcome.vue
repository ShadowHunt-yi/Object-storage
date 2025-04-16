<template>
  <div class="welcome-container">
    <div class="welcome-header">
      <h1>欢迎使用智域云图-对象存储平台</h1>
      <div class="welcome-subtitle">安全、高效、易用的云端存储解决方案</div>
    </div>

    <div class="feature-section">
      <div class="section-title">功能介绍</div>
      <div class="feature-grid">
        <div
          v-for="(item, index) in functionList"
          :key="index"
          class="feature-card"
          :class="{ 'feature-card-highlight': index === hoveredCard }"
          @mouseenter="hoveredCard = index"
          @mouseleave="hoveredCard = null"
        >
          <div class="feature-icon-container">
            <img class="feature-icon" :src="item.icon" :alt="item.title" />
          </div>
          <div class="feature-content">
            <h3 class="feature-title">{{ item.title }}</h3>
            <p class="feature-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="welcome-footer">
      <p>立即开始使用，体验云存储的便捷与高效</p>
      <el-button type="primary" @click="goToConsole" size="medium" round>
        进入控制台 <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import storePicture from '@/assets/home/function/store.png'
import shardPicture from '@/assets/home/function/shard.png'
import editPicture from '@/assets/home/function/edit.png'
import typePicture from '@/assets/home/function/type.png'
import operationPicture from '@/assets/home/function/operation.png'
import previewPicture from '@/assets/home/function/preview.png'
export default {
  data() {
    return {
      hoveredCard: null,
      functionList: [
        {
          icon: storePicture,
          title: '多种存储方式',
          desc: 'OSS 对象存储、MinIO 存储，满足不同场景需求'
        },
        {
          icon: shardPicture,
          title: '分片、断点续传及极速秒传',
          desc: '实现文件分片上传；准确识别已上传文件，达到秒传效果，以分片为维度，可实现断点续传'
        },
        {
          icon: editPicture,
          title: '图片裁剪上传',
          desc: '提供图片裁剪后上传,可即时预览裁剪后的图片，满足多样化需求'
        },
        {
          icon: typePicture,
          title: '控制台数据展示',
          desc: '展示存储桶的相关数据，并以图表可视化形式展现最近上传信息，直观了解使用情况'
        },
        {
          icon: previewPicture,
          title: '权限管理',
          desc: '支持通过权限控制个性化设置角色，再为相应用户设置特定角色，保障数据安全'
        },
        {
          icon: operationPicture,
          title: '基本操作',
          desc: '支持拖拽上传文件，支持文件重命名、压缩上传、下载、删除、分享，操作简单高效'
        }
      ]
    }
  },
  methods: {
    goToConsole() {
      this.$router.push('/console')
    }
  }
}
</script>

<style lang="css" scoped>
.welcome-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: rgba(255, 255, 255, 0.35);
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.welcome-header {
  text-align: center;
  margin-bottom: 50px;
}

.welcome-header h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #3494e6, #1d7ce0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
}

.feature-section {
  margin-bottom: 60px;
}

.section-title {
  text-align: center;
  font-size: 28px;
  font-weight: 500;
  color: #333;
  margin-bottom: 40px;
  position: relative;
}

.section-title:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3494e6, #1d7ce0);
  border-radius: 2px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 80%;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(230, 230, 230, 0.8);
}

.feature-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: linear-gradient(135deg, rgba(52, 148, 230, 0.1), rgba(29, 124, 224, 0.1));
  transition: height 0.3s ease;
  z-index: 0;
}

.feature-card-highlight {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.feature-card-highlight:before {
  height: 100%;
}

.feature-icon-container {
  width: 80px;
  height: 80px;
  background: rgba(52, 148, 230, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.feature-card:hover .feature-icon-container {
  transform: scale(1.1);
  background: rgba(52, 148, 230, 0.2);
}

.feature-icon {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

.feature-content {
  flex-grow: 1;
  position: relative;
  z-index: 1;
}

.feature-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 15px;
}

.feature-desc {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

.welcome-footer {
  text-align: center;
  margin-top: 30px;
}

.welcome-footer p {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .welcome-header h1 {
    font-size: 28px;
  }

  .welcome-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }
}
</style>

<style>
/* 修改背景伪元素的z-index，使其不遮挡内容 */
main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  backdrop-filter: blur(5px);
  z-index: -1; /* 添加负z-index，确保不遮挡其他元素 */
}

/* 确保main本身有相对定位，以便伪元素能够正确定位 */
main {
  background-image: url('.././assets/image/display.webp');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  padding: 40px 0;
  z-index: 0; /* 设置z-index上下文 */
}
</style>
