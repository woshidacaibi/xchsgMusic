<template>
  <div ref="footer" @keyup.left="timeReduce" @keyup.right="timeAdd" class="player-container">
    <div class="message-panel">
      <div class="left">
        <img v-if="currentMusic.al.picUrl!==''" :src="currentMusic.al.picUrl+'?param=100y100'" alt="">
        <img v-else src='@/assets/default_cover.jpg' alt="">
        <div class="cover" v-show="currentMusic.id !== -1">
          <i v-show="$store.state.showSongDetail" @click="$store.state.showSongDetail=false" class="iconfont icon-xiangxia"></i>
          <i v-show="!$store.state.showSongDetail" @click="$store.state.showSongDetail=true" class="iconfont icon-xiangshang"></i>
        </div>
      </div>
      <div class="right">
        <a class="musicName long" :title="songName" v-if="nameLength>20">
            <span class="name"  >{{ currentMusic.name }}
            <span class="alia" v-if="currentMusic.alia[0]">
            ({{ currentMusic.alia[0] }})</span>
            </span>
            <span class="name">{{ currentMusic.name }}
            <span class="alia" v-if="currentMusic.alia[0]">
            ({{ currentMusic.alia[0] }})</span>
            </span>
        </a>
        <a class="musicName elipse" :title="songName" v-else>
            <span class="name">{{ currentMusic.name }}
            <span class="alia" v-if="currentMusic.alia[0]">
            ({{ currentMusic.alia[0] }})</span>
            </span>
        </a>
        <a href="#" class="artist long " :title="artistsName" v-if="artistNameLength>30">
          <span class="name">
            <router-link :to="{path:'/SingerPanel',query:{singerId:item.id}}" v-for="(item,index) in currentMusic.ar" :key="item.name">
              {{ item.name }}
              <b v-if="index<currentMusic.ar.length-1">/</b></router-link>
          </span>
          <span class="name">
            <router-link :to="{path:'/SingerPanel',query:{singerId:item.id}}" v-for="(item,index) in currentMusic.ar" :key="item.name">
              {{ item.name }}
              <b v-if="index<currentMusic.ar.length-1">/</b></router-link>
          </span>
        </a>
        <a href="#" class="artist elipse" :title="artistsName" v-else>
          <router-link :to="{path:'/SingerPanel',query:{singerId:item.id}}" class="name" v-for="(item,index) in currentMusic.ar" :key="item.name"
                       style="margin: 0;padding-right: 2px">{{ item.name }}<b v-if="index<currentMusic.ar.length-1">/</b></router-link>
        </a>
      </div>
      <div class="like-icon">
        <i class="iconfont icon-xihuan" @click="likeSong(currentMusic.id,false)" style="color: #ec4141;" v-show="isliked"></i>
        <i class="iconfont icon-aixin" @click="likeSong(currentMusic.id,true)" v-show="!isliked"></i>
      </div>
    </div>
    <div class="control-panel">
      <template v-if="currentMusic.id !== -1">
        <div class="control-button">
          <div class="play-method">
            <el-tooltip class="item" effect="dark" :content="playMethodName" placement="top">
              <i @click="changeMethod" v-if="playMethod === 0" class="iconfont icon-liebiaoxunhuan"></i>
              <i @click="changeMethod" v-if="playMethod === 1" class="iconfont icon-suijibofang"></i>
              <i @click="changeMethod" v-if="playMethod === 2" class="iconfont icon-icon_xindong"></i>
              <i @click="changeMethod" v-if="playMethod === 3" class="iconfont icon-danquxunhuan"></i>
            </el-tooltip>
          </div>
          <i class="iconfont icon-shangyishou" @click="before" style="font-size: 18px"></i>
          <i class="iconfont icon-zanting1 isplay" v-show="songStatus" @click="pause"></i>
          <i class="iconfont icon-bofang1 isplay" v-show="!songStatus" @click="play"></i>
          <i class="iconfont icon-xiayishou" style="font-size: 18px" @click="next"></i>
          <i class="iconfont icon-cibiaoquanyi" @click="showLyrics = !showLyrics"></i>
        </div>
        <div class="control-time">
          <span style="left: -30px;top: -3px">{{ nowTime }}</span>
          <el-slider :show-tooltip="false" v-model="currentPercent" @change="change"></el-slider>
          <span style="right: -30px;top: -3px">{{ songTime }}</span>
        </div>
      </template>
      <div class="v-else" v-else style="text-align: center;line-height: 60px">
        请选择播放歌曲
      </div>
    </div>
    <div class="right-panel">
      <div class="playlist">
        <i @click="showList = !showList" class="iconfont icon-gedan1">
        </i>
      </div>
      <div class="volume-panel" @mouseleave="$refs['volume-box'].style.display='none'">
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
          <el-tooltip class="item" effect="dark" :content="volume.toString()" placement="right">
          <el-slider class="volume"
                     v-model="volume"
                     @change="mutechange"
                     vertical
                     :show-tooltip="false"
                     height="100px"/>
          </el-tooltip>
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
    <div v-show="showLyrics && !$store.state.showSongDetail" ref="smallLyrics" class="drag" @mousedown.stop="move">{{$store.state.currentLyricsContent}}
      <i @click="showLyrics = false" class="iconfont icon-guanbi1"></i></div>
    <audio id="audio" ref="player" @timeupdate="getCurrent" @canplay="getDuration" hidden :src="playingMusicUrl"></audio>
  </div>

</template>

<script>
import SongList from '@/components/ListPanel/SongList'
import Clipboard from 'clipboard'
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
      showLyrics: false,
      nowTime: '',
      songTime: '',
      songName: '',
      artistsName: '',
      timer: null,
      timerDuration: null,
      clientHeight: document.documentElement.clientHeight,
      messageBoxTimer: null,
      normalList: this.$store.state.playsongList
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
      this.$store.commit('LASTSONG', this.playMethod)
      this.currentMusic = this.$store.state.playsongList[this.currentIndex]
      await this.getMusicByid()
      this.play()
    },
    // 下一首 在这里塞循环播放 随机播放 还有单曲循环
    async next () {
      this.$refs.player.loop = false
      this.$store.commit('NEXTSONG', this.playMethod)
      this.currentMusic = this.$store.state.playsongList[this.currentIndex]
      await this.getMusicByid()
      this.play()
    },
    copy (text) {
      // .uni-btn 点击复制按钮的class
      const clipboard = new Clipboard('#uni-btn', {
        // 最关键的一步，弹框会自动focus 所以要调整container
        container: document.querySelector('.el-message-box')
      })
      clipboard.on('success', e => {
        // 释放内存
        this.$message({
          message: '复制成功，复制到手机网页后用网易云打开即可',
          type: 'success',
          duration: 1500
        })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$message({
          message: '该浏览器不支持自动复制',
          type: 'warning'
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    // 通过currentID 获得url
    async getMusicByid () {
      if (this.currentMusic.id === -1) {
        this.playingMusicUrl = ''
        this.songTime = ''
        this.nowTime = ''
        return
      }
      let result = await this.$http.get('/song/url/v1', {
        params: {
          id: this.currentMusic.id,
          level: 'exhigh',
          cookie: localStorage.getItem('cookie')
        }
      }).catch(err => {
        console.log(err)
      })
      const res = await this.$http.get(`/lyric?id=${this.$store.state.currentMusic.id}`, {
        params: {
          cookie: localStorage.getItem('cookie')
        }
      })
      this.$store.state.currentLyrics = res.data.lrc.lyric
      if (result.data.code === -462 && !this.$store.state.islogin) {
        result = await this.$http.get('/song/url/v1', {
          params: {
            id: this.currentMusic.id,
            level: 'exhigh',
            cookie: 'MUSIC_R_T=1502103233844; MUSIC_A_T=1502103211190; _ntes_nnid=417a547277afa5802040c5b4bb920769,1662424417712; _ntes_nuid=417a547277afa5802040c5b4bb920769; NMTID=00OdfnZFrhQYsXr40Pxm3vWCiQRjrAAAAGDEDeKfg; WEVNSM=1.0.0; WNMCID=kfcqij.1662424417957.01.0; WM_TID=uu5f7ndBTx9BUQBUBAOVTkdQHzuEtr%2B%2F; ntes_kaola_ad=1; __snaker__id=lpTtLGIDAdVqVJT0; YD00000558929251%3AWM_TID=LIgHu4gzua1BQREVEAKANBX9TDYRovnm; from=bdjj20210916B8154; hb_MA-9F44-2FC2BD04228F_source=yunxin.163.com; __bid_n=184a3a3a389d1035f14207; gdxidpyhxdE=BlUIgBKrH%5C7g8oH98ddR%2BwGTApGk%2Fbh9nzuJaKDqShmRUdiz7da6H0tmLCK94VSnh805JZ8iN16jen1ZBWuSY7LSnH8hzAu3KkKRnSAcGJRVvbYal0Lj0Xces2JQrBjeBz1yWzqfhDaR%2BhA%5CllrW%5C7pqmzRSqda%5COG6wq3YRoJ%5Cnwn51%3A1669262153576; YD00000558929251%3AWM_NI=5kElvy1FCVnSUB9Gtdtrhy3QB8ZD1tiPBbfn4YezwCHIxbeauWMUErNeRxjkPVmvmuecu5fd8DxtK4WHDug5OXB8Z4RA%2B2ZFkguiyVV53opMss80PN0qfeyhMQRRKCN6NHQ%3D; YD00000558929251%3AWM_NIKE=9ca17ae2e6ffcda170e2e6eed2f64ff3f5bea8b554a8a88bb2c54e969b9fb1d1428eeff98bf370f78fa9a2f02af0fea7c3b92af7b58b8df573f39a8db7ed59979ef7a8f770b8aea89ab25b82e896a5b480ab908e83e566f887ab9bf6498c97b883e86bb78983b6c87a8ebb9e99e961948aa397f07fa7bdbbd6e570fc9cb895ca4095988c96e63f8d888ed9d940929fe5d3d94ea9b9bb8afc5e96ebfd90f347b1adf8d1d346f4afaa86fc648f8f9eb3ca498eea82a9d437e2a3; _iuqxldmzr_=32; JSESSIONID-WYYY=Keyq%5CxRcTCZ94jQJyIXm5%2F19qupA2eZEHThfvoxs%2FvBZZSk1fR2q0jr8TDaqEwJiAglH9lPcUcquvZ0YmdirM9SokXKUti8Ii%5CKsopZVdurxbc2%5CITeyUw4Bvtlb5%5CFleAuoeDuKE4SKQbj1BfDqqT1O1DiphuIuDRs%2Ba9MPb5wOpnWq%3A1669342517100; WM_NI=%2BdsD0CzouWfejx291uj6%2FtUkIkHiOT6djHSxY%2FU8GAsmWcoktk%2FtxSGFc0ep0KP7zqhGc09NObEAdHWX7sSCao76w%2BGG0IDWwanr8isfxfYsJe8Kb8Z%2F1RFbQ2HLzp0PZms%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eeccd24494f1f8a5b56b90b48ea7d84a969a9eadd8478aeea486e941ad98a4b4f02af0fea7c3b92ae9bcbda5b349bab1bbb8e56faaa8fedab47faaeae195d8618bb5888ace60f6bca6a9d2749bf19bd9c64bb1b39984ee61b8b5e195fb59859aadd1e87cf495a0d8f97bac99add1bc468dbe8ba2e7449588f994d249a3b1f9d7f621859900aac75db5bfa293bb63b1bab887dc798abbf8ace1349af1ffb3c56a93ee88adf97cf490968ef237e2a3'
          }
        }).catch(err => {
          console.log(err)
        })
      }
      if (result.data.code === -462) {
        if (this.messageBoxTimer === null) {
          const h = this.$createElement
          const copy = h('button', {
            class: 'uni-btn',
            style: {
              border: 'none',
              color: 'rgba(64,158,255,0.78)',
              'background-color': 'white',
              cursor: 'pointer'
            },
            attrs: {
              id: 'uni-btn',
              'data-clipboard-text': result.data.data.url
            },
            on: {
              click: this.copy
            }
          }, '点我复制链接')
          this.$msgbox({
            title: '警告',
            type: 'warning',
            message: h('p', null, [
              h('span', null, '抱歉，被安全检测了，游客请直接登录，已登录的请复制下方链接后打开手机浏览器。'),
              copy,
              h('div', {
                style: {
                  'font-size': '13px',
                  color: 'red'
                }
              }, '若不解除可能会影响使用哦(比如听不了歌/(ㄒoㄒ)/~~)')
            ]),
            confirmButtonText: this.$store.state.islogin ? '确认' : '立即登录',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm' && !this.$store.state.islogin) {
                this.$store.state.logining = true
                done()
              } else if (action === 'cancel') {
                done()
              } else {
                done()
              }
            }
          })
          this.messageBoxTimer = setTimeout(() => {
            this.messageBoxTimer = null
          }, 30000)
          return
        }
      }
      if (!result.data.data[0].url && this.currentMusic.id !== -1) {
        this.$notify.error({
          title: '失败',
          message: this.$store.state.currentMusic.name + '无法获取音频资源已自动跳过'
        })
        this.$store.state.playsongList.splice(this.$store.state.currentIndex, 1)
        if (this.$store.state.playsongList.length > 1) {
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
        if (this.playingMusicUrl === '') { return }
        this.currentTime = this.$refs.player.currentTime
        // 当前播放时长
        this.nowTime = this.timeFormat(this.currentTime)
        // 当前播放进度百分比
        this.currentPercent = Math.floor(this.currentTime / this.currentDuration * 100)
        // 如果当前处于播放状态且播放完毕 则跳转到下一首
        if (this.songStatus && this.nowTime === this.songTime) {
          if (this.playMethod === 3) {
            this.$refs.player.loop = true
            return
          }
          this.next()
        }
        this.timerDuration = setTimeout(() => {
          this.timerDuration = null
        }, 10)
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
    likeSong (id, like) {
      const item = this.currentMusic
      if (item.noCopyrightRcmd) {
        this.$notify.error({
          title: '错误',
          message: '网易云没版权（悲）'
        })
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
    mutechange () {
      if (this.isMute && this.volume !== 0) {
        this.isMute = false
      }
    },
    changeMethod () {
      this.$store.state.playMethod = (this.playMethod + 1) % 4
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
    },
    // 强烈建议学习
    move (e) {
      const odiv = e.target // 获取目标元素
      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetTop
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const left = e.clientX - disX
        const top = e.clientY - disY
        // 绑定元素位置到positionX和positionY上面
        // 移动当前元素
        odiv.style.left = left + 'px'
        odiv.style.top = top + 'px'
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
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
      // this.pause()
      await this.getMusicByid()
      // 如果刚打开，不允许播放
      if (!this.isFirstOpen) {
        this.play()
      } else { this.isFirstOpen = false }
    },
    Status (newVal) {
      if (newVal === false) { this.pause() }
    },
    songStatus (newVal) {
      this.$store.state.songStatus = newVal
    },
    vuexSongStatus (newVal) {
      if (newVal) {
        this.play()
      } else {
        this.pause()
      }
    },
    async playMethod (newVal, oldVal) {
      if (newVal === 2 && !this.$store.state.islogin) {
        // 如果没登陆就自动跳过登录模式
        this.$store.state.playMethod++
      } else if (newVal === 2) {
        const res = await this.$http.get('/playmode/intelligence/list', {
          params: {
            cookie: localStorage.getItem('cookie'),
            id: this.currentMusic.id,
            pid: this.$store.state.mylikeListid
          }
        })
        localStorage.setItem('playMethod', newVal)
        const xindongList = []
        xindongList.push(this.currentMusic)
        res.data.data.forEach(val => {
          xindongList.push(val.songInfo)
        })
        localStorage.setItem('normalHistoryList', JSON.stringify(this.$store.state.playsongList))
        this.$store.commit('PUSHXINDONGLIST', xindongList)
      } else if (oldVal === 2 && this.$store.state.islogin) {
        if (localStorage.getItem('normalHistoryList')) {
          this.$store.commit('UPDATESONGLIST', JSON.parse(localStorage.getItem('normalHistoryList')))
        }
      }
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
    },
    vuexSongStatus () {
      return this.$store.state.songStatus
    },
    isliked () {
      return this.$store.state.likesongids.some(val => {
        return val === this.currentMusic.id
      })
    },
    playMethodName () {
      switch (this.playMethod) {
        case 0: return '列表循环'
        case 1: return '随机播放'
        case 2: return '心动模式'
        case 3: return '单曲循环'
      }
      return 0
    },
    playMethod () {
      return this.$store.state.playMethod
    }
  },
  created () {
  },
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
    a{
      display: inline-block;
    }
  }
  .message-panel {
    width: 275px;
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
    .like-icon{
      position: absolute;
      left: 250px;
      top: 20px;
      i{
        font-size: 24px;
      }
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
      animation: slide 6s linear infinite;
    }

    .name {
      display: inline-block;
      color: #4c4c4c;
      white-space: nowrap;
      padding-left: 5px;
      a{
        display: inline-block;
      }
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
    position: relative;
    .control-button {
      height: 30px;
      line-height: 30px;
      width: 400px;
      text-align: center;
      padding-top: 7px;
      margin: 0 auto;
      position: relative;
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
      .play-method{
        height: 30px;
        display: inline-block;
        box-sizing: border-box;
        i{
          display: inline-block;
          height: 30px;
          font-size: 24px;
          line-height: 30px;
        }
      }
      .icon-cibiaoquanyi{
        font-size: 18px;
        font-weight: bolder;
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
    position: relative;
    z-index: auto;
    flex-shrink: 0;
    i {
      margin: 0 20px;
      font-size: 24px;
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
      left: 10px;
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
  .left{
    position: relative;
    .cover{
      //display: none;
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%,-50%);
      z-index: 9999;
      width: 0;
      height: 0;
      border-radius: 7px;
      /* 主要内容 */
      background: transparent;
      /* 模糊大小就是靠的blur这个函数中的数值大小 */
      backdrop-filter: blur(2px);
      i{
        text-align: center;
        display: none;
        color: white;
        font-weight:lighter;
      }
    }
  }
  .left:hover{
    .cover{
      width: 50px;
      height: 50px;
      i{
        display: inline-block;
        width: 50px;
        text-align: center;
        line-height: 50px;
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
  .drag{
    position: absolute;
    width: 500px;
    line-height: 50px;
    left: 50%;
    top: -60px;
    background-color: transparent;
    color: hotpink;
    font-weight: bolder;
    font-size: 24px;
    text-align: center;
    transition:background-color 1s;
    user-select: none;
    i{
      position: absolute;
      display: none;
      right: 5px;
      top: -12px;
      color: #3C3C3C;
    }
  }
  .drag:hover{
    background-color: rgba(255, 235, 205, 0.6);
    i{
      display: inline-block;
    }
  }

  @keyframes slide {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
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
  .iconfont:hover{
    color: red;
  }
}
</style>
