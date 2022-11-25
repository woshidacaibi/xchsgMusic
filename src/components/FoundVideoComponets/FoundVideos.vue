<template>
  <div class="video-container">
    <template v-if="isload">
    <div  class="video-tags-header">
      <div id="videoTagsLeft">
        <el-button @click="moreTagShow = !moreTagShow" style="float:left;" round>{{currentTagName}}
          <i style="font-size: 14px" class="iconfont icon-xiangyoujiantou"></i>
        </el-button>
        <div v-show="moreTagShow" class="more-tags">
          <vue-scroll :ops="$store.state.ops" style="width:400px;height:300px">
            <div>
              <span>
                <b class="active" v-if="'全部视频' === currentTagName">{{ '全部视频' }}</b>
                <b @click="currentTagIndex = -1" v-else>{{ '全部视频' }}</b>
              </span>
            </div>
            <h3>更多标签：</h3>
            <div class="content">
            <span :key="item.id" v-for="(item,index) in tags ">
            <b class="active" v-if="item.name === currentTagName">{{ item.name }}</b>
            <b @click="currentTagIndex = index" v-else>{{ item.name }}</b>
            </span>
            </div>
          </vue-scroll>
        </div>
      </div>
      <div class="firstTags">
        <span :key="item.id" v-for="(item,index) in tags.slice(0,5) ">
          <b class="active" v-if="item.name === currentTagName">{{ item.name }}</b>
          <b @click="currentTagIndex = index" v-else>{{ item.name }}</b>
        </span>
      </div>
    </div>
    <div class="body">
      <VideosBody :tag-id="currentTagId" type="videos"></VideosBody>
    </div>
    </template>
    <Loading :isload="isload" cover-name="found-video" :text="'发现视频中'"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import VideosBody from '@/components/FoundVideoComponets/VideosBody'
export default {
  name: 'FoundVideos',
  components: { Loading, VideosBody },
  data () {
    return {
      isload: false,
      tags: [],
      currentTagIndex: -1,
      moreTagShow: false
    }
  },
  computed: {
    currentTagName () {
      return this.currentTagIndex === -1 ? '全部视频' : this.tags[this.currentTagIndex].name
    },
    currentTagId () {
      return this.currentTagIndex === -1 ? -1 : this.tags[this.currentTagIndex].id
    }
  },
  methods: {
    async getTags () {
      const res = await this.$http.get('/video/group/list', {
        params: {
          cookie: localStorage.getItem('cookie')
        }
      })
      this.tags = [...res.data.data]
      this.isload = true
    },
    addListener (e) {
      if (!document.getElementById('videoTagsLeft').contains(e.target)) {
        this.moreTagShow = false
      }
    }
  },
  created () {
    this.getTags()
  },
  mounted () {
    window.addEventListener('click', this.addListener)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.addListener)
  }
}
</script>

<style lang="less" scoped>
.video-container{
  .video-tags-header{
    position: relative;
    margin-top: 20px;
    height: 50px;
    .firstTags{
      float: right;
      height: 40px;
      margin-top: 10px;
      span{
        display: inline-block;
        padding:0 10px;
        height: 20px;
        border-left: 1px solid #cccccc;
        cursor: pointer;
        width: 70px;
        text-align: center;
        b{
          height: 20px;
          width: 70px;
          line-height: 20px;
        }
      }
      span:first-child{
        border: none;
      }
    }
    .more-tags{
      position: absolute;
      top: 45px;
      width:400px;
      height:300px;
      background-color: white;
      z-index: 2001;
      h3{
        padding-left: 20px;
        font-size: 16px;
      }
      span{
        display: inline-block;
        margin:5px 10px;
        height: 20px;
        cursor: pointer;
        width: 80px;
        text-align: center;
        b{
          height: 20px;
          width: 70px;
          line-height: 20px;
        }
      }
    }
    .active{
      height: 20px;
      width: 80px;
      line-height: 20px;
      display: inline-block;
      border-radius:20px;
      background-color: rgba(255, 144, 144, 0.2);
      color: #ec4141;
    }
  }
  .body{
    margin-top: 50px;
  }
}
</style>
