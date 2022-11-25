<template>
  <div class="search-container" v-if="!isListEmpty">
    <vue-scroll v-if="!keyword" :ops="$store.state.ops">
      <HotSearch :hotList="hotList"></HotSearch>
    </vue-scroll>
    <vue-scroll v-else :ops="$store.state.ops">
      <div class="search-result">
        <div class="tips">
          <router-link :to="{path:'/SearchPanel',query:{keyword:keyword}}">搜"<span>{{keyword}}</span>"相关的结果></router-link>
        </div>
        <div v-if="searchList.songs" class="songs">
          <div class="border">
            <a><i class="iconfont icon-yinle1"></i><span>单曲</span></a>
          </div>
          <ul class="ul-list">
            <li @click="playClickSong(item)" v-for="item in searchList.songs" :key="item.id">
              <a ><span>{{item.name}} </span>-
                <span v-for="artist in item.artists"
                      :key="artist.id">
                  {{ artist.name }}
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div v-if="searchList.artists" class="songs">
          <div class="border">
            <a href="#"><i class="iconfont icon-zuozhe"></i><span>歌手</span></a>
          </div>
          <ul class="ul-list">
            <li v-for="item in searchList.artists" :key="item.id">
              <router-link :to="{path:'SingerPanel',query:{singerId:item.id}}">{{item.name}}
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="searchList.albums" class="songs">
          <div class="border">
            <a href="#"><i class="iconfont icon-zhuanji"></i><span>专辑</span></a>
          </div>
          <ul class="ul-list">
            <li v-for="item in searchList.albums" :key="item.id">
              <router-link :to="{path:'AlbumPanel',query: {albumId:item.id}}">{{item.name}}
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="searchList.playlists" class="songs">
          <div class="border">
            <a href="#"><i class="iconfont icon-gedan"></i><span>歌单</span></a>
          </div>
          <ul class="ul-list">
            <li v-for="item in searchList.playlists" :key="item.id">
              <router-link :to="{path:'/SongListPanel',query:{playlistId:item.ld}}">{{item.name}}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import HotSearch from '@/components/Headers/Search/hotSearch'
export default {
  name: 'SearchBox',
  components: { HotSearch },
  props: ['keyword', 'hotList'],
  data () {
    return {
      timer: null,
      searchList: {}
    }
  },
  watch: {
    // 监听keyword变化，防抖 获得搜索结果
    keyword: {
      handler: function (newVal, oldVal) {
        clearTimeout(this.timer)
        this.timer = setTimeout(async () => {
          const res = await this.$http.get('/search/suggest', {
            params: {
              keywords: this.keyword,
              cookie: localStorage.getItem('cookie')
            }
          })
          this.searchList = { ...res.data.result }
        }, 500)
      },
      immediate: true
    }
  },
  methods: {
    async playClickSong (item) {
      const res = await this.$http.get('/song/detail', {
        params: {
          ids: item.id
        }
      })
      if (res.data.songs[0].noCopyrightRcmd !== null) {
        this.noUseWarn()
      } else {
        this.$store.dispatch('pushsongtolist', res.data.songs[0])
      }
    }
  },
  mounted () {

  },
  computed: {
    isListEmpty () {
      return JSON.stringify(this.searchList) === '{}' && this.keyword !== ''
    }
  }
}
</script>

<style lang="less" scoped>

  .search-result{
    .ul-list a{
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      word-break: break-all; // 注意这个文字多行很重要
      -webkit-box-orient: vertical;
      vertical-align: middle;
    }
    vertical-align: top;
    .tips{
      padding-left: 10px;
      height: 20px;
      font-size: 12px;
      span{
        color: #0da5d6;
      }
    }
    .border{
      padding-left: 10px;
      font-size: 13px;
      height: 30px;
      line-height: 30px;
      background-color: #f5f5f7;
      a{
        display: block;
      }
      i{
        padding-right: 8px;
      }
    }
    .ul-list{
      li{
        padding-left: 30px;
        height: 30px;
        font-size: 12px;
        line-height: 30px;
      }
      li:hover{
        background-color: #f2f2f2;
      }
    }
  }
  .search-container{
    width: 350px;
    height: 400px;
    padding: 5px 0;
    background-color: #fff;
    border-radius: 15px;
  }
</style>
