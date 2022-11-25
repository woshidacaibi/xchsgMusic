<template>
  <div class="Singer-mv-container">
    <RecommendMv v-if="mvsInfo.length !==0" :mvs="mvsInfo"></RecommendMv>
    <div v-else style="margin-top: 50px;text-align: center;font-size: 14px;color:#9f9f9f;">暂无MV，让我们期待一手。。。</div>
    <Loading :isload="isload" :cover-name="'Singermv'"/>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import RecommendMv from '@/components/RecommendRow/RecommendMv'
export default {
  name: 'SingerMV',
  props: ['singerId'],
  components: {
    RecommendMv,
    Loading
  },
  data () {
    return {
      mvsInfo: [],
      offset: 0,
      limit: 30,
      isBottom: false,
      isload: false,
      timer: null,
      view_panel: ''
    }
  },
  methods: {
    async getSingerMv () {
      const res = await this.$http.get('/artist/mv', {
        params: {
          id: this.singerId,
          limit: this.limit,
          offset: this.offset,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.mvsInfo.push(...res.data.mvs)
      this.isBottom = !res.data.hasMore
      this.offset += this.limit
      this.isload = true
    },
    bottomLoad () {
      if (this.isBottom) {
        this.view_panel.removeEventListener('scroll', this.bottomLoad)
        return
      }
      if (this.timer === null) {
        this.timer = setTimeout(() => {
          if (this.view_panel.clientHeight + this.view_panel.scrollTop + 30 >= this.view_panel.scrollHeight) {
            this.isload = false
            this.getSingerMv()
          }
          this.timer = null
        }, 1000)
      }
    }
  },
  created () {
    this.getSingerMv()
  },
  mounted () {
    const dc = document.getElementsByClassName('__panel')
    this.view_panel = dc[2]
    this.view_panel.addEventListener('scroll', this.bottomLoad)
  },
  destroyed () {
    this.view_panel.removeEventListener('scroll', this.bottomLoad)
  }
}
</script>

<style lang="less" scoped>

</style>
