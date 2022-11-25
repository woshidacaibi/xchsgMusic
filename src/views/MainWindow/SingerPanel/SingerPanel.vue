<template>
  <div class="singer-panel-container">
    <template v-if="isload">
      <div class="singer-panel-header">
        <div class="img-left">
          <img v-if="singerInfo.user" :src="singerInfo.user.avatarUrl" alt="">
          <img v-else :src="singerInfo.artist.cover" alt="">
        </div>
        <div class="message-right">
          <h3>{{singerInfo.artist.name}}</h3>
          <div class="operate-button">
            <el-button @click="SubscribeArtist(2)" round v-if="isSubscribe" ><i class="iconfont icon-yishoucang" style="color: #ec4141"></i>已收藏</el-button>
            <el-button @click="SubscribeArtist(1)" round v-else><i class="iconfont icon-shoucang"></i>收藏</el-button>
            <router-link class="userLink" :to="{path:'/UserPanel',query:{UserId:singerInfo.user.userId}}" v-if="singerInfo.user" round ><i class="iconfont icon-yonghu"></i>个人主页</router-link>
          </div>
          <div class="singer-works-message">
            <span>单曲数:{{singerInfo.artist.musicSize}}</span>
            <span>专辑数:{{singerInfo.artist.albumSize}}</span>
            <span>MV数:{{singerInfo.artist.mvSize}}</span>
          </div>
        </div>
      </div>
      <div class="playlist-body">
        <div class="message-choice">
          <el-menu :default-active="active"
                   class="choice-panel"
                   mode="horizontal"
                   text-color="black"
                   @select="handleSelect">
            <el-menu-item index="1">
              <span>专辑</span>
            </el-menu-item>
            <el-menu-item index="2">
              <span>MV</span>
            </el-menu-item>
            <el-menu-item index="3">
              <span>歌手详情</span>
            </el-menu-item>
            <el-menu-item index="4">
              <span>相似歌手</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="message-panel">
            <SingerAlbum v-if="active === '1'" :singerId="singerId" :type="'singer'"></SingerAlbum>
            <SingerMV v-if="active === '2'" :singerId="singerId"></SingerMV>
            <SingerDescription v-if="active === '3'" :singer-id="singerId"></SingerDescription>
            <SingerSimilar v-if="active === '4'" :singer-id="singerId"></SingerSimilar>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import SingerAlbum from '@/components/SingerPanel/SingerAlbum'
import SingerMV from '@/components/SingerPanel/SingerMV'
import SingerDescription from '@/components/SingerPanel/SingerDescription'
import SingerSimilar from '@/components/SingerPanel/SingerSimilar'
export default {
  name: 'SingerPanel',
  components: { SingerAlbum, SingerMV, SingerDescription, SingerSimilar },
  data () {
    return {
      isload: false,
      load: {
        close () {}
      },
      singerInfo: {},
      active: '1'
    }
  },
  methods: {
    async getSingerDetail () {
      let status = true
      const res = await this.$http.get('/artist/detail', {
        params: {
          id: this.singerId,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.singerInfo = { ...res.data.data }
      const sub = await this.$http.get('/artist/sublist', {
        params: {
          cookie: localStorage.getItem('cookie'),
          timestamp: Date.now()
        }
      }).catch(() => {
        console.log('未登录')
        status = false
      })
      if (status) { this.$store.state.subArtist = [...sub.data.data] }
      this.isload = true
    },
    SubscribeArtist (t) {
      if (!this.$store.state.islogin) {
        this.$message('请登录后再收藏')
        return
      }
      const message = t === 1 ? '收藏成功（好耶）' : '取消收藏成功(不考虑下嘛)'
      console.log(t)
      this.$http.get('/artist/sub', {
        params: {
          id: this.singerId,
          t: t,
          cookie: localStorage.getItem('cookie')
          // timestamp: Date.now()
        }
      }).then((res) => {
        if (t === 1) {
          if (!this.$store.state.subArtist.some((val) => {
            return val.id.toString() === this.singerId.toString()
          })) {
            this.$store.state.subArtist.push(this.singerInfo.artist)
          }
        } else {
          const index = this.$store.state.subArtist.findIndex(val => {
            return val.id.toString() === this.singerInfo.toString()
          })
          this.$store.state.subArtist.splice(index, 1)
          this.$message({
            showClose: true,
            message: message,
            type: 'success',
            duration: 1000
          })
        }
      }).catch(() => {
        this.$message({
          message: '失败，请重试（应该是接口废了）',
          type: 'warning'
        }
        )
      })
    },
    handleSelect (key, keypath) {
      this.active = key.toString()
    },
    loading () {
      this.load = this.$loading({
        lock: true, // 同v-loading的修饰符
        text: '加载中，请稍等。。。\n(过长时间未响应请刷新)', // 加载文案
        background: 'whitesmoke', // 背景色
        spinner: 'el-icon-loading',
        target: document.querySelector('.main-container')// loading需要覆盖的DOM节点，默认为body
      })
    }
  },
  watch: {
    singerId (newVal) {
      this.getSingerDetail()
    },
    isload: {
      handler (newVal) {
        if (!newVal) {
          this.loading()
        } else { this.load.close() }
      }
    }
  },
  computed: {
    singerId () {
      return this.$route.query.singerId
    },
    isSubscribe () {
      return this.$store.state.subArtist.some((val) => {
        return val.id.toString() === this.singerId.toString()
      })
    }
  },
  created () {
    this.getSingerDetail()
  },
  mounted () {
    if (!this.isload) {
      this.loading()
    }
  }
}
</script>

<style lang="less" scoped>
.singer-panel-container
{
  .singer-panel-header{
    display: flex;
    margin-top: 25px;
    width: 100%;
    height: 250px;
    flex-shrink: 0;
    .img-left{
      img{
        width: 200px;
        height: 200px;
        border-radius: 15px;
        margin: 0 25px 25px 25px;
      }
    }
    .message-right{
      flex:1;
      h3{
        font-size: 22px;
        color: #3C3C3C;
        margin-bottom: 20px;
      }
      .singer-works-message{
        padding-top: 20px;
        span{
          font-size: 14px;
          margin-right: 10px;
        }
      }
    }
  }
  .icon-yonghu{
    font-size: 18px;
  }
  .playlist-body{
    width: 100%;
    .message-choice{
      .choice-panel{
        margin-left: 30px;
      }
    }
  }
  .userLink{
    display: inline-block;
    background-color: white;
    height: 40px;
    padding: 0 10px;
    line-height: 40px;
    border-radius: 20px;
    border: 1px solid #DCDFE6;
    font-size: 14px;
    font-weight: 500;
    margin-left: 20px;
  }
  .userLink:hover{
    background-color: rgba(198, 226, 255, 0.5);
    color: #409EFF;
  }
  .choice-panel{
    background-color: whitesmoke;
  }
}
.el-input-box{
  width: 200px;
  float: right;
  height: 35px;
  margin-right: 20px;
}
.el-menu--horizontal>.el-menu-item.is-active{
  border-bottom: 3px solid #ec4141;
}
.el-menu{
  background-color: whitesmoke;
  height:30px ;
}
.el-menu.el-menu--horizontal{
  border: none;
}
.el-menu--horizontal>.el-menu-item {
  height: 35px;
  padding: 0;
  margin: 0 20px;
  line-height: 35px;
}
.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
  background-color: whitesmoke;
}
</style>
