<template>
  <div class="NewSongView-container">
    <template v-if="isload">
      <div class="play-all">
        <el-button @click="playAll" round><i class="iconfont icon-bofang"></i>播放全部</el-button>
      </div>
      <div class="content-box">
        <SingleHorizontalSongT2 v-for="(item,index) in newSongs" :key="item.id" :songInfo="item" :index="index+1"></SingleHorizontalSongT2>
      </div>
    </template>
    <Loading :isload="isload" cover-name="NewSongView"></Loading>
  </div>
</template>

<script>
import SingleHorizontalSongT2 from '@/components/RecommendSingleItem/SingleHorizontalSongT2'
import Loading from '@/components/Loading'
export default {
  name: 'NewSongsView',
  props: ['areaId'],
  components: {
    Loading,
    SingleHorizontalSongT2
  },
  data () {
    return {
      isload: false,
      newSongs: []
    }
  },
  watch: {
    areaId () {
      this.isload = false
      this.getNewSongs()
    }
  },
  methods: {
    async getNewSongs () {
      const res = await this.$http.get(`/top/song?type=${this.areaId}`, { params: { cookie: localStorage.getItem('cookie') } })
      this.newSongs = [...res.data.data]
      this.isload = true
    },
    async playAll () {
      const idArr = []
      this.newSongs.forEach(val => {
        idArr.push(val.id)
      })
      const idStr = idArr.join(',')
      const res = await this.$http.get('/song/detail', {
        params: {
          ids: idStr,
          cookie: localStorage.getItem('cookie')
        }
      })
      const tracks = [...res.data.songs]
      this.$store.commit('UPDATESONGLIST', tracks)
    }
  },
  created () {
    this.getNewSongs()
  }
}
</script>

<style scoped>
.NewSongView-container{
  position: relative;
}
.play-all{
  position: absolute;
  right: 20px;
  top: -60px;
}
</style>
