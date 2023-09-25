<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.search" placeholder="教程名称" class="handle-input mr10"></el-input>
                <el-button type="primary" @click="handleSearch"><el-icon><Search/></el-icon>搜索</el-button>
                <el-button type="primary" @click="handleUpload" v-if="identity == 1"><el-icon><UploadFilled /></el-icon>上传视频</el-button>
            </div>
            <div class="nav05_centent">
                <div class="nav05_centent_mb" v-for="video in tableData" :key="video.file_id">
                <!-- :href="`#/player?file_hash=${video.file_hash}`" -->
                    <a name="file_url" @click="handlePlayer(video.file_id)">
                        <div :style="{boxShadow: `var(--el-box-shadow-light)`,}">
                            <img :src="`/material/`+video.faceImgPath" alt="[]">
                        </div>
                        <h3 name="title">{{video.file_name}}<el-button class="button-del" type="danger" @click.stop="handleDelete(video.file_id)" v-if="identity == 1"><el-icon><Delete /></el-icon>删除</el-button></h3>
                        <p name="time">{{(new Date(video.create_time)).toLocaleString() }}</p>
                    </a>
                    <div>点击播放</div>
                </div>
            </div>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>    
    </div>

    <el-dialog v-model="dialogTableVisible" title="上传视频教程">
        <el-form :model="form">
            <el-form-item label="选择上传视频" :label-width="formLabelWidth">
                <input type="file" style="display:none;" ref="UploadVideo" @change="handleChange"/>
                <el-button type="primary" @click="handleSelectUpload"><el-icon><UploadFilled /></el-icon>选择上传视频</el-button>
                <el-text class="w-100px" truncated>{{this.fileName}}</el-text>
            </el-form-item>
            <el-form-item label="选择文件封面" :label-width="formLabelWidth">
                <el-upload
                    ref="uploadImg"
                    class="upload-demo"
                    action="/materialSys/materialSystem/uploadFaceImg"
                    :auto-upload="false"
                    :data="uploadFileInfo"
                >
                    <template #trigger>
                        <el-button type="primary">选择封面文件</el-button>
                    </template>
                </el-upload>
            </el-form-item>
            <div class="row" id="resultBox">
            <!-- 上传信息组件	 -->
            <div class="uploaderMsgBox">
                <div v-if="startUpload">
                    视频名称：{{uploaderInfo.videoInfo.name + '.' + uploaderInfo.videoInfo.type}}；<br>
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

    <el-dialog v-model="PlayerVisible" title="视频播放"  destroy-on-close="true">
        <!-- 设置播放器容器 -->
        <video id="player-container-id" preload="auto" width="720" height="480" playsinline webkit-playsinline x5-playsinline></video>
    </el-dialog>
</template>
<script>
// import TCPlayer from 'tcplayer.js';   //5.0版本以上的需要licenseUrl,因此使用4.7版本,直接在index.html文件里面引用
// import 'tcplayer.js/dist/tcplayer.min.css';

// 安装稳定版本
// npm install vod-js-sdk-v6
//import TcVod from 'vod-js-sdk-v6'  //上传云点播组件

import {getVideoList,GetUploadToken,GetVideoToken,DelVideo} from '../api/video'

export default {
    name: 'videos',
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
            PlayerVisible: false,
            startUpload: false,
            formLabelWidth : '140px',
            player:{},
            //uploaderInfos: [],
            uploaderInfo:{},
            fileName:'',
            vcExampleVideoName: '',
            vcExampleCoverName: '',
            UploadToken:'',
            identity:0
        };
    },
    created() {
        this.identity = localStorage.getItem("identity")=='1'?1:0;
        console.log(this.identity);
        this.getData();
        //请求上传token
        GetUploadToken().then(res =>{
            //console.log(res.data.data)
            this.UploadToken = res.data.data
        })
        var self = this
        this.tcVod = new TcVod.default({
            getSignature: function(){
                return self.UploadToken;
            }
        })
        
    },
    methods: {
        //获取用户文件信息列表
        getData() {
            var res = getVideoList(this.query);
            res.then(response => {
                console.log(response.data);
                var data = response.data.data;
                this.tableData = data.list;
                this.pageTotal = data.total;
            }).catch(error => {
                // this.$message.error('获取文件信息失败')
                // console.error(error);
            });
        },
        vExampleUpload(){
            var self = this;
            console.log(this.$refs.UploadVideo.files[0])
            var mediaFile = this.$refs.UploadVideo.files[0]
            var uploader = this.tcVod.upload({
              mediaFile: mediaFile,
            })
            var uploaderInfo = {
              videoInfo: uploader.videoInfo,
              isVideoUploadSuccess: false,
              isVideoUploadCancel: false,
              progress: 0,
              fileId: '',
            //   videoUrl: '',
              cancel: function() {
                self.uploaderInfo.isVideoUploadCancel = true;
                uploader.cancel()
              },
            }
            this.uploaderInfo = uploaderInfo;
            this.startUpload = true
            
            uploader.on('media_progress', function (info) {
              self.uploaderInfo.progress = info.percent;
            })
            uploader.on('media_upload', function (info) {
              self.uploaderInfo.isVideoUploadSuccess = true;
            })

            uploader.done().then(function(doneResult) {
              console.log('doneResult', doneResult)
              self.uploaderInfo.fileId = doneResult.fileId;

              //上传封面信息
              self.uploadFileInfo.filename = self.fileName;
              self.uploadFileInfo.fileId = doneResult.fileId;
              self.$refs.uploadImg.submit();
              self.dialogTableVisible = false;
              ElMessage({
                    message: "上传成功!",
                    type: "success",
                });
              return;
            }).then(function (videoUrl) {
            //   this.uploaderInfo.videoUrl = videoUrl
              self.$refs.UploadVideo.reset();
            })
          },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        handleUpload(){
            this.dialogTableVisible = true 
        },
        handleSelectUpload(){
            this.$refs.UploadVideo.click()
        },
        handleChange(){
            this.fileName = this.$refs.UploadVideo.files[0].name
        },
        handlePlayer(fileId){  //视频播放
            this.PlayerVisible = true
            var self = this
            //获取视频播放token
            GetVideoToken({
                "fileId":fileId
            }).then(res =>{
                var token = res.data.data
                // console.log(token)
                // console.log(fileId)
                setTimeout(() => {
                    self.player = TCPlayer("player-container-id", { // player-container-id 为播放器容器ID，必须与html中一致
                        fileID: fileId, // 请传入需要播放的视频fileID 必须
                        appID: "1317463756", // 请传入点播账号的子应用appID 必须
                        psign: token, // 请传入播放器签名psign 必须
                        autoplay: false // 是否自动播放
                        // 其他参数请在开发文档中查看
                    });
                }, 1000)  //TcPlayer初始化在遇到异步操作时可能会出现问题，比如获取不到组件之类的。这个时候可以考虑采用定时器进行操作。
            })
            
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handleDelete(fileId){
            DelVideo({
                "fileId":fileId
            }).then(res =>{
                ElMessage({
                    message: "删除成功!",
                    type: "success",
                });
            })
            window.location.reload()
        },
        UploadSubmit(){
            this.vExampleUpload();
        },
    }
};
</script>

<style scoped>
.w-100px{
    margin-left: 10px;
}
.uploaderMsgBox {
    width: 95%;
    border: 1px solid #888;
    padding: 10px;
}
.pagination { 
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

<style scoped>
/* 页面五-站点展示 */
.nav05_centent{
	width: 100%;
	height: auto;
	overflow: hidden;
	background-color: #ffffff;
	text-align: center;
    display: flex; 
    justify-content: center; 
    flex-wrap: wrap;
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
