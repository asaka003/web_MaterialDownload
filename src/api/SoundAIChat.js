import axios from "./axios_init";

// 获取图片素材
export const getImgsApi = (data) => {
    return axios.request({
      url: "/AIweb_materialSys/materialSystem/getFilesList",
      method: "post",
      data: data,
    });
  };

//文本转语音
export const textToSpeech = (data) => {
  console.log(data)
  return axios.request({
    url: "/AIweb_materialSys/materialSystem/TextToSpeech",
    method: "post",
    data: data,
  });
}

//合并语音文件
export const mergeAudios = (data) =>{
  return axios.request({
    url: "/AIweb_materialSys/materialSystem/GetMergeAudioFile",
    method: "post",
    data: data,
  });
}