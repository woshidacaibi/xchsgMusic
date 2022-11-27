<template>
  <div class="lyrics-panel-container">
    <div ref="lyrics" class="inner-content">
      <div v-for="(item,index) in lyrics"
           :key="item.formatTime + item.content"
           @click="changeTime($el,item.time,index)"
           class="lyrics-row"
      >
        <span class="left-icon"><i class="iconfont icon-bofang1"></i></span>
        <span class="single-lyrics" style="height: 20px" v-if="item.content === ' '"></span>
        <span v-else class="single-lyrics">{{item.content}}</span>
        <span class="right-time">{{item.formatTime.split('.')[0]}}</span>
      </div>
      <div class="lyrics-row" v-if="lyrics.length === 0"><span class="single-lyrics">暂无歌词</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LyricsPanel',
  computed: {
    lyrics () {
      if (this.$store.state.currentLyrics === '') {
        return []
      } else {
        const res = this.$store.state.currentLyrics.split('[')
        const lyrics = []
        res.splice(0, 1)
        res.forEach(val => {
          const x = val.split(']')
          const t = x[0].split(':')
          x[1] = x[1].replace('\n', ' ')
          let ft = x[0].split('.')[0]
          let pt = Number(t[0]) * 60 + Number(t[1])
          if (ft === '99:00') {
            ft = '00:00'
            pt = 0
          }
          lyrics.push(
            {
              time: pt,
              content: x[1],
              formatTime: ft
            })
        })
        lyrics.forEach((val, index) => {
          if (val.content === ' ' && lyrics[index + 1]) {
            val.time = lyrics[index + 1].time
          }
        })
        return lyrics
      }
    }
  },
  watch: {
    lyrics () {
      this.currentTime = 0
      this.currentIndex = -1
      this.currentScrollTop = -50
      if (this.locateTimer) {
        clearTimeout(this.locateTimer)
        this.locateTimer = null
      }
      this.lyricsElements = document.getElementsByClassName('single-lyrics')
      this.$refs.lyrics.scrollTop = 0
    },
    currentIndex (newVal, oldVal) {
      if (this.lyricsElements[oldVal]) {
        this.lyricsElements[oldVal].classList.remove('current')
      }
      if (this.lyricsElements[newVal]) {
        this.lyricsElements[newVal].classList.add('current')
        this.$store.state.currentLyricsContent = this.lyrics[newVal].content
      }
      // if (!this.locateTimer) {
      //   let step = 1
      //   const stepSize = (this.currentScrollTop - this.$refs.lyrics.scrollTop) / 10
      //   const timer = setInterval(() => {
      //     this.$refs.lyrics.scrollTop = this.$refs.lyrics.scrollTop + stepSize
      //     step++
      //     if (step === 11) { clearInterval(timer) }
      //   }, 50)
      // }
    }
  },
  methods: {
    changeTime (e, time, index) {
      if (this.locateTimer) {
        clearTimeout(this.locateTimer)
        this.locateTimer = null
      }
      this.audio.currentTime = time
      this.currentIndex = index
    },
    recordTime () {
      if (this.audio.currentTime < this.currentTime) {
        // this.currentIndex = -1
        // this.currentScrollTop = -50
      }
      if (Math.abs(this.audio.currentTime - this.currentTime) > 1) {
        if (this.locateTimer) {
          clearTimeout(this.locateTimer)
          this.locateTimer = null
        }
        // this.currentIndex = -1
        // this.currentScrollTop = -50
      }
      const lastIndex = this.currentTime
      this.currentTime = this.audio.currentTime
      this.currentIndex = -1
      this.currentScrollTop = -50
      while (this.lyrics[this.currentIndex + 1] && this.lyrics[this.currentIndex + 1].time < this.currentTime && this.currentIndex + 1 < this.lyrics.length) {
        this.currentIndex++
        this.currentScrollTop += this.lyricsElements[this.currentIndex].offsetHeight
      }
      if (lastIndex !== this.currentIndex) {
        if (!this.locateTimer) {
          let step = 1
          const stepSize = (this.currentScrollTop - this.$refs.lyrics.scrollTop) / 10
          const timer = setInterval(() => {
            this.$refs.lyrics.scrollTop = this.$refs.lyrics.scrollTop + stepSize
            step++
            if (step === 11) { clearInterval(timer) }
          }, 50)
        }
      }
    },
    setLocateTimer () {
      // 发生滚动后，设定歌词跟踪失效，5s后恢复，防抖
      if (!this.locateTimer) {
        this.locateTimer = setTimeout(() => {
          this.locateTimer = null
        }, 3000)
      } else {
        clearTimeout(this.locateTimer)
        this.locateTimer = setTimeout(() => {
          this.locateTimer = null
        }, 3000)
      }
    }
  },
  data () {
    return {
      audio: null,
      currentTime: 0,
      currentIndex: -1,
      lyricsElements: [],
      locateTimer: null,
      currentScrollTop: -50
    }
  },
  mounted () {
    this.audio = document.getElementById('audio')
    this.audio.addEventListener('timeupdate', this.recordTime)
    this.lyricsElements = document.getElementsByClassName('single-lyrics')
    this.$refs.lyrics.addEventListener('scroll', this.setLocateTimer)
  },
  destroyed () {
    this.audio.removeListener('timeupdate', this.recordTime)
    this.$refs.lyrics.removeEventListener('scroll', this.setLocateTimer)
  }
}
</script>

<style lang="less" scoped>
  .lyrics-panel-container{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .inner-content{
    padding: 75px 0;
    overflow-y: scroll;
    position: absolute;
    height: 100%;
    top: 0;
    right: -17px;
    width: 100%;
    box-sizing: border-box;
    //overflow-x: hidden;
  }
  .lyrics-row{
    padding: 0 35px;
    position: relative;
    text-align: center;
    cursor: pointer;
    .single-lyrics{
      display: inline-block;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      transition: 0.5s;
      letter-spacing:3px
    }
    .current{
      font-weight: bolder;
      font-size: 18px;
      transition: 0.5s;
      letter-spacing: 2px;
    }
    .left-icon{
      display: none;
      position: absolute;
      left: 0;
      height: 30px;
      line-height: 30px;
      i{
        font-size: 13px;
      }
    }
    .right-time{
      display: none;
      position: absolute;
      right: 0;
      height: 30px;
      font-size: 13px;
      line-height: 30px;
    }
  }
  .lyrics-row:hover{
    .left-icon{
      display: inline-block;
    }
    .right-time{
      display: inline-block;
    }
  }
</style>
