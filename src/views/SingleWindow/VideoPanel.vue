<template>
  <div class="VideoPanel-container">
    <template v-if="type === 'mv'">
      <div v-if="isload" class="wrapper" >
        <div class="left">
          <router-link to="/FoundVideoPanel/FoundMvs" class="turnBack" >
            <i class="iconfont icon-xiangzuojiantou"></i>
            <span class="type">MV详情</span>
          </router-link>
          <div class="player">
            <VideoPlayer :video-url="videoUrl"/>
          </div>
          <div class="message-container">
            <div class="author">
              <img :src="videoPlayMessage.artists[0].img1v1Url" alt="">
              <div class="singers">
            <span :key="artist.name" v-for="(artist,index) in videoPlayMessage.artists.slice(0,5)">
                <span v-if="artist.id === 0" class="nouse">{{ artist.name }}</span>
                <router-link :to="{path:'/SingerPanel',query:{singerId:artist.id}}" v-else>{{ artist.name }}</router-link>
                <span v-if="index< videoPlayMessage.artists.length-1"> / </span>
              </span>
                <span v-if="videoPlayMessage.artists.length>5">...</span>
              </div>
            </div>
            <div class="time-message">
              <span>发布于: {{videoPlayMessage.publishTime}}</span>
              <span>播放次数: {{playCount}}</span>
            </div>
            <div class="title">
            <span>{{videoPlayMessage.name}}
              <template v-if="videoPlayMessage.desc">
              <i v-show="showDesc" class="iconfont icon-xiangshang" @click="showDesc = !showDesc"></i>
              <i v-show="!showDesc" class="iconfont icon-xiangxia" @click="showDesc = !showDesc"></i>
              </template>
            </span>
            </div>
            <div v-show="showDesc&&videoPlayMessage.desc" class="desc">
              <p>{{videoPlayMessage.desc}}</p>
            </div>
            <div class="control-button">
              <el-button round v-if="!otherInfo.liked" @click="likeMv(1,1)" size="small">
                <i class="iconfont icon-dianzan1"></i>
                点赞({{otherInfo.likedCount}})</el-button>
              <el-button round v-if="otherInfo.liked" @click="likeMv(2,1)" size="small">
                <i class="iconfont icon-dianzan1" style="color: red"></i>
                已点赞({{otherInfo.likedCount}})</el-button>
              <el-button round v-if="!isSub" @click="subVideo(1,'mv')" size="small">
                <i class="iconfont icon-shoucang"></i>
                收藏({{videoPlayMessage.subCount}})</el-button>
              <el-button round v-if="isSub" @click="subVideo(2,'mv')" size="small">
                <i class="iconfont icon-yishoucang" style="color: #ec4141"></i>
                已收藏({{videoPlayMessage.subCount}})</el-button>
              <el-button round size="small" @click="download"><i class="iconfont icon-xiazai"></i>下载</el-button>
            </div>
            <CommentList :cid="videoId"
                         :count="videoPlayMessage.commentCount"
                         :limit="20"
                         :type="1"/>
          </div>
        </div>
        <div class="right">
          <h3>相关推荐</h3>
          <VideoHorizontalSingleItem :key="item.id" v-for="item in filterrelate.slice(0,5)" :type="'video'" :video-info="JSON.stringify(item.data)"></VideoHorizontalSingleItem>
          <div v-if="filterrelate.length === 0">没拿到小视频，服务器又抽风了（悲）</div>
        </div>
      </div>
    </template>
    <template v-if="type === 'video'">
      <div v-if="isload" class="wrapper" >
        <div class="left">
          <router-link to="/FoundVideoPanel/FoundVideos" class="turnBack" >
            <i class="iconfont icon-xiangzuojiantou"></i>
            <span class="type">视频详情</span>
          </router-link>
          <div class="player">
            <VideoPlayer :video-url="videoUrl"/>
          </div>
          <div class="message-container">
            <div class="author">
              <img :src="videoPlayMessage.creator.avatarUrl" alt="">
              <div class="singers">
                <router-link :to="{path:'/UserPanel',query:{UserId:videoPlayMessage.creator.userId}}">{{ videoPlayMessage.creator.nickname }}</router-link>
              </div>
            </div>
            <div class="time-message">
              <span>发布于: {{$time(videoPlayMessage.publishTime).format('YYYY-MM-DD')}}</span>
              <span>播放次数: {{playTime}}</span>
            </div>
            <div class="title">
            <span>{{videoPlayMessage.title}}
              <template v-if="videoPlayMessage.description">
              <i v-show="showDesc" class="iconfont icon-xiangshang" @click="showDesc = !showDesc"></i>
              <i v-show="!showDesc" class="iconfont icon-xiangxia" @click="showDesc = !showDesc"></i>
              </template>
            </span>
            </div>
            <div v-show="showDesc&&videoPlayMessage.description" class="desc">
              <p>{{videoPlayMessage.description}}</p>
            </div>
            <div class="control-button">
              <el-button round v-if="!otherInfo.liked" @click="likeMv(1,5)" size="small"><i class="iconfont icon-dianzan1"></i>点赞({{otherInfo.likedCount}})</el-button>
              <el-button round v-if="otherInfo.liked" @click="likeMv(2,5)" size="small"><i class="iconfont icon-dianzan1" style="color: red"></i> 已点赞({{otherInfo.likedCount}})</el-button>
              <el-button round v-if="!isSub" @click="subVideo(1,'video')" size="small">
                <i class="iconfont icon-shoucang"></i>
                收藏({{videoPlayMessage.subscribeCount}})</el-button>
              <el-button round v-if="isSub" @click="subVideo(2,'video')" size="small">
                <i class="iconfont icon-yishoucang" style="color: #ec4141"></i>
                已收藏({{videoPlayMessage.subscribeCount}})</el-button>
              <el-button round size="small"  @click="download" ><i class="iconfont icon-xiazai"></i>下载</el-button>
            </div>
            <CommentList :cid="videoId"
                         :count="videoPlayMessage.commentCount"
                         :limit="20"
                         :type="5"/>
          </div>
        </div>
        <div class="right">
          <h3>相关推荐</h3>
          <VideoHorizontalSingleItem :key="item.id" v-for="item in filterrelate.slice(0,5)" :type="'video'" :video-info="JSON.stringify(item.data)"></VideoHorizontalSingleItem>
          <div v-if="filterrelate.length === 0">没拿到小视频，服务器又抽风了（悲）</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer'
import CommentList from '@/components/ListPanel/commentList/CommentList'
import VideoHorizontalSingleItem from '@/components/RecommendSingleItem/VideoHorizontalSingleItem'
export default {
  name: 'VideoPanel',
  data () {
    return {
      videoPlayMessage: {},
      type: this.$route.query.type,
      videoUrl: '',
      showDesc: false,
      relateVideo: [],
      otherInfo: {},
      isload: false,
      // islike: false,
      isSub: false,
      load: {
        close () {}
      }
    }
  },
  methods: {
    async getMvMessage () {
      const res1 = await this.$http.get('/mv/url', {
        params: {
          id: this.videoId,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.videoUrl = res1.data.data.url
      const res2 = await this.$http.get('/mv/detail', {
        params:
          {
            mvid: this.videoId,
            cookie: localStorage.getItem('cookie'),
            timestamp: Date.now()
          }
      })
      this.videoPlayMessage = { ...res2.data.data }
      await this.getSimiVideo()
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
          if (val.type === 0 && this.videoId.toString() === val.vid.toString()) {
            this.isSub = true
          }
        })
      }
      await this.getLikeVideos()
      this.isload = true
    },
    async getSimiVideo () {
      const res = await this.$http.get('/video/timeline/recommend', { params: { cookie: localStorage.getItem('cookie'), offset: this.getRandom() } })
      this.relateVideo = [...res.data.datas]
    },
    async getVideoMessage () {
      const res1 = await this.$http.get('/video/url', {
        params: { id: this.videoId, cookie: localStorage.getItem('cookie') }
      })
      this.videoUrl = res1.data.urls[0].url
      const res2 = await this.$http.get('/video/detail', { params: { id: this.videoId, timestamp: Date.now(), cookie: localStorage.getItem('cookie') } })
      this.videoPlayMessage = { ...res2.data.data }
      await this.getSimiVideo()
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
          if (val.type === 1 && this.videoId.toString() === val.vid.toString()) {
            this.isSub = true
          }
        })
      }
      await this.getLikeVideos()
      this.isload = true
    },
    async getLikeVideos () {
      let infotype
      if (this.type === 'mv') { infotype = 'mvid' } else if (this.type === 'video') { infotype = 'vid' }
      const res = await this.$http.get(`/${this.type}/detail/info?${infotype}=${this.videoId}&cookie=${localStorage.getItem('cookie')}&timestamp`)
      this.otherInfo = { ...res.data }
    },
    likeMv (islike, type) {
      this.$http.get(`/resource/like?t=${islike}&type=${type}&id=${this.videoId}&cookie=${localStorage.getItem('cookie')}`).then(() => {
        this.otherInfo.liked = islike === 1
        islike === 1 ? this.otherInfo.likedCount += 1 : this.otherInfo.likedCount -= 1
      })
    },
    subVideo (isSub, type) {
      this.$http.get(`/${type}/sub`, {
        params: {
          mvid: this.videoId,
          t: isSub,
          cookie: localStorage.getItem('cookie'),
          timestamp: Date.now()
        }
      }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.isSub = isSub === 1
      }).catch(() => {
        this.$message({
          message: '收藏失败请稍后再试',
          type: 'error'
        })
      })
    },
    getRandom () {
      return Math.floor(Math.random() * 1000000)
    },
    turnBack () {
      window.history.back()
    },
    download () {
      open(this.videoUrl)
    },
    loading () {
      this.load = this.$loading({
        lock: true,
        text: '加载中，请稍等',
        spinner: 'el-icon-loading',
        background: 'whitesmoke',
        target: document.querySelector('.wrapper')
      })
    }
  },
  computed: {
    playCount () {
      return this.videoPlayMessage.playCount > 10000 ? Math.floor(this.videoPlayMessage.playCount / 10000) + '万' : this.videoPlayMessage.playCount
    },
    playTime () {
      return this.videoPlayMessage.playTime > 10000 ? Math.floor(this.videoPlayMessage.playTime / 10000) + '万' : this.videoPlayMessage.playTime
    },
    videoId () {
      return this.$route.query.videoId
    },
    filterrelate () {
      const res = this.relateVideo.filter(val => {
        return val.type === 1
      })
      return res
    }
  },
  watch: {
    videoId: {
      handler () {
        this.isload = false
        this.type = this.$route.query.type
        if (this.type === 'mv') { this.getMvMessage() } else if (this.type === 'video') { this.getVideoMessage() }
      },
      immediate: true
    },
    isload: {
      handler (newVal) {
        if (!newVal) {
          this.loading()
        } else {
          if (this.load !== {}) { this.load.close() }
        }
      }
    }
  },
  components: {
    VideoPlayer,
    CommentList,
    VideoHorizontalSingleItem
  },
  created () {
    this.isload = false
    if (this.type === 'mv') { this.getMvMessage() } else if (this.type === 'video') { this.getVideoMessage() }
  },
  mounted () {
    if (!this.isload) { this.loading() }
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  overflow: hidden;
}
.VideoPanel-container {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 50px;
  .turnBack {
    cursor: pointer;
    color: #343434;
    height: 30px;
    line-height: 30px;

    .iconfont {
      font-size: 15px;
      font-weight: bold;
    }

    .type {
      padding-left: 10px;
      font-weight: bolder;
    }
  }

  .left {
    float: left;
    width: 625px;

    .player {
      width: 625px;
      height: 370px;
    }

    .author {
      margin-top: 10px;
      height: 40px;
      line-height: 40px;
      .singers{
        padding-left: 10px;
        float: left;
        a{
          display: inline-block;
        }
      }
      img {
        float: left;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .time-message{
      margin-top: 10px;
      span{
        margin-right: 40px;
        color: #9f9f9f;
        font-size: 13px;
      }
    }
    .title{
      margin-top: 10px;
      span{
        width: 100%;
        margin-right: 10px;
        font-size: 22px;
        font-weight: bolder;
      }
    }
    .desc{
      margin-top: 20px;
      color: #343434;
      p{font-size: 13px}
    }
    .control-button{
      margin-top: 20px;
    }
  }

  .right {
    float: left;
    width: 300px;
    margin-left: 30px;
    h3{
      font-size: 16px;
      margin-bottom: 10px;
    }
  }

}
</style>
