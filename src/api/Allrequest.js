import axios from "./axios_init";

// 登录
export const loginApi = (data) => {
  // const token = localStorage.getItem("userToken");
  return axios.request({
    url: "/materialSys/login",
    method: "post",
    data: data,
    // headers: {
    //   "access-token": token,
    // },
  });
};
// 获取图片素材
export const getImgsApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/getFilesList",
    method: "post",
    data: data,
  });
};
// 下载图片
export const downImgApi = (data) => {
  console.log("参数", data);
  return axios.request({
    url: "/materialSys/materialSystem/getFile",
    data: data,
    method: "post",
    // responseType: "arraybuffer",
    responseType: "blob",
  });
};
// 上传图片
export const uploadFileApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/uploadFile",
    method: "post",
    data: data,
  });
};
// 删除图片
export const deleteImgApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/delFile",
    method: "post",
    data: data,
  });
};
// 退出登录
export const logoutApi = (data) => {
  return axios.request({
    url: "/materialSys/logout",
    method: "post",
    data: data,
  });
};
// 添加激活吗
export const AddActivationCodeApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/generateCDkey",
    method: "post",
    data: data,
  });
};
// 用户注册
export const signinApi = (data) => {
  return axios.request({
    url: "/materialSys/register",
    method: "post",
    data: data,
  });
};

// 修改密码
export const changePassApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/updatePassword",
    method: "post",
    data: data,
  });
};

// 修改图片信息
export const updateFileApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/updateFile",
    method: "post",
    data: data,
  });
};

// 管理员充值潮币
export const adminRechargeApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/adminRecharge",
    method: "post",
    data: data,
  });
};

// 用户操作余额
export const userBalanceApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/balance",
    method: "post",
    data: data,
  });
};

// 用户添加授权账号  addAccountAuth
export const addAccountAuthApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/addAccountAuth",
    method: "post",
    data: data,
  });
};

// 获取授权账号列表信息
export const getAuthInfoListApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/getAuthInfoList",
    method: "post",
    data: data,
  });
};

// 管理员获取所有用户授权统计信息
export const getAllUserAuthStatisticsApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/getAllUserAuthStatistics",
    method: "post",
    data: data,
  });
};


// 管理员更新账户授权信息
export const adminUpdateAuthInfoApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/adminUpdateAuthInfo",
    method: "post",
    data: data,
  });
};


// 用户删除授权账号接口
export const delUserAuthInfoApi = (data) => {
  return axios.request({
    url: "/materialSys/materialSystem/delUserAuthInfo",
    method: "post",
    data: data,
  });
};



