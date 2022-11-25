<template>
  <div class="NewSongsRecommendPanel-container">
    <template v-if="isload">
      <div class="NewSong-choice-header">
        <div v-show="currentPanel==='NewSong'" class="choice-type">
          <span
            ref="newSong"
            class="active"
            @click="typeChange('NewSong')"
          >新歌速递</span>
          <span
            ref="newAlbum"
            @click="typeChange('NewAlbum')">新碟上架</span>
        </div>
        <div v-show="currentPanel==='NewAlbum'" class="choice-type">
          <span ref="newSong"  @click="typeChange('NewSong')">新歌速递</span>
          <span ref="newAlbum" class="active" @click="typeChange('NewAlbum')">新碟上架</span>
        </div>
        <div class="choice-tag">
          <span v-for="item in areas" :key="item.areaId">
            <b @click="currentAreaId = item.areaId, currentAlbumAreaId = item.albumAreaId" class="active" v-if="item.areaId === currentAreaId">{{item.areaName}}</b>
            <b @click="currentAreaId = item.areaId, currentAlbumAreaId = item.albumAreaId" v-else>{{item.areaName}}</b>
          </span>
        </div>
      </div>
      <div class="NewSongPanel-body">
        <NewSongsView :areaId="currentAreaId" v-if="currentPanel === 'NewSong'"></NewSongsView>
        <SingerAlbum :areaId="currentAlbumAreaId" :type="'newAlbum'" v-if="currentPanel === 'NewAlbum'"></SingerAlbum>
      </div>
    </template>
<!--    <Loading :isload="isload" cover-name="NewSongsRecommendPanel"></Loading>-->
  </div>
</template>

<script>
import NewSongsView from '@/components/RecommendRow/NewSongsView'
import SingerAlbum from '@/components/SingerPanel/SingerAlbum'
export default {
  name: 'NewSongsRecommendPanel',
  components: {
    NewSongsView,
    SingerAlbum
  },
  data () {
    return {
      isload: true,
      areas: [
        { areaName: '全部', areaId: '0', albumAreaId: 'ALL' },
        { areaName: '华语', areaId: '7', albumAreaId: 'ZH' },
        { areaName: '欧美', areaId: '96', albumAreaId: 'EA' },
        { areaName: '日本', areaId: '8', albumAreaId: 'JP' },
        { areaName: '韩国', areaId: '16', albumAreaId: 'KR' }
      ],
      currentPanel: 'NewSong',
      currentAlbumAreaId: 'ALL',
      currentAreaId: '0'
    }
  },
  methods: {
    typeChange (typeName) {
      this.currentPanel = typeName
    }
  },
  mounted () {
    const dc = document.getElementsByClassName('__panel')
    dc[2].scrollTop = 0
  }
}
</script>

<style lang="less" scoped>
.NewSongsRecommendPanel-container{
  .NewSong-choice-header{
    margin: 0 25px;
    .choice-type{
      margin: 80px auto 30px;
      width: 200px;
      height: 29px;
      border-radius: 15px;
      //border: 1px solid #9f9f9f;
      span{
        margin: 0;
        display: inline-block;
        text-align: center;
        width: 100px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        cursor: pointer;
      }
      span:hover{
        background-color: #cccccc;
      }
      .active{
        background-color: #9f9f9f;
        color: white;
      }
      .active:hover{
        background-color: #9f9f9f;
        color: white;
      }
    }
    .choice-tag{
      span{
        padding: 0 30px;
        display: inline-block;
        cursor: pointer;
      }
      .active{
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .NewSongPanel-body{
    margin-top: 20px;
  }
}
</style>
