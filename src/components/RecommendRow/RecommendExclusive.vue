<template>
  <div class="recommend-row">
    <template v-if="isload">
      <div class="mv-container" :key="item.id" v-for="item in exclusiveRelease">
        <VideoSingleItem :type="'exclusive'" :videoInfo="item"/>
      </div>
    </template>
    <div class="exclusive-cover" style="height: 200px; width: 100%" v-show="!isload"></div>
  </div>
</template>

<script>
import VideoSingleItem from '@/components/RecommendSingleItem/VideoSingleItem'
export default {
  name: 'RecommendExclusive',
  components: {
    VideoSingleItem
  },
  data () {
    return {
      isload: false,
      exclusiveRelease: []
    }
  },
  methods: {
    async getEverydayData () {
      const exlusiveRelease = await this.$http.get('/personalized/privatecontent/list', {
        params: {
          limit: 3,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.exclusiveRelease = [...exlusiveRelease.data.result]
      this.isload = true
    },
    loading () {
      this.load = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'whitesmoke',
        target: document.querySelector('.exclusive-cover')
      })
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
.mv-container{
  flex: 0 0 33%;
}
</style>
