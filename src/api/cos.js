import COS from 'cos-js-sdk-v5'; // 通过 npm 安装的 SDK
export const cos = new COS({
    // getAuthorization 必选参数
    getAuthorization: function (options, callback) {
        var url = '/materialSys/materialSystem/getTmpSecret'; // url 替换成您自己的后端服务
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onload = function (e) {
            try {
                var data = JSON.parse(e.target.responseText);
                console.log(data)
                var credentials = data.data;
            } catch (e) {
                console.log(e)
            }
            if (!data || !credentials) {
                return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
            };
            callback({
                TmpSecretId: credentials.tmpSecretId,
                TmpSecretKey: credentials.tmpSecretKey,
                SecurityToken: credentials.sessionToken,
                // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                StartTime: credentials.startTime, // 时间戳，单位秒，如：1580000000
                ExpiredTime: credentials.expiredTime, // 时间戳，单位秒，如：1580000000
            });
        };
        xhr.send();
    }
});  

