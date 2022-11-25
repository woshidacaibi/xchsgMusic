<template>
  <div class="subscribe-artist-container" >
    <template v-if="isload">
      <el-divider content-position="left"><h3>收藏的歌手<span>({{MySubscribeArtists.length}})</span></h3></el-divider>
      <div>
        <SearchItem v-for="item in MySubscribeArtists" :key="item.id" :data="item" type="singer"></SearchItem>
      </div>
    </template>
    <Loading :isload="isload" cover-name="subscribe-artist" :text="'获取关注歌手中。。。'"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import SearchItem from '@/components/SearchComponents/SearchItem'
export default {
  name: 'SubscribeArtists',
  components: { SearchItem, Loading },
  data () {
    return {
      MySubscribeArtists: [],
      isload: false
    }
  },
  methods: {
    async getMylikeList () {
      let hasmore = true
      let offset = 0
      while (hasmore) {
        const res1 = await this.$http.get('/artist/sublist', {
          params: {
            cookie: localStorage.getItem('cookie'),
            offset: offset * 25,
            timestamp: Date.now()
          }
        })
        offset++
        hasmore = res1.data.hasMore
        this.MySubscribeArtists.push(...res1.data.data)
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
.subscribe-artist-container{
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
.el-divider__text{
  background-color: whitesmoke;
}
</style>
