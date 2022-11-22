<template>
  <div ref="footer" class="player-container">
    <div class="message-panel">
      <div class="left">
        <img v-if="currentMusic.al.picUrl!==''" :src="currentMusic.al.picUrl" alt="">
        <img v-else src='@/assets/default_cover.jpg' alt="">
      </div>
      <div class="right">
        <a href="#" class="musicName long" :title="songName" v-if="nameLength>10">
            <span class="name"  >{{ currentMusic.name }}
            <span class="alia" v-if="currentMusic.alia[0]">
            ({{ currentMusic.alia[0] }})</span>
            </span>
          <span class="name">{{ currentMusic.name }}
            <span class="alia" v-if="currentMusic.alia[0]">
            ({{ currentMusic.alia[0] }})</span>
            </span>
        </a>
        <a href="#" class="musicName elipse" :title="songName" v-else>
            <span class="name">{{ currentMusic.name }}
            <span class="alia" v-if="currentMusic.alia[0]">
            ({{ currentMusic.alia[0] }})</span>
            </span>
        </a>
        <a href="#" class="artist long " :title="artistsName" v-if="artistNameLength>15">
          <span class="name">
            <span v-for="item in currentMusic.ar" :key="item.name">{{ item.name }}/</span>
          </span>
          <span class="name">
            <span v-for="item in currentMusic.ar" :key="item.name">{{ item.name }}/</span>
          </span>
<!--          <span class="name" v-for="item in currentMusic.ar" :key="item.id+1" style="margin: 0;padding-right: 12px">{{ item.name }}</span>-->
        </a>
        <a href="#" class="artist elipse" :title="artistsName" v-else>
          <span class="name" v-for="(item,index) in currentMusic.ar" :key="item.name"
                style="margin: 0;padding-right: 2px">{{ item.name }}<b v-if="index<currentMusic.ar.length-1">/</b></span>
        </a>
      </div>
    </div>
    <div class="control-panel">
      <div class="control-button">
        <i class="iconfont icon-shangyishou" @click="before" style="font-size: 15px"></i>
        <i class="iconfont icon-zanting1 isplay" v-show="songStatus" @click="pause"></i>
        <i class="iconfont icon-bofang1 isplay" v-show="!songStatus" @click="play"></i>
        <i class="iconfont icon-xiayishou
" style="font-size: 15px" @click="next"></i>
      </div>
      <div class="control-time">
        <span style="left: -30px;top: -3px">{{ nowTime }}</span>
        <el-slider :show-tooltip="false" v-model="currentPercent" @change="change"></el-slider>
        <span style="right: -30px;top: -3px">{{ songTime }}</span>
      </div>
    </div>
    <div class="right-panel">
      <div class="playlist">
        <i @click="showList = !showList" class="iconfont icon-gedan1">
        </i>
      </div>
      <div class="volume-panel" @mouseleave.prevent="$refs['volume-box'].style.display='none'">
        <i
           @mouseenter.prevent="$refs['volume-box'].style.display='block'"
           v-show="!isMute"
           @click.self="mute"
           class="iconfont icon-yinliang">
        </i>
        <i
          @mouseenter.prevent="$refs['volume-box'].style.display='block'"
          v-show="isMute"
          @click.self="noMute"
          class="iconfont icon-shengyinjingyin">
        </i>
        <div ref="volume-box" class="volume-box">
          <el-slider class="volume"
                     v-model="volume"
                     @change="mutechange"
                     vertical
                     height="100px"/>
        </div>
      </div>
    </div>
    <transition name="playlist" :appear="true">
      <div v-show="showList" class="playlist-box" :style="`height:${centerHeight}px;top:-${centerHeight}px`">
        <vue-scroll :ops="$store.state.ops" style="width:410px;height:98%">
          <SongList :type="'playList'" :tracks="$store.state.playsongList"></SongList>
        </vue-scroll>
      </div>
    </transition>
    <audio ref="player" @timeupdate="getCurrent" @canplay="getDuration" hidden :src="playingMusicUrl"></audio>
  </div>

</template>

<script>
import SongList from '@/components/ListPanel/SongList'
// 音频播放插件
export default {
  name: 'VideoPlayer',
  data () {
    return {
      songStatus: false,
      isFirstOpen: false,
      playingMusicUrl: '',
      currentDuration: 0,
      currentTime: 0,
      currentPercent: 0,
      volume: 10,
      isMute: false,
      beforeVolume: 0,
      showList: false,
      nowTime: '',
      songTime: '',
      songName: '',
      artistsName: '',
      timer: null,
      timerDuration: null,
      clientHeight: document.documentElement.clientHeight
    }
  },
  components: {
    SongList
  },
  methods: {
    // 播放
    play () {
      this.songStatus = true
      setTimeout(() => {
        this.$refs.player.play()
      }, 100)
    },
    // 暂停
    pause () {
      this.songStatus = false
      this.$refs.player.pause()
    },
    // 上一首
    async before () {
      this.$store.commit('LASTSONG')
      this.currentMusic = this.$store.state.playsongList[this.currentIndex]
      await this.getMusicByid()
      this.play()
    },
    // 下一首 在这里塞循环播放 随机播放 还有单曲循环
    async next () {
      this.$store.commit('NEXTSONG')
      this.currentMusic = this.$store.state.playsongList[this.currentIndex]
      await this.getMusicByid()
      this.play()
    },
    // 通过currentID 获得url
    async getMusicByid () {
      if (this.currentMusic.id === -1) {
        this.playingMusicUrl = ''
        this.songTime = ''
        this.nowTime = ''
        return
      }
      const result = await this.$http.get('/song/url/v1', {
        params: {
          id: this.currentMusic.id,
          level: 'exhigh'
        }
      })
      if (!result.data.data[0].url && this.currentMusic.id !== -1) {
        this.$notify.error({
          title: '失败',
          message: this.$store.state.currentMusic.name + '无法获取音频资源已自动跳过'
        })
        this.$store.state.playsongList.splice(this.$store.state.currentIndex, 1)
        if (this.$store.state.playsongList.length > 0) {
          this.next()
        } else {
          this.$store.state.currentMusic = this.$store.state.errorMusic
          this.playingMusicUrl = ''
        }
      }
      // 回调函数
      this.playingMusicUrl = result.data.data[0].url
    },
    // 获得播放时长
    getDuration () {
      this.currentDuration = this.$refs.player.duration
      this.songTime = this.timeFormat(this.currentDuration)
    },
    // 获得当前播放进度
    async getCurrent () {
      if (this.playingMusicUrl === '') { return }
      if (this.timerDuration === null) {
        this.timerDuration = setTimeout(() => {
          if (this.playingMusicUrl === '') { return }
          this.currentTime = this.$refs.player.currentTime
          // 当前播放时长
          this.nowTime = this.timeFormat(this.currentTime)
          // 当前播放进度百分比
          this.currentPercent = Math.floor(this.currentTime / this.currentDuration * 100)
          // 如果当前处于播放状态且播放完毕 则跳转到下一首
          if (this.songStatus && this.currentTime >= this.currentDuration) { this.next() }
          this.timerDuration = null
        }, 100)
      }
    },
    // 修改percent
    change () {
      this.currentTime = this.currentDuration * this.currentPercent / 100
      this.$refs.player.currentTime = this.currentTime
    },
    // 静音
    mute () {
      this.isMute = true
      this.beforeVolume = this.volume
      this.volume = 0
    },
    noMute () {
      this.isMute = false
      this.volume = this.beforeVolume
    },
    mutechange () {
      if (this.isMute && this.volume !== 0) {
        this.isMute = false
      }
    },
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
  watch: {
    volume: {
      handler: function (newData) {
        if (newData <= 1) {
          this.isMute = true
        }
        this.$refs.player.volume = newData / 100
      }
      // volume-boximmediate: true
    },
    async currentMusic () {
      this.pause()
      await this.getMusicByid()
      // const play = this.$refs.player.play()
      // 如果刚打开，不允许播放
      if (!this.isFirstOpen) {
        this.play()
      } else { this.isFirstOpen = false }
    },
    Status (newVal) {
      if (newVal === false) { this.pause() }
    }
  },
  computed: {
    nameLength () {
      let num = 0
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.songName = this.currentMusic.name + ' '
      this.currentMusic.alia.forEach(value => {
        num += value.length
        this.songName += value
      })
      return this.currentMusic.name.length + num
    },
    artistNameLength () {
      let num = 0
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.artistsName = ''
      this.currentMusic.ar.forEach(value => {
        num += value.name.length
        this.artistsName += value.name
      })
      return num
    },
    currentIndex () {
      return this.$store.state.currentIndex
    },
    currentMusic: {
      get: function () {
        return this.$store.state.currentMusic
        // return this.$store.state.playsongList[this.currentIndex]
      },
      // setter
      set: function (newValue) {
        this.getMusicByid()
      }
    },
    centerHeight () {
      return this.clientHeight - 120
    },
    Status () {
      return this.$store.state.hasAsideAndPlayer
    }
  },
  // 这里由于与aside同级所以存在同级组件渲染竞争问题，
  // 容易出现aside的数据请求还未保存到vuex中时当前组件已经加载完成，
  // 从而当前组件无法正确读取，所以我先设定里预先默认的数据，
  // 然后在vuex中playlist完成获取前重复设置20ms延时器，等到获取到数据
  // 就可以将获取的数据放到模板即可，当然也可以将播放记录保存到本地，这样就
  // 避免了竞争问题了
  // 10/31 优化 新方法设置监听器监听this.$store.state.islogin，当主页调用的异步函数结束时
  // 即刻调用aside组件中获取表单的方法，即会立刻更新vuex中的数据，进而
  // 因为中间会设置currentMusic
  // 所以可以直接返回currentMusic了，就不用设置wait了，但是要解决未登录时面板播放什么的问题
  // 所以在Aside中如果没登陆就获取热门歌单
  mounted () {
    this.getMusicByid()
    this.$refs.player.volume = 0.1
    window.addEventListener('resize', () => {
      if (this.timer === null) {
        this.timer = setTimeout(() => {
          this.clientHeight = document.documentElement.clientHeight
          this.timer = null
        }, 50)
      }
    })
    window.addEventListener('click', (e) => {
      if (!this.$refs.footer.contains(e.target)) {
        this.showList = false
      }
    })
  },
  beforeDestroy () {
    localStorage.setItem('lalalalal', 6)
  }
}
</script>

<style lang="less" scoped>
.player-container {
  display: flex;
  position: relative;
  background-color: #fff;
  border-top: solid 1px #ccc;
  z-index: 9999;
  .elipse{
    white-space: nowrap;
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .message-panel {
    width: 250px;
    height: 65px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    .left {
      flex-shrink: 0;
    }
    .right {
      position: absolute;
      left: 65px;
      width: 175px;
      flex-shrink: 0;
      overflow: hidden;
    }

    .artist {
      float: left;
      margin-top: 30px;
      white-space: nowrap;
      overflow: hidden;
    }

    img {
      width: 50px;
      height: 50px;
      border-radius: 15px;
      padding: 4.5px 7.5px;
    }

    .musicName {
      float: left;
      position: absolute;
      white-space: nowrap;
      height: 30px;
      top: 5px;
      overflow: hidden;
    }

    .long:hover {
      animation: slide 10s linear infinite;
    }

    .name {
      display: inline-block;
      color: #4c4c4c;
      //width: 100px;
      white-space: nowrap;
    }

    .alia {
      color: #999;
    }
  }
  .control-panel {
    flex: 1;
    //margin: 0 auto;
    height: 65px;
    padding-left: 40px;

    .control-button {
      height: 30px;
      line-height: 30px;
      width: 400px;
      text-align: center;
      padding-top: 7px;
      margin: 0 auto;

      .isplay {
        font-size: 20px;
        border-radius: 50%;
        background-color: #f5f5f7;
        padding: 5px;
      }

      .icon-bofang1 {
        padding-left: 7px;
        padding-right: 3px;
      }

      .isplay:hover {
        background-color: #f2f2f2;
      }

      i {
        margin: 0 20px;
      }
    }

    .control-time {
      position: relative;
      width: 400px;
      margin: 0 auto;
      //padding: 0 25px;
      span {
        position: absolute;
      }
    }

    .el-slider {
      height: 20px;
      width: 350px;
      margin: 0 auto;
    }
  }
  .right-panel {
    width: 200px;
    position: relative;
    z-index: auto;
    flex-shrink: 0;
    i {
      margin: 0 20px;
      font-size: 30px;
      text-align: center;
      line-height: 65px;
      background-color: #fff;
    }
    .playlist{
      float: right;
      position: relative;
      right: 10px;
      z-index: 2005;
    }

    .volume-panel{
      float: right;
      position: relative;
      z-index: 2006;
      left: 20px;
    }
    .volume-box {
      display: none;
      position: absolute;
      z-index: 2005;
      top: -105px;
      left: 15px;
      background-color: navajowhite;
      border: 1px solid rgba(204, 204, 204, 0.47);
      height: 120px;
      width: 40px;
      border-radius: 15px;
      .volume {
        width: 30px;
        margin-left: 1px;
        margin-top: 10px;
      }
    }
  }
  .playlist-box{
    position: absolute;
    right: -10px;
    width: 420px;
    box-shadow: -2px 0 5px #9f9f9f;
    background-color: white;
  }
  @keyframes slide {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-50%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  .playlist-enter-active{
    animation: playlist 0.5s linear ;
  }
  .playlist-leave-active{
    animation: playlist 0.5s linear reverse;
  }
  @keyframes playlist{
    0% {
      opacity: 0%;
      transform: translateX(100%);
    }
    50% {
      opacity: 75%;
      transform: translateX(50%);
    }
    75% {
      opacity: 100%;
      transform: translateX(25%);
    }
    100% {
      transform: translateX(0);
    }
  }
}
</style>
