import axios from "axios";

//获取视频文件列表
export const getVideoList = (params) => {
    // const token = localStorage.getItem("userToken");
    return axios.request({
      url: "/AIweb_materialSys/materialSystem/getVideoList",
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
        url: "/AIweb_materialSys/materialSystem/getVideoToken",
        method: "get",
        params:params
      });
}
//获取视频上传token
export const GetUploadToken = ()=>{
    return axios.request({
        url: "/AIweb_materialSys/materialSystem/getUploadToken",
        method: "get",
      });
}

//删除视频
export const DelVideo = (params) =>{
  return axios.request({
    url: "/AIweb_materialSys/materialSystem/delVideo",
    method: "get",
    params:params
  });
}

//获取视频评论
export const GetVideoComment = (videoId,current,pageSize) =>{
  return axios.request({
    url: "/AIweb_materialSys/materialSystem/comment/getVideoComments/"+videoId+"/"+current+"/"+pageSize,
    method: "get",
  });
}
//评论视频
export const UserVideoCommentSubmit = (data) =>{
  return axios.request({
    url: "/AIweb_materialSys/materialSystem/comment/userVideoCommentSubmit",
    method: "post",
    data: data
  });
}
//删除视频评论
export const UserVideoCommentDel = (commentId) =>{
  return axios.request({
    url: "/AIweb_materialSys/materialSystem/comment/userVideoCommentDel/"+commentId,
    method: "post",
  });
}