<template>
  <div class="search-panel-container">
    <h3>{{count}}</h3>
    <el-menu
      :default-active="activeIndex"
      class="choice-panel"
      active-text-color="red"
      mode="horizontal"
      text-color="black"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        <span>单曲</span>
      </el-menu-item>
      <el-menu-item index="10">
        <span>专辑</span>
      </el-menu-item>
      <el-menu-item index="100">
        <span>歌手</span>
      </el-menu-item>
      <el-menu-item index="1000">
        <span>歌单</span>
      </el-menu-item>
      <el-menu-item index="1014">
        <span>视频</span>
      </el-menu-item>
    </el-menu>
    <div class="search-result-container">
      <SearchSong @passSearchCount="setCount" v-if="activeIndex === '1'"></SearchSong>
      <SearchAlbum @passSearchCount="setCount" v-if="activeIndex === '10'" ></SearchAlbum>
      <SearchSinger @passSearchCount="setCount" v-if="activeIndex === '100'"></SearchSinger>
      <SearchPlaylist @passSearchCount="setCount" v-if="activeIndex === '1000'"></SearchPlaylist>
      <SearchVideo @passSearchCount="setCount" v-if="activeIndex === '1014'"></SearchVideo>
    </div>
  </div>
</template>

<script>
import SearchSong from '@/components/SearchComponents/SearchSong'
import SearchAlbum from '@/components/SearchComponents/SearchAlbum'
import SearchSinger from '@/components/SearchComponents/SearchSinger'
import SearchPlaylist from '@/components/SearchComponents/SearchPlaylist'
import SearchVideo from '@/components/SearchComponents/SearchVideo'
export default {
  name: 'SearchPanel',
  components: {
    SearchPlaylist,
    SearchAlbum,
    SearchSong,
    SearchSinger,
    SearchVideo
  },
  data () {
    return {
      activeIndex: '1',
      count: '搜索中。。。'
    }
  },
  computed: {
    keyword () {
      return this.$route.query.keyword
    }
  },
  watch: {
    keyword (newVal) {
      this.sotreHistory(newVal)
      if (this.$route.query.type) { this.activeIndex = this.$route.query.type }
    }
  },
  methods: {
    handleSelect (key, keypath) {
      this.activeIndex = key.toString()
    },
    setCount (val) {
      this.count = val
    },
    sotreHistory (item) {
      let keywords
      if (!localStorage.getItem('historySearch')) {
        keywords = []
      } else {
        keywords = JSON.parse(localStorage.getItem('historySearch'))
      }
      const index = keywords.findIndex(val => {
        return val === item
      })
      if (index === -1) {
        keywords.unshift(item)
        localStorage.setItem('historySearch', JSON.stringify(keywords))
      } else {
        keywords.splice(index, 1)
        keywords.unshift(item)
        localStorage.setItem('historySearch', JSON.stringify(keywords))
      }
    }
  },
  created () {
    if (this.$route.query.type) { this.activeIndex = this.$route.query.type }
  },
  mounted () {
    this.sotreHistory(this.keyword)
  }
}
</script>

<style lang="less" scoped>
  .search-panel-container{
    margin: 20px 25px 0;
    h3{
      font-weight: 600;
    }
    .choice-panel{
      background-color: whitesmoke;
      span{
        padding: 20px;
      }
    }
  }
  .el-menu{
    background-color: whitesmoke;
    height:60px ;
  }
  .el-menu.el-menu--horizontal{
    border: none;
  }
  .el-menu--horizontal>.el-menu-item {
    height: 60px;
    padding: 0;
    line-height: 60px;
    a{
      padding: 0 20px;
    }
  }
  .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
    background-color: #bebebe;
  }
</style>
