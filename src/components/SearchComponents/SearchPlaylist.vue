<template>
  <div class="search-album-container">
    <template v-if="isload">
      <div v-if="playlistNum === 0">抱歉未能找到与<span style="color: #0da5d6">{{keyword}}</span>相关内容</div>
      <div v-else>
        <SearchItem v-for="item in playlistInfo" :key="item.id" type="playlist" :data="item"></SearchItem>
      </div>
      <el-pagination
        :page-size="this.limit"
        :pager-count="7"
        layout="prev, pager, next"
        :total="playlistNum"
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
import SearchItem from '@/components/SearchComponents/SearchItem'
export default {
  name: 'SearchPlaylist',
  components: {
    Loading,
    SearchItem
  },
  data () {
    return {
      playlistInfo: {},
      currentPage: 1,
      limit: 20,
      playlistNum: 0,
      isload: false
    }
  },
  methods: {
    async getSearchPlaylists () {
      const res = await this.$http.get('/cloudsearch', {
        params: {
          keywords: this.keyword,
          type: 1000,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit === 300 ? 299 : (this.currentPage - 1) * this.limit,
          cookie: localStorage.getItem('cookie')
        }
      })
      if (res.data.result.playlistCount > 0) { this.playlistInfo = [...res.data.result.playlists] } else {
        this.playlistInfo = {}
      }
      this.playlistNum = res.data.result.playlistCount >= 300 ? 300 : res.data.result.playlistCount
      this.$emit('passSearchCount', '找到' + this.playlistNum + '个歌单')
      this.isload = true
      this.toTop()
    },
    handleCurrentChange (val) {
      this.isload = false
      this.currentPage = val
      this.getSearchPlaylists()
    },
    toTop () {
      const dc = document.getElementsByClassName('__panel')
      dc[2].scrollTop = 0
    }
  },
  created () {
    this.getSearchPlaylists()
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
      this.getSearchPlaylists()
      this.playlistInfo = {}
      this.toTop()
    }
  }
}
</script>

<style scoped>
.search-album-container{
  margin-top: 20px;
}
.recommend-row {
  width: 100%;
  text-align: center;
  display: flex;
  align-content: flex-start;
  flex-flow: row wrap;
}
.list-container{
  flex: 0 0 20%;
}
.small{
  flex: 0 0 25%;
}
</style>
