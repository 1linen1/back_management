<template>
  <div class="container">
    <el-container class="bigContainer">
      <el-header class="headerBox">
        <el-popconfirm
            confirm-button-text="是"
            cancel-button-text="否"
            icon-color="#626AEF"
            confirm-button-type="text"
            cancel-button-type="primary"
            title="你确定要退出吗?"
            @confirm="confirmEvent">
          <template #reference>
            <el-button class="logout" type="primary">退出</el-button>
          </template>
        </el-popconfirm>
      </el-header>
      <el-container>
        <Aside></Aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
  import Aside from "./components/Aside.vue"
  import {removeToken} from "../../api/auth.js"
  import {useRouter} from "vue-router"

  const router = useRouter()

  function confirmEvent() {
    removeToken();
    router.push({
      name: 'Login'
    })
  }
</script>

<style lang="less" scoped>
  .container {
    width: 100%;
    height: 80vh;
    .bigContainer {
      min-height: 60vh;
    }
    .headerBox {
      display: flex;
      justify-content: flex-end;
      .logout {
        margin: 10px 10px 0 0;
      }
    }
    .mainContainer {
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;

    }

  }
</style>