<template>
  <div class="official-rankList-single-item-container">
    <template v-if="isload">
      <div class="img-left">
        <router-link :to="{path:'/SongListPanel',query:{playlistId:PlaylistInfo.id}}">
          <img :src="PlaylistInfo.coverImgUrl+'?param=300y300'">
        </router-link>
      </div>
      <div class="playlist-right">
        <SongList type="rankList" :tracks="partTracks"></SongList>
        <router-link style="font-size: 13px" :to="{path:'/SongListPanel',query:{playlistId:PlaylistInfo.id}}">
          查看全部<i style="font-size: 13px" class="iconfont icon-xiangyoujiantou"></i>
        </router-link>
      </div>
    </template>
    <div style="height: 200px" v-else></div>
  </div>
</template>

<script>
import SongList from '@/components/ListPanel/SongList'
export default {
  name: 'OfficialRankListSingleItem',
  props: ['PlaylistInfo'],
  components: {
    SongList
  },
  data () {
    return {
      isload: false,
      partTracks: []
    }
  },
  methods: {
    async getPartTracks () {
      const res = await this.$http.get('/playlist/track/all', {
        params: {
          id: this.PlaylistInfo.id,
          limit: 5,
          offset: 0
        }
      })
      this.partTracks = [...res.data.songs]
      this.isload = true
    }
  },
  created () {
    this.getPartTracks()
  }
}
</script>

<style lang="less" scoped>
  .official-rankList-single-item-container{
    display: flex;
    .img-left{
      height: 150px;
      flex-shrink: 0;
      a{width: 100%;height: 100%}
      img{
        margin: 25px;
        height: 100%;
        border-radius: 15px;
      }
    }
    .playlist-right{
      flex: 1;
      margin: 25px 25px 25px 0;
    }
  }
</style>
