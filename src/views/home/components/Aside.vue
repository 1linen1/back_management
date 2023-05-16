<template>
  <el-row class="leftBox">
    <el-col :span="100">
      <h2 class="title">后台管理系统</h2>
      <el-menu
          class="menuArea"
          @open="handleOpen"
          @close="handleClose"
      >
        <el-menu-item index="1" class="itemBox" @click="changeSub('user')">
          <el-icon><UserFilled /></el-icon>
          <span class="menuItem">用户管理</span>
        </el-menu-item>
        <el-menu-item index="2" class="itemBox" @click="changeSub('post')">
          <el-icon><HelpFilled /></el-icon>
          <span class="menuItem">帖子管理</span>
        </el-menu-item>
        <el-menu-item index="3" class="itemBox" @click="changeSub('report')">
          <el-icon><WarnTriangleFilled /></el-icon>
          <span class="menuItem">举报处理</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
  import {
    WarnTriangleFilled,
    UserFilled,
    HelpFilled
  } from '@element-plus/icons-vue'
  import {useRouter} from "vue-router"

  const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
  }
  const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
  }

  const router = useRouter()

  function changeSub(subPath) {
    router.push(subPath)
  }

</script>

<style lang="less" scoped>
  .leftBox {
    margin-left: 20px;
    .title {
      font-size: 25px;
      margin-bottom: 10px;
    }
    .menuArea {
      .itemBox {
        padding-right: 20px;
        .menuItem {
          font-size: 18px;
        }
      }
    }
  }
</style>