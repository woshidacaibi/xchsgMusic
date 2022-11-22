<template>
  <div class="subscribe-album-container" >
    <template v-if="isload">
      <el-divider content-position="left"><h3>收藏的专辑<span>({{MySubscribeAlbums.length}})</span></h3></el-divider>
      <div>
      <SearchItem v-for="item in MySubscribeAlbums" :key="item.id" :data="item" type="album"></SearchItem>
      </div>
    </template>
    <Loading :isload="isload" cover-name="subscribe-album" :text="'获取收藏专辑中。。。'"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import SearchItem from '@/components/SearchComponents/SearchItem'
export default {
  name: 'SubscribeAlbum',
  components: { SearchItem, Loading },
  data () {
    return {
      MySubscribeAlbums: [],
      isload: false
    }
  },
  methods: {
    async getMylikeList () {
      let hasmore = true
      let offset = 0
      while (hasmore) {
        const res1 = await this.$http.get('/album/sublist', {
          params: {
            cookie: localStorage.getItem('cookie'),
            offset: offset * 25,
            timestamp: Date.now()
          }
        })
        offset++
        hasmore = res1.data.hasMore
        this.MySubscribeAlbums.push(...res1.data.data)
      }
      console.log(this.MySubscribeAlbums)
      this.isload = true
    }
  },
  created () {
    this.getMylikeList()
  }
}
</script>

<style lang="less" scoped>
.mySubscribe-container{
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
