<template>
  <div class="container">
    <el-header height="50px" class="headerBox">
      <div class="box">
        <div class="item">
          <label for="nickname">处理结果:</label>
          <el-input name="nickname" clearable v-model="pageReq.nickname" placeholder="请输入" @keyup.enter="handleSearch('search')" />
        </div>
        <view class="btnBox">
          <el-button type="primary" :icon="Search" @click="handleSearch('search')">搜索</el-button>
          <el-button type="info" :icon="Brush" @click="handleSearch('reset')">重置</el-button>
        </view>
      </div>
    </el-header>
    <el-table :data="tableData" style="width: 100%"  @sort-change="dateChange"  @filter-change="statusHandler">

      <el-table-column align="center" label="ID" width="100" prop="warningId"></el-table-column>
      <el-table-column label="举报者头像" width="100" align="center">
        <template #default="scope">
          <div style="display: flex; justify-content: center;">
            <el-avatar :src="scope.row.positiveAvatar"></el-avatar>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="举报者名称" width="100" prop="positiveNickname"></el-table-column>
      <el-table-column label="被举报者头像" width="110" align="center">
        <template #default="scope">
          <div style="display: flex; justify-content: center;">
            <el-avatar :src="scope.row.passiveAvatar"></el-avatar>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="被举报者名称" width="110" prop="passiveNickname"></el-table-column>
      <el-table-column align="center" label="举报类型" width="100" prop="type" :filters="typeFilterList">
        <template #default="scope">
          <div style="display: block; align-items: center; text-align: center">
            <el-tag style="align-items: center;" v-if="scope.row.type === '0'" type="primary" effect="plain">评论</el-tag>
            <el-tag style="align-items: center;" v-if="scope.row.type === '1'" type="success" effect="plain">帖子</el-tag>
            <el-tag style="align-items: center;" v-if="scope.row.type === '2'" type="info" effect="plain">用户</el-tag>
            <el-tag style="align-items: center;" v-if="scope.row.type === '3'" type="warning" effect="plain">帖子申诉</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100" prop="status" column-key="status" :filters="statusFilterList">
        <template #default="scope">
          <div style="display: block; align-items: center; text-align: center">
            <el-tag style="align-items: center;" v-if="scope.row.status === '00A'" type="primary">未处理</el-tag>
            <el-tag style="align-items: center;" v-else-if="scope.row.status === '00X'" type="info">已失效</el-tag>
            <el-tag style="align-items: center;" v-else-if="scope.row.status === '00B'" type="success">举报成功</el-tag>
            <el-tag style="align-items: center;" v-else-if="scope.row.status === '00C'" type="warning">举报失败</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="举报时间" sortable="custom" width="170" prop="createDate"></el-table-column>
      <el-table-column align="center" label="处理时间" sortable="custom" width="170" prop="updateDate"></el-table-column>

      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button size="default" v-if="scope.row.status === '00A'" @click="handleWarning(scope.row, false)" type="primary">处理</el-button>
          <el-button size="default" v-else @click="handleWarning(scope.row, true)" type="info">查看</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              icon-color="#626AEF"
              confirm-button-type="text"
              cancel-button-type="primary"
              :title="scope.row.status === '00A' ? '你确定要删除吗?' : '你确定要恢复吗?'"
              @confirm="updateWarningStatus(scope.$index, scope.row)">
            <template #reference>
              <el-button v-if="scope.row.status === '00A'" class="logout" type="danger">删除</el-button>
              <el-button v-else-if="scope.row.status === '00X'" class="logout" type="primary">恢复</el-button>
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

    <!--  帖子弹窗 -->
    <el-dialog v-model="popVisible.popPostVisible" class="popDialog" draggable >
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

        <div class="handleBox" style="margin-top: 10px">
          <el-form ref="ruleFormRef" :model="ruleForm" :disabled="isFormDisable" label-width="120px" class="demo-ruleForm">
            <el-row>
              <el-col span="8">
                <el-form-item label="是否删除帖子:" required>
                  <el-switch
                      v-model="ruleForm.isDeletePost"
                      inline-prompt
                      active-text="是"
                      inactive-text="否"
                  />
                </el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="是否删除用户:" required>
                  <el-switch
                      v-model="ruleForm.isDeleteUser"
                      inline-prompt
                      active-text="是"
                      inactive-text="否"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button :type="isFormDisable ? 'primary' : 'info'" plain @click="popVisible.popPostVisible = false">{{isFormDisable ? "确认" : "稍后处理"}}</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              icon-color="#626AEF"
              confirm-button-type="text"
              cancel-button-type="primary"
              title="您确定吗?"
              @confirm="handlePostWarning">
            <template #reference>
              <span>
                <el-button v-if="!isFormDisable" plain class="logout" type="primary">确认处理</el-button>
              </span>
            </template>
          </el-popconfirm>
        </span>
      </template>
    </el-dialog>

    <!-- 评论弹窗 -->
    <el-dialog v-model="popVisible.popCommentVisible" class="popDialog" draggable >
      <template #header>
        <div class="header" style="display:flex; align-items: center; justify-content: space-between">
          <div class="left" style="display: flex; align-items: center">
            <el-avatar :src="form.avatar"></el-avatar>
            <div class="info" style="margin-left: 8px">
              <div class="nickname">{{form.nickname}}</div>
              <div class="time" style="font-size: 13px; color: rgba(115,114,114,0.54)">评论时间:{{form.createDate}}</div>
            </div>
          </div>
          <div class="right" style="margin-right: 20px">
            <el-tag class="ml-2" type="info">评论</el-tag>
          </div>
        </div>
        <el-divider><span style="color: #ccc">评论内容</span></el-divider>
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

        <div class="handleBox" style="margin-top: 10px">
          <el-form ref="ruleFormRef" :model="ruleForm" :disabled="isFormDisable" label-width="120px" class="demo-ruleForm">
            <el-row>
              <el-col span="8">
                <el-form-item label="是否删除评论:" required>
                  <el-switch
                      v-model="ruleForm.isDeleteComment"
                      inline-prompt
                      active-text="是"
                      inactive-text="否"
                  />
                </el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="是否删除用户:" required>
                  <el-switch
                      v-model="ruleForm.isDeleteUser"
                      inline-prompt
                      active-text="是"
                      inactive-text="否"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button :type="isFormDisable ? 'primary' : 'info'" plain @click="popVisible.popCommentVisible = false">{{isFormDisable ? "确认" : "稍后处理"}}</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              icon-color="#626AEF"
              confirm-button-type="text"
              cancel-button-type="primary"
              title="您确定吗?"
              @confirm="handlePostWarning">
            <template #reference>
              <el-button v-if="!isFormDisable" plain class="logout" type="primary">确认处理</el-button>
            </template>
          </el-popconfirm>
        </span>
      </template>
    </el-dialog>

    <!-- 申诉弹窗 -->
    <el-dialog v-model="popVisible.popCommentVisible" class="popDialog" draggable >
      <template #header>
        <div class="header" style="display:flex; align-items: center; justify-content: space-between">
          <div class="left" style="display: flex; align-items: center">
            <el-avatar :src="form.avatar"></el-avatar>
            <div class="info" style="margin-left: 8px">
              <div class="nickname">{{form.nickname}}</div>
              <div class="time" style="font-size: 13px; color: rgba(115,114,114,0.54)">评论时间:{{form.createDate}}</div>
            </div>
          </div>
          <div class="right" style="margin-right: 20px">
            <el-tag class="ml-2" type="info">评论</el-tag>
          </div>
        </div>
        <el-divider><span style="color: #ccc">评论内容</span></el-divider>
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

        <div class="handleBox" style="margin-top: 10px">
          <el-form ref="ruleFormRef" :model="ruleForm" :disabled="isFormDisable" label-width="120px" class="demo-ruleForm">
            <el-row>
              <el-col span="8">
                <el-form-item label="是否删除评论:" required>
                  <el-switch
                      v-model="ruleForm.isDeleteComment"
                      inline-prompt
                      active-text="是"
                      inactive-text="否"
                  />
                </el-form-item>
              </el-col>
              <el-col span="8">
                <el-form-item label="是否删除用户:" required>
                  <el-switch
                      v-model="ruleForm.isDeleteUser"
                      inline-prompt
                      active-text="是"
                      inactive-text="否"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>

      <template #footer>
        <span class="dialog-footer">
          <el-button :type="isFormDisable ? 'primary' : 'info'" plain @click="popVisible.popCommentVisible = false">{{isFormDisable ? "确认" : "稍后处理"}}</el-button>
          <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              icon-color="#626AEF"
              confirm-button-type="text"
              cancel-button-type="primary"
              title="您确定吗?"
              @confirm="handlePostWarning">
            <template #reference>
              <el-button v-if="!isFormDisable" plain class="logout" type="primary">确认处理</el-button>
            </template>
          </el-popconfirm>
        </span>
      </template>
    </el-dialog>

  </div>

</template>

<script setup>
  import {qryAllWarning, handleWarningMethod, updateWarning} from "../../../../api/warning.js"
  import {onMounted, reactive, ref} from "vue"
  import {
    Brush,
    Search,
    View,
  } from '@element-plus/icons-vue'
  import {getPostById, updatePost} from "../../../../api/post.js"
  import {getCommentById} from "../../../../api/comment.js"

  let pageReq = reactive({
    sortedField: '',
    sortedType: '',
    result: '',
    type: '',
    status: '',
    pageSize: 8,
    pageNum: 1
  })
  let totalNum = ref(0)
  // 弹窗显隐控制
  let popVisible = reactive({
    popPostVisible: false,
    popCommentVisible: false,
    popAppealVisible: false
  })
  let form = reactive({})
  let isFormDisable = ref(true)
  // 0评论，1帖子，2用户，3帖子申诉
  const handleWarning = (row, flag) => {
    console.log("数据:", row)
    isFormDisable.value = flag
    ruleForm.isDeleteUser = false
    ruleForm.isDeletePost = false
    ruleForm.isDeleteComment = false
    if (row.type === '0') {
      getCommentById(row.commentPostId).then(res => {
        form = res.data
        form.warningId = row.warningId
        form.avatar = row.passiveAvatar
        form.nickname = row.passiveNickname
        if (row.result) {
          if (row.result.indexOf('0') !== -1) {
            ruleForm.isDeleteComment = true
          }
          if (row.result.indexOf('2') !== -1) {
            ruleForm.isDeleteUser = true
          }
        }
        popVisible.popCommentVisible = true
      })
    } else if (row.type === '1') {
      getPostById(row.commentPostId).then(res => {
        form = res.data
        form.warningId = row.warningId
        form.avatar = row.passiveAvatar
        form.nickname = row.passiveNickname
        if (!!form.images) {
          form.images = JSON.parse(form.images)
        }
        if (row.result) {
          if (row.result.indexOf('1') !== -1) {
            ruleForm.isDeletePost = true
          }
          if (row.result.indexOf('2') !== -1) {
            ruleForm.isDeleteUser = true
          }
        }
        popVisible.popPostVisible = true
      })
    } else if (row.type === '3') {

    }
  }

  let ruleFormRef = ref()
  let ruleForm = reactive({
    isDeletePost: false,
    isDeleteUser: false,
    isDeleteComment: false
  })

  const handlePostWarning = () => {
    let data = {...ruleForm}
    if (ruleForm.isDeletePost === true) {
      data.postId = form.postId
    }
    if (ruleForm.isDeleteUser === true) {
      data.userId = form.userId
    }
    if (ruleForm.isDeleteComment === true) {
      data.commentId = form.commentId
    }
    data.warningId = form.warningId
    handleWarningMethod(data).then(res => {
      ElMessage({
        message: res.msg,
        type: 'success',
      })
      popVisible.popPostVisible = false
      popVisible.popCommentVisible = false
      popVisible.popAppealVisible = false
      qryAllWarning(pageReq).then(res => {
        tableData.value = res.data.records
        totalNum.value = res.data.total
      })
    })
  }

  const updateWarningStatus = (index, row) => {
    console.log(index, row)
    let data = {
      warningId: row.warningId,
      status: '00A'
    }
    if (row.status === '00A') {
      data.status = '00X'
    } else {
      data.status = '00A'
    }
    updateWarning(data).then(res => {
      ElMessage({
        message: res.msg,
        type: 'success',
      })
      qryAllWarning(pageReq).then(res => {
        tableData.value = res.data.records
        totalNum.value = res.data.total
      })
    })
  }
  let tableData = ref([])
  const statusFilterList = ref([
    {text: "未处理", value: "00A"},
    {text: "已失效", value: "00X"},
    {text: "举报成功", value: "00B"},
    {text: "举报失败", value: "00C"},
  ])
  const typeFilterList = ref([
    {text: "评论", value: "0"},
    {text: "帖子", value: "1"},
    {text: "用户", value: "2"},
    {text: "帖子申诉", value: "3"},
  ])

  const handleCurrentChange = (val) => {
    pageReq.pageNum = val
    qryAllWarning(pageReq).then(res => {
      tableData.value = res.data.records
      totalNum.value = res.data.total
    })
  }

  const handleSearch = (type) => {
    if (type === 'reset') {
      pageReq.result = ''
    }
    qryAllWarning(pageReq).then(res => {
      tableData.value = res.data.records
      totalNum.value = res.data.total
    })
  }

  const dateChange = ({ column, prop, order }) => {
    console.log(prop, order)
    pageReq.sortedField = ''
    pageReq.sortedType = ''
    if (prop === 'createDate') {
      pageReq.sortedField = 'createDate'
      if (order === 'ascending') {
        pageReq.sortedType = "ASC"
      } else if (order === 'descending') {
        pageReq.sortedType = 'DESC'
      }
    } else if (prop === 'updateDate'){
      pageReq.sortedField = 'updateDate'
      if (order === 'ascending') {
        pageReq.sortedType = "ASC"
      } else if (order === 'descending') {
        pageReq.sortedType = 'DESC'
      }
    }

    pageReq.pageNum = 1
    qryAllWarning(pageReq).then(res => {
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
    qryAllWarning(pageReq).then(res => {
      tableData.value = res.data.records
      totalNum.value = res.data.total
    })
  }

  onMounted(() => {
    qryAllWarning(pageReq).then(res => {
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
          width: 100px;
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
::v-deep(.el-dialog) {
  .el-dialog__header {
    padding-bottom: 0;
  }
  .el-dialog__body {
    padding: 0 10px;
  }
}
</style>