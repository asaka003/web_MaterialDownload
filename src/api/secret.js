import axios from "axios";

//获取视频上传token
export const GetTmpSecret = ()=>{
    return axios.request({
        url: "/AIweb_materialSys/materialSystem/getTmpSecret",
        method: "post",
      });
}
