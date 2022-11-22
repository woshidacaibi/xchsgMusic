<template>
  <div class="artists-recommend-panel-container">
    <template v-if="isload">
      <div class="choice-header">
        <div class="choice-row">
          <span class="choice-name">语种:</span>
          <router-link class="choice-tags" :to="{path:'/ArtistsRecommendPanel',query:{type:item.typeId,area:currentAreaId,initial:currentInitial}}"
                       v-for="item in types" :key="item.typeId">
            <span class="CurrentChoice" v-if="currentTypeId === item.typeId">{{item.typeName}}</span>
            <span class="NotCurrentChoice" v-else>{{item.typeName}}</span>
          </router-link>
        </div>
        <div class="choice-row">
          <span class="choice-name">分类:</span>
          <router-link class="choice-tags" :to="{path:'/ArtistsRecommendPanel',query:{type:currentTypeId,area:item.areaId,initial:currentInitial}}"
                       v-for="item in areas" :key="item.typeId">
            <span class="CurrentChoice" v-if="currentAreaId === item.areaId">{{item.areaName}}</span>
            <span class="NotCurrentChoice" v-else>{{item.areaName}}</span>
          </router-link>
        </div>
        <div class="choice-row">
          <span class="choice-name" style="height: 100px">筛选:</span>
          <router-link class="choice-tags" :to="{path:'/ArtistsRecommendPanel',query:{type:currentTypeId,area:currentAreaId,initial:item}}"
                       v-for="item in initials" :key="item">
            <span class="CurrentChoice" v-if="currentInitial === item">{{item === '-1'?'热门':item}}</span>
            <span class="NotCurrentChoice" v-else>{{item === '-1'?'热门':item}}</span>
          </router-link>
        </div>
      </div>
      <div class="singer-body">
        <RecommendSinger :singers="artists"></RecommendSinger>
      </div>
    </template>
    <Loading v-if="!isload" :isload="isload" :cover-name="'artists-recommend-panel'"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import RecommendSinger from '@/components/RecommendRow/RecommendSinger'
export default {
  name: 'ArtistsRecommendPanel',
  components: { Loading, RecommendSinger },
  data () {
    return {
      artists: [],
      isload: false,
      limit: 30,
      offset: 0,
      isBottom: false,
      timer: null,
      view_panel: '',
      types: [
        { typeId: '-1', typeName: '全部' },
        { typeId: '1', typeName: '男歌手' },
        { typeId: '2', typeName: '女歌手' },
        { typeId: '3', typeName: '乐队' }
      ],
      areas: [
        { areaId: '-1', areaName: '全部' },
        { areaId: '7', areaName: '华语' },
        { areaId: '96', areaName: '欧美' },
        { areaId: '8', areaName: '日本' },
        { areaId: '16', areaName: '韩国' },
        { areaId: '0', areaName: '其他' }
      ],
      initials: ['-1', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#']
    }
  },
  methods: {
    async getRecommendArtists () {
      const res = await this.$http.get('/artist/list', {
        params: {
          limit: this.limit,
          offset: this.offset,
          type: this.currentTypeId,
          area: this.currentAreaId,
          initial: this.currentInitial
        }
      })
      this.offset += this.limit
      this.isBottom = !res.data.more
      this.artists.push(...res.data.artists)
      this.isload = true
    },
    bottomLoad () {
      if (this.isBottom) {
        this.view_panel.removeEventListener('scroll', this.bottomLoad)
        return
      }
      if (this.timer === null) {
        if (this.view_panel.clientHeight + this.view_panel.scrollTop + 60 >= this.view_panel.scrollHeight) {
          this.getRecommendArtists()
        }
        this.timer = null
        this.timer = setTimeout(() => {
        }, 1000)
      }
    }
  },
  watch: {
    currentTypeId () {
      this.artists = []
      this.offset = 0
      this.isBottom = 0
      this.getRecommendArtists()
    },
    currentAreaId () {
      this.artists = []
      this.offset = 0
      this.isBottom = 0
      this.getRecommendArtists()
    },
    currentInitial () {
      this.artists = []
      this.offset = 0
      this.isBottom = 0
      this.getRecommendArtists()
    }
  },
  computed: {
    currentTypeId () {
      return this.$route.query.type ? this.$route.query.type.toString() : '-1'
    },
    currentAreaId () {
      return this.$route.query.area ? this.$route.query.area.toString() : '-1'
    },
    currentInitial () {
      return this.$route.query.initial ? this.$route.query.initial.toString() : '-1'
    }
  },
  created () {
    this.getRecommendArtists()
  },
  mounted () {
    const dc = document.getElementsByClassName('__panel')
    this.view_panel = dc[2]
    this.view_panel.addEventListener('scroll', this.bottomLoad)
  },
  destroyed () {
    this.view_panel.removeEventListener('scroll', this.bottomLoad)
  }
}
</script>

<style lang="less" scoped>
  .artists-recommend-panel-container{
    margin: 0 25px;
    padding-top: 10px;
    .choice-header{
      .choice-row{
        margin: 3px 0;
        overflow: hidden;
        position: relative;
      }
      .choice-name{
        float: left;
        width: 30px;
        height: 100%;
        font-size: 13px;
        color: #3C3C3C;
      }
      .choice-tags{
        float: left;
        padding: 0 5px;
        margin: 2.5px 0;
        border-right: 1px solid #d7d7d7;
        font-size: 13px;
        color: #3C3C3C;
        span{
          height: 15px;
          width: 50px;
          margin: 0 5px;
          display: inline-block;
          text-align: center;
          line-height: 15px;
          border-radius: 10px;
        }
        .CurrentChoice{
          background-color: rgba(255, 144, 144, 0.2);
          color: #ec4141;
        }
      }
      .choice-tags:last-child{
        border: none;
      }
    }
  }
</style>
