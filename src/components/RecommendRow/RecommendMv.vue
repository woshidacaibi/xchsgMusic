<template>
  <div class="recommend-row">
    <template v-if="isload" >
      <template v-if="!mvs">
        <div class="mv-container" :key="item.id" v-for="item in recomv.slice(0,3)">
          <VideoSingleItem :type="'mv'" :videoInfo="item"/>
        </div>
      </template>
      <template v-else>
        <div class="mv-container" :key="item.id" v-for="item in recomv">
          <VideoSingleItem v-if="!type" :type="'singer'" :videoInfo="item"/>
          <VideoSingleItem v-else-if="type" :type="'video'" :videoInfo="item"/>
        </div>
      </template>
    </template>
    <div class="recommendMv-cover" style="height: 200px; width: 100%" v-show="!isload"></div>
  </div>
</template>

<script>
import VideoSingleItem from '@/components/RecommendSingleItem/VideoSingleItem'
export default {
  name: 'RecommendMv',
  props: ['mvs', 'type'],
  components: {
    VideoSingleItem
  },
  data () {
    return {
      isload: false,
      recomv: []
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
    },
    mvs: {
      handler (newVal) {
        this.recomv = newVal
        this.isload = true
      },
      immediate: true
    }
  },
  methods: {
    async getEverydayData () {
      const recomv = await this.$http.get('/personalized/mv', { params: { cookie: localStorage.getItem('cookie') } })
      this.recomv = [...recomv.data.result]
      this.isload = true
    },
    loading () {
      this.load = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'whitesmoke',
        target: document.querySelector('.recommendMv-cover')
      })
    }
  },
  created () {
    this.isload = false
    if (!this.mvs) { this.getEverydayData() } else { this.isload = true }
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

.mv-container{
  flex: 0 0 33%;
}
</style>
