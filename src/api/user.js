import request from "@/utils/request";

export const userRegisterService = (registerData) => {
  const params = new URLSearchParams();
  for (const key in registerData) {
    params.append(key, registerData[key])
  }
  return request.post('/user/register', params)
}

export const userLoginService = (loginData) => {
  const params = new URLSearchParams();
  for (const key in loginData) {
    params.append(key, loginData[key])
  }
  return request.post('/user/login', params)
}

export const userInfoService = () => {
  return request.get('/user/userInfo')
}

export const userInfoUpdateService = (userInfoData) => {
  return request.put('/user/update', userInfoData)
}

export const userAvatarUpdateService = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return request.post('/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const userAvatarGetService = () => {
  return request.get('/getAvatar')
}

export const userPwdUpdateService = (pwdData) => {
  return request.patch('/user/updatePwd', pwdData)
}