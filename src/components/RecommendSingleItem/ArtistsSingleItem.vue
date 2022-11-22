<template>
  <div class="Artist-Single-container">
    <router-link :to="{path:'SingerPanel',query:{singerId:artist.id}}" class="content-box">
      <el-image class="cover-img" :src="artist.picUrl+'?param=160y160'" lazy>
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
    </router-link>
    <div class="message-bottom">
      <router-link :to="{path:'SingerPanel',query:{singerId:artist.id}}">{{artist.name}}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArtistsSingleItem',
  props: ['artist']
}
</script>

<style lang="less" scoped>
  .Artist-Single-container{
    width: 100%;
    position: relative;
    margin-bottom: 50px;
  }
  .Artist-Single-container:before{
    padding-top: 100%;
    content: "";
    display: block;
  }
  .content-box{
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .cover-img{
      margin: 5%;
      width: 90%;
      height: 90%;
      border-radius: 10px;
    }
  }
  .message-bottom{
    padding-top: 5px;
    margin-left: 5%;
    position: absolute;
    a{
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
    //bottom: -30px;
  }
</style>
