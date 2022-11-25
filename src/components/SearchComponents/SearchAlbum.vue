<template>
  <div class="search-album-container">
    <template v-if="isload">
      <div v-if="albumNum === 0">抱歉未能找到与<span style="color: #0da5d6">{{keyword}}</span>相关内容</div>
      <div>
        <SearchItem v-for="item in albumsInfo" :key="item.id" type="album" :data="item"></SearchItem>
      </div>
      <el-pagination
        :page-size="this.limit"
        :pager-count="7"
        layout="prev, pager, next"
        :total="albumNum"
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
  name: 'SearchAlbum',
  components: {
    Loading,
    SearchItem
  },
  data () {
    return {
      albumsInfo: {},
      currentPage: 1,
      limit: 20,
      albumNum: 0,
      isload: false
    }
  },
  methods: {
    async getSearchAlbums () {
      const res = await this.$http.get('/cloudsearch', {
        params: {
          keywords: this.keyword,
          type: 10,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit === 300 ? 299 : (this.currentPage - 1) * this.limit,
          cookie: localStorage.getItem('cookie')
        }
      })
      if (res.data.result.albumCount > 0) {
        this.albumsInfo = [...res.data.result.albums]
      }
      this.albumNum = res.data.result.albumCount >= 300 ? 300 : res.data.result.albumCount
      this.$emit('passSearchCount', '找到' + this.albumNum + '张专辑')
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
      this.albumsInfo = {}
      this.getSearchAlbums()
    }
  }
}
</script>

<style scoped>
.search-album-container{
  margin-top: 20px;
}
</style>
