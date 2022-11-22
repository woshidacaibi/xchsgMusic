<template>
  <div class="search-album-container">
    <template v-if="isload">
      <div v-if="videoNum === 0">抱歉未能找到与<span style="color: #0da5d6">{{keyword}}</span>相关内容</div>
      <div>
        <RecommendMv :mvs="videosInfo" :type="'video'"></RecommendMv>
      </div>
      <el-pagination
        :page-size="this.limit"
        :pager-count="7"
        layout="prev, pager, next"
        :total="videoNum"
        :hide-on-single-page="true"
        style="text-align: center"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </template>
    <Loading :isload="isload" cover-name="search-song"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import RecommendMv from '@/components/RecommendRow/RecommendMv'
export default {
  name: 'SearchVideo',
  components: {
    Loading,
    RecommendMv
  },
  data () {
    return {
      videosInfo: {},
      currentPage: 1,
      limit: 24,
      videoNum: 0,
      isload: false
    }
  },
  methods: {
    async getSearchAlbums () {
      const res = await this.$http.get('/cloudsearch', {
        params: {
          keywords: this.keyword,
          type: 1014,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit === 300 ? 299 : (this.currentPage - 1) * this.limit
        }
      })
      if (res.data.result.videoCount > 0) { this.videosInfo = [...res.data.result.videos] } else {
        this.videosInfo = {}
      }
      this.videoNum = res.data.result.videoCount >= 300 ? 300 : res.data.result.videoCount
      this.$emit('passSearchCount', '找到' + this.videoNum + '个视频')
      this.isload = true
      this.toTop()
    },
    handleCurrentChange (val) {
      this.isload = false
      this.currentPage = val
      this.getSearchAlbums()
      this.toTop()
    },
    toTop () {
      const dc = document.getElementsByClassName('__panel')
      dc[2].scrollTop = 0
    }
  },
  created () {
    this.getSearchAlbums()
  },
  computed: {
    keyword () {
      return this.$route.query.keyword
    }
  },
  watch: {
    keyword () {
      this.isload = false
      this.currentPage = 1
      this.getSearchAlbums()
      this.videosInfo = {}
    }
  }
}
</script>

<style scoped>
.search-album-container{
  margin-top: 20px;
}
</style>
