<template>
  <div class="recommend-row">
    <template v-if="isload">
      <div class="newSong-container">
        <div style="height: 300px">
          <SingleHorizontalSong v-for="item in newSongList.slice(0,4)" :key="item.id" :song-message="item.song"/>
        </div>
      </div>
      <div class="newSong-container">
        <div style="height: 300px">
          <SingleHorizontalSong v-for="item in newSongList.slice(4,8)" :key="item.id" :song-message="item.song"/>
        </div>
      </div>
      <div class="newSong-container">
        <div style="height: 300px">
          <SingleHorizontalSong v-for="item in newSongList.slice(8,12)" :key="item.id" :song-message="item.song"/>
        </div>
      </div>
    </template>
    <div class="newsongs" style="height: 200px; width: 100%" v-show="!isload"></div>
  </div>
</template>

<script>
import SingleHorizontalSong from '@/components/RecommendSingleItem/SingleHorizontalSong'
export default {
  name: 'RecommendNewSongs',
  components: {
    SingleHorizontalSong
  },
  data () {
    return {
      isload: false,
      newSongList: []
    }
  },
  watch: {
    isload: {
      handler (newVal) {
        if (!newVal) {
          this.loading()
        } else {
          this.load.close()
        }
      }
    }
  },
  methods: {
    async getEverydayData () {
      const newSongList = await this.$http.get('/personalized/newsong?limit=12')
      // this.newSongList = [...newSongList.data.result]
      this.isload = true
      newSongList.data.result.forEach(val => {
        this.newSongList.push(val)
      })
    },
    loading () {
      this.load = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'whitesmoke',
        target: document.querySelector('.newsongs')
      })
    }
  },
  created () {
    this.isload = false
    this.getEverydayData()
  },
  mounted () {
    if (!this.isload) {
      this.loading()
    }
  }
}
</script>

<style lang="less" scoped>
.recommend-row {
  width: 100%;
  text-align: center;
  display: flex;
  align-content: flex-start;
  flex-flow: row wrap;
}
.newSong-container{
  flex: 0 0 33%;
}
</style>
