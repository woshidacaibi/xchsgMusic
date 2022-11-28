<template>
  <div class="song-panel-container" v-if="this.$store.state.currentMusic.id !== -1">
    <div class="song-panel-header">
      <h2 class="elipse" :title="this.$store.state.currentMusic.name">
        {{this.$store.state.currentMusic.name}}
      </h2>
      <div class="artist-and-album">
        <span class="artist elipse">
          <span :key="artist.name" v-for="(artist,index) in $store.state.currentMusic.ar">
            <span v-if="artist.id === 0" class="nouse">{{artist.name}}</span>
            <router-link :to="{name:'SingerPanel',query:{singerId:artist.id}}" v-else>{{artist.name}}</router-link>
            <span v-if="index< $store.state.currentMusic.ar.length-1" class="nouse"> / </span>
          </span>
        </span>
        <span class="album">
           <router-link  :to="{path:'AlbumPanel',query:{albumId: $store.state.currentMusic.al.id}}" style="overflow: hidden;float:left;text-overflow:ellipsis;white-space: nowrap; width: 400px">{{$store.state.currentMusic.al.name}}</router-link>
        </span>
      </div>
    </div>
    <div class="song-lyrics-container">
      <div class="left-img">
        <div class="song-cover-default">
          <div ref="cover" class="cover cover-play">
            <img class="round" @click="$store.state.songStatus =!$store.state.songStatus" src="@/assets/song-background.png"/>
            <img class="song-img" :src="$store.state.currentMusic.al.picUrl">
          </div>
          <img ref="pointer" class="pointer pointer-play" src="@/assets/song-status-change.png"/>
        </div>
      </div>
      <div class="right-lyrics">
        <LyricsPanel/>
      </div>
    </div>
    <div class="comment-bottom">
      <CommentList
        :cid="this.$store.state.currentMusic.id"
        :type="0"
        :limit="20"
      ></CommentList>
    </div>
    <img class="background-img" :src="$store.state.currentMusic.al.picUrl">
  </div>
</template>

<script>
import CommentList from '@/components/ListPanel/commentList/CommentList'
import LyricsPanel from '@/components/SongPanel/LyricsComponents/LyricsPanel'
export default {
  name: 'SongPanel',
  components: {
    LyricsPanel,
    CommentList
  },
  computed: {
    playStatus () {
      return this.$store.state.songStatus
    }
  },
  watch: {
    playStatus: {
      handler (newVal) {
        if (newVal) {
          this.$refs.cover.classList.add('cover-play')
          this.$refs.pointer.classList.add('pointer-play')
        } else {
          this.$refs.cover.classList.remove('cover-play')
          this.$refs.pointer.classList.remove('pointer-play')
        }
      }
    }
  },
  mounted () {
    if (this.$refs.cover && this.$refs.pointer) {
      if (this.playStatus) {
        this.$refs.cover.classList.add('cover-play')
        this.$refs.pointer.classList.add('pointer-play')
      } else {
        this.$refs.cover.classList.remove('cover-play')
        this.$refs.pointer.classList.remove('pointer-play')
      }
    }
  }
}
</script>

<style lang="less" scoped>
*{
  box-sizing: border-box;
}
  .song-panel-container{
    position: relative;
    box-sizing: border-box;
    margin: 0 50px;
    width: cal(100% - 100px);
    h2{
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 25px;
      font-weight: normal;
    }
  }
  .song-lyrics-container{
    height: 500px;
    display: flex;
  }
  .background-img{
    width: 100%;
    height: 300px;
    top: 0;
    filter: blur(700px) brightness(100%);
    position: absolute;
    z-index: -1;
  }
  .left-img{
    position: relative;
    height: 500px;
    flex: 0 0 50%;
    .song-cover-default{
      position: relative;
      text-align: center;
      margin-top: 90px;
      .cover{
        img{
          cursor: pointer;
          transform-origin: 50% 50%;
          animation: rotate linear 10s infinite;
          animation-play-state: paused;
        }
      }
      .round{
        position: absolute;
        z-index: 1;
        width: 260px;
        height: 260px;
        border-radius: 50%;
      }
      .song-img{
        width: 180px;
        height: 180px;
        margin-top: 40px;
        margin-left: 40px;
      }
      .pointer{
        position: absolute;
        height: 100px;
        z-index: 2;
        top: -30px;
        left: 50%;
        transform-origin:0 0;
        transform: translateY(-50%);
        transition: 1s;
      }
      .pointer-play{
        transform-origin:0 0;
        transform: translateY(-50%) rotate(15deg);
        transition: 1s;
      }
      .cover-play{
        img{
          transform-origin: 50% 50%;
          animation-play-state: running;
          animation: rotate linear 10s infinite;
        }
      }
    }
  }
  .artist-and-album{
    text-align:center;
    margin: 0 auto;
    a{
      height: 30px;
      line-height: 30px;
      display: inline-block;
    }
    a:hover{
      color: #507daf;
    }
  }
  .artist{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    width: 400px;
    margin: 0 auto;
  }
  .album{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    width: 400px;
    margin: 0 auto;
    a{display: inline-block}
  }
  .right-lyrics{
    flex: 0 0 50%;
    height: 350px;
    padding: 20px 0;
  }
  .elipse{
    align-items: center;//垂直居中
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    word-break: break-all;  // 注意这个文字多行很重要
    -webkit-box-orient: vertical;
    vertical-align: middle;
  }
  @keyframes rotate {
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>
