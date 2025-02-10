<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref, computed, watchEffect } from 'vue'  // ✅ 导入 computed
import { useUserInfoStore } from "@/stores/userInfo"
import { useTokenStore } from "@/stores/token"
import { ElMessage } from "element-plus"
import { userAvatarUpdateService } from "@/api/user"
import avatar from '@/assets/avatar.png'

const uploadRef = ref()
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()

// 用户头像地址
const imgUrl = ref(userInfoStore.userInfo.userPic)
console.log(imgUrl.value); 

// 拼接完整的 URL
const fullAvatarUrl = computed(() => {
  return `http://localhost:8080${imgUrl.value}?t=${Date.now()}`;
});

// 上传成功回调
const uploadSuccess = (result) => {
  imgUrl.value = result.data
  console.log(imgUrl.value)
  ElMessage.success("图片上传成功")
}

// 更新头像
const updateAvatar = async () => {
  await userAvatarUpdateService(imgUrl.value)
  ElMessage.success("修改成功")
  userInfoStore.setUserInfo({
    ...userInfoStore.userInfo,
    userPic: imgUrl.value
  })
}

watchEffect(() => {
  console.log("imageUrl: ", imgUrl.value)
  console.log("imageFullUrl: ", fullAvatarUrl.value)
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>更换头像</span>
        <span>{{ fullAvatarUrl }}</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-upload
            ref="uploadRef"
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="true"
            action="/api/avatar"
            name="file"
            :headers="{'Authorization': tokenStore.token}"
            :on-success="uploadSuccess"
        >
          <el-image
            v-if="imgUrl"
            :src="fullAvatarUrl"
            class="avatar"
            fit="cover"
            style="width: 150px; height: 150px; border-radius: 50%;"
          />
          <el-image
            v-else
            :src="avatar"
            fit="cover"
            style="width: 150px; height: 150px; border-radius: 50%;"
          />
        </el-upload>
        <br/>
        <el-button type="primary" :icon="Plus" size="large" @click="uploadRef.$el.querySelector('input').click()">
          选择图片
        </el-button>
        <el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
