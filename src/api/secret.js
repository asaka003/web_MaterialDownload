import axios from "axios";

//获取视频上传token
export const GetTmpSecret = ()=>{
    return axios.request({
        url: "/materialSys/materialSystem/getTmpSecret",
        method: "post",
      });
}
