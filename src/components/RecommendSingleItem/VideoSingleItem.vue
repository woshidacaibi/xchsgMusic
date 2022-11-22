<template>
  <div class="videoItem-container">
    <template v-if="type === 'exclusive'">
      <div class="video-content-box">
        <router-link :to="{path:'/VideoPanel',query:{videoId:videoInfo.id, type:'mv'}}" >
          <div class="cover">
            <img :src="videoInfo.picUrl" alt="">
            <div class="play-icon">
              <i class="iconfont icon-bofang1"></i>
            </div>
          </div>
        </router-link>
        <span class="name">
        <router-link :to="{path:'/VideoPanel',query:{videoId:videoInfo.id, type:'mv'}}" >
          {{videoInfo.name}}
          </router-link>
        </span>
      </div>
    </template>
    <template v-if="type === 'mv'">
      <div class="video-content-box">
        <router-link :to="{path:'/VideoPanel',query:{videoId:videoInfo.id, type:'mv'}}" >
          <div class="cover">
            <img :src="videoInfo.picUrl?videoInfo.picUrl:videoInfo.cover" alt="">
            <div class="play-time">
              <div style="float:right;">
                <i class="iconfont icon-24gl-play"></i>
                <span>{{PlayTime}}</span>
              </div>
            </div>
            <div class="play-duration">
              <div class="time">
                {{timeFormat(videoInfo.duration/1000)}}
              </div>
            </div>
          </div>
        </router-link>
        <span class="name">
        <router-link :to="{path:'/VideoPanel',query:{videoId:videoInfo.id, type:'mv'}}" >
          {{videoInfo.name}}
          </router-link>
        </span>
      </div>
    </template>
    <template v-if="type === 'video'">
      <div class="video-content-box">
        <router-link :to="{path:'/VideoPanel',query:{videoId:videoInfo.vid, type:'video'}}" >
          <div class="cover">
            <img :src="videoInfo.coverUrl" alt="">
            <div class="play-time">
              <div style="float:right;">
                <i class="iconfont icon-24gl-play"></i>
                <span>{{PlayTime}}</span>
              </div>
            </div>
            <div class="play-duration">
              <div class="time">
                {{timeFormat(videoInfo.durationms/1000)}}
              </div>
            </div>
          </div>
        </router-link>
        <span class="name">
        <router-link :to="{path:'/VideoPanel',query:{videoId:videoInfo.vid, type:'video'}}" >
          {{videoInfo.title}}
          </router-link>
        </span>
      </div>
    </template>
    <template v-if="type === 'singer'">
      <div class="video-content-box">
        <router-link :to="{path:'/VideoPanel',query:{videoId:videoInfo.id, type:'mv'}}" >
          <div class="cover">
            <img :src="videoInfo.imgurl" alt="">
            <div class="play-time">
              <div style="float:right;">
                <i class="iconfont icon-24gl-play"></i>
                <span>{{PlayTime}}</span>
              </div>
            </div>
            <div class="play-duration">
              <div class="time">
                {{timeFormat(videoInfo.duration/1000)}}
              </div>
            </div>
          </div>
        </router-link>
        <span class="name">
        <router-link :to="{path:'/VideoPanel',query:{videoId:videoInfo.id, type:'mv'}}" >
          {{videoInfo.name}}
          </router-link>
        </span>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'VideoSingleItem',
  props: ['videoInfo', 'type'],
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
    }
  },
  computed: {
    PlayTime () {
      if (this.videoInfo.playCount) { return this.videoInfo.playCount > 10000 ? Math.floor(this.videoInfo.playCount / 10000) + '万' : this.videoInfo.playCount } else { return this.videoInfo.playTime > 10000 ? Math.floor(this.videoInfo.playTime / 10000) + '万' : this.videoInfo.playTime }
    }
  }
}
</script>

<style lang="less" scoped>
.videoItem-container{
  width: 100%;
  position: relative;
  margin-bottom: 60px;
}
.videoItem-container:before{content: "";padding-top: 60%;display: block;}
.video-content-box{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
  >a{
    width: 100%;
    height: 100%;
  }
  .cover{
    width: 100%;
    height: 100%;
    border-radius: 5px;
    position: relative;
    .play-icon{
      position: absolute;
      color: white;
      background-color: rgba(3, 3, 3, 0.32);
      border-radius: 50%;
      width: 30px;
      height: 30px;
      top: 10px;
      left: 10px;
      i{
        font-size: 15px;
        padding-left: 2px;
        line-height: 30px;
      }
    }
    .play-time{
      position: absolute;
      top: 0;
      left: 0;
      height: 20px;
      line-height: 20px;
      width: 100%;
      background: -webkit-linear-gradient(rgba(0, 0, 0, 0.41), rgba(255, 255, 255, 0.02));
      color: whitesmoke;
      i{
        font-size: 13px;
      }
      span{
        margin:0 10px;
        font-size: 13px;
      }
    }
    .play-duration{
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 20px;
      line-height: 20px;
      background: -webkit-linear-gradient(rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.41) );
      .time{
        font-size: 13px;
        height: 20px;
        line-height: 17px;
        color: white;
        float:right;
        padding-right: 10px
      }
    }
  }
  img{
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  .name{
    position: absolute;
    font-size: 15px;
    text-align: left;
    padding-top: 5px;
    height: 40px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    word-break: break-all;  // 注意这个文字多行很重要
    -webkit-box-orient: vertical;
  }
}
</style>
