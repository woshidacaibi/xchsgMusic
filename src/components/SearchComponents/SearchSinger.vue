<template>
  <div class="search-singer-container">
    <template v-if="isload">
      <div v-if="singerNum === 0">抱歉未能找到与<span style="color: #0da5d6">{{keyword}}</span>相关内容</div>
      <div>
        <SearchItem v-for="item in singersInfo" :key="item.id" type="singer" :data="item"></SearchItem>
      </div>
      <el-pagination
        :page-size="this.limit"
        :pager-count="7"
        layout="prev, pager, next"
        :total="singerNum"
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
  name: 'SearchSinger',
  components: {
    Loading,
    SearchItem
  },
  data () {
    return {
      singersInfo: {},
      currentPage: 1,
      limit: 20,
      singerNum: 0,
      isload: false
    }
  },
  methods: {
    async getSearchAlbums () {
      const res = await this.$http.get('/cloudsearch', {
        params: {
          keywords: this.keyword,
          type: 100,
          limit: this.limit,
          offset: (this.currentPage - 1) * this.limit === 300 ? 299 : (this.currentPage - 1) * this.limit,
          cookie: localStorage.getItem('cookie')
        }
      })
      if (res.data.result.artistCount > 0) { this.singersInfo = [...res.data.result.artists] }
      this.singerNum = res.data.result.artistCount >= 300 ? 300 : res.data.result.artistCount
      this.$emit('passSearchCount', '找到' + this.singerNum + '位歌手')
      this.isload = true
      this.toTop()
    },
    handleCurrentChange (val) {
      this.isload = false
      this.currentPage = val
      this.getSearchAlbums()
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
      this.toTop()
    }
  }
}
</script>

<style scoped>
.search-album-container{
  margin-top: 20px;
}
</style>
