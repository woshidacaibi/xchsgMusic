<template>
  <div class="search-song-container">
    <template v-if="isload">
      <div v-if="songNum === 0">抱歉未能找到与<span style="color: #0da5d6">{{keyword}}</span>相关内容</div>
      <SongList
        v-else
        :type="'albumList'"
        :tracks="songsInfo"></SongList>
      <el-pagination
        :page-size="100"
        :pager-count="7"
        layout="prev, pager, next"
        :total="songNum"
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
import SongList from '@/components/ListPanel/SongList'
export default {
  name: 'SearchSong',
  components: {
    Loading,
    SongList
  },
  data () {
    return {
      songsInfo: {},
      currentPage: 1,
      limit: 100,
      songNum: 0,
      isload: false
    }
  },
  methods: {
    async getSearchSongs () {
      const res = await this.$http.get('/search', {
        params: {
          keywords: this.keyword,
          type: 1,
          limit: 100,
          offset: (this.currentPage - 1) * this.limit,
          cookie: localStorage.getItem('cookie')
        }
      })
      if (res.data.result.songCount !== 0) {
        this.songsInfo = [...res.data.result.songs]
      }
      this.songNum = res.data.result.songCount >= 300 ? 300 : res.data.result.songCount
      this.$emit('passSearchCount', '找到' + this.songNum + '首单曲')
      this.isload = true
      this.toTop()
    },
    handleCurrentChange (val) {
      this.isload = false
      this.currentPage = val
      this.getSearchSongs()
    },
    toTop () {
      const dc = document.getElementsByClassName('__panel')
      dc[2].scrollTop = 0
    }
  },
  created () {
    this.getSearchSongs()
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
      this.getSearchSongs()
      this.toTop()
    }
  }
}
</script>

<style lang="less" scoped>
.search-song-container{
  margin-top: 20px;
}
</style>
