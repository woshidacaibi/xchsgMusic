<template>
  <div class="subscribe-video-container" >
    <template v-if="isload">
      <el-divider content-position="left"><h3>收藏的视频<span>({{MySubscribeVideos.length}})</span></h3></el-divider>
      <div class="recommend-row">
        <div class="mv-container" :key="item.id" v-for="item in MySubscribeVideos">
          <VideoSingleItem v-if="item.type === 1" :type="'video'" :videoInfo="item"/>
          <VideoSingleItem v-else-if="item.type === 0" :type="'mv'" :videoInfo="item"/>
        </div>
      </div>
    </template>
    <Loading :isload="isload" cover-name="subscribe-video" :text="'获取收藏的视频中。。。'"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import VideoSingleItem from '@/components/RecommendSingleItem/VideoSingleItem'
export default {
  name: 'SubscribeVideos',
  components: { VideoSingleItem, Loading },
  data () {
    return {
      MySubscribeVideos: [],
      isload: false
    }
  },
  methods: {
    async getMylikeList () {
      let hasmore = true
      let offset = 0
      while (hasmore) {
        const res1 = await this.$http.get('/mv/sublist', {
          params: {
            cookie: localStorage.getItem('cookie'),
            offset: offset * 25,
            timestamp: Date.now()
          }
        })
        offset++
        hasmore = res1.data.hasMore
        res1.data.data.forEach(val => {
          if (val.type === 1) {
            this.MySubscribeVideos.push(val)
          } else {
            const mv = {
              cover: val.coverUrl,
              id: val.vid,
              duration: val.durationms,
              type: val.type,
              playCount: val.playTime,
              name: val.title
            }
            this.MySubscribeVideos.push(mv)
          }
        })
      }
      this.isload = true
    }
  },
  created () {
    this.getMylikeList()
  }
}
</script>

<style lang="less" scoped>
.subscribe-video-container{
  margin-top: 10px;
  h3{
    span{
      color: #9f9f9f;
      margin-left: 5px;
      font-weight: normal;
      font-size: 13px;
    }
  }
}
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
.el-divider__text{
  background-color: whitesmoke;
}
</style>
