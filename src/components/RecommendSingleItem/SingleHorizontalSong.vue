<template>
  <div class="singleHorizontalSong-container" @dblclick="playSong">
    <div class="left-img" @click.prevent="playSong">
<!--      <img :src="songMessage.album.picUrl" alt="">-->
      <el-image class="cover-img" :src="songMessage.album.picUrl+'?param=160y160'" lazy>
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
      <div class="play-icon">
        <i class="iconfont icon-bofang1"></i>
      </div>
    </div>
    <div class="right-message">
      <div class="elipse">
        <span class="name">{{songMessage.name}}</span>
        <span class="alias" v-if="songMessage.alias.length>0">({{songMessage.alias[0]}})</span>
      </div>
      <div class="elipse">
        <router-link class="mv" v-if="songMessage.mvid!==0" :to="{path:'/VideoPanel',query:{videoId:songMessage.mvid,type:'mv'}}" >MV<i class="iconfont icon-youjiantou"></i></router-link>
        <span class="artist" :key="artist.name" v-for="(artist,index) in songMessage.artists.slice(0,5)">
                <span v-if="artist.id === 0">{{artist.name}}</span>
                <router-link to="/singer" v-else>{{artist.name}}</router-link>
                <span v-if="index<songMessage.artists.length-1">/</span>
              </span>
        <span v-if="songMessage.artists.length>5">...</span>
      </div>
      <div class="artist"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleHorizontalSong',
  props: ['songMessage'],
  created () {
  },
  methods: {
    playSong () {
      this.$http.get('song/detail', {
        params: {
          ids: this.songMessage.id
        }
      }).then(res => {
        console.log('plat it')
        this.$store.dispatch('pushsongtolist', res.data.songs[0])
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .singleHorizontalSong-container{
    height: 70px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
    border-radius: 5px;
    .left-img{
      padding: 5px;
      flex-shrink: 0;
      position: relative;
      cursor: pointer;
      .cover-img{
        width: 60px;
        height: 60px;
        border-radius: 10px;
      }
      .play-icon {
        position: absolute;
        color: #ec4141;
        background-color: rgba(255, 255, 255, 0.68);
        border-radius: 50%;
        width: 30px;
        height: 30px;
        bottom: 50%;
        right: 50%;
        transform: translate(50%,50%);
        i {
          font-size: 15px;
          padding-left: 2px;
          line-height: 30px;
        }
      }
    }
    .right-message{
      flex: 1;
      font-size: 13px;
      text-align: left;
      .alias{
        margin-left: 5px;
        color: #9f9f9f;
      }
      .mv{
        margin-left: 5px;
        margin-right: 10px;
        width: 35px;
        height: 12px;
        line-height: 12px;
        border: #ec4141 1.5px solid;
        color: #ec4141;
        font-weight: normal;
        margin-top: 3px;
        border-radius: 5px;
        i{
          font-size: 12px;
        }
      }
      .artist{
        color: #9f9f9f;
        a{
          color: #9f9f9f;
        }
        span{
          color: #9f9f9f;
        }
      }
    }
  }
  .singleHorizontalSong-container:hover{
    background-color: rgba(107, 107, 107, 0.37);
  }
  .elipse{
    height: 35px;
    line-height: 35px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    word-break: break-all;  // 注意这个文字多行很重要
    -webkit-box-orient: vertical;
    a{
      display: inline-block;
    }
  }
  .right-box{
    flex-shrink: 0;
    font-size: 12px;
    text-align: center;
    float: left;
  }
</style>
