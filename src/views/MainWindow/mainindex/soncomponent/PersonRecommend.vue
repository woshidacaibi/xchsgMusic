<template>
  <div style="display: flex; justify-content: center;padding-top: 10px">
    <div class="personal-recommend-container" v-if="isload">
      <div style="height: 250px">
        <BannerPanel :key="bannerKeys" :banners="banners"></BannerPanel>
      </div>
      <h3 style="padding-bottom: 5px">推荐歌单<i class="iconfont icon-xiangyoujiantou"/></h3>
      <RecommendList :type="'daily'"/>
      <h3 style="padding-bottom: 5px">独家放送<i class="iconfont icon-xiangyoujiantou"/></h3>
      <RecommendExclusive></RecommendExclusive>
      <h3 style="padding-bottom: 5px">最新音乐<i class="iconfont icon-xiangyoujiantou"/></h3>
      <RecommendNewSongs></RecommendNewSongs>
      <h3 style="padding-bottom: 5px">推荐MV<i class="iconfont icon-xiangyoujiantou"/></h3>
      <RecommendMv/>
    </div>
  </div>
</template>

<script>
import BannerPanel from '@/components/BannerPanel'
import RecommendList from '@/components/RecommendRow/RecommendList'
import RecommendExclusive from '@/components/RecommendRow/RecommendExclusive'
import RecommendNewSongs from '@/components/RecommendRow/RecommendNewSongs'
import RecommendMv from '@/components/RecommendRow/RecommendMv'
export default {
  name: 'PersonRecommend',
  components: {
    BannerPanel,
    RecommendList,
    RecommendExclusive,
    RecommendNewSongs,
    RecommendMv
  },
  data () {
    return {
      isload: false,
      banners: [],
      bannerKeys: 1,
      timer: null
    }
  },
  watch: {
    isload: {
      handler (newVal) {
        if (!newVal) {
          this.load = this.$loading({
            lock: true,
            text: '加载中，请稍等,长久为刷新请重试',
            spinner: 'el-icon-loading',
            // background: 'whitesmoke',
            target: document.querySelector('.personal-recommend-container')
          })
        } else {
          this.load.close()
        }
      },
      immediate: true
    }
  },
  methods: {
    async getEverydayData () {
      await this.$http.get('/banner').then(res => {
        this.banners = [...res.data.banners]
      })
      this.isload = true
    }
  },
  created () {
    this.isload = false
    this.getEverydayData()
  },
  mounted () {
    document.getElementsByClassName(' show-button')[0].addEventListener('click', () => {
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.bannerKeys++
          this.timer = null
        }, 750)
      }
    })
    document.getElementsByClassName(' hide-button')[0].addEventListener('click', () => {
      if (!this.timer) {
        this.timer = setTimeout(() => {
          this.bannerKeys++
          this.timer = null
        }, 750)
      }
    })
  },
  activated () {
    const dc = document.getElementsByClassName('__panel')
    dc[2].scrollTop = 0
  }
}
</script>

<style lang="less" scoped>
  .personal-recommend-container{
    width: 95%;
  }
  .banner-container{
    width: 95%;
  }
  .recommend-row{
    width: 100%;
    text-align: center;
    display: flex;
    align-content: flex-start;
    flex-flow: row wrap;
    .list-container{
      flex: 0 0 20%;
    }
    .mv-container{
      flex: 0 0 33%;
    }
    .newSong-container{
      flex: 0 0 33%;
    }
  }
</style>
