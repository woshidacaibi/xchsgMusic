<template>
  <div class="AlbumSingleItem-container">
    <div class="content-box">
      <router-link style="overflow: hidden" :to="{path:'/AlbumPanel',query:{albumId:albumInfo.id}}">
        <div class="cover" @mouseenter="iconshow=true" @mouseleave="iconshow=false">
<!--          <img :src="albumInfo.picUrl" alt="">-->
          <el-image class="cover-img" :src="albumInfo.picUrl+'?param=160y160'">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <transition name="icon">
            <div class="play-icon" @click.prevent="pushsongs" v-show="iconshow">
              <i class="iconfont icon-bofang1"></i>
            </div>
          </transition>
          </div>
      </router-link>
      <img class="back" src="@/assets/albumBackground.png">
      <router-link class="msg"  :to="{path:'/AlbumPanel',query:{albumId:albumInfo.id}}">
        <span class="name">{{albumInfo.name}}</span>
      </router-link>
      <router-link :to="{path:'/SingerPanel',query:{singerId:albumInfo.artists[0].id}}" v-if="showName" class="time">{{albumInfo.artists[0].name}}</router-link>
      <span v-else class="time">{{publishTime}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlbumSingleItem',
  props: ['albumInfo', 'showName'],
  data () {
    return { iconshow: false }
  },
  methods: {
    pushsongs () {
      this.$http.get('/album', {
        params: {
          id: this.albumInfo.id
        }
      }).then(res => {
        const songs = res.data.songs
        this.$store.commit('UPDATESONGLIST', songs)
      })
    }
  },
  computed: {
    publishTime () {
      return this.$time(this.albumInfo.publishTime).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="less" scoped>
.AlbumSingleItem-container{
  width: 100%;
  position: relative;
  margin-bottom: 60px;
}
.AlbumSingleItem-container:before {
  content: "";
  padding-top: 100%;
  display: block;
}
.content-box{
  position: absolute;
  top: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 10px;
  .cover{
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    z-index: 2;
    box-shadow: 10px 0 0 0 rgba(0, 0, 0, 0.2)
  }
  .back{
    transform: translateX(25%);
  }
  img{
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  .cover-img{
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  .msg{
    .name{
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      word-break: break-all;  // 注意这个文字多行很重要
      -webkit-box-orient: vertical;
      vertical-align: middle;
      text-align: left;
      line-height: 15px;
      font-size: 15px;
    }
  }
  .time{
    display: block;
    text-align: left;
    font-size: 13px;
    color: #9f9f9f;
  }
  .play-icon {
    position: absolute;
    z-index: 3;
    color: #ec4141;
    background-color: rgba(255, 255, 255, 0.68);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    line-height: 40px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);

    i {
      font-size: 20px;
      padding-left: 5px;
      line-height: 40px;
    }
  }
  .icon-enter-active {
    animation: fadeIn 0.3s linear;
  }

  .icon-leave-active {
    animation: fadeIn 0.3s linear reverse;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
