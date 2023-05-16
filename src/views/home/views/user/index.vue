<template>
  <div class="container">
    <el-header height="50px" class="headerBox">
      <div class="box">
        <div class="item">
          <label for="nickname">用户名:</label>
          <el-input name="nickname" clearable v-model="pageReq.nickname" placeholder="请输入" @keyup.enter="handleSearch('search')" />
        </div>
        <div class="item">
          <label for="email">邮箱:</label>
          <el-input name="email" clearable v-model="pageReq.email" placeholder="请输入"  @keyup.enter="handleSearch('search')" />
        </div>
        <view class="btnBox">
          <el-button type="primary" :icon="Search" @click="handleSearch('search')">搜索</el-button>
          <el-button type="info" :icon="Brush" @click="handleSearch('reset')">重置</el-button>
        </view>
      </div>
    </el-header>
    <el-table :data="tableData" style="width: 100%"  @sort-change="scoresChange"  @filter-change="statusHandler">

      <el-table-column align="center" label="ID" width="150" prop="userId"></el-table-column>
      <el-table-column label="头像" width="100" align="center">
        <template #default="scope">
          <div style="display: flex; justify-content: center;">
            <el-avatar :src="scope.row.avatar"></el-avatar>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="180" prop="nickname"></el-table-column>
      <el-table-column align="center" label="邮箱" width="180" prop="email"></el-table-column>
      <el-table-column align="center" label="当前积分" width="180" prop="scoresCurrent" sortable="custom"></el-table-column>
      <el-table-column align="center" label="总积分" width="180" prop="scoresTotal" sortable="custom"></el-table-column>
      <el-table-column align="center" label="状态" width="180" prop="status" column-key="status" :filters="filterList">
        <template #default="scope">
          <div style="display: block; align-items: center; text-align: center">
            <el-tag style="align-items: center;" :type="scope.row.status === '00A' ? 'success' : 'danger' ">{{ scope.row.status === '00A' ? '有效' : '失效'  }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              icon-color="#626AEF"
              confirm-button-type="text"
              cancel-button-type="primary"
              :title="scope.row.status === '00A' ? '你确定要删除吗?' : '你确定要恢复吗?'"
              @confirm="handlePost(scope.$index, scope.row)">
            <template #reference>
              <el-button v-if="scope.row.status === '00A'" class="logout" type="danger">删除</el-button>
              <el-button v-else class="logout" type="primary">恢复</el-button>
            </template>
          </el-popconfirm>
        </template>

      </el-table-column>

      <template v-slot:empty>
        <div style="height: 250px; display: flex; align-items: center; justify-content: center">暂时没有更多数据~~</div>
      </template>
    </el-table>
    <div class="bottomBox">
      <el-pagination
          v-model:current-page="pageReq.pageNum"
          v-model:page-size="pageReq.pageSize"
          :small="false"
          :disabled="false"
          :background="true"
          layout="prev, pager, next, jumper"
          :total="totalNum"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
  import {getAllUserPage, updateUser} from "../../../../api/user.js"
  import {onMounted, reactive, ref} from "vue"
  import {View} from "@element-plus/icons-vue"
  import {
    Brush,
    Search,
  } from '@element-plus/icons-vue'
  import {updatePost} from "../../../../api/post.js"

  let pageReq = reactive({
    nickname: '',
    email: '',
    status: '',
    scoresTotal: '',
    scoresCurrent: '',
    pageSize: 8,
    pageNum: 1
  })
  let totalNum = ref(0)
  const handleEdit = (index, row) => {
    console.log(index, row)
  }
  const handlePost = (index, row) => {
    console.log(index, row)
    let data = {
      userId: row.userId,
      status: '00A'
    }
    if (row.status === '00A') {
      data.status = '00X'
    } else {
      data.status = '00A'
    }
    updateUser(data).then(res => {
      ElMessage({
        message: res.msg,
        type: 'success',
      })
      getAllUserPage(pageReq).then(res => {
        tableData.value = res.data.records
        totalNum.value = res.data.total
      })
    })
  }
  let tableData = ref([])
  const filterList = ref([
    {text: "有效", value: "00A"},
    {text: "失效", value: "00X"}
  ])

  const handleCurrentChange = (val) => {
    pageReq.pageNum = val
    getAllUserPage(pageReq).then(res => {
      tableData.value = res.data.records
      totalNum.value = res.data.total
    })
  }

  const handleSearch = (type) => {
    if (type === 'reset') {
      pageReq.nickname = ''
      pageReq.email = ''
    }
    getAllUserPage(pageReq).then(res => {
      tableData.value = res.data.records
      totalNum.value = res.data.total
    })
  }

  const scoresChange = ({ column, prop, order }) => {
    console.log(prop, order)
    pageReq.scoresCurrent = ''
    pageReq.scoresTotal = ''
    if (prop === 'scoresCurrent') {
      // 如果是当前积分排序
      if (order === 'ascending') {
        // 如果是ASC
        pageReq.scoresCurrent = "ASC"
      } else if (order === 'descending') {
        pageReq.scoresCurrent = 'DESC'
      }
    } else if (prop === 'scoresTotal'){
      // 如果是当前积分排序
      if (order === 'ascending') {
        // 如果是ASC
        pageReq.scoresTotal = "ASC"
      } else if (order === 'descending') {
        pageReq.scoresTotal = 'DESC'
      }
    }

    getAllUserPage(pageReq).then(res => {
      tableData.value = res.data.records
      totalNum.value = res.data.total
    })
  }

  const statusHandler = (val) => {
    if (val.status.length !== 1) {
      pageReq.status = ''
    } else {
      pageReq.status = val.status[0]
    }
    getAllUserPage(pageReq).then(res => {
      tableData.value = res.data.records
      totalNum.value = res.data.total
    })
  }

  onMounted(() => {
    getAllUserPage(pageReq).then(res => {
      tableData.value = res.data.records
      totalNum.value = res.data.total
    })
  })

</script>

<style lang="less" scoped>
  .container {
    .headerBox {
      .box {
        display: flex;
        justify-content: flex-end;
        .item {
          display: flex;
          align-items: center;
          label {
            width: 90px;
            margin-right: 10px;
            text-align: right;
          }
        }
        .btnBox {
          margin-left: 10px;
        }
      }
    }
    .el-image {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    .bottomBox {
      display: flex;
      flex-direction: row;
      margin-top: 15px;
      margin-right: 50px;
      justify-content: flex-end;
    }
  }
</style>