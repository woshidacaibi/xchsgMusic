<template>
  <div class="SingerSimilar-container">
    <RecommendSinger :singers="similarArtists"/>
    <div style="text-align: center;color: #9f9f9f" v-if="!$store.state.islogin" @click="$store.state.logining=true">登录查看相似歌手</div>
    <Loading :isload="isload" :coverName="'SingerSimilar'"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import RecommendSinger from '@/components/RecommendRow/RecommendSinger'
export default {
  name: 'SingerSimilar',
  props: ['singerId'],
  components: { Loading, RecommendSinger },
  data () {
    return {
      similarArtists: [],
      isload: false
    }
  },
  watch: {
    singerId () {
      this.isload = false
      this.getSimilarArtists()
      this.similarArtists = []
      this.toTop()
    }
  },
  methods: {
    async getSimilarArtists () {
      if (!localStorage.getItem('cookie')) {
        this.isload = true
        return
      }
      const res = await this.$http.get('/simi/artist', {
        params: {
          id: this.singerId,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.similarArtists.push(...res.data.artists)
      this.isload = true
    },
    toTop () {
      const dc = document.getElementsByClassName('__panel')
      dc[2].scrollTop = 0
    }
  },
  created () {
    this.getSimilarArtists()
    this.toTop()
  }
}
</script>

<style scoped>

</style>
