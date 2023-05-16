<template>
  <div class="container">
    <el-container>
      <el-main class="mainArea">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="120px"
            class="form"
        >
          <el-form-item label="账号:" prop="username">
            <el-input  v-model="ruleForm.username" type="text" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input
                v-model="ruleForm.password"
                type="password"
                autocomplete="off"
                show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>


<script setup>
  import {reactive, ref} from "vue"
  import {login} from '../../api/login.js'
  import {setToken} from '../../api/auth.js'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter();
  const ruleFormRef = ref();

  const validateUsername = (rule, value, callback) => {
    if (value.trim() === '') {
      callback(new Error('账号不能为空!'))
    } else {
      callback()
    }
  }
  const validatePassword = (rule, value, callback) => {
    if (value.trim() === '') {
      callback(new Error('密码不能为空!'))
    } else {
      callback()
    }
  }

  const ruleForm = reactive({
    username: 'admin',
    password: 'admin',
  })

  const rules = reactive({
    username: [{ validator: validateUsername, trigger: 'blur', required: true}],
    password: [{ validator: validatePassword, trigger: 'blur', required: true}],
  })

  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        console.log('submit!')
        login({
          username: ruleForm.username,
          password: ruleForm.password
        }).then(res => {
          setToken(res.data.token)
          ElMessage({
            message: '登录成功!',
            type: 'success',
          })
          router.push({name: 'Home'})
        }).catch(err => {
          ElMessage({
            message: err.msg,
            type: 'error'
          })
        })

      } else {
        console.log('error submit!')
        return false
      }
    })
  }

  const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
  }

</script>

<style lang="less" scoped>
  .container {
    height: 90vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    .mainArea {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 auto;
      .form {
        width: 400px;
      }
    }
  }

</style>