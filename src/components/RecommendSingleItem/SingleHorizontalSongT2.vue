<template>
  <div class="SingleHorizontalSongT2-container">
    <div class="indexAndImg">
      <span>{{ index>=10?index:'0'+index }}</span>
      <div @click="playClickSong" class="cover-img">
        <el-image lazy :src="songInfo.album.picUrl+'?parma20y20'">
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
        <div class="play-icon">
          <i class="iconfont icon-bofang1"></i>
        </div>
      </div>
    </div>
    <div class="flex-area">
      <div class="song-name">
        <div class="left-box elipse">
          <span class="name">{{ songInfo.name }}</span>
          <span v-if="songInfo.alias.length>0" class="alias">(<span :key="alia" v-for="alia in songInfo.alias">{{alia }}</span>)</span>
        </div>
        <div class="right-box">
          <router-link v-if="songInfo.mv!==0" :to="{path:'/VideoPanel',query:{videoId:songInfo.mvid,type:'mv'}}">MV<i
            class="iconfont icon-youjiantou"></i></router-link>
        </div>
      </div>
      <div class="song-artist">
        <span class="elipse" style="width: 100%;font-size: 14px">
          <span class="artistName" :key="artist.name" v-for="(artist,index) in songInfo.artists.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{ artist.name }}</span>
                <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}"
                             v-else>{{ artist.name }}</router-link>
                <span v-if="index<songInfo.artists.length-1" class="nouse"> / </span>
              </span>
          <template v-if="songInfo.artists.length>5">...</template>
        </span>
      </div>
      <div class="song-album">
        <router-link :to="{path:'AlbumPanel',query:{albumId:songInfo.album.id}}" class="elipse">
          {{ songInfo.album.name }}
        </router-link>
      </div>
      <div class="song-duration">
        <div>{{ this.$time(songInfo.duration).format('mm:ss') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleHorizontalSongT2',
  props: ['songInfo', 'index'],
  methods: {
    async playClickSong () {
      const res = await this.$http.get(`/song/detail?ids=${this.songInfo.id}`)
      const item = res.data.songs[0]
      if (item.noCopyrightRcmd !== null) {
        this.$notify.error({
          title: '错误',
          message: '网易云没版权（悲）'
        })
      } else {
        this.$store.dispatch('pushsongtolist', item)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.SingleHorizontalSongT2-container {
  height: 100px;
  display: flex;
  background-color: rgba(215, 215, 215, 0.29);

  .indexAndImg {
    margin-left: 30px;
    height: 100px;
    line-height: 100px;
    width: 150px;
    flex-shrink: 0;

    span {
      float: left;
      margin-right: 10px;
      color: #9f9f9f;
    }

    .cover-img {
      position: relative;
      float: left;
      margin: 10px;
      width: 80px;
      height: 80px;

      .el-image {
        line-height: 80px;
        border-radius: 5px;
      }
    }

    .play-icon {
      position: absolute;
      color: #ec4141;
      background-color: rgba(255, 255, 255, 0.68);
      border-radius: 50%;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      bottom: 50%;
      right: 50%;
      transform: translate(50%, 50%);
    }
  }

  .flex-area {
    flex: 1;
    display: flex;

    * {
      box-sizing: border-box;
    }
  }

  .song-name {
    flex: 0 0 35%;
    height: 100px;
    text-align: left;
    line-height: 100px;
    display: flex;

    .right-box {
      flex-shrink: 0;
      font-size: 12px;
      text-align: center;
      float: left;
      line-height: 100px;

      a {
        margin-left: 5px;
        margin-top: 44px;
        width: 35px;
        height: 12px;
        line-height: 12px;
        font-weight: normal;
        border-radius: 5px;
        border: #ec4141 1.5px solid;
        color: #ec4141;

        i {
          font-size: 12px;
        }
      }
    }
  }

  .song-artist {
    flex: 0 0 20%;
    height: 100px;
    line-height: 100px;
    padding: 0 10px;
  }

  .song-album {
    flex: 0 0 30%;
    padding: 0 10px;
    height: 100px;
    width: 100%;
    line-height: 100px;
    font-size: 14px;
  }

  .song-duration {
    flex: 0 0 15%;
    padding: 0 10px;
    height: 100px;
    line-height: 100px;
    font-size: 14px;
    color: #9f9f9f;
  }

  .elipse {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    word-break: break-all; // 注意这个文字多行很重要
    -webkit-box-orient: vertical;
    vertical-align: middle;
  }

  .nouse {
    color: #9f9f9f;
  }
}
.SingleHorizontalSongT2-container:nth-child(even){
  background-color: whitesmoke;
}
</style>
