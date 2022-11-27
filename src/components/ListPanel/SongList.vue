<template>
  <div class="songlist-container">
    <div style="margin-top: 10px"></div>
    <template v-if="isload">
      <template v-if="type === 'songList'">
        <el-row :gutter="20" class="songlist-header">
          <el-col :span="4"><span></span></el-col>
          <el-col :span="8"><span>音乐标题</span></el-col>
          <el-col :span="4"><span>歌手</span></el-col>
          <el-col :span="6"><span>专辑</span></el-col>
          <el-col :span="2"><span>时长</span></el-col>
        </el-row>
        <Loading :isload="islistload" :cover-name="'songlist'" text="歌单内的歌曲较多，请稍等。。。"/>
        <div v-if="isload && islistload" class="songlist-tracks">
          <div :key="item.id" v-for="(item,index) in c_tracks.slice(0,9)">
            <el-row v-if="item.id === $store.state.currentMusic.id" :gutter="20" class="song">
              <el-col :span="4" class="icon">
                <i class="iconfont icon-laba index" style="color: #ec4141"></i>
                <i class="iconfont icon-bofang" @click="playClickSong(item)"></i>
                <i class="iconfont icon-xihuan" @click="likeSong(item.id,false,item)" style="color: #ec4141;" v-show="likeStatus[index].res"></i>
                <i class="iconfont icon-aixin" @click="likeSong(item.id,true,item)" v-show="!likeStatus[index].res"></i>
                <i class="iconfont icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban" @click="download(item.id,item.name)"></i>
              </el-col>
              <el-col v-if="item.noCopyrightRcmd===null" :span="8" class="title">
                <div class="left-box elipse">
                  <span class="name" >{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col v-else :span="8" class="title nouse">
                <div class="left-box elipse">
                  <span class="name" style="color: #9f9f9f">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col :span="4" >
            <span class="elipse" style="width: 100%;font-size: 14px">
              <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{artist.name}}</span>
                <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}" v-else>{{artist.name}}</router-link>
                <span v-if="index<item.ar.length-1" class="nouse"> / </span>
              </span>
              <template v-if="item.ar.length>5">...</template>
            </span>
              </el-col>
              <el-col :span="6"><router-link :to="{path:'AlbumPanel',query:{albumId: item.al.id}}" class="elipse" style="width: 100%;font-size: 14px">{{item.al.name}}</router-link></el-col>
              <el-col :span="2"><span class="time">{{timeFormat(item.dt/1000)}}</span></el-col>
            </el-row>
            <el-row v-else :gutter="20" class="song">
              <el-col :span="4" class="icon">
                <span class="index">{{ '0'+(index+1) }}</span>
                <i class="iconfont icon-bofang" @click="playClickSong(item)"></i>
                <i class="iconfont icon-xihuan" @click="likeSong(item.id,false,item)" style="color: #ec4141;" v-show="likeStatus[index].res"></i>
                <i class="iconfont icon-aixin" @click="likeSong(item.id,true,item)" v-show="!likeStatus[index].res"></i>
                <i class="iconfont icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban" @click="download(item.id,item.name)"></i>
              </el-col>
              <el-col v-if="item.noCopyrightRcmd===null" :span="8" class="title">
                <div class="left-box elipse">
                  <span class="name" >{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col v-else :span="8" class="title nouse">
                <div class="left-box elipse">
                  <span class="name" style="color: #9f9f9f">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col :span="4" >
                <span class="elipse" style="width: 100%;font-size: 14px">
                  <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
                    <span v-if="artist.id === 0" class="nouse">{{artist.name}}</span>
                    <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}" v-else>{{artist.name}}</router-link>
                    <span v-if="index<item.ar.length-1" class="nouse">/</span>
                  </span>
                  <template v-if="item.ar.length>5">...</template>
                </span>
              </el-col>
              <el-col :span="6"><router-link :to="{path:'AlbumPanel',query:{albumId: item.al.id}}" class="elipse" style="width: 100%;font-size: 14px">{{item.al.name}}</router-link></el-col>
              <el-col :span="2"><span class="time">{{timeFormat(item.dt/1000)}}</span></el-col>
            </el-row>
          </div>
          <div :key="item.id" v-for="(item,index) in c_tracks.slice(9)" >
            <el-row v-if="item.id === $store.state.currentMusic.id" :gutter="20" class="song" >
              <el-col :span="4" class="icon">
                <i class="iconfont icon-laba index" style="color: #ec4141"></i>
                <i class="iconfont icon-bofang" @click="playClickSong(item)"></i>
                <i class="iconfont icon-xihuan" @click="likeSong(item.id,false,item)" style="color: #ec4141;" v-show="likeStatus[index+9].res"></i>
                <i class="iconfont icon-aixin" @click="likeSong(item.id,true,item)" v-show="!likeStatus[index+9].res"></i>
                <i class="iconfont icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban" @click="download(item.id,item.name)"></i>
              </el-col>
              <el-col v-if="item.noCopyrightRcmd===null" :span="8" class="title">
                <div class="left-box elipse">
                  <span class="name" >{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col v-else :span="8" class="title nouse">
                <div class="left-box elipse">
                  <span class="name" style="color: #9f9f9f">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col :span="4" >
            <span class="elipse" style="width: 100%;font-size: 14px">
              <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{artist.name}}</span>
                <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}" v-else>{{artist.name}}</router-link>
                <span v-if="index<item.ar.length-1" class="nouse"> / </span>
              </span>
              <template v-if="item.ar.length>5">...</template>
            </span>
              </el-col>
              <el-col :span="6"><router-link :to="{path:'AlbumPanel',query:{albumId: item.al.id}}" class="elipse" style="width: 100%;font-size: 14px">{{item.al.name}}</router-link></el-col>
              <el-col :span="2"><span class="time">{{timeFormat(item.dt/1000)}}</span></el-col>
            </el-row>
            <el-row v-else :gutter="20" class="song">
              <el-col :span="4" class="icon">
                <span class="index">{{ index+10 }}</span>
                <i class="iconfont icon-bofang" @click="playClickSong(item)"></i>
                <i class="iconfont icon-xihuan" @click="likeSong(item.id,false,item)" style="color: #ec4141;" v-show="likeStatus[index+9].res"></i>
                <i class="iconfont icon-aixin" @click="likeSong(item.id,true,item)" v-show="!likeStatus[index+9].res"></i>
                <i class="iconfont icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban" @click="download(item.id,item.name)"></i>
              </el-col>
              <el-col v-if="item.noCopyrightRcmd===null" :span="8" class="title">
                <div class="left-box elipse">
                  <span class="name" >{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col v-else :span="8" class="title nouse">
                <div class="left-box elipse">
                  <span class="name" style="color: #9f9f9f">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col :span="4" >
            <span class="elipse" style="width: 100%;font-size: 14px">
              <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{artist.name}}</span>
                <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}" v-else>{{artist.name}}</router-link>
                <span v-if="index<item.ar.length-1" class="nouse"> / </span>
              </span>
              <template v-if="item.ar.length>5">...</template>
            </span>
              </el-col>
              <el-col :span="6"><router-link :to="{path:'AlbumPanel',query:{albumId: item.al.id}}" class="elipse" style="width: 100%;font-size: 14px">{{item.al.name}}</router-link></el-col>
              <el-col :span="2"><span class="time">{{timeFormat(item.dt/1000)}}</span></el-col>
            </el-row>
          </div>
        </div>
      </template>
      <template v-if="type === 'playList'">
        <div v-if="isload" class="songlist-tracks" style="width: 400px;background-color:white; margin-right: 5px">
          <div class="rightlist-header">
            <h3>当前播放</h3>
            <div><span>共{{this.$store.state.playsongList.length}}首</span><i @click="clearPlaylist">清空全部</i></div>
          </div>
          <div @dblclick="playSong(index)" :key="item.id" v-for="(item,index) in fitertracks" >
            <el-row v-if="index === $store.state.currentIndex" :gutter="20" class="song" style="background-color: rgba(196, 60, 60, 0.1); margin-left: 0;">
              <el-col :span="12" class="title">
                <div class="left-box elipse">
                  <span class="name" style="padding-left: 15px;font-size: 13px">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias" style="font-size: 13px">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col :span="8">
            <span class="elipse" style="width: 100%;font-size: 13px">
              <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{artist.name}}</span>
                <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}" v-else>{{artist.name}}</router-link>
                <span v-if="index<item.ar.length-1" class="nouse"> / </span>
              </span>
              <template v-if="item.ar.length>5">...</template>
            </span>
              </el-col>
              <el-col :span="4"><span class="time">{{timeFormat(item.dt/1000)}}</span></el-col>
            </el-row>
            <el-row v-else :gutter="20" class="song" style=" margin-left: 0;">
              <el-col :span="12" class="title">
                <div class="left-box elipse">
                  <span class="name" style="padding-left: 15px;font-size: 13px">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias" style="font-size: 13px">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col :span="8">
            <span class="elipse" style="width: 100%;font-size: 13px">
              <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{artist.name}}</span>
                <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}" v-else>{{artist.name}}</router-link>
                <span v-if="index<item.ar.length-1" class="nouse"> / </span>
              </span>
              <template v-if="item.ar.length>5">...</template>
            </span>
              </el-col>
              <el-col :span="4"><span class="time">{{timeFormat(item.dt/1000)}}</span></el-col>
            </el-row>
          </div>
        </div>
      </template>
      <template v-if="type === 'albumList'">
        <el-row :gutter="20" class="songlist-header">
          <el-col :span="4"><span></span></el-col>
          <el-col :span="8"><span>音乐标题</span></el-col>
          <el-col :span="3"><span>歌手</span></el-col>
          <el-col :span="4"><span>专辑</span></el-col>
          <el-col :span="2"><span>时长</span></el-col>
          <el-col :span="3"><span>热度</span></el-col>
        </el-row>
        <div v-if="isload" class="songlist-tracks">
          <div :key="item.id" v-for="(item,index) in c_tracks.slice(0,9)">
            <el-row v-if="item.id === $store.state.currentMusic.id" :gutter="20" class="song">
              <el-col :span="4" class="icon">
                <i class="iconfont icon-laba index" style="color: #ec4141"></i>
                <i class="iconfont icon-bofang" @click="playClickSong(item)"></i>
                <i class="iconfont icon-xihuan" @click="likeSong(item.id,false,item)" style="color: #ec4141;" v-show="likeStatus[index].res"></i>
                <i class="iconfont icon-aixin" @click="likeSong(item.id,true,item)" v-show="!likeStatus[index].res"></i>
                <i class="iconfont icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban" @click="download(item.id,item.name)"></i>
              </el-col>
              <el-col v-if="item.noCopyrightRcmd===null" :span="8" class="title">
                <div class="left-box elipse">
                  <span class="name" >{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col v-else :span="8" class="title nouse">
                <div class="left-box elipse">
                  <span class="name" style="color: #9f9f9f">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col :span="3" >
                <span class="elipse" style="width: 100%;font-size: 14px">
              <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{artist.name}}</span>
                <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}" v-else>{{artist.name}}</router-link>
                <span v-if="index<item.ar.length-1" class="nouse"> / </span>
              </span>
              <template v-if="item.ar.length>5">...</template>
            </span>
              </el-col>
              <el-col :span="4"><div class="elipse" style="width: 100%;font-size: 14px">{{item.al.name}}</div></el-col>
              <el-col :span="2"><span class="time">{{timeFormat(item.dt/1000)}}</span></el-col>
              <el-col :span="3"><div class="pop-contain"><div class="pop-val" :style="`width:${item.pop}%` "></div></div></el-col>
            </el-row>
            <el-row v-else :gutter="20" class="song">
              <el-col :span="4" class="icon">
                <span class="index">{{ '0'+(index+1) }}</span>
                <i class="iconfont icon-bofang" @click="playClickSong(item)"></i>
                <i class="iconfont icon-xihuan" @click="likeSong(item.id,false,item)" style="color: #ec4141;" v-show="likeStatus[index].res"></i>
                <i class="iconfont icon-aixin" @click="likeSong(item.id,true,item)" v-show="!likeStatus[index].res"></i>
                <i class="iconfont icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban" @click="download(item.id,item.name)"></i>
              </el-col>
              <el-col v-if="item.noCopyrightRcmd===null" :span="8" class="title">
                <div class="left-box elipse">
                  <span class="name" >{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col v-else :span="8" class="title nouse">
                <div class="left-box elipse">
                  <span class="name" style="color: #9f9f9f">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col :span="3" >
                <span class="elipse" style="width: 100%;font-size: 14px">
              <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{artist.name}}</span>
                <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}" v-else>{{artist.name}}</router-link>
                <span v-if="index<item.ar.length-1" class="nouse"> / </span>
              </span>
              <template v-if="item.ar.length>5">...</template>
            </span>
              </el-col>
              <el-col :span="4"><div class="elipse" style="width: 100%;font-size: 14px">{{item.al.name}}</div></el-col>
              <el-col :span="2"><span class="time">{{timeFormat(item.dt/1000)}}</span></el-col>
              <el-col :span="3"><div class="pop-contain"><div class="pop-val" :style="`width:${item.pop}%` "></div></div></el-col>
            </el-row>
          </div>
          <div :key="item.id" v-for="(item,index) in c_tracks.slice(9)" >
            <el-row v-if="item.id === $store.state.currentMusic.id" :gutter="20" class="song">
              <el-col :span="4" class="icon">
                <i class="iconfont icon-laba index" style="color: #ec4141"></i>
                <i class="iconfont icon-bofang" @click="playClickSong(item)"></i>
                <i class="iconfont icon-xihuan" @click="likeSong(item.id,false,item)" style="color: #ec4141;" v-show="likeStatus[index+9].res"></i>
                <i class="iconfont icon-aixin" @click="likeSong(item.id,true,item)" v-show="!likeStatus[index+9].res"></i>
                <i class="iconfont icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban" @click="download(item.id,item.name)"></i>
              </el-col>
              <el-col v-if="item.noCopyrightRcmd===null" :span="8" class="title">
                <div class="left-box elipse">
                  <span class="name" >{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col v-else :span="8" class="title nouse">
                <div class="left-box elipse">
                  <span class="name" style="color: #9f9f9f">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col :span="3" >
            <span class="elipse" style="width: 100%;font-size: 14px">
              <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{artist.name}}<template v-if="index<item.ar.length-1">/</template></span>
                    <router-link to="/singer" v-else>{{artist.name}}<template v-if="index<item.ar.length-1">/</template></router-link>
              </span>
              <template v-if="item.ar.length>5">...</template>
            </span>
              </el-col>
              <el-col :span="4"><div class="elipse" style="width: 100%;font-size: 14px">{{item.al.name}}</div></el-col>
              <el-col :span="2"><span class="time">{{timeFormat(item.dt/1000)}}</span></el-col>
              <el-col :span="3"><div class="pop-contain"><div class="pop-val" :style="`width:${item.pop}%` "></div></div></el-col>
            </el-row>
            <el-row v-else :gutter="20" class="song">
              <el-col :span="4" class="icon">
                <span class="index">{{ index+10 }}</span>
                <i class="iconfont icon-bofang" @click="playClickSong(item)"></i>
                <i class="iconfont icon-xihuan" @click="likeSong(item.id,false,item)" style="color: #ec4141;" v-show="likeStatus[index+9].res"></i>
                <i class="iconfont icon-aixin" @click="likeSong(item.id,true,item)" v-show="!likeStatus[index+9].res"></i>
                <i class="iconfont icon-cangpeitubiao_xiazaipandiandanxiazaidayinmoban" @click="download(item.id,item.name)"></i>
              </el-col>
              <el-col v-if="item.noCopyrightRcmd===null" :span="8" class="title">
                <div class="left-box elipse">
                  <span class="name" >{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col v-else :span="8" class="title nouse">
                <div class="left-box elipse">
                  <span class="name" style="color: #9f9f9f">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
                <div class="right-box">
                  <span v-if="item.fee === 1">VIP</span>
                  <router-link v-if="item.mv!==0" :to="{path:'/VideoPanel',query:{videoId:item.mv,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
                </div>
              </el-col>
              <el-col :span="3" >
            <span class="elipse" style="width: 100%;font-size: 14px">
             <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
               <span v-if="artist.id === 0" class="nouse">{{artist.name}}<template v-if="index<item.ar.length-1">/</template></span>
                  <router-link to="/singer" v-else>{{artist.name}}<template v-if="index<item.ar.length-1">/</template></router-link>
              </span>
              <template v-if="item.ar.length>5">...</template>
            </span>
              </el-col>
              <el-col :span="4"><div class="elipse" style="width: 100%;font-size: 14px">{{item.al.name}}</div></el-col>
              <el-col :span="2"><span class="time">{{timeFormat(item.dt/1000)}}</span></el-col>
              <el-col :span="3"><div class="pop-contain"><div class="pop-val" :style="`width:${item.pop}%` "></div></div></el-col>
            </el-row>
          </div>
        </div>
      </template>
      <template v-if="type === 'rankList'">
        <div v-if="isload" class="songlist-tracks" style="margin-top: -10px">
          <div @dblclick="playClickSong(item)" :key="item.id" v-for="(item,index) in fitertracks" >
            <el-row class="song" >
              <el-col :span="1" class="icon rank">
                <span class="index">{{ index+1 }}</span>
              </el-col>
              <el-col :span="14" class="title">
                <div class="left-box elipse">
                  <span class="name" style="padding-left: 15px;font-size: 13px">{{ item.name.slice(0,50) }}<template v-if="item.name.length>50">...</template></span>
                  <span v-if="item.alia.length>0 && item.name.length<=50" class="alias" style="font-size: 13px">(<span :key="alia" v-for="alia in item.alia">{{alia}}</span>)</span>
                </div>
              </el-col>
              <el-col style="float:right;text-align: right;margin-right: 5px" :span="8">
            <span class="elipse" style="width: 100%;font-size: 13px">
              <span class="artistName" :key="artist.name" v-for="(artist,index) in item.ar.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{artist.name}}</span>
                <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}" v-else>{{artist.name}}</router-link>
                <span v-if="index<item.ar.length-1" class="nouse"> / </span>
              </span>
              <template v-if="item.ar.length>5">...</template>
            </span>
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
    </template>
    <div v-if="!isload" class="songlist-lazy-loading"></div>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
export default {
  name: 'SongLists',
  props: ['tracks', 'type', 'islistload'],
  components: {
    Loading
  },
  data () {
    return {
      // likeStatus: [],
      view_panel: '',
      isload: false,
      arr: [],
      c_tracks: this.tracks.slice(0, 999),
      currentBottom: 1000,
      step: 1000,
      isallLoad: false,
      timer: null,
      load: {
        close () {}
      }
    }
  },
  watch: {
    isload: {
      handler (newVal) {
        if (!newVal) {
          this.loading()
        }
      }
    },
    islistload: {
      handler (newVal) {
        this.c_tracks = this.tracks.slice(0, 999)
      }
    },
    tracks (newVal) {
      this.isallLoad = false
      if (this.type !== 'songList') {
        this.c_tracks = newVal.slice(0, 999)
        this.currentBottom = 20
        this.view_panel.addEventListener('scroll', this.bottomLoad)
      }
    }
  },
  computed: {
    likeStatus () {
      const arr = this.arr
      arr.length = 0
      this.tracks.forEach(value => {
        const res = this.likesongids.some(item => {
          return item === value.id
        })
        arr.push({ id: value.id, res })
      })
      return arr
    },
    likesongids () {
      return this.$store.state.likesongids
    },
    fitertracks () {
      const filter = this.tracks.filter(val => {
        return val.noCopyrightRcmd ? val.noCopyrightRcmd === null : true
      })
      return filter
    }
    // c_tracks () {
    //   return this.tracks
    // }
  },
  methods: {
    timeFormat (value) {
      const h = value / 3600 >= 10 ? Math.floor(value / 3600) : '0' + Math.floor(value / 3600)
      const m = value % 3600 / 60 >= 10 ? Math.floor(value % 3600 / 60) : '0' + Math.floor(value % 3600 / 60)
      const s = value % 60 >= 10 ? Math.floor(value % 60) : '0' + Math.floor(value % 60)
      if (h === '00') {
        return m + ':' + s
      } else {
        return h + ':' + m + ':' + s
      }
    },
    playClickSong (item) {
      if (item.noCopyrightRcmd !== null) {
        this.noUseWarn()
      } else {
        this.$store.dispatch('pushsongtolist', item)
      }
    },
    playSong (index) {
      this.$store.state.currentIndex = index
      this.$store.state.currentMusic = this.$store.state.playsongList[this.$store.state.currentIndex]
      localStorage.setItem('historySongList', JSON.stringify(this.$store.state.playsongList))
      localStorage.setItem('historyListIndex', JSON.stringify(this.$store.state.currentIndex))
    },
    likeSong (id, like, item) {
      if (item.noCopyrightRcmd !== null) {
        this.noUseWarn()
      } else if (!like) {
        this.$alert('确定将选中歌曲从我喜欢的音乐中删除?', '', {
          confirmButtonText: '确定',
          callback: action => {
            this.$http.get('/like', {
              params: {
                id, like, cookie: localStorage.getItem('cookie'), timestamp: Date.now()
              }
            }).then(async (res) => {
              let index = this.$store.state.likesongids.findIndex(value => {
                return value === id
              })
              if (index !== -1) { this.$store.state.likesongids.splice(index, 1) }
              index = this.$store.state.mylikeList.tracks.findIndex(value => {
                return value.id === id
              })
              if (index !== -1) { this.$store.state.mylikeList.tracks.splice(index, 1) }
              this.$message({
                type: 'success',
                message: '取消喜欢成功（悲——）'
              })
            })
          }
        })
      } else {
        this.$http.get('/like', {
          params: {
            id,
            like,
            cookie: localStorage.getItem('cookie'),
            timestamp: Date.now()
          }
        }).then(async () => {
          this.$store.state.likesongids.push(id)
          const res = await this.$http.get('/song/detail', {
            params: {
              ids: id,
              cookie: localStorage.getItem('cookie')
            }
          })
          this.$store.state.mylikeList.tracks.unshift(res.data.songs[0])
          this.$message({
            type: 'success',
            message: '喜欢成功（喜——）'
          })
        }
        ).catch(() => {
          this.$notify.error({
            title: '错误',
            message: '网易云没版权'
          })
        })
      }
    },
    bottomLoad () {
      if (this.timer === null) {
        this.timer = setTimeout(() => {
          if (this.view_panel.clientHeight + this.view_panel.scrollTop + this.step >= this.view_panel.scrollHeight) {
            this.loading()
            this.tracks.slice(this.currentBottom, this.currentBottom + this.step).forEach(val => {
              this.c_tracks.push(val)
            })
            this.currentBottom += this.step
            if (this.c_tracks.length === this.tracks.length) {
              this.view_panel.removeEventListener('scroll', this.bottomLoad)
            }
          }
          this.timer = null
        }, 200)
      }
    },
    download (id, name) {
      if (this.$store.state.islogin === false) {
        this.$message.warning('请登陆后再试')
      }
      this.$http.get('/song/url/v1', {
        params: {
          id: id,
          level: 'exhigh',
          cookie: localStorage.getItem('cookie')
        }
      }).then((res) => {
        if (!res.data.data[0].url) {
          this.$notify.error({
            title: '失败',
            message: '资源失效或权限不够（悲）'
          })
        } else {
          fetch(res.data.data[0].url).then(res => res.blob()).then(blob => {
            const a = document.createElement('a')
            document.body.appendChild(a)
            a.style.display = 'none'
            // 使用获取到的blob对象创建的url
            console.log(blob)
            const url = window.URL.createObjectURL(blob)
            console.log(url)
            a.href = url
            // 指定下载的文件名
            a.download = name
            a.click()
            document.body.removeChild(a)
            // 移除blob对象的url
            window.URL.revokeObjectURL(url)
          })
        }
      })
    },
    noUseWarn () {
      this.$notify.error({
        title: '错误',
        message: '网易云没版权（悲）'
      })
    },
    clearPlaylist () {
      this.$store.state.playsongList.splice(0, this.$store.state.playsongList.length)
      this.$store.state.currentIndex = 0
      this.$store.state.currentMusic = this.$store.state.errorMusic
      localStorage.setItem('historySongList', JSON.stringify(this.$store.state.playsongList))
      localStorage.setItem('historyListIndex', JSON.stringify(this.$store.state.currentIndex))
    },
    loading () {
      this.$nextTick(() => {
        this.isload = true
        this.load.close()
      })
    }
  },
  mounted () {
    const dc = document.getElementsByClassName('__panel')
    this.view_panel = dc[2]
    this.view_panel.addEventListener('scroll', this.bottomLoad)
    this.isload = true
  },
  beforeDestroy () {
    this.view_panel.removeEventListener('scroll', this.bottomLoad)
  }
}
</script>

<style lang="less" scoped>
  .songlist-container{
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 10px;
  }
  .songlist-header
  {
    width: 100%;
    padding: 0 10px;
    div{
      height: 40px;
    }
    div:hover{
      background-color: rgba(231, 229, 229, 0.99);
    }
    div:first-child:hover{
      background-color: whitesmoke;
    }
    span{
      color: #888;
      height: 40px;
      font-size: 14px;
      line-height: 40px;
    }
  }
  .songlist-tracks{
    //display: none;
    width: 100%;
    .el-col{
      height: 30px;
      line-height: 30px;
      a{line-height: 30px}
    }
    .song{
      width: 100%;
      .icon{
        .index{
          margin: 0 10px;
          color: rgba(159, 159, 159, 0.46);
        }
        i{
          padding: 0 2px;
        }
      }
      .title{
        text-align: center;
        display: flex;
        .left-box{
          flex: 1;
          margin-right: 10px;
          text-align: left;
          .name{
            font-size: 14px;
            margin-right: 10px;
            color: #343434;
          }
          .alias{
            font-size: 14px;
            color: #9f9f9f;
          }
        }
        .right-box{
          flex-shrink: 0;
          font-size: 12px;
          text-align: center;
          float: left;
          a,span{
            display: inline-block;
            margin-left: 5px;
            width: 35px;
            height: 12px;
            line-height: 12px;
            font-weight: normal;
            border-radius: 5px;
            border: #ec4141 1.5px solid;
            color: #ec4141;
            margin-top: 9px;
            i{
              font-size: 12px;
            }
          }
        }
      }
      .time{
        font-size: 14px;
        margin-left: -5px;
        color: rgba(159, 159, 159, 0.53);
      }
    }
    >div:hover{
      background-color: rgba(204, 204, 204, 0.36);
    }
    >div:nth-child(even){
      background-color: rgba(215, 215, 215, 0.29);
    }
    >div:nth-child(even):hover{
      background-color: rgba(204, 204, 204, 0.36);
    }
    >div:nth-child(-n+3){
      .rank{
        .index{color: #ec4141;}
      }
    }
  }
  .rightlist-header{
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    div{
      overflow: hidden;
      height: 20px;
      line-height: 20px;
      padding: 0 20px;
    }
    span{
      display: block;
      float: left;
      color: #9f9f9f;
      font-size: 13px;
    }
    i{
      float: right;
      font-size: 14px;
      text-decoration: none;
    }
  }
  .pop-contain{
    width: 100%;
    height: 5px;
    margin: 12.5px 0 12.5px -5px;
    line-height: 30px;
    background-color: rgba(141, 137, 137, 0.23);
    border-radius: 5px;
  }
  .pop-val{
    height: 100%;
    background-color: rgba(238, 67, 67, 0.96);
    border-radius: 5px;
  }
  .elipse{
    height: 30px;
    align-items: center;//垂直居中
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    word-break: break-all;  // 注意这个文字多行很重要
    -webkit-box-orient: vertical;
    vertical-align: middle;
    a,.nouse{
      display: inline-block;
    }
    .artistName{
      display: -webkit-inline-flex;
      span{
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .nouse{
    color: #9f9f9f;
  }
  .songlist-lazy-loading{
    width: 100%;
    height: 100px;
  }
  .iconfont:hover{
    color: #ec4141;
  }
</style>
