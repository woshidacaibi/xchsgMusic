<template>
<div class="mySubscribe-container">
  <div class="tagHeader">
    <el-menu
      :default-active="activeIndex"
      class="choice-panel"
      active-text-color="red"
      mode="horizontal"
      text-color="black"
    >
      <el-menu-item index="1">
        <router-link to="/MySubscribePanel/Albums">专辑</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <span><router-link to="/MySubscribePanel/Artists">歌手</router-link></span>
      </el-menu-item>
      <el-menu-item index="3">
        <span><router-link to="/MySubscribePanel/Videos">视频</router-link></span>
      </el-menu-item>
    </el-menu>
  </div>
  <div class="body">
    <router-view v-if="$store.state.islogin"></router-view>
    <div style="margin-top: 20px" v-else>请登陆后查看自己的收藏哦</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'MySubscribePanel',
  data () {
    return {
    }
  },
  computed: {
    activeIndex () {
      if (this.$route.path === '/MySubscribePanel/Albums') {
        return '1'
      } else if (this.$route.path === '/MySubscribePanel/Artists') {
        return '2'
      } else if (this.$route.path === '/MySubscribePanel/Videos') {
        return '3'
      } else return '1'
    }
  }
}
</script>

<style lang="less" scoped>
.mySubscribe-container{
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
