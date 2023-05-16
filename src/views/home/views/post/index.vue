<template>
  <div class="container">
    <el-header height="50px" class="headerBox">
      <div class="box">
        <div class="item">
          <label for="nickname">用户名:</label>
          <el-input name="nickname" clearable v-model="pageReq.nickname" placeholder="请输入" @keyup.enter="handleSearch('search')" />
        </div>
        <div class="item">
          <label for="email">内容:</label>
          <el-input name="email" clearable v-model="pageReq.content" placeholder="请输入"  @keyup.enter="handleSearch('search')" />
        </div>
        <view class="btnBox">
          <el-button type="primary" :icon="Search" @click="handleSearch('search')">搜索</el-button>
          <el-button type="info" :icon="Brush" @click="handleSearch('reset')">重置</el-button>
        </view>
      </div>
    </el-header>
    <el-table :data="tableData" style="width: 100%"  @sort-change="sortedChange"  @filter-change="filterChangeHandler">

      <el-table-column align="center" label="ID" width="120" prop="userId"></el-table-column>
      <el-table-column label="头像" width="120" align="center">
        <template #default="scope">
          <div style="display: flex; justify-content: center;">
            <el-avatar :src="scope.row.avatar"></el-avatar>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="120" prop="nickname"></el-table-column>
      <el-table-column align="center" label="点赞量" width="120" prop="views" sortable="custom"></el-table-column>
      <el-table-column align="center" label="收集量" width="120" prop="collects" sortable="custom"></el-table-column>
      <el-table-column align="center" label="积分" width="120" prop="scores" sortable="custom"></el-table-column>
      <el-table-column align="center" label="类型" width="120" prop="type" column-key="type" :filters="typeFilterList">
        <template #default="scope">
          <div style="display: block; align-items: center; text-align: center">
            <el-tag style="align-items: center;" :type="scope.row.type === '0' ? 'warning' : 'info' ">{{ scope.row.type === '0' ? '帖子' : '动态'  }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="120" prop="status" column-key="status" :filters="statusFilterList">
        <template #default="scope">
          <div style="display: block; align-items: center; text-align: center">
            <el-tag style="align-items: center;" :type="scope.row.status === '00A' ? 'success' : 'danger' ">{{ scope.row.status === '00A' ? '有效' : '失效'  }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否解决" width="120" prop="status" column-key="resolved" :filters="resolvedFilterList">
        <template #default="scope">
          <div style="display: block; align-items: center; text-align: center">
            <el-tag style="align-items: center;" v-if="scope.row.type !== '1'" :type="scope.row.resolved === '00R' ? 'success' : 'danger' ">{{ scope.row.resolved === '00R' ? '已解决' : '未解决'  }}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button size="default" @click="changeDialog(scope.row)" type="primary">详情</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              icon-color="#626AEF"
              confirm-button-type="text"
              cancel-button-type="primary"
              :title="scope.row.status === '00A' ? '你确定要删除吗?' : '你确定要恢复吗?'"
              @confirm="handleUser(scope.$index, scope.row)">
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

    <!--  详情弹窗 -->
    <el-dialog v-model="dialogFormVisible" class="popDialog">

      <template #header>
        <div class="header" style="display:flex; align-items: center; justify-content: space-between">
          <div class="left" style="display: flex; align-items: center">
            <el-avatar :src="form.avatar"></el-avatar>
            <div class="info" style="margin-left: 8px">
              <div class="nickname">{{form.nickname}}</div>
              <div class="time" style="font-size: 13px; color: rgba(115,114,114,0.54)">发帖时间:{{form.createDate}}</div>
            </div>
          </div>
          <div class="right" style="margin-right: 20px">
            <el-tag class="ml-2" v-if="form.type === '0'" type="warning">求助帖</el-tag>
            <el-tag class="ml-2" v-else type="info">动态</el-tag>
          </div>
        </div>
        <el-divider><span style="color: #ccc">发帖内容</span></el-divider>
      </template>

      <template #default>
        <div class="contentContainer">
          <el-input
              v-model="form.content"
              :autosize="{ minRows: 3, maxRows: 6}"
              type="textarea"
              :disabled="true"
              placeholder="Please input"
          />
        </div>
        <div class="demo-image__lazy" style="display: flex; margin-top: 10px;">
          <el-image style="border-radius: 0; width: 120px; margin: 0 5px" fit="contain" v-for="item in form.images" :key="item.url" :src="item.url" lazy />
        </div>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {getAllPost, updatePost} from "../../../../api/post.js"
import {onMounted, reactive, ref} from "vue"
import {View} from "@element-plus/icons-vue"
import {
  Brush,
  Search,
} from '@element-plus/icons-vue'

let pageReq = reactive({
  content: '',
  type: '',
  status: '',
  collects: '',
  views: '',
  scores: '',
  resolved: '',
  nickname: '',
  pageSize: 8,
  pageNum: 1
})
let totalNum = ref(0)
let form = reactive({})
let dialogFormVisible = ref(false)

const changeDialog = (row) => {
  dialogFormVisible.value = true
  if (!!row.images) {
    row.images = JSON.parse(row.images)
  }
  form = row
  console.log(form)
}
const handleUser = (index, row) => {
  let data = {
    postId: row.postId,
    status: '00A'
  }
  if (row.status === '00A') {
    data.status = '00X'
  } else {
    data.status = '00A'
  }
  updatePost(data).then(res => {
    ElMessage({
      message: res.msg,
      type: 'success',
    })
    getAllPost(pageReq).then(res => {
      tableData.value = res.data.records
      totalNum.value = res.data.total
    })
  })
}
let tableData = ref([])
const statusFilterList = ref([
  {text: "有效", value: "00A"},
  {text: "失效", value: "00X"}
])
const resolvedFilterList = ref([
  {text: "已解决", value: "00R"},
  {text: "未解决", value: "00U"}
])
const typeFilterList = ref([
  {text: "帖子", value: "0"},
  {text: "动态", value: "1"}
])

const handleCurrentChange = (val) => {
  pageReq.pageNum = val
  getAllPost(pageReq).then(res => {
    tableData.value = res.data.records
    totalNum.value = res.data.total
  })
}

const handleSearch = (type) => {
  if (type === 'reset') {
    pageReq.nickname = ''
    pageReq.content = ''
  }
  getAllPost(pageReq).then(res => {
    tableData.value = res.data.records
    totalNum.value = res.data.total
  })
}

const sortedChange = ({ column, prop, order }) => {
  console.log(prop, order)
  pageReq.views = ''
  pageReq.collects = ''
  pageReq.scores = ''
  if (prop === 'views') {
    // 如果是当前积分排序
    if (order === 'ascending') {
      // 如果是ASC
      pageReq.views = "ASC"
    } else if (order === 'descending') {
      pageReq.views = 'DESC'
    }
  } else if (prop === 'collects'){
    // 如果是当前积分排序
    if (order === 'ascending') {
      // 如果是ASC
      pageReq.collects = "ASC"
    } else if (order === 'descending') {
      pageReq.collects = 'DESC'
    }
  } else if (prop === 'scores'){
    // 如果是当前积分排序
    if (order === 'ascending') {
      // 如果是ASC
      pageReq.scores = "ASC"
    } else if (order === 'descending') {
      pageReq.scores = 'DESC'
    }
  }

  getAllPost(pageReq).then(res => {
    tableData.value = res.data.records
    totalNum.value = res.data.total
  })
}

const filterChangeHandler = (val) => {
  console.log(val)
  if (val.resolved && val.resolved.length === 1) {
    pageReq.resolved = val.resolved[0]
  } else if (val.resolved && val.resolved.length === 0) {
    pageReq.resolved = ''
  }
  if (val.status && val.status.length === 1) {
    pageReq.status = val.status[0]
  } else if (val.status && val.status.length === 0) {
    pageReq.status = ''
  }
  if (val.type && val.type.length === 1) {
    pageReq.type = val.type[0]
  } else if (val.type && val.type.length === 0) {
    pageReq.type = ''
  }
  getAllPost(pageReq).then(res => {
    tableData.value = res.data.records
    totalNum.value = res.data.total
  })
}

onMounted(() => {
  getAllPost(pageReq).then(res => {
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
  ::v-deep(.el-dialog) {
    .el-dialog__header {
      padding-bottom: 0;
    }
    .el-dialog__body {
      padding: 0 10px;
    }
  }

}

</style>