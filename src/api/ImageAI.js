import axios from "./axios_init";

// 获取文本转图片配置信息
export const GetTextToImageConfig = (data) => {
    return axios.request({
      url: "/gpt/material/getTextToImageConfig",
      method: "post",
      data: data,
    });
  };

// 文本转图片
export const TextToImage = (data) => {
  console.log(data)
  return axios.request({
    url: "/gpt/material/generateImage",
    method: "post",
    data: data,
  });
}