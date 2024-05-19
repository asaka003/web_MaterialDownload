<template>
    <div v-if="videoShowList">
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.search" placeholder="教程名称" class="handle-input mr10"></el-input>
                <el-button type="primary" @click="handleSearch"><el-icon><Search/></el-icon>搜索</el-button>
                <el-button type="primary" @click="handleUpload" v-if="identity == 1"><el-icon><UploadFilled /></el-icon>上传视频</el-button>
            </div>
            <div class="nav05_centent">
                <div class="nav05_centent_mb" v-for="video in tableData" :key="video.file_id">
                <!-- :href="`#/player?file_hash=${video.file_hash}`" -->
                    <a name="file_url" @click="handlePlayer(video.file_id,video.id,video.file_name)">
                        <div :style="{boxShadow: `var(--el-box-shadow-light)`,}">
                            <img :src="`https://cdncos.eralab.cn/materials/`+video.faceImgPath" alt="[]" :style="{}">
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
    <div style="margin-top:30px" v-if="videoShowPlayer">
        <h1 style="cursor: pointer;" @click="this.videoShowPlayer = false;this.videoShowList = true">《 返回</h1>
    </div>
    <div v-if="videoShowPlayer">
        <div class="video-player-container">
            <!-- 设置播放器容器 -->
            <!-- <video id="player-container-id" class="video-player"  preload="auto" playsinline webkit-playsinline x5-playsinline></video> -->
            <div id="player" class="video-player"></div>
        </div>
        <div class="comments-container">
            <h3>评论区</h3>
            <div style="letter-spacing: 1px">
                <div class="content">
                    <!-- 一级评论 -->
                    <div class="first" v-for="(item, index) in comments" :key="index">
                        <a href="javascript:;" class="first-img">
                            <!-- 如果当前用户有头像则显示头像,没有则显示默认头像 -->
                            <img src="@/assets/logo.svg" />
                            <!-- <img v-if="item.picture" :src="`http://` + item.picture" alt="" />
                            <img v-else src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" alt="" /> -->
                        </a>
                        <div class="first-content">
                        <!-- 一级评论用户昵称 -->
                        <h3 class="first-username">{{ item.username }}</h3>
                        <!-- 一级评论发布时间 -->
                        <span class="first-time">{{ new Date(item.create_time).toLocaleString() }}</span>
                        <!-- 一级评论评论内容 -->
                        <p class="first-comment">
                            {{ item.content }}
                        </p>
                        <!-- 一级评论评论点赞 -->
                        <div
                            class="first-right"
                            @mouseleave="delete_leave(item)"
                            @mouseover="delete_after(item)"
                        >
                            <span
                                class="delete"
                                v-if="item.username == this.username"
                                @click="comment_delete(item.id)"
                            >删除</span>
                            <span class="comments" @click="show_comment_area(item)">回复</span>
                            <!-- 一级评论点赞数 -->
                            <!-- <span
                                class="praise"
                                :class="item.like"
                                @click="comment_like(item, 0)"
                            >
                                <span v-if="item.numbers">{{ item.numbers }}</span>
                            </span> -->
                        </div>
                        <!-- 回复一级评论 -->
                        <div class="reply-comment" v-if="item.display">
                            <input
                            type="text"
                            placeholder="请输入评论 . . ."
                            v-model="myReplyComment"
                            @keyup.enter="sumbit(1,0,item.id,item.user_id,this.myReplyComment)"
                            @blur="lose(item)"
                            />
                            <!-- 0为回复一级评论 -->
                            <button @click="sumbit(1,0,item.id,item.user_id,this.myReplyComment)">发表评论</button>
                        </div>
                        <!-- 次级评论 -->
                        <div class="second">
                            <ul style="list-style-type: none; padding:0;margin:0">
                                <li v-for="(child, child_index) in item.childs" :key="child_index" >
                                    <div class="top">
                                    <!-- 次级评论头像,该用户没有头像则显示默认头像 -->
                                    <a href="JavaScript:;" class="second-img">
                                        <!-- <img v-if="child.picture" :src="child.picture" />
                                        <img v-else src="@/assets/logo.svg" /> -->
                                        <img src="@/assets/logo.svg">
                                    </a>
                                    <div class="second-content">
                                        <!-- 次级评论用户昵称 -->
                                        <h3 class="second-username">{{ child.username }}</h3>
                                        <!-- 次级评论评论时间 -->
                                        <span class="second-time">{{ new Date(child.create_time).toLocaleString() }}</span>
                                        <!-- 次级评论内容 xxx回复xxx：评论内容-->
                                        <p class="second-comment">
                                        <span class="second-reply">
                                            <span class="to_reply">{{ child.username }}</span>
                                            回复
                                            <span class="to_reply">{{ child.reply_username }}</span
                                            >：
                                        </span>
                                        {{ child.content }}
                                        </p>
                                        <!-- 次级评论评论点赞 -->
                                        <div
                                        class="second-right"
                                        @mouseleave="delete_leave(child)"
                                        @mouseover="delete_after(child)"
                                        >
                                        <span
                                            class="delete"
                                            v-if="child.username == this.username"
                                            @click="comment_delete(child.id)"
                                            >删除</span
                                        >
                                        <span class="comments" @click="show_comment_area(child)"
                                            >回复</span
                                        >
                                        <!-- 次级评论点赞数 -->
                                        <!-- <span
                                            class="praise"
                                            :class="child.like"
                                            @click="comment_like(child, 1)"
                                        >
                                            <span v-if="child.numbers">{{
                                            child.numbers
                                            }}</span></span
                                        >-->
                                        </div> 
                                    </div>
                                    </div>
                                    <!-- 回复次级评论 -->
                                    <div class="reply-comment reply_li" v-if="child.display">
                                    <input
                                        type="text"
                                        placeholder="请输入评论 . . ."
                                        v-model="myReplyComment"
                                        @keyup.enter="sumbit(2,child.id,item.id,child.user_id,this.myReplyComment)"
                                        @blur="lose(child)"
                                    />
                                    <!-- 1为回复次级评论 -->
                                    <button @click="sumbit(2,child.id,item.id,child.user_id,this.myReplyComment)">发表评论</button>
                                    
                                    </div>
                                </li>
                            </ul>
                        </div>
                        </div>
                    </div>
                    <!-- 暂无评论的空状态 -->
                    <el-empty description="暂无评论" v-if="show"></el-empty>
                </div>
                <div class="head">
                    <!-- 评论区域如果当前用户有头像则显示头像,没有则显示默认头像 -->
                    <img src="@/assets/logo.svg" alt="">
                    <!-- <img v-if="picture" :src="`http://` + picture" alt="" />
                    <img v-else src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" alt="" /> -->
                    <!-- 评论框 -->
                    <input
                        type="text"
                        placeholder="请输入评论 . . ."
                        ref="input"
                        @focus="obtain"
                        @blur="lose"
                        v-model="myComment"
                        @keyup.enter="sumbit"
                    />
                    <!-- 发布按钮 -->
                    <button @click="sumbit(0,0,0,'',this.myComment)">发表评论</button>
                </div>
                <!-- 页码 -->
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
                    action="/AIweb_materialSys/materialSystem/admin/uploadFaceImg"
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
</template>
<script>
// import TCPlayer from 'tcplayer.js';   //5.0版本以上的需要licenseUrl,因此使用4.7版本,直接在index.html文件里面引用
// import 'tcplayer.js/dist/tcplayer.min.css';

// 安装稳定版本
// npm install vod-js-sdk-v6
//import TcVod from 'vod-js-sdk-v6'  //上传云点播组件

import {getVideoList,GetUploadToken,GetVideoToken,DelVideo,GetVideoComment,UserVideoCommentDel,UserVideoCommentSubmit} from '../api/video'

export default {
    name: 'videos',
    data() {
        return {
            query: {
                search: '',
                pageIndex: 1,
                pageSize: 20
            },
            commentParam:{
                videoId: 0,
                current: 1,
                pageSize: 20,
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
            videoShowList: true,
            videoShowPlayer: false,
            formLabelWidth : '140px',
            player:{},
            //uploaderInfos: [],
            uploaderInfo:{},
            fileName:'',
            vcExampleVideoName: '',
            vcExampleCoverName: '',
            UploadToken:'',
            identity:0,

            picture:'',
            myComment:'', 
            comments:[],
            myReplyComment:'',
            show:false,	//暂无条件显示

            username: localStorage.getItem("username")
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
        // this.tcVod = new TcVod.default({
        //     getSignature: function(){
        //         return self.UploadToken;
        //     }
        // })
        
    },
    methods: {
        //获取用户文件信息列表
        getData() {
            var self = this;
            var res = getVideoList({
                pageIndex: (self.query.pageIndex-1)*self.query.pageSize,
                pageSize: self.query.pageSize,
                search: self.query.search
            });
            res.then(response => {
                console.log(response.data);
                var data = response.data.data;
                this.tableData = data.list;
                // 根据 file_name 中点前面的数字大小进行排序
                this.tableData.sort((a, b) => {
                    // 从字符串中提取点前面的数字，并将其转换为数字类型进行比较
                    let aNumber = parseInt(a.file_name.match(/\d+/)[0]);
                    let bNumber = parseInt(b.file_name.match(/\d+/)[0]);

                    return aNumber - bNumber;
                });

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
            this.query.pageIndex = 1;
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
        handlePlayer(fileId,videoId,videoName){  //视频播放
            this.videoShowList = false
            this.videoShowPlayer = true
            
            setTimeout(function () {
                var videoObject = {
                    container: '#player', //“#”代表容器的ID，“.”或“”代表容器的class
                    video: 'https://videocdn.eralab.cn/videos/'+videoName+'.mp4', //视频地址,
                };
                this.player = new ckplayer(videoObject); //初始化播放器
            }, 2000)

            //获取视频播放token
            // GetVideoToken({
            //     "fileId":fileId
            // }).then(res =>{
            //     var token = res.data.data
            //     setTimeout(() => {
            //         self.player = TCPlayer("player-container-id", { // player-container-id 为播放器容器ID，必须与html中一致
            //             fileID: fileId, // 请传入需要播放的视频fileID 必须
            //             appID: "1317463756", // 请传入点播账号的子应用appID 必须
            //             psign: token, // 请传入播放器签名psign 必须
            //             autoplay: false // 是否自动播放
            //             // 其他参数请在开发文档中查看
            //         });
            //     }, 3000)  //TcPlayer初始化在遇到异步操作时可能会出现问题，比如获取不到组件之类的。这个时候可以考虑采用定时器进行操作。
            // })

            //获取视频评论
            this.commentParam = {
                videoId: videoId,
                current: 1,
                pageSize: 20,
            }
            this.getCommentData();
        },
        // 分页导航
        handlePageChange(val) {
            this.query.pageIndex = val;
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
        // 评价框 失焦
        lose(m){
            // m.display = false
            // this.myComment = ''
            // this.myReplyComment = ''
        },
        // 发表评论
        sumbit(level,replyId,rootId,replyUserId,comment){
            UserVideoCommentSubmit({
                video_id: this.commentParam.videoId,
                level: level,
                reply_id: replyId,
                root_id: rootId,
                reply_user_id: replyUserId,
                content: comment,
            }).then(res =>{
                ElMessage({
                    message: "评论成功!",
                    type: "success",
                });
                this.getCommentData();
            }).catch(err =>{
                ElMessage({
                    message: "评论失败!",
                    type: "error",
                });
            })
            this.myComment = '' 
            this.myReplyComment = ''
        },
        // 显示评论框
        show_comment_area(m){
            m.display = true
        },
        comment_delete(comment_id){
            UserVideoCommentDel(comment_id).then(res=>{
                ElMessage({
                    message: "删除评论成功!",
                    type: "success",
                });
                this.getCommentData();
            }).catch(err =>{
                ElMessage({
                    message: "删除评论失败!",
                    type: "error",
                });
            })  
        },
        delete_leave(m){
            // m.delete = false
        },
        delete_after(m){
            console.log(m);
            // m.delete = true
        },
        reply_sumbit(m,n,w,t){
            console.log((m))
            // console.log(m)
            // console.log(n)
            // console.log(w)	//父级的下标
            // console.log(t)	//子级的下标
            var index;
            if(n == '父级'){
                index = t
            }else if( n == '子级'){
                index = t+ 1;
            }
            this.comments[w].child.splice(index, 0, {
                username:'Champion',
                date:this.current.getFullYear() + '年' + (this.current.getMonth() + 1) + '月' + this.current.getDate() + '日' + this.current.getHours() + ':' + this.current.getMinutes() + ':' + this.current.getSeconds(),
                content:this.myReplyComment,
                delete:true,
                display:false,
                flag:false,
                like:'',
                display:false,	//显示评论区
                to_username:m.username,
            })	
            this.myComment = ''
            this.myReplyComment = ''
            m.display = false
        },
        getCommentData(){ //获取评论区数据
            GetVideoComment(this.commentParam.videoId,this.commentParam.current,this.commentParam.pageSize).then(res =>{
                this.comments = res.data.data
            }).catch(err =>{
                ElMessage({
                    message: "获取评论数据失败!",
                    type: "error",
                });
            })
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
    margin-top: 50px;
    display: flex; 
    justify-content: center; 
    padding-bottom: 80px;
}
.container{
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
    background-color: rgb(255, 255, 255,0.5);
    border-radius: 10px;
    padding-top: 20px;
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

.video-player-container{
    padding-top: 30px;
    justify-content: center;
    display: flex;
    background: black;
}
.video-player{
    border-radius: 10px;
    width: 100%;
    height: 480px;
    background: black;
}

</style>

<style scoped>
	/* 评论框 */
	.head {
        margin-top: 20px;
	  background-color: rgb(248, 248, 248);
	  position: relative;
	  height: 75px;
	  border-radius: 5px;
	}
	.head img {
	  width: 55px;
	  height: 55px;
	  border-radius: 50%;
	  position: absolute;
	  top: 10px;
	  left: 13px;
	}
	/* 评论框 */
	.head input {
	  position: absolute;
	  top: 13px;
	  left: 80px;
	  height: 45px;
	  border-radius: 5px;
	  outline: none;
	  width: 65%;
	  font-size: 20px;
	  padding: 0 20px;
	  border: 2px solid #f8f8f8;
	}
	/* 发布评论按钮 */
	.head button {
	  position: absolute;
	  top: 13px;
	  right: 20px;
	  width: 120px;
	  height: 48px;
	  border: 0;
	  border-radius: 5px;
	  font-size: 20px;
	  font-weight: 500;
	  color: #fff;
	  background-color: rgb(118, 211, 248);
	  cursor: pointer;
	  letter-spacing: 2px;
	}
	/* 鼠标经过字体加粗 */
	.head button:hover {
	  font-weight: 600;
	}
	 
	/* 评论内容区域 */
	.content .first {
	  display: flex;
	  position: relative;
	  padding: 10px 10px 0px 0;
	  text-align: left;
	}
	.first .first-img {
	  flex: 1;
	  text-align: center;
	}
	.first img {
	  width: 50px;
	  height: 50px;
	  border-radius: 50%;
	}
	.first-username,
	.second-username {
	  color: #504f4f;
	}
	.first-content {
	  flex: 9;
	}
	.first-time,
	.second-time {
	  color: #767575;
	}
	.first-comment,
	.second-comment {
	  margin-top: 5px;
	}
	/* 右边点赞和评论 */
	.first-right,
	.second-right {
	  position: absolute;
	  right: 1%;
	  top: 10px;
	}
	.first-right span,
	.second-right span {
	  margin-right: 20px;
	  cursor: pointer;
	}
	/* 删除评论 */
	.delete:hover {
	  color: red;
	}
	/* 评论字体图标 */
	.comments::before {
	  /* 想使用的icon的十六制编码，去掉&#x之后的 */
	  /* content: "\e8b9"; */
	  /* 必须加 */
	  font-family: "iconfont";
	  margin-right: 4px;
	  font-size: 16px;
	}
	/* 点赞字体图标 */
	.praise::before {
	  /* 想使用的icon的十六制编码，去掉&#x之后的 */
	  /* content: "\ec7f"; */
	  /* 必须加 */
	  font-family: "iconfont";
	  margin-right: 4px;
	  font-size: 19px;
	}
	.second {
	  background-color: #f3f3f3;
	  margin-top: 10px;
	}
	.second li {
	  padding: 10px 10px 10px 0;
	  border-bottom: 1px solid rgb(237, 237, 237);
	}
	.second .top {
	  display: flex;
	  position: relative;
	}
	.second-img {
	  flex: 1;
	  text-align: center;
	}
	.to_reply {
	  color: rgb(106, 106, 106);
	}
	.second-content {
	  flex: 9;
	}
	.second .reply_li {
	  margin-left: 70px;
	}
	/* 评论框 */
	.reply-comment {
	  margin: 10px 0 0 0;
	}
	.reply-comment input {
	  height: 40px;
	  border-radius: 5px;
	  outline: none;
	  width: 70%;
	  font-size: 18px;
	  padding: 0 20px;
	  /* border: 2px solid #f8f8f8; */
	  border: 2px solid skyblue;
	}
	/* 发布评论按钮 */
	.reply-comment button {
	  width: 15%;
	  height: 43px;
	  border: 0;
	  border-radius: 5px;
	  font-size: 18px;
	  font-weight: 500;
	  color: #fff;
	  background-color: rgb(118, 211, 248);
	  cursor: pointer;
	  letter-spacing: 2px;
	  margin-left: 20px;
	}
	/* 鼠标经过字体加粗 */
	.reply-comment button:hover {
	  font-weight: 600;
	}
	/* 评论点赞颜色 */
	.comment-like {
	  color: red;
	}
</style>

<style scoped>
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
    margin-top: 10px;
}

.nav05_centent_mb{
	width: calc((100% - 5rem) / 4);
    max-width: calc((100% - 5rem) / 4);
    min-width: calc((100% - 5rem) / 4);

	height: 275px;
	margin: 10px;
	position: relative;
    margin-bottom: 50px;
}

.nav05_centent_mb a{
	width: 100%;
	
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
	display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    background: #ffffff;
}
.nav05_centent_mb>a>div img{
	text-align: center;
    width: 100%;
    vertical-align: middle;
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
