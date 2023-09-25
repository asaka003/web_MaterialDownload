import axios from "axios";

//获取视频文件列表
export const getVideoList = (params) => {
    // const token = localStorage.getItem("userToken");
    return axios.request({
      url: "/materialSys/materialSystem/getVideoList",
      method: "get",
      params:params
    });
};

//上传视频文件信息
export const UploadFileInfo = (data) =>{
    
}

//获取视频播放token
export const GetVideoToken = (params)=>{
    return axios.request({
        url: "/materialSys/materialSystem/getVideoToken",
        method: "get",
        params:params
      });
}
//获取视频上传token
export const GetUploadToken = ()=>{
    return axios.request({
        url: "/materialSys/materialSystem/getUploadToken",
        method: "get",
      });
}

//删除视频
export const DelVideo = (params) =>{
  return axios.request({
    url: "/materialSys/materialSystem/delVideo",
    method: "get",
    params:params
  });
}