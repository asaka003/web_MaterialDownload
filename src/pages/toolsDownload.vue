<template>
    <div class="main">
        <div class="container">
            <div class="handle-box">
                <!-- <el-input v-model="query.search" placeholder="工具搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" @click="handleSearch"><el-icon><Search/></el-icon>搜索</el-button> -->
                <el-button type="primary" @click="handleUpload" v-if="identity == 1"><el-icon><UploadFilled /></el-icon>上传工具</el-button>
            </div>
            <div class="nav05_centent">
                <el-table :data="tableData" class="fileTable">
                    
                    <el-table-column label="文件名">
                        <template #default="scope">
                            <el-popover effect="light" trigger="hover" placement="top" width="auto">
                                <template #default>
                                    <div>文件名: {{ scope.row.Key }}</div>
                                </template>
                                <template #reference>
                                    <el-tag>{{ scope.row.Key }}</el-tag>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="文件大小">
                        <template #default="scope">
                            <span  style="margin-left: 10px">{{ formatBytes(scope.row.Size) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="更新时间">
                        <template #default="scope">
                            <div style="display: flex; align-items: center">
                            <el-icon><timer /></el-icon>
                            <span  style="margin-left: 10px">{{ formatDateTime(scope.row.LastModified) }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template #default="scope">
                            <el-button size="small" @click="handleDownload(scope.$index, scope.row)"
                            >下载</el-button
                            >
                            <el-button
                            size="small"
                            type="danger"
                            v-if="identity == 1"
                            @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>    
    </div>

    <el-dialog v-model="dialogTableVisible" title="上传工具">
        <el-form :model="form">
            <el-form-item label="选择上传工具" :label-width="formLabelWidth">
                <input type="file" style="display:none;" ref="UploadFile" @change="handleChange"/>
                <el-button type="primary" @click="handleSelectUpload"><el-icon><UploadFilled /></el-icon>选择上传工具</el-button>
                <el-text class="w-100px" truncated>{{this.fileName}}</el-text>
            </el-form-item>
            <div class="row" id="resultBox">
            <!-- 上传信息组件	 -->
            <div class="uploaderMsgBox">
                <div v-if="startUpload">
                    视频名称：{{uploaderInfo.name}}；<br>
                    上传进度：{{Math.floor(uploaderInfo.progress * 100) + '%'}}；<br>
                    上传结果：{{uploaderInfo.isVideoUploadCancel ? '已取消' : uploaderInfo.isVideoUploadSuccess ? '上传成功' : '上传中'}}；
                    <br>
                    <a href="javascript:void(0);" class="cancel-upload" v-if="!uploaderInfo.isVideoUploadSuccess && !uploaderInfo.isVideoUploadCancel" @click="uploaderInfo.cancel()">取消上传</a><br>
                    </div>
                </div>
            </div>
        </el-form>
        
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取消</el-button>
                <el-button type="primary" @click="UploadSubmit">
                上传
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>


<script>
import {cos} from '../api/cos';

export default {
    name: 'toolsDownload',
    data() {
        return {
            query: {
                search: '',
                pageIndex: 0,
                pageSize: 10
            },
            tableData: [
                
            ],
            pageTotal: 0,
            uploadFileInfo:{
                filename: '',
                fileId: ''
            },
            imageUrl:'',
            dialogTableVisible: false,
            startUpload: false,
            formLabelWidth : '140px',
            player:{},
            //uploaderInfos: [],
            uploaderInfo:{},
            fileName:'',
            vcExampleVideoName: '',
            vcExampleCoverName: '',
            UploadToken:'',
            identity:0,
            tmpSecret:{},
        };
    },
    created() {
        const identityLocal = localStorage.getItem("identity");
        if (identityLocal) {
            this.identity = identityLocal;
        }
        this.getData();
        //请求临时密钥
        // GetTmpSecret().then(res=>{
        //     this.tmpSecret = res.data.data
        // }) 
        // 初始化实例
             
    },
    methods: {
        //获取cos文件信息列表
        getData() {
            var self = this
            cos.getBucket({
                Bucket: 'eralab-1317463756', /* 填写自己的 bucket，必须字段 */
                Region: 'ap-guangzhou',     /* 存储桶所在地域，必须字段 */
                Prefix: '软件工具/',           /* 列出目录 a 下所有文件，非必须 */
                }, function(err, data) {
                    console.log(err || data.Contents);
                    self.tableData = data.Contents;
                    self.tableData = self.tableData.filter(function(item) {
                        return item.Size !== '0';
                    });
            });

        },
        // 国标时间 转 年月日 时分秒
        formatDateTime(date) {
            // 将日期时间字符串转换为 Date 对象
            var dateObject = new Date(date);

            // 提取年、月、日、小时、分钟和秒
            var year = dateObject.getFullYear();
            var month = dateObject.getMonth() + 1; // 月份从0开始，所以需要加1
            var day = dateObject.getDate();
            var hours = dateObject.getHours();
            var minutes = dateObject.getMinutes();
            var seconds = dateObject.getSeconds();

            // 格式化为指定的日期时间字符串
            var formattedDateTime = year + '/' +
                                    (month < 10 ? '0' : '') + month + '/' +
                                    (day < 10 ? '0' : '') + day + ' ' +
                                    (hours < 10 ? '0' : '') + hours + ':' +
                                    (minutes < 10 ? '0' : '') + minutes + ':' +
                                    (seconds < 10 ? '0' : '') + seconds;
            return formattedDateTime;
        },
        formatBytes(bytes) {
            bytes = Number(bytes)
            if (bytes === 0) return '0 B';

            const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const k = 1024;
            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
        },
        handlerZero(param){
            param= param<10?('0'+param):param
        },
        handleUpload(){
            this.dialogTableVisible = true 
        },
        handleSelectUpload(){
            this.$refs.UploadFile.click()
        },
        handleChange(){
            this.fileName = this.$refs.UploadFile.files[0].name
        },
        UploadSubmit(){
            this.handleFileInUploading();
        },
        handleDownload(index,row){ //下载工具
            cos.getObjectUrl({
                Bucket: 'eralab-1317463756', /* 填写自己的 bucket，必须字段 */
                Region: 'ap-guangzhou',     /* 存储桶所在地域，必须字段 */
                Key: row.Key,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
            }, function(err, data) {
                if (err) return console.log(err);
                /* 通过指定 response-content-disposition=attachment 实现强制下载 */
                var downloadUrl = data.Url + (data.Url.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=attachment';
                /* 可拼接 filename 来实现下载时重命名 */
                /* downloadUrl += ';filename=myname'; */
                // （推荐使用 window.open()方式）这里是新窗口打开 url，如果需要在当前窗口打开，可以使用隐藏的 iframe 下载，或使用 a 标签 download 属性协助下载
                window.open(downloadUrl);
            });
        },
        handleDelete(index,row){  //管理员删除工具
            this.tableData.splice(index, 1);
            cos.deleteObject({
                Bucket: 'eralab-1317463756', /* 填写自己的 bucket，必须字段 */
                Region: 'ap-guangzhou',     /* 存储桶所在地域，必须字段 */
                Key: row.Key,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
            }, function(err, data) {
                console.log(err || data);
            });
        },
        handleFileInUploading() {
            var self = this;
            var toolFile = this.$refs.UploadFile.files[0];
            var uploaderInfo = {
                name: toolFile.name,
                isVideoUploadSuccess: false,
                isVideoUploadCancel: false,
                progress: 0,
                cancel: function() {
                    self.uploaderInfo.isVideoUploadCancel = true;
                },
            }
            self.uploaderInfo = uploaderInfo;
            self.startUpload = true
            cos.uploadFile({
                Bucket: 'eralab-1317463756', /* 填写自己的 bucket，必须字段 */
                Region: 'ap-guangzhou',     /* 存储桶所在地域，必须字段 */
                Key: '软件工具/'+toolFile.name,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
                Body: toolFile, // 上传文件对象
                SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
                onProgress: function(progressData) {
                    var data = progressData;
                    self.uploaderInfo.progress = data.percent;
                    if (self.uploaderInfo.progress == 1){
                        self.uploaderInfo.isVideoUploadSuccess = true;
                        self.dialogTableVisible = false;
                        window.location.reload();
                    }
                }
            }, function(err, data) {
                if (err) {
                    console.log('上传失败', err);
                } else {
                    console.log('上传成功');
                }
            });
        }
    }
};
</script>

<style scoped>
.main{
    background-color: #212121;
}
.w-100px{
    margin-left: 10px;
}
.uploaderMsgBox {
    width: 95%;
    border: 1px solid #888;
    padding: 10px;
    
}
.pagination { 
    margin-top: 20px;
    display: flex; 
    justify-content: center; 
    padding-bottom: 80px;
}
.container{
    margin: 5rem ;
}
.handle-box {
    text-align: center;
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>

<style lang="scss" scoped>
/* 页面五-站点展示 */
.nav05_centent{
	width: 100%;
	height: auto;
	overflow: hidden;
	/*background-color: #212121;*/
	text-align: center;
    display: flex; 
    justify-content: center; 
    flex-wrap: wrap;
}

.fileTable{
    width: 80%;
    border-radius: 1rem;
    border: 0.1rem solid wheat;
}

.nav05_centent_mb{
	width: 250px;
	height: 230px;
	margin: 20px 1%;
	position: relative;
}

.nav05_centent_mb a{
	width: 100%;
	height: 100%;
	border-radius: 8px;
	text-align: left;
	background-color: #FFFFFF;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 5;
    text-decoration:none
}
.nav05_centent_mb>a>div{
	width: 100%;
	height: 140px;
	border-radius: 8px;
	text-align: center;
	overflow: hidden;
	background: #e4e0e0;
}
.nav05_centent_mb>a>div img{
	text-align: center;
	height: 100%;
}
.nav05_centent_mb>a>h3{
	margin-left: 8%;
	margin-top: 22px;
	color: #606060;
	font: 13px cnm,Arial,sans-serif;
	text-shadow: 5px 5px 5px #909090;
	font-weight: 700;
    letter-spacing: 1px;
}
.button-del {
    width: 60px;
    height: 30px;
    float: right;
}
.nav05_centent_mb>a>p{
	margin-left: 8%;
	margin-top: 5px;
	color: #a1a1a1;
	font-size: 12px;
	font-weight: 400;
	letter-spacing: 2px;
}
.nav05_centent_mb>div{
	width: 100%;
	height: 100%;
	border-radius: 8px;
	background-color: #cfbc9a;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	transition: 0.5s;
	color:#F9f9f9;
	font-size: 12px;
	font-weight: 400;
	letter-spacing: 2px;
	text-align: center;
	line-height: 20px;
}
.nav05_centent_mb:hover>div{
	transform: translateY(-20px);
}
</style>
