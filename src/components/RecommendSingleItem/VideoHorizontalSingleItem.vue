<template>
  <div class="VideoHorizontalSingleItem-container">
    <template v-if="type === 'mv'">
      <div class="left-img">
        <img :src="itemInfo.cover+'?param=300y300'">
        <div class="float-message">
          <span class="videoplayTime">12:50</span>
          <span class="videoTime">12:50</span>
        </div>
      </div>
      <div class="right-message">
        <router-link :to="{path:'/VideoPanel',query:{videoId:itemInfo.id, type:'mv'}}" >
          <span class="name">{{itemInfo.name}}</span>
        </router-link>
        <span class="author">by
          <router-link to="/singer">
          {{itemInfo.artistName}}
          </router-link>
        </span>
      </div>
    </template>
    <template v-if="type === 'video'">
      <div class="left-img">
        <router-link :to="{path:'/VideoPanel',query:{videoId:itemInfo.vid, type:'video'}}" >
        <img :src="itemInfo.coverUrl">
        </router-link>
        <div class="float-message">
          <span class="videoplayTime"><i class="iconfont icon-bofang1"></i>{{playTime(itemInfo.playTime)}}</span>
          <span class="videoTime">{{timeFormat(itemInfo.durationms/1000)}}</span>
        </div>
      </div>
      <div class="right-message">
        <router-link :to="{path:'/VideoPanel',query:{videoId:itemInfo.vid, type:'video'}}" >
          <span class="name">{{itemInfo.title}}</span>
        </router-link>
        <span class="author">by
          <router-link :to="{path:'/UserPanel',query:{UserId:itemInfo.creator.userId}}">
          {{itemInfo.creator.nickname}}
          </router-link>
        </span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'VideoHorizontalSingleItem',
  props: ['type', 'videoInfo'],
  data () {
    return {
      itemInfo: JSON.parse(this.videoInfo)
    }
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
    playTime (val) {
      return val > 10000 ? Math.floor(val / 10000) + '万' : val
    }
  }
}
</script>

<style lang="less" scoped>
.VideoHorizontalSingleItem-container{
  height: 100px;
  .left-img{
    position: relative;
    float: left;
    width: 50%;
    height: 85px;
    img{
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
    .float-message{
      color: whitesmoke;
      i{
        font-size: 13px;
        margin-left: 2px;
      }
      .videoplayTime{
        font-size: 13px;
        position: absolute;
        top: 3px;
        right: 10px;
      }
      .videoTime{
        position: absolute;
        font-size: 13px;
        bottom: 5px;
        right: 10px;
      }
    }
  }
  .right-message{
    float: left;
    box-sizing: border-box;
    padding-left: 5px;
    width: 50%;
    .name{
      font-size: 14px;
      text-align: left;
      padding-top: 5px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      word-break: break-all;  // 注意这个文字多行很重要
      -webkit-box-orient: vertical;
    }
    .author{
      font-size: 13px;
      color: #9f9f9f;
      a{
        font-size: 13px;
        color: #9f9f9f;
        display: inline-block;
      }
    }
  }
}
</style>
