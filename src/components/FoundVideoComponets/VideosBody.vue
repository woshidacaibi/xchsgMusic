<template>
  <div class="Video-body-container">
    <template>
      <div class="recommend-row">
        <div class="mv-container" :key="item.id" v-for="item in videosInfo">
          <VideoSingleItem v-if="type === 'videos' " :type="'video'" :videoInfo="item"/>
          <VideoSingleItem v-else-if="type === 'mvs' " :type="'mv'" :videoInfo="item"/>
        </div>
      </div>
      <div v-if="isBottom">没有更多了</div>
      <div v-if="offset === 0 && isload">请求过多，被网易云服务器发现了呜呜呜/(ㄒoㄒ)/~~ 左上角选个标签吧</div>
    </template>
    <Loading :isload="isload" cover-name="Video-body" :text="'获取更多视频中'"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import VideoSingleItem from '@/components/RecommendSingleItem/VideoSingleItem'
export default {
  name: 'VideosBody',
  props: ['tagId', 'tags', 'type'],
  components: { Loading, VideoSingleItem },
  data () {
    return {
      videosInfo: [],
      offset: 0,
      isload: false,
      isBottom: false,
      timer: null
    }
  },
  watch: {
    tagId () {
      this.videosInfo = []
      this.offset = 0
      this.isload = false
      this.isBottom = false
      this.timer = null
      this.getVideosInfo()
    },
    tags () {
      this.videosInfo = []
      this.offset = 0
      this.isload = false
      this.isBottom = false
      this.timer = null
      this.getMvsInfo()
    },
    type () {
      this.videosInfo = []
      this.offset = 0
      this.isload = false
      this.isBottom = false
      this.timer = null
      this.getVideosInfo()
    }
  },
  methods: {
    async getVideosInfo () {
      let res
      this.timer = '1473'
      if (this.tagId === -1) {
        res = await this.$http.get('/video/timeline/all', {
          params: {
            offset: this.offset,
            cookie: localStorage.getItem('cookie')
          }
        })
      } else {
        res = await this.$http.get('/video/group', {
          params: {
            id: this.tagId,
            offset: this.offset,
            cookie: localStorage.getItem('cookie')
          }
        })
      }
      if (!res.data.hasmore) {
        this.isBottom = true
      }
      res.data.datas.forEach(val => {
        if (val.data.coverUrl) { this.videosInfo.push(val.data) }
      })
      this.offset += res.data.datas.length
      this.timer = null
      this.isload = true
    },
    async getMvsInfo () {
      this.timer = '1473'
      const res = await this.$http.get('/mv/all', {
        params: {
          area: this.tags.area,
          order: this.tags.order,
          type: this.tags.mvType,
          offset: this.offset,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.offset += res.data.data.length
      if (!res.data.hasMore) {
        this.isBottom = true
      }
      this.videosInfo.push(...res.data.data)
      this.timer = null
      this.isload = true
    },
    bottomLoad () {
      if (this.isBottom) {
        this.view_panel.removeEventListener('scroll', this.bottomLoad)
        return
      }
      if (this.timer === null) {
        if (this.view_panel.clientHeight + this.view_panel.scrollTop + 60 >= this.view_panel.scrollHeight) {
          this.isload = false
          if (this.type === 'videos') {
            this.getVideosInfo()
          } else if (this.type === 'mvs') {
            this.getMvsInfo()
          }
        }
        // this.timer = setTimeout(() => {
        //   this.timer = null
        // }, 10)
      }
    }
  },
  created () {
    if (this.type === 'videos') {
      this.getVideosInfo()
    } else if (this.type === 'mvs') {
      this.getMvsInfo()
    }
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
.Video-body-container{
  padding-bottom: 50px;
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
}
</style>
