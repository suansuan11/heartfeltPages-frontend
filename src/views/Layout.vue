<script setup>

import {
  CaretBottom,
  Crop,
  EditPen,
  Management,
  Promotion,
  SwitchButton,
  User,
  UserFilled
} from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import avatar from '@/assets/default.png'
import {userInfoService} from "@/api/user";
import {useUserInfoStore} from "@/stores/userInfo";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import {useTokenStore} from "@/stores/token";

const userInfoStore = useUserInfoStore();
const getUserInfo = async () => {
  const result = await userInfoService();
  userInfoStore.setUserInfo(result.data)
}
getUserInfo()

const router = useRouter();
const tokenStore = useTokenStore();
// 用户头像地址
const imgUrl = ref(userInfoStore.userInfo.userPic)

// 拼接完整的 URL
const fullAvatarUrl = computed(() => {
  return imgUrl.value.startsWith('http')
    ? imgUrl.value
    : `http://localhost:8080${imgUrl.value}`
})

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm(
        '你确认要退出吗？',
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
    ).then(
        async () => {
          // clear data in pinia
          userInfoStore.removeUserInfo()
          tokenStore.removeToken()
          ElMessage.success("退出成功")
          await router.push('/login')
        }
    )
  } else {
    router.push('/user/' + command)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="240px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#58bb8b" background-color="#fff" text-color="#181818"
               router>
        <el-menu-item index="/article/category">
          <el-icon>
            <Management/>
          </el-icon>
          <span>日记分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon>
            <Promotion/>
          </el-icon>
          <span>日记管理</span>
        </el-menu-item>
        <el-sub-menu>
          <template #title>
            <el-icon>
              <UserFilled/>
            </el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/info">
            <el-icon>
              <User/>
            </el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon>
              <Crop/>
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/resetPassword">
            <el-icon>
              <EditPen/>
            </el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div><strong>当前Master:   {{ userInfoStore.userInfo.nickname }}</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="fullAvatarUrl"/>
                        <el-icon>
                            <CaretBottom/>
                        </el-icon>
                    </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <router-view/>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>随心记 ©2025 Created by Dio</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  background-color: #ecebeb;
  .el-aside {
    background-color: #fff;
    border-bottom-right-radius: 15px;
    &__logo {
      height: 180px;
      background: url('@/assets/logo.jpg') no-repeat center / 180px auto;
    }

    .el-menu {
      border-right: none;
      font-weight: bolder;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bolder;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;


    .el-dropdown__box {
      display: flex;
      align-items: center;
      
      .el-icon {
        color: #999;
        margin-left: 10px;
      }
      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
