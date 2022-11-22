<template>
  <div class="video-container">
    <template v-if="isload">
      <div  class="video-tags-header">
        <div class="choice-row">
          <div class="choice-name">地区:</div>
          <div class="choice-tags">
            <b :key="index" v-for="(item,index) in areas" @click="currentArea = item">
              <span v-if="item === currentArea" class="CurrentChoice">{{item}}</span>
              <span v-else>{{item}}</span>
            </b>
          </div>
        </div>
        <div class="choice-row">
          <div class="choice-name">类型:</div>
          <div class="choice-tags">
            <b :key="index" v-for="(item,index) in mvTypes" @click="currentMvType = item">
              <span v-if="item === currentMvType" class="CurrentChoice">{{item}}</span>
              <span v-else>{{item}}</span>
            </b>
          </div>
        </div>
        <div class="choice-row">
          <div class="choice-name">排序:</div>
          <div class="choice-tags">
            <b :key="index" v-for="(item,index) in orders" @click="currentOrder = item">
              <span v-if="item === currentOrder" class="CurrentChoice">{{item}}</span>
              <span v-else>{{item}}</span>
            </b>
          </div>
        </div>
      </div>
      <div class="body">
        <VideosBody :tags="currentTags" type="mvs"></VideosBody>
      </div>
    </template>
    <Loading :isload="isload" cover-name="found-video" :text="'发现视频中'"></Loading>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import VideosBody from '@/components/FoundVideoComponets/VideosBody'
export default {
  name: 'FoundMvs',
  components: { Loading, VideosBody },
  data () {
    return {
      isload: true,
      tags: [],
      limit: 15,
      areas: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      orders: ['上升最快', '最热', '最新'],
      mvTypes: ['全部', '官方版', '原声', '现场版', '网易出品'],
      currentArea: '全部',
      currentOrder: '上升最快',
      currentMvType: '全部'
    }
  },
  computed: {
    currentTags () {
      return { area: this.currentArea, mvType: this.currentMvType, order: this.currentOrder }
    }
  },
  methods: {
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
.video-container{
  .video-tags-header{
    position: relative;
    margin-top: 20px;
    height: 50px;
    .choice-row{
      margin: 3px 0;
      overflow: hidden;
      position: relative;
    }
    .choice-name{
      float: left;
      width: 30px;
      margin: 2.5px 0;
      height: 20px;
      line-height: 21px;
      font-size: 13px;
      color: #3C3C3C;
    }
    .choice-tags{
      float: left;
      padding: 0 5px;
      margin: 2.5px 0;
      font-size: 13px;
      color: #3C3C3C;
      b{cursor: pointer;}
      span{
        height: 20px;
        line-height: 20px;
        padding: 0 10px;
        text-align: center;
        margin: 0 5px;
        display: inline-block;
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
  .body{
    margin-top: 50px;
  }
}
</style>
