<template>
  <div class="found-video-container">
    <div class="tagHeader">
      <el-menu
        :default-active="activeIndex"
        class="choice-panel"
        active-text-color="red"
        mode="horizontal"
        text-color="black"
      >
        <el-menu-item index="1">
          <router-link to="/FoundVideoPanel/FoundVideos">视频</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <span><router-link to="/FoundVideoPanel/FoundMvs">MV</router-link></span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FoundVideoPanel',
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    activeIndex () {
      if (this.$route.path === '/FoundVideoPanel/FoundVideos') {
        return '1'
      } else {
        return '2'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.found-video-container{
  padding: 0 25px;
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
