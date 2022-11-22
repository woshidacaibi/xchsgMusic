<template>
  <div class="person-song-lists-container">
    <router-link :to="{path:'/SongListPanel',query:{playlistId:cover.id}}" class="high-quality-header-container">
      <div class="img-background">
        <img :src="cover.coverImgUrl" alt="">
      </div>
      <div class="cover-content">
        <div  class="img-left">
          <img :src="cover.coverImgUrl" alt="">
        </div>
        <div class="message-right">
          <div class="hightag"><i class="iconfont icon-huangguan"></i>精品歌单</div>
          <div class="cover-name">
            {{cover.name}}</div>
          <div class="cover-desc">
            {{cover.copywriter}}
          </div>
        </div>
      </div>
    </router-link>
    <div class="recommend-container">
      <div class="recommend-header">
        <div class="recommend-tags" >
          <router-link :to="{path: '/PersonSongLists'}">
            <span class="active-tag" v-if="!tagName">全部</span>
            <span v-else>全部</span>
          </router-link>
          <router-link v-for="item in recostyle" :key="item.id" :to="{path: '/PersonSongLists',query:{tagName: item.name}}">
            <span class="active-tag" v-if="item.name === tagName">{{item.name}}</span>
            <span v-else>{{item.name}}</span>
          </router-link>
        </div>
      </div>
      <div class="recommend-content">
        <RecommendList :type="'simple'"></RecommendList>
      </div>
    </div>
    <div class="person-song-lists-container-loading" v-show="!isload"></div>
  </div>
</template>

<script>
import RecommendList from '@/components/RecommendRow/RecommendList'
export default {
  name: 'PersonSongLists',
  components: {
    RecommendList
  },
  data () {
    return {
      isload: false,
      load: {
        close () {}
      },
      cover: {},
      recostyle: [],
      showTagPanel: true
    }
  },
  methods: {
    loading () {
      this.load = this.$loading({
        lock: true,
        text: '加载中，请稍等',
        spinner: 'el-icon-loading',
        background: 'whitesmoke',
        target: document.querySelector('.person-song-lists-container-loading')
      })
    },
    toTop () {
      const dc = document.getElementsByClassName('__panel')
      dc[2].scrollTop = 0
    },
    async getMessage () {
      const recolist = await this.$http.get('/top/playlist/highquality', {
        params: {
          cookie: localStorage.getItem('cookie'),
          limit: 1,
          cat: this.tagName
        }
      })
      this.cover = recolist.data.playlists[0]
      const listStyle = await this.$http.get('/playlist/highquality/tags', {
        params: {
          cookie: localStorage.getItem('cookie')
        }
      })
      this.recostyle = [...listStyle.data.tags]
      this.isload = true
    }
  },
  watch: {
    isload: {
      handler (newVal) {
        if (!newVal) {
          this.loading()
        } else {
          if (this.load !== {}) { this.load.close() }
        }
      }
    },
    tagName () {
      this.isload = false
      this.getMessage()
    }
  },
  computed: {
    tagName () {
      return this.$route.query.tagName
    }
  },
  created () {
    this.getMessage()
  },
  mounted () {
    this.toTop()
    if (!this.isload) {
      this.loading()
    }
  }
}
</script>

<style lang="less" scoped>
.person-song-lists-container{
  padding: 5px 25px;
  .high-quality-header-container{
    height: 200px;
    border-radius: 15px;
    position: relative;
    .img-background{
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-radius: 15px;
      img{
        width: 100%;
      }
    }
    .cover-content{
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(114, 111, 111, 0.5);
      /* 模糊大小就是靠的blur这个函数中的数值大小 */
      backdrop-filter: blur(20px);
      border-radius: 15px;
      .img-left{
        float: left;
        img{
          border-radius: 10px;
          margin: 25px;
          width: 150px;
          height: 150px;
        }
      }
      .message-right{
        float: left;
        .hightag{
          margin-top: 50px;
          width: 110px;
          height: 30px;
          line-height: 30px;
          border-radius: 15px;
          color: rgb(231,170,90);
          border: 1px solid rgb(231,170,90);
          i{
            padding: 0 8px;
          }
        }
        .cover-name{
          padding-top: 10px;
          font-size: 16px;
          color: white;
        }
        .cover-desc{
          margin-top: 5px;
          font-size: 13px;
          color: #9f9f9f;
        }
      }
    }
  }
  .recommend-container{
    padding-top: 20px;
    .recommend-header{
      i{font-size: 13px}
      .recommend-tags{
        float: right;
        margin-bottom: 5px;
        a{display: inline-block;
          color: #9f9f9f;
          padding: 0 5px;
          font-size: 13px;
          span{
            padding: 0 5px;
            height: 20px;
            line-height: 20px;
            border-radius: 10px;
          }
          .active-tag{
            color: #ec4141;
            background-color: rgba(205, 92, 92, 0.19);
          }
        }
        a:hover{
          color: #3C3C3C;
        }
      }
    }
  }
  .img-background{
    width: 100%;
    height: 100%;
  }
}
</style>
