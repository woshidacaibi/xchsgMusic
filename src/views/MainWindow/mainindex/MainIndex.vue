<template>
  <div class="mainindex-container">
    <el-menu
             :default-active="activeIndex"
             class="choice-panel"
             active-text-color="red"
             mode="horizontal"
             text-color="black"
    >
      <el-menu-item index="1">
        <router-link :to="{
          path:'/MainIndex/PersonRecommend',
          query:{...$route.query}
        }">个性推荐</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/PersonSongLists">歌单</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <span><router-link to="/RankingListPanel">排行榜</router-link></span>
      </el-menu-item>
      <el-menu-item index="4">
        <span><router-link to="/ArtistsRecommendPanel">歌手</router-link></span>
      </el-menu-item>
      <el-menu-item index="5">
        <span><router-link to="/NewSongsRecommendPanel">最新音乐</router-link></span>
      </el-menu-item>
    </el-menu>
    <div class="content-container">
      <keep-alive include="PersonRecommend">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainIndex',
  data () {
    return {
      ...this.$route.query,
      timer: null
    }
  },
  methods: {
    navResize () {
      if (!this.timer) {
        this.timer = setTimeout(() => {
          document.getElementsByClassName('choice-panel')[0].style.width = document.getElementsByClassName('mainindex-container')[0].clientWidth - 8 + 'px'
          this.timer = null
        }, 100)
      }
    },
    asideShow () {
      document.getElementsByClassName('choice-panel')[0].style.width = document.getElementsByClassName('mainindex-container')[0].clientWidth - 8 + 'px'
    },
    asideHide () {
      document.getElementsByClassName('choice-panel')[0].style.width = document.getElementsByClassName('mainindex-container')[0].clientWidth - 8 + 200 + 'px'
    }
  },
  computed: {
    activeIndex () {
      return this.$store.state.indexNavActiveIndex
    }
  },
  mounted () {
    document.getElementsByClassName('choice-panel')[0].style.width = document.getElementsByClassName('mainindex-container')[0].clientWidth - 8 + 'px'
    window.addEventListener('resize', this.navResize)
    document.getElementsByClassName(' show-button')[0].addEventListener('click', this.asideShow)
    document.getElementsByClassName(' hide-button')[0].addEventListener('click', this.asideHide)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.navResize)
    document.getElementsByClassName(' show-button')[0].removeEventListener('click', this.asideShow)
    document.getElementsByClassName(' hide-button')[0].removeEventListener('click', this.asideHide)
  }
}
</script>

<style lang="less" scoped>
  .mainindex-container{
    position: relative;
    .choice-panel{
      position: fixed;
      box-sizing: border-box;
      margin-right: 10px;
      top: 60px;
      height: 60px;
      //width: calc(100% - 10px);
      z-index: 3;
      background-color: whitesmoke;
    }
  }
  .content-container{
    margin-top: 60px;
  }
  //.router-link-exact-active{
  //  font-size: 18px;
  //  font-weight: bold;
  //}
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
