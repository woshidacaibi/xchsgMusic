<template>
  <div class="EverydayListPanel-container">
    <div class="EverydayListPanel-header">
      <i :class="`iconfont icon-rili${new Date().getDate()} date`"></i>
      <div class="introduce">
        <h2>每日歌曲推荐</h2>
        <p>根据你的音乐口味生成，每天6:00更新</p>
      </div>
    </div>
    <div class="operate-button">
      <button class="playAll" @click="updateSonglist"><i class="iconfont icon-bofang1"></i>播放全部</button>
    </div>
    <div class="list">
      <SongList :tracks="tracks" :islistload = "true" :type="'songList'"></SongList>
    </div>
  </div>
</template>

<script>
import SongList from '@/components/ListPanel/SongList'
export default {
  name: 'EverydayListPanel',
  data () {
    return {
      tracks: JSON.parse(this.$route.query.songs)
    }
  },
  components: {
    SongList
  },
  methods: {
    updateSonglist () {
      // 加入播放清单
      this.$store.commit('UPDATESONGLIST', this.tracks)
    }
  }
}
</script>

<style lang="less" scoped>
.EverydayListPanel-container{
}
.EverydayListPanel-header{
  padding: 20px 0 0 20px;
  overflow: hidden;
  i{
    float: left;
    display: block;
    font-size: 90px;
    color: #ec4141;
    cursor: default;
    margin-right: 20px;
  }
  .introduce{
    margin-top: 20px;
    float: left;
    height: 100px;
    h2{
      font-size: 22px;
    }
    p{
      font-size: 13px;
      color: #8c8c8c;
    }
  }
}
.operate-button{
  padding-left: 20px;
  padding-bottom: 20px;
  .playAll{
    background-color: #ec4141;
    color: ghostwhite;
    width: 120px;
    height: 30px;
    border-radius: 15px;
    border: none;
    i{
      padding-right: 5px;
    }
  }
  button{
    border: 1px solid #ccc;
    height: 40px;
    line-height: 20px;
    cursor: pointer;
    padding: 5px;
    margin-right: 10px;
    border-radius: 20px;
    min-width: 100px;
  }
}
.list{
  border-top: 1px solid #cccccc;
  width: 100%;
}
</style>
