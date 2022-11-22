<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <div class="swiper-slide" :key="item.imageUrl" v-for="item in banners">
        <div v-if="item.targetType===1" class="img-container" @click="playsong(item.targetId)">
          <img :src="item.imageUrl" alt="">
          <div class="type" :style="`background-color: ${color(item.titleColor)}`">{{item.typeTitle}}</div>
        </div>
        <router-link class="img-container" v-else-if="item.targetType===10" :to="{name:'AlbumPanel',query:{albumId:item.targetId}}">
          <img :src="item.imageUrl" alt="">
          <div class="type" :style="`background-color: ${color(item.titleColor)}`">{{item.typeTitle}}</div>
        </router-link>
        <router-link class="img-container" v-else-if="item.targetType===1000" :to="{name:'SongListPanel',query:{playlistId:item.targetId}}">
          <img :src="item.imageUrl" alt="">
          <div class="type" :style="`background-color: ${color(item.titleColor)}`">{{item.typeTitle}}</div>
        </router-link>
        <div class="img-container" v-else>
          <img :src="item.imageUrl" style="cursor: pointer;" alt="" @click="open(item.url)">
          <div class="type" :style="`background-color: ${color(item.titleColor)}`">{{item.typeTitle}}</div>
        </div>
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="button-prev" >
      <i class="iconfont icon-xiangzuojiantou"></i>
    </div>
    <div class="button-next">
      <i class="iconfont icon-xiangyoujiantou"></i>
    </div>
    <!-- 如果需要滚动条 -->
<!--    <div class="swiper-scrollbar"></div>-->
  </div>

</template>

<script>
import 'swiper/dist/js/swiper'
import 'swiper/dist/css/swiper.css'
import Swiper from 'swiper'
export default {
  name: 'BannerPanel',
  props: ['banners'],
  data () {
    return {
      swiper: {}
    }
  },
  methods: {
    playsong (id) {
      this.$http.get('/song/detail', { params: { ids: id } }).then(res => {
        this.$store.dispatch('pushsongtolist', res.data.songs[0])
      })
    },
    open (url) {
      window.open(url)
    },
    color (c) {
      switch (c) {
        case 'blue':
          return 'skyblue'
        case 'red':
          return 'pink'
      }
    }
  },
  mounted () {
    this.swiper = new Swiper('.swiper-container', {
      // direction: 'vertical', // 垂直切换选项
      // mousewheel: true, //滚轮
      initialSlide: this.$store.state.BannerIndex,
      autoplay: { // 自动开始
        delay: 5000, // 时间间隔
        disableOnInteraction: false //* 手动操作轮播图后不会暂停*
      },
      loop: true, // 循环模式选项
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        clickable: true // 分页器可以点击
      },
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.button-next',
        prevEl: '.button-prev'
      },
      on: {
        slideChangeTransitionEnd: () => {
          if (this.swiper[0]) {
            this.$store.state.BannerIndex = this.swiper[0].realIndex
          }
        }
      },
      effect: 'coverflow',
      slidesPerView: 3,
      centeredSlides: true,
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 50,
        modifier: 3,
        slideShadows: false
      }
    })
  }

}
</script>

<style lang="less" scoped>
  .swiper-container{
    position: absolute;
    width: 90%;
    height: 250px;
    max-width: 1350px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 10px;
    border-radius: 10px;
    .img-container{
      width: 500px;
      height: 200px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
      .type{
        position: absolute;
        right: 0;
        bottom: 0;
        width: 60px;
        text-align: center;
        height: 20px;
        z-index: 5;
        font-size: 13px;
        color: white;
        border-radius:10px 0 10px 0 ;
      }
    }
    img{
      display: block;
      width: 500px;
      height: 200px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 10px;
    }
    .button-next{
      display: none;
      width: 25px;
      height: 25px;
      background-color: rgba(159, 159, 159, 0.59);
      position: absolute;
      top:50%;
      transform: translateY(-50%);
      right: 10px;
      z-index: 1005;
      border-radius: 50%;
    }
    .button-prev{
      display: none;
      width: 25px;
      height: 25px;
      background-color: rgba(159, 159, 159, 0.59);
      position: absolute;
      top:50%;
      transform: translateY(-50%);
      left: 10px;
      z-index: 1005;
      border-radius: 50%;
    }
    i{
      color: #dcdcdc;
      padding-left: 5px;
      line-height: 25px;
      height: 25px;
      text-align: center;
    }
  }
  .swiper-container:hover .button-next{
    display: block;
  }
  .swiper-container:hover .button-prev{
    display: block;
  }
  .pagination{
    margin-top: 0px;
  }
</style>
